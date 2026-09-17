# Quality Checklist

This checklist comes from the real iteration process of a "one-person company" presentation deck. Every item was written after hitting a pitfall, sorted by importance.

Read through it once before generating a PPT; after generating, self-check item by item.

---

## 🔴 P0 · Must-Not-Break Rules

### 0-S. Swiss locked mode: body pages must come from the original 22P

**Symptom**: Colors and fonts look Swiss, but titles drift to the center, images aren't on the grid, and page structures are completely different from the original 22P.

**Root cause**: During generation, Swiss was treated as a style pack with free-form composition of new P23/P24/custom SVG pages, instead of selecting from the 22 registered layouts in the original reference PPT.

**What to do**:
- Read `references/swiss-layout-lock.md` first
- Body pages can only use `S01-S22`; new cover/closing pages can only use `SWISS-COVER-ASCII` / `SWISS-CLOSING-ASCII`
- Every `<section class="slide">` must include `data-layout="Sxx"`
- After generation, you must run:

```bash
node <SKILL_ROOT>/scripts/validate-swiss-deck.mjs path/to/index.html
```

**Validation will catch**:
- Unregistered layouts / missing `data-layout`
- P23/P24 experimental structures
- Visible text inside SVGs
- S22 images not bound to `s22-hero-21x9`
- S22 photos using `object-position:top center`

### 0-S-2. Swiss top title defaults to upper-left, not centered

**Symptom**: The top Chinese title is centered on the page like a homemade poster, no longer matching the original PPT.

**What to do**:
- Except for `S03/S09/S10` statement/split layouts, the top title must align to the original template's upper-left content axis.
- Don't put the subtitle in the left column and the main title in the right large column — this causes the title to appear visually centered.
- If you need a title + description two-column layout, you must copy the original `S11` or `S17` skeleton — don't write your own `4fr 8fr`.

### 0-S-3. Swiss map pages must use S08 Map Component

**Symptom**: Location/history content only has a simple SVG map without real markers, relationship cards, zoom/drag controls, or scroll triggers PPT page transitions.

**What to do**:
- Use `data-layout="S08"`.
- Read `references/swiss-map-component.md` first.
- The right-side map component must include marker points, connection lines, location cards, `+` / `-` / `DRAG` controls.
- Disable scroll zoom and drag pan by default; allow dragging only after user clicks `DRAG`.
- Must keep a static fallback — content remains readable if map CDN or tiles fail.

**Check**:
- `grep -n "data-map-ctrl" index.html`
- `grep -n "maplibregl.Map" index.html`
- Browser test: `+` can zoom in, `DRAG` toggles to `DRAG ON`

### 0-A. Swiss canvas alignment rule (check every page · most common pitfall)

**Symptom**: The chrome-min header and bottom footer are aligned to the 5vw edge, but the middle area is indented further inward — left and right don't align.

**Root cause**: `.canvas-card` already has `padding:5.6vh 5vw 4.4vh`. If you add `padding:5vh 5vw 4vh` to the main body area, the horizontal padding becomes `5vw + 5vw = 10vw`, making the body 5vw more indented than chrome-min.

**What to do**:
- Main body `padding:0`, use only grid `gap` for vertical spacing
- Spacing between chrome-min and body is provided by `.chrome-min{margin-bottom:48px}` — **don't** stack `margin-top` / `padding-top` on top of the body
- Split mode exception: `.slide.split .canvas-card{padding:0}`, each `.half` defines its own `padding:5.6vh 3.6vw 4.4vh`

```html
<!-- ❌ Wrong: body is 5vw more indented, left and right don't align -->
<div class="canvas-card">
  <div class="chrome-min">...</div>
  <div style="flex:1;padding:5vh 5vw 4vh;...">Body</div>
</div>
<!-- ✅ Correct -->
<div class="canvas-card">
  <div class="chrome-min">...</div>
  <div style="flex:1;padding:0;display:grid;grid-template-rows:auto 1fr auto;gap:3vh">Body</div>
</div>
```

**Self-check command**: `grep "padding:.*5vw" index.html` — if it matches `padding:Xvh 5vw Yvh` inside a direct child of canvas-card, it's wrong (.half / decorative layers are exceptions).

