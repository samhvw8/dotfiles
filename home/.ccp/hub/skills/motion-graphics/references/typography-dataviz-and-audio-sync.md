# Kinetic Typography, Data-Viz Choreography & Audio-Visual Synchronization

## Table of Contents
1. [Kinetic Typography Laws & Reflow-Free Rendering](#1-kinetic-typography-laws--reflow-free-rendering)
2. [Animated Infographics & Data-Viz Choreography](#2-animated-infographics--data-viz-choreography)
3. [Audio-Visual Synchronization, Beat Math & Dual-Track Mixing](#3-audio-visual-synchronization-beat-math--dual-track-mixing)

---

## 1. Kinetic Typography Laws & Reflow-Free Rendering

### 1.1 The Saccadic Stability Invariant (Hochuli) & Reading Hold Formula
- **Saccadic Stability Invariant:** *Text that is currently being read MUST NOT move* ([Jost Hochuli, *Detail in Typography*](https://www.skillsdirectory.com/skills/jpoindexter-motion-typography), [Quegenx TIMING.md](https://github.com/Quegenx/agent-skills/blob/main/skills/web-ui/ui-animation/TIMING.md)). Human reading depends on ballistic saccades separated by `200-250 ms` foveal fixations; continuous translation, scaling, or wave distortion defeats fixation and forces re-reading.
  - **Rule:** Complete the entrance animation in **`150-350 ms`**, then hold the text **dead still** (or at most a `1.00x -> 1.02x` slow camera drift) for the entire reading window.
- **Broadcast & Mograph Reading Hold Formula (`160-180 WPM` = `3 words/s` EN; `5 chars/s` ZH):**
  Per [BBC Subtitle Guidelines](https://www.bbc.co.uk/accessibility/forproducts/guides/subtitles/) (`160-180 WPM` = `0.33-0.375 s/word`) with a `1.25x` graphic layout scan multiplier:
  $$T_{\text{hold}} = \max\!\left(1.5\text{ s},\; \left(\frac{N_{\text{words}}}{3.0} + 0.3\text{ s}\right) \times 1.25\right)$$
  - **1-3 words (Impact Stomp / Metric):** Hold `>= 1.0-1.5 s` (`30-45f` @ 30fps).
  - **4-8 words (Headline):** Hold `>= 2.0-3.2 s` (`60-96f` @ 30fps).
  - **Word Density Ceiling (Gate `G2`):** Maximum **`<= 12 words`** (`<= 18 CJK chars`) on screen for kinetic typography scenes (`<= 30 words` inside realistic product UI mockups).
- **1080p Typography Size Floors ([remotion-create/video-layout.md](https://github.com/remotion-dev/skills/blob/main/skills/remotion-create/video-layout.md)):**
  - Hero Headline: **`>= 72-84 px`** (`font-weight: 600-800`, `letter-spacing: -0.02em to -0.04em`, `line-height: 1.05-1.15`).
  - Supporting Subhead / Callout: **`>= 36-44 px`**.
  - UI Mockup / Axis Label Floor: Never render any text smaller than **`24 px`** on a `1920x1080` video canvas (survives mobile portrait feed compression).

### 1.2 Hierarchy of Text Splitting: Line vs. Word vs. Character
Choose split granularity strictly by word count and semantic role:
- **Character-by-Character (`chars`, stagger `12-25 ms`):** Reserve exclusively for **`1-3 word` hero titles, brand wordmarks, or numeric counters**. Never animate a multi-line paragraph by character (produces slow "typewriter nausea").
- **Word-by-Word (`words`, stagger `30-55 ms`):** Use for **`3-8 word` punchy hooks** synchronized to voice-over stressed syllables (`+-100 ms` window, Mayer $d = 1.31$).
- **Line-by-Line Baseline Mask Reveal (`lines`, stagger `60-100 ms`):** The gold standard for **editorial headlines and 2-3 line statements**. Each line rises from `translateY(115%) -> 0%` inside an overflow-clipped mask container on `cubic-bezier(0.16, 1, 0.3, 1)` over `450-650 ms`.

### 1.3 The Baseline Mask Descender Clipping Fix (`.line-mask` Bleed Rule)
When wrapping lines in `overflow: hidden` or `overflow: clip` (including GSAP 3.13+ `SplitText({ type: "lines", mask: "lines" })`), typographic descenders (`g, j, p, q, y` extending to `0.205em` below baseline vs `0.11em` bounding box), Vietnamese/European uppercase diacritics (`Ấ, Ệ`), and italic/negative-tracking overhangs get sliced off ([royeyal/cbwigs PR #20](https://github.com/royeyal/cbwigs/pull/20), [lukePeavey/SplitType #18](https://github.com/lukePeavey/SplitType/issues/18)).
- **Mandatory CSS Fix:** Add bottom/horizontal padding to expand the clip box, paired with an **equal negative margin** so line-height and layout geometry stay unchanged, and translate from `115%` instead of `100%`:

```css
.line-mask {
  overflow: clip;
  padding: 0.06em 0.1em 0.16em 0;
  margin: -0.06em -0.1em -0.16em 0;
}
.line-inner {
  display: block;
  will-change: transform;
  transform: translate3d(0, 115%, 0); /* Clears the extra 0.16em bottom padding */
}
```

### 1.4 Variable Font Axes (`GRAD`, `opsz`, `slnt`) vs. The `wght`/`wdth` Layout Reflow Trap
- **CPU Reflow Trap:** Animating `font-variation-settings: "wght" 300 -> 800` or `"wdth" 85 -> 115` changes every glyph's advance width on every frame, forcing the browser to recompute line breaks and triggering expensive main-thread layout reflow + glyph texture cache eviction.
- **Reflow-Free Solutions:**
  1. **Use the `GRAD` (Grade) Axis (Roboto Flex, Inter Variable, Recursive):** `GRAD` thickens glyph strokes **without changing glyph advance widths by a single subpixel**, achieving smooth weight pulses at zero layout cost.
  2. **Isolate Animated `wght`/`wdth` Words:** If animating `wght` or `wdth` on a hero word, give the container `position: absolute`, `white-space: nowrap`, and fixed width so reflow cannot propagate to sibling DOM nodes.

### 1.5 Rolling Odometer / Slot-Machine Number Tickers (`tabular-nums`)
Never interpolate numbers with plain `Math.round(val).toLocaleString()` in a proportional font — changing `1` to `8` makes the entire string jitter horizontally every frame.
1. Always set `font-variant-numeric: tabular-nums;` (and `font-feature-settings: "tnum" 1;`).
2. For studio-quality KPI reveals, render each digit column as a vertical ribbon `[0..9]` of height `1em` and translate the column vertically by `translateY(-digit * 1em)` with staggered per-column ease-out (`cubic-bezier(0.16, 1, 0.3, 1)`).

### 1.6 Voiceover-Driven Document & Keyword Highlighting (`镜头先动，字随后到`)
When synchronizing camera pushes and text highlights to a voiceover transcript with segment start $st$, end $ed$, and character index ([`Gitruck/gtrk-mg-techniques`](https://github.com/Gitruck/gtrk-mg-techniques/blob/main/skills/doc-reveal/SKILL.md)):
1. **Keyword Timestamp Estimation:** $t_{\text{word}} \approx st + \frac{\text{char\_index}}{\text{total\_chars}} \times (ed - st)$.
2. **Camera Lead (`-0.30 s`):** Start the camera push-in **`0.30 s` (`9 frames` @ 30fps) before** $t_{\text{word}}$ ($t_{\text{cam}} = t_{\text{word}} - 0.30\text{ s}$) so the camera is already moving toward the keyword as the speaker approaches it.
3. **Highlighter Sweep (`+0.60 to +0.80 s` after camera start):** Trigger the marker underline or highlight box **`0.60-0.80 s` after** $t_{\text{cam}}$ (*"推近落定再划"* — settle the camera first, then draw the highlight).

---

## 2. Animated Infographics & Data-Viz Choreography

### 2.1 Perceptual Encoding Hierarchy ([Cleveland & McGill 1984](https://doi.org/10.1080/01621459.1984.10478080); [Heer & Bostock 2010](https://doi.org/10.1145/1753326.1753357))
Select visual forms by human estimation accuracy (lowest error first):
1. **Position along a common aligned scale** (Horizontal/vertical bar chart, dot plot, line chart) — `1.00x` baseline error.
2. **Position along non-aligned scales** (Small multiples / Bento cards) — `1.41x` error.
3. **Length / 1D Height** — `1.68x` error.
4. **Angle / Slope (Pie chart) & 2D Area (Bubble chart)** — `1.96x-2.31x` error. **Rule:** Never use 3D pie charts, multi-ring gauges, or unaligned bubble areas when comparing `>2` values; replace with sorted horizontal bars + direct end-of-bar value labels.

### 2.2 The 3-Stage Data Reveal Choreography ([Heer & Robertson 2007](https://doi.org/10.1109/TVCG.2007.70539), *Animated Transitions in Statistical Data Graphics*)
Never animate axes, gridlines, data bars, and callout badges all at the same frame. Choreograph every chart in 3 distinct stages:
- **Stage 1 — Coordinate Scaffolding (`0-200 ms` / `f 0-6`):** Fade in axes, baseline, and unit labels (`opacity: 0 -> 1`, `150 ms`) so the viewer's spatial reference frame is established before data moves.
- **Stage 2 — Data Geometry Growth (`150-750 ms` / `f 5-23`):**
  - *Bar Charts:* Scale from baseline (`scaleY(0 -> 1)` with `transform-origin: bottom` or `scaleX(0 -> 1)` with `transform-origin: left`) staggered by **`35-50 ms` per bar** on `cubic-bezier(0.16, 1, 0.3, 1)`.
  - *Line / Area Charts:* Draw the stroke left-to-right via `pathLength="1"` + `stroke-dashoffset: 1 -> 0` over `500-700 ms`, while fading the area gradient fill `120 ms` behind the leading stroke head.
  - *Stacked-to-Grouped Morphs:* Per Heer & Robertson, split transition into two sub-steps (**animate Y-positions first, then animate X-widths/heights**, or vice versa) with `150 ms` overlap — simultaneous X+Y+size interpolation drops tracking accuracy by `24%`.
- **Stage 3 — Focal Isolation & Callout Landing (`+2 frames` after peak bar settles):**
  Dim non-target comparison bars to `opacity: 0.35` (or neutral slate `#64748B`), highlight the winner bar in high-luminance accent (`#FFBE0B` / `#10B981`), and pop the direct numeric delta badge (`+38.4%`) `2 frames` *after* the bar reaches full height.

---

## 3. Audio-Visual Synchronization, Beat Math & Dual-Track Mixing

### 3.1 The Asymmetric Audio-Visual Binding Window (`[-40 ms, +160 ms]`)
Because light reaches the retina immediately and visual cortex processing is slower than cochlear hair-cell transduction, human perception of simultaneity is **asymmetric** ([ITU-R BT.1359-1](https://www.itu.int/rec/R-REC-BT.1359-1-199811-I/en); [Shams et al. 2000](https://doi.org/10.1038/35048669); [Vroomen & Keetels 2010](https://doi.org/10.3758/APP.72.4.888)):
- **Audio Early Tolerance (`< -40 ms` / `> 1 frame` before visual):** Strongly rejected! If an impact thud plays `2-3 frames` *before* the visual collision, the brain immediately detects a broken sync glitch.
- **Audio Late Sweet Spot (`0 to +66 ms` / `0 to +2 frames` at 30fps):** Highest perceived punch and physical weight. Align impact transients **`0 to +1 frame` (`0 to +33 ms`) after** the visual contact frame.

### 3.2 Exact Beat-to-Frame Quantization Math (Never Accumulate Rounded Intervals)
Given tempo $\text{BPM}$ and frame rate $\text{fps}$:
$$T_{\text{beat}} = \frac{60}{\text{BPM}}\text{ seconds}, \qquad F_{\text{beat}} = \frac{60 \cdot \text{fps}}{\text{BPM}}\text{ frames/beat}$$
- **Anti-Drift Rule:** When $\text{BPM}$ does not divide $60 \cdot \text{fps}$ evenly (e.g., `128 BPM` at `30 fps` $= 14.0625\text{ f/beat}$), rounding to `14 frames` and multiplying `n * 14` drifts by `2 full frames` (`67 ms`) after 32 beats! Always compute exact floating-point beat time and round per beat $n$:
  $$f_n = \text{Math.round}\!\left(n \cdot \frac{60 \cdot \text{fps}}{\text{BPM}}\right)$$

### 3.3 The "Settle on the Beat" Rule & Sound Effect Pre-Roll Offsets
Amateur editors start an animation *on* the beat frame $f_n$, meaning the element lands mid-beat while nothing happens on the musical transient.
- **Studio Rule (Settle on the Beat):** If a fast entrance takes $D_{\text{impact}}$ frames to reach its primary visual snap (typically the first `6-8 frames` of a `16-frame` ease-out where `80%` of travel completes), **start the animation at frame $f_n - D_{\text{impact}}$** so the element **hits its resting coordinate or peak overshoot on frame $f_n$**.

| Sound Effect Archetype | Frame Offset Relative to Visual Event ($f_n$) | Frequency Band | Purpose |
|---|---|---|---|
| **Whoosh / Swish (Fast Pan / Whip)** | Start **`-4 to -6 frames`** (`-130 to -200 ms`); peak amplitude at **`-1 to 0f`** | `400 Hz – 4 kHz` | Anticipates velocity peak of camera pan or shape throw |
| **Riser / Reverse Cymbal** | Start **`-15 to -30 frames`** (`-0.5 to -1.0 s`); hard cut at **`f_n`** | `200 Hz – 8 kHz` | Builds tension into a major hero reveal or paradox hook |
| **Impact Thud / Sub Drop** | Trigger at **`0 to +1 frame`** (`0 to +33 ms`) | `50 – 180 Hz` | Gives physical mass when a hero card or stomp word lands |
| **UI Click / Tactile Pop / Tick** | Trigger at **`0 to +2 frames`** (`0 to +66 ms`) | `1.5 – 6 kHz` | Confirms button press, toggle flip, or odometer digit step |
| **Chime / Shimmer** | Trigger at **`+2 to +4 frames`** (`+66 to +133 ms`) | `3 – 10 kHz` | Highlights final metric badge or brand logo settle |

### 3.4 Dual-Track Frequency Isolation & Non-Normalized FFmpeg Mixing
When layering background music (BGM) under UI/mograph SFX and voice-over (VO):
1. **Spectral Pocket Carving:** Apply `lowpass=f=4000` (or a `-4 dB` dip at `1-4 kHz`) to the BGM bed so voice consonants and crisp UI clicks (`800 Hz – 6 kHz`) cut through without raising master volume.
2. **Loudness Hierarchy (MediaStorm / Broadcast Standard):**
   - **With Voice-Over:** VO at **`-14 to -16 LUFS`** (`-1 dBTP`), UI/Mograph SFX at **`-18 to -20 LUFS`**, BGM ducked **`20-22 dB` below VO** (`-26 to -34 LUFS`, `volume=0.10-0.18`).
   - **Music-Driven Promo (No VO):** BGM at **`-14 to -16 LUFS`**, SFX `6-8 dB` below peak transients.
3. **FFmpeg `amix` Trap (`normalize=0`):** Since FFmpeg 5.0+, `amix` defaults to `normalize=1`, which divides every track's volume by $1/N_{\text{inputs}}$ and causes sudden volume jumps whenever an SFX clip starts or ends! Always pass **`normalize=0`** paired with `alimiter`:
   ```bash
   ffmpeg -i video.mp4 -i bgm.wav -i sfx.wav -filter_complex \
     "[1:a]volume=0.22,lowpass=f=4200,afade=t=in:st=0:d=0.8,afade=t=out:st=28.5:d=1.5[bgm]; \
      [2:a]volume=0.65,highpass=f=120[sfx]; \
      [bgm][sfx]amix=inputs=2:duration=first:normalize=0,alimiter=limit=0.95[aout]" \
     -map 0:v -map "[aout]" -c:v copy -c:a aac -b:a 192k output.mp4
   ```
