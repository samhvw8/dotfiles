# Adaptive Research System

Redesign of the research stack: split mechanical **gathering** from epistemic **reasoning**, driven by an agent-gated **hypothesis loop** with budget control. Spec — implementation lives in the skills that link here.

## Why this redesign

| Symptom (felt by user) | Root cause | Fix |
|---|---|---|
| Output feels like a data dump | Synthesis under-designed (concatenation) + starved of budget | Fenced synth reserve + thesis-driven synthesis |
| Sometimes too shallow, sometimes too deep | Depth fixed by **mode**, chosen blind before seeing the topic | **Adaptive depth** — the brain decides exit each iteration |
| Topics/hypotheses never grow mid-run | Plan frozen at decompose time | Dynamic topic / hypothesis / knowledge expansion, rate-controlled |
| Cross-check waits for all agents | Verify is a barriered phase | Streaming per-finding verify (pipeline) |

## The pieces

| Role | Lives as | Job |
|---|---|---|
| Hands | **deep-gather** skill (run by **gatherer** agents) | Mechanical: search → fetch → extract → verify from the internet |
| Brain | **forager** (fused into lead-researcher) | Epistemic: REASONING / critique / EXPAND / CHECK — weighs data vs hypotheses |
| Spine | **lead-researcher** | Orchestrator: plan, set budget, run the loop, wire brain → hands |

## Core principle

> Depth is not a setting — it is a decision made repeatedly from evidence.

The loop carries STATE {hypotheses, topics, knowledge} and exits when the **brain** judges hypotheses settled / goal met, bounded by hard budget caps so it can never run away. The brain steers *direction*; budget caps bound *energy*. Venue: inline main agent (low/medium) or an opus sub-agent in a workflow (high/max).

## Related
- [atomic-components](atomic-components.md) — the component decomposition
- [adaptive-depth-loop](adaptive-depth-loop.md) — the loop shape + agent-gated exit
- [control-panel](control-panel.md) — the control signals
- [control-rod](control-rod.md) — expansion caps + SCRAM + budget reserve
- [phase-zero-planning](phase-zero-planning.md) — budget + relative suggestions
- [streaming-verify](streaming-verify.md) — pipeline verify + critique
- [gatherer-vs-forager](gatherer-vs-forager.md) — gather hands vs reason brain
- [forager (the brain)](../forager/overview.md) — REASONING/EXPAND/CHECK methodology
