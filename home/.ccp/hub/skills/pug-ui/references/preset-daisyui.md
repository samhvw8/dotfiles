# preset-daisyui

daisyUI + Tailwind — legacy preset, richest components, biggest bundle.

## When to Pick

| Page Type | daisyUI Fit |
|-----------|-------------|
| Tabs, drawers, carousels | Excellent (only preset with these) |
| Need raw Tailwind utilities | Excellent |
| Mobile-first responsive | Excellent |
| Quick prototypes, low token budget | Use Pico instead |
| Token-sensitive output | Use Pico or minimal |

## Stack

| Property | Value |
|----------|-------|
| CDN | `daisyui@5/daisyui.css` + `cdn.tailwindcss.com` |
| Gzip size | ~57KB (daisyUI) + ~100KB (Tailwind play CDN) |
| Class style | Semantic + utility (mixed) |
| Theming | `data-theme="claude"` custom theme baked in |
| JS required | No (Tailwind play CDN script only) |

## How To Use

1. Copy `assets/template-daisyui.html` → target path
2. Replace the Pug content block
3. Set `<title>`. `data-theme="claude"` is preset

## daisyUI Patterns

```pug
//- Card
.card.bg-base-200.shadow
  .card-body
    h2.card-title Title
    p Content
    .card-actions.justify-end
      button.btn.btn-primary Action

//- Responsive grid (use class= for colons)
.grid.gap-4(class="md:grid-cols-3")

//- Tabs
.tabs.tabs-boxed
  a.tab.tab-active Tab 1
  a.tab Tab 2

//- Modal
dialog#m.modal
  .modal-box
    h3.text-lg.font-bold Title
    .modal-action
      form(method="dialog"): button.btn Close
```

## Tailwind Reminders

- Responsive: `md:` `lg:` `xl:` — must use `(class="md:...")` in Pug
- Spacing: `p-4` `m-8` `gap-2`
- Flex/grid: `flex` `grid` `items-center` `justify-between`

## Related

- [claude-theme.md](claude-theme.md) — custom `claude` theme defined inline
- [pug-syntax.md](pug-syntax.md) — Pug cheat sheet
- [preset-pico.md](preset-pico.md) — token-efficient alternative
- [daisyUI docs](https://daisyui.com/docs/cdn/)
