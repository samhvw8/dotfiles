# preset-bulma

Bulma — semantic component framework, best when Pico is too minimal.

## When to Pick

| Page Type | Bulma Fit |
|-----------|-----------|
| Complex dashboards | Excellent |
| Multi-column layouts | Excellent |
| Forms with rich inputs | Excellent |
| Hero sections, navbars | Excellent |
| Pure content / docs | Use Pico instead |
| Need 30+ themes | Use daisyUI instead |

## Stack

| Property | Value |
|----------|-------|
| CDN | `bulma@1.0.4/css/bulma.min.css` |
| Gzip size | ~66KB |
| Class style | Semantic (`.button` `.card` `.navbar`) |
| Theming | CSS variables (`--bulma-*`) |
| JS required | No |

## How To Use

1. Copy `assets/template-bulma.html` → target path
2. Replace the Pug content block
3. Set `<title>`

## Bulma Patterns

```pug
//- Card
.card
  .card-image
    figure.image.is-4by3
      img(src="img.jpg")
  .card-content
    p.title.is-4 Title
    p.subtitle.is-6 Subtitle

//- Columns
.columns
  .column.is-half
    p Left
  .column.is-half
    p Right

//- Primary button
button.button.is-primary Action

//- Hero
section.hero.is-light.is-medium
  .hero-body
    p.title Hero Title
    p.subtitle Subtitle

//- Modifiers: is-primary, is-light, is-small, is-large, is-fullwidth
```

## Key Class Prefixes

| Pattern | Meaning |
|---------|---------|
| `.is-*` | Modifier (size, color, state) |
| `.has-*` | Behavioral (has-text-centered) |
| `.column.is-N` | 12-col grid (N = 1–12) |

## Related

- [claude-theme.md](claude-theme.md) — Claude colors are pre-applied
- [pug-syntax.md](pug-syntax.md) — Pug cheat sheet
- [preset-pico.md](preset-pico.md) — lighter alternative
- [Bulma docs](https://bulma.io/documentation/)
