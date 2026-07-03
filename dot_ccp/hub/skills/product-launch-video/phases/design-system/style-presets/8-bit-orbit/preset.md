```preset-meta
{
  "name": "8-bit-orbit",
  "label": "8-Bit Orbit",
  "fingerprint": {
    "shadow": "stacked-pixel-offset",
    "border": "none",
    "motion": "pixel-snap-twinkle",
    "density": "atmospherically-loaded",
    "contrast": "dark-neon",
    "palette-mode": "closed"
  },
  "match_signals": [
    { "kind": "high_sat_accent",   "weight": 0.40 },
    { "kind": "shadow_zero_blur",  "weight": 0.25 },
    { "kind": "condensed_display", "weight": 0.10 }
  ],
  "best_for": ["gaming", "cyberpunk", "web3", "indie tools", "high-saturation brands", "retro tech", "arcade"],
  "avoid_for": ["light-canvas brands", "minimalist pastel", "low-saturation editorial"],
  "chromeFonts": {
    "googleFontsHref": "https://fonts.googleapis.com/css2?family=Tektur:wght@400;500;600;700;800;900&family=Chakra+Petch:wght@400;500;700&family=Space+Mono:wght@400;700&display=swap",
    "display": "Tektur",
    "body": "Chakra Petch",
    "script": "Tektur",
    "mono": "Space Mono"
  }
}
```

> `chromeFonts` makes the doc chrome render in the preset's native fonts; brand fonts still apply to §6 components. 8-Bit Orbit has no script slot — `script` points back at Tektur because the preset refuses a fourth face.

## §A Director's intent

CRT cabinet meets editorial discipline. Tektur display sits on a strict 4px grid; Chakra Petch body reads at HUD distance; Space Mono labels feel like console readouts.

Depth is **stacked hard offset shadows** in 4px increments — never blur. Hero text gets a two-layer shadow (brand-secondary at +4/+4, navy at +8/+8). Buttons get a six-piece stack (three navy steps + three brand-color halo steps).

**Brand DNA drives color, preset drives structure.** Three site colors (`--brand-primary` / `--brand-secondary` / `--brand-accent`) ignite headlines, stat numerals, accent rules, and label fills. They **never** appear as body text. The dark base (`--canvas-void` / `--canvas-navy`) is mandatory — scanline and CRT vignette overlays are invisible without a blackpoint.

**Color role contract**: one scene = one dominant brand color carrying the hero / chip / button fill; the other two brand colors appear only as shadow halos, stat numerals, or particle accents. Body / supporting text uses white (`var(--ink)` if light on dark, otherwise neutral 0.85 opacity).

Motion is pixel-snap: hard arrivals, no glide. Ambient layers (starfield twinkle, pixel-particle float) live behind everything on dark surfaces. Scene transitions are hard cuts — crossfade kills the arcade.

**Atmosphere is non-negotiable.** Every scene gets scanlines + grain (+ CRT vignette on dark surfaces). A clean surface reads as broken.

## §B Decoration tokens (merge into design.html `:root`)

8-Bit Orbit declares **structural** tokens here (pixel unit, shadow stacks, atmosphere overlays). Color is sourced from site brand DNA — `--brand-primary` / `--brand-secondary` / `--brand-accent` flow through component CSS naturally.

The dark base (`--canvas-void` / `--canvas-navy`) is the **one exception**: scanline and CRT vignette overlays are physically invisible without a blackpoint, so the dark base is a technical requirement, not a palette choice. Same pattern as liquid-glass's `--liquid-bg-deep`.

