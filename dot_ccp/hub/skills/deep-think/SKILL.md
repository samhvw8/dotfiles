---
name: deep-think
description: "Unified heavy thinking orchestrator. Classifies problem type → dispatches to the right parallel thinking pattern. Modes: brainstorm (divergent ideation), solve (verifiable answers), decompose (break complex problems), unstick (reframe blockages). All modes use parallel agents with model=opus for maximum reasoning depth, then YOU synthesize. Actions: think deeply, brainstorm, decompose, solve, unstick, analyze. Keywords: deep think, heavy thinking, think harder, brainstorm, decompose, break down, stuck, unstick, solve, parallel thinking, multi-perspective, think about this, explore deeply, reason about, analyze deeply. Use when: any problem deserving more than shallow first-pass thinking — strategic decisions, hard technical problems, complex decomposition, creative exploration, feeling stuck. Do NOT use for: simple lookups, mechanical tasks, clear next steps, tasks needing implementation not thinking."
---

# Deep Think

Unified orchestrator for heavy thinking. One entry point, four modes — all powered by parallel agents → your synthesis.

**Core principle:** the parallel-agents-→-synthesize pattern is general-purpose. Change what the agents explore, and you get different thinking capabilities from the same engine.

## Dispatch

Classify the problem, pick the mode:

| Signal | Mode | Pattern |
|--------|------|---------|
| "What should we..." / "What are the options" / subjective question | **Brainstorm** | Parallel perspectives → collide → synthesize |
| Verifiable answer exists (math, logic, algorithm) | **Solve** | Parallel solution paths → deliberate → verify |
| "How do we break this down" / too big to tackle | **Decompose** | Parallel decomposition strategies → synthesize best structure |
| "I'm stuck" / every option feels wrong / going in circles | **Unstick** | Parallel reframes → find the frame that unlocks movement |
| Need step-by-step with revision capability | **Analyze** | Sequential thinking (no agents needed) |

When uncertain: **ask the user** which mode fits. Don't guess.

When modes should chain: decompose first → brainstorm on each piece, or unstick → then solve.

---

## Mode 1: Brainstorm

**Invoke skill:** `heavy-brainstorm`

Parallel perspective agents explore the same problem from different worldviews. Insight emerges from collision, not consensus.

See `heavy-brainstorm` skill for full protocol (frame → design perspectives → spawn → synthesize → stress test).

---

## Mode 2: Solve

**Invoke skill:** `heavyskill`

K independent agents solve the same verifiable problem. Deliberation audits reasoning chains and forges new paths from fragments.

See `heavyskill` skill for full protocol (parallel reasoning → memory cache → deliberation → output).

---

## Mode 3: Decompose

Parallel agents each decompose the problem using a **different decomposition strategy**. You synthesize the best structure from their outputs.

### Stage 1: Frame

```
PROBLEM: [What needs to be decomposed?]
WHY DECOMPOSITION IS HARD: [What makes this non-obvious to break down?]
GOAL: [What does a good decomposition enable? Parallel work? Clarity? Prioritization?]
```

### Stage 2: Spawn 3 Decomposition Agents

Launch all in **one message**, `model="opus"`:

| Agent | Strategy | Prompt Focus |
|-------|----------|--------------|
| Functional | By capability/responsibility | "What are the distinct functional areas?" |
| Temporal | By sequence/dependency | "What must happen first, second, third?" |
| Risk | By uncertainty/difficulty | "What's known vs unknown? Easy vs hard?" |

For deeply technical problems, swap in:
| Agent | Strategy | Prompt Focus |
|-------|----------|--------------|
| Data-flow | By information movement | "What data flows where? Where are the boundaries?" |
| User-journey | By user experience | "What does the user do step by step?" |
| Failure-mode | By what can go wrong | "What are the independent failure domains?" |

**Agent prompt template** (see `references/decompose-prompt.md`):

```
You are a decomposition agent. Break down a complex problem using a specific strategy.

PROBLEM: {problem}
CONTEXT: {context}
YOUR STRATEGY: {strategy_name} — {strategy_description}

Decompose this problem using ONLY your assigned strategy. Don't try to be comprehensive — show what your lens uniquely reveals about the problem's structure.

Requirements:
1. Identify 3-7 components/phases/pieces
2. For each: name it, define its scope, identify its inputs/outputs/dependencies
3. Flag which pieces are independent (parallelizable) vs sequential
4. Identify the hardest piece and explain why
5. Name what your decomposition MISSES — what falls between the cracks?

Output:

## Decomposition ({strategy_name})

### Components
1. **[Name]** — [Scope]. Inputs: [X]. Outputs: [Y]. Dependencies: [Z].
2. ...

### Dependency Map
[Which pieces depend on which? What can run in parallel?]

### Hardest Piece
[Which component and why — complexity, unknowns, risk]

### Blind Spots
[What does this decomposition miss or awkwardly split?]
```

### Stage 3: Synthesize

You compare all decompositions yourself:

