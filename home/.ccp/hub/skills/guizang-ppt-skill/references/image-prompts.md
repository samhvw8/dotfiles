# GPT Image 2 Image Prompt Templates

Used for generating PPT illustrations in a Codex environment for this skill. Prompts should only set the tone — don't turn them into lengthy descriptions. First determine the image slot and aspect ratio, then choose the type.

## General Rules

- First determine the current deck style: Style A = e-magazine x e-ink; Style B = Swiss International Style
- Style A tone: e-magazine x e-ink — restrained, authentic, generous whitespace, suited for landscape web PPTs
- Style B tone: Swiss International Typographic Style — 12/16 column grid, Helvetica/Inter aesthetic, single high-saturation accent, sharp-cornered solids, hairline rules, extreme whitespace
- Text in infographics, charts, and screenshot redesigns must match the user's language: Chinese decks use Chinese, English decks use English
- Do not generate cartoon, 3D, neon tech-style, SaaS template-style, over-decorated, or fake logo imagery
- Images should leave space for title or body text overlay — don't fill the entire frame with detail
- All images on the same page or in the same group must use the same aspect ratio, the same visual scale, and the same margin density
- Illustrations are assets embedded in a PPT, not standalone slides: do not generate headers, footers, page numbers, title bars, corner badges, credits, decorative borders, or slide chrome
- After generation, save to `images/` with the naming pattern `{slide-number}-{semantic-label}.{ext}`

## Model Selection Guide

Choose the right model based on content type and language:

| Content Type | Recommended Model | Why |
|---|---|---|
| Documentary/editorial photography | Midjourney V8+ (`--sref` for style lock) | Best aesthetic quality, cinematic realism |
| Infographics (English labels) | GPT Image 2 | 99% text accuracy, reasoning-based layout |
| Infographics (Chinese labels) | Qwen-Image 2.0 | 97%+ Chinese text accuracy, open-source |
| Swiss flat graphics / diagrams | GPT Image 2 or Recraft V4 | GPT understands grid composition; Recraft outputs SVG |
| Multi-image consistency | Midjourney V8 `--sref <code>` | Style reference codes lock visual identity across a set |

**Style consistency tip**: Define a "style block" — a fixed text chunk describing medium, lighting, color palette, and atmosphere — and append it verbatim to every prompt in a deck. This forces visual coherence across all generated images.

**Aspect ratio via API**: GPT Image 2 accepts custom dimensions (multiples of 16px, max ratio 3:1). For 21:9 banners, specify `2688×1152`. For 16:10, specify `1600×1000`.

## Aspect Ratio Selection

| Use case | Recommended ratio | HTML slot |
|------|---------|-----------|
| Chapter cover / full-screen hero visual | 16:9 | `.frame-img.r-16x9` or hero background reference |
| Swiss-style top banner / Image Hero | 16:9 or 21:9 | P22 top cover image / `.frame-img.r-21x9` |
| Left-text right-image main visual | 16:10 or 4:3 | `.frame-img.r-16x10` / `.frame-img.r-4x3` |
| Infographic / system diagram | 16:9 or 16:10 | Use `.fit-contain` for raw screenshots; use `.frame-img.r-16x9` / `.frame-img.r-16x10` to fill when regenerating for a slot |
| Screenshot redesign / UI scenario | 16:10 or 21:9 | Use `.fit-contain` for raw screenshots; use `.frame-img.r-21x9` to fill when regenerating for S15/S16 |
| Mixed text-image small visual | 3:2 or 3:4 | `.frame-img.r-3x2` / `.frame-img.r-3x4` |
| Image grid | Uniform landscape | `.frame-img.h-22` / `.frame-img.h-26` |
| Small panel group | Uniform landscape | `.frame-img.h-16` / `.frame-img.h-18` |

For infographics and screenshot redesigns from uncontrollable source material, prefer `fit-contain` to avoid cropping text. When GPT Image 2 regenerates to fit a specific slot, it must match the slot's aspect ratio and fill the container — don't let a small image float in a white frame. For documentary photos, prefer the default `cover` to maintain visual tension.

## Image Standardization Strategy

### A. Choose the Target Slot First

Don't generate an image and then force-fit it into a page. Decide the image slot first:

1. Hero visual: 16:9
2. Left-text right-image: 16:10 or 4:3
3. Infographic / screenshot redesign: 16:9 or 16:10, using `fit-contain`
4. Multi-image grid / panel group: uniform height class — mixing heights within the same group is prohibited

### B. Handling User-Supplied Images / Screenshots

Raw screenshots usually have unpredictable aspect ratios — don't use them directly as the final visual standard. Process in this order:

1. If the original image's ratio is close to the target slot, place it directly in a unified `.frame-img` using `cover` or `fit-contain`
2. If the original is too tall, too narrow, or too wide, prefer "screenshot redesign / UI scenario" to regenerate at the target ratio
3. If a UI image has been stretched into an extremely long strip, split it into 2-3 same-sized partial panels; each panel uses the same height class
4. If the original must be preserved, place it in a unified frame with `fit-contain`, accept the whitespace, and don't crop out key text

