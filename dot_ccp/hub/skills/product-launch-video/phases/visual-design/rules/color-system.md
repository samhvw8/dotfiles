---
name: video-color-system
description: "Color design decisions for HyperFrames videos — palette roles, 60-30-10 allocation logic, cross-scene consistency, dangerous combos. Hex values and contrast math live in build agent territory."
category: visual-design
---

# Video Color System - Design-Judgment Layer

**This file only covers plan-layer design judgment** - roles, 60-30-10 allocation logic, cross-scene consistency, and dangerous combinations. Concrete hex values, contrast ratio 4.5:1 math, dark-scene saturation compensation, and double-layer glow recipes belong to the build agent when writing CSS and consulting `chunks/tokens.css` plus `/hyperframes-core`; plan does not copy them.

## Palette Source

**Hex values come from `tokens.css` in `## Design chunks`** (named tokens in `:root`, varying by brand: `--brand-primary` / `--brand-accent` / `--canvas` / `--ink`, etc.; already inlined into Phase 3 dispatch). Plan references by **role**; **do not** copy concrete hex values - the build agent reads them from `chunks/tokens.css`.

> **Preset rules take priority over this file's generic rules.** Preset name is in `## Design chunks` `index.json.preset`; its color discipline is in `composition-hints.md` (§H surface contract / accent budget) - for example, editorial explicitly says "accent <= 5% frame area, primary is not a background fill, canvas is the hero." If a generic rule (such as "use dual-radial swell background") conflicts with the preset's §H color discipline, **the preset wins**. Plan gets preset name from `index.json.preset` and its rules from `composition-hints.md` to constrain palette use for this film (**do not read design.html**; chunks have replaced it).

### Pain / Serious Scenes

If a scene's `emotionalBeat` needs an intentional palette shift:

- If `chunks/tokens.css` / `composition-hints.md` **has** a `[data-theme="dark"]` block or dark surface -> use it (invert canvas / ink), without introducing an external palette.
- If there is **no** dark theme block (common in bright presets like editorial) -> **do not invent dark colors**. Instead use: desaturated accent + lower contrast (use `--paper-warm` instead of `--canvas` to darken the scene by one step) + tighter whitespace + stillness to carry the serious mood.

### When `--ink` / `--canvas` Are Pure Black / Pure White

For some presets (editorial / Swiss / brutalist / newspaper styles), `--ink: #000` / `--canvas: #fff` is a **style choice**, not a defect - "black ink on white paper" is core to those aesthetics.

- **`--ink: #000`** - OK in these presets; preserve as ink.
- **`--canvas: #fff`** - pure white blooms at video viewing distance; **prefer the preset-provided `--paper-warm`** (the editorial preset explicitly notes "fallback if canvas is pure white"). If no fallback token exists, the build agent synthesizes one step of warm white.
- Other presets (saas / material, etc.) should follow the generic off-black/off-white rules if pure black/white appears.

Decision path: read preset name first -> if editorial / brutalist family, accept pure black as ink + prefer `--paper-warm` as canvas; otherwise follow generic off-black/off-white guidance.

## Role Mapping

Each token plays a role in 60-30-10:

| Role                            | Typical token names (brand-dependent)                                                                | Visual weight                                     |
| ------------------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| **Neutral background (canvas)** | `--canvas` / `--paper` / lightest neutral                                                            | **60%** - dominant, does not compete with content |
| **Neutral surface**             | `--paper-2` / `--surface` / second-lightest neutral; **if absent, layer with hairline rule instead** | **~20%** - panels, cards, boundaries              |
| **Foreground text (ink)**       | `--ink` / `--ink-soft` / off-black or off-white                                                      | **~10%**                                          |
| **Primary accent**              | `--brand-primary` / `--brand-accent`                                                                 | **~10%** - **only on the current focal element**  |
| **Secondary accent**            | `--brand-secondary` (if present)                                                                     | **~5%** - bound to a different semantic role      |
| **Restrained third color**      | neutral or paper tone                                                                                | **<2%** - occasional                              |
| **Semantic colors**             | success/error/warning derived from brand hue                                                         | use sparingly                                     |

> **When `chunks/tokens.css` lacks a `--surface` tier** - this preset layers with hairline rules rather than a surface color - plan should explicitly say "30% uses hairline + repeated canvas," instead of inventing a fake middle color.

## 60-30-10 Is **Visual Weight**, Not Pixel Count

- 60% canvas - dominant, not attention-grabbing
- 30% surface + text - panels, borders, supporting copy
- 10% accent - used only on the **current focal element**

**Top mistake:** applying brand color everywhere because it is "the brand identifier." Accent works because it is **rare**. In the strongest archive example (codex-plugin), each accent is bound to a **semantic role**: cyan = HyperFrames moment, lime = render, amber = Codex - three accents, each appearing only in its own beat, never overlapping.

Even more restrained: vercel-intro uses one brand red + one RGB aberration moment, then immediately returns to clean black-ground white text. **One color, one effect, maximal restraint.**

