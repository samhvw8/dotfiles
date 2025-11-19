---
plan_id: PLAN-YYYYMMDD-HHMM-{feature-slug}
title: [Feature Name]
created: YYYY-MM-DD HH:MM
status: draft
author: Claude Code
phase: planning
---

# 🗺️ Implementation Plan: [Feature Name]

## Summary
[2-3 lines describing: what + why + approach]

## 📁 File Changes

**New:** [N] files
**Modified:** [N] files
**Deleted:** [N] files (prefer 0)

### New Files
1. `path/to/file.ts` (~LOC lines)
   - **Purpose**: [What this file does]
   - **Exports**: [What it exports]
   - **Dependencies**: [What it depends on]

### Modified Files
1. `path/to/existing.ts`
   - **Changes**: [What will change]
   - **Impact**: [What this affects]

## 🔢 Implementation Steps

### Step 1: [Action Verb] [What]
**Task:** [Detailed description of what to do]

**Files:**
- `path/to/file.ts`

**Code Example:**
```typescript
// Example code showing what to implement
```

**Verification:** [How to confirm this step is complete]
- [ ] Unit test passes: `npm test path/to/test`
- [ ] Build succeeds: `npm run build`
- [ ] Manual check: [Description]

**Time Estimate:** [X] minutes

### Step 2: [Action Verb] [What]
**Task:** [Detailed description]

**Files:**
- `path/to/file.ts`

**Code Example:**
```typescript
// Example code
```

**Verification:** [How to confirm success]

**Time Estimate:** [X] minutes

[... Continue for each step ...]

## 🧪 Test Plan

### Unit Tests
- [ ] Test case 1: [Description of test case]
  - **Input**: [What inputs]
  - **Expected**: [Expected output/behavior]
  - **File**: `path/to/test.spec.ts`

- [ ] Test case 2: [Description]
  - **Input**: [Inputs]
  - **Expected**: [Expected]
  - **File**: `path/to/test.spec.ts`

### Integration Tests
- [ ] Integration test 1: [Description]
  - **Scenario**: [What scenario]
  - **Expected**: [Expected behavior]
  - **File**: `path/to/integration.test.ts`

### Manual Tests
- [ ] Manual test 1: [Description]
  - **Steps**:
    1. [Step 1]
    2. [Step 2]
    3. [Step 3]
  - **Expected**: [What should happen]

## ⚠️ Risks & Mitigations

### Risk 1: [Description of risk]
**Probability:** [High/Medium/Low]
**Impact:** [High/Medium/Low]
**Mitigation:** [How to prevent this risk]
**Detection:** [How we'll know if it happens]
**Contingency:** [What we'll do if it happens]

### Risk 2: [Description of risk]
**Probability:** [High/Medium/Low]
**Impact:** [High/Medium/Low]
**Mitigation:** [Prevention strategy]
**Detection:** [Detection method]
**Contingency:** [Contingency plan]

## 🔄 Rollback Plan

**Method:** [Git revert / Feature flag / Configuration]

**Procedure:**
```bash
# Step 1: [Description]
git reset --hard [commit-hash]

# Step 2: [Description]
npm run build

# Step 3: [Description]
npm run test
```

**Verification After Rollback:**
- [ ] All tests pass
- [ ] Application starts successfully
- [ ] No errors in logs
- [ ] [Other verification steps]

**Data Recovery:**
- [If DB changes made, how to recover data]

**Cache Invalidation:**
- [If caching involved, how to clear cache]

## ✅ Success Criteria

- [ ] All implementation steps completed
- [ ] All unit tests pass (100% of new code covered)
- [ ] All integration tests pass
- [ ] Manual testing completed successfully
- [ ] Performance within SLA: [specific metric]
- [ ] No security vulnerabilities introduced
- [ ] Code review completed and approved
- [ ] Documentation updated
- [ ] Rollback plan tested (if critical feature)

## 📊 Metrics

**Estimated Time:** [Total hours/days]
**Complexity:** [Low/Medium/High]
**Risk Level:** [Low/Medium/High]
**Dependencies:** [List external dependencies]

## 📝 Notes

[Any additional notes, constraints, or considerations]

---

**Plan Status:** Draft
**Last Updated:** YYYY-MM-DD HH:MM
**Next Review:** YYYY-MM-DD
