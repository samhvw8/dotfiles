---
plan_id: PLAN-YYYYMMDD-HHMM-{component-slug}
title: [Component Name]
created: YYYY-MM-DD HH:MM
status: draft
author: Claude Code
phase: planning
plan_type: child
parent_plan: PLAN-YYYYMMDD-HHMM-{parent-slug}
dependencies: []  # List plan IDs that must complete first
complexity: low | medium  # Never high - decompose if high
estimated_duration: [X days] (target: 1-3 days)
---

# 🗺️ Child Implementation Plan: [Component Name]

## Summary
[2-3 lines: what this component does, how it fits in parent feature]

## 🔗 Parent Feature Context

**Parent Plan:** [PLAN-YYYYMMDD-HHMM-parent]
**Role in Feature:** [How this component contributes to overall feature]
**Integration Points:** [What other children this connects to]

## 📊 Complexity Assessment

**Files Modified:** [N] (must be ≤ 5)
**Estimated Time:** [N] days (must be ≤ 3)
**Risk Level:** [Low/Medium]
**Dependencies:** [List other child plans that must complete first]

## 🎯 Component Boundaries

**Responsibilities:**
- Responsibility 1: [What this component owns]
- Responsibility 2: [Clear, focused scope]

**NOT Responsible For:** (to avoid scope creep)
- [What other components handle]
- [Clear boundaries]

**Inputs:**
```typescript
// What this component receives
interface ComponentInput {
  field1: string
  field2: number
}
```

**Outputs:**
```typescript
// What this component produces
interface ComponentOutput {
  result: string
  status: 'success' | 'error'
}
```

## 🏗️ Component Architecture

[Simple ASCII diagram of this component only]

```
┌─────────────────────────────────────┐
│      [Component Name]               │
│  ┌──────────────────────────────┐   │
│  │   Input Layer               │   │
│  │   (validation, parsing)      │   │
│  └──────────┬───────────────────┘   │
│             │                        │
│  ┌──────────▼───────────────────┐   │
│  │   Business Logic             │   │
│  │   (core functionality)       │   │
│  └──────────┬───────────────────┘   │
│             │                        │
│  ┌──────────▼───────────────────┐   │
│  │   Output Layer               │   │
│  │   (formatting, response)     │   │
│  └──────────────────────────────┘   │
└─────────────────────────────────────┘
```

## 📐 Data Structures

### Interfaces (Design Only - NOT Implementation)

```typescript
// Core types for this component
interface ComponentState {
  // State shape
}

interface ComponentConfig {
  // Configuration shape
}

// Database entities (if any)
interface DatabaseEntity {
  id: string
  // fields
}
```

### Database Changes

**Tables to Create:**
- `table_name`: Purpose, key fields, indices

**Tables to Modify:**
- `existing_table`: Column to add/modify, reason

**Migrations:**
```sql
-- Migration pseudo-code, NOT production SQL
ALTER TABLE users ADD COLUMN new_field VARCHAR(255);
CREATE INDEX idx_new_field ON users(new_field);
```

## 📁 File Changes

**New:** [N] files (must be ≤ 3 for low complexity)
**Modified:** [N] files (must be ≤ 2 for low complexity)
**Deleted:** 0 (prefer deprecation)

### New Files

1. `src/components/[component-name]/index.ts` (~50 lines)
   - **Purpose:** Main component entry point
   - **Responsibility:** Export public API
   - **Exports:** `ComponentClass`, `componentConfig`
   - **Dependencies:** `./core`, `./types`, `shared/utils`

2. `src/components/[component-name]/core.ts` (~100 lines)
   - **Purpose:** Core business logic
   - **Responsibility:** Implement component behavior
   - **Exports:** `CoreClass`, `coreFunction`
   - **Dependencies:** `./types`, `external-lib`

3. `src/components/[component-name]/types.ts` (~30 lines)
   - **Purpose:** Type definitions
   - **Responsibility:** Define interfaces and types
   - **Exports:** All types and interfaces

