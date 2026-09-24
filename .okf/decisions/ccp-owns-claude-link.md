---
type: Decision
title: "ccp owns ~/.claude"
description: "Why ~/.claude is not a mise [dotfiles] entry and is only created by ccp when missing."
tags: [decision, ccp, claude-code]
status: stable
generated: { by: claude-code/claude-opus-5-5, at: 2026-09-24T02:00:00Z }
sources:
  - id: ccp-hook
    resource: https://github.com/samhvw8/dotfiles/blob/master/mise/scripts/setup-ccp.sh
    title: setup-ccp.sh
---

# Context (2026-09-23)

`~/.claude` was first declared as a mise `symlink` entry. Two sandbox tests showed problems:

* `setup.sh` bootstraps with `--force-dotfiles`, and `--force` replaced an existing `~/.claude` **directory** with a link, deleting its contents; the backup step did not cover it.
* A plain `mise dot apply` repointed `~/.claude` back to `default` after `ccp use -g nextjs`, silently undoing a profile switch.

# Decision

`~/.claude` belongs to ccp. A full-install post-tools hook skips it when it
already exists (directory or link) and otherwise runs `ccp use -g
default`.[^ccp-hook] An existing directory is left for `ccp init`.

See [ccp hub items](/workflows/ccp-hub-items.md).

[^ccp-hook]: setup-ccp.sh
