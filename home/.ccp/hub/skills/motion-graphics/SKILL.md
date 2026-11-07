---
name: motion-graphics
description: "Design, choreograph, animate, and audit studio-grade motion graphics, kinetic typography, animated data visualizations, product launch videos, explainers, and UI/web animations across Remotion, Motion Canvas/Revideo, Manim, GSAP/HyperFrames, CSS/WAAPI, SVG/Canvas/WebGL, Rive/Lottie, Concat MCP, and After Effects. Use whenever building, scripting, storyboarding, coding, or reviewing any video, animation, motion design, camera rig, transition, kinetic text, or motion system."
---

# Motion Graphics & Choreography Engineering

Build, choreograph, and verify studio-grade motion graphics grounded in physical mechanics (closed-form damped harmonic oscillators, constant-area squash & stretch, rotary shutter motion blur), perceptual psychophysics (saccadic reading stability, asymmetric audio-visual binding), and deterministic programmatic rendering.

## Reference Playbooks (Load on Demand)

Read the specific reference file matching your task before writing code or keyframes:
- **[`references/physics-timing-and-springs.md`](references/physics-timing-and-springs.md)** — Frame-rate psychophysics (`12/24/30/60 fps`, `posterizeTime` integer-divisor rule), asymmetric `cubic-bezier` catalog, exact AE Influence % $\leftrightarrow$ `cubic-bezier` conversion math, closed-form seek-safe damped spring ODEs ($\zeta < 1, \zeta = 1, \zeta > 1$), cross-engine spring conversions (Apple `response`/`dampingFraction`, UIKit, Remotion, Material 3 Expressive), Disney's 12 Principles in math/code, and $180^\circ$ shutter motion blur.
- **[`references/camera-rigging-transitions-and-choreography.md`](references/camera-rigging-transitions-and-choreography.md)** — Virtual camera axioms (`A1` safe margins, `A2` density budget), 5 canonical zoom stops (`0.78x` to `2.30x`) & log-ratio duration formula, `#viewport > #camera > #world + #hud` 2.5D DOM/GSAP isolation, 3D CSS text blur fixes, multi-plane parallax scale compensation, AE 6-Null camera hierarchy & 4 bug fixes, Squirrel Eiserloh trauma Perlin shake vs. dual-sine impact shake, velocity-matched cuts ($v_{\text{out}}(A) = v_{\text{in}}(B)$), Walter Murch eye-trace crosshair rule, De Casteljau SVG morphing, and bounded group staggering.
- **[`references/typography-dataviz-and-audio-sync.md`](references/typography-dataviz-and-audio-sync.md)** — Hochuli saccadic stability invariant (*text being read must not move*), WPM reading hold formula, `.line-mask` descender clipping fix (`padding: 0.06em 0.1em 0.16em 0; margin: -0.06em -0.1em -0.16em 0;`), Variable Font `GRAD` axis vs. `wght`/`wdth` CPU reflow trap, `tabular-nums` rolling odometer tickers, voiceover-to-camera lead (`-0.30 s`) & highlighter sweep (`+0.65 s`), Heer & Robertson 3-stage chart choreography, asymmetric audio-visual sync (`[-40 ms, +160 ms]`), unrounded BPM beat-to-frame math, "Settle on the Beat" rule, and FFmpeg `amix normalize=0` dual-track mixing.
- **[`references/programmatic-engines-remotion-motioncanvas-manim.md`](references/programmatic-engines-remotion-motioncanvas-manim.md)** — Engine selection matrix and production code patterns for **Remotion (`v4.0.541+`)**, **Motion Canvas / Revideo**, **Manim (`CE` / `GL`)**, and **Concat MCP (`v0.2.8`)**, including headless Chromium concurrency, font loading, subpixel jitter, and shared-memory capture fixes.
- **[`references/web-svg-shaders-and-chinese-mg-craft.md`](references/web-svg-shaders-and-chinese-mg-craft.md)** — Deterministic `window.__hf.seek(t)` GSAP timelines, 2-axis `scaleX -> scaleY` container expansion, FLIP shared-element geometry math, SVG `pathLength="1"` stroke trim, Gooey metaball `<feColorMatrix>` (`18*A - 7`), `<feTurbulence>` line-boil/shockwave filters, Rive vs. Lottie, Chinese Studio MG craft (`慢-快-炸-收` pacing, `20/80` speed graphs, universal $\omega$-normalized bounce), the 3-Tier Anti-Slop Ban List, and 6 Studio Archetypes (Apple, Linear, Stripe, Vox, Kurzgesagt, Buck).