```css
/* Mandatory dark base — scanline + CRT vignette overlays need blackpoint */
--canvas-void: #0a0e27; /* darkest, hero scenes */
--canvas-navy: #0f1b3d; /* darker, most scenes */

/* HUD text — light blue-white for body / supporting copy on the dark base.
   Paired with the dark base for the same technical reason: default --ink is
   near-black and invisible on canvas-void. Brand DNA never supplies this. */
--hud-text: #d0e6ff;

/* Pixel unit — all offsets, gaps, paddings are multiples of this */
--pixel-unit: 4px;
--gap-pixel-sm: 16px;
--gap-pixel-md: 24px;
--gap-pixel-lg: 32px;

/* Signature stacked-offset shadows — color comes from site brand DNA.
   *-primary stacks the secondary brand color as halo; *-secondary stacks accent. */
--shadow-pixel-stack-primary:
  4px 0 0 0 var(--canvas-navy), 0 4px 0 0 var(--canvas-navy), 4px 4px 0 0 var(--canvas-navy),
  8px 4px 0 0 var(--brand-secondary), 4px 8px 0 0 var(--brand-secondary),
  8px 8px 0 0 var(--brand-secondary);
--shadow-pixel-stack-secondary:
  4px 0 0 0 var(--canvas-navy), 0 4px 0 0 var(--canvas-navy), 4px 4px 0 0 var(--canvas-navy),
  8px 4px 0 0 var(--brand-accent), 4px 8px 0 0 var(--brand-accent), 8px 8px 0 0 var(--brand-accent);
--shadow-pixel-l:
  4px 0 0 0 var(--canvas-navy), 0 4px 0 0 var(--canvas-navy), 4px 4px 0 0 var(--canvas-navy);
--shadow-pixel-text: 4px 4px 0 var(--brand-secondary), 8px 8px 0 var(--canvas-navy);
--shadow-card-featured: 8px 8px 0 var(--brand-secondary);

/* Atmosphere overlays — scanlines + grain + vignette are the always-on trio.
   §H mandates all three on every scene; without the trio a surface reads as broken. */
--scanline-overlay: repeating-linear-gradient(
  0deg,
  transparent 0px,
  transparent 2px,
  rgba(10, 14, 39, 0.04) 2px,
  rgba(10, 14, 39, 0.04) 4px
);
--crt-vignette: radial-gradient(ellipse at center, transparent 50%, rgba(10, 14, 39, 0.25) 100%);
/* SVG fractal-noise grain — inlined data URI so no external asset needed.
   Apply via ::before or ::after at opacity ~0.035, z-index 49-51, pointer-events: none. */
--grain-overlay: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/></svg>");
--grain-opacity: 0.035;

/* Grid wallpaper — primary brand color etched at low opacity onto dark base */
--bg-grid-size: 40px 40px;
```

## §D Font pairing fallback (if brand fonts not on Google Fonts)

8-Bit Orbit forces its display / body / mono regardless of site DNA — the pixel-grid logic depends on Tektur's geometry. Fallbacks below are only used if the primary face fails to load.

- **display**: `'Tektur'` · `'Press Start 2P'` · `'VT323'` wght 700
- **body**: `'Chakra Petch'` · `'Rajdhani'` · `'IBM Plex Sans'` wght 400
- **mono**: `'Space Mono'` · `'JetBrains Mono'` · `'IBM Plex Mono'` wght 400

## §T Type-role atlas (Phase 4b reads this to size text correctly)

