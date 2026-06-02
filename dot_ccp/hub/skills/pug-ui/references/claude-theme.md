# claude-theme

Claude Code warm-cream palette — pre-applied as the default in every preset.

## Palette

| Role | Hex | Use |
|------|-----|-----|
| Background | `#EEECE2` | Page background (warm cream) |
| Surface | `#F4F3EE` | Cards, hero, navbar (lighter cream) |
| Surface alt | `#E8E5D8` | Code blocks, alternating rows |
| Text | `#3D3929` | Body text (dark olive) |
| Text muted | `#6B6557` | Secondary text |
| Border | `#D4D0C4` | Hairlines, separators |
| Accent | `#DA7756` | Buttons, links, highlights (terra cotta) |
| Accent hover | `#BD5D3A` | Hover/active states (deeper terra cotta) |
| Success | `#2C7A39` | Confirmations |
| Error | `#AB2B3F` | Errors |

## Why This Palette

Matches the Claude Code CLI and claude.ai web app. Warm, low-eye-strain, distinguishes Claude-generated output from generic AI gray/blue. Light by default — switch to dark only when explicitly requested.

## Per-Preset Implementation

| Preset | Mechanism |
|--------|-----------|
| Pico | `--pico-*` CSS variable overrides in `<style>` |
| Bulma | `--bulma-*` variables + targeted `.card` `.navbar` overrides |
| daisyUI | Custom `[data-theme="claude"]` block with `oklch()` values |
| Minimal | `--bg` `--accent` etc. from Simple.css |

All four templates ship with the palette pre-applied — no extra work needed.

## Overriding

To change a single color, edit the `:root` (or `[data-theme="claude"]`) block in the template's `<style>` element. To change multiple, consider whether a different preset fits better.

## Dark Mode

Not included by default. The user explicitly prefers light. If a dark variant is requested later, swap to `data-theme="dark"` (Pico/Bulma) or define a `[data-theme="claude-dark"]` block (daisyUI).

## Related

- [preset-pico.md](preset-pico.md)
- [preset-bulma.md](preset-bulma.md)
- [preset-daisyui.md](preset-daisyui.md)
- [preset-minimal.md](preset-minimal.md)
