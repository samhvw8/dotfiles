---
plan_id: PLAN-YYYYMMDD-HHMM-{feature-slug}
title: [Feature Name]
created: YYYY-MM-DD HH:MM
status: draft
author: Claude Code
phase: planning
plan_type: parent
child_plans: []
complexity: high
estimated_duration: [X days across all children]
---

# 🗺️ Parent Implementation Plan: [Feature Name]

## Summary
[2-3 lines: what + why + high-level approach]

## 📊 Complexity Assessment & Decomposition

**Why Decomposed:**
- Files affected: [N] (exceeds 5 file threshold)
- Estimated time: [N] days (exceeds 3 day threshold)
- Multiple domains: [List domains]
- High cognitive load: [Explanation]

**Decomposition Strategy:** [Sequential / Parallel / Hybrid]

## 🏗️ Architecture Overview

[ASCII diagram showing component interaction]

```
┌─────────────────────────────────────────────────────┐
│              Feature: [Feature Name]                │
└─────────────────────────────────────────────────────┘
         │                    │                    │
    ┌────▼────┐         ┌────▼────┐         ┌────▼────┐
    │ Child 1 │         │ Child 2 │         │ Child 3 │
    │ [Name]  │────────▶│ [Name]  │────────▶│ [Name]  │
    └─────────┘         └─────────┘         └─────────┘
         │                    │                    │
         └────────────────────┴────────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │   Shared Layer    │
                    │ (Data/Services)   │
                    └───────────────────┘
```

## 📐 Data Structures

### Core Domain Models

```typescript
// Shared interfaces across all child plans
interface CoreEntity {
  id: string
  // ... essential fields only
}

// Types that define boundaries between components
type ComponentAInput = { /* ... */ }
type ComponentBOutput = { /* ... */ }
```

### Database Schema

**Tables to Add:**
- `table_name`: [Purpose, key fields]

**Tables to Modify:**
- `existing_table`: [What changes, why]

**Migrations:**
1. Migration 1: [Description]
2. Migration 2: [Description]

## 🔗 Integration Points & Contracts

### Integration Point 1: [Name]
**Between**: [Child Plan A] ↔ [Child Plan B]
**Contract:**
```typescript
interface IntegrationContract {
  // Shared interface/API
}
```
**Data Flow:** [How data moves between components]

### Integration Point 2: [Name]
[Same structure]

## 📋 Child Plan Dependencies

```
Execution Flow:

Phase 1 (Parallel):
├── PLAN-YYYYMMDD-HHMM-child-1 (independent)
└── PLAN-YYYYMMDD-HHMM-child-2 (independent)

Phase 2 (Sequential - requires Phase 1):
└── PLAN-YYYYMMDD-HHMM-child-3 (depends on child-1, child-2)

Phase 3 (Final - integration):
└── PLAN-YYYYMMDD-HHMM-child-4 (depends on child-3)
```

### Child Plan 1: [Name]
**Plan ID:** PLAN-YYYYMMDD-HHMM-child-1
**Focus:** [What this child implements]
**Dependencies:** None (can start immediately)
**Estimated Duration:** [X] days
**Key Deliverables:**
- Deliverable 1
- Deliverable 2

### Child Plan 2: [Name]
**Plan ID:** PLAN-YYYYMMDD-HHMM-child-2
**Focus:** [What this child implements]
**Dependencies:** None (can run parallel with child-1)
**Estimated Duration:** [X] days
**Key Deliverables:**
- Deliverable 1
- Deliverable 2

### Child Plan 3: [Name]
**Plan ID:** PLAN-YYYYMMDD-HHMM-child-3
**Focus:** [What this child implements]
**Dependencies:** child-1, child-2 (must complete first)
**Estimated Duration:** [X] days
**Key Deliverables:**
- Deliverable 1
- Deliverable 2

## 🧪 System-Wide Test Plan

**After ALL child plans complete:**

### Integration Tests
- [ ] Integration 1: [Cross-component test]
- [ ] Integration 2: [End-to-end user flow]
- [ ] Integration 3: [Performance test]

### System Tests
- [ ] System test 1: [Full feature validation]
- [ ] System test 2: [Load/stress test]
- [ ] System test 3: [Security scan]

### Manual Acceptance Tests
- [ ] User workflow 1: [Description]
- [ ] User workflow 2: [Description]

## ⚠️ System-Wide Risks

### Risk 1: [Description]
**Probability:** [High/Medium/Low]
**Impact:** [High/Medium/Low]
**Affects:** [Which child plans]
**Mitigation:** [Prevention strategy]
**Detection:** [How we'll know]
**Contingency:** [Response plan]

### Risk 2: Integration Complexity
**Probability:** Medium
**Impact:** High
**Affects:** All child plans
**Mitigation:** Define clear contracts upfront, test interfaces early
**Detection:** Integration tests fail, interface mismatches
**Contingency:** Add adapter layer, refactor contracts

## 🔄 Rollback Strategy

**Feature Flag:** `feature_[feature-name]` (recommended for large features)

**Rollback Procedure:**
```bash
# Option 1: Feature flag toggle (preferred - instant rollback)
# Disable feature via config/admin panel
# No code changes needed

# Option 2: Git revert (if feature flag not used)
git log --oneline | grep "PLAN-YYYYMMDD-HHMM"  # Find all commits
git revert <commit-hash-child-4>  # Revert in reverse order
git revert <commit-hash-child-3>
git revert <commit-hash-child-2>
git revert <commit-hash-child-1>

# Option 3: Partial rollback
# Keep working children, revert problematic child only
```

**Verification After Rollback:**
- [ ] Application starts successfully
- [ ] All existing features work
- [ ] No errors in logs
- [ ] Database consistent (no orphaned data)

## ✅ Feature Success Criteria

**All child plans complete AND:**
- [ ] All system-wide integration tests pass
- [ ] Performance within acceptable range:
  - Response time: < [X]ms
  - Throughput: > [Y] req/s
  - Memory: < [Z]MB increase
- [ ] No security vulnerabilities (OWASP top 10)
- [ ] All child deliverables verified
- [ ] Documentation complete
- [ ] Stakeholder acceptance obtained

## 📊 Progress Tracking

| Child Plan | Status | Progress | Blocked | Completion Date |
|------------|--------|----------|---------|-----------------|
| child-1    | pending | 0%      | No      | -               |
| child-2    | pending | 0%      | No      | -               |
| child-3    | pending | 0%      | No      | -               |
| child-4    | pending | 0%      | No      | -               |

**Overall Progress:** 0% (0/4 children complete)

## 📝 Decision Log

### Decision 1: [Date] - [Decision Title]
**Context:** [Why this decision was needed]
**Options Considered:**
1. Option A: [Pros/Cons]
2. Option B: [Pros/Cons]
**Decision:** [What was chosen]
**Rationale:** [Why]
**Impact:** [Which child plans affected]

### Decision 2: [Date] - [Decision Title]
[Same structure]

---

**Next Steps:**
1. Review and approve this parent plan
2. Create child plan 1: [Name]
3. Create child plan 2: [Name]
4. Begin parallel implementation of independent children
