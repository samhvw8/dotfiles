# preset-pico

Pico CSS classless — the default preset. Best balance of token efficiency and capability.

## When to Pick

| Page Type | Pico Fit |
|-----------|----------|
| Reports, dashboards (simple) | Excellent |
| Forms, single-purpose pages | Excellent |
| Landing pages | Good |
| Content articles | Excellent |
| Complex multi-section dashboards | Use Bulma instead |
| Many tabs/drawers/carousels | Use daisyUI instead |

## Stack

| Property | Value |
|----------|-------|
| CDN | `pico.classless.min.css` |
| Gzip size | ~10KB |
| Class style | Classless — write semantic HTML |
| Theming | `data-theme` + `--pico-*` CSS variables |
| JS required | No |

## How To Use

1. Copy `assets/template-pico.html` → target path
2. Replace the Pug content inside `<script type="text/pug" id="pug-src">`
3. Set `<title>`

## Authoring Rules

- Write Pug that emits **semantic HTML**: `header`, `main`, `section`, `article`, `nav`, `footer`
- `article` = card. `nav ul li` = navbar items.
- Buttons styled automatically — no class needed
- Forms auto-styled — just `input`, `select`, `textarea`
- **Avoid adding classes** unless overriding a specific Pico variable

## Pico Patterns

```pug
//- Card
article
  header: h3 Title
  p Body content
  footer: button Action

//- Two-column grid
.grid
  div
    h3 Col 1
    p Content
  div
    h3 Col 2
    p Content

//- Dialog/modal
dialog(open)
  article
    h3 Modal title
    p Body
```

## Related

- [claude-theme.md](claude-theme.md) — palette and overrides
- [pug-syntax.md](pug-syntax.md) — Pug cheat sheet
- [preset-bulma.md](preset-bulma.md) — when components needed
- [Pico docs](https://picocss.com/docs/classless)
