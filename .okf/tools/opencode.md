---
type: Reference
title: "opencode configuration"
description: "Which parts of ~/.config/opencode live in this repository, which ccp writes, and which stay machine-local."
resource: https://github.com/samhvw8/dotfiles/tree/main/home/.config/opencode
tags: [opencode, ccp, agents]
status: stable
generated: { by: claude-code/claude-fable-5-2, at: 2026-11-23T07:30:00Z }
sources:
  - id: ccp-opencode
    resource: https://github.com/samhvw8/claude-code-profile/blob/main/.okf/features/opencode.md
    title: ccp opencode integration
---

# Who owns what in `~/.config/opencode`

| Path | Owner |
|------|-------|
| `opencode.json` | This repository — the model, the `instructions` list (hub rules, the overlay, the output style) and the `rea` MCP server, run from its mise shim (`npm:rea-agents`). It holds no secrets |
| `opencode-overlay.md` | This repository — what differs from Claude Code: the `task` tool, the tool table, skills and OKF. It names only what `opencode.json` configures |
| `plugins/surgical-changes.ts` | This repository — opencode 2 port of the Claude Code `surgical-changes` hook (`tool.hook("execute.after")`, no imports) |
| `skills/playwriter/` | This repository |
| `agent/architect.md`, `debug.md`, `research.md`, `review.md` | This repository — opencode-only primary modes |
| `agent/go-expert.md`, `cloudflare-workers-expert.md`, `mcp-server-engineer.md`, `run-cost-auditor.md` | This repository — opencode-only subagents |
| Other `agent/*.md`, `command/*.md` | ccp: converted copies of the active profile's agents and commands, written by `ccp opencode sync`[^ccp-opencode] — do not edit or store them here |
| `output-style.md` | ccp: the active output style's body, written by `ccp opencode sync` |
| `plugins/herdr-agent-state.js`, `herdr-tui-session.js`, `tui.jsonc` | Machine-local: written by herdr's agent-state installer |
| `service.json`, `node_modules/`, `package*.json`, `bun.lock` | Machine-local, not stored: a service password and opencode-managed dependencies |

opencode reads `~/.claude/CLAUDE.md` and `~/.claude/skills/` (the active ccp profile) itself, and
`opencode.json` takes rules from `{env:HOME}/.claude/rules/*.md`, so none of those need copying.
From 2026-10-02 to 2026-11-23 `opencode.json` was missing from this repository and the live file
had no `instructions` list, so opencode ran without the hub rules, the overlay and the output
style. Check with `opencode debug config`: the `instructions` list must be there. The codegraph
and Parallax MCP servers are not configured, because each session would start its own copy;
the overlay points to the `codegraph` and `parallax` CLIs instead. If opencode replaces the link
with a plain file, `mise dot status` shows it: copy the file back into `home/` and re-link it.
Paths in `opencode.json` use `{env:HOME}`, so the same file works on macOS and Linux. The default
models come from OpenCode Go (`opencode-go/…`), which needs the Go API key connected once per
machine with `/connect`. The default model is `opencode-go/glm-5.3`; `opencode-go/deepseek-v4.1-flash`
fails unless the Go workspace allows Global regions.

# Plugins under opencode 2

opencode 2 loads only plugins that default-export `{ id, setup }`; the v1 style (a function
returning hooks) fails with "Plugin must export a default definition". `surgical-changes` uses the
v2 shape. `okf-docs` has no v2 port, so the overlay's "Project knowledge" section tells the agent to read
`.okf/index.md` instead.

The installed `@opencode-ai/plugin` v2 types lag the runtime; dump `Object.keys(ctx)` in `setup` to
see the real API. Two ways to change the system prompt, tested on 2.0.21:

| Method | Effect |
|--------|--------|
| `ctx.session.hook("context", e => e.system.push({ type: "text", text }))` | Appends. Runs before each model request; `e.system` is an array of text parts, opencode's base prompt first. `e` also carries `agent`, `model`, `messages`, `tools`. |
| `ctx.agent.transform(draft => draft.update(id, a => { a.system = … }))` | Replaces. For agents with no prompt of their own (`build`, `plan`, `general`), setting `system` drops opencode's base prompt. |

`ctx.session.hook` accepts any name without an error, so a misspelt hook fails silently. Static text
belongs in `instructions`; a plugin is only worth it for text computed per request. The background
service (`opencode service`) loads plugins at start: restart it, or test with
`opencode run --standalone`, after changing one. The
meridian plugin is not configured: meridian 1.79 supports opencode 2 only up to 2.0.16, and its
plugin path changes with every upgrade — `meridian setup --v2` installs it on a supported host.

# New machine

After `mise bootstrap` links these files and `ccp bootstrap` runs, run `ccp opencode sync` once;
from then on ccp keeps the agent copies current.

[^ccp-opencode]: ccp opencode integration docs.
