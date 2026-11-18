---
description: Route structural code questions to the codegraph MCP graph tool instead of grep
alwaysApply: true
---

# Codegraph

`codegraph_explore` (`mcp__codegraph__codegraph_explore` via `ToolSearch` in
Claude Code; `xd://mcp__codegraph_explore` or `await tool.mcp__codegraph_explore(...)`
in `omp`) answers code questions from a symbol graph: one call returns the
relevant source, the call paths between symbols, and a blast-radius summary.

- **Code question → codegraph:** how X works or reaches Y, what calls X, what
  breaks if X changes, mapping an unfamiliar area.
- **Text question → grep/glob:** log strings, config keys, TODOs, file names.
- Open a file directly only to edit it, or when it isn't code.
- Pass `projectPath` for another indexed repo. The `.codegraph/` index auto-syncs.
- **No MCP tool** (headless agy, a subagent without it): run
  `codegraph explore "<names or question>"` in the shell — same output.
- **Trust the result.** Don't re-check it with grep. Read a file only when the
  staleness banner names it.
- **After moving, splitting or merging modules:** run `codegraph cycles` and
  fix any new cycle the change made. CLI only, no MCP tool.
- **Old index:** when a result says an older version built the index, tell me.
  `codegraph index` is my call, like `codegraph init`.
- No index? Ask before running `codegraph init` — it's my call.
- A broad multi-file sweep belongs in a subagent with `codegraph_explore` named.