1. **Overlay** — where do all strategies agree on boundaries? Those are real seams.
2. **Conflict** — where do strategies split things differently? These reveal design decisions, not facts.
3. **Blind spots** — what did each strategy miss? The union of blind spots shows hidden complexity.
4. **Compose** — build the final decomposition by stealing the best cuts from each strategy.

Output:
```
## Synthesized Decomposition

### Components (with source)
1. **[Name]** — [Scope]. Source: [which strategy revealed this most clearly]
2. ...

### Execution Order
[What's parallel, what's sequential, what's the critical path]

### Key Design Decisions
[Where decomposition strategies disagreed — and which cut you chose and why]

### Hidden Complexity
[What emerged from combining decompositions that no single one showed]
```

---

## Mode 4: Unstick

Parallel agents each **reframe the problem** from a different angle. The goal: find the frame that transforms "stuck" into "obvious next step."

### Stage 1: Name the Stuckness

```
PROBLEM: [What are you trying to do?]
WHY STUCK: [What's blocking? Every option feels wrong? Going in circles? Can't see the next step?]
WHAT YOU'VE TRIED: [What approaches have been attempted or considered?]
```

### Stage 2: Spawn 3 Reframe Agents

Launch all in **one message**, `model="opus"`:

| Agent | Reframe Strategy |
|-------|-----------------|
| Inversion | "What if the opposite of your assumption is true?" |
| Abstraction Shift | "What if you're solving the wrong level of the problem? Go up one level or down one level." |
| Constraint Flip | "What if the thing you think is fixed is actually variable, and vice versa?" |

For deeper stuck-ness, add:
| Agent | Reframe Strategy |
|-------|-----------------|
| Adjacent Domain | "What field outside yours has solved an analogous problem?" |
| First Principles | "Strip everything away — what's actually, provably true here?" |

**Agent prompt template** (see `references/unstick-prompt.md`):

```
You are an unsticking agent. Someone is stuck on a problem. Your job: reframe it so movement becomes possible.

PROBLEM: {problem}
WHY THEY'RE STUCK: {stuck_reason}
WHAT THEY'VE TRIED: {attempts}
YOUR REFRAME STRATEGY: {strategy_name} — {strategy_description}

You are not solving the problem. You are changing how they SEE it. A good reframe makes the next step obvious.

Requirements:
1. Name the assumption or frame that's creating the stuckness
2. Apply your reframe strategy to shift it
3. Show what the problem looks like after reframing
4. Suggest 1-2 concrete next steps that are obvious in the new frame
5. Name the risk of your reframe — what does it miss or oversimplify?

Output:

## The Trap
[What assumption/frame is keeping them stuck?]

## The Reframe
[Apply your strategy — how does the problem change?]

## After Reframing
[Describe the problem in the new frame. What's now obvious?]

## Next Steps
[1-2 concrete actions that follow naturally from the new frame]

## Reframe Risk
[What does this new frame miss or distort?]
```

### Stage 3: Synthesize

1. **Which reframe unlocks movement?** — Not which is cleverest, but which makes the next step most obvious.
2. **Can reframes combine?** — Sometimes two reframes together reveal more than either alone.
3. **What's the actual trap?** — If multiple agents identified the same underlying assumption, that's the real blockage.
4. **Recommend** — state the reframe that works, the next concrete step, and what to watch out for.

---

## Mode 5: Analyze

No agents needed — apply `sequential-thinking` skill directly.

Use when the problem needs step-by-step decomposition with revision capability, not parallel exploration.

Invoke: `Skill("sequential-thinking")`

---

## Chaining Modes

Complex problems often need multiple modes in sequence:

| Chain | When |
|-------|------|
| Unstick → Brainstorm | Stuck on direction → once unblocked, explore options |
| Decompose → Brainstorm (per piece) | Big problem → break down → ideate on each component |
| Brainstorm → Solve | Explore options → verify the winning approach rigorously |
| Decompose → Solve (per piece) | Break down → solve each sub-problem with full rigor |
| Unstick → Decompose | Can't see the structure → reframe → then decompose clearly |

State the chain upfront: "I'll decompose first, then brainstorm on the hardest piece."

## Anti-Patterns

| Pattern | Fix |
|---------|-----|
| Using deep-think for simple tasks | If you can answer in 30 seconds, just answer |
| Picking a mode without classifying | Always match signal → mode first |
| Skipping synthesis, just listing agent outputs | YOU must synthesize — the value is in the collision |
| Running all modes "to be thorough" | Pick the mode that fits. Chain only when necessary |
| Decomposing when you're actually stuck | Stuck ≠ complex. Stuck means you need a reframe, not more structure |
| Brainstorming when you should be solving | If there's a verifiable answer, solve. Don't ideate around it |

## References

- `references/decompose-prompt.md` — Full decomposition agent prompts with variants
- `references/unstick-prompt.md` — Full unsticking agent prompts with variants
- Related skills: `heavy-brainstorm`, `heavyskill`, `problem-solving`, `sequential-thinking`
