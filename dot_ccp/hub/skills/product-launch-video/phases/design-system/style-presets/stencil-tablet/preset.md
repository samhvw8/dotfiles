```preset-meta
{
  "name": "stencil-tablet",
  "label": "Stencil & Tablet",
  "fingerprint": {
    "shadow": "none-flat",
    "border": "rounded-tablet",
    "motion": "considered-stamp",
    "density": "filled-tile",
    "contrast": "earthy-saturated",
    "type": "stencil-display + condensed-chrome",
    "palette-mode": "hue-anchored-neutrals + brand-saturated-tiles"
  },
  "match_signals": [
    { "kind": "condensed_display", "weight": 0.3 },
    { "kind": "minimal_decoration", "weight": 0.15 },
    { "kind": "high_sat_accent", "weight": 0.2 },
    { "kind": "hairline_border", "weight": 0.1 }
  ],
  "best_for": ["museum / cultural-institution decks", "art / architecture brands", "longform research", "heritage and craft brands", "manifestos"],
  "avoid_for": ["digital-native polished", "playful pop", "soft consumer SaaS", "fintech / enterprise"],
  "chromeFonts": {
    "googleFontsHref": "https://fonts.googleapis.com/css2?family=Stardos+Stencil:wght@400;700&family=Bowlby+One&family=Barlow+Condensed:wght@500;600;700;800;900&family=Inter:wght@400;500;600&display=swap",
    "display": "Stardos Stencil",
    "body": "Inter",
    "script": "Bowlby One",
    "mono": "Barlow Condensed"
  }
}
```

> `chromeFonts` makes the doc chrome render in the preset's native fonts; brand fonts still apply to §6 components. The `mono` slot binds Barlow Condensed (chrome / pill / legend voice); the `script` slot binds Bowlby One (320px quote-mark glyph only — no other handwritten register permitted).

## §A Director's intent

Stardos Stencil carries every headline and numeral with its characteristic ink-break gaps; Barlow Condensed extra-heavy runs all uppercase chrome, metadata, pills, and legends; Inter handles sentence-case body paragraphs.

Depth is **flat by design** — no drop shadows, no gradients. Depth comes from saturated color blocks against a warm bone field and from generous 22-26px tablet radii. Cards tile the canvas geometrically.

The system's identity hinges on **warm neutrals** (bone / paper) tinted with brand DNA, not on a fixed palette. The bone and paper anchors are declared as hue-anchor hexes in §B (§8.2 exception) so the archival register survives any brand color; brand-primary / -secondary / -accent ignite tablets, action-bars, section numerals, and pills as the saturated tile fills.

Type runs **huge and uppercase**: cover hero 220px, section-divider numeral 540px, tablet numerals 220px, stats 160px. Scale is the primary expressive tool, color is secondary. Stencil ink-break glyphs are non-negotiable on every headline; Barlow Condensed without ≥0.04em tracking reads as broken.

Motion is **considered and declarative** — stamped, not glided. Headlines arrive with `power2.out` / `expo.out` (no overshoot, no bounce); numerals reveal with stepped emphasis (`steps()`) to feel printed rather than animated. Scene transitions are hard cuts or slow paper-wipe — never crossfade.

**Class prefix `stn-`** (4 chars, lowercase-dash). Every component class is namespaced `stn-*`.

## §B Decoration tokens (merge into design.html `:root`)

Stencil & Tablet declares **structural** tokens here (radii, pixel-tight pads, hairline borders, gap units) and **two hue-anchor hexes** for bone + paper. Color of tile fills, headlines, numerals, and pills flows from site brand DNA — `--brand-primary` / `--brand-secondary` / `--brand-accent` carry the saturated work.

