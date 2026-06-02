# pug-syntax

Pug cheat sheet — shared across all presets.

## Core Syntax

```pug
h1 Hello World                          //- tag + text
.container                              //- implicit div with class
  .card.bg-base-100.shadow              //- chained classes
    .card-body
      h2.card-title My Title
a(href="/about") About                  //- attributes in parens
.grid.gap-4(class="md:grid-cols-3")     //- responsive: use class attr for colons
li
  span.badge Warning
  |  Text after badge                   //- pipe for inline text nodes
.container: h1 Shorthand                //- colon for inline nesting
//- This is a comment                   //- not rendered
```

## Rules

| Rule | Detail |
|------|--------|
| Indentation | 2 spaces — Pug is whitespace-sensitive |
| Responsive prefixes | `md:` `lg:` `hover:` → use `(class="md:...")` |
| Inline text | Use `|` for text nodes after an element |
| Shorthand nesting | `.parent: .child` collapses one level |
| Max depth | 6–7 levels — flatten with grid/flex |
| Comments | `//-` (not rendered in output) |

## ID & Attributes

```pug
#main.container                          //- id="main" class="container"
input(type="text" name="email" required)
img(src="a.png" alt="A")
a(href="/" target="_blank") Open
```

## Conditionals & Loops

```pug
each item in [1,2,3]
  li= item

if user
  p Hello #{user.name}
else
  p Sign in
```

Note: data must be passed at render time (template config — rare for our static use).

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| `.grid md:grid-cols-3` | `.grid(class="md:grid-cols-3")` |
| Mixed tabs/spaces | Use 2 spaces only |
| Forgetting `\|` for text after tag | `span Hi` then `\| there` on next line indented |
| Writing raw HTML in Pug | Don't — let Pug handle it |

## Related

- [preset-pico.md](preset-pico.md)
- [preset-bulma.md](preset-bulma.md)
- [preset-daisyui.md](preset-daisyui.md)
- [preset-minimal.md](preset-minimal.md)
- [Pug docs](https://pugjs.org/api/getting-started.html)
