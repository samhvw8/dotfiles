---
name: code-quality
description: "Review, refactor, and debug code with verification before claiming done. Use when responding to review feedback, requesting a review, refactoring or reducing technical debt, root-causing a bug or failing test, or checking work before a merge, commit, or completion claim."
---

# Code Quality

Systematic code improvement through review, refactoring, and debugging with verification gates.

## Module Selection

| Need | Module | Reference |
|------|--------|-----------|
| **Receive Feedback** | Review | `references/code-review-reception.md` |
| **Request Review** | Review | `references/requesting-code-review.md` |
| **Verify Before Claim** | Review | `references/verification-before-completion.md` |
| **Reduce Complexity** | Refactoring | `references/oop-refactoring-catalog.md` |
| **Functional Patterns** | Refactoring | `references/functional-refactoring-patterns.md` |
| **Find Code Smells** | Refactoring | `references/code-smells-reference.md` |
| **Test Strategies** | Refactoring | `references/testing-strategies.md` |
| **Investigate Bugs** | Debugging | `references/systematic-debugging.md` |
| **Trace Root Cause** | Debugging | `references/root-cause-tracing.md` |
| **Add Validation** | Debugging | `references/defense-in-depth.md` |
| **Verify Fix** | Debugging | `references/verification.md` |

---

## Core Principles

**YAGNI, KISS, DRY** - Always honor these.

**Be honest, be brutal, straight to the point, and be concise.**

**Technical correctness over social comfort.** Verify before implementing. Ask before assuming. Evidence before claims.

---

## Code Review

### Receiving Feedback

**Pattern:** READ → UNDERSTAND → VERIFY → EVALUATE → RESPOND → IMPLEMENT

**Rules:**
- ❌ No performative agreement ("You're right!", "Great point!")
- ❌ No implementation before verification
- ✅ Restate requirement, ask questions, push back with reasoning
- ✅ YAGNI check: grep for usage before implementing suggestions

**Sources:**
- Human partner → Implement after understanding
- External reviewer → Verify technically before implementing

### Requesting Review

**When:** After major features, before merge, after complex fixes

**Process:**
1. Get SHAs: `BASE_SHA=$(git rev-parse HEAD~1)`, `HEAD_SHA=$(git rev-parse HEAD)`
2. Dispatch a reviewer with the Agent tool (`deep-reviewer`) or run `/code-review`, passing: WHAT, PLAN, SHAs, DESCRIPTION
3. Fix Critical immediately, Important before proceeding, note Minor

### Verification Gates

Claim a result only after running the command that proves it in this session and reading its output — a claim without that evidence is a guess.

**Gate:** IDENTIFY → RUN → READ → VERIFY → THEN claim

---

## Refactoring

### Mindset

Simplify relentlessly. Preserve behavior religiously. Measure everything.

Every refactoring: small and safe, tested immediately, measurably better.

### Protocol

1. **Assessment** - Baseline metrics, identify smells, classify debt
2. **Safety Net** - Verify test coverage, add characterization tests
3. **Red-Green-Refactor** - Write failing test, minimal pass, improve design
4. **Pattern Application** - SOLID, design patterns, functional transforms
5. **Validation** - Measure improvements, verify behavior preserved

### Code Smells (5 Categories)

1. **Bloaters:** Long Method, Large Class, Long Parameter List
2. **OO Abusers:** Switch Statements, Temporary Field
3. **Change Preventers:** Divergent Change, Shotgun Surgery
4. **Dispensables:** Duplicate Code, Dead Code, Lazy Class
5. **Couplers:** Feature Envy, Inappropriate Intimacy

### Quick Patterns

**OOP:** Extract Method, Inline, Replace Temp with Query, Guard Clauses
**Functional:** Map/Filter/Reduce, Pure Functions, Composition, Immutability

---

## Debugging

### Core Principle

**NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST**

Random fixes waste time and create new bugs.

### The Four Techniques

**1. Systematic Debugging** (`references/systematic-debugging.md`)
- Phase 1: Root Cause Investigation
- Phase 2: Pattern Analysis
- Phase 3: Hypothesis Testing
- Phase 4: Implementation

**2. Root Cause Tracing** (`references/root-cause-tracing.md`)
Trace backward through call stack to find original trigger.

**3. Defense-in-Depth** (`references/defense-in-depth.md`)
Validate at every layer: Entry → Business logic → Environment → Debug

**4. Verification** (`references/verification.md`)
Run command. Read output. Then claim result.

### Quick Reference

```
Bug → systematic-debugging.md (Phase 1-4)
  Error deep in stack? → root-cause-tracing.md
  Found root cause? → defense-in-depth.md
  About to claim success? → verification.md
```

### Red Flags

Stop if thinking:
- "Quick fix for now, investigate later"
- "Just try changing X and see"
- "It's probably X, let me fix that"
- "Should work now" / "Seems fixed"

---

## References

### Code Review
- `references/code-review-reception.md` - Response protocols
- `references/requesting-code-review.md` - Request process
- `references/verification-before-completion.md` - Verification gates

### Refactoring
- `references/oop-refactoring-catalog.md` - Martin Fowler's patterns
- `references/functional-refactoring-patterns.md` - FP transformations
- `references/code-smells-reference.md` - 23 smells, 5 categories
- `references/testing-strategies.md` - Characterization tests, TDD

### Debugging
- `references/systematic-debugging.md` - Four-phase framework
- `references/root-cause-tracing.md` - Call stack analysis
- `references/defense-in-depth.md` - Multi-layer validation
- `references/verification.md` - Verification protocols

---

## Bottom Line

1. **Review:** Technical rigor over social performance
2. **Refactor:** Small, safe, tested, measurable
3. **Debug:** Root cause first, fix once
4. **Always:** Evidence before claims

Verify. Question. Then implement. Evidence. Then claim.