---

## Step 1: Select Studio Archetype & Execution Engine

Never start coding a default dark-navy screen with floating glowing orbs. Before writing scene code, lock in **one Studio Archetype** and **one Execution Engine**:

1. **Choose 1 Studio Archetype** (full specs in [`references/web-svg-shaders-and-chinese-mg-craft.md#52`](references/web-svg-shaders-and-chinese-mg-craft.md)):
   - **Apple Keynote:** `#000000` or `#F5F5F7`, critically damped heavy springs ($\zeta = 1.0, k = 120, c = 22$), scale-through-portal cuts, `70-85%` hardware frame occupancy, `<= 6` words/screen.
   - **Linear / Vercel Tactile Dark:** `#08090A` carbon, `1px` top-lit borders (`rgba(255,255,255,0.12)`), isometric `rotateX(18deg) rotateZ(-12deg)` macro-to-micro camera rig on real UI states.
   - **Stripe Editorial Daylight:** `#F6F9FC` warm daylight, `#FFFFFF` cards, `#0A2540` ink, continuous single-canvas morphing across 3+ scenes ("Morph, Don't Cut").
   - **Vox / NYT Archival Explainer:** `#F4F1EA` archival paper, `12 fps` (`posterizeTime(12)`) accents inside `30 fps` `cubic-bezier(0.65, 0, 0.35, 1)` evidence-desk camera pans, `pathLength="1"` ink traces.
   - **Kurzgesagt Vector Science:** Bold flat vector palettes, `3-frame` anticipation shrink (`1.0 -> 0.92`) into `1.06` overshoot + `2-4 frame` secondary lag, constant-area squash & stretch ($s_x \cdot s_y = 1$).
   - **Buck / Oddfellows Geometric Craft:** Custom 3-4 color blocking, `15%/85%` asymmetric speed graphs, curved 2D trajectories (`arcY`), velocity-matched cuts ($v_{\text{out}}(A) = v_{\text{in}}(B)$), De Casteljau SVG morphs.
2. **Choose the Execution Engine:**
   - **React / Templated Data Video / Multi-Scene Product Promo:** Use **Remotion** (`useCurrentFrame`, `interpolate`, `spring`, `<TransitionSeries>`) or **HyperFrames / HTML + GSAP** (`gsap.timeline({ paused: true })` stepped via `seek(t)`).
   - **CS Algorithm / Code Diff / Node Graph Explainer:** Use **Motion Canvas / Revideo** (`yield* all/chain/sequence`, `<Code>`, `<Latex>`, `<Camera>`).
   - **Mathematical Proofs / 3D Calculus / LaTeX Equations:** Use **Manim** (`ValueTracker`, `always_redraw`, `TransformMatchingTex`, `MovingCameraScene`).
   - **Timeline Assembly, Audio/SFX Mixing, Captions, Color Grading & Final Export:** Use **Concat MCP (`mcp__concat_*`)** (`project_create`, `clip_add`, `edit_apply` `addShapeClip`, `keyframe_set`, `effect_layer_add`, `captions_add`, `preview_frame`, `export_start`) and **FFmpeg** (`amix normalize=0`).

---

## Step 2: Storyboard with the Pacing Arc & Graybox Thumbnail Pass

