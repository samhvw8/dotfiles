```preset-meta
{
  "name": "neo-brutalism",
  "label": "Neo-Brutalism",
  "fingerprint": {
    "shadow": "hard-offset",
    "border": "solid-thick",
    "motion": "hit-and-stick",
    "density": "high",
    "contrast": "high"
  },
  "match_signals": [
    { "kind": "shadow_zero_blur",    "weight": 0.30 },
    { "kind": "thick_solid_border",  "weight": 0.25 },
    { "kind": "condensed_display",   "weight": 0.15 },
    { "kind": "high_sat_accent",     "weight": 0.15 },
    { "kind": "rotated_transform",   "weight": 0.10 },
    { "kind": "bouncy_easing",       "weight": 0.05 }
  ],
  "best_for": ["manifesto brands", "indie SaaS", "declarative product launches", "agency talks", "design-led pitches"],
  "avoid_for": ["corporate restraint", "quiet authority", "institutional finance", "healthcare", "regulated industries"],
  "chromeFonts": {
    "googleFontsHref": "https://fonts.googleapis.com/css2?family=Anton&family=Archivo+Black&family=Inter:wght@400;500;700;800&family=Space+Mono:wght@400;700&display=swap",
    "display": "Anton",
    "body": "Inter",
    "script": "Anton",
    "mono": "Space Mono"
  }
}
```

> `chromeFonts` makes the doc chrome render in the preset's native fonts; brand fonts still apply to §6 components. Neo-Brutalism is a two-face system: Anton (condensed display) carries every heading; the `script` slot also points at Anton because the preset refuses a third face.

## §A Director's intent

Hard edges. Declarative typography. Shadow is **weight**, not depth.
Hit-and-stick motion. No glide, no fade.
One huge thing per scene. Cut, don't crossfade.

## §B Decoration tokens (merge into design.html `:root`)

Shadow offsets and border widths stay in **px** — they're visual signatures,
not proportional spacing. A 4px border that scales would vanish on small
viewports. Only the spacing variable uses `vw`.

```css
--shadow-hard: 8px 8px 0 var(--ink);
--shadow-hover: 11px 11px 0 var(--ink);
--border-bold: 4px solid var(--ink);
--border-loud: 6px solid var(--ink);
--tilt-l: -1deg;
--tilt-r: 1deg;
--gap-loud: 1.7vw; /* ~32px on a 1920 canvas */
```

## §D Font pairing fallback (if brand fonts not on Google Fonts)

- **display**: `'Anton'` · `'Archivo Black'` · `'Space Grotesk'` wght 800
- **body**: `'Inter'` · `'IBM Plex Sans'` wght 500
- **mono**: `'Space Mono'` · `'JetBrains Mono'` wght 700

If brand fonts ARE on Google Fonts, keep brand fonts — preset only overrides weight and tracking.

## §T Type-role atlas (Phase 4b reads this to size text correctly)

The atlas is the **sole authoring source** for non-component text. Do NOT invent ad-hoc sizes — neo-brutalism's identity collapses if weights drift below 800 at display scale or borders thin below 4px.

