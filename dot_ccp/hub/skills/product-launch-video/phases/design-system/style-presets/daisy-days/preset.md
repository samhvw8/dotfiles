```preset-meta
{
  "name": "daisy-days",
  "label": "Daisy Days",
  "fingerprint": {
    "shadow": "hard-offset-charcoal",
    "border": "thick-charcoal-rounded",
    "type": "rounded-display",
    "decoration": "hand-drawn-sticker",
    "mood": "storybook-pastel",
    "motion": "bounce-and-settle"
  },
  "match_signals": [
    { "kind": "shadow_zero_blur", "weight": 0.3 },
    { "kind": "thick_solid_border", "weight": 0.25 },
    { "kind": "low_saturation", "weight": 0.2 },
    { "kind": "bouncy_easing", "weight": 0.1 }
  ],
  "best_for": ["educational content", "wellness", "community workshops", "creator portfolios", "friendly internal kickoffs"],
  "avoid_for": ["enterprise compliance", "financial precision", "security", "authority-first contexts"],
  "chromeFonts": {
    "googleFontsHref": "https://fonts.googleapis.com/css2?family=Fredoka+One&family=Quicksand:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap",
    "display": "Fredoka One",
    "body": "Quicksand",
    "script": "Fredoka One",
    "mono": "JetBrains Mono"
  }
}
```

> `chromeFonts` makes the design.html doc chrome render in the preset's native fonts (Fredoka One + Quicksand); brand fonts still apply to §6 component code. The `script` slot also points at Fredoka — the storybook voice refuses a third face.

## §A Director's intent

Daisy Days is a **cheerful, storybook-pastel system**. Every container is a rounded card with a thick charcoal outline (3px) and a hard offset shadow (6px / 6px / 0), and every region is wreathed in hand-drawn SVG ornaments — daisies, stars, suns, clouds, rainbows — that cluster at the corners and crop past the edges. Type pairs a chubby rounded display face with a friendly humanist sans; surfaces alternate between cream and saturated pastels (turquoise, soft-pink, butter, mint, lavender, peach, sky). The single accent — coral — is reserved for small high-attention markers, never as a surface.

Voice is **warm and informal**: short sentence fragments, sentence case, no shouting. Motion is **bounce-and-settle**: things hop in with a mild overshoot, ornaments breathe and twinkle, exits are quick and clean. Use `dc-` as the CSS class prefix to namespace components.

## §B Decoration tokens

```css
/* Hard offset shadow + chunky borders — the system's signature elevation.
   All borders/shadows use var(--ink) directly; site DNA's ink carries it. */
--border-bold: 3px solid var(--ink);
--border-thin: 2px solid var(--ink);
--shadow-card: 6px 6px 0 var(--ink);
--shadow-small: 4px 4px 0 var(--ink);
--shadow-text-bold: 3px 3px 0 var(--ink);
--shadow-text-soft: 3px 3px 0 color-mix(in srgb, var(--ink) 20%, transparent);

/* Generous radii — there are no square corners in this system */
--radius-card: 20px;
--radius-card-lg: 28px;
--radius-pill: 50px;

/* Spacing */
--gap-card: 1.5vw;
--gap-grid: 1.25vw;
--pad-card-lg: 2.4vw 2.8vw;
--pad-card-md: 1.6vw 2vw;
--pad-card-sm: 0.8vw 1.2vw;

/* Surface alternates — each is a low-opacity tint over the brand palette so any
   brand still produces a pastel-garden surface. Falls back cleanly when the
   site's accent palette is itself pastel.

   §8.2 exception: pastel/butter/blush/sky anchors are technical hue anchors,
   declared once here so every surface/sticker mix produces a storybook tone
   regardless of brand DNA. Without these anchors, dark or saturated brands
   would produce dark pastels — breaking the storybook register. */
--anchor-cream: #fffaf0; /* off-white pastel anchor for surfaces */
--anchor-warm-cream: #f5f0e6; /* warmer cream for canvas wash */
--anchor-butter: #fde68a; /* butter-yellow sticker anchor */
--anchor-sky: #a8d8f0; /* sky-blue sticker anchor */
--anchor-blush: #f7c8d4; /* blush-pink sticker anchor */
--anchor-mint: #a8e6cf; /* mint-green sticker anchor */
--anchor-lavender: #d4a5e8; /* lavender sticker anchor */
--anchor-peach: #ffcba4; /* peach sticker anchor */
--anchor-teal: #7ecdc0; /* deep-teal sticker anchor */
--anchor-paper: #ffffff; /* pure white — card surface + white text on saturated fills */

--surface-pastel-primary: color-mix(in srgb, var(--brand-primary) 32%, var(--anchor-cream));
--surface-pastel-secondary: color-mix(in srgb, var(--brand-secondary) 30%, var(--anchor-cream));
--surface-pastel-accent: color-mix(in srgb, var(--brand-accent) 28%, var(--anchor-cream));
--surface-cream: color-mix(in srgb, var(--canvas) 78%, var(--anchor-warm-cream));

/* Sticker tints — used for ornament fills so daisies/stars re-color with brand */
--sticker-warm: color-mix(in srgb, var(--brand-primary) 50%, var(--anchor-butter));
--sticker-cool: color-mix(in srgb, var(--brand-accent) 50%, var(--anchor-sky));
--sticker-soft: color-mix(in srgb, var(--brand-secondary) 45%, var(--anchor-blush));

/* SVG stroke (used inline on ornaments) */
--sticker-stroke: var(--ink);
--sticker-stroke-w: 2.1px;
```

