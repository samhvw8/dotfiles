```preset-meta
{
  "name": "soft-editorial",
  "label": "Soft Editorial",
  "fingerprint": {
    "edges": "soft-rounded",
    "shadow": "none",
    "rules": "1px-dashed-warm-ink",
    "surfaces": "translucent-white-and-pastel-cards",
    "ornament": "drop-cap-and-roman-numerals",
    "type": "old-style-serif-mixed-roman-italic",
    "voice": "literary-considered-unhurried",
    "register": "small-press-quarterly"
  },
  "match_signals": [
    { "kind": "serif_display",       "weight": 0.28 },
    { "kind": "hairline_border",     "weight": 0.18 },
    { "kind": "low_saturation",      "weight": 0.22 },
    { "kind": "minimal_decoration",  "weight": 0.20 }
  ],
  "best_for": ["founder essays", "gallery / museum", "advisory", "longform brand stories", "lifestyle media", "research notebooks"],
  "avoid_for": ["visual heat", "declarative punch", "sales-urgent brands", "high-energy consumer hype"],
  "chromeFonts": {
    "googleFontsHref": "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=Work+Sans:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap",
    "display": "Cormorant Garamond",
    "body": "Work Sans",
    "script": "Cormorant Garamond",
    "mono": "JetBrains Mono"
  }
}
```

> `chromeFonts` makes the doc chrome render in the preset's native fonts; brand fonts still apply to §6 components. The `script` slot points at Cormorant Garamond because italic IS the system's intimate / personal voice — no third face.

## §A Director's intent

A warm small-press literary quarterly. Cream paper field, Cormorant Garamond carrying every headline and ornamental moment, Work Sans receding into body. Generous rounded cards (24–36px radius) float as translucent white over the cream — depth is implied by translucency and form, never by shadow.

**Typographic signal: mixed weight inside the headline.** A serif headline at weight 500 carries an `<em>` that drops to weight 400 italic — the italic phrase is a _lighter_ weight of the same family. The weight drop is a softening, not bold emphasis. This is opposite the magazine convention of italic-for-bold; here italic is the more intimate tone.

**Color philosophy: cream plus five pastels.** The cream paper field (`--paper-anchor`, a warm aged cream) is the constant under every surface — pastels appear only as card fills, never as the slide background. Pastel slots are interchangeable card paints: none carries a fixed semantic role outside matrix layouts. Text stays in `--ink` on every surface — soft-editorial never inverts to white on pastel.

Motion is unhurried: soft `power2.out` arrivals, no overshoot, no bounce. Stagger budgets stretch toward the editorial upper band (200–280ms between siblings); even snap durations are slow by other-preset standards. Class prefix: `se-`.

## §B Decoration tokens (merge into design.html `:root`)

Spacing in `vw` so ratios scale identically across the design.html preview and the 1920×1080 video canvas. Card radii in px — soft-editorial's identity _is_ the radius value, not a relative softness.

```css
/* §8.2 hue-anchor exception: warm cream paper.
   Soft Editorial's identity is the cream paper field — without this anchor,
   dark or saturated brand DNA would override the surface entirely and erase
   the "magazine paper" register. Mixed with brand-accent for surface tints;
   referenced directly when a literal cream field is required. */
--paper-anchor: #f2eedf;

/* Surfaces — translucent white floats on the cream field; the cream shows
   through, which is how soft-editorial signals "lifted" without a shadow. */
--surface-card: rgba(255, 255, 255, 0.55);
--surface-paper: color-mix(in srgb, var(--brand-accent) 8%, var(--paper-anchor));

/* Hairlines — 1px dashed warm ink at low opacity. The notebook-margin feel.
   1.5px solid for slightly heavier dividers (matrix head-rows, column rules). */
--rule-dashed: 1px dashed color-mix(in srgb, var(--ink) 18%, transparent);
--rule-solid: 1.5px solid color-mix(in srgb, var(--ink) 35%, transparent);

/* Border-radius scale — soft-editorial has NO square corners. */
--radius-card-lg: 36px; /* large insight / closer / stat cards */
--radius-card: 28px; /* default cards, items, process nodes */
--radius-card-sm: 24px; /* compact panels, action bars */
--radius-tile: 16px; /* swatch tiles */
--radius-chip: 14px; /* small decorative chips */
--radius-pill: 999px; /* status pills, swatch discs */

/* Spacing — generous between cards, comfortable inside. */
--gap-outer: 4.2vw; /* ~80px on 1920 — outer slide padding */
--gap-cards: 1.5vw; /* ~28px between cards in a row */
--gap-cards-lg: 1.9vw; /* ~36px between major panels */
--gap-stack: 1.9vw; /* vertical between stacked text */
--pad-card-lg: 64px 48px;
--pad-card-md: 48px 52px;
--pad-card-sm: 28px 30px;

/* Measure — body line length cap (paragraph-of-an-essay width) */
--measure-body: 32vw; /* ~614px ≈ 65ch at body size */
--measure-display: 43vw; /* ~826px ≈ display headline cap */
```

