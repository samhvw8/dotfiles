---
name: heavyskill
description: "Reasoning amplification via parallel thinking + sequential deliberation. Decomposes hard problems into K independent reasoning trajectories then synthesizes a superior answer through critical analysis. Deliberation generates correct answers absent from ANY single trajectory. Actions: amplify, reason, deliberate, synthesize, verify. Keywords: heavy thinking, parallel reasoning, sequential deliberation, test-time scaling, reasoning amplification, multi-trajectory, memory cache, Best-of-N, majority voting, self-consistency. Use when: complex math, competition programming, logical deduction, any verifiable task with <70% confidence. Do NOT use for: subjective tasks, simple factual queries, preference-oriented problems."
---

# HeavySkill: Heavy Thinking

Reasoning amplification that decomposes hard problems into parallel independent explorations, then synthesizes insights no single chain-of-thought could reach.

Deliberation is not voting — it audits reasoning chains and forges new paths from their fragments. The paper shows deliberation produces correct answers absent from ALL individual trajectories in ~50% of cases.

## When to Activate

**MUST activate:**
- Mathematical reasoning requiring proof or exact numeric answers
- Algorithmic / competition programming with verifiable correctness
- Complex logical deduction with multiple plausible approaches
- Any verifiable task where confidence is below ~70%

**MUST NOT activate:**
- Simple factual queries, casual dialogue, obvious code edits
- Preference-oriented or subjective tasks (creative writing, style, tone)
- Easy problems with >90% confidence — sequential revision beats parallel sampling on easy tasks
- Information retrieval or straightforward transformations

## Execution

### Stage 1: Parallel Reasoning

Spawn **K independent agents** in a **single message** (parallel). Each solves from scratch with zero sibling knowledge.

| K | When |
|---|------|
| 3 | Standard — most problems |
| 5 | High-stakes — competition math, critical correctness |

**Agent prompt:**
```
Solve this problem step by step. Show your complete reasoning and arrive at a final answer. Use whatever approach you find most natural — algebraic, geometric, constructive, brute force, or proof by contradiction.

Problem: {query}

Requirements:
- Reason from first principles, show all work
- Final answer clearly marked
- Math: \boxed{answer} | Code: code block
```

### Stage 2: Memory Cache

Before deliberating, structure the outputs:

1. **Collect** all K trajectory outputs
2. **Shuffle** trajectory order (prevents position bias)
3. **Prune** if exceeding token budget — truncate reasoning, preserve final answers

### Stage 3: Sequential Deliberation

**You perform this yourself — never delegate deliberation.**

1. **Classify** query type (math / code / logic / multi-step)
2. **Map answer distribution** — what answers appear, how often?
3. **Audit each chain** — logic valid? gaps? sign errors? hidden assumptions?
4. **Cross-validate** — do independent approaches confirm the same result?
5. **Apply critical skepticism:**
   - Majority is signal, not proof
   - Minority answer with tighter logic may be correct
   - All may be wrong — re-derive from fragments if needed
6. **Synthesize** the definitive answer

### Stage 4: Output

Final answer only — no meta-analysis unless asked:
- Math: `\boxed{answer}` | Code: code block | General: prose
- Match the user's query language

## Iterative Deliberation

Trigger when first deliberation produces low confidence or fundamental disagreement.

1. Concatenate deliberation as additional trajectory: `cache(t) = deliberation(t-1) ∥ trajectories`
2. Re-run Stage 3 on augmented cache
3. **Maximum 2–3 iterations** — performance degrades beyond that

## Anti-Patterns

| Pattern | Fix |
|---------|-----|
| Voting instead of deliberating | Audit reasoning chains, not answer counts |
| Delegating deliberation to agent | Always deliberate yourself — full context needed |
| Sequential agent spawning | Spawn all K in one parallel message |
| Skipping shuffle | Always randomize order before deliberating |
| Over-iterating (>3 rounds) | Stop at confidence or iteration 3 |
| Activating on subjective tasks | Gate: is there a verifiable answer? |
| Using on easy problems | If >90% confident, just solve directly |

## References

Load when deeper understanding needed:
- `references/landscape.md` — How HeavySkill compares to Best-of-N, Self-Consistency, Forest-of-Thought
- `references/compute.md` — Cost analysis, K selection, non-monotonic performance
- `references/tensions.md` — Key design tensions: consensus vs minority, width vs depth, speed vs thoroughness
- `references/paper-details.md` — Paper methodology details: memory cache strategies, trajectory selection, RLVR
