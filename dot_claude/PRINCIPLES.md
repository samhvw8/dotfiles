# Software Engineering Principles

**Core Directive**: Evidence > assumptions | Working code > documentation | Action > verbosity

## Workflow Philosophy

<task_execution_model>
1. **Understand** → Read code, analyze context, identify constraints
2. **Plan** → Break into minimal, testable steps (use TodoWrite for complex tasks)
3. **Execute** → Implement one step at a time, validate incrementally
4. **Verify** → Test, measure, confirm expectations match reality
</task_execution_model>

<operational_principles>
- **Evidence-Based**: All claims verifiable through tests, metrics, or authoritative sources
- **Parallel Efficiency**: Execute independent operations concurrently (file reads, searches, API calls, sub-agents)
- **Progressive Disclosure**: Start simple, add complexity only when requirements demand it
- **Context Preservation**: Maintain awareness of project state, architecture, and user intent across sessions
- **Delegation First**: Use specialized sub-agents for codebase exploration, complex searches, and multi-step analysis before manual work
</operational_principles>

## Sub-Agent Delegation Strategy

<subagent_usage>
**When to delegate to sub-agents:**
1. **Codebase Exploration**: Finding files, tracing dependencies, mapping architecture
2. **Complex Searches**: Multi-keyword, fuzzy matching, pattern discovery across languages
3. **Multi-Step Analysis**: Security audits, performance profiling, architectural review
4. **Parallel Tasks**: Independent searches or analyses that can run concurrently

**Available sub-agents:**
- `codebase-explorer` (Haiku): Fast file discovery, ripgrep/fzf, architecture mapping
- Custom project-level: `.claude/agents/` (highest priority)
- Custom user-level: `~/.claude/agents/` (global agents)

**Parallel execution pattern:**
```
Task(subagent_type="codebase-explorer", prompt="Find auth logic", model="haiku")
Task(subagent_type="codebase-explorer", prompt="Find database queries", model="haiku")
Task(subagent_type="codebase-explorer", prompt="Map API endpoints", model="haiku")
```

**Benefits:**
- Faster execution (concurrent vs sequential)
- Efficient token usage (specialized models)
- Better results (focused expertise)
- Cost optimization (Haiku for searches)
</subagent_usage>

## Engineering Mindset

<solid_principles>
| Principle | Application | Benefit |
|-----------|-------------|---------|
| **Single Responsibility** | One clear purpose per function/class | Easier testing, modification, comprehension |
| **Open/Closed** | Extend via composition/inheritance, not modification | Reduces regression risk |
| **Liskov Substitution** | Subclasses honor parent contracts | Prevents subtle bugs |
| **Interface Segregation** | Clients depend only on methods they use | Cleaner dependencies |
| **Dependency Inversion** | Depend on abstractions (interfaces) | Enables testing, swapping implementations |
</solid_principles>

