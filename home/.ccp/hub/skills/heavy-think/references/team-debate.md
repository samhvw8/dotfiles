# Team Debate

Real multi-agent debate using **agent teams** — named, persistent teammates that argue with *each other* directly via `SendMessage`, not subagents shuttling frozen transcripts through the orchestrator.

## Why teams beat the legacy round protocol

The old escalation (Round 1 positions → Round 2 challengers → Round 3 defenders) uses **subagents**, which **cannot talk to each other**. Every round is the lead copy-pasting a static snapshot into a *fresh* agent that has lost its own prior reasoning. The "debate" is simulated by the orchestrator, not lived by the agents.

| | Legacy rounds (subagents) | Team debate (teammates) |
|---|---|---|
| Who argues | The lead, by relaying text | The debaters, directly |
| Memory | Fresh agent each round — context lost | Persistent session — keeps its own thread |
| Engages | A frozen snapshot of the opening | The opponent's *latest* live argument |
| Back-and-forth | Simulated, batched | Real, asynchronous |

Live engagement with the opponent's *current* argument is the whole point. That is what was missing.

## Prerequisites

- `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` must be set (settings.json `env` or shell). Without it, no teammates can be spawned — use the **legacy fallback** in SKILL.md.
- **Main session only.** Agent teams have no nested teams — a teammate cannot spawn teammates, and only the lead manages the team. So team-debate runs only when `heavy-think` is followed in the **main conversation**. If this guidance is being followed inside a subagent (e.g. the `heavy-thinker` agent), you cannot run a team debate — fall back, or recommend the user invoke the skill directly.
- Debate is think-and-argue only (no file edits), so there is no file-conflict risk — an ideal team-teams use case.

## When to escalate

Same triggers as any debate escalation — it costs 3–5× a single pass:

- Synthesis reveals genuinely **irreconcilable** positions (real contradiction, not just different angles)
- First-pass confidence is **low**, or stakes justify the compute
- User says "**debate this**", "deeper", "more rigorous", "pressure-test", "scientific debate"

Do NOT escalate routine questions. Always state: "Escalating to a team debate because [reason]."

## The lead's playbook

You (the main session) are the **moderator + synthesizer**. You do not argue — you frame, spawn, steer, and synthesize.

1. **Frame the motion.** State the proposition/decision and carve 2–4 *distinct* stances that collide. 2–3 debaters is the sweet spot; 4 only when the space is genuinely multi-sided. More debaters = more cross-talk to track.
2. **Spawn debaters — all in one message.** One `Agent` call per debater, each with a meaningful `name` (e.g. `advocate`/`skeptic`/`pragmatist`, or position-named `monolith`/`microservices`). Use your strongest model (`model: "opus"`) for reasoning depth. Each spawn prompt carries FULL context — teammates do **not** inherit your conversation history. Give each the roster of opponents *by name* so they can address each other. (Optionally reference the `brainstormer` agent type for a debater role.)
3. **Opening statements.** The spawn prompt tells each debater to open by `SendMessage`-ing its single strongest case to each opponent. They start arguing on spawn.
4. **Cross-examination.** Each debater attacks the *weakest point in the opponent's latest message* and defends the strongest objection to its own. Messages from teammates are delivered automatically; you receive them and idle notifications without polling.
5. **Converge.** When exchanges stop producing new arguments (debaters idle / only restating), message each to close: what it concedes, what survives, its final position.
6. **Synthesize (YOU — never delegate).** The position/elements that survived adversarial pressure → recommendation, the tensions worth holding, and what to kill. What survives challenge beats what merely sounded good.
7. **Shut down.** Ask each teammate to shut down once you have its final position.

## Debater spawn prompt (template)

Spawn each debater (named teammate, `model: "opus"`) with:

```
You are {name}, a debater in a LIVE multi-agent debate. Other debaters can message
you and you message them BY NAME via SendMessage. Your plain text output is NOT seen
by anyone — to argue, you MUST SendMessage. Reply to whoever messages you.

MOTION / DECISION: {motion}
CONTEXT & CONSTRAINTS: {context} — {constraints}
YOUR STANCE: {stance} — argue it with full conviction and rigor.
YOUR OPPONENTS: {name: stance, name: stance, ...}
MODERATOR: the lead spawned you and will message you to steer and to close.

Rules of engagement:
1. OPEN: SendMessage your single strongest case to each opponent by name. Tight — your
   best argument, not a list of all of them.
2. CROSS-EXAMINE: when an opponent messages you, attack the WEAKEST point in their
   LATEST message and rebut the strongest objection to your own. Engage their current
   argument — never a strawman or their opening once they've moved on.
3. RIGOROUS, NOT HOSTILE. The goal is truth, not winning. Concede points that are
   genuinely right — a concession sharpens the debate and counts as progress.
4. BOUND: at most {N=2-3} exchanges per opponent. When you have nothing new (only
   restating), say so and stop messaging.
5. CLOSE: when the moderator asks, reply with — what you concede, what survives, and
   your final position with confidence.

Do NOT edit files. Do NOT spawn agents. Think hard; argue only through messages.
```

## Moderation rules (make it actually work)

The failure mode of unmonitored teams: they loop, drift, go hostile, or the lead starts arguing for them. Counter each:

- **Bound the exchanges.** 2–3 cross-examination rounds per pair, then close. State the cap in the spawn prompt and enforce it.
- **Force engagement with the LATEST argument**, not the opening — re-attacking a stale point is the loop trap.
- **Steer, don't argue.** Inject a sharpening question if they talk past each other; never argue a stance yourself — that defeats the independence.
- **Detect termination:** end when (a) consensus emerges, (b) positions are stable and irreconcilable (report that as a genuine tension), or (c) the round cap hits. Don't let it run unattended.
- **Anti-sycophancy:** if debaters agree too fast, push: "you conceded too early — find the strongest surviving objection."
- Optional: have debaters append converging conclusions to a shared findings doc (the docs' "scientific debate" pattern) so the thread is auditable.

## Variants

| Variant | Setup | Use when |
|---|---|---|
| **Position debate** | Each debater owns one candidate answer/design | Deciding between known options |
| **Scientific disprove** | Each owns a hypothesis; job is to *disprove the others* | Root-cause / "why is this happening" |
| **Steelman tournament** | Each must restate the opponent's case *better* before rebutting | High stakes; guards against strawmanning |

## Fallback

If `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` is unset, or you are running inside a subagent (cannot spawn teammates), use the **legacy round protocol** in SKILL.md (Round 1 positions → Round 2 challenges → Round 3 defenses, lead relays between rounds). It is weaker but needs no team support.

## Related

- `../SKILL.md` — Escalation: Agent Debate section
- `brainstorm-agent-prompt.md` — single-pass perspective + stress-test prompts
- `tensions.md` — consensus vs minority, width vs depth design tensions
