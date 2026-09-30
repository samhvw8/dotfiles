---
description: Route structural code questions to the codegraph MCP graph tool instead of grep
alwaysApply: true
---

# Codegraph

The `codegraph` MCP server ([colbymchenry/codegraph](https://github.com/colbymchenry/codegraph))
answers structural code questions from a real symbol graph instead of a text
search. It keeps a per-repo SQLite index; `codegraph_explore` takes a
natural-language question and returns the relevant symbols' verbatim source, the
call paths between them, and a blast-radius summary. It beats grep for anything
about *code*; grep still wins for text.

How you reach it depends on the harness:

- **omp** — registered in `~/.omp/agent/mcp.json` and mounted as `xd://` *devices*,
  not top-level tools. Call one by writing to its path with the JSON args as the
  content, and `read xd://<device>` for its docs and schema:

  ```
  write xd://mcp__codegraph_explore
  {"query": "how does a request reach the auth check", "projectPath": "/abs/path/to/repo"}
  ```

  `projectPath` is required — pass the repo root holding `.codegraph/`. If a device
  is missing, `/mcp list` and `/mcp test <name>` show why.
- **Claude Code** — deferred: load with `ToolSearch` before first use in a
  session, then call them as `mcp__codegraph__*`.

## Choosing

Ask a code question → codegraph. Ask a text question → grep.

| Question | Tool |
|----------|------|
| "How does X work?" / "how does X reach Y?" | `codegraph_explore` |
| "Read/understand function X" | `codegraph_explore` — returns the body plus its call paths |
| "What calls X? What breaks if I change it?" | `codegraph_explore` — its blast-radius summary |
| Survey an area, map an unfamiliar subsystem | `codegraph_explore` |
| Exact string in logs or error output | grep |
| `TODO:`/`FIXME:` comments, config keys, READMEs | grep |
| Find files by extension | glob |

Open a file directly to *edit* it, or when it isn't code. To merely understand
code, the graph tools arrive with the dependency context already attached.

If you fall back to grep on a structural question, say why.

## Practicalities

- **Index location** — codegraph keeps `.codegraph/` at the project root and
  auto-syncs on file changes, so it's never stale.
- **Other repos** — pass `projectPath` to reach a monorepo sub-service or a second
  indexed repo in the same session.
- **Not indexed?** Ask before running `codegraph init` — it's the user's call, and
  it's a CLI step, not an MCP tool. The `codegraph-remind` extension flags this too.
- **Heavy sweeps** — a broad multi-file map belongs in a `task` subagent, with
  `codegraph_explore` named in its prompt so only findings come back. A single
  targeted call is cheaper inline.
- **CLI** — `codegraph explore|node|query|callers|callees|impact|affected|status`
  mirror the MCP surface. `codegraph install`/`upgrade` don't know about omp — this
  wiring is maintained by hand.

## Related

- [delegation-protocol.md](delegation-protocol.md) — delegating heavy exploration
