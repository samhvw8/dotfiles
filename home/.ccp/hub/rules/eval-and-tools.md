---
description: Promote omp eval (Code Mode) for multi-step MCP/tool orchestration, data filtering, parallel waves, and web/social search routing
alwaysApply: true
---

# Eval & Tool Routing

When `eval` is available (`omp`), use it as the default execution surface for multi-step tool and MCP work instead of turn-by-turn tool ping-pong:

- **2+ tool or MCP calls → 1 `eval` cell.** Chain, batch, or loop MCP and built-in tools inside `eval` (`await tool.mcp__<server>_<tool>(args)`, `await tool.<name>(args)`, `read()`, `write()`).
- **Filter and join in code.** Parse, deduplicate, diff, and slice intermediate JSON/markdown inside `eval` and return only the compact result so raw payloads never bloat session context.
- **Parallel waves & bulk judgment.** Use `workpool()` / `agent()` + `wait()` inside `eval` for concurrent sub-tasks, and `judge()` / `judge_batch()` for classification or ranking.
- **MCP syntax in `eval`.** Call MCP tools via `await tool.mcp__<server>_<tool>(args)` (or `await tool.write({ path: "xd://mcp__...", content: JSON.stringify(args) })`). Never pass `xd://` paths to the top-level `write(path, content)` helper.
- **Web & social search.** In `omp`, both built-in `web_search` / `read` (URLs) and Parallax MCP (`await tool.mcp__parallax_*` in `eval` for `social_search`, `search_reddit`, `twitter_search`, bot-protected `fetch_page` / `batch_fetch`, `get_trending`, `get_feed_items`) are first-class — combine them in one `eval` cell when gathering from multiple sources. In Claude Code, use Parallax MCP (`mcp__parallax_*` via `ToolSearch`). Always pass `focus` on list-shaped Parallax calls and `query` on `fetch_page` / `batch_fetch`.
- **Browser & native GUI.** Drive logged-in Chrome tabs via `browser` in `eval` or `bsk` (`browser-skill`), and native macOS apps via `cua` (`mcp__cua_computer_use_*`, after loading `cua-driver`).
