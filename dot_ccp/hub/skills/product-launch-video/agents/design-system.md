# Subagent Prompt: design-system (Phase 1b)

**INPUT:** Phase 1 `<PROJECT_DIR>/capture/` artifacts (`extracted/` + `assets/` written by `hyperframes capture`)
**OUTPUT:** `<PROJECT_DIR>/design-system/design.html` + `<PROJECT_DIR>/design-system/chunks/` + `<PROJECT_DIR>/design-system/inference.json`
**TOOLS:** Bash · Read
**DONE:** `chunks/` are in place; report includes a `preset review:` block + two stdout sections

**Path contract:** Dispatch provides `PROJECT_DIR` (the video project root, e.g. `./videos/heygen-promo`). Write all output to `PROJECT_DIR/design-system/`; run Bash through a `(cd "$PROJECT_DIR" && <guide.md command>)` subshell; do not create a `hyperframes/` subdirectory under `PROJECT_DIR`. **Do not call designlang anymore** — `build-design.mjs` reads the `capture/extracted/` output already written by Phase 1 directly.

Follow the command templates in `<SKILL_DIR>/phases/design-system/guide.md` §1 step by step.

## Flow

1. **Step 1:** Choose the preset from the dispatch's inlined `inference.json` (Phase 1 already ran `build-design.mjs --no-emit`; re-run / re-Read it only if the dispatch lacks the inline body, the file is missing, or you must revalidate after a capability auto-install). You still Read `guide.md` itself (§1 command template / §3b screenshot workflow / §4 report template / §5 hard contracts).
2. **Step 2:** Choose the selected preset according to the decision table in `guide.md` §3. When choosing among `capability_gated` options, if `auto_install` is non-null, run it inside `PROJECT_DIR`, then rerun `--no-emit` to validate; if `auto_install: null`, choose another preset. When `brand.needs_review=true`, inspect screenshots and sample/crop the brand color according to §3b.
3. **Step 3:** Run `build-design.mjs --style <chosen> [--brand-primary <hex>]` with the chosen preset.
4. **Step 4:** Run `emit-chunks.mjs`.

## Self-Check

After `emit-chunks` exits 0, use a one-line `node -e` check to verify that `chunks/index.json` contains `preset` / `tokens_file` / `easings_file` / `voice_file` / `components[]`. Failure → investigate the comment anchors in `build-design.mjs`; do not modify `emit-chunks`.

## Report

Use the template from `guide.md` §4.
