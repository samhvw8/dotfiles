# Forager

The reasoning **brain** of lead-researcher's adaptive iterate loop — the CONTROL step. No longer a standalone skill; this is its methodology, fused into lead-researcher. Built from 6 human research methodologies (see [methodology-map](methodology-map.md)).

## Role in the loop

Each iteration, after GATHER DATA, forager runs **REASONING (=REFLECT) → EXPAND (=STEER) → CHECK exit**. It weighs new data against the **hypotheses**, grows **topics + knowledge**, and owns the loop's `stop`. REFLECT/STEER below map onto REASONING/EXPAND in the hypothesis loop.

## REFLECT (assess — the control agent does this, never a gatherer)

| Check | Question |
|---|---|
| Coverage | which sub-questions moved gap→partial→covered? |
| New items | how many genuinely new claims this iteration? |
| **Gem vs noise** | how many findings are GEM (specific, painful, verifiable) vs NOISE (SEO, generic, no downsides)? See [gem-detection](gem-detection.md) |
| **Intent-data match** | does the data answer what the user ACTUALLY asked? If user implies X is real but data says "doesn't exist" → wrong search target |
| Contradictions | do sources disagree? |
| New angles | did findings reveal unplanned sub-topics? |
| Scent strength | are results still yielding relevant content? (foraging MVT) |
| **Scent redirect** | did search consistently redirect to a different term? Follow the redirect — it IS the signal |
| Focus formulation | has understanding crystallized vague→clear? (Kuhlthau) |

### Focus formulation (the key signal)

| Signal | Phase | Action |
|---|---|---|
| coverage mostly gap, vague, many new items | Exploration | diverse queries, follow leads |
| coverage → partial, picture forming | Transition | narrowing |
| coverage partial/covered, few new items | Focused | confirmatory queries only |

## STEER (decide next action)

```
IF saturated (<2 new items × 2 iters)        → STOP
IF gaps in CORE sub-questions                → DEEPEN (targeted queries)
IF important NEW sub-topic                   → EXPAND (admission-controlled;
                                                high/max may auto-admit, else ask user)
IF contradictions unresolved                 → INVESTIGATE (agents to resolve)
IF gather budget / depth cap hit             → STOP → synthesize
IF focused AND all sub-qs partial/covered    → STOP (sufficient)
```

## Termination (hybrid — any one triggers stop)

| Type | Criteria |
|---|---|
| Saturation | <2 new items across 2 consecutive iterations |
| Coverage | all core sub-questions partial/covered, 2+ sources |
| Budget | gather ceiling / synthesis reserve hit |
| Depth | max generations / depth |
| User | "enough" at any steer step |

## Reflect depth = brain decides

The brain scales reflect depth to the question — no preset modes. Simple question: single REFLECT pass. Complex/contradictory: full REFLECT + STEER + goal-check. The brain reads the saturation curve and decides.

## Related

- [methodology-map](methodology-map.md) — which human methodology maps to which loop step
- [goal-state-examples](goal-state-examples.md) — example goal states by query type
- [gem-detection](gem-detection.md) — gem vs SEO noise scoring heuristics
- [control-panel](../adaptive-research/control-panel.md) — the gauges REFLECT reads
- [control-rod](../adaptive-research/control-rod.md) — expansion limits STEER respects
- [lead-researcher SKILL](../../SKILL.md) — Phase 4 CONTROL loads this brain
