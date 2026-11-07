# Physics, Timing Psychophysics, Easing Curves, Damped Springs & Disney's 12 Principles

## Table of Contents
1. [Timing Psychophysics & Frame-Rate Architecture](#1-timing-psychophysics--frame-rate-architecture)
2. [Asymmetric Easing Curves & Speed/Value Graph Translation](#2-asymmetric-easing-curves--speedvalue-graph-translation)
3. [Damped Harmonic Oscillators & Cross-Engine Spring Math](#3-damped-harmonic-oscillators--cross-engine-spring-math)
4. [Disney's 12 Principles Adapted for 2D, Vector & UI Motion](#4-disneys-12-principles-adapted-for-2d-vector--ui-motion)
5. [Smear Frames & Rotary Shutter Motion Blur](#5-smear-frames--rotary-shutter-motion-blur)

---

## 1. Timing Psychophysics & Frame-Rate Architecture

### 1.1 The Frequency–Novelty Gate (When NOT to Animate)
Before assigning any duration, evaluate interaction frequency ([Emil Kowalski STANDARDS.md](https://raw.githubusercontent.com/emilkowalski/skills/main/skills/review-animations/STANDARDS.md), [Rauno Freiberg](https://rauno.me/craft/interaction-design)):
- **100+ times/day (Keyboard shortcuts, command palettes, app switchers, right-click context menu open, tab switching):** **`0 ms` (Instantaneous / Never animate)**. Even a `150 ms` transition accumulates cognitive friction when repeated hundreds of times daily.
- **10–50 times/day (Button press, toggle, tooltip, dropdown, hover):** **`100–250 ms`**. General product UI animations must remain strictly **`< 300 ms`**.
- **Narrative / Presentation / Launch Film Motion Graphics:** Choreographed moves run **`400–900 ms`** (`12–27 frames` at 30 fps) paired with deliberate cognitive holds (**`300–1000 ms`**).

### 1.2 Master Timing Table: Milliseconds to Frames (24, 30, 60 fps)

| Motion Category | Duration (ms) | 24 fps (Cinema) | 30 fps (Broadcast / Web Video) | 60 fps (Interactive UI) | Perceptual / Biomechanical Role |
|---|---|---|---|---|---|
| **Micro-feedback (press, toggle, active)** | `100–160 ms` | `2–4 f` | `3–5 f` | `6–10 f` | Direct physical manipulation (`scale(0.97)`); `>100 ms` latency breaks tactile causality ([Chang & Ungar 1993](https://dl.acm.org/doi/10.1145/168642.168654)) |
| **Anticipation (wind-up before move)** | `83–167 ms` | `2–4 f` | `3–5 f` | `5–10 f` | Reverse displacement (`5–10%` of main travel or `scale 1 -> 0.95`) signaling imminent kinetic impulse ([DesignKkashi](https://designkkashi.com/en/after-effects-graph-editor-speed-value-influence-guide/)) |
| **Whip Pan / Match-Cut Blur Peak** | `167–333 ms` | `4–8 f` | `5–10 f` | `10–20 f` | High-velocity camera/layer throw (`≥300 px/f` peak at 1080p); requires motion blur (`360°–720°` shutter) |
| **Popover / Dropdown / Tooltip** | `150–250 ms` | `4–6 f` | `5–8 f` | `9–15 f` | Origin-aware scale (`0.95 -> 1.0`) + opacity (`0 -> 1`) from `var(--transform-origin)` |
| **Modal / Drawer / Sheet Transition** | `220–380 ms` | `5–9 f` | `7–11 f` | `13–23 f` | Dorsal-stream spatial tracking window ("what went where") |
| **Core Mograph A-to-B Snap Move** | `500–750 ms` | `12–18 f` | `15–22 f` | `30–45 f` | Primary hero card, shape, or kinetic headline travel with asymmetric ease (`15–25%` out / `75–85%` in) ([MotionCircles](https://motioncircles.com/knowledge/how-to-create-smooth-natural-easing-for-animation/)) |
| **Camera Push-In / Pull-Out (Log-Scaled)** | `300–940 ms` | `7–23 f` | `9–28 f` | `18–56 f` | Governed by log-zoom ratio: $d = \text{clamp}(0.30, 0.94, 0.55 \cdot |\ln(z_2/z_1)| / \ln 2)$ |
| **Pre-Reveal Cognitive Hold** | `300–500 ms` | `7–12 f` | `9–15 f` | `18–30 f` | Dead-still pause before revealing a key metric/result so human foveal attention locks on |
| **Brand Wordmark / Hero Stat Hold** | `800–1500 ms` | `19–36 f` | `24–45 f` | `48–90 f` | Mandatory static hold after settle; never cut or fade out while still moving |

### 1.3 Frame-Rate Psychology & The `posterizeTime` Whole-Divisor Law
- **12 fps ("On Twos" / `posterizeTime(12)` / Remotion `posterize: 2` at 24fps or `posterize: 3` at 36fps):** Evokes hand-crafted cel animation, stop-motion texture, and *Spider-Verse* graphic stylization.
- **24 fps (35mm Cinema Standard):** Wide inter-frame spacing (`41.67 ms`) with a `180°` shutter (`1/48 s` exposure) creates natural motion blur that fuses discrete frames without the hyper-real "soap-opera effect."
- **30 fps (Digital Video / Remotion / Concat Default):** Clean compromise for screen captures, kinetic typography, and social feeds (`33.33 ms/f`).
- **60 fps (Interactive UI / High-Speed Telemetry):** Required for direct finger/cursor tracking and fast horizontal tickers to prevent retinal strobing.
- **The Whole-Divisor Rule (Anti-Judder Law):** When mixing frame rates inside one composition (e.g., a 12 fps character or turbulent line-boil inside a smooth camera move), **the composition frame rate MUST be an exact integer multiple of the posterized frame rate** (`compFps % targetFps === 0`) ([Reddit r/AfterEffects 1gtc984](https://www.reddit.com/r/AfterEffects/comments/1gtc984/how_do_you_choose_the_appropriate_frame_rate_for/)). Putting `24 fps` footage or `posterizeTime(24)` inside a `60 fps` timeline ($60 / 24 = 2.5$) forces alternating `2-3-2-3` frame holds (3:2 pulldown judder). Use **`12 fps`** ($60/12=5, 24/12=2$) or **`15 fps`** ($60/15=4, 30/15=2$) instead.

---

## 2. Asymmetric Easing Curves & Speed/Value Graph Translation

### 2.1 Why Symmetric `ease-in-out` Looks Robotic
Default CSS `ease-in-out` (`cubic-bezier(0.42, 0, 0.58, 1)`) and After Effects `F9` Easy Ease (`33.33% / 33.33%` influence) spend 50% of their duration accelerating and 50% decelerating. Real physical objects struck by an impulse accelerate almost instantaneously and spend **70–85% of their trajectory decelerating under friction**.
- **Peak-to-Average Velocity Ratio ($v_{\text{peak}} / v_{\text{avg}}$):**
  - $v_{\text{peak}} / v_{\text{avg}} = 1.0$: Linear (robotic, dead).
  - $v_{\text{peak}} / v_{\text{avg}} = 1.5$: Standard `F9` Easy Ease (`33% / 33%`).
  - $v_{\text{peak}} / v_{\text{avg}} = 2.2\text{–}3.5$: Studio Mograph "Snap" (`15–25%` outgoing influence, `75–85%` incoming influence).
  - $v_{\text{peak}} / v_{\text{avg}} > 4.5$ (bilateral influence `> 90–95%`): **Teleportation Glitch** — the object jumps `70%` of the screen across `1–2` middle frames, breaking visual tracking unless masked by directional motion blur ([DesignKkashi](https://designkkashi.com/en/after-effects-graph-editor-speed-value-influence-guide/)).

### 2.2 Exact Conversion: After Effects Influence % $\leftrightarrow$ CSS `cubic-bezier(x1, y1, x2, y2)`
In After Effects' Speed/Value Graph, outgoing influence $I_{\text{out}} \in (0, 100]$, incoming influence $I_{\text{in}} \in (0, 100]$, outgoing speed $S_{\text{out}}$, incoming speed $S_{\text{in}}$, and average speed $S_{\text{avg}} = \Delta x / \Delta t$ map to normalized cubic-bezier control points $P_1(x_1, y_1)$ and $P_2(x_2, y_2)$ via ([GDSE #113853](https://graphicdesign.stackexchange.com/questions/113853/use-css-cubic-bezier-for-keyframes-in-after-effects)):

$$x_1 = \frac{I_{\text{out}}}{100}, \quad y_1 = x_1 \cdot \frac{S_{\text{out}}}{S_{\text{avg}}}, \qquad x_2 = 1 - \frac{I_{\text{in}}}{100}, \quad y_2 = 1 - (1 - x_2) \cdot \frac{S_{\text{in}}}{S_{\text{avg}}}$$

For standard ease-in-out keyframes where start and end velocities are zero ($S_{\text{out}} = S_{\text{in}} = 0$, flat horizontal value-graph tangents):

$$\text{cubic-bezier}\!\left(\frac{I_{\text{out}}}{100},\; 0,\; 1 - \frac{I_{\text{in}}}{100},\; 1\right)$$

- **Example 1 (Classic `75% / 75%` Mograph Snap):** `cubic-bezier(0.75, 0, 0.25, 1)`
- **Example 2 (Fast-Out / Heavy-Settle `16% / 84%`):** With fast initial impulse ($S_{\text{out}} > 0$) and zero landing velocity ($S_{\text{in}} = 0$): `cubic-bezier(0.16, 1, 0.3, 1)` (`expo.out`).

### 2.3 Canonical Practitioner `cubic-bezier` Catalog

| Curve Name | `cubic-bezier(x1, y1, x2, y2)` | GSAP Equivalent | AE Influence | Primary Use Case |
|---|---|---|---|---|
| **Expo Out (Default Hero Entrance)** | `cubic-bezier(0.16, 1, 0.3, 1)` | `"expo.out"` | Out `0%@fast`, In `70–84%` | Cards rising in, baseline text reveals, focus overlays, modal entrances |
| **Quint Out (UI Snap Entrance)** | `cubic-bezier(0.23, 1, 0.32, 1)` | `"power4.out"` | Out `0%@fast`, In `68–77%` | Emil Kowalski `--ease-out`; general UI entrances & hover response |
| **M3 Emphasized Decelerate** | `cubic-bezier(0.05, 0.7, 0.1, 1.0)` | Custom | Out `5%`, In `90%` | Material 3 hero/screen-level entrances from off-screen |
| **M3 Emphasized Accelerate** | `cubic-bezier(0.3, 0.0, 0.8, 0.15)` | `"power3.in"` | Out `30%`, In `20%@fast` | Permanent exits off-screen (never slow down at the exit edge) |
| **iOS Sheet / Drawer Curve** | `cubic-bezier(0.32, 0.72, 0, 1)` | Custom | Out `32%`, In `100%` | Bottom sheets, drawers, and Apple-style spatial slides |
| **Active Camera Push/Pull** | `cubic-bezier(0.65, 0, 0.35, 1)` | `"power3.inOut"` | Out `65%`, In `65%` | HuaRec deliberate camera dolly/zoom between two static holds |
| **Follow-Camera Chase** | `cubic-bezier(0.33, 0, 0.15, 1)` | Custom | Out `33%`, In `85%` | Shotcraft camera tracking an already-moving cursor or subject |
| **Overshoot (`easeOutBack`)** | `cubic-bezier(0.34, 1.56, 0.64, 1)` | `"back.out(1.7)"` | Value graph `>100%` | Tactile toggles, badge pops, logo expansion settle |
| **Anticipation (`easeInBack`)** | `cubic-bezier(0.36, 0, 0.66, -0.56)` | `"back.in(1.7)"` | Value graph `<0%` | Pre-launch wind-up (transform only; never apply to opacity/color) |

---

## 3. Damped Harmonic Oscillators & Cross-Engine Spring Math

### 3.1 Second-Order Spring ODE & Damping Regimes
A unit-displacement spring ($x(0) = 0 \to x(\infty) = 1$, error $d(t) = 1 - x(t)$) with mass $m$, stiffness $k$, and viscous damping $c$ obeys ([CosynPa `SpringCurve.swift`](https://raw.githubusercontent.com/CosynPa/RevealSpringAnimation/master/RevealSpringAnimation/Math/SpringCurve.swift), [WebKit `spring.js`](https://webkit.org/demos/spring/spring.js)):

$$m \ddot{x}(t) + c \dot{x}(t) + k (x(t) - 1) = 0 \iff \ddot{x}(t) + 2 \zeta \omega_0 \dot{x}(t) + \omega_0^2 (x(t) - 1) = 0$$

where natural frequency $\omega_0 = \sqrt{k/m}$ (in $\text{rad/s}$), critical damping $c_{\text{crit}} = 2\sqrt{km}$, and damping ratio $\zeta = \frac{c}{2\sqrt{km}} = \frac{c}{2 m \omega_0}$.

### 3.2 Exact Closed-Form Evaluator (Seek-Safe Pure Function of $t$ with Initial Velocity $v_0$)
Never use stateful frame-by-frame Euler integrators in video engines (Remotion, HyperFrames, GSAP seek), because scrubbing backward or rendering out-of-order frames breaks state. Always evaluate the exact closed-form analytical solution at time $t$ (in seconds) with normalized initial velocity $v_0$:

1. **Underdamped ($0 \le \zeta < 1$, damped frequency $\omega_d = \omega_0 \sqrt{1 - \zeta^2}$):**
   $$x(t) = 1 - e^{-\zeta \omega_0 t} \left( \cos(\omega_d t) + \frac{\zeta \omega_0 - v_0}{\omega_d} \sin(\omega_d t) \right)$$
   - *First Peak Time ($v_0 = 0$):* $t_{\text{peak}} = \frac{\pi}{\omega_d}$
   - *Fractional Peak Overshoot ($v_0 = 0$):* $M_p = \exp\!\left(\frac{-\pi \zeta}{\sqrt{1 - \zeta^2}}\right)$ (e.g., $\zeta = 0.6 \implies M_p = 9.48\%$ overshoot; $\zeta = 0.7 \implies M_p = 4.60\%$; $\zeta = 0.8 \implies M_p = 1.52\%$).
2. **Critically Damped ($\zeta = 1$):**
   $$x(t) = 1 - e^{-\omega_0 t} \left( 1 + (\omega_0 - v_0) t \right)$$
3. **Overdamped ($\zeta > 1$, $\omega_d = \omega_0 \sqrt{\zeta^2 - 1}$):**
   $$x(t) = 1 - e^{-\zeta \omega_0 t} \left( \cosh(\omega_d t) + \frac{\zeta \omega_0 - v_0}{\omega_d} \sinh(\omega_d t) \right)$$

```ts
// Seek-safe closed-form spring evaluator (works in GSAP custom ease, Canvas, Remotion, or WebGL)
export function evaluateSpring(
  t: number,
  { response = 0.45, dampingFraction = 0.75, initialVelocity = 0 } = {}
): number {
  if (t <= 0) return 0;
  const omega0 = (2 * Math.PI) / response;
  const zeta = dampingFraction;
  const env = Math.exp(-zeta * omega0 * t);
  if (zeta < 1) {
    const omegaD = omega0 * Math.sqrt(1 - zeta * zeta);
    return 1 - env * (Math.cos(omegaD * t) + ((zeta * omega0 - initialVelocity) / omegaD) * Math.sin(omegaD * t));
  } else if (zeta === 1) {
    return 1 - env * (1 + (omega0 - initialVelocity) * t);
  } else {
    const omegaD = omega0 * Math.sqrt(zeta * zeta - 1);
    return 1 - env * (Math.cosh(omegaD * t) + ((zeta * omega0 - initialVelocity) / omegaD) * Math.sinh(omegaD * t));
  }
}
```

### 3.3 Cross-Engine Parameter Conversion Formulas
Per Apple [WWDC23 Session 10158 (*Animate with Springs*)](https://developer.apple.com/videos/play/wwdc2023/10158/) and [GetStream/swiftui-spring-animations](https://raw.githubusercontent.com/GetStream/swiftui-spring-animations/main/README.md):

$$\text{stiffness } k = m \left(\frac{2\pi}{\text{response}}\right)^2, \qquad \text{damping } c = \frac{4\pi \cdot \text{dampingFraction} \cdot m}{\text{response}}$$

$$\text{response} = \frac{2\pi}{\sqrt{k / m}}, \qquad \text{dampingFraction } \zeta = \frac{c}{2\sqrt{k m}}, \qquad \text{Apple } \text{bounce} = \begin{cases} 1 - \zeta & (\zeta \le 1) \\ \frac{1}{\zeta} - 1 & (\zeta > 1) \end{cases}$$

| Preset Archetype | Apple `response` / `dampingFraction` | Physical `{ mass: 1, stiffness, damping }` | Peak Overshoot ($M_p$) | Recommended Target |
|---|---|---|---|---|
| **Snappy UI Micro-Spring** | `response: 0.28, dampingFraction: 0.85` | `{ stiffness: 504, damping: 38.1 }` | `0.6%` | Buttons, switches, small pills |
| **Apple Default Smooth** | `response: 0.50, dampingFraction: 1.00` | `{ stiffness: 158, damping: 25.1 }` | `0.0%` | Navigation push, sheets, modals, opacity |
| **Mograph Bouncy Hero** | `response: 0.45, dampingFraction: 0.65` | `{ stiffness: 195, damping: 18.2 }` | `6.8%` | Hero cards, kinetic badges, icon pops |
| **M3 Expressive Fast Spatial** | `response: 0.22, dampingFraction: 0.60` | `{ stiffness: 800, damping: 33.9 }` | `9.5%` | Material 3 Expressive spatial morph ([PR #319](https://github.com/minop1205/m3-expressive-react/pull/319)) |
| **M3 Expressive Default Spatial** | `response: 0.32, dampingFraction: 0.80` | `{ stiffness: 380, damping: 31.2 }` | `1.5%` | Standard M3E container expansion |
| **M3 Expressive Effects (Opacity/Color)** | `response: 0.16, dampingFraction: 1.00` | `{ stiffness: 1600, damping: 80.0 }` | `0.0%` | **Rule:** Never use underdamped ($\zeta < 1$) springs on opacity or color (overshoot clips at `1.0` and flashes) |

> **Remotion & WebKit Engine Pitfall:** Both Remotion's `spring-utils.ts` and WebKit's `spring.js` omit the $\zeta > 1$ (`cosh/sinh`) branch and fall back to `criticallyDampedPosition` whenever $\zeta \ge 1$, meaning increasing `damping` above $2\sqrt{km}$ (e.g., `damping: 200` on `stiffness: 100, mass: 1` where $c_{\text{crit}} = 20$) produces the exact same curve as `damping: 20` ([Remotion `spring-utils.ts`](https://raw.githubusercontent.com/remotion-dev/remotion/main/packages/core/src/spring/spring-utils.ts)).

---

## 4. Disney's 12 Principles Adapted for 2D, Vector & UI Motion

1. **Squash & Stretch (Constant-Area & Constant-Volume Conservation):**
   - **2D Area Invariance ($s_x \cdot s_y = 1$):** When stretching an element along its motion axis by scale factor $s_x$ (or percentage $S_x \%$), its perpendicular axis MUST compress by $s_y = 1 / s_x$ ($S_y = 10000 / S_x \%$) so perceived mass stays constant ([Dan Ebberts](https://www.motionscript.com/mastering-expressions/simulation-basics-3.html)):
     ```js
     // After Effects / JS 2D constant-area scale expression
     const sx = transform.scale[0];
     const sy = (100 * 100) / Math.max(1, sx);
     [sx, sy];
     ```
   - **3D Volume Invariance ($s_x^2 \cdot s_y = 1$):** For a 3D object stretching along $Y$, both radial axes $X$ and $Z$ scale by $s_x = s_z = 1 / \sqrt{s_y}$ ($S_x = 100 / \sqrt{S_y / 100}$).
   - **Restraint Rule:** In UI/corporate mograph, cap deformation at `3–8%` (`105% × 95.2%`), applied only across the `2–3` peak-velocity frames and impact frame.

2. **Anticipation (Reverse Impulse):**
   - Before a major entrance, jump, or throw, move `5–10%` in the **opposite direction** over `2–4 frames` (`80–150 ms`, `ease-in`) — e.g., `scale: 1 -> 0.95 -> 1.04 -> 1.0` or `translateY: 0 -> +12px -> -180px`.

3. **Follow-Through & Overlapping Action (Non-Cascading Phase Lag):**
   - Child elements (badge inside card, subtitle under headline, shadow beneath floating card) lag their parent by `2–4 frames` (`60–130 ms`).
   - **The $O(N^2)$ Cascading Expression Trap:** In After Effects or reactive trees, never reference `thisComp.layer(index - 1).position.valueAtTime(time - d)` across a chain of $N$ layers — each layer recursively evaluates all predecessors at past timestamps. Reference the **leader layer directly** with linear index offset ([Dan Ebberts](https://www.motionscript.com/mastering-expressions/follow-the-leader.html)):
     ```js
     const leader = thisComp.layer("Leader");
     const delay = (index - leader.index) * 2 * thisComp.frameDuration; // 2f per layer
     leader.transform.position.valueAtTime(time - delay);
     ```

4. **Harmonic Overshoot vs. Parabolic Gravity Bounce ([Dan Ebberts](https://www.motionscript.com/articles/bounce-and-overshoot.html)):**
   - **Harmonic Overshoot (Elastic Joint / UI Spring):** Oscillates **through** the resting value (+ and -) at constant angular frequency $\omega$, with amplitude proportional to arrival velocity $v(t_{\text{key}})$:
     $$x(t) = x_{\text{key}} + \frac{v_{\text{key}}}{\omega} \sin(\omega \Delta t) e^{-d \Delta t}$$
   - **Parabolic Gravity Bounce (Floor Collision):** Folds strictly **one-sided** above the floor ($|y|$) under constant gravity $g$, and **each successive bounce duration shortens by the coefficient of restitution $e \in (0, 1)$** ($T_{n+1} = e \cdot T_n$, height $H_{n+1} = e^2 \cdot H_n$). Using constant-period `|sin(t)|` for floor bounces is a classic amateur error.

5. **Arcs via Separate Dimensions (Orthogonal X/Y Easing):**
   - Identical easing on $X$ and $Y$ produces a rigid diagonal line. Split dimensions (`translateX` + `translateY`) and pair **different easing curves on each axis** — e.g., $X$ on `easeOutQuad` and $Y$ on `easeInQuart` (or ballistic linear $X$ + parabolic $Y$) — to generate smooth, tangent-free spatial arcs automatically.

6. **Solid Drawing & Origin-Aware Scaling (Never `scale(0)`):**
   - Physical objects never materialize from a singularity (`scale(0)`). Start entrances at **`scale(0.92)` to `scale(0.97)`** with `opacity: 0`, and bind `transform-origin` to the causal trigger point ([Emil Kowalski STANDARDS.md](https://raw.githubusercontent.com/emilkowalski/skills/main/skills/review-animations/STANDARDS.md)).

---

## 5. Smear Frames & Rotary Shutter Motion Blur

- **The $180^\circ$ Shutter Law:** Motion blur exposure duration is $T_{\text{exp}} = \frac{\theta}{360^\circ \cdot \text{fps}}$ ([ACFM](https://www.acfm.edu.in/blogs/the-science-of-cinematic-motion-blur), [Reddit r/AfterEffects 7dbod5](https://www.reddit.com/r/AfterEffects/comments/7dbod5/what_is_shutter_angle_and_phase/)):
  - **Standard Cinema / Natural Motion:** $\theta = 180^\circ$, **Shutter Phase $= -90^\circ$** (centers the blur symmetrically across the frame timestamp rather than trailing behind it).
  - **Whip Pans / High-Energy Shape Throws:** $\theta = 360^\circ\text{–}720^\circ$ across the `6–10` transition frames so adjacent frames bridge without strobing gaps.
- **Velocity-Driven CSS / SVG Blur (Seek-Safe Substitute):**
  When sub-frame multi-sampling (`<CameraMotionBlur samples={10}>`) is too expensive, derive directional blur from central-difference frame velocity $v(f) = \frac{|x(f+1) - x(f-1)|}{2}$:
  ```js
  // Active only during fast movement; guaranteed 0px (razor-sharp) on all static hold frames
  const blurPx = velocity > 0.6 ? Math.min(10, velocity * 5) : 0;
  ```
