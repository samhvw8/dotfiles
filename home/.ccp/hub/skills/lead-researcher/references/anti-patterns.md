# Anti-patterns

Part of the [lead-researcher skill](../SKILL.md). Read this when you check a plan, a prompt, a workflow script or a report before you send it.

## Anti-Patterns

| Trap | Fix |
|------|-----|
| Agent assigned multiple languages | 1 lang per agent — atomic |
| Agent assigned multiple sub-topics | 1 sub-topic per agent — single responsibility |
| Spawning without plan | MUST decompose first |
| Skipping Phase 4 | Phase 4 = real research. NEVER skip. |
| Hardcoded output path | Use cwd-relative paths |
| More than 6 agents in flight, or waiting for a whole batch before launching more | Rolling pool: ≤6 running, refill a slot as soon as one frees |
| Researching vague/unscoped requests | Route to heavy-think first (Phase 0 triage) |
| Using heavy-think for every multi-part topic | Only fire when *framing* is contested, not when a clear topic has parts |
| Blurring Phase 0 and Phase 1 | Phase 0 = "is this researchable?" Phase 1 = "confirm my plan parameters" |
| Skipping elite forum targeting | Generic search surfaces content farms. MUST include `site:` targets in agent prompts |
| Dropping contradictions/warnings in synthesis | Extract ALL structured fields (findings + key_insights + contradictions). Shallow extraction = incomplete report |
| All workflow agents on same model | Run each gatherer assignment as a squad (sonnet lead + capped haiku slices), use `model: 'sonnet'` for cross-checkers, `model: 'opus'` only for the REASONING brain and synthesis |
| Synthesis has 0 citations | Raw reports have URLs → synthesis MUST preserve them inline. 0 citations = failed synthesis |
| No budget guards in workflow | Guard on `(budget.spent() - start) < CEILING - SYNTH_RESERVE` before cross-check and synthesis — `budget.remaining()` is `Infinity` when no target is set |
| Elite forums not in workflow prompt | The table is in this skill (elite-forum-targeting.md) but doesn't auto-transfer — MUST paste forum list into each agent prompt |
| Trusting workflow output without verification | ALWAYS check if synthesis agent actually ran vs returned spend-limit error |
| Interpreting "quick/nhanh/fast" as skip phases | "Quick" = shallower depth (fewer iterations), NOT skip Phase 0/1/4. Skipping phases burns MORE tokens (wrong target → user corrects → redo) |
| Relaying gatherer data without REFLECT pass | YOU are the brain, not a relay station. Even low mode: 1 REFLECT pass checking intent-data match, scent redirect, data accuracy |
| "It doesn't exist" without questioning your search term | If user implies X is real but data says nothing → YOU likely searched for the wrong thing. Follow search redirects, ask user, or pivot |
| Reporting single data points without distribution | Report range (min-median-max), flag small sample sizes, note if data is from one source vs cross-verified |
| Spawning agents with unverified proper nouns | MUST do 2-3 inline searches in Phase 0 to verify targets exist as named. User terms are hypotheses — approximate, misremembered, wrong domain. Wrong search terms = entire research wasted |
| Every default language on every sub-question | A language goes where its community has evidence to add, with the reason in the plan. Primary-doc sub-questions get the docs' language; a language expected to be thin gets one sub-question, not all |
| Inventing a sub-topic or population the user did not ask about (often to give a default language work) | Sub-questions trace to the request; adjacent angles go in the "Not included unless you want it" line |
| A plan sized by the cross product, not the decision; the user never sees the size | Size the plan to the decision; show the Size line with a smaller option |
| A ceiling below your own estimate, or too small for the squads listed | Ceiling ≥ estimate. If the budget is lower, cut assignments and say what was cut |
| Sources line says "no GitHub" while squads keep a GitHub code slice | Drop or re-aim the slice and remove its lead-prompt line ([gather-squad](gather-squad.md)) |
| Skipping Target Verification on "quick" research | Target Verification is NEVER skippable — 2-3 searches (~free) vs N wasted agent spawns (~expensive). Quick reduces depth, not verification |