## §D Font pairing fallback (if brand fonts not on Google Fonts)

- **display**: `'Cormorant Garamond'` · `'Cormorant'` · `'EB Garamond'` · `'Fraunces'` wght 500
- **body**: `'Work Sans'` · `'Inter'` · `'Source Sans 3'` wght 400
- **mono**: `'JetBrains Mono'` · `'IBM Plex Mono'` wght 400

Mono is declared for completeness; soft-editorial does not use monospace in any component — labels are sans or italic serif. If brand DNA forces a mono, demote it to a single technical caption use.

## §T Type-role atlas (Phase 4b reads this to size text correctly)

The atlas is the **sole authoring source** for non-component text — do NOT invent ad-hoc sizes; soft-editorial's literary register collapses when sizes drift off the Cormorant scale.

```type-roles
[
  {
    "id": "display",
    "family": "display",
    "purpose": "cover-scale headline (Cormorant 500 roman, generous measure)",
    "px_min": 168, "px_max": 232, "weight": 500, "leading": "0.92", "tracking": "-0.02em", "case": "sentence",
    "sample_html": "<div class=\"t-trole-display\">A canvas where teams design <em>together</em>.</div>"
  },
  {
    "id": "title",
    "family": "display",
    "purpose": "section / chapter title at near-cover scale",
    "px_min": 140, "px_max": 188, "weight": 500, "leading": "0.95", "tracking": "-0.015em", "case": "sentence",
    "sample_html": "<div class=\"t-trole-title\">Chapter one</div>"
  },
  {
    "id": "numeral-hero",
    "family": "display",
    "purpose": "featured hero numeral inside a span-two stat card",
    "px_min": 240, "px_max": 320, "weight": 500, "leading": "0.9", "tracking": "-0.02em", "case": "sentence",
    "sample_html": "<div class=\"t-trole-numeral-hero\">4M</div>"
  },
  {
    "id": "section-headline",
    "family": "display",
    "purpose": "workhorse section headline — chart / comparison / analysis",
    "px_min": 72, "px_max": 96, "weight": 500, "leading": "0.98", "tracking": "-0.01em", "case": "sentence",
    "sample_html": "<div class=\"t-trole-section-headline\">A quieter way to work</div>"
  },
  {
    "id": "quote-text",
    "family": "display",
    "purpose": "pull-quote body — Cormorant 500 at section scale",
    "px_min": 72, "px_max": 88, "weight": 500, "leading": "1.05", "tracking": "-0.01em", "case": "sentence",
    "sample_html": "<div class=\"t-trole-quote-text\">Considered, unhurried, careful.</div>"
  },
  {
    "id": "card-headline",
    "family": "display",
    "purpose": "headline filling the head of a card or panel",
    "px_min": 56, "px_max": 72, "weight": 500, "leading": "1", "tracking": "-0.01em", "case": "sentence",
    "sample_html": "<div class=\"t-trole-card-headline\">Field notes</div>"
  },
  {
    "id": "opener",
    "family": "script",
    "purpose": "italic opener paragraph for long-form reads (Cormorant italic 500)",
    "px_min": 44, "px_max": 56, "weight": 500, "leading": "1.1", "tracking": "0", "case": "sentence",
    "sample_html": "<div class=\"t-trole-opener\">A short italic opening, set in the same serif, lighter on the page.</div>"
  },
  {
    "id": "drop-cap",
    "family": "display",
    "purpose": "drop cap opening a long-form paragraph (Cormorant 500, floated)",
    "px_min": 108, "px_max": 132, "weight": 500, "leading": "0.85", "tracking": "0", "case": "sentence",
    "sample_html": "<p class=\"t-trole-body\"><span class=\"t-trole-drop-cap\">F</span>or the editorial register the drop cap is the system's most distinctive moment — 132px Cormorant Garamond medium, floated left, the paragraph body wrapping warmly around it.</p>"
  },
  {
    "id": "numeral-step",
    "family": "script",
    "purpose": "italic lowercase roman numeral step ordinal (i. ii. iii. iv. v.)",
    "px_min": 64, "px_max": 92, "weight": 500, "leading": "0.9", "tracking": "0", "case": "lower",
    "sample_html": "<div class=\"t-trole-numeral-step\">iii.</div>"
  },
  {
    "id": "kicker",
    "family": "script",
    "purpose": "italic kicker above a cover headline (Cormorant italic 400)",
    "px_min": 32, "px_max": 38, "weight": 400, "leading": "1.2", "tracking": "0", "case": "sentence",
    "sample_html": "<div class=\"t-trole-kicker\">— vol. iii, an essay on calm</div>"
  },
  {
    "id": "marker",
    "family": "script",
    "purpose": "small italic ornamental marker (sign-offs, edition labels)",
    "px_min": 26, "px_max": 32, "weight": 400, "leading": "1.3", "tracking": "0", "case": "sentence",
    "sample_html": "<div class=\"t-trole-marker\">— filed under field notes</div>"
  },
  {
    "id": "eyebrow",
    "family": "body",
    "purpose": "plain Work Sans eyebrow at top-left chrome (NEVER uppercase, NEVER italic)",
    "px_min": 26, "px_max": 34, "weight": 400, "leading": "1.2", "tracking": "-0.005em", "case": "sentence",
    "sample_html": "<div class=\"t-trole-eyebrow\">Section · The quiet field</div>"
  },
  {
    "id": "page-marker",
    "family": "script",
    "purpose": "italic serif page numeral at top-right chrome (Cormorant italic 400, ink-soft)",
    "px_min": 26, "px_max": 32, "weight": 400, "leading": "1", "tracking": "0", "case": "sentence",
    "sample_html": "<div class=\"t-trole-page-marker\">iv</div>"
  }
]
```

