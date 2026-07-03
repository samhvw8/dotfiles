#!/usr/bin/env node
/**
 * build-page-card.mjs — deterministic page-card skeleton generator.
 *
 * Populates the `demo-page-scroll-spotlight` blueprint's fixed DOM template with
 * THIS site's captured content (headline, nav, features, a pop-target) + brand
 * colors + LOCAL images, and emits a standalone, renderable `page-card.html`.
 *
 * It is a REFERENCE skeleton, not a final composition. The scene worker still:
 *   1. prefixes class/id with its scene id (s<N>-) when pasting into compositions/<id>.html
 *   2. fills each .kw `data-glow-start/end` from the voiceover ASR word timings
 *   3. verifies/tunes SCROLL_DISTANCE by measuring the pop-target rect
 *
 * Inputs (all auto-discovered from the project dir, override with flags):
 *   <project-dir>/capture/extracted/tokens.json   (enriched sections + page dims + local assets)
 *   <project-dir>/design-system/inference.json    (brand.{primary,secondary,accent}; optional)
 *
 * Usage:
 *   node build-page-card.mjs [<project-dir>] [--capture <dir>] [--design <dir>]
 *                            [--out <file>] [--duration <seconds>]
 */

import fs from "node:fs";
import path from "node:path";

// ─────────────── args ───────────────
const argv = process.argv.slice(2);
let projectDir = ".",
  cliCapture = null,
  cliDesign = null,
  cliOut = null,
  cliDuration = 9;
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === "--capture" && argv[i + 1]) cliCapture = argv[++i];
  else if (a === "--design" && argv[i + 1]) cliDesign = argv[++i];
  else if (a === "--out" && argv[i + 1]) cliOut = argv[++i];
  else if (a === "--duration" && argv[i + 1]) cliDuration = parseFloat(argv[++i]);
  else if (!a.startsWith("--")) projectDir = a;
}
projectDir = path.resolve(projectDir);
const captureDir = cliCapture ? path.resolve(cliCapture) : path.join(projectDir, "capture");
const designDir = cliDesign ? path.resolve(cliDesign) : path.join(projectDir, "design-system");
const outFile = cliOut ? path.resolve(cliOut) : path.join(projectDir, "page-card.html");
const DURATION = Number.isFinite(cliDuration) ? cliDuration : 9;

// section.assets paths are relative to the capture dir (e.g. "assets/x.png" =
// capture/assets/x.png). Rewrite them relative to where page-card.html is
// written so the <img src> resolves both for preview and at render time.
const assetSrc = (localPath) =>
  path.relative(path.dirname(outFile), path.join(captureDir, localPath)).split(path.sep).join("/");

const readJSON = (p, fb) => {
  try {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch {
    return fb;
  }
};

const tokens = readJSON(path.join(captureDir, "extracted", "tokens.json"), null);
if (!tokens) {
  console.error(
    `✗ ${path.join(captureDir, "extracted", "tokens.json")} not found — run capture first.`,
  );
  process.exit(1);
}
const inference = readJSON(path.join(designDir, "inference.json"), null);

// ─────────────── color helpers ───────────────
const rgb = (hex) => {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex || "");
  return m ? [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16)) : null;
};
const lum = (hex) => {
  const c = rgb(hex);
  return c ? (0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]) / 255 : 0.5;
};
const sat = (hex) => {
  const c = rgb(hex);
  if (!c) return 0;
  const mx = Math.max(...c),
    mn = Math.min(...c);
  return mx === 0 ? 0 : (mx - mn) / mx;
};
const isNeutral = (hex) => {
  const c = rgb(hex);
  return !c || Math.max(...c) - Math.min(...c) < 18;
};
const rgba = (hex, a) => {
  const c = rgb(hex) || [0, 0, 0];
  return `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${a})`;
};
const esc = (s) =>
  String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

// ─────────────── brand colors ───────────────
const brand = inference?.brand || {};
let primary = brand.primary;
if (!primary || isNeutral(primary)) {
  // fallback: most-saturated chromatic color used as a fill
  const cand = (tokens.colorStats || [])
    .filter((s) => s.bgCount > 0 && !isNeutral(s.hex))
    .sort((a, b) => sat(b.hex) - sat(a.hex))[0];
  primary = cand?.hex || "#5B7CFA";
}
const accent = brand.accent && !isNeutral(brand.accent) ? brand.accent : primary;
// Glow needs a vivid color — a pale/near-white accent gives no visible glow,
// so fall back to primary for the keyword/pop glow + pop border.
const glow = lum(accent) > 0.72 || sat(accent) < 0.35 ? primary : accent;

