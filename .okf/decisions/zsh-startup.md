---
type: Decision
title: "zsh startup choices"
description: "Measured choices that keep a new zsh at about 0.26s: lazy GitHub token, cached init scripts, no deferred mise."
tags: [decision, zsh, performance]
status: stable
generated: { by: claude-code/claude-opus-5-5, at: 2026-09-24T02:00:00Z }
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
---

# Measurements (macOS, new iTerm tab, 2026-09-23)

| Change | Startup |
|--------|---------|
| Before | 0.31s |
| `gh auth token` export removed; mise uses `settings.github.credential_command` instead | ~0.25s |
| + fzf and atuin added, init scripts cached | 0.26s |

# Choices

* **GitHub token**: `credential_command = "gh auth token"` in `mise/config.toml`;[^full] verified to run only when mise calls the GitHub API, never at shell start. gh keeps its token in the Keychain, so mise's `hosts.yml` fallback could not find it.
* **Cached init**: `_cached_init` sources starship, fzf and atuin init scripts from `~/.cache/zsh/init/`, rebuilt when the tool's resolved binary (its version under mise) or the arguments change.[^zshrc]
* **mise activation is not deferred**: deferring environment setup is unsafe (first command may run with wrong versions);[^zsh-bench] mise costs ~68ms once, then 9–13ms per prompt. `env_cache` showed no gain.
* **History**: `SAVEHIST=50000` to match `HISTSIZE` (oh-my-zsh saved only 10000 and the file had hit the cap).
* **atuin** owns Ctrl-R (SQLite history); fzf keeps Ctrl-T/Alt-C. Removing atuin from `mise/config.toml` switches it off.

See [shell setup](/tools/shell.md).

[^full]: Full install config
[^zshrc]: .zshrc
[^zsh-bench]: zsh-bench
