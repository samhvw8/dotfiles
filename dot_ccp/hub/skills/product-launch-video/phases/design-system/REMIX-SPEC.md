# Preset Palette + Remix Spec

Each preset is self‑sufficient and remixable: it defines style (palette, type, motion, voice, material); composition is decided per‑scene by Phase 3 visual‑design.

---

## The `palette{}` block (R2 + R3)

Lives inside the `preset-meta` JSON at the top of each `preset.md`. **`preset-meta` is parsed with strict `JSON.parse`** (`build-design.mjs` parsePreset) — **no `//` comments**, valid JSON only. Semantics go in the `constraint` strings.

### Slots (6)

The three color planes of 60‑30‑10 plus the brand hues:

| slot        | plane / role                                             | required    | notes                                              |
| ----------- | -------------------------------------------------------- | ----------- | -------------------------------------------------- |
| `canvas`    | 60% — the page/scene ground                              | ✅          | must contrast `ink`                                |
| `surface`   | 30% — card / panel fill                                  | ✅          | the "second surface"; distinct from `canvas`       |
| `ink`       | text + borders + strokes + shadows                       | ✅          | may `alias` another slot (see below)               |
| `primary`   | dominant brand hue / focal fills                         | ✅          |                                                    |
| `accent`    | 10% — the single high‑attention pop (CTA, marker, stamp) | ✅          |                                                    |
| `secondary` | optional 2nd brand hue / rare third tone                 | ⚪ optional | omit or keep minimal if the preset doesn't use one |

`tertiary` / `costume` are **preset‑internal** (only multi‑surface presets like `peoples-platform` use them; the other 18 inherit no‑op defaults) — don't add them unless the preset genuinely has >2 surfaces. Decoration colors (`deco-*`) are preset‑owned identity and stay in `§B`, not here.

### Per‑slot keys

```jsonc
"primary": { "value": "#1F3A8A", "constraint": "<R4 color personality — what a remixed brand color must respect>" }
"canvas":  { "value": "#EFE56A", "lock": "anchor", "constraint": "..." }
"ink":     { "alias": "primary" }
```

- **`value`** — the preset's native/original color (harvest from the source template's `:root`, e.g. `tmp/templates/<preset>/template.html`). This is the default used when no capture / no confident extraction.
- **`constraint`** (R4 "declare color constraints") — a one-line description of the slot's **color personality** so a remixed brand color can be harmonized into range (e.g. "deep desaturated ink — reads near-black on paper"). Not machine-enforced yet; it's the authoring contract + future harmonizer input.
- **`lock: "anchor"`** — this slot is a **structural signature**, not a palette choice. Brand DNA only **tints** it (via `color-mix()` declared in `§B`), never replaces it. Use for surfaces that define the preset's identity (e.g. pin‑and‑paper's yellow paper + cream card — without them the layered gradients / grain / contrast all fail).
- **`alias: "<slot>"`** — this slot equals another. Use when a preset collapses two roles (pin‑and‑paper: `ink` ≡ `primary`, the ink‑blue is both the brand hue and the structural ink).

### Worked example — `pin-and-paper` (golden sample)

Harvested from `tmp/templates/pin-and-paper/template.html` `:root`: `--paper #EFE56A`, `--cream #F8F1D6`, `--ink #1F3A8A`, `--red #C2342B`, `--kraft/--olive/--orange` tertiaries.

```jsonc
"palette": {
  "primary":   { "value": "#1F3A8A", "constraint": "deep desaturated ink — reads near-black on paper; carries every text fill, border, divider, pin illustration, and hard offset shadow" },
  "accent":    { "value": "#C2342B", "constraint": "single vivid warm — used in at most two spots (the rotated rubber stamp + the negative pill); never as body text, card fill, or chip" },
  "secondary": { "value": "#C9A66B", "constraint": "muted earthy third tone (kraft / olive / orange from the source palette); structurally optional, used only when a scene needs a rare third tone" },
  "canvas":    { "value": "#EFE56A", "lock": "anchor", "constraint": "warm saturated legal-pad yellow — the page ground; brand DNA tints it via color-mix() in §B, never replaces it, so the paper register survives every brand palette" },
  "surface":   { "value": "#F8F1D6", "lock": "anchor", "constraint": "off-white cream — the pinned-card fill; brand DNA tints via color-mix() in §B, never replaces" },
  "ink":       { "alias": "primary" }
}
```

Note pin‑and‑paper's `canvas`/`surface` are **anchors already wired in `§B`** as `--anchor-paper-yellow` / `--anchor-cream` + `color-mix()` formulas — the palette block formalizes them; `§B` already does the tinting.
