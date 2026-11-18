# Execution engine and the iterate loop

Part of the [lead-researcher skill](../SKILL.md). Read this when you run the loop in any venue, or need the loop steps, exit rules and brakes.

## Execution Engine

**Same brain, three execution venues.** The brain picks the venue based on expected complexity — no preset modes:

| Venue | When brain picks it | Brain runs as |
|-------|-------------------|---------------|
| **Inline** | Simple/focused questions, quick lookups | Main agent itself — free, no delegation |
| **Workflow** | Complex multi-domain, deep investigation | Opus sub-agent per iteration (background) |
| **Team** (opt-in) | Live co-research, user wants to steer | The lead (main session), steering gatherer sessions round by round. See [team-research](team-research.md) |

**`forager` is the brain.** Its fused REFLECT/STEER methodology ([forager](forager/overview.md)) = REASONING/EXPAND/CHECK. See [gatherer-vs-forager](adaptive-research/gatherer-vs-forager.md).

### Adaptive Iterate Loop (the engine — all modes; workflow venue shown)

A **hypothesis-driven** loop, not a fixed decompose → fan-out → merge. State carries **hypotheses, topics, and accumulated knowledge** — and grows each iteration. Depth is decided by the brain from live evidence, not fixed by mode. Full design: [adaptive-research spec](adaptive-research/overview.md).

**Encode this loop in the workflow script:**

```
seed STATE = { hypotheses, topics, knowledge }   (+ Phase-0 budget ceiling)
while ( !check.stop  &&  gatherBudgetRemaining() > 0 ):
  GATHER DATA  deep-gather from internet — parallel gatherer agents (topic × language × source)  [each assignment = squad: sonnet lead + 3 capped haiku slices]
               + stream per-finding verify (no barrier) + CRITIC refute
  REASONING    brain weighs new data vs each hypothesis: support / refute / new insight           [opus — forager brain]
  EXPAND       grow STATE — add/refine hypotheses, add topics, accumulate knowledge        (admission-controlled: control rod)
  CHECK        condition met? hypothesis settled · saturation (new-info/token) · coverage · budget · depth
  → continue (next iteration uses the expanded STATE)   OR   exit
SYNTHESIZE   opus, on a FENCED reserve (never starved) → answer + evidence + knowledge, cited
GOAL-CHECK   score the answer vs the ORIGINAL goal (catch drift)
```

| Step | What it does | Who |
|------|--------------|-----|
| **GATHER DATA** | collect from the internet for current topics/hypotheses | `deep-gather` skill (gatherer agents) |
| **REASONING** | weigh new data against hypotheses — confirm / refute / discover | forager brain (opus) |
| **EXPAND** | mutate STATE: new/refined hypotheses, new topics, kept knowledge | brain + control rod |
| **CHECK** | decide continue vs stop | the brain owns the exit |

| Rule | Detail |
|------|--------|
| **Exit by agent** | The CHECK/brain decides `stop` — NOT a fixed iteration count |
| **Hypothesis-driven** | every gather serves confirming/refuting a hypothesis; findings accumulate into knowledge |
| **Brake (primary)** | `new-info ÷ tokens` declining → stop; works even when `budget.total` is null |
| **Brake (hard)** | fenced synthesis reserve + expansion budget + depth/generation caps → SCRAM to synthesis |
| **Streaming verify** | `pipeline()`, no barrier — a refuted finding updates knowledge *before* REASONING runs |
| **Expansion** | hypotheses + topics + knowledge grow, rate-limited so it can't run away |
| **Each step** | 1 or many agents, parallel or sequential — `parallel()` to fan out, `pipeline()` to stream |

Inline venue runs this loop directly (main agent is the brain). Workflow venue runs it as the background script in [workflow-venue](workflow-venue.md).