```css
/*
  §8.2 exception: warm-neutral hue anchors.
  The stencil-tablet identity depends on a warm bone field and a slightly-lighter
  paper card surface. Brand DNA's --canvas / --ink alone can't carry this — a
  cool or pure-white --canvas would break the archival, kraft-paper register
  every Stencil & Tablet slide depends on. Mixed with brand colors via
  color-mix(), these anchors keep bone/paper readable as bone/paper regardless
  of brand temperature.
*/
--anchor-bone: #e2dcc9; /* warm cream — default page field */
--anchor-paper: #f4efe0; /* lighter cream — secondary card surface */

/* Bone / paper surfaces, tinted slightly toward the brand so the archival
   neutral inherits site temperature without losing its warmth. */
--surface-bone: color-mix(in srgb, var(--brand-primary) 6%, var(--anchor-bone));
--surface-paper: color-mix(in srgb, var(--brand-primary) 4%, var(--anchor-paper));

/* Card radii — tablet register is non-optional. Square corners break the system. */
--radius-tablet: 26px; /* tablet cards, principles cards, quote panel, CTA panels */
--radius-card: 22px; /* generic cards, action bars, process nodes, matrix table, stats */
--radius-timeline: 18px;
--radius-mark: 14px; /* small lockup square */
--radius-pill: 999px; /* status pills */

/* Gap + pad scale — bone field visible BETWEEN cards is structural. */
--gap-card: 24px; /* standard between cards */
--gap-card-tight: 22px; /* dense grids (5-up process flow) */
--gap-card-loose: 28px; /* breathy two-up / four-up */
--pad-outer: 64px; /* slide left/right inset */
--pad-top: 48px; /* top chrome inset */
--pad-bottom: 36px; /* bottom chrome inset */
--pad-card: 32px; /* standard card interior */
--pad-card-tablet: 38px 32px 32px; /* tablet card — extra top for the numeral */

/* Hairlines + dividers — the matrix is the densest table; hairlines must
   read at 1920×1080 without box-shadow help. */
--rule-hairline: 1.5px solid color-mix(in srgb, var(--ink) 35%, transparent);
--rule-dashed: 1px dashed color-mix(in srgb, var(--ink) 30%, transparent);
--rule-divider: 2px solid var(--ink); /* chart axes, action-bar vertical separator */

/* Stencil tracking presets — Barlow Condensed without tracking reads as broken. */
--track-chrome: 0.04em;
--track-chrome-loose: 0.08em;
--track-eyebrow: 0.14em;
--track-stencil-tight: -0.02em; /* numerals at large scale */
--track-stencil-headline: -0.005em; /* stencil headlines */
```

## §D Font pairing fallback (if brand fonts not on Google Fonts)

Stencil & Tablet forces stencil display + condensed chrome regardless of site DNA — the system's identity is the ink-break stencil glyph and the tall condensed uppercase chrome. Fallbacks below are used only if the primary face fails to load.

- **display**: `'Stardos Stencil'` · `'Allerta Stencil'` · `'Black Ops One'` wght 700
- **body**: `'Inter'` · `'IBM Plex Sans'` · `'Source Sans 3'` wght 400
- **mono**: `'Barlow Condensed'` · `'Oswald'` · `'Archivo Narrow'` wght 800

**Note:** `mono` slot is **deliberately not monospaced** — Stencil & Tablet has no mono role. Barlow Condensed sits in the mono slot because the preset uses it as the chrome / pill / legend voice (a condensed extra-heavy uppercase grotesque), playing the role mono plays in other presets (small labels, technical metadata). Build pipeline reads the third bullet for "small chrome labels"; we hand it Barlow.

## §T Type-role atlas (Phase 4b reads this to size text correctly)

The atlas is the **sole authoring source** for non-component text — do NOT invent ad-hoc sizes. Stencil & Tablet's identity collapses if numerals drop below 160px or if Barlow Condensed runs without ≥0.04em tracking.

