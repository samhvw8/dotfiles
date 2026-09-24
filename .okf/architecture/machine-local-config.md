---
type: Reference
title: "Machine-local config"
description: "~/.config/mise/config.local.toml: per-machine values that are never committed."
tags: [mise, secrets, config]
status: stable
generated: { by: claude-code/claude-opus-5-5, at: 2026-09-24T02:00:00Z }
sources:
  - id: setup
    resource: https://github.com/samhvw8/dotfiles/blob/master/setup.sh
    title: setup.sh
  - id: migrate
    resource: https://github.com/samhvw8/dotfiles/blob/master/migrate-from-chezmoi.sh
    title: migrate-from-chezmoi.sh
---

# What goes there

`~/.config/mise/config.local.toml` is loaded after the global config and is
never committed.

| Table | Holds | Written by |
|-------|-------|-----------|
| `[vars]` | `git_name`, `git_email` for the `~/.gitconfig` identity block | `setup.sh` (prompt or `DOTFILES_GIT_NAME`/`DOTFILES_GIT_EMAIL`)[^setup] |
| `[env]` | Private environment variables such as API keys | you |
| `[tools]` | Tools only this machine uses | `migrate-from-chezmoi.sh` for tools not in the repository config[^migrate], or you |

# Caveats

* A new machine gets only `[vars]` automatically; recreate `[env]` by hand.
* The values are plaintext; keep backups of this file private.
* mise's GitHub token is not stored here: `settings.github.credential_command
  = "gh auth token"` fetches it only when mise calls the GitHub API
  ([zsh startup decision](/decisions/zsh-startup.md)).

[^setup]: setup.sh
[^migrate]: migrate-from-chezmoi.sh
