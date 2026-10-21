# Phase Zero Planning

What `lead-researcher` confirms with the user before any gathering, in the single Phase 1 plan message.

## The confirmations

| # | Question | Why |
|---|---|---|
| 1 | Target + sub-topics | what gets researched |
| 2 | Languages | default EN + ZH + ZH-TW; + T1/T2 from the language matrix |
| 3 | Source stack | which source types gatherers search |
| 4 | **Size + depth budget (absolute + relative)** | sizes and brakes the adaptive loop (workflow venue). Shown as the plan's Size line: assignments, agents, ceiling, and a smaller option |

## Two complementary depth knobs

| Knob | Type | Works without budget target? | Brakes |
|---|---|---|---|
| Budget ceiling | absolute (tokens) | needs the number | total energy |
| Saturation sensitivity | **relative** | yes — uses `spent()` deltas | marginal return |

## Absolute estimate (deterministic, no agent)

```
agents     = Σ squad members over the assignments × expected_waves
             (assignment = 1 sub-question × 1 language; full squad = 5 members; a docs-only squad = 3)
gather_est = agents × ~15k
suggested  = max(gather_est + 50k, gather_est ÷ 0.8)
```

The `÷ 0.8` matters: the script fences `SYNTH_RESERVE = max(50k, 0.20 × CEILING)`, a share of the ceiling, so the gather ceiling is 80% of it. Adding 20% of `gather_est` on top (the old form) leaves the gather ceiling about 4% short of the gather the plan lists.

`expected_waves` is 1 plus the gap-fill share you expect (about 0.3 for a bounded comparison, 0.5 or more for a contested evidence question). Languages are counted per sub-question as assigned, not `sub_topics × languages`: a language you left off a sub-question costs nothing there.

Scales with the **confirmed plan**, not a blind mode default. Two rules keep the plan and the number in agreement:
- The ceiling is never below `suggested` for the plan you list. If the user's budget is lower, shrink the plan (fewer assignments, languages or squad members) until its `suggested` fits, and say what was cut.
- If you think ~15k per agent is wrong for a plan, change the unit and show it; do not quietly set a lower ceiling.

## Relative suggestion (presets bundle both knobs)

Each preset is a plan, not a multiplier on one plan's ceiling. Halving the ceiling of a plan sized for Balanced does not make it light; it makes the gather ceiling trip before half the squads report.

| Preset | Plan | Ceiling | Saturation threshold | Behavior |
|---|---|---|---|---|
| Light | the smaller option: fewer assignments, languages or squad members; about 1 wave | `suggested` for that plan | stop at <30% new-info | shallow, fast |
| Balanced *(recommended)* | the plan as sized to the decision | `suggested` for it | stop at <15% | default |
| Deep | the same plan with more gap-fill waves (`expected_waves` ≈ 1.5–2) | `suggested` with those waves | stop at <5% | digs to saturation |
| Custom | user sets each | user sets; shrink the plan if it is below `suggested` | user sets | full control |

Use the preset's saturation threshold as the one stop number in the plan, and say it the same way in the user message and the internal plan.

## How the confirmed number becomes a real brake

The runtime `budget.total` is set by the user's `+Nk` directive — a skill can't force it. So the workflow script carries the confirmed ceiling itself, self-enforced via `spent()` deltas:

```js
const CEILING = args.budgetCeiling ?? 200_000   // never undefined → no NaN
const SYNTH_RESERVE = Math.max(50_000, 0.20 * CEILING)
const GATHER_CEILING = CEILING - SYNTH_RESERVE
const start = budget.spent()
while (!control.stop && (budget.spent() - start) < GATHER_CEILING) { ... }
```

Works with or without a runtime target. If both exist, take the min as hard safety.

## Related
- [control-rod](control-rod.md)
- [control-panel](control-panel.md)
- [overview](overview.md)