```type-roles
[
  {
    "id": "cover-hero",
    "family": "display",
    "purpose": "cover headline at maximum stencil scale — ink-break glyphs carry the system",
    "px_min": 140, "px_max": 220, "weight": 700, "leading": "0.82", "tracking": "-0.015em", "case": "upper",
    "sample_html": "<div class=\"t-trole-cover-hero\">{BRAND_NAME}</div>"
  },
  {
    "id": "numeral-mega",
    "family": "display",
    "purpose": "section-divider numeral — fills half the canvas on dark fields only",
    "px_min": 360, "px_max": 540, "weight": 700, "leading": "0.8", "tracking": "-0.02em", "case": "upper",
    "sample_html": "<div class=\"t-trole-numeral-mega\">01</div>"
  },
  {
    "id": "numeral-tablet",
    "family": "display",
    "purpose": "primary numeral inside a tablet card — defining feature of the tablet form",
    "px_min": 160, "px_max": 240, "weight": 700, "leading": "0.85", "tracking": "-0.02em", "case": "upper",
    "sample_html": "<div class=\"t-trole-numeral-tablet\">04</div>"
  },
  {
    "id": "numeral-stat",
    "family": "display",
    "purpose": "statistical numeral with optional Barlow superscript suffix (%, ×, K, M)",
    "px_min": 120, "px_max": 160, "weight": 700, "leading": "0.85", "tracking": "-0.02em", "case": "upper",
    "sample_html": "<div class=\"t-trole-numeral-stat\">99<sup>%</sup></div>"
  },
  {
    "id": "section-headline",
    "family": "display",
    "purpose": "headline on a section-divider slide (pairs with the 540px numeral)",
    "px_min": 92, "px_max": 120, "weight": 700, "leading": "0.92", "tracking": "-0.005em", "case": "upper",
    "sample_html": "<div class=\"t-trole-section-headline\">Manifesto</div>"
  },
  {
    "id": "page-headline",
    "family": "display",
    "purpose": "standard slide headline (Stardos uppercase, ink-break glyphs)",
    "px_min": 64, "px_max": 92, "weight": 700, "leading": "0.92", "tracking": "-0.01em", "case": "upper",
    "sample_html": "<div class=\"t-trole-page-headline\">Section title</div>"
  },
  {
    "id": "quote-text",
    "family": "display",
    "purpose": "pull-quote body inside a quote panel — paired with the Bowlby quote-mark",
    "px_min": 44, "px_max": 60, "weight": 400, "leading": "1.05", "tracking": "-0.005em", "case": "upper",
    "sample_html": "<div class=\"t-trole-quote-text\">Stamped, signed, framed. The poster is the message.</div>"
  },
  {
    "id": "quote-mark",
    "family": "script",
    "purpose": "single 320px Bowlby One quote glyph beside the quote-text — the only Bowlby use",
    "px_min": 200, "px_max": 320, "weight": 700, "leading": "0.8", "tracking": "0", "case": "upper",
    "sample_html": "<div class=\"t-trole-quote-mark\">“</div>"
  },
  {
    "id": "card-headline",
    "family": "display",
    "purpose": "headline inside an action bar or tablet sub-headline (Stardos uppercase)",
    "px_min": 28, "px_max": 34, "weight": 700, "leading": "1.15", "tracking": "-0.005em", "case": "upper",
    "sample_html": "<div class=\"t-trole-card-headline\">Action bar headline</div>"
  },
  {
    "id": "matrix-row",
    "family": "display",
    "purpose": "matrix row-label cell (Stardos uppercase, positive tracking for legibility)",
    "px_min": 24, "px_max": 30, "weight": 700, "leading": "1.1", "tracking": "0.01em", "case": "upper",
    "sample_html": "<div class=\"t-trole-matrix-row\">Row label</div>"
  },
  {
    "id": "pill",
    "family": "mono",
    "purpose": "matrix status pill (teal=yes, mustard=partial, magenta=no, paper-bordered=note)",
    "px_min": 24, "px_max": 26, "weight": 700, "leading": "1", "tracking": "0.08em", "case": "upper",
    "sample_html": "<div><span class=\"t-trole-pill\">Partial</span></div>"
  }
]
```

## §E Motion (GSAP consts — REPLACES site ease)

```js
const EASE = {
  entry: "power2.out", // stamped arrival — no overshoot, no glide
  emphasis: "expo.out", // declarative, poster-loud — bigger snap on headlines / numerals
  exit: "power2.in", // accelerate off-canvas
  drift: "sine.inOut", // ambient breathing only (paper-grain shimmer if used)
};
const DUR = {
  snap: 0.18, // labels, pills, chrome
  med: 0.5, // headlines, tablets, action bars
  slow: 0.9, // section-divider 540px numeral, quote panel reveal
};
// RULE: never use back / elastic / bounce — the system reads as "printed," not "elastic."
//       overshoot breaks the stencil register.
// RULE: numeral reveal MAY use steps(6) on opacity / counter values (NOT position) to
//       feel stamped rather than tweened. Apply to {NUM}, {KICKER}, and stat numerals.
// RULE: scene transitions are hard cut OR paper-wipe (1 frame max). Crossfade kills
//       the archival register — slides must feel like turning a page, not dissolving.
// RULE: type-in-motion on stencil headlines MUST stagger by word, never by character.
//       Per-character reveal breaks the ink-break glyph integrity.
```