### 0-B. Swiss head area: kicker must be "above" the main title (not side by side)

**Symptom**: The small title (`.t-meta` / `.t-cat`) and main title are squeezed onto the same line — small text on the left, large text on the right — the header loses its hierarchy.

**Root cause**: `grid-template-columns:auto 1fr` forces two elements that should stack vertically into side-by-side columns.

**What to do**:
```html
<!-- ❌ Wrong -->
<div data-anim="head" style="display:grid;grid-template-columns:auto 1fr;gap:3vw;align-items:end">
  <div class="t-meta">METHODOLOGY · 03</div>
  <h2 class="h-xl-zh">Why N+1</h2>
</div>
<!-- ✅ Correct -->
<div data-anim="head" style="display:flex;flex-direction:column;gap:1.4vh">
  <div class="t-meta">METHODOLOGY · 03</div>
  <h2 class="h-xl-zh">Why N+1</h2>
</div>
```

Exception: When the head row carries both "left: kicker + main title (stacked vertically)" and "right: small footnote," the outer container can use `display:grid;grid-template-columns:1fr auto`, but the **inner** elements must remain flex column.

### 0-B-2. Swiss cover / closing default: full-screen IKB + ASCII breathing field + white weight 200 (mandatory)

**Symptom**: Cover uses `slide light` white background + black text + a large "01" — while chrome has already written `01 / 07`, creating two "01"s on screen, visually redundant; white background is too plain, completely lacking the "opening ceremony" feel.

**Root cause**: The old version of layouts-swiss.md recommended left ink + right paper spread by default; in practice this easily becomes "white background + large black text + large number," losing the opening impact of the signature IKB color.

