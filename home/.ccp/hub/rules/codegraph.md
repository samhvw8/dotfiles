---
description: Route structural code questions to the codegraph MCP graph tool instead of grep
alwaysApply: true
---

# Codegraph

`mcp__codegraph__codegraph_explore` answers code questions from a symbol graph:
one call returns the relevant source, the call paths between symbols, and a
blast-radius summary. Load it with ToolSearch when deferred.

- **Code question → codegraph:** how X works or reaches Y, what calls X, what
  breaks if X changes, mapping an unfamiliar area.
- **Text question → grep/glob:** log strings, config keys, TODOs, file names.
- Open a file directly only to edit it, or when it isn't code.
- Pass `projectPath` for another indexed repo. The `.codegraph/` index auto-syncs.
- No index? Ask before running `codegraph init` — it's my call.
- A broad multi-file sweep belongs in a subagent with `codegraph_explore` named.
