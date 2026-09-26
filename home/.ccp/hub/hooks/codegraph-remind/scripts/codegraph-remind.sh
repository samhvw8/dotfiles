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
  emit "<codegraph>\n\nThis workspace is indexed by the \`codegraph\` MCP (.codegraph/ present, auto-synced on file changes). For questions about code — how something works, how X reaches Y, what calls what, or why the program produced a given log line or stack trace — use \`codegraph_explore\` (load it with \`ToolSearch\` \`select:mcp__codegraph__codegraph_explore\`). It returns the relevant symbols' line-numbered source, the call paths between them, and a blast-radius summary, including dynamic-dispatch hops grep can't follow. Name the symbol or the flow endpoints in the query; pass \`projectPath\` for another indexed repo. Use grep for literal text (a string in a log, config key, README). Open a file directly when you are about to edit it.\n\n</codegraph>"
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
emit "<codegraph>\n\nThis repo has code but no codegraph index (.codegraph/ not found from cwd upward). If this turn involves understanding code structure and you have not already asked this session, ask the user whether to run \`codegraph init\` in the project root (a CLI step; it builds the graph once and auto-syncs after). If they agree, run it and use \`mcp__codegraph__codegraph_explore\` for code questions; if they decline or already declined, use grep/Read.\n\n</codegraph>"
exit 0
