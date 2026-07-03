#!/usr/bin/env node
// Phase 4a — prep + group plan (deterministic; no subagent).
//
// Reads:  section_plan.md (Phase 3), narrator_scripts.json (Phase 2),
//         audio_meta.json (Phase 2.5, optional), capture/assets/ (Phase 1 —
//         hyperframes capture), design-system/fonts/ (Phase 1b, populated by
//         build-design.mjs from capture's font binaries),
//         hyperframes-animation/rules/*.md (existence only).
// Writes: public/<assets>, public/fonts/<woff2>, ./group_spec.json inside the
//         HyperFrames project root passed via --hyperframes. The
//         product-launch-video orchestrator initializes that project root
//         before calling prep.
//
// This file is the ORCHESTRATOR. The deterministic concern logic lives in
// sibling lib/ modules so no single file carries every concern at once:
//   lib/prep-assets.mjs   — capture media + fonts → public/, @font-face extract (Steps 2/2b/2c)
//   lib/prep-section.mjs  — parse section_plan.md → film_direction + scenes      (Step 3)
//   lib/prep-design.mjs   — resolve design-system chunks + brand tokens           (Step 4b)
//   lib/prep-sfx.mjs      — SFX library copy + cue → global timing                (Step 6.5)
// The section_plan.md anchors recognised by the parser are documented in
// lib/prep-section.mjs. Steps 4 (rule_paths), 5 (audio-truth duration ladder),
// 6 (groups), 6.6 (transitions) and 7/8 (emit + summary) stay here.
//
// Usage:
//   node prep.mjs --section-plan <path> --narrator-scripts <path> \
//                 --rules-dir <abs> --capture <path> --hyperframes <path> \
//                 --out <path> [--audio-meta <path>] [--design-system <path>]
//
// Exit 0 = group_spec.json written + summary on stdout.
// Exit 1 = structural failure (missing anchor / missing rule / bad value) on stderr.

import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { loadTransitionRegistry, transitionsByName } from "./lib/transition-registry.mjs";
import { resolveDimensions } from "./lib/dimensions.mjs";
import { die } from "./lib/prep-log.mjs";
import { copyBrandFonts, copyCaptureAssets, extractFontFaceCss } from "./lib/prep-assets.mjs";
import { parseSectionPlan } from "./lib/prep-section.mjs";
import { extractBrandTokensCss, resolveDesignChunks } from "./lib/prep-design.mjs";
import { resolveSfx } from "./lib/prep-sfx.mjs";

// ---------- argv ----------
const argv = process.argv.slice(2);
const flag = (name, def) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 && i + 1 < argv.length ? argv[i + 1] : def;
};

const sectionPlanPath = resolve(flag("section-plan", "./section_plan.md"));
const narratorScriptsPath = resolve(flag("narrator-scripts", "./narrator_scripts.json"));
const audioMetaPath = flag("audio-meta") ? resolve(flag("audio-meta")) : null;
const rulesDirArg = flag("rules-dir");
if (!rulesDirArg) die("Missing required --rules-dir");
const rulesDir = resolve(rulesDirArg);
// `--capture` is the v3 flag (hyperframes capture). `--research` kept as a
// deprecated alias to make in-flight projects upgrade cleanly. Either one
// resolves to the same on-disk root that holds the page-load artifacts that
// downstream phases reference.
const captureDir = resolve(flag("capture", flag("research", "./capture")));
const designSystemDir = resolve(flag("design-system", "./design-system"));
const hyperframesDir = resolve(flag("hyperframes", "."));
const outPath = resolve(flag("out", "./group_spec.json"));
// Optional — orchestrator passes <SKILL_DIR>/assets/sfx absolute path.
// If absent: SFX cues in section_plan are silently ignored.
// (Captions are built by the Phase 4a.5 captions.mjs scripts, not by prep.)
const sfxLibDir = flag("sfx-lib") ? resolve(flag("sfx-lib")) : null;

