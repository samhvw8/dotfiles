---
type: Decision
title: "Per-directory link entries"
description: "Why home/ is linked with one entry per directory plus explicit top-level files instead of a single ~ entry."
tags: [decision, performance, mise]
status: stable
generated: { by: claude-code/claude-opus-5-5, at: 2026-09-24T02:00:00Z }
sources:
  - id: conf
    resource: https://github.com/samhvw8/dotfiles/blob/main/mise/conf.d/dotfiles.toml
    title: Shared dotfiles config
---

# Context (2026-09-17)

A single `"~" = { mode = "symlink-each", manifest = "git" }` entry worked in a
sandbox home but on the real machine `mise dot apply --dry-run` walked all of
`~` (including `~/workspace/*/node_modules`) and took minutes.

# Decision

Separate `symlink-each` entries for `~/.ccp`, `~/.config` and `~/.local/bin`
plus one `symlink` entry per top-level file.[^conf] Measured: each entry's
status takes about a second (`~/.ccp` with ~50k entries included).

# Consequence

A new top-level file or directory needs a config entry;
[`dot:check`](/tools/dot-tasks.md) and the pre-commit hook fail until it has
one. See [linking model](/architecture/linking-model.md).

[^conf]: Shared dotfiles config