**What to do** (mandatory for Swiss style):
- **Cover must use `<section class="slide accent">`** (full-screen IKB), not `slide.light` or `slide.dark`; inside `.canvas-card`, the **first child element** must be `<canvas class="ascii-bg">` (ASCII character breathing field, the template's built-in IIFE auto-activates)
- **Don't add "01" or other large numbers**: `.chrome-min` already shows `01 / N`; adding another large "01" on the cover is redundant — delete it
- **Emphasis text must use italic**: `font-style:italic;font-weight:300`, **do not** use `color:var(--accent)` — IKB blue on IKB blue is invisible to the eye
- **Closing must use `slide.split`** dual half-screen, left half `.half.b-accent` + ASCII canvas (color echo with cover), right half paper white with 3 takeaways; **takeaway #03** uses `var(--accent)` for color, completing the "opening full IKB ↔ closing half IKB" color bookend
- ASCII canvas in the template's `<style>` already has `mix-blend-mode:screen;opacity:.92` — don't modify this value
- Cover/closing main title dual font-size constraint: `min(11.6vw,19vh)` ~ `min(8vw,14vh)` (follow Y ≥ X × 1.6 rule)

**Self-check commands**:
- `grep -c "ascii-bg" index.html` — cover + closing should match ≥ 2 (one canvas each)
- `grep -E '"slide accent"' index.html | head -1` — cover should be `slide accent` not `slide light`
- `grep "color:var(--accent)" index.html` — if a match also contains `font-style:italic`, that's a red flag (blue on blue); change to italic only without accent; only the closing "03 takeaway" line using `var(--accent)` is valid (background is white there)
- Visual check: open the page and check if the cover has a large "01" number — if so, delete it

### 0-C. Swiss large font dual constraint: in `min(Xvw, Yvh)`, Y ≥ X × 1.6

**Symptom**: On a 16:9 standard screen (MacBook 13/14/16, common monitors), the title font is noticeably smaller than expected, making the whole page look sparse or shrunken.

**Root cause**: 1vw : 1vh ≈ 1.78. If you write `min(7vw, 10vh)`, on a 16:9 screen 7vw = 12.46vh, which gets capped by the 10vh limit to 10vh — a 20% font size reduction.

**What to do**: Recommended value quick reference
| Use Case | Recommended |
|---|---|
| h-hero giant statement | `min(11.6vw, 19vh)` |
| h-xl chapter title | `min(7vw, 12vh)` ~ `min(7.4vw, 13vh)` |
| Large number KPI | `min(8.4vw, 14vh)` |
| Medium number / index | `min(4.6vw, 8.5vh)` ~ `min(5.6vw, 10vh)` |
| Subtitle | `min(7.6vw, 13vh)` |

**Self-check command**: `grep -E "font-size:min\([0-9.]+vw,\s*[0-9.]+vh\)" index.html` — review all matched X/Y values; any Y/X < 1.6 needs to be increased.

### 0-D. Swiss image integration: square corners, uniform height, evidence only

**Symptom**: Images look like typical PPT illustrations — rounded corners, shadows, inconsistent proportions; multiple screenshots at different heights, or GPT Image 2 generated images include their own titles/footers that duplicate the page chrome.

**Root cause**: In Swiss style, images aren't decoration — they're evidence blocks within the grid. Without selecting an original layout and image slot first, arbitrary images get force-fit into the page.

**What to do**:
- Choose layout first: single large image + KPI → `S22`; multiple images → adapt `S15/S16` original grid skeleton
- S22 generated image ratio is fixed at `21:9`, and the `<img>` must have `data-image-slot="s22-hero-21x9"`
- Photos default to `object-position:center 35%` or `center center` — don't use `top center` which crops faces
- Image containers use `.frame-img` only; **no** `border-radius` / `box-shadow`
- For UI / infographics / flowcharts that are original screenshots or text-heavy images, use `.fit-contain`; if regenerated to fit the slot, use the corresponding ratio class to fill the container, e.g., `.frame-img.r-21x9` — don't use a fixed short height that shrinks the image
- Multiple images in the same group must use uniform slots, ratios, and heights — no mixing
- GPT Image 2 prompts must specify: Swiss Style, single accent, square corners, no gradients/shadows/rounded corners, no header/footer/title/badges

**Self-check commands**:
- `grep -E "frame-img.*border-radius|box-shadow" index.html` — delete any matches
- `grep -n "data-image-slot" index.html` — every local image should have a slot declaration
- Visual check: if an image contains its own large title, page number, footer, or badge, regenerate it first — don't try to crop-fix it in the page

### 0-D-2. Swiss bottom pagination safe zone: lowest content must not touch nav

**Symptom**: Image captions, footnotes, timeline bottom labels, bottom KPIs are blocked by pagination dots, or visually too close.

**Root cause**: `#nav` is fixed at `bottom:2vh`. If main content uses `align-self:end` / `align-items:end` / `margin-top:auto` to stick to the bottom, the lowest edge enters the pagination zone.

**What to do**:
- Maintain at least `3vh` breathing space between the main content's lowest edge and the pagination component
- When P23 needs bottom alignment, use `.swiss-img-split.align-image-bottom` — the template has built-in `--nav-safe-bottom:8vh`
- Other pages needing bottom alignment: add `.nav-safe-bottom` or `.nav-safe-bottom-tight` to the main container
- Don't manually write `bottom:2vh` / `bottom:0` for description text — it will compete with nav for space

**Self-check**:
- Visual: navigate to the page and verify the last caption/label line is clearly above the pagination component
- Code: `grep -E "align-items:end|align-self:end|bottom:0|bottom:2vh|margin-top:auto" index.html` — check each match for nav safe zone compliance

---

### 0-E. Swiss template fidelity guardian: original PPT is the golden source

**Symptom**: Generated pages look Swiss-ish, but font weights, spacing, timelines, and card density don't match the original reference PPT; the more iterations, the further it drifts.

**Root cause**: New image layouts or experimental structures were written as global style changes, or original base classes were unintentionally modified, e.g., `.h-hero` / `.h-xl` font weight, `.tl-node` column width, `.duo-compare` spacing.

**What to do**:
- The original reference file `/Users/guohao/Documents/op7418的仓库/项目/Thin-Harness-Fat-Skills/ppt/index.html` is the Swiss theme golden source, but go by **actual page usage**, not unused CSS helpers
- The original pages extensively use `font-weight:200` for large titles, with `300` for emphasis words/numbers; `.h-hero` / `.h-xl` / `.h-hero-zh` / `.h-xl-zh` must maintain light font weights in this template — don't revert to 800/900
- Beyond the new cover/closing ASCII mechanism, S22 image slot fix, horizontal timeline label centering fix, and correcting title helpers to actual light font weights, don't modify the original base CSS/JS recipe
- New image capabilities must bind to S22/S15/S16 original slots — don't invent new body structures
- Before modifying `assets/template-swiss.html`, compare against the original reference first; acceptable differences should only be ASCII classes, S22 image positioning classes, light-weight title helpers, and known animation fixes

**Self-check commands**:
- Run `compare-swiss-base.mjs` in the test directory and confirm `missing in template: 0`
- Visual comparison with the original PPT's equivalent pages: large title font weight, chrome-min position, timeline dot/label, card density must match

### 0-F. Visual + code dual verification: don't just look at HTML

**Symptom**: Code looks correct with proper class names, but the actual page is cramped, image-text relationships are wrong, optional components are over-stacked, or the wrong layout was used for the content.

**What to do**:
- Open the original reference PPT, current template or generated page, and test PPT simultaneously — do a visual side-by-side comparison first
- Wait for entry animations to settle before taking screenshots or making judgments — don't mistake animation mid-states for missing content
- First open the webpage and review each page visually: title font weight, header spacing, body density, image alignment, nav safe zone
- Then review the code structure: is the correct layout used for the page, are required components present, are optional components overused
- When comparing with the original PPT, go by the actual visual appearance; raw CSS helpers can only assist, not replace visual judgment
- Diagnose the issue source: wrong layout / missing required component / overused optional component / spacing and safe zone problems
- General layouts (S03/S08/S11/S19) can be used frequently; data-specific layouts (S06/S07/S20/S21/S22) must have real data or case studies; structural layouts (S14/S15/S17) must have closures, matrices, or hierarchical relationships
---

### 0. Pre-generation class name validation (most important)

**Symptom**: Directly pasting layouts.md skeletons into new HTML causes all styles to be lost — large titles become sans-serif, data display numbers shrink to body text size, pipeline pages collapse into a jumble, images stack to the browser bottom.

**Root cause**: If the current template's `<style>` doesn't define these classes, browsers fall back to default styles.

**What to do**:
- **Before generating a PPT, you must first `Read` the corresponding style template**: Style A reads `assets/template.html`, Style B reads `assets/template-swiss.html` — confirm all classes used in layouts are defined
- Most commonly missing classes: `h-hero / h-xl / h-sub / h-md / lead / meta-row / stat-card / stat-label / stat-nb / stat-unit / stat-note / pipeline-section / pipeline-label / pipeline / step / step-nb / step-title / step-desc / grid-2-7-5 / grid-2-6-6 / grid-2-8-4 / grid-3-3 / frame / img-cap / callout-src`
- If a class is actually missing, **add it to the template's `<style>`** — don't inline-rewrite it on every page
- After generating, open the browser: if you see "large titles in sans-serif" or "pipeline steps crammed on one line," it's almost 100% this issue

### 1. Don't use emoji as icons

**Symptom**: Using emoji (🎯 💡 ✅) in the magazine style instantly destroys the aesthetic.

**What to do**: Use the Lucide icon library via CDN:

```html
<script src="https://unpkg.com/lucide@1.16.0/dist/umd/lucide.min.js"></script>
...
<i data-lucide="target" class="ico-md"></i>
...
<script>lucide.createIcons();</script>
```

Pin Lucide version — brand icons (GitHub, Twitter, etc.) were removed in v1.0. Use [Simple Icons](https://simpleicons.org/) for brand logos.

Common icon names: `target / palette / search-check / compass / share-2 / crown / check-circle / x-circle / plus / arrow-right / grid-2x2 / network`

### 2. Images may only be cropped from the bottom — left, right, and top must never be cut

**Symptom**: Using `aspect-ratio` to size images causes grids to stack when the parent container is insufficient, or crops key information (like the title bar at the top of a screenshot).

**What to do**: Image containers use **fixed height + overflow hidden**, images use `object-fit:cover + object-position:top`:

```html
<figure class="frame-img" style="height:26vh">
  <img src="screenshot.png">
</figure>
```

CSS `.frame-img img` already has `object-position:top` preset — only the bottom gets cropped.

**Never use this pattern** (will blow out the container in grids):

```html
<!-- Bad example -->
<figure class="frame-img" style="aspect-ratio: 16/9">...</figure>
```

**Exception**: A single hero visual (not inside a grid) can use `aspect-ratio + max-height`, since the parent container provides a safety net.

### 2b. Light pages with dark WebGL = washed-out gray (theme switch not working)

**Symptom**: All light pages have a grayish overlay on the background, even hero light pages look gray.

**Root cause**: JS switches the opacity of two canvases based on the slide's theme. If the entire deck opens with hero dark and there's no mechanism to switch the background to light, body never gets the `light-bg` class, and `canvas#bg-dark` stays on top permanently.

**What to do**:
- The template's `go()` function now infers the theme from `classList` (`light` / `dark`), so **slides must explicitly have the `light` or `dark` class**. Don't omit it, and don't use custom theme names
- Hero pages use `hero light` / `hero dark`, body pages use `light` / `dark`. Writing only `hero` without a theme is broken
- A deck must have at least one **non-hero light page** to ensure body gets the `light-bg` class

### 2b-2. Entire deck is all light, no rhythm

**Symptom**: Except for the cover `hero dark`, all remaining pages default to `light` — visually flat with no breathing room, a sea of white.

**Root cause**: layouts.md skeletons default to `light`. If you just paste skeletons without adjusting themes, everything stays light.

**What to do**:
- **Before generating, draw a "theme rhythm map"**: specify `hero dark` / `hero light` / `light` / `dark` for each page, then write code
- **Hard rules**: More than 3 consecutive pages with the same theme = not allowed; 8+ pages must have ≥1 `hero dark` + ≥1 `hero light`; can't be all `light` body pages — must include `dark` body pages
- **Choose theme by layout** (see layouts.md header "Theme Rhythm Planning"):
  - Left-text right-image (Layout 4), big quote (Layout 8), mixed image-text (Layout 10) → **alternate `light` / `dark`**
  - Big numbers, image grids, Pipeline, comparison pages → `light` (screenshots/numbers/processes need bright backgrounds)
  - Cover, question pages → `hero dark`
  - Chapter dividers → alternate `hero dark` and `hero light`
- **Post-generation self-check**: `grep 'class="slide' index.html` — visually confirm rhythm alternation

### 2c. Chrome and kicker should not say the same thing

**Symptom**: Upper-left `.chrome` says "Design First · Design Priority," and on the same page `.kicker` says "Phase 01 · Design Phase" — synonymous translations, feels AI-generated.

**What to do**:
- **chrome = magazine header / navigation label**: Can be the same across multiple pages (e.g., "Act II · Workflow", "Data · Result", "lukew.com · 2026.04")
- **kicker = unique lead-in for this page**: Short, with a hook, serves as the "small prefix" for the main title (e.g., "BUT", "What one person built.", "The Question")
- One describes the section, the other describes this page — they must never translate each other

### 3. Large title font size must not exceed screen width / character count

**Symptom**: Chinese title font set too large (e.g., 13vw), resulting in only 1 character per line, forced line breaks look terrible.

**What to do**:
- `h-hero` (largest): 10vw, **and title length ≤ 5 characters**
- `h-xl` (second largest): 6vw-7vw
- For long titles, use `<br>` for manual line breaks — don't rely on automatic wrapping
- Add `white-space:nowrap` when necessary

**Example**: "I'm not a programmer." (6 characters) uses `h-xl` 7.2vw + nowrap, fits on one line.

### 4. Font roles: serif for titles, sans-serif for body

**What to do**:
- Large titles, key quotes, big numbers → **Serif** (Noto Serif SC + Playfair Display + Source Serif)
- Body text, descriptions, pipeline step names → **Sans-serif** (Noto Sans SC + Inter)
- Metadata, code, labels → **Monospace** (IBM Plex Mono + JetBrains Mono)

All fonts loaded via Google Fonts CDN, already preset in the template.

### 4b. Don't use `align-self:end` to bottom-align images

**Symptom**: In left-text right-image layouts, `align-self:end` is added to `<figure>` to bottom-align the right image with the left callout. Result:
- If the parent container isn't a grid (e.g., the class isn't defined), `align-self` has no effect — the image drops to the very bottom of the document flow and gets hidden by the browser bar
- Even with grid, the image sticks to the cell bottom, and on low-res screens still gets blocked by `.foot` and `#nav` dots

**What to do**:
- Image-text layouts **must use `.frame.grid-2-7-5`** (or `.grid-2-6-6`/`.grid-2-8-4`)
- Right column `<figure class="frame-img r-16x10">` or `<figure class="frame-img r-4x3">` naturally aligns to the top
- To make the left callout appear "bottom-aligned," add flex column + `justify-content:space-between` to the **left column** — don't touch the right column
- If the image should be top-aligned with the title but body text starts below the title, add `margin-top:7vh` to `9vh` to the image to align it with the body content area

### 4c. Don't use original image aspect ratios

**Symptom**: `aspect-ratio: 2592/1798` copied from the original image creates weird whitespace or overflow on different screens.

**What to do**: Regardless of original aspect ratio, placeholders use standard ratios only: **16/10 / 4/3 / 3/2 / 1/1 / 16/9**. Images auto `object-fit:cover + object-position:top` — top stays intact, bottom gets slightly cropped (harmless).

### 5. Don't add heavy borders / shadows to images

**Symptom**: Adding strong shadows or thick borders for "premium feel" instantly makes it look like a corporate PPT.

**What to do**: At most 1-4px micro-rounding + **very faint noise** (already in the template). Don't add `box-shadow`, don't add `border` (unless 1px very faint gray).

---

## 🟡 P1 · Layout Rhythm

### 6. Hero and non-hero pages should alternate

**Recommended rhythm** (25-30 pages):
```
Hero Cover → Act Divider (hero) → 3-4 pages non-hero → Act Divider (hero)
→ 4-5 pages non-hero → Hero Question → ... → Hero Close
```

More than 2 consecutive hero pages causes fatigue; more than 4 consecutive non-hero pages kills the rhythm.

### 7. Big number pages and dense pages should alternate

Big number pages (big numbers / hero question) and dense pages (pipeline / image grid) should alternate so the audience's eyes don't tire out.

### 8. English/Chinese usage of the same concept must be consistent

**Symptom**: Sometimes "Skills," sometimes "技能," sometimes "Thin Harness, Fat Skills" — inconsistent throughout.

**What to do**:
- Prefer **English terms** for jargon (Skills / Harness / Pipeline / Workflow) — these are familiar in the community
- **Don't force-translate** — forced translations feel awkward
- One term, one spelling throughout the entire deck

### 9. Bottom chrome page numbers must be consistent

Use `XX / TOTAL` format (e.g., `05 / 27`). **Don't add dynamic page numbers in the upper right** (they'll duplicate `.chrome`).

