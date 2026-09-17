# preset-minimal

Simple.css — smallest preset (~3KB). Pure classless. For text-heavy output.

## When to Pick

| Page Type | Minimal Fit |
|-----------|-------------|
| Reports, articles | Excellent |
| Blog posts, docs | Excellent |
| README-style pages | Excellent |
| Long-form text | Excellent |
| Interactive UI (forms, buttons) | OK |
| Complex layouts | Use Bulma instead |
| Cards, modals, tabs | Use daisyUI instead |

## Stack

| Property | Value |
|----------|-------|
| CDN | `cdn.simplecss.org/simple.min.css` |
| Gzip size | ~3KB |
| Class style | Classless (only `.notice` exists) |
| Theming | CSS variables (`--bg` `--accent` etc.) |
| JS required | No |

## How To Use

1. Copy `assets/template-minimal.html` → target path
2. Replace the Pug content block
3. Set `<title>`

## Patterns

```pug
//- Standard layout
header
  nav
    a(href="#") Home
    a(href="#") About
  h1 Page Title
  p Lead paragraph

main
  section
    h2 Section
    p Body text

//- Article = subtle box
article
  h3 Card-like content
  p Body

//- Button-styled link
a(href="#" role="button") Action

//- Callout (only class needed)
p.notice Heads up
```

## Limitations

- No card component (use `article`)
- No grid system (single column, max-width)
- No tabs, modals, badges
- No multi-column layouts

If any of these are needed → switch to Pico or Bulma.

## Related

- [claude-theme.md](claude-theme.md) — palette
- [pug-syntax.md](pug-syntax.md) — Pug cheat sheet
- [preset-pico.md](preset-pico.md) — slightly richer alternative
- [Simple.css docs](https://simplecss.org/)
