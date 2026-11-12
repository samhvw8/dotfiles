---
type: Reference
title: "Parallax CLI"
description: "How omp and agy reach Parallax through the parallax binary instead of an MCP server, how mise installs it from dl.3cxo.work, and how to share it with a px_ key."
resource: https://github.com/samhvw8/parallax
tags: [parallax, omp, agy, mcp, cli, research]
status: stable
generated: { by: claude-code/claude-opus-5-5, at: 2026-11-12T16:20:00Z }
sources:
  - id: parallax-release
    resource: https://github.com/samhvw8/parallax/blob/main/scripts/release-cli.sh
    title: Parallax scripts/release-cli.sh
  - id: parallax-skill
    resource: /home/.ccp/hub/skills/parallax-cli/SKILL.md
    title: parallax-cli skill
  - id: parallax-shell-access
    resource: https://github.com/samhvw8/parallax/blob/main/cli/CLAUDE.md
    title: Parallax cli/CLAUDE.md, "Shell access"
---

# What it is

Parallax is the owner's retrieval toolset: web search, bot-protected page fetch,
forum and social search down to the comments, Reddit, X, trending, feeds and
paper full text. Each harness reaches it a different way:

| Harness | How it reaches Parallax |
|---|---|
| Claude Code | The claude.ai connector `https://mcp-parallax.3cxo.work/mcp`, tools `mcp__claude_ai_Parallax__<tool>`. No local server. |
| omp | `parallax call <tool> '<json>'` through `sh()` in `eval`, taught by the `parallax-cli` hub skill[^parallax-skill] |
| agy | The same commands with its shell tool; `command(parallax*)` is in the allow list of `home/.gemini/antigravity-cli/settings.json`, so headless runs work |

No harness runs `parallax mcp` any more. A stdio server cost one process per
session, and its tool list cost about 5,100 tokens on every turn.

# Commands

| Command | Does |
|---|---|
| `parallax tools` | The server's usage guide, then every tool with its parameters (`*` = required) |
| `parallax tools <name>` | One tool's description and JSON input schema |
| `parallax call <name> '<json>'` | Runs one tool; markdown on stdout. Exit 1: the tool's error (stderr). Exit 2: a wrong call (unknown tool, bad JSON, invalid arguments). JSON can also come on stdin |
| `parallax resources [uri]` | Lists or prints the catalogs the guide names, such as `parallax://social/platforms` |

Each run builds the real MCP server in memory and talks to it as a client, so
there is no second copy of any tool or schema. Calls are recorded in the
Parallax ledger (`~/.cache/parallax/ledger.jsonl`) like MCP calls.[^parallax-shell-access]

# Install and update

mise installs the released binary from the owner's download host:[^parallax-release]

```toml
"http:parallax" = { version = "2026.11.12", url = 'https://dl.3cxo.work/parallax/{{ version }}/parallax-{{ version }}-{{ os() }}-{{ arch() }}.zip' }
```

The line is in `mise/config.toml` (full install). Builds exist for macOS arm64,
Linux x64 and Linux arm64. A new release is `make release-cli` in
`~/workspace/parallax`, then a bump of the pinned version here: the host serves
only `.zip` files, so mise has no `latest` to discover and no checksum file to
read (one on the same host would add nothing over HTTPS).

The mise shim comes before `~/.local/bin` in `PATH`, so a dev build from
`make install` is shadowed; run it as `~/.local/bin/parallax` while testing.

The binary reads its keys from the environment: `PARALLAX_SCRAPER_URL`,
`PARALLAX_SCRAPER_TOKEN`, `TWITTER_API_KEY` and the others listed in
`mise/config.local.example.toml`.

# Sharing it

Someone without the repository installs the same mise line and sets
`PARALLAX_SCRAPER_URL=https://scraper.3cxo.work` and
`PARALLAX_SCRAPER_TOKEN=px_…`, a key the owner makes for them in the Parallax
console. Every scraper route the CLI calls is priced by default, so the key
works and its calls are metered. Without their own `TWITTER_API_KEY` they get no
X tools; Reddit runs from their own IP. The `parallax-cli` skill carries these
steps in its Setup section.[^parallax-skill]

# Known limits

- The `px_` key path was checked against the console's default prices, not with
  a live key (2026-11-12).
- Each `parallax call` is its own ledger session, so `parallax ledger` cannot
  link two calls as a refetch.
