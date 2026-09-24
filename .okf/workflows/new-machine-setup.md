---
type: Playbook
title: "Set up a new machine"
description: "Install mise, clone the repository and bootstrap a new macOS or Debian/Ubuntu machine."
resource: https://github.com/samhvw8/dotfiles/blob/master/setup.sh
tags: [setup, bootstrap]
status: stable
generated: { by: claude-code/claude-opus-5-5, at: 2026-09-24T02:00:00Z }
stale_after: 2027-03-24
sources:
  - id: setup
    resource: https://github.com/samhvw8/dotfiles/blob/master/setup.sh
    title: setup.sh
---

# Steps

```bash
curl -L https://raw.githubusercontent.com/samhvw8/dotfiles/master/setup.sh | bash            # full
curl -L https://raw.githubusercontent.com/samhvw8/dotfiles/master/setup.sh | bash -s -- --minimal
```

`setup.sh` then:[^setup]

1. Installs the Xcode Command Line Tools (macOS) or git and curl (Debian/Ubuntu), asking for sudo once.
2. Installs mise, or runs `mise self-update` when it is older than 2026.9.8.
3. Clones the repository to `~/.dotfiles` and enables `.githooks`.
4. Saves the git identity to [machine-local config](/architecture/machine-local-config.md).
5. Links `~/.config/mise/config.toml` for the chosen [variant](/architecture/install-variants.md).
6. Backs up every existing file it will replace to `~/.dotfiles-backup-<timestamp>/`.
7. Runs `mise bootstrap --force-dotfiles` ([bootstrap flow](/architecture/bootstrap-flow.md)).

# Afterwards

* Open a new shell (`exec zsh`).
* Full install: run `ccp bootstrap` once to fetch skills installed from ccp sources.
* Recreate `[env]` secrets in `config.local.toml`.
* A machine that still has chezmoi should use the [migration](/workflows/migrate-from-chezmoi.md) instead.

[^setup]: setup.sh
