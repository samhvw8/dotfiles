```preset-meta
{
  "name": "playful",
  "label": "Playful",
  "fingerprint": {
    "depth": "double-stroke-offset-border",
    "shape": "asymmetric-organic-blob",
    "motion": "back-overshoot-hand-placed",
    "decoration": "scribbled-svg-doodles",
    "rotation": "micro-tilt-alternating",
    "palette-character": "warm-paper-ink"
  },
  "match_signals": [
    { "kind": "thick_solid_border", "weight": 0.3 },
    { "kind": "bouncy_easing", "weight": 0.2 },
    { "kind": "minimal_decoration", "weight": 0.1 }
  ],
  "best_for": ["indie product launches", "creator portfolios", "lifestyle", "community brands", "friendly research / tech"],
  "avoid_for": ["institutional credibility", "enterprise security", "formal corporate", "high-gravitas brands"],
  "chromeFonts": {
    "googleFontsHref": "https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;500&display=swap",
    "display": "Syne",
    "body": "Space Grotesk",
    "script": "Syne",
    "mono": "Space Mono"
  }
}
```

> `chromeFonts` makes the doc chrome render in the preset's native fonts; brand fonts still apply to §6 components. Playful is a two-face system: Syne does every display/numeric/headline moment, Space Grotesk does body and labels; the `script` slot also points at Syne because Playful refuses a third face.

## §A Director's intent

Syne display (700-800 weight, negative tracking -0.01 to -0.03em) carries every headline, statement, and numeral; Space Grotesk runs body and labels.

Depth is **double-stroke offset borders** — a 3px charcoal outline plus a 6-8px offset ghost border via `::before`. No `box-shadow` blur, no `drop-shadow`. Cards, blocks, and statistics carry small ±0.5deg to ±3deg rotations that alternate across neighbors so nothing reads as snapped to a grid.

**Warm-paper-on-ink contract via hue-anchor tokens (§8.2 exception).** Collapses to mud if brand DNA is cool-toned (blue/green/violet). Three hex anchors (`--anchor-peach`, `--anchor-peach-alt`, `--anchor-cream`) are declared in §B so warm surfaces mix brand-primary at low % with the anchor, preserving the studio register across any brand palette. Brand DNA still flows through for hero text, chip fills, focal accents — the anchors only stabilize the canvas, surface, and image-placeholder slots.

Decoration vocabulary: **asymmetric organic blobs** (border-radius like `40% 60% 70% 30% / 40% 50% 60% 50%`), **pebble shapes** (alternating long/short radii), **inline 2px-stroke SVG scribbles** (squiggle, star, circle, arrow) with rounded line-caps, **doodle circles and rectangles** anchored to slide corners. Every scene gets at least one scribble mark in a corner — punctuation, not content.

Motion is **back-overshoot** — `back.out(1.4)` on entry, `back.out(1.7)` on emphasis. Hand-placed, not gliding. Ambient layers (ghost-blob drift, scribble pen-on drift) use `sine.inOut`. Scene transitions cross-fade gently (0.6s opacity) — never blur, never slide.

**Density philosophy: medium-low.** One dominant element per scene plus one or two scribbles. Crowding the canvas with simultaneous cards, doodles, and copy collapses the hand-touched feeling into clutter.

**Class prefix: `pf-`** (initialism of "playful", 3 chars). Every component CSS class uses this prefix.

## §B Decoration tokens (merge into design.html `:root`)

Playful declares **structural** tokens here (border weights, offset distances, rotation budget, anchor palette). Brand DNA drives hero text, chip fills, focal accents through `--brand-*` vars. The hue-anchor hex set is the **§8.2 exception**: warm-paper character collapses without anchored peach tones when brand DNA is cool-toned.

