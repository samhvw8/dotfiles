# Page Layout Library (Layouts)

This document contains 10 commonly used page layout skeletons. Each is a complete, copy-paste-ready `<section class="slide ...">...</section>` code block — just replace the copy/images and use.

---

## ⚠️ Pre-flight (Read Before Generating)

### A. Class Names Must Come from template.html

All classes used in layouts.md (`h-hero` / `h-xl` / `h-sub` / `h-md` / `lead` / `meta-row` / `stat-card` / `stat-label` / `stat-nb` / `stat-unit` / `stat-note` / `pipeline-section` / `pipeline-label` / `pipeline` / `step` / `step-nb` / `step-title` / `step-desc` / `grid-2-7-5` / `grid-2-6-6` / `grid-2-8-4` / `grid-3-3` / `grid-6` / `grid-3` / `grid-4` / `frame` / `frame-img` / `img-cap` / `callout` / `callout-src` / `kicker`) are predefined in the `<style>` block of `assets/template.html`.

**Do not invent new class names**. If customization is needed, use inline `style="..."`. If unsure whether a class exists before generating, grep template.html to confirm.

### B. Image Aspect Ratio Guidelines (Very Important)

**Always use standard ratios** — never use raw image ratios like `aspect-ratio: 2592/1798`:

| Scenario | Recommended Ratio | Syntax |
|------|---------|------|
| Left-text right-image main image | 16:10 or 4:3 | `.frame-img.r-16x10` or `.frame-img.r-4x3` |
| Image grid (multi-image comparison) | Uniform | `.frame-img.h-22` / `.frame-img.h-26`, no aspect-ratio |
| Small panel groups | Uniform | `.frame-img.h-16` / `.frame-img.h-18`, same height within group |
| Left small image + right text | 1:1 or 3:2 | `.frame-img.r-1x1` or `.frame-img.r-3x2` |
| Full-screen hero visual | 16:9 | `.frame-img.r-16x9` |
| Infographic / screenshot redesign | 16:9 or 16:10 | `.frame-img.r-16x9.fit-contain` or `.frame-img.r-16x10.fit-contain` |
| Inline illustration in mixed layout | 3:2 or 3:4 | `.frame-img.r-3x2` or `.frame-img.r-3x4` |

Images must be wrapped in `<figure class="frame-img">`. By default, photos use `object-fit:cover + object-position:top center`, cropping only from the bottom — not the top, left, or right. Infographics and screenshot redesigns must add `.fit-contain` to prevent text or annotations from being cropped.

### B2. Vertical Alignment of Images and Content

Images should align with the body content area — do not default to aligning with the top of the main heading. Especially for left-text right-image and mixed text-image pages:

- If the left column contains kicker + heading + body text + callout, the right-column image usually starts at body text height — add `style="margin-top:7vh"` to `9vh` on the image
- If the image is an infographic or UI scenario, prefer aligning with the first line of body text or description — do not align flush with the oversized heading
- If a screenshot/UI scenario becomes an overly long strip on a landscape page, do not force full width; use an ultra-wide landscape asset instead, or split into 2-3 partial panels arranged side by side
- Multi-image panels must use the same height class — do not mix `h-16` / `h-22` or hand-write different `height` values

### B3. Heading and Body Text Spacing

- Two-section pages (top heading + long body text/quote/chart below) must have clear spacing between heading and content — recommend `margin-top:6vh` to `8vh`
- Centered heading pages must center the main heading horizontally — use `.center` or `text-align:center; margin-inline:auto`
- Complex content pages (main heading + subheading + detailed content) should layer the heading apart from the content below — the lower content should use a left-right justified grid or rowline, not everything stacked on a single center axis

### C. Image Positioning Guidelines (Avoid Images Piling Up at the Page Bottom / Being Obscured by Browser Toolbars)