### Modified Files

1. `src/shared/registry.ts`
   - **Changes:** Register new component in service registry
   - **Lines:** Add 3-5 lines around line [X]
   - **Impact:** Enables dependency injection of component

2. `src/config/features.ts`
   - **Changes:** Add feature flag for component
   - **Lines:** Add 2 lines to feature config
   - **Impact:** Allows toggling component on/off

## 🔢 Implementation Steps

### Step 1: Create Type Definitions
**Task:** Define all interfaces and types for component

**Files:**
- `src/components/[component-name]/types.ts` (new)

**Design Notes:**
- Define input/output contracts FIRST
- Keep interfaces minimal (YAGNI)
- Document non-obvious types

**Logic Flow:**
```
1. Define ComponentInput interface
2. Define ComponentOutput interface
3. Define ComponentState interface
4. Export all types
```

**Verification:**
- [ ] File compiles with no TypeScript errors
- [ ] Types exported correctly
- [ ] Interfaces match contracts in parent plan

**Time Estimate:** 15 minutes

### Step 2: Implement Core Logic
**Task:** Build main component functionality

**Files:**
- `src/components/[component-name]/core.ts` (new)

**Design Notes:**
- Single Responsibility: [What this does ONLY]
- Error handling: [Strategy]
- Edge cases: [List critical cases]

**Logic Flow:**
```
1. Receive input (validated)
2. Apply business logic:
   a. Transform data
   b. Apply rules
   c. Calculate result
3. Handle errors gracefully
4. Return output (formatted)
```

**Verification:**
- [ ] Core function works with valid input
- [ ] Handles edge cases correctly
- [ ] Errors are caught and formatted
- [ ] No side effects (pure function if possible)

**Time Estimate:** 90 minutes

### Step 3: Create Public API
**Task:** Build entry point that exposes component

**Files:**
- `src/components/[component-name]/index.ts` (new)

**Design Notes:**
- Exports only what's needed (minimize public surface)
- Re-export types for consumer convenience
- No implementation logic here

**Logic Flow:**
```
1. Import core functionality
2. Import types
3. Re-export public API
4. Hide internal implementation
```

**Verification:**
- [ ] Exports work correctly
- [ ] Internal details are hidden
- [ ] Easy to import and use

**Time Estimate:** 15 minutes

### Step 4: Integrate with Registry
**Task:** Register component in dependency injection container

**Files:**
- `src/shared/registry.ts` (modified)
- `src/config/features.ts` (modified)

**Design Notes:**
- Follow existing registration pattern
- Add feature flag for safety
- Document configuration options

**Logic Flow:**
```
1. Import component
2. Add to registry with key
3. Configure dependencies
4. Add feature flag
```

**Verification:**
- [ ] Component accessible via registry
- [ ] Feature flag works (on/off)
- [ ] Dependencies injected correctly

**Time Estimate:** 20 minutes

### Step 5: Add Unit Tests
**Task:** Test all component functionality

**Files:**
- `src/components/[component-name]/core.test.ts` (new)
- `src/components/[component-name]/index.test.ts` (new)

**Test Coverage:**
- Happy path: Valid input → expected output
- Edge cases: Boundary conditions, empty values
- Error cases: Invalid input → proper error

**Verification:**
- [ ] All tests pass
- [ ] Coverage ≥ 80% of new code
- [ ] Tests are deterministic (no flakiness)

**Time Estimate:** 60 minutes

## 🧪 Test Plan

### Unit Tests

- [ ] **Happy Path**: Valid input produces expected output
  - **Input:** `{ field1: "test", field2: 42 }`
  - **Expected:** `{ result: "success", status: "success" }`
  - **File:** `core.test.ts`

- [ ] **Edge Case - Empty Input**: Handles empty/null gracefully
  - **Input:** `{ field1: "", field2: 0 }`
  - **Expected:** Error or default value
  - **File:** `core.test.ts`

