# CodeGraph

Codegraph tools (`mcp__codegraph__codegraph_*`) are **deferred MCP tools**. Before first use each session, load via `ToolSearch`.

## Rules

| Rule | Detail |
|------|--------|
| MUST use codegraph first | For ANY structural query (symbols, connections, "what exists for X", architecture), codegraph FIRST. grep/find ONLY for literal text (strings, comments, file-extension globs). Violating this = wasting tokens on inferior results |
| Load before calling | `ToolSearch("select:mcp__codegraph__codegraph_context")` — required once per session |
| Follow MCP server instructions | The codegraph MCP server provides its own usage guidance (under "## codegraph" in MCP Server Instructions). Those are **authoritative** — follow them |
| Use explore via subagent | Token-heavy — spawn via Task tool to keep main context clean |

## If `.codegraph/` doesn't exist

Ask the user: *"Want me to run `codegraph init -i` to build the index?"*

## Related

- [se.md](se.md) — software engineering principles
- [delegation-protocol.md](delegation-protocol.md) — when to delegate explore queries to subagents
