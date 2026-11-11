# Kinetic Typography, Data-Viz Choreography & Audio-Visual Synchronization

> Labels: **[M]** math, derived and checked. **[S]** named source that was read. **[H]** practitioner heuristic: a starting value, not a finding. Change an [H] value when the frames say so. Recompute numbers with `scripts/motion_math.py`.

## Table of Contents
1. [Kinetic Typography Laws & Reflow-Free Rendering](#1-kinetic-typography-laws--reflow-free-rendering)
2. [Animated Infographics & Data-Viz Choreography](#2-animated-infographics--data-viz-choreography)
3. [Audio-Visual Synchronization, Beat Math & Dual-Track Mixing](#3-audio-visual-synchronization-beat-math--dual-track-mixing)

---

## 1. Kinetic Typography Laws & Reflow-Free Rendering

### 1.1 [H] Text Being Read Does Not Move, and the Reading Hold
- **Stability rule:** *Text that the viewer is reading does not move.* Reading uses short jumps of the eye between fixations of about `200-250 ms`; text that keeps translating, scaling or waving defeats the fixation and forces re-reading. This is a practitioner rule. It is often credited to Jost Hochuli, but no primary source for that was found.
  - Finish the entrance in **`150-350 ms`**, then hold the text still (a `1.00x -> 1.02x` camera drift is the most it tolerates) for the reading window.
- **Reading hold:** at about 3 words per second ([S] BBC subtitle guidance, `160-180 WPM`; `5 chars/s` for Chinese):
  $$T_{\text{hold}} = \max\!\left(0.8\text{ s},\; \frac{N_{\text{words}}}{3}\right)$$
  Add about 25% when the viewer must also scan a layout (a chart, a UI mock) to find the words.
  - **1-3 words:** hold `>= 0.8-1.0 s`. **4-8 words:** `1.3-2.7 s`. **12 words:** `4.0 s`.
  - A scene that lasts `2.0-3.5 s` therefore carries about 6-9 words at most. Cut words before you cut the hold.
  - **Word ceiling:** about **`12 words`** (`18 CJK chars`) on screen for kinetic typography; up to `30 words` inside a realistic product UI mock, where the viewer reads only the highlighted part.
- **Type size:**
  - **[S]** The text the viewer must read is at least `0.04 H` tall (`43 px` at 1080 high). This is the motionmaxxing "proof readable" gate, one author's measured taste.
  - **[H]** Landscape 1080p: hero headline `>= 72 px` (`font-weight: 600-800`, `letter-spacing: -0.02em to -0.04em`, `line-height: 1.05-1.15`), supporting text `>= 36 px`, nothing under `24 px`.
  - Vertical 1080×1920 minimums are in `delivery-safety-and-export.md` §2.

### 1.2 [H] Hierarchy of Text Splitting: Line vs. Word vs. Character
Choose split granularity strictly by word count and semantic role:
- **Character-by-Character (`chars`, stagger `12-25 ms`):** Reserve exclusively for **`1-3 word` hero titles, brand wordmarks, or numeric counters**. Never animate a multi-line paragraph by character (produces slow "typewriter nausea").
- **Word-by-Word (`words`, stagger `30-55 ms`):** Use for **`3-8 word` punchy hooks** synchronized to the stressed syllables of the voice-over.
- **Line-by-Line Baseline Mask Reveal (`lines`, stagger `60-100 ms`):** The gold standard for **editorial headlines and 2-3 line statements**. Each line rises from `translateY(115%) -> 0%` inside an overflow-clipped mask container on `cubic-bezier(0.16, 1, 0.3, 1)` over `450-650 ms`.

### 1.3 The Baseline Mask Descender Clipping Fix (`.line-mask` Bleed Rule)
When wrapping lines in `overflow: hidden` or `overflow: clip` (including GSAP 3.13+ `SplitText({ type: "lines", mask: "lines" })`), typographic descenders (`g, j, p, q, y` extending to `0.205em` below baseline vs `0.11em` bounding box), Vietnamese/European uppercase diacritics (`Ấ, Ệ`), and italic/negative-tracking overhangs get sliced off ([royeyal/cbwigs PR #20](https://github.com/royeyal/cbwigs/pull/20), [lukePeavey/SplitType #18](https://github.com/lukePeavey/SplitType/issues/18)).
- **Fix [S, from the cited pull request; values not re-fetched]:** Add bottom and right padding to enlarge the clip box, with an **equal negative margin** so line-height and layout stay unchanged. Park the inner line far enough below to clear the added padding (`105-125%`):

```css
.line-mask {
  overflow: clip;
  padding: 0 0.1em 0.15em 0;
  margin: 0 -0.1em -0.15em 0;
}
.line-inner {
  display: block;
  will-change: transform;
  transform: translate3d(0, 115%, 0);
}
```
Check one still with `g`, `y` and an accented capital at the hold frame; fonts differ in descender depth.

### 1.4 Variable Font Axes (`GRAD`, `opsz`, `slnt`) vs. The `wght`/`wdth` Layout Reflow Trap
- **CPU Reflow Trap:** Animating `font-variation-settings: "wght" 300 -> 800` or `"wdth" 85 -> 115` changes every glyph's advance width on every frame, forcing the browser to recompute line breaks and triggering expensive main-thread layout reflow + glyph texture cache eviction.
- **Reflow-Free Solutions:**
  1. **Use the `GRAD` (Grade) Axis (Roboto Flex, Inter Variable, Recursive):** `GRAD` thickens glyph strokes **without changing glyph advance widths**, so nothing shifts. The browser still re-shapes and repaints the text on each change, so it is cheaper than `wght`, not free.
  2. **Isolate Animated `wght`/`wdth` Words:** If animating `wght` or `wdth` on a hero word, give the container `position: absolute`, `white-space: nowrap`, and fixed width so reflow cannot propagate to sibling DOM nodes.

### 1.5 Rolling Odometer / Slot-Machine Number Tickers (`tabular-nums`)
Never interpolate numbers with plain `Math.round(val).toLocaleString()` in a proportional font — changing `1` to `8` makes the entire string jitter horizontally every frame.
1. Always set `font-variant-numeric: tabular-nums;` (and `font-feature-settings: "tnum" 1;`).
2. For studio-quality KPI reveals, render each digit column as a vertical ribbon `[0..9]` of height `1em` and translate the column vertically by `translateY(-digit * 1em)` with staggered per-column ease-out (`cubic-bezier(0.16, 1, 0.3, 1)`).

### 1.6 [H] Voiceover-Driven Document & Keyword Highlighting (one author's recipe) (`镜头先动，字随后到`)
When synchronizing camera pushes and text highlights to a voiceover transcript with segment start $st$, end $ed$, and character index ([`Gitruck/gtrk-mg-techniques`](https://github.com/Gitruck/gtrk-mg-techniques/blob/main/skills/doc-reveal/SKILL.md)):
1. **Keyword Timestamp Estimation:** $t_{\text{word}} \approx st + \frac{\text{char\_index}}{\text{total\_chars}} \times (ed - st)$.
2. **Camera Lead (`-0.30 s`):** Start the camera push-in **`0.30 s` (`9 frames` @ 30fps) before** $t_{\text{word}}$ ($t_{\text{cam}} = t_{\text{word}} - 0.30\text{ s}$) so the camera is already moving toward the keyword as the speaker approaches it.
3. **Highlighter Sweep (`+0.60 to +0.80 s` after camera start):** Trigger the marker underline or highlight box **`0.60-0.80 s` after** $t_{\text{cam}}$ (*"推近落定再划"* — settle the camera first, then draw the highlight).

---

## 2. Animated Infographics & Data-Viz Choreography

### 2.1 [S] Perceptual Encoding Ranking ([Cleveland & McGill 1984](https://doi.org/10.1080/01621459.1984.10478080); [Heer & Bostock 2010](https://doi.org/10.1145/1753326.1753357))
People judge these encodings from most to least accurately:
1. **Position along a common aligned scale** (bar chart, dot plot, line chart).
2. **Position along non-aligned scales** (small multiples).
3. **Length.**
4. **Angle and slope** (pie chart), then **area** (bubble chart).

So when the viewer must compare more than two values, use sorted bars with a value label at the end of each bar, not a pie, a multi-ring gauge or bubbles.

### 2.2 Chart Transitions and Reveals

**[S] What [Heer & Robertson 2007](https://doi.org/10.1109/TVCG.2007.70539) (*Animated Transitions in Statistical Data Graphics*) found:**
- Animated transitions between chart states beat static cuts for tracking what changed.
- Simple staging helps: change the axes first, then move the data. Viewers preferred it and tracked objects better.
- Stages need time. The study's transitions lasted `1.25-2 s`, and the authors recommend about **one second per stage**, not half a second.
- More staging is not always better: in one experiment a staged donut-chart transition did worse than a direct one. Use two stages, and test before adding a third.

**[H] First reveal of a chart (a build-on, not a transition between states; these timings are house values):**
- **Scaffold first:** fade in axes, baseline and unit labels (about `150-200 ms`) so the frame of reference exists before data moves.
- **Then the data:**
  - *Bars:* grow from the baseline (`scaleY(0 -> 1)` with `transform-origin: bottom`, or `scaleX` from the left), staggered `35-100 ms` per bar, on `cubic-bezier(0.16, 1, 0.3, 1)`.
  - *Lines and areas:* draw the stroke left to right with `pathLength="1"` and `stroke-dashoffset: 1 -> 0` over `500-700 ms`; fade the area fill in just behind the stroke head.
- **Then the point:** dim the comparison bars (`opacity: 0.35`), colour the bar that matters, and land its value label a couple of frames after the bar stops.
- Hold the finished chart for the reading time in §1.1 plus the 25% scan allowance.

---

## 3. Audio-Visual Synchronization, Beat Math & Dual-Track Mixing

### 3.1 Audio-Visual Sync Tolerance
- **[S] ITU-R BT.1359-1:** viewers start to detect a sync error when sound leads the picture by about **`45 ms`**, or lags it by about **`125 ms`** (acceptability limits: `90 ms` lead, `185 ms` lag). Sound that arrives early is noticed much sooner than sound that arrives late.
- **[H] Practitioner rule that follows:** place an impact sound **on the contact frame or up to 2 frames after it** (`0 to +66 ms` at 30 fps), never more than 1 frame before.

### 3.2 [M] Exact Beat-to-Frame Quantization Math (Never Accumulate Rounded Intervals)
Given tempo $\text{BPM}$ and frame rate $\text{fps}$:
$$T_{\text{beat}} = \frac{60}{\text{BPM}}\text{ seconds}, \qquad F_{\text{beat}} = \frac{60 \cdot \text{fps}}{\text{BPM}}\text{ frames/beat}$$
- **Anti-Drift Rule:** When $\text{BPM}$ does not divide $60 \cdot \text{fps}$ evenly (e.g., `128 BPM` at `30 fps` $= 14.0625\text{ f/beat}$), rounding to `14 frames` and multiplying `n * 14` drifts by `2 full frames` (`67 ms`) after 32 beats! Always compute exact floating-point beat time and round per beat $n$:
  $$f_n = \text{Math.round}\!\left(n \cdot \frac{60 \cdot \text{fps}}{\text{BPM}}\right)$$
  Table for any tempo: `motion_math.py beats --bpm B --fps F`.

### 3.3 [H] The "Settle on the Beat" Rule & Sound Effect Pre-Roll Offsets
Amateur editors start an animation *on* the beat frame $f_n$, meaning the element lands mid-beat while nothing happens on the musical transient.
- **Studio Rule (Settle on the Beat):** If a fast entrance takes $D_{\text{impact}}$ frames to reach its primary visual snap (typically the first `6-8 frames` of a `16-frame` ease-out where `80%` of travel completes), **start the animation at frame $f_n - D_{\text{impact}}$** so the element **hits its resting coordinate or peak overshoot on frame $f_n$**.

| Sound Effect Archetype | Frame Offset Relative to Visual Event ($f_n$) | Frequency Band | Purpose |
|---|---|---|---|
| **Whoosh / Swish (Fast Pan / Whip)** | Start **`-4 to -6 frames`** (`-130 to -200 ms`); peak amplitude at **`-1 to 0f`** | `400 Hz – 4 kHz` | Anticipates velocity peak of camera pan or shape throw |
| **Riser / Reverse Cymbal** | Start **`-15 to -30 frames`** (`-0.5 to -1.0 s`); hard cut at **`f_n`** | `200 Hz – 8 kHz` | Builds tension into a major hero reveal or paradox hook |
| **Impact Thud / Sub Drop** | Trigger at **`0 to +1 frame`** (`0 to +33 ms`) | `50 – 180 Hz` | Gives physical mass when a hero card or stomp word lands |
| **UI Click / Tactile Pop / Tick** | Trigger at **`0 to +2 frames`** (`0 to +66 ms`) | `1.5 – 6 kHz` | Confirms button press, toggle flip, or odometer digit step |
| **Chime / Shimmer** | Trigger at **`+2 to +4 frames`** (`+66 to +133 ms`) | `3 – 10 kHz` | Highlights final metric badge or brand logo settle |

### 3.4 Mixing Music, Effects and Voice
Loudness targets and the mix balance are in `delivery-safety-and-export.md` §4.
1. **[H] Make room for the voice:** apply a gentle cut around `1-4 kHz` (or `lowpass=f=4000`) to the music bed so consonants and UI clicks stay clear without more volume.
2. **[S, `ffmpeg -h filter=amix`: "Scale inputs (default true)"] The `amix` trap:** `amix` normalises by default: it scales each input by `1/N`, and the level jumps when a short input ends. Pass **`normalize=0`**, set each level yourself, and add `alimiter`:
   ```bash
   ffmpeg -i video.mp4 -i bgm.wav -i sfx.wav -filter_complex \
     "[1:a]volume=0.15,lowpass=f=4200,afade=t=in:st=0:d=0.8,afade=t=out:st=28.5:d=1.5[bgm]; \
      [2:a]volume=0.65,highpass=f=120[sfx]; \
      [bgm][sfx]amix=inputs=2:duration=first:normalize=0,alimiter=limit=0.95[aout]" \
     -map 0:v -map "[aout]" -c:v copy -c:a aac -b:a 192k output.mp4
   ```