```css
/* §8.2 exception: warm-paper palette anchors. Declared once so every canvas-
   adjacent surface mixes consistently against brand DNA. Without these anchors,
   cool-toned brands (blue/green/violet) would produce muddy paper surfaces —
   breaking the studio character. Pattern matches storybook precedent in §8.2. */
--anchor-peach: #f0c8a0; /* base warm canvas */
--anchor-peach-alt: #e8b88e; /* slightly darker, image-placeholder surface */
--anchor-cream: #f7dec6; /* slightly lighter, gentle layering */

/* Warm surfaces — brand-primary mixes low into the anchor so brand DNA influences
   temperature without overwriting the paper register. */
--surface-paper: color-mix(in srgb, var(--brand-primary) 18%, var(--anchor-peach));
--surface-paper-alt: color-mix(in srgb, var(--brand-primary) 22%, var(--anchor-peach-alt));
--surface-cream: color-mix(in srgb, var(--brand-primary) 12%, var(--anchor-cream));

/* Border weights — the signature is 3px solid, doubled via offset ghost border */
--border-stroke: 3px solid var(--ink);
--border-stroke-thin: 2px solid var(--ink);
--offset-ghost: 6px; /* distance the ::before ghost border offsets down-right */
--offset-ghost-lg: 8px; /* larger offset for hero / contact-block cards */

/* Rotation budget — adjacent elements alternate sign, never exceed ±3deg */
--tilt-xs: 0.5deg;
--tilt-sm: 1deg;
--tilt-md: 2deg;
--tilt-lg: 3deg;

/* Spacing — slide / card padding scale, in rem */
--pad-card: 1.5rem;
--pad-card-lg: 2rem 3rem;
--gap-sm: 1.5rem;
--gap-md: 2rem;
--gap-lg: 3rem;

/* Decoration — asymmetric organic radii reused across blobs and frames */
--radius-blob-organic: 40% 60% 70% 30% / 40% 50% 60% 50%;
--radius-blob-fill: 60% 40% 30% 70% / 60% 30% 70% 40%;
--radius-blob-pebble: 255px 15px 225px 15px / 15px 225px 15px 255px;
```

## §D Font pairing fallback (if brand fonts not on Google Fonts)

Playful forces Syne display + Space Grotesk body regardless of site DNA — the studio register depends on Syne's quirky humanist proportions and negative tracking. Fallbacks below trigger only if the primary face fails to load.

- **display**: `'Syne'` · `'Fraunces'` · `'Recoleta'` wght 800
- **body**: `'Space Grotesk'` · `'Inter'` · `'IBM Plex Sans'` wght 400
- **mono**: `'Space Mono'` · `'JetBrains Mono'` wght 500

## §T Type-role atlas (Phase 4b reads this to size text correctly)

The atlas is the **sole authoring source** for non-component text. Do NOT invent ad-hoc sizes — Playful's character collapses if Syne drifts below weight 700 at display scale or if negative tracking is dropped.