**Wrong approach** (already encountered — do not repeat):
- Using `align-self:end` in non-grid containers: `align-self` has no effect outside flex/grid — the image will drop to the end of the document flow and pile up at the bottom
- Using `position:absolute + bottom:0` to "pin" the image to the bottom: it will be obscured by the bottom `.foot` and `#nav` dots
- Setting only `height:N vh` on a single image without `max-height`: on low-res screens it will overflow the viewport

**Correct approach**:
- Mixed text-image layouts **must use `.frame.grid-2-7-5`** (or `.grid-2-6-6` / `.grid-2-8-4`) grid structure
- Grid containers default to `align-items:start` (already set in template) — images naturally snap to the top of the cell
- If the image needs to "bottom-align with the left-column callout": **use flex column + `justify-content:space-between` on the left column** (letting the callout stick to the left-column bottom), **keep the right-column figure at `align-items:start`** — do not add `align-self:end`
- All grid parent containers should add inline `style="padding-top:6vh"` to give the heading area breathing room

### D. Theme Colors and Theme Rhythm

- Choose a theme color set from the 5 presets in `references/themes.md` — custom hex values are not allowed
- Theme rhythm (whether each page uses light / dark / hero light / hero dark) has hard rules in the "Theme Rhythm Planning" section below — must read before generating
- Both decisions must be made before choosing layouts to avoid rework

### E. Animation System (Enabled by Default · Powered by Motion)

**Core mechanism**: The module script at the bottom of template.html triggers entrance animations on page change. All elements with `data-anim` are initially invisible; when the current page is reached, Motion fades them in one by one.

**Animation strategy**: Add `data-animate="<recipe>"` on the `<section>` to choose the animation style; add `data-anim` to each element that needs an entrance animation (optionally with a value like `left` / `right` / `line` / `step`).

| recipe | Usage | Suitable Layouts |
|---|---|---|
| Default (cascade) | Add nothing — automatic cascading fade-in | Most body pages (Layout 3 / 4 / 5 / 10) |
| `hero` | Automatically enabled on `.hero` pages, slower and more ceremonial pace | Layout 1 / 2 / 7 (all hero pages) |
| `quote` | Reveals sentence by sentence, slow pace (550ms stagger) | Layout 8 big quote |
| `directional` | Left enters → split → right enters, for comparisons | Layout 9 Before/After |
| `pipeline` | Manual progression — steps light up one by one on →/Space | Layout 6 pipeline |

**Graceful degradation**: If motion.min.js fails to load from both local and CDN, the script forces all `data-anim` elements to `opacity:1` — content is always readable.

**View Transitions API** (Baseline 2025): For programmatic slide navigation (keyboard/button), wrap `scrollIntoView` in `document.startViewTransition()` for smooth animated transitions. Feature-detect with `if (document.startViewTransition)`. Native scroll-snap transitions do not need this.

**Pages without animation**: To skip animation entirely on a page, simply do not add any `data-anim` — Motion only affects marked elements.

---

## 0. Base Structure (Same for All Slides)

```html
<section class="slide [light|dark|hero light|hero dark]">
  <div class="chrome">
    <div>Context Label · Sub-label</div>
    <div>ACT · Page Number / Total Pages</div>
  </div>
  <!-- Main content -->
  <div class="foot">
    <div>Page Description · Page Description</div>
    <div>— · —</div>
  </div>
</section>
```

- Non-hero pages should add `light` or `dark` theme; hero pages add `hero light` or `hero dark` (participates in WebGL theme interpolation)
- `chrome` and `foot` are optional but recommended corner metadata
- **Hero pages are for chapter covers / openers / closers / transitions**; non-hero pages are for body content
- The slide container uses `scroll-snap-stop: always` to prevent fast-swipe from skipping slides, and `overscroll-behavior-x: contain` to prevent accidental page navigation.

### ⚠️ chrome and kicker Should Not Say the Same Thing

This is the most common content duplication issue. They operate on completely different semantic dimensions:

