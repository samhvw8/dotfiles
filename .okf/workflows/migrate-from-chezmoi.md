---
type: Playbook
title: "Migrate a machine still on chezmoi"
description: "Run migrate-from-chezmoi.sh to move a machine from the old chezmoi layout to mise dotfiles without losing local changes."
resource: https://github.com/samhvw8/dotfiles/blob/main/migrate-from-chezmoi.sh
tags: [migration, chezmoi]
status: stable
generated: { by: claude-code/claude-opus-5-5, at: 2026-09-24T02:00:00Z }
stale_after: 2027-03-24
sources:
  - id: migrate
    resource: https://github.com/samhvw8/dotfiles/blob/main/migrate-from-chezmoi.sh
    title: migrate-from-chezmoi.sh
---

# Run it

The chezmoi source directory is already a clone of this repository, so fetch
the script with its git. Do **not** `git pull` there: merging the new layout
into chezmoi's source would confuse chezmoi and hide the machine's changes.

```bash
git -C ~/.local/share/chezmoi fetch origin
bash <(git -C ~/.local/share/chezmoi show origin/master:migrate-from-chezmoi.sh) --dry-run
bash <(git -C ~/.local/share/chezmoi show origin/master:migrate-from-chezmoi.sh) --keep-local
```

# What it does

1. Backs up the chezmoi repository (bundle incl. unpushed commits and stashes), every managed file, `~/.gitconfig` and `~/.config/mise`.[^migrate]
2. Finds files this machine changed that the repository lacks: edited since the last `chezmoi apply`, or changed in unpushed chezmoi commits (compared against the merge-base with the remote).
3. Moves tools only this machine had into [machine-local config](/architecture/machine-local-config.md) so they stay on PATH.
4. With `--keep-local`, three-way merges those files into `~/.dotfiles` (uncommitted); a conflicting file keeps the repository version and the conflicted merge goes to the backup, never into a live link.
5. Removes chezmoi's plain `[user]`/`[include]` entries from `~/.gitconfig`, reuses chezmoi's git identity and minimal flag, and runs `setup.sh` ([new machine setup](/workflows/new-machine-setup.md)). On failure it restores `~/.gitconfig`.
6. Renames `~/.local/share/chezmoi` and `~/.config/chezmoi` to `*.migrated-<timestamp>`.

Re-running it on a migrated machine reports "already migrated".

# Afterwards

* Review `git -C ~/.dotfiles diff`, then `mise run dot:save` and push.
* Store hub items listed by `mise run dot:check` ([ccp hub items](/workflows/ccp-hub-items.md)).
* Merge any `*.merged` conflict files from the backup by hand.

# Examples

`me.ubuntu.home` (Ubuntu 24.04, 2026-09-24): mise updated 2026.4.24 → 2026.9.12,
10 machine-only tools kept (including CLIProxyAPI), `settings.json` conflicted
and kept the repository version, no sudo needed, all links applied.

[^migrate]: migrate-from-chezmoi.sh