### §E.5 Motion choreography

**Allowed primitives**

- Stamped headline entry: y +24px → 0 + opacity 0 → 1 on `power2.out`, DUR.med. Stagger by word for multi-line stencil headlines.
- Tablet tile-in: scale 0.96 → 1 + opacity, `expo.out`, DUR.med. Stagger 80-120ms across a tile row.
- Numeral stamp: opacity stepped to 1 via `steps(6)` over DUR.med — feels like a stencil being pressed down rather than animated in.
- Pill / chip reveal: opacity + y +8px → 0 on `power2.out`, DUR.snap.
- Action-bar slide-in: x +40px → 0 + opacity, `expo.out`, DUR.med.
- Quote-mark stamp: scale 1.04 → 1 + opacity, `expo.out`, DUR.slow.
- Ambient: paper-grain opacity shimmer 0.04 → 0.06 (sine.inOut, 6s) on bone surfaces only — optional, very subtle.

**Forbidden**

- Crossfade, dissolve, blur transitions between scenes.
- Back / elastic / bounce on any motion (`back.out`, `elastic.out`).
- Per-character reveal on stencil headlines (breaks ink-break glyph integrity).
- Drop-shadow tweens — the system is flat; introducing shadows for motion drama betrays the preset.
- Rotation > 2deg on cards. Tablets sit square; only `--tilt-` decorative micro-rotations are permitted on stamp-style elements (action-bar tag, date-mark).
- Glow / bloom / filter blur on any element.

**Stagger budget**

180-220ms between elements — slower than 8-bit-orbit (80-120ms), faster than purely-editorial (240-280ms). The "considered" register wants you to feel each element arrive separately. Total scene-in stagger ≤ 700ms.

**Transition between scenes**

- Default: hard cut paired with a single percussive beat on the cut frame.
- Alternative: paper-wipe — a 1-frame 100%-canvas brand-color flash, then cut. Use sparingly (≤ 1 per 60s video) on section beats.

## §G Voice transform recipe (apply to brand's voice from §1 DNA)

Take the brand's product description / value prop. Transform with:

1. Strip filler words and articles where doing so doesn't break the imperative ("we", "really", "very", "the", "a" when not load-bearing).
2. Hero headlines: 2-5 words, UPPERCASE, broken across 2-3 lines via `<br>` — line breaks are part of the composition.
3. Eyebrows / kickers / chrome labels: UPPERCASE BARLOW CONDENSED with ≥0.04em tracking, terse noun phrases ("ISSUE 04", "PHASE II", "AGENCY × PARTNER").
4. Stat numerals: bare digit + Barlow superscript suffix at 40px — `4M`, `99.9%`, `2.4×`. Never spell the unit.
5. Body paragraphs (Inter): sentence case, declarative, considered. One idea per sentence; never more than three sentences per card.
6. Pill / matrix labels: UPPERCASE single noun or 2-word phrase. Color carries semantic — teal=YES, mustard=PARTIAL, magenta=NO, paper-bordered=NOTE.

**Example:**

- IN: `Figma helps teams design products collaboratively in real time`
- OUT: hero=`TEAMS.<br>DESIGN.<br>TOGETHER.` / eyebrow=`ISSUE 01 · REAL-TIME` / body (Inter)=`A shared canvas for product teams. Edit together, ship together — no more handoff drift.`

## §H Scene composition hints (Phase 4b layout guidance)

**Surface alternation across scenes**

- Default scene: `--surface-bone` field (warm cream, brand-tinted) holding rounded tablets + chrome.
- Dark scene: `var(--ink)` field with bone-colored type. Reserved for agenda-style, section-divider, stats-headline, and quote-panel-containing slides. ≥1 dark scene per 60s video, never two consecutive.
- Light card scene: tablets / process nodes / stats grid on bone field.
- Quote scene: a single saturated-brand-color panel filling most of canvas, Bowlby-style chunky quote-mark beside stencil body.

**Brand color placement (role contract)**

