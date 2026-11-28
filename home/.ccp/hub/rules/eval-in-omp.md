---
harness: [omp]
---
# Eval in omp

When `eval` is available (`omp`), use it as the default execution surface for multi-step tool and MCP work instead of turn-by-turn tool ping-pong:

- **2+ tool or MCP calls → 1 `eval` cell.** Chain, batch, or loop MCP and built-in tools inside `eval` (`await tool.mcp__<server>_<tool>(args)`, `await tool.<name>(args)`, `read()`, `write()`).
- **Filter and join in code.** Parse, deduplicate, diff, and slice intermediate JSON/markdown inside `eval` and return only the compact result so raw payloads never bloat session context.
- **Parallel waves & bulk judgment.** Use `workpool()` / `agent()` + `wait()` inside `eval` for concurrent sub-tasks, and `judge()` / `judge_batch()` for classification or ranking.
- **MCP syntax in `eval`.** Call MCP tools via `await tool.mcp__<server>_<tool>(args)` (or `await tool.write({ path: "xd://mcp__...", content: JSON.stringify(args) })`). Never pass `xd://` paths to the top-level `write(path, content)` helper.
- **Web & social search.** Both built-in `web_search` / `read` (URLs) and Parallax CLI (`await sh("parallax call <tool> '<json>'")` in `eval`, see `parallax-cli` skill) are first-class — combine them in one `eval` cell. Always pass `focus` on list-shaped Parallax calls and `query` on `fetch_page` / `batch_fetch`.
- **Browser & native GUI.** Drive logged-in Chrome tabs via `browser` in `eval` or `bsk` (`browser-skill`), and native macOS apps via `cua` (`mcp__cua_computer_use_*`, after loading `cua-driver`).
