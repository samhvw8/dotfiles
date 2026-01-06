# Software Engineering Principles

Evidence over assumptions. Working code over documentation. Action over verbosity.

## Workflow

Understand → Plan → Execute → Verify

<execution>
1. **Understand**: Read code, analyze context, identify constraints
2. **Plan**: Minimal testable steps; use TodoWrite for complex tasks
3. **Execute**: One step at a time, validate incrementally
4. **Verify**: Test, measure, confirm reality matches expectations
</execution>

<operational_rules>
- Evidence-based: Claims verified by tests, metrics, or authoritative sources
- Parallel execution: Independent operations run concurrently (file reads, searches, API calls, Task tool)
- Progressive disclosure: Simple first, complexity only when required
- Context preservation: Track project state, architecture, user intent
- Delegation first: Use Task tool with specialized sub-agents before manual work
</operational_rules>

## SOLID

| Principle | Rule | Benefit |
|-----------|------|---------|
| SRP | One purpose per function/class | Testable, modifiable |
| OCP | Extend via composition, not modification | No regressions |
| LSP | Subclasses honor parent contracts | No subtle bugs |
| ISP | Clients use only what they need | Clean dependencies |
| DIP | Depend on abstractions | Swappable, testable |

## Design Patterns

<patterns>
- **DRY**: Extract shared logic into reusable units
- **KISS**: Solve current problem, no premature optimization
- **YAGNI**: Build for now, not hypothetical futures
- **Composition > Inheritance**: Flexible composition beats rigid hierarchies
</patterns>

## Systems Thinking

<analysis>
- **Ripple**: Trace dependencies and side effects before changes
- **Temporal**: Fast-fragile vs slow-maintainable → choose consciously
- **Blast Radius**: Small reversible changes → easier rollback, faster debug
</analysis>

## Unix Philosophy

| Rule | Principle |
|------|-----------|
| Modularity | Simple parts, clean interfaces |
| Clarity | Clarity > cleverness |
| Composition | Programs connect to programs |
| Separation | Policy ≠ mechanism; interface ≠ engine |
| Simplicity | Add complexity only when necessary |
| Parsimony | Big programs only when proven necessary |
| Transparency | Visible = debuggable |
| Robustness | Child of transparency + simplicity |
| Representation | Knowledge in data, logic stays stupid |
| Least Surprise | Do what users expect |
| Silence | No output when nothing to say |
| Repair | Fail fast, fail loud |
| Economy | Programmer time > machine time |
| Generation | Programs write programs |
| Optimization | Working first, fast second |
| Diversity | No "one true way" |
| Extensibility | Future arrives faster than expected |

## Decision Framework

<data_driven>
- Measure before guess: Profile before optimize, log before debug
- Hypothesis-driven: "Change X → Y happens" → validate
- Source priority: Official docs > patterns > blogs > assumptions
- Bias check: Confirmation, anchoring, sunk cost
</data_driven>

<tradeoffs>
| Dimension | Question |
|-----------|----------|
| Temporal | Today's problem or tomorrow's? Maintenance cost? |
| Reversibility | Easy undo? One-way door? |
| Flexibility | Preserves options or locks in? |
| Risk | Probability × Impact? Fallback? |
</tradeoffs>

<risk_management>
1. Identify: Dependencies, edge cases, external failures
2. Assess: Probability × Impact = Priority
3. Mitigate: Tests, error handling, graceful degradation
4. Monitor: Logging, alerts, metrics → early detection
</risk_management>
