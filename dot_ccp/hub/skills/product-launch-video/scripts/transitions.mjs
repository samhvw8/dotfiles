#!/usr/bin/env node
// transitions.mjs — inter-scene transition injector behind one subcommand dispatcher.
//
//   inject  — wrapper overlap + GSAP stamp on the index.html clip wrappers
//   verify  — deterministic gate over the injector's output
//
// Each subcommand reads its args from process.argv AFTER the subcommand token
// (i.e. process.argv.slice(3)):
//   node transitions.mjs inject --group-spec ./group_spec.json --hyperframes .
//   node transitions.mjs verify --group-spec ./group_spec.json --index ./index.html

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { transitionsByName } from "./lib/transition-registry.mjs";
import { readDims } from "./lib/dimensions.mjs";

// ===========================================================================
// inject ← inject-transitions.mjs
async function runInject(argv) {
  const flag = (name, def) => {
    const i = argv.indexOf(`--${name}`);
    return i >= 0 && i + 1 < argv.length ? argv[i + 1] : def;
  };
  function die(msg) {
    console.error(`✗ inject-transitions.mjs: ${msg}`);
    process.exit(1);
  }

  const groupSpecPath = resolve(flag("group-spec", "./group_spec.json"));
  const hyperframesDir = resolve(flag("hyperframes", "."));
  const indexPath = join(hyperframesDir, "index.html");

  if (!existsSync(groupSpecPath)) die(`group_spec.json not found at ${groupSpecPath}`);
  if (!existsSync(indexPath))
    die(`index.html not found at ${indexPath} — run assemble-index.mjs first`);

  let spec;
  try {
    spec = JSON.parse(readFileSync(groupSpecPath, "utf8"));
  } catch (e) {
    die(`group_spec.json parse: ${e.message}`);
  }

  // Slide transitions push a wrapper fully off-canvas, so the travel distance is
  // the canvas dimension along the slide axis (read from group_spec; landscape
  // default for pre-dims specs).
  const { width: CANVAS_W, height: CANVAS_H } = readDims(spec);

  const transitions = Array.isArray(spec.transitions) ? spec.transitions : [];
  const injectable = transitions.filter((t) => t && t.type);

  let html = readFileSync(indexPath, "utf8");

  if (injectable.length === 0) {
    console.log(`✓ inject-transitions: 0 transitions to inject — index.html unchanged`);
    process.exit(0);
  }

  let txByName;
  try {
    txByName = transitionsByName();
  } catch (e) {
    die(`transition registry: ${e.message}`);
  }

  // The authoritative SCENE id set — from group_spec.groups[].scene_ids. The
  // captions / voice / bgm / sfx clips also use id="el-…" + (for captions)
  // data-composition-src, but they are NOT scenes: they must keep their own tracks
  // (10/11/12/20+) and must NOT join the scene ping-pong. Driving off the known
  // scene list (not a data-composition-src regex) is what keeps captions out.
  const sceneIds = new Set();
  for (const g of spec.groups || []) for (const sid of g.scene_ids || []) sceneIds.add(sid);
  if (sceneIds.size === 0)
    die(`group_spec.groups[].scene_ids is empty — cannot identify scene clips`);

  // ---------- parse SCENE clip wrappers out of index.html ----------
  // assemble-index emits each scene clip as a stable multi-line block:
  //   <div\n  id="el-<sid>"\n  data-composition-id=...\n  data-composition-src=...\n
  //   data-start="X"\n  data-duration="Y"\n  data-track-index="0"\n ...></div>
  // We only keep clips whose sid is a known scene (sceneIds) — captions (el-captions)
  // and audio (el-<sid>-voice) are excluded. Play order comes from data-start ascending.
  const clipRe = /<div\s+id="el-([A-Za-z0-9_]+)"([\s\S]*?)><\/div>/g;
  const clips = new Map(); // sid -> { sid, start, duration, track, block }
  let cm;
  while ((cm = clipRe.exec(html)) !== null) {
    const sid = cm[1];
    if (!sceneIds.has(sid)) continue; // skip captions / voice / bgm / sfx
    const block = cm[0];
    const attrs = cm[2];
    const num = (re) => {
      const m = attrs.match(re);
      return m ? Number(m[1]) : null;
    };
    const start = num(/data-start="([\d.]+)"/);
    const duration = num(/data-duration="([\d.]+)"/);
    const track = num(/data-track-index="(\d+)"/);
    if (start == null || duration == null) {
      die(
        `scene clip #el-${sid} missing data-start/data-duration — assemble-index output malformed`,
      );
    }
    clips.set(sid, { sid, start, duration, track: track ?? 0, block });
  }

  if (clips.size === 0)
    die(`no scene clip wrappers found in index.html for scene_ids: ${[...sceneIds].join(", ")}`);

  // Completeness guard against assemble-index emit drift. Every "HF-SCENE-CLIP <sid>"
  // marker (emitted by assemble-index.mjs immediately before each scene <div>) whose
  // sid is a known scene MUST have been parsed by clipRe above. If the <div
  // id="el-<sid>"> emit shape changes and the regex stops matching, this fails loudly
  // here instead of silently dropping a scene from the ping-pong track reassignment
  // below (which would surface much later as overlapping_clips_same_track). Older
  // index.html without the marker → markerSids empty → no-op (backward compatible).
  // Keep the marker string in lockstep with assemble-index.mjs.
  const markerSids = [...html.matchAll(/<!--\s*HF-SCENE-CLIP\s+([A-Za-z0-9_]+)\b/g)]
    .map((m) => m[1])
    .filter((sid) => sceneIds.has(sid));
  const missedSids = markerSids.filter((sid) => !clips.has(sid));
  if (missedSids.length)
    die(
      `scene-clip parse drift: assemble-index marked ${markerSids.length} scene clip(s) but the parser missed ${missedSids.join(", ")} — the <div id="el-<sid>"> emit format changed; resync transitions.mjs with assemble-index.mjs`,
    );

  // ---------- apply overlaps ----------
  const gsapLines = [];
  const applied = [];
  for (const t of injectable) {
    const fromClip = clips.get(t.from);
    const toClip = clips.get(t.to);
    if (!fromClip || !toClip) {
      die(
        `transition ${t.from}→${t.to}: clip wrapper(s) not in index.html (from=${!!fromClip}, to=${!!toClip})`,
      );
    }
    const dur = Number(t.duration_s) || 0.5;

    // EXTEND-OUTGOING-ONLY overlap. The transition plays in [cut, cut + dur], where
    // `cut` is the incoming scene's start (= the outgoing scene's natural end, since
    // scenes tile). We extend ONLY the outgoing wrapper by `dur` so it lingers (held
    // final frame) across the window while the incoming — already present from `cut`
    // on the higher track — fades/pushes IN over it. We do NOT move any scene's
    // data-start, so voice/SFX/caption timing (all keyed to the original start_s)
    // stays perfectly in sync. Overlap window == tween window == `dur`. No dead frames.
    const T = Number(toClip.start.toFixed(3)); // cut = incoming start
    fromClip.duration = Number((fromClip.duration + dur).toFixed(3));

    gsapLines.push(...buildGsap(t, dur, T));
    applied.push({ ...t, T, durApplied: dur });
  }

  // ---------- mandatory 0/1 ping-pong track reassignment ----------
  // Walk scene clips in play order (start asc, stable by sid) and alternate track 0/1.
  // Overlapping neighbors always land on different tracks; non-adjacent clips reuse a
  // track but never overlap, so overlapping_clips_same_track stays clean.
  const ordered = [...clips.values()].sort((a, b) =>
    a.start !== b.start ? a.start - b.start : a.sid.localeCompare(b.sid),
  );
  ordered.forEach((c, i) => {
    c.track = i % 2;
  });

  // ---------- rewrite each clip block in html ----------
  for (const c of clips.values()) {
    let nb = c.block
      .replace(/data-start="[\d.]+"/, `data-start="${c.start}"`)
      .replace(/data-duration="[\d.]+"/, `data-duration="${c.duration}"`)
      .replace(/data-track-index="\d+"/, `data-track-index="${c.track}"`);
    if (nb === c.block && c.block.includes(`data-track-index`)) {
      // attrs unchanged is fine; only fail if the block had no track attr to rewrite
    }
    html = html.replace(c.block, nb);
  }

  // ---------- inject GSAP after the master timeline creation ----------
  // assemble-index emits:  window.__timelines["main"] = gsap.timeline({ paused: true });
  const masterAnchor = 'window.__timelines["main"] = gsap.timeline({ paused: true });';
  if (!html.includes(masterAnchor)) {
    die(`master timeline anchor not found in index.html — expected: ${masterAnchor}`);
  }
  const block = [
    masterAnchor,
    "      // ── scene transitions (injected by inject-transitions.mjs) ──",
    '      (function () { var tl = window.__timelines["main"];',
    ...gsapLines.map((l) => "        " + l),
    "      })();",
  ].join("\n");
  html = html.replace(masterAnchor, block);

  writeFileSync(indexPath, html);

  // ---------- summary ----------
  console.log(`✓ inject-transitions: ${applied.length} transition(s) stamped into index.html`);
  for (const a of applied) {
    const dir = a.direction ? ` ${a.direction}` : "";
    console.log(
      `  ${a.from}→${a.to}: ${a.type}${dir} ${a.durApplied}s @ T=${a.T}s (from ext +${a.durApplied}s, to start→${a.T})`,
    );
  }
  const trackSummary = [...clips.values()]
    .sort((a, b) => a.start - b.start)
    .map((c) => `${c.sid}[t${c.track} ${c.start}→${Number((c.start + c.duration).toFixed(3))}]`)
    .join(" ");
  console.log(`  tracks: ${trackSummary}`);

  // ===========================================================================
  // build the GSAP lines for one transition.
  function buildGsap(t, dur, T) {
    const OLD = `"#el-${t.from}"`;
    const NEW = `"#el-${t.to}"`;

    const rec = txByName.get(t.type);
    if (!rec) die(`transition ${t.from}→${t.to}: type "${t.type}" not in registry`);

    // pick template: directional types have horizontal/vertical variants
    let template;
    let extra = {};
    if (rec.directions && rec.directions.length > 0) {
      const dir = (t.direction || rec.default_direction || rec.directions[0]).toUpperCase();
      const vertical = dir === "UP" || dir === "DOWN";
      template = vertical ? rec.gsap_template_vertical : rec.gsap_template_horizontal;
      if (!template)
        die(`transition ${t.type}: missing ${vertical ? "vertical" : "horizontal"} template`);
      if (vertical) {
        const dy = dir === "UP" ? -CANVAS_H : CANVAS_H;
        extra.__DY__ = String(dy);
        extra.__DYIN__ = String(-dy); // incoming enters from the opposite edge
      } else {
        const dx = dir === "LEFT" ? -CANVAS_W : CANVAS_W;
        extra.__DX__ = String(dx);
        extra.__DXIN__ = String(-dx);
      }
    } else {
      template = rec.gsap_template;
      if (!template) die(`transition ${t.type}: missing gsap_template`);
    }

    const subs = {
      __OLD__: OLD,
      __NEW__: NEW,
      __T__: String(T),
      __DUR__: String(dur),
      ...extra,
    };
    return template.map((line) => {
      let out = line;
      for (const [k, v] of Object.entries(subs)) out = out.split(k).join(v);
      return out;
    });
  }
}