## §E Motion (GSAP consts — REPLACES site ease)

```js
const EASE = {
  entry: "power2.out", // soft arrival, no overshoot — "considered, unhurried"
  emphasis: "power2.inOut", // gentle inflection on emphasis beats
  exit: "power2.in", // gentle dismissal
  drift: "sine.inOut", // ambient breath on translucent cards
};
const DUR = {
  snap: 0.18, // even "fast" is unhurried — upper-band snap
  med: 0.5,
  slow: 1.0,
};
// RULE: no overshoot anywhere. back.out / elastic / bounce break the editorial calm.
// RULE: italic-em phrases inside a headline fade in *after* the roman headline lands
//       (DUR.snap delay) — the weight drop is a softening, not an entry beat.
// RULE: drop caps enter on a separate beat from their paragraph (DUR.med delay)
//       so the 132px serif glyph reads as a deliberate ornament, not a stutter.
// RULE: pastel card fills cross-fade between scenes, never hard-cut. Color is a
//       slow tonal shift, not a flash.
// RULE: roman-numeral step ordinals (i. ii. iii.) tween linearly on counter reveals.
//       Eased numerals read as "animated" not "printed".
```

### §E.5 Motion choreography

**Allowed primitives**

- Crossfade between scenes: 400–600ms, with a 16–24px upward drift on the incoming
  cards. Never hard-cut. Never directional swipe.
