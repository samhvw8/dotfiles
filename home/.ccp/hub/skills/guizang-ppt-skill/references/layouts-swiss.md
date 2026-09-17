# Layouts · Style B Swiss International Style

22 registered layouts · strict modular grid · each layout describes purpose, skeleton, key class names, and dedicated animation.

> ⚠️ These layouts are **not interchangeable** with Style A (e-magazine / e-ink). Class names overlap but have different semantics (e.g., `h-hero` is serif in Style A but ultra-light sans-serif weight 200 in Style B). A deck can only use one set.

---

## Swiss locked mode (must read first)

The golden source for this theme is:

`/Users/guohao/Documents/op7418的仓库/项目/Thin-Harness-Fat-Skills/ppt/index.html`

When generating body pages, do not treat Swiss as a "freely composable style pack." By default you may only use `S01-S22` registered in `references/swiss-layout-lock.md`. Every slide must have `data-layout="Sxx"` on its `<section>`.

**Key constraints**:

- Top Chinese titles are left-aligned by default and sit on the upper-left content axis; do not center titles on the page.
- Creating ad-hoc body structures beyond the original 22 pages is not allowed. P23/P24 at the end of this document belong to the historical experiment zone and are disabled by default.
- For a single large image, use `S22 Image Hero`; for multiple images, repurpose the original matrix/tabloid skeleton from `S15/S16` into image cells.
- Location, route, residence, and city relationship pages use `S08 + Swiss Map Component`; this is still a right-slot extension of S08, not a new body page. Read `swiss-map-component.md` first.
- SVGs should only draw geometry, not visible text. Labels go in HTML.
- After generation, run `node scripts/validate-swiss-deck.mjs index.html`.

---

## Design Language Baseline

**Color palette** (`--accent` is determined by the theme; see `themes-swiss.md`)
- `--paper` paper white background #ffffff (main background)
- `--ink` black ink text #0a0a0a (main text / Ink inverted blocks)
- `--accent` single-color anchor (IKB blue default / yellow / green / orange — four sets)
- `--text-primary / secondary / helper` three-tier text grayscale
- `--border-subtle` 1px hairline #e0e0e0

**Typography**
- Fonts: `var(--sans)` Inter / Helvetica Neue + `var(--mono)` JetBrains Mono
- Weights: **200 (ExtraLight) for large text** / **300 (Light) for body text** / **600 (SemiBold) for t-cat labels**
- Large titles follow the actual usage in the original PPT: main title `font-weight:200`, emphasis words/numbers `font-weight:300`; do not bold Swiss large titles just because legacy CSS helpers had 800/900 remnants
- Large type tightened: `letter-spacing:-.04em` / `line-height:.9`
- Mono numbers: `font-feature-settings:"tnum","ss01"`
- **CJK-Latin auto-spacing**: Both templates include `text-autospace: normal` on the body element, providing native spacing between CJK and Latin characters (Chrome 139+, Safari 18.4+, Firefox 145+). No manual spacing or pangu.js needed.

**Chinese large title size tiers**
Chinese block characters have heavier visual mass than Latin text, so you cannot directly apply the English page's `6.8vw-7vw`. Before generating, step down based on Chinese title length:

| Chinese title shape | Recommended size |
|---|---|
| 1 line, ≤ 8 Chinese characters | `min(6.4vw,11.2vh)` |
| 2 lines, each ≤ 8 Chinese characters | `min(5.8vw,10.2vh)` |
| 2 lines, either line 9-12 Chinese characters | `min(5.2vw,9.2vh)` |
| 3 lines or longer title | Rewrite the title; if absolutely necessary use `min(4.6vw,8.2vh)` |

Rule: prioritize shortening Chinese titles, then reduce font size; do not let the title encroach on the image/text area below. English and numeric hero text can be larger; Chinese methodology pages must be more restrained.

**Grid** (adapted from IBM Carbon 2x Grid)
- 16-column grid: `grid-template-columns:repeat(16,1fr)` + `gap:16px`
- spacing tokens: `--sp-3` 8 / `--sp-4` 12 / `--sp-5` 16 / `--sp-6` 24 / `--sp-7` 32 / `--sp-8` 40 / `--sp-9` 48 / `--sp-10` 64 / `--sp-11` 80 / `--sp-12` 96 / `--sp-13` 160

**Canvas**
- `.canvas-card`: `100vw × 100vh`, sharp corners with no border-radius, padding `5.6vh 5vw 4.4vh`
- `body{background:var(--paper)}` — no WebGL background
- The bottom-right `B static` hotkey must be preserved. Low-power mode uses `body.low-power`, stopping WebGL/ASCII canvas RAF and Motion entrance animations; the user's choice persists via `localStorage` after refresh.

---

### P0 Alignment Rules (check these 4 rules before generating every page — violation = entire page scrapped)

**1. Do not double-stack horizontal padding** ⚠️ Most common mistake
`.canvas-card` already has `padding:5.6vh 5vw 4.4vh`.
chrome-min (header), main content, and bottom footnote are all children of canvas-card and **share the same 5vw edge**.
If you add another `padding:5vh 5vw 4vh` on the main content layer, the horizontal padding becomes `5vw + 5vw = 10vw`, making the body indented one level more than chrome-min and misaligning left/right edges.

```html
<!-- ❌ Wrong: body has extra 5vw inset -->
<div class="canvas-card">
  <div class="chrome-min">...</div>
  <div style="flex:1;padding:5vh 5vw 4vh;...">Body content</div>
</div>

<!-- ✅ Correct: body padding is 0, use grid gap for vertical spacing -->
<div class="canvas-card">
  <div class="chrome-min">...</div>
  <div style="flex:1;padding:0;display:grid;grid-template-rows:auto 1fr auto;gap:3vh">Body content</div>
</div>
```

Exception: `.slide.split .canvas-card{padding:0}` is already overridden by CSS; in split mode the two `.half` elements control their own padding (typically `5.6vh 3.6vw 4.4vh`), which does not conflict with this rule.

**2. Kicker must be "above" the large title, not side-by-side**
The subtitle (`.t-meta` / `.t-cat`) and large title have a subordinate relationship and must use a **vertical stacking** layout.

```html
<!-- ❌ Wrong: auto 1fr squeezes kicker and title into two side-by-side columns -->
<div data-anim="head" style="display:grid;grid-template-columns:auto 1fr;gap:3vw;align-items:end">
  <div class="t-meta">METHODOLOGY · 03</div>
  <h2 class="h-xl-zh">Why N+1</h2>
</div>

<!-- ✅ Correct: flex column stacks vertically -->
<div data-anim="head" style="display:flex;flex-direction:column;gap:1.4vh">
  <div class="t-meta">METHODOLOGY · 03</div>
  <h2 class="h-xl-zh">Why N+1</h2>
</div>
```

**3. Dual-constraint height clamping: in `min(Xvw, Yvh)`, Y ≥ X × 1.6**
On a standard 16:9 screen, 1vw : 1vh ≈ 1.78. If Y is too tight (e.g., `min(7vw, 10vh)`), the large font will be capped by the height limit at 10vh and no longer driven by 7vw, making it appear smaller overall.
Empirical values:

| Usage | Recommended |
|---|---|
| h-hero giant manifesto | `min(11.6vw, 19vh)` |
| h-xl section title | `min(7vw, 12vh)` ~ `min(7.4vw, 13vh)` |
| Large number KPI | `min(8.4vw, 14vh)` |
| Medium number / index | `min(4.6vw, 8.5vh)` ~ `min(5.6vw, 10vh)` |

