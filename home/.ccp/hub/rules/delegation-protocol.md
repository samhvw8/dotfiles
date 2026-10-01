# Delegation Protocol

`Task` delegates work to an agent. `Skill` loads guidance for you to follow
yourself. They are not interchangeable.

**Concurrency: at most 6 agents in flight, as a rolling pool — not waves.**
Subagents run in the background and notify on completion, so when one finishes,
launch the next queued job right away; never hold new work until a whole batch
drains. The cap counts agents running at once, not agents per message or total.

## Teammates vs subagents

A subagent runs once and is gone. A teammate is spawned with a `name`, stays
addressable via `SendMessage`, and holds its context until shut down.

**Default to a subagent. Spawn a teammate only when something will send it a
second message.** The discriminator is rounds, not topic: one relay hop you can
paste yourself is a subagent; two or more rounds, or agents that need each other's
replies without you in the middle, is a team.

| Teammates when | Example |
|----------------|---------|
| Agents must discuss, cross-examine, converge | `/debate` |
| Ideas compound live | `/council` |
| B questions A, A revises, repeat | multi-round hand-off |
| You'll consult it again this session, or steer it mid-flight | reviewer, long work |

"Might be useful to keep around" isn't reuse — if you can't name the follow-up
message you'd send, it's a subagent. Teammates need the main session and
`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`. Spawn them in one message, name their
counterparts in each prompt (they don't inherit your history), moderate rather
than join, and shut them down once you've synthesized.

## Equipping a subagent

Agents don't inherit your awareness of what's installed — name the tools and
skills in the prompt, and tell them to load MCP tools via ToolSearch first.

| Agent's job | Point it at |
|-------------|-------------|
| Research / web | `mcp__parallax__web_search`, `mcp__parallax__fetch_page`, WebSearch |
| Code exploration | `mcp__codegraph__codegraph_explore` |
| Browser work | `bsk` CLI via the `browser-skill` skill (not an MCP — say so) |
| Library docs | `context7` MCP |
| GitHub | `gh` CLI (not an MCP — say so) |

Skills the same way: research → `lead-researcher`/`deep-gather`; review →
`code-quality`, `/code-review`; UI → `impeccable`, `frontend-design`; git →
`git-workflow`.

## Research

Read local first — the code, the config, `git log`/`diff`/`blame` — so the search
queries are precise. Then web and GitHub in parallel, then synthesize: say which
approach you picked and why, and surface conflicts rather than papering over them.
Skip research for a bug with a known cause, a mechanical change, or when I say so.