- Translucent card entry: opacity 0 → 0.55 with a small `y: 12px → 0` lift.
- Drop cap reveals on a delayed beat (after the paragraph body settles).
- Italic `<em>` phrases inside a headline fade in _after_ the roman headline,
  offset by DUR.snap.
- Ambient drift on translucent cards: ±2px y on a 6–8s sine loop, very subtle.
- Pastel swatch-row dots: stagger entry (DUR.snap apart), scale 0.92 → 1.0 with
  `power2.out`. No spin, no rotation.

**Forbidden**

- Any `scale` beyond 0.92 → 1.0 (no "zoom" reveals).
- Any rotation on content elements. Pastel cards are not stickers.
- Letter-by-letter typewriter on serif. Cormorant doesn't typewrite.
- Sub-pixel drift on cards — round transforms to whole px to keep the rounded
  corners crisp.
- Hard cuts between scenes.

**Stagger budget**

200–280ms between sibling elements. Matches editorial's calm cadence. Total scene-in
stagger ≤ 800ms — soft-editorial is unhurried, but not glacial.

**Typography in motion**

Words enter as a single block, not glyph-by-glyph. Italic `<em>` phrases are the
exception — they cross-fade _into_ the existing roman headline after the roman
lands, which makes the weight-drop reveal feel like a turning of the page.

## §G Voice transform recipe

Take the brand's product description / value prop. Transform with:

1. Keep complete sentences. Sentence case throughout — soft-editorial reads
   UPPERCASE as shouting, so on-screen text stays sentence case everywhere.
2. Prefer one warm noun phrase over a list of features. The mood is "essayist's
   summary", not "product spec".
3. Drop hyperbole and superlatives (`best`, `most`, `revolutionary`). Replace with
   measured adjectives (`considered`, `quiet`, `careful`).
4. Use italic `<em>` inside a headline to highlight a single warm phrase — usually
   2–4 words mid-sentence. The italic is the system's emphasis.
5. End scenes with a quiet declarative — no exclamation, no question mark.
6. Cite proofs (years, customers, awards) as factual asides in italic serif at
   marker size, not as boastful pull-out stats.

**Example:**

- IN: `Figma helps teams design products collaboratively in real time`
- OUT: `A canvas where teams design <em>together</em>, in real time. — Trusted by four million, quietly.`

## §H Scene composition hints (Phase 4b layout guidance)

**Surface & elevation**

- Slide background is always cream — `var(--brand-canvas, var(--paper-anchor))`.
  Pastel fills appear only as card fills, never as a slide background. The single
  exception is a full-bleed closer scene (one per video at most) that may fill with
  `var(--brand-primary)` for a single quiet "moment".
- Default card fill is `var(--surface-card)` (translucent white at 55%). The cream
  bleeds through and _is_ the depth signal — no shadow, no border. Reach for a
  pastel fill (any of `--brand-primary` / `--brand-secondary` / `--brand-accent`)
  only when a card needs color or status.
- No drop shadows. No glow. No blur halos. Depth comes from translucency and the
  generous rounded form.
- Cards never stack on cards. If a layout needs visual hierarchy, use size and
  color — never z-stacking.

**Brand color placement (role contract)**

- All three brand colors are interchangeable card fills — soft-editorial does not
  assign a fixed `primary→hero` role. The brand-primary is the warmest moment, the
  brand-secondary is the brightest, the brand-accent is the most neutral; but any
  scene may rotate them as needed. The system's voice is "we have a palette of
  pastels", not "we have a hero color".
- **Text stays in `var(--ink)` on every surface, including all pastel cards.**
  Never invert to white on pastel. This is non-negotiable — inverted text breaks
  the editorial calm.
- Two-color limit per scene: at most two of the three brand colors visible at
  once. Three brand colors on one scene reads as a color-wheel demo, not as
  composition.

**Typography discipline**

