# Step 3 · Content Guide

#### 3.0 · Pre-flight: Class names must be defined in the template's `<style>` (**most important**)

**This is the root cause of all generation issues**. Layout skeletons use many class names — if the template's `<style>` doesn't have matching definitions, the browser falls back to defaults: heading fonts wrong, cards crammed together, pipelines collapsed into a single line, images piled at the page bottom.

**Class names are NOT interchangeable between styles** (emphasis again):
- Style A template has `h-hero` (serif), `stat-card`, `grid-2-7-5`, `frame`, etc.
- Style B template has `h-hero` (sans-serif), `kpi-hero`, `accent-block`, `span-N`, `dots`, `grid-12`, etc.
- Same-name classes render **completely differently** across templates (e.g., Style A's `h-hero` is Noto Serif SC serif; Style B's `h-hero` is Inter sans-serif)

**Before writing any slide code:**

1. **Read the current template first** (at least through the end of the `<style>` block):
   - Style A → `assets/template.html`
   - Style B → `assets/template-swiss.html`
2. **Cross-reference the Pre-flight checklist in the corresponding layouts file** to confirm every class you plan to use exists in `<style>`
3. If a class is missing: **add it to the template's `<style>`** — do not inline-rewrite it in each slide
4. **The template is the single source of truth for class names** — do not invent new class names; if you need custom styling, use `style="..."` inline

**Style A commonly missed classes**:
`h-hero` / `h-xl` / `h-sub` / `h-md` / `lead` / `kicker` / `meta-row` / `stat-card` / `stat-label` / `stat-nb` / `stat-unit` / `stat-note` / `pipeline-section` / `pipeline-label` / `pipeline` / `step` / `step-nb` / `step-title` / `step-desc` / `grid-2-7-5` / `grid-2-6-6` / `grid-2-8-4` / `grid-3-3` / `grid-6` / `grid-3` / `grid-4` / `frame` / `frame-img` / `img-cap` / `callout` / `callout-src` / `chrome` / `foot`

**Style B commonly missed classes** (post-2026-05 refactor):
- Canvas: `canvas-card` / `chrome-min`
- Typography: `h-hero` (sans-serif 7.4vw weight 200) / `h-statement` (9.6vw) / `h-xl` / `h-md` / `t-cat` (SemiBold 600 category label) / `t-meta` (mono uppercase) / `lead` / `num-mega` / `mono`
- Cards (four mutually exclusive types): `card-ink` / `card-accent` / `card-fill` / `card-outlined`
- Grids: `grid-12` / `grid-2-9` / `grid-2-9-5` / `span-N`
- Timelines: `timeline-v` + `tl-node` + `tl-axis` + `dot` / `timeline-h` + `tl-h-node` + `tl-h-axis`
- Charts: `kpi-tower-row` + `bar-tower` / `h-bar-chart` + `bar-row` + `bar-fill` / `spec-bars` + `bar-vert`
- Decorations: `dot-mat` (SVG mask solid dots) / `ring-mat` (stroke circles) / `cross-mat` (× grid) / `hr-hairline`
- Layout-specific: `cover-split` / `closing-split` / `duo-compare` + `vrule` / `manifesto-top` + `ink-banner-full` / `three-forces` / `loop-diagram` / `matrix-fill` + `matrix-cell` / `brief-grid` + `brief-card` / `system-diagram` / `why-now-grid` / `four-cards` / `stacked-ledger` + `ledger-row` / `tech-spec` / `image-hero` + `hero-img-wrap` + `hero-overlay-block` + `hero-stats`
- Image mixing: `frame-img` / `fit-contain` / `r-21x9` / `r-16x9` / `r-16x10` / `h-22` / `h-26` / `swiss-img-split` / `swiss-img-grid` / `swiss-img-caption` / `swiss-keyline` / `swiss-lined`
- Spacing tokens: `--sp-3`...`--sp-13` (8/12/16/24/32/40/48/64/80/96/160 px)

#### 3.0.5 · Plan Theme Rhythm (**equally important as class pre-flight**)

**Before picking layouts**, you must list each page's theme class (`hero dark` / `hero light` / `light` / `dark`) and write them in a document or draft to align. Detailed rules are in the "Theme Rhythm Planning" section at the top of `references/layouts.md`.

**Mandatory rules**:

