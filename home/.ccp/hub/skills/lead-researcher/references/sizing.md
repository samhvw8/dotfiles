# Sizing the plan

Part of the [lead-researcher skill](../SKILL.md). Read this when you pick the number of assignments, the size options for Phase 1, or the budget ceiling.

### Size the plan to the decision

The plan's cost is its assignments: each full squad is about 5 × ~15k = 75k tokens per wave. A plan is the right size when every assignment could change the answer if it came back surprising. Read three things from the request:

| Signal | Points smaller | Points larger |
|--------|----------------|---------------|
| What is decided | A pick among a few named options; reversible; small stakes in the user's own words ("small SaaS", "tight budget", "quick") | A survey of an ecosystem; "what does the evidence say"; a migration that is costly to undo |
| Where the evidence lives | Mostly primary documents (pricing pages, release notes, the law) | Dispersed practitioner experience, contested studies, several countries or communities |
| How contested | Sources agree | Sources contradict each other, or vendor SEO buries the signal |

Starting points, not caps:

| Question shape | Assignments in wave 1 | Example |
|----------------|----------------------|---------|
| Focused pick among named options | 3–5 (15–25 agents) | "Turso vs D1 vs Neon for a small SaaS on a tight budget" |
| Decision with real switching cost, or one market with several kinds of evidence | 5–8 | "Move our RN app to the New Architecture? 40 native modules"; "what Vietnamese small businesses use for e-invoicing" |
| Survey, evidence review, multi-country, contested literature | 8–15 | "Full ecosystem survey of MCP servers"; "does productivity hold on a 4-day week" |

Size up when the question earns it: do not starve a survey or a contested evidence question to hit a small number. Within any size, put the depth where the decision is: the sub-question that carries a contested, load-bearing claim gets more languages or an early gap-fill; the sub-question primary docs settle gets one assignment. Phase 4 gap-fill is how a plan grows where gaps show up, which is cheaper than front-loading thin assignments.

**Budget follows the plan, never the other way round:**
- gather_est = agents × ~15k × expected waves (1 + the gap-fill share you expect); estimate = max(gather_est + 50k, gather_est ÷ 0.8), so that after the script fences its 20% synthesis reserve the gather ceiling still covers the gather you listed. This is the [phase-zero formula](adaptive-research/phase-zero-planning.md), counting every squad member as an agent.
- The ceiling is at least the estimate. Never set it below your own estimate: the gather ceiling then SCRAMs to synthesis before the squads you listed report, and the plan says one thing while the run does another.
- If the user's budget, or the preset they choose, is lower than the estimate, cut assignments until the estimate fits, and say what you cut.
- If you think ~15k per agent is wrong for this plan (for example, mostly docs-only squads), change the unit in the formula and show it. Do not discount it silently.
- The smaller option in Phase 1 is a smaller plan (fewer assignments, languages or squad members), with its own estimate. A plan that is already 1–2 assignments can offer an inline single-pass run instead.