- One typeface family per headline. Mix weight (500 → 400) and style (roman →
  italic) inside the headline, not faces. Italic `<em>` is the system's emphasis.
- **Left-align by default**, ragged right. Centered headlines are reserved for
  the full-bleed closer and the pull-quote — the system's two "moment" scenes.
- Drop caps appear at most once per scene, only on long-form opener paragraphs
  (132px Cormorant Garamond medium, line-height 0.85). A scene with two drop caps
  is broken.
- Roman-numeral step ordinals (`i.`, `ii.`, `iii.`, `iv.`, `v.`) — lowercase
  italic serif. Arabic step numbers break the editorial register.
- Sentence case everywhere. Soft-editorial has no uppercase element — uppercase
  reads as shouting against the Cormorant serif calm.

**Layout & density**

- Card grids: 28–36px gaps between cards, 80px outer slide padding. The cream
  field around and between cards is load-bearing — a layout that crowds cards
  edge-to-edge reads as broken.
- Two strong things per scene maximum. Hierarchy through size and surface color,
  not stacking.
- Card body density inside cards may be medium-high (matrices, dense step grids,
  lengthy quoted text) — the cream-field margin between cards carries the
  breathing.

**Transitions between scenes**

- Default: 400–600ms crossfade with 16–24px upward drift on incoming cards.
- Hold cream as the background across the cut — the cards swap, the field is
  constant. The cream field is the deck's "spine".
- The full-bleed closer scene fades _to_ full-pastel from cream, holds for the
  closer's duration, fades back to cream on exit.

## §I Page-level CSS (makes design.html itself read as soft-editorial)

