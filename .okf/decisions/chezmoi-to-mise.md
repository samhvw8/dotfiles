---
type: Decision
title: "Replace chezmoi with mise dotfiles"
description: "Why the repository moved from chezmoi to mise [dotfiles] and bootstrap in repository mode, without mise's auto-sync."
tags: [decision, chezmoi, mise]
status: stable
generated: { by: claude-code/claude-opus-5-5, at: 2026-09-24T02:00:00Z }
sources:
  - id: mise-9-9
    resource: https://github.com/jdx/mise/releases/tag/v2026.9.9
    title: mise 2026.9.9 release notes
  - id: mise-dotfiles
    resource: https://mise.jdx.dev/dotfiles.html
    title: mise dotfiles documentation
---

# Context (2026-09-17)

The machine setup used chezmoi for files plus four `run_once` scripts, a
Brewfile and `setup.sh` for everything else, while mise already managed tools.
Brew packages added later were never installed on existing machines because
`brew bundle` ran only when Homebrew was freshly installed.

# Options

| Option | Verdict |
|--------|---------|
| Keep chezmoi | Two tools, imperative scripts, package drift |
| mise track + sync (watcher auto-commits and syncs) | Rejected: a background service to watch, a sync bug that propagated false deletions across machines was only fixed in 2026.9.9,[^mise-9-9] and sync pushes every checkpoint while this repository is public |
| **mise repository mode** (`[dotfiles]` links + `mise bootstrap`) | **Chosen**: one tool and config, declarative packages that converge, no daemon[^mise-dotfiles] |

# Consequences

* chezmoi, the `run_once` scripts and the Brewfile are gone; see [bootstrap flow](/architecture/bootstrap-flow.md).
* Files are links, so edits land in the repository; [dot tasks](/tools/dot-tasks.md) replace chezmoi's autoCommit.
* Rollback: the last chezmoi layout is tagged `chezmoi-final-20260917`.
* Other machines migrate with [migrate-from-chezmoi.sh](/workflows/migrate-from-chezmoi.md).

[^mise-9-9]: mise 2026.9.9 release notes
[^mise-dotfiles]: mise dotfiles documentation