```type-roles
[
  {
    "id": "display-cover",
    "family": "display",
    "purpose": "cover hero at maximum scale — one huge thing per scene, ink on canvas",
    "px_min": 200, "px_max": 340, "weight": 800, "leading": "0.86", "tracking": "-0.04em", "case": "upper",
    "sample_html": "<div class=\"t-trole-display-cover\">BRAND</div>"
  },
  {
    "id": "headline",
    "family": "display",
    "purpose": "primary slide headline — declarative manifesto voice",
    "px_min": 96, "px_max": 160, "weight": 800, "leading": "0.9", "tracking": "-0.03em", "case": "upper",
    "sample_html": "<div class=\"t-trole-headline\">TEAMS. SHIP.</div>"
  },
  {
    "id": "statement",
    "family": "display",
    "purpose": "framed declarative quote on canvas — thick border + hard offset shadow",
    "px_min": 56, "px_max": 96, "weight": 800, "leading": "1", "tracking": "-0.02em", "case": "upper",
    "sample_html": "<div><span class=\"t-trole-statement\">ONE HUGE THING. NO APOLOGY.</span></div>"
  },
  {
    "id": "number-hero",
    "family": "display",
    "purpose": "hero statistic numeral — ink on canvas, no decoration",
    "px_min": 120, "px_max": 240, "weight": 800, "leading": "0.9", "tracking": "-0.04em", "case": "upper",
    "sample_html": "<div class=\"t-trole-number-hero\">340%</div>"
  },
  {
    "id": "h2",
    "family": "display",
    "purpose": "secondary headline / section title",
    "px_min": 56, "px_max": 96, "weight": 800, "leading": "0.95", "tracking": "-0.03em", "case": "upper",
    "sample_html": "<div class=\"t-trole-h2\">Section title</div>"
  },
  {
    "id": "h3",
    "family": "display",
    "purpose": "panel title / card heading",
    "px_min": 32, "px_max": 48, "weight": 800, "leading": "1", "tracking": "-0.02em", "case": "upper",
    "sample_html": "<div class=\"t-trole-h3\">Sub-headline</div>"
  },
  {
    "id": "eyebrow",
    "family": "body",
    "purpose": "eyebrow label above a headline — tracked uppercase Inter 700",
    "px_min": 24, "px_max": 30, "weight": 700, "leading": "1.2", "tracking": "0.18em", "case": "upper",
    "sample_html": "<div class=\"t-trole-eyebrow\">Vol. 01 — Manifesto</div>"
  },
  {
    "id": "lead",
    "family": "body",
    "purpose": "lead paragraph / opening sentence (Inter 500)",
    "px_min": 28, "px_max": 40, "weight": 500, "leading": "1.4", "tracking": "0", "case": "sentence",
    "sample_html": "<p class=\"t-trole-lead\">Hard edges. Declarative typography. Shadow is weight, not depth.</p>"
  },
  {
    "id": "body",
    "family": "body",
    "purpose": "default body paragraph (Inter 500)",
    "px_min": 24, "px_max": 30, "weight": 500, "leading": "1.55", "tracking": "0", "case": "sentence",
    "sample_html": "<p class=\"t-trole-body\">Body sits at Inter 500. Sentence case, terse. The manifesto is in the display; the body is the receipt.</p>"
  },
  {
    "id": "caption",
    "family": "mono",
    "purpose": "caption / source attribution (Space Mono 700)",
    "px_min": 24, "px_max": 28, "weight": 700, "leading": "1.4", "tracking": "0.04em", "case": "sentence",
    "sample_html": "<p class=\"t-trole-caption\">Source: internal data, 2026.</p>"
  },
  {
    "id": "label-mono",
    "family": "mono",
    "purpose": "tracked uppercase mono label — chrome bar, slide counter, chip metadata",
    "px_min": 24, "px_max": 28, "weight": 700, "leading": "1.3", "tracking": "0.16em", "case": "upper",
    "sample_html": "<div class=\"t-trole-label-mono\">01 / MANIFESTO</div>"
  },
  {
    "id": "chip-loud",
    "family": "display",
    "purpose": "ink pill chip — canvas text on ink fill, thick border, slight tilt",
    "px_min": 26, "px_max": 36, "weight": 800, "leading": "1", "tracking": "0.04em", "case": "upper",
    "sample_html": "<div><span class=\"t-trole-chip-loud\">SHIP IT</span></div>"
  },
  {
    "id": "cta-arrow",
    "family": "display",
    "purpose": "arrow-prefixed CTA — declarative imperative with hit-and-stick weight",
    "px_min": 28, "px_max": 44, "weight": 800, "leading": "1", "tracking": "-0.01em", "case": "upper",
    "sample_html": "<div class=\"t-trole-cta-arrow\">→ JOIN THE DROP</div>"
  }
]
```

## §E Motion (GSAP consts — REPLACES site ease)

```js
const EASE = {
  entry: "back.out(2.4)", // bouncy slam-pop
  emphasis: "expo.out", // hard arrival
  exit: "power4.in", // dive off
  drift: "sine.inOut", // only for ambient breathing
};
const DUR = {
  snap: 0.18,
  med: 0.45,
  slow: 0.9,
};
// RULE: never ease-in-out for primary motion. Hit-and-stick.
```

## §G Voice transform recipe (apply to brand's voice from §1 DNA)

Take the brand's product description / value prop. Transform with:

1. Strip articles + connectives (the / a / of / and / with / to)
2. Break into noun-verb-noun fragments OR single dominant nouns
3. UPPERCASE all
4. Join with `.` + linebreak, OR em-dash for emphasis
5. End with brand name as one-word punchline

**Example:**

- IN: `Figma helps teams design products collaboratively in real time`
- OUT: `TEAMS. DESIGN. TOGETHER. — REAL-TIME. — FIGMA.`

## §H Scene composition hints (Phase 4b layout guidance)

- **One huge thing per scene**. Display size 200-340px dominates frame.
- **Use corner-pins on framed scenes** (`<!-- COMPONENT: corner-pins -->`).
- **Background**: solid brand canvas OR dot-grid (`<!-- COMPONENT: dot-grid-bg -->`). Never gradient.
- **Transitions between scenes**: hard cut. No crossfade, no slide, no blur.
- **Stagger**: 100-150ms between elements.

## §I Page-level CSS (overrides design.html's neutral chrome — makes the doc itself brutalist)