## §D Font pairing fallback

- **display**: `'Fredoka One'` · `'Fredoka'` wght 600 · `'Baloo 2'` wght 700
- **body**: `'Quicksand'` wght 500 · `'Nunito'` wght 500 · `'Comfortaa'` wght 500
- **mono**: `'JetBrains Mono'` wght 500 · `'IBM Plex Mono'` wght 500

## §T Type-role atlas (Phase 4b reads this to size text correctly)

The atlas is the **sole authoring source** for non-component text. If a scene needs a `number-hero` numeral that isn't covered by §6 components, the worker reads role `number-hero` here and writes inline CSS from these values. Do NOT invent ad-hoc sizes — every role floors at 24px and the Fredoka/Quicksand families split the ladder by role, so ad-hoc sizes break the storybook ladder.

```type-roles
[
  {
    "id": "display-cover",
    "family": "display",
    "purpose": "cover / opening hero headline (Fredoka One on cream, no text-shadow)",
    "px_min": 52, "px_max": 112, "weight": 400, "leading": "1.1", "tracking": "0.02em", "case": "sentence",
    "sample_html": "<div class=\"t-trole-display-cover\">{BRAND_NAME}</div>"
  },
  {
    "id": "headline",
    "family": "display",
    "purpose": "primary slide headline on cream / white card (dark ink, flat — no shadow)",
    "px_min": 40, "px_max": 72, "weight": 400, "leading": "1.1", "tracking": "0.02em", "case": "sentence",
    "sample_html": "<div class=\"t-trole-headline\">A friendlier way to begin</div>"
  },
  {
    "id": "headline-pastel",
    "family": "display",
    "purpose": "headline on a saturated pastel surface (white text + 3px charcoal text-shadow — non-optional)",
    "px_min": 40, "px_max": 72, "weight": 400, "leading": "1.1", "tracking": "0.02em", "case": "sentence",
    "sample_html": "<div class=\"t-trole-headline-pastel-wrap\"><span class=\"t-trole-headline-pastel\">This week's lineup</span></div>"
  },
  {
    "id": "title",
    "family": "display",
    "purpose": "section title or framed-header title (Fredoka One on cream/card)",
    "px_min": 28, "px_max": 48, "weight": 400, "leading": "1.15", "tracking": "0.02em", "case": "sentence",
    "sample_html": "<div class=\"t-trole-title\">Section title</div>"
  },
  {
    "id": "quote-text",
    "family": "display",
    "purpose": "pull-quote body inside a white quote box (Fredoka One, dark ink)",
    "px_min": 30, "px_max": 48, "weight": 400, "leading": "1.35", "tracking": "0.02em", "case": "sentence",
    "sample_html": "<div class=\"t-trole-quote-text\">A small kindness, repeated daily, becomes the work.</div>"
  },
  {
    "id": "subtitle",
    "family": "display",
    "purpose": "sub-headline or in-card title (Fredoka One mid-scale)",
    "px_min": 26, "px_max": 38, "weight": 400, "leading": "1.2", "tracking": "0.02em", "case": "sentence",
    "sample_html": "<div class=\"t-trole-subtitle\">Sub-headline</div>"
  },
  {
    "id": "number-hero",
    "family": "display",
    "purpose": "hero statistic numeral (Fredoka One, brand-accent on cream / white card)",
    "px_min": 80, "px_max": 152, "weight": 400, "leading": "1", "tracking": "0.02em", "case": "sentence",
    "sample_html": "<div class=\"t-trole-number-hero\">63%</div>"
  },
  {
    "id": "body-strong",
    "family": "body",
    "purpose": "emphasized body line — welcome list items, info-card descriptions (Quicksand 600)",
    "px_min": 24, "px_max": 28, "weight": 600, "leading": "1.5", "tracking": "0", "case": "sentence",
    "sample_html": "<p class=\"t-trole-body-strong\">A friendlier way to start the week — together.</p>"
  },
  {
    "id": "quote-author",
    "family": "body",
    "purpose": "quote attribution (Quicksand 700, muted ink)",
    "px_min": 24, "px_max": 26, "weight": 700, "leading": "1.4", "tracking": "0", "case": "sentence",
    "sample_html": "<div class=\"t-trole-quote-author\">— A friend, in a workshop</div>"
  },
  {
    "id": "badge",
    "family": "display",
    "purpose": "pill badge text (Fredoka One on butter-yellow fill, charcoal border)",
    "px_min": 24, "px_max": 26, "weight": 400, "leading": "1", "tracking": "0.02em", "case": "sentence",
    "sample_html": "<div><span class=\"t-trole-badge\">New today</span></div>"
  },
  {
    "id": "marker-numeral",
    "family": "display",
    "purpose": "numeral / letter inside a marker circle (Fredoka, white on saturated fill — dark on butter)",
    "px_min": 26, "px_max": 34, "weight": 400, "leading": "1", "tracking": "0.02em", "case": "sentence",
    "sample_html": "<div><span class=\"t-trole-marker-numeral\">1</span></div>"
  }
]
```

