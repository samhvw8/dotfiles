---
name: deep-think
description: "Unified heavy thinking orchestrator (also known as 'heavy think'). Classifies problem type → dispatches to the right parallel thinking pattern. Modes: brainstorm (divergent ideation), solve (verifiable answers), decompose (break complex problems), unstick (reframe blockages). All modes use parallel agents with model=opus for maximum reasoning depth, then YOU synthesize. Actions: think deeply, brainstorm, decompose, solve, unstick, analyze. Keywords: deep think, heavy think, heavy thinking, think harder, brainstorm, decompose, break down, stuck, unstick, solve, parallel thinking, multi-perspective, think about this, explore deeply, reason about, analyze deeply, heavyskill, heavy-brainstorm. Use when: user says 'deep think', 'heavy think', 'think harder', 'brainstorm deeply', or any problem deserving more than shallow first-pass thinking — strategic decisions, hard technical problems, complex decomposition, creative exploration, feeling stuck. Do NOT use for: simple lookups, mechanical tasks, clear next steps, tasks needing implementation not thinking."
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

Parallel perspective agents explore the same problem from different worldviews. Insight emerges from collision, not consensus.

### Stage 1: Frame

```
PROBLEM: [One sentence — what are we trying to figure out?]
CONSTRAINTS: [What's fixed? Budget, timeline, team size, tech stack...]
SUCCESS LOOKS LIKE: [How will we know a good answer when we see it?]
MODE: scan (3 agents, breadth-first) | deep (3-5 agents, depth-first)
```

### Stage 2: Design Perspectives

Choose 3-5 perspectives that **collide productively** — tension, not redundancy.

| Perspective | Explores |
|-------------|----------|
| First Principles | What's actually true vs assumed? |
| User Advocate | What does the person experiencing this actually need? |
| Contrarian | What if the obvious answer is wrong? |
| Futurist | What's true in 3 years that isn't today? |
| Operator | What breaks at scale? Maintenance burden? |
| Economist | Incentives? Who pays, who benefits? |
| Minimalist | 10% effort that captures 80% value? |
| Historian | What's been tried? Why did it fail/succeed? |

Rules: MUST include ≥1 challenger. MUST span ≥2 of: user, business, technical, temporal.

See `references/perspective-combinations.md` for pre-built sets by scenario.

### Stage 3: Spawn Parallel Agents

Launch all in **one message**, `model="opus"`. Each gets the same problem, distinct lens.

See `references/brainstorm-agent-prompt.md` for full prompt. Core structure:

```
You are a brainstorming agent exploring from one specific perspective.

PROBLEM: {problem} | CONSTRAINTS: {constraints}
YOUR PERSPECTIVE: {perspective_name} — {perspective_description}

Think from this perspective ONLY. Find what ONLY this lens reveals.

1. Challenge 2-3 assumptions most people take for granted
2. What is the REAL problem underneath the stated one?
3. Generate 3-5 ideas — push past the obvious first answer
4. Pick strongest. Stress-test: what breaks? what scales?
5. Second-order effects: if this succeeds, then what? And then what?

Output: ## Core Insight → ## The Real Problem → ## Ideas → ## Second-Order Effects → ## Hidden Risk → ## Provocation
```

### Stage 4: Synthesize (YOU — never delegate)

1. **Map** — territory each perspective covered, overlap vs divergence
2. **Collide** — where perspectives directly contradict (deepest insight lives here)
3. **Extract surprises** — what exists in NO single output but emerges from combining
4. **Second-order cascade** — trace strongest ideas: then what? and then what?
5. **Converge** — landscape → key insights (ranked by surprise) → tensions worth holding → recommendation → what to kill

### Stage 5 (Optional): Stress Test

For high stakes, spawn 1-2 agents to attack synthesis: Red team ("find every way this fails") or Pre-mortem ("it's 1 year later and this failed — what happened?"). See `references/brainstorm-agent-prompt.md` for templates.

---

## Mode 2: Solve

K independent agents solve the same verifiable problem from scratch. Deliberation audits reasoning chains and forges new paths from fragments — it produces correct answers absent from ALL trajectories in ~50% of cases.

### When to use

- Mathematical reasoning, algorithmic/competition problems, complex logical deduction
- Any verifiable task where confidence < ~70%
- NOT for subjective, preference-oriented, or easy (>90% confidence) tasks

### Stage 1: Parallel Reasoning

Spawn **K independent agents** in a **single message** (parallel). Zero sibling knowledge.

| K | When |
|---|------|
| 3 | Standard — most problems |
| 5 | High-stakes — competition math, critical correctness |

```
Solve this problem step by step. Show complete reasoning and arrive at a final answer.
Use whatever approach you find most natural — algebraic, geometric, constructive, brute force, or proof by contradiction.

Problem: {query}

Requirements:
- Reason from first principles, show all work
- Final answer clearly marked
- Math: \boxed{answer} | Code: code block
```

### Stage 2: Memory Cache

1. **Collect** all K outputs
2. **Shuffle** trajectory order (prevents position bias)
3. **Prune** if exceeding token budget — truncate reasoning, preserve final answers

### Stage 3: Sequential Deliberation (YOU — never delegate)

1. **Classify** query type (math / code / logic / multi-step)
2. **Map answer distribution** — what answers appear, how often?
3. **Audit each chain** — logic valid? gaps? sign errors? hidden assumptions?
4. **Cross-validate** — do independent approaches confirm the same result?
5. **Apply critical skepticism:**
   - Majority is signal, not proof
   - Minority answer with tighter logic may be correct
   - All may be wrong — re-derive from fragments if needed
6. **Synthesize** the definitive answer

### Stage 4: Output

Final answer only — no meta-analysis unless asked. Math: `\boxed{answer}` | Code: code block.

### Iterative Deliberation

Trigger when first deliberation produces low confidence or fundamental disagreement. Concatenate deliberation as additional trajectory, re-run Stage 3. **Max 2-3 iterations** — performance degrades beyond that.

See `references/compute.md` for cost analysis and K selection. See `references/tensions.md` for design tensions.

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

- `references/brainstorm-agent-prompt.md` — Brainstorm + stress test agent prompts
- `references/perspective-combinations.md` — Pre-built perspective sets by scenario
- `references/compute.md` — Cost analysis, K selection, non-monotonic performance
- `references/tensions.md` — Design tensions: consensus vs minority, width vs depth
- `references/landscape.md` — How Solve mode compares to Best-of-N, Self-Consistency, Forest-of-Thought
- `references/paper-details.md` — HeavySkill paper methodology details
- `references/decompose-prompt.md` — Full decomposition agent prompts with variants
- `references/unstick-prompt.md` — Full unsticking agent prompts with variants
- Related skills: `problem-solving`, `sequential-thinking`