```css
/* ── Preset-native typography vars — doc chrome + .preset-native-scope (Anton + Inter + Space Mono). */
:root {
  --f-disp-native:
    "Anton", "Archivo Black", "Oswald", "Impact", "Arial Black", "Helvetica Neue", sans-serif;
  --f-body-native:
    "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  --f-script-native:
    "Anton", "Archivo Black", "Oswald", "Impact", "Arial Black", "Helvetica Neue", sans-serif;
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

/* Brutalist page chrome — applied to design.html itself */
body {
  background: var(--canvas);
}
.title-card {
  background: var(--canvas);
  border-bottom: var(--border-loud);
  padding: 96px 0 80px;
}
.title-display {
  text-transform: uppercase;
  letter-spacing: -0.04em;
}
.brand-name,
.style-name {
  font-weight: 800;
}

.ds-section {
  border-top: var(--border-loud);
  padding: 80px 0;
}

/* Cards / panels get the brutalist treatment */
.dna-swatch,
.type-card,
.voice-pair {
  border: var(--border-bold) !important;
  border-radius: 0 !important;
  box-shadow: var(--shadow-hard);
}

.comp-card {
  border: var(--border-bold) !important;
  border-radius: 0 !important;
  box-shadow: var(--shadow-hard);
  margin: 32px 0 !important;
  overflow: visible !important; /* don't crop shadows */
}
.comp-head {
  background: var(--ink) !important;
  color: var(--canvas);
  border-bottom: var(--border-bold) !important;
}
.comp-head .comp-name,
.comp-head .comp-marker {
  color: var(--canvas);
}

.ds-code {
  border: var(--border-bold);
  border-radius: 0 !important;
  box-shadow: var(--shadow-hard);
}

h2 {
  text-transform: uppercase;
  letter-spacing: -0.03em;
}
.eyebrow {
  color: var(--ink);
  font-weight: 700;
}

/* ── §T Type-role atlas container. */
.ds-trole-box {
  display: flex;
  flex-direction: column;
  border: var(--border-bold);
  border-radius: 0;
  background: var(--canvas);
  box-shadow: var(--shadow-hard);
  overflow: hidden;
  margin-top: 24px;
}
.ds-trole-row {
  padding: 32px;
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

/* ── Type-role samples. var(--font-*) resolves to brand DNA; decoration vars are preset-native. */
.t-trole-display-cover {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(120px, 16vw, 340px);
  line-height: 0.86;
  letter-spacing: -0.04em;
  text-transform: uppercase;
  color: var(--ink);
}
.t-trole-headline {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(72px, 9vw, 160px);
  line-height: 0.9;
  letter-spacing: -0.03em;
  text-transform: uppercase;
  color: var(--ink);
}
.t-trole-statement {
  display: inline-block;
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(48px, 6vw, 96px);
  line-height: 1;
  letter-spacing: -0.02em;
  text-transform: uppercase;
  color: var(--ink);
  background: var(--canvas);
  border: var(--border-bold);
  box-shadow: var(--shadow-hard);
  padding: 24px 32px;
  max-width: 22ch;
}
.t-trole-number-hero {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(96px, 14vw, 240px);
  line-height: 0.9;
  letter-spacing: -0.04em;
  text-transform: uppercase;
  color: var(--ink);
}
.t-trole-h2 {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(48px, 6vw, 96px);
  line-height: 0.95;
  letter-spacing: -0.03em;
  text-transform: uppercase;
  color: var(--ink);
}
.t-trole-h3 {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(28px, 3.2vw, 48px);
  line-height: 1;
  letter-spacing: -0.02em;
  text-transform: uppercase;
  color: var(--ink);
}
.t-trole-eyebrow {
  font-family: var(--font-body);
  font-weight: 700;
  font-size: clamp(24px, 1.8vw, 30px);
  line-height: 1.2;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ink);
}
.t-trole-lead {
  font-family: var(--font-body);
  font-weight: 500;
  font-size: clamp(28px, 2.6vw, 40px);
  line-height: 1.4;
  color: var(--ink);
  max-width: 48ch;
  margin: 0;
}
.t-trole-body {
  font-family: var(--font-body);
  font-weight: 500;
  font-size: clamp(24px, 1.7vw, 30px);
  line-height: 1.55;
  color: var(--ink);
  max-width: 60ch;
  margin: 0;
}
.t-trole-caption {
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: clamp(24px, 1.5vw, 28px);
  line-height: 1.4;
  letter-spacing: 0.04em;
  color: color-mix(in srgb, var(--ink) 72%, transparent);
  margin: 0;
}
.t-trole-label-mono {
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: clamp(24px, 1.5vw, 28px);
  line-height: 1.3;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--ink);
}
.t-trole-chip-loud {
  display: inline-block;
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(26px, 2vw, 36px);
  line-height: 1;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  background: var(--ink);
  color: var(--canvas);
  border: 2px solid var(--ink);
  padding: 10px 22px;
  transform: rotate(var(--tilt-l));
}
.t-trole-cta-arrow {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(24px, 2.6vw, 44px);
  line-height: 1;
  letter-spacing: -0.01em;
  text-transform: uppercase;
  color: var(--ink);
}
```