// ===========================================================================
// verify ← verify-transitions.mjs
async function runVerify(argv) {
  const flag = (name, def) => {
    const i = argv.indexOf(`--${name}`);
    return i >= 0 && i + 1 < argv.length ? argv[i + 1] : def;
  };

  const groupSpecPath = resolve(flag("group-spec", "./group_spec.json"));
  const indexPath = resolve(flag("index", "./index.html"));

  const fail = [];
  function bail(msg) {
    console.error(`✗ verify-transitions.mjs: ${msg}`);
    process.exit(1);
  }

  if (!existsSync(groupSpecPath)) bail(`group_spec.json not found at ${groupSpecPath}`);
  if (!existsSync(indexPath)) bail(`index.html not found at ${indexPath}`);

  let spec;
  try {
    spec = JSON.parse(readFileSync(groupSpecPath, "utf8"));
  } catch (e) {
    bail(`group_spec.json parse: ${e.message}`);
  }
  const transitions = Array.isArray(spec.transitions) ? spec.transitions : [];
  const injectable = transitions.filter((t) => t && t.type);

  // Authoritative SCENE id set (same as the injector) — captions/voice/bgm/sfx are
  // NOT scenes and are excluded from the scene track-overlap invariant. Captions
  // legitimately spans the whole video on track 12; scenes ping-pong on 0/1.
  const sceneIds = new Set();
  for (const g of spec.groups || []) for (const sid of g.scene_ids || []) sceneIds.add(sid);

  const html = readFileSync(indexPath, "utf8");

  // ---------- parse SCENE clip wrappers (only known scene ids) ----------
  const clipRe = /<div\s+id="el-([A-Za-z0-9_]+)"([\s\S]*?)><\/div>/g;
  const clips = new Map();
  let cm;
  while ((cm = clipRe.exec(html)) !== null) {
    if (!sceneIds.has(cm[1])) continue; // skip captions / voice / bgm / sfx
    const attrs = cm[2];
    const num = (re) => {
      const m = attrs.match(re);
      return m ? Number(m[1]) : null;
    };
    clips.set(cm[1], {
      sid: cm[1],
      start: num(/data-start="([\d.]+)"/),
      duration: num(/data-duration="([\d.]+)"/),
      track: num(/data-track-index="(\d+)"/) ?? 0,
    });
  }

  const EPS = 0.011; // ms-rounding tolerance (prep rounds to 3 dp)
  const overlaps = (a, b) =>
    a.start < b.start + b.duration - EPS && b.start < a.start + a.duration - EPS;

  // ---------- (4) GLOBAL no-same-track-overlap ----------
  const all = [...clips.values()];
  for (let i = 0; i < all.length; i++) {
    for (let j = i + 1; j < all.length; j++) {
      const a = all[i];
      const b = all[j];
      if (a.track === b.track && overlaps(a, b)) {
        fail.push(
          `same-track overlap: ${a.sid}[t${a.track} ${a.start}→${(a.start + a.duration).toFixed(3)}] ` +
            `and ${b.sid}[t${b.track} ${b.start}→${(b.start + b.duration).toFixed(3)}] — lint would reject this`,
        );
      }
    }
  }

  // ---------- per-transition (1)(2)(3) ----------
  // Isolate the injected transition block so the tween-reference check only looks there.
  const blockMatch = html.match(/scene transitions \(injected[\s\S]*?\}\)\(\);/);
  const txBlock = blockMatch ? blockMatch[0] : "";
  if (injectable.length > 0 && !txBlock) {
    fail.push(
      `group_spec has ${injectable.length} transition(s) but no injected transition block in index.html`,
    );
  }

  for (const t of injectable) {
    const from = clips.get(t.from);
    const to = clips.get(t.to);
    if (!from || !to) {
      fail.push(`transition ${t.from}→${t.to}: wrapper(s) missing (from=${!!from}, to=${!!to})`);
      continue;
    }
    // (1) tween references both ids
    if (!txBlock.includes(`"#el-${t.from}"`) || !txBlock.includes(`"#el-${t.to}"`)) {
      fail.push(
        `transition ${t.from}→${t.to}: injected block does not reference both #el-${t.from} and #el-${t.to}`,
      );
    }
    // (2) overlap ≈ duration_s (extend-outgoing-only: fromEnd - toStart ≈ dur)
    const fromEnd = from.start + from.duration;
    const overlapAmt = Number((fromEnd - to.start).toFixed(3));
    const dur = Number(t.duration_s) || 0.5;
    if (Math.abs(overlapAmt - dur) > EPS) {
      fail.push(
        `transition ${t.from}→${t.to}: overlap ${overlapAmt}s ≠ duration ${dur}s ` +
          `(from end ${fromEnd.toFixed(3)}, to start ${to.start})`,
      );
    }
    // (3) overlapping wrappers on different tracks
    if (from.track === to.track) {
      fail.push(`transition ${t.from}→${t.to}: both wrappers on track ${from.track} — must differ`);
    }
  }

  // ---------- report ----------
  if (fail.length) {
    console.error(`✗ verify-transitions: ${fail.length} invariant failure(s):`);
    for (const f of fail) console.error(`  - ${f}`);
    process.exit(1);
  }

  console.log(
    `✓ verify-transitions: ${injectable.length} transition(s) verified ` +
      `(overlap==duration, cross-track, both ids referenced, no same-track overlap)`,
  );
}

// ===========================================================================
// dispatcher
const sub = process.argv[2];
const rest = process.argv.slice(3);
switch (sub) {
  case "inject":
    await runInject(rest);
    break;
  case "verify":
    await runVerify(rest);
    break;
  default:
    console.error("usage: node transitions.mjs <inject|verify> [args...]");
    process.exit(2);
}
