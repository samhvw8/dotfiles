# opencode environment

This session runs in **opencode**, not Claude Code. `~/.claude/CLAUDE.md` loads
through opencode's Claude Code compatibility. The rule files in `~/.claude/rules/`,
this file and the output style load through the `instructions` list in
`opencode.json`. Where they name a Claude Code tool, use the opencode one below.

## Delegation
- Spawn a subagent with the `task` tool; `subagent_type` is the agent name. It runs
  once and returns. There is no `Agent` or `SendMessage` tool here.
- A live member is still a harness-ops session: load the `agent-ops` skill.
- Agents are the files in `~/.config/opencode/agent/`: the active ccp profile's
  agents (written by `ccp opencode sync`, do not edit), the opencode-only subagents
  (`go-expert`, `cloudflare-workers-expert`, `mcp-server-engineer`,
  `run-cost-auditor`), and the built-ins `build`, `plan`, `explore`, `general`.
- Primary modes (the user switches with Tab; `task` cannot call them): `build`,
  `plan`, `review`, `research`, `debug`, `architect`. Suggest a switch when the
  work fits.

## Tools
The Tools table in `CLAUDE.md` is written for Claude Code and `omp`. Here:

| Job | Use |
|-----|-----|
| Files and shell | `bash`, `read`, `edit`, `glob`, `grep`, `list`, `todowrite` |
| Code questions | `codegraph explore "<names or question>"` through `bash` (`rules/codegraph.md`, "No MCP tool") |
| Web and social | `parallax call <tool> '<json>'` through `bash` (load the `parallax-cli` skill); `webfetch` for a plain page |
| GitHub | `gh` through `bash` |
| MCP | `rea` only. opencode names MCP tools `<server>_<tool>`; there is no `ToolSearch` |

Model IDs carry a provider prefix. Trust the IDs the harness shows.

## Skills
Loaded from `~/.claude/skills/`, `~/.agents/skills/` and
`~/.config/opencode/skills/`. Load one with the `skill` tool; the names are the
same as in Claude Code.

## Project knowledge
Claude Code hooks do not run here. If the project has an `.okf/index.md`, read it
before you work, and load the `okf` skill before you read or write the bundle.
The `surgical-changes` plugin adds a diff-discipline reminder after an edit to a
code file.
