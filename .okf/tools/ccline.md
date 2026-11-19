---
type: Reference
title: "ccline (Claude Code status line)"
description: "The pinned ccline (CCometixLine) status line: how mise installs it, where its config lives, what each line shows, the risk review, and how to bump the pin."
resource: https://github.com/Haleclipse/CCometixLine
tags: [claude-code, statusline, mise, cli]
status: stable
generated: { by: claude-code/claude-opus-5-5, at: 2026-11-05T08:30:00Z }
sources:
  - id: ccline-repo
    resource: https://github.com/Haleclipse/CCometixLine/tree/v2.0.1
    title: Haleclipse/CCometixLine at tag v2.0.1
  - id: ccline-npm
    resource: https://www.npmjs.com/package/@cometix/ccline-darwin-arm64/v/2.0.1
    title: "@cometix/ccline-darwin-arm64 2.0.1 on npm (SLSA provenance)"
---

# What it is

`ccline` is a Rust status line for Claude Code. It replaced the claude-hud
plugin on 2026-11-05 because it draws each rate-limit window as a two-row
**pace bar**: the top half of each cell is quota used, the bottom half is
time elapsed in the window. The dark bottom cells on the right are the time
left until reset.[^ccline-repo] It renders in about 13 ms; claude-hud took
about 89 ms.

# Install (mise)

`mise/config.toml` pins `"github:Haleclipse/CCometixLine" = "2.0.1"`. The
`github:` backend downloads the release binary, so there is no Node launcher
and no npm `postinstall`.

**Local fork build (this Mac).** The `{left_bar}` / `{left_bar:N}` placeholder
(a bar of the window time already passed) is not in 2.0.1. It is upstream PR
[#146](https://github.com/Haleclipse/CCometixLine/pull/146) (branch
`feat/quota-left-bar` on `samhvw8/CCometixLine`). Until it merges, this Mac runs
branch `samhv/reset-bar` of the clone at `~/workspace/oss/CCometixLine`: the PR
commit plus a `mise.toml`. After the merge and a release, bump the pin and
remove the `path:` lines. Its
`mise run install` builds `dist/ccline`. Two git-ignored files point mise at
that folder with a `path:` version: `~/.config/mise/config.local.toml`, and
`~/.dotfiles/mise.local.toml` (inside `~/.dotfiles`, mise reads
`mise/config.toml` as a project config, which outranks the global local file).
Other machines keep 2.0.1; 2.0.1 drops an optional `[...]` group that holds
`{left_bar}`, so the shared config still renders there, without the bar and
the "resets in" text. Remove both `path:` lines to return to the release.

`statusLine` in `home/.ccp/profiles/default/settings.json` runs:

```
CCLINE_HOME=$HOME/.config/ccline $HOME/.local/share/mise/shims/ccline
```

- It calls the mise shim, so mise picks the pinned version on every run.
  The shim costs about 57 ms more per refresh (67 ms against 10 ms, measured
  2026-11-19). It replaced mise's `global` link because mise removed that
  link from every tool twice on 2026-11-19, and the status line went blank
  in every profile each time.
- `CCLINE_HOME` moves ccline off its default `~/.claude/ccline`, because
  [ccp owns `~/.claude`](/decisions/ccp-owns-claude-link.md).

# Config

`home/.config/ccline/config.toml`, linked to `~/.config/ccline/config.toml` by
the `~/.config` `symlink-each` entry ([linking model](/architecture/linking-model.md)).
ccline writes its state (`state/`) next to it; that stays machine-local.

| Line | Metrics |
|---|---|
| 1 | `model`, `output_style`, `session_name`; right: `duration`, `cc_version` |
| 2 | `dir`, `repo`, `git`, `worktree`, `pr`, `lines` |
| 3 | `context` bar with tokens, `context.trend`, `context.to_compact`, `cache`; right: `cost`, `cost.rate`, `cost.today` |
| 4 | `quota.5h` and `quota.7d` pace bars with `resets in {left} at {reset}`, then `quota.eta` |

- `[update] check = false`: upgrades go through mise, so there is no background
  `curl` to npm, npmmirror or GitHub.
- **Saving from the TUI** (`ccline -c`) writes a temp file and renames it over
  the target, which replaces the symlink with a plain file. Copy it back to
  `home/.config/ccline/config.toml`, then run `mise dot apply`.
- The **companion mod** (`ccline mod install`) is not installed. It feeds
  `timing.*`, `activity.*` and `context.breakdown`, but it runs inside Claude
  Code and wraps every tool call and model response.

# Risk review (2.0.1)

Reviewed 2026-11-05 against tag v2.0.1:[^ccline-repo]

- No `unsafe`, 10 direct crates, no HTTP library. OSV found one advisory in 170
  crates (`anyhow` RUSTSEC-2026-0190), not reachable from ccline's code.
- No credential, keychain or token reads; quota data comes from Claude Code's
  stdin JSON.
- Commands it runs: `git`, the update-check `curl` (off here), `claude plugin`
  for the mod (opt-in), and `sh -c` for `cmd` metrics written in the config.
- Writes to `settings.json` show a diff, keep a backup and write atomically.
- One person writes almost all commits and is the only npm maintainer. The
  repo has no LICENSE file, though the npm package says MIT.
- The mise-installed binary is byte-identical to the npm package, whose
  registry signature and provenance pass `npm audit signatures`.[^ccline-npm]

# Bumping the pin

1. Read the release notes and the diff from the pinned tag, above all `mod/`,
   `src/state/update.rs` and any new `Command::new`.
2. Check that the GitHub asset matches the npm platform package
   (`shasum -a 256`) and that `npm audit signatures` passes for it.
3. Change the version in `mise/config.toml`, run `mise install`, then render a
   sample payload through the `statusLine` command.

[^ccline-repo]: Haleclipse/CCometixLine at tag v2.0.1: `src/metrics/usage.rs`, `src/widgets/mod.rs`, `src/state/update.rs`, `src/companion.rs`, `src/paths.rs`.
[^ccline-npm]: `@cometix/ccline-darwin-arm64@2.0.1`, verified with `npm audit signatures` on 2026-11-05.
