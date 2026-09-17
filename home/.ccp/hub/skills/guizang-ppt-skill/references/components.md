# Component Reference · Components

This is the component manual for the `guizang-ppt-skill` skill. template.html already defines all styles — this document only describes "what each component looks like and how to use it."

## Table of Contents

- [Basic Slide Shell](#basic-slide-shell)
- [Typography](#typography)
- [Chrome & Foot](#chrome--foot)
- [Callout Quote Box](#callout-quote-box)
- [Stat Number Matrix](#stat-number-matrix)
- [Platform Card](#platform-card)
- [Rowline Table Row](#rowline-table-row)
- [Pillar Card](#pillar-card)
- [Tag & Kicker](#tag--kicker)
- [Figure Image Frame](#figure-image-frame)
- [Icons](#icons)
- [Ghost Giant Background Text](#ghost-giant-background-text)
- [Highlight Marker](#highlight-marker)
- [Motion Animation System](#motion-animation-system)

---

## Basic Slide Shell

Every page is a `<section class="slide ...">`. It must include a `data-theme` attribute (`light` or `dark`) — the JS page transition will switch backgrounds based on this attribute.

```html
<section class="slide light" data-theme="light">   <!-- Light page -->
<section class="slide dark" data-theme="dark">     <!-- Dark page -->
<section class="slide light hero" data-theme="light">  <!-- Hero page: light + thin overlay showing WebGL -->
<section class="slide dark hero" data-theme="dark">    <!-- Hero page: dark + thin overlay -->
```

**light vs dark usage: alternate between them**, switching every 2-3 pages to avoid more than 3 consecutive pages of the same color. During page transitions, the WebGL background will automatically crossfade between two shaders.

**hero class usage**: Only add to visually dominant pages (cover, key quote, chapter transitions, closing). Adding `hero` reduces the overlay to 12-16%, letting the WebGL background show through prominently — so don't put too much text on hero pages.

---

## Typography

Font assignment is the most important rule of this template — mixing is strictly forbidden.

| Class | Purpose | Font |
|---|---|---|
| `.display` | Extra-large English text (Hero pages) | Playfair Display 700, 11vw |
| `.display-zh` | Extra-large Chinese titles | Noto Serif SC 700, 7.8vw |
| `.h1-zh` | Page main title | Noto Serif SC 700, 4.6vw |
| `.h2-zh` | Subtitle | Noto Serif SC 600, 3.2vw |
| `.h3-zh` | Pipeline step titles | Noto Serif SC 500, 1.9vw |
| `.lead` | Lead paragraph (larger than body) | Noto Serif SC 400, 1.9vw |
| `.body-zh` | **Body text/descriptions (sans-serif)** | Noto Sans SC 400, 1.22vw |
| `.body-serif` | Body text (serif) | Noto Serif SC 400, 1.3vw |
| `.kicker` | Section hint (above title) | IBM Plex Mono, 12px uppercase |
| `.meta` | Metadata labels | IBM Plex Mono, 0.88vw uppercase |
| `.big-num` | Giant numbers | Playfair Display 800, 10vw |
| `.mid-num` | Medium numbers | Playfair Display 700, 5.5vw |

**Core rules**:
- **Serif** (`serif-zh` / `serif-en`): Titles, key quotes, numbers — used for "visual emphasis"
- **Sans-serif** (`sans-zh`): Body descriptions, long-form reading — used for "information density"
- **Monospace** (`mono`): kicker, meta, foot English labels — used for "decorative rhythm"

**Emphasis techniques**:
- `<em class="en">English word</em>` — renders the English word in Playfair Display italic (looks great)
- `<em style="opacity:.65">phrase</em>` — fades the latter half of a title, creating rhythm

---

## Chrome & Foot

The metadata bars at the top and bottom of each page. Almost all pages should have them.

```html
<div class="chrome">
  <div class="left">
    <span>Act One · Hard Data</span>
    <span class="sep"></span>
    <span>Act I</span>
  </div>
  <div class="right"><span>02 / 27</span></div>
</div>

<!-- ... page body ... -->

<div class="foot">
  <div class="title">Project Name · CodePilot　|　github.com/codepilot</div>
  <div>Act I · Dev Numbers</div>
</div>
```

**Rules**:
- `chrome.right` always shows page number `NN / TOTAL` (TOTAL is the total page count)
- `foot.title` is the Chinese description, `foot.right` is the English act label
- chrome and foot together form the magazine-style "header and footer"

---

## Callout Quote Box

For displaying key quotes / core points / attributed quotations.

```html
<div class="callout" style="max-width:80vw">
  <div class="q-big">"Three years ago, this would have<br>taken a team of ten an entire year."</div>
  <span class="cite">— An observer's assessment</span>
</div>
```

Variants:
- Without cite: simply remove the `<span class="cite">` element
- With English quote: `<em class="en">"Thin Harness, Fat Skills."</em>`
- On hero pages: add `style="position:relative;z-index:2"` to the outer wrapper (to prevent it from being covered by the background overlay)

---

## Stat Number Matrix

For displaying data metrics, commonly used with `.grid-6` / `.grid-4`.

```html
<div class="grid-6">
  <div class="stat">
    <span class="m">Duration</span>
    <span class="n">64<em style="font-size:.4em;opacity:.5;font-style:normal"> days</em></span>
    <span class="l">From zero to now</span>
  </div>
  <!-- ... more stats ... -->
</div>
```

Three-part structure: `.m` monospace small label → `.n` giant number → `.l` description. Units after numbers use `<em>` scaled down to 0.4em, opacity 0.5.

**Common layout containers**:
- `.grid-6` — 3x2 grid (most common, 6 stats)
- `.grid-4` — 2x2 grid (4 stats)
- `.grid-3` — 3-column single row (3 stats / pillars)

---

## Platform Card

For displaying social platforms / channels + follower counts.

```html
<div class="plat">
  <div class="sub">Weibo</div>
  <div class="name">Weibo</div>
  <div class="nb">289K</div>
</div>
```

Optional fourth row (supplementary note):
```html
<div class="body-zh" style="font-size:max(11px,.8vw);opacity:.5;margin-top:.6vh">
  Synced with Xiaolvshu
</div>
```

**"Also On" variant** (additional platforms):
```html
<div class="plat" style="border-top-style:dashed;opacity:.72">
  <div class="sub">Also On</div>
  <div class="body-zh" style="font-weight:600;margin-top:.8vh">
    Bilibili　·　Zhihu
  </div>
</div>
```

---

## Rowline Table Row

List-style content, one item per row.

```html
<div class="rowline">
  <div class="k">CLAUDE.md</div>
  <div class="v">How you should work — behavioral rules + work preferences + prohibitions</div>
  <div class="m">EMPLOYEE · HANDBOOK</div>
</div>
```

Three-column structure: `.k` serif keyword · `.v` body description · `.m` monospace label (right-aligned). The first and last rowline automatically get top/bottom borders.

**Variant: 2 columns**: `style="grid-template-columns:1fr 3fr"` and omit the `.m` column.

---

## Pillar Card

Three-pillar structure, commonly used for "parallel concepts" pages.

```html
<div class="grid-3">
  <div class="pillar">
    <div class="ic">01</div>
    <div class="t">Three-Layer<br>Documentation</div>
    <div class="d">CLAUDE.md<br>+ Project Knowledge Base<br>+ Guardrail Files</div>
  </div>
  <!-- ... more pillars ... -->
</div>
```

**Pillar with icon (for emphasis pages)**:
```html
<div class="pillar" style="padding:4vh 2vw;border:1px solid currentColor;border-color:rgba(10,10,11,.2)">
  <div class="ic"><i data-lucide="compass" class="ico-lg"></i></div>
  <div class="t">Judgment</div>
  <div class="d">Authority over decisions and direction.<br>Trade-offs, taste, sense of direction.</div>
</div>
```

`.ic` can be a sequence number (`01 / 02 / 03` or `A. / B. / C.`), or a Lucide icon.

---

## Tag & Kicker

**Kicker** is the small hint text above the title (monospace, all-caps, small font):
```html
<div class="kicker">Past 64 Days · Development</div>
<div class="h1-zh">What one person built.</div>
```

**Tag** is a standalone label capsule (with border):
```html
<div style="display:flex;gap:1.6vw;flex-wrap:wrap">
  <div class="tag">Wake up at 10am</div>
  <div class="tag">Gym on Tue / Thu afternoons</div>
  <div class="tag">Still watch shows · play games at night</div>
</div>
```

---

## Figure Image Frame

**This is the component most prone to mistakes in this template — follow these rules carefully**.

### Basic Structure

```html
<figure class="tile">
  <div class="frame-img" style="height:26vh">
    <img src="images/xxx.png" alt="Description">
  </div>
  <figcaption class="frame-cap">
    <span class="pf">Twitter · Twitter</span>
    <span class="nb">137K</span>
  </figcaption>
</figure>
```

### Key Constraints (Hard-won lessons — do not violate)

1. **Image grids must use `height:Nvh` for fixed height** — do not use `aspect-ratio`.
   - Reason: Using aspect-ratio in grids can easily blow out the parent container, causing images to stack.
   - Recommended sizes: `.h-16` (small panel) / `.h-18` (compact strip) / `.h-22` (standard grid) / `.h-26` (prominent display) / `.h-28` (large image).
   - Single hero images can use the template's ratio classes: `.r-16x9` / `.r-16x10` / `.r-4x3` / `.r-3x2` / `.r-3x4` / `.r-1x1`.
   - Images in the same group must use the same height class — don't mix `25vh` and `21vh`.

2. **`object-position:top center` (already set in CSS)** — only the bottom may be cropped.
   - Cropping left, right, or top is strictly forbidden — that's where the image's core identity information is.

3. **When using multiple images in a grid, use inline grid instead of `grid-3`**:
   ```html
   <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1vh 1.2vw">
     <figure class="tile">...</figure>
     <figure class="tile">...</figure>
     <figure class="tile">...</figure>
   </div>
   ```

4. **Align images with other layout elements**: Use `.grid-2-7-5` / `.grid-2-6-6` / `.grid-2-8-4` grid structures for natural top alignment. Don't add `align-self:end` to images.

5. **Infographics / screenshot redesigns**: Add `.fit-contain` to `.frame-img` to prevent text and annotations in the image from being cropped.

6. **When user's original screenshot has unsuitable proportions**: Prefer regenerating a "screenshot redesign / UI mockup" at the target ratio — don't force the original into an elongated strip.

### Frame Caption Variants

```html
<!-- Standard: left figure name, right number -->
<figcaption class="frame-cap">
  <span class="pf">Twitter · Twitter</span>
  <span class="nb">137K</span>
</figcaption>

<!-- With index number -->
<figcaption class="frame-cap">
  <span class="idx">01</span>
  <span class="pf">AI Polish</span>
  <span>Polish</span>
</figcaption>
```

### Image Placeholder (Design-phase placeholder)

When images aren't ready yet, use a dashed border placeholder:
```html
<div class="img-slot r-4x3">  <!-- r-4x3 / r-16x9(default) / r-3x2 / r-1x1 -->
  <span class="plus">+</span>
  <span class="label">GitHub screenshot placeholder</span>
</div>
```

---

## Icons

**Emoji is strictly forbidden**. Use Lucide via CDN (already included in template.html).

```html
<i data-lucide="compass" class="ico-lg"></i>     <!-- Large icon (for pillars) -->
<i data-lucide="target" class="ico-md"></i>      <!-- Medium icon (for list items) -->
<i data-lucide="check-circle" class="ico-sm"></i>  <!-- Small icon (for inline use) -->
```

**Common Lucide icon names** (grouped by meaning):

- Judgment: `compass`, `target`, `crosshair`, `search-check`
- Relationships: `share-2`, `users`, `network`, `link`, `handshake`
- Branding: `crown`, `gem`, `award`, `star`, `badge-check`
- Process: `workflow`, `route`, `arrow-right-left`, `repeat`
- Data: `grid-2x2`, `bar-chart-3`, `trending-up`, `activity`
- Aesthetics: `palette`, `brush`, `eye`, `sparkles`
- Right/Wrong: `check-circle`, `x-circle`, `check`, `x`
- Direction: `arrow-right`, `arrow-up-right`, `corner-down-right`

**Icon + text inline combination**:
```html
<div class="h3-zh" style="display:flex;align-items:center;gap:.8em">
  <i data-lucide="target" class="ico-md"></i>
  Judgment — What's worth writing
</div>
```

---

## Ghost Giant Background Text

Used as "decorative background text" at very low opacity to create a magazine feel.

```html
<div class="ghost" style="right:-6vw;top:-8vh">BUT</div>
<div class="ghost" style="left:-8vw;bottom:-18vh;font-style:italic">Harness</div>
```

- Font size 34vw, opacity 0.06
- Common positions: `right:-6vw;top:-8vh` (upper-right overflow) / `left:-8vw;bottom:-18vh` (lower-left overflow)
- Content: English words or numbers (chapter numbers 01/02/03, keywords BUT/NOW/HERE)

**Note**: On pages using ghost, other content needs `position:relative;z-index:2` to avoid being pushed below it.

---

## Highlight Marker

Inline "highlighter pen" effect for short phrases:

```html
<span class="hi">not</span>
<span class="hi">a one-time burst</span>
```

Generates a semi-transparent highlight bar beneath the text. Dark themes use a bright bar, light themes use a dark bar (already handled in CSS).

**Best for**: Use only on 1-3 key words — don't apply broadly.

---

## Motion Animation System

The entire deck has page-entry animations enabled by default, powered by Motion (vanilla version of Framer Motion, ~4KB).

**Alternative:** GSAP (now 100% free after Webflow acquisition) offers SplitText and MorphSVG plugins. Consider only if those specific features are needed — Motion is lighter for this skill's use case.

### Loading Method

The module script at the bottom of `assets/template.html` first tries the **local** `assets/motion.min.js`, falls back to **jsdelivr CDN** on failure, and if both fail, forces all elements with `data-anim` to `opacity:1` — content is always readable, presentations don't depend on network.

### CSS @property Number Count-Up (Zero JS)

For KPI/stat slides, CSS can animate integers natively (Baseline Jul 2024, all browsers):

```css
@property --num { syntax: '<integer>'; initial-value: 0; inherits: false; }
.counter { transition: --num 2s ease-out; counter-reset: num var(--num); }
.counter::after { content: counter(num); }
.counter.active { --num: 1234; }
```

Use this for simple integer KPI reveals. For formatted numbers (commas, units), use the JS `countUp()` pattern in the template's `playSlide()`.

```js
// Core loader in template (don't modify)
let motion;
try { motion = await import('./assets/motion.min.js'); }
catch(e1) {
  try { motion = await import('https://cdn.jsdelivr.net/npm/motion@12.38.0/+esm'); }
  catch(e2) {
    document.querySelectorAll('[data-anim]').forEach(el=>{el.style.opacity='1';el.style.transform='none'});
  }
}
```

### Data Attribute Driven

You only need to add two types of attributes in the HTML:

```html
<!-- 1. Choose a recipe on the section (optional, defaults to cascade / hero auto) -->
<section class="slide light" data-animate="quote">

<!-- 2. Add data-anim on elements that should animate in (values: left/right/line/step/divider) -->
<h1 class="h-xl" data-anim>Main Title</h1>
<div class="stat-card" data-anim>...</div>
<div data-anim="left">Left column content</div>
<span data-anim="line" style="display:block">First line of quote</span>
```

### 5 Recipes Overview

| Recipe | Trigger | Behavior | Representative Layouts |
|---|---|---|---|
| `cascade` (default) | No `data-animate` attribute needed | All `data-anim` elements stagger fade in, 75ms/step | Layout 3 / 4 / 5 / 10 |
| `hero` | `.hero` slide uses this automatically | Slower stagger, more ceremonial feel, 160ms/step | Layout 1 / 2 / 7 |
| `quote` | `data-animate="quote"` | Other elements appear first, `data-anim="line"` rows reveal sequentially at 550ms intervals | Layout 8 |
| `directional` | `data-animate="directional"` | `data-anim="left"` slides in from left → divider → `data-anim="right"` slides in from right | Layout 9 |
| `pipeline` | `data-animate="pipeline"` | On page entry, steps remain at 15% opacity; pressing →/space/scroll lights them up one by one, page advances only after the last step | Layout 6 |

### Decision Tree for Choosing a Recipe

1. **Is it a `.hero` slide?** → Don't add `data-animate`, it automatically uses `hero`
2. **Is it a big quote page?** → `data-animate="quote"`, each line uses `<span data-anim="line" style="display:block">`
3. **Is it a left-right Before/After comparison?** → `data-animate="directional"`, left column `data-anim="left"`, right column `data-anim="right"`
4. **Is it a pipeline step-by-step walkthrough?** → `data-animate="pipeline"`, each step gets `data-anim="step"`
5. **All other body pages** → Add nothing, the default `cascade` looks great

### Which Elements Should Get `data-anim`?

- ✅ Each semantically independent block: kicker / h1 / h-xl / lead / callout / stat-card / figure / tag / rowline
- ✅ Each column in multi-column structures, so they fade in one by one instead of all at once
- ❌ Don't add to containers (`.grid-6` / `.frame`), only add to leaf elements
- ❌ Don't add to every `<li>` — adding at the `<ul>` level is usually sufficient
- ❌ If a page shouldn't have any animation (e.g., transition pages), simply don't add `data-anim` — Motion only targets marked elements

### Common Issues

- **Image flashes before appearing?** This is expected behavior — animation triggers mid-transition (at 450ms)
- **Pipeline page stuck, can't advance?** Correct — press → to light up steps one by one; only after all are lit does → advance to the next page
- **Content doesn't show even in static mode?** Check if motion.min.js exists in `assets/`; or check the browser console for errors