```type-roles
[
  {
    "id": "display-hero",
    "family": "display",
    "purpose": "oversized cover or opening date/title — Syne 800 with maximal negative tracking",
    "px_min": 64, "px_max": 144, "weight": 800, "leading": "0.9", "tracking": "-0.03em", "case": "sentence",
    "sample_html": "<div class=\"t-trole-display-hero\">02.05.26</div>"
  },
  {
    "id": "display",
    "family": "display",
    "purpose": "closing or major declarative headline (Syne 800)",
    "px_min": 48, "px_max": 112, "weight": 800, "leading": "0.9", "tracking": "-0.02em", "case": "sentence",
    "sample_html": "<div class=\"t-trole-display\">Thank you. Let us talk.</div>"
  },
  {
    "id": "headline",
    "family": "display",
    "purpose": "primary section headline (Syne 700)",
    "px_min": 40, "px_max": 80, "weight": 700, "leading": "1", "tracking": "-0.01em", "case": "sentence",
    "sample_html": "<div class=\"t-trole-headline\">Section title</div>"
  },
  {
    "id": "statement",
    "family": "display",
    "purpose": "long-form quoted statement or manifesto line (Syne 700)",
    "px_min": 40, "px_max": 72, "weight": 700, "leading": "1.1", "tracking": "-0.01em", "case": "sentence",
    "sample_html": "<div class=\"t-trole-statement\">We believe in raw expression over polished perfection.</div>"
  },
  {
    "id": "title",
    "family": "display",
    "purpose": "region or section title within a slide (Syne 700)",
    "px_min": 32, "px_max": 56, "weight": 700, "leading": "1.1", "tracking": "-0.01em", "case": "sentence",
    "sample_html": "<div class=\"t-trole-title\">Region title</div>"
  },
  {
    "id": "title-sm",
    "family": "display",
    "purpose": "card title within a small block (Syne 700)",
    "px_min": 26, "px_max": 30, "weight": 700, "leading": "1.2", "tracking": "0", "case": "sentence",
    "sample_html": "<div class=\"t-trole-title-sm\">Card title</div>"
  },
  {
    "id": "number-hero",
    "family": "display",
    "purpose": "hero statistic numeral (Syne 800) — may carry ±0.5–1deg micro-rotation",
    "px_min": 64, "px_max": 112, "weight": 800, "leading": "1", "tracking": "-0.02em", "case": "upper",
    "sample_html": "<div class=\"t-trole-number-hero\">47</div>"
  },
  {
    "id": "number-md",
    "family": "display",
    "purpose": "mid-scale ordinal or stat numeral (Syne 800)",
    "px_min": 36, "px_max": 40, "weight": 800, "leading": "1", "tracking": "-0.01em", "case": "upper",
    "sample_html": "<div class=\"t-trole-number-md\">12</div>"
  },
  {
    "id": "number-sm",
    "family": "display",
    "purpose": "inline ordinal or step numeral (Syne 800)",
    "px_min": 28, "px_max": 32, "weight": 800, "leading": "1", "tracking": "0", "case": "upper",
    "sample_html": "<div class=\"t-trole-number-sm\">01</div>"
  },
  {
    "id": "body-md",
    "family": "body",
    "purpose": "subtitle or emphasized lead body (Space Grotesk 500)",
    "px_min": 28, "px_max": 30, "weight": 500, "leading": "1.6", "tracking": "0", "case": "sentence",
    "sample_html": "<p class=\"t-trole-body-md\">An emphasized lead paragraph — Space Grotesk 500, slightly larger than default body, carries the subtitle voice.</p>"
  },
  {
    "id": "label-eyebrow",
    "family": "body",
    "purpose": "eyebrow label above a headline — uppercase, tracked 0.15em (Space Grotesk 600)",
    "px_min": 24, "px_max": 25, "weight": 600, "leading": "1.2", "tracking": "0.15em", "case": "upper",
    "sample_html": "<div class=\"t-trole-label-eyebrow\">Overview</div>"
  },
  {
    "id": "vertical-spine",
    "family": "display",
    "purpose": "magazine-spine wayfinder — Syne 700 rotated 90deg, anchored to slide edge",
    "px_min": 24, "px_max": 26, "weight": 700, "leading": "1.2", "tracking": "0.1em", "case": "upper",
    "sample_html": "<div><span class=\"t-trole-vertical-spine\">Scroll down</span></div>"
  }
]
```

## §E Motion (GSAP consts — REPLACES site ease)