### 9b. Animation system: every page must have data-anim markers

**Symptom**: After generating, the browser shows content appearing with a hard "snap" on page transition — no rhythm. The magazine style relies entirely on layout, missing the ceremonial feel of layered reveals.

**Root cause**: No `data-anim` attributes were added to any elements, so Motion has nothing to animate — the entire page appears statically.

**What to do**:
- On all body pages, **at minimum add `data-anim` to kicker / main title / lead / callout / stat-card / figure leaf elements**
- **Hero pages** (opening/dividers/questions/closing): all core blocks (kicker + main title + lead + meta-row) need it
- **Pages that don't need a special recipe**: add nothing to `<section>`, the default cascade looks great
- **4 page types needing a special recipe**: must add the corresponding `data-animate` to `<section>`
  - Big quote → `data-animate="quote"` + each line `<span data-anim="line" style="display:block">`
  - Before/After comparison → `data-animate="directional"` + left column `data-anim="left"` + right column `data-anim="right"`
  - Pipeline walkthrough → `data-animate="pipeline"` + each step `data-anim="step"`
  - Hero pages (automatically use hero recipe, but elements still need `data-anim`)

**Self-check**: After generating, `grep -c 'data-anim' index.html` should return dozens of matches. If only single digits, markers were definitely missed.

