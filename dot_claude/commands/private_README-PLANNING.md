# Planning Commands Reference

Complete guide to Claude Code planning slash commands for managing projects, implementations, and goals.

## Overview

The planning system provides two complementary skills with slash commands:
- **`project-planner`**: For business, personal, creative, academic, event, and organizational projects
- **`implementation-planner`**: For software development and technical implementations

Both use the same master tracker (`docs/plan.md`) and standardized format (`PLAN-YYYYMMDD-HHMM-{slug}.md`).

---

## Available Commands

### 📋 `/plan [project-name] [category]`

Create a structured plan for any non-programming project.

**Usage:**
```bash
/plan product-launch business
/plan career-transition personal
/plan book-writing creative
```

**What it does:**
1. Checks for active plans in `docs/plan.md`
2. Invokes `project-planner` skill
3. Creates plan with 7 sections:
   - Vision & Objectives (SMART goals)
   - Scope & Deliverables
   - Action Steps (phased with owners)
   - Resources Required
   - Timeline & Milestones
   - Risks & Contingencies
   - Success Metrics

**Categories:**
- `business` - Product launches, campaigns, initiatives
- `personal` - Career, learning, lifestyle goals
- `creative` - Writing, art, content projects
- `academic` - Research, thesis, study programs
- `event` - Conferences, weddings, gatherings
- `organizational` - Restructuring, culture change

---

### ⚙️ `/impl-plan [feature-name]`

Create a minimal-change, reversible implementation plan for software development.

**Usage:**
```bash
/impl-plan redis-caching
/impl-plan authentication-system
/impl-plan api-rate-limiting
```

**What it does:**
1. Checks for active plans
2. Invokes `implementation-planner` skill
3. Analyzes codebase structure (< 90 seconds)
4. Creates plan with:
   - Summary (what + why + approach)
   - File Changes (new, modified, deleted)
   - Implementation Steps (with verification)
   - Test Plan
   - Risks & Mitigations
   - Rollback Plan
   - Success Criteria

**Core principles:**
- Minimal changes (fewest files possible)
- Reversibility (every change undoable)
- Verification (clear success criteria)

---

### ▶️ `/continue-plan [plan-id]`

Continue working on the active plan or a specific plan.

**Usage:**
```bash
/continue-plan
/continue-plan PLAN-20251118-1430-product-launch
```

**What it does:**
1. Reads `docs/plan.md` to find active plan
2. Loads plan file from `docs/plans/`
3. Checks current phase and status
4. Identifies next steps
5. Asks if you want to proceed

**No arguments:** Uses active plan from `docs/plan.md`
**With plan-id:** Loads specified plan

---

### 🔍 `/check-plan [plan-id]`

Check status of plans or view overview.

**Usage:**
```bash
/check-plan
/check-plan PLAN-20251118-1430-product-launch
```

**What it shows:**
- Active plan (if any)
- Recent plans (last 10)
- Plan statistics (total, completed, in progress, cancelled)
- Specific plan status (if plan-id provided)

---

### 📑 `/list-plans [filter]`

List all plans with filtering options.

**Usage:**
```bash
/list-plans all
/list-plans active
/list-plans completed
/list-plans business
/list-plans personal
```

**Filters available:**
- **Status:** `all`, `active`, `completed`, `cancelled`, `on_hold`, `draft`
- **Category:** `business`, `personal`, `creative`, `academic`, `event`, `organizational`

**Display format:**
- Plan ID (linked)
- Title
- Status
- Category
- Phase
- Priority
- Created date

---

### 📐 `/plan-template [template-type]`

Show available plan templates and their usage.

**Usage:**
```bash
/plan-template
/plan-template business
/plan-template personal
```

**Available templates:**
1. **Generic Project** - Universal template for any project
2. **Business Project** - Product launches, campaigns, initiatives
3. **Personal Goal** - Career, learning, lifestyle goals
4. **Software Implementation** - Technical development

**Template locations:**
- Generic: `.claude/skills/project-planner/templates/generic-plan-template.md`
- Business: `.claude/skills/project-planner/templates/business-plan-template.md`
- Personal: `.claude/skills/project-planner/templates/personal-goal-template.md`
- Implementation: `.claude/skills/implementation-planner/templates/plan-template.md`

---

### 📦 `/archive-plan [plan-id]`

Archive completed or cancelled plans.

**Usage:**
```bash
/archive-plan PLAN-20251115-1200-old-project
```

**What it does:**
1. Verifies plan status is `completed` or `cancelled`
2. Creates archive directory: `docs/plans/archive/`
3. Moves plan file to archive
4. Updates `docs/plan.md`
5. Updates statistics

---

## Plan File Structure

### Naming Convention

```
PLAN-YYYYMMDD-HHMM-{project-slug}.md
```

**Examples:**
- `PLAN-20251118-1430-product-launch.md`
- `PLAN-20251118-1500-redis-caching.md`
- `PLAN-20251119-0900-career-transition.md`

**Benefits:**
- ✅ Sortable by date
- ✅ Unique timestamps
- ✅ Descriptive slugs
- ✅ Git-friendly

### Required Frontmatter