```type-roles
[
  {
    "id": "pixel-hero",
    "family": "display",
    "purpose": "cover hero / CTA title — Tektur 900 with the two-layer pixel text-shadow",
    "px_min": 96, "px_max": 128, "weight": 900, "leading": "1.05", "tracking": "0.04em", "case": "upper",
    "sample_html": "<div class=\"t-trole-pixel-hero\">Boot Up</div>"
  },
  {
    "id": "display",
    "family": "display",
    "purpose": "large section opener (one tier below pixel-hero)",
    "px_min": 48, "px_max": 64, "weight": 700, "leading": "1.15", "tracking": "0.02em", "case": "upper",
    "sample_html": "<div class=\"t-trole-display\">Section Open</div>"
  },
  {
    "id": "headline",
    "family": "display",
    "purpose": "primary slide headline (section workhorse)",
    "px_min": 32, "px_max": 45, "weight": 700, "leading": "1.15", "tracking": "0.02em", "case": "upper",
    "sample_html": "<div class=\"t-trole-headline\">Primary headline</div>"
  },
  {
    "id": "subhead",
    "family": "display",
    "purpose": "region subheading / card title",
    "px_min": 28, "px_max": 34, "weight": 700, "leading": "1.15", "tracking": "0.02em", "case": "upper",
    "sample_html": "<div class=\"t-trole-subhead\">Card title</div>"
  },
  {
    "id": "stat-number",
    "family": "display",
    "purpose": "stat tile numeral — Tektur 900 with the 3px navy text-shadow",
    "px_min": 40, "px_max": 56, "weight": 900, "leading": "1", "tracking": "0", "case": "upper",
    "sample_html": "<div class=\"t-trole-stat-number\">4M</div>"
  },
  {
    "id": "quote-body",
    "family": "body",
    "purpose": "quote text — Chakra Petch weight 500",
    "px_min": 26, "px_max": 34, "weight": 500, "leading": "1.8", "tracking": "0", "case": "sentence",
    "sample_html": "<p class=\"t-trole-quote-body\">The quote runs in Chakra Petch medium, separated below by the yellow quote-line rule.</p>"
  },
  {
    "id": "label-pill",
    "family": "mono",
    "purpose": "text inside the navy label pill — universal section eyebrow",
    "px_min": 24, "px_max": 24, "weight": 700, "leading": "1", "tracking": "0.2em", "case": "upper",
    "sample_html": "<div class=\"t-trole-label-pill\">Section · 01</div>"
  },
  {
    "id": "label-eyebrow",
    "family": "mono",
    "purpose": "standalone uppercase eyebrow (heavier tracking than the pill)",
    "px_min": 24, "px_max": 26, "weight": 400, "leading": "1", "tracking": "0.3em", "case": "upper",
    "sample_html": "<div class=\"t-trole-label-eyebrow\">System readout</div>"
  },
  {
    "id": "badge",
    "family": "mono",
    "purpose": "outline-only hero badge text",
    "px_min": 24, "px_max": 24, "weight": 400, "leading": "1", "tracking": "0.1em", "case": "upper",
    "sample_html": "<div class=\"t-trole-badge\">Real-time</div>"
  },
  {
    "id": "chart-value",
    "family": "mono",
    "purpose": "chart bar value numerals",
    "px_min": 24, "px_max": 26, "weight": 700, "leading": "1", "tracking": "0.05em", "case": "upper",
    "sample_html": "<div class=\"t-trole-chart-value\">99.9%</div>"
  },
  {
    "id": "date-chip",
    "family": "mono",
    "purpose": "date marker on timeline events — navy pill with neon text",
    "px_min": 24, "px_max": 24, "weight": 400, "leading": "1", "tracking": "0.1em", "case": "upper",
    "sample_html": "<div class=\"t-trole-date-chip\">2026 · 03</div>"
  },
  {
    "id": "counter",
    "family": "mono",
    "purpose": "persistent slide counter (NN / NN)",
    "px_min": 24, "px_max": 24, "weight": 400, "leading": "1", "tracking": "0.15em", "case": "upper",
    "sample_html": "<div class=\"t-trole-counter\">01 / 10</div>"
  }
]
```

## §E Motion (GSAP consts — REPLACES site ease)

```js
const EASE = {
  entry: "back.out(1.4)", // pixel snap with slight overshoot — arcade feel
  emphasis: "steps(4)", // staircase, NOT smooth — matches 4px pixel grid
  exit: "power2.in", // accelerate off-grid
  drift: "sine.inOut", // twinkle / float ambient only
};
const DUR = {
  snap: 0.12,
  med: 0.4,
  slow: 0.8,
};
// RULE: emphasis="steps(4)" is the signature — use it on hero number reveals,
//       chip counts, and stat-block tweens. NEVER tween position with steps()
//       (snap the value, not the position) — apply steps() to opacity / scale / numeric counters.
// RULE: never tween sub-pixel positions. All x/y values must round to multiples of 4
//       in onUpdate. Sub-pixel motion looks broken at pixel-grid scale.
// RULE: scene transitions are hard cuts. Do not animate scene-out — let it snap.
```

