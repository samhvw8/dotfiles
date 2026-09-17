# Swiss Layout Lock

This file contains hard constraints for the Swiss theme. Its purpose is not to add inspiration, but to prevent generated output from "looking Swiss but having drifted from the original template."

## Golden Source

Original reference file:

`/Users/guohao/Documents/op7418的仓库/项目/Thin-Harness-Fat-Skills/ppt/index.html`

When generating Swiss-themed slides, only the 22 registered layouts listed below may be used — unless the user explicitly requests an experimental layout. Cover/closing pages may use the IKB ASCII version from the Skill, but body pages must come from these 22 layouts.

## Hard Rules Before Generation

1. Every body page must first select a registered layout and include `data-layout="Sxx"` on its `<section>`.
2. Do not invent ad-hoc body structures like `P23/P24` that do not appear in the original 22P set. When images are needed, prefer `S22 Image Hero`; for multiple images, adapt the original grid skeleton of `S15/S16` into image cells — do not invent a new evidence wall. The only registered interactive extension is `S08 + Swiss Map Component`; see `references/swiss-map-component.md` for details.
3. Top Chinese titles default to left-aligned, hugging the upper-left content axis. Do not center-align large titles horizontally — except in the original `S03/S09/S10` statement/split layouts.
4. SVG may only contain geometric lines, circles, arrows, and paths. Do not place visible text inside SVG; all text labels must be placed in HTML within grids, cards, or captions.
5. Image slots and image generation aspect ratios must be bound together. Determine the layout and slot first, then generate the image.

## Registered Layouts

| ID | Original Page | Name | Required Skeleton | Image Rules |
|---|---:|---|---|---|
| S01 | 01 | Index Cover | Three `cover-row` rows; large number on the left, large title on the right | None |
| S02 | 02 | Vertical Timeline + KPI | Left-aligned title at top, `.timeline-v` in the middle, `.kpi-row-4` at the bottom | None |
| S03 | 03 | Split Statement | `.slide.split` dual half-screen; large text on the left, gray-background explanation on the right | None |
| S04 | 04 | Six Cells | Left-aligned title at top, `.sub-grid-3-2` six cards below | Cards may contain small icons internally; no large images |
| S05 | 05 | Three Layers | Left-aligned title at top, `.stack-row` three large blocks below | None |
| S06 | 06 | KPI Tower | Title on the left + description on the right, unequal-height KPI tower below | None |
| S07 | 07 | Horizontal Bar | Left-aligned title, horizontal bar chart | None |
| S08 | 08 | Duo Compare | `.duo-compare` two columns + center divider | None; location/route content may use `S08 + Swiss Map Component` to replace the right-side slot |
| S09 | 09 | Dot Matrix Statement | Large statement + dot-matrix decoration | None |
| S10 | 10 | Split Closing | `.slide.split` large text on the left, list on the right | None |
| S11 | 11 | Horizontal Timeline | Original `grid-template-columns:auto 1fr` header + `.timeline-h` | None |
| S12 | 12 | Manifesto + Ink Banner | Large statement + full-width ink banner at the bottom | None |
| S13 | 13 | Three Forces | Ink hero block on the left + 3 cards on the right | None |
| S14 | 14 | Loop Form | 4-step list on the left + geometric loop on the right | SVG must not contain text; labels must be HTML |
| S15 | 15 | Matrix + Hero Stat | Left-aligned title at top, 6×2 matrix in the middle, large number at the bottom | Multiple images may adapt the matrix cells; use uniform `21:9` within the same group |
| S16 | 16 | Multi-card Brief | Left-aligned title at top, 3×2 micro-cards below | Multiple images may adapt card content; use uniform `21:9` within the same group |
| S17 | 17 | System Diagram | Small title on the left + paragraph on the right at top, geometric system diagram in the middle, three-column explanation at the bottom | SVG must not contain text; labels must be HTML |
| S18 | 18 | Why Now | Three progressive columns + large number at the bottom | None |
| S19 | 19 | Four Cards | Blue line at top + four equal-width columns | None |
| S20 | 20 | Stacked KPI Ledger | Vertical ledger-style large numbers | None |
| S21 | 21 | Tech Spec Sheet | Large title + three KPIs + vertical-line matrix at bottom-right | None |
| S22 | 22 | Image Hero | Full-width image at top + white-block title at upper-left + three-column KPI below | Main image generated at `21:9`; key subject placed in the center safe zone |

## Registered Extension Components

### S08 + Swiss Map Component

- Use cases: geography, history, city routes, store/campus/event locations, residential relationships of historical figures.
- Layout identity: still `data-layout="S08"` — not a new body page.
- Page structure: left-aligned title at top + relationship/description cards on the left + MapLibre map card on the right.
- Marker structure: dots + connector lines + HTML cards; SVG only draws fallback relationship lines — no text.
- Interaction controls: `+` / `-` / `DRAG` buttons must appear at the upper right; scroll-wheel zoom and drag are disabled by default to avoid triggering PPT page navigation.
- See `references/swiss-map-component.md` for detailed code and data contracts.

## Image Slot Rules

### S22 · Hero Strip

- Aspect ratio: `21:9`
- Image use: real-world scenes, product scenes, UI scenario images.
- Generation prompt must include: `21:9 ultra-wide strip`, `subject centered in the safe middle area`, `no title, no footer, no page chrome, no logo, no border`.
- HTML container must use the original S22 full-width image skeleton at the top; do not replace it with a generic centered large image.
- Photos use `object-fit:cover;object-position:center 35%`. Do not use `top center` for portrait/conference scenes.
- Infographics/UI screenshots placed in S22 must be regenerated close to `21:9` and use `object-fit:contain`, or ensure core content falls within the central 70% safe zone.

### S15/S16 · Multi Image Grid

- Aspect ratio: use uniform `21:9` or uniform `16:10` — do not mix ratios.
- All images in the same group must have identical height, width, and container background.
- Image cells must snap to the original card grid; do not let images determine their own dimensions.
- If images are regenerated per-slot as `s15-grid-21x9` / `s16-brief-21x9`, the container must use `.frame-img.r-21x9` to fill the slot. Do not add `.fit-contain`, and do not use fixed `height:18vh` or similar short-slot values that shrink wide images.
- `.fit-contain` is only for user screenshots or text-dense images that must preserve their original aspect ratio. Once you decide to regenerate an image, generate it at the slot's aspect ratio and fill the slot.
- If the original screenshot has an uncontrollable aspect ratio, first use GPT Image 2 to regenerate a "screenshot redesign," then insert it into the fixed slot.

## Prohibited List

- Do not use `text-align:center` on top Chinese titles.
- Do not place the top title inside the right `7.8fr` column, creating a visual center alignment.
- Do not use unregistered body pages — e.g., ad-hoc `Swiss Image Split`, `Evidence Grid`, or self-drawn three-circle diagram pages.
- Do not place a gray-background image container around a white-background infographic.
- Do not use `<text>` inside SVG as visible labels.
- Do not default to `object-position:top center` for photos.
