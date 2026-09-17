# Control Rod

Keeps dynamic expansion bounded — controlled criticality (k<1, guaranteed decay), never the "nuclear bomb." Metaphor for intuition only; the code is ~10 lines of caps, not a physics sim.

## The runaway risk (why this is needed)

If each gather agent surfaces 3 leads and each becomes an agent, k=3 (supercritical). Budget detonates by generation 2-3 — long before the 1000-agent cap. So the governor must be **budget/marginal-return based, not topic-count based.**

## The rods (all enforced in JS, autonomous in background)

| Rod | Mechanism | Default |
|---|---|---|
| Synthesis reserve | Gather may never spend into it; `try { gather } finally { synthesize }` | max(50k, 20% of ceiling) |
| Expansion budget | Finite admissions per run; each expansion costs 1 | 6 (light) / 12 (deep) |
| Damping factor | Below 50% budget → halve surviving leads/wave; below 25% → quarter | budget-fraction |
| Relevance threshold θ | Rises each generation; late gens admit only high-relevance topics | 0.6 + 0.08·gen |
| Depth / generation cap | A topic spawned by a topic spawned by a topic cannot spawn | depth 3, gen 5/8 |

## SCRAM (jump straight to synthesis)

Any one trigger halts expansion, drops in-flight tasks, synthesizes on what exists:

| Trigger | Meaning |
|---|---|
| `spent ≥ 0.9 × gather_ceiling` | budget floor (the good guard, generalized) |
| `dedupeRate ≥ 0.7` for 2 gens | saturation — the desired ending |
| `newInfoPerToken < 30%` of first wave | diminishing returns |
| `depth > cap` or `agents → 1000` | structural runaway |
| user says "enough" | manual SCRAM |

## Iron rule

Every exit path reaches synthesis. The current system's #1 failure (0 citations because synthesis ran out of budget) becomes impossible by construction once the synthesis reserve is fenced.

## Wildcard slot

Reserve 1 unmoderated admission for the single highest-surprise finding — lets one off-goal-but-novel topic through, the only hedge against a stable reactor pointed at the wrong question.

## Related
- [control-panel](control-panel.md)
- [adaptive-depth-loop](adaptive-depth-loop.md)
- [phase-zero-planning](phase-zero-planning.md)
- [overview](overview.md)
