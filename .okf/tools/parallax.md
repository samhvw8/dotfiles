---
type: Reference
title: "Parallax CLI"
description: "How omp and agy reach Parallax through the parallax binary instead of an MCP server, how the dotfiles build and update it, and why it is not a mise tool."
resource: https://github.com/samhvw8/parallax
tags: [parallax, omp, agy, mcp, cli, research]
status: stable
generated: { by: claude-code/claude-opus-5-5, at: 2026-11-12T15:45:00Z }
sources:
  - id: parallax-script
    resource: /mise/scripts/parallax.sh
    title: mise/scripts/parallax.sh
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

`mise run parallax:install` (alias `parallax:update`, full install only) runs
`mise/scripts/parallax.sh`:[^parallax-script]

1. Without `~/workspace/parallax` it clones `samhvw8/parallax` with `gh`, and
   fails with a message when `gh` has no token.
2. With a checkout, it fast-forwards only a clean `main`. On another branch, or
   with uncommitted changes, it builds the checkout as it is and says so,
   because another agent may be working there.
3. It builds into `~/.local/bin/parallax` (`make -C cli install` on macOS, which
   also signs the binary; `go build` on Linux), then runs `parallax tools` as a
   check.

The full install's post-tools hook runs the task only when `parallax` is
missing, and prints a warning instead of stopping the bootstrap when it fails.
`dot:up` rebuilds it on machines that already have it. See
[bootstrap flow](/architecture/bootstrap-flow.md) and [dot tasks](/tools/dot-tasks.md).

The binary reads its keys from the environment: `PARALLAX_SCRAPER_URL`,
`PARALLAX_SCRAPER_TOKEN`, `TWITTER_API_KEY` and the others listed in
`mise/config.local.example.toml`.

# Why it is not a mise tool

The repository is private and publishes no releases, so the `github:` backend
has nothing to download. Its Go module path (`github.com/samhv/parallax`, in
`cli/`) does not match the repository, so the `go:` backend cannot fetch it.

# Known limits

- A clone gets GitHub's `main`. Commands not pushed there yet (on 2026-11-12,
  `tools`, `call` and `resources` were still uncommitted) are missing from a
  new machine's build, and the final `parallax tools` check fails.
- Each `parallax call` is its own ledger session, so `parallax ledger` cannot
  link two calls as a refetch.