### §E.5 Motion choreography

**Allowed primitives**

- Hard cut between scenes (no crossfade, no slide).
- Snap-pop entry on hero text (back.out 1.4) — short overshoot, no glide.
- Stepped emphasis on numerics (counter, stat reveal, bar fill via steps(4)).
- Ambient: starfield twinkle (3s sine), pixel-particle float (8s sine), CRT scanline drift (optional, very slow).
- Pixel-button click feedback: translate(2px, 2px) + shadow halve (this is a hover state in template.html; for video, apply on emphasis beat).

**Forbidden**

- Crossfade, dissolve, blur transitions.
- Sub-pixel positions, sub-4px gaps, sub-4px shadow offsets.
- Any rotation other than 0deg / 90deg / 180deg / 270deg (rotation breaks pixel grid).
- Glow / bloom filters. Pixels don't glow — neighbors don't bleed.
- Particle systems with > 30 particles (CRT can't handle that many bright spots).

**Stagger budget**

80-120ms between elements. Total scene-in stagger ≤ 500ms.

## §G Voice transform recipe (apply to brand's voice from §1 DNA)

Take the brand's product description / value prop. Transform with:

1. Strip filler ("really", "very", "just"), keep imperative verbs
2. Hero headlines: 2-4 words MAX, UPPERCASE
3. Label / chip / badge text: UPPERCASE with 0.2em+ tracking (Space Mono treatment)
4. Body copy: sentence case, terse — pretend you're typing on a CRT at 2am
5. Stats: bare numeric + UPPERCASE unit (e.g. `4M` / `99.9% UPTIME`), not full sentences
6. End hero blocks with a single brand-primary **call-to-action verb** in pixel-button form (`PRESS START`, `BOOT UP`, `CONNECT`, `LOAD`)

**Example:**

- IN: `Figma helps teams design products collaboratively in real time`
- OUT: hero=`SHIP. TOGETHER.` / chip=`REAL-TIME` / cta=`PRESS START`

## §H Scene composition hints (Phase 4b layout guidance)

**Surface alternation across scenes**

- Dark scene: `bg-grid` (canvas-void base + brand-primary grid lines @ 7% opacity) + `var(--scanline-overlay)` + `var(--grain-overlay)` at `--grain-opacity` + `var(--crt-vignette)` + starfield.
- Light scene: any brand color as ground + low-opacity navy grid lines + `var(--scanline-overlay)` + `var(--grain-overlay)` at `--grain-opacity` (NO CRT vignette — light surfaces don't have CRT bulge).
- Atmosphere trio (scanlines + grain + vignette on dark / scanlines + grain on light) is **non-negotiable** — a surface without it reads as generic web.
- Alternate dark → light → dark → light across the video. Two consecutive dark scenes = broken pacing.

**Hero text**

- One big pixel-text-shadow moment per scene. Two layers (brand-secondary at +4/+4, canvas-navy at +8/+8). Hero text color is brand-primary on dark surfaces, canvas-navy on light surfaces.
- Hero takes ≥ 50% canvas width on dark scenes, ≥ 40% on light scenes (light surfaces breathe more).
- Never two hero-tier elements per scene.

**Brand color placement (role contract)**

- Brand colors never appear as body text. Only headlines, stat numerals, label fills (chip text), and accent rules.
- One scene = **one dominant brand color** carrying the hero or focal element. The other two brand colors appear only as halos (in shadow stacks), small accents (particle, corner-pin, secondary chip), or stat numerals.
- Suggested role mapping: brand-primary → hero / main CTA; brand-secondary → shadow halos / divider rules / focal stat numeral; brand-accent → secondary buttons / chip accents / particle color.
- This is a suggestion — narrative beat may flip primary/secondary roles, but never dilute by using all three at equal weight in one scene.

**Pixel unit is sacred**

- ALL spacing, shadow offsets, gaps, paddings must be multiples of 4px.
- ALL transforms must snap to 4px grid in onUpdate (no sub-pixel motion).
- Border widths: 2px or 4px only. No 1px hairlines (breaks the pixel logic).

**Transitions between scenes**

- Hard cut. Pair with a glitch frame or single scanline flash if you need a beat between scenes.
- NEVER crossfade, slide, blur, or zoom-between-scenes.

**Ambient motion**

- Starfield twinkle: dark surfaces only. ~12-20 stars, 4-6px squares, random positions, 3s twinkle keyframe.
- Pixel-particle float: dark surfaces only on hero / cta beats. ~6-10 particles, 8px squares, 8s float keyframe.
- Light surfaces stay still — they're "boot screens" or "menu screens", not "in-game".

## §I Page-level CSS (overrides design.html's neutral chrome — makes the doc itself read as 8-bit-orbit)

```css
/* ── Preset-native typography vars (loaded via preset-meta.chromeFonts.googleFontsHref).
 * Tektur + Chakra Petch + Space Mono for doc chrome; script slot = Tektur (no fourth face). */
:root {
  --f-disp-native:
    "Tektur", "Press Start 2P", "VT323", "Archivo", "Arial Black", "Helvetica Neue", sans-serif;
  --f-body-native:
    "Chakra Petch", "Rajdhani", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, system-ui,
    sans-serif;
  --f-script-native: "Tektur", "Press Start 2P", "VT323", "Archivo", "Arial Black", sans-serif;
  --f-mono-native:
    "Space Mono", "JetBrains Mono", "IBM Plex Mono", "Menlo", ui-monospace, monospace;
}

/* .preset-native-scope: re-binds var(--font-*) to preset-native families for component previews + §T atlas. */
.preset-native-scope {
  --font-display: var(--f-disp-native);
  --font-body: var(--f-body-native);
  --font-script: var(--f-script-native);
  --font-mono: var(--f-mono-native);
}

body {
  background: var(--canvas-void);
  color: #d0e6ff; /* light HUD text on dark void — default --ink is #000 which is invisible on dark base */
  position: relative;
}
.ds-prose,
.dna-label,
.dna-hex,
.type-role,
.type-name,
.type-note,
.type-specimen,
.voice-tag,
.voice-in,
.voice-out,
.voice-cta,
.voice-sample,
.voice-dl dt,
.voice-dl dd,
.comp-name,
.comp-marker,
.ds-summary,
.dna-gradient-label,
.dna-gradient-code,
.title-meta,
.title-meta strong,
p,
code {
  color: #d0e6ff;
}
.comp-preview {
  background: var(--canvas-navy) !important;
  color: #d0e6ff;
  /* CRITICAL: components like bg-grid, starfield, pixel-particles, crt-overlay
     use `position: absolute; inset: 0` which need a positioned ancestor to
     anchor against. Without `position: relative` here, they escape to <body>
     (made positioned by §I) and cover the entire design.html. */
  position: relative;
  overflow: hidden;
  min-height: 200px;
}
body::before {
  /* Scanlines on design.html itself */
  content: "";
  position: fixed;
  inset: 0;
  background: var(--scanline-overlay);
  pointer-events: none;
  z-index: 9999;
  mix-blend-mode: multiply;
}
body::after {
  /* CRT vignette on design.html itself */
  content: "";
  position: fixed;
  inset: 0;
  background: var(--crt-vignette);
  pointer-events: none;
  z-index: 9998;
}
.title-card {
  background: var(--canvas-void);
  border-bottom: 4px solid var(--brand-primary);
  padding: 96px 0 80px;
}
.title-display {
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--brand-primary);
  text-shadow: var(--shadow-pixel-text);
}
.brand-name {
  color: var(--brand-secondary);
  font-weight: 800;
}
.style-name {
  color: var(--brand-accent);
  font-weight: 800;
}
.ds-section {
  border-top: 4px solid var(--canvas-navy);
  padding: 80px 0;
}
h2 {
  text-transform: uppercase;
  letter-spacing: 0.02em;
  color: var(--brand-primary);
}
.eyebrow {
  color: var(--brand-secondary);
  font-weight: 700;
}
.dna-swatch,
.type-card,
.voice-pair,
.comp-card {
  border: 4px solid var(--canvas-navy) !important;
  border-radius: 0 !important;
  box-shadow: 8px 8px 0 var(--brand-secondary) !important;
}
.comp-head {
  background: var(--canvas-navy) !important;
  color: var(--brand-primary) !important;
  border-bottom: 4px solid var(--canvas-navy) !important;
}
.ds-code {
  background: var(--canvas-void) !important;
  border: 4px solid var(--brand-primary);
  border-radius: 0 !important;
  color: var(--brand-primary) !important;
}

/* ── §T Type-role atlas. var(--font-*) tokens → brand DNA; only the recipe is preset-declared. */
.ds-trole-box {
  display: flex;
  flex-direction: column;
  border: 4px solid var(--canvas-navy);
  border-radius: 0;
  background: var(--canvas-navy);
  overflow: hidden;
  margin-top: 24px;
  box-shadow: 8px 8px 0 var(--brand-secondary);
}
.ds-trole-row {
  padding: 28px 32px;
  border-bottom: 2px solid color-mix(in srgb, var(--brand-primary) 18%, transparent);
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

/* ── Type-role samples. var(--font-display/body/mono) → brand DNA. */
.t-trole-pixel-hero {
  font-family: var(--font-display);
  font-weight: 900;
  font-size: clamp(64px, 10vw, 128px);
  line-height: 1.05;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--brand-primary);
  text-shadow:
    4px 4px 0 var(--brand-secondary),
    8px 8px 0 var(--canvas-navy);
}
.t-trole-display {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(40px, 5vw, 64px);
  line-height: 1.15;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: var(--brand-primary);
}
.t-trole-headline {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(28px, 3.5vw, 45px);
  line-height: 1.15;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: var(--brand-primary);
}
.t-trole-subhead {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(28px, 2.4vw, 34px);
  line-height: 1.15;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: var(--brand-primary);
}
.t-trole-stat-number {
  font-family: var(--font-display);
  font-weight: 900;
  font-size: clamp(40px, 4vw, 56px);
  line-height: 1;
  color: var(--brand-primary);
  text-shadow: 3px 3px 0 var(--canvas-navy);
}
.t-trole-quote-body {
  font-family: var(--font-body);
  font-weight: 500;
  font-size: clamp(26px, 2.4vw, 34px);
  line-height: 1.8;
  color: var(--hud-text);
  max-width: 40ch;
  margin: 0;
}
.t-trole-label-pill {
  display: inline-block;
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: 24px;
  line-height: 1;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--brand-secondary);
  background: var(--canvas-navy);
  padding: 6px 14px;
  border: 2px solid color-mix(in srgb, var(--brand-primary) 25%, transparent);
}
.t-trole-label-eyebrow {
  font-family: var(--font-mono);
  font-weight: 400;
  font-size: clamp(24px, 1.4vw, 26px);
  line-height: 1;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--brand-secondary);
}
.t-trole-badge {
  display: inline-block;
  font-family: var(--font-mono);
  font-weight: 400;
  font-size: 24px;
  line-height: 1;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--brand-secondary);
  border: 2px solid var(--brand-secondary);
  padding: 8px 16px;
}
.t-trole-chart-value {
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: clamp(24px, 1.4vw, 26px);
  line-height: 1;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--brand-primary);
}
.t-trole-date-chip {
  display: inline-block;
  font-family: var(--font-mono);
  font-weight: 400;
  font-size: 24px;
  line-height: 1;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--brand-primary);
  background: var(--canvas-navy);
  padding: 2px 10px;
}
.t-trole-counter {
  font-family: var(--font-mono);
  font-weight: 400;
  font-size: 24px;
  line-height: 1;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--hud-text) 70%, transparent);
}
```
