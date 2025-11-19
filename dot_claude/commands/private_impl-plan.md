---
description: Create a minimal-change, reversible implementation plan for software development
argument-hint: [feature-name]
---

Invoke the implementation-planner skill to create a technical implementation plan.

**Feature**: $1

The implementation-planner skill will:
1. Check docs/plan.md for any active plans
2. Analyze codebase structure and patterns (< 90 seconds)
3. Identify minimal set of changes required
4. Create implementation plan with:
   - Summary (what + why + approach)
   - File Changes (new, modified, deleted)
   - Implementation Steps (with verification)
   - Test Plan (unit, integration, manual)
   - Risks & Mitigations
   - Rollback Plan (exact commands)
   - Success Criteria
5. Save to docs/plans/PLAN-YYYYMMDD-HHMM-{slug}.md
6. Update docs/plan.md master tracker

**Core Principles**:
- Minimal changes only (fewest files possible)
- Reversibility mandatory (every change undoable)
- Verification at each step (clear success criteria)

**Use /plan for non-programming projects.**

Please invoke the implementation-planner skill now.
