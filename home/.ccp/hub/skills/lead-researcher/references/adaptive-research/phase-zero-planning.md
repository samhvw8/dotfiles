# Phase Zero Planning

What `lead-researcher` confirms with the user before any gathering. Adds budget + relative depth to the existing mode/sub-topics/languages questions, in one `AskUserQuestion`.

## The four confirmations

| # | Question | Why |
|---|---|---|
| 1 | Mode (low/medium/high/max) | breadth + languages |
| 2 | Sub-topics | what gets researched |
| 3 | Languages | EN + ZH always; +RU etc. |
| 4 | **Depth budget (absolute + relative)** | sizes and brakes the adaptive loop |

## Two complementary depth knobs

| Knob | Type | Works without budget target? | Brakes |
|---|---|---|---|
| Budget ceiling | absolute (tokens) | needs the number | total energy |
| Saturation sensitivity | **relative** | yes — uses `spent()` deltas | marginal return |

## Absolute estimate (deterministic, no agent)

```
agents     = sub_topics × languages × avg_waves(mode)
gather_est = agents × ~15k
synth_est  = max(50k, 0.20 × gather_est)
suggested  = gather_est + synth_est
```

Scales with the **confirmed plan**, not a blind mode default.

## Relative suggestion (presets bundle both knobs)

| Preset | Ceiling | Saturation threshold | Behavior |
|---|---|---|---|
| Light | ~0.5× suggested | stop at <30% new-info | shallow, fast |
| Balanced *(recommended)* | ~1× suggested | stop at <15% | default |
| Deep | ~1.5× suggested | stop at <5% | digs to saturation |
| Custom | user sets each | user sets | full control |

## How the confirmed number becomes a real brake

The runtime `budget.total` is set by the user's `+Nk` directive — a skill can't force it. So `gatherer` carries the confirmed ceiling itself, self-enforced via `spent()` deltas:

```js
const CEILING = args.budgetCeiling
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
