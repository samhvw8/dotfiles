---
type: Playbook
title: "Keep ccp hub items"
description: "Which parts of ~/.ccp live in the repository and how to store hub items created by hand."
tags: [ccp, claude-code]
status: stable
generated: { by: claude-code/claude-opus-5-5, at: 2026-11-09T10:40:00Z }
sources:
  - id: check
    resource: https://github.com/samhvw8/dotfiles/blob/main/mise/scripts/dot-check.py
    title: dot-check.py
---

# What is stored

`home/.ccp` holds `ccp.toml` (the sources and what each installed), `ccp.lock` (the commit each
source is locked to; written by ccp next to the real `ccp.toml`, never edited by hand), the hub (skills, agents, hooks, rules, bundles,
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

# A source that ships a hook

`ccp install` links skills and agents from a source, but not its hooks. Add the hook as a hub item
with only a `hooks.json`, and call the source's own launcher from it. ccp copies a command as written
when it has no `${CLAUDE_PLUGIN_ROOT}`, so no wrapper script is needed.
Example: `hub/hooks/impeccable` runs `"$HOME/.ccp/hub/skills/impeccable/scripts/impeccable" hook`.
Keep `skills/impeccable/scripts/impeccable" hook` in that command: the engine matches it to report
the hook as wired. Without the match, `impeccable context` can write a second hook entry.

Do not run `npx impeccable install` or `impeccable hooks on` for this: they write hook entries outside ccp.
After `ccp source update` changes the pinned engine, run the launcher once with `engine-probe` and with
`npm:impeccable` off `PATH` to fill the pinned cache. Otherwise the launcher uses the older or newer engine on `PATH`.

# A rule for Claude Code only

Every file in a profile's `rules/` also reaches omp: `ccp omp sync` copies all of them into
`~/.omp/agent/RULES.md`, by a ccp decision. Hooks never go to omp or opencode, so a Claude-only
rule goes in a hook that prints the text as `additionalContext`. Example:
`hub/hooks/auto-mode-rules` (UserPromptSubmit, only while `permission_mode` is `auto`).

If `mise run dot:add` stops with "Permission denied" after it moved and staged the files, make
the links back by hand: a real folder under `~/.ccp/hub/hooks/<name>/` with one symlink per file
into `home/.ccp/hub/hooks/<name>/`, the same layout as the other hooks. Then
`ccp link default hooks/<name>`.

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
