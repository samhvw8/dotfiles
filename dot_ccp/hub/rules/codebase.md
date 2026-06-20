# Codebase

The `codebase` MCP (DeusData [codebase-memory-mcp](https://github.com/DeusData/codebase-memory-mcp)) indexes a repo into a persistent knowledge graph — symbols, calls, architecture — for sub-ms structural queries at ~99% fewer tokens than file-by-file reading. Deferred MCP tools (`mcp__codebase__*`). Load via `ToolSearch` before first use each session.

## Gate (MANDATORY)

**Before ANY codebase search — STOP and run this check:**

```
1. Is the `codebase` MCP available? (repo indexed — the codebase-remind hook confirms)
2. Is this about CODE? (symbols, files, architecture, behavior, flow, usage, dependencies)
   - YES -> codebase. Always. No exceptions.
   - NO  -> grep (literal strings in non-code: logs, comments, configs, READMEs)
3. Proceed.
```

**The rule is simple: code questions -> codebase. Text questions -> grep.**

## Tools

| Tool | Use for |
|------|---------|
| `search_graph` | Find symbols by name pattern, label (Function/Class/…), file pattern, degree |
| `trace_path` | Callers/callees via BFS (depth 1-5, direction in/out/both) |
| `query_graph` | Read-only Cypher over the graph (MATCH/WHERE/RETURN, aggregates) |
| `get_architecture` | Overview: languages, packages, routes, hotspots, clusters, ADRs |
| `get_code_snippet` | Source for a function by qualified name |
| `search_code` | Grep-like text search within indexed files |
| `detect_changes` | Map git diff to affected symbols with risk classification |
| `manage_adr` | Create/read/update/delete Architecture Decision Records |
| `index_repository` / `list_projects` / `index_status` / `delete_project` | Index management |

## Why Codebase First for ALL Code Queries

`search_graph`, `query_graph`, and `get_architecture` accept structural and natural-language-ish intent. Any code-related question works:

| Query type | Example | Tool |
|-----------|---------|------|
| Symbol lookup | name pattern `.*Handler.*`, label `Function` | `search_graph` |
| Topic scan | `"billing credits pricing tiers"` | `search_graph` / `search_code` |
| Behavior | what validates input before save | `trace_path` + `get_code_snippet` |
| Architecture | auth/session flow, hotspots | `get_architecture` |
| Blast radius | what breaks if I change X | `detect_changes` / `trace_path` |

**Heavy-think query construction:** name the concept + 2-3 synonyms; split cross-domain into sub-queries. See [codebase-query-patterns.md](codebase-query-patterns.md).

## When Grep Wins

Grep is the right tool ONLY for non-code text:

| Use grep for | Example |
|-------------|---------|
| Exact string literals in output/logs | `'ERR_AUTH_FAILED'` |
| Comment patterns | `TODO:`, `FIXME`, `HACK` |
| File-extension globs | `*.test.ts`, `*.svelte` |
| Config values / non-code files | `.env` keys, READMEs, changelogs |

## Usage

| Rule | Detail |
|------|--------|
| Load first | `ToolSearch("select:mcp__codebase__search_graph")` once per session |
| Graph before files | Reach for `mcp__codebase__*` before Read/Grep — ~99% fewer tokens. Default tool, not a fallback. |
| Heavy explore → delegate + equip | Broad sweeps / reviews / multi-file mapping → spawn a subagent AND name `mcp__codebase__*` in its prompt, so the graph runs in its context and only findings return. |
| Small lookup → inline | A few targeted calls → run `mcp__codebase__*` directly; an agent costs more context than it saves. Not "manual execution" — using the tool. |
| Index lives globally | In `~/.cache/codebase-memory-mcp`, not in-repo; auto-syncs on index |

## If this repo isn't indexed

Ask: *"This repo isn't indexed by codebase-memory-mcp. Want me to index it (`index_repository`)?"*

## Related

- [codebase-query-patterns.md](codebase-query-patterns.md) — query construction reference
- [se.md](se.md) — software engineering principles
- [delegation-protocol.md](delegation-protocol.md) — delegate explore to subagents
