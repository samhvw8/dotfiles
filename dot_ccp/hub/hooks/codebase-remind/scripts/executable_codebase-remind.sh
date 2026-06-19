#!/bin/bash
# codebase mandatory-check hook — UserPromptSubmit
# Steers code searches toward the `codebase` MCP (codebase-memory-mcp) over grep.
# Input: JSON on stdin (session_id, transcript_path, cwd, etc.).
# Output: stdout JSON with additionalContext injected as Claude context.
#
# The index lives in ~/.cache/codebase-memory-mcp (NOT in-repo), so presence is
# decided by ASKING the binary, not by probing for a directory.
#
# Three branches, decided by the hook (NOT by the model):
#   1. binary present AND this repo indexed     -> emit the binary code-gate reminder.
#   2. binary present, repo has code, no index  -> tell the model to ASK the user to
#                                                  index it, then build it.
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
if command -v codebase-memory-mcp >/dev/null 2>&1; then
  BIN="codebase-memory-mcp"
elif [ -x "$HOME/.local/share/mise/installs/github-deus-data-codebase-memory-mcp/latest/codebase-memory-mcp" ]; then
  BIN="$HOME/.local/share/mise/installs/github-deus-data-codebase-memory-mcp/latest/codebase-memory-mcp"
fi

# No binary -> nothing to steer toward.
[ -z "$BIN" ] && exit 0

# ---------------------------------------------------------------------------
# Is this workspace already indexed? Match cwd against indexed root_path(s).
# list_projects -> {"projects":[{"root_path":"/abs/path",...}]}
# ---------------------------------------------------------------------------
indexed=""
if command -v jq >/dev/null 2>&1; then
  paths=$(CBM_LOG_LEVEL=none "$BIN" cli list_projects 2>/dev/null \
            | jq -r '.projects[]?.root_path // empty' 2>/dev/null)
  while IFS= read -r p; do
    [ -z "$p" ] && continue
    # cwd is at or below an indexed project root.
    case "$cwd/" in "$p"/*) indexed="yes"; break;; esac
  done <<EOF
$paths
EOF
fi

# ---------------------------------------------------------------------------
# Branch 1: indexed -> the binary code-gate reminder.
# ---------------------------------------------------------------------------
if [ -n "$indexed" ]; then
  emit "<codebase_check mandatory='true' non_negotiable='true'>\n\nThis workspace IS indexed by the \`codebase\` MCP (codebase-memory-mcp). Before ANY code-touching action this turn you MUST complete this gate — non-negotiable, exactly like the skills/agents delegation check. Do NOT skip it. Do NOT rationalize past it.\n\n| Gate | Question | Required action |\n|------|----------|-----------------|\n| 1 | Is this about CODE? (symbols, files, architecture, structure, behavior, flow, usage, deps — OR diagnosing app output / logs / stack traces) | \`codebase\` MCP, ALWAYS. Load via \`ToolSearch\` (\`select:mcp__codebase__search_graph,mcp__codebase__trace_path,mcp__codebase__query_graph\`), then \`mcp__codebase__*\` |\n| 2 | Non-code text ONLY? (a literal string inside a log / config / README) | grep/glob |\n\nMANDATORY (MUST / NEVER):\n- You MUST make a \`codebase\` tool the FIRST tool that touches code this turn. NEVER find/Read/Grep/cat a source file first, even when you already know the filename.\n- Tools: \`search_graph\` (find symbols by name/label/file), \`trace_path\` (callers/callees, depth 1-5), \`query_graph\` (read-only Cypher), \`get_architecture\` (overview: languages, packages, routes, hotspots), \`get_code_snippet\` (source by qualified name), \`search_code\` (grep-like over indexed files), \`detect_changes\` (git diff -> impacted symbols + risk).\n- App output IS code, not text. A runtime log, stack trace, console dump, or printed error is a POINTER INTO the code that emitted it. 'Why did it do that' is a code-behavior question -> \`codebase\`. The 'logs -> grep' row means searching log TEXT for a literal string, NOT diagnosing the program behind it.\n- NEVER cite the 'non-code text' row to justify a tool you ALREADY reached for. Classify by the ANSWER you need (is it code behavior?), not by the shape of what was pasted in.\n- Heavy-think the query: name the concept + 2-3 synonyms; split cross-domain into sub-queries. Token-heavy explores -> delegate to a subagent.\n\nState your gate result (1 -> \`codebase\`, or 2 -> grep) before the first code tool. Skipping this check is a protocol violation.\n\n</codebase_check>"
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
emit "<codebase_check mandatory='true' non_negotiable='true'>\n\nThis workspace contains CODE but is NOT yet indexed by the \`codebase\` MCP (codebase-memory-mcp). The index lives in ~/.cache/codebase-memory-mcp and this repo is absent from it (confirmed by this hook). Without it you would re-derive structure by hand with grep/Read.\n\nMANDATORY before any code-structure search this turn:\n1. You MUST ASK the user: 'This repo isn't indexed by codebase-memory-mcp. Want me to index it now (\`mcp__codebase__index_repository\`)?'\n2. If they agree, load the tool via \`ToolSearch\` and call \`mcp__codebase__index_repository\` with this repo path, then use \`mcp__codebase__*\`.\n3. ONLY if the user declines, fall back to grep/Read for this task.\n\nNEVER silently grep your way through code-structure questions just because the index is missing — offer to build it first.\n\n</codebase_check>"
exit 0
