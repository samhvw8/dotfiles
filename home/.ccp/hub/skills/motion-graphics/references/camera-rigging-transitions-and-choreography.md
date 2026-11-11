# Camera Rigging, Seamless Transitions, Match Cuts & Group Choreography

> Labels: **[M]** math, derived and checked. **[S]** named source that was read. **[H]** practitioner heuristic: a starting value, not a finding. Change an [H] value when the frames say so. Recompute numbers with `scripts/motion_math.py`.

## Table of Contents
1. [2D & 2.5D Virtual Camera Rigging](#1-2d--25d-virtual-camera-rigging)
2. [Procedural Camera Shake: Trauma Model vs. Dual-Sine](#2-procedural-camera-shake-trauma-model-vs-dual-sine)
3. [Seamless Transitions, Match Cuts & Continuity Laws](#3-seamless-transitions-match-cuts--continuity-laws)
4. [Vector Path & SVG Morphing Mathematics](#4-vector-path--svg-morphing-mathematics)
5. [Bounded Group Staggering & Radial Wave Propagation](#5-bounded-group-staggering--radial-wave-propagation)

---

## 1. 2D & 2.5D Virtual Camera Rigging

### 1.1 [H] Two Camera Rules & a Density Budget (house values, no measured source)
1. **Rule A1 — Visibility Before Rhetoric:** Any text or UI element the viewer must read stays inside the title-safe area: the central 90% of the frame, a `96 px` side margin and a `54 px` top and bottom margin on `1920x1080` ([S] SMPTE ST 2046-1). When subtitles are present, keep primary callouts above **`0.85 H`**. Vertical video needs larger margins: see `delivery-safety-and-export.md` §2.
2. **Rule A2 — Comfort & Density Budget:**
   - **Interval Between Camera Moves:** Minimum **`>= 2.0-3.0 s`** static rest (`>= 2.2 s` dwell per focal point in document/UI reveals) between consecutive active camera moves; shorter rests read as a restless, floaty camera.
   - **15-Second Window Cap:** At most **`4-5` camera moves per `15 s`** (`<= 3` focus points per narrative beat).
   - **Single-Change Rule:** Each camera move changes **only one primary variable** (either pan to a new region OR push-in to a detail — never simultaneous pan + zoom + roll unless executing a `6-10f` whip transition).

### 1.2 [H] Five Zoom Stops & a Log-Ratio Duration Formula
A small fixed set of zoom stops keeps framing consistent across a film. The stops and the duration formula below are a house style with no source. The formula gives `0.30 s` for a `1.0x -> 1.3x` push, which is fast; lengthen it when the move should feel calm.

| Stop Name | Zoom Factor ($z$) | Visual Coverage | Mandatory Pairing & Constraints |
|---|---|---|---|
| **Pull-Back / Context** | `0.78x` (`0.75-0.85x`) | Multi-window / architecture overview | Requires studio background canvas; never show raw black void |
| **Establishing / Home** | `1.00x` | Full `1920x1080` scene | Default baseline; hold `>= 1.0 s` before first push |
| **Medium Focus (Workhorse)** | `1.30-1.45x` | `70%` of active camera moves | Pair with dim/blur overlay on non-focal siblings |
| **Close-Up Detail** | `1.80x` | Single button, input, or metric | Hold `>= 0.8 s`; never pan horizontally while at `1.8x` |
| **Macro Inspection** | `2.30x` (Hard cap `2.40x`) | Micro-glyph, badge, or slider | Maximum **1 per 30 s video**; rasterize vectors at `>= 2.5x` resolution |

- **Logarithmic Zoom Duration Formula:** Camera push/pull duration $d$ (in seconds) scales with the **logarithmic zoom ratio** so perceived optical speed stays constant across scales:
  $$d = \text{clamp}\!\left(0.30,\; 0.94,\; 0.55 \cdot \frac{|\ln(z_2 / z_1)|}{\ln 2}\right)$$
  - *Active Push/Pull Easing:* `cubic-bezier(0.65, 0, 0.35, 1)` (`power2.inOut`).
  - *Follow-Camera Chase Easing (tracking a moving subject):* `cubic-bezier(0.33, 0, 0.15, 1)` (softer start `0.33`, longer settle `0.15`).
  - **[S]** *Subpixel Jitter Fix during Slow Drift:* On HTML/CSS text inside a `1.00x -> 1.03x` camera drift, apply `transform: perspective(100px); will-change: transform;` to force GPU subpixel glyph positioning and prevent `1 px` staircase oscillation ([`remotion/subpixel-rendering.mdx`](https://github.com/remotion-dev/remotion/blob/main/packages/docs/docs/troubleshooting/subpixel-rendering.mdx)).

### 1.3 DOM / GSAP / Remotion 2.5D Camera Isolation Architecture
Never animate camera transforms directly on individual scene elements. Construct a 3-layer stage so HUD/captions remain unaffected by world camera motion:

```html
<div id="viewport" style="width:1920px; height:1080px; overflow:hidden; position:relative; perspective:1200px;">
  <!-- 1. World Camera Rig (receives pan x/y, zoom, rotateZ, rotateX/Y) -->
  <div id="camera" style="width:100%; height:100%; transform-style:preserve-3d; will-change:transform;">
    <div class="parallax-bg" data-depth="-400" style="transform:translateZ(-400px) scale(1.333);"></div>
    <div class="world-stage" data-depth="0"    style="transform:translateZ(0px);"></div>
    <div class="parallax-fg" data-depth="150"  style="transform:translateZ(150px) scale(0.875);"></div>
  </div>
  <!-- 2. Screen-Space HUD (captions, watermarks, progress bars — immune to camera transform) -->
  <div id="hud" style="position:absolute; inset:0; pointer-events:none;"></div>
</div>
```

- **Target-Lock Panning Formula:** To center world point $(x_{\text{target}}, y_{\text{target}})$ inside a viewport of size $(W, H)$ at zoom $z$:
  $$\text{camX} = \left(\frac{W}{2} - x_{\text{target}}\right) \cdot z, \qquad \text{camY} = \left(\frac{H}{2} - y_{\text{target}}\right) \cdot z$$
  [M] This holds for `transform: translate(camX, camY) scale(z)` with the default `transform-origin: 50% 50%`. With `transform-origin: 0 0`, use $\text{camX} = W/2 - z \cdot x_{\text{target}}$.
- **3D CSS Text Blur Fix ([ryo-manba PR #95](https://github.com/ryo-manba/ryo-manba/pull/95)):** Browsers rasterize DOM layers at `scale(1)` before applying 3D `matrix3d` / `scale3d`, making text blurry when zoomed in above `1.5x`. Either pre-upsize the DOM container at $z_{\text{max}}$ and scale *down* for wide shots, or apply CSS `zoom` (which forces vector re-rasterization at target resolution in Chromium) alongside `translate3d`.

### 1.4 Multi-Plane Parallax Auto-Scale & After Effects Multi-Null Camera Hierarchy
- **[M] Perspective Scale Compensation Formula:** When placing a layer at depth $Z$ (distance $d = \text{camZoom} + Z$ from a camera with focal zoom $\text{camZoom}$, e.g., `1200 px`), its apparent size shrinks by $\text{camZoom} / d$. To keep its 1:1 visual layout size on frame 0 while gaining genuine 3D parallax on camera pan ([BrightPhoton](https://brightphoton.com/3d-camera-parallax-effect-in-after-effects/)):
  $$S_{\text{compensated}} = S_{\text{base}} \cdot \frac{\text{camZoom} + Z}{\text{camZoom}} = S_{\text{base}} \cdot \left(1 + \frac{Z}{\text{camZoom}}\right)$$
  Here $Z$ is positive away from the camera (After Effects). In CSS, `translateZ` is positive toward the viewer, so use $1 - \text{translateZ} / \text{perspective}$: `translateZ(-400px)` under `perspective: 1200px` needs `scale(1.333)`.
- **[M] Focal Length $\leftrightarrow$ Pixel Zoom Formula (36mm Full-Frame Sensor):**
  $$\text{zoom}_{\text{px}} = \frac{W_{\text{comp}} \cdot f_{\text{mm}}}{36\text{ mm}}, \qquad \text{FOV}_h = 2 \arctan\!\left(\frac{18\text{ mm}}{f_{\text{mm}}}\right)$$
  At $W_{\text{comp}} = 1920\text{ px}$: **$24\text{ mm}$ wide** $= 1280\text{ px}$ (`73.7°` FOV); **$35\text{ mm}$ standard** $= 1866.7\text{ px}$ (`54.4°` FOV); **$50\text{ mm}$ normal** $= 2666.7\text{ px}$ (`39.6°` FOV); **$85\text{ mm}$ portrait** $= 4533.3\text{ px}$ (`23.9°` FOV). Other values: `motion_math.py fov`.
- **[H] The 6-Null Gimbal-Free Rig Hierarchy & 4 Rules ([Jake In Motion](https://www.schoolofmotion.com/blog/cameras-and-nulls), [Bilibili cv17208764](https://www.bilibili.com/read/cv17208764)):**
  Parenting chain: `Camera -> Handheld (wiggle) -> Roll (Z) -> Tilt (X) -> Pan (Y) -> Dolly (Z-pos) -> Orbit`.
  1. **The "Boomerang" Spatial Drift Bug:** Adding a hold keyframe (same value at $t_1$ and $t_2$) after a move causes the camera to drift forward and backward during the "hold" because spatial tangents default to **Auto-Bezier**. **Fix:** Set all spatial keyframe interpolation on camera/null positions to **Linear**; control temporal smoothness exclusively in the Speed/Value Graph.
  2. **The $180^\circ$ Orientation Flip Bug:** Animating the 3D `Orientation` property across $360^\circ$ causes Euler gimbal flipping and lacks separate velocity handles. **Fix:** Keep `Orientation = [0, 0, 0]` and animate **`X Rotation`**, **`Y Rotation`**, and **`Z Rotation`** on dedicated nulls.
  3. **Parent Before Enabling 3D:** Attach the One-Node Camera to the Null while the Null is still 2D (auto-snapping the camera to `[0, 0, -zoom]`), *then* flip the Null's 3D switch.
  4. **Multi-Null Peak-to-End Velocity Superposition (`峰值对齐末帧法则`):** When chaining two camera moves (`Camera -> Null 1 -> Null 2`), align the **speed-graph peak (`速度峰值`) of `Null 2` with the ending keyframe (`末帧`) of `Null 1`** so parent and child velocities add smoothly without a mid-move velocity dip ([Bilibili cv17208764](https://www.bilibili.com/read/cv17208764), [Zhihu Q555999477](https://www.zhihu.com/question/555999477)).

---

## 2. Procedural Camera Shake: Trauma Model vs. Dual-Sine

### 2.1 [S] Trauma-Based Shake (Squirrel Eiserloh, GDC 2016)
Never add raw random jitter to camera coordinates. Maintain a normalized $\text{trauma} \in [0, 1]$ value that spikes on impacts ($\text{trauma} = \min(1, \text{trauma} + \Delta)$), decays linearly ($\text{trauma}(t) = \max(0, \text{trauma}_0 - k_{\text{decay}} \cdot t)$), and drives camera intensity via **quadratic or cubic power ($\text{shake} = \text{trauma}^2$ or $\text{trauma}^3$)** so settle tails feel parabolic ([Squirrel Eiserloh GDC 2016](https://www.youtube.com/watch?v=tu-Qe66AvtY)). Eiserloh drives the offsets with Perlin noise; the example below uses a sum of sines so it needs no noise library. **[M]** Keep every shake frequency below half the frame rate (12 Hz at 24 fps, 15 Hz at 30 fps), or it renders as aliased jitter. The amplitudes are [H].

```ts
// Seek-safe deterministic Trauma Shake (prefer rotational roll + pitch over large XY translation)
export function getCameraShake(t: number, impactTime: number, traumaPeak = 0.7, decayRate = 1.8) {
  const dt = t - impactTime;
  if (dt < 0) return { x: 0, y: 0, rollDeg: 0 };
  const trauma = Math.max(0, traumaPeak - decayRate * dt);
  const shake = trauma * trauma * trauma; // cubic falloff
  return {
    x:       18 * shake * Math.sin(dt * 43.0) * Math.cos(dt * 19.7),
    y:       14 * shake * Math.cos(dt * 37.0) * Math.sin(dt * 23.3),
    rollDeg: 2.2 * shake * Math.sin(dt * 29.0 + 1.3),
  };
}
```

### 2.2 [H] Dual-Sine Impact Shake (Zero External Noise Dependency)
For crisp UI/mograph slams, combine two frequencies with a non-integer ratio ($f_1 = 5\text{ Hz}$, $f_2 = 11\text{ Hz}$, both below the 12 Hz limit of a 24 fps render) under an exponential decay envelope $e^{-7t}$:
$$\Delta x(t) = A \cdot e^{-7 t} \sin(2\pi \cdot 5 t), \qquad \Delta y(t) = A \cdot e^{-7 t} \cos(2\pi \cdot 11 t)$$
Because $11 / 5$ is not an integer, the path does not settle onto one diagonal line.

---

## 3. Seamless Transitions, Match Cuts & Continuity Laws

### 3.1 [H] Velocity & Vector Continuity Equation ($v_{\text{out}}(A) = v_{\text{in}}(B)$) — Stripping `起幅` and `落幅`
Every ease-in-out movement consists of three phases: `起幅` (acceleration wind-up), peak velocity body, and `落幅` (deceleration settle). A cut between Scene A and Scene B is invisible ("hidden cut" / `动接动`) if and only if **Shot A's `落幅` and Shot B's `起幅` are stripped** so the cut splices directly at peak velocity ([School of Motion](https://www.schoolofmotion.com/blog/seamless-transitions-after-effects), [Zcool ZMTE1MTY3Ng==](https://www.zcool.com.cn/article/ZMTE1MTY3Ng==.html)):
1. **Outgoing Scene A (`4-6 frames` before $f_c$):** Accelerate on a steep **`ease-in`** curve (`cubic-bezier(0.7, 0, 1, 1)`, outgoing influence `75-90%`) so peak velocity hits *exactly at frame $f_c$*.
2. **Cut Frame $f_c$:** Switch scenes at maximum velocity + peak motion blur ($360^\circ\text{–}720^\circ$ shutter or `blur(8px-14px)`). Use **half-open frame intervals `[startFrame, endFrame)`** (`frame >= start && frame < end`) so Scene A and Scene B never double-render or leave a 1-frame black gap on $f_c$.
3. **Incoming Scene B (`6-12 frames` after $f_c$):** Enter from the opposite screen edge along the same vector $\theta$ at the same peak velocity and decelerate on a long **`ease-out`** tail (`cubic-bezier(0.16, 1, 0.3, 1)`, incoming influence `80-90%`).

### 3.2 [S] Walter Murch's Rule of Six & [H] Eye-Trace Choreography
When cutting between shots without a full-screen wipe, prioritize continuity in Walter Murch's weighted order (*In the Blink of an Eye*): **(1) Emotion (`51%`) > (2) Story (`23%`) > (3) Rhythm (`10%`) > (4) Eye-Trace (`7%`) > (5) 2D Planarity (`5%`) > (6) 3D Space (`4%`)**.
- **Eye-Trace Rule (an editing observation from *Mad Max: Fury Road*; no pixel threshold has a source):** If Scene A's focal action ends at screen coordinate $(x_A, y_A)$, place Scene B's focal element close to $(x_A, y_A)$ on frame $f_c$, or a leading motion vector must physically guide the viewer's fovea to the new coordinate before the cut ([Stephene Visuals](https://www.stephenevisuals.com/blog/eye-trace)).

### 3.3 [H] A 3-Tier Transition Taxonomy
- **Variety rule:** Do not repeat the same transition family on two adjacent cuts, and keep unmotivated hard cuts rare (about one per 15-30 s).
- **Tier 1 — High-Energy Shot Transitions (6 Canonical Moves):**
  1. *Whip Pan (Horizontal/Vertical Throw):* `6-10f` camera throw with directional motion blur + edge tile mirror (`Motion Tile`).
  2. *Scale-Through Portal (Zoom-In Cut):* Dive through a circular O-glyph, icon, button, or window frame scaled from `1x -> 25x` so its interior becomes Scene B's canvas.
  3. *Pull-Back Reveal (Zoom-Out Context):* Scene A turns out to be a card/screen inside a larger device or Bento grid in Scene B.
  4. *Iris / Mask Expansion:* A shape clip or SVG mask expands radially from the causal click/impact coordinate.
  5. *4-Layer Asymmetric Shape Wipe:* Stagger `3-4` brand-colored geometric ribbons by `1-2 frames` each with asymmetric ease (`cubic-bezier(0.77, 0, 0.175, 1)`).
  6. *Z-Axis Depth Drop:* Foreground floor drops downward while background layers rush forward from $Z = -800\text{ px} \to 0$.
- **Tier 2 — Hidden Cuts (3 Moves):**
  1. *Foreground Wipe-By:* A large foreground card or silhouette crosses the lens for `4-6 frames`, masking the cut.
  2. *Graphic Match Cut:* Morph or cut between two objects with identical bounding silhouette and position (e.g., pie chart $\to$ clock face $\to$ coin).
  3. *Luminance / Flash Frame Cut:* `1-2 frame` specular highlight bloom on an impact transient bridging high-contrast scenes. At most one per second, and prefer a partial-frame bloom: see flash safety in `delivery-safety-and-export.md` §1.
- **Tier 3 — Continuous Spatial Travel ("Morph, Don't Cut"):**
  - Keep a single continuous canvas and repurpose existing DOM/vector nodes in place (e.g., a headline bar compresses into a search input, which expands into a results table) so the viewer does not have to re-orient at a cut.

---

## 4. [M] Vector Path & SVG Morphing Mathematics

When morphing custom SVG `<path d="...">` shapes in GSAP (`MorphSVG`), Flubber, Remotion (`@remotion/paths` `interpolatePath`), or Motion Canvas, three mathematical invariants prevent path twisting and inside-out self-intersection:
1. **Cubic Bezier Normalization & De Casteljau Subdivision:** Convert all primitives (`M, L, H, V, Q, A, Z`) to absolute cubic Bezier segments (`C`). If Path A has $N$ segments and Path B has $M$ segments ($N < M$), subdivide the longest segments of Path A at midpoint $t = 0.5$ via **De Casteljau's algorithm** — which splits control points $(P_0, P_1, P_2, P_3)$ into two exact sub-curves without changing geometry — until both paths have equal vertex count $\max(N, M)$.
2. **Winding Order Alignment (Shoelace Signed Area):** Compute signed polygon area $A = \frac{1}{2} \sum (x_i y_{i+1} - x_{i+1} y_i)$. If $\text{sign}(A_1) \neq \text{sign}(A_2)$ (one clockwise, one counter-clockwise), every vertex crosses through the centroid at $t = 0.5$ and collapses the shape inside-out. Reverse the vertex array of Path B so winding signs match.
3. **First-Vertex Rotational Index Alignment:** Rotate the starting index $k \in [0, N-1)$ of Path B's closed vertex ring to minimize total squared Euclidean travel $\sum_{i=0}^{N-1} \|A_i - B_{(i+k) \bmod N}\|^2$ (typically aligning the top-leftmost bounding-box vertex of both shapes).
4. **Transient Mid-Morph Blur (`2 px`):** When two silhouettes differ sharply in topology (e.g., icon swap or text glyph morph), apply a transient `filter: blur(2px)` (strictly `< 20px` to avoid Safari GPU stalls) peaking at $t = 0.5$ and returning to `0px` at $t = 0, 1$ ([Emil Kowalski STANDARDS.md](https://raw.githubusercontent.com/emilkowalski/skills/main/skills/review-animations/STANDARDS.md)).

---

## 5. Bounded Group Staggering & Radial Wave Propagation

- **[H] Bounded Total Stagger (cap the whole group at about `360 ms`; sources give `300-500 ms`):**
  Linear stagger $\text{delay}_i = i \cdot \Delta t$ works for $N \le 6$ items at $\Delta t = 30\text{–}60\text{ ms}$. For larger lists ($N > 8$), un-capped linear stagger makes the last item arrive $> 1\text{ s}$ late ("Machine-Gun Stagger"). Always cap total stagger window $T_{\text{stagger,max}} \le 360\text{ ms}$:
  $$\text{delay}_i = \min\!\left(i \cdot 0.045,\; \frac{i}{N - 1} \cdot 0.36\right) \qquad (N \ge 2)$$
- **2D Grid Euclidean Radial Stagger:**
  For a Bento grid or icon matrix of $(R \times C)$ cells triggered from focal cell $(r_0, c_0)$, compute stagger delay from Euclidean distance rather than DOM index so the reveal ripples outward as a physical wave:
  $$\text{delay}(r, c) = \Delta t_{\text{step}} \cdot \sqrt{(r - r_0)^2 + (c - c_0)^2}$$
- **[H] Simultaneous Motion Budget:**
  At most **`<= 2` independent element groups** may move simultaneously on any frame (e.g., `1` hero entrance + `1` background parallax shift). When three or more unrelated groups move along different vectors at once, the eye has no single target.
