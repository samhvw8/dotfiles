# Atomic Components

Single-responsibility units. Side tag: **G** = gather (mechanical), **R** = reason (epistemic), **C** = control (structural).

## Components

| # | Component | Responsibility | In → Out | Side |
|---|---|---|---|---|
| 1 | STATE Store | Canonical STATE {hypotheses, topics, knowledge}; persisted each iteration (state.json) | mutation → snapshot | C |
| 2 | Seeder | User query → STATE + seed hypotheses + topics | query → STATE | R |
| 3 | Decomposer | Split a topic into atomic (topic × language) gather-tasks | topic → tasks | R |
| 4 | Task Queue | Hold pending gather-tasks with priority | tasks → next batch | C |
| 5 | Admission Controller | Gate whether a candidate expansion may spawn (the control rod) | candidate → admit/reject | C |
| 6 | Gather Worker | Run search-fetch loop for ONE task (model: sonnet) | task → findings | G |
| 7 | Retrieval Toolbelt | Actual web/gh/MCP/crawl fetch inside a worker | query → raw | G |
| 8 | Finding Normalizer | Raw output → canonical Finding {claim, evidence, url, tier, topic} | raw → Finding[] | G |
| 9 | Streaming Verifier | Per-finding hygiene as each lands, no barrier (model: sonnet) | Finding → verdict | G |
| 10 | Critic | Adversarially refute key claims (phản biện) → feeds hypothesis status | claim → rebuttal | R |
| 11 | Contradiction Detector | Compare new finding vs verified on same topic/hypothesis | Finding → conflict | R |
| 12 | Reasoner (REASONING) | Findings → hypothesis status (support/refute/open) + new knowledge | findings → STATE update | R |
| 13 | Brain / CHECK | Read STATE digest → verdict {stop, hypotheses, add_topics, knowledge} | STATE → verdict | R |
| 14 | Budget Governor | Track spend; expose remaining; trip SCRAM | spend → snapshot/SCRAM | C |
| 15 | Synthesizer | Verified findings + knowledge → cited report (model: opus) | STATE → report | R |
| 16 | Goal-Fidelity Check | Score synthesis vs ORIGINAL goal, independent of brain | report → pass/gap | C |

#12 + #13 = the **forager brain** (REASONING/EXPAND/CHECK). Venue: opus sub-agent (high/max workflow) or the main agent inline (low/medium).

## Naming

| Cluster | Lives as |
|---|---|
| #6–9 + #4 (gather) | `deep-gather` skill, run by `gatherer` agents |
| #2, #10–13, #15 (reason) | `forager` brain — fused into `lead-researcher` |
| #1, #5, #14, #16 + Phase 0 (control) | `lead-researcher` + the JS workflow (high/max only) |

## Related
- [overview](overview.md)
- [adaptive-depth-loop](adaptive-depth-loop.md)
- [gatherer-vs-forager](gatherer-vs-forager.md)
