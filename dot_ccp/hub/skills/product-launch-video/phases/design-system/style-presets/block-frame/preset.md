```preset-meta
{
  "name": "block-frame",
  "label": "Block Frame",
  "fingerprint": {
    "shadow": "hard-offset-black",
    "border": "4px-solid-ink",
    "palette": "saturated-pastel-cycle",
    "motion": "tilt-and-snap",
    "decoration": "tilted-puncture"
  },
  "match_signals": [
    { "kind": "shadow_zero_blur", "weight": 0.3 },
    { "kind": "thick_solid_border", "weight": 0.3 },
    { "kind": "high_sat_accent", "weight": 0.15 },
    { "kind": "minimal_decoration", "weight": 0.05 }
  ],
  "best_for": ["indie SaaS launches", "agency credentials", "creative reviews", "brand redesigns", "design-led product talks"],
  "avoid_for": ["regulated disclosures", "formal legal briefs", "institutional restraint", "enterprise compliance"],
  "chromeFonts": {
    "googleFontsHref": "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap",
    "display": "Inter",
    "body": "Inter",
    "script": "Inter",
    "mono": "Space Grotesk"
  }
}
```

> `chromeFonts` makes the doc chrome render in the preset's native fonts; brand fonts still apply to §6 components. Block Frame is a two-face system — Inter does display + body, Space Grotesk carries mono/labels; the `script` slot points at Inter (refuses a third face).

## §A Director's intent

Block Frame is maximalist neobrutalism: every region wears a 4px solid ink
border, every elevated card carries an 8px hard offset shadow (zero blur,
solid ink), every corner is square, and the canvas cycles through five
saturated pastels — pink, blue, green, yellow, cream — plus off-white and
ink. Display is heavy uppercase Inter with negative tracking; chrome is
wide-tracked Space Grotesk in caps. Decorative tilts (±2° to ±12°),
star-bursts, stripe blocks, and dot grids puncture the grid intentionally.
Density is the rule: empty surfaces feel timid.

