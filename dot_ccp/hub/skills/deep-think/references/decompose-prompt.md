# Decomposition Agent Prompts

## Standard Decomposition Agent

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

## Strategy Definitions

### Functional
"Decompose by capability or responsibility. What are the distinct functional areas? Each component should own one coherent set of behaviors."

### Temporal
"Decompose by sequence and dependency. What must happen first, second, third? Focus on ordering, prerequisites, and the critical path."

### Risk
"Decompose by uncertainty and difficulty. Separate what's known from unknown, easy from hard. Group by confidence level."

### Data-Flow
"Decompose by information movement. What data originates where, flows to where, and transforms how? Boundaries are where data changes shape."

### User-Journey
"Decompose by user experience. What does the user do step by step? Each component is a stage in their journey."

### Failure-Mode
"Decompose by what can go wrong. What are the independent failure domains? Each component groups related failure modes."

### Interface-First
"Decompose by contracts between pieces. Don't define the pieces first — define the interfaces, then let the pieces emerge from what lives on each side."

## Customization

- **For technical systems:** prefer Functional + Data-Flow + Risk
- **For projects/plans:** prefer Temporal + Risk + Functional
- **For products:** prefer User-Journey + Functional + Risk
- **For debugging complex failures:** prefer Failure-Mode + Data-Flow + Temporal
