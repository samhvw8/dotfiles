---
type: Reference
title: "Install variants"
description: "Differences between the full and minimal installs and how a machine selects one."
tags: [install, minimal, full]
status: stable
generated: { by: claude-code/claude-opus-5-5, at: 2026-09-24T02:00:00Z }
sources:
  - id: full
    resource: https://github.com/samhvw8/dotfiles/blob/master/mise/config.toml
    title: Full install config
  - id: minimal
    resource: https://github.com/samhvw8/dotfiles/blob/master/mise/minimal.toml
    title: Minimal install config
  - id: setup
    resource: https://github.com/samhvw8/dotfiles/blob/master/setup.sh
    title: setup.sh
---

# Selection

`setup.sh --minimal` links `~/.config/mise/config.toml` to `mise/minimal.toml`;
otherwise it links `mise/config.toml`.[^setup] Both load the shared
`mise/conf.d/dotfiles.toml`.

# Differences

| | Full | Minimal |
|---|------|---------|
| Tools | 70 tools incl. fzf, fd, bat, atuin, claude, ccp | jq, ripgrep, yq, node, python, uv[^minimal] |
| `~/.zshrc` | `home/.zshrc` | `home/.zshrc_minimal` |
| Extra apt packages | build-essential, python3-pip, gnupg, terminator, zip, … | none |
| tpm repo | yes | no |
| post-tools hooks | `~/.claude` via ccp, Claude MCP servers, Linux font[^full] | none |

The `.ccp` tree is linked on both variants.

[^setup]: setup.sh
[^minimal]: Minimal install config
[^full]: Full install config
