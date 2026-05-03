---
name: ccp
description: "Use and manage ccp — the Claude Code Profile Manager. Use when: switching profiles, creating profiles, installing skills from sources, managing hub items, linking/unlinking items, setting up ccp for the first time, activating profiles per-project. Actions: switch, create, install, link, unlink, init, find, list, update profiles and hub items. Keywords: ccp use, ccp init, profile switch, hub link, source add, install skill, settings template, find skills, profile create. Casual triggers: 'switch to my dev profile', 'install a skill', 'set up ccp', 'find skills on github', 'which profile am I using', 'add this skill to my profile', 'how do I use ccp'."
---

# ccp — Claude Code Profile Manager

Manage multiple Claude Code configurations via a central hub of reusable components.

## Core Concepts

| Concept | What |
|---------|------|
| **Hub** | Central directory of reusable items (~/.ccp/hub/) |
| **Profile** | Named config referencing hub items via symlinks |
| **Source** | External repo providing installable items |
| **Settings Template** | Complete settings.json stored in hub |
| **Activation** | How a profile becomes active (global symlink or env var) |

## Common Workflows

### First-Time Setup
```bash
ccp init                    # Migrate existing ~/.claude → hub + default profile
```

### Switch Profiles
```bash
ccp use dev -g              # Global: ~/.claude → ~/.ccp/profiles/dev
ccp use quickfix            # Project: updates mise.toml or .envrc
ccp which                   # Show active profile
```

### Create a Profile
```bash
ccp profile create myprofile              # Empty profile
ccp profile create myprofile --from dev   # Copy from existing
ccp profile create myprofile -i           # Interactive hub picker
```

### Find and Install Skills
```bash
ccp find <query>                          # Search skills.sh registry
ccp find -r github <query>               # Search GitHub repos
ccp install owner/repo                    # Add source + interactive install
ccp install owner/repo skills/name        # Install specific skill
ccp install owner/repo -a                 # Install all items
```

### Manage Hub Items
```bash
ccp hub list                              # List all hub items
ccp hub add skills/my-skill               # Add item to hub manually
ccp hub remove skills/old-skill           # Remove from hub
```

### Link Items to Profiles
```bash
ccp link skills/coding agents/reviewer    # Link hub items to active profile
ccp link -i                               # Interactive picker
ccp unlink skills/coding                  # Remove from profile
```

### Project Setup (for teams)
```bash
ccp project add skills/coding             # Copy hub items into .claude/
ccp project install owner/repo -a         # Install from source into .claude/
ccp project list                          # Show project's .claude/ items
```

### Sources
```bash
ccp source list                           # List installed sources
ccp source add owner/repo                 # Add a source
ccp source update                         # Update all sources
ccp source remove owner/repo              # Remove a source
```

### Settings Templates
```bash
ccp template list                         # List available templates
ccp template show opus-full               # Display template JSON
ccp profile edit dev --template minimal   # Change profile's template
```

## Activation Modes

| Mode | Command | How It Works |
|------|---------|--------------|
| Global | `ccp use dev -g` | ~/.claude symlink → profile dir |
| Project | `ccp use dev` | Updates mise.toml/envrc with CLAUDE_CONFIG_DIR |
| Inline | env var | `CLAUDE_CONFIG_DIR=~/.ccp/profiles/dev claude` |

## Hub Item Types

Skills, agents, commands, rules, hooks, settings-templates — all live in `~/.ccp/hub/<type>/` and get symlinked into profiles.

## Tips

- Different terminals can use different profiles via env override
- `ccp install` (no args) syncs all sources from ccp.toml — useful for new machines
- `ccp project add` copies (not symlinks) so projects are self-contained and git-committable
- Hub items are single-source-of-truth: edit once, all linked profiles update
