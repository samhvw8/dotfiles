---
name: debate
description: "Live multi-agent debate: named teammates (agent teams) argue with each other via SendMessage, you moderate and synthesize what survived — not one agent simulating both sides. Use when the user types /debate or wants a decision pressure-tested by opposing positions — debate this, argue both sides, steelman, red-team, devil's advocate. Requires the main session and CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1. Not for simple questions, mechanical tasks, or when one analysis suffices."
---

# Debate

Guaranteed entry point for a **live agent-team debate**: named teammates argue with each other via `SendMessage`, you moderate, then you synthesize what survived. The real thing — not one agent role-playing both sides in a single response.

This skill is a thin trigger. The full protocol, spawn-prompt template, moderation rules, and variants live in the heavy-think skill — **read it before spawning**:
`../heavy-think/references/team-debate.md`

## Prerequisites (check first)

| Requirement | Why | If missing |
|-------------|-----|------------|
| You are the **main session** | Agent teams have no nested teams — a subagent can't spawn teammates | Stop; tell the user to run debate from the main session |
| `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` | Enables teammates + `SendMessage` | Fall back to heavy-think's Round Protocol (simulated, weaker) |

If either fails, **say so explicitly** — do NOT silently simulate the debate and pass it off as real.

## Playbook

1. **Frame the motion.** One sentence, debatable, with a clear A-vs-B or yes/no. Surface the hidden axes — what would change the verdict.
2. **Assign stances.** 2–4 positions that *genuinely conflict* (not shades of agreement). Name each debater.
3. **Spawn all debaters in ONE message** — `model="opus"`, each given: full context (teammates don't inherit your history), its assigned stance, and its opponents *by name*. Instruct each to argue via `SendMessage`, engage the opponent's LATEST point, make no file edits, spawn nothing.
4. **Opening round.** Each states its strongest case.
5. **Cross-examine.** They attack each other directly, round by round. You bound rounds (max 3) and force engagement with the latest argument — never argue a stance yourself.
6. **Detect convergence.** Stop when positions stabilize or a crux is isolated.
7. **Synthesize + shut down.** YOU write the verdict: what survived challenge, what broke, the decision and its conditions. Then shut the teammates down.

## Rules

- Moderate, don't compete — you steer, you never take a side.
- Max 3 rounds; beyond that is diminishing returns.
- Anti-sycophancy: debaters attack arguments, not flatter each other.
- The deliverable is YOUR synthesis, not a transcript dump.

## Related

- [team-debate protocol](../heavy-think/references/team-debate.md) — full protocol, spawn-prompt template, variants
- [heavy-think](../heavy-think/SKILL.md) — Debate is also a mode there (Dispatch → Escalation: Agent Debate)
