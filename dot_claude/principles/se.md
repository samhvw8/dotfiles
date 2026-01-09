# Software Engineering Principles

Evidence over assumptions. Working code over documentation. Simplicity over cleverness.

## Core Loop

```
Understand → Plan → Execute → Verify → Iterate
```

| Phase | Action |
|-------|--------|
| Understand | Read code, trace dependencies, identify constraints |
| Plan | Minimal testable steps; TodoWrite for complex tasks |
| Execute | One change at a time, validate incrementally |
| Verify | Test, measure, confirm behavior matches intent |

## Unix Philosophy (17 Laws)

### Build

| Law | Rule | Apply |
|-----|------|-------|
| Modularity | Simple parts, clean interfaces | <500 LOC per unit; AI-safe modification scope |
| Composition | Programs connect to programs | APIs, pipes; AI chains tools same way |
| Separation | Policy ≠ mechanism | Spec/config separate; change spec → regenerate code |
| Parsimony | Small programs preferred | Intent clarity > line count; AI navigates if structure clear |

### Design

| Law | Rule | Apply |
|-----|------|-------|
| Clarity | Clarity > cleverness | Explicit intent; AI parses readable, fails on clever |
| Simplicity | Complexity only when proven | YAGNI; AI regenerates simple faster |
| Transparency | Visible = debuggable | Expose state; AI reasons on visible decision points |
| Representation | Smart data, dumb code | Types as spec; AI reads schema, ignores comments |

### Behave

| Law | Rule | Apply |
|-----|------|-------|
| Least Surprise | Do what users expect | Conventions; AI learns patterns, not exceptions |
| Silence | No output unless meaningful | Errors on stderr; clean signal for AI parsing |
| Repair | Fail fast, fail loud | Crash > corrupt; AI detects explicit failures |
| Robustness | Transparency + simplicity | Handle known failures; AI predicts from visible paths |

### Evolve

| Law | Rule | Apply |
|-----|------|-------|
| Economy | Iteration speed > polish | Spec clarity matters; regeneration cost → 0 |
| Generation | AI generates from spec | Spec = source of truth; code = disposable artifact |
| Optimization | Generate variants, measure | AI explores options in parallel |
| Diversity | Right tool for the job | AI adapts to any stack |
| Extensibility | Design for replaceability | AI can rewrite modules if isolated |

### AI-Era Heuristics

| Check | Action |
|-------|--------|
| AI can't parse intent | Refactor for explicitness |
| AI can't modify in isolation | Reduce coupling |
| Spec unclear | Invest in spec before code |
| Clever one-liners | Replace with explicit branching |
| Implicit conventions | Document in types/spec |
| Comments as spec | Use types + tests instead |

## SOLID (OOP)

| Principle | Rule |
|-----------|------|
| SRP | One reason to change per class |
| OCP | Extend via composition, not modification |
| LSP | Subtypes honor parent contracts |
| ISP | Clients depend only on what they use |
| DIP | Depend on abstractions, not concretions |

## Design Heuristics

```
DRY   → Extract when pattern repeats 3+ times
KISS  → Solve today's problem, not tomorrow's
YAGNI → Delete speculative code
Composition > Inheritance → Prefer has-a over is-a
```

## Decision Making

| Dimension | Question |
|-----------|----------|
| Reversibility | One-way door? Get more data first |
| Blast Radius | Can rollback quickly? Ship small |
| Temporal | Tech debt now vs maintenance later? |
| Evidence | Measured or assumed? Profile first |

## Risk Protocol

```
Identify → Assess (P × I) → Mitigate → Monitor
```

- **Identify**: Dependencies, edge cases, external failures
- **Mitigate**: Tests, error handling, graceful degradation
- **Monitor**: Logs, alerts, metrics for early detection
