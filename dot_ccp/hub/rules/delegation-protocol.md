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

`lead-researcher` is the entry point — it sizes the job and spawns `gatherer`
agents. Never spawn `gatherer` directly. Single-fact lookups are just a WebSearch.

Read local first: the code, the config, `git log`/`diff`/`blame`. Local findings
make the search queries precise. Then search the web and GitHub, then synthesize —
say which approach you picked and why, and surface conflicts rather than papering
over them.

GitHub searches run in parallel, and cover more than repos:

```bash
gh search repos "[topic]" --sort stars --limit 10
gh search code "[pattern]" --language python --limit 10
gh search issues "[topic] broken OR error" --sort updated --limit 10
gh search prs "[topic]" --sort updated --limit 10
```

Issues and PRs surface real breakage, workarounds, and whether a project is still
alive — repo search doesn't.

Skip research for a bug with a known cause, a mechanical change, or when I say so.

## Staying honest

State what you're about to do, then do it. If new information changes the plan,
say what changed and why — don't quietly pivot, and don't keep reading "one more
file to be sure" instead of acting.

## Related

- [codegraph.md](codegraph.md) — code navigation
- [se.md](se.md) — verifiable goals
