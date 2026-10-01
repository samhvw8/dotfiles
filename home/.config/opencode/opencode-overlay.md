# opencode environment

This session runs in **opencode**, not Claude Code. Your global `~/.claude/CLAUDE.md`
and the rule files in `~/.claude/rules/` still apply — they are loaded here through
opencode's Claude Code compatibility and the `instructions` list (a glob over
`~/.claude/rules/*.md`, so it follows the active ccp profile). The corrections
below override anything in them that is Claude-Code-specific.

## Delegation in opencode
- **Subagents only.** Spawn one with the `task` tool; `subagent_type` is the agent
  name. A subagent runs once and returns — there are **no teammates and no
  `SendMessage`**, so the "Teammates vs subagents" section of
  `rules/delegation-protocol.md` does not apply.
- Max 3 parallel subagents.
- Available agents: the files in `~/.config/opencode/agent/` — the active ccp
  profile's agents (`cto-advisor`, `gatherer`, `heavy-thinker`, …; written by
  `ccp opencode sync`, do not edit) plus the opencode-only specialists
  (`go-expert`, `cloudflare-workers-expert`, `mcp-server-engineer`,
  `run-cost-auditor`) — and opencode's built-ins `build`, `plan`, `explore`, `general`.
- Primary modes (the user switches with Tab; `task` can't call them): `build`, `plan`,
  `review` (read-only diff review), `research` (lead-researcher loop, writes only
  `./research/`), `debug` (reproduce → root cause → fix), `architect` (Opus, run-cost
  trade-offs, writes only `plans/` and `.okf/`). Suggest switching when the work fits.

## Tools that do NOT exist here
The tools table in `CLAUDE.md` is Claude-Code-specific. In opencode the configured
surface is:
- Providers: `opencode-go` (default), `proxypal` (local Claude proxy) and `openrouter`.
- Built-ins: `bash`, `read`, `edit`, `glob`, `grep`, `list`, `task`, `todowrite`,
  `webfetch`. The built-in `websearch` is denied in `opencode.json` — web search
  is `parallax_web_search`.
- `gh` CLI is available through `bash`.
- MCP servers: **`codegraph`** and **`parallax`** (see below).

**Not configured in opencode:** `sem`, `context7`, and the Chrome MCP. Do not call
them. For web search use `parallax_web_search`; for pages, `webfetch` or `parallax_fetch_page`; for structural
code questions use `codegraph` (or `grep` / `read`).

## MCP servers
opencode names MCP tools `<server>_<tool>` and exposes them directly — no
`ToolSearch`, no `xd://` devices.

- **codegraph** — `codegraph_codegraph_explore` (and the `codegraph` CLI mirror via
  `bash`). This is the graph tool described in `rules/codegraph.md`, which **does**
  apply here; read its "How you reach them" / harness notes as opencode specifics,
  not Claude Code.
- **parallax** — `parallax_web_search`, `parallax_fetch_page`, etc. Use
  `parallax_fetch_page` when `webfetch` is blocked by Cloudflare/bot protection or
  needs JS rendering. It reads `PARALLAX_SCRAPER_URL` / `PARALLAX_SCRAPER_TOKEN`
  from the environment (set by mise's global `config.local.toml`), so launch
  opencode from a mise-activated shell.

## Models
opencode model IDs carry a provider prefix. Aliases used in `CLAUDE.md` map to:
- Opus → `proxypal/claude-opus-4-5-20251101`
- Sonnet → `proxypal/claude-sonnet-4-5-20250929`
- Haiku → `proxypal/claude-haiku-4-5-20251001`
- session default → `opencode-go/deepseek-v4.1-flash` (small model `opencode-go/glm-5.3-flash`, `plan` uses `opencode-go/glm-5.3`)

## Skills
Auto-loaded from `~/.claude/skills/` and `~/.agents/skills/` (plus
`~/.config/opencode/skills/`). Load one with the `skill` tool — the skill names are
unchanged from Claude Code.

## Project knowledge
If the project has an `.okf/index.md`, read it before working and load the `okf`
skill before reading or writing the bundle (Claude Code does this with its
`okf-docs` hook; opencode has no equivalent plugin here).

## Hooks
Claude Code hooks do not run in opencode. `surgical-changes` is ported as an
opencode 2 plugin in `~/.config/opencode/plugins/`: after an edit to a code file it
appends the diff-discipline reminder to the tool result. `okf-docs` is covered by
the "Project knowledge" section above instead of a plugin.
