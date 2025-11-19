---
description: Check status of current plan or view all plans
argument-hint: [plan-id (optional)]
---

!test -f docs/plan.md && cat docs/plan.md || echo "No master plan tracker found."

!test -d docs/plans && ls -lt docs/plans/PLAN-*.md | head -10 || echo "No plans directory found."

Check plan status and overview.

**Target Plan**: ${1:show active plan if not specified}

Information to show:
- Active plan (if any)
- Recent plans (last 10)
- Plan statistics (total, completed, in progress, cancelled)
- Quick status of specified plan (if plan-id provided)

If plan ID is provided: $1
Otherwise: Show overview from docs/plan.md

Please summarize the plan status.