1. **Macro-Pacing Allocation (`慢 — 快 — 炸 — 收` for 15-90s Videos):**
   - **0-15% (Hook & Tension):** Start mid-motion at `t = 0.0 s` (zero throat-clearing greeting). State a schema-incongruent paradox + concrete number (`+38.4%`) within the first `3 s`.
   - **15-70% (Choreographed Showcase):** Alternate high-energy dynamic scenes (`2.0-3.5 s`) with continuous spatial morphs (`6-12 cuts/min` during dense explanations so LC4MP orienting cost stays low).
   - **70-90% (Proof & Climax):** Insert a **`300-500 ms` (`9-15f` @ 30fps) dead-still pre-reveal pause** immediately before the flagship metric or visual payoff lands.
   - **90-100% (Brand Resolve):** Return camera to `1.00x`, lock the wordmark/CTA dead still for **`>= 1.0-1.5 s`** (`30-45f` @ 30fps). Never cut or fade out while elements are still moving.
2. **Graybox Composition Contrast:**
   - No two adjacent scenes may share the same spatial layout or the same transition family.
   - Enforce **`8%` safe margins** (`>= 80-96 px` horizontal, `>= 54-100 px` vertical on `1920x1080`; keep callouts above `0.85 H` when captions are present) and **`>= 30-40%` open canvas**.

---

## Step 3: Apply the Core Mathematical & Physical Laws

### 1. Timing & Frequency Gate
- **100+ times/day UI actions (command palette, shortcuts, tab switch):** **`0 ms`** (instantaneous).
- **General UI transitions:** **`100-250 ms`** (strictly `< 300 ms`).
- **Mograph A-to-B hero snap:** **`12-18 frames` at 24fps** (`15-22f` @ 30fps, `500-750 ms`), paired with **`2-4 frames` (`83-167 ms`) anticipation** and **`2-4 frames` child overlap lag**.
- **`posterizeTime` Whole-Divisor Rule:** Only mix posterized frame rates that divide the master timeline FPS by an exact integer (`compFps % targetFps === 0`, e.g., `12 fps` or `15 fps` inside `30/60 fps`; never `24 fps` inside `60 fps`).

### 2. Asymmetric Easing & Speed Graph Math
- Ban symmetric `ease-in-out` (`33%/33%`) and `linear` on focal motion.
- Use fast departure (`15-25%` outgoing influence) + long deceleration settle (`75-85%` incoming influence):
  $$x_1 = \frac{I_{\text{out}}}{100}, \quad y_1 = x_1 \frac{S_{\text{out}}}{S_{\text{avg}}}, \qquad x_2 = 1 - \frac{I_{\text{in}}}{100}, \quad y_2 = 1 - (1 - x_2)\frac{S_{\text{in}}}{S_{\text{avg}}}$$
  - **Hero Entrance (`expo.out`):** `cubic-bezier(0.16, 1, 0.3, 1)` (spend the final `35-40%` of duration in a `2-4 px` micro-settle).
  - **UI Settle:** `cubic-bezier(0.22, 1, 0.36, 1)`.
  - **Permanent Exit (`55-70%` of entrance duration):** `cubic-bezier(0.7, 0, 0.84, 0)` (accelerate off-screen; never decelerate at the exit edge).
  - **Active Camera Push/Pull:** `cubic-bezier(0.65, 0, 0.35, 1)` with duration scaled by log-zoom ratio:
    $$d = \text{clamp}\!\left(0.30,\; 0.94,\; 0.55 \cdot \frac{|\ln(z_2 / z_1)|}{\ln 2}\right)$$

### 3. Closed-Form Springs & Volume Conservation
- Evaluate springs analytically as pure functions of $t$ (never stateful Euler loops):
  $$k = m \left(\frac{2\pi}{\text{response}}\right)^2, \qquad c = \frac{4\pi \cdot \zeta \cdot m}{\text{response}}, \qquad M_p = \exp\!\left(\frac{-\pi \zeta}{\sqrt{1 - \zeta^2}}\right)$$
  - Use underdamped spatial springs ($\zeta = 0.65\text{–}0.85$) ONLY on transform (`translate`, `scale`, `rotate`).
  - Use critically damped springs ($\zeta = 1.0$) on `opacity` and `color` so values never overshoot `1.0` and flash.
