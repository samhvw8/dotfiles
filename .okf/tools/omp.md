---
type: Reference
title: "omp configuration"
description: "Which parts of ~/.omp/agent live in this repository, which ccp writes, and which stay machine-local."
resource: https://github.com/samhvw8/dotfiles/tree/main/home/.omp/agent
tags: [omp, ccp, agents, hooks]
status: stable
generated: { by: claude-code/claude-opus-5-5, at: 2026-11-10T09:00:00Z }
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
  - id: omp-models-doc
    resource: https://github.com/can1357/oh-my-pi/blob/main/docs/models.md
    title: omp model selection and availability
---

# Who owns what in `~/.omp/agent`

`~/.omp/agent` has its own `symlink-each` entry in `mise/conf.d/dotfiles.toml`, so only files committed under `home/.omp/agent/` become symlinks; runtime databases, sessions, and `ccp`-managed links are left alone.[^dotfiles-conf]

| Path | Owner |
|------|-------|
| `config.yml` | This repository — model roles, presets, subagent model routing (`task.agentModelOverrides`), and `skills.ignoredSkills`[^omp-dir] |
| `models.yml` | This repository — OpenRouter provider routing and custom provider/model definitions (such as `tokenharbor`)[^omp-dir] |
| `extensions/codegraph-remind.ts` | This repository — omp port of the Claude Code `codegraph-remind` hook[^omp-dir] |
| `extensions/cost-remind.ts` | This repository — omp port of the Claude Code `cost-remind` hook[^omp-dir] |
| `extensions/dge-guard.ts` | This repository — omp port of the Claude Code `session-start` `<dge_loop>` rule[^omp-dir] |
| `extensions/mediasift-hint.ts` | This repository — omp port of the Claude Code `mediasift-hint` hook and `MEDIASIFT_ON` env sync from `~/.claude/settings.json`[^omp-dir] |
| `extensions/okf-docs.ts` | This repository — omp port of the Claude Code `okf-docs` hook[^omp-dir] |
| `extensions/okf-stop.ts` | This repository — omp port of the Claude Code `okf-stop` hook[^omp-dir] |
| `extensions/output-style.ts` | This repository — loads the active `outputStyle` from `~/.claude/settings.json` and `~/.claude/output-styles/`[^omp-dir] |
| `AGENTS.md`, `RULES.md`, `APPEND_SYSTEM.md`, `skills/`, `agents/` | `ccp` (`ccp omp sync`) — mirrored from the active profile (`default`) |
| `mcp.json` | Machine-local (holds machine paths and the `artifact-server` bearer token); `setup-claude-mcp.sh` updates `rea` (`rea-agents mcp`, `JAVA_HOME`, `GHIDRA_INSTALL_DIR`) inside it when present[^claude-mcp] |
| `*.db*`, `sessions/`, `blobs/`, `cache/` | `omp` runtime state — never committed |

# New machine

After `mise bootstrap` links `home/.omp/agent/` and `ccp bootstrap` runs, run `ccp omp sync` once: from then on `ccp` keeps `AGENTS.md`, `RULES.md`, `APPEND_SYSTEM.md`, `skills/`, and `agents/` current whenever the active profile changes.

`AGENTS.md` is a symlink to the profile's `CLAUDE.md` (`home/.ccp/profiles/default/CLAUDE.md`), which serves as the single source of truth for both Claude Code and `omp` (including `omp`'s `eval` Code Mode, `web_search` / `read`, and orchestrator-and-verifier delegation), so a change to the global instructions reaches `omp` with zero LLM sync cost and zero drift. `ccp` replaces only links it made, so an agent link made another way goes stale on unlink: delete it and run `ccp omp sync`. omp skips an agent whose frontmatter is not valid YAML (quote a `description:` that contains `: `) or that sets `model: inherit` without a `task.agentModelOverrides` entry in `config.yml`; Claude Code treats an omitted `model` the same as `inherit` when `CLAUDE_CODE_SUBAGENT_MODEL` is unset, so leave the line out.

# A machine without a provider's key

`models.yml` defines `tokenharbor`, whose key comes from `TOKENHARBOR_API_KEY`. omp counts a provider with a configured key command as available without running the command, and when the default model cannot start it falls back to the first available model.[^omp-models-doc] On a machine without the key, omp could start on DeepSeek V4.1 Flash and then refuse every prompt with `No API key found for tokenharbor`; `me.ubuntu.home` did this on 2026-11-09.

On such a machine, disable the provider with a machine-local overlay:

1. Write `~/.config/omp/local.yml` with `disabledProviders: [tokenharbor]`.
2. Set `PI_CONFIG_FILES = "{{env.HOME}}/.config/omp/local.yml"` in `[env]` of `~/.config/mise/config.local.toml`.
3. Open a new shell and check that `omp models` no longer lists `tokenharbor`.

An overlay is strict: if the file is missing, omp refuses to start. `me.ubuntu.home` uses this overlay.

[^omp-dir]: home/.omp/agent
[^dotfiles-conf]: Shared dotfiles config
[^claude-mcp]: setup-claude-mcp.sh
[^omp-models-doc]: omp model selection and availability