- Brand colors **never appear as body text** (Inter). Only as: tile fills, section-divider numeral, action-bar fill, status pill fills, quote-panel fill, accent rules.
- One scene = **one dominant brand color** carrying the focal tile / section numeral / action bar; the other two brand colors appear only as secondary tile fills in a multi-tile grid, or as small accents (legend swatch, divider rule, em-highlight span inside a stencil headline).
- Suggested role mapping: `--brand-primary` → most-used accent (section dividers, principle cards, cover marks); `--brand-secondary` → cover hero em-highlight + quote-panel fill; `--brand-accent` → cool counterpart (process cards, matrix yes-pills).
- Text-on-fill rule: text **never inverts to pure white**. Light text on dark fills is always `var(--surface-bone)` / `var(--anchor-bone)`, never `#fff`. This is the system's only color inversion.

**Hero text / focal element**

- One big stencil moment per scene. Cover hero 220px, section headline 92-120px, tablet numeral 220px, stat numeral 160px, section-divider mega-numeral 540px.
- The 540px section-divider numeral pattern lives **on dark fields only** and pairs with a 120px stencil headline at bottom-right and a small Barlow eyebrow at top-right.
- Never two hero-tier elements per scene. If a scene needs two "loud" moments, demote one to a tablet numeral.

**Tablet doctrine**

- Tablets ALWAYS carry a numeral above their headline. (See tablet.md.)
- Tablet radius is 22-26px; square corners on cards / action bars / pills break the system.
- Tablets tile flat — never stack. No z-index inside tablet grids. Gap between tablets is 22-28px and the bone field showing through IS the layout.

**Pill convention (matrix only)**

- Inside comparison matrices, status pills follow a fixed convention: teal=yes, mustard=partial, magenta=no, paper-bordered=note.
- Outside matrices, pills are decorative and color is interchangeable.

**Density philosophy**

- Filled and confident. A typical scene covers most of the canvas in color blocks. A scene that feels broken in this system is one that's mostly empty bone — the design needs the blocks to hold its identity.
- Exception: section-divider scene, where a single 540px numeral against `var(--ink)` IS the design and emptiness is intentional.

## §I Page-level CSS (overrides design.html's neutral chrome — makes the doc itself read as Stencil & Tablet)