// page surface: prefer the hero section bg, else most common large section bg
const sections = Array.isArray(tokens.sections) ? tokens.sections : [];
const hero = sections.find((s) => s.type === "hero") || sections[0] || {};
let pageBg =
  hero.backgroundColor && /^#[0-9a-f]{6}$/i.test(hero.backgroundColor)
    ? hero.backgroundColor
    : "#ffffff";
const dark = lum(pageBg) < 0.45;
const textPrimary = dark ? "#ffffff" : "#0a0a0f";
const textSecondary = dark ? "rgba(255,255,255,0.62)" : "rgba(10,10,15,0.6)";
const cardSurface = dark ? "#16161c" : "#f4f4f6";
const navBrandColor = textPrimary;
const headingFont =
  (tokens.fonts && tokens.fonts[0] && tokens.fonts[0].family) || "Inter, system-ui, sans-serif";

// ─────────────── content selection ───────────────
const title = tokens.title || "";
const brandName = title.split(/[|–—\-:·]/)[0].trim() || "Product";

// headline → words; wrap the first ~8 in .kw (worker fills data-glow from ASR)
const headlineRaw = (tokens.headings && tokens.headings[0]?.text) || hero.heading || brandName;
// First sentence, word-capped — captured h1 is often a long concatenation; the
// hero title wants a short punchy line (worker can refine).
const firstSentence =
  headlineRaw
    .replace(/\s+/g, " ")
    .trim()
    .split(/(?<=[.!?])\s/)[0] || headlineRaw;
const words = firstSentence.split(" ").filter(Boolean).slice(0, 12);
const headline = words.join(" ");
const KW_MAX = 8;
const heroTitleHtml = words
  .map((w, i) =>
    i < KW_MAX ? `<span class="kw" data-glow-start="" data-glow-end="">${esc(w)}</span>` : esc(w),
  )
  .join(" ");

const heroSub = (tokens.description || hero.text || "").replace(/\s+/g, " ").trim().slice(0, 160);

// nav items: short distinct cta/link-ish labels
const navItems = [...new Set((tokens.ctas || []).map((c) => (c.text || "").trim()))]
  .filter((t) => t && t.length >= 2 && t.length <= 16 && !/\s{2,}/.test(t))
  .slice(0, 5);
const primaryCta =
  (tokens.ctas || [])
    .map((c) => (c.text || "").trim())
    .find((t) => /sign up|get started|start|try|demo|contact/i.test(t)) ||
  navItems[0] ||
  "Get started";

// feature sections that carry a local image
const featureSecs = sections.filter(
  (s) =>
    (s.type === "features" || s.type === "content") && s.assets && s.assets.length && s.heading,
);
// pop-target: the largest-area section that has a local image (the demo focal point)
const popSec =
  [...sections]
    .filter((s) => s.assets && s.assets.length)
    .sort((a, b) => b.width * b.height - a.width * a.height)[0] ||
  featureSecs[0] ||
  {};
const popImg = (popSec.assets && popSec.assets[0]) || null;
const popLabel = (popSec.heading || "Product").slice(0, 60);

// feature cards (exclude the pop-target's section), up to 2
const featureCards = featureSecs
  .filter((s) => s !== popSec)
  .slice(0, 2)
  .map((s) => ({ heading: s.heading.slice(0, 60), img: s.assets[0] }));

// ─────────────── SCROLL_DISTANCE estimate (must be verified by measuring) ───────────────
// Rebuilt-layout estimate, NOT the original page geometry: navbar(72) is fixed;
// scroll-content has pad-top 140 + hero (~340) + feature cards (~408 each) before
// the carousel/pop-target. Scroll so the pop-target lands ~60% down the card.
const CARD_VISIBLE_H = Math.round(1080 * 0.88);
const contentBeforePop = 140 + 340 + featureCards.length * 408 + 48;
const scrollDistance = Math.max(160, Math.round(contentBeforePop - CARD_VISIBLE_H * 0.42));

// ─────────────── emit ───────────────
const navItemsHtml = navItems
  .map((t) => `<span class="nav-item">${esc(t)}</span>`)
  .join("\n            ");
const featureCardsHtml = featureCards
  .map(
    (f) => `
          <div class="feature-card">
            <img class="feature-img" src="${esc(assetSrc(f.img))}" alt="${esc(f.heading)}" />
            <div class="feature-cap">${esc(f.heading)}</div>
          </div>`,
  )
  .join("");
