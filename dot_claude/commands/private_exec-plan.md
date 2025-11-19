---
description: Execute and implement the active plan with full task tracking
argument-hint: [plan-id (optional)]
---

Execute the active plan with comprehensive task management and progress tracking.

**Plan ID**: ${1:from docs/plan.md if not specified}

Actions:
1. Read docs/plan.md to find active plan
2. Load the plan file from docs/plans/
3. Parse all implementation steps/action items
4. Create comprehensive todo list using TodoWrite
5. Execute each step systematically:
   - Mark as in_progress before starting
   - Implement the step fully
   - Verify completion
   - Mark as completed before moving to next
6. Update plan status in real-time
7. Track blockers and risks
8. Provide progress reports

**Execution Principles:**
- **Sequential execution**: One task in_progress at a time
- **Verification required**: Each step must be validated before completion
- **Blocker handling**: Stop and report if blocked, don't mark as complete
- **Real-time updates**: Update plan file status as work progresses
- **Rollback awareness**: Track changes for potential rollback

**For Implementation Plans:**
- Follow File Changes section (new, modified, deleted)
- Execute Implementation Steps with verification
- Run Test Plan after each phase
- Monitor Risks & Mitigations
- Keep Rollback Plan ready

**For Project Plans:**
- Execute Action Steps by phase
- Track Resources Required
- Monitor Timeline & Milestones
- Assess Risks & Contingencies
- Measure against Success Metrics

If plan ID is provided: $1
Otherwise: Use active_plan from docs/plan.md

Please load the active plan and begin systematic execution.