- **Origin-Aware Scaling:** Scale entrances from **`0.92-0.97 -> 1.0`** (never `scale(0)`).
- **2D Constant-Area Squash & Stretch:** Preserve area via $s_x \cdot s_y = 1 \implies S_y = 10000 / S_x\%$ (cap at `3-8%` in UI/corporate motion).

### 4. Typography, Stagger & Audio-Visual Sync
- **Saccadic Stability & Reading Hold:** Text being read MUST NOT move. Hold dead still after entrance for:
  $$T_{\text{hold}} = \max\!\left(1.5\text{ s},\; \left(\frac{N_{\text{words}}}{3.0} + 0.3\text{ s}\right) \times 1.25\right)$$
- **Descender-Safe Line Mask:** Apply `.line-mask { overflow: clip; padding: 0.06em 0.1em 0.16em 0; margin: -0.06em -0.1em -0.16em 0; }` and animate inner lines from `translate3d(0, 115%, 0) -> 0` so `g, j, p, q, y` and diacritics never clip.
- **Bounded Stagger Cap:** Stagger groups by `20-50 ms` per item, capped at **`<= 360 ms` total window** ($\text{delay}_i = \min(i \cdot 0.045, \frac{i}{N-1} \cdot 0.36)$).
- **Settle on the Beat & Asymmetric Audio Offset (`0 to +2 frames`):**
  - Quantize beat $n$ without cumulative rounding: $f_n = \text{Math.round}(n \cdot 60 \cdot \text{fps} / \text{BPM})$.
  - Start fast entrances **`6-8 frames` before $f_n$** so the element **lands on the beat**.
  - Start whooshes **`-4 to -6 frames` early**; trigger impact thuds/clicks **`0 to +2 frames` (`0 to +66 ms`) after** visual contact (never `> 1f` early).

---

## Step 4: Pre-Render & Visual Verification Gates (`G0–G6`)

Every motion graphic, video composition, or animated UI deliverable MUST pass these 7 verification gates before completion (inspect actual rendered frames via `mcp__concat_preview_frame`, Remotion still/video render, or headless browser screenshots — never trust code inspection alone):

1. **`G0` — Determinism & Render Hygiene:** Zero CSS `transition`/`@keyframes` or `Math.random()` inside frame-driven video compositions; all scenes use half-open `[startFrame, endFrame)` ranges (`0` black-flash frames or 1-frame double overlaps at cuts).
2. **`G1` — Pacing & Hold Discipline:** Maximum unintentional dead static stretch `< 1.0 s`; every key headline/metric holds dead still for $T_{\text{hold}}$ after settling; brand resolve holds `>= 1.0 s` before end frame.
3. **`G2` — Salience & Density Budget:** At most **`<= 2` independent element groups** moving simultaneously on any frame; **`<= 12` words** on screen for kinetic typography (`<= 30` inside realistic UI mockups); 1080p font sizes `>= 72-84 px` (hero), `>= 36-44 px` (subhead), `>= 24 px` (UI floor).
4. **`G3` — Zero Clipping & Safe-Margin Integrity:** `0` viewport edge clipping (`>= 8%` safe margins), `0` sibling bounding-box collisions, `0` clipped descenders (`g, j, p, q, y`) inside `.line-mask`, and `tabular-nums` on all animated numbers.
5. **`G4` — Luminance Contrast &Earned Palette:** Foreground text contrast `>= 4.5:1` (`>= 7:1` for body/captions); dark backgrounds (`L < 0.18`) used only when earned by brand/topic; zero unprompted `#0A0A0F` navy void + glowing purple/cyan blur blobs + fake HUD corner chrome.
6. **`G5` — Transition & Camera Variety:** `0` adjacent cuts sharing the same transition family; `<= 1` unmotivated hard cut per `15-30 s` video; `>= 2.0 s` rest between active camera moves (`<= 4-5` camera moves per `15 s`).
7. **`G6` — Audio-Visual Sync & Loudness:** Impact SFX land within `[0, +2f]` of visual contact; whooshes lead by `-4 to -6f`; voice-over mastered to `-14 to -16 LUFS` with BGM ducked `20-22 dB` below VO and mixed with FFmpeg `amix=normalize=0`.
