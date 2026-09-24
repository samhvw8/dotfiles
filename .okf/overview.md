---
type: Reference
title: "Dotfiles overview"
description: "What this repository is and how its pieces fit together; start here."
resource: https://github.com/samhvw8/dotfiles
tags: [overview, dotfiles, mise]
status: stable
generated: { by: claude-code/claude-opus-5-5, at: 2026-09-24T02:00:00Z }
sources:
  - id: readme
    resource: https://github.com/samhvw8/dotfiles/blob/master/README.md
    title: Repository README
---

# Overview

Dotfiles and machine setup for macOS (Apple silicon) and Debian/Ubuntu Linux,
managed with [mise](https://mise.jdx.dev). A single `mise bootstrap` installs
system packages, clones repositories, links dotfiles and installs tools.[^readme]
Until September 2026 the repository was managed with chezmoi; see the
[migration decision](/decisions/chezmoi-to-mise.md).

# How the pieces fit

| Piece | Concept |
|-------|---------|
| Where everything lives | [Repository layout](/architecture/repository-layout.md) |
| How files reach `~` | [Linking model](/architecture/linking-model.md) |
| What `mise bootstrap` does, in order | [Bootstrap flow](/architecture/bootstrap-flow.md) |
| Full vs minimal machines | [Install variants](/architecture/install-variants.md) |
| Per-machine values that are never committed | [Machine-local config](/architecture/machine-local-config.md) |
| Shell and terminal setup | [Shell setup](/tools/shell.md) |
| `dot:save`, `dot:add`, `dot:check` | [Dotfile tasks](/tools/dot-tasks.md) |

# Common jobs

* [Set up a new machine](/workflows/new-machine-setup.md)
* [Change, add and sync dotfiles](/workflows/everyday-changes.md)
* [Migrate a machine still on chezmoi](/workflows/migrate-from-chezmoi.md)
* [Keep ccp hub items](/workflows/ccp-hub-items.md)
* [Troubleshooting](/workflows/troubleshooting.md)

[^readme]: Repository README