const popMediaHtml = popImg
  ? `<img class="carousel-img" src="${esc(assetSrc(popImg))}" alt="${esc(popLabel)}" />`
  : `<div class="carousel-main-placeholder"><span>${esc(popLabel)}</span></div>`;

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1920, height=1080" />
    <title>Page Card — ${esc(brandName)}</title>
    <!--
      ════════════════════════════════════════════════════════════════════════
      AUTO-GENERATED page-card skeleton (build-page-card.mjs) for the
      demo-page-scroll-spotlight blueprint. This is a STANDALONE REFERENCE doc,
      not a final composition. Scene worker TODO before shipping into
      compositions/<id>.html:
        0. STANDALONE -> FRAGMENT (else trips 3 FATAL check-compositions rules:
           root-contract / data-composition-id / timeline-registration):
           - strip <!doctype>/<html>/<head>/<body> shell + the CDN gsap <script>
             (GSAP is injected once in index.html at Step 7); wrap #root in
             <template id="scene_<N>-template">.
           - root div: add class="scene_<N>-root"; data-composition-id="main" ->
             scene_<N>; delete data-start="0"; set data-duration to the dispatch
             estimatedDuration_s verbatim.
           - <style>: :root{} -> #root{}; fold html,body{} and bare *{} into
             #root / #root *.
           - window.__timelines["main"] -> window.__timelines["scene_<N>"]
             (step 1's selector sync does NOT cover this host-id/registration-key rename).
        1. Prefix every class/id with your scene id (e.g. s2-page-card / #s2-pop-target)
           and update the timeline selectors to match.
        2. Fill each .kw data-glow-start / data-glow-end from the voiceover ASR
           word timings (currently empty → those words stay un-glowed, render is fine).
        3. VERIFY SCROLL_DISTANCE (≈${scrollDistance}, an estimate from the rebuilt
           layout): open this file, getBoundingClientRect() #pop-target, adjust so
           it lands ~60% down the card, then re-center the .spotlight gradient.
      Source page reference: capture/extracted/page.html · geometry from capture page dims.
      ════════════════════════════════════════════════════════════════════════
    -->
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <style>
      :root {
        --page-bg: ${pageBg};
        --card-surface: ${cardSurface};
        --text-primary: ${textPrimary};
        --text-secondary: ${textSecondary};
        --primary: ${primary};
        --accent: ${accent};
        --heading-font: ${headingFont};
      }
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body {
        width: 1920px; height: 1080px; overflow: hidden;
        background: ${dark ? "#000" : "#0a0a0f"};
        font-family: var(--heading-font), system-ui, -apple-system, sans-serif;
        color: var(--text-primary);
      }
      .bg {
        position: absolute; inset: 0;
        background: radial-gradient(ellipse 100% 60% at 50% -10%, ${rgba(primary, 0.1)} 0%, transparent 60%), ${dark ? "#0a0a0f" : "#e9eaf0"};
      }
      .perspective-wrap {
        position: absolute; inset: 0; display: flex; align-items: center;
        justify-content: center; perspective: 1200px;
      }
      .page-card {
        width: 92%; height: 88%; background-color: var(--page-bg);
        border-radius: 20px; overflow: hidden; transform-style: preserve-3d;
        box-shadow: -30px 30px 60px rgba(0,0,0,0.4), -15px 15px 30px rgba(0,0,0,0.3), 0 0 80px rgba(0,0,0,0.2);
        border: 1px solid ${rgba(textPrimary, 0.1)}; position: relative;
      }
      .page-navbar {
        position: absolute; top: 0; left: 0; right: 0; height: 72px; padding: 0 48px;
        display: flex; align-items: center; justify-content: space-between; z-index: 100;
        opacity: 0;
        background: linear-gradient(to bottom, ${rgba(pageBg, 0.95)}, ${rgba(pageBg, 0.6)});
      }
      .nav-left { display: flex; align-items: center; gap: 10px; }
      .nav-brand { font-size: 20px; font-weight: 700; letter-spacing: -0.5px; color: ${navBrandColor}; }
      .nav-center { display: flex; align-items: center; gap: 28px; }
      .nav-item { font-size: 14px; font-weight: 500; color: var(--text-secondary); }
      .nav-right { display: flex; align-items: center; gap: 12px; }
      .nav-signup {
        padding: 8px 16px; background: var(--primary); border-radius: 8px;
        color: #fff; font-size: 14px; font-weight: 600;
      }
      .scroll-content {
        padding-top: 140px; padding-bottom: 60px; display: flex;
        flex-direction: column; align-items: center; will-change: transform;
      }
      .hero { text-align: center; max-width: 1200px; width: 90%; opacity: 0; }
      .hero-title { font-size: 64px; font-weight: 800; line-height: 1.1; letter-spacing: -1px; }
      .hero-sub {
        font-size: 20px; color: var(--text-secondary); margin: 24px auto 0;
        font-weight: 400; line-height: 1.5; max-width: 800px;
      }
      .hero-cta {
        display: inline-block; margin-top: 32px; padding: 14px 28px;
        background: var(--primary); color: #fff; border-radius: 10px;
        font-size: 16px; font-weight: 600;
      }
      /* keyword glow — all derived from --glow (worker fills data-glow from ASR) */
      .kw {
        --glow: 0; display: inline-block; position: relative; padding: 0 0.015em;
        text-shadow:
          0 0 calc(var(--glow) * 12px) ${rgba(glow, 0.95)},
          0 0 calc(var(--glow) * 28px) ${rgba(glow, 0.5)};
        transform: scale(calc(1 + var(--glow) * 0.04));
      }
      .features { margin-top: 56px; display: flex; flex-direction: column; align-items: center; gap: 48px; width: 100%; }
      .feature-card {
        width: 1100px; max-width: 90%; background: var(--card-surface);
        border-radius: 16px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.25);
      }
      .feature-img { width: 100%; height: 320px; object-fit: cover; display: block; }
      .feature-cap { padding: 18px 24px; font-size: 20px; font-weight: 600; }
      .carousel-wrap {
        opacity: 0; transform: scale(0.9); transform-origin: center top; margin-top: 56px;
        display: flex; justify-content: center; width: 100%; perspective: 800px; transform-style: preserve-3d;
      }
      /* pop-out target — Phase 4 */
      .carousel-main {
        --glow: 0; width: 880px; max-width: 88%; height: 500px; background: var(--card-surface);
        border-radius: 16px; position: relative; overflow: hidden; transform-style: preserve-3d;
        transform: translateZ(calc(var(--glow) * 80px)) scale(calc(1 + var(--glow) * 0.12));
        box-shadow:
          0 0 calc(var(--glow) * 25px) ${rgba(glow, 0.7)},
          0 calc(20px + var(--glow) * 40px) calc(60px + var(--glow) * 40px) rgba(0,0,0,calc(0.5 + var(--glow) * 0.2));
        border: 3px solid rgba(${(rgb(glow) || [0, 0, 0]).join(", ")}, calc(var(--glow) * 0.8));
        z-index: 200;
      }
      .carousel-img { width: 100%; height: 100%; object-fit: cover; display: block; }
      .carousel-main-placeholder {
        position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
        font-size: 28px; font-weight: 600; color: ${rgba(textPrimary, 0.6)};
        background: linear-gradient(135deg, ${rgba(primary, 0.3)}, ${rgba(accent, 0.3)});
      }
      .spotlight {
        position: absolute; inset: 0; pointer-events: none; opacity: 0; z-index: 150;
        background: radial-gradient(ellipse 850px 550px at 50% 58%, transparent 0%, transparent 50%, rgba(0,0,0,0.65) 100%);
      }
      .vignette {
        position: absolute; inset: 0; pointer-events: none; z-index: 400;
        background: radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.3) 100%);
      }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="${DURATION}" data-width="1920" data-height="1080">
      <div class="bg"></div>
      <div class="perspective-wrap">
        <div class="page-card clip" id="page-card" data-start="0" data-duration="${DURATION}" data-track-index="1">
          <nav class="page-navbar" id="navbar">
            <div class="nav-left"><span class="nav-brand">${esc(brandName)}</span></div>
            <div class="nav-center">
            ${navItemsHtml}
            </div>
            <div class="nav-right"><span class="nav-signup">${esc(primaryCta)}</span></div>
          </nav>
          <div class="scroll-content" id="scroll-content">
            <div class="hero" id="hero">
              <h1 class="hero-title">${heroTitleHtml}</h1>
              ${heroSub ? `<p class="hero-sub">${esc(heroSub)}</p>` : ""}
              <a class="hero-cta">${esc(primaryCta)}</a>
            </div>
            <div class="features">${featureCardsHtml}
            </div>
            <div class="carousel-wrap" id="carousel">
              <div class="carousel-main pop-target" id="pop-target">
                ${popMediaHtml}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="spotlight" id="spotlight"></div>
      <div class="vignette"></div>
    </div>

    <script>
      /* Timeline ported from the golden demo-page-scroll-spotlight example.
         data-glow on .kw is EMPTY until the worker fills it from ASR — the loop
         below skips words without timings, so this renders fine as-is. */
      const TIMING = {
        cardEntryDur: 0.8,
        navbarFadeAt: 0.0, navbarFadeDur: 0.6,
        titleFadeAt: 0.17, titleFadeDur: 0.7,
        ctaFadeAt: 0.5, ctaFadeDur: 0.7,
        scrollAt: ${(DURATION * 0.34).toFixed(2)}, scrollDur: 1.0,
        scrollDistance: ${scrollDistance}, /* ESTIMATE — verify by measuring #pop-target */
        popStart: ${(DURATION * 0.4).toFixed(2)}, popAttackDur: 0.67, popDecayDur: 0.33,
        popEnd: ${(DURATION - 0.2).toFixed(2)}, popRestLevel: 0.5,
      };
      const KEYWORD_REST_LEVEL = 0.14;
      const KEYWORD_SUSTAIN = 0.5;

      window.__timelines = window.__timelines || {};
      const tl = gsap.timeline({ paused: true });
      window.__timelines["main"] = tl;

      // Static 3D tilt + initial scale via gsap.set so scale tweens preserve rotation.
      gsap.set(".page-card", { rotationY: -8, rotationX: 3, scale: 0.95 });

      // Phase 1 — entry
      tl.to(".page-card", { scale: 1.0, duration: TIMING.cardEntryDur, ease: "power2.out" }, 0);
      tl.fromTo("#navbar", { opacity: 0 }, { opacity: 1, duration: TIMING.navbarFadeDur, ease: "power2.out" }, TIMING.navbarFadeAt);
      tl.fromTo("#hero", { opacity: 0 }, { opacity: 1, duration: TIMING.titleFadeDur, ease: "power2.out" }, TIMING.titleFadeAt);

      // Phase 2 — keyword glow (skips words with no ASR timing yet)
      document.querySelectorAll(".kw").forEach((kw) => {
        const start = Number(kw.dataset.glowStart);
        const end = Number(kw.dataset.glowEnd);
        if (!isFinite(start) || !isFinite(end) || end <= start) return;
        const peak = start + (end - start) / 2;
        const restAt = end + KEYWORD_SUSTAIN;
        tl.fromTo(kw, { "--glow": 0 }, { "--glow": 1.18, duration: peak - start, ease: "power2.out" }, start);
        tl.to(kw, { "--glow": KEYWORD_REST_LEVEL, duration: restAt - peak, ease: "power2.out" }, peak);
      });

      // Phase 3 — scroll to the feature/pop section
      tl.fromTo("#scroll-content", { y: 0 }, { y: -TIMING.scrollDistance, duration: TIMING.scrollDur, ease: "power2.inOut" }, TIMING.scrollAt);
      tl.fromTo("#carousel", { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1.0, duration: 0.5, ease: "power2.out" }, TIMING.scrollAt);

      // Phase 4 — pop-out + spotlight (intentional overlap with scroll tail)
      tl.fromTo("#pop-target", { "--glow": 0 }, { "--glow": 1, duration: TIMING.popAttackDur, ease: "power2.out" }, TIMING.popStart);
      tl.to("#pop-target", { "--glow": TIMING.popRestLevel, duration: TIMING.popDecayDur, ease: "power2.out" }, TIMING.popEnd - TIMING.popDecayDur);
      tl.fromTo("#spotlight", { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "power2.out" }, TIMING.popStart);
      tl.to("#spotlight", { opacity: TIMING.popRestLevel, duration: TIMING.popDecayDur, ease: "power2.out" }, TIMING.popEnd - TIMING.popDecayDur);
    </script>
  </body>
</html>
`;

fs.writeFileSync(outFile, html);
console.log(`✓ ${path.relative(process.cwd(), outFile)}`);
console.log(
  `  brand:    ${primary} primary · ${accent} accent · page-bg ${pageBg} (${dark ? "dark" : "light"})`,
);
console.log(
  `  headline: "${headline}" → ${Math.min(words.length, KW_MAX)} .kw words (data-glow empty)`,
);
console.log(`  nav:      ${navItems.length} items · CTA "${primaryCta}"`);
console.log(
  `  features: ${featureCards.length} cards · pop-target "${popLabel}" ${popImg ? "(" + popImg + ")" : "(placeholder)"}`,
);
console.log(
  `  scroll:   SCROLL_DISTANCE≈${scrollDistance} (estimate — worker must verify by measuring #pop-target)`,
);
console.log(`  worker TODO: prefix s<N>- · fill .kw data-glow from ASR · verify SCROLL_DISTANCE`);
