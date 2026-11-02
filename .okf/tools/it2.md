---
type: Reference
title: "it2 (iTerm2 CLI)"
description: "The pinned it2 CLI for sending text to and reading from iTerm2 sessions, how mise installs it, and how to bump the pin safely."
resource: https://github.com/mkusaka/it2
tags: [iterm2, agents, mise, cli]
status: stable
generated: { by: claude-code/claude-opus-5-5, at: 2026-11-02T15:30:00Z }
sources:
  - id: it2-repo
    resource: https://github.com/mkusaka/it2/tree/v0.2.3
    title: mkusaka/it2 at tag v0.2.3
  - id: it2-pypi
    resource: https://pypi.org/project/it2/0.2.3/
    title: it2 0.2.3 on PyPI
---

# What it is

`it2` drives iTerm2 through its Python API: list sessions, send text, read the
screen, monitor output. It replaces the old `~/.iterm2/it2api`, which needs
`python3.7` and no longer runs. Use it to pass messages between agent harnesses
(Claude Code, omp, opencode) that run in iTerm2 tabs.

# Install (mise)

`mise/config.toml` pins it:

```toml
"pipx:it2" = "0.2.3"
```

mise installs it with `uv tool install` (`pipx.uvx = true`). Run `mise install`
after a fresh clone. Do not use `latest`: this tool types into terminals where
agents run with auto-approved permissions, so every version gets a code review
first.

# Review record for 0.2.3

- Tag `v0.2.3` = commit `b00fb91c9b037b5092178718f54b2f78e0da60d6`.
- PyPI wheel sha256 `9257150fba2c0f4634580d5b00881ec71c43df81bdb373dd54a8b8b55a2b8bff`; its `it2/` files are identical to the tag's `src/it2/`.[^it2-pypi]
- No network calls or telemetry. The only subprocess is `/usr/bin/pbcopy`.[^it2-repo]
- Config `~/.it2rc.yaml` (or `$IT2_CONFIG_PATH`) loads with `yaml.safe_load`. Its aliases re-enter it2 commands and do not run a shell, but `it2 load` profiles type their `command` text into sessions.

# Caveats

- **Always pass `-s <UUID>`.** With no `-s`, or an empty one (`-s "$UNSET"`), text goes to the *focused* session, not the caller's. Use `${UUID:?}`.
- `-s all` and `--all` send to every session in every window.
- If `ITERM2_COOKIE` is set and a command fails, it2 runs the whole command again. Text may be sent twice. The error message then says "Not running inside iTerm2", even when the cause is different.
- `send` adds no Enter. `run` adds `\r`. A `\n` inside the text can submit early in an agent's text UI.
- `monitor output -f -p REGEX` never exits on a match. Poll `session read` to wait for a reply.
- iTerm2 3.7 also ships a native `it2` 1.0.0 in `/Applications/iTerm.app/Contents/Resources/utilities/`. The mise shim comes first in `PATH`. The bundled one has `session get-status`, which reports whether a Claude Code session is `working` or idle.

# Examples

```bash
it2 session list --json                       # find the UUID
it2 session send -s "${UUID:?}" "message"     # type, no Enter
it2 session send -s "${UUID:?}" $'\r'         # press Enter
it2 session read -s "${UUID:?}" -n 80         # read the visible screen
```

# Bumping the pin

1. Clone the repo and run `git diff v0.2.3 <new-tag> -- src pyproject.toml uv.lock`.
2. Check the diff for network calls, subprocess calls, and changes to how the target session is picked.
3. Diff the new PyPI wheel against the tag's `src/it2`.
4. Change the version in `mise/config.toml`, then update this file and `log.md`.
