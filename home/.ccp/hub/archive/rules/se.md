# Software Engineering Principles

Evidence over assumptions. Working code over documentation. Simplicity over
cleverness.

## Verifiable goals

The useful move is turning a vague request into something you can check. Do this
before writing code, not after.

| Request | Verifiable goal |
|---------|-----------------|
| "Add validation" | Write tests for the invalid inputs, then make them pass |
| "Fix the bug" | Write a test that reproduces it, then make it pass |
| "Refactor X" | Tests pass before and after |
| "Make it faster" | Measure first — you need a number to beat |

For anything multi-step, state the plan as steps with their checks:

```
1. [step] -> verify: [check]
2. [step] -> verify: [check]
```

If success criteria are too weak to iterate against ("make it work"), ask before
coding rather than guessing.

## Loop

Understand → Plan → Execute → Verify → Iterate. Read the code and trace the
dependencies before changing them. Change one thing at a time. Confirm behavior
matches intent before claiming it does — and if a test fails, say so with the
output.

## Decision framing

| Dimension | Ask |
|-----------|-----|
| Reversibility | One-way door? Get more data first |
| Blast radius | Can this roll back cleanly? Ship small if not |
| Temporal | Debt now versus maintenance later — which is actually cheaper? |
| Evidence | Measured or assumed? Profile before optimizing |

## Risk

Identify what can fail (dependencies, edge cases, external services), mitigate what
matters (tests, error handling, graceful degradation), and make failures visible
(logs, alerts) rather than silent. Crashing beats corrupting.

## Related

- [surgical-changes.md](surgical-changes.md) — scope discipline
- [cognitive-framework.md](cognitive-framework.md) — frameworks for hard calls