// ---------- Step 1: bootstrap HyperFrames project root ----------
if (!existsSync(hyperframesDir)) {
  console.log(`HyperFrames project root missing → npx hyperframes init ${hyperframesDir}`);
  const r = spawnSync(
    "npx",
    [
      "hyperframes",
      "init",
      hyperframesDir,
      "--example",
      "blank",
      "--non-interactive",
      "--skip-skills",
    ],
    { stdio: "inherit" },
  );
  if (r.status !== 0) die("npx hyperframes init failed");
}

// ---------- Step 2/2b/2c: capture media + brand fonts → public/, @font-face ----------
// See lib/prep-assets.mjs. copyCaptureAssets creates public/ first, so it must
// run before copyBrandFonts (which writes public/fonts/).
const publicDir = join(hyperframesDir, "public");
const { copied, collisions } = copyCaptureAssets(captureDir, publicDir);
const fontsCopied = copyBrandFonts(designSystemDir, publicDir);
const fontFaceCss = extractFontFaceCss(designSystemDir);

// ---------- Step 3: parse section_plan.md ----------
// See lib/prep-section.mjs (anchors, scene blocks, SFX cue parsing, film_direction).
if (!existsSync(sectionPlanPath)) die(`section_plan.md not found at ${sectionPlanPath}`);
const planText = readFileSync(sectionPlanPath, "utf8");
const { film_direction, scenes } = parseSectionPlan(planText);

// ---------- Step 4: resolve rule_paths ----------
const ruleStatCache = new Map();
function statRule(p) {
  if (ruleStatCache.has(p)) return ruleStatCache.get(p);
  let st;
  try {
    st = statSync(p);
  } catch {
    st = null;
  }
  ruleStatCache.set(p, st);
  return st;
}
for (const s of scenes) {
  s.rule_paths = s.effects.map((id) => {
    const p = join(rulesDir, `${id}.md`);
    const st = statRule(p);
    if (!st || !st.isFile() || st.size === 0) die(`${s.sceneId}: rule file empty or missing: ${p}`);
    return p;
  });
}

// anomalies collected throughout the rest of the script (non-fatal mismatches:
// chunks missing → fallback, audio duration drift, voice file dropped, asset
// candidate not on disk, BGM still rendering). Declared up-front so Step 4b
// can append to it.
const anomalies = [];

// ---------- Step 4b: resolve design_chunks + extract :root brand tokens ----------
// See lib/prep-design.mjs. resolveDesignChunks mutates scenes[].design_chunks and
// appends anomalies; chunksIndex is reused for the brand-tokens block and summary.
const { chunksIndex } = resolveDesignChunks({ designSystemDir, scenes, anomalies });
const brandTokensCss = extractBrandTokensCss(chunksIndex, designSystemDir);

// ---------- Step 5: cross-check narrator + audio merge ----------
if (!existsSync(narratorScriptsPath))
  die(`narrator_scripts.json not found at ${narratorScriptsPath}`);
const narratorScripts = JSON.parse(readFileSync(narratorScriptsPath, "utf8"));
const narratorByNumber = new Map((narratorScripts.scenes || []).map((s) => [s.sceneNumber, s]));

// Canvas dimensions — landscape 1920×1080 unless the upstream intent layer set
// `orientation`/`dimensions` in narrator_scripts.json (or --width/--height here
// override for testing). The resolved size is stamped into group_spec.width/
// height; every downstream script + scene worker reads it from there. See the
// seam doc at scripts/lib/dimensions.mjs.
const {
  width: CANVAS_W,
  height: CANVAS_H,
  source: dimSource,
} = resolveDimensions({ width: flag("width"), height: flag("height") }, narratorScripts);

let audioMeta = null;
if (audioMetaPath) {
  if (existsSync(audioMetaPath)) {
    audioMeta = JSON.parse(readFileSync(audioMetaPath, "utf8"));
  } else {
    console.log(`audio-meta path given but file missing — proceeding without audio`);
  }
}