- Every page's section must include one of `light` / `dark` / `hero light` / `hero dark` — do not just write `hero`
- More than 3 consecutive pages with the same theme = visual fatigue — not allowed
- Decks with 8+ pages must have ≥1 `hero dark` + ≥1 `hero light`
- The entire deck cannot be only `light` body pages — there must be `dark` body pages to create breathing room
- Insert 1 hero page every 3-4 pages (cover / chapter divider / question / big quote)

**Post-generation self-check**: `grep 'class="slide' index.html` to list all themes, visually confirm the rhythm is reasonable before delivery.

#### 3.1 · Pick a Layout

**Do not write slides from scratch**. Open the corresponding layouts file — it contains 10 ready-made layout skeletons, each a complete paste-ready `<section>` code block.

**Style A** → `references/layouts.md`:

| Layout | Purpose |
|---|---|
| 1. Opening Cover | Page 1 |
| 2. Chapter Divider | Opening of each act |
| 3. Data Hero | Presenting hard data |
| 4. Left Text + Right Image (Quote + Image) | Identity contrast / storytelling |
| 5. Image Grid | Multi-image comparison / screenshot evidence |
| 6. Two-Column Pipeline | Workflow |
| 7. Suspense Closer / Question Page | End of act / closing |
| 8. Big Quote Page | Serif quotable line / takeaway |
| 9. Side-by-Side Comparison (Before / After) | Old model vs new model |
| 10. Image + Text (Lead Image + Side Text) | Information-dense image-text page |

**Style B** → First read `references/swiss-layout-lock.md`, then read `references/layouts-swiss.md`.

Swiss theme defaults to **Swiss locked mode**:

- Body pages can only use the 22 layouts registered in the original reference PPT: `S01-S22`; new cover/closing pages can only use the explicitly provided `SWISS-COVER-ASCII` / `SWISS-CLOSING-ASCII`.
- Every `<section class="slide">` must include `data-layout="Sxx"`. Missing `data-layout` is treated as an unregistered layout.
- Inventing ad-hoc layouts like `P23/P24`, `Swiss Image Split`, `Evidence Grid` beyond the original 22 pages is not allowed, unless the user explicitly requests experimental layouts.
- Top Chinese headings default to left-aligned on the upper-left content axis. Do not place subheadings in the left column and main headings in the right column, creating visual centering; only original statement/split layouts allow strong center-driven narrative.
- SVG handles geometry only. Do not put text labels in SVG — use HTML grid/card/caption for all labels instead.
- Geography/history/city routes/location relationship pages use `S08 + Swiss Map Component`: first read `references/swiss-map-component.md`, and keep `data-layout="S08"`.

The original 22 body layouts:

| Layout | Purpose |
|---|---|
| S01 Index Cover | Original index cover |
| S02 Vertical Timeline + KPI | Evolution comparison / era transitions |
| S03 Split Statement | Core thesis / left-right split screen |
| S04 Six Cells | 6 concept definitions |
| S05 Three Layers | Three-tier architecture |
| S06 KPI Tower | 4-item data visualization with height contrast |
| S07 H-Bar Chart | 5-10 item ranking comparison |
| S08 Duo Compare | Before/After comparison |
| S09 Dot Matrix Statement | Big quote / statement |
| S10 Split Closing | Closing page |
| S11 Horizontal Timeline | 4-7 step process |
| S12 Manifesto + Ink Banner | Interim conclusion |
| S13 Three Forces | 3 equal-weight concepts deep-dive |
| S14 Loop Form | Self-learning loop / automation |
| S15 Matrix + Hero Stat | 8-12 item matrix + headline stat |
| S16 Multi-card Brief | 6-item news brief cards |
| S17 System Diagram | Three-tier architecture / ecosystem map |
| S18 Why Now | Three arguments + data support |
| S19 Four Cards | 4 equal-weight features |
| S20 Stacked KPI Ledger | Vertical ledger-style data |
| S21 Tech Spec Sheet | Product specs / benchmarks |
| S22 Image Hero | 21:9 top image + title block + three-column KPI |

**Registered extension**: `S08 + Swiss Map Component` is used for locations, residences, routes, and city relationships. It is not a new layout but a MapLibre map component for the right slot of S08; must be implemented following `references/swiss-map-component.md` for markers, connections, cards, and top-right zoom/drag controls.

Pick the matching layout, paste it in, and edit the copy and image paths. **Make sure to complete the 3.0 pre-flight first**.

