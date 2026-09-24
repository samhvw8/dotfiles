#!/bin/bash
# codegraph mandatory-check hook — UserPromptSubmit
# Steers code searches toward the `codegraph` MCP (colbymchenry/codegraph) over grep.
# Input: JSON on stdin (session_id, transcript_path, cwd, etc.).
# Output: stdout JSON with additionalContext injected as Claude context.
#
# The index lives IN-REPO (.codegraph/ at the project root), auto-synced by the
# daemon on every file change — presence is decided by walking up from cwd
# looking for a .codegraph/ directory.
#
# Three branches, decided by the hook (NOT by the model):
#   1. binary present AND this repo indexed     -> emit the binary code-gate reminder.
#   2. binary present, repo has code, no index  -> tell the model to ASK the user to
#                                                  run `codegraph init`, then build it.
#   3. no binary, OR no code                     -> stay silent (nothing to steer).
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
# Locate the binary (PATH first, then the mise install location).
# ---------------------------------------------------------------------------
BIN=""
if command -v codegraph >/dev/null 2>&1; then
  BIN="codegraph"
elif [ -x "$HOME/.local/share/mise/installs/github-colbymchenry-codegraph/latest/bin/codegraph" ]; then
  BIN="$HOME/.local/share/mise/installs/github-colbymchenry-codegraph/latest/bin/codegraph"
fi

# No binary -> nothing to steer toward.
[ -z "$BIN" ] && exit 0

# ---------------------------------------------------------------------------
# Is this workspace indexed? Walk up from cwd looking for .codegraph/.
# NOTE: $HOME/.codegraph is codegraph's GLOBAL state dir (telemetry,
# update-check), NOT a project index — it must never count as one.
# ---------------------------------------------------------------------------
indexed=""
d="$cwd"
while [ -n "$d" ] && [ "$d" != "/" ]; do
  if [ "$d" != "$HOME" ] && [ -d "$d/.codegraph" ]; then indexed="yes"; break; fi
  d=$(dirname "$d")
done

# ---------------------------------------------------------------------------
# Branch 1: indexed -> the binary code-gate reminder.
# ---------------------------------------------------------------------------
if [ -n "$indexed" ]; then
  emit "<codegraph_check mandatory='true' non_negotiable='true'>\n\nThis workspace IS indexed by the \`codegraph\` MCP (.codegraph/ present, auto-synced on every file change — the index is NEVER stale). Before ANY code-touching action this turn you MUST complete this gate — non-negotiable, exactly like the skills/agents delegation check. Do NOT skip it. Do NOT rationalize past it.\n\n| Gate | Question | Required action |\n|------|----------|-----------------|\n| 1 | Is this about CODE? (symbols, files, architecture, structure, behavior, flow, usage, deps — OR diagnosing app output / logs / stack traces) | \`codegraph_explore\`, ALWAYS. Load via \`ToolSearch\` (\`select:mcp__codegraph__codegraph_explore\`), then call it |\n| 2 | Non-code text ONLY? (a literal string inside a log / config / README) | grep/glob |\n\nMANDATORY (MUST / NEVER):\n- You MUST make \`codegraph_explore\` the FIRST tool that touches code this turn. NEVER find/Read/Grep/cat a source file first, even when you already know the filename.\n- ONE call answers almost any question — 'how does X work', a flow ('how does X reach Y'), or surveying an area — returning the relevant symbols' verbatim source grouped by file, the call paths between them, and a blast-radius summary. It surfaces dynamic-dispatch hops (callbacks, React re-render, interface->impl) grep can NOT follow.\n- Reading a file or symbol: NAME it in the query — you get its current line-numbered source, same shape as Read, plus dependents. Prefer this over Read for understanding code.\n- App output IS code, not text. A runtime log, stack trace, console dump, or printed error is a POINTER INTO the code that emitted it. 'Why did it do that' is a code-behavior question -> \`codegraph_explore\`. The 'logs -> grep' row means searching log TEXT for a literal string, NOT diagnosing the program behind it.\n- NEVER cite the 'non-code text' row to justify a tool you ALREADY reached for. Classify by the ANSWER you need (is it code behavior?), not by the shape of what was pasted in.\n- Ask in natural language: name the concept + the flow endpoints; split cross-domain questions into separate explore calls. Another indexed repo? Pass \`projectPath\`.\n\nState your gate result (1 -> \`codegraph_explore\`, or 2 -> grep) before the first code tool. Skipping this check is a protocol violation.\n\n</codegraph_check>"
  exit 0
fi

# ---------------------------------------------------------------------------
# Not indexed. Decide between branch 2 (has code) and branch 3 (no code).
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
fi
# Non-git dirs ($HOME, config dirs, scratch folders) aren't projects — never nag there.

# ---------------------------------------------------------------------------
# Branch 3: no code, or not a git repo -> nothing to index, stay silent.
# ---------------------------------------------------------------------------
[ -z "$has_code" ] && exit 0

# ---------------------------------------------------------------------------
# Branch 2: code present but NOT indexed -> ask the user, then build it.
# ---------------------------------------------------------------------------
emit "<codegraph_check mandatory='true' non_negotiable='true'>\n\nThis workspace contains CODE but is NOT yet indexed by \`codegraph\` (no .codegraph/ directory found from cwd upward — confirmed by this hook). Without it you would re-derive structure by hand with grep/Read.\n\nMANDATORY before any code-structure search this turn:\n1. You MUST ASK the user: 'This repo isn't indexed by codegraph. Want me to run \`codegraph init\` here? It builds the graph once, then auto-syncs on every file change.'\n2. If they agree, run \`codegraph init\` via Bash in the project root (CLI step — indexing is NOT an MCP tool), then use \`mcp__codegraph__codegraph_explore\` for all code questions.\n3. ONLY if the user declines, fall back to grep/Read for this task.\n\nNEVER silently grep your way through code-structure questions just because the index is missing — offer to build it first.\n\n</codegraph_check>"
exit 0
