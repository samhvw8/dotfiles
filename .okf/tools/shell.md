---
type: Reference
title: "Shell setup"
description: "The zsh and tmux configuration: plugin manager, prompt, history search, tool integrations and startup cost."
resource: https://github.com/samhvw8/dotfiles/blob/master/home/.zshrc
tags: [zsh, tmux, shell]
status: stable
generated: { by: claude-code/claude-opus-5-5, at: 2026-09-24T02:00:00Z }
sources:
  - id: zshrc
    resource: https://github.com/samhvw8/dotfiles/blob/master/home/.zshrc
    title: .zshrc
  - id: tmux
    resource: https://github.com/samhvw8/dotfiles/blob/master/home/.tmux.conf
    title: .tmux.conf
---

# zsh

| Piece | Setup |
|-------|-------|
| Plugin manager | z-shell/zi with turbo loading: fast-syntax-highlighting, zsh-autosuggestions, zsh-completions, fzf-tab, forgit, zsh-you-should-use, OMZ libraries |
| Prompt | starship (init cached) |
| History search | atuin on Ctrl-R, `--disable-up-arrow`; zsh history kept too, `SAVEHIST=50000` |
| Fuzzy finder | fzf from mise via `fzf --zsh` (Ctrl-T, Alt-C); `FZF_DEFAULT_COMMAND` uses fd |
| Directory jumping | zoxide as `j` |
| PATH | `typeset -U path` removes duplicates |
| Tool init | `_cached_init <name> <cmd>` caches init scripts per tool version[^zshrc] |

New tab ≈ 0.26s on macOS and ≈ 0.29s on Ubuntu. Choices and measurements:
[zsh startup decision](/decisions/zsh-startup.md).

# tmux

`.tmux.conf` sets `allow-passthrough on`, `extended-keys on` and
`terminal-features 'xterm*:extkeys'` so Claude Code's notifications and
Shift+Enter work inside tmux (needs tmux ≥ 3.3).[^tmux] Plugins through tpm
(full installs).

[^zshrc]: .zshrc
[^tmux]: .tmux.conf
