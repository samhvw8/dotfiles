---
name: guizang-ppt-skill
description: Generate single-file HTML horizontal-swipe presentation decks with WebGL backgrounds and Motion entrance animations. Two styles — "Digital Magazine × E-Ink" (serif + fluid shader + warm tones) and "Swiss International Style" (sans-serif + dot grid + IKB/yellow/green/orange accent). ALWAYS invoke when the user wants a web-based presentation, slide deck, or PPT as HTML. Triggers — "make me a deck", "create slides", "presentation", "PPT", "web slides", "horizontal swipe", "magazine-style", "Swiss Style", "Helvetica deck", "single-file slides", "launch deck", "demo day slides", "keynote as HTML", or any request for browser-based slides. NOT for PowerPoint/Keynote/Google Slides editing or Slidev/Marp.
---

# Single-File HTML Presentation Deck

## What This Skill Does

Generates a **single-file HTML** horizontal-swipe PPT with two visual styles to choose from:

### Style A · Digital Magazine × E-Ink (Default)

- **WebGL fluid / contour / dispersion background** (visible on hero pages)
- **Serif headings (Noto Serif SC + Playfair Display) + sans-serif body + monospace metadata**
- Best for: humanities talks, industry insights, business launches, presentations that need a "magazine feel"
- Templates: `assets/template.html` · Theme colors: `references/themes.md` · Layouts: `references/layouts.md`
- Aesthetic anchor: like *Monocle* magazine with code pasted on

### Style B · Swiss International Style (Swiss Style)

- **WebGL ultra-fine grid + dot matrix background** (information-driven design)
- **All sans-serif throughout (Inter + Helvetica + Noto Sans SC) + extreme type-size contrast**
- **High-contrast functional colors**: Klein Blue IKB / lemon yellow / lime green / safety orange (pick one)
- Best for: tech products, data reports, design/engineering talks, year-end reviews
- Templates: `assets/template-swiss.html` · Theme colors: `references/themes-swiss.md` · Layouts: `references/layouts-swiss.md`
- Aesthetic anchor: like Massimo Vignelli + Helvetica Forever

**Shared across both styles**: horizontal swiping (keyboard ← →, scroll wheel, touch, ESC index; `scroll-snap-stop: always` prevents fast-swipe skipping), Lucide icons, Motion entrance animations (local + CDN dual fallback). Both templates include `text-autospace: normal` for native CJK-Latin spacing (Chrome 139+, Safari 18.4+, Firefox 145+).

## When to Use

**Good fit**:
- Offline talks / internal industry presentations / private gatherings
- AI product launches / demo days
- Presentations with a strong personal style
- "Build once, no slideshow tool needed" web-based slides
- Any request for a self-contained HTML presentation that works in a browser

**Not a good fit** (use something else):
- Heavy tabular data or stacked charts → use PowerPoint / Google Slides
- Training courseware with dense information → use conventional slide tools
- Multi-person collaborative editing → this is static HTML, not a SaaS app
- Editing existing .pptx / .key / .gslides files → this skill generates HTML, not native slide formats
- Markdown-to-slides workflows → use Slidev, Marp, or reveal.js directly

**Rationalizations to reject** (do not skip this skill when):
| Rationalization | Why it's wrong |
|---|---|
| "I'll just write plain HTML" | This skill provides 22+ tested layouts, theme systems, WebGL shaders, and animation — rebuilding from scratch wastes hours |
| "The user didn't say 'PPT'" | Users say "deck", "slides", "presentation", "make something I can present" — all trigger this skill |
| "I'll use reveal.js instead" | This skill generates zero-dependency single-file HTML; reveal.js requires external dist/ files |

---

## Workflow

### Step 1 · Requirements Clarification (mandatory before starting)

**If the user already provided a complete outline + images**, skip to Step 2.

Otherwise, clarify with the user before writing any slides — wrong structure is expensive to rework.

**Key decisions** (in order):
1. **Style A or B?** → determines which template + layouts + themes to load
2. **Audience and setting?** → determines tone
3. **Duration?** → 15 min ≈ 10 pages, 30 min ≈ 20 pages, 45 min ≈ 25-30 pages
4. **Source material?** → build from it or scaffold from scratch
5. **Images?** → folder at `project/XXX/ppt/images/`, named `{page}-{semantic}.{ext}`
6. **Theme color?** → Style A: 5 presets (`themes.md`) / Style B: 4 presets (`themes-swiss.md`)
7. **Hard constraints?** → must-include / must-exclude items

**Full clarification workflow, style selection guide, outline templates, and image conventions** → `references/workflow-clarification.md`

### Step 2 · Copy the Template

Copy the template matching the chosen style. Styles A and B **cannot be mixed** — class names are incompatible.

```bash
mkdir -p "project/XXX/ppt/images"
# Style A
cp "<SKILL_ROOT>/assets/template.html" "project/XXX/ppt/index.html"
# Style B
cp "<SKILL_ROOT>/assets/template-swiss.html" "project/XXX/ppt/index.html"
```

Then: grep `[必填]` to replace all required placeholders, and apply a theme color preset.

**Full setup instructions, placeholder checklist, and theme selection** → `references/template-setup.md`

### Step 3 · Fill in Content

