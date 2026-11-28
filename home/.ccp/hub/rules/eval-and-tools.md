---
harness: [claude, opencode, codex, pi]
---
# Tool Routing

Tool rules name a tool. This table says how to call an MCP tool in each harness.

| Harness | How to call an MCP tool |
|---|---|
| Claude Code | `ToolSearch` `select:<name>` loads a deferred tool, then call it directly. |
| Claude Code, REPL mode | In a script: `searchTools(query)` finds it, `tools.<name>(input)` calls it, `` $`...` `` is the shell. Batch several calls in one script. |
| codex | `mcp__<server>__<tool>`; a deferred tool loads through `tool_search`. |
| opencode | `<server>_<tool>`, declared directly. Only servers in `opencode.json` `mcp` exist there. |
| pi | `mcp__<server>__<tool>`. The server's `exposure` in `mcp.json` sets the path: `direct` (call it), `deferred` (`tool_search`), `codemode` (a `codemode` script with `searchTools()`). |

If a full name does not match, search by the short name (`codegraph_explore`). If the harness has no MCP tool for it, use the tool's CLI (`codegraph explore "..."`).
