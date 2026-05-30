---
name: pug-ui
description: Generate single-file HTML UIs, reports, dashboards, and landing pages using Pug syntax compiled client-side with daisyUI + Tailwind CDN. Reduces LLM output tokens by ~75% compared to raw HTML + Tailwind. ALWAYS invoke when the user asks to create an HTML page, report, dashboard, UI mockup, or single-file web deliverable. Also invoke when user says "make a page", "create a report", "build a dashboard", "html output", "web UI", "single-file HTML", or "pug". Do NOT use for React/Vue/Svelte component development or server-rendered templates.
when_to_use: Triggers "make me a page", "create an html report", "build a dashboard", "landing page", "single-file", "web mockup", "html deliverable", "pug output", "token-efficient html", any request for a standalone .html file with visual UI.  Also use when the user has previously indicated preference for Pug output format.
---

# Pug UI Generator

Output Pug syntax instead of raw HTML. The template handles client-side compilation — you only write the Pug content block.

## Why Pug

Pug eliminates closing tags, angle brackets, and `class=""` boilerplate. Combined with daisyUI semantic classes, this saves ~75% output tokens vs raw HTML + Tailwind.

## How It Works

1. Read the template from `assets/template.html`
2. Copy it to the target path
3. Replace the Pug block inside `<script type="text/pug" id="pug-src">` with your content
4. Set `<title>` and `data-theme` (`dark`, `light`, `cupcake`, `dracula`, etc.)

## Pug Syntax

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

## Key Rules

- ONLY write Pug inside the template's script block — never raw HTML
- **Prefer daisyUI components** over raw Tailwind utilities (saves ~79% more tokens)
- 2-space indentation — Pug is whitespace-sensitive
- Responsive prefixes (`md:`, `lg:`, `hover:`): use `(class="md:grid-cols-3")` syntax
- Max nesting depth: 6-7 levels — flatten with grid/flex

## daisyUI

Prefer daisyUI semantic classes over raw Tailwind utilities. If unsure about a component's class names or need to check the latest API, use any available retrieval tool (web search, context7, docs-discovery, etc.) to look up daisyUI documentation before guessing.

## Themes

Set `data-theme` on `<html>`. Options: `light`, `dark`, `cupcake`, `bumblebee`, `emerald`, `corporate`, `synthwave`, `retro`, `cyberpunk`, `valentine`, `halloween`, `garden`, `forest`, `aqua`, `lofi`, `pastel`, `fantasy`, `wireframe`, `luxury`, `dracula`, `cmyk`, `autumn`, `business`, `acid`, `lemonade`, `night`, `coffee`, `winter`, `dim`, `nord`, `sunset`