## §E Motion (GSAP consts — REPLACES site ease)

```js
// Daisy Days motion — bounce-and-settle storybook character
const EASE = {
  entry: "back.out(1.6)", // chunky cards hop in with mild overshoot
  emphasis: "back.out(2.0)", // bigger overshoot for hero moments
  exit: "power2.in", // exits stay quick and clean
  drift: "sine.inOut", // ornaments breathe; rainbow shimmer; sun twinkle
  wobble: "elastic.out(1, 0.5)", // optional: signature joy moment, use sparingly
};
const DUR = {
  snap: 0.18,
  med: 0.5,
  slow: 0.9,
};
// RULE: cards/badges enter with EASE.entry, never with linear or power2.out — the back.out is the brand
// RULE: ornaments use EASE.drift on a continuous yoyo (rotation ±3deg, scale 0.97-1.03) — never freeze
// RULE: do NOT cross-fade scenes. Cut on the beat. The shadow + outline only read on a hard frame change.
// RULE: text-shadow on headlines must animate IN with the headline, not after — they're one object
// RULE: EASE.wobble is for ONE element per scene at most (the focal stat number, a sticker pop) — overuse turns the system into a toy
```

**§E.5 Motion choreography**

- **Atmosphere:** ornaments (daisies, stars, suns, clouds, rainbows) drift continuously on `EASE.drift`. Stagger rotation phase 0-2s across instances so the field never moves in lockstep.
- **Entry vocabulary:** cards bounce up from `y: 24, scale: 0.94, opacity: 0` to rest. Stagger 0.06-0.08s between siblings in a grid (week-card row, info-card grid, team-grid).
- **Emphasis:** numbers/stats count up on `EASE.emphasis` with a one-shot wobble on the final value. Display headlines pop in on `EASE.entry` with a 0.5x letter-by-letter stagger when budget allows.
- **Exits:** quick fade + 8-12px upward drift on `EASE.exit` over `DUR.snap`. Ornaments fade last.
- **Transitions:** **hard cut** between scenes — no crossfade, no slide. The charcoal outline must land on a clean frame to read sticker-on-paper.
- **Forbidden gestures:** blur, parallax, perspective tilt past 6°, motion-blur trails, gradient sweeps, glass refraction. The system is 2D and graphic.

