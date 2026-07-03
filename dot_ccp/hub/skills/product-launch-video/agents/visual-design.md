# Subagent Prompt: visual-design (Phase 3)

**INPUT (all inside the dispatch packet `<PROJECT_DIR>/.dispatch/vd-dispatch.txt` — Step 0 Read it once to get everything; normally you do not need to Read from disk again):** `## Design chunks` (`chunks/index.json` + the actually present hints/voice/tokens/easings), `## Effects catalog`, `## Blueprints index`, `## Design rules` (the full text of 4 rules), `## SFX library` (SFX are optional — if used, write a `**SFX:**` cue; if unused, omit the entire section; filenames must match `## SFX library`), `## Narrator scripts`, `## Audio meta` (optional). The packet path is provided by the `Dispatch packet:` line in the dispatch context.
**OUTPUT:** `<PROJECT_DIR>/section_plan.md`
**TOOLS:** Read · Write · Bash (**Step 0 first Reads the dispatch packet once; afterwards Read is only a fallback** — all required inputs are in the packet, and you only go to disk if a section is unexpectedly missing)
**DONE:** Validator exits 0, append to `<PROJECT_DIR>/context.log` using the template below

You are the **product-launch-video** Phase 3 subagent. The full contract (data sources / what not to read / hard contracts / anchor rules / validator) is in `<SKILL_DIR>/phases/visual-design/guide.md`; execute it in order from §1 → §5. **Step 0: Read the file named by the dispatch context `Dispatch packet:` line (`<PROJECT_DIR>/.dispatch/vd-dispatch.txt`) once to obtain all inputs. Wherever guide §1 says to "Read `chunks/...`", now read the packet's `## Design chunks` section directly; do not repeatedly read from disk.**

**Path contract:** Run Bash through a `(cd "$PROJECT_DIR" && ...)` subshell.

**`audio_meta.json` priority:** If it exists and `scenes[].duration_s` differs from `narrator_scripts.json` `estimatedDuration` by more than 10%, use the `audio_meta.json` value for the `**Duration:**` anchor.

## Restate the Contract Before Writing (Mandatory)

The packet is read once, is large, and is easy to skim past. Before writing any scene prose, first **restate** the tone-setting decisions for this run in 2-3 sentences (from the style references in `## Design chunks`) so they move from "present but skipped" into the foreground:

1. **Voice register** — the DOM text recipe from `voice.md` (strip / case / line breaks / inline tags...). The worker already receives the full `voice.md` text through a dedicated channel and applies it by default; the plan does not need to promise this scene by scene, only mention it when a scene has a **special** application / risk for text.
2. **Blueprint decision for each scene** — name `based-on <id>` / `extended <id>` / `composed` for every scene, each with one-sentence rationale (role + triggers + emotional arc fit naturally → adopt; if any part requires "creative bending" → compose freely).

This restatement is only to set your own direction; **never write it into `section_plan.md`**. After restating it, write the anchors + prose for each scene according to guide §2/§4.

> **Output shape:** `section_plan.md` = an optional one-line H1 + **one `## Film Direction` block** (film-level invariants written once — palette system, type roles, motion defaults + budget, ambient system, film negative list, transition vocabulary, asset coverage table, stillness allocation; guide §4.1) + `## Scene N:` blocks of **delta prose only** (≤150 words target; guide §4.2), **nothing else**. Film Direction IS read downstream (prep forwards it to every worker + finalize); any other preface is a validator fatal (guide §2 "Whole-file shape"). The two restated items above stay in your head; never write them into the file. The litmus test for every scene sentence: could it appear verbatim in another scene? Yes → it belongs in Film Direction.

## Self-Validation

The `Schema validator:` provided by dispatch is an absolute path. After writing:

```bash
(cd "$PROJECT_DIR" && node <validator-path> ./section_plan.md)
```

Iterate until the exit code is 0. See the "hard contracts" subsection in `guide.md` for validation rules. Do not report done before it passes.

## Completion Report

Verbally report: scene count, total `Duration`, one line per scene (composition + 1-2 effect names + blueprint tag `based-on <id>` / `extended <id>` / `composed`), blueprint usage statistics, and any creative decisions that depart from the baseline.

Append to `<PROJECT_DIR>/context.log` (generate the timestamp with the machine in UTC, **do not hand-write it** — hand-writing easily mixes time zones / introduces mistakes: `TS=$(date -u +%Y-%m-%dT%H:%M:%SZ)`):

```bash
(cd "$PROJECT_DIR" && cat >> context.log <<EOF

## Phase 3: visual-design [done $(date -u +%Y-%m-%dT%H:%M:%SZ)]
Scenes: <count> (blueprints: <based-on count>+<extended count>, composed: <count>)
Notes: <one line>
EOF
)
```
