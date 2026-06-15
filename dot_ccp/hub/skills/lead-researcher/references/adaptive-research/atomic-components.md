# Atomic Components

Single-responsibility units. Side tag: **G** = gather (mechanical), **R** = reason (epistemic), **C** = control (structural).

## Components

| # | Component | Responsibility | In → Out | Side |
|---|---|---|---|---|
| 1 | Goal-State Store | Canonical state both loops read/write; persisted each generation | mutation → snapshot | C |
| 2 | Seeder | User query → goal-state + seed sub-questions | query → goal-state | R |
| 3 | Decomposer | Split sub-question into atomic (sub-q × language) tasks | sub-q → tasks | R |
| 4 | Task Queue | Hold pending gather-tasks with priority | tasks → next batch | C |
| 5 | Admission Controller | Gate whether a candidate expansion may spawn (the control rod) | candidate → admit/reject | C |
| 6 | Gather Worker | Run search-fetch loop for ONE task (model: sonnet) | task → findings | G |
| 7 | Retrieval Toolbelt | Actual web/gh/MCP/crawl fetch inside a worker | query → raw | G |
| 8 | Finding Normalizer | Raw output → canonical Finding {claim, evidence, url, tier, sub_q} | raw → Finding[] | G |
| 9 | Streaming Verifier | Per-finding hygiene as each lands, no barrier (model: sonnet) | Finding → verdict | G |
| 10 | Critic | Adversarially refute key claims (phản biện) | claim → rebuttal | R |
| 11 | Contradiction Detector | Compare new finding vs verified on same sub_q | Finding → conflict | R |
| 12 | Coverage Assessor | Findings → coverage gauges (gap/partial/covered) | findings → panel | R |
| 13 | Control Agent | Read gauge digest → continue/stop + expansion verdict (cheap model) | panel → verdict | R |
| 14 | Budget Governor | Track spend; expose remaining; trip SCRAM | spend → snapshot/SCRAM | C |
| 15 | Synthesizer | Verified findings → cited report (model: opus) | findings → report | R |
| 16 | Goal-Fidelity Check | Score synthesis vs ORIGINAL goal, independent of brain | report → pass/gap | C |

## Naming

| Cluster | Skill |
|---|---|
| #6–9 + #4 (gather) | `gatherer` |
| #2, #10–13, #15 (reason) | `forager` |
| #1, #5, #14, #16 + Phase 0 (control) | `lead-researcher` + JS workflow |

## Related
- [overview](overview.md)
- [adaptive-depth-loop](adaptive-depth-loop.md)
- [gatherer-vs-forager](gatherer-vs-forager.md)
