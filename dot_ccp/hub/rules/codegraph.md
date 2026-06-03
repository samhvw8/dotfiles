# CodeGraph

Deferred MCP tools (`mcp__codegraph__codegraph_*`). Load via `ToolSearch` before first use each session.

## Gate (MANDATORY)

**Before ANY codebase search — STOP and run this check:**

```
1. Is codegraph available? (.codegraph/ exists)
2. Is this about CODE? (symbols, files, architecture, behavior, flow, usage, dependencies)
   - YES → codegraph. Always. No exceptions.
   - NO  → grep (literal strings in non-code: logs, comments, configs, READMEs)
3. Proceed.
```

**The rule is simple: code questions → codegraph. Text questions → grep.**

## Why Codegraph First for ALL Code Queries

Codegraph accepts **natural language queries** via `query`. It is NOT limited to symbol lookups or structural queries. Any code-related question works:

| Query type | Example | Works? |
|-----------|---------|--------|
| Natural language | `"how does upload trigger transcription"` | Yes |
| Topic scan | `"billing credits pricing tiers"` | Yes |
| Symbol lookup | `"deductCredits"` | Yes |
| Behavior search | `"what validates user input before save"` | Yes |
| Architecture | `"authentication session flow"` | Yes |
| File discovery | `"files related to webhook handling"` | Yes |

**Heavy-think query construction:** Before sending a codegraph query, think carefully about what you're actually looking for. Craft queries with multiple relevant terms and synonyms. A well-constructed query avoids the bug where codegraph returns nothing because terms were too narrow.

## When Grep Wins

Grep is the right tool ONLY for non-code text searches:

| Use grep for | Example |
|-------------|---------|
| Exact string literals in output/logs | `'ERR_AUTH_FAILED'` |
| Comment patterns | `TODO:`, `FIXME`, `HACK` |
| File-extension globs | `*.test.ts`, `*.svelte` |
| Regex on text content | `console\.log\(` |
| Config values | `.env`, `wrangler.toml` keys |
| Non-code files | READMEs, changelogs, docs |

## Usage

| Rule | Detail |
|------|--------|
| Load first | `ToolSearch("select:mcp__codegraph__codegraph_explore")` once per session |
| Explore via subagent | Token-heavy — spawn via Task to keep main context clean |
| Follow MCP instructions | Codegraph MCP guidance (under "## codegraph") is **authoritative** |

## If `.codegraph/` doesn't exist

Ask: *"Want me to run `codegraph init -i` to build the index?"*

## Related

- [codegraph-query-patterns.md](codegraph-query-patterns.md) — query construction reference
- [se.md](se.md) — software engineering principles
- [delegation-protocol.md](delegation-protocol.md) — when to delegate explore queries to subagents
