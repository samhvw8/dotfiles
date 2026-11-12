---
type: Reference
title: "agy (Antigravity CLI) configuration"
description: "Which parts of ~/.gemini live in this repository, which ccp writes, which stay machine-local, and how auto mode behaves in headless runs."
resource: https://github.com/samhvw8/dotfiles/tree/main/home/.gemini
tags: [agy, antigravity, ccp, agents, mcp]
status: stable
generated: { by: claude-code/claude-opus-5-5, at: 2026-11-12T12:45:00Z }
sources:
  - id: ccp-agy
    resource: https://github.com/samhvw8/claude-code-profile/blob/main/.okf/features/agy.md
    title: ccp agy integration
  - id: agy-docs
    resource: https://antigravity.google/docs/customization-discovery?tab=cli
    title: Antigravity customization discovery
  - id: agy-settings
    resource: https://antigravity.google/docs/cli/reference
    title: Antigravity CLI settings keys
---

# Who owns what

agy (`antigravity-cli` in `mise/config.toml`) reads its global customizations from
`~/.gemini/config/` and its CLI settings from `~/.gemini/antigravity-cli/settings.json`.[^agy-docs]

| Path | Owner |
|------|-------|
| `~/.gemini/antigravity-cli/settings.json` | This repository. `agentMode: auto` with `enableTerminalSandbox`, notifications on, tips and surveys off, and a small `permissions.allow` list |
| `~/.gemini/config/mcp_config.json` | This repository. Stdio and HTTP MCP servers without secrets |
| `~/.gemini/config/AGENTS.md`, `GEMINI.md`, `agents/`, `rules/`, `skills/` | ccp: written by `ccp agy sync` from the active profile[^ccp-agy] (`CLAUDE.md` link, output style, converted agents and rules, skill links). Do not store them here |
| `~/.gemini/config/plugins/local-secrets/` | Machine-local, never stored: an agy plugin whose `mcp_config.json` holds MCP servers with tokens (`artifact-server`, copied from `~/.claude.json`) |
| `~/.gemini/config/hooks.json`, `hooks/` | Machine-local: written by herdr's agent-state installer |
| `~/.gemini/config/config.json`, `projects/` | Machine-local: written by agy (remote-control hostname, project IDs) |

Both stored files use absolute `/Users/samhv` paths, because agy's global config does not expand
`~` or environment variables. Only the full install links them, which matches where agy is installed.
agy may rewrite `settings.json` (for example `/model` or a newly trusted folder). If a save replaces
the link with a plain file, `mise dot status` shows it: copy the file back into `home/` and re-link it.

# Plugin MCP servers

agy names a plugin's server `<plugin>_<server>`, so the token-holding server is
`local-secrets_artifact-server`, and a permission rule must use that name
(`mcp(local-secrets_artifact-server/<tool>)`). `agy mcp list` shows only the servers in the
global `mcp_config.json`. `agy plugin list` shows the plugin.

# Auto mode and headless runs

In `auto` mode, agy's tool-safety check flags `call_mcp_tool` and `invoke_subagent` and waits for
approval. A headless run (`agy -p`) cannot approve, so the turn hangs until `--print-timeout`.
Interactive sessions show the prompt. For a headless job that needs MCP or subagents, pass
`--settings='{"agentMode":""}'` together with explicit allow rules, or run it interactively.

`agy agents` lists only agents that can be picked as the main agent. The agents ccp writes are
subagents only (`mainAgent: false`), so that list is empty by design.

# New machine

After `mise bootstrap` links these files and `ccp bootstrap` runs, run `ccp agy sync` once. From
then on ccp keeps agy current. Re-create the `local-secrets` plugin by hand, or ask an agent to copy
the `artifact-server` entry from `~/.claude.json`.

[^ccp-agy]: ccp agy integration docs.
[^agy-docs]: Antigravity customization discovery docs.