### 9c. Pipeline pages must have data-animate="pipeline"

**Symptom**: Pipeline pages fade in all at once, losing the "step-by-step walkthrough" rhythm. When trying to advance, you can only go forward — can't go back to a previous step.

**What to do**: Layout 6's `<section>` must have `data-animate="pipeline"`. During presentation, pressing →/space/scroll down **lights up steps one by one**; only after all steps are lit does → advance to the next page. This rhythm is intentional, not a bug.

---

## 🟢 P2 · Visual Polish

### 10. WebGL background overlay opacity

**dark hero**: Overlay 12-15% (WebGL clearly shows through)
**light hero**: Overlay 16-20% (WebGL subtly visible, doesn't compete with text)
**Regular light/dark pages**: Overlay 92-95% (nearly opaque)

If a page has very little text (hero question), the overlay can be thinner; if body text is dense, the overlay must be thicker to ensure readability.

### 11. Light hero shader must not have a strong focal point

**Symptom**: Spiral Vortex, radial ripples are too conspicuous on light themes — looks like a Windows 98 screensaver.

**What to do**: Light hero should use FBM domain warping-driven centerless flow, base color stays silver/paper (close to #F0F0F0 / #FBF8F3), rainbow tinting kept subtle (below 0.05).

### 12. Dark hero allows more visual impact

Dark hero can use shaders with center structures like Holographic Dispersion (titanium dispersion), since dark backgrounds can accommodate more visual information.

### 13. Left-text right-image alignment

- Left column text group `justify-content:space-between`: title at top, quote box at bottom
- Right column image keeps natural top alignment — don't add `align-self:end`
- Right column image usually should align with the body content area, not with the top of the main title; add `margin-top:7vh` to `9vh` when necessary
- Grid overall `align-items:start` (not `center` / `end`)

### 13b. Title-to-body spacing

- Two-part layouts with top title + long text/quote/chart below must have noticeable spacing — recommended `margin-top:6vh` to `8vh`
- Centered large title pages must be horizontally centered as a whole — don't just left-align the text block and place it centrally
- On complex content pages, use the large title to set the tone, with content below using grid / rowline edge-to-edge alignment — don't squash title, subtitle, and body into a single cluster

### 13c. Don't stretch UI mockups into ultra-long strips

- If a single UI screenshot becomes an elongated strip at full width, prefer splitting it into 2-3 partial panels
- When combining multiple panels, each `.frame-img` should use the same fixed height class, e.g., `.h-16` / `.h-18` / `.h-22` — don't force everything into one ultra-wide container
- Visual sizes within the same image group must be consistent — don't mix different heights, zoom levels, and margin densities
- If full width is truly needed, generate a sufficiently wide horizontal image and specify "ultra-wide horizontal strip" in the prompt

### 13d. Generated images should not contain slide elements

- GPT Image 2 generated images are embedded assets only — don't let images include their own headers, footers, titles, page numbers, badges, credits, or decorative borders
- Flowcharts/infographics should only contain core graphics and essential short labels — the PPT itself handles titles, footers, and chrome
- If a generated image already has these elements, regenerate first — don't layer another chrome on top in the PPT causing visual noise

### 13e. Swiss image-text layouts must not use only one type

- A 7-8 page Swiss test deck should use at least 6 different P-number layouts
- With 2-3 images, use at least two image presentation methods: P22 hero visual / P23 single image explanation / P24 evidence wall / P15 matrix / P16 tabloid
- P23 defaults to bottom alignment: text block and image are bottom-aligned; don't retreat to top alignment out of nav concerns — control image height first
- White-background infographic containers must have white backgrounds, no borders — don't wrap white images in gray frames

### 13f. Swiss Chinese large titles should be scaled down

- Chinese 2-line titles default to `min(5.8vw,10.2vh)`, don't directly use English page sizes of `6.8vw-7vw`
- When any line has 9-12 Chinese characters, scale down to `min(5.2vw,9.2vh)`
- 3-line titles should be rewritten as a priority — don't sacrifice below-title image-text content for larger titles

### 14. Subtle image rounding

Style A can have slight rounding. Style B Swiss must be square corners: `.frame-img` and images themselves should have no rounded corners, shadows, or consumer-app card feel.
---

## 🔵 P3 · Operational Details

### 15. Image paths should use relative paths

Place images in the `images/` folder, use relative paths `images/xxx.png` in HTML — don't use absolute paths.

### 16. Page numbers in `.chrome` are hardcoded

JS dynamically calculates the total page count and expands the bottom pagination dots, but `XX / N` in `.chrome` is hardcoded. When adding/removing pages, manually update N.

### 17. Navigation controls must be preserved

The template supports by default: ← → / scroll wheel / touch swipe / bottom dots / Home·End. Don't delete the navigation logic in JS.

### 18. Don't use `height:100vh` rigidly — use `min-height:80vh`

`100vh` makes content exactly fit the screen, but browser toolbars and tab bars consume some height, causing content overflow. `min-height:80vh + align-content:center` is more reliable.

---

## 🧪 Final Self-Check Checklist

After generating the PPT, check against this list item by item:

```
Pre-check (before generation)
  □ Read template.html's <style>, confirmed all needed classes exist
  □ Decided which Layout (1-10) each page uses
  □ Drew a "theme rhythm map": each page specifies hero dark / hero light / light / dark
  □ Rhythm map satisfies hard rules: no 3+ consecutive same-theme pages / has ≥1 hero dark + ≥1 hero light (for 8+ pages) / at least 1 dark body page
  □ <title> updated to actual deck title (grep "[required]" should return no results)
  □ Swiss: cover is `slide accent` full-screen IKB + `<canvas class="ascii-bg">` (not `slide light` white)
  □ Swiss: closing is `slide split` + left `b-accent` + ASCII canvas / right paper 3 takeaways, #03 uses var(--accent)
  □ Swiss: `grep -c "ascii-bg" index.html` ≥ 2 (one each for cover + closing)
  □ Swiss: cover has no "01" large number (chrome already shows 01/N, don't duplicate)
  □ Swiss: emphasis text on IKB background uses `font-style:italic`, no `color:var(--accent)` (blue on blue)

Content
  □ Page count per act is proportional (no top-heavy distribution)
  □ No emoji used as icons
  □ Skills / Harness and other terms used consistently
  □ Each page has clear three-level information: kicker + title + body

Layout
  □ No large titles with 1-character-per-line wrapping
  □ Image grids use height:Nvh, not aspect-ratio
  □ Images only cropped from bottom, top and sides intact
  □ Serif/sans-serif font roles match template
  □ Pipeline groups have clear separation between them

Visual
  □ Hero and non-hero pages alternate
  □ WebGL background visible on hero pages
  □ Images have subtle rounding
  □ No heavy shadows or borders

Interaction
  □ ← → page navigation works
  □ Bottom dot count matches total page count
  □ Chrome page numbers match actual page numbers
  □ ESC key triggers index view (if retained)
  □ B key triggers static/low-power mode, bottom-right prompt toggles between `B Static` / `B Dynamic`

Animation
  □ `assets/motion.min.js` exists (local fallback)
  □ In low-power mode, WebGL/ASCII canvas no longer runs RAF loop; current page content remains fully visible
  □ Page content fades in sequentially on transition, not a hard "snap" all at once
  □ Big quote pages have `data-animate="quote"` on `<section>`, each line `<span data-anim="line">`
  □ Before/After comparison pages have `data-animate="directional"` on `<section>`, left/right columns marked left/right
  □ Pipeline pages have `data-animate="pipeline"` on `<section>`, each step marked data-anim="step"
  □ `grep -c 'data-anim' index.html` count ≥ page count × 3 (average 3+ markers per page)
```

Accessibility & Performance
  □ `prefers-reduced-motion` respected — one frame rendered, then frozen
  □ Page Visibility API pauses WebGL/animations when tab hidden
  □ WebGL context loss handled (`webglcontextlost` / `webglcontextrestored`)
  □ `scroll-snap-stop: always` on all slides (prevents fast-swipe skipping)
  □ `overscroll-behavior-x: contain` on slide container
  □ `text-autospace: normal` on body (native CJK-Latin spacing)
```

All checked off — only then is the PPT qualified.