| Position | Role | Content Nature | Example |
|------|------|---------|------|
| `.chrome` top-left | **Magazine header / navigation metadata** | Stable "column name" or "chapter category" — can be the same across multiple pages | "Act II · Workflow" / "Data · Result" / "lukew.com · 2026.04" |
| `.chrome` top-right | **Page number + act number** | Fixed format | "Act II · 15 / 25" |
| `.kicker` | **A unique lead-in line for this page** | The "small prefix" above the main heading — like the tagline above a magazine headline; should be different on every page | "BUT" / "One person, what they built." / "Phase 01 · Design Phase" |

**Anti-example** (already encountered): chrome says "Design First · Design First", kicker says "Phase 01 · Design Phase" — the meaning overlaps, and the reader immediately senses it was AI-generated.

**Correct approach**: chrome is a **column label** (stable, reusable across pages); kicker is **this page's hook** (short, dramatic). They complement each other — they should not be translations of each other.

### ⚠️ Theme Rhythm Planning (Must Read · Must Do Before Generating)

**Core mechanism**: Every page `<section>` must carry one of `light` / `dark` / `hero light` / `hero dark`. JS infers the theme from the class and decides whether to add `light-bg` to body, which toggles which of the two WebGL canvases (dark/light) is in front. Missing theme or custom names = fallback error.

#### Default Themes by Layout

| Layout | Default Theme | Reason |
|---|---|---|
| 1. Opening Cover | `hero dark` | Ceremonial opening, dark background for strong impact |
| 2. Act Divider | `hero dark` and `hero light` **must alternate** | Breathing rhythm |
| 3. Big Numbers (Data) | `light` | Numbers need paper-white background; can occasionally insert `dark` in multi-act sequences |
| 4. Left-Text Right-Image | **`light` / `dark` alternating** | Main body rhythm driver |
| 5. Image Grid | `light` | Screenshots need bright background |
| 6. Pipeline | `light` | Flowcharts need clarity |
| 7. Question Page | `hero dark` | Strong visual impact by default |
| 8. Big Quote | **`dark` preferred**, occasionally `light` | Gold-sentence ceremony relies on dark background |
| 9. Comparison Page | `light` | Two columns need clarity |
| 10. Mixed Text-Image | **`light` / `dark` alternating** | Rhythm |

#### Rhythm Hard Rules (Self-check by grep After Generating)

- ❌ **Forbidden**: more than 3 consecutive pages with the same theme (including light stacking and dark stacking)
- ❌ **Forbidden**: decks of 8+ pages without at least 1 `hero dark` + 1 `hero light`
- ❌ **Forbidden**: entire deck with only `light` body pages and no `dark` body pages — will feel flat and lifeless
- ✅ **Recommended**: insert 1 hero page every 3-4 pages (cover / act divider / question / big quote)

#### 8-Page Rhythm Template (Ready to Use)

| Page | Theme | Layout | Notes |
|---|---|---|---|
| 1 | `hero dark` | Cover | Opening |
| 2 | `light` | Big Numbers | Data hook |
| 3 | `dark` | Left-Text Right-Image | Contrast / story |
| 4 | `light` | Pipeline | Process |
| 5 | `hero light` | Act Divider | Breathing space |
| 6 | `dark` | Left-Text Right-Image or Big Quote | |
| 7 | `hero dark` | Question Page | Suspense closer |
| 8 | `light` | Big Quote / Ending | Wrap-up |

**Plan this table first, then start writing slides**. Skipping planning and jumping straight to skeleton pasting = everything ends up `light`.

---

## Layout 1: Opening Cover (Hero Cover)

```html
<section class="slide hero dark">
  <div class="chrome">
    <div>A Talk · 2026.04.22</div>
    <div>Vol.01</div>
  </div>
  <div class="frame" style="display:grid; gap:4vh; align-content:center; min-height:80vh">
    <div class="kicker" data-anim>Private Salon · Li Jigang</div>
    <h1 class="h-hero" data-anim>One-Person Company</h1>
    <h2 class="h-sub" data-anim>The Organization Folded by AI</h2>
    <p class="lead" style="max-width:60vw" data-anim>
      An AI creator — wrote 110K lines of code in 64 days, publishing continuously across 9 platforms, with barely any disruption to daily life.
    </p>
    <div class="meta-row" data-anim>
      <span>Guizang</span><span>·</span><span>Independent Creator / CodePilot Author</span>
    </div>
  </div>
  <div class="foot">
    <div>A talk on AI · Organizations · Individuals</div>
    <div>— 2026 —</div>
  </div>
</section>
```

