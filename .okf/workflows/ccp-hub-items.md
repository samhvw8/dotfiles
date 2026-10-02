---
type: Playbook
title: "Keep ccp hub items"
description: "Which parts of ~/.ccp live in the repository and how to store hub items created by hand."
tags: [ccp, claude-code]
status: stable
generated: { by: claude-code/claude-opus-5-5, at: 2026-10-02T09:00:00Z }
sources:
  - id: check
    resource: https://github.com/samhvw8/dotfiles/blob/main/mise/scripts/dot-check.py
    title: dot-check.py
---

# What is stored

`home/.ccp` holds `ccp.toml`, the hub (skills, agents, hooks, rules, bundles,
output styles)
and profile files (`settings.json`, `profile.toml`, `CLAUDE.md`). Not stored:
skills installed from ccp sources (`~/.ccp/sources`, `~/.ccp/store`; `ccp
bootstrap` fetches them again) and Claude Code runtime data.

# Store an item you created by hand

`mise run dot:check` lists hub items that are neither source-installed nor in
the repository.[^check]

```bash
mise run dot:add ~/.ccp/hub/skills/my-skill
mise run dot:save
```

`ccp bootstrap --push` wrote to chezmoi and no longer applies.

# `~/.claude`

ccp owns the `~/.claude` link (`ccp use -g <profile>`); bootstrap only creates
it when missing. See [the decision](/decisions/ccp-owns-claude-link.md).

# Output styles

ccp has no output-style item type. Styles live in `hub/output-styles/`, and
`~/.claude/output-styles` is a symlink to that folder, made by hand:

```bash
ln -s ~/.ccp/hub/output-styles ~/.claude/output-styles
```

Bootstrap does not make this link. Make it again on a new machine. The default
style is the `outputStyle` key in the profile's `settings-fragment.json`. Put it
in `settings.json` too, so it works before ccp rebuilds that file. The default
profile uses `STE Lite` (`hub/output-styles/ste-lite.md`).

[^check]: dot-check.py
