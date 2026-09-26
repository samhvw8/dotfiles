---
type: Playbook
title: "Troubleshooting"
description: "Symptoms seen with this setup and what to do about them."
tags: [troubleshooting]
status: stable
generated: { by: claude-code/claude-opus-5-5, at: 2026-09-26T05:20:00Z }
stale_after: 2027-03-24
sources:
  - id: setup
    resource: https://github.com/samhvw8/dotfiles/blob/main/setup.sh
    title: setup.sh
  - id: tmux
    resource: https://github.com/samhvw8/dotfiles/blob/main/home/.tmux.conf
    title: .tmux.conf
  - id: full
    resource: https://github.com/samhvw8/dotfiles/blob/main/mise/config.toml
    title: Full install config
  - id: aube-trust
    resource: https://aube.jdx.dev/security#trust-policy
    title: aube trust policy
---

# Symptoms

| Symptom | Cause | Fix |
|---------|-------|-----|
| `mise dot status` shows a file as different | An app replaced the link with a regular file | Copy the file into `home/` if its changes matter, then `mise dot apply --force` |
| A file in `home/` never appears in `~` | Not committed, or a top-level file with no entry | `git add` it; add an entry; `mise run dot:check` |
| `mise dot status` takes minutes | Someone added a `"~"` entry | Use per-directory entries ([decision](/decisions/per-directory-link-entries.md)) |
| Config errors about `[dotfiles]` or `mise dot` | mise older than 2026.9.8 | `mise self-update`; `setup.sh` does this automatically[^setup] |
| Bootstrap asks for a sudo password | Packages missing, or deb-get/chsh on Linux | Run interactively; deb-get failures are only warnings |
| Claude Code Shift+Enter or notifications fail in tmux | Missing passthrough | `.tmux.conf` sets `allow-passthrough` and `extended-keys` (tmux ≥ 3.3)[^tmux] |
| Slow new shells | See [shell setup](/tools/shell.md) | Measure with `/usr/bin/time zsh -lic exit` and `zprof` |
| A bootstrap phase fails | That phase's error | Fix it and re-run `mise bootstrap`; finished phases are skipped |
| `mise up` fails an npm tool with `trust downgrade for <pkg>@<ver>` | aube's `no-downgrade` policy: an earlier release of a dependency had provenance, this one does not[^aube-trust] | Check the release first: `npm view <pkg>@<ver> _npmUser gitHead` should name the usual maintainer, and `gitHead` should match the repo's `v<ver>` tag. Then add `trust_policy_excludes = ["<pkg>@<ver>"]` to that tool's entry. Never exempt a bare package name. feynman carries one for `pi-subagents`, whose maintainer has published by hand since 0.37.2, so bump the version on each new pi-subagents release[^full] |
| `mise up` warns `ignored by minimum_release_age` or `502 Bad Gateway` | A release younger than 24h, or a GitHub API hiccup | Nothing to fix; the 502 falls back on its own. Tools with `minimum_release_age = "0s"` skip the delay |
| After `ccp unlink <profile> hooks/<name>`, every matching tool call reports a hook error (`No such file`) | `ccp unlink` removes the hook's symlink and its `profile.toml` entry but leaves its command in the profile's `settings.json` | Delete that hook's entry from `home/.ccp/profiles/<profile>/settings.json`; `grep <name>` there should come back empty |

[^setup]: setup.sh
[^tmux]: .tmux.conf
[^aube-trust]: aube trust policy
[^full]: Full install config
