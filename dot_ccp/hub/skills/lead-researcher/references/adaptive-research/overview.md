# Adaptive Research System

Redesign of the research stack: split mechanical **gathering** from epistemic **reasoning**, driven by an agent-gated adaptive loop with budget control. Spec only — implementation lands in the three skills that link here.

## Why this redesign

| Symptom (felt by user) | Root cause | Fix |
|---|---|---|
| Output feels like a data dump | Synthesis under-designed (concatenation) + starved of budget | Fenced synth reserve + thesis-driven synthesis |
| Sometimes too shallow, sometimes too deep | Depth fixed by **mode**, chosen blind before seeing the topic | **Adaptive depth** — an agent decides exit each iteration |
| Topics/sources never grow mid-run | Plan frozen at decompose time | Dynamic topic + forum + crawl-depth expansion, rate-controlled |
| Cross-check waits for all agents | Verify is a barriered phase | Streaming per-finding verify (pipeline) |

## The three layers

| Layer | Name | Role |
|---|---|---|
| Hands | **gatherer** (was the "high/max dynamic workflow") | Mechanical: search → fetch → extract → verify |
| Brain | **forager** | Epistemic: reflect, critique (phản biện), steer, decide done |
| Spine | **lead-researcher** | Orchestrator: plan, set budget, wire brain → hands |

## Core principle

> Depth is not a setting — it is a decision made repeatedly from evidence.

The loop exits when a **control agent** judges coverage/goal met, bounded by hard budget caps so it can never run away. The brain steers *direction*; the budget caps bound *energy*.

## Related
- [atomic-components](atomic-components.md) — the component decomposition
- [adaptive-depth-loop](adaptive-depth-loop.md) — the loop shape + agent-gated exit
- [control-panel](control-panel.md) — coverage gauges
- [control-rod](control-rod.md) — expansion caps + SCRAM + budget reserve
- [phase-zero-planning](phase-zero-planning.md) — budget + relative suggestions
- [streaming-verify](streaming-verify.md) — pipeline verify + critique
- [gatherer-vs-forager](gatherer-vs-forager.md) — same loop, different control question