## §G Voice transform recipe

1. Keep sentence case — never UPPERCASE. Fredoka is loud on its own; shouting breaks the storybook warmth.
2. Strip corporate hedges (`leverage`, `enable`, `solutions`, `seamlessly`, `holistic`) and connectives where the line still reads.
3. Prefer short, friendly fragments. 4-8 words per line for headlines; 6-12 for subheads.
4. Use commas, em-dashes, and exclamation points sparingly but warmly. Never trail with `.` on a headline.
5. End with one warm word as a closer when possible — `today`, `friends`, `welcome`, brand-name.
6. Pastel surfaces want softer copy ("Let's begin"); cream surfaces can carry the meatier line ("A friendlier way to build").

**Example:**

- IN: `Our platform enables teams to seamlessly collaborate across complex workflows in real time`
- OUT: `Teams, working together — in real time. Welcome.`

## §H Scene composition hints

- **One main subject per scene.** A single card / frame / grid lives at the center, max-width well inside the slide padding. Two competing panels reads anxious; let one focal region carry the beat.
- **Wreath every scene with 3-7 SVG ornaments** clustered at corners. Crop them past the edge (`top: -30px / right: -20px` style). An empty corner reads as broken — ornaments are structural, not garnish.
- **Surface alternation:** rotate scenes through `var(--surface-cream)` (cover, info), `var(--surface-pastel-primary)` (welcome, week), `var(--surface-pastel-secondary)` (timeline, quote), `var(--surface-pastel-accent)` (process, donut). Don't repeat the same surface back-to-back.
- **Headline shadow rule:** on a saturated pastel surface, every Fredoka headline carries `var(--shadow-text-bold)` and switches to white. On cream or on a white card, headline sits flat in `var(--ink)`. This is non-optional — skipping it on a colored surface breaks the system.
- **Brand-color role contract:**
  - `var(--brand-primary)` → focal sticker fills (daisy centers, star fills), primary card surfaces
  - `var(--brand-secondary)` → soft sticker fills (cloud bands, rainbow stripes), divider rules
  - `var(--brand-accent)` → marker dots (timeline node, step circle), single high-attention spot
  - `var(--ink)` → every border, every shadow, every SVG stroke. Never colored.
- **Bullet rule:** body lists use outlined 20px discs with butter-yellow fill (`var(--brand-secondary)` 50% tint). Never glyph bullets, never bare hyphens.
- **Marker rotation:** when a sequence of dots/steps is needed (timeline rows, process steps, day-headers), rotate fills through `accent → secondary → primary → soft` so each beat has a distinct color. Never one color for all.
- **Type roles:** display font (Fredoka One register) carries headlines, titles, numerals, marker labels, and badge/chip text; body font (Quicksand register) carries paragraph copy, list items, descriptions, and quote attributions. All on-screen text floors at 24px and the ladder scales up from there — display roles sit clearly above body roles (see §T). The family split (not a px threshold) is the role boundary. No exceptions.
- **Forbidden:** colored borders, dashed lines, square corners outside legend swatches, blurred or rgba shadows, gradients, glow effects, photo backdrops, italic display text.
- **Transition default:** hard cut on the beat. Ornaments fade out last, cards exit first.

## §I Page-level CSS

