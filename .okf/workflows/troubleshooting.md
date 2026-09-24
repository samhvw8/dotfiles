---
type: Playbook
title: "Troubleshooting"
description: "Symptoms seen with this setup and what to do about them."
tags: [troubleshooting]
status: stable
generated: { by: claude-code/claude-opus-5-5, at: 2026-09-24T02:00:00Z }
stale_after: 2027-03-24
sources:
  - id: setup
    resource: https://github.com/samhvw8/dotfiles/blob/master/setup.sh
    title: setup.sh
  - id: tmux
    resource: https://github.com/samhvw8/dotfiles/blob/master/home/.tmux.conf
    title: .tmux.conf
---

# Symptoms

| Symptom | Cause | Fix |
|---------|-------|-----|
| `mise dot status` shows a file as different | An app replaced the link with a regular file | Copy the file into `home/` if its changes matter, then `mise dot apply --force` |
| A file in `home/` never appears in `~` | Not committed, or a top-level file with no entry | `git add` it; add an entry; `mise run dot:check` |
| `mise dot status` takes minutes | Someone added a `"~"` entry | Use per-directory entries ([decision](/decisions/per-directory-link-entries.md)) |
| Config errors about `[dotfiles]` or `mise dot` | mise older than 2026.9.8 | `mise self-update`; `setup.sh` does this automatically[^setup] |
| Bootstrap asks for a sudo password | Packages missing, or deb-get/chsh on Linux | Run interactively; deb-get failures are only warnings |
| Claude Code Shift+Enter or notifications fail in tmux | Missing passthrough | `.tmux.conf` sets `allow-passthrough` and `extended-keys` (tmux ≥ 3.3)[^tmux] |
| Slow new shells | See [shell setup](/tools/shell.md) | Measure with `/usr/bin/time zsh -lic exit` and `zprof` |
| A bootstrap phase fails | That phase's error | Fix it and re-run `mise bootstrap`; finished phases are skipped |

[^setup]: setup.sh
[^tmux]: .tmux.conf
