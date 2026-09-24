---
type: Playbook
title: "Keep ccp hub items"
description: "Which parts of ~/.ccp live in the repository and how to store hub items created by hand."
tags: [ccp, claude-code]
status: stable
generated: { by: claude-code/claude-opus-5-5, at: 2026-09-24T02:00:00Z }
sources:
  - id: check
    resource: https://github.com/samhvw8/dotfiles/blob/main/mise/scripts/dot-check.py
    title: dot-check.py
---

# What is stored

`home/.ccp` holds `ccp.toml`, the hub (skills, agents, hooks, rules, bundles)
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

[^check]: dot-check.py
