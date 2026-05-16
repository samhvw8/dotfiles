# Swiss International Style · Theme Color Presets (Swiss Themes)

4 high-contrast color schemes based on Swiss International Typographic Style. **Each follows the "premium neutral base + single high-saturation accent" minimalist principle** — this is the soul of Swiss Style, and mixing multiple accent colors is not allowed.

---

## How to Use

1. Ask the user which theme to use (or recommend one based on content)
2. Open the `<style>` block in `assets/template-swiss.html`
3. Find the `:root{` block at the top
4. **Replace all** variables marked with "theme color" comments: `--paper` / `--paper-rgb` / `--ink` / `--ink-rgb` / `--grey-1` / `--grey-2` / `--grey-3` / `--accent` / `--accent-rgb` / `--accent-on`
5. All other CSS uses `var(--...)`, so no other changes are needed

---

## 🔵 Klein Blue (IKB · International Klein Blue)

**Best for**: General-purpose, business launches, AI/tech products, design-focused presentations. The most classic Swiss Style palette — never goes wrong.
**Tone**: Pure white base + IKB Klein Blue, supremely calm, rational, and academic — like a Helvetica Forever exhibition or a Massimo Vignelli portfolio.

```css
--paper:#fafaf8;
--paper-rgb:250,250,248;
--ink:#0a0a0a;
--ink-rgb:10,10,10;
--grey-1:#f0f0ee;
--grey-2:#d4d4d2;
--grey-3:#737373;
--accent:#002FA7;
--accent-rgb:0,47,167;
--accent-on:#ffffff;
```

**Usage tips**:
- IKB is a high-saturation deep blue — it creates powerful visual impact on large color blocks (e.g., `.accent-block`)
- Use the `.accent` class for KPI numbers in blue, but don't overdo it — IKB loses its prestige when overused
- Recommended to alternate with `dark` theme pages — IKB on a dark background looks equally premium

---

## 🟡 Lemon Yellow (Lemon · Cadmium Yellow)

**Best for**: Youth, sports, retail, consumer goods, energetic themes, Y2K retro design.
**Tone**: Light off-white base + lemon yellow, vivid, energetic, with a strong alerting quality — like the visual language of IKEA or Beck Design.

```css
--paper:#fafaf8;
--paper-rgb:250,250,248;
--ink:#0a0a0a;
--ink-rgb:10,10,10;
--grey-1:#f0f0ee;
--grey-2:#d4d4d2;
--grey-3:#737373;
--accent:#FFD500;
--accent-rgb:255,213,0;
--accent-on:#0a0a0a;
```

**Usage tips**:
- Lemon yellow is a light high-saturation color — **`.accent-on` must use pure black** (not white) to ensure readability
- Don't put white text on yellow blocks — it will be illegible
- Lemon yellow works best as single-character highlights (`.mark` / `.underline-accent`)

---

## 🟢 Lemon Green (Lemon Green · Highlighter Green)

**Best for**: Eco, sustainability, health, emerging tech, Gen Z brands, AI startup projects.
**Tone**: Light off-white base + fluorescent lemon green, futuristic, youthful, contemporary — like the visual identity of Acne Studios or Off-White.

```css
--paper:#fafaf8;
--paper-rgb:250,250,248;
--ink:#0a0a0a;
--ink-rgb:10,10,10;
--grey-1:#f0f0ee;
--grey-2:#d4d4d2;
--grey-3:#737373;
--accent:#C5E803;
--accent-rgb:197,232,3;
--accent-on:#0a0a0a;
```

**Usage tips**:
- Fluorescent green, like yellow, is a light color — **`.accent-on` must use pure black**
- Screen rendering looks better than print — ideal for presentation projection
- Recommended for "emerging technology" and "future" themes

---

## 🟠 Safety Orange (Safety Orange)

