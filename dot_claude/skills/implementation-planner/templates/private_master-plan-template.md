---
title: Master Plan Tracker
last_updated: YYYY-MM-DD HH:MM
active_plan: null
total_plans: 0
completed_plans: 0
cancelled_plans: 0
---

# Master Plan Tracker

> Central tracker for all implementation plans in this project.

## 📌 Current Active Plan

**Status:** No active plan

**To create a new plan:**
```bash
# Ask Claude to create an implementation plan
# Claude will automatically check this file first
```

## 📋 Plan History

### 🔄 In Progress

*No plans in progress*

### ✅ Completed

*No completed plans*

### ❌ Cancelled

*No cancelled plans*

## 🔍 Quick Navigation

### Find Plans by Status
```bash
# Find all in-progress plans
grep "status: in_progress" docs/plans/*.md

# Find all completed plans
grep "status: completed" docs/plans/*.md

# Find all draft plans
grep "status: draft" docs/plans/*.md
```

### Find Plans by Phase
```bash
# Find plans in planning phase
grep "phase: planning" docs/plans/*.md

# Find plans in implementation phase
grep "phase: implementation" docs/plans/*.md

# Find plans in testing phase
grep "phase: testing" docs/plans/*.md
```

### Find Plans by Date
```bash
# List all plans sorted by date (newest first)
ls -t docs/plans/PLAN-*.md

# Find plans from specific month
ls docs/plans/PLAN-202511*.md

# Find plans from today
ls docs/plans/PLAN-$(date +%Y%m%d)*.md
```

### Find Plans by Feature
```bash
# Search for specific feature in plan titles
grep "title:" docs/plans/*.md | grep -i "feature-name"

# Search for specific technology in plans
grep -i "technology-name" docs/plans/*.md
```

## 📊 Statistics

**Total Plans:** 0
**Completed:** 0 (0%)
**In Progress:** 0 (0%)
**Cancelled:** 0 (0%)

## 🎯 Plan Management Guidelines

### Creating New Plans
1. Claude automatically checks this file before creating new plans
2. If active plan exists, Claude asks whether to continue or create new
3. All plans follow standardized format: `PLAN-YYYYMMDD-HHMM-{feature-slug}.md`
4. Plans are stored in `docs/plans/` directory

### Updating Plan Status
- **Draft → In Progress**: When implementation begins
- **In Progress → Completed**: When all success criteria met
- **In Progress → Cancelled**: When plan is abandoned

### Plan Phases
- **Planning**: Defining requirements and approach
- **Implementation**: Executing the plan
- **Testing**: Verifying the implementation
- **Complete**: All criteria met, plan archived

## 🏗️ Best Practices

1. **One Active Plan**: Keep only one plan active at a time for focus
2. **Regular Updates**: Update plan status as work progresses
3. **Verification**: Check all success criteria before marking complete
4. **Documentation**: Keep notes in plan file for future reference
5. **Rollback Ready**: Ensure rollback plan is tested before marking complete

## 📖 Plan Format Reference

All plans must include:
- ✅ Frontmatter with plan metadata
- ✅ Summary (2-3 lines)
- ✅ File Changes (New, Modified, Deleted)
- ✅ Implementation Steps (with verification)
- ✅ Test Plan (Unit, Integration, Manual)
- ✅ Risks & Mitigations
- ✅ Rollback Plan
- ✅ Success Criteria

See `templates/plan-template.md` for complete format.

---

**Last Updated:** YYYY-MM-DD HH:MM
**Maintained By:** Claude Code