**Style B layout diversity hard rules**:
- 7-8 page decks must use at least **6 different S-number layouts**; 10+ page decks must use at least 8 different layouts.
- If the user says "test the template / see how it looks / more layout variety", you must cover: one cover, one closing, at least 1 comparison or timeline (S08/S11/S02), at least 1 structural diagram (S14/S17/S15), and at least 1 image layout (S22 or S15/S16 grid adaptation).
- No more than 3 consecutive pages with the same main structure (e.g., three straight pages of `head + grid + card`).
- Image pages must not use improvised new structures. For 2-3 images, adapt the original grid skeleton of S15/S16 into image slots; for a single large image, use S22.
- Before writing HTML, draft a table of `page number → data-layout → selection rationale → image slots`; before delivery, run `node <SKILL_ROOT>/scripts/validate-swiss-deck.mjs index.html`.

#### 3.2 · Image Aspect Ratio Standards

Always use **standard aspect ratios** — never use the source image's odd ratios (like `2592/1798`):

| Scenario | Recommended Ratio |
|----------|-------------------|
| S22 top hero image | **21:9**; keep photo's key subject in the center safe zone |
| S15/S16 multi-image grid | Uniform 21:9 or uniform 16:10 — do not mix |
| Left-text-right-image main image (Style A) | 16:10 or 4:3 + `max-height:56vh` |
| Image grid (Style A) | **Fixed `height:26vh`** — do not use aspect-ratio |
| Left small image + right text | 1:1 or 3:2 |
| Full-screen hero visual | 16:9 + `max-height:64vh` |
| Mixed image-text small illustration | 3:2 or 3:4 |

**Do not let images `align-self:end` by default** — they will slide to the page bottom and easily overlap the pagination component. Use grid container + `align-items:start` (pre-set in the template) to keep images top-aligned; only Style B's P23 can use `.swiss-img-split.align-image-bottom`, because the template has a built-in `--nav-safe-bottom` safe zone for it.

**Style B Swiss style additional rules**:
- Single large image uses S22; multi-image testing uses the original card grid of S15/S16 — do not use unregistered P23/P24
- Before generating images, write `data-image-slot`: e.g., `s22-hero-21x9` / `s15-grid-21x9` / `s16-brief-21x9`
- S22 images default to 21:9; the prompt must include `subject centered in the safe middle area`; photo container uses `object-position:center 35%`, not `top center`
- Image containers must be sharp-cornered, no shadows, no rounded corners; default background uses white `var(--paper)` — do not use gray background with white-background infographics
- White-background GPT infographics/flowcharts/UI images should not have border strokes by default; do not casually apply `.swiss-keyline`; when emphasis is needed, only use `.swiss-lined` top accent line
- For UI/infographic images that are user-submitted raw screenshots or text-dense, use `.fit-contain`; if regenerated to fit S15/S16 slots, must use `.frame-img.r-21x9` / `.frame-img.r-16x10` to fill the container — do not fix `height:18vh` and shrink the image
- Multiple images in the same group must share uniform slot, ratio, and height — no mixing
- GPT Image 2 generated images follow the "Style B: Swiss International Style Image Rules" in `image-prompts.md`
- The bottom edge of any image, caption, timeline label, or footnote must not enter the bottom pagination zone; when content needs to be near the bottom, use `.nav-safe-bottom` / `.nav-safe-bottom-tight` — do not hand-write `bottom:2vh`

#### 3.2.1 · Chinese Heading Font Size Tiers (mandatory for Style B)

Chinese characters have larger visual mass — you cannot directly apply the English hero's 6.8-7vw. Before writing Chinese headings, determine the tier:

| Heading Type | Recommended Font Size |
|---|---|
| 1 line, ≤ 8 Chinese characters | `min(6.4vw,11.2vh)` |
| 2 lines, each ≤ 8 Chinese characters | `min(5.8vw,10.2vh)` |
| 2 lines, any line 9-12 Chinese characters | `min(5.2vw,9.2vh)` |
| 3 lines or longer | Rewrite the heading first; as a last resort use `min(4.6vw,8.2vh)` |

If the heading crowds out the image or body area, shorten the heading copy first, then reduce font size; do not push content below to force-fit.

Component details (fonts, colors, grids, icons, callouts, stat cards, etc.) are in `references/components.md`.

## Related

- [layouts.md](layouts.md)
- [layouts-swiss.md](layouts-swiss.md)
- [swiss-layout-lock.md](swiss-layout-lock.md)
- [components.md](components.md)
- [checklist.md](checklist.md)
