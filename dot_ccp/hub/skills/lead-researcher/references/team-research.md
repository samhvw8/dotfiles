# Team Research

Live, **supervised** multi-agent research using **agent teams** — named, persistent teammates that exchange with each other via `SendMessage` while the research is *still running*, so the flow adapts continuously instead of only between waves. The research counterpart to team-debate/team-brainstorm.

## Where the brain goes (read this first)

The forager loop (REASON → EXPAND → CHECK) is the **brain**. The venue decides who runs it:

| Venue | Forager brain runs as | Strategic oversight |
|-------|----------------------|---------------------|
| Direct (low/med) | the main agent, inline | same main agent |
| Workflow (high/max) | an opus sub-agent per iteration (main asleep) | main agent, GOAL-CHECK after |
| **Team (live)** | the **Steering-Lead teammate** (opus), continuously | **Supervisor = main session** |

Two cognition levels in the team venue: the **tactical brain** (Steering-Lead = forager, per-finding) and **strategic oversight** (Supervisor = you: approve pivots, decide verify, GOAL-CHECK, synthesize). The brain moves *out* of the main session into a live teammate — that frees you to supervise.

## The org chart

The main session is the only one that can spawn (no nested teams), so it spawns the whole flat team; hierarchy is by **role**, not structure.

| Role | Count | Job | Model |
|------|-------|-----|-------|
| **Supervisor** | main session | Spawn team, oversee, approve big pivots, decide verify-on-demand, GOAL-CHECK, final synthesis, shutdown | opus (main) |
| **Steering-Lead (brain)** | 1 | Forager REASON/EXPAND/CHECK: read streamed findings, weigh hypotheses, steer gatherers, hand claims to verifier, propose exit to supervisor | opus |
| **Gatherer** | 2–3 | deep-gather search-fetch on its topic×language; **stream findings live** to steering-lead; obey steering | sonnet |
| **Verifier** | 1 | **idle until handed a load-bearing claim**, then cross-checks it and returns a verdict | sonnet |

## Why teams beat fire-and-forget gatherers

| | Direct/Workflow gatherers | Team gatherers |
|---|---|---|
| Findings reach the brain | at end of the wave (batched) | **live, as found** (streamed) |
| Flow adapts | between waves | **continuously, mid-search** |
| Dead ends | run to completion, then pruned | **killed the moment they're spotted** |
| Contradictions | reconciled in synthesis | gatherers reconcile **with each other** live |
| Verify | streaming pipeline (workflow) | **on demand**, targeted at load-bearing claims |

