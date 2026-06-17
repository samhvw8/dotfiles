#!/bin/bash
# Codegraph reminder hook — UserPromptSubmit
# Injects a reminder to prefer codegraph over grep for code-related searches.
# Input: JSON on stdin (session_id, transcript_path, cwd, etc.) — unused.
# Output: stdout JSON with additionalContext injected as Claude context.

cat <<'ENDJSON'
{
  "hookSpecificOutput": {
    "hookEventName": "UserPromptSubmit",
    "additionalContext": "<codegraph_reminder>\n\nBefore ANY codebase search this turn, run the CodeGraph gate:\n\n| Step | Question | Action |\n|------|----------|--------|\n| 1 | Is codegraph available? (`.codegraph/` exists, MCP tools loaded) | If no -> grep is fine |\n| 2 | Is this about CODE? (symbols, files, architecture, behavior, flow, usage, deps) | YES -> codegraph, always |\n| 3 | Non-code text? (logs, comments, config values, READMEs, exact strings) | grep/glob |\n\nRules:\n- Code questions -> `mcp__codegraph__codegraph_*` (load via `ToolSearch` once per session). Text questions -> grep.\n- Heavy-think the query: name the concept, add 2-3 synonyms, split cross-domain into sub-queries. A single narrow keyword is the #1 cause of empty results.\n- Token-heavy explores -> delegate to a subagent to keep main context clean.\n\nIf codegraph is NOT indexed in this workspace, skip this and use built-in tools.\n\n</codegraph_reminder>"
  }
}
ENDJSON
