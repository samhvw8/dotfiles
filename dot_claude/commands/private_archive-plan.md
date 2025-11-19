---
description: Archive completed or cancelled plans to keep workspace clean
argument-hint: [plan-id]
---

!test -f docs/plan.md && cat docs/plan.md || echo "No master plan tracker found."

Archive old plans.

**Plan to archive**: $1

Actions:
1. Verify plan status is 'completed' or 'cancelled'
2. Create archive directory if needed: docs/plans/archive/
3. Move plan file to archive: docs/plans/archive/
4. Update docs/plan.md:
   - Remove from active sections
   - Add note about archived location
   - Update statistics
5. Optionally compress older archives

Plan ID: $1

Please help archive this plan.