// Duration truth ladder (highest → lowest):
//   audio_meta.scenes[sceneId].voiceDuration   <- measured TTS wav = TRUE TRUTH
//   section_plan.md "**Duration:** Xs"          ← plan agent decision (already
//                                                  reconciled with audio per guide)
//   narrator_scripts.json estimatedDuration    ← earliest estimate
//
// Final s.estimatedDuration_s = highest-priority source that exists.
// Mismatch anomalies surface upstream inconsistencies but do NOT block.

// ffprobe a media file's container duration in seconds (NaN on any failure).
function ffprobeDurationSeconds(absPath) {
  const r = spawnSync(
    "ffprobe",
    ["-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", absPath],
    { encoding: "utf8" },
  );
  if (r.status !== 0) return NaN;
  return parseFloat((r.stdout || "").trim());
}

for (const s of scenes) {
  const planDur = s.estimatedDuration_s; // value as parsed from section_plan
  const narrator = narratorByNumber.get(s.sceneNumber);
  let narratorDur = NaN;
  if (narrator?.estimatedDuration != null) {
    const m = String(narrator.estimatedDuration).match(/[\d.]+/);
    narratorDur = m ? parseFloat(m[0]) : NaN;
  }
  let audioDur = NaN;
  let audioScene = null;
  let audioDurSource = null;
  if (audioMeta) {
    audioScene = audioMeta.scenes?.[s.sceneId] || null;
    if (audioScene && isFinite(audioScene.voiceDuration) && audioScene.voiceDuration > 0) {
      audioDur = audioScene.voiceDuration;
      audioDurSource = "audio_meta";
    } else if (audioScene) {
      // audio_meta lists the scene but voiceDuration is missing/0 (e.g. an
      // interrupted or partially-written audio.mjs run). The TTS wav on disk is
      // still the real truth — ffprobe it before falling back to the plan
      // estimate, so a stale 0 doesn't inflate the scene into dead air (visual
      // slot far longer than the voiceover → captions vanish mid-scene).
      const voiceRel = audioScene.voicePath || `assets/voice/${s.sceneId}.wav`;
      const voiceAbs = join(hyperframesDir, voiceRel);
      if (existsSync(voiceAbs)) {
        const probed = ffprobeDurationSeconds(voiceAbs);
        if (isFinite(probed) && probed > 0) {
          audioDur = probed;
          audioDurSource = "voice_probe";
          anomalies.push(
            `${s.sceneId}: audio_meta.voiceDuration missing/0 — recovered ${probed.toFixed(3)}s by ffprobing ${voiceRel} (vs section_plan ${planDur}s)`,
          );
        }
      }
    }
  }

  // Pick final value by truth ladder.
  let finalDur = planDur;
  let source = "section_plan";
  if (isFinite(audioDur)) {
    finalDur = audioDur;
    source = audioDurSource || "audio_meta";
  }
  // Round to 3 decimals — naive cumulative `start_s += dur` accumulates
  // float error fast enough that lint catches it (2.24 + 6.357 = 8.597000…1
  // → overlapping_clips_same_track). Round per scene and we emit a
  // precomputed start_s below so finalize never accumulates.
  s.estimatedDuration_s = Number(finalDur.toFixed(3));

  // Anomalies: surface cross-stage inconsistencies. audio_meta is truth when
  // present; plan and narrator are estimates that may legitimately differ within
  // small tolerances (guide.md §1 lets plan agent keep narrator when audio diff
  // <10%). Report divergence but don't moralize about it.
  const pct = (a, b) => (b > 0 ? (Math.abs(a - b) / b) * 100 : 0);
  if (source === "audio_meta") {
    if (Math.abs(audioDur - planDur) > 0.01) {
      const p = pct(audioDur, planDur).toFixed(1);
      anomalies.push(
        `${s.sceneId}: audio_meta ${audioDur}s (truth) overrides section_plan ${planDur}s (${p}% diff)`,
      );
    }
    if (isFinite(narratorDur) && Math.abs(audioDur - narratorDur) / audioDur > 0.1) {
      const p = pct(audioDur, narratorDur).toFixed(1);
      anomalies.push(
        `${s.sceneId}: narrator estimate ${narratorDur}s off by ${p}% vs audio_meta ${audioDur}s (truth)`,
      );
    }
  } else if (
    source === "section_plan" &&
    isFinite(narratorDur) &&
    Math.abs(narratorDur - planDur) > 0.01
  ) {
    const p = pct(narratorDur, planDur).toFixed(1);
    anomalies.push(
      `${s.sceneId}: section_plan ${planDur}s vs narrator ${narratorDur}s (${p}% — no audio_meta available; using section_plan)`,
    );
  }

  // audio merge: voice + words paths (independent of duration)
  s.voicePath = audioScene?.voicePath || "";
  s.wordsPath = audioScene?.wordsPath || "";

  // disk checks (drop missing voice/words paths to empty + record anomaly)
  if (s.voicePath && !existsSync(join(hyperframesDir, s.voicePath))) {
    anomalies.push(`${s.sceneId}: voicePath "${s.voicePath}" not on disk — dropping to ""`);
    s.voicePath = "";
  }
  if (s.wordsPath && !existsSync(join(hyperframesDir, s.wordsPath))) {
    anomalies.push(`${s.sceneId}: wordsPath "${s.wordsPath}" not on disk — dropping to ""`);
    s.wordsPath = "";
  }
  // Check assetCandidates[] — worker may reference any of them as
  // assets in the scene HTML. Missing assets caused 50s+ of finalize
  // "hunt-and-cp" debugging in past runs.
  const narratorScene = narratorByNumber.get(s.sceneNumber);
  const candidates = Array.isArray(narratorScene?.assetCandidates)
    ? narratorScene.assetCandidates
    : [];
  for (const cand of candidates) {
    if (
      cand?.path &&
      typeof cand.path === "string" &&
      cand.path.startsWith("public/") &&
      !existsSync(join(hyperframesDir, cand.path))
    ) {
      anomalies.push(
        `${s.sceneId}: assetCandidate "${cand.path}" listed in narrator_scripts.json but not in public/ — Phase 4b worker may fail`,
      );
    }
  }
  s.assetCandidates = candidates;
}

