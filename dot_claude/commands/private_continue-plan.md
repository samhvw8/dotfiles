---
description: Continue working on the currently active plan
argument-hint: [plan-id (optional)]
---

!test -f docs/plan.md && cat docs/plan.md || echo "No master plan tracker found. Create a plan first with /plan or /impl-plan"

Continue working on the active plan.

**Plan ID**: ${1:from docs/plan.md if not specified}

Actions:
1. Read docs/plan.md to find active plan
2. Load the plan file from docs/plans/
3. Check current phase and status
4. Identify next steps or current work in progress
5. Ask user if they want to proceed with next step

If plan ID is provided: $1
Otherwise: Use active_plan from docs/plan.md

Please load the active plan and help continue the work.
