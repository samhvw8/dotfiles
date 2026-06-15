# Adaptive Depth Loop

The core mechanism. Depth stops being a mode setting; an agent decides the exit each iteration from live evidence. Solves the shallow/deep oscillation.

## The loop

```
while ( !control.stop  &&  gatherBudgetRemaining() > 0 ):

  GATHER   →  parallel agents  (topic × language × forum)     [N agents together]
  VERIFY   →  pipeline, streams per-finding, NO barrier        [no waiting]
              + CRITIC agent refutes key claims                (phản biện)
  GAUGE    →  deterministic: update the control panel          [cheap, no agent]
  CONTROL  →  1 cheap-model agent reads panel → verdict        [owns the EXIT]

  apply verdict (admission-controlled):                        ← control rod
     deepen / add_forums / crawl_deeper / expand_topics

SYNTHESIZE  →  opus, on a FENCED budget reserve                (never starved)
GOAL-CHECK  →  score report vs original goal                   (catch drift)
```

## Step types → Workflow primitives

| Step | Behavior | Primitive |
|---|---|---|
| GATHER | many agents at once | `parallel(thunks)` |
| VERIFY | stream each finding, no barrier | `pipeline(items, ...stages)` |
| GAUGE | wait for wave, no agent | plain `await` + JS |
| CONTROL | one agent decides exit | `await agent(...)` |

User's framing: *"1 vòng loop nhưng exit depend vào 1 agent; mỗi step 1 hoặc nhiều agent cùng chạy hoặc chờ nhau."*

## Control verdict (structured)

```json
{ "stop": false,
  "deepen": ["sub_q_2"],
  "expand_topics": [],
  "add_forums": ["V2EX", "Habr"],
  "crawl_deeper": ["https://..."],
  "reason": "ZH sources thin, sub_q_2 still gap, new-info rate healthy" }
```

## Why this fixes shallow/deep

| Failure | Brake |
|---|---|
| Too deep (over-digs one topic) | marginal-return gate + budget cap cut it off |
| Too shallow (stops uniformly early) | won't stop while gauges show gaps |
| Wrong budget split | budget proportional to confirmed plan, not mode |

## Related
- [control-panel](control-panel.md) — what GAUGE produces
- [control-rod](control-rod.md) — how expansion is bounded
- [streaming-verify](streaming-verify.md) — the VERIFY step
- [overview](overview.md)
