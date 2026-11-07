# Web/SVG/Shader Motion, Rive vs. Lottie & Chinese Studio MG Craft (`MG动画`)

## Table of Contents
1. [GSAP 3, HyperFrames & Deterministic HTML-to-Video Pipelines](#1-gsap-3-hyperframes--deterministic-html-to-video-pipelines)
2. [SVG Procedural Motion: Stroke Draw, Liquid Filters & Gooey Metaballs](#2-svg-procedural-motion-stroke-draw-liquid-filters--gooey-metaballs)
3. [Rive State Machines vs. Lottie Keyframe Tables](#3-rive-state-machines-vs-lottie-keyframe-tables)
4. [Chinese Studio Motion Craft (`MG动画` / Bilibili / MediaStorm / PaperClip)](#4-chinese-studio-motion-craft-mg动画--bilibili--mediastorm--paperclip)
5. [Three-Tier Anti-Slop Taxonomy & Studio Archetype Signatures](#5-three-tier-anti-slop-taxonomy--studio-archetype-signatures)

---

## 1. GSAP 3, HyperFrames & Deterministic HTML-to-Video Pipelines

### 1.1 The Deterministic `window.__hf` / Seek Contract ([heygen-com/hyperframes](https://github.com/heygen-com/hyperframes))
When building HTML/CSS/SVG/Canvas/Three.js motion graphics for headless Chromium frame capture (HyperFrames, Playwright/Puppeteer frame stepper, or custom FFmpeg pipe):
1. Construct a single master `gsap.timeline({ paused: true })` (or attach child scene timelines via `.add(sceneTl, startTime)`).
2. Expose a deterministic global seek hook so the frame capturer never relies on wall-clock real time:
   ```js
   const masterTl = gsap.timeline({ paused: true });
   // ... build scenes ...
   window.__hf = {
     duration: masterTl.duration(),
     fps: 30,
     seek(timeInSeconds) {
       masterTl.seek(timeInSeconds, false); // false = do not suppress callbacks/events
     },
   };
   ```
3. **Never Use `gsap.from()` in Scrubbed / Seekable Timelines:** `gsap.from()` mutates the element's initial DOM state immediately upon creation (`immediateRender: true`) and can leave elements stuck at `opacity: 0` when scrubbing backward. Always set initial state explicitly in CSS (or `gsap.set()`) and animate with **`gsap.fromTo()`** or **`gsap.to()`**.

### 1.2 Two-Axis Breathing Container Expansion (`scaleX -> scaleY`)
Never expand a modal, code window, or Bento card from `scale(0) -> scale(1)`. Studio UI motion unfolds containers in two overlapping axes so the panel feels like an engineered physical aperture:
```js
tl.set(card, { transformOrigin: "50% 0%", scaleX: 0.15, scaleY: 0.02, opacity: 0 })
  .to(card, { opacity: 1, duration: 0.08, ease: "none" }, 0)
  .to(card, { scaleX: 1, duration: 0.28, ease: "expo.out" }, 0)
  .to(card, { scaleY: 1, duration: 0.38, ease: "expo.out" }, 0.07) // 70ms vertical lag
  .fromTo(cardChildren,
    { y: 14, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.30, stagger: 0.04, ease: "power3.out" },
    0.20 // Children enter only after container is >65% open
  );
```

### 1.3 FLIP (First, Last, Invert, Play) Shared-Element Layout Morphing
When an element changes parent container, flex/grid order, or switches from a thumbnail card to a full-screen hero:
1. **First:** Measure `const first = el.getBoundingClientRect()` (or `Flip.getState(targets)`).
2. **Last:** Perform the DOM/class mutation instantaneously; measure `const last = el.getBoundingClientRect()`.
3. **Invert:** Apply pure compositor delta transforms so the element appears visually unmoved at the First coordinates:
   $$\Delta x = \text{first.left} - \text{last.left}, \quad \Delta y = \text{first.top} - \text{last.top}, \quad s_x = \frac{\text{first.width}}{\text{last.width}}, \quad s_y = \frac{\text{first.height}}{\text{last.height}}$$
   *Border-Radius Counter-Scaling:* When scaling a box by $(s_x, s_y)$, apply `borderRadius: "${targetRadius / sx}px / ${targetRadius / sy}px"` during the tween so corners never stretch into ovals.
4. **Play:** Tween `translate3d(dx, dy, 0) scale(sx, sy) -> translate3d(0, 0, 0) scale(1, 1)` on `cubic-bezier(0.22, 1, 0.36, 1)`.

---

## 2. SVG Procedural Motion: Stroke Draw, Liquid Filters & Gooey Metaballs

### 2.1 Zero-JS Normalized `pathLength="1"` Stroke Trim (`Trim Paths`)
Instead of calling `path.getTotalLength()` at runtime in JS, declare **`pathLength="1"`** directly on any `<path>`, `<circle>`, `<rect>`, or `<polyline>`. The browser normalizes the entire perimeter to `1.0`, allowing universal `[0, 1]` trim control (equivalent to After Effects `Trim Paths Start / End / Offset`):

```html
<svg viewBox="0 0 800 200" width="800" height="200">
  <path
    d="M 40 160 C 200 20, 420 20, 760 120"
    pathLength="1"
    fill="none"
    stroke="#38BDF8"
    stroke-width="6"
    stroke-linecap="round"
    stroke-dasharray="1"
    stroke-dashoffset="1"
    class="trace-line"
  />
</svg>
```
- **Traveling Laser Segment (Window of Length $L = 0.25$):** Set `stroke-dasharray="0.25 0.75"` and animate `stroke-dashoffset` from `0.25 -> -0.75`.

### 2.2 Gooey / Metaball Liquid Fusion Filter (`<feGaussianBlur>` + `<feColorMatrix>`)
To make separating badges, droplets, or morphing icons fuse with organic surface tension, blur their alpha channel and apply a steep alpha contrast threshold (`18 * alpha - 7`), then composite the original sharp graphic on top via `operator="atop"` so internal text/icons stay razor-sharp:

```html
<svg style="position:absolute; width:0; height:0;" aria-hidden="true">
  <defs>
    <filter id="gooey-metaball" color-interpolation-filters="sRGB">
      <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
      <feColorMatrix
        in="blur"
        mode="matrix"
        values="1 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                0 0 0 18 -7"
        result="goo"
      />
      <feComposite in="SourceGraphic" in2="goo" operator="atop" />
    </filter>
  </defs>
</svg>
```

### 2.3 Hand-Drawn Line Boil & Liquid Shockwave (`<feTurbulence>` + `<feDisplacementMap>`)
- **Hand-Drawn Cel Line Boil (Kurzgesagt / Vox Style):** Step `<feTurbulence type="turbulence" baseFrequency="0.025" numOctaves="2" seed="1..5" />` + `<feDisplacementMap scale="3.5" />` through seeds `1 -> 2 -> 3 -> 4 -> 5` at **`8-12 Hz`** (`every 3 frames` at 30fps) using stepped easing (`steps(5)`).
- **Impact Shockwave Distortion:** On a heavy slam frame, spike `<feDisplacementMap scale="0 -> 45 -> 0" />` over `10 frames` (`330 ms`).

---

## 3. Rive State Machines vs. Lottie Keyframe Tables

| Dimension | Rive (`.riv` / `@rive-app/webgl2-threads`) | Lottie (`.json` / `.lottie` Bodymovin) |
|---|---|---|
| **Runtime Architecture** | C++/WASM state machine + custom Skia/WebGL2 vector renderer | JSON keyframe table parsed into SVG/Canvas DOM nodes |
| **File Size & FPS** | `10-20x` smaller binary; `60-120 fps` on GPU worker thread | Large JSON; drops frames on complex masks, mattes, or expressions |
| **Interactivity** | Native state machines, boolean/number/trigger inputs, **MVVM Data Binding** (`useViewModelInstanceString/Number/Trigger`) | Linear frame scrubbing (`goToAndStop(frame)`) only |
| **AE Expression Support** | Native constraints, bones, IK, and listeners replace expressions | Does NOT execute JS expressions smoothly on mobile; bake via [`jd-ae-lottie-expression-baker`](https://github.com/hugohung/jd-ae-lottie-expression-baker) (`0.45 px` accuracy in 4 Bezier keys) |

---

## 4. Chinese Studio Motion Craft (`MG动画` / Bilibili / MediaStorm / PaperClip)

### 4.1 The Two Macro-Pacing Arcs for Short-Form & Product Films
1. **Slow-Fast-Boom-Stop (`慢 — 快 — 炸 — 收`, 30-90s Product Launch Film):**
   - **0-15% (`慢` Problem / Tension):** Slow camera drift (`1.00x -> 1.04x`), sparse editorial typography, muted palette, low-pass audio bed.
   - **15-30% (`快` Ignition / Disruption):** Paradox hook + transient riser + whip cut into the product canvas.
   - **30-70% (`炸` Climax / Multi-Scene Showcase):** High-tempo beat-locked cuts (`2.0-3.5 s/scene`), `20%/80%` ease-out snaps, 2.5D camera focus pushes (`1.0x -> 1.4x`), and synchronized UI SFX.
   - **70-90% (`收` Proof / Consolidation):** Bento summary grid or flagship metric odometer reveal (`+38.4%`) with a `500 ms` pre-reveal pause.
   - **90-100% (`定` Brand Resolve):** Clean return to `1.0x` establishing frame, brand wordmark + single CTA held dead still for `>= 1.2 s`.
2. **PaperClip / Institute for Planets Explainer Ratio (*回形针 / 星球研究所*):**
   - **3-State Structural Reduction (`a -> b -> c`):** Reduce any complex technical mechanism to at most **3 discrete visual states** on the same wireframe/diagrammatic canvas rather than cutting to unrelated stock illustrations ([PaperclipDocs Sp.006](https://zengyincen.github.io/PaperclipDocs/Sp.006/)).
   - **Chinese Speed Graph Standard (`20/80` & `80/80`):**
     - *Entrance (`入场`):* `20%` out / `80%` in (`cubic-bezier(0.10, 0.45, 0.46, 0.99)` or `cubic-bezier(0.16, 1, 0.3, 1)`).
     - *Exit (`离场`):* `80%` out / `20%` in (`200 ms` exit vs `230 ms` entrance per [Tencent ISUX 106](https://isux.tencent.com/articles/106.html)).
     - *In-Canvas Point-to-Point (`A->B`):* `80%` out / `80%` in (`cubic-bezier(0.75, 0, 0.25, 1)`).

### 4.2 Universal $\omega$-Normalized Inertial Bounce Expression (`AE万能弹性表达式`)
When authoring After Effects expressions or JS spring-tail evaluators following a keyframe ramp, divide by angular frequency $\omega = 2\pi f$ so $C^1$ velocity continuity holds at $t = t_{\text{key}}^+$ without manual amplitude retuning across Position, Scale, and Rotation ([Bilibili cv13562975](https://www.bilibili.com/read/cv13562975/)):

$$x(t) = x_{\text{key}} + \vec{v}\!\left(t_{\text{key}} - \frac{\Delta t_{\text{frame}}}{20}\right) \cdot \frac{\sin(2\pi f \cdot \Delta t)}{2\pi f \cdot e^{d \cdot \Delta t}} \qquad (f = 6\text{ Hz},\; d = 4\text{ s}^{-1})$$

> **Critical Precondition:** The incoming keyframe at $t_{\text{key}}$ MUST be **Linear** (or have non-zero incoming velocity). If you apply `F9` Easy Ease to the landing keyframe, $\vec{v}(t_{\text{key}}) = 0$ and the bounce expression evaluates to zero!

### 4.3 The 11 Still-Frame Storyboard Laws & Graybox Thumbnail Pass
Before writing a single line of animation code, every scene's **resting hero frame** must pass the Still-Frame Graphic Poster Test:
1. **Graybox Thumbnail Pass (`1920x1080` Wireframe):** Block out every scene using only 3 grayscale values (`#111`, `#666`, `#F5F5F5`), exact pixel font sizes, and bounding boxes. Verify that **no two adjacent scenes share the same spatial composition** (e.g., never follow a centered title with another centered card).
2. **Asymmetric Focal Balance:** Pair 1 dominant hero region (`55-65%` visual weight) against structured negative space (`>= 30-40%` empty canvas).
3. **1px Specular Hairline Borders & Layered Surface Depth:** Separate cards from backgrounds using `1px solid rgba(255,255,255,0.08)` (dark mode) or `1px solid rgba(15,23,42,0.08)` (light mode) rather than heavy drop-shadows.

---

## 5. Three-Tier Anti-Slop Taxonomy & Studio Archetype Signatures

### 5.1 Three-Tier Slop Checklist (Ban List)
Benchmark testing across 16 Claude video skills ([`zhuyansen/awesome-claude-video-skills`](https://github.com/zhuyansen/awesome-claude-video-skills#tested)) and the 716-moment empirical corpus in [`Tejashmakwana/motionmaxxing`](https://github.com/Tejashmakwana/motionmaxxing/blob/main/references/slop.md) identifies three failure modes to reject immediately:
1. **Tier 1 — Amateur / Web-PPT Slop:**
   - Symmetric `ease-in-out` (`33%/33%`) or linear motion on UI/hero elements.
   - 3 equal columns of icon + title + paragraph cards fading in simultaneously like a PowerPoint slide ([`bang-motion/references/anti-ppt.md`](https://github.com/bangtutorial/bang-motion/blob/main/references/anti-ppt.md)).
   - Scaling from `scale(0)` instead of `scale(0.92..0.97)`.
2. **Tier 2 — First-Order AI Slop (Default LLM Visual Prior):**
   - Unprompted `#0A0A0F` dark navy/teal void when the brand or topic calls for editorial daylight (`#F8FAFC` / `#F4F1EA`).
   - Floating purple/cyan radial `filter: blur(120px)` background blobs.
   - Fake sci-fi corner chrome (`01 // SYSTEM_READY`, crosshairs, random hex strings).
   - Uniform `translateY(20px)` + `opacity: 0 -> 1` on every single element.
   - Continuous sine-wave up-and-down bobbing (`Math.sin(t)`) on cards while the user is trying to read them.
3. **Tier 3 — Second-Order "House-Style" Overcorrection Slop:**
   - Giant edge-cropped background words behind readable foreground text (destroys figure-ground contrast).
   - Using the exact same circle-wipe or whip-pan transition on every single scene cut (violates Gate `G5`).

### 5.2 Six Studio Archetype Signatures (Select 1 Cohesive Direction per Project)

| Studio Archetype | Canvas Ground & Palette | Easing & Spring Signature | Camera & Transition Grammar | Signature Craft Detail |
|---|---|---|---|---|
| **Apple Keynote / Product Film** | Earned pure `#000000` or `#F5F5F7` daylight; high-key specular product lighting | Zero-bounce heavy springs (`stiffness: 120, damping: 22`, $\zeta = 1.0$) & `cubic-bezier(0.32, 0.72, 0, 1)` | Scale-through-portal cuts (`1x -> 20x`) and slow `1.00x -> 1.04x` axial push | Hardware frame occupancy `70-85%`; 1 metric (`3.8x`) + 3-word claim per screen |
| **Linear / Vercel Tactile Dark** | Carbon `#08090A`, `1px` directional top-lit borders (`rgba(255,255,255,0.12)`), monochromatic + 1 accent | Crisp fast-out settle `cubic-bezier(0.22, 1, 0.36, 1)` (`180-260 ms`) | Isometric `rotateX(18deg) rotateZ(-12deg)` macro-to-micro camera rig on real UI states | Real keyboard shortcut pills (`Cmd+K`) triggering instantaneous (`0 ms`) UI state flips |
| **Stripe Editorial Daylight** | Warm daylight `#F6F9FC`, crisp white cards `#FFFFFF`, slate ink `#0A2540`, vibrant indigo `#635BFF` | Connected multi-stage morphs (`cubic-bezier(0.16, 1, 0.3, 1)`) + `2-4%` spring overshoot on badges | Continuous single-canvas morphing across 3+ scenes ("Morph, Don't Cut") | Interactive payment/code widget whose live data streams directly into an adjacent chart |
| **Vox / NYT Archival Explainer** | Warm archival paper `#F4F1EA`, halftone dot texture, charcoal `#1C1917` + highlighter yellow `#FACC15` | Stepped `12 fps` (`posterizeTime(12)`) accents inside smooth `30 fps` `cubic-bezier(0.65, 0, 0.35, 1)` camera pans | Evidence-desk top-down camera panning across documents, maps, and `pathLength="1"` ink lines | Camera pushes `-0.30 s` before spoken keyword; highlighter draws `+0.65 s` after camera start |
| **Kurzgesagt Vector Science** | Deep cosmic indigo `#0B1026` or saturated flat vector palettes with zero gradients on characters | `3-frame` anticipation shrink (`1.0 -> 0.92`) into `1.06` overshoot + `2-4 frame` secondary ear/limb lag | Flat orthographic Z-layers panning horizontally/vertically with `1.3x` parallax separation | `8-12 Hz` subtle `<feTurbulence>` boiling outline + constant-area squash & stretch ($s_x \cdot s_y = 1$) |
| **Buck / Oddfellows Geometric Craft** | High-contrast custom color blocking (`3-4` bold flat colors, zero mud) | Aggressive asymmetric speed graphs (`15%` out / `85%` in) + curved 2D trajectories (`arcY`) | Velocity-matched graphic match cuts ($v_{\text{out}}(A) = v_{\text{in}}(B)$) at peak motion blur | De Casteljau SVG path morphing where every exiting shape transforms into the next scene's hero |