```css
/* ── Preset-native typography vars (loaded via preset-meta.chromeFonts.googleFontsHref).
 * Cormorant Garamond + Work Sans + JetBrains Mono for doc chrome; script slot = Cormorant italic (no third face); mono for completeness only. */
:root {
  --f-disp-native:
    "Cormorant Garamond", "Cormorant", "EB Garamond", "Fraunces", "Garamond", "Times New Roman",
    serif;
  --f-body-native:
    "Work Sans", "Inter", "Source Sans 3", -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  --f-script-native:
    "Cormorant Garamond", "Cormorant", "EB Garamond", "Fraunces", "Garamond", "Times New Roman",
    serif;
  --f-mono-native:
    "JetBrains Mono", "IBM Plex Mono", "Space Mono", "Menlo", ui-monospace, monospace;
}

/* .preset-native-scope: re-binds var(--font-*) to preset-native families for component previews + §T atlas. */
.preset-native-scope {
  --font-display: var(--f-disp-native);
  --font-body: var(--f-body-native);
  --font-script: var(--f-script-native);
  --font-mono: var(--f-mono-native);
}

body {
  background: var(--paper-anchor);
  color: var(--ink);
}
.title-card {
  padding: 120px 0 80px;
  border-bottom: var(--rule-dashed);
}
.title-display {
  font-style: italic;
  max-width: var(--measure-display);
  font-weight: 500;
}
.ds-section {
  border-top: var(--rule-dashed);
  padding: 96px 0;
}
.type-card,
.voice-pair,
.comp-card {
  background: var(--surface-card) !important;
  border: none !important;
  border-radius: var(--radius-card-sm) !important;
  box-shadow: none !important;
  margin: 24px 0 !important;
}
/* dna-swatch keeps inline brand-color background */
.dna-swatch {
  border: none !important;
  border-radius: var(--radius-card-sm) !important;
  box-shadow: none !important;
}
.comp-head {
  background: transparent !important;
  border-bottom: var(--rule-dashed) !important;
}
.ds-code {
  background: rgba(255, 255, 255, 0.65);
  border: var(--rule-dashed);
  border-radius: var(--radius-card-sm) !important;
}
h2 {
  font-style: italic;
  font-weight: 500;
}
.eyebrow {
  font-family: "Work Sans", sans-serif;
  text-transform: none;
  letter-spacing: -0.005em;
}
/* ── §T Type-role atlas. var(--font-*) tokens → brand DNA; only the recipe is preset-declared. */
.ds-trole-box {
  display: flex;
  flex-direction: column;
  border: none;
  border-radius: var(--radius-card-sm, 24px);
  background: var(--surface-card, rgba(255, 255, 255, 0.55));
  overflow: hidden;
  margin-top: 24px;
}
.ds-trole-row {
  padding: 28px 32px;
  border-bottom: 1px dashed color-mix(in srgb, var(--ink) 18%, transparent);
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

/* ── Type-role samples. var(--font-display/body/script) → brand DNA. */
.t-trole-display {
  font-family: var(--font-display);
  font-weight: 500;
  font-size: clamp(96px, 12vw, 232px);
  line-height: 0.92;
  letter-spacing: -0.02em;
  color: var(--ink);
}
.t-trole-display em {
  font-weight: 400;
  font-style: italic;
}
.t-trole-title {
  font-family: var(--font-display);
  font-weight: 500;
  font-size: clamp(96px, 10vw, 188px);
  line-height: 0.95;
  letter-spacing: -0.015em;
  color: var(--ink);
}
.t-trole-numeral-hero {
  font-family: var(--font-display);
  font-weight: 500;
  font-size: clamp(160px, 16vw, 320px);
  line-height: 0.9;
  letter-spacing: -0.02em;
  color: var(--ink);
}
.t-trole-section-headline {
  font-family: var(--font-display);
  font-weight: 500;
  font-size: clamp(56px, 5vw, 96px);
  line-height: 0.98;
  letter-spacing: -0.01em;
  color: var(--ink);
}
.t-trole-quote-text {
  font-family: var(--font-display);
  font-weight: 500;
  font-size: clamp(56px, 5vw, 88px);
  line-height: 1.05;
  letter-spacing: -0.01em;
  color: var(--ink);
  max-width: 22ch;
}
.t-trole-card-headline {
  font-family: var(--font-display);
  font-weight: 500;
  font-size: clamp(44px, 4vw, 72px);
  line-height: 1;
  letter-spacing: -0.01em;
  color: var(--ink);
}
.t-trole-opener {
  font-family: var(--font-script);
  font-style: italic;
  font-weight: 500;
  font-size: clamp(32px, 3.2vw, 56px);
  line-height: 1.1;
  color: var(--ink);
  max-width: 32ch;
}
.t-trole-drop-cap {
  float: left;
  font-family: var(--font-display);
  font-weight: 500;
  font-size: clamp(88px, 9vw, 132px);
  line-height: 0.85;
  color: var(--ink);
  padding: 8px 14px 0 0;
}
.t-trole-numeral-step {
  font-family: var(--font-script);
  font-style: italic;
  font-weight: 500;
  font-size: clamp(56px, 6vw, 92px);
  line-height: 0.9;
  text-transform: lowercase;
  color: var(--ink);
}
.t-trole-kicker {
  font-family: var(--font-script);
  font-style: italic;
  font-weight: 400;
  font-size: clamp(32px, 2.4vw, 38px);
  line-height: 1.2;
  color: color-mix(in srgb, var(--ink) 72%, transparent);
}
.t-trole-marker {
  font-family: var(--font-script);
  font-style: italic;
  font-weight: 400;
  font-size: clamp(26px, 2vw, 32px);
  line-height: 1.3;
  color: color-mix(in srgb, var(--ink) 60%, transparent);
}
.t-trole-eyebrow {
  font-family: var(--font-body);
  font-weight: 400;
  font-size: clamp(26px, 1.9vw, 34px);
  line-height: 1.2;
  letter-spacing: -0.005em;
  color: var(--ink);
}
.t-trole-body em {
  font-family: var(--font-script);
  font-style: italic;
  font-weight: 400;
}
.t-trole-page-marker {
  font-family: var(--font-script);
  font-style: italic;
  font-weight: 400;
  font-size: clamp(26px, 1.7vw, 32px);
  line-height: 1;
  color: color-mix(in srgb, var(--ink) 55%, transparent);
}
```