**Key points**:
- Use `hero dark` to let the WebGL background show through most of the area
- `h-hero` is the largest font size (10vw), used here as the title visual
- Use `min-height:80vh + align-content:center` to vertically center all content
- No page number needed in `.chrome` — the cover page stands on its own

---

## Layout 2: Act Divider

```html
<section class="slide hero light">
  <div class="chrome">
    <div>Act One · Hard Data</div>
    <div>Act I · 01 / 25</div>
  </div>
  <div class="frame" style="display:grid; gap:6vh; align-content:center; min-height:80vh">
    <div class="kicker" data-anim>Act I</div>
    <h1 class="h-hero" style="font-size:8.5vw" data-anim>Hard Data</h1>
    <p class="lead" style="max-width:55vw" data-anim>
      Numbers first, methods second.
    </p>
  </div>
  <div class="foot">
    <div>Act One Prologue</div>
    <div>— · —</div>
  </div>
</section>
```

**Key points**:
- Minimal — only needs kicker + main heading + one-line quote
- Two act covers can alternate `hero light` / `hero dark` to create rhythm
- `h-hero` font size can be adjusted from 10vw to 8.5vw to fit different lengths

---

## Layout 3: Big Numbers Grid

```html
<section class="slide light">
  <div class="chrome">
    <div>Past 64 Days · Dev</div>
    <div>Act I / Dev · 02 / 25</div>
  </div>
  <div class="frame" style="padding-top:6vh">
    <div class="kicker" data-anim>One person, what they built.</div>
    <h2 class="h-xl" data-anim>The Past 64 Days</h2>
    <p class="lead" style="margin-bottom:5vh" data-anim>From zero to open-source CodePilot.</p>

    <div class="grid-6" style="margin-top:6vh">
      <div class="stat-card" data-anim>
        <div class="stat-label">Duration</div>
        <div class="stat-nb">64 <span class="stat-unit">days</span></div>
        <div class="stat-note">From zero to now</div>
      </div>
      <div class="stat-card" data-anim>
        <div class="stat-label">Lines of Code</div>
        <div class="stat-nb">110K+</div>
        <div class="stat-note">Written line by line to 110K+</div>
      </div>
      <div class="stat-card" data-anim>
        <div class="stat-label">GitHub Stars</div>
        <div class="stat-nb">5,166</div>
        <div class="stat-note">One open-source repo</div>
      </div>
      <div class="stat-card" data-anim>
        <div class="stat-label">Downloads</div>
        <div class="stat-nb">41K+</div>
        <div class="stat-note">Installed on tens of thousands of machines</div>
      </div>
      <div class="stat-card" data-anim>
        <div class="stat-label">AI Providers</div>
        <div class="stat-nb">19</div>
        <div class="stat-note">Cross-platform integrations</div>
      </div>
      <div class="stat-card" data-anim>
        <div class="stat-label">Commits</div>
        <div class="stat-nb">608+</div>
        <div class="stat-note">No collaborators</div>
      </div>
    </div>
  </div>
  <div class="foot">
    <div>Project · CodePilot　|　github.com/codepilot</div>
    <div>Act I · Dev Numbers</div>
  </div>
</section>
```

**Key points**:
- 3x2 or 4x2 grid works best (see `.grid-6`)
- Each `stat-card` has a fixed structure: label (small English text) → nb (large number) → note (annotation)
- Numbers should be 2-3 characters (too long will overflow) — use K / M abbreviations
- Leave 5vh+ top buffer to let the heading area grab attention first

---

## Layout 4: Left-Text Right-Image (Quote + Image)

