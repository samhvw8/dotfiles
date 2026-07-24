# Codegraph

The `codegraph` MCP ([colbymchenry/codegraph](https://github.com/colbymchenry/codegraph), v1.5.0+) is a pre-built knowledge graph of every symbol, call edge, and dependency in a repo — surgical context in one call instead of grep/Read crawls. ~60% lower cost, ~69% fewer tokens measured. Deferred MCP tool (`mcp__codegraph__*`). Load via `ToolSearch` before first use each session.

## Gate (MANDATORY)

**Before ANY codebase search — STOP and run this check:**

```
1. Is codegraph available for this repo? (.codegraph/ present — the codegraph-remind hook confirms)
2. Is this about CODE? (symbols, files, architecture, behavior, flow, usage, dependencies)
   - YES -> codegraph_explore. Always. No exceptions.
   - NO  -> grep (literal strings in non-code: logs, comments, configs, READMEs)
3. Proceed.
```

**The rule is simple: code questions -> `codegraph_explore`. Text questions -> grep.**

## One Tool: `codegraph_explore`

v1.5.0 exposes a **single MCP tool** — one strong tool steers better than a menu:

| Ask it | Get back |
|--------|----------|
| "how does X work" | Relevant symbols' verbatim source, grouped by file |
| "how does X reach Y" (a flow) | Call paths between the symbols — incl. dynamic-dispatch hops (callbacks, React re-render, interface->impl) grep can't follow |
| Survey an area / topic | The area's symbols + relationship map + blast-radius summary |
| Name a file or symbol | Its current line-numbered source (same shape as Read) plus dependents |
| Another indexed repo | Pass `projectPath` — monorepo sub-service or second repo, same session |

**Query construction:** natural language; name the concept + flow endpoints; split cross-domain questions into separate calls. Prefer explore over Read for *understanding* code — Read/Edit only to modify.

## Unlisted Tools & CLI Equivalents

`codegraph_node`, `codegraph_search`, `codegraph_callers`, `codegraph_callees`, `codegraph_impact`, `codegraph_files`, `codegraph_status` stay functional but unlisted — everything they return already arrives inline on `codegraph_explore`. Re-enable via `CODEGRAPH_MCP_TOOLS=explore,node,...` env, or use the CLI:

| CLI | Purpose |
|-----|---------|
| `codegraph explore <query>` | Same output as the MCP tool |
| `codegraph node <name>` | One symbol's source + caller/callee trail |
| `codegraph query <search>` | Symbol search |
| `codegraph callers/callees <symbol>` | Call graph edges |
| `codegraph impact <symbol>` | Blast radius of changing a symbol |
| `codegraph affected [files...]` | Test files affected by changed source files |
| `codegraph init` / `status` / `sync` | Index management (per project) |

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
| Load first | `ToolSearch("select:mcp__codegraph__codegraph_explore")` once per session |
| Graph before files | `codegraph_explore` before Read/Grep — fewer calls, surgical context. Default tool, not a fallback. |
| Heavy explore → delegate + equip | Broad sweeps / reviews / multi-file mapping → spawn a subagent AND name `mcp__codegraph__codegraph_explore` in its prompt, so the graph runs in its context and only findings return. |
| Small lookup → inline | A targeted explore call → run it directly; an agent costs more context than it saves. Not "manual execution" — using the tool. |
| Index lives in-repo | `.codegraph/` at project root; **auto-sync watches every file change — never stale, nothing to re-run** |
| Upgrade | `codegraph upgrade` (add `--check` to preview); `codegraph upgrade` also refreshes agent wiring |

## If this repo isn't indexed

Ask: *"This repo isn't indexed by codegraph. Want me to run `codegraph init` here?"* (CLI step, not an MCP tool — builds the graph once, then auto-syncs.)

## Related

- [se.md](se.md) — software engineering principles
- [delegation-protocol.md](delegation-protocol.md) — delegate explore to subagents
