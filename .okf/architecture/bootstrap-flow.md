---
type: Process
title: "Bootstrap flow"
description: "The ordered phases of mise bootstrap in this repository and the hook scripts that run in them."
resource: https://github.com/samhvw8/dotfiles/blob/main/mise/conf.d/dotfiles.toml
tags: [mise, bootstrap, hooks]
status: stable
generated: { by: claude-code/claude-opus-5-5, at: 2026-09-24T02:00:00Z }
stale_after: 2027-03-24
sources:
  - id: conf
    resource: https://github.com/samhvw8/dotfiles/blob/main/mise/conf.d/dotfiles.toml
    title: Shared dotfiles config
  - id: full
    resource: https://github.com/samhvw8/dotfiles/blob/main/mise/config.toml
    title: Full install config
  - id: mise-bootstrap
    resource: https://mise.jdx.dev/bootstrap.html
    title: mise bootstrap documentation
---

# Phases

`mise bootstrap` runs these in order; every step skips work already done, so
it is safe to re-run.[^mise-bootstrap]

| # | Phase | What runs here |
|---|-------|----------------|
| 1 | pre-packages hook | `prepare-host.sh`: XDG directories; Homebrew and Rosetta 2 on macOS |
| 2 | packages | `brew`/`brew-cask` entries (macOS only via `os`), `apt` entries (skipped where apt is absent)[^conf] |
| 3 | post-packages hook | `finish-host.sh` on Debian/Ubuntu: deb-get (best-effort) and zsh as login shell (read from the account, not `$SHELL`) |
| 4 | repos | `~/.tmux/plugins/tpm` on full installs[^full] |
| 5 | dotfiles | Links and managed blocks ([linking model](/architecture/linking-model.md)) |
| 6 | tools | Everything in `[tools]` |
| 7 | post-tools hook (full) | `setup-ccp.sh` (creates `~/.claude` only if missing), `setup-claude-mcp.sh` (adds MCP servers found missing with `claude mcp get`), `setup-font-linux.sh` |

# Notes

* Hooks run on every bootstrap; each script guards its own work.
* `setup.sh` passes `--update` (package metadata refresh, which runs
  `apt-get update` under sudo) only when `mise bootstrap packages status
  --missing` reports something to install, so an up-to-date machine needs no
  sudo password.
* A failed phase stops the run; earlier phases stay applied. Fix the error
  and run `mise bootstrap` again.

[^mise-bootstrap]: mise bootstrap documentation
[^conf]: Shared dotfiles config
[^full]: Full install config