```html
<section class="slide light">
  <div class="chrome">
    <div>Identity Twist · The Twist</div>
    <div>03 / 25</div>
  </div>
  <div class="frame grid-2-7-5" style="padding-top:6vh">
    <!-- Left column: heading + body text + callout, flex column to pin callout to bottom -->
    <div style="display:flex; flex-direction:column; justify-content:space-between; gap:3vh">
      <div>
        <div class="kicker" data-anim>BUT</div>
        <h2 class="h-xl" style="white-space:nowrap; font-size:7.2vw" data-anim>
          I'm not a programmer.
        </h2>
        <p class="lead" style="margin-top:3vh" data-anim>
          Haven't written a single line of code since graduating college. Spent the last decade doing UI design and AI visual effects.
        </p>
      </div>
      <div class="callout" data-anim>
        "Three years ago, this would have<br>
        taken a ten-person team a full year."
        <div class="callout-src">— An observer's assessment</div>
      </div>
    </div>
    <!-- Right column: image with standard 16/10 ratio + max-height, no align-self:end -->
    <figure class="frame-img r-16x10" data-anim>
      <img src="images/codepilot.png" alt="CodePilot product screenshot">
      <figcaption class="img-cap">CodePilot · Product Screenshot</figcaption>
    </figure>
  </div>
  <div class="foot">
    <div>Page 03 · I'm Not a Programmer</div>
    <div>— · —</div>
  </div>
</section>
```

**Key points**:
- Use `grid-2-7-5` (left 7 parts, right 5 parts); `align-items:start` is already preset in the template
- **Left column** uses flex column + `justify-content:space-between`: heading pins to top, callout naturally pins to bottom
- **Right column image** — **do not add `align-self:end`**. It will cause the image to slide to the cell bottom, where it gets obscured by browser toolbars on low-res screens
- Images must use **standard ratio classes `.r-16x10` or `.r-4x3`** — never use raw image ratios (like `2592/1798`)

---

## Layout 5: Image Grid (Multi-Image Comparison)

```html
<section class="slide light">
  <div class="chrome">
    <div>Platform Follower Evidence</div>
    <div>Act I / Ops · 05 / 27</div>
  </div>
  <div class="frame" style="padding-top:5vh">
    <div class="kicker" data-anim>Proof · Follower Evidence</div>
    <h2 class="h-xl" data-anim>10 Platforms · 6 Screenshots</h2>

    <div class="grid-3-3" style="margin-top:4vh">
      <figure class="frame-img" style="height:26vh" data-anim>
        <img src="images/weibo.png" alt="Weibo 289K">
        <figcaption class="img-cap">Weibo · 289K</figcaption>
      </figure>
      <figure class="frame-img" style="height:26vh" data-anim>
        <img src="images/twitter.png" alt="Twitter 137K">
        <figcaption class="img-cap">Twitter · 137K</figcaption>
      </figure>
      <figure class="frame-img" style="height:26vh" data-anim>
        <img src="images/wechat.png" alt="WeChat Official Account 96K">
        <figcaption class="img-cap">WeChat Official Account · 96K</figcaption>
      </figure>
      <figure class="frame-img" style="height:26vh" data-anim>
        <img src="images/jike.png" alt="Jike 26K">
        <figcaption class="img-cap">Jike · 26K</figcaption>
      </figure>
      <figure class="frame-img" style="height:26vh" data-anim>
        <img src="images/xhs.png" alt="Xiaohongshu 19K">
        <figcaption class="img-cap">Xiaohongshu · 19K</figcaption>
      </figure>
      <figure class="frame-img" style="height:26vh" data-anim>
        <img src="images/douyin.png" alt="Douyin 10K">
        <figcaption class="img-cap">Douyin · 10K</figcaption>
      </figure>
    </div>
  </div>
  <div class="foot">
    <div>Screenshot Date · 2026.04</div>
    <div>Page 05 · Follower Evidence</div>
  </div>
</section>
```