Brand-aware color contract: `--brand-primary` is the dominant pastel
ground, `--brand-secondary` is the colored-shadow accent (replaces the
template's signature yellow shadow on the close-frame), `--brand-accent`
is the CTA fill. Class prefix is `bf-` (block-frame initials).

## §B Decoration tokens

```css
/* Border ladder — 4px primary, 3px secondary, 2px atomic chrome */
--bf-border-bold: 4px solid var(--ink);
--bf-border-mid: 3px solid var(--ink);
--bf-border-thin: 2px solid var(--ink);

/* Hard offset shadow stack — solid ink, zero blur, bottom-right */
--bf-shadow: 8px 8px 0 var(--ink);
--bf-shadow-sm: 4px 4px 0 var(--ink);
--bf-shadow-hover: 6px 6px 0 var(--ink);

/* Inverted close-surface depth — only colored shadow in the system,
   aliased to brand-secondary so it follows the site palette instead
   of the template's locked yellow. */
--bf-shadow-close: 12px 12px 0 var(--brand-secondary);
--bf-shadow-close-btn: 6px 6px 0 var(--canvas);

/* Tilt vocabulary — stat cards alternate small, decorations tilt loud */
--bf-tilt-sm-l: -2deg;
--bf-tilt-sm-r: 2deg;
--bf-tilt-md-l: -8deg;
--bf-tilt-md-r: 8deg;
--bf-tilt-loud: 12deg;

/* Spacing — template's px scale, kept px for structural fidelity */
--bf-pad-card: 36px;
--bf-pad-card-sm: 28px;
--bf-pad-card-xs: 22px;
--bf-pad-card-lg: 60px;
--bf-gap-lg: 48px;
--bf-gap-md: 32px;
--bf-gap-sm: 24px;
--bf-gap-xs: 16px;

/* Decorative dot-grid pattern unit */
--bf-dot-size: 24px;
--bf-dot-radius: 1.2px;
```

## §D Font pairing fallback

- **display**: `'Inter'` · `'Archivo Black'` · `'Space Grotesk'` wght 900
- **body**: `'Inter'` · `'IBM Plex Sans'` wght 500
- **mono**: `'Space Grotesk'` · `'JetBrains Mono'` · `'IBM Plex Mono'` wght 600

## §T Type-role atlas (Phase 4b reads this to size text correctly)

The atlas is the **sole authoring source** for non-component text. Do NOT invent ad-hoc sizes — Block Frame's identity depends on the heavy-uppercase + negative-tracking + sentence-body + wide-tracked-label ladder.

```type-roles
[
  {
    "id": "heading-xl",
    "family": "display",
    "purpose": "hero / cover headline — uppercase Inter 900 with negative tracking",
    "px_min": 48, "px_max": 96, "weight": 900, "leading": "0.95", "tracking": "-0.03em", "case": "upper",
    "sample_html": "<div class=\"t-trole-heading-xl\">Neo-Brutalism Style</div>"
  },
  {
    "id": "heading-lg",
    "family": "display",
    "purpose": "primary section headline (Inter 800, uppercase, -0.02em)",
    "px_min": 32, "px_max": 64, "weight": 800, "leading": "1", "tracking": "-0.02em", "case": "upper",
    "sample_html": "<div class=\"t-trole-heading-lg\">What we deliver</div>"
  },
  {
    "id": "heading-md",
    "family": "display",
    "purpose": "region or chart title (Inter 700, sentence-case allowed)",
    "px_min": 24, "px_max": 40, "weight": 700, "leading": "1.1", "tracking": "-0.01em", "case": "sentence",
    "sample_html": "<div class=\"t-trole-heading-md\">Quarterly growth metrics</div>"
  },
  {
    "id": "close-title",
    "family": "display",
    "purpose": "closing-statement title on the inverted ink surface (cream / canvas text)",
    "px_min": 40, "px_max": 80, "weight": 900, "leading": "0.95", "tracking": "-0.03em", "case": "upper",
    "sample_html": "<div class=\"t-trole-close-title\">Let's build something bold</div>"
  },
  {
    "id": "quote-text",
    "family": "display",
    "purpose": "uppercase pull-quote body (Inter 900, framed inside a bordered quote-frame)",
    "px_min": 28, "px_max": 52, "weight": 900, "leading": "1.15", "tracking": "-0.02em", "case": "upper",
    "sample_html": "<div class=\"t-trole-quote-text\">Design is how it works, how it feels, how it lasts.</div>"
  },
  {
    "id": "stat-number",
    "family": "display",
    "purpose": "hero / card stat numeral (Inter 900, line-height 1)",
    "px_min": 36, "px_max": 64, "weight": 900, "leading": "1", "tracking": "0", "case": "upper",
    "sample_html": "<div class=\"t-trole-stat-number\">98%</div>"
  },
  {
    "id": "card-title",
    "family": "display",
    "purpose": "feature / intro / team card title — Inter 700 uppercase",
    "px_min": 24, "px_max": 28, "weight": 700, "leading": "1.2", "tracking": "0", "case": "upper",
    "sample_html": "<div class=\"t-trole-card-title\">Modular layouts</div>"
  },
  {
    "id": "step-num",
    "family": "display",
    "purpose": "timeline-step numeral — Inter 900 at 0.6 opacity (mandatory reduction)",
    "px_min": 48, "px_max": 48, "weight": 900, "leading": "1", "tracking": "0", "case": "upper",
    "sample_html": "<div class=\"t-trole-step-num\">01</div>"
  },
  {
    "id": "label-pill",
    "family": "mono",
    "purpose": "universal eyebrow inside a bordered + shadowed pastel pill — Space Grotesk 600, 13px, 0.08em tracked, uppercase",
    "px_min": 24, "px_max": 24, "weight": 600, "leading": "1", "tracking": "0.08em", "case": "upper",
    "sample_html": "<div><span class=\"t-trole-label-pill\">Overview</span></div>"
  },
  {
    "id": "mono-tag",
    "family": "mono",
    "purpose": "mono tag / badge — Space Grotesk 600, 14px, 0.05em tracked, uppercase",
    "px_min": 24, "px_max": 24, "weight": 600, "leading": "1", "tracking": "0.05em", "case": "upper",
    "sample_html": "<div class=\"t-trole-mono-tag\">12+ years</div>"
  },
  {
    "id": "counter",
    "family": "mono",
    "purpose": "persistent slide counter — Space Grotesk 700, 14px, 0.1em tracked, uppercase (NN / NN)",
    "px_min": 24, "px_max": 24, "weight": 700, "leading": "1", "tracking": "0.1em", "case": "upper",
    "sample_html": "<div class=\"t-trole-counter\">01 / 10</div>"
  }
]
```

## §E Motion (GSAP consts — REPLACES site ease)

```js
// RULE: motion is snap-and-hit, never slow ease-in-out for primary entrances.
// RULE: cards "punch in" — translate from -8/-8 offset with shadow growing
//       from 0 to var(--bf-shadow). Mirrors the hover lift-up signature.
// RULE: tilts are baked at rest; do NOT tween rotation during entry.
//       Tilt-then-pop reads as wobble; tilt-at-rest reads as deliberate.
// RULE: emphasis on chrome (label-pills, buttons) uses back.out(1.6) to
//       echo the hard-shadow "stamp" feel.
// RULE: never blur shadows during motion — toggle box-shadow values, do
//       not interpolate filter() or use shadow-blur tweens.

const EASE = {
  entry: "expo.out", // cards hit and stick — template uses 0.15s ease but punchier on video scale
  emphasis: "back.out(1.6)", // chrome pops (pills, buttons, stat cards) — echoes the brutalist stamp
  exit: "power2.in", // sharp exits — never linger
  drift: "sine.inOut", // ambient (dot-grid fade-in, tilt micro-sway) only
};

const DUR = {
  snap: 0.16, // chrome hover, label-pill in, button settle — mirrors template's 0.15s
  med: 0.42, // card entry, headline reveal
  slow: 0.9, // hero entry, close-frame reveal — the loudest moments
};
```

### §E.5 Motion choreography

- **Allowed primitives:** snap-translate (-8/-8 → 0/0 with shadow grow),
  punch-scale (0.92 → 1.0 with back.out), stagger-reveal (children appear
  at 0.06s offset), shadow-grow (0/0 → 8/8 in DUR.med), tilt-rest (tilt
  applied at rest, not tweened).
- **Forbidden gestures:** rotation tweens, blur interpolation, ease-in-out
  on primary motion (only on `drift`), cross-fade between cards (use
  punch-translate or hard cut).
- **Transition defaults:** hard cut between scenes is the spiritual default
  (the template has no slide transitions). If a transition is needed,
  punch-translate the incoming hero element with DUR.med + EASE.emphasis.
- **Type-in-motion:** display headlines reveal as a single unit (no per-
  character split). Sub-headline reveals at +0.12s with `power2.out` +
  DUR.snap. Label-pills always emphasis-pop, never linear-fade.
- **Stagger budget:** ≤6 elements in a single stagger; beyond that, group
  visually (timeline-step row, stat-grid) and animate the group as one.

## §G Voice transform recipe

1. Strip articles and connectives (the / a / of / and / with / to).
2. Break into 2-4 word noun-verb-noun fragments or single dominant nouns.
3. UPPERCASE all on-screen text that lands in display, chip, or button
   slots — sentence body stays sentence case.
4. Join fragments with `.` + linebreak for stacked impact, or em-dash
   `—` for a single beat of emphasis.
5. End headlines on a noun, not a verb — the brutalist stamp lands on the
   thing, not the action.
6. Brand name appears as the final clause, punctuated standalone.

**Example:**

- IN: `Higgsfield is the AI platform that helps creators generate stunning visuals in seconds`
- OUT: `CREATORS. GENERATE. STUNNING VISUALS — IN SECONDS. HIGGSFIELD.`

## §H Scene composition hints

- **Surface alternation:** cycle scene grounds through off-white →
  `--brand-primary` pastel → off-white → `--brand-accent` pastel → ink
  close. Staying on one ground for >2 consecutive scenes flattens the
  system. The cycle is the rhythm.
- **Brand-color role contract:** `--brand-primary` is the dominant ground
  pastel and the icon-square fill; `--brand-secondary` is the colored
  shadow on the close-frame and the stat-deco-dot fill; `--brand-accent`
  is the CTA (button) and list-number / feature-deco fill.
- **Focal element sizing:** hero headline reaches 6-8vw at minimum; never
  shrink display Inter below 4vw or its character collapses. Stat
  numerals at 4-6vw with line-height 1.
- **Card-on-ground structure:** every scene's primary content sits inside
  a bordered card (4px ink, 8px ink shadow) on a pastel ground. Secondary
  cells inside the card use 3px border + 4px shadow.
- **Required decorative disruption:** every scene carries at least one
  decorative element — a tilted rectangle, a star-burst, a stripe-block,
  a dot-grid corner, or a corner-bracket frame. Empty surface reads as
  broken.
- **Tilt rules:** stat cards alternate `var(--bf-tilt-sm-l)` /
  `var(--bf-tilt-sm-r)`. Decorative rectangles and stars use
  `var(--bf-tilt-md-l/r)` to `var(--bf-tilt-loud)`. Never tilt primary
  cards more than ±2°; never leave decoration un-tilted.
- **Forbidden shapes:** no rounded corners on cards / buttons / pills /
  icon-squares / avatars. The only circle in the system is the 12px
  stat-deco dot.
- **Border discipline:** borders are always solid ink (or solid canvas on
  the inverted close-frame). No colored borders. No 1px or 5px+ borders;
  the ladder is 2 / 3 / 4 only.
- **Shadow discipline:** all shadows zero-blur, solid color, offset
  bottom-right. The only colored shadow is `--bf-shadow-close` on the
  closing surface; everywhere else, shadow is solid ink.
- **Close-frame:** final scene uses ink ground, canvas-color text,
  canvas-bordered close-frame, and `--bf-shadow-close` (12px offset in
  brand-secondary). This is the loudest depth statement in the deck.

## §I Page-level CSS

```css
/* ── Preset-native typography vars (chromeFonts). No script face — script slot
 * points at Inter (refuses a third face). Space Grotesk in mono slot. */
:root {
  --f-disp-native:
    "Inter", "Archivo Black", "Helvetica Neue", -apple-system, BlinkMacSystemFont, system-ui,
    sans-serif;
  --f-body-native:
    "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  --f-script-native:
    "Inter", "Archivo Black", "Helvetica Neue", -apple-system, BlinkMacSystemFont, system-ui,
    sans-serif;
  --f-mono-native:
    "Space Grotesk", "JetBrains Mono", "IBM Plex Mono", "Menlo", ui-monospace, monospace;
}

/* .preset-native-scope: rebinds var(--font-*) to preset-native families for
 * component previews + §T atlas. Component source is untouched. */
.preset-native-scope {
  --font-display: var(--f-disp-native);
  --font-body: var(--f-body-native);
  --font-script: var(--f-script-native);
  --font-mono: var(--f-mono-native);
}

/* design.html chrome — borrows the preset's visual register */
body {
  background: var(--canvas, #fffdf5);
  font-family: "Inter", sans-serif;
  color: var(--ink, #000);
}

h1,
h2,
h3 {
  font-family: "Inter", sans-serif;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: -0.02em;
}

h2 {
  border-bottom: var(--bf-border-bold, 4px solid #000);
  padding-bottom: 0.4em;
  margin-top: 1.4em;
}

code,
pre {
  font-family: "Space Grotesk", monospace;
  background: color-mix(in srgb, var(--brand-primary, #fe90e8) 12%, transparent);
  border: var(--bf-border-mid, 3px solid #000);
  padding: 0.1em 0.4em;
}

pre {
  padding: 1em;
  box-shadow: var(--bf-shadow-sm, 4px 4px 0 #000);
}

/* ── §T Type-role atlas. var(--font-*) → brand DNA; only recipe is preset-declared. */
.ds-trole-box {
  display: flex;
  flex-direction: column;
  border: var(--bf-border-bold, 4px solid var(--ink));
  border-radius: 0;
  background: var(--canvas, #fffdf5);
  box-shadow: var(--bf-shadow, 8px 8px 0 var(--ink));
  overflow: hidden;
  margin-top: 24px;
}
.ds-trole-row {
  padding: 28px 32px;
  border-bottom: var(--bf-border-thin, 2px solid var(--ink));
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
.t-trole-heading-xl {
  font-family: var(--font-display);
  font-weight: 900;
  font-size: clamp(48px, 6vw, 96px);
  line-height: 0.95;
  letter-spacing: -0.03em;
  text-transform: uppercase;
  color: var(--ink);
}
.t-trole-heading-lg {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(32px, 4vw, 64px);
  line-height: 1;
  letter-spacing: -0.02em;
  text-transform: uppercase;
  color: var(--ink);
}
.t-trole-heading-md {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(24px, 2.5vw, 40px);
  line-height: 1.1;
  letter-spacing: -0.01em;
  color: var(--ink);
}
.t-trole-close-title {
  display: inline-block;
  font-family: var(--font-display);
  font-weight: 900;
  font-size: clamp(40px, 5vw, 80px);
  line-height: 0.95;
  letter-spacing: -0.03em;
  text-transform: uppercase;
  color: var(--canvas, #fffdf5);
  background: var(--ink);
  border: 4px solid var(--canvas, #fffdf5);
  box-shadow: 12px 12px 0 var(--brand-secondary, var(--brand-primary));
  padding: 24px 32px;
  max-width: 22ch;
}
.t-trole-quote-text {
  display: inline-block;
  font-family: var(--font-display);
  font-weight: 900;
  font-size: clamp(28px, 3.5vw, 52px);
  line-height: 1.15;
  letter-spacing: -0.02em;
  text-transform: uppercase;
  color: var(--ink);
  background: var(--canvas, #fffdf5);
  border: 4px solid var(--ink);
  box-shadow: 8px 8px 0 var(--ink);
  padding: 24px 32px;
  max-width: 28ch;
}
.t-trole-stat-number {
  font-family: var(--font-display);
  font-weight: 900;
  font-size: clamp(36px, 4vw, 64px);
  line-height: 1;
  color: var(--ink);
}
.t-trole-card-title {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 28px;
  line-height: 1.2;
  text-transform: uppercase;
  color: var(--ink);
}
.t-trole-step-num {
  font-family: var(--font-display);
  font-weight: 900;
  font-size: 48px;
  line-height: 1;
  color: var(--ink);
  opacity: 0.6;
}
.t-trole-label-pill {
  display: inline-block;
  font-family: var(--font-mono);
  font-weight: 600;
  font-size: 24px;
  line-height: 1;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ink);
  background: var(--brand-primary);
  border: 3px solid var(--ink);
  box-shadow: 4px 4px 0 var(--ink);
  padding: 6px 16px;
}
.t-trole-mono-tag {
  display: inline-block;
  font-family: var(--font-mono);
  font-weight: 600;
  font-size: 24px;
  line-height: 1;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--ink);
  background: var(--brand-accent, var(--brand-primary));
  border: 3px solid var(--ink);
  padding: 10px 20px;
}
.t-trole-counter {
  display: inline-block;
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: 24px;
  line-height: 1;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink);
  background: var(--canvas, #fffdf5);
  border: 3px solid var(--ink);
  box-shadow: 4px 4px 0 var(--ink);
  padding: 10px 18px;
}
```

</content>
</invoke>
