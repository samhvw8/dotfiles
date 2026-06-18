#!/bin/bash
# Codegraph reminder hook — UserPromptSubmit
# Steers code searches toward codegraph instead of grep.
# Input: JSON on stdin (session_id, transcript_path, cwd, etc.).
# Output: stdout JSON with additionalContext injected as Claude context.
#
# Three branches, decided by the hook (NOT by the model):
#   1. .codegraph/ exists                 -> emit the binary code-gate reminder.
#   2. no index BUT workspace has code    -> tell the model to ASK the user to
#                                            run `codegraph init -i`, then build it.
#   3. no index AND no code (docs/text)   -> stay silent (nothing to index).
#
# The model never gets an "if not indexed, skip" escape hatch to rationalize past.

input=$(cat)

# Resolve the working directory from the hook payload, falling back to $PWD.
cwd=""
if command -v jq >/dev/null 2>&1; then
  cwd=$(printf '%s' "$input" | jq -r '.cwd // empty' 2>/dev/null)
fi
[ -z "$cwd" ] && cwd="$PWD"

emit() {
  # $1 = additionalContext string (already escaped for JSON)
  printf '{\n  "hookSpecificOutput": {\n    "hookEventName": "UserPromptSubmit",\n    "additionalContext": "%s"\n  }\n}\n' "$1"
}

# ---------------------------------------------------------------------------
# Branch 1: index present -> the binary code-gate reminder.
# ---------------------------------------------------------------------------
if [ -d "$cwd/.codegraph" ]; then
  emit "<codegraph_reminder>\n\nThis workspace HAS a codegraph index (.codegraph/ confirmed present by this hook). So before ANY codebase search this turn, the gate is binary:\n\n| Step | Question | Action |\n|------|----------|--------|\n| 1 | Is this about CODE? (symbols, files, architecture, structure, behavior, flow, usage, deps) | YES -> codegraph, ALWAYS |\n| 2 | Non-code text only? (logs, comments, config values, READMEs, exact strings) | grep/glob |\n\nNote: 'where are the files / how is this code organized / lay of the land' IS a code-structure question -> codegraph, NOT ls/find/glob. Do not reframe a code question as a filesystem question to avoid loading codegraph.\n\nRules:\n- Code questions -> \`mcp__codegraph__codegraph_*\` (load via \`ToolSearch\` once per session). Text questions -> grep.\n- Heavy-think the query: name the concept, add 2-3 synonyms, split cross-domain into sub-queries. A single narrow keyword is the #1 cause of empty results.\n- Token-heavy explores -> delegate to a subagent to keep main context clean.\n\n</codegraph_reminder>"
  exit 0
fi

# ---------------------------------------------------------------------------
# No index. Decide between branch 2 (has code) and branch 3 (no code).
# Fast code-presence probe: stop at the FIRST source file found.
# ---------------------------------------------------------------------------
code_exts='py js jsx ts tsx mjs cjs go rs java kt kts c h cc cpp cxx hpp hh cs rb php swift scala sh bash zsh lua dart vue svelte m mm ex exs clj cljs erl hs ml fs sql gradle'

has_code=""

if command -v git >/dev/null 2>&1 && git -C "$cwd" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  # Git repo: list tracked files, match a code extension, quit on first hit.
  pat=$(printf '\\.%s$|' $code_exts); pat=${pat%|}
  if git -C "$cwd" ls-files 2>/dev/null | grep -E -i -m1 "$pat" >/dev/null 2>&1; then
    has_code="yes"
  fi
else
  # Non-git: bounded find that prunes heavy dirs and quits at first match.
  find_args=()
  for e in $code_exts; do find_args+=(-o -name "*.$e"); done
  if find "$cwd" \
        \( -name .git -o -name node_modules -o -name .venv -o -name venv \
           -o -name dist -o -name build -o -name target -o -name vendor \) -prune \
        -o -type f \( "${find_args[@]:1}" \) -print -quit 2>/dev/null | grep -q .; then
    has_code="yes"
  fi
fi

# ---------------------------------------------------------------------------
# Branch 3: no code (docs / knowledge base) -> nothing to index, stay silent.
# ---------------------------------------------------------------------------
[ -z "$has_code" ] && exit 0

# ---------------------------------------------------------------------------
# Branch 2: code present but NOT indexed -> ask the user, then build it.
# ---------------------------------------------------------------------------
emit "<codegraph_reminder>\n\nThis workspace contains CODE but has NO codegraph index (.codegraph/ absent — confirmed by this hook). codegraph is the pre-built code intelligence index; without it you would re-derive structure by hand with grep/Read.\n\nBefore doing any code-structure search this turn:\n1. ASK the user: 'This repo has no codegraph index. Want me to run \`codegraph init -i\` to build it?'\n2. If they agree, run \`codegraph init -i\`, wait for it to finish, then load the tools via \`ToolSearch\` and use \`mcp__codegraph__codegraph_*\`.\n3. Only if the user declines, fall back to grep/Read for this task.\n\nDo NOT silently grep your way through code-structure questions just because the index is missing — offer to build it first.\n\n</codegraph_reminder>"
exit 0
