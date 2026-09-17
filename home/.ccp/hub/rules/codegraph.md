# Codegraph

Two MCP servers answer structural code questions from a real symbol graph instead
of a text search. Both beat grep for anything about *code*; grep still wins for
text.

| Server | Shape |
|--------|-------|
| `codegraph` ([colbymchenry/codegraph](https://github.com/colbymchenry/codegraph)) | Per-repo SQLite index. `codegraph_explore` takes a natural-language question and returns the relevant symbols' verbatim source, the call paths between them, and a blast-radius summary |
| `sem` | Entity-level, no per-repo index step. `sem_context` reads a function/class *with* its callers and callees; `sem_impact` answers "what breaks if I change this"; `sem_entities` finds text inside entity bodies |

Both are deferred — load with `ToolSearch` before first use in a session.

## Choosing

Ask a code question → graph tool. Ask a text question → grep.

| Question | Tool |
|----------|------|
| "How does X work?" / "how does X reach Y?" | `codegraph_explore` |
| "Read/understand function X" | `sem_context` — returns the body plus its dependencies |
| "What calls X? What breaks if I change it?" | `sem_impact` |
| Survey an area, map an unfamiliar subsystem | `codegraph_explore` |
| Exact string in logs or error output | grep |
| `TODO:`/`FIXME:` comments, config keys, READMEs | grep |
| Find files by extension | glob |

Open a file directly to *edit* it, or when it isn't code. To merely understand
code, the graph tools arrive with the dependency context already attached.

If you fall back to grep on a structural question, say why.

## Practicalities

- **Index location** — codegraph keeps `.codegraph/` at the project root and
  auto-syncs on file changes, so it's never stale. `sem` needs no per-repo setup.
- **Other repos** — pass `projectPath` to reach a monorepo sub-service or a second
  indexed repo in the same session.
- **Not indexed?** Ask before running `codegraph init` — it's the user's call, and
  it's a CLI step, not an MCP tool. A `codegraph-remind` hook flags this too.
- **Heavy sweeps** — a broad multi-file map belongs in a subagent, with
  `codegraph_explore` named in its prompt so only findings come back. A single
  targeted call is cheaper inline.
- **CLI** — `codegraph explore|node|query|callers|callees|impact|affected|status`
  mirror the MCP surface. `codegraph upgrade` refreshes the tool and agent wiring.

## Related

- [delegation-protocol.md](delegation-protocol.md) — delegating heavy exploration