```css
/* ── Preset-native typography vars — doc chrome renders in Fredoka One + Quicksand. */
:root {
  --f-disp-native:
    "Fredoka One", "Fredoka", "Baloo 2", "Comfortaa", "Nunito", system-ui, sans-serif;
  --f-body-native:
    "Quicksand", "Nunito", "Comfortaa", -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  --f-script-native:
    "Fredoka One", "Fredoka", "Baloo 2", "Comfortaa", "Nunito", system-ui, sans-serif;
  --f-mono-native:
    "JetBrains Mono", "IBM Plex Mono", "Space Mono", "Menlo", ui-monospace, monospace;
}

/* .preset-native-scope: re-bind brand DNA font tokens to preset-native families for §6 previews + §T atlas. */
.preset-native-scope {
  --font-display: var(--f-disp-native);
  --font-body: var(--f-body-native);
  --font-script: var(--f-script-native);
  --font-mono: var(--f-mono-native);
}

/* Daisy Days — make design.html itself read as a storybook spread */
body {
  background: var(--surface-cream);
}

.ds-section {
  border: var(--border-bold);
  border-radius: var(--radius-card-lg);
  box-shadow: var(--shadow-card);
  background: #ffffff;
  margin-bottom: 2.4rem;
}

.ds-section h2 {
  font-family: var(--font-display);
  letter-spacing: 0.02em;
}

.ds-component-preview {
  border: var(--border-bold);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-small);
  background: var(--surface-cream);
}

.ds-code {
  border: var(--border-thin);
  border-radius: 12px;
  background: #fffaf0;
}

/* ── §T Type-role atlas. */
.ds-trole-box {
  display: flex;
  flex-direction: column;
  border: var(--border-bold);
  border-radius: var(--radius-card-lg);
  background: #ffffff;
  box-shadow: var(--shadow-card);
  overflow: hidden;
  margin-top: 24px;
}
.ds-trole-row {
  padding: 28px 32px;
  border-bottom: var(--border-thin);
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

/* ── Type-role samples. */
.t-trole-display-cover {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(52px, 7vw, 112px);
  line-height: 1.1;
  letter-spacing: 0.02em;
  color: var(--ink);
}
.t-trole-headline {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(40px, 5vw, 72px);
  line-height: 1.1;
  letter-spacing: 0.02em;
  color: var(--ink);
}
.t-trole-headline-pastel-wrap {
  display: inline-block;
  background: var(--surface-pastel-primary);
  border: var(--border-bold);
  border-radius: var(--radius-card);
  padding: 24px 32px;
}
.t-trole-headline-pastel {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(40px, 5vw, 72px);
  line-height: 1.1;
  letter-spacing: 0.02em;
  color: var(--anchor-paper);
  text-shadow: var(--shadow-text-bold);
}
.t-trole-title {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(28px, 3.5vw, 48px);
  line-height: 1.15;
  letter-spacing: 0.02em;
  color: var(--ink);
}
.t-trole-quote-text {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(30px, 3vw, 48px);
  line-height: 1.35;
  letter-spacing: 0.02em;
  color: var(--ink);
  max-width: 28ch;
}
.t-trole-subtitle {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(26px, 2.6vw, 38px);
  line-height: 1.2;
  letter-spacing: 0.02em;
  color: var(--ink);
}
.t-trole-number-hero {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(80px, 11vw, 152px);
  line-height: 1;
  letter-spacing: 0.02em;
  color: var(--brand-accent);
}
.t-trole-body-strong {
  font-family: var(--font-body);
  font-weight: 600;
  font-size: clamp(24px, 1.6vw, 28px);
  line-height: 1.5;
  color: var(--ink);
  max-width: 50ch;
  margin: 0;
}
.t-trole-quote-author {
  font-family: var(--font-body);
  font-weight: 700;
  font-size: clamp(24px, 1.4vw, 26px);
  line-height: 1.4;
  color: color-mix(in srgb, var(--ink) 60%, transparent);
}
.t-trole-badge {
  display: inline-block;
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(24px, 1.4vw, 26px);
  line-height: 1;
  letter-spacing: 0.02em;
  color: var(--ink);
  background: var(--anchor-butter);
  border: var(--border-bold);
  border-radius: var(--radius-pill);
  padding: 8px 20px;
}
.t-trole-marker-numeral {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: var(--border-bold);
  background: var(--brand-accent);
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(26px, 1.8vw, 34px);
  line-height: 1;
  letter-spacing: 0.02em;
  color: var(--anchor-paper);
}
```