**Key points**:
- Critical: each `frame-img` must have a fixed `height:NNvh` (do not use `aspect-ratio`), otherwise the grid will overflow
- Images automatically use `object-fit:cover + object-position:top`, cropping only from the bottom
- Use `.grid-3-3` (3x2) or `.grid-3` (3x1) as the container

---

## Layout 6: Two-Column Pipeline

```html
<section class="slide light" data-animate="pipeline">
  <div class="chrome">
    <div>My Workflow · Workflow</div>
    <div>Act II · 15 / 27</div>
  </div>
  <div class="frame">
    <div class="kicker">Pipeline</div>
    <h2 class="h-xl">Two Pipelines</h2>

    <!-- Group 1: Text Pipeline -->
    <div class="pipeline-section">
      <div class="pipeline-label">Text Pipeline</div>
      <div class="pipeline">
        <div class="step" data-anim="step">
          <div class="step-nb">01</div>
          <div class="step-title">Draft</div>
          <div class="step-desc">AI drafts the first version</div>
        </div>
        <div class="step" data-anim="step">
          <div class="step-nb">02</div>
          <div class="step-title">Polish</div>
          <div class="step-desc">AI polishes and removes AI tone</div>
        </div>
        <div class="step" data-anim="step">
          <div class="step-nb">03</div>
          <div class="step-title">Morph</div>
          <div class="step-desc">AI transforms for Twitter / Xiaohongshu</div>
        </div>
        <div class="step" data-anim="step">
          <div class="step-nb">04</div>
          <div class="step-title">Illustrate</div>
          <div class="step-desc">AI generates infographics</div>
        </div>
        <div class="step" data-anim="step">
          <div class="step-nb">05</div>
          <div class="step-title">Distribute</div>
          <div class="step-desc">One-click distribution to 9 platforms</div>
        </div>
      </div>
    </div>

    <!-- Group 2: Video Pipeline -->
    <div class="pipeline-section">
      <div class="pipeline-label">Visual · Video Pipeline</div>
      <div class="pipeline">
        <div class="step" data-anim="step">
          <div class="step-nb">06</div>
          <div class="step-title">Cut</div>
          <div class="step-desc">AI edits the footage</div>
        </div>
        <div class="step" data-anim="step">
          <div class="step-nb">07</div>
          <div class="step-title">Wrap</div>
          <div class="step-desc">AI packages the production</div>
        </div>
        <div class="step" data-anim="step">
          <div class="step-nb">08</div>
          <div class="step-title">Cover</div>
          <div class="step-desc">AI generates the thumbnail</div>
        </div>
      </div>
    </div>
  </div>
  <div class="foot">
    <div>Page 15 · My Content Factory</div>
    <div>Workflow</div>
  </div>
</section>
```

**Key points**:
- Use `.pipeline-section` for grouping + `.pipeline-label` for group titles
- Groups are separated by 3.6vh spacing + a thin top divider line (preset in CSS)
- Each step has a fixed nb → title → desc structure
- No limit on step count, but a single row should have ≤5 steps — overflow to a second pipeline
- **Animation**: add `data-animate="pipeline"` on the `<section>`, and `data-anim="step"` on each `.step`. When navigating to this page, steps default to `opacity:.15`; pressing →/Space/scroll-down lights them up one at a time; **all steps must be lit before advancing to the next page**, creating a sense of interactive presentation

---

## Layout 7: Suspense Closer / Question Page (Hero Question)

```html
<section class="slide hero dark">
  <div class="chrome">
    <div>A Question for You</div>
    <div>24 / 27</div>
  </div>
  <div class="frame" style="display:grid; gap:8vh; align-content:center; min-height:80vh">
    <div class="kicker" data-anim>The Question</div>
    <h1 class="h-hero" style="font-size:7vw; line-height:1.15">
      <span data-anim style="display:block">In your company,</span>
      <span data-anim style="display:block">which roles were never</span>
      <span data-anim style="display:block">meant for humans?</span>
    </h1>
    <p class="lead" style="max-width:50vw" data-anim>
      This isn't a technology question — it's an architecture question.
    </p>
  </div>
  <div class="foot">
    <div>Page 24 · The Question</div>
    <div>— · —</div>
  </div>
</section>
```

