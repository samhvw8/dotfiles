---
type: Playbook
title: "Change, add and sync dotfiles"
description: "Day-to-day loop: edit through the links, save with dot:save, push, and pull on other machines."
tags: [workflow, git, sync]
status: stable
generated: { by: claude-code/claude-opus-5-5, at: 2026-09-24T02:00:00Z }
sources:
  - id: readme
    resource: https://github.com/samhvw8/dotfiles/blob/master/README.md
    title: Repository README
---

# Change a dotfile

Edit it where it lives; the link means the change is already in `~/.dotfiles`.

```bash
mise run dot:save            # commit everything with an "Update <file>" message
git -C ~/.dotfiles push
```

Nothing commits or pushes automatically.[^readme]

# Add a dotfile

```bash
mise run dot:add ~/.config/foo/config.toml   # move into home/, git add, link back
mise run dot:save
```

A file directly in `home/` or a new top-level directory also needs an entry in
`mise/conf.d/dotfiles.toml` ([linking model](/architecture/linking-model.md)).

# Add a tool or package

* Tool for every machine: `mise use -g <tool>` (writes `mise/config.toml` through the link).
* Tool for this machine only: add it to `[tools]` in [machine-local config](/architecture/machine-local-config.md).
* Package: add `"brew:<name>" = { os = "macos" }` or `"apt:<name>" = "latest"` to
  `mise/conf.d/dotfiles.toml` (both installs) or `mise/config.toml` (full), then
  `mise bootstrap packages apply`.

# Update another machine

```bash
git -C ~/.dotfiles pull
mise install        # or `mise bootstrap` when packages, links or hooks changed
exec zsh
```

[^readme]: Repository README
