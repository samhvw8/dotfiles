---
name: heavy-brainstorm
description: "Deep brainstorming via parallel perspective agents + convergent synthesis. Explores strategy, product, architecture, and creative problems from multiple angles simultaneously. Unlike heavyskill (verifiable answers), this targets subjective problems where insight comes from colliding different worldviews. Actions: brainstorm, ideate, explore, challenge, synthesize. Keywords: brainstorm, ideation, strategy, heavy thinking, creative exploration, product ideas, architecture decisions, divergent thinking, devil's advocate, second-order effects, what if, explore options, strategic thinking, deep brainstorm. Use when: exploring product directions, architecture trade-offs, go-to-market strategy, naming/branding, feature prioritization, 'what should we build', any subjective question benefiting from multiple perspectives. Do NOT use for: verifiable problems (use heavyskill), debugging, simple decisions with clear criteria, tasks needing implementation not ideation."
---

# Heavy Brainstorm

Deep ideation through parallel perspective exploration + convergent synthesis.

Spawns agents that think from **different angles** about the same problem — not parallel solvers, but parallel *worldviews*. Insight emerges from collision, not consensus.

## When to Activate

**MUST activate:**
- Strategic decisions with no clear "right" answer
- Product ideation where breadth of exploration matters
- Architecture decisions with legitimate competing approaches
- Any subjective problem where shallow thinking produces obvious answers

**MUST NOT activate:**
- Problems with verifiable correct answers → use `heavyskill`
- You're stuck, not brainstorming → use `problem-solving`
- Need step-by-step decomposition → use `sequential-thinking`
- Simple preference decisions with <3 options
- User said "just pick one" or wants speed over depth

## Execution

### Stage 1: Frame

Before spawning, crystallize:

```
PROBLEM: [One sentence — what are we trying to figure out?]
CONSTRAINTS: [What's fixed? Budget, timeline, team size, tech stack...]
SUCCESS LOOKS LIKE: [How will we know a good answer when we see it?]
MODE: scan | deep
```

| Mode | Agents | Depth | When |
|------|--------|-------|------|
| **Scan** | 3 | Breadth-first, many options surfaced | Early exploration, unclear direction |
| **Deep** | 3-5 | Depth-first, fewer options thoroughly examined | Narrowed field, need conviction |

### Stage 2: Design Perspectives

Choose 3-5 perspectives that will **collide productively**. Good perspective sets create tension — not redundancy.

**Perspective Templates:**

| Perspective | Explores | Good For |
|-------------|----------|----------|
| First Principles | What's actually true vs assumed? | Breaking free from convention |
| User Advocate | What does the person experiencing this actually need? | Product/UX decisions |
| Contrarian | What if the obvious answer is wrong? | Challenging groupthink |
| Futurist | What's true in 3 years that isn't today? | Technology/market bets |
| Operator | What breaks at scale? What's the maintenance burden? | Architecture, ops |
| Economist | What are the incentives? Who pays, who benefits? | Business model, pricing |
| Competitor | What would [specific competitor] do? Why? | Positioning, differentiation |
| Minimalist | What's the version with 10% of the effort that captures 80% of value? | Scope, MVP |
| Historian | What's been tried before? Why did it fail/succeed? | Avoiding known pitfalls |
| Adjacent | What do completely different industries do for this same underlying need? | Novel approaches |

**Composition rules:**
- MUST include at least one contrarian/challenging perspective
- MUST NOT assign perspectives that would produce redundant output
- Perspectives should span at least 2 of: user, business, technical, temporal

### Stage 3: Spawn Parallel Agents

Launch all agents in a **single message** (parallel execution). Each gets the same problem but a distinct lens.

Use `model="opus"` for maximum reasoning depth.

**Agent prompt template** (see `references/agent-prompt.md` for full version):

```
You are a brainstorming agent exploring a problem from a specific perspective.

PROBLEM: {problem}
CONSTRAINTS: {constraints}
YOUR PERSPECTIVE: {perspective_name} — {perspective_description}

Think deeply from this perspective. You are not trying to be balanced or comprehensive — you are trying to find insights that ONLY this perspective reveals.

Requirements:
1. Challenge at least one assumption most people take for granted
2. Explore second-order effects (and then what? and then what?)
3. Name one risk everyone else will miss
4. Surface one opportunity that only appears from this angle
5. End with your single strongest provocation — the insight that would change how someone thinks about this problem

Output structure:
## Core Insight
[Your single most powerful observation from this perspective]

## Argument
[2-4 supporting points with reasoning]

## Second-Order Effects
[What happens AFTER the obvious first move?]

## Hidden Risk
[What could go wrong that other perspectives won't see?]

## Provocation
[One sentence that challenges conventional thinking on this problem]
```

### Stage 4: Synthesize

**You perform synthesis yourself — never delegate.**

After collecting all agent outputs:

1. **Map the landscape** — What territory did each perspective cover? Where do they overlap vs diverge?
2. **Find productive collisions** — Where do perspectives directly contradict? These tensions often contain the deepest insight.
3. **Extract surprises** — What appeared that you didn't expect? What insight exists in NO single trajectory alone but emerges from combining them?
4. **Second-order cascade** — Take the strongest ideas and ask: "If we did this, then what? And then what?"
5. **Converge** — Distill into actionable output:

```
## Landscape
[Brief map of the territory explored]

## Key Insights (ranked by surprise value)
1. [Insight] — emerged from [perspective collision]
2. [Insight] — emerged from [perspective]
3. ...

## Tensions Worth Holding
[Contradictions that shouldn't be resolved — they're features, not bugs]

## Recommended Direction
[Your synthesized recommendation with reasoning]

## What to Kill
[Ideas that seemed good but crumble under examination]
```

### Stage 5 (Optional): Stress Test

If stakes are high, spawn 1-2 additional agents specifically to **attack** the synthesized recommendation:

- Red team: "Here's why this recommendation will fail"
- Pre-mortem: "It's 1 year later and this failed. What happened?"

## Mode Variations

### Quick Brainstorm (no agents)

For lower-stakes ideation, apply the thinking patterns yourself without spawning:

1. State problem
2. Rapidly generate 5-7 angles (30 seconds each, no deep dive)
3. Pick the 2 most surprising
4. Go one level deeper on those
5. Synthesize

### Iterative Deepening

When first pass reveals a promising direction:

1. Run Stage 1-4 as normal (scan mode)
2. Take top 2-3 insights
3. Re-frame as new, narrower problem
4. Run again in deep mode with new perspectives tailored to the narrowed question

## Anti-Patterns

| Pattern | Fix |
|---------|-----|
| All perspectives agree | Your perspectives are too similar — add a contrarian |
| Synthesis is just a list of what agents said | Collide the perspectives — find what emerges from contradiction |
| Picking the "safest" idea | Safe ≠ good. Rank by surprise value, not comfort |
| Skipping constraints in framing | Unconstrained brainstorming produces unusable output |
| More than 5 agents | Diminishing returns — synthesis becomes noise management |
| Brainstorming when you should be deciding | If you have enough info to decide, decide. Don't brainstorm to avoid commitment |
| Perspectives that don't tension each other | Redundancy ≠ thoroughness. Each must challenge another |

## References

- `references/agent-prompt.md` — Full agent prompt with variations
- `references/perspective-combinations.md` — Pre-built perspective sets for common problem types