// ---------- Step 6: one scene per worker ----------
// Multi-scene grouping (by Continuity, cap=N) existed solely so one worker could
// author a Tier-A cross-scene morph. Tier-A was removed, so every scene is its
// own worker — simplest dispatch, no double-scene long-tail.
// Precomputed cumulative scene start — finalize reads this verbatim instead of
// accumulating in JS, dodging FP-precision overlaps that lint catches as
// `overlapping_clips_same_track`.
const groups = [];
let runningStart = 0;
for (const s of scenes) {
  const start_s = Number(runningStart.toFixed(3));
  groups.push({
    worker_id: `w${groups.length + 1}`,
    scene_ids: [s.sceneId],
    scenes: {
      [s.sceneId]: {
        start_s,
        effects: s.effects,
        rule_paths: s.rule_paths,
        assetCandidates: s.assetCandidates,
        estimatedDuration_s: s.estimatedDuration_s,
        voicePath: s.voicePath,
        wordsPath: s.wordsPath,
        blueprint: s.blueprint,
        design_chunks: s.design_chunks,
        creative_brief: s.creative_brief,
      },
    },
  });
  runningStart += s.estimatedDuration_s;
}

// ---------- Step 6.6: scene-to-scene transitions ----------
// One record per adjacent scene pair, injected by transitions.mjs onto the
// index.html clip wrappers.
//
// Determinism: the planner optionally names a transition per scene (the ENTERING
// transition). When absent, we default-fill from the registry's rules. No agent.
const transitions = [];
let txRegistry = null;
let txByName = new Map();
try {
  txRegistry = loadTransitionRegistry();
  txByName = transitionsByName();
} catch (e) {
  anomalies.push(`transition registry unreadable — scene transitions skipped (${e.message})`);
}
if (txRegistry) {
  // Energy classification for the DEFAULT transition (only when the planner did
  // not name one). We scan the entering scene's TONE words — the mood the brief
  // actually describes — NOT layout jargon. Critically we do NOT match words like
  // "hero" / "reveal" / "drop" / "punch": those are composition/layout terms
  // ("centered hero composition", "product reveal") that say nothing about energy,
  // and matching them made every scene default to zoom-through (observed on a real
  // 8-scene promo). Only genuine high-energy TONE words promote to zoom-through;
  // everything else gets the calm universal default (blur-crossfade), which suits
  // most moods and keeps the whole video to ~2 transition types (the "repeat 2-3"
  // principle) instead of a monotonous zoom on every cut.
  const HIGH_TONE_RX =
    /\b(explosive|high[- ]energy|frenetic|kinetic|momentum|powerful|adrenaline|hype|punchy|aggressive|fast[- ]cut|rapid)\b/i;

  const briefFor = (sid) => {
    for (const g of groups) if (g.scenes[sid]) return g.scenes[sid].creative_brief || "";
    return "";
  };

  for (let i = 1; i < scenes.length; i++) {
    const fromScene = scenes[i - 1];
    const toScene = scenes[i];
    const fromSid = fromScene.sceneId;
    const toSid = toScene.sceneId;

    // The ENTERING transition is named on the destination scene.
    const named = toScene.transition; // { type, direction, duration_s } | null
    let type = named?.type || null;
    let direction = named?.direction || null;
    let durationOverride = named?.duration_s ?? null;

    // Default-fill (no named transition): one calm universal — blur-crossfade,
    // which masks any background shift and reads intentional — unless the entering
    // beat's TONE reads HIGH energy, which promotes to zoom-through. (The old
    // surface-conflict and calm branches both resolved to blur-crossfade too, so
    // they were redundant; zoom-through itself blurs, so it still masks a bg clash.)
    if (!type) {
      // Scan only the FIRST ~160 chars (the beat's mood parenthetical) — the rest is
      // layout prose full of false-positive words.
      const tone = briefFor(toSid).slice(0, 160);
      type = HIGH_TONE_RX.test(tone)
        ? txRegistry.default_high_energy || "zoom-through"
        : txRegistry.default_calm || "blur-crossfade";
    }

    const rec = txByName.get(type);

    // Resolve direction default for directional types.
    if (rec && Array.isArray(rec.directions) && rec.directions.length > 0 && !direction) {
      direction = rec.default_direction || rec.directions[0];
    }

    const duration_s = Number(
      (durationOverride != null ? durationOverride : (rec?.default_duration_s ?? 0.5)).toFixed(3),
    );

    transitions.push({
      from: fromSid,
      to: toSid,
      type,
      direction: direction || null,
      duration_s,
    });
  }
}