## Tinted Neutrals

Pure gray has no personality. Neutrals should shift subtly toward the brand hue:

- warm brands (red / orange / yellow) -> gray with a subtle warm cast
- cool brands (blue / purple / green / cyan) -> gray with a subtle cool cast

The cast should be nearly invisible, but it creates subconscious cohesion. This is usually already encoded in `chunks/tokens.css` `--canvas` / `--paper-2` tokens; plan only references roles and does not calculate OKLCH.

## Four-Layer Palette Structure

A complete video palette has four layers (skip layers you do not need; **do not** add extras):

1. **Primary accent** - 1-2 colors, semantically bound, 10-15% weight
2. **Neutral ladder** - canvas -> surface -> surface-raised, three tiers (light or dark), 60% + 20%
3. **Foreground** - 1-2 off-white or off-ink text colors, 10%
4. **Semantic colors** - success / error / warning, derived from brand hue

**Per-beat palette isolation is also valid** (fadeglow-v4 uses completely different color moods in Beat 2 / 4 / 7) - emotional arc decides; consistency is not mandatory.

## Cross-Scene Consistency

Every scene in a video should feel like it belongs to the same visual system (unless explicitly doing "one universe per scene").

- Background palette is defined once at project level (`:root` / shared `<style>`); do not hard-code hex per scene.
- Scenes may vary in **lightness** (dark -> bright rhythm), while sharing the same **hue family**.
- Accent purpose must stay consistent: if cyan is the HyperFrames moment color in scene 1, it cannot become a background gradient in scene 5.
- Data visualization colors derive from the brand palette; do not pick arbitrary colors.

**Variation within limits is OK:** dark/light alternation for rhythm, desaturated (calm) <-> saturated (emphasis), gradients between neighboring brand hues.

## Never Pure Black / Pure White

Pure `#000` / `#fff` does not exist in nature - contrast is harsh, feels synthetic, and compression destroys detail. Always use off-black / off-white tokens from `chunks/tokens.css` (typical names `--ink` / `--canvas`).

Exception: pure white `text-shadow` / `drop-shadow` halos at emphasis moments (click-ripple peak) are OK - build agent uses low-opacity overlays, not direct text color.

## Dangerous Combinations (Forbidden Patterns)

- **Light gray text on white** - contrast collapses, small screens fail.
- **Gray on colored background** - reads faded / dirty; use a darker tone of the background hue instead.
- **Thin light text on image** - unreliable even with shadow; add overlay + weight, or both.
- **Pure saturated neon on `#000`** - default AI nesting-doll look. Use off-black + accent glow reduced to 0.20-0.35 opacity (build work; plan only needs to say "avoid neon").
- **Purple-to-blue AI gradient** - codex-plugin / hermes explicitly banned this ("no generic purple-blue AI gradients"). Use brand-hued radial swell for depth instead.

## Background: Brand-Color Mesh Background Is the Project Default

**Project-level decision (overrides default background rules for all presets):**

- **Every scene default background = brand-color mesh background** (multiple brand-color blobs + Gaussian blur + canvas veil as atmospheric base)
- **Heavy veil** - mesh reads as "subtle brand-color atmosphere in the background"; at viewing distance it still reads as a restrained base, and foreground text remains clear. It does not compete.
- **Mesh is a single background layer** - do not also stack dual-radial swell, scanline, halftone, or architectural grid. **Only particle layer** (sparse brand-color float particles) may coexist with mesh.
- **Foreground accent is not constrained by preset rules** - use standard 60-30-10; editorial's "accent <= 5%" discipline is **explicitly relaxed**: foreground text, CTA, and cards may use brand color more freely.

> **Component implementation:** most presets implement this as a `gradient-mesh-bg` component (registered in editorial.md) - build agent prefers reusing that component. If a preset does not provide a component with that name, build agent synthesizes an equivalent effect from the functional description "brand color blobs + Gaussian blur + canvas veil." Plan **does not need** to know which preset has the component - write the function name.

### Relationship to Preset Rules

This project-level mesh default **overrides the §H background discipline** of these presets ("canvas is the hero", "accent <= 5%", "primary is not a background fill", etc.), shifting their print restraint toward a brand-forward marketing video direction:

**Use mesh default (D class, 7 presets):**
`editorial` · `capsule` · `soft-editorial` · `daisy-days` · `block-frame` · `playful` · `emerald-editorial`

> When matching any of the above presets, plan agent **must** include the mesh wording in every scene prose (see "Plan Reference Example" below); do not fall back to pure canvas because preset §H says "canvas is the hero."

> **Closing / CTA scenes also use mesh (D class):** the project mesh default also overrides preset **close-frame background discipline** - for example, `block-frame` preset.md says "close-frame = ink ground / canvas text"; under the D-class project default this is **overridden by mesh**, and closing scenes also use the light mesh base. Brand closure impact comes from the **foreground** (wordmark reveal + hero double-layer glow + CTA pill), **not** from flipping the whole scene background black. (This specifically fixes "the entire film is light, but only the final scene suddenly turns black.")

