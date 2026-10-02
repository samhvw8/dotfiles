---
type: Reference
title: "Machine-local config"
description: "~/.config/mise/config.local.toml: per-machine values that are never committed."
tags: [mise, secrets, config]
status: stable
generated: { by: claude-code/claude-opus-5-5, at: 2026-10-02T03:10:00Z }
sources:
  - id: setup
    resource: https://github.com/samhvw8/dotfiles/blob/main/setup.sh
    title: setup.sh
  - id: migrate
    resource: https://github.com/samhvw8/dotfiles/blob/main/migrate-from-chezmoi.sh
    title: migrate-from-chezmoi.sh
  - id: local-config
    resource: https://github.com/samhvw8/dotfiles/blob/main/mise/scripts/local-config.sh
    title: mise/scripts/local-config.sh
  - id: cf-ai-token
    resource: https://github.com/samhvw8/dotfiles/blob/main/mise/scripts/cf-ai-token.sh
    title: mise/scripts/cf-ai-token.sh
---

# What goes there

`~/.config/mise/config.local.toml` is loaded after the global config and is
never committed.

| Table | Holds | Written by |
|-------|-------|-----------|
| `[vars]` | `git_name`, `git_email` for the `~/.gitconfig` identity block | `setup.sh` (prompt or `DOTFILES_GIT_NAME`/`DOTFILES_GIT_EMAIL`)[^setup] |
| `[env]` | Private environment variables such as API keys | you, starting from the scaffold `dot:local` writes[^local-config] |
| `[tools]` | Tools only this machine uses | `migrate-from-chezmoi.sh` for tools not in the repository config[^migrate], or you |

# The template and `dot:local`

`mise/config.local.example.toml` is committed and lists every `[env]` key this
setup uses, each commented out with no value, grouped by the tool that reads it.
`mise/scripts/local-config.sh` (`mise run dot:local`) keeps the local file in
line with it:[^local-config]

| Local file | What happens |
|------------|--------------|
| missing | the template is copied there, mode 600 |
| present | each template key it lacks is inserted, commented out, under its `[env]` header (or a new `[env]` table); values are never touched |

Then it lists the keys still to fill in: a key counts as filled only when its
line is uncommented. setup.sh runs it before the git identity step, and
`dot:update` runs it after `mise dot apply`, so a key added to the template on
one machine shows up, commented, on the others after a pull. It is plain bash,
because setup.sh runs it before any tool is installed.

Keep a line commented until it has a value: an empty string still sets the
variable, and a template such as `{{ exec(command='cat ~/creds/…') }}` makes
every mise call fail when the file it reads is missing.

An `exec` command must never run a tool through a mise shim: the shim re-enters
mise, which evaluates the same `[env]` and runs the command again, and every mise
call hangs. Call tools by their install path, as `mise/scripts/cf-ai-token.sh`
does for `cf` and node. A slow command (that script refreshes an OAuth login)
takes `cache_key` and `cache_duration`, so mise runs it at most once per window.

# Caveats

* A new machine gets `[vars]` and the commented `[env]` scaffold automatically;
  the values are yours to fill in.
* The values are plaintext; keep backups of this file private.
* mise's GitHub token is not stored here: `settings.github.credential_command
  = "gh auth token"` fetches it only when mise calls the GitHub API
  ([zsh startup decision](/decisions/zsh-startup.md)).

[^setup]: setup.sh
[^migrate]: migrate-from-chezmoi.sh
[^local-config]: mise/scripts/local-config.sh