**Key points**:
- Hero pages should have as much white space as possible — only place one question
- `h-hero` font size adjusts by length (7vw for 3 lines, 10vw for 1 line)
- Use `<br>` for manual line breaks, ensuring breaks fall at semantic boundaries
- The tail can have one more `lead` line as a punchline

---

## Layout 8: Big Quote Page (Serif Gold Sentence)

```html
<section class="slide light" data-animate="quote">
  <div class="chrome">
    <div>The Takeaway · Key Quote</div>
    <div>18 / 25</div>
  </div>
  <div class="frame" style="display:grid; gap:5vh; align-content:center; min-height:80vh">
    <div class="kicker" data-anim>Quote</div>
    <blockquote style="font-family:var(--serif-zh); font-weight:700; font-size:5.8vw; line-height:1.2; letter-spacing:-.01em; max-width:72vw">
      <span data-anim="line" style="display:block">"No handoffs,</span>
      <span data-anim="line" style="display:block">everyone builds."</span>
    </blockquote>
    <p class="lead" style="max-width:55vw; opacity:.65" data-anim>
      Without the handoff, everyone builds.<br>
      And that makes all the difference.
    </p>
    <div class="meta-row" data-anim>
      <span>— Luke Wroblewski</span><span>·</span><span>2026.04.16</span>
    </div>
  </div>
  <div class="foot">
    <div>Page 18 · Key Quote</div>
    <div>— · —</div>
  </div>
</section>
```

**Key points**:
- Full-page white space — only place one big quote + attribution
- `<blockquote>` uses inline style for large sizing (5-6vw) — do not use `h-hero` (that naming is reserved for page main headings)
- Follow with the English original (lead · opacity:.65) to create hierarchy
- Use `meta-row` for attribution and date

---

## Layout 9: Side-by-Side Comparison (A vs B · Old vs New)

```html
<section class="slide light" data-animate="directional">
  <div class="chrome">
    <div>Old vs New · The Shift</div>
    <div>12 / 25</div>
  </div>
  <div class="frame" style="padding-top:5vh">
    <div class="kicker" data-anim>Before / After · Paradigm Shift</div>
    <h2 class="h-xl" style="margin-bottom:4vh" data-anim>From Handoffs to Co-building</h2>

    <div class="grid-2-6-6" style="gap:5vw 4vh">
      <!-- Left column: Old -->
      <div data-anim="left" style="padding:3vh 2vw; border-left:3px solid currentColor; opacity:.55">
        <div class="kicker" style="opacity:.9">Before · Old Model</div>
        <h3 class="h-md" style="margin-top:2vh">Design → Develop → Handoff</h3>
        <ul style="margin-top:3vh; padding-left:1.2em; display:flex; flex-direction:column; gap:1.4vh; font-family:var(--sans-zh); font-size:max(14px,1.1vw); line-height:1.55">
          <li>Designers create mockups in Figma</li>
          <li>Developers translate pixels from the file</li>
          <li>Repeated PR reviews to align</li>
          <li>Non-technical members cannot touch code</li>
        </ul>
      </div>
      <!-- Right column: New -->
      <div data-anim="right" style="padding:3vh 2vw; border-left:3px solid currentColor">
        <div class="kicker" style="opacity:.9">After · New Model</div>
        <h3 class="h-md" style="margin-top:2vh">Same Tool · Parallel · Co-building</h3>
        <ul style="margin-top:3vh; padding-left:1.2em; display:flex; flex-direction:column; gap:1.4vh; font-family:var(--sans-zh); font-size:max(14px,1.1vw); line-height:1.55">
          <li>Three roles work simultaneously in Intent</li>
          <li>agents.md serves as shared context</li>
          <li>Agents handle alignment / conflicts / animation</li>
          <li>Anyone can safely contribute code</li>
        </ul>
      </div>
    </div>
  </div>
  <div class="foot">
    <div>Page 12 · Paradigm Shift</div>
    <div>Before / After</div>
  </div>
</section>
```

