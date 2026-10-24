---
type: Reference
title: "omp configuration"
description: "Which parts of ~/.omp/agent live in this repository, which ccp writes, and which stay machine-local."
resource: https://github.com/samhvw8/dotfiles/tree/main/home/.omp/agent
tags: [omp, ccp, agents, hooks]
status: stable
generated: { by: google-antigravity/gemini-4-argon, at: 2026-10-24T01:20:00Z }
sources:
  - id: omp-dir
    resource: https://github.com/samhvw8/dotfiles/tree/main/home/.omp/agent
    title: home/.omp/agent
  - id: dotfiles-conf
    resource: https://github.com/samhvw8/dotfiles/blob/main/mise/conf.d/dotfiles.toml
    title: Shared dotfiles config
  - id: claude-mcp
    resource: https://github.com/samhvw8/dotfiles/blob/main/mise/scripts/setup-claude-mcp.sh
    title: setup-claude-mcp.sh
---

# Who owns what in `~/.omp/agent`

`~/.omp/agent` has its own `symlink-each` entry in `mise/conf.d/dotfiles.toml`, so only files committed under `home/.omp/agent/` become symlinks; runtime databases, sessions, and `ccp`-managed links are left alone.[^dotfiles-conf]

| Path | Owner |
|------|-------|
| `AGENTS.md` | This repository — omp global instructions: orchestrator-and-verifier role, `eval` Code Mode with MCP and built-in tools, and omp `web_search` / `read` alongside Parallax MCP[^omp-dir] |
| `config.yml` | This repository — model roles, presets, subagent model routing (`task.agentModelOverrides`), and `skills.ignoredSkills`[^omp-dir] |
| `models.yml` | This repository — OpenRouter provider routing and Google Antigravity custom model definitions[^omp-dir] |
| `extensions/codegraph-remind.ts` | This repository — omp port of the Claude Code `codegraph-remind` hook[^omp-dir] |
| `extensions/cost-remind.ts` | This repository — omp port of the Claude Code `cost-remind` hook[^omp-dir] |
| `extensions/dge-guard.ts` | This repository — omp port of the Claude Code `session-start` `<dge_loop>` rule[^omp-dir] |
| `extensions/mediasift-hint.ts` | This repository — omp port of the Claude Code `mediasift-hint` hook and `MEDIASIFT_ON` env sync from `~/.claude/settings.json`[^omp-dir] |
| `extensions/okf-docs.ts` | This repository — omp port of the Claude Code `okf-docs` hook[^omp-dir] |
| `extensions/okf-stop.ts` | This repository — omp port of the Claude Code `okf-stop` hook[^omp-dir] |
| `extensions/output-style.ts` | This repository — loads the active `outputStyle` from `~/.claude/settings.json` and `~/.claude/output-styles/`[^omp-dir] |
| `RULES.md`, `skills/`, `agents/` | `ccp` (`ccp omp sync`) — mirrored from the active profile (`default`) |
| `mcp.json` | Machine-local (holds machine paths and the `artifact-server` bearer token); `setup-claude-mcp.sh` updates `rea` (`rea-agents mcp`, `JAVA_HOME`, `GHIDRA_INSTALL_DIR`) inside it when present[^claude-mcp] |
| `*.db*`, `sessions/`, `blobs/`, `cache/` | `omp` runtime state — never committed |

# New machine

After `mise bootstrap` links `home/.omp/agent/` and `ccp bootstrap` runs, run `ccp omp sync` once: from then on `ccp` keeps `RULES.md`, `skills/`, and `agents/` current whenever the active profile changes.

`AGENTS.md` is tracked directly in `home/.omp/agent/AGENTS.md` and linked by `mise`, so omp gets its own global instructions (`eval` Code Mode, omp `web_search` / `read`, orchestrator-and-verifier workflow) matched to `omp`'s live tools via the `ccp` skill (`Harness-Aware Sync`), while `ccp omp sync` handles mechanical syncing of `RULES.md`, `APPEND_SYSTEM.md`, `skills/`, and `agents/` and leaves `AGENTS.md` untouched. omp skips an agent whose frontmatter is not valid YAML (quote a `description:` that contains `: `) or that sets `model: inherit`; Claude Code treats an omitted `model` the same as `inherit` when `CLAUDE_CODE_SUBAGENT_MODEL` is unset, so leave the line out.

[^omp-dir]: home/.omp/agent
[^dotfiles-conf]: Shared dotfiles config
[^claude-mcp]: setup-claude-mcp.sh
