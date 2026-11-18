---
name: lead-researcher
description: "Entry point for all multi-source research — comparing options, evaluating tools, surveying an ecosystem, deep or 'team research' (live supervised venue on harness-ops sessions). Orchestrates gatherer agents; the brain sizes the plan to the decision and picks agent count, languages (default EN + ZH + ZH-TW, assigned per sub-question), iterations, and depth from the question. Never spawn gatherer agents directly — they go through this skill. For a light survey use quick-search first. Not for single-fact lookups ('what version is X', 'is Y deprecated') — those are one web search."
---

# Lead Researcher

MANDATORY orchestrator for ALL research. Based on Anthropic's orchestrator-worker pattern.
You plan, decompose, assign (1 language + 1 sub-topic) per agent, then synthesize.
This file is the map: read a reference only when its row in [Load when](#load-when) applies.

## When to use it vs quick-search

| Request | Use |
|---------|-----|
| Single fact ("latest stable React", "is Y deprecated") | One web search (Parallax `web_search`: `mcp__claude_ai_Parallax__web_search` in Claude Code, `parallax call web_search` in `omp` and agy; or `web_search` / `WebSearch`), not this skill |
| Quick, one-agent survey: does X exist, options for X, pick a tool | [quick-search](../quick-search/SKILL.md) |
| Costly or hard-to-reverse decision, conflicting sources, non-English sources, gaps after ~15 queries, a survey or evidence review, "deep" or "team research" | This skill |

**Light path:** only for a quick survey with nothing costly behind it. Take the full path (Phase 0, then [sizing](references/sizing.md), then gatherers) when the question names a choice that is costly or hard to undo (a platform, vendor, database or architecture pick, a migration, scale or cost numbers), needs non-English sources, or the first sources conflict. Being asked for this skill does not make a question light. On the light path, follow quick-search, and seed Phase 0 and the STATE hypotheses from its option table instead of searching from zero.

## Arguments

Format: `[topic]` — everything else (agents, languages, depth) is decided by the brain at runtime.

```
/lead-researcher compare auth solutions for Next.js
/lead-researcher full ecosystem survey of MCP servers
/lead-researcher what's the best ORM for PostgreSQL
/lead-researcher team compare auth solutions            ← live Team venue (supervised)
```

## Defaults

| Parameter | Default | Override |
|-----------|---------|----------|
| **Languages** | EN + ZH + ZH-TW as the candidate set | User specifies; brain adds languages the topic needs, and leaves a language off a sub-question it has nothing to add to, with the reason in the plan ([Language per sub-question](references/language-choice.md#language-per-sub-question)) |
| **Agent count** | Brain sizes it to the decision ([Size the plan](references/sizing.md#size-the-plan-to-the-decision)) | No fixed limit: big, contested, multi-source questions get big plans; a small pick gets a small one |
| **Iterations** | Brain decides — stop when saturated | No preset count |
| **Depth** | Brain decides — shallow for simple, deep for complex | Saturation curve, not a mode setting |
| **Venue** | Inline (brain = main agent) or workflow (brain = opus sub-agent) | Brain picks based on expected complexity |
| **Objective** | Decision: find the best option, confirm or refute claims | **Ideas**: when the caller is `idea-scout`, or Sam asks for ideas, gems or what can be reused rather than which option is best ([Ideas objective](references/ideas-objective.md)) |

**The brain (forager) decides everything.** No modes, no preset agent counts, no fixed iterations. The only default is the language set: EN + ZH + ZH-TW when nothing is specified. It is a set to choose from per sub-question, not a multiplier applied to every sub-question.

## Venues

Same brain, three venues; the brain picks by expected complexity. Inline: main agent is the brain (simple, focused). Workflow: opus sub-agent per iteration in a background script (complex, multi-domain). Team (opt-in): the lead steers visible gatherer sessions round by round. Details: [iterate-loop](references/iterate-loop.md), [workflow-venue](references/workflow-venue.md), [team-research](references/team-research.md).

## Phase flow

Every phase runs on every research task; the brain scales depth, not the sequence. "Quick/nhanh/fast" = shallower depth, NOT skipped phases. Only Phase 1 may be skipped, and only when the user named the target and sub-topics explicitly.

0. **Triage** — is it researchable as stated (else route to `heavy-think`)? Verify every named entity with 2-3 inline searches; never go on with unverified proper nouns. Offer the Team venue when live steering would help.
1. **Confirm the plan** — one message: target, sub-topics, languages with reasons, source stack (GitHub in or out), size with a smaller option.
2. **Plan** (you, not delegated) — decompose with the stakeholder / temporal / failure-mode / alternative-framing lenses; every sub-question traces to the request; 1 language + 1 sub-topic per assignment; size the plan and set the ceiling; output path `./research/YYMMDD-<topic>/`.
3. **Gather** — each assignment runs as a squad (sonnet lead + 3 haiku slices + haiku opener) with elite-forum `site:` targets; ≤6 agents in flight as a rolling pool.
4. **Control** — the forager brain: coverage, structured checks, gem extraction, gap-targeted deepening. Never skipped; even a quick run does 1 REFLECT pass.
5. **Synthesize** — recommendation first, cross-language tensions, contradictions, unresolved questions, inline citations on every claim.

Phases map to the loop: 0-2 plan, 3 = GATHER DATA, 4 = REASONING / EXPAND / CHECK (the brain owns the exit), 5 = SYNTHESIZE, then GOAL-CHECK against the original goal.

## Load when

| Situation | Read |
|-----------|------|
| Phase 0 triage, target verification, venue toggle, the Phase 1 plan message, source stack, Phase 2 decomposition and scope | [planning](references/planning.md) |
| Running the iterate loop (steps, exit rules, brakes) in any venue | [iterate-loop](references/iterate-loop.md) |
| Workflow venue: runtime contract, how to trigger it, model tiers | [workflow-venue](references/workflow-venue.md) |
| Budget guards and SCRAM to synthesis in a workflow | [workflow-venue: Budget Guards](references/workflow-venue.md#budget-guards-workflows) |
| Structured output schema for workflow gatherers | [workflow-venue: Structured Output Schema](references/workflow-venue.md#structured-output-schema-recommended-for-workflows) |
| A workflow finished: check before the final report | [workflow-venue: Post-Workflow Verification](references/workflow-venue.md#post-workflow-verification-workflow-venue-only) |
| Team venue ("team research", "research with me", `team` arg) | [team-research](references/team-research.md) |
| Ideas objective (caller is `idea-scout`, or ideas and gems rather than a verdict) | [ideas-objective](references/ideas-objective.md) |
| Which languages go on which sub-question; assignment layout | [language-choice](references/language-choice.md), [language-matrix](references/language-matrix.md) |
| Sizing the plan, Phase 1 size options, budget ceiling | [sizing](references/sizing.md) |
| Elite forums and content farms per language (every gatherer prompt) | [elite-forum-targeting](references/elite-forum-targeting.md), [elite-forums](references/elite-forums/overview.md) |
| Squad members, slice prompts, merge rules | [gather-squad](references/gather-squad.md) |
| Spawning gatherers: the lead prompt template | [phase3-gather](references/phase3-gather.md) |
| Phase 4 REFLECT / STEER, gem extraction, gap-fill | [phase4-control](references/phase4-control.md), [forager](references/forager/overview.md) |
| Writing the report and citations | [phase5-synthesize](references/phase5-synthesize.md) |
| Checking a plan, prompt, script or report for known traps | [anti-patterns](references/anti-patterns.md) |
| Menu of source types and how to query each | [source-types](references/source-types.md) |

## Related

- [deep-gather](../deep-gather/SKILL.md) — the methodology each gatherer loads
- [language-matrix](../deep-gather/references/language-matrix.md) — field-to-language mapping
- [content-farms](references/elite-forums/content-farms.md) — sites to rank down, per language
- [landscape-notes](references/elite-forums/landscape-notes.md) — per-language ecosystem insights
- [adaptive-research spec](references/adaptive-research/overview.md) — gather/reason split, adaptive-depth loop, control rod, Phase 0 budget
- [idea-bank schema](../idea-bank/references/schema.md) — card, brick and gem formats for the ideas objective