```js
const EASE = {
  entry: "back.out(1.4)", // hand-placed arrival with mild overshoot — studio register
  emphasis: "back.out(1.7)", // pronounced overshoot on focal beats (stat reveal, hero pop)
  exit: "power2.in", // gentle accelerate-off, no overshoot
  drift: "sine.inOut", // ghost-blob drift, scribble pen-on, ambient sway
};
const DUR = {
  snap: 0.18,
  med: 0.5,
  slow: 0.9,
};
// RULE: alternate rotation sign across adjacent elements. If card A enters with
//       rotation +0.8deg, the next card enters with -0.5deg (or +0.3deg).
//       Same-sign neighbors read as a tilted canvas, not as hand-placement.
// RULE: never tween beyond ±3deg. The hand-placed feeling tips into wonky past
//       3 degrees. Rest pose should sit within ±0.5 to ±3deg.
// RULE: never use blur / drop-shadow / backdrop-filter on entry. Depth comes
//       from offset ghost borders + rotation. Blurs break the hand-drawn aesthetic.
// RULE: scribble SVG pen-on uses strokeDashoffset tween with EASE.drift
//       over DUR.slow — never EASE.entry (back.out makes pen lines feel mechanical).
```

### §E.5 Motion choreography

Scribble pen-on: hero-tier scenes only; secondary scribbles snap visible with their card. Ghost-blob drift: 12-20s sine.inOut, max ±1deg / ±20px translate. Stagger: 180-260ms between elements; total scene-in stagger ≤ 700ms.

## §G Voice transform recipe (apply to brand's voice from §1 DNA)

Take the brand's product description / value prop. Transform with:

1. Keep imperative verbs and proper nouns; drop filler ("really", "very", "just"), drop articles when the line can read as a fragment.
2. Hero headlines: 4-8 words, sentence case (NOT uppercase — uppercase belongs to eyebrow labels only). Syne 800 with negative tracking carries the voice.
3. Eyebrow labels / chips: UPPERCASE with 0.15em tracking (Space Grotesk 600 treatment). Short — 1-3 words.
4. Body copy: sentence case, conversational. Pretend you're writing in a studio sketchbook to a friend, not pitching a board.
5. Stats: bare numeral (Syne 800) + a one-sentence supporting label in sentence case. Never UPPERCASE the label.
6. CTAs: 2-3 word sentence-case verb phrase ("Let us talk", "Start the work", "Say hello"). Charcoal text on outlined card, peach text on filled card.

**Example:**

- IN: `Figma helps teams design products collaboratively in real time`
- OUT: hero=`Teams design together, in real time.` / chip=`REAL-TIME COLLAB` / cta=`Start the work`

## §H Scene composition hints (Phase 4b layout guidance)

**Surface alternation across scenes**

- Default scene: `--surface-paper` (brand-tinted peach) full-bleed background. Most scenes sit here.
- Variant scene: `filled-block` inverted (charcoal ground + peach text on top) for emphasis — reserve for ONE scene per video, the anchor moment.
- Variant scene: `--surface-cream` (slightly lighter) for gentle layering when a region needs to lift one tonal step without introducing white.
- Never introduce white as a surface. The warm canvas is foundational.
- Alternate paper → paper-alt → cream across scenes if all scenes are outlined; insert the single filled-block scene as the anchor beat.

**Hero text**

- One Syne 800 hero moment per scene. Negative letter-spacing (-0.02em to -0.03em). Always `var(--ink)` color on warm surfaces, `var(--canvas)` on filled-block scenes.
- Hero takes ≥ 50% canvas width. Never two hero-tier elements per scene.
- Headlines NEVER tinted with brand color — they stay ink. Brand color appears in accent moments (scribbles tinted to brand-primary if narrative beat justifies, stat numerals can flex to brand-primary on the focal stat).

**Brand color placement (role contract)**

- Default: ink-on-paper. Brand colors do NOT replace ink for body / headline / border / scribble. The system is anchored monochrome.
- Brand-primary may appear as: focal stat numeral fill (one per scene max), scribble stroke (one per scene max as accent), chip text on a filled chip, or as the tint that warms `--surface-paper` via the §B mixes.
- Brand-secondary / brand-accent appear only via the §B surface mixes — they tint the paper, never appear as standalone fills.
- One scene = ink-dominant, brand-primary as accent. Two brand colors in the foreground at once breaks the monochrome discipline.

