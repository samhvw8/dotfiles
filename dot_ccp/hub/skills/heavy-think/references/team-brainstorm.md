# Team Brainstorm

Collaborative ideation using **agent teams** — named, persistent teammates that *build on each other's ideas* directly via `SendMessage`. The generative counterpart to team-debate: where debate prunes by conflict, a council grows by cross-pollination.

## Why teams beat isolated parallel subagents (for ideation)

The standard Brainstorm mode (Stage 3) spawns **isolated subagents** — each explores alone and never sees the others. Collision happens **once**, later, inside the lead's synthesis. Ideas never fertilize each other.

| | Isolated subagents | Team brainstorm (teammates) |
|---|---|---|
| Idea exposure | Each agent blind to the others | Each sees others' ideas live |
| Collision | Once, in the lead's head | Continuous, between agents |
| Compounding | None — N separate lists | A's idea → B extends → C leaps |
| Output | Union of independent ideas | Emergent ideas in *no* single agent |

Continuous cross-pollination is the whole point — the "1+1=3" that isolated fan-out can't produce.

## Debate vs council (don't confuse the two)

| | Team **debate** | Team **brainstorm** (council) |
|---|---|---|
| Goal | Decide / pressure-test | Expand / discover |
| Core move | "No, but…" — attack | "Yes, and…" — build on |
| Converges by | Elimination (what survives) | Synthesis (what combines) |
| Failure mode | Hostility / stalemate | **Groupthink / premature agreement** |

## Prerequisites

- `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` must be set. Without it, no teammates — use the isolated-subagent Brainstorm (SKILL.md Mode 1, Stage 3).
- **Main session only.** Agent teams have no nested teams — a teammate cannot spawn teammates. So team-brainstorm runs only when `heavy-think` is followed in the **main conversation**, not inside a subagent.
- Ideation is think-and-message only (no file edits) → no file-conflict risk. Ideal team use case.

## When to use

Use teammates over isolated subagents when **idea compounding matters more than raw breadth**:

- Open-ended product / strategy / design exploration where the best idea is a *combination*
- "How might we…", "what could we build", "expand on this direction"
- Stakes justify ~3–5× the compute of a single pass

Do NOT use for: a quick list (isolated subagents are cheaper), or any decision (use debate).

## The lead's playbook

You (the main session) are the **facilitator + synthesizer**. You do not generate ideas — you frame, spawn, spark, and harvest.

1. **Frame the question — open, not binary.** A "how might we…" or "what could we…", with constraints and what a great idea looks like. No yes/no motions (that's debate).
2. **Assign distinct lenses.** 2–4 teammates, each a *generative* perspective (First Principles, User, Futurist, Operator, Minimalist, Contrarian…). Name them. Designate one **wildcard** to keep the space open.
3. **Spawn all in one message.** One `Agent` call per teammate, `model: "opus"`, each with FULL context (teammates don't inherit your history) and the roster *by name*. (The `brainstormer` agent type fits a teammate role.)
4. **Phase 1 — Diverge.** Each posts its initial ideas *independently* first (seed the space before anyone anchors). Tell them to hold judgment.
5. **Phase 2 — Cross-pollinate.** Now they read each other and BUILD: "yes-and", combine two ideas, push one further, find the adjacent idea. Each message must **add or extend**, never just approve.
6. **Phase 3 — Cluster & elevate.** They group ideas, surface the most novel/promising, and develop the top few deeper together.
7. **Synthesize (YOU — never delegate).** Harvest the *expanded* idea set: the standout concepts, the surprising combinations no single lens produced, ranked by novelty/value, plus what to explore next. Then shut the teammates down.

## Brainstormer spawn prompt (template)

Spawn each teammate (named, `model: "opus"`) with:

```
You are {name}, a collaborator in a LIVE multi-agent brainstorm. Other collaborators
message you and you message them BY NAME via SendMessage. Your plain text output is
NOT seen by anyone — to contribute, you MUST SendMessage.

QUESTION: {open question}
CONTEXT & CONSTRAINTS: {context} — {constraints}
YOUR LENS: {perspective} — generate what ONLY this lens reveals.
YOUR COLLABORATORS: {name: lens, name: lens, ...}
FACILITATOR: the lead spawned you and will spark and close the session.

How to collaborate:
1. DIVERGE FIRST: SendMessage 2–4 raw ideas from your lens to the group. Hold judgment —
   quantity and range now, not polish.
2. BUILD, don't judge: when a collaborator's idea reaches you, EXTEND it — "yes-and",
   combine it with yours, or push it somewhere new. Every message must ADD, never just
   agree. Engage their LATEST idea.
3. CHASE THE SURPRISE: prefer the idea that wouldn't exist without two lenses colliding.
4. STAY DIVERGENT until the facilitator calls convergence — then help cluster and pick
   the strongest few.

Do NOT edit files. Do NOT spawn agents. Build only through messages.
```

## Facilitation rules (beat groupthink)

A council's failure mode is the inverse of a debate's — agreeing too fast and collapsing the diversity that made it valuable. Counter each:

- **Diverge before converge.** Enforce Phase 1 (independent ideas) before any building. Early anchoring kills range.
- **Add, don't approve.** Reject "good idea!" with no extension — every message must build.
- **Keep a wildcard.** One teammate must keep injecting "what if the opposite / what's missing."
- **Spark, don't generate.** Inject gap prompts ("what would a hostile user love?", "what's the 10× version?") — never add your own ideas; that defeats the independence.
- **Detect false consensus:** if they converge fast, push "you agreed too early — find a wilder option." Converge only at Phase 3.
- **Harvest the emergent, not the obvious** — the value is ideas that exist in no single teammate's output.

## Variants

| Variant | Setup | Use when |
|---|---|---|
| **Open ideation** | Each owns a generative lens, free build | Greenfield "what could we build" |
| **How-might-we** | Frame as HMW; teammates riff and combine | Turning a problem into opportunities |
| **Stakeholder council** | Teammates *are* personas (user, ops, PM, skeptic) | Pressure-testing a direction for blind spots |
| **Combine-and-extend** | Phase 2 forces every idea to merge with another | Forcing cross-pollination, breaking silos |

## Fallback

If `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` is unset, or you're inside a subagent, use the standard **isolated parallel Brainstorm** (SKILL.md Mode 1, Stage 3) — weaker (no live cross-pollination) but needs no team support.

## Related

- `../SKILL.md` — Mode 1: Brainstorm (Escalation: Team Brainstorm)
- `team-debate.md` — adversarial counterpart (decide / pressure-test)
- `brainstorm-agent-prompt.md` — single-pass perspective + stress-test prompts
- `perspective-combinations.md` — pre-built lens sets by scenario
