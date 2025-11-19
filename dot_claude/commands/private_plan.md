---
description: Create a structured plan for any project - business, personal, creative, academic, or event
argument-hint: [project-name] [category]
---

Invoke the project-planner skill to create a comprehensive project plan.

**Project**: $1
**Category**: ${2:business/personal/creative/academic/event/organizational}

The project-planner skill will:
1. Check docs/plan.md for any active plans
2. Ask clarifying questions about project goals and scope
3. Create a structured plan with 7 key sections:
   - Vision & Objectives (SMART goals)
   - Scope & Deliverables
   - Action Steps (phased tasks with owners)
   - Resources Required (people, budget, materials, time)
   - Timeline & Milestones
   - Risks & Contingencies
   - Success Metrics
4. Save to docs/plans/PLAN-YYYYMMDD-HHMM-{slug}.md
5. Update docs/plan.md master tracker

**Use /impl-plan for software development projects.**

Please invoke the project-planner skill now.