**4. Use grid `gap` between canvas-card children, not margin/padding stacking**
`.canvas-card` defaults to `display:flex;flex-direction:column`; chrome-min has a built-in `margin-bottom:48px` (`--sp-9`).
For laying out rows below the main area (head / content / footnote), **prefer** `display:grid;grid-template-rows:...;gap:Nvh`, **fallback** to flex column + gap, **prohibit** adding `margin-top` / `padding-top` on each child block (which may overlap or tear away from chrome-min's margin-bottom).

**5. Bottom pagination safe zone: main content must not touch the nav**
The bottom pagination dots are fixed at `bottom:2vh`, visually occupying the area below ~`93vh`. The lowest point of main content, image captions, chart descriptions, and timeline labels must stay above the safe zone.

- The template provides `--nav-safe-bottom:8vh`, usable via `.nav-safe-bottom` / `.nav-safe-bottom-tight`
- When P23 uses `.swiss-img-split.align-image-bottom`, the template automatically adds a safe zone at the bottom to prevent image captions from being obscured by pagination controls
- If you hand-write `align-items:end` / `margin-top:auto` / `position:absolute;bottom:...` for a page, you must visually verify the lowest point does not cross the nav
- Visual check: open the page to that slide and confirm at least `3vh` breathing space between the lowest content edge and the pagination dots

---

**Card fill rules (must follow)**
| Type | Class | Role | Usage |
|---|---|---|---|
| Ink dark background | `.card-ink` | Inverted / manifesto | Hero blocks, half of closing page |
| Accent blue fill | `.card-accent` | Single focal point | Highlight one item in a group |
| Grey background | `.card-fill` | Default neutral | Multiple cards side by side, stat cards |
| Outlined stroke | `.card-outlined` | Anchor (not a card) | Hairline divider frame |

❌ Mixing is prohibited (blue background + blue border, grey background + border, etc.)

**Minimal decoration principle**
- 1px hairline separators (`hr-hairline` / `border-bottom`)
- 8×8 / 12×12 sharp-cornered small squares instead of dots
- Dot matrix `dot-mat` / stroke circles `ring-mat` / crosses `cross-mat` (SVG mask)

**Image usage principles (Swiss + GPT Image 2)**
- Images are "evidence blocks" in the grid, not decorative backgrounds; they must have a clear function: case study, documentary evidence, UI screenshot, system diagram, conceptual infographic
- All image containers must be sharp-cornered, no shadows, no border-radius; by default **do not add image frames** — let captions or the page grid establish hierarchy
- White-background infographics / flowcharts / UI diagrams: container background must be `var(--paper)`; do not use grey background to wrap white images, and do not add `.swiss-keyline` borders
- Only use `.swiss-lined` to add an accent top line when the image's own edges cannot be distinguished from the page; do not frame every image
- Documentary photos use `object-fit:cover` cropping only bottom/edges; original screenshots or text-heavy images use `.fit-contain` to avoid text being cropped
- If infographics, flowcharts, or UI scenario images are regenerated to fit S15/S16 slots, they must use `.frame-img.r-21x9` / `.frame-img.r-16x10` to fill the slot; do not add `.fit-contain` on top, otherwise the image will appear as a small picture floating in a white box
- Swiss image preferred ratios: S22 top banner `21:9`; S15/S16 multi-image grid uses uniform `21:9` or uniform `16:10`
- When generating 2-3 accompanying images, you must first bind to original layout slots: single large image = S22; multiple images = S15/S16 grid adaptation; do not use unregistered P23/P24
- S22 photo subjects must be in the central safe zone; HTML uses `object-position:center 35%` or `center center`, not `top center` which would crop faces
- GPT Image 2 generated images must follow the single accent color, Helvetica/Inter aesthetic, 12/16 column grid, sharp corners with solid colors, no gradients/shadows/border-radius
- Generated images should contain only the core image itself; do not include header, footer, title, page number, corner marks, borders, or attribution within the image

**Layout diversity hard rules**
The Swiss theme has 22 registered layouts; when generating, actively showcase the layout system — do not make all content into `head + grid-reveal + card`:

- A 7-8 page deck must use at least **6 different S-number layouts**
- Three consecutive pages with the same main structure (e.g., three S19 / generic card pages in a row) are not allowed
- For "test template" or "I want to see the effect" requests, you must cover: cover, closing, at least 1 comparison/timeline (S08/S11/S02), at least 1 structural diagram (S14/S17/S15), at least 1 image layout (S22 or S15/S16 image grid)
- Image pages are not newly invented pages. Single image uses S22; multiple images use the original grid skeleton from S15/S16
- Before writing code for each page, list `page number → data-layout → why this layout → image slots`; after generation, verify with the validator

**Animation principles (one semantic recipe per page)**
- Not a uniform fade-up, but **coupled to the graphic semantics**: numbers scale-pop in, bars scaleY grow, SVG rings stroke-dashoffset draw, timeline nodes sequentially light up
- Easing: `EASE_PROD` `cubic-bezier(.2,0,.38,.9)` for productive (120-240ms), `EASE_ENTRY` `cubic-bezier(0,0,.3,1)` for expressive (400-700ms)
- playSlide entry must reveal all `[data-anim]` containers to opacity:1; the recipe then uses motion `{opacity:[0,1]}` to override
- **CSS @property count-up** (Baseline Jul 2024): KPI number reveals can use pure CSS `@property --num` with `counter()` — zero JavaScript. See `components.md` for the pattern.

---

## Visual + Code Dual-Dimension Review (must do after generation)

Do not only look at HTML/CSS. Swiss template fidelity must be judged from both **browser visuals** and **code structure**:

1. Open three pages simultaneously: the original reference PPT, the current `template-swiss.html` or generated page, and the test PPT being modified. The original reference path is `/Users/guohao/Documents/op7418的仓库/项目/Thin-Harness-Fat-Skills/ppt/index.html`.
2. Wait for entrance animations to settle before taking screenshots (~1-2 seconds). Do not mistake mid-animation states for "missing content" or "blank layout."
3. Check visuals first: title weight, header spacing, image placement, bottom safe zone, whether captions are blocked by nav.
4. Compare against the same layout type in the original reference PPT, not just against CSS helpers; use actual page structure and visual results as the source of truth.
5. Then return to code and check whether the page incorrectly uses components from a different layout, such as stuffing P24's three-image evidence wall into P23, or using P7 charts for a concept list without real data.
6. If visuals are inconsistent, first determine whether it is a **wrong layout choice**, **missing required component**, **misused optional component**, or **spacing/safe-zone issue** — do not directly fix it by tweaking `margin`.
7. When modifying templates, new capabilities must be isolated with new classes; do not modify global base classes because of a single-page issue.

### Original PPT Visual Anchors (prioritize these when comparing)

| Visual anchor | Original PPT's actual approach | Rule when generating |
|---|---|---|
| Large title weight | Actual pages heavily use `font-weight:200/300`; even if the raw CSS helpers contain 700/800/900, those cannot be used as the visual standard | Keep large titles lightweight; the larger the size, the thinner the weight |
| White space | Pages often only occupy the upper half or center, leaving the bottom for nav and minimal footnotes | Do not push content to the bottom just to "fill" the page |
| Divider lines | Only used at section boundaries, evidence walls, and card hierarchy junctions as 1px hairlines | Do not add lines to every content block |
| Title vs. content | There is a clear air gap between title area and body/chart area | Use grid `gap` for complex pages; do not let content sit flush against the title |
| Timeline | The axis is in the lower-middle area, but labels do not touch the bottom nav | Horizontal timelines must check both upper/lower labels and the nav safe zone |
| Image pages | Images are evidence blocks — either as S22 hero visual or placed in S15/S16 original grid | Do not use unregistered image-text structures |

### Component Required / Optional / Omittable

| Component | Rule |
|---|---|
| `.canvas-card` / `.chrome-min` | Required for base pages; split pages have chrome-min in each half |
| `t-meta` / `t-cat` kicker | Required in head area, but can be omitted inside body cards; must be above the large title |
| Large title | Required for section/thesis pages; list-type small-card pages can use a smaller title, but cannot lack a page-level info anchor |
| `lead` description | Optional; if the title already explains clearly, can be omitted, but do not place long body text flush against the title |
| Image caption | Required for S15/S16 multi-image grids; optional for S22 large image since the image is already the main visual with KPI/description below |
| Hairline / border-bottom | Optional; only used to establish hierarchy, not for decorative line stacking |
| KPI / numbers | Only used when there is real data; do not fabricate values for conceptual explanations |
| `footnote` / bottom note | Optional; if used, must avoid the nav safe zone |
| `S08 + Swiss Map Component` | Dedicated to location/route/residence relationships; right-side map must have dots, connections, cards, and `+` / `-` / `DRAG` controls; see `swiss-map-component.md` for details |

### Universal / Non-Universal Layouts

| Type | Layouts | Usage boundary |
|---|---|---|
| Universal | S01, S03, S08, S09, S10, S11, S19 | Usable in most narrative decks, but content shape must still match |
| Conditionally universal | S04, S05, S13, S16 | Depends on whether the count exactly matches: 3/4/6 items |
| Data-specific | S02, S06, S07, S18, S20, S21, S22 | Must have real time, values, metrics, or case data |
| Structure-specific | S14, S15, S17 | Must have closed-loop, matrix, hierarchy/ecosystem relationships; not suitable for plain paragraphs |

---

## 22 Registered Layouts

### P1 · Cover · Cover Page

**Purpose**: Deck opener / theme manifesto.
**Applicable content types**: Cover / section title page / theme manifesto. **Pure text structure** (main title + subtitle + meta info); does not carry data.

**Default recommendation: IKB full-screen + ASCII breathing field** ⭐
- `<section class="slide accent">` full-screen IKB, **not** a light white background
- Insert `<canvas class="ascii-bg" aria-hidden="true">` as the first child inside `.canvas-card`; the template's bottom IIFE automatically drives a sin/cos 2D noise breathing field
- Main title in white weight 200; micro-emphasis words use italic (`font-style:italic;font-weight:300`) rather than IKB blue (the background is already blue — blue on blue is invisible)
- **Do not** add a large "01" index number — chrome-min already marks 01/NN
- Paired with P9 Closing's half-screen IKB to form an "opening full IKB ↔ closing half IKB" color bookend

**Key classes**: `.slide.accent` `.ascii-bg` + `min(11.6vw,19vh)` dual-constraint large text
**Animation recipe**: `hero` — ASCII character field breathes continuously; text fades up in sequence

**Example code (IKB default variant)**:
```html
<section class="slide accent" data-animate="hero">
  <div class="canvas-card">
    <canvas class="ascii-bg" aria-hidden="true"></canvas>
    <div class="chrome-min">
      <div class="l">[REQUIRED] Deck title · Issue/Field Note number</div>
      <div class="r">SS · 26.05.10 · 01 / NN</div>
    </div>
    <div style="flex:1;padding:0;display:grid;grid-template-rows:auto 1fr auto;gap:2.6vh">
      <div data-anim="kicker" class="t-meta" style="color:rgba(255,255,255,.78);letter-spacing:.22em">[REQUIRED] Section English / Section En</div>
      <h1 data-anim="title" style="align-self:center;font-family:var(--sans),var(--sans-zh);font-weight:200;font-size:min(11.6vw,19vh);line-height:.94;letter-spacing:-.025em;color:#fff">[REQUIRED] Chinese main title<br/>(can add <span style="font-style:italic;font-weight:300">italic</span> micro-emphasis on certain words)</h1>
      <div data-anim="bottom" style="display:grid;grid-template-rows:auto auto;gap:1.6vh;border-top:1px solid rgba(255,255,255,.22);padding-top:2vh">
        <div data-anim="lead" class="lead" style="max-width:52ch;color:rgba(255,255,255,.86);font-weight:300">[REQUIRED] A 1-2 line subtitle / intro that sets the tone for the entire deck.</div>
        <div style="display:flex;justify-content:space-between;align-items:end">
          <div class="t-meta" style="color:rgba(255,255,255,.6)">[OPTIONAL] Author · Date · Source</div>
          <div class="t-meta" style="color:rgba(255,255,255,.6)">→ swipe / arrow keys</div>
        </div>
      </div>
    </div>
  </div>
</section>
```

**Classic variant (left ink + right paper split)** — use only when full IKB does not match the content's tone:
```html
<section class="slide" data-animate="cover-reveal">
  <div class="canvas-card cover-split">
    <div class="cover-ink">
      <span class="t-cat">Volume 18 · 2026</span>
      <h1 class="h-hero">Thin Harness,<br>Fat Skills.</h1>
      <span class="t-meta">— Kevin · 2026-05</span>
    </div>
    <div class="cover-paper">
      <p class="lead">Thin harness, fat skills.</p>
      <ul class="meta-list">
        <li>22 PAGES</li><li>SWISS · IKB</li><li>MP-75</li>
      </ul>
    </div>
  </div>
</section>
```

---

### P2 · Vertical Timeline · Vertical Timeline

**Purpose**: Evolution comparison, chronological progression, version iteration (2-5 time nodes).
**Applicable content types**: **Time evolution with quantified data**. Each node must have a "year + quantified value (e.g., 1× / 4× multiplier / unit number) + description" triplet. If nodes only have names without data, use P11 Horizontal Timeline instead.
**Skeleton**: Left axis column with 12px dots + 1px dashed axis / right node info (year + large number data + label + description).
**Key classes**: `.timeline-v` `.tl-node` `.tl-axis` (12px fixed column width, absolute-positioned dot to prevent misalignment) `.kpi-row-4`
**Animation recipe**: `timeline-vertical` — nodes light up top-to-bottom in chronological order (dot pops then expands → text slides in horizontally)
**Grid rules**: axis column = 12px fixed; dot uses `position:absolute;left:50%;transform:translateX(-50%)` to align with the dashed line
**Example code**:
```html
<section class="slide" data-animate="timeline-vertical">
  <div class="canvas-card">
    <header class="chrome-min">...</header>
    <div class="timeline-v">
      <div class="tl-node">
        <div class="tl-axis"><span class="dot"></span></div>
        <div class="tl-body">
          <span class="yr">2023</span>
          <span class="multi">1<small>×</small></span>
          <p class="desc">Prompt Engineering Era</p>
        </div>
      </div>
      <!-- Repeat N tl-nodes; axis column runs through -->
    </div>
  </div>
</section>
```

---

### P3 · Statement · Minimal Statement

**Purpose**: Core thesis, section opener, slogan. One page holds a single sentence + simple decoration.
**Applicable content types**: **Pure qualitative assertion / slogan / section transition**. Compress to 8-12 words; **does not carry any data or lists**. If data support is needed, use P18 Why Now; if it is a cover, use P1.
**Skeleton**: Left 1/3 white space + center giant statement text (8-10vw, weight 200) + bottom-right small footnote + bottom hairline.
**Key classes**: `.h-statement` (9.6vw, letter-spacing:-.05em) `.stmt-anchor`
**Animation recipe**: `statement-rise` — large text rises word-by-word with staggered timing (180ms delay per word) + footnote fades in
**Example code**:
```html
<section class="slide" data-animate="statement-rise">
  <div class="canvas-card">
    <header class="chrome-min">...</header>
    <h1 class="h-statement">
      <span>Build it</span> <span>once.</span><br>
      <span>It runs</span> <span>forever.</span>
    </h1>
    <span class="stmt-anchor">— Statement 03</span>
  </div>
</section>
```

---

### P4 · Six Cells · Six-Cell Definition

**Purpose**: 6 parallel concept definitions, 6 feature comparisons.
**Applicable content types**: **6 equally-weighted concepts / features** (count must = 6; use P5 for fewer, P15/P16 for more). Each cell carries only "icon + number + short title + one-line description"; **does not carry data/paragraphs that need expansion**.
**Skeleton**: 2×3 grid / each cell has a lucide icon on top + number + short title + one-line description / cells separated by hairlines.
**Key classes**: `.cell-6` `.cell-icon-row` `.cell-num`
**Animation recipe**: `six-cells` — 6 cells light up in Z-order (L→R, T→B, 90ms delay per cell)
**Note**: **Do not draw SVG icons yourself**; use `<i data-lucide="bookmark"></i>` to pull from the lucide icon library.
**Example code**:
```html
<div class="cell-6">
  <div class="cell">
    <i data-lucide="square-stack"></i>
    <span class="cell-num">01</span>
    <h4>Skill File</h4>
    <p>Pure markdown, hand-writable and rewritable</p>
  </div>
  <!-- 5 more -->
</div>
```

---

### P5 · Three Sub-cards · Three Sub-Cards

**Purpose**: Three-step flow, three-way comparison (light differences).
**Applicable content types**: **3 equally-weighted concepts / steps** (count must = 3). Homogeneous structure, **no strong data differences** (if data is comparable, use P6 KPI Tower instead). Each card has slightly more content than P4 (number + title + 1-2 line description).
**Skeleton**: Left side large title + description + top hairline / right side 3 horizontally stacked sub-cards.
**Key classes**: `.sub-card-stack` `.sub-card` (`.card-fill` grey background, sharp corners)
**Animation recipe**: `sub-stack` — main title enters first → 3 cards slide in from the right in staircase fashion (140ms delay per card)
**Example code**:
```html
<div class="grid-2-9">
  <div class="lead-col">
    <span class="t-cat">Three Forces</span>
    <h2 class="h-xl">Distilled into three facts</h2>
  </div>
  <div class="sub-card-stack">
    <article class="card-fill sub-card">
      <span class="big-num">01</span>
      <h4>Skill File</h4>
      <p>...</p>
    </article>
    <!-- 2 more -->
  </div>
</div>
```

---

### P6 · KPI Tower · Variable-Height Column KPI

**Purpose**: 4 data items using visual height to express hierarchical differences.
**Applicable content types**: **4 comparable quantitative data items** (must have real values; bar heights are determined by data). Typical examples: cost, capacity, count, efficiency metrics. **Prohibited** for data-free concept lists (use P4/P5 for those).
**Skeleton**: 4 equally-spaced columns; each column has an IKB blue rectangle of varying height at the bottom (height determined by data) + icon at top + giant number in the middle + label at bottom.
**Key classes**: `.kpi-tower-row` `.bar-tower` (min-height:6vh, max:36vh) `.tower-cap`
**Animation recipe**: `tower-grow` — labels enter first → numbers scale-pop in → towers scaleY from 0 (transform-origin:bottom)
**Example code**:
```html
<div class="kpi-tower-row">
  <div class="tower-col">
    <i data-lucide="layers"></i>
    <span class="num-mega">90K</span>
    <span class="lbl">Skills</span>
    <div class="bar-tower" style="--h:36vh"></div>
  </div>
  <!-- 3 more with different h values -->
</div>
```

---

### P7 · H-Bar Chart · Horizontal Bar Chart

**Purpose**: Multi-item ranking comparison / proportion comparison (5-10 items).
**Applicable content types**: **5-10 comparable quantitative data items** (must have real percentages / scores / values; bar widths are determined by data). Typical examples: benchmark rankings, market share, survey proportions. ⚠️ **Strictly prohibited for concept lists without quantitative data** (use P4/P5/P15 instead) — fabricated numbers will be spotted.
**Skeleton**: Top large title / middle space / lower half bar list (each row: text label + 1px blue bar 0→target width + end number).
**Key classes**: `.h-bar-chart` `.bar-row` `.bar-fill` (scaleX animation)
**Animation recipe**: `hbar-grow` — large title enters first → each row grows width 0→target in sequence (transform-origin:left) + end numbers count up
**Example code**:
```html
<div class="h-bar-chart">
  <div class="bar-row">
    <span class="bar-lbl">Anthropic Advisor</span>
    <span class="bar-fill" style="--w:84%"></span>
    <span class="bar-num">84</span>
  </div>
  <!-- N more -->
</div>
```

---

### P8 · Duo Compare · Dual-Track Comparison

**Purpose**: Before/After, A vs B, old/new comparison.
**Applicable content types**: **Binary comparison** (must be exactly 2 items). Both sides have homogeneous structure (t-cat label + large title + paragraph / list description). Typical examples: old/new workflow, traditional/AI, customer view/team view.
**Skeleton**: Left and right half-screens separated by a vertical 1px long line / each side has t-cat at top + large title + description below.
**Key classes**: `.duo-compare` `.duo-half` `.vrule` (scaleY expansion)
**Animation recipe**: `duo-mirror` — center vrule scaleY 0→1 first → left and right titles and text enter in mirror fashion
**Example code**:
```html
<div class="duo-compare">
  <div class="duo-half">
    <span class="t-cat">Before</span>
    <h2>Leave it to the model</h2>
  </div>
  <span class="vrule"></span>
  <div class="duo-half">
    <span class="t-cat">After</span>
    <h2>Leave it to the code</h2>
  </div>
</div>
```

---

### P9 · Closing Manifesto · Closing Manifesto

**Purpose**: Deck closing page.
**Applicable content types**: **Deck closing** (only one per deck). Fixed structure: left side manifesto short phrase + right side 3 takeaways (number + title + one-line description). **Cannot be used as a middle page** (that would duplicate the P1 cover).

**Default recommendation: left IKB+ASCII / right paper takeaway** ⭐
- Use `<section class="slide split">` + left half `.half.b-accent` + ASCII canvas + right half white takeaway
- Paired with P1 cover's full IKB to form an "opening full IKB ↔ closing half IKB" color bookend
- The 03rd takeaway on the right uses `var(--accent)` emphasis, threading IKB blue from the left half to the right half, completing the color stitch
- Large title in white weight 200; emphasis words use italic (background is already blue — do not use `var(--accent)` for blue highlighting)

**Key classes**: `.slide.split` `.half.b-accent` `.ascii-bg` (IIFE auto-starts)
**Animation recipe**: `split-statement` — left ink/IKB title characters rise in sequence → right white half takeaway three items follow

**Example code (IKB default variant)**:
```html
<section class="slide split" data-animate="split-statement">
  <div class="canvas-card">
    <div class="split-half">
      <!-- Left half · IKB + ASCII breathing field -->
      <div class="half b-accent" style="padding:5.6vh 3.6vw 4.4vh;justify-content:space-between;position:relative;overflow:hidden">
        <canvas class="ascii-bg" aria-hidden="true"></canvas>
        <div class="chrome-min" style="margin-bottom:0;position:relative;z-index:1">
          <div class="l">NN / NN</div>
          <div class="r">CLOSING</div>
        </div>
        <div data-anim="manifesto" style="display:flex;flex-direction:column;gap:2vh;position:relative;z-index:1">
          <div class="t-meta" style="color:rgba(255,255,255,.78);letter-spacing:.22em;margin-bottom:1.6vh">MANIFESTO</div>
          <h2 style="font-family:var(--sans),var(--sans-zh);font-size:min(8vw,14vh);line-height:.94;letter-spacing:-.025em;font-weight:200;color:#fff">[REQUIRED] Build a model.<br/>Run <span style="font-style:italic;font-weight:300">forever</span>.</h2>
          <div style="font-family:var(--sans),var(--sans-zh);font-size:max(13px,1vw);line-height:1.6;color:rgba(255,255,255,.82);font-weight:300;max-width:36ch;margin-top:1.4vh">[REQUIRED] A bilingual closing footnote.</div>
        </div>
        <div data-anim="signature" style="display:flex;justify-content:space-between;align-items:end;border-top:1px solid rgba(255,255,255,.22);padding-top:2vh;position:relative;z-index:1">
          <div class="t-meta" style="color:rgba(255,255,255,.62)">[OPTIONAL] Author · Title</div>
          <div class="t-meta" style="color:rgba(255,255,255,.62)">YY.MM.DD</div>
        </div>
      </div>
      <!-- Right half · White takeaway; 03rd item uses IKB blue emphasis for opening/closing color bookend -->
      <div class="half" style="padding:5.6vh 3.6vw 4.4vh;justify-content:space-between">
        <div class="chrome-min"><div class="l">TAKEAWAYS</div><div class="r">03 RULES</div></div>
        <div data-anim="rules">...</div>
        <div class="t-meta" style="color:var(--text-helper);text-align:right">→ End · END OF FIELD NOTE</div>
      </div>
    </div>
  </div>
</section>
```

**Classic variant (`.closing-split` ink dual half-screen)** — when the cover did not use full-screen IKB, use classic ink closing instead:
```html
<div class="closing-split">
  <div class="cl-ink">
    <p class="line-mega">Build it<br>once.</p>
    <p class="line-mega">It runs<br>forever.</p>
  </div>
  <div class="cl-paper">
    <ul class="takeaway-list">
      <li><span class="num">01</span><h4>Skill</h4><p>...</p></li>
      <!-- 2 more -->
    </ul>
  </div>
</div>
```

---

### P10 · Dot Matrix Statement · Dot Matrix Statement

**Purpose**: Second statement page / section transition / visual breathing page.
**Applicable content types**: **Slogan / metaphor / section transition** (same as P3, but with geometric dot matrix decoration). Used within a deck to **avoid two consecutive P3 pages**; typically serves as a visual palate cleanser before a "concept definition" page.
**Skeleton**: Center 7vw giant three-line manifesto / top-right 36vw dot matrix + bottom-left stroke circle matrix.
**Key classes**: `.dot-mat` (SVG mask solid dots) `.ring-mat` (stroke circles) `.cross-mat` (× grid)
**Animation recipe**: `matrix-statement` — text enters line by line → dot matrix mask-position pushes from left to right
**Example code**:
```html
<div class="canvas-card">
  <span class="ring-mat" style="left:5vw;bottom:5vh;width:18vw;height:18vw"></span>
  <h1 class="h-statement">Build a thin harness.<br>Write fat skills.<br>Codify everything.</h1>
  <span class="dot-mat" style="right:0;top:0;width:36vw;height:36vw"></span>
</div>
```

---

### P11 · Horizontal Timeline · Horizontal Timeline

**Purpose**: Multi-step process (4-7 steps), time progression.
**Applicable content types**: **4-7 step linear process** (each step has only a name, no expanded data/descriptions needed). If each step needs expansion, use P5; if there is quantified data, use P2. **Prohibited** for cyclic structures (use P14 instead).
**Skeleton**: Top large title / middle section with a 1px hairline horizontal line + N evenly-spaced nodes (8×8 sharp-cornered square + mono number above + step name below).
**Key classes**: `.timeline-h` `.tl-h-node` `.tl-h-axis`
**Animation recipe**: `timeline-walk` — nodes light up along the axis left→right in sequence (220ms per node)
**Alignment note**: Horizontal timeline labels' CSS relies on `translateX(-50%)` for centering. If vertical displacement is added in the animation, the complete `transform: translate(-50%, y)` sequence must be written — not just `y` — otherwise labels will drift off the dot after animation ends.
**Example code**:
```html
<div class="timeline-h">
  <span class="tl-h-axis"></span>
  <div class="tl-h-node">
    <span class="num">01</span>
    <span class="dot"></span>
    <span class="lbl">Investigate</span>
  </div>
  <!-- 4-6 more -->
</div>
```

---

### P12 · Manifesto + Ink Banner · Manifesto + Full-Width Ink Bar

**Purpose**: Stage conclusion, section back cover, slogan + strong visual closure.
**Applicable content types**: **Section closure / stage manifesto** (used mid-deck, not at the end — P9 is for deck termination). Carries "assertion + brief explanation + ink full-width manifesto" three-part structure, no data.
**Skeleton**: Upper half-screen with left t-cat + large 4-line manifesto + right short paragraph / lower half-screen ink full-width bar (no left/right/bottom margin) + inverted white short phrase + lucide icon matrix.
**Key classes**: `.manifesto-top` `.ink-banner-full` (`margin:0 -5vw -4.4vh` cancels parent padding)
**Animation recipe**: `manifesto` — large text three sections rise with staggered timing → bottom ink bar scaleX 0→1 expands horizontally → inverted white text fades in
**Note**: The Skill File small text **top-aligns to the right-side large text baseline** (`align-items:flex-start;padding-top:1.2vw`)

---

### P13 · Three Forces Cards · Three Forces Tabloid Cards

**Purpose**: 3 equally-weighted concepts (each = giant number + title + dual-column description).
**Applicable content types**: **3 equally-weighted concepts in depth** (count = 3, carries more text than P5). Each card is content-rich (giant number + title + dual-column paragraph description). 01/02/03 are numbered anchors, not real data. Typical examples: three rebuttals, three forces, three propositions.
**Skeleton**: Left 5/16 ink hero block (t-cat + 4-line title + dot matrix decoration) / right 11/16 three horizontally stacked cards.
**Key classes**: `.three-forces` `.hero-ink-col` `.force-card` (`.card-fill`) `.force-num` (9.2vw IKB blue)
**Animation recipe**: `three-forces` — left hero slides in horizontally → right 3 cards slide in from right in staircase fashion → giant blue numbers pop individually
**Note**: **All 3 cards must have uniform styling** (all use `.card-fill` grey background; do not mix border/blue background); to highlight one card, switch to `.card-accent` — **mixing blue background + border is prohibited**.

---

### P14 · Loop Diagram · Closed-Loop Flow Diagram

**Purpose**: Self-learning loop, automation process (3-5 step cycle).
**Applicable content types**: **Cyclic / closed-loop process** (endpoint returns to start, 3-5 steps). Examples: self-learning cycle, CI/CD, feedback loop, agent loop. **Linear processes are prohibited** (use P11 instead).
**Skeleton**: Left 4 numbered steps (top-aligned) / right SVG concentric rings / center giant text LOOP / nodes use uniform grey-background sharp-cornered squares (not alternating-color dots).
**Key classes**: `.loop-diagram` `.loop-steps` `.loop-svg`
**Animation recipe**: `loop-form` — left steps in vertical sequence → right SVG ring stroke-dashoffset draws → nodes light up in sequence
**Note**: Left and right **are center-aligned overall** (top-aligned + equal height)

---

### P15 · Image Matrix + Hero Stat · Matrix + Large Number Footer

**Purpose**: Display large quantities of similar items (8-12 skills / team members / case icons) with a summary data point at the bottom.
**Applicable content types**: **8-12 items of the same type + one summary metric**. Each item carries only a short title (no expansion); the bottom giant number is a "summary value" (total count / total traffic / total users). **If too few items, use P4 (6 items)**.
**Skeleton**: Top title (9vh spacing) / middle 4×3 matrix cards (each card 12vh fixed height) / bottom giant number + label (margin-top:auto pushes to bottom).
**Key classes**: `.matrix-fill` (grid-template-columns:repeat(4,1fr)) `.matrix-cell` (`.card-fill` grey background, **borders prohibited**) `.hero-stat-bottom`
**Animation recipe**: `matrix-fill` — 12 cells appear in random checkerboard pattern (random delay per cell) → bottom giant number counts up
**Note**: Card height is capped (prevents large numbers from overflowing); **all cards use `.card-fill` grey background**; only switch to `.card-accent` for a single highlighted item

---

### P16 · Multi-card Brief · Micro-Card Tabloid

**Purpose**: 6 small cards side by side (news briefs, tip collections, feature overview).
**Applicable content types**: **6 lightweight short briefs / tips / footnotes** (count = 6; each has short main text + small footnote text). Lighter content than P4, suitable for brief news items. **Only one accent blue highlight card allowed** (single focal point rule).
**Skeleton**: Top large title (9vh spacing) / below 3×2 micro-cards (each card: top-left main text + bottom-right small text + center empty space).
**Key classes**: `.brief-grid` `.brief-card` (`.card-fill` grey background) `.brief-card.is-accent` (single blue highlight)
**Animation recipe**: `field-notes` — 6 cards light up in Z-order (L→R, T→B, 90ms stagger)
**Note**: Card layout is **top-left main text + bottom-right small text** with center empty (prevents scattered content); **only one accent blue card allowed**

---

### P17 · System Diagram · Concentric Circle System Diagram

**Purpose**: Layered architecture (core→middle→outer), ecosystem map.
**Applicable content types**: **Strictly three-layer nested relationships** (core inner layer / middle layer / outer layer). Typical examples: tech stack hierarchy, ecosystem layering, influence radiation. **Prohibited for non-three-layer structures** (use P4 for flat, P5 for unclear hierarchy).
**Skeleton**: Left half-screen title + three-section description / right half-screen SVG three-layer concentric circles + label leader lines.
**Key classes**: `.system-diagram` `.sys-svg` `.sys-label`
**Animation recipe**: `system-diagram` — concentric circles scale in from outer to inner → labels appear in sequence

---

### P18 · Why Now · Three-Column Progression + Giant Numbers

**Purpose**: Three arguments + supporting data each (why now).
**Applicable content types**: **3 arguments + each argument has one quantified data point**. Each argument structure = t-cat label + one-line title + paragraph + one bottom giant number (can be percentage/year/multiplier). The last column uses IKB blue emphasis to indicate the "key supporting argument."
**Skeleton**: Top large title / middle 3 columns (each: t-cat + title + description) / column bottoms each have an 8.4vw giant number (01 / 02 / 03; last column in IKB blue emphasis).
**Key classes**: `.why-now-grid` `.why-col` `.why-num-bottom` (8.4vw, weight 200)
**Animation recipe**: `why-now` — three columns progress vertically → bottom giant numbers count up
**Note**: Giant number sizes are uniform; only use color (IKB blue) to highlight the last column — **do not** use bold

---

### P19 · Four Cards · Four-Column Equal Cards

**Purpose**: 4 features/characteristics side by side (equal weight).
**Applicable content types**: **4 equally-weighted features / modules** (count = 4, completely homogeneous structure). Each = t-meta number + large title + one paragraph description. No data dimension, purely qualitative. More evenly distributed than P5 (three steps), more text-focused than P6 (data-driven heights).
**Skeleton**: Top 80px IKB blue short hairline top line + large two-line title / below 4 equally-spaced columns (each: t-meta top "— 01 / SLASH" + large title + paragraph description).
**Key classes**: `.four-cards` `.fc-col`
**Animation recipe**: `four-cards` — top blue line width 0→100% → 4 columns push up from bottom (110ms stagger per column)
**Note**: **Do not** use 9px circular decorative dots (violates the sharp-corner design language); use `.t-meta` text instead

---

### P20 · Stacked KPI Ledger · Vertical Ledger KPI

**Purpose**: 4-6 rows of core data in ledger-style display (each row = number + label + icon).
**Applicable content types**: **4-6 core data ledger items** (each row must have real values + label + icon). Vertical ledger format suitable for financial data, KPI dashboards, key metric lists. Holds more data than P6 KPI Tower but with weaker visualization (no bar height comparison).
**Skeleton**: Each row separated by a hairline / left giant number (height-capped at `min(13vw,16vh)` to prevent overflow) / center label / right lucide icon.
**Key classes**: `.stacked-ledger` `.ledger-row` (border-bottom:1px solid var(--border-subtle)) `.ledger-num`
**Animation recipe**: `stacked-ledger` — each row's number rises → label slides left → icon pops (180ms stagger per row)
**Note**: **Font size must be height-capped** (`font-size:min(13vw, 16vh)`); otherwise bottom rows will be pushed off screen on a standard 16:9 display

---

### P21 · Tech Spec Sheet · Specification Sheet

**Purpose**: Product specifications, benchmark data, performance baseline display (multiple KPIs + visual vertical bar decorations).
**Applicable content types**: **Product specs / benchmark / performance baseline** (must have real multi-dimensional data; 3 KPIs + 9 vertical bars = 12+ data points). Typical examples: model scores, API performance, stress test results. This is the highest data-density layout in the deck.
**Skeleton**: Left 4-line large title / center 3 KPIs (top hairline + number + unit) / bottom-right 9 vertical bars of varying heights / bottom giant number + Yearly goal + three tags + bottom-right MP-XX + page number.
**Key classes**: `.tech-spec` `.spec-title-col` `.spec-kpi-grid` `.spec-bars` (`.bar-vert`, scaleY spring up, transform-origin:bottom)
**Animation recipe**: `tech-spec` — hero area fades in → title enters → KPI top lines draw one by one → bottom giant number pops → vertical bars scaleY spring up from bottom (50ms stagger)
**Note**: Bottom-right bars matrix must be **bottom-aligned** and **not exceed the right margin**

---

### P22 · Image Hero · Image-Text Hero Cover

**Purpose**: Case showcase, product image + data landing, section cover with image.
**Applicable content types**: **Case showcase / product launch / section cover with image** (must have real image resources + 3 core data points). Typical examples: product screenshot + key metrics, case image + ROI, user feedback image + repurchase rate. **Prohibited when no real image source exists** (placeholder grey images destroy the visual).
**Skeleton**: Upper 60% full-width image + top-left white title block overlay (top:11vh, leaving sufficient buffer) / lower 40% long description + three-column KPI ($ / 127× / 100%).
**Key classes**: `.image-hero` `.hero-img-wrap` (60vh) `.hero-overlay-block` `.hero-stats`
**Animation recipe**: `image-hero` — image slowly zooms out (scale 1.05→1) → white block scaleX 0→1 pushes open → three KPI top lines draw in sequence
**Notes**:
- Images should preferably use `images/{page-number}-{semantic}.png` local files (GPT Image 2 or user-provided assets); do not default to external unsplash links
- Content below the image should not sit flush against the image bottom edge; use `.image-hero-body` to uniformly add top buffer to the lower half
- Three-column KPI large font must be height-capped (`min(4.6vw, 7.6vh)`); small text uses `margin-top:auto` to anchor to column bottom, preventing overflow into nav dots
- Column heights must be uniform (grid should not use `align-items:start`; let columns stretch to equal height)

**Example code**:
```html
<section class="slide light" data-animate="image-hero">
  <div class="canvas-card" style="padding:0;display:flex;flex-direction:column;overflow:hidden">
    <div data-anim="img" style="position:relative;flex:0 0 60%;overflow:hidden;background:var(--grey-1)">
      <img src="images/22-product-scene.png" alt="[REQUIRED] Image description" loading="eager"
           style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 30%">
      <div class="chrome-min" style="position:absolute;top:0;left:0;right:0;color:rgba(255,255,255,.9);padding:5.6vh 5vw 0">
        <div class="l">Section · Case / Visual Evidence</div>
        <div class="r">22 / NN</div>
      </div>
      <div data-anim="title-block" style="position:absolute;left:5vw;top:11vh;background:var(--paper);padding:3.2vh 3.2vw;max-width:40vw">
        <div style="font-family:var(--sans),var(--sans-zh);font-weight:200;font-size:min(5.2vw,9vh);line-height:1;letter-spacing:-.035em;color:var(--text-primary)">
          [REQUIRED] Image<br>Evidence
        </div>
      </div>
    </div>
    <div data-anim="kpi" class="image-hero-body">
      <div style="max-width:48ch;font-family:var(--sans),var(--sans-zh);font-size:max(15px,1.3vw);line-height:1.55;font-weight:300;color:var(--text-primary);letter-spacing:-.005em">
        [REQUIRED] 1-2 lines explaining why this image matters; do not repeat the title.
      </div>
      <div class="image-hero-stats" style="gap:4vw">
        <div style="display:flex;flex-direction:column;gap:.6vh"><div style="height:1px;background:var(--ink)"></div><div class="t-meta">Metric 01</div><div style="font-family:var(--sans);font-weight:200;font-size:min(4.6vw,7.6vh);line-height:.95;letter-spacing:-.04em">12×</div><div style="height:1px;background:var(--border-subtle);margin-top:auto"></div><p class="body-sm">[REQUIRED] Metric explanation</p></div>
        <div style="display:flex;flex-direction:column;gap:.6vh"><div style="height:1px;background:var(--ink)"></div><div class="t-meta">Metric 02</div><div style="font-family:var(--sans);font-weight:200;font-size:min(4.6vw,7.6vh);line-height:.95;letter-spacing:-.04em">3.4h</div><div style="height:1px;background:var(--border-subtle);margin-top:auto"></div><p class="body-sm">[REQUIRED] Metric explanation</p></div>
        <div style="display:flex;flex-direction:column;gap:.6vh"><div style="height:1px;background:var(--ink)"></div><div class="t-meta">Metric 03</div><div style="font-family:var(--sans);font-weight:200;font-size:min(4.6vw,7.6vh);line-height:.95;letter-spacing:-.04em;color:var(--accent)">100%</div><div style="height:1px;background:var(--border-subtle);margin-top:auto"></div><p class="body-sm">[REQUIRED] Metric explanation</p></div>
      </div>
    </div>
  </div>
</section>
```

---

## Historical Experiment Zone (disabled by default)

The P23/P24 below are experimental layouts added early on to explore image-text composition. They do not belong to the original 22 pages and should not be used for production generation by default. Unless the user explicitly says "I want to experiment with new image-text layouts," use S22 or S15/S16 image slots instead.

### P23 · Swiss Image Split · Left-Text Right-Image / Right-Text Left-Image (experimental, disabled by default)

**Purpose**: Pairing a documentary photo, infographic, UI scenario image, or system relationship diagram with a thesis.
**Applicable content types**: **One core argument + one core image**. Suitable for "left large title + right image evidence" or "left image right description." If the image is the full-page hero with KPIs, use P22; if there are multiple images, use P24.
**Skeleton**: `.canvas-card` with head stacked vertically / body `.swiss-img-split` two columns (5:7 or reverse 7:5) / `.swiss-img-caption` below image.
**Key classes**: `.swiss-img-split` `.swiss-img-copy` `.frame-img.r-16x10.fit-contain|cover` `.swiss-img-caption`
**Animation recipe**: `grid-reveal` — head enters first; image and text blocks appear with staggered timing
**Notes**:
- Images typically align with the body text first line, not flush with the large title top; add `padding-top:1vh` to `3vh` on the image column
- To bottom-align the left content block with the right image, use `.swiss-img-split.align-image-bottom`; do not push with extra empty lines
- `.align-image-bottom` has a built-in bottom nav safe zone; do not additionally push the image or caption toward the page bottom
- Avoid meaningless divider lines in the left content block; do not insert extra `.rule` unless section-level separation is needed
- Infographics/UI images must use `.fit-contain`; documentary photos default to cover
- With a wide right image, keep the title to 3 lines max; body text to 2-3 short paragraphs or 3 bullets

```html
<section class="slide light" data-animate="grid-reveal">
  <div class="canvas-card">
    <div class="chrome-min">
      <div class="l">Section · Visual Argument</div>
      <div class="r">23 / NN</div>
    </div>
    <div style="flex:1;padding:0;display:grid;grid-template-rows:auto 1fr;gap:5vh">
      <div data-anim="head" style="display:flex;flex-direction:column;gap:1.4vh">
        <div class="t-meta">Evidence · GPT Image 2</div>
        <h2 style="font-family:var(--sans),var(--sans-zh);font-weight:200;font-size:min(7vw,12vh);line-height:.96;letter-spacing:-.035em">[REQUIRED] One core thesis statement</h2>
      </div>
      <div class="swiss-img-split align-image-bottom" data-anim="up">
        <div class="swiss-img-copy">
          <div class="t-cat" style="color:var(--accent)">Why it matters</div>
          <p class="lead" style="font-weight:300;max-width:36ch">[REQUIRED] 2-3 lines explaining the relationship between the image and the thesis.</p>
          <div class="body" style="font-weight:300;color:var(--text-secondary)">[REQUIRED] Can include 2-3 short bullets or a paragraph; maintain left alignment and sufficient white space.</div>
        </div>
        <figure class="tile">
          <div class="frame-img r-16x10 fit-contain">
            <img src="images/23-visual-evidence.png" alt="[REQUIRED] Image description">
          </div>
          <figcaption class="swiss-img-caption"><strong>[REQUIRED] Image title</strong><span>16:10 · fit-contain</span></figcaption>
        </figure>
      </div>
    </div>
  </div>
</section>
```

---

### P24 · Swiss Evidence Grid · Multi-Image Evidence Wall (experimental, disabled by default)

**Purpose**: Three images/screenshots/charts of the same type side by side, presenting an evidence chain or multi-case comparison.
**Applicable content types**: **2-3 images of the same type**. Suitable for UI screenshot redesigns, three-stage flowcharts, three case documentary photos, three data mini-charts. Mixing different types destroys the Swiss-style order.
**Skeleton**: Head stacked vertically / `.swiss-img-grid` three columns / each tile uses the same `.h-22` or `.h-26`.
**Key classes**: `.swiss-img-grid` `.frame-img.h-22|h-26` `.fit-contain` `.swiss-img-caption`
**Animation recipe**: `grid-reveal`
**Notes**:
- Images in the same group must have identical ratio, height, and margin density; do not mix one 16:9, one 4:3, and one long strip screenshot
- There must be clear buffer between the title area and image area; the template's `.swiss-img-grid` includes default top spacing — only add `.tight` when the outer grid already provides sufficient gap
- UI/infographic images use uniform `.fit-contain`; photos use uniform cover
- If the user's original screenshots have mixed ratios, first use GPT Image 2 to regenerate "screenshot redesigns" in a uniform ratio

```html
<section class="slide light" data-animate="grid-reveal">
  <div class="canvas-card">
    <div class="chrome-min">
      <div class="l">Section · Evidence Grid</div>
      <div class="r">24 / NN</div>
    </div>
    <div style="flex:1;padding:0;display:grid;grid-template-rows:auto 1fr;gap:6vh">
      <div data-anim="head" style="display:flex;flex-direction:column;gap:1.4vh">
        <div class="t-meta">Three visual proofs</div>
        <h2 style="font-family:var(--sans),var(--sans-zh);font-weight:200;font-size:min(6.6vw,11.6vh);line-height:.96;letter-spacing:-.035em">[REQUIRED] Three pieces of evidence, one conclusion</h2>
      </div>
      <div class="swiss-img-grid" data-anim="up">
        <figure class="tile"><div class="frame-img h-26 fit-contain"><img src="images/24-proof-a.png" alt="[REQUIRED]"></div><figcaption class="swiss-img-caption"><strong>01</strong><span>[REQUIRED] Evidence A</span></figcaption></figure>
        <figure class="tile"><div class="frame-img h-26 fit-contain"><img src="images/24-proof-b.png" alt="[REQUIRED]"></div><figcaption class="swiss-img-caption"><strong>02</strong><span>[REQUIRED] Evidence B</span></figcaption></figure>
        <figure class="tile"><div class="frame-img h-26 fit-contain swiss-lined"><img src="images/24-proof-c.png" alt="[REQUIRED]"></div><figcaption class="swiss-img-caption"><strong>03</strong><span>[REQUIRED] Key evidence</span></figcaption></figure>
      </div>
    </div>
  </div>
</section>
```

---

## Layout Selection Index (decision table for LLMs)

| Content intent | Recommended layout |
|---|---|
| Deck opening cover | P1 Cover |
| Evolution comparison / timeline (vertical) | P2 Vertical Timeline |
| One-liner slogan / section opener | P3 Statement / P10 Dot Matrix |
| 6 concept definitions | P4 Six Cells |
| Three-step flow (light) | P5 Three Sub-cards |
| 4-item data visual height comparison | P6 KPI Tower |
| 5-10 item ranking comparison | P7 H-Bar Chart |
| Before/After / dual-track comparison | P8 Duo Compare |
| Entire deck closing | P9 Closing Manifesto |
| Multi-step flow (horizontal, 4-7 steps) | P11 Horizontal Timeline |
| Stage conclusion + ink full-width bar | P12 Manifesto + Banner |
| 3 equally-weighted concepts in depth | P13 Three Forces Cards |
| Closed-loop process / self-learning cycle | P14 Loop Diagram |
| 8-12 item matrix + summary data | P15 Image Matrix |
| 6-item news brief cards | P16 Multi-card Brief |
| Layered architecture / concentric circle system | P17 System Diagram |
| Three arguments + data support | P18 Why Now |
| 4 equally-weighted features | P19 Four Cards |
| 4-6 row ledger-style KPI | P20 Stacked Ledger |
| Product specs / benchmark | P21 Tech Spec |
| Case image + data landing | P22 Image Hero |
| Location / route / residence relationships | S08 + Swiss Map Component |
| Single image explaining a thesis / image-text layout | P23 Swiss Image Split |
| 2-3 image evidence chain | P24 Swiss Evidence Grid |

---

## Layout Selection P0 Principle: Content Data Type Must Match the Layout

> This is the **most common pitfall** when writing a deck. A layout's content "shape" is fixed — you must look at the content first, then choose the layout. **Never choose the layout first and then force-fit content into it.**

| Content type | Must use | Strictly prohibited |
|---|---|---|
| Has real quantitative data (percentage/values) | P6 KPI Tower / P7 H-Bar / P20 Ledger / P21 Tech Spec | P3 / P4 / P10 / P13 (no-data layouts) |
| No data, purely qualitative assertion | P3 / P10 Statement / P12 / P13 / P19 | ⚠️ **P7 H-Bar / P6 KPI Tower** (fabricated data will be spotted) |
| 4 equally-weighted items | P19 Four Cards / P6 (if data exists) | Cannot pad to 6 to use P4 |
| 6 equally-weighted items | P4 Six Cells / P16 Brief | Cannot trim to 4 to use P19 |
| 3 equally-weighted items | P5 Sub-cards / P13 Three Forces | |
| Before/After | P8 Duo Compare (must be exactly 2 items) | |
| Location/route/city relationships | S08 + Swiss Map Component | Generic S04/S16 card listings |
| Closed-loop structure | P14 Loop Diagram | P11 Horizontal Timeline (linear ≠ closed-loop) |
| Three-layer nesting | P17 System Diagram | |
| Time evolution (with data) | P2 Vertical Timeline | |
| Multi-step process (no data) | P11 Horizontal Timeline | |
| 8-12 items of same type | P15 Image Matrix | |
| Deck closing | P9 Closing (only once per deck) | |
| 1 core image + explanation | P23 Swiss Image Split | P22 (unless the image is the hero with KPIs) |
| 2-3 images of same type | P24 Evidence Grid | P4/P16 (text cards, not image evidence) |

**Pitfall example**: Using P7 H-Bar Chart to display "Smart Completion / Real-Time Collaboration / Autonomous Agent" — **concept lists without comparable percentages** — with fabricated numbers like 96/88/78 → **data is not credible, layout is misused**. This content should use P2 (if there is a time dimension) or P3 Statement (if it is an assertion).

---

## Common Mistakes (P0 checklist)

1. ❌ Adding `border-radius` to cards → ✅ Must be sharp corners
2. ❌ Adding a border on top of `.card-accent` → ✅ Card fill types are mutually exclusive
3. ❌ Drawing SVG icons yourself → ✅ Use the `lucide` icon library with angular style
4. ❌ Aligning timeline dots to the dashed line with grid `justify-self` → ✅ Axis column fixed at 12px + absolute-positioned dots
5. ❌ Uncapped large font size (`13vw`) → ✅ Always use `min(Xvw, Yvh)` dual constraint
6. ❌ ESC index page thumbnails cannot show animated content → ✅ Add visibility override CSS to cloned slides
7. ❌ Using the same fade-up recipe on all pages → ✅ One semantic recipe per page, coupled to the graphic
8. ❌ Title-to-card spacing < 5vh → ✅ Section-level titles need at least 9vh
9. ❌ 9px circular decorative dots → ✅ 8×8 sharp-cornered small squares / mono `t-meta` text
10. ❌ Decorative elements extending beyond page margins → ✅ Strictly within the grid, not edge-hugging
