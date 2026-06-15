# Adaptive Depth Loop

The core mechanism. Depth stops being a mode setting; an agent decides the exit each iteration from live evidence. Solves the shallow/deep oscillation.

## State (grows each iteration)

```
STATE = { hypotheses[], topics[], knowledge[] }
```

## The loop

```
seed STATE = { hypotheses, topics, knowledge }
while ( !check.stop  &&  gatherBudgetRemaining() > 0 ):

  GATHER DATA →  deep-gather from internet — parallel gatherer agents (topic × language × source)
                 + stream per-finding verify (no barrier) + CRITIC refute
  REASONING   →  brain weighs new data vs each hypothesis: support / refute / new insight   [opus]
  EXPAND      →  grow STATE: add/refine hypotheses, add topics, accumulate knowledge   ← control rod
  CHECK       →  condition met? hypotheses settled · saturation · topics covered · budget · depth  [owns EXIT]
  → continue (next iteration uses the expanded STATE)   OR   exit

SYNTHESIZE  →  opus, FENCED reserve → answer + evidence + knowledge, cited
GOAL-CHECK  →  score answer vs original goal (catch drift)
```

## Step types → Workflow primitives

| Step | Behavior | Primitive |
|---|---|---|
| GATHER DATA | many gatherer agents + stream verify | `parallel()` + `pipeline()` |
| REASONING | brain weighs data vs hypotheses | `await agent(opus)` |
| EXPAND | mutate STATE, admission-controlled | JS + control rod |
| CHECK | brain decides exit | part of the REASONING verdict |

User's framing: *"hypothesis, topic, knowledge → gather data → reasoning → expand → check → continue."* Exit depends on the brain agent; each step is 1 or many agents, parallel or sequential.

## REASONING + CHECK verdict (structured)

```json
{ "stop": false,
  "hypotheses": [{ "h": "X causes Y", "status": "supported|refuted|open" }],
  "add_topics": ["..."],
  "knowledge": ["confirmed fact ..."],
  "reason": "H1 refuted by 3 ZH sources; H2 open, new-info rate healthy" }
```

## Why this fixes shallow/deep

| Failure | Brake |
|---|---|
| Too deep (over-digs one topic) | marginal-return gate + budget cap cut it off |
| Too shallow (stops uniformly early) | won't stop while gauges show gaps |
| Wrong budget split | budget proportional to confirmed plan, not mode |

## Related
- [expand-wiring](expand-wiring.md) — concrete JS for the EXPAND step (feed `add_topics` into next GATHER)
- [control-panel](control-panel.md) — the control signals the brain reads
- [control-rod](control-rod.md) — how expansion is bounded
- [streaming-verify](streaming-verify.md) — the VERIFY step
- [overview](overview.md)