// ---------- Step 6.5: SFX library copy + cue → global timing ----------
// See lib/prep-sfx.mjs. Runs after Step 6.6 (matching the original ordering) so
// its "sfx lib copied" log and any cue anomalies land in the same sequence.
const sfx = resolveSfx({ sfxLibDir, hyperframesDir, scenes, groups, anomalies });

// ---------- Step 7: emit group_spec.json ----------
const total_duration_s = scenes.reduce((sum, s) => sum + s.estimatedDuration_s, 0);
// BGM may still be rendering (audio.mjs spawns detached and exits before it
// finishes). Trust audio_meta.bgm_path; Phase 4c wait-bgm.mjs writes the final
// status before assemble-index decides whether to emit the <audio> element.
let bgm_path = "";
if (audioMeta?.bgm_path) {
  bgm_path = audioMeta.bgm_path;
  if (!existsSync(join(hyperframesDir, audioMeta.bgm_path))) {
    if (audioMeta.bgm_pending) {
      anomalies.push(
        `bgm "${audioMeta.bgm_path}" still rendering (bgm_pending=true) — Phase 4c wait-bgm will check before emitting <audio>`,
      );
    } else {
      anomalies.push(
        `bgm "${audioMeta.bgm_path}" listed in audio_meta but missing — Phase 4c will skip if still absent`,
      );
    }
  }
}