**Key points**:
- Use `.grid-2-6-6` (1:1) to split left and right halves
- Left column uses `opacity:.55` to visually weaken the "old"; right column at full brightness to highlight the "new"
- Both columns use `border-left:3px solid` + `padding-left` for a blockquote feel
- Each column has a unified structure: `kicker` → `h-md` → `<ul>` bullet points — consistent rhythm

---

## Layout 10: Mixed Text-Image (Lead Image + Side Text)

```html
<section class="slide light">
  <div class="chrome">
    <div>Design First</div>
    <div>08 / 16</div>
  </div>
  <div class="frame grid-2-8-4" style="padding-top:6vh">
    <!-- Left column: long body text + quote -->
    <div>
      <div class="kicker" data-anim>Phase 01 · Design Phase</div>
      <h2 class="h-xl" style="margin-top:1vh; margin-bottom:3vh" data-anim>Design First · 2 Weeks</h2>

      <p class="lead" style="margin-bottom:3vh" data-anim>
        Completed visual exploration and design system in Figma — grid / typography / color variables / reusable components, with several rounds of feedback iteration for desktop and mobile mockups.
      </p>

      <p data-anim style="font-family:var(--sans-zh); font-size:max(14px,1.15vw); line-height:1.75; opacity:.78; margin-bottom:2.4vh">
        Within two weeks, the visual style, rough structure, and directional content were all locked in. This is a solid traditional design process — nothing new here yet.
      </p>

      <div class="callout" style="margin-top:3vh" data-anim>
        "This phase was pretty standard.<br>Just a solid Web design process."
        <div class="callout-src">— Luke Wroblewski</div>
      </div>
    </div>
    <!-- Right column: supplementary image · portrait or square -->
    <figure class="frame-img r-3x4" data-anim>
      <img src="images/figma.png" alt="Figma design system">
      <figcaption class="img-cap">Figma · Design System</figcaption>
    </figure>
  </div>
  <div class="foot">
    <div>Page 08 · Design First</div>
    <div>Approx. 2 weeks</div>
  </div>
</section>
```

**Key points**:
- `.grid-2-8-4` (8:4) gives body text the dominant share, with the image as supplementary
- Left column contains multiple information layers: kicker → main heading → lead → body paragraph → callout (quote)
- Right column image uses **portrait 3:4** or square 1:1 to avoid competing with left-column text for attention
- This layout is suited for **pages with heavier information density** (unlike Layout 4 which only has a single quote)

---

## Appendix: Common Grid Templates

| Class | Ratio | Use Case |
|---|---|---|
| `.grid-2-6-6` | 6:6 (1:1) | Equal halves |
| `.grid-2-7-5` | 7:5 | Text-dominant + supplementary image |
| `.grid-2-8-4` | 8:4 (2:1) | Long text + small image/data |
| `.grid-3` | 1:1:1 | 3-item side-by-side (cases / screenshots) |
| `.grid-3-3` | 3x2 | 6-image matrix |
| `.grid-6` | 3x2 | 6 data cards |

All grids have preset `gap: 3vw 4vh` (3vw horizontal, 4vh vertical) — can be individually overridden.

---

## Page Rhythm Recommendations

For a 25-30 page presentation, the recommended rhythm is:

1. **Hero Cover** (page 1)
2. **Act Divider** (first act opening, hero light or hero dark)
3. **Big Numbers** (throw hard data for impact)
4. **Quote + Image** (tell the identity twist / create a hook)
5. **Image Grid** (supporting evidence)
6. **Hero Question** (act closer, leave suspense)
7. ... Second act, third act follow the same rhythm ...
8. **Hero Close** (final page, question or acknowledgments)

Hero pages and non-hero pages should alternate at a **2-3 : 1 ratio** — do not have more than 3 consecutive non-hero pages, and do not have more than 2 consecutive hero pages.
