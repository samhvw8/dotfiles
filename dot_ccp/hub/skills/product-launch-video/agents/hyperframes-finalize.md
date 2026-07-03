# Subagent Prompt: hyperframes-finalize (Step 7 — gate → one look → fix what pixels show → render)

**INPUT:** `<PROJECT_DIR>/index.html` (assembled by `assemble-index.mjs`, transitions injected, videos hoisted, passed `sfx-verify`) · `<PROJECT_DIR>/compositions/*.html` (worker output = scene source files) · `<PROJECT_DIR>/group_spec.json` (consumed by the scoped keepout / verify commands) · Dispatch context: `Render quality` / `Captions` / `BGM` (one-line verdict) / `Film direction` (film-level invariants — palette system, motion budget, ambient system, negative list; per-scene briefs are deltas that assume it, so judge the contact sheet against both) / `Scenes:` list (`scene_id` / `start_s` / `estimatedDuration_s` / `effects` / `creative_brief` per scene)
**OUTPUT:** `<PROJECT_DIR>/renders/video.mp4` (passes `verify-output.mjs render`) · in-place fixed `compositions/scene_*.html` · `<PROJECT_DIR>/snapshots/contact-sheet.jpg`
**TOOLS:** Bash (`(cd "$PROJECT_DIR" && npx hyperframes lint|validate|snapshot|render)`, `node verify-output.mjs render`) · `Edit` (fix scene files in place) · Read (`hyperframes-core` / effect rules only when a fix needs the contract)
**DONE:** mp4 passes `verify-render` → report + append to `<PROJECT_DIR>/context.log`

You are Phase 4c finalize, responsible for carrying the already assembled `index.html` through to a qualified mp4 **fast**. There is no analyzer pass and no findings brief — **your eyes on one contact sheet are the QA**, plus the two CLI gates. Run every CLI call through a `(cd "$PROJECT_DIR" && npx hyperframes ...)` subshell.

## Core Principles

- **Do not read, edit, or reassemble `index.html`** (machine-assembled; transitions injected and verified; videos hoisted). If it is wrong (timing / track / playback order), that is an upstream bug — STOP and let the orchestrator fix upstream + reassemble. Never hand-edit transition timing / GSAP stamps.
- **You fix `compositions/scene_N.html` — the worker source file.** Before a fix that touches selector / timeline / component contracts, Read the relevant `hyperframes-core` reference first; do not break scope from memory.
- **Never change a scene root `data-duration`** (= group_spec `estimatedDuration`, fixed upstream; a mismatch makes the assemble cross-check fatal on the next prelude run). Timing errors are the orchestrator's to fix via worker re-dispatch.
- **BGM:** trust the dispatch `BGM:` line; do not `ls assets/bgm.wav`, `ps`, or tail logs. BGM not ready is not a blocker; render continues without it.
- **Retry budget: 3 strikes on the same finding → STOP and report.** STOP for worker re-dispatch ONLY when a scene needs real recomposition (content fundamentally wrong / real relayout / animation broken beyond a couple of edits) — the exception, not the default.

## Step 1: CLI gates (lint + validate)

```bash
(cd "$PROJECT_DIR" && npx hyperframes lint 2>&1 | tail -25)
(cd "$PROJECT_DIR" && npx hyperframes validate 2>&1 | tail -25)
```

Both clean → Step 2. On errors, fix in place (one `Edit` per finding, then re-run **only the failed gate** once):

| Error shape                                                                                                | Fix                                                                                                                                           |
| ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Bad asset path / leading slash `/public/` / wrong basename                                                 | `Edit` the path in the scene file                                                                                                             |
| Unscoped selector (`.scene-root` ancestor / `#scene-root` / `[data-composition-id]`)                       | `Edit` to bare `.s<N>-foo` / `#s<N>-foo`; root styles use `#root`                                                                             |
| `gsap_animates_clip_element` (missing `class="clip"`)                                                      | `Edit` to add `class="clip"`                                                                                                                  |
| `font_family_without_font_face`                                                                            | `Edit` the font to `var(--font-*)` (or add an @font-face for the captured `.woff2` in `index.html` — only via orchestrator; prefer the token) |
| Literal `<template>/<style>/<script>` in a comment (regex false positive)                                  | `Edit` to escape as `&lt;...&gt;`                                                                                                             |
| Timeline not registered / broken sub-comp ref (host id ≠ `data-composition-id` ≠ `window.__timelines` key) | `Edit` the one line to three-way match                                                                                                        |
| Low-contrast warnings from `validate` (WCAG-AA, non-blocking)                                              | Intentional design → note in `context.log` and pass; only recolor on a genuine color bug                                                      |
| Whole-scene composition fundamentally wrong                                                                | **STOP → orchestrator re-dispatches that worker** (exception)                                                                                 |

## Step 2: ONE contact-sheet look

The machine never sees layout — this is the only visual QA in the pipeline. It is still a quick sanity look, not a per-frame audit.

