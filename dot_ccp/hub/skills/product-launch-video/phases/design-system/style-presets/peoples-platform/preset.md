```preset-meta
{
  "name": "peoples-platform",
  "label": "People's Platform",
  "fingerprint": {
    "shadow": "triple-stamp",
    "border": "cream-inset-frame",
    "motion": "stamp-slam",
    "density": "medium",
    "voice": "manifesto"
  },
  "match_signals": [
    { "kind": "shadow_zero_blur", "weight": 0.30 },
    { "kind": "high_sat_accent",  "weight": 0.20 },
    { "kind": "medium_solid_border", "weight": 0.15 },
    { "kind": "bouncy_easing",    "weight": 0.10 },
    { "kind": "minimal_decoration", "weight": 0.05 }
  ],
  "best_for": [
    "manifesto launches",
    "indie SaaS poster",
    "editorial-stamp brands",
    "people-first storytelling",
    "campaign-style narratives"
  ],
  "avoid_for": [
    "minimalist enterprise",
    "quiet authority",
    "fintech compliance pages",
    "data-heavy dashboards",
    "luxury / glass aesthetics"
  ],
  "chromeFonts": {
    "googleFontsHref": "https://fonts.googleapis.com/css2?family=Alfa+Slab+One&family=Source+Sans+3:wght@400;500;600;700&family=Caveat+Brush&family=DM+Mono:wght@400;500&display=swap",
    "display": "Alfa Slab One",
    "body": "Source Sans 3",
    "script": "Caveat Brush",
    "mono": "DM Mono"
  }
}
```

> `chromeFonts` makes the doc chrome render in the preset's native fonts; brand fonts still apply to §6 components.

## §A Director's intent

Stamped-poster atlas. Every focal headline carries the same **triple-offset shadow**: accent word in front, a mid-warm drop at 6-10px, a deep-warm drop at 12-20px — always lower-right. The shadow IS the system; nothing else needs to shout.

One **Caveat-script handwritten accent** threads through each plate, rotated −3°, in the deep-warm drop colour. Two voices alternate — Alfa Slab for declarations, Caveat Brush for the human aside — never a third. Cream frames isolate authority surfaces. Pill chrome marks volume.

