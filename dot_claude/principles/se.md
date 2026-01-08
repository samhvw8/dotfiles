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
| Modularity | Simple parts, clean interfaces | One function = one job |
| Composition | Programs connect to programs | stdin/stdout, pipes, APIs |
| Separation | Policy ≠ mechanism | Config separate from logic |
| Parsimony | Small programs preferred | Split when >300 LOC |

### Design

| Law | Rule | Apply |
|-----|------|-------|
| Clarity | Clarity > cleverness | Readable beats elegant |
| Simplicity | Complexity only when proven necessary | YAGNI by default |
| Transparency | Visible = debuggable | Log state transitions |
| Representation | Smart data, dumb code | Data structures over algorithms |

### Behave

| Law | Rule | Apply |
|-----|------|-------|
| Least Surprise | Do what users expect | Follow conventions |
| Silence | No output when nothing to say | Errors only on stderr |
| Repair | Fail fast, fail loud | Crash > corrupt state |
| Robustness | Transparency + simplicity | Handle known failures gracefully |

### Evolve

| Law | Rule | Apply |
|-----|------|-------|
| Economy | Programmer time > machine time | Optimize for humans first |
| Generation | Programs write programs | Codegen, scaffolds, macros |
| Optimization | Working first, fast second | Profile before optimize |
| Diversity | No "one true way" | Right tool for the job |
| Extensibility | Future arrives fast | Design for extension points |

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