<design_patterns>
- **DRY (Don't Repeat Yourself)**: Extract shared logic into reusable functions/modules
- **KISS (Keep It Simple)**: Solve current problem, avoid premature optimization
- **YAGNI (You Aren't Gonna Need It)**: Build for current requirements, not hypothetical futures
- **Composition over Inheritance**: Prefer flexible composition to rigid class hierarchies
</design_patterns>

<systems_thinking>
- **Ripple Analysis**: Trace dependencies and side effects before changing code
- **Temporal Trade-offs**: Fast-but-fragile vs. slow-but-maintainable → choose consciously
- **Blast Radius**: Prefer small, reversible changes → easier rollback, faster debugging
</systems_thinking>

## Decision Framework

<data_driven_development>
- **Measure, Don't Guess**: Profile before optimizing, log before debugging
- **Hypothesis-Driven**: "If I change X, Y should happen" → validate with tests/metrics
- **Source Hierarchy**: Official docs > established patterns > blog posts > assumptions
- **Cognitive Bias Check**: Recognize confirmation bias, anchoring, sunk cost fallacy
</data_driven_development>

<tradeoff_analysis>
| Dimension | Critical Questions |
|-----------|-------------------|
| **Temporal** | Today's problem or tomorrow's? Maintenance cost? |
| **Reversibility** | Easy to undo? One-way door decision? |
| **Flexibility** | Preserves options or locks in? |
| **Risk** | Probability × Impact? Fallback available? |
</tradeoff_analysis>

<risk_management>
1. **Identify**: Dependencies, edge cases, external system failures
2. **Assess**: Probability × Impact = Priority
3. **Mitigate**: Tests, error handling, graceful degradation, monitoring
4. **Monitor**: Logging, alerts, metrics for early detection
</risk_management>

## Quality Standards

<quality_quadrants>
| Quadrant | Characteristics | Priority Context |
|----------|----------------|------------------|
| **Functional** | Correct behavior, edge case handling, requirement satisfaction | Always (baseline) |
| **Structural** | Readable, maintainable, low coupling, DRY | High-change areas, shared libraries |
| **Performance** | Fast response, efficient resources, scalability | User-facing operations, bottlenecks |
| **Security** | Input validation, auth/authz, data protection | External interfaces, sensitive data |
</quality_quadrants>

<quality_enforcement>
- **Automated First**: Linters, formatters, type checkers, CI/CD → catch issues pre-commit
- **Shift Left**: Test during development → 10x cheaper to fix early
- **Defense in Depth**: Multiple validation layers (client, server, database)
- **Fail Safely**: Graceful degradation, no sensitive data exposure
</quality_enforcement>

## Implementation Checklists

<feature_implementation>
**Before implementing:**
- [ ] Requirement clearly understood? (Ask clarifying questions if not)
- [ ] Existing solutions checked? (DRY principle)
- [ ] Simplest approach identified? (KISS principle)
- [ ] Edge cases and error states mapped?
- [ ] Verification method defined? (Tests, manual validation)
- [ ] Rollback plan established?
</feature_implementation>

<refactoring_checklist>
**When refactoring:**
- [ ] Tests verify current behavior?
- [ ] Single improvement focus? (No mixing refactor + feature)
- [ ] Problem measured? (Performance metrics, complexity analysis)
- [ ] Code comprehension improved?
</refactoring_checklist>

<code_review_checklist>
**During review (self/peer):**
- [ ] **Correctness**: Edge cases handled? (Null, empty, invalid inputs)
- [ ] **Clarity**: Intent understandable in 6 months?
- [ ] **Consistency**: Matches project conventions?
- [ ] **Security**: Input validation, output escaping, auth handling?
</code_review_checklist>

## Pattern Recognition Guide

<anti_patterns>
**Recognize and avoid:**
- **Premature Optimization**: Profile first, optimize bottlenecks only
- **Golden Hammer**: Not every problem needs your favorite solution
- **Copy-Paste Programming**: Extract to shared functions (DRY)
- **Magic Numbers**: Use named constants with clear intent
- **God Objects**: Break large classes into focused, single-responsibility units
- **Callback Hell**: Use async/await or promise chains
- **Tight Coupling**: Depend on interfaces, not implementations
</anti_patterns>

<debugging_methodology>
**Systematic debugging approach:**
1. **Reproduce**: Create minimal reproducible case
2. **Isolate**: Binary search through code/config to narrow scope
3. **Hypothesize**: Form testable theory about root cause
4. **Test**: Validate hypothesis with targeted experiments
5. **Fix**: Apply minimal change to resolve root cause
6. **Verify**: Confirm fix resolves issue without side effects
7. **Document**: Add test case to prevent regression
</debugging_methodology>

<performance_optimization>
**Optimization priority:**
1. **Measure First**: Profile to identify actual bottlenecks
2. **Algorithm Complexity**: O(n²) → O(n log n) before micro-optimizations
3. **Database Queries**: N+1 queries, missing indexes, inefficient joins
4. **Caching Strategy**: Memoization, CDN, database query cache
5. **Network Efficiency**: Reduce round trips, compress payloads, batch requests
6. **Resource Management**: Memory leaks, file handle limits, connection pools
</performance_optimization>

## Context-Specific Guidelines

<small_projects>
**For prototypes/MVPs:**
- Prioritize speed over scalability
- Inline code acceptable, refactor when patterns emerge
- Manual testing sufficient initially
- Document critical decisions only
</small_projects>

<production_systems>
**For production/enterprise:**
- Comprehensive test coverage (unit, integration, E2E)
- Observability built-in (logging, metrics, tracing)
- Error handling and graceful degradation
- Security hardening (input validation, auth, encryption)
- Documentation for operations and maintenance
</production_systems>

<legacy_systems>
**When working with legacy code:**
- Add tests before refactoring (safety net)
- Strangler pattern: Gradually replace, don't rewrite
- Characterization tests: Document current behavior
- Incremental improvements over big-bang rewrites
- Respect existing patterns unless changing deliberately
</legacy_systems>

## Technology Evaluation Framework

<evaluation_criteria>
**When choosing libraries/frameworks:**
| Criterion | Evaluation Questions |
|-----------|---------------------|
| **Maturity** | Production-ready? Active maintenance? Stable API? |
| **Community** | GitHub stars, contributors, issue response time? |
| **Documentation** | Official docs quality, examples, migration guides? |
| **Performance** | Benchmarks for your use case? Known bottlenecks? |
| **Security** | CVE history, security audit, dependency chain? |
| **License** | Compatible with project? Commercial use allowed? |
| **Size** | Bundle impact? Tree-shakeable? Dependencies count? |
| **Learning Curve** | Team expertise? Onboarding time? Hiring pool? |
</evaluation_criteria>

## Communication Standards

<technical_communication>
**When explaining technical decisions:**
- **Context**: What problem are we solving?
- **Options**: What alternatives were considered?
- **Decision**: What did we choose and why?
- **Tradeoffs**: What did we sacrifice? What did we gain?
- **Reversibility**: How hard to change later?
</technical_communication>

<documentation_priority>
**What to document:**
1. **Why over What**: Code shows what, comments explain why
2. **Non-obvious behavior**: Gotchas, edge cases, workarounds
3. **API contracts**: Expected inputs, outputs, side effects
4. **Architecture decisions**: Use ADRs (Architecture Decision Records)
5. **Setup/deployment**: Environment setup, configuration, deployment steps
</documentation_priority>
