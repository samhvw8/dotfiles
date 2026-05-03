# Project Identity

ccp (Claude Code Profile Manager) is a Go CLI tool for managing multiple Claude Code configurations via a central hub.

## Core Concepts (5 only)

| Concept | What |
|---------|------|
| **Hub** | Central directory of reusable components (skills, agents, hooks, rules, commands) |
| **Profile** | Named configuration referencing hub items + optional settings template |
| **Settings Template** | Complete settings.json stored in hub, referenced by name |
| **Source** | External repository providing hub items (GitHub, skills.sh) |
| **Activation** | How a profile becomes active (`ccp use -g` for global, env var for project) |

## Architecture

```
internal/
├── config/     # Path resolution, types, CcpConfig
├── errors/     # Custom error types
├── hub/        # Hub scanning, templates, item management
├── source/     # Source system (providers, registries, installer)
├── profile/    # Profile CRUD, manifest, settings generation, drift
├── symlink/    # Platform-specific symlink operations
├── migration/  # Format migrations, rollback
└── picker/     # Bubble Tea multi-select TUI

cmd/            # Cobra commands (one file per command/subcommand)
```

## What Was Removed (v0.28)

Do NOT re-introduce these concepts. They were deliberately removed for simplicity:

- **Engines** — two-layer runtime config. Profiles are flat now.
- **Contexts** — two-layer prompt/capability config. Profiles are flat now.
- **Setting fragments** — per-key YAML files. Replaced by settings templates.
- **Linked dirs** — CLAUDE.md @import parsing + dual symlinks. Users manage @imports manually.
- **DataConfig** — per-type sharing mode. All data dirs are always shared now.
- **Processor interfaces** — SettingsBuilder/TemplateProcessor/FragmentProcessor. Single `GenerateSettings()` function now.