```css
/* ── Preset-native typography vars (chromeFonts.googleFontsHref). */
:root {
  --f-disp-native:
    "Stardos Stencil", "Allerta Stencil", "Black Ops One", "Impact", "Arial Black", serif;
  --f-body-native:
    "Inter", "IBM Plex Sans", "Source Sans 3", -apple-system, BlinkMacSystemFont, system-ui,
    sans-serif;
  --f-script-native:
    "Bowlby One", "Stardos Stencil", "Black Ops One", "Impact", "Arial Black", serif;
  --f-mono-native:
    "Barlow Condensed", "Oswald", "Archivo Narrow", "Helvetica Neue", Arial, sans-serif;
}

/* .preset-native-scope: re-bind var(--font-*) to preset-native families for component
 * previews + §T atlas. Paste-ready component source is untouched — Phase 4b tokens
 * resolve to brand DNA at render time. */
.preset-native-scope {
  --font-display: var(--f-disp-native);
  --font-body: var(--f-body-native);
  --font-script: var(--f-script-native);
  --font-mono: var(--f-mono-native);
}

body {
  background: var(--surface-bone);
}
.title-card {
  background: var(--surface-bone);
  border-bottom: 4px solid var(--ink);
  padding: 96px 0 80px;
}
.title-display {
  text-transform: uppercase;
  letter-spacing: var(--track-stencil-headline);
  color: var(--ink);
}
.brand-name {
  color: var(--brand-primary);
  font-weight: 700;
}
.style-name {
  color: var(--brand-secondary);
  font-weight: 700;
}
.ds-section {
  border-top: var(--rule-hairline);
  padding: 80px 0;
}
h2 {
  text-transform: uppercase;
  letter-spacing: var(--track-stencil-headline);
  color: var(--ink);
}
.eyebrow {
  color: color-mix(in srgb, var(--ink) 70%, transparent);
  font-weight: 800;
  letter-spacing: var(--track-eyebrow);
  text-transform: uppercase;
}
.type-card,
.voice-pair,
.comp-card {
  border-radius: var(--radius-card) !important;
  border: none !important;
  background: var(--surface-paper) !important;
  box-shadow: none !important;
}
/* dna-swatch keeps inline brand-color background */
.dna-swatch {
  border-radius: var(--radius-card) !important;
  border: none !important;
  box-shadow: none !important;
}
.comp-head {
  background: var(--ink) !important;
  color: var(--anchor-bone) !important;
  text-transform: uppercase !important;
  letter-spacing: var(--track-chrome) !important;
  border-bottom: none !important;
}
.ds-code {
  background: var(--surface-paper) !important;
  border: var(--rule-hairline);
  border-radius: var(--radius-card) !important;
  color: var(--ink) !important;
}

/* ── §T Type-role atlas. Container = flat paper card with hairline border.
 * Each .t-trole-* class encodes the role's family / size / weight / leading /
 * tracking / case / decoration. Family selectors use var(--font-*) tokens so
 * the atlas renders in BRAND DNA fonts; only the recipe is preset-declared.
 * Decoration (color, suffix, pill bg, rotation) stays declared with hard-coded
 * Stencil & Tablet tokens (var(--brand-primary), var(--ink), etc). */
.ds-trole-box {
  display: flex;
  flex-direction: column;
  border: var(--rule-hairline);
  border-radius: var(--radius-card);
  background: var(--surface-paper);
  overflow: hidden;
  margin-top: 24px;
}
.ds-trole-row {
  padding: 28px 32px;
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

/* ── Type-role samples. var(--font-display/body/mono/script) resolves to brand
 * DNA. Color uses Stencil & Tablet's contract: ink on light, brand-primary as
 * accent, bone on dark fills. Numerals always weight 700 with negative
 * tracking; Barlow chrome always tracked ≥0.04em. */
.t-trole-cover-hero {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(140px, 14vw, 220px);
  line-height: 0.82;
  letter-spacing: -0.015em;
  text-transform: uppercase;
  color: var(--ink);
}
.t-trole-numeral-mega {
  display: inline-block;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(240px, 30vw, 540px);
  line-height: 0.8;
  letter-spacing: -0.02em;
  text-transform: uppercase;
  color: var(--brand-primary);
  background: var(--ink);
  padding: 32px 48px;
  border-radius: var(--radius-card);
}
.t-trole-numeral-tablet {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(160px, 18vw, 240px);
  line-height: 0.85;
  letter-spacing: -0.02em;
  text-transform: uppercase;
  color: var(--ink);
}
.t-trole-numeral-stat {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(120px, 14vw, 160px);
  line-height: 0.85;
  letter-spacing: -0.02em;
  text-transform: uppercase;
  color: var(--ink);
}
.t-trole-numeral-stat sup {
  font-family: var(--font-mono);
  font-weight: 800;
  font-size: 0.25em;
  vertical-align: top;
  letter-spacing: 0.04em;
  margin-left: 0.08em;
  text-transform: uppercase;
}
.t-trole-section-headline {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(92px, 10vw, 120px);
  line-height: 0.92;
  letter-spacing: -0.005em;
  text-transform: uppercase;
  color: var(--ink);
}
.t-trole-page-headline {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(64px, 7vw, 92px);
  line-height: 0.92;
  letter-spacing: -0.01em;
  text-transform: uppercase;
  color: var(--ink);
}
.t-trole-quote-text {
  display: inline-block;
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(44px, 5vw, 60px);
  line-height: 1.05;
  letter-spacing: -0.005em;
  text-transform: uppercase;
  color: var(--anchor-bone);
  background: var(--brand-secondary, var(--brand-primary));
  padding: 24px 32px;
  border-radius: var(--radius-tablet);
  max-width: 28ch;
}
.t-trole-quote-mark {
  display: inline-block;
  font-family: var(--font-script);
  font-weight: 700;
  font-size: clamp(200px, 22vw, 320px);
  line-height: 0.8;
  letter-spacing: 0;
  color: var(--brand-secondary, var(--brand-primary));
}
.t-trole-card-headline {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(28px, 2.6vw, 34px);
  line-height: 1.15;
  letter-spacing: -0.005em;
  text-transform: uppercase;
  color: var(--ink);
}
.t-trole-matrix-row {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(24px, 2.2vw, 30px);
  line-height: 1.1;
  letter-spacing: 0.01em;
  text-transform: uppercase;
  color: var(--ink);
}
.t-trole-pill {
  display: inline-block;
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: clamp(24px, 1.4vw, 26px);
  line-height: 1;
  letter-spacing: var(--track-chrome-loose);
  text-transform: uppercase;
  background: var(--brand-primary);
  color: var(--ink);
  padding: 6px 16px;
  border-radius: var(--radius-pill);
}
```
