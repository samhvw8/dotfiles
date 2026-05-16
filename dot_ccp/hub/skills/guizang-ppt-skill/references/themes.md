# Theme Presets (Themes)

5 carefully curated color palettes that maintain the "digital magazine x e-ink" aesthetic. **Users are not allowed to customize colors — wrong color combinations will instantly ruin the visual** — only choose from the presets below.

---

## Usage

1. Ask the user which palette to use (or recommend one based on content)
2. Open the `<style>` block in `assets/template.html`
3. Find the `:root{` block at the top
4. **Replace entirely** the lines marked with "theme color" comments: `--ink` / `--ink-rgb` / `--paper` / `--paper-rgb` / `--paper-tint` / `--ink-tint`
5. Everything else in CSS uses `var(--...)`, no other changes needed

---

## 🖋 Ink Classic (Monocle Default)

**Best for**: General sharing, business releases, tech products, a safe default for any scenario.
**Tone**: Pure ink black + warm off-white, strongest magazine feel, Monocle / Apricot / A Book Apart vibe.

```css
--ink:#0a0a0b;
--ink-rgb:10,10,11;
--paper:#f1efea;
--paper-rgb:241,239,234;
--paper-tint:#e8e5de;
--ink-tint:#18181a;
```

---

## 🌊 Indigo Porcelain

**Best for**: Tech/research/data sharing, engineering culture, in-depth content, technical launches.
**Tone**: Deep indigo + porcelain white, calm, rational, with depth — like an academic journal or blue-and-white porcelain.

```css
--ink:#0a1f3d;
--ink-rgb:10,31,61;
--paper:#f1f3f5;
--paper-rgb:241,243,245;
--paper-tint:#e4e8ec;
--ink-tint:#152a4a;
```

---

## 🌿 Forest Ink

**Best for**: Nature/sustainability/culture/non-fiction content, outdoor brands, environmental themes.
**Tone**: Deep forest green + ivory, grounded with breathing room — like a vintage issue of National Geographic.

```css
--ink:#1a2e1f;
--ink-rgb:26,46,31;
--paper:#f5f1e8;
--paper-rgb:245,241,232;
--paper-tint:#ece7da;
--ink-tint:#253d2c;
```

---

## 🍂 Kraft Paper

**Best for**: Nostalgia/humanities/reading/history/literary sharing, indie magazines, handmade brands.
**Tone**: Deep brown + warm cream, like a kraft envelope or an old notebook — warm with a sense of age.

```css
--ink:#2a1e13;
--ink-rgb:42,30,19;
--paper:#eedfc7;
--paper-rgb:238,223,199;
--paper-tint:#e0d0b6;
--ink-tint:#3a2a1d;
```

---

## 🌙 Dune

**Best for**: Art/design/creative/fashion sharing, gallery brochures, aesthetics-first private events.
**Tone**: Charcoal gray + sand, restrained, refined, neutral — like a desert twilight or an architectural portfolio.

```css
--ink:#1f1a14;
--ink-rgb:31,26,20;
--paper:#f0e6d2;
--paper-rgb:240,230,210;
--paper-tint:#e3d7bf;
--ink-tint:#2d2620;
```

---

## Selection Guide

| If it's... | Recommended Theme |
|---|---|
| Not sure / first time using | 🖋 Ink Classic |
| AI / tech / product launch | 🌊 Indigo Porcelain |
| Content / industry insight / culture | 🌿 Forest Ink |
| Book review / lifestyle / humanities | 🍂 Kraft Paper |
| Design / art / branding | 🌙 Dune |

---

## Switching Principles

- **Use only one theme per deck** — don't switch colors mid-way
- The WebGL shader default accent colors (titanium dispersion / silver flow) work with all 5 palettes (tested and acceptable)
- `currentColor`-driven borders / icons will automatically adapt to each section's text color — no extra adjustments needed
- After selecting a theme, `<title>` text and `chrome` copy can reinforce the theme's semantics (e.g., pairing Kraft Paper with "Vol.03 · Autumn")

## ❌ Don'ts

- ❌ **No mixing** (e.g., using Ink Classic's ink with Dune's paper) — it will look completely off
- ❌ **Don't let users provide arbitrary hex values** — politely decline and present the 5 presets for selection
- ❌ **Don't directly modify colors elsewhere in template.html** — all scattered rgba values use var, just change :root once

After selecting a theme, tell the user in the skill conversation: "Using 🖋 Ink Classic / 🌊 Indigo Porcelain ..." and note it in the deck project record for consistency in future iterations.

---

## Future: OKLCH Color Tokens

These theme presets use hex values for maximum compatibility. When browser support for OKLCH reaches 95%+ (currently ~92%), consider migrating to OKLCH for perceptually uniform colors and P3 wide-gamut progressive enhancement:

```css
/* Example: Ink Classic in OKLCH */
--ink: oklch(0.07 0.01 0);
--paper: oklch(0.95 0.01 80);
/* P3 enhancement */
@media (color-gamut: p3) {
  --ink: oklch(0.07 0.015 0);
}
```

This is not yet required — hex presets work perfectly. Track OKLCH adoption at [caniuse.com/oklch](https://caniuse.com/mdn-css_types_color_oklch).