**Stance** (write into every scene; this is the brand's identity, not optional decoration):

- _character_ — triple-stamped poster system. Every focal word casts the same drop.
- _signal_ — single triple-stamp per plate. Reserve it for one phrase; never split focus.
- _cadence_ — stamp · script · stamp. Two voices alternate; nothing else.

## §B Decoration tokens (merge into design.html `:root`)

This preset uses the **5-slot brand alias system** (`--brand-primary` / `--brand-secondary` / `--brand-tertiary` / `--brand-accent` / `--brand-costume`) plus the **script font role** (`--font-script`). build-design.mjs emits these automatically. The aliases below give peoples-native names to those slots so component CSS can use the original peoples vocabulary (`var(--paper)`, `var(--blue)`, `var(--orange)`).

**Poster hue anchors** (blue / orange / cream) are a §8.2 preset-character exception. People's Platform collapses if the authority plate becomes a near-black tertiary token or the stamp signal stops reading orange; the original system is a saturated royal-blue plate with orange stamp type. Brand DNA still tints the plate, but the orange signal remains anchored.

**Drop colours** (red / red-deep) are visual signatures — they MUST contrast with the brand accent regardless of brand DNA, so they live as warm-complement literals. If a future brand's accent is red itself, override these in §B with HSL-rotated drops.

```css
/* §8.2 exception: poster hue anchors. Declared once so every surface keeps the
   original peoples high-chroma blue/orange register while brand DNA lightly
   tints the authority plate. */
--anchor-blue: #2c2cdc;
--anchor-orange: #f2a03a;
--anchor-cream: #f4e9d6;

/* Surface aliases — bind brand DNA + system neutrals into peoples vocabulary.
 *
 * IMPORTANT MAPPING NOTE: peoples uses "primary/secondary/..." as SURFACE roles
 * (paper = primary surface) but brand DNA uses them as IDENTITY-HUE roles
 * (brand-primary = the most identifying hue, often the signal). Don't confuse:
 *
 *   peoples --paper  = system canvas (light surface)           → var(--canvas)
 *   peoples --orange = orange stamp signal                     → var(--anchor-orange)
 *   peoples --blue   = vivid authority surface                 → anchor blue + brand tint
 *
 * Do not map --blue directly to --brand-tertiary: many sites expose very dark
 * text/semantic blues there, which turns the poster plate muddy instead of vivid.
 */
--paper: var(--canvas); /* system light canvas — NOT brand-primary */
--ink-line: var(--ink); /* system dark line — NOT brand-secondary */
--blue: color-mix(in srgb, var(--brand-primary) 18%, var(--anchor-blue));
--orange: var(--anchor-orange); /* THE signal — always reads orange */
--cream: color-mix(in srgb, var(--brand-costume) 68%, var(--anchor-cream));

/* Triple-stamp drop palette — warm-complement of accent (literal by design) */
--red: #e83a2a;
--red-deep: #b7281c;

/* Brand-aware derived shades via color-mix (browsers compute at render time) */
--blue-deep: color-mix(in srgb, var(--blue) 65%, var(--ink));
--orange-deep: color-mix(in srgb, var(--orange) 88%, var(--ink));
--ink-dim: color-mix(in srgb, var(--ink) 65%, var(--paper));

/* Triple-stamp shadow stack — THE signature move */
--shadow-triple-sm: 3px 3px 0 var(--red), 6px 6px 0 var(--red-deep);
--shadow-triple-md: 6px 6px 0 var(--red), 12px 12px 0 var(--red-deep);
--shadow-triple-lg: 10px 10px 0 var(--red), 20px 20px 0 var(--red-deep);

/* Frame + bullet primitives */
--frame-cream: 6px solid var(--cream);
--frame-inset: 48px; /* cream frame sits this far from plate edge */
--bullet-diamond: 28px; /* red square rotated 45°, list-only */

/* Grain tooth (two radial layers multiplied @50%) */
--grain-image:
  radial-gradient(rgba(0, 0, 0, 0.06) 1px, transparent 1px),
  radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px);
--grain-size: 3px 3px, 5px 5px;
--grain-offset: 0 0, 1px 2px;
--grain-opacity: 0.5;

/* Rotation primitives */
--tilt-script: -3deg; /* caveat-brush accent word */
--tilt-stamp: -9deg; /* round end-stamp */
```

## §D Font pairing fallback

- **display**: `'Alfa Slab One'` · `'Archivo Black'` · `'Anton'` wght 400
- **body**: `'Archivo Narrow'` · `'Inter'` · `'IBM Plex Sans'` wght 500
- **mono**: `'DM Mono'` · `'Space Mono'` · `'JetBrains Mono'` wght 500
- **script**: `'Caveat Brush'` · `'Pacifico'` · `'Kalam'` wght 400

The script role is unique to this preset — `var(--font-script)` resolves at render time when the host preset declares §D's script bullet OR the site ships a script face. If absent the role degrades to system-cursive.

## §T Type-role atlas (Phase 4b reads this to size text correctly)

The atlas is the **sole authoring source** for non-component text. Do NOT invent ad-hoc sizes.

```type-roles
[
  {
    "id": "display",
    "family": "display",
    "purpose": "hero display with triple shadow",
    "px_min": 120, "px_max": 200, "weight": 400, "leading": "0.86", "tracking": "0.005em", "case": "upper",
    "sample_html": "<div class=\"t-trole-display\">{BRAND_NAME}.</div>"
  },
  {
    "id": "mega-stamp",
    "family": "display",
    "purpose": "closing stamp",
    "px_min": 140, "px_max": 260, "weight": 400, "leading": "0.82", "tracking": "-0.01em", "case": "upper",
    "sample_html": "<div class=\"t-trole-mega-stamp\">Stamped.</div>"
  },
  {
    "id": "stat-numeral",
    "family": "display",
    "purpose": "hero stat with red + red-deep shadow",
    "px_min": 140, "px_max": 260, "weight": 400, "leading": "0.82", "tracking": "-0.015em", "case": "upper",
    "sample_html": "<div class=\"t-trole-stat-numeral\">63<sup>%</sup></div>"
  },
  {
    "id": "script-line",
    "family": "script",
    "purpose": "rotated script accent (−3°)",
    "px_min": 80, "px_max": 140, "weight": 400, "leading": "0.95", "tracking": "0.005em", "case": "lower",
    "sample_html": "<div class=\"t-trole-script-line\">over to you —</div>"
  },
  {
    "id": "framed-headline",
    "family": "display",
    "purpose": "cream-framed blue plate",
    "px_min": 60, "px_max": 108, "weight": 400, "leading": "0.92", "tracking": "0.005em", "case": "upper",
    "sample_html": "<div><span class=\"t-trole-framed-headline\">Framed plate.</span></div>"
  },
  {
    "id": "stamp-statement",
    "family": "display",
    "purpose": "paper statement with red drop + orange em",
    "px_min": 72, "px_max": 128, "weight": 400, "leading": "0.95", "tracking": "0.005em", "case": "upper",
    "sample_html": "<div class=\"t-trole-stamp-statement\">The product <em>gets simpler.</em></div>"
  },
  {
    "id": "script-inline",
    "family": "display + script",
    "purpose": "inline script accent word inside display run",
    "px_min": 40, "px_max": 64, "weight": 400, "leading": "1", "tracking": "0.005em", "case": "sentence",
    "sample_html": "<div class=\"t-trole-script-inline\">SET IN <em>slab</em> &amp; SCRIPT.</div>"
  },
  {
    "id": "lead",
    "family": "body",
    "purpose": "deck lead beside the stamp",
    "px_min": 28, "px_max": 40, "weight": 600, "leading": "1.4", "tracking": "0", "case": "sentence",
    "sample_html": "<p class=\"t-trole-lead\">The lede sits beside the stamp. Same width as the shadow; never above the headline.</p>"
  },
  {
    "id": "pill-row",
    "family": "mono",
    "purpose": "cream-bordered pill chip (chrome marker, not verdict)",
    "px_min": 27, "px_max": 32, "weight": 500, "leading": "1", "tracking": "0.18em", "case": "upper",
    "sample_html": "<div class=\"t-trole-pill-row\"><span class=\"t-trole-pill\">Vol. 01</span><span class=\"t-trole-pill t-trole-pill-paper\">May 2026</span><span class=\"t-trole-pill t-trole-pill-dark\">★ Stamped ★</span></div>"
  },
  {
    "id": "mono-chrome",
    "family": "mono",
    "purpose": "mono chrome line with star separators",
    "px_min": 27, "px_max": 32, "weight": 500, "leading": "1.5", "tracking": "0.18em", "case": "upper",
    "sample_html": "<div class=\"t-trole-mono-chrome\">★ ★ ★&nbsp; OUR THESIS &nbsp;★ ★ ★</div>"
  },
  {
    "id": "diamond-row",
    "family": "body",
    "purpose": "diamond-bulleted list row (one sentence per row)",
    "px_min": 27, "px_max": 40, "weight": 500, "leading": "1.4", "tracking": "0", "case": "sentence",
    "sample_html": "<div class=\"t-trole-diamond-row\"><span>Stamped, signed, framed.</span><span>Three lines, no more.</span></div>"
  },
  {
    "id": "star-ribbon",
    "family": "mono",
    "purpose": "orange star-ribbon strip with ink rule top + bottom",
    "px_min": 27, "px_max": 32, "weight": 500, "leading": "1", "tracking": "0.22em", "case": "upper",
    "sample_html": "<div class=\"t-trole-star-ribbon\"><span>★ Focus</span><span>★ Learn</span><span>★ Ship</span></div>"
  },
  {
    "id": "rotated-stamp",
    "family": "display + mono",
    "purpose": "rotated round stamp (−9°) with red drop",
    "px_min": 120, "px_max": 220, "weight": 400, "leading": "1", "tracking": "0", "case": "upper",
    "sample_html": "<div><span class=\"t-trole-rotated-stamp\"><span class=\"big\">END</span><span class=\"small\">— V. 01 —</span></span></div>"
  },
  {
    "id": "track-row",
    "family": "mono",
    "purpose": "dotted track timeline row (alternating orange + blue dots)",
    "px_min": 27, "px_max": 32, "weight": 500, "leading": "1", "tracking": "0.16em", "case": "upper",
    "sample_html": "<div class=\"t-trole-track-row\"><span class=\"dot\"></span><span class=\"bar\"></span><span class=\"dot alt\"></span><span class=\"bar\"></span><span class=\"dot\"></span><span class=\"bar\"></span><span class=\"dot alt\"></span><span class=\"label\">May → October</span></div>"
  },
  {
    "id": "cta-block",
    "family": "display",
    "purpose": "cream-bordered orange CTA button",
    "px_min": 32, "px_max": 48, "weight": 400, "leading": "1", "tracking": "0.02em", "case": "upper",
    "sample_html": "<div><span class=\"t-trole-cta\">Let's talk</span></div>"
  },
  {
    "id": "end-mark",
    "family": "display",
    "purpose": "closing end mark",
    "px_min": 80, "px_max": 140, "weight": 400, "leading": "0.9", "tracking": "0.005em", "case": "upper",
    "sample_html": "<div class=\"t-trole-end-mark\">Stamped.</div>"
  }
]
```

## §E Motion (GSAP consts — REPLACES site ease)

```js
const EASE = {
  entry: "back.out(2.4)", // poster slam — bounce overshoot, then stick
  emphasis: "expo.out", // triple-shadow snaps to final position
  exit: "power4.in", // dive off-screen, never fade
  drift: "sine.inOut", // ambient only (grain breath, frame width)
};
const DUR = {
  snap: 0.18,
  med: 0.45,
  slow: 0.9,
};
// RULE: never ease-in-out on primary motion — stamps land, they don't glide
// RULE: each triple-stamp entry pairs with a percussive cue (kick + snare double-hit)
// RULE: caveat-script accent stagger-pops 100-150ms after its host headline
// RULE: cream frame draws once with EASE.entry; never re-animates
// RULE: hard cut between scenes — never crossfade; the stamp IS the cut
```

### §E.5 Motion choreography

- **Allowed primitives**: stamp-slam (translateY −16→0 + scale .92→1), script-pop (rotate −3° + opacity 0→1), frame-draw (scaleX 0→1 or path stroke), grain-breath (filter brightness 1↔1.04), dot-tick (scale 0→1 staggered on track-dots).
- **Forbidden**: cross-fade between plates, slide transitions with momentum, blur in/out, any ease-in-out on primary motion.
- **Stagger budget**: 100-150ms between elements within a single plate. Tight, not languid.
- **Scene transitions**: hard cut only. No surface fade (paper-to-blue cut is part of the brand register).

## §G Voice transform recipe

Take the brand's value-prop sentence. Transform with:

1. Strip articles + connectives (the / a / of / and / with / to)
2. Break into 2-3 word noun-stamp fragments
3. UPPERCASE all
4. End each fragment with `.`
5. Drop one Caveat-script accent word inline (wrap in `<em>`) for emphasis

**Example:**

- IN: `Brex helps teams move money faster across global accounts`
- OUT: `TEAMS. MOVE MONEY. <em>faster</em>. — GLOBAL. — BREX.`

Apply ONLY to DOM-visible text (headlines, chips, button labels, stat captions). Do NOT touch narrator scripts — TTS will mispronounce uppercase and break sentence prosody.

## §H Scene composition hints

**Single surface — paper.** Every scene sits on the paper poster-board canvas (`#root` below). The blue authority plate and orange signal are **no longer full-bleed scene surfaces** — they live as **self-contained components**: `framed-stamp` / `mega-stat` / `end-stamp` carry their own `var(--blue)` fill + cream frame, `orange-quote` carries its own `var(--orange)` — dropped as cards onto the paper canvas. Scene transitions go through hard cut, never fade.

**`#root` CSS** — the one paste-ready paper stanza for the Phase 4b worker:

```css
/* paper poster-board base + paper grain */
#root {
  background: var(--paper);
  color: var(--ink);
  background-image: var(--grain-image);
  background-size: var(--grain-size);
  background-position: var(--grain-offset);
  background-blend-mode: multiply;
  font-family: var(--font-body);
}
```

(`--blue` / `--orange` / `--cream` stay defined in §B because the accent-card components use them — they're just no longer applied to `#root`.)

**Composition taste (soft — guidance, not a machine-enforced contract):**

- Single triple-stamp per plate — reserve the drop for one focal phrase; never split focus.
- Single script-accent (`script-em`) per scene — a second one breaks the register.
- Round stamps (`rotated-stamp`, `end-stamp`) read as closer beats — keep them out of opening/intro scenes.
- One focal accent card (blue/orange) per scene, paper breathing around it — don't crowd two authority plates together.

**Focal sizing per 1920×1080** (rendered px, driven by component CSS `clamp()`):

- Hero headline (display): 120-200px
- Stat numeral (display, tightest tracking): 140-260px
- Body lead: 36-60px
- Caveat-script accent: 80-140px

**Brand colour placement (60 / 30 / 10)**:

- 60% — `var(--paper)` — full-bleed poster-board background
- 30% — `var(--ink)` for type, `var(--cream)` for accent-card frame chrome
- 10% — `var(--orange)` for the stamp head / signal — one focal accent per plate

## §I Page-level CSS (makes design.html itself read as peoples)

```css
/* ── Preset-native typography vars (chromeFonts). Fallback chains avoid generic
 * serif — each ends in a font carrying the stamped-slab character. */
:root {
  --f-disp-native:
    "Alfa Slab One", "Archivo Black", "Anton", "Impact", "Arial Black", "Helvetica Neue", sans-serif;
  --f-body-native:
    "Source Sans 3", "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, system-ui,
    sans-serif;
  --f-script-native:
    "Caveat Brush", "Pacifico", "Kalam", "Brush Script MT", "Comic Sans MS", cursive;
  --f-mono-native: "DM Mono", "Space Mono", "JetBrains Mono", "Menlo", ui-monospace, monospace;
}

body {
  background: var(--paper);
  color: var(--ink);
  background-image: var(--grain-image);
  background-size: var(--grain-size);
  background-position: var(--grain-offset);
  background-blend-mode: multiply;
  font-family: var(--f-body-native);
}

/* ── Title card: cream-framed blue plate, peoples signature ── */
.title-card {
  position: relative;
  background: var(--blue);
  color: var(--cream);
  border-bottom: 8px solid var(--orange);
  padding: 120px 0 96px;
}
.title-card::after {
  content: "";
  position: absolute;
  inset: 48px 64px;
  border: var(--frame-cream);
  pointer-events: none;
}
.title-card-inner {
  position: relative;
  z-index: 1;
}
.brand-row {
  color: var(--cream);
}
.title-display {
  font-family: var(--f-disp-native);
  font-weight: 400;
  font-size: clamp(96px, 14vw, 220px);
  text-transform: uppercase;
  letter-spacing: 0.005em;
  color: var(--orange);
  text-shadow:
    8px 8px 0 var(--red),
    16px 16px 0 var(--red-deep);
  line-height: 0.86;
}
.brand-row {
  font-family: var(--f-mono-native);
}
.title-meta {
  font-family: var(--f-mono-native);
}
.brand-name {
  color: var(--cream);
  font-weight: 700;
}
.brand-x {
  color: var(--orange);
  opacity: 1;
}
.style-name {
  color: var(--cream);
  font-weight: 700;
}
.title-meta {
  color: color-mix(in srgb, var(--cream) 80%, transparent);
}
.title-meta strong {
  color: var(--orange);
}

/* ── Section chrome: thick ink dividers, blue eyebrow, triple-shadow h2 ── */
.ds-section {
  border-top: 4px solid var(--ink);
  padding: clamp(56px, 9vh, 120px) 0;
}
.eyebrow {
  font-family: var(--f-mono-native);
  color: var(--blue);
  font-weight: 700;
  letter-spacing: 0.2em;
  font-size: 13px;
  opacity: 1;
  margin-bottom: 24px;
}
h1,
h2,
h3 {
  font-family: var(--f-disp-native);
}
.ds-section h2 {
  font-family: var(--f-disp-native);
  font-weight: 400;
  font-size: clamp(56px, 9vw, 128px);
  line-height: 0.88;
  text-transform: uppercase;
  letter-spacing: 0.005em;
  color: var(--blue);
  text-shadow: 6px 6px 0 var(--red);
  margin-bottom: clamp(32px, 5vh, 56px);
  max-width: 18ch;
}
.ds-section h2 em {
  font-style: normal;
  color: var(--orange);
  text-shadow:
    6px 6px 0 var(--red),
    12px 12px 0 var(--red-deep);
}
.ds-h3 {
  font-family: var(--f-disp-native) !important;
  font-weight: 400 !important;
  font-size: clamp(20px, 1.8vw, 28px) !important;
  color: var(--blue);
  text-transform: uppercase;
  letter-spacing: 0.005em !important;
  opacity: 1 !important;
}
.ds-prose,
.ds-prose-block .ds-prose {
  font-family: var(--f-body-native);
  font-size: clamp(15px, 1.2vw, 17px);
  line-height: 1.7;
  opacity: 0.9;
}

/* ── Markdown table: peoples-flavor ── */
.ds-table {
  border: 3px solid var(--ink);
  background: var(--paper);
}
.ds-table th {
  background: var(--blue) !important;
  color: var(--cream) !important;
  border: 3px solid var(--ink) !important;
}
.ds-table td {
  border: 1px solid var(--ink) !important;
}
.ds-table td code {
  background: var(--orange);
  color: var(--blue);
  padding: 2px 6px;
  font-weight: 700;
}

/* ── Lists in prose blocks ── */
.ds-prose-block .ds-list {
  list-style: none;
  padding-left: 32px;
}
.ds-prose-block .ds-list li {
  position: relative;
}
.ds-prose-block .ds-list li::before {
  content: "";
  position: absolute;
  left: -28px;
  top: 0.55em;
  width: 14px;
  height: 14px;
  background: var(--red);
  transform: rotate(45deg);
}
.ds-prose-block .ds-list.ds-list,
.ds-prose-block ol.ds-list li::before {
  /* numbered lists keep default markers */
  display: revert;
}
.ds-prose-block ol.ds-list {
  list-style: decimal;
}
.ds-prose-block ol.ds-list li::before {
  content: none;
}

/* ── Cards take the peoples treatment: thick ink border, cream chrome on dark ── */
.dna-swatch,
.type-card,
.voice-pair,
.comp-card {
  border: 4px solid var(--ink) !important;
  border-radius: 14px !important;
}
.comp-head {
  background: var(--blue) !important;
  color: var(--cream);
  border-bottom: 4px solid var(--ink) !important;
}
.comp-head .comp-name,
.comp-head .comp-marker {
  color: var(--cream);
}
.comp-preview {
  background-image: var(--grain-image);
  background-size: var(--grain-size);
  background-position: var(--grain-offset);
  background-blend-mode: multiply;
}

/* ── Code blocks: warmer than default ── */
.ds-code {
  border: 3px solid var(--ink) !important;
  border-radius: 14px !important;
  background: #0e0e14 !important;
  color: var(--cream) !important;
}
.eyebrow code,
.ds-prose code {
  background: var(--orange);
  color: var(--blue);
  font-weight: 700;
}

/* ── .preset-native-scope: rebinds var(--font-*) to preset-native families for
 * component previews. Component source is untouched. */
.preset-native-scope {
  --font-display: var(--f-disp-native);
  --font-body: var(--f-body-native);
  --font-script: var(--f-script-native);
  --font-mono: var(--f-mono-native);
}

/* ── §T Type-role atlas. var(--font-*) → brand DNA; recipe is peoples-native. */
.ds-trole-box {
  display: flex;
  flex-direction: column;
  border: 4px solid var(--ink);
  border-radius: 14px;
  background: var(--paper);
  overflow: hidden;
  margin-top: 24px;
}
.ds-trole-row {
  padding: 30px 36px;
  border-bottom: 2px dashed color-mix(in srgb, var(--ink) 30%, transparent);
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

/* ── Type-role samples. var(--font-*) → brand DNA at render time. */
.t-trole-display {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(96px, 13vw, 200px);
  line-height: 0.86;
  letter-spacing: 0.005em;
  text-transform: uppercase;
  color: var(--orange);
  text-shadow:
    8px 8px 0 var(--red),
    16px 16px 0 var(--red-deep);
}
.t-trole-mega-stamp {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(140px, 18vw, 260px);
  line-height: 0.82;
  letter-spacing: -0.01em;
  text-transform: uppercase;
  color: var(--blue);
  text-shadow:
    10px 10px 0 var(--red),
    20px 20px 0 var(--red-deep);
}
.t-trole-stat-numeral {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(140px, 18vw, 260px);
  line-height: 0.82;
  letter-spacing: -0.015em;
  color: var(--orange);
  text-shadow:
    8px 8px 0 var(--red),
    16px 16px 0 var(--red-deep);
}
.t-trole-stat-numeral sup {
  font-size: 0.36em;
  color: var(--blue);
  text-shadow: 5px 5px 0 var(--red);
  vertical-align: top;
  line-height: 1;
}
.t-trole-script-line {
  font-family: var(--font-script);
  font-weight: 400;
  font-size: clamp(80px, 9vw, 140px);
  line-height: 0.95;
  color: var(--red);
  transform: rotate(-3deg);
  display: inline-block;
}
.t-trole-framed-headline {
  display: inline-block;
  padding: 24px 32px;
  border: 5px solid var(--cream);
  background: var(--blue);
  color: var(--orange);
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(60px, 7vw, 108px);
  line-height: 0.92;
  letter-spacing: 0.005em;
  text-transform: uppercase;
  text-shadow: 5px 5px 0 var(--red);
}
.t-trole-stamp-statement {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(72px, 8vw, 128px);
  line-height: 0.95;
  letter-spacing: 0.005em;
  text-transform: uppercase;
  color: var(--blue);
  text-shadow: 5px 5px 0 var(--red);
}
.t-trole-stamp-statement em {
  font-style: normal;
  color: var(--orange);
  text-shadow: 5px 5px 0 var(--red);
}
.t-trole-script-inline {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(40px, 4vw, 64px);
  line-height: 1;
  letter-spacing: 0.005em;
  text-transform: uppercase;
  color: var(--blue);
}
.t-trole-script-inline em {
  font-style: normal;
  font-family: var(--font-script);
  text-transform: lowercase;
  color: var(--red);
  font-size: 1.05em;
  transform: rotate(-3deg);
  display: inline-block;
  margin: 0 0.12em;
}
.t-trole-lead {
  font-family: var(--font-body);
  font-weight: 600;
  font-size: clamp(28px, 2.4vw, 40px);
  line-height: 1.4;
  color: var(--ink);
  max-width: 44ch;
  margin: 0;
}
.t-trole-pill-row {
  display: inline-flex;
  gap: 8px;
  flex-wrap: wrap;
}
.t-trole-pill {
  display: inline-block;
  padding: 10px 22px;
  border: 3px solid var(--cream);
  background: var(--blue);
  color: var(--cream);
  font-family: var(--font-mono);
  font-weight: 500;
  font-size: 27px;
  line-height: 1;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  border-radius: 999px;
}
.t-trole-pill.t-trole-pill-dark {
  background: var(--ink);
  border-color: var(--ink);
  color: var(--orange);
}
.t-trole-pill.t-trole-pill-paper {
  background: var(--paper);
  border-color: var(--ink);
  color: var(--ink);
}
.t-trole-mono-chrome {
  font-family: var(--font-mono);
  font-weight: 500;
  font-size: 27px;
  line-height: 1.5;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ink);
}
.t-trole-diamond-row {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.t-trole-diamond-row span {
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 27px;
  line-height: 1.4;
  color: var(--ink);
  padding-left: 42px;
  position: relative;
}
.t-trole-diamond-row span::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0.4em;
  width: 22px;
  height: 22px;
  background: var(--red);
  transform: rotate(45deg);
}
.t-trole-star-ribbon {
  display: flex;
  align-items: center;
  gap: 36px;
  padding: 18px 28px;
  background: var(--orange);
  border-top: 5px solid var(--ink);
  border-bottom: 5px solid var(--ink);
  font-family: var(--font-mono);
  font-weight: 500;
  font-size: 27px;
  line-height: 1;
  letter-spacing: 0.22em;
  color: var(--blue);
  text-transform: uppercase;
}
.t-trole-rotated-stamp {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 220px;
  height: 220px;
  border-radius: 50%;
  background: var(--cream);
  color: var(--blue);
  border: 6px solid var(--orange);
  transform: rotate(-9deg);
  box-shadow: 8px 8px 0 var(--red);
  font-family: var(--font-display);
  font-weight: 400;
  line-height: 1;
  text-transform: uppercase;
  text-align: center;
  gap: 10px;
}
.t-trole-rotated-stamp .big {
  font-size: 52px;
  line-height: 0.9;
}
.t-trole-rotated-stamp .small {
  font-size: 24px;
  letter-spacing: 0.18em;
  font-family: var(--font-mono);
}
.t-trole-track-row {
  display: flex;
  align-items: center;
  gap: 14px;
}
.t-trole-track-row .dot {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--orange);
  border: 5px solid var(--ink);
  box-shadow: 4px 4px 0 var(--red);
  flex-shrink: 0;
}
.t-trole-track-row .dot.alt {
  background: var(--blue);
}
.t-trole-track-row .bar {
  flex: 0 1 60px;
  height: 8px;
  background: var(--ink);
}
.t-trole-track-row .label {
  font-family: var(--font-mono);
  font-weight: 500;
  font-size: 27px;
  line-height: 1;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--ink);
}
.t-trole-cta {
  display: inline-block;
  padding: 18px 32px;
  background: var(--orange);
  color: var(--blue);
  border: 5px solid var(--cream);
  box-shadow: 8px 8px 0 var(--red);
  font-family: var(--font-display);
  font-weight: 400;
  font-size: 32px;
  line-height: 1;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}
.t-trole-end-mark {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(80px, 9vw, 140px);
  line-height: 0.9;
  letter-spacing: 0.005em;
  text-transform: uppercase;
  color: var(--orange);
  text-shadow:
    6px 6px 0 var(--red),
    12px 12px 0 var(--red-deep);
}
```