Per the heuristic — *use teammates when the agents need to talk to each other.* Use the team venue when you want to steer live and findings must cross-check as they arrive. For autonomous, deep, budgeted, resumable runs, the **Workflow venue is still better** (it persists STATE and runs while you're away). Team venue does not persist/resume and costs your live attention.

## Prerequisites

- `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` set. Without it, no teammates — use Direct or Workflow.
- **Main session only.** No nested teams → the Steering-Lead *directs* gatherers by messaging, it cannot *spawn* them; only the Supervisor (main) creates the roster.

## The supervisor's playbook

1. **Plan as normal.** Run Phase 0–2 (triage, confirm plan, decompose, language matrix, elite forums). Team venue reuses all of it.
2. **Spawn the team in one message** — Steering-Lead (opus) + 2–3 Gatherers (sonnet, one topic×language each) + Verifier (sonnet). Each gets FULL context (teammates don't inherit history), the roster *by name*, and the confirmed source stack + elite-forum list.
3. **Let it run.** Gatherers stream findings to the Steering-Lead; it reasons live and steers them; it routes load-bearing claims to the Verifier.
4. **Supervise.** Approve/redirect when the Steering-Lead proposes a pivot or a new topic; spawn a 4th gatherer for a gap if needed; resolve disputes it escalates.
5. **Exit by the brain, approved by you.** When the Steering-Lead proposes stop (hypotheses settled / new-info collapsing / coverage met), you confirm.
6. **Synthesize + GOAL-CHECK (YOU).** Merge into the cited report (Phase 5 format), score vs the original goal, then shut all teammates down.

## Spawn prompts (templates)

**Steering-Lead (the brain)** — `model: "opus"`:

```
You are {name}, the STEERING-LEAD (the brain) of a live research team. Gatherers
SendMessage you findings as they search; you reason and SendMessage them steering.
Your plain text is NOT seen — act only via SendMessage. Supervisor = the lead session.

GOAL: {researchable question}   HYPOTHESES: {seed list}   CONSTRAINTS: {constraints}
GATHERERS: {name: topic×lang, ...}   VERIFIER: {name}

Run the forager loop continuously (see references/forager/overview.md):
- REASON: weigh each incoming finding against the hypotheses (support/refute/new).
- STEER: SendMessage the gatherer to deepen, pivot, or STOP a dead thread; assign new
  sub-topics as they emerge.
- VERIFY ON DEMAND: when a claim is load-bearing, SendMessage the Verifier to cross-check
  it before you trust it.
- EXPAND: add/refine hypotheses and topics (rate-limited — don't sprawl).
- EXIT: when hypotheses settle / new-info-per-token collapses / coverage met, SendMessage
  the Supervisor a proposed STOP with a coverage summary. Do not stop unilaterally.
Do NOT edit files. Do NOT spawn agents.
```

**Gatherer** — `model: "sonnet"`, `agentType: "gatherer"`:

```
You are {name}, a gatherer on a live research team. Run the deep-gather search-fetch loop
on YOUR assignment only. Use SendMessage — your plain text is not seen.

ASSIGNMENT: {1 sub-topic} in {1 language}.   STEERING-LEAD: {name}.   Source stack: {stack}.
Elite forums for {lang}: {forums} — use site: targeting on ≥2.

While searching:
- STREAM: SendMessage the Steering-Lead each significant finding AS you find it (claim +
  source URL + confidence) — do not wait until the end.
- FLAG: message it immediately on a contradiction, a load-bearing claim, or a new sub-topic.
- OBEY STEERING: when it tells you to deepen/pivot/stop, do it. Message peers if you find
  something that contradicts their thread.
RECOMMENDED SKILL: deep-gather (search-fetch methodology). Save your report to {path}.
Do NOT edit files outside your report. Do NOT spawn agents.
```

**Verifier** — `model: "sonnet"`:

```
You are {name}, the VERIFIER on a live research team. You IDLE until the Steering-Lead
SendMessages you a specific claim to check. For each claim:
1. Find INDEPENDENT primary/practitioner sources (not the originating one).
2. Verdict: CONFIRMED (≥2 independent) / WEAK (1 / blog-only) / REFUTED (+ the counter-source).
3. SendMessage the verdict + source URLs back to the Steering-Lead. Then idle again.
Be brutal and concise. Do NOT edit files. Do NOT spawn agents.
```

## Coordination rules (make it work, not loop)

- **Stream, don't batch** — gatherers must message findings as found; that's what enables live steering.
- **Bound the chatter** — the Steering-Lead summarizes; gatherers send findings, not raw dumps. Keep the Steering-Lead's working context bounded (roll up old knowledge).
- **Exit is proposed by the brain, approved by the supervisor** — never let it run unattended; never stop without the brain's coverage summary.
- **Verify only load-bearing claims** — not everything; the Verifier is on-demand, or the run drowns in cross-checks.
- **Anti-sycophancy** — the Steering-Lead pushes gatherers off thin single-source claims; the Verifier defaults to WEAK when uncertain.

## Activation

| Path | How |
|------|-----|
| **Explicit** | User says "**team research**" / "research with me" / `/lead-researcher team <topic>` → team venue, skip the toggle |
| **Phase-0 toggle** | A yes/no in Phase 0: *"Run as live Team Research (supervised: steering-lead brain + gatherers + verifier)?"* |

## Related

- `../SKILL.md` — Execution Engine venues; Phase 0 triage; planning phases
- `forager/overview.md` — the brain (REFLECT/STEER = REASON/EXPAND/CHECK)
- `adaptive-research/overview.md` — the batched (workflow) adaptive loop this complements
- `../../deep-gather/SKILL.md` — gatherer search-fetch methodology
- `../../heavy-think/references/team-debate.md` · `../../heavy-think/references/team-brainstorm.md` — sibling agent-team protocols
