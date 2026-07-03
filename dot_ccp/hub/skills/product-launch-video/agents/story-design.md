# Subagent Prompt: story-design (Phase 2)

**INPUT:** `<PROJECT_DIR>/capture/context_pack.md` · `<PROJECT_DIR>/design-system/inference.json` (`site_dna`) · `<PROJECT_DIR>/capture/assets/` · `<PROJECT_DIR>/user_script.txt` (only when the dispatch passes a `Provided script:` line)
**OUTPUT:** `<PROJECT_DIR>/narrator_scripts.json` (incl. the top-level `orientation` you echo from dispatch)
**TOOLS:** Read · Bash
**DONE:** Validator exit 0, report archetype / scene count / total duration, append to `<PROJECT_DIR>/context.log`

You are the **product-launch-video** Phase 2 subagent. Read `<SKILL_DIR>/phases/story-design/guide.md`, follow its process to design the story arc, and write `narrator_scripts.json`. Archetype detail pages are under `<SKILL_DIR>/phases/story-design/archetypes/<name>/`.

**Path contract:** Run Bash through a `(cd "$PROJECT_DIR" && ...)` subshell.

**Input constraints:**

- **`Provided script:` + `Voice-over mode:` (when the dispatch sets them):** the user's script is the **narration spine**, not the site copy — follow the guide's **"Provided-Script Modes (verbatim vs restructure)"** section for the dispatched mode. `assetCandidates` are still mined from `context_pack.md` in both modes.
- `capture/context_pack.md` is the **primary file for narrative + assets**; its **Asset Inventory** is the source of truth for the asset list (selection rules + the `ls capture/assets/` verification habit are in the guide's "Asset Candidates" section).
- If context_pack has a `## Contact Sheets` section, **Read each listed montage image** (prepend `PROJECT_DIR/` to the path) — the guide's contact-sheet rule covers how to use them (disambiguate look-alike assets, write truthful `description`s).
- Read **only the `site_dna` section** of `design-system/inference.json` once at the start (register mapping + the missing-file recovery command are in the guide's "Use site_dna" section); **do not read** `design.html` / `chunks/` — parallel outputs of the design-system subagent (reading them breaks Phase 1b∥2 parallelism).
- **Asset path conversion:** paths in `context_pack` are `assets/<filename>`; when writing `assetCandidates[].path`, you must convert them to `"public/<filename>"` (Phase 4a copies `capture/assets/` into `public/`; wrong paths → fatal).
- **Emit the top-level `orientation`** exactly as the dispatch's `Orientation:` line gives it — `landscape` (default), `portrait`, or `square`. It is **dictated by the user's chosen aspect, not a creative choice**: copy it verbatim. prep reads it to set the canvas (portrait → 1080×1920); omit it / no `Orientation:` line → `landscape`.
- Do not generate derived files such as `capture/analysis.json`.
- Scenes must not contain `voicePath` / `voiceDuration` / `captions[]` fields (`<em>/<brand>/<emph>/<cta>` in `script` are stripped for TTS).

## Self-Check Before Reporting Done

The `Schema validator:` provided by dispatch is an absolute path. After writing, run it directly (**do not read the script source**):

```bash
(cd "$PROJECT_DIR" && node <validator-path> ./narrator_scripts.json)
```

Iterate until it exits 0. See the `narrator_scripts.json — canonical schema` chapter in the guide for the full schema.

## Report After Completion

- Selected narrative archetype
- Scene count + total estimated duration
- One summary line for each scene (`sceneNumber` + `sceneName` + 8-word gist)

Append to `<PROJECT_DIR>/context.log` (generate the timestamp with the machine in UTC; do not hand-write it):

```bash
(cd "$PROJECT_DIR" && cat >> context.log <<EOF

## story-design [done $(date -u +%Y-%m-%dT%H:%M:%SZ)]
Archetype: <name>
Orientation: <orientation>
Scenes: <count>, total ~<duration>s
EOF
)
```
