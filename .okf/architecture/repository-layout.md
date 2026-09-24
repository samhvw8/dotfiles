---
type: Reference
title: "Repository layout"
description: "The directories and files of the dotfiles repository and what each is for."
resource: https://github.com/samhvw8/dotfiles
tags: [layout, structure]
status: stable
generated: { by: claude-code/claude-opus-5-5, at: 2026-09-24T02:00:00Z }
sources:
  - id: readme
    resource: https://github.com/samhvw8/dotfiles/blob/master/README.md
    title: Repository README
---

# Layout

The repository is cloned to `~/.dotfiles` on every machine.

| Path | Purpose |
|------|---------|
| `home/` | Dotfiles, stored under their real names and linked to the same paths under `~` ([linking model](/architecture/linking-model.md)) |
| `mise/config.toml` | Full install: tools, full-only dotfiles, packages, repos, hooks |
| `mise/minimal.toml` | Minimal install: smaller tool set and the minimal `.zshrc` |
| `mise/conf.d/dotfiles.toml` | Dotfiles, packages, hooks and `dot:*` tasks shared by both installs |
| `mise/scripts/` | Bootstrap hook scripts and the `dot:*` task scripts |
| `mise/snippets/` | Templated blocks managed inside files such as `~/.gitconfig` |
| `setup.sh` | New-machine installer ([new machine setup](/workflows/new-machine-setup.md)) |
| `migrate-from-chezmoi.sh` | One-time migration for machines still on chezmoi ([migration](/workflows/migrate-from-chezmoi.md)) |
| `.githooks/pre-commit` | Runs `dot:check` before commits ([dotfile tasks](/tools/dot-tasks.md)) |
| `.okf/` | This knowledge bundle |

`~/.config/mise/config.toml` is a link to `mise/config.toml` or
`mise/minimal.toml`, which is what makes a machine
[full or minimal](/architecture/install-variants.md).[^readme]

[^readme]: Repository README
