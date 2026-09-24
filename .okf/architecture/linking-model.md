---
type: Design
title: "Linking model"
description: "How files in home/ become links under ~, and which files are managed differently."
resource: https://github.com/samhvw8/dotfiles/blob/master/mise/conf.d/dotfiles.toml
tags: [mise, dotfiles, symlinks]
status: stable
generated: { by: claude-code/claude-opus-5-5, at: 2026-09-24T02:00:00Z }
stale_after: 2027-03-24
sources:
  - id: conf
    resource: https://github.com/samhvw8/dotfiles/blob/master/mise/conf.d/dotfiles.toml
    title: Shared dotfiles config
  - id: mise-dotfiles
    resource: https://mise.jdx.dev/dotfiles.html
    title: mise dotfiles documentation
---

# Rules

| Target | How it is managed |
|--------|-------------------|
| Files under `home/.ccp`, `home/.config`, `home/.local/bin` | One `symlink-each` entry per directory with `manifest = "git"`: every file committed there is linked one by one; other files in those directories are left alone[^conf] |
| Files directly in `home/` | One explicit `symlink` entry each in `mise/conf.d/dotfiles.toml` |
| `~/.zshrc` | Declared per install: `.zshrc` (full) or `.zshrc_minimal` (minimal) |
| `~/.config/mise/config.toml`, `conf.d/dotfiles.toml` | Self-links into the repository |
| `~/.gitconfig` | Not linked (git and `gh` write to it); mise keeps two marked blocks inside it: identity from `[vars]` and an include of `~/.base.gitconfig` |
| `~/.claude` | Owned by ccp, not mise ([decision](/decisions/ccp-owns-claude-link.md)) |

Only committed files are linked: `manifest = "git"` reads `git ls-files`, so a
new file must be `git add`ed before `mise dot apply` sees it.[^mise-dotfiles]

# Why not one `"~"` entry

A single `symlink-each` entry for `~` makes mise walk the whole home directory
on every status or apply, which took minutes here. See
[per-directory link entries](/decisions/per-directory-link-entries.md). The
cost is that a new file directly in `home/` needs its own entry;
[`dot:check`](/tools/dot-tasks.md) fails until it has one.

# Behaviour to know

* Edits through a link land directly in the repository, uncommitted.
* An application that saves by replacing the file turns the link into a
  regular file; `mise dot status` then reports it as different. Claude Code
  writes through the links (no link replaced in the first week).
* Removing an entry leaves the existing link in place; run
  `mise dot unapply <target>` first to remove it.

[^conf]: Shared dotfiles config
[^mise-dotfiles]: mise dotfiles documentation
