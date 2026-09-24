---
type: Reference
title: "Dotfile tasks"
description: "The dot:save, dot:pull, dot:add and dot:check mise tasks and the pre-commit hook that uses dot:check."
resource: https://github.com/samhvw8/dotfiles/blob/main/mise/conf.d/dotfiles.toml
tags: [mise, tasks, git]
status: stable
generated: { by: claude-code/claude-opus-5-5, at: 2026-09-24T09:40:00Z }
sources:
  - id: conf
    resource: https://github.com/samhvw8/dotfiles/blob/main/mise/conf.d/dotfiles.toml
    title: Shared dotfiles config
  - id: save
    resource: https://github.com/samhvw8/dotfiles/blob/main/mise/scripts/dot-save.sh
    title: dot-save.sh
  - id: pull
    resource: https://github.com/samhvw8/dotfiles/blob/main/mise/scripts/dot-pull.sh
    title: dot-pull.sh
  - id: add
    resource: https://github.com/samhvw8/dotfiles/blob/main/mise/scripts/dot-add.sh
    title: dot-add.sh
  - id: check
    resource: https://github.com/samhvw8/dotfiles/blob/main/mise/scripts/dot-check.py
    title: dot-check.py
---

# Tasks

Defined in `mise/conf.d/dotfiles.toml`, so they run from any directory.[^conf]

| Task | Does |
|------|------|
| `mise run dot:save` | Runs `dot:check`, `git add -A`, commits with a chezmoi-style message (`Update .zshrc Add …`); never pushes[^save] |
| `mise run dot:pull` | Pulls `main` from origin. On `main` it rebases local `dot:save` commits on top and autostashes uncommitted edits; on any other branch it fast-forwards `main` without switching, and refuses a non-fast-forward[^pull] |
| `mise run dot:add <path>…` | Moves each path from `~` into `home/`, `git add`s it, runs `mise dot apply`, then `dot:check`[^add] |
| `mise run dot:check` | **Fails** on committed `home/` files that no `[dotfiles]` entry links; **warns** about ccp hub items that are neither source-installed nor in the repository[^check] |

# Pre-commit hook

`.githooks/pre-commit` runs `dot:check`; `setup.sh` enables it with
`git config core.hooksPath .githooks`.

Related: [everyday changes](/workflows/everyday-changes.md),
[linking model](/architecture/linking-model.md).

[^conf]: Shared dotfiles config
[^save]: dot-save.sh
[^pull]: dot-pull.sh
[^add]: dot-add.sh
[^check]: dot-check.py