### C. Generation Prompt Suffix

Append a spec constraint at the end of every image prompt:

```text
Output must be a [16:9/16:10/4:3/3:2] landscape composition with the subject centered but with margins preserved, medium density, matching the same visual scale and margins as other images in the group. Keep only the core graphic/image itself — do not generate headers, footers, titles, page numbers, corner badges, credits, decorative borders, extra-long strips, portrait orientation, or irregular aspect ratios.
```

GPT Image 2's reasoning mode pre-plans layouts before rendering — keep prompts concise and let the model reason about composition.

When multiple images are needed on the same page, add:

```text
This is one image in a group — please maintain the same aspect ratio, element size, margins, line weight, and annotation density as the other images in the group.
```

## Type 1: Documentary Photography

Used to add a sense of presence, emotion, and real-world anchoring.

```text
Generate a landscape documentary photography image. Subject: [page concept]. Style like Fujifilm / Leica editorial documentary — natural light, low saturation, slight film grain, authentic work or life scene, restrained with a humanistic warmth. Suitable for an e-magazine x e-ink PPT, leaving space for a title overlay. No commercial posed shots, sci-fi interfaces, AI robots, logos, or watermarks. Output must be a [16:9/16:10/4:3] landscape composition with the subject centered but with margins preserved, medium density. Keep only the core photo itself — do not generate headers, footers, titles, page numbers, corner badges, credits, decorative borders, extra-long strips, portrait orientation, or irregular aspect ratios.
```

## Type 2: Magazine-Style Infographic

Used to explain concepts, processes, comparisons, and system relationships.

```text
Generate a landscape magazine-style infographic explaining: [concept/process/relationship]. E-ink style — primarily black, white, and grey with minimal low-saturation accent color, thin lines, grid, numbering, short labels, generous whitespace. Text in the image uses [Chinese/English] and should be short and readable. No cartoon, 3D, neon tech-style, or template aesthetics. Output must be a [16:9/16:10] landscape composition with the subject centered but with margins preserved, medium density. Keep only the core infographic itself — do not generate headers, footers, titles, page numbers, corner badges, credits, decorative borders, extra-long strips, portrait orientation, or irregular aspect ratios.
```

## Type 3: Process / Pipeline Diagram

Used to clearly show a progression from A to B to C.

```text
Generate a landscape process infographic showing: [Step 1] → [Step 2] → [Step 3] → [Result]. Style: e-magazine x e-ink — thin arrows, numbered segments, short annotations, restrained whitespace. Text in the image uses [Chinese/English]. Keep only the core process diagram itself — no headers, footers, titles, page numbers, corner badges, credits, or decorative borders. Ratio: 16:9.
```

## Type 4: Comparison Diagram

Used for before/after, old vs. new paradigms, two collaboration methods side by side.

```text
Generate a landscape comparison infographic. Left side: [old paradigm], right side: [new paradigm]. Style like an analytical diagram from a premium independent magazine — black, white, grey plus one low-saturation accent color, thin column dividers, short labels, clear hierarchy. Text in the image uses [Chinese/English]. Keep only the core comparison diagram itself — no headers, footers, titles, page numbers, corner badges, credits, or decorative borders. Ratio: 16:9.
```

## Type 5: System Relationship Diagram

Used for relationships among multiple roles, tools, or modules.

```text
Generate a landscape system relationship diagram showing how [roles/tools/modules] connect to each other. E-ink magazine style — nodes, thin lines, arrows, numbering, and minimal short annotations, clear structure, generous whitespace. Text in the image uses [Chinese/English]. Keep only the core relationship diagram itself — no headers, footers, titles, page numbers, corner badges, credits, or decorative borders. Ratio: 16:9.
```

## Type 6: Screenshot Redesign / UI Scenario

Used to transform real screenshots, code, design mockups, and workspaces into unified visual assets.

```text
Generate a landscape UI scenario image, redesigning [screenshot/interface/workspace content] into a visual suitable for a magazine-style PPT. Preserve the feel of a real product workflow — use paper-toned background, thin wireframes, grid, minimal annotations, and restrained shadows. Text in the image uses [Chinese/English], short and clear. No real brand logos, flashy dashboards, neon gradients, or excessive skeuomorphism. Output must be a 16:10 landscape composition with the subject centered but with margins preserved, medium density. Keep only the core UI image itself — do not generate headers, footers, titles, page numbers, corner badges, credits, decorative borders, extra-long strips, portrait orientation, or irregular aspect ratios.
```

## Type 7: Data Poster Visual

Used to highlight a single key number or a small set of metrics.

```text
Generate a landscape data poster visual. Key number: [number], meaning: [meaning]. Style: e-ink magazine layout — oversized serif numerals, minimal short annotations, thin rules, whitespace, and paper texture. Text in the image uses [Chinese/English]. Keep only the core data visual itself — no headers, footers, titles, page numbers, corner badges, credits, or decorative borders. Ratio: 16:9.
```

---

## Style B: Swiss International Style Image Rules

