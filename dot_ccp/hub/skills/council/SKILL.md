---
name: council
description: "Live collaborative brainstorm. Spawns named teammates (agent teams) that BUILD ON EACH OTHER'S ideas directly via SendMessage — generative cross-pollination ('yes, and…'), not one agent listing ideas alone and not an adversarial debate. Heuristic: use teammates when the agents need to talk to each other (build on ideas, hand-offs, debate); use parallel subagents when they don't (independent fan-out). Keywords: council, collaborative brainstorm, brainstorm together, ideate together, build on ideas, expand ideas, expand on this, riff together, group ideation, how might we, what could we build, team brainstorm. Use when: user types /council, says 'brainstorm together', 'expand on this idea', 'ideate as a team', or wants an open question explored by diverse perspectives that compound each other's ideas live. Requires the MAIN session (a subagent cannot spawn teammates) and CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1. Do NOT use for: a quick idea list (use solo agents), deciding between options (use /debate), mechanical tasks."
---

# Council

Guaranteed entry point for a **live collaborative brainstorm**: named teammates build on each other's ideas via `SendMessage`, you facilitate, then you harvest the expanded set. Generative — the "yes, and…" counterpart to `/debate`'s "no, but…".

This skill is a thin trigger. The full protocol, spawn-prompt template, anti-groupthink rules, and variants live in the heavy-think skill — **read it before spawning**:
`../heavy-think/references/team-brainstorm.md`

## When NOT to use this

> **Heuristic:** use teammates when the agents need to talk to each other; use parallel subagents when they don't.

- Just want a quick idea list? → solo parallel agents are cheaper (heavy-think Brainstorm, Stage 3).
- Deciding between options / pressure-testing a call? → that's `/debate`, not a council.

## Prerequisites (check first)

| Requirement | Why | If missing |
|-------------|-----|------------|
| You are the **main session** | Agent teams have no nested teams — a subagent can't spawn teammates | Stop; tell the user to run it from the main session |
| `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` | Enables teammates + `SendMessage` | Fall back to isolated parallel Brainstorm (weaker — no live cross-pollination) |

If either fails, **say so explicitly** — do NOT silently fall back and pass it off as a live council.

## Playbook

1. **Frame an open question.** "How might we…" / "what could we…" — not a yes/no (that's debate). State constraints + what a great idea looks like.
2. **Assign distinct generative lenses.** 2–4 teammates (First Principles, User, Futurist, Operator, Minimalist, Contrarian…). Name them. Designate one **wildcard** to keep the space open.
3. **Spawn all in ONE message** — `model="opus"`, each given full context (teammates don't inherit your history), its lens, and collaborators *by name*. Tell each to contribute via `SendMessage`, make no file edits, spawn nothing.
4. **Phase 1 — Diverge.** Each posts raw ideas *independently* first (no early anchoring; quantity over polish).
5. **Phase 2 — Cross-pollinate.** They read each other and BUILD: "yes-and", combine, push further. Every message must ADD, never just approve.
6. **Phase 3 — Cluster & elevate.** Group ideas, surface the most novel, develop the top few together.
7. **Synthesize + shut down.** YOU harvest the expanded set: standout concepts, surprising combinations no single lens produced, ranked by novelty/value, plus what to explore next. Then shut the teammates down.

## Rules

- Facilitate, don't generate — you spark with gap prompts, you never add your own ideas.
- Diverge before converge; reject "good idea!" with no extension.
- Keep a wildcard injecting "what if the opposite / what's missing."
- The deliverable is YOUR synthesis of the *emergent* ideas, not a transcript dump.

## Related

- [team-brainstorm protocol](../heavy-think/references/team-brainstorm.md) — full protocol, spawn-prompt template, variants
- [debate](../debate/SKILL.md) — adversarial counterpart (decide / pressure-test)
- [heavy-think](../heavy-think/SKILL.md) — Council is the team escalation of Brainstorm mode
