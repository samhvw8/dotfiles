---
type: Reference
title: "opencode configuration"
description: "Which parts of ~/.config/opencode live in this repository, which ccp writes, and which stay machine-local."
resource: https://github.com/samhvw8/dotfiles/tree/main/home/.config/opencode
tags: [opencode, ccp, agents]
status: stable
generated: { by: claude-code/claude-opus-5-5, at: 2026-10-01T10:30:00Z }
sources:
  - id: ccp-opencode
    resource: https://github.com/samhvw8/claude-code-profile/blob/main/.okf/features/opencode.md
    title: ccp opencode integration
---

# Who owns what in `~/.config/opencode`

| Path | Owner |
|------|-------|
| `opencode.json`, `opencode-overlay.md` | This repository |
| `plugins/surgical-changes.ts` | This repository — opencode 2 port of the Claude Code `surgical-changes` hook (`tool.hook("execute.after")`, no imports) |
| `skills/playwriter/` | This repository |
| `agent/architect.md`, `debug.md`, `research.md`, `review.md` | This repository — opencode-only primary modes |
| `agent/go-expert.md`, `cloudflare-workers-expert.md`, `mcp-server-engineer.md`, `run-cost-auditor.md` | This repository — opencode-only subagents |
| Other `agent/*.md`, `command/*.md` | ccp: converted copies of the active profile's agents and commands, written by `ccp opencode sync`[^ccp-opencode] — do not edit or store them here |
| `service.json`, `node_modules/`, `package*.json`, `bun.lock` | Machine-local, not stored: a service password and opencode-managed dependencies |

opencode reads `~/.claude/CLAUDE.md` and `~/.claude/skills/` (the active ccp profile) itself, and
`opencode.json` takes rules from `{env:HOME}/.claude/rules/*.md`, so none of those need copying.
Paths in `opencode.json` use `{env:HOME}`, so the same file works on macOS and Linux. The default
models come from OpenCode Go (`opencode-go/…`), which needs the Go API key connected once per
machine with `/connect`.

# Plugins under opencode 2

opencode 2 loads only plugins that default-export `{ id, setup }`; the v1 style (a function
returning hooks) fails with "Plugin must export a default definition". `surgical-changes` uses the
v2 shape. `okf-docs` has no v2 port: the session `context` hook's message format is undocumented, so
the overlay's "Project knowledge" section tells the agent to read `.okf/index.md` instead. The
meridian plugin is not configured: meridian 1.79 supports opencode 2 only up to 2.0.16, and its
plugin path changes with every upgrade — `meridian setup --v2` installs it on a supported host.

# New machine

After `mise bootstrap` links these files and `ccp bootstrap` runs, run `ccp opencode sync` once;
from then on ccp keeps the agent copies current.

[^ccp-opencode]: ccp opencode integration docs.