When the deck uses `assets/template-swiss.html` / `layouts-swiss.md`, prefer the prompt templates below. They pair with GPT Image 2 and are designed to generate images that drop directly into the raw layout slots — especially the S22 top banner and S15/S16 multi-image grids.

### Swiss Image Hard Rules

- Visual anchors: International Typographic Style / Swiss modernism / Helvetica / Josef Müller-Brockmann / Massimo Vignelli
- Composition: strict 12/16 column grid, asymmetric whitespace, left-aligned, hairline rules, sharp-cornered modules
- Color: use only black, white, grey, and **one** theme accent (default IKB blue; if the user selects Lemon Yellow / Lemon Green / Safety Orange, substitute the corresponding accent)
- Prohibited: gradients, shadows, rounded corners, glassmorphism, neon, 3D, cartoon, SaaS template aesthetics, fake logos, decorative borders
- Do not generate PPT chrome inside the image: no headers, footers, page numbers, title bars, corner badges, credits, or outer frames
- UI / infographic text must be short and maintain Chinese/English language consistency; real photos should ideally contain no text
- Determine the layout slot before generating: use `s22-hero-21x9` for a single large image; use `s15-grid-21x9` or `s16-brief-21x9` for multi-image grids
- 21:9 images must keep the core subject within the center 70% safe zone with whitespace around the edges; don't place faces, key nodes, or UI text at the edges

### Swiss Type 1: Documentary Photo / Case Study Hero

Used for S22 Image Hero to add real-scene anchoring.

```text
Generate a 21:9 ultra-wide landscape documentary photography image. Subject: [page concept]. Style: Swiss editorial documentary — high contrast, low saturation, calm and restrained, authentic office/urban/product-in-use scene. Composition with generous negative space, subject within the center 70% safe zone, suitable for the top banner of a Swiss International Style PPT. No AI robots, sci-fi interfaces, commercial posed shots, logos, watermarks, or text. Keep only the core photo itself — no headers, footers, titles, page numbers, corner badges, credits, decorative borders, or PPT chrome.
```

### Swiss Type 2: Infographic / System Diagram

Used to explain concepts, architecture, processes, and abstract topics like data-presentation separation.

```text
Generate a landscape Swiss Style infographic explaining: [concept/process/system relationship]. Use Helvetica/Inter-aesthetic sans-serif short labels, 12/16 column grid, sharp-cornered modules, 1px hairline rules, black-white-grey plus one [IKB blue/Lemon Yellow/Lemon Green/Safety Orange] accent. Text in the image uses [Chinese/English], with each label no longer than 8 characters/words. No gradients, shadows, rounded corners, 3D, cartoon, neon, or SaaS template aesthetics. Output ratio: [21:9/16:10], subject centered with generous whitespace. Keep only the core infographic itself — no headers, footers, titles, page numbers, corner badges, credits, decorative borders, or PPT chrome.
```

### Swiss Type 3: Screenshot Redesign / UI Scenario

Used to transform screenshots, workspaces, code, and dashboards into unified Swiss-style visuals.

```text
Generate a landscape UI scenario image, redesigning [screenshot/interface/workspace content] in Swiss International Typographic Style. Use a minimal dashboard / workspace structure with sharp-cornered panels, hairline rules, 12-column grid, minimal [IKB blue/Lemon Yellow/Lemon Green/Safety Orange] accent, no shadows, no rounded corners. Text in the image uses [Chinese/English], short and clear — no real brand logos. Output must be a 16:10 landscape composition with medium visual density, suitable for `.frame-img.r-16x10.fit-contain`. Keep only the core UI image itself — no headers, footers, titles, page numbers, corner badges, credits, decorative borders, or PPT chrome.
```

### Swiss Type 4: Multi-Image Grid Single Asset

Used for S15/S16 image grid adaptations — generated one at a time when 2-6 images are arranged side by side.

```text
Generate a landscape evidence image. Subject: [Evidence A/B/C]. This is one image in a Swiss Style group — please maintain sharp-cornered modules, black-white-grey, single [IKB blue/Lemon Yellow/Lemon Green/Safety Orange] accent, identical margins, identical line weight, and identical visual scale. Text in the image uses [Chinese/English] — short labels only. Output must be a [21:9/16:10] landscape composition, suitable for the S15/S16 unified image grid. Keep only the core image itself — no headers, footers, titles, page numbers, corner badges, credits, decorative borders, or PPT chrome.
```

### Swiss Type 5: Minimal Chart / Data Block

Used for small data explanation graphics in S21 or S15/S16 image grids.

```text
Generate a landscape Swiss Style data chart. Key data: [number/comparison/ranking], meaning: [description]. Use oversized sans-serif numerals, 1px hairline rules, sharp-cornered color blocks, black-white-grey plus one [IKB blue/Lemon Yellow/Lemon Green/Safety Orange] accent — like a data layout from a Swiss poster. Text in the image uses [Chinese/English] — keep only essential labels. No gradients, shadows, rounded corners, 3D, or decorative borders. Ratio: [16:9/16:10]. Keep only the core data chart itself — no headers, footers, titles, page numbers, corner badges, credits, or PPT chrome.
```