**Project Plan:**
```yaml
---
plan_id: PLAN-20251118-1430-product-launch
title: Product Launch
created: 2025-11-18 14:30
status: draft | active | completed | on_hold | cancelled
category: business | personal | creative | academic | event | organizational
phase: planning | execution | monitoring | complete
priority: critical | high | medium | low
---
```

**Implementation Plan:**
```yaml
---
plan_id: PLAN-20251118-1430-redis-caching
title: Redis Caching Layer
created: 2025-11-18 14:30
status: draft | in_progress | completed | cancelled
author: Claude Code
phase: planning | implementation | testing | complete
---
```

---

## Master Plan Tracker

### Location
`docs/plan.md`

### Structure

```yaml
---
title: Master Plan Tracker
last_updated: 2025-11-18 14:30
active_plan: PLAN-20251118-1430-product-launch
total_plans: 5
completed_plans: 3
cancelled_plans: 1
---
```

**Sections:**
1. **Current Active Plan** - Currently active plan with status
2. **Plan History** - In Progress, Completed, Cancelled
3. **Quick Navigation** - Grep commands for finding plans
4. **Statistics** - Total, completed, in progress, cancelled

---

## Workflow Examples

### Creating a Business Plan

```bash
# Create new plan
/plan product-launch business

# Claude asks clarifying questions
# Creates PLAN-20251118-1430-product-launch.md
# Updates docs/plan.md

# Continue working on it
/continue-plan

# Check progress
/check-plan

# When done, mark complete (manually update status in plan file)
```

### Creating an Implementation Plan

```bash
# Create technical plan
/impl-plan redis-caching

# Claude analyzes codebase
# Creates PLAN-20251118-1430-redis-caching.md
# Updates docs/plan.md

# Continue implementation
/continue-plan

# Check all plans
/list-plans all
```

### Managing Multiple Plans

```bash
# Check current status
/check-plan

# List all active plans
/list-plans active

# Switch to different plan
/continue-plan PLAN-20251117-0900-other-project

# Archive old completed plan
/archive-plan PLAN-20251115-1200-old-project
```

---

## Best Practices

### Do ✅

1. **Check for active plans** before creating new ones
2. **Use specific project names** in slugs
3. **Update plan status** as work progresses
4. **One active plan at a time** (for focus)
5. **Archive completed plans** to keep workspace clean
6. **Use /continue-plan** to resume work
7. **Review success criteria** before marking complete

### Don't ❌

1. **Don't create multiple active plans** - reduces focus
2. **Don't skip master tracker** - always update `docs/plan.md`
3. **Don't mix plan types** - use `/plan` for projects, `/impl-plan` for code
4. **Don't forget rollback plans** (implementation plans)
5. **Don't skip risk assessment** - identify obstacles early

---

## Quick Reference

| Command | Purpose | Example |
|---------|---------|---------|
| `/plan` | Create project plan | `/plan product-launch business` |
| `/impl-plan` | Create implementation plan | `/impl-plan redis-caching` |
| `/continue-plan` | Resume active plan | `/continue-plan` |
| `/check-plan` | View plan status | `/check-plan` |
| `/list-plans` | List filtered plans | `/list-plans active` |
| `/plan-template` | Show templates | `/plan-template business` |
| `/archive-plan` | Archive old plan | `/archive-plan PLAN-xxx` |

---

## File Locations

```
.claude/
├── commands/
│   ├── plan.md                    # /plan command
│   ├── impl-plan.md               # /impl-plan command
│   ├── continue-plan.md           # /continue-plan command
│   ├── check-plan.md              # /check-plan command
│   ├── list-plans.md              # /list-plans command
│   ├── plan-template.md           # /plan-template command
│   └── archive-plan.md            # /archive-plan command
│
├── skills/
│   ├── project-planner/
│   │   ├── SKILL.md
│   │   └── templates/
│   │       ├── generic-plan-template.md
│   │       ├── business-plan-template.md
│   │       └── personal-goal-template.md
│   │
│   └── implementation-planner/
│       ├── SKILL.MD
│       ├── templates/
│       │   ├── plan-template.md
│       │   └── master-plan-template.md
│       └── references/
│           └── PLANNING_SYSTEM_REFERENCE.md
│
docs/
├── plan.md                        # Master plan tracker
└── plans/
    ├── PLAN-20251118-1430-product-launch.md
    ├── PLAN-20251118-1500-redis-caching.md
    └── archive/                   # Archived plans
        └── PLAN-20251115-1200-old-project.md
```

---

## Troubleshooting

### No master tracker found

**Problem:** Command says "No master plan tracker found"

**Solution:**
```bash
# Create docs directory
mkdir -p docs/plans

# Create initial master tracker
# Use template from .claude/skills/implementation-planner/templates/master-plan-template.md
```

### Can't find active plan

**Problem:** `/continue-plan` can't find active plan

**Solution:**
1. Run `/check-plan` to see plan status
2. Check `docs/plan.md` for `active_plan` field
3. Use specific plan ID: `/continue-plan PLAN-xxx`

### Multiple active plans

**Problem:** Multiple plans show `status: active`

**Solution:**
1. Decide which plan is truly active
2. Update others to `on_hold` or `cancelled`
3. Update `docs/plan.md` to reflect single active plan

---

**Planning System Version:** 1.0
**Last Updated:** 2025-11-18
**Created By:** Claude Code
