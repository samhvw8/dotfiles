---
type: Reference
title: "Dotfile tasks"
description: "The dot:* mise tasks, their chezmoi equivalents, and the pre-commit hook that uses dot:check."
resource: https://github.com/samhvw8/dotfiles/blob/main/mise/conf.d/dotfiles.toml
tags: [mise, tasks, git]
status: stable
generated: { by: claude-code/claude-opus-5-5, at: 2026-09-24T11:00:00Z }
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
  - id: rm
    resource: https://github.com/samhvw8/dotfiles/blob/main/mise/scripts/dot-rm.py
    title: dot-rm.py
  - id: status
    resource: https://github.com/samhvw8/dotfiles/blob/main/mise/scripts/dot-status.py
    title: dot-status.py
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
| `mise run dot:cd` | Starts `$SHELL` in `~/.dotfiles`; `exit` returns to the previous shell. A task runs in a child process and cannot change the calling shell's directory, so it opens a nested shell instead[^conf] |
| `mise run dot:add <path>…` | Moves each path from `~` into `home/`, `git add`s it, runs `mise dot apply`, then `dot:check`[^add] |
| `mise run dot:status` | Lists dotfiles whose `mise dot status` state is not `applied`, then `git status --short`; prints nothing when both are clean[^status] |
| `mise run dot:diff [git args]` | `mise dot diff`, then `git diff HEAD` in the repository; extra arguments go to git[^conf] |
| `mise run dot:update` | `dot:pull`, `mise dot apply --yes`, then `dot:check`: files added on another machine get linked[^conf] |
| `mise run dot:rm <path>…` | Stops managing each path: links in `~` that point into `home/<path>` become real copies, `home/<path>` is deleted and the deletion staged, and a `[dotfiles]` entry named `~/<path>` is removed[^rm] |
| `mise run dot:destroy <path>…` | Like `dot:rm`, but deletes the links from `~` instead of copying them. It asks first, and needs `--yes` without a terminal. Files in `~` that are not links into the repository are kept[^rm] |
| `mise run dot:check` | **Fails** on committed `home/` files that no `[dotfiles]` entry links; **warns** about ccp hub items that are neither source-installed nor in the repository[^check] |

A path may be given as it lives in `~` or in `home/`; `-n` previews either
removal. Both refuse `~/.zshrc` and the mise config links, which each install
declares separately, and whole `symlink-each` roots such as `~/.config`.

# chezmoi equivalents

| chezmoi | Here |
|---------|------|
| `add` / `re-add` | `dot:add`; edits need no re-add because `~` links into the repository |
| `status` | `dot:status` |
| `diff` | `dot:diff` |
| `apply` | `mise dot apply` |
| `update` | `dot:update` |
| `forget` | `dot:rm` |
| `destroy` / `remove` | `dot:destroy` |
| `cd` | `dot:cd` |
| `edit` | `mise dot edit`, or edit through the link |
| `git …` | `git -C ~/.dotfiles …` |

# Pre-commit hook

`.githooks/pre-commit` runs `dot:check`; `setup.sh` enables it with
`git config core.hooksPath .githooks`.

Related: [everyday changes](/workflows/everyday-changes.md),
[linking model](/architecture/linking-model.md).

[^conf]: Shared dotfiles config
[^save]: dot-save.sh
[^pull]: dot-pull.sh
[^rm]: dot-rm.py
[^status]: dot-status.py
[^add]: dot-add.sh
[^check]: dot-check.py
