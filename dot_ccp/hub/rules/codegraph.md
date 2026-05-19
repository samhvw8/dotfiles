# CodeGraph

CodeGraph MCP server (`codegraph_*` tools) — tree-sitter-parsed knowledge graph of every symbol, edge, and file. Sub-millisecond reads. Returns structural information grep cannot.

## MANDATORY: Prefer codegraph over native search

Use codegraph for **structural** questions. Use grep/read ONLY for **literal text** (string contents, comments, log messages).

| Question | Tool |
|---|---|
| "Where is X defined?" / "Find symbol named X" | `codegraph_search` |
| "What calls function Y?" | `codegraph_callers` |
| "What does Y call?" | `codegraph_callees` |
| "What would break if I changed Z?" | `codegraph_impact` |
| "Show me Y's signature / source / docstring" | `codegraph_node` |
| "Give me focused context for a task/area" | `codegraph_context` |
| "Survey an unfamiliar module/topic" | `codegraph_explore` |
| "What files exist under path/" | `codegraph_files` |
| "Is the index healthy?" | `codegraph_status` |

## Rules (MUST follow)

| Rule | Detail |
|------|--------|
| Trust codegraph results | Full AST parse. Do NOT re-verify with grep — slower, less accurate, wastes context |
| Don't grep first | `codegraph_search` is faster and returns kind + location + signature in one call |
| Don't chain search + node | `codegraph_context` does both in one round-trip |
| Use explore via subagent | Token-heavy — spawn via Task tool to keep main context clean |
| Respect index lag | File watcher debounces ~500ms; don't re-query immediately after editing |

## If `.codegraph/` doesn't exist

MCP server returns "not initialized." Ask the user: *"I notice this project doesn't have CodeGraph initialized. Want me to run `codegraph init -i` to build the index?"*

## Related

- [se.md](se.md) — software engineering principles
- [delegation-protocol.md](delegation-protocol.md) — when to delegate explore queries to subagents
