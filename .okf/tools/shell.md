---
type: Reference
title: "Shell setup"
description: "The zsh and tmux configuration: plugin manager, the three plugins, prompt, history search, completions and startup cost."
resource: https://github.com/samhvw8/dotfiles/blob/main/home/.zshrc
tags: [zsh, tmux, shell]
status: stable
generated: { by: claude-code/claude-opus-5-5, at: 2026-09-25T15:30:00Z }
sources:
  - id: zshrc
    resource: https://github.com/samhvw8/dotfiles/blob/main/home/.zshrc
    title: .zshrc
  - id: tmux
    resource: https://github.com/samhvw8/dotfiles/blob/main/home/.tmux.conf
    title: .tmux.conf
---

# zsh

| Piece | Setup |
|-------|-------|
| Plugin manager | z-shell/zi, no annexes, no snippets. zi itself runs from the `perf` branch of the samhvw8/zi fork while its patch is tested ([forks](/workflows/zsh-plugin-forks.md)) |
| Plugins | Three, turbo-loaded in one block right after compinit: fzf-tab, then F-Sy-H (fast-syntax-highlighting), then zsh-autosuggestions. All three load from samhvw8 forks' `perf` branches for now |
| Prompt | starship (init cached) |
| History search | atuin on Ctrl-R, `--disable-up-arrow`; zsh history kept too, `HISTSIZE`/`SAVEHIST` 50000 |
| Suggestions | zsh-autosuggestions with `ZSH_AUTOSUGGEST_STRATEGY=(history)`, set after atuin's init, which would otherwise select its own strategy and fork `atuin search` per keystroke[^zshrc] |
| Fuzzy finder | fzf from mise via `fzf --zsh` (Ctrl-T, Alt-C); `FZF_DEFAULT_COMMAND` uses fd; fzf-tab reuses `FZF_DEFAULT_OPTS` |
| Directory jumping | zoxide as `j`, init cached; its `j <Tab>` completion is queued with `zicompdef` because compinit runs later, in turbo |
| Completions | `_cached_comp` writes each tool's own completion (mise, kubectl, uv, bat, delta, atuin, rg, fd, starship, rustup, cargo) to `~/.cache/zsh/completions/`, regenerated only when the tool's resolved binary changes. `_compinit_fresh` rebuilds the dump when any fpath dir is newer than it, then zcompiles it. The dump lives at `$ZSH_COMPDUMP` because `ZI[ZCOMPDUMP_PATH]` is set before zi loads |
| PATH | `typeset -U path` removes duplicates. `.zprofile` runs `brew shellenv` before `mise activate --shims`, so non-interactive login shells (IDEs, GUI apps, scripts) find mise's tools ahead of Homebrew's `python3` and `kubectl`; interactive shells re-activate mise in `.zshrc`. Python environments come from mise (`python`, `uv`), not conda |
| Tool init | `_cached_init <name> <cmd>` caches init scripts per tool version[^zshrc] |
| Aliases | 35 in total. `g=git`, and `ll`/`l`/`la` as `ls -lh`/`ls -lah`/`ls -lAh`, the definitions that were really in effect when OMZ still overrode `.zshrc` |

The few OMZ library lines still wanted (history setopts, case-insensitive
matching, completion cache, `WORDCHARS=''`, `unsetopt flowcontrol`) are inlined
in `.zshrc`; no OMZ snippet is loaded.

New tab ≈ 0.18s on macOS (`zsh -i -c exit`, hyperfine, 2026-09-24). Choices and
measurements: [zsh startup decision](/decisions/zsh-startup.md).

# tmux

`.tmux.conf` sets `allow-passthrough on`, `extended-keys on` and
`terminal-features 'xterm*:extkeys'` so Claude Code's notifications and
Shift+Enter work inside tmux (needs tmux ≥ 3.3).[^tmux] Plugins through tpm
(full installs).

[^zshrc]: .zshrc
[^tmux]: .tmux.conf