**Best for**: Industrial, warning, sports, construction, automotive industry, "alert/highlight" pages in tech launch events.
**Tone**: Light off-white base + safety orange, industrial feel, sense of urgency, visual anchor — like a Saul Bass poster or the Highway Gothic signage system.

```css
--paper:#fafaf8;
--paper-rgb:250,250,248;
--ink:#0a0a0a;
--ink-rgb:10,10,10;
--grey-1:#f0f0ee;
--grey-2:#d4d4d2;
--grey-3:#737373;
--accent:#FF6B35;
--accent-rgb:255,107,53;
--accent-on:#ffffff;
```

**Usage tips**:
- Orange sits between light and dark — **white text is barely readable, so use bold** (`font-weight:600` or above)
- Strong industrial feel — suits content involving "warnings", "decisions", or "turning points"
- Avoid full-page `.accent` mode — an entire screen of orange is too glaring; use it for local highlights only

---

## Recommended Selection Guide

| If it's about... | Recommended theme |
|---|---|
| Not sure / first time / AI / tech / design | 🔵 Klein Blue |
| Youth, energy, consumer, retail | 🟡 Lemon Yellow |
| Eco, future, Gen Z, emerging | 🟢 Lemon Green |
| Industrial, warning, automotive, urgency | 🟠 Safety Orange |

---

## Switching Principles

- **Use only one theme per deck** — don't switch accent colors midway
- The grey-scale variables (`--grey-1/2/3`) are identical across all 4 themes — no adjustment needed
- The WebGL grid background automatically reads the `--accent` variable and subtly reveals the accent color near the cursor during page transitions
- After selecting a theme, you can reinforce the semantic feel by using a related word in the chrome copy (e.g., IKB pairs with `International / Helvetica`, Lemon Yellow pairs with `Active / Living`)

---

## ❌ Don'ts

- ❌ **No mixing** (e.g., IKB blue + Lemon Yellow appearing simultaneously as highlights) — this completely violates the Swiss Style "single anchor color" principle
- ❌ **No custom hex values** — politely decline and present the 4 presets for selection
- ❌ **Don't change the grey-scale variables** — `--paper` / `--grey-1/2/3` / `--ink` are unified across themes; only swap the accent
- ❌ **No gradients** — Swiss Style rejects all gradients; every color block must be solid
- ❌ **No shadows / rounded corners / opacity on accent** — sharp corners, solid color, fully opaque — this is a hard rule of Swiss Style

---

## About the Grey Scale (Unified Across Themes)

| Variable | Value | Purpose |
|---|---|---|
| `--paper` | `#fafaf8` | Main background (very light warm white) |
| `--grey-1` | `#f0f0ee` | Light grey background (for `.grey-block` / section backgrounds) |
| `--grey-2` | `#d4d4d2` | Medium grey (dividers, borders) |
| `--grey-3` | `#737373` | Dark grey (secondary text / meta) |
| `--ink` | `#0a0a0a` | Primary text color (near-black) |

This grey scale is a carefully calibrated "premium grey" that never competes with any accent color. **Do not** change it to pure white (`#fff`) or pure black (`#000`) — that would lose the "restrained" quality of Swiss Style.

---

After selecting a theme, tell the user: "Using 🔵 Klein Blue / 🟡 Lemon Yellow ..." and note it in the deck project record for consistency in future iterations.

---

## Future: OKLCH Color Tokens

These presets use hex for maximum compatibility. OKLCH (~92% browser support) offers perceptually uniform colors — particularly useful for the Swiss accent colors which need precise high-chroma control:

```css
/* Example: IKB Klein Blue in OKLCH */
--accent: oklch(0.35 0.18 264);
/* P3 wide-gamut: higher chroma on capable displays */
@media (color-gamut: p3) {
  --accent: oklch(0.35 0.26 264);
}
```

Track adoption at [caniuse.com/oklch](https://caniuse.com/mdn-css_types_color_oklch). Migration is optional — hex presets work perfectly.