**Do not use mesh default (keep preset-native background design):**

- explicitly opposes gradients / grids / soft halos: `neo-brutalism` · `editorial-forest`
- has core background medium: `liquid-glass` (aurora shader) · `8-bit-orbit` (CRT tube) · `sakura-chroma` (halftone warm paper) · `scatterbrain` (cork / paper / warm variants)
- paper-grain family (mesh conflicts with grain aesthetic): `pin-and-paper` · `retro-zine` · `peoples-platform` · `creative-mode` · `stencil-tablet`

When any of these 11 presets match, plan agent **keeps the preset's own background design** - write according to preset §H, **and keep it consistent across the film, without per-scene surface improvisation** (the same hard rule: background is determined by preset system, not improvised by plan). Note the distinction: surface-aware presets (e.g. `peoples-platform` paper / blue / orange component-surface bindings) are **preset-declared surface systems** and remain valid - they are preset rules, not per-scene improvisation. Native dark-medium presets (`8-bit-orbit` CRT, etc.) similarly keep their declared dark base.

> If you want to return to strict editorial later: keep mesh for only 1-2 climax beats, use pure canvas + hairline + 12-col grid hint elsewhere, foreground accent <= 5%. **Current D-class default is relaxed.**

### Background Unification Rule (no per-scene surface drift)

**Project-level hard rule: scene backgrounds are determined only by the preset background system + mesh default; plan does not improvise per-scene surfaces.** D-class mesh default applies consistently to **every scene, including closing / CTA scenes**; the film keeps a consistent light atmospheric base, and **must not** switch a scene to off-black / ink dark ground for drama - that is exactly what causes lightness jumps. For climax impact, use **foreground techniques** (hero word double-layer glow, accent saturation release, scale / impact beat, wordmark reveal), while **background remains unchanged**.

Only two flex cases remain (both **must stay light; mesh must not switch dark**):

- **Brand reveal climax** - temporarily lighten the mesh veil to release brand-color saturation, paired with hero-word double-layer glow. This is a release of mesh **intensity**, while the **base is still mesh** (light -> lighter, not a ground swap).
- **Pure workspace demo** (full-frame screen recording / UI screenshot occupies >=60% of frame) - may switch to `--canvas` + architectural grid to avoid mesh competing with UI screenshot colors; **still light ground, never dark**, and the next scene returns to mesh.

**Deprecated** (no longer allowed because it creates per-scene light/dark jumps): ~~serious/pain beat -> off-black ground~~. Dark ground only applies when the preset is **natively** a dark medium (see "Dark Scene Rules" below), not as a per-scene option on D-class mesh presets.

Plan writes: "default brand-color mesh background (heavy veil, three blobs, atmospheric base) - consistent across the film, including closing scene." **Do not** write whole-scene off-black / ink ground, and **do not** write `opacity: 0.7` / `blur(140px)` (build work).

## Dark Scene Rules (native dark-background presets only)

> **Scope (narrowed by "Background Unification Rule"):** dark scenes are **no longer a per-scene option on D-class mesh presets** - plan must not turn any scene (including close) dark on a mesh preset. The following applies only when the preset's **native** background is dark (e.g. `8-bit-orbit` CRT, or a non-mesh preset whose §H declares dark ground). In those presets, darkness is the film's baseline, not a per-scene jump.

When that condition applies, a dark scene is more than inversion:

- use tinted off-black (`chunks/tokens.css` dark token), **not** pure `#000`
- text weight is one level lighter than in bright scenes (build work; plan only needs awareness)
- accents desaturate (build handles; plan only says "dark-scene atmosphere")
- hero word glow is usually **double-layer** (tight + broad) - plan names "hero gets double-layer glow"

## Plan Reference Examples

**Standard scene (mesh default background, applies to all 7 D-class presets: editorial / capsule / soft-editorial / daisy-days / block-frame / playful / emerald-editorial):**

> "Background: brand-color mesh default (heavy veil, brand-primary + secondary + accent as three subtle atmospheric blobs, still reading as a restrained base from distance). Palette 60-30-10: 60% canvas (still reads as canvas over mesh veil) + 30% hairline + chapter-label rule layering (no surface token) + 10% accent on hero word and CTA underline. `--ink` pure black remains as print-like ink."

**Exception: workspace demo scene:**

> "This scene steps out of mesh default - screen recording + UI screenshot occupy 60% of frame, and mesh would compete with UI colors. Use `--paper-warm` 60% + 12-col architectural grid hint 30% + `--brand-primary` underline for chapter marker 10%. Next scene returns to mesh default."

**Exception: brand reveal climax:**

> "Beat 6 hero reveal: mesh veil temporarily lightens to release brand-color saturation, hero word gets double-layer glow (tight + broad). This is the only beat where mesh intensity releases. Next scene returns to the default heavy veil."

Do not write concrete hex / opacity / saturation percentages - those are build work.