**Rotation discipline**

- Every card / block / stat / step-node carries a rotation in ±0.5deg to ±3deg.
- Adjacent elements alternate sign. Sequence: -0.5, +0.8, -0.3, +0.5, -0.7 (never +0.5, +0.3, +0.8 in a row).
- The vertical-spine label is the only exception — it's anchored at exactly 90deg.
- Charts, timelines, and grid containers themselves do NOT rotate; only their cells / nodes / bars.

**Decoration vocabulary (every scene picks 1-2, never 4+)**

- Scribble SVG mark in a corner (squiggle, star, circle, arrow). 2px stroke, rounded line-caps, ink color.
- Doodle circle or rect anchored in a corner (3px outlined, rotated).
- Blob-frame with solid blob-fill inside (portrait stand-in for hero / contact scenes).
- Ghost-blob (0.08 opacity oversized organic). Max one per scene, in a corner the content does not occupy.
- Vertical-spine label on the right edge — reserve for hero / chapter scenes.

**Border + shape discipline**

- Border radius is sharp 0px (cards / blocks / tags), 50% (avatars / step-nodes / doodle-circles), or asymmetric organic (blobs only). Never 4px / 8px / 12px — middle radii read as generic web app.
- Border weight is 3px on outlined cards and blob frames; 2px on offset ghost borders, nav chrome, and timeline tracks; 2px stroke on SVG scribbles. No 1px hairlines.

**Transitions between scenes**

- Cross-fade 0.6s opacity. Never slide, blur, dissolve, or hard-cut.
- A single scribble pen-on at the start of the scene can serve as the "we arrived" beat.

**Ambient motion**

- Ghost-blob slow drift (12-20s sine.inOut) on heavy-negative-space scenes.
- Scribble pen-on (strokeDashoffset over DUR.slow with sine.inOut) on hero scenes.
- Cards / blocks / stats DO NOT drift after entry — they snap to their rotated rest pose and stay.

## §I Page-level CSS (overrides design.html's neutral chrome — makes the doc itself read as playful)

