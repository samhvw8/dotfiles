---
name: pug-ui
description: Generate single-file HTML UIs, reports, dashboards, and landing pages using Pug syntax compiled client-side. Four pre-themed CSS presets (Pico default, Bulma, daisyUI, Simple.css). ALWAYS invoke when the user wants a standalone .html file with visual UI — page, report, dashboard, landing page, mockup — or asks for Pug output. Do NOT use for React/Vue/Svelte components or server-rendered templates.
---

# pug-ui

Output Pug syntax inside a self-compiling HTML template. Pick a framework preset based on the page type. Claude Code's light theme (warm cream `#EEECE2` + terra cotta `#DA7756`) is the default for all presets.

## Preset Selection

| Preset | Template | Gzip | Class Style | When |
|--------|----------|------|-------------|------|
| **pico** (default) | `template-pico.html` | ~10KB | Classless | Most pages — best token/capability balance |
| **bulma** | `template-bulma.html` | ~66KB | Semantic | Complex dashboards, rich components needed |
| **daisyui** | `template-daisyui.html` | ~57KB+Tailwind | Semantic + utility | Tabs, drawers, carousels, mobile-first |
| **minimal** | `template-minimal.html` | ~3KB | Classless | Text-heavy reports, docs, articles |

**When unsure → use `pico`.**

## Workflow

1. Pick a preset from the table above
2. Read `assets/template-<preset>.html` to confirm structure
3. Copy it to the target path
4. Replace the Pug block inside `<script type="text/pug" id="pug-src">`
5. Set `<title>`

The Claude Code light theme is baked in — no theme switching needed unless the user explicitly asks for something else.

## References

| File | Purpose |
|------|---------|
| [references/preset-pico.md](references/preset-pico.md) | Pico CSS patterns, when to use |
| [references/preset-bulma.md](references/preset-bulma.md) | Bulma patterns, when to use |
| [references/preset-daisyui.md](references/preset-daisyui.md) | daisyUI patterns, when to use |
| [references/preset-minimal.md](references/preset-minimal.md) | Simple.css patterns, when to use |
| [references/claude-theme.md](references/claude-theme.md) | Color palette + overrides |
| [references/pug-syntax.md](references/pug-syntax.md) | Pug cheat sheet (shared) |

## Hard Rules

- ONLY write Pug inside the template's script block — never raw HTML
- 2-space indentation — Pug is whitespace-sensitive
- Responsive prefixes (`md:` `lg:` `hover:`) → use `(class="md:grid-cols-3")` syntax
- Do NOT mix presets — class names are incompatible across frameworks
- Do NOT switch theme palette unless the user explicitly asks — Claude theme is default

## Related

- [references/claude-theme.md](references/claude-theme.md) — palette rationale
- [references/pug-syntax.md](references/pug-syntax.md) — syntax shared across presets
