---
name: lead-researcher
description: "Orchestrates complex multi-agent research (Anthropic's orchestrator-worker pattern). Use when research spans 2+ domains, requires 5+ sources, involves contradictory findings, or needs parallel exploration of independent sub-questions. Triggers: 'deep research', 'comprehensive analysis', 'investigate X and Y and Z', multi-field questions, anything where a single research pass would miss important angles. NOT for: single-topic lookups, quick fact checks, or research within one narrow domain (use research skill instead)."
---

# Lead Researcher

Orchestrator-worker pattern for complex research. You are the lead agent — you plan, decompose, delegate to parallel sub-agents, synthesize, and iterate.

Based on: https://www.anthropic.com/engineering/multi-agent-research-system

## When This Skill Applies (Complexity Test)

Use lead-researcher when **2+ of these are true**:

| Signal | Example |
|--------|---------|
| Multi-domain | "Compare auth approaches across mobile, web, and IoT" |
| Multi-perspective | "Evaluate X from security, performance, and DX angles" |
| Contradictory landscape | Topic where communities disagree |
| Breadth + depth needed | 5+ independent sub-questions |
| Multi-language value | Chinese/Russian communities have distinct signal |
| Synthesis-heavy | Answer requires weighing tradeoffs across findings |

If only 0-1 signals match → use `research` skill directly (single-agent research).

## Workflow

### Phase 1: Plan (You, the Lead)

Before spawning agents, think through:

1. **Decompose** the question into 3-5 independent sub-questions
2. **Assess** complexity per sub-question (simple=1 agent, comparison=2, deep=3)
3. **Assign** each sub-agent: objective, output format, source guidance, boundaries
4. **Budget** total effort: max 3 parallel agents per wave

Write a brief plan (3-5 bullets) before delegating. Save it — context will grow large.

**Failure mode to avoid:** Spawning agents without clear task boundaries → duplicated work, gaps, wasted tokens.

### Phase 2: Delegate (Parallel Sub-Agents)

Spawn sub-agents with the `researcher` agent type. Each gets:

```
[Specific objective — what to find]
[Output format — what to return]
[Source guidance — where to look, what languages]
[Boundaries — what NOT to investigate, what's handled by other agents]

RECOMMENDED SKILLS: research - use for search methodology and gh CLI patterns
```

**Scaling rules:**

| Complexity | Agents | Tool calls each |
|------------|--------|-----------------|
| Fact-finding | 1 | 3-10 |
| Comparison | 2-3 | 10-15 |
| Deep multi-field | 3 (max per wave) | 15-30 |

Fire all independent agents in a **single message** (parallel execution).

### Phase 3: Synthesize (You, the Lead)

When agents return:

1. **Evaluate** — Are there gaps? Contradictions? Missing angles?
2. **Cross-reference** — Do findings from different agents agree? Where do they conflict?
3. **Decide** — Is another wave needed? (max 2 waves total, 6 agents total)
4. **Merge** — Combine into coherent findings with source attribution

**Iteration trigger:** Only spawn wave 2 if wave 1 revealed a critical gap you couldn't have predicted upfront.

### Phase 4: Report

Structure the final synthesis:
- Lead with the answer/recommendation
- Present tensions between sources honestly
- **Every claim MUST cite its source** — inline `[text](url)` next to each claim
- List unresolved questions at end
- End with `## Sources` section listing all URLs used
- No claim without a source — if you can't cite it, don't include it

## Anti-Patterns

| Trap | Fix |
|------|-----|
| 5+ agents for simple query | Check complexity test — probably just `research` skill |
| All agents searching same thing | Give explicit non-overlapping boundaries |
| Endless iteration waves | Max 2 waves. Ship what you have. |
| Over-investing in one angle | Balance effort across sub-questions |
| No plan before spawning | MUST write decomposition first |

## Quality Check

Before reporting to user:
- [ ] All claims have a source
- [ ] Conflicting findings are presented as tensions, not hidden
- [ ] Each sub-question got adequate coverage
- [ ] Report is concise — sacrifice grammar for brevity
- [ ] Report saved to `./report/YYMMDD-<topic>.md`
