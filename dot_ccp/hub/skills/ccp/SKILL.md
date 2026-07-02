---
name: ccp
description: "Use and manage ccp — the Claude Code Profile Manager. Use when: switching profiles, creating profiles, installing skills from sources, managing hub items, linking/unlinking items, setting up ccp for the first time, activating profiles per-project. Actions: switch, create, install, link, unlink, init, find, list, update profiles and hub items. Keywords: ccp use, ccp init, profile switch, hub link, source add, install skill, settings template, find skills, profile create. Casual triggers: 'switch to my dev profile', 'install a skill', 'set up ccp', 'find skills on github', 'which profile am I using', 'add this skill to my profile', 'how do I use ccp'."
---

# ccp — Claude Code Profile Manager

Manage multiple Claude Code configurations via a central hub of reusable components.

## Installation

Before using ccp commands, check if ccp is installed. If not, install it automatically:

```bash
# Check if ccp exists
command -v ccp >/dev/null 2>&1

# If not installed, install via mise (preferred)
# Step 1: Install mise if needed
if ! command -v mise >/dev/null 2>&1; then
  curl https://mise.jdx.dev/install.sh | sh
  # Add to shell (user may need to restart shell)
  eval "$(~/.local/bin/mise activate)"
fi

# Step 2: Install ccp via mise
mise use -g go@latest
go install github.com/samhoang/ccp@latest
```

After install, initialize: `ccp init`

## Core Concepts

| Concept | What |
|---------|------|
| **Hub** | Central directory of reusable items (~/.ccp/hub/) |
| **Profile** | Named config referencing hub items via symlinks |
| **Source** | External repo providing installable items |
| **Settings Template** | Complete settings.json stored in hub |
| **Activation** | How a profile becomes active (global symlink or env var) |

## Common Workflows

### Switch Profiles
```bash
ccp use dev -g              # Global: ~/.claude → ~/.ccp/profiles/dev
ccp use quickfix            # Project: updates mise.toml or .envrc
ccp which                   # Show active profile
```

### Find and Install Skills
```bash
ccp find <query>                          # Search skills.sh
ccp find -r github <query>               # Search GitHub
ccp install owner/repo                    # Add source + interactive install
ccp install owner/repo -a                 # Install all items
```

### Link Items to Profiles
```bash
ccp link skills/coding agents/reviewer    # Link to active profile
ccp link -i                               # Interactive picker (/ to fuzzy search, tab to toggle)
ccp unlink skills/coding                  # Remove from profile
```

### Sources
```bash
ccp source list                           # List installed sources
ccp source update                         # Update all sources
ccp source add owner/repo                 # Add a source
```

## Picker Controls (fzf-style)

| Key | Normal Mode | Search Mode (after /) |
|-----|-------------|----------------------|
| `↑`/`↓` | Navigate | Navigate |
| `Tab`/`Space` | Toggle item | Toggle item |
| `a` | Select all/none | — |
| `f` | Filter checked/unchecked | — |
| `Enter` | Confirm | Confirm |
| `Esc` | — | Clear search |

## Activation Modes

| Mode | Command | How It Works |
|------|---------|--------------|
| Global | `ccp use dev -g` | ~/.claude symlink → profile dir |
| Project | `ccp use dev` | Updates mise.toml/envrc |
| Inline | env var | `CLAUDE_CONFIG_DIR=~/.ccp/profiles/dev claude` |

## Tips

- `ccp install` (no args) syncs all sources — useful for new machines
- `ccp project add` copies (not symlinks) so projects are git-committable
- `ccp doctor` diagnoses broken symlinks, manifests, and hub structure