// Single deterministic gate for the readability-A keep-out + caption band:
// same condition captions.mjs group uses to emit-vs-skip (≥1 scene has a usable
// on-disk wordsPath). When true: build-captions(-html) emit captions, assemble
// mounts track-12, AND every scene worker receives `Captions: enabled` so it
// keeps foreground content in the upper ~83% and reserves the bottom ~17% band.
// When false: no captions and scene workers use full-canvas layouts.
const captions_enabled = scenes.some((s) => Boolean(s.wordsPath));

const spec = {
  total_scenes: scenes.length,
  width: CANVAS_W,
  height: CANVAS_H,
  captions_enabled,
  film_direction,
  total_duration_s: Number(total_duration_s.toFixed(3)),
  bgm_path,
  font_face_css: fontFaceCss,
  brand_tokens_css: brandTokensCss,
  groups,
  transitions,
  sfx,
};

writeFileSync(outPath, JSON.stringify(spec, null, 2));

// Captions: built deterministically in Phase 4a.5 (captions.mjs group →
// caption_groups.json, then captions.mjs html → compositions/captions.html).
// This script only emits the `captions_enabled` gate above; assemble-index.mjs
// checks compositions/captions.html existence and emits the track-12 clip if present.

// ---------- Step 8: summary ----------
console.log(`✓ wrote ${outPath}`);
console.log(
  `  scenes: ${spec.total_scenes}, groups: ${groups.length}, total: ${spec.total_duration_s}s`,
);
console.log(`  canvas: ${CANVAS_W}×${CANVAS_H} (${dimSource})`);
console.log(
  `  captions: ${captions_enabled ? "enabled (scene keep-out + band reserved)" : "disabled (full-canvas scenes)"}`,
);
console.log(
  `  film direction: ${film_direction ? `${film_direction.split(/\s+/).length} words (forward to worker shared header + finalize dispatch)` : "(none — legacy plan format)"}`,
);
console.log(`  bgm: ${bgm_path || "(none)"}`);
console.log(
  `  sfx cues:      ${sfx.length}${sfxLibDir ? "" : " (--sfx-lib not passed; cues dropped)"}`,
);
if (transitions.length) {
  console.log(`  transitions:   ${transitions.length}`);
  for (const t of transitions) {
    const dir = t.direction ? ` ${t.direction}` : "";
    console.log(`    ${t.from}→${t.to}: ${t.type}${dir} ${t.duration_s}s`);
  }
} else {
  console.log(`  transitions:   0 (single scene or registry unavailable)`);
}
console.log(`  assets copied: ${copied} (collisions skipped: ${collisions.length})`);
console.log(`  fonts copied:  ${fontsCopied}`);
console.log(
  `  @font-face block: ${fontFaceCss ? `${fontFaceCss.length}B extracted (Phase 4c will inject into index.html <head>)` : "(none — design.html has no auto-injected block)"}`,
);
if (chunksIndex) {
  const libCount = chunksIndex.components?.length || 0;
  const uniqueComps = new Set();
  for (const s of scenes) {
    for (const p of s.design_chunks?.components || []) uniqueComps.add(basename(p, ".html"));
  }
  console.log(
    `  design-chunks:    ${libCount} component(s) available, forwarded as a style-reference library to every worker (${[...uniqueComps].join(", ") || "none"})`,
  );
} else {
  console.log(`  design-chunks:    none (workers will fall back to design.html)`);
}
for (const g of groups) {
  const items = g.scene_ids.map((id) => `${id}(${g.scenes[id].estimatedDuration_s}s)`).join(", ");
  console.log(`  ${g.worker_id}: ${items}`);
}
if (collisions.length) {
  console.log(`\nasset collisions (first-wins, skipped duplicates):`);
  for (const c of collisions.slice(0, 5))
    console.log(`  ${basename(c.kept)} ← skipped ${c.skipped}`);
  if (collisions.length > 5) console.log(`  …and ${collisions.length - 5} more`);
}
if (anomalies.length) {
  console.log(`\nanomalies (non-fatal):`);
  for (const a of anomalies) console.log(`  - ${a}`);
}
