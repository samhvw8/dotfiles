# Programmatic Motion Engines: Remotion, Motion Canvas, Manim & Concat MCP

## Table of Contents
1. [Architecture Matrix: Choosing the Right Programmatic Engine](#1-architecture-matrix-choosing-the-right-programmatic-engine)
2. [Remotion (React Deterministic Frame-Driven Video Engine)](#2-remotion-react-deterministic-frame-driven-video-engine)
3. [Motion Canvas & Revideo (TypeScript Generator & Reactive Signal Engine)](#3-motion-canvas--revideo-typescript-generator--reactive-signal-engine)
4. [Manim (Mathematical & Technical Vector Motion Engine: CE, GL, ManimGX)](#4-manim-mathematical--technical-vector-motion-engine-ce-gl-manimgx)
5. [Concat MCP (`v0.2.8` Multi-Track Timeline & Effect Keyframing)](#5-concat-mcp-v028-multi-track-timeline--effect-keyframing)

---

## 1. Architecture Matrix: Choosing the Right Programmatic Engine

| Engine | Execution Paradigm | Best For | Determinism Mechanism | Headless Render Bottleneck & Fix |
|---|---|---|---|---|
| **Remotion (`v4.0.541+`)** | Pure functional frame index $f(\text{frame})$ | React UI showcases, data-driven social videos, templated promos | `useCurrentFrame()`, `interpolate()`, `spring()`, `random(seed)` | Avoid `<OffthreadVideo>` at high concurrency ([`#4300`](https://github.com/remotion-dev/remotion/issues/4300)); use `@remotion/media` WebCodecs `<Video>` + v4.0.534+ POSIX shared-memory capture (`yuva420p`) |
| **HyperFrames / GSAP HTML** | Imperative timeline stepped via `window.__hf.seek(t)` | Launch films, 2.5D DOM camera rigs, SVG/Canvas/Three.js hybrids | `gsap.timeline({ paused: true })` + `tl.seek(t)` | Zero CSS `blur()`/`drop-shadow()` over large areas; use `perspective(100px)` for subpixel text |
| **Motion Canvas / Revideo** | Generator coroutines (`yield*`) + reactive signals (`s()`) | CS algorithm walkthroughs (`<Code>`), procedural node graphs | Generator step clock + `useRandom()` PRNG | Upstream lacks official CLI renderer ([`#415`](https://github.com/motion-canvas/motion-canvas/issues/415)); use **[Revideo (`redotvideo/revideo`)](https://github.com/redotvideo/revideo)** for headless cloud/CLI rendering |
| **Manim (`CE` / `GL`)** | Imperative `self.play()` queue + per-frame `add_updater(dt)` | Mathematical proofs, LaTeX equation morphs, 3D calculus surfaces | Fixed `1/fps` `dt` steps + `ValueTracker` | Use `TransformMatchingTex` for equations and `always_redraw` for dynamic geometry |
| **Concat MCP (`v0.2.8`)** | Multi-track non-linear timeline + GPU effect/shape compositor | Assembling rendered scenes, audio mixing, kinetic captions, color grading, masks, stabilization | Native timeline engine + `preview_frame` inspection | Always call `preview_frame` at key timestamps before `export_start` |

---

## 2. Remotion (React Deterministic Frame-Driven Video Engine)

### 2.1 Core Invariants & Official `remotion-dev/skills` Rules (`v4.0.541`)
1. **Forbidden Nondeterminism:** Never use CSS `transition`, CSS `@keyframes`, `requestAnimationFrame`, `setTimeout`, or `Math.random()`. Because headless Chromium renders frames concurrently across worker tabs in arbitrary order, every visual property MUST be a pure function of `useCurrentFrame()`.
2. **Always Clamp `interpolate()`:** By default, `interpolate(frame, [0, 30], [0, 1])` extrapolates linearly to `-5` or `+10` outside `[0, 30]`. Always pass explicit clamping:
   ```tsx
   const progress = interpolate(frame, [0, 24], [0, 1], {
     extrapolateLeft: 'clamp',
     extrapolateRight: 'clamp',
     easing: Easing.bezier(0.16, 1, 0.3, 1),
   });
   ```
3. **Logarithmic Perceptual Scale (`output: 'perceptual-scale'`):** Linear interpolation of `scale` from `1 -> 16` spends half the duration between `8x` and `16x`, making the start look explosively fast and the end sluggish. In Remotion `v4.0.431+`, pass `output: 'perceptual-scale'` (which interpolates $z(t) = z_1 \cdot (z_2 / z_1)^t$) and `posterize: 2` or `3` for stylized cel-animation holds ([`remotion-markup/timing.md`](https://github.com/remotion-dev/skills/blob/main/skills/remotion-markup/timing.md)):
   ```tsx
   const zoom = interpolate(frame, [0, 60], [1, 8], {
     extrapolateLeft: 'clamp',
     extrapolateRight: 'clamp',
     output: 'perceptual-scale',
   });
   ```
4. **Multi-Keyframe Per-Segment Easing Arrays (`v4.0.425+`):** Pass an array of easing functions of length `inputRange.length - 1` to apply distinct curves to entrance, hold, and exit in a single `interpolate()` call:
   ```tsx
   const y = interpolate(
     frame,
     [0, 18, 72, 86],
     [80, 0, 0, -60],
     {
       easing: [
         Easing.bezier(0.16, 1, 0.3, 1), // Fast-out snap entrance
         Easing.linear,                   // Dead-still hold
         Easing.bezier(0.7, 0, 0.84, 0),  // Fast accelerate exit
       ],
       extrapolateLeft: 'clamp',
       extrapolateRight: 'clamp',
     }
   );
   ```

### 2.2 `spring()` Order of Operations & `durationInFrames` Stretching
In Remotion's [`spring-calculation.ts`](https://github.com/remotion-dev/remotion/blob/main/packages/core/src/spring/spring-calculation.ts), the frame pipeline executes in strict order:
1. Subtract `delay`: `f1 = frame - delay`
2. Stretch to `durationInFrames`: Multiply playback rate by `naturalDuration / durationInFrames`
3. Apply `fps` step (`1000 / fps` ms)
4. Clamp to `[0, 1]` if `overshootClamping: true`
5. Flip `1 - val` if `reverse: true`
6. Map `[0, 1] -> [from, to]`

```tsx
// Physical spring (prefer over durationInFrames unless strict beat-lock is required)
const enter = spring({
  frame: frame - index * 3,
  fps,
  config: { mass: 1, damping: 18, stiffness: 180, overshootClamping: false },
});
```

### 2.3 Timeline Composition: `<Sequence>`, `<Series>`, `<TransitionSeries>`, `<Overlay>`
- **Local Frame Reset:** Inside `<Sequence from={30} durationInFrames={90}>`, `useCurrentFrame()` resets to `0` at parent frame `30`!
- **`layout="none"` for Canvas / Three.js / SVG / Flex Children:** By default, `<Sequence>` wraps children in an `<AbsoluteFill>` (`position: absolute; inset: 0; display: flex`). Always pass **`layout="none"`** when wrapping `<Sequence>` around flex/grid items, SVG `<g>` elements, or Three.js meshes!
- **`<TransitionSeries>` Total Duration Math:** Because transitions overlap adjacent scenes, total composition duration is:
  $$T_{\text{total}} = \sum_{i=1}^{N} D_{\text{scene},i} - \sum_{j=1}^{M} D_{\text{transition},j}$$
  Use `<TransitionSeries.Overlay durationInFrames={20}>` (instead of `.Transition`) for light leaks, flash frames, or whip overlays that should **not** shorten the timeline.

### 2.4 Production Pitfalls & High-Speed Rendering Workarounds
1. **CPU Thrashing with `<OffthreadVideo>` ([`remotion#4300`](https://github.com/remotion-dev/remotion/issues/4300)):** Setting `--concurrency=100%` on a 32/48-core machine spawns 32 multi-threaded FFmpeg decoders simultaneously and stalls the CPU. Use `@remotion/media` (`<Video>` powered by WebCodecs) and set `--concurrency=4` to `8`.
2. **Google Fonts `delayRender` Timeout ([`font-loading-errors.mdx`](https://github.com/remotion-dev/remotion/blob/main/packages/docs/docs/troubleshooting/font-loading-errors.mdx)):** Never call `loadFont()` with zero arguments (downloads all 40+ weights/subsets and hits the 28s timeout). Always restrict subsets and weights:
   ```tsx
   import { loadFont } from '@remotion/google-fonts/Inter';
   const { fontFamily } = loadFont('normal', { weights: ['500', '700'], subsets: ['latin'] });
   ```
3. **CSS `background-image` / `mask-image` Flicker ([`background-image.mdx`](https://github.com/remotion-dev/remotion/blob/main/packages/docs/docs/troubleshooting/background-image.mdx)):** Chromium does not block frame capture on CSS `url(...)` images. Always render `<Img src={...} />` from `remotion` (which wraps `delayRender()`).
4. **Using GSAP inside Remotion ([`remotion#1705`](https://github.com/remotion-dev/remotion/issues/1705)):** Create the timeline with `useMemo(() => gsap.timeline({ paused: true }), [])` and call `tl.seek(frame / fps)` inside `useLayoutEffect`.

---

## 3. Motion Canvas & Revideo (TypeScript Generator & Reactive Signal Engine)

### 3.1 Generator Coroutine Flow Control (`yield*`)
Motion Canvas models animations as TypeScript generator functions (`function* (view)`) stepped by an internal frame clock:
- **`yield* all(animA, animB)`:** Runs animations in parallel and waits for the longest to finish.
- **`yield* chain(animA, animB)`:** Runs animations sequentially back-to-back.
- **`yield* sequence(0.06, ...anims)`:** Staggers the start of each generator by `0.06 s`.
- **`yield* delay(0.25, anim)`:** Waits `0.25 s` before starting `anim`.
- **`const task = yield loop(Infinity, () => ...)`:** Spawns a background loop coroutine without blocking the main timeline (`cancel(task)` stops it).

### 3.2 Tri-Modal Reactive Signals (`createSignal`)
Every property (`node.x`, `node.opacity`, or custom `const radius = createSignal(100)`) uses a 3-signature callable pattern:
1. **Getter (`radius()`):** Returns current value. Derived signals `const area = createSignal(() => Math.PI * radius() ** 2)` recompute lazily and cache until dependencies change.
2. **Instant Setter (`radius(250)`):** Mutates value immediately on the current frame.
3. **Tween Generator (`yield* radius(250, 0.6, easeOutExpo)`):** Tweens from current value to `250` over `0.6 s`.

### 3.3 Procedural `<Code>` Diffing, `<Latex>` Morphing & `<Camera>`
```tsx
import { makeScene2D, Code, Latex, Camera } from '@motion-canvas/2d';
import { all, createRef, easeInOutCubic, easeOutExpo } from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const camera = createRef<Camera>();
  const code = createRef<Code>();
  const tex = createRef<Latex>();

  view.add(
    <Camera ref={camera}>
      <Code ref={code} fontSize={36} y={-120} code={`const v = d / t;`} />
      <Latex ref={tex} tex={['\\vec{F}', '=', 'm', '\\vec{a}']} y={120} fill="#F8FAFC" fontSize={56} />
    </Camera>
  );

  // Token-aware AST code diff + spotlight selection + LaTeX sub-token morph
  yield* all(
    camera().centerOn(code(), 0.65, easeInOutCubic),
    camera().zoom(1.35, 0.65, easeInOutCubic),
    code().code.replace(code().findFirstRange('v = d / t'), 'x = v0 * t + 0.5 * a * t ** 2', 0.65),
    tex().tex(['\\vec{a}', '=', '\\frac{\\vec{F}}{m}'], 0.65, easeOutExpo),
  );
});
```

### 3.4 Motion Canvas Production Fixes
- **Headless CLI Rendering ([`motion-canvas#415`](https://github.com/motion-canvas/motion-canvas/issues/415)):** Upstream Motion Canvas requires an interactive browser tab to export. For automated CLI/CI or agent rendering, use **[Revideo (`@revideo/core` + `@revideo/renderer`)](https://github.com/redotvideo/revideo)** (`renderVideo({ projectFile, settings: { outFile: 'out.mp4' } })`).
- **Audio Sync Drift Fix ([`motion-canvas#1142`](https://github.com/motion-canvas/motion-canvas/issues/1142)):** Never attach VBR `.mp3` audio in Motion Canvas (causes `1-3 s` seek drift). Convert audio to uncompressed `.wav` (`ffmpeg -i in.mp3 -c:a pcm_s16le -ar 48000 out.wav`) before importing.

---

## 4. Manim (Mathematical & Technical Vector Motion Engine: CE, GL, ManimGX)

### 4.1 `ValueTracker` + `always_redraw` Reactive Geometry Pattern
When a geometric diagram (secant line, Riemann rectangles, tangent vector, dynamic label) depends on a changing parameter $t$, drive the parameter with `ValueTracker` and bind dependent Mobjects via `always_redraw` or `.add_updater`:

```python
from manim import *
import numpy as np

class TangentTraceScene(MovingCameraScene):
    def construct(self):
        axes = Axes(x_range=[0, 6, 1], y_range=[-2, 2, 1], x_length=10, y_length=4.5)
        curve = axes.plot(lambda x: np.sin(x) * np.exp(-0.25 * x), color= TEAL_B)
        t_tracker = ValueTracker(0.4)

        dot = always_redraw(lambda: Dot(
            axes.i2gp(t_tracker.get_value(), curve), color=YELLOW, radius=0.09
        ))
        tangent = always_redraw(lambda: axes.get_secant_slope_group(
            x=t_tracker.get_value(), graph=curve, dx=0.01,
            secant_line_color=MAROON_B, secant_line_length=3.5
        ))

        self.play(Create(axes, run_time=0.6), Create(curve, run_time=0.9))
        self.add(tangent, dot)
        self.play(
            t_tracker.animate.set_value(4.8),
            self.camera.frame.animate.scale(0.75).move_to(axes.c2p(3.2, 0.2)),
            run_time=2.4,
            rate_func=rate_functions.ease_in_out_cubic,
        )
        self.wait(0.8)
```

### 4.2 `TransformMatchingTex` vs. `ReplacementTransform`
- Never use raw `Transform(eq1, eq2)` on multi-term equations (interpolates unrelated glyph curves through a scrambled mess).
- Split LaTeX strings into explicit double-brace tokens `MathTex(r"{{E}}", r"=", r"{{m}}", r"{{c}}^2")` and use **`TransformMatchingTex(eq1, eq2, path_arc=PI/4)`** so shared symbols glide along circular arcs while new symbols fade in cleanly.

---

## 5. Concat MCP (`v0.2.8` Multi-Track Timeline & Effect Keyframing)

When the Concat MCP server (`mcp__concat_*`) is mounted, use it to assemble multi-scene motion graphics, add procedural vector shapes (`addShapeClip`), animate properties with `cubic-bezier` keyframes (`keyframe_set`), apply GPU shaders/filters/transitions (`effects_list`, `effect_layer_add`), lay down kinetic captions (`captions_add`), and inspect rendered frames (`preview_frame`):

### 5.1 Core Concat MCP Workflow
1. **Create or Open Project:** Call `mcp__concat_project_create` (`{ location, name, video: { width: 1920, height: 1080, rateNum: 30, rateDen: 1 } }`) or `mcp__concat_project_open` (`{ path }`).
2. **Import & Probe Media:** Call `mcp__concat_media_probe` to inspect duration/streams, then `mcp__concat_media_import` (`{ path, file }`) and `mcp__concat_clip_add` / `mcp__concat_clips_add_sequence`.
3. **Add Procedural Vector Shapes via `edit_apply` (`addShapeClip`):**
   ```json
   {
     "path": "/path/to/project.concat",
     "command": {
       "op": "addShapeClip",
       "name": "Hero Card",
       "trackId": null,
       "start": 0.0,
       "duration": 4.0,
       "kind": "rectangle",
       "size": 0.35,
       "style": { "fill": "#FFBE0B", "stroke": "#FFFFFF", "strokeWidth": 0.004 }
     }
   }
   ```
4. **Animate with Asymmetric Cubic-Bezier Keyframes (`keyframe_set`):**
   - `at` is a normalized fraction of the clip's duration (`0.0` to `1.0`).
   - `easing` accepts `"linear"`, `"ease-in"`, `"ease-out"`, `"ease-in-out"`, `"hold"`, or an exact 4-tuple **`[x1, y1, x2, y2]`** (e.g., `[0.16, 1.0, 0.3, 1.0]` for Expo Out snap!).
   - Animatable `property` values: `"scale"`, `"offsetX"`, `"offsetY"`, `"rotation"`, `"opacity"`, `"volume"`, `"maskX"`, `"maskY"`, `"maskWidth"`, `"maskHeight"`, `"maskRotation"`, `"maskRoundness"`, `"maskFeather"`.
5. **Apply GPU Effects, Transitions & Adjustment Layers:**
   - Call `mcp__concat_effect_layer_add` (`{ path, effectId: "concat.bloom", start: 0, duration: 5, params: { intensity: 35 } }`) or attach `transitionIn` / `transitionOut` (`"cross-fade"`, `"iris"`, `"wipe"`, `"push"`) via `mcp__concat_clip_update`.
6. **Verify Every Key Beat with `preview_frame` Before Exporting:**
   - Call `mcp__concat_preview_frame` (`{ path, time: 1.25 }`) across each scene's entrance, peak, and settled hold to inspect typography, contrast, and alignment visually, then render via `mcp__concat_export_start` + `mcp__concat_export_wait`.
