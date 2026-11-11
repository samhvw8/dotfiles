---
name: motion-graphics
description: "Design, build and check motion graphics as code: product and launch videos, explainers, kinetic typography, animated charts, title sequences, and UI or web animation. Covers timing, easing and spring math, camera moves, transitions, audio sync, flash safety and export, in Remotion, Motion Canvas, Manim, GSAP/HTML, CSS, SVG, Rive/Lottie and the Concat editor. Use when storyboarding, coding, rendering or reviewing a video or an animation, or when motion looks robotic, floaty or generic. For sensing an existing video use mediasift; for static UI design use impeccable."
---

# Motion graphics

Build motion that reads clearly and feels made on purpose, then prove it with measured checks on the render.

## How to read the numbers in this skill

Every number in the references carries one of three labels. Treat them differently.

- **[M] Math.** Derived and checked. Rely on it. Recompute with `scripts/motion_math.py`; do not copy a value from memory.
- **[S] Source.** From a standard, a paper or source code that was read. The label names the source.
- **[H] Heuristic.** A practitioner's starting value with no measurement behind it. Start there, look at the frames, and change it when the picture says so. Never present an [H] value to the user as a research finding.

Most timing and choreography numbers are [H]. The math and the engine internals are [M] or [S].

## Workflow

### 1. Find the direction before you build

A wrong look costs the whole film. When the user has not named a look, show two or three directions that differ in kind (ground, type, motion character) as still gray-box frames or short descriptions, and let them choose. Build after they say go.

The six studio archetypes in `references/web-svg-shaders-and-chinese-mg-craft.md` §5.2 are prompts for this step. They are style notes, not measurements of those studios.

Avoid the default model look unless the brand asks for it: a dark navy void, blurred purple and cyan blobs, fake HUD corner labels, and the same fade-up on every element. The ban list is in the same file, §5.1.

### 2. Pick one engine

| Job | Engine |
|---|---|
| React UI showcase, data-driven or templated video | Remotion |
| Launch film, DOM camera rig, SVG / Canvas / WebGL mix | HTML + GSAP timeline that a frame stepper seeks |
| Code walkthrough, node graph, algorithm explainer | Motion Canvas |
| Math, LaTeX, 3D surfaces | Manim |
| Join rendered scenes, captions, sound, export | Concat MCP, or FFmpeg |

For the HTML path, define `window.__seek(tSeconds)` in the page and render with `node scripts/render_html.mjs page.html out.mp4 --seconds S` (headless Chrome and ffmpeg, no npm install; `--still T out.png` captures one frame).

Patterns and known pitfalls: `references/programmatic-engines-remotion-motioncanvas-manim.md`. For a tool with an MCP schema, read the live schema; do not trust a copied parameter list.

### 3. Storyboard in still frames

Write the beats before any animation code. For each beat: what the viewer must understand, the one hero element, the words on screen, and how it hands over to the next beat.

- One hero per frame. Two things of equal weight compete for the eye.
- Text that the viewer must read does not move while they read it. Give it a hold: `references/typography-dataviz-and-audio-sync.md` §1.1.
- No two adjacent scenes share a layout or a transition family.
- Pacing arc and gray-box pass: `references/web-svg-shaders-and-chinese-mg-craft.md` §4.

### 4. Build

- **Make every visual value a pure function of the frame or time.** Renderers capture frames out of order and in parallel, so wall-clock animation (CSS transitions, `requestAnimationFrame`, unseeded random, stateful spring loops) gives flicker or wrong frames.
- **Compute, do not recall.** `python3 scripts/motion_math.py --help` covers springs, cubic-bezier speed and overshoot, beat-to-frame, stepped frame rates, camera FOV and ms-to-frame conversion.
- **Ease with intent.** Symmetric ease-in-out and linear motion on a hero element read as mechanical. Enter with a fast start and a long settle; exit by accelerating. Curves and spring presets: `references/physics-timing-and-springs.md` §2–3.
- **Overshoot only on transforms.** A spring that overshoots on opacity or colour clips at the limit and flashes.
- **Move the camera on a rig**, not on each element, and keep captions outside the rig: `references/camera-rigging-transitions-and-choreography.md` §1.
- **Sound follows picture**: impacts on or just after contact, whooshes before. Offsets and beat math: `references/typography-dataviz-and-audio-sync.md` §3.
- **No fast flashing.** More than three large flashes in one second can trigger seizures. Limits and export settings: `references/delivery-safety-and-export.md`.

### 5. Check the render, with numbers

You cannot watch the video, so do not certify it from the code.

1. Render, then run `python3 scripts/check_render.py out.mp4 --expect-seconds S` (add `--expect-audio` when sound is planned). It measures: the render exists and moves, no empty frames, end-hold length, flash rate, static stretches, and frame cadence. Fix every FAIL. Read every NOTE and decide. The end-hold limit defaults to 1.4 s, which suits a logo end card [H]; when the last frame carries text the viewer must read, pass `--end-hold-max` with its reading time.
2. Look at frames: `mediasift` on the file, or stills from the engine at each beat's entrance, peak and hold. Judge by eye what no script measures:
   - Can the text be read at thumbnail size? Is contrast enough?
   - Is anything clipped at the frame edge or inside a mask (descenders, accents)?
   - One hero per frame? Any frame that looks like a slide?
   - Do two adjacent cuts use the same transition?
3. Fix the worst three problems, render again, check once more. Two passes is the budget.

Report the script's numbers and what you looked at. Say which items you judged by eye. A measured miss, reported with its number, is a good result.

## References

| File | Read it for |
|---|---|
| `references/physics-timing-and-springs.md` | Duration table, frame rates, easing catalogue, spring math, animation principles, motion blur |
| `references/camera-rigging-transitions-and-choreography.md` | Camera rig and zoom, parallax, shake, cuts and transitions, SVG morphing, stagger |
| `references/typography-dataviz-and-audio-sync.md` | Reading holds, text splitting and masks, number tickers, chart reveals, audio offsets, mixing |
| `references/programmatic-engines-remotion-motioncanvas-manim.md` | Engine patterns and pitfalls: Remotion, Motion Canvas, Manim, Concat |
| `references/web-svg-shaders-and-chinese-mg-craft.md` | Seekable GSAP timelines, FLIP, SVG filters, Rive vs Lottie, pacing arcs, ban list, archetypes |
| `references/delivery-safety-and-export.md` | Flash safety, safe areas, export and colour settings, loudness targets, licences |