```css
/* ── Preset-native typography vars — doc chrome + .preset-native-scope (Syne / Space Grotesk / Space Mono). */
:root {
  --f-disp-native:
    "Syne", "Fraunces", "Recoleta", -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  --f-body-native:
    "Space Grotesk", "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, system-ui,
    sans-serif;
  --f-script-native:
    "Syne", "Fraunces", "Recoleta", -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  --f-mono-native:
    "Space Mono", "JetBrains Mono", "IBM Plex Mono", "Menlo", ui-monospace, monospace;
}

/* .preset-native-scope: rebinds var(--font-*) to native families for §6 previews + §T atlas. */
.preset-native-scope {
  --font-display: var(--f-disp-native);
  --font-body: var(--f-body-native);
  --font-script: var(--f-script-native);
  --font-mono: var(--f-mono-native);
}

body {
  background: var(--anchor-peach);
  color: var(--ink);
  font-family: "Space Grotesk", sans-serif;
}
.title-card {
  background: var(--anchor-peach);
  border-bottom: 3px solid var(--ink);
  padding: 88px 0 72px;
}
.title-display {
  font-family: "Syne", sans-serif;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--ink);
}
.brand-name {
  font-family: "Syne", sans-serif;
  font-weight: 800;
  color: var(--ink);
}
.style-name {
  font-family: "Syne", sans-serif;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--ink);
}
.ds-section {
  border-top: 3px solid var(--ink);
  padding: 72px 0;
}
h2 {
  font-family: "Syne", sans-serif;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--ink);
}
.eyebrow {
  font-family: "Space Grotesk", sans-serif;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--ink);
  opacity: 0.7;
}
.type-card,
.voice-pair,
.comp-card {
  border: 3px solid var(--ink) !important;
  border-radius: 0 !important;
  box-shadow: none !important;
  background: var(--anchor-peach) !important;
  position: relative;
}
/* dna-swatch keeps inline brand color; only border + ghost stay */
.dna-swatch {
  border: 3px solid var(--ink) !important;
  border-radius: 0 !important;
  box-shadow: none !important;
  position: relative;
}
.dna-swatch::before,
.type-card::before,
.voice-pair::before,
.comp-card::before {
  /* Double-stroke offset ghost border — the system's signature elevation. */
  content: "";
  position: absolute;
  top: 6px;
  left: 6px;
  right: -6px;
  bottom: -6px;
  border: 2px solid var(--ink);
  z-index: -1;
  pointer-events: none;
}
.comp-head {
  background: var(--ink) !important;
  color: var(--anchor-peach) !important;
  border-bottom: 3px solid var(--ink) !important;
  font-family: "Syne", sans-serif;
  font-weight: 700;
}
.ds-code {
  background: var(--anchor-cream) !important;
  border: 3px solid var(--ink);
  border-radius: 0 !important;
  color: var(--ink) !important;
  font-family: "Space Mono", monospace;
}

/* ── §T Type-role atlas container. */
.ds-trole-box {
  display: flex;
  flex-direction: column;
  border: 3px solid var(--ink);
  border-radius: 0;
  background: var(--anchor-peach);
  overflow: hidden;
  margin-top: 24px;
}
.ds-trole-row {
  padding: 28px 32px;
  border-bottom: 2px solid var(--ink);
}
.ds-trole-row:last-child {
  border-bottom: 0;
}
.ds-trole-sample {
  min-width: 0;
  overflow-wrap: anywhere;
}
@media (max-width: 960px) {
  .ds-trole-row {
    padding: 24px;
  }
}

/* ── Type-role samples. var(--font-*) resolves to brand DNA; ink-on-paper monochrome contract. */
.t-trole-display-hero {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(64px, 10vw, 144px);
  line-height: 0.9;
  letter-spacing: -0.03em;
  color: var(--ink);
}
.t-trole-display {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(48px, 8vw, 112px);
  line-height: 0.9;
  letter-spacing: -0.02em;
  color: var(--ink);
}
.t-trole-headline {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(40px, 6vw, 80px);
  line-height: 1;
  letter-spacing: -0.01em;
  color: var(--ink);
}
.t-trole-statement {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(40px, 5vw, 72px);
  line-height: 1.1;
  letter-spacing: -0.01em;
  color: var(--ink);
  max-width: 24ch;
}
.t-trole-title {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(32px, 4vw, 56px);
  line-height: 1.1;
  letter-spacing: -0.01em;
  color: var(--ink);
}
.t-trole-title-sm {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(26px, 2vw, 30px);
  line-height: 1.2;
  color: var(--ink);
}
.t-trole-number-hero {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(64px, 8vw, 112px);
  line-height: 1;
  letter-spacing: -0.02em;
  color: var(--ink);
  transform: rotate(-0.8deg);
  display: inline-block;
}
.t-trole-number-md {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 40px;
  line-height: 1;
  letter-spacing: -0.01em;
  color: var(--ink);
}
.t-trole-number-sm {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 32px;
  line-height: 1;
  color: var(--ink);
}
.t-trole-body-md {
  font-family: var(--font-body);
  font-weight: 500;
  font-size: clamp(28px, 2.2vw, 30px);
  line-height: 1.6;
  color: var(--ink);
  max-width: 50ch;
  margin: 0;
}
.t-trole-label-eyebrow {
  font-family: var(--font-body);
  font-weight: 600;
  font-size: clamp(24px, 1.8vw, 25px);
  line-height: 1.2;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--ink);
  opacity: 0.7;
}
.t-trole-vertical-spine {
  display: inline-block;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(24px, 1.9vw, 26px);
  line-height: 1.2;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink);
  transform: rotate(90deg);
  transform-origin: left center;
  margin-left: 1em;
}
```
