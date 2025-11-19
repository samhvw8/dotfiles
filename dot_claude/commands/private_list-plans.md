---
description: List all plans with their status and category
argument-hint: [filter: all|active|completed|business|personal]
---

!test -d docs/plans && find docs/plans -name "PLAN-*.md" -type f | head -20 || echo "No plans directory found."

List and filter plans.

**Filter**: ${1:all}

Show plans filtered by:
- Status: all, active, completed, cancelled, on_hold, draft
- Category: business, personal, creative, academic, event, organizational

Available filters: $1

Actions:
1. Read all plan files from docs/plans/
2. Extract frontmatter (plan_id, title, status, category, phase, priority)
3. Filter by the specified criteria
4. Display in a formatted table with:
   - Plan ID (linked)
   - Title
   - Status
   - Category
   - Phase
   - Priority
   - Created date

Please list the plans with the specified filter.
