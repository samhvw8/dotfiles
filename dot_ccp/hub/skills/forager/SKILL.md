---
name: forager
description: "BETA iterative research with goal-directed steering, topic expansion, and saturation detection. Synthesizes 6 human research methodologies (information foraging, berry picking, Kuhlthau ISP, intelligence cycle, ACH, grounded theory saturation) into one loop. ONLY invoke when: user says 'forager' or 'beta research', OR lead-researcher detects open-ended/deep research need and asks user first. NOT for quick lookups, single comparisons, or fact-checking — use lead-researcher for those. NOT a replacement for lead-researcher — it's a separate deeper methodology."
---

# Forager

Iterative goal-directed research. Searches, reads, reflects on what's missing, steers toward the goal, expands topics when findings warrant it. Stops when saturated or budget exhausted.

Built from 6 human research methodologies — each contributes one decision heuristic to the loop.

## When This Activates

| Signal | Action |
|--------|--------|
| User says "forager" or "beta research" | Activate |
| Lead-researcher detects open-ended need, asks user | Activate if user confirms |
| Quick fact check, single comparison | Do NOT activate — use lead-researcher |
| User says `/lead-researcher` explicitly | Do NOT activate — respect user choice |

## The Loop

```
1. SEED   — define goal + initial sub-questions from user query
2. SEARCH — spawn researcher agents (use research skill methodology)
3. READ   — extract claims, evidence, new leads from results
4. REFLECT — assess: what do I now know vs goal? gaps? contradictions? new angles?
5. STEER  — decide: deepen? expand? terminate?
6. → if continue: update goal state, generate refined queries → back to 2
   → if done: SYNTHESIZE final report
```

Each step maps to a human methodology — see `references/methodology-map.md`.

## Phase 0: Seed

Transform user query into a goal state. Use `AskUserQuestion` to confirm.

```
goal_state = {
  question: "user's research question",
  sub_questions: [extracted sub-questions with confidence: "gap"],
  coverage: { sub_q → "gap" | "partial" | "covered" },
  iteration: 0,
  max_iterations: [from mode],
  phase: "exploration",  // or "focused" after focus formulation
  new_items_log: [],     // count of new findings per iteration
  contradictions: [],
  expanded_topics: []
}
```

Present to user: "Here's what I'll investigate. Adjust?"

## Phase 1: Search (per iteration)

Spawn researcher agents for current gaps. Each agent:
- Gets 1 sub-question + 1 language
- Runs search-fetch loop (research skill)
- Returns structured findings

Use lead-researcher's wave pattern (max 3 parallel). First iteration = broad; later iterations = targeted at gaps.

## Phase 2: Reflect (the core new step)

After agents return, YOU assess — don't delegate this.

| Check | Question | Method |
|-------|----------|--------|
| **Coverage** | Which sub-questions moved from gap→partial→covered? | Update coverage map |
| **New items** | How many genuinely new claims/concepts this iteration? | Count and log to `new_items_log` |
| **Contradictions** | Do sources disagree on anything? | Log to contradictions list |
| **New angles** | Did findings reveal sub-topics we didn't plan for? | Candidate for expansion |
| **Scent strength** | Are search results still yielding relevant content? | Information foraging MVT |
| **Focus formulation** | Has understanding crystallized from vague→clear? | Kuhlthau phase transition check |

### Focus Formulation Detection

The most important signal. Check after each iteration:

| Signal | Phase |
|--------|-------|
| Coverage mostly "gap", understanding vague, many new items | **Exploration** — keep queries diverse, follow leads broadly |
| Coverage shifting to "partial", core picture forming | **Transition** — narrowing |
| Coverage mostly "partial"/"covered", few new items, clear mental model | **Focused** — switch to targeted confirmatory queries only |

When phase transitions to "focused": stop exploring, start confirming. Narrow queries to fill specific remaining gaps.

## Phase 3: Steer

Based on reflect assessment, decide next action:

```
IF saturated (< 2 new items for 2 consecutive iterations):
  → TERMINATE

IF coverage gaps in CORE sub-questions:
  → DEEPEN those sub-questions (targeted queries)

IF findings reveal important NEW sub-topic not in original plan:
  → ASK USER: "Research revealed [X]. Should I expand scope?"
  → If yes: add to sub_questions, log in expanded_topics
  → If no: note in report as "out of scope but potentially relevant"

IF contradictions unresolved:
  → INVESTIGATE: spawn agents specifically to resolve contradictions

IF budget exhausted (max iterations reached):
  → TERMINATE with coverage report

IF phase == "focused" AND all sub-questions at "partial" or "covered":
  → TERMINATE — research is sufficient
```

**Scope expansion requires user confirmation.** Never auto-expand. The user gate prevents token burn on tangents.

## Phase 4: Synthesize

When terminated, produce report at `./research/YYMMDD-<topic>/`:

1. Executive summary with confidence per sub-question
2. Findings organized by sub-question
3. Cross-source tensions and contradictions
4. Coverage map (what's answered, what's still gap)
5. Expanded topics (what emerged during research)
6. Iteration log (how understanding evolved)
7. Sources with inline citations

## Termination Protocol

Hybrid hard + soft — both required:

| Type | Criteria |
|------|----------|
| **Hard cap** | Max iterations (default: 5 for medium, 8 for deep) |
| **Saturation** | < 2 new items across 2 consecutive iterations |
| **Coverage** | All core sub-questions at "partial" or "covered" with 2+ sources |
| **User gate** | User can say "enough" at any steer step |
| **Budget** | Token/time budget from caller |

## Modes

| Mode | Max iterations | Agents/iteration | When |
|------|---------------|-----------------|------|
| **medium** | 5 | 2-3 | Moderately open-ended questions |
| **deep** | 8 | 3-6 | Highly open-ended, multi-domain, contradictions expected |

Default: medium. User can request deep.

## Anti-Patterns

| Trap | Fix |
|------|-----|
| Auto-expanding scope without user confirmation | ALWAYS ask before adding sub-topics |
| Reflecting superficially ("looks good") | MUST update coverage map with specific changes |
| Running all iterations even when saturated | Check saturation EVERY iteration — stop early |
| Treating all iterations the same | Detect focus formulation — shift from exploration to confirmation |
| Skipping reflect step | Reflect is the entire point. Never skip. |
| Delegating reflect to an agent | YOU reflect. Agents search. Don't confuse roles |

## References

- `references/methodology-map.md` — which human methodology maps to which step
- `references/goal-state-examples.md` — example goal states for different query types
- [research skill](../research/SKILL.md) — search-fetch loop methodology used by agents
- [lead-researcher skill](../lead-researcher/SKILL.md) — orchestrator that may invoke forager
