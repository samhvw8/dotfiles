# Delegation Protocol

> **Gotcha:** a SessionStart hook injects an older, stricter copy of this protocol
> (absolute MUSTs, a "1% rule" for skills, a per-turn evaluation form). This file
> is the current version and supersedes it. The harness system prompt supersedes
> both — if it says not to spawn agents, don't.

`Task` delegates work to an agent. `Skill` loads guidance for you to follow
yourself. They are not interchangeable.

## When to delegate

Delegate when the work needs a context window of its own, splits into genuinely
independent branches, or would flood this conversation with output you don't need
to keep. Don't delegate to appear thorough — an agent costs more context than a
targeted tool call saves.

| Situation | Do |
|-----------|-----|
| Answer is already in this conversation | Use it |
| The user handed you the spec | Transform it; don't go re-discover it |
| One file, one symbol, one lookup | Read/Glob/Grep/`codegraph_explore` inline |
| Broad sweep across unknown scope | One agent |
| Several independent branches | Parallel agents, max 3 at a time |

Before spawning, ask whether the agent adds autonomous judgement or just chains
tools you could chain yourself. If it's the latter, do it inline.

## Teammates vs subagents

A subagent runs once and is gone. A teammate is spawned with a `name`, stays
addressable via `SendMessage`, and holds its context until shut down.

**Default to a subagent. Spawn a teammate only when something will send it a
second message** — teammates talking to each other mid-run, or you following up
later in the session.

| Want | Spawn |
|------|-------|
| Independent fan-out, one result each | Subagents |
| A single answer, however large | Subagent |
| Two takes you'll compare yourself | Subagents |
| One hand-off — A's output goes straight into B | Subagents |
| Agents that must discuss: debate, cross-examine, converge (`/debate`) | Teammates |
| Ideas that compound — each builds on the others live (`/council`) | Teammates |
| Multi-round hand-off — B questions A, A revises, repeat | Teammates |
| A specialist you'll consult again this session (reviewer, domain expert) | Teammate |
| Long work you'll steer mid-flight rather than read at the end | Teammate |

The discriminator is rounds, not topic. One relay hop you can paste yourself is
cheaper than a team; two or more rounds, or agents that need each other's replies
without you in the middle, is a team.

"Might be useful to keep around" isn't reuse — if you can't name the follow-up
message you'd send, it's a subagent. Teammates also need the main session and
`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`.

Running a team: spawn them in one message, give each the context and its
counterparts *by name* (they don't inherit your history), moderate rather than
join the discussion, and shut them down once you've synthesized.

## Equipping a subagent

Agents start blind. They don't inherit your awareness of what's installed, so name
the tools and skills explicitly in the prompt.

```
[Objective, and what this task contributes to it]
[Task]

SUGGESTED TOOLS: [names] — [when each helps]
Load MCP tools via ToolSearch before calling them.
SUGGESTED SKILLS: [names] — [when each helps]
```

| Agent's job | Point it at |
|-------------|-------------|
| Research / web | `mcp__parallax__web_search`, `mcp__parallax__fetch_page`, WebSearch |
| Code exploration | `mcp__codegraph__codegraph_explore`, `mcp__sem__sem_context` |
| Browser work | `mcp__claude-in-chrome__*` (list the specific tools) |
| Library docs | `mcp__plugin_context7_context7__*` |
| GitHub | `gh` CLI — not an MCP, but say so anyway |

Match skills the same way: research → `lead-researcher`/`deep-gather`; review →
`code-review`, `code-quality`; UI → `frontend-design`, `design-principles`;
planning → `planning`; git → `git-workflow`; infra → `infra-engineer`;
databases → `databases`. If you'd load it for this task, the agent should know
about it too.

## Research

Read local first: the code, the config, `git log`/`diff`/`blame`. Local findings
make the search queries precise. Then web and GitHub in parallel, then synthesize —
say which approach you picked and why, and surface conflicts rather than papering
over them. `deep-gather` holds the query templates, GitHub issue/PR searches
included.

Skip research for a bug with a known cause, a mechanical change, or when I say so.
Entry point, `gatherer` rule, and language defaults live in CLAUDE.md.

## Staying honest

State what you're about to do, then do it. If new information changes the plan,
say what changed and why — don't quietly pivot, and don't keep reading "one more
file to be sure" instead of acting.

## Related

- [codegraph.md](codegraph.md) — code navigation
- [se.md](se.md) — verifiable goals