- [ ] **Edge Case - Boundary Values**: Min/max values work
  - **Input:** Extreme values
  - **Expected:** No crash, valid response
  - **File:** `core.test.ts`

- [ ] **Error Case - Invalid Input**: Rejects bad data
  - **Input:** `{ field1: null, field2: -1 }`
  - **Expected:** `Error` with clear message
  - **File:** `core.test.ts`

- [ ] **Error Case - Dependency Failure**: Handles external errors
  - **Input:** Mock dependency throws error
  - **Expected:** Graceful degradation or error
  - **File:** `core.test.ts`

### Integration Tests

- [ ] **Integration with Registry**: Component resolves correctly
  - **Scenario:** Request component from DI container
  - **Expected:** Component instance with dependencies
  - **File:** `integration.test.ts`

- [ ] **Integration with Parent Feature**: Contracts match
  - **Scenario:** Call component from parent context
  - **Expected:** Input/output match parent expectations
  - **File:** `feature-integration.test.ts`

### Manual Tests

- [ ] **Manual Test 1**: Visual/functional verification
  - **Steps:**
    1. Start application
    2. Trigger component via [method]
    3. Verify output in [location]
  - **Expected:** Component works in real environment

## ⚠️ Risks & Mitigations

### Risk 1: Dependency on External Service
**Probability:** Medium
**Impact:** Medium
**Mitigation:** Add circuit breaker, implement fallback, cache responses
**Detection:** Monitor error rates, set up alerts
**Contingency:** Use cached data, graceful degradation

### Risk 2: Performance Bottleneck
**Probability:** Low
**Impact:** Medium
**Mitigation:** Profile early, optimize critical paths, add caching
**Detection:** Load tests, APM monitoring
**Contingency:** Implement async processing, add queue

### Risk 3: Integration Contract Mismatch
**Probability:** Low
**Impact:** High (blocks other children)
**Mitigation:** Validate contracts against parent plan, write contract tests
**Detection:** Integration tests fail
**Contingency:** Add adapter layer, negotiate contract change with parent

## 🔄 Rollback Plan

**Method:** Git revert (this is a small, contained component)

**Procedure:**
```bash
# Find commits for this child plan
git log --oneline --grep="PLAN-YYYYMMDD-HHMM-{component-slug}"

# Revert in reverse order (most recent first)
git revert <commit-hash-5>  # Tests
git revert <commit-hash-4>  # Integration
git revert <commit-hash-3>  # Public API
git revert <commit-hash-2>  # Core logic
git revert <commit-hash-1>  # Types

# Verify
npm run build && npm test
```

**Verification After Rollback:**
- [ ] Application builds successfully
- [ ] All tests pass (excluding new tests)
- [ ] No import errors (component removed from registry)
- [ ] Parent feature still works (other children unaffected)

## ✅ Success Criteria

- [ ] All implementation steps completed
- [ ] All unit tests pass (≥ 80% coverage)
- [ ] All integration tests pass
- [ ] Manual test successful
- [ ] Code builds with no errors
- [ ] No new linting warnings
- [ ] Contracts match parent plan expectations
- [ ] Performance acceptable (no degradation)
- [ ] Ready for integration with sibling components

## 📝 Implementation Notes

**Critical Considerations:**
- [Important constraint or decision]
- [Gotcha or tricky part]

**References:**
- Parent Plan: `docs/plans/PLAN-YYYYMMDD-HHMM-{parent-slug}.md`
- Related Child Plan: [If any]
- External Docs: [If any]

**Assumptions:**
- [Assumption 1]
- [Assumption 2]

**Future Improvements:** (Out of scope for this plan)
- [Nice-to-have 1]
- [Optimization 2]

---

**Status:** Draft
**Last Updated:** YYYY-MM-DD HH:MM
**Next Action:** Review and approve, then begin implementation
