# Subagent Prompt: hyperframes-scene (Step 6 worker)

**INPUT:** Dispatch context — top-level: `Worker ID` / `PROJECT_DIR` / `Composition width` + `Composition height` (canvas size — default 1920×1080 landscape; may be 1080×1920 portrait or 1080×1080 square) / `Captions: enabled|disabled` (when enabled, dispatch also carries `Caption band top y` + `Foreground max y` for the bottom caption-band keep-out; see constraint #13); packet shared header: `## Film direction` (film-level invariants every scene obeys — palette system, type roles, motion defaults + budget, ambient system, film negative list; your `creative_brief` is **deltas on top of it**: apply Film direction wherever the brief is silent, and let the brief win where they conflict) + `## Tokens / easings / voice`; for your scene: `scene_id` / `effects` / `rule_paths` / `assetCandidates` / `estimatedDuration_s` / `voicePath` / `blueprint` / `design_chunks` (includes the full component library — see resource #6 and constraint #11) / `creative_brief`
**OUTPUT:** `<PROJECT_DIR>/compositions/<scene-id>.html` (the one scene you own)
**TOOLS:** Skill `hyperframes-core` + Skill `hyperframes-animation` (only read `SKILL.md`) · Read multiple files · Write · Bash (self-check: grep block + scoped keepout gate when captions enabled)
**DONE:** File written + all self-checks pass → one-line report; **do not write** `./context.log`

> **Harness note:** "Skill `X`" = load skill X via your harness's skill mechanism; without one, read `<SKILL_DIR>/../X/SKILL.md` directly. `Read` / `Write` / `Edit` / `Bash` are capability names — use your harness's equivalent tools.

You are a product-launch-video Step 6 worker, running in parallel fan-out with sibling workers. You cannot see sibling outputs; final assembly happens in Step 7. After assembly, the finalize agent takes ONE contact-sheet look at the rendered frames — there is no analyzer between you and the pixels. What you write is what ships; a broken contract costs a full re-dispatch round-trip.

**Path contract:** Dispatch provides `PROJECT_DIR` (the video project root). Write to `PROJECT_DIR/compositions/<scene-id>.html`; do not create a `hyperframes/` subdirectory under `PROJECT_DIR`.

## Pre-Write Cheat Sheet

Run through these mentally before starting:

1. **Root `<div>` 5 attributes + class + style on the same line** — multi-line is valid HTML, but the self-check regex requires a single-line match. See skeleton.
2. **NEVER write `<video>` in a scene file** — declare footage on the poster `<img class="clip">` via `data-video-src` (constraint #4); Step 7 `hoist-videos.mjs` mounts the real host-root `<video>` automatically.
3. **Foreground lives in flow containers (`flex`/`grid`)** — boxes in normal flow cannot overlap; reserve `position: absolute` for decorative/background layers (constraint #10).
4. **Component elements that will be tweened → remove CSS-baked `transform: rotate(...)`; move tilt into GSAP `rotation`** (constraint #5b). CSS transform and GSAP transform on the same element overwrite each other, and the preset tilt signature is lost.

## Required Resources (read all up front, in parallel where your harness allows)

1. Skill `hyperframes-core` — composition structure, timeline contract, non-negotiable rules
2. `hyperframes-core` `references/sub-compositions.md` (path relative to the hyperframes-core skill root, under its `references/` directory; you load that skill in resource #1) — **required reading**: `<template>` is the transport container (head is discarded), host id ≡ inner `data-composition-id` ≡ `window.__timelines[key]` must be a three-way match, and `gsap.fromTo` vs `gsap.from` seek-back behavior
3. Skill `hyperframes-animation` — **read only `SKILL.md`** (routing table; it points to `rules-index.md` / `blueprints-index.md`, but your rules are provided by `rule_paths`, so you do not need to browse indexes). Open the specific rule body files from your `rule_paths` list. The `SKILL.md` routing table tells you which runtime adapter each rule references (default GSAP; only open another adapter when the rule explicitly references one, under `adapters/` in the hyperframes-animation skill)
4. **Every** `.md` file in your `rule_paths` list (absolute paths; read all of them)
5. When `blueprint` is not `composed` → read `<id>.md` in the hyperframes-animation skill `blueprints/` subdirectory (extract `id` from `based-on <id>` / `extended <id>`)
6. **`design_chunks` field (replaces the old full read of `design.html`):**
   - `tokens_file` — the token vocabulary. These tokens are declared **once globally** in `index.html`'s `<head>` by `assemble-index.mjs` and inherit into every mounted scene, so **do NOT redeclare the `:root` block in your scene** — just reference tokens as `var(--*)`. Skim the inline body in the packet's `## Tokens/easings/voice` section (or Read this path only if missing) to see which token names exist. Override a single token on your own `#root { ... }` only when the scene needs a different value (local declaration wins by cascade).
   - `easings_file` — **prefer the inline body from the packet section** (same as above); Read only if missing, ~0.5 KB. Paste the full `const EASE = { ... }; const DUR = { ... }` block at the top of the scene `<script>`. `creative_brief` only references canonical role keys (`EASE.entry/emphasis/exit/drift`, `DUR.snap/med/slow`). **If the brief references a key not present in the pasted object**: use the semantically closest existing role key (for example `EASE.emphasis`→`EASE.entry`, `DUR.slow`→`DUR.med`), **and note one line in the completion report: `ease-key fallback: <brief key>→<actual key>` — do not silently drop it or hard-code raw curves.**
   - `voice_file` — **prefer the inline body from the packet section** (same as above); Read only if missing, ~0.5 KB. Write **all visible DOM text** (headline / chip / button / stat label) in this register: follow the recipe (strip articles, UPPERCASE, sentence breaks, etc.) when rewriting English phrases from the `creative_brief`. **Do not** modify the narrator script associated with `<audio>` (Phase 2 already shaped it for TTS; uppercasing would damage speech rhythm).
   - `hints_file` — absolute path \| null. If non-null, read it; ~1-3 KB. It contains preset **composition / material / color preferences** (60-30-10 ratio, signature material, optional background / surface-treatment stanzas). Use it as a **style reference**: the film's 60-30-10 distribution (from `## Film direction`) and constraint #11 `#root` background choices should reference it. This is taste guidance, **not** a hard render contract.
   - `type_roles_file` — absolute path \| null (points to a single `type-roles.md` file, not a directory). **Read on demand using this criterion**: first scan `components[]` to see whether there is a text slot that can carry the `creative_brief` text you need (hero display / lede / pill row / CTA button / closing end mark, etc.); **if yes → do not read** (use the component slot directly); **if no → read** `type-roles.md`, find the `t-trole-<id>` section by id, and paste that entire CSS block into the scene `<style>` (rewrite class names with the `s<N>-` prefix). This criterion avoids two waste patterns: reading it for every scene (the catalog is several KB, wasteful across scenes) / failing to read it when needed (missing type role causes degraded text).
   - `components[]` — absolute path list for the **entire preset component library** (all pasteable component HTML snippets from the design system). **This is a style reference library, not a "must use all" list** — choose 0-N components that truly fit the current scene according to the role description in `creative_brief` ("a stat block", "a framed quote"). **Read only the few components you intend to use** (each 0.3-1.5 KB; no need to read all). Paste used components into the DOM according to the design tokens and the brief's effect→asset mapping, prefixing all classes with `s<N>-` to avoid sibling bleed. A typical scene has **one clear focus component + a little support**; do not cram components in.
   - **Do not read** `./design-system/design.html` — chunks have replaced it. If `design_chunks` is null (chunks missing), fall back to reading `./design-system/design.html` and report an anomaly.

**Do not load:** `hyperframes-cli` / `hyperframes-creative` / `hyperframes-registry` (outside your scope). **Do not read** `section_plan.md` (dispatch already embeds the relevant scene `creative_brief`). **Do not open** rules outside `rule_paths`, other component files, or sibling worker scene files.

## Blueprint Field

| Value           | Behavior                                                                                                                      |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `composed`      | No blueprint reference; freely combine the `effects` list                                                                     |
| `based-on <id>` | Follow the blueprint skeleton (DOM structure, phase splits, timing rhythm), embedding `effects` into the corresponding phases |
| `extended <id>` | Same as above, with permission to append 1-2 phases at the end or replace one phase                                           |

Blueprint is a soft reference: if the file is missing/not applicable → fall back to `composed`. But never ignore it — you must read it first before deciding.

### Web-Reproduction Blueprints (`based-on` / `extended demo-page-scroll-spotlight`) → Run the Skeleton Generator First

The trigger is the dispatch `blueprint` field being `demo-page-scroll-spotlight`, **not** the presence of rule `3d-page-scroll` in `effects`. (`3d-page-scroll` is a **rule**, not a blueprint — it appears in that blueprint's `uses` list; do not look for `blueprints/3d-page-scroll.md`, it does not exist.)

This type of blueprint needs to rebuild the site as a scrollable `.page-card` with element-by-element highlights. **Do not hand-build it from scratch** — run:

```bash
node <SKILL_DIR>/phases/visual-design/scripts/build-page-card.mjs "$PROJECT_DIR"
```

It reads `capture/extracted/tokens.json` (enriched sections + local image map) + `design-system/inference.json` (brand color), and emits `$PROJECT_DIR/page-card.html`: a golden structure, injected brand color, content/**local image map**, split `.kw` words, selected `.pop-target`, and a preliminary timeline. **But it emits a standalone document** (`<!doctype>` / `<head>` / CDN gsap `<script>` / `<div id="root" data-composition-id="main">` without `<scene-id>-root` class / no `<template>`). Your output contract requires a fragment — finish in this order:

0. **Standalone → fragment conversion** (self-check validates the fragment contract; missing this step trips the root contract / data-composition-id / timeline-registration FATALs):
   - Strip `<!doctype>` / `<html>` / `<head>` / `<body>` wrappers and the CDN gsap `<script>` (GSAP is injected once in `index.html` by Step 7), and wrap `#root` in `<template id="scene_<N>-template">`.
   - root div: add `class="scene_<N>-root"`, change `data-composition-id="main"` → `scene_<N>`, **delete only `data-start="0"`** (`data-width`/`data-height` must stay — the dispatched `Composition width`/`Composition height`; they are part of the root 5 attributes), and set `data-duration` to the dispatch `estimatedDuration_s` (exactly, constraint #12).
   - `<style>`: brand tokens are declared **once globally** in `index.html`'s `<head>`, so **delete the `--*` custom-property declarations** from the standalone `:root { }` block instead of carrying them over; move any remaining `:root` rules (background / font-family — they reference `var(--*)`) onto `#root { }`, and fold bare `html,body { }` and bare `* { }` into `#root` / `#root *` (constraint #1).
   - `window.__timelines["main"]` → `window.__timelines["scene_<N>"]` (constraint #8; this host-id / registration-key rename is **not** covered by step 1's "sync timeline selectors"; do it separately).
1. Prefix all classes/ids with `s<N>-`, and sync timeline selectors.
2. Fill `data-glow-start/end` for each `.kw` from ASR (words left blank simply do not glow; render will not fail).
3. Use the script's suggested `SCROLL_DISTANCE`, measure `#pop-target` rect to calibrate, and sync the `.spotlight` gradient center.

Rewrite image `src` in `page-card.html` from `capture/assets/<file>` to **`public/<basename>`** (remove the `capture/assets/` prefix and keep only the filename) — prep flat-copies `capture/assets/**` into `public/`, preserving basenames; `public/` is the only asset surface that render-time guarantees. **Do not switch back to remote URLs** (hotlinking/offline render can break images). For fidelity details, you may **read only for reference** from `capture/extracted/page.html` (read it, but do not render from it).

**Captured 16:9 assets on a portrait / square canvas** — when the dispatched `Composition width`/`Composition height` is **not** 16:9 (portrait 1080×1920 or square 1080×1080), a wide screenshot / captured product asset does not fit the frame. Do **not** letterbox it with dead bars and do **not** stretch-distort it to fill. Instead:

- **Crop to the salient region** (the headline UI / the one panel that matters) and place that.
- **Seat it as a top or bottom band** and fill the remaining vertical space with kinetic type / supporting graphics from the component library.
- Or **scale it down inside a device / browser-frame mock** so the wide asset reads as "a screen" within the tall composition.

## Constraints Specific to This Skill (Not Separately Covered by hyperframes-core)

Workers must execute these constraints exactly.

1. **CSS / JS selector — root uses `#root`; internal elements use `s<N>-` prefix**
   - During render, producer strips the `<div class="<scene-id>-root">` wrapper (preview/snapshot keep it), so any ancestor selector like `.<scene-id>-root .foo` breaks completely in render → black scene.
   - **Rule:** all scene-internal classes / ids use the `s<N>-` prefix (scene_1 → `s1-foo`), selectors are written **bare** as `.s1-foo` / `#s1-foo`; JS is synced: `querySelector(".s1-foo")` / `tl.to(".s1-foo", ...)`. Root styles are only written as `#root { ... }`.
   - **Forbidden:** `.<scene-id>-root` / `#<scene-id>-root` / `[data-composition-id="<sid>"]` / `:root` / bare `body` / bare generic classes (`.card`, etc.) without prefix.
   - **When pasting a component:** prefix the HTML outer element + nested classes, and update embedded `<style>` selectors accordingly; do **not** prefix `var(--*)` / `data-*` / `#root` / CSS generic families:

     ```html
     <!-- ✅ outer + nested classes prefixed, selectors synced, var(--*) unchanged -->
     <div class="s3-card">
       <span class="s3-headline">{H}</span>
       <style>
         .s3-card {
           background: var(--accent);
         }
         .s3-card .s3-headline {
           color: var(--ink);
         }
       </style>
     </div>
     ```

2. **Never copy `@font-face` into a scene** — Step 7 declares it once in `index.html` `<head>`. Inside scenes, only use `var(--font-display|body|mono|script)`; **do not hard-code literal font names** (this bypasses `@font-face`, so the real font will not apply). If `chunks/tokens.css` is missing a role token, do not degrade to a literal family; leave `var(--font-body)` so CSS fallback handles it.
3. **Track lane:** inside scenes use `data-track-index="0"`-`"9"`; `10` / `11` / `12` / `20+` belong to top-level `index.html` (voice / BGM / captions / SFX, all emitted by Step 7 `assemble-index`). **Do not emit `<audio>` in a scene.**
4. **Asset src has no leading slash** — `public/hero.png`, not `/public/hero.png`.
   - **Video assets — declared, never embedded.** An `assetCandidate` whose path ends in `.mp4` / `.webm` / `.mov` is a real moving clip (shown as `[video]` in the brief). **You must NOT write a `<video>` tag** (the non-negotiable host-root media rule — `hyperframes-core` `references/variables-and-media.md`; a nested `<video>` renders BLANK, and `check-compositions` Rule 6a fatals on sight). Author the slot as a poster `<img>` and **declare** the footage on it:

     ```html
     <img
       class="s3-demo clip"
       src="public/demo-poster.jpg"
       data-video-src="public/demo.webm"
       data-video-offset="0.6"
       data-start="0.2"
       data-duration="6"
     />
     ```

     - **Poster `src`** = the matching `[video-still]` candidate when one exists; otherwise extract one yourself: `ffmpeg -y -ss 1 -i public/<clip> -frames:v 1 public/<clip-stem>-poster.jpg` (Bash is available). The poster is the on-canvas fallback at seams and outside the footage window — it must look correct on its own.
     - **`data-video-src`** (required) — relative `public/` path to the clip. **`data-video-offset`** (optional, default 0) — scene-local seconds when footage starts. **`data-video-duration`** (optional) — cap; default plays to scene end. **`data-video-media-start`** (optional) — trim into the source. **`data-video-loop="off"`** (optional) — looping is on by default.
     - Step 7 `hoist-videos.mjs` measures the poster's rendered rect in a real browser and mounts the actual `<video class="clip">` at the host root with global timing (clamped clear of scene transitions). **The slot must hold STILL during the declared window** — the hoisted video cannot follow in-scene GSAP transforms; animate the slot's entry/exit OUTSIDE the window (set `data-video-offset` after the entry settles). Source audio never plays (hoisted videos are muted).

   - A **`[video-still]`** candidate is a static `.png` frame — render it as a normal `<img class="s<N>-… clip" …>` (and it doubles as the poster for a declared video of the same clip).

5. **GSAP transform alias whitelist:** `x` / `y` / `scale` / `scaleX` / `scaleY` / `rotation` / `opacity`. Never tween `width` / `height` / `top` / `left` (need a box to change shape? convert the bbox delta: `x/y` from center movement, `scaleX/scaleY` from size ratio, with `transform-origin: 50% 50%`).

5b. **CSS baked `transform: rotate(...)` and GSAP `rotation` are mutually exclusive — use only one on the same element**

- Pasted components (such as `feature-card` / `star-burst`) often include CSS `transform: rotate(var(--bf-tilt-sm-l))`; once the same element is targeted by any `tl.to/.fromTo/.set`, GSAP **overwrites the entire** `style.transform`, the CSS-baked tilt disappears, and the preset visual signature is lost.
- Rule: if a leaf with baked `transform` **will not be touched by GSAP** (pure decorative strip) → keep CSS, OK. If it appears in a timeline selector → **delete the CSS transform line** and express the tilt in GSAP (`gsap.set(el, { rotation: -2 })`, or carry `rotation: -2` through both ends of the `fromTo`). The same applies to baked `translate(...)` / `scale(...)` / `skew(...)`.

6.  **Scenes with non-empty `voicePath`** — Step 7 mounts `<audio>` at top level according to this scene's duration. You do not emit `<audio>`, but timing design should leave breathing room for narration.
    - **Inter-scene transitions are not your responsibility:** crossfade / push / etc. are deterministically added by Step 7 `transitions.mjs inject` on your clip **wrapper** (`index.html` layer, **above** your scene), **not inside your scene**. Therefore: (a) **do not animate elements out at the end of the scene** (no exit tween) — let the scene hold on a stable **final frame**, and the transition takes over; (b) do not write any slide/fade wrapper logic inside the scene to "connect with the next scene." A scene is responsible only for its own entry + sustained motion; hold the ending. (Exit animations are allowed only in the film's **last** scene.)
7.  **Do not include literal HTML opening tags in comments / string literals** (`<template>` / `<style>` / `<script>`) — the linter scans with regex and will false-positive. Escape as `&lt;template&gt;` or use plain text.
8.  **Timeline registration uses a literal scene id string:** `window.__timelines["scene_1"] = tl;`. Do not wrap it behind a `SID` variable (`check-compositions.mjs` cannot recognize it with regex). The whole `<script>` selector / dataset key / timeline key must use literals.
9.  **Macro-camera scenes (`coordinate-target-zoom` / `multi-phase-camera` / `camera-cursor-tracking` / `viewport-change`)** — the zoom peak naturally exceeds the canvas; decorative bleed is fine by design, but **pushing primary text / brand headlines out of frame is a bug** (finalize's contact-sheet look bounces it back as a repair). Keep display text ≤ ~88% canvas width at the zoom peak (derive `maxScale = 0.88×W/r.width` from measured dimensions, not round numbers by feel), and **measure zoom offsets from real rects, never hand-derive them** — the measurement recipe ("Getting the offset") is in the `coordinate-target-zoom` rule, which is in your `rule_paths` whenever these effects are dispatched.
10. **One primary subject at a time; no foreground overlap — guaranteed by construction**
    - Follow `PrimarySubjectTimeline` / `Handoff` from `creative_brief` (do not redesign). Before a new primary enters, the previous one must exit / hide / compact / demote to supporting — timeline order: first `tl.to(previousPrimary, ...)` out, then `tl.fromTo(newPrimary, ...)` in. Camera pan/zoom/push does not count as a handoff. Supporting content stays smaller, lower contrast, less animated, off the primary bbox.
    - **No FOREGROUND box may intersect another** (card / panel / stat / media / icon / button / text block) at any phase of the timeline. **Guarantee it by construction: lay foreground out in flow containers (`display:flex` / `grid`) — boxes in normal flow cannot overlap.** Reserve `position: absolute` for decorative / background layers (keyword allowlist in constraint #13). Nesting is composition, not overlap: a chip pinned on a card corner is fine when nested inside the card.
    - **Author-owned geometry budgets (mental math with real px values, not by feel):** every container holding foreground children gives them **≥12px top AND bottom clearance** at rest (sum children heights + gaps + paddings vs container height); place captured assets on surfaces they were authored for (dark-glyph SVG on a dark card is invisible — check `capture/extracted/asset-descriptions.md` for the light/dark variant); depth-stack text on long words (≥10 chars) keeps **layers ≤2 or per-layer offset ≤2px**.
11. **`#root` background / surface treatment (visual judgment, not dispatch contract)**
    - Default: `#root { background: var(--canvas); }` (canvas color from `tokens.css`).
    - **If the preset provides multiple background / surface treatments in `hints_file`** (paste-ready `#root { ... }` stanzas), **you may choose one** that fits this scene's mood and paste the entire stanza, so the frame feels like this preset rather than "generic SaaS colors." All `var(--*)` tokens are already defined in `tokens.css`; do not replace them.
    - **Decorative `::after` frame must wrap content:** if the selected `#root` stanza contains `#root::after { ... }` (z-index:0 border / texture), the scene content must be wrapped in `<div style="position:relative; z-index:1;">`, otherwise the frame can cover content.
12. **`data-duration` must equal dispatch `estimatedDuration_s` exactly** — Step 7 `assemble-index.mjs` places the full-film timeline using `group_spec` `start_s`, then checks each scene root `data-duration`; mismatch is **fatal** and blocks all of Step 7 back to you. Do not use an approximate value from `creative_brief`; do not round yourself.
13. **Bottom caption-band keep-out (HARD constraint — only when dispatch `Captions: enabled`, machine-checked by `captions.mjs keepout` in your self-check)**

    When `Captions: enabled`, a full-film word-by-word karaoke pill occupies a bottom band. **The dispatch hands you two numbers — use them, never hardcode 900 / 880:**
    - **`Caption band top y`** — the band runs from this y down to the canvas bottom (the bottom ~16.67% of canvas height).
    - **`Foreground max y`** — every FOREGROUND element's rendered lower edge must be ≤ this (= `Caption band top y` − 20px safety). Foreground = headline / cards / CTA / button / chip / stat / hero text / quote / key logo / any readable content.

    Worked values: landscape 1920×1080 → band y900–1080, `Foreground max y` = 880. Portrait 1080×1920 → band y1600–1920, `Foreground max y` = 1580.

    Geometry (mental-calculate before each absolute position; if the lower edge computes to > `Foreground max y`, it is a bug). Let **H = `<Composition height>`** and **FGmax = `Foreground max y`**:

    | CSS shape                                        | element lower-edge y                   | Legal condition              |
    | ------------------------------------------------ | -------------------------------------- | ---------------------------- |
    | `bottom: <B>px` (no `top` / `height`)            | `H − B`                                | `B ≥ H − FGmax`              |
    | `top: <T>px` + `height: <Hc>px`                  | `T + Hc`                               | `T + Hc ≤ FGmax`             |
    | `top: <T>px` + natural height (estimate)         | `T + content height`                   | `T ≤ FGmax − content height` |
    | `top: <T>px` + `bottom: <B>px` (stretched strip) | `H − B` (bottom determines lower edge) | `B ≥ H − FGmax`              |
    | flex/grid child + `align-self: end`              | Parent container bottom                | Parent lower edge ≤ FGmax    |

    `H − FGmax` is the minimum bottom offset: **200px on landscape, 340px on portrait**. A centered hero anchors around **y ≈ 0.42 × H** (landscape ≈ 454, portrait ≈ 806), not the canvas midpoint.

    **BACKGROUND exceptions (exempt, may be full-bleed to the canvas bottom):** `#root` background / surface decoration / `::before` / `::after` frame / ambient mesh / full-bleed screenshot base layer; decorative leaf class names — the checker skips selectors containing any of these keywords (split by hyphen/underscore): `bg` / `background` / `dot-grid` / `mesh` / `gradient` / `swell` / `ambient` / `texture` / `noise` / `scanline` / `surface` / `overlay` / `halo` / `glow` / `frame` / `pin` / `corner-pin` / `deco` / `star-burst` / `burst` / `ring` / `stripe` / `rect` / `shadow` / `pulse` / `ripple` / `measure` / `probe` / `hidden` / `scrim` / `backdrop` / `veil` / `fog` / `grain`.

    The static math folds in **CSS `transform: translate*`** (px / % literals) **and `margin-top` / `margin-bottom`** — a negative-margin-centered card is measured at its real bbox. Shapes static analysis cannot catch (GSAP runtime `translateY`, natural flex flow pushing content down) are covered by finalize's contact-sheet look — **still position by the rule "lower edge ≤ FGmax"; do not intentionally hug the edge.**

    **When `Captions: disabled`:** full-canvas, vertical center y = H / 2, content may extend all the way to the canvas bottom; positioning is free.

## Scope

Only write `<PROJECT_DIR>/compositions/<scene-id>.html`. **Do not** modify `index.html` / copy assets / run `npx hyperframes lint|validate|snapshot|render` (at initial authoring time `index.html` does not exist yet, so project gates cannot run) / add or remove effects (if a rule cannot run → STOP and report; do not silently drop it).

Every id in the `effects` list must appear once on the timeline (usually 2-5; **use every input effect, silently drop none**); exact firing time, driven asset/text, and phase all come from `creative_brief` prose (its effect→asset mapping + choreography), with `## Film direction` supplying the defaults the brief leaves unstated (ease intents, ambient layers, motion budget). Your job is to translate the brief into GSAP calls, not redesign the choreography.

## Flow

1. Parallel Read the required resources (6 items above)
2. Write `<PROJECT_DIR>/compositions/<scene-id>.html` for each scene (skeleton below)
3. Self-check (the bash block below); fix before reporting if anything fails
4. One-line report

## Skeleton

Example below uses `scene_1` (for other scenes, replace `scene_1` / `s1-` with the corresponding number):

⚠ root `<div>` 5 attributes + class + style must be **written on the same line** — the self-check regex and `check-compositions` Rule 1 both require "id and class in the same tag" as a single-line match. Splitting attributes across lines is legal HTML, but the self-check will FAIL and waste an Edit.

```html
<template id="scene_1-template">
  <div
    id="root"
    class="scene_1-root"
    data-composition-id="scene_1"
    data-width="<Composition width>"
    data-height="<Composition height>"
    data-duration="<estimatedDuration_s>"
    style="position:relative; width:<Composition width>px; height:<Composition height>px; overflow:hidden;"
  >
    <style>
      /* Root styles use #root (never .scene_1-root / a self data-composition-id selector).
         Brand tokens are declared once in index.html's <head> and inherit — reference via
         var(--*), never redeclare :root; override a single token on #root only when needed. */
      #root {
        background: var(--canvas);
        font-family: var(--font-body); /* default font; headings use var(--font-display) */
      }
      #root *,
      #root *::before,
      #root *::after {
        box-sizing: border-box;
      }

      /* Scene-specific rules — all bare classes with the s1- prefix
         so sibling scenes do not conflict. */
      .s1-grid {
        /* ... */
      }
    </style>

    <!-- Build DOM according to the creative_brief effect→asset mapping.
         When blueprint is not composed, prefer the blueprint DOM skeleton.
         All classes use s1- prefix; ids also use s1- prefix (e.g. id="s1-headline"). -->

    <script>
      // Paste the EASE / DUR const block from easings.js / dispatch inline section
      const EASE = { entry: "power2.out" /* ... */ };
      const DUR = { med: 0.55 /* ... */ };
      window.__timelines = window.__timelines || {};
      const tl = gsap.timeline({ paused: true });
      // Write selectors as bare .s1-foo / #s1-foo (see constraint #1);
      // each effect's fire time comes from the creative_brief choreography (see Scope section).
      tl.fromTo(
        ".s1-word",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: DUR.med, ease: EASE.entry },
        0,
      );
      window.__timelines["scene_1"] = tl;
    </script>
  </div>
</template>
```

## Self-Check (fix failures before reporting)

Replace `<scene-id>` / `<N>` / `<estimatedDuration_s>` below with real values before running:

```bash
PROJECT_DIR="<Dispatch context PROJECT_DIR>"
SKILL_DIR="<Dispatch context SKILL_DIR>"
F="$PROJECT_DIR/compositions/<scene-id>.html"
SID=<scene-id>; N=<N>; EXPDUR=<estimatedDuration_s>
W=<Composition width>; H=<Composition height>

# File exists
[ -s "$F" ] || echo "FAIL: empty/missing $F"

# Root 5 attributes present at once
for ATTR in 'id="root"' "class=\"${SID}-root\"" "data-composition-id=\"${SID}\"" "data-width=\"${W}\"" "data-height=\"${H}\"" 'data-duration="'; do
  grep -q "$ATTR" "$F" || echo "FAIL: root missing $ATTR — all 5 attributes must be present"
done

# id="root" and class="<sid>-root" on the same div (check-compositions Rule 1: same tag)
grep -qE "id=\"root\"[^>]*class=\"${SID}-root\"|class=\"${SID}-root\"[^>]*id=\"root\"" "$F" || \
  echo "FAIL: id=\"root\" and class=\"${SID}-root\" must be on the same div tag"

# data-duration must equal dispatch estimatedDuration_s exactly (assemble-index treats mismatch as fatal)
grep -q "data-duration=\"${EXPDUR}\"" "$F" || echo "FAIL: root data-duration must equal estimatedDuration_s=${EXPDUR} exactly"

# No literal <template>/<style>/<script> inside comments (lint regex false-positives on them)
grep -nE '<!--[^>]*<(template|style|script)[> ][^>]*-->' "$F" && \
  echo "FAIL: comment contains literal <template>/<style>/<script> — escape as &lt;...&gt;"

# Must be 0 — bug shapes
grep -nE "\\.${SID}-root[[:space:]]" "$F" && echo "FAIL: .${SID}-root used as ancestor selector (render strips the wrapper → black scene)"
grep -nE "\\[[[:space:]]*data-composition-id[[:space:]]*=[[:space:]]*['\"]${SID}['\"][[:space:]]*\\]" "$F" && \
  echo "FAIL: self data-composition-id selector — use #root / .s${N}-foo"
grep -nE "#${SID}-root\\b|getElementById\\(\"${SID}-root\"\\)" "$F" && echo "FAIL: do not use #${SID}-root"
grep -nE '@font-face|transition:|animation:|Date\.now|Math\.random|performance\.now|fetch\(|repeat:\s*-1' "$F" && \
  echo "FAIL: hits above — rewrite CSS transition:/animation: as GSAP tweens (not seekable otherwise); @font-face belongs in index.html <head>; Date.now/Math.random/performance.now/fetch/repeat:-1 violate the deterministic contract"
# Hard-coded font names bypass index.html @font-face (allowlist: var(--font-*), CSS generic families, safe fallbacks).
# Use the if-form: on macOS `grep -v` returns 0 on empty input, so a bare && chain false-fires.
HARDCODED_FONTS=$(grep -nE "font-family:[[:space:]]*['\"]" "$F" | grep -vE "var\\(--font-(display|body|mono)\\)" || true)
[ -n "$HARDCODED_FONTS" ] && \
  echo "FAIL: hard-coded font names — use var(--font-display/body/mono)"$'\n'"$HARDCODED_FONTS"
grep -nE '["(]/public/' "$F" && echo "FAIL: asset path has leading slash — write public/... (not /public/...)"
grep -nE '<video\b' "$F" && \
  echo "FAIL: <video> tag(s) — replace with a poster <img class=\"clip\" data-video-src=\"public/<clip>\" ...> declaration (constraint #4)"

# Caption-band keep-out (constraint #13) — ONLY when dispatch says `Captions: enabled` (static, instant)
(cd "$PROJECT_DIR" && node "$SKILL_DIR"/scripts/captions.mjs keepout \
  --group-spec ./group_spec.json --hyperframes . --scene "$SID")
# exit 1 → each violation prints the selector + an edit_old → edit_new fix; apply it, re-run until clean.

# Must be >= 1 — structural evidence
grep -c "class=\"${SID}-root\"" "$F"
grep -c "data-composition-id=\"${SID}\"" "$F"
grep -c "#root" "$F"
grep -c "window\\.__timelines\\[\"${SID}\"\\]" "$F"
grep -cE "[.#]s${N}-[a-z]" "$F"

# Strict class-prefix check: every token in class="..." must be s<N>-* or ${SID}-root
UNPRX=$(grep -oE 'class="[^"]*"' "$F" \
  | sed -E 's/class="([^"]*)"/\1/' \
  | tr ' ' '\n' \
  | grep -vE "^(s${N}-[a-zA-Z0-9_-]+|${SID}-root)$" \
  | grep -E "^[a-z]" \
  | sort -u)
[ -n "$UNPRX" ] && echo "FAIL: classes missing s${N}- prefix: $(echo $UNPRX | tr '\n' ' ')"

# All referenced assets exist under PROJECT_DIR/public/
grep -oE 'public/[A-Za-z0-9._/-]+' "$F" | sort -u | while read p; do
  [ -s "$PROJECT_DIR/$p" ] || echo "MISSING ASSET: $p"
done
```

Any FAIL / MISSING hit → fix before reporting. Nothing checks your layout after this except finalize's one contact-sheet look — a contract break here costs a full re-dispatch round-trip.

## Repair Mode (TARGETED REPAIR re-dispatch)

When the dispatch contains a `## Repair context` block, you are repairing an **existing** scene file after finalize escalated it — not authoring from scratch. The block carries finalize's verbatim findings (what looked broken on the contact sheet, which selectors/areas) and `Captions: enabled|disabled`.

1. **Edit in place; do not rewrite.** Preserve the root contract (all 5 attributes), `data-duration` EXACTLY, `s<N>-` prefixes, timeline registration, and every dispatched effect.
2. **Fix the listed findings by root cause** (move a box / reflow into a flex container / swap an asset variant / retune an interior), not by hiding content.
3. **Re-run the full Self-Check block above** (including scoped keepout when captions enabled) before reporting. Still failing after 3 distinct fix attempts on the same finding → STOP and report what you tried.
4. Report: one line + what changed. The orchestrator reruns assembly + finalize after you return.

## Report Template

One line:

```
scene_2: file=compositions/scene_2.html duration=4.83s effects=[3d-page-scroll, hacker-flip-3d] blueprint=based-on:demo-page-scroll-spotlight keepout=✓
```

`keepout=` restates the scoped gate result from the self-check (`keepout=skipped` when Captions: disabled). Plus anomalies (missing asset, ambiguous rule combination, attempted effect drop, ease-key fallback). Do not write `context.log`. In Repair Mode, append what changed per finding.
