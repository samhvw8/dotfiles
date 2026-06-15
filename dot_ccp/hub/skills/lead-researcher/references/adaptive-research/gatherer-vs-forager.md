# Gatherer Vs Forager

Both run the same agent-gated adaptive loop. Only the CONTROL agent's question differs. `forager`'s loop wraps `gatherer`'s.

## Same loop, different control question

| | CONTROL agent asks | Sufficiency type | Stops when |
|---|---|---|---|
| **gatherer** | Enough links/sources/coverage? Add a forum? Crawl deeper? | mechanical — did we collect enough? | gauges filled or saturated |
| **forager** | Is the user's GOAL answered? Does the argument survive critique? Reframe? | epistemic — did we understand enough? | goal met or budget out |

## Nesting

```
forager loop (goal control):
  └─ run gatherer loop (collect until mechanically sufficient)
     └─ reflect + critique (phản biện) on the result
     └─ if goal NOT met → steer (expand scope / new angle) → gather again
  exit when GOAL control agent says done
```

`gatherer` fills the well; `forager` decides if the water answers the question.

## Division of labor

| Concern | Owner |
|---|---|
| Search, fetch, crawl, extract, per-finding verify | gatherer |
| Coverage gauges (mechanical) | gatherer's CONTROL |
| Reflect, critique, contradiction resolution, reframe | forager |
| Goal-fidelity, scope expansion decisions | forager's CONTROL |
| Plan, budget, Phase 0, final goal-check | lead-researcher |

## When each is used

| Request | Path |
|---|---|
| low/medium | lead-researcher runs the loop **inline** — main agent IS the brain (forager reasoning), gatherer agents are the hands. No background workflow. |
| high/max | lead-researcher runs the loop as a **background workflow** — brain = opus sub-agent, hands = gatherer agents |
| standalone collection | `deep-gather` directly (no brain, just gather) |

## Related
- [overview](overview.md)
- [atomic-components](atomic-components.md)
- [adaptive-depth-loop](adaptive-depth-loop.md)