1. **Compute the probe list** (mental math): one probe per scene at its midpoint (`start_s + estimatedDuration_s / 2`, from the dispatch `Scenes:` list). Sort ascending, comma-join, then:

   ```bash
   (cd "$PROJECT_DIR" && npx hyperframes snapshot --at "<t1,t2,...>")
   ```

2. **Read `snapshots/contact-sheet.jpg` ONCE** and scan every tile for, in order: (a) blank / black / white panel where content should be (worst class — media or mount failure); (b) primary text cut by the canvas or a container, or unreadable against its background (especially SVG wordmarks on dark cards); (c) two foreground boxes colliding / a card interior crushed against its border; (d) captions enabled and the bottom caption pill covering a chip / CTA / stat. **Do not open individual frames unless a tile looks wrong.**
3. **Only for a suspicious tile:** re-snapshot that single timestamp full-size, diagnose with the symptom table, `Edit` the scene file in place, re-snapshot only that frame. If the edit touched the canvas-bottom area with captions enabled, also run `(cd "$PROJECT_DIR" && node <SKILL_DIR>/scripts/captions.mjs keepout --group-spec ./group_spec.json --hyperframes . --scene <scene_id>)`.
4. **One fix round total.** Clean tiles are not re-checked; a finding that survives its re-snapshot → STOP and report.

| Symptom                                                      | Root cause → in-place fix                                                                                                                                                                                                                                                                                                                                                                           |
| ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Entire film blank / pure background                          | Bad asset path (`Edit` path); or sub-comp not mounted (inner `data-composition-id` / `window.__timelines` key ≠ scene_id → `Edit` one line to align)                                                                                                                                                                                                                                                |
| Footage panel shows the poster still instead of moving video | Often CORRECT (probe fell outside the clamped video window — check the hoisted `<video data-hoisted-from>` element's `data-start`/`data-duration` in `index.html` first). Genuinely missing at an in-window time → fix the scene's `data-video-src` declaration, then re-run `node <SKILL_DIR>/scripts/hoist-videos.mjs --group-spec ./group_spec.json --hyperframes .`; never hand-write `<video>` |
| Flash / frame jump / static with no animation                | Inner id and timeline key mismatch → `Edit` to align                                                                                                                                                                                                                                                                                                                                                |
| CTA off-canvas / primary text clipped                        | `Edit` position / scale                                                                                                                                                                                                                                                                                                                                                                             |
| Two foreground boxes collide / interior crushed (<12px)      | Move/shrink one box or reflow the pair into a flex/grid container; for a crushed interior, drop a non-essential child or reduce padding / gap / one font tier                                                                                                                                                                                                                                       |
| Caption pill covers a chip / CTA / hero / stat               | Raise that element so its lower edge ≤ `H − round(H×0.1667) − 20` (landscape 880 / portrait 1580), then scoped `captions.mjs keepout --scene` to confirm                                                                                                                                                                                                                                            |
| Unreadable asset on its surface                              | Swap to the surface-appropriate variant (capture libraries ship light + dark; check `capture/extracted/asset-descriptions.md`); do not recolor third-party SVGs                                                                                                                                                                                                                                     |
| Transition seam harsh / outgoing scene fights the transition | The scene wrote its own exit tween (violates "hold the final frame") → `Edit` it out. Transition type itself unsuitable → report upstream; do not patch here                                                                                                                                                                                                                                        |
| A time point shows another scene's content                   | Playback order is correct-by-construction from `group_spec` → upstream order bug; STOP and report                                                                                                                                                                                                                                                                                                   |

## Step 3: Render + verify

```bash
(cd "$PROJECT_DIR" && npx hyperframes render --quality <quality> --output renders/video.mp4)
(cd "$PROJECT_DIR" && node <SKILL_DIR>/scripts/verify-output.mjs render --hyperframes . --group-spec ./group_spec.json)
```

`<quality>` comes from dispatch (default `high`). Render failure → inspect the last ~30 stderr lines; do not blindly retry with different flags. verify exit 1 → it reports concrete size / duration drift: duration drift usually means a sub-comp did not mount (static fallback ran) → fix that scene (counts toward the one fix round), re-render; size too small → render actually failed, inspect stderr.

## Completion Report

- Gates: lint / validate status + each fix applied (finding → Edit → re-run status)
- Contact sheet: tile count scanned, suspicious tiles escalated + verdicts, fixes in place (file + what changed)
- BGM: restate the dispatch `BGM:` line
- Render: path / bytes / ffprobe duration / quality; any (exceptional) STOP + reason

Append to `<PROJECT_DIR>/context.log`:

```bash
(cd "$PROJECT_DIR" && cat >> context.log <<EOF

## Phase 4c: finalize [done $(date -u +%Y-%m-%dT%H:%M:%SZ)]
Gates: lint <status> / validate <status>
Contact sheet: <n> tiles scanned (<m> escalated)
Fixes in place: <scene_N: what> ... (none if none)
BGM: <dispatch BGM line>
Render: renders/video.mp4 (<size>, <duration>s, quality=<quality>)
EOF
)
```
