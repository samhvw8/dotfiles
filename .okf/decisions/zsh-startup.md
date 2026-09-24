---
type: Decision
title: "zsh startup choices"
description: "Measured choices that bring a new zsh to about 0.18s: usage-driven plugin removal, patched plugin and zi forks, cached init and completions, no deferred or cached mise."
tags: [decision, zsh, performance]
status: stable
generated: { by: claude-code/claude-opus-5-5, at: 2026-09-24T09:00:00Z }
sources:
  - id: zshrc
    resource: https://github.com/samhvw8/dotfiles/blob/master/home/.zshrc
    title: .zshrc
  - id: full
    resource: https://github.com/samhvw8/dotfiles/blob/master/mise/config.toml
    title: Full install config
  - id: zsh-bench
    resource: https://github.com/romkatv/zsh-bench
    title: zsh-bench
  - id: history
    resource: all commands in ~/.local/share/atuin/history.db and ~/.zsh_history
    title: Shell history (13.6k lines)
    usage_count: 13620
usage_window: { from: 2026-01-10, to: 2026-09-24 }
---

# Measurements (macOS)

| Date | Change | `zsh -i -c exit` | Startup + all turbo plugins |
|------|--------|------------------|-----------------------------|
| 2026-09-23 | Before | 0.31s | |
| 2026-09-23 | `gh auth token` export removed; mise uses `settings.github.credential_command` | ~0.25s | |
| 2026-09-23 | + fzf and atuin added, init scripts cached | 0.26s | |
| 2026-09-24 | Baseline for the plugin audit | 0.247s | 0.449s |
| 2026-09-24 | Plugin cleanup (below) | 0.215s | 0.311s |
| 2026-09-24 | + zi on the samhvw8/zi `perf` fork (no git forks at load) | 0.177s | |

2026-09-24 numbers are hyperfine means over 15–20 runs.

# Choices

* **Keep only what history shows is used.**[^history] Removed: the zi annexes (meta-plugins, readurl, patch-dl; no `@`, `dlink`, `dl` or `patch` ice was ever used), all 13 OMZ snippets (of ~250 aliases and functions only `g` was used, 1204 times), forgit (0 uses, silently shadowed 13 git aliases), zsh-completions (24 of 153 completions matched installed tools), zsh-you-should-use (~5ms per command, ~20ms per git command) and the `null` wrapper for zoxide.
* **Keep zi.** Dropping the plugin manager would save its load cost but make plugin management harder; instead zi itself was patched ([forks](/workflows/zsh-plugin-forks.md)).
* **Patch the three kept plugins rather than tune them.** fzf-tab, F-Sy-H and zsh-autosuggestions run from samhvw8 forks while the patches are tested before upstream PRs. zsh-autosuggestions' incremental rebind makes `ZSH_AUTOSUGGEST_MANUAL_REBIND` unnecessary.
* **Completions from the tools themselves**, generated once per tool version, instead of zsh-completions or stale one-off caches (mise and kubectl caches were from 2023–24; the cargo link pointed at a deleted snippet).
* **GitHub token**: `credential_command = "gh auth token"` in `mise/config.toml`;[^full] runs only when mise calls the GitHub API, never at shell start.
* **Cached init**: `_cached_init` sources starship, fzf, atuin and zoxide init scripts from `~/.cache/zsh/init/`, rebuilt when the tool's resolved binary or the arguments change.[^zshrc]
* **mise activation is neither deferred nor cached.** Deferring is unsafe (the first command may run with wrong versions).[^zsh-bench] Caching `mise activate zsh` output is also unsafe: it embeds the current `$PATH` literally, so one terminal's PATH would leak into every shell. Shims-only mode would lose per-directory `[env]`. It costs ~14ms once; its per-prompt hook is ~0.1ms when nothing changed.
* **History**: `SAVEHIST=50000` to match `HISTSIZE`.
* **atuin** owns Ctrl-R (SQLite history); fzf keeps Ctrl-T/Alt-C. Autosuggestions still read zsh history in-process (same data, no fork).

See [shell setup](/tools/shell.md).

[^full]: Full install config
[^zshrc]: .zshrc
[^zsh-bench]: zsh-bench
[^history]: Shell history (13.6k lines)
