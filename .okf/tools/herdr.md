---
type: Reference
title: "Herdr (agent terminal runtime)"
description: "The herdr TUI, the Herdr desktop app and herdr-core: what each one is, how each is installed here, and how Claude Code and omp report status."
resource: https://herdr.dev/
tags: [herdr, agents, terminal, mise, homebrew]
status: stable
generated: { by: claude-code/claude-opus-5-5, at: 2026-11-10T09:30:00Z }
stale_after: 2027-02-09
sources:
  - id: tui-agents
    resource: https://herdr.dev/tui/docs/agents/
    title: Herdr TUI docs, Agents
  - id: tui-integrations
    resource: https://herdr.dev/tui/docs/integrations/
    title: Herdr TUI docs, Integrations
  - id: app-readme
    resource: https://github.com/herdrdev/herdr-app
    title: herdr-app README
  - id: app-security
    resource: https://github.com/herdrdev/herdr-app/blob/main/docs/security.md
    title: herdr-app security and privacy
  - id: core-page
    resource: https://herdr.dev/core/
    title: herdr-core page
---

# Three programs

| Program | Command | Install here | Updates |
|---------|---------|--------------|---------|
| Herdr TUI | `herdr` | `herdr = "latest"` in `mise/config.toml` | `mise up` |
| Herdr desktop app | `Herdr.app`, `herdr-app` | `"brew-cask:herdr-app"` in `mise/config.toml` | The app updates itself |
| herdr-core | `hc`, `herdr-core` | Official installer, or the app offers it on first launch | `hc update` |

The TUI and the app are separate programs with separate servers. They do not share agents.[^app-readme]

herdr-core is not in the mise registry or Homebrew, and its repository has no GitHub releases. Its macOS install is a signed `Herdr Core.app` bundle in `~/.local/share/herdr-core`, linked from `~/.local/bin`.

# Status from Claude Code and omp

The TUI reads Claude Code state from the screen. The omp state needs the integration.[^tui-agents]

The app and `hc` use only OSC 7501 reports from the program.[^core-page] A live test on 2026-11-09 with Claude Code 2.1.319, omp 18.18.2 and hc 0.1.19 showed `reported: true` and `state: idle` for both. omp controls this with `terminal.programStatus`, which is on here.

An agent inside tmux inside a Herdr pane cannot report status.

# Integrations

`herdr integration install claude` and `herdr integration install omp` are needed only for the TUI: session resume after a server restart, and omp state.[^tui-integrations] The hooks check `HERDR_ENV`, so they do nothing in the app or outside Herdr.

Both are installed, and these files are in this repository:

| File | Note |
|------|------|
| `home/.ccp/hub/hooks/herdr-agent-state/` | Claude Code hook, a ccp hub hook linked to the `default` profile; ccp writes its `SessionStart` entry into `settings.json` |
| `home/.omp/agent/extensions/herdr-omp-agent-state.ts` | omp extension |

The hook is a ccp hub item, so `ccp bootstrap` keeps its link and every machine gets it from `profile.toml`. herdr's own install writes `~/.claude/hooks/herdr-agent-state.sh` and a second `SessionStart` entry with an absolute home path, which fails on `/home/samhv`. After `herdr integration install claude` runs again, copy its new script over `home/.ccp/hub/hooks/herdr-agent-state/scripts/herdr-agent-state.sh`, then delete the file it wrote and its extra entry. `herdr integration uninstall claude` does not find the hub entry: unlink it with `ccp unlink default hooks/herdr-agent-state`.

# Socket path

A core started by the Herdr app has no `XDG_RUNTIME_DIR`, so its socket is `~/.local/state/herdr-core/default/default.sock`. `home/.zshrc` exports `XDG_RUNTIME_DIR`, which would point `hc` at `~/.local/run`, so on macOS it also sets `HC_SOCKET` to the state path. Inside a Herdr terminal it uses `HC_TERMINAL_SOCKET` instead, because `hc` reads only `HC_SOCKET`. It skips private sessions, which set `HC_SESSION`. Terminals opened before a change here need a new tab.

# Agent messaging

`agent-msg` drives Herdr terminals through termctl's `hc` backend. `spawn` needs a running core, so a core never starts with an agent's environment. A spawned agent opens as a tab in the caller's space, or in its folder's space when started from outside Herdr. Long jobs on `homebox` stay in tmux.

# Privacy

The app sends a daily usage report by default. Set `"telemetry": false` in its `settings.json`, or use Settings → Privacy.[^app-security]

Do not start `hc` or `herdr` servers from inside a Claude Code session. The server can pass that session's `CLAUDE_CODE_*` variables to later terminals.

[^tui-agents]: Herdr TUI docs, Agents
[^tui-integrations]: Herdr TUI docs, Integrations
[^app-readme]: herdr-app README
[^app-security]: herdr-app security and privacy
[^core-page]: herdr-core page