**Critical pre-flight** (the #1 cause of broken output):
1. **Read the template's `<style>` block** — class names are the single source of truth
2. **Plan theme rhythm** — every page must be `light` / `dark` / `hero light` / `hero dark`; no 3+ consecutive same-theme pages
3. **Pick layouts from the reference** — do not write slides from scratch

| Style | Layouts Reference | Layout Count |
|-------|-------------------|-------------|
| A | `references/layouts.md` | 10 paste-ready skeletons |
| B | `references/swiss-layout-lock.md` → `references/layouts-swiss.md` | 22 registered layouts (S01-S22) |

**Swiss locked mode**: body pages must use S01-S22 only. Each `<section>` needs `data-layout="Sxx"`. No ad-hoc layouts.

**Full content guide with class checklists, theme rhythm rules, image ratios, and Chinese heading tiers** → `references/content-guide.md`

### Step 4 · Self-Check

Open `references/checklist.md` and verify every item. P0 issues (emoji, image overflow, heading breaks, font assignment) must all pass.

**Don't just review code** — open the page in a browser and visually verify each slide. Wait for animations to settle (~1-2s) before judging layout.

For Swiss style, run the validator: `node <SKILL_ROOT>/scripts/validate-swiss-deck.mjs path/to/index.html`

### Step 5 · Local Preview

```bash
open "project/XXX/ppt/index.html"
```

No local server needed. Images use relative paths `images/xxx.png`.

### Step 6 · Iterate

The template's CSS is highly parameterized — 90% of adjustments are inline style changes (`font-size:Xvw` / `height:Yvh` / `gap:Zvh`).

---

## Resource File Guide

```
guizang-ppt-skill/
├── SKILL.md                  ← You are reading this (workflow router)
├── assets/
│   ├── template.html         ← Style A · Digital Magazine template (seed file)
│   ├── template-swiss.html   ← Style B · Swiss International Style template (seed file)
│   └── motion.min.js         ← Motion local copy (offline fallback, ~64KB, shared)
├── scripts/
│   └── validate-swiss-deck.mjs ← Style B static validation
└── references/
    ├── workflow-clarification.md ← Step 1: 7-question checklist, style guide, outline templates, image conventions
    ├── template-setup.md     ← Step 2: template copy, placeholders, theme color selection
    ├── content-guide.md      ← Step 3: class pre-flight, theme rhythm, layout selection, image ratios, CJK headings
    ├── components.md         ← Component manual (fonts, colors, grids, icons, callouts, stats, animations)
    ├── layouts.md            ← Style A · 10 page layout skeletons (paste-ready, with animation markers)
    ├── swiss-layout-lock.md  ← Style B · 22P layout lock (body pages must follow these registrations)
    ├── layouts-swiss.md      ← Style B · 22P skeleton docs + experimental section
    ├── swiss-map-component.md ← Style B · S08 map extension (MapLibre markers/connections/cards/controls)
    ├── themes.md             ← Style A · 5 theme color presets
    ├── themes-swiss.md       ← Style B · 4 Swiss theme color presets
    ├── image-prompts.md      ← GPT Image 2 image types, ratios, base prompts, model selection guide
    └── checklist.md          ← Quality checklist (P0/P1/P2/P3 severity levels)
```

**Loading order**:
1. Read `SKILL.md` (this file) for the overview
2. Clarify style A or B → read the matching `themes*.md`
3. **Read the template's `<style>` block** before writing any code
4. Read `content-guide.md` for pre-flight, rhythm, and layout selection
5. Read the matching `layouts*.md` for paste-ready skeletons
6. If Swiss + map needed → read `swiss-map-component.md`
7. If generating images → read `image-prompts.md`
8. After generation → run validator + read `checklist.md`

---

## Core Design Principles

### Style A · Digital Magazine

> Violating any one of these will break the magazine feel.

1. **Restraint over showmanship** — WebGL background only shows through on hero pages
2. **Structure over decoration** — no shadows, no floating cards; hierarchy through **large type + font contrast + grid whitespace**
3. **Content hierarchy = size + typeface** — largest serif = heading, large sans = lead, small sans = body, mono = metadata
4. **Images are first-class** — crop bottom only; grids use `height:Nvh`, never `aspect-ratio`
5. **Rhythm from hero pages** — alternate hero and non-hero to prevent fatigue
6. **Consistent terminology** — Skills means Skills; don't mix translations

### Style B · Swiss International Style

> Violating any one of these drops the design from Swiss to PowerPoint.

1. **Single accent color** — one deck, one accent; no multi-color highlights
2. **Extreme type-size contrast** — heading:body ratio ≥ 8:1; KPI = "Data Hero" (18-22% of screen width)
3. **Sans-serif only** — Inter / Helvetica / Noto Sans SC; any serif is wrong
4. **Sharp corners, solid fills** — no gradients / shadows / border-radius (except rule lines)
5. **Grid above all** — 12-col grid, left-aligned, asymmetric whitespace
6. **Hairlines are scalpels** — 1px dividers only; no thick lines, no shadows
7. **Dot matrix only on hero pages** — body pages stay clean

---

## Reference Works

**Style A** was inspired by: 歸藏 Guizang's "One-Person Company" talk (2026), *Monocle* magazine, YC's Garry Tan "Thin Harness, Fat Skills" demo.

**Style B** was inspired by: Massimo Vignelli (NYC Subway / Unimark), *Helvetica Forever*, Josef Müller-Brockmann's grid systems, Acne Studios / Off-White / IKEA / Beck Design.
