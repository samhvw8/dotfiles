# Planning System Reference

Complete reference for the standardized implementation planning system with master plan tracking.

## Table of Contents

1. [System Overview](#system-overview)
2. [File Naming Convention](#file-naming-convention)
3. [Plan Format Specification](#plan-format-specification)
4. [Master Plan Tracker](#master-plan-tracker)
5. [Workflow Examples](#workflow-examples)
6. [Format Validation](#format-validation)
7. [Troubleshooting](#troubleshooting)

## System Overview

The planning system provides:
- **Standardized format** for all implementation plans
- **Master tracker** at `docs/plan.md` for plan management
- **Automatic checking** of active plans before creating new ones
- **Version control** through git-friendly naming and structure
- **Continuity support** for resuming plans across sessions

### Key Files

```
docs/
├── plan.md                          # Master plan tracker
└── plans/                           # All implementation plans
    ├── PLAN-20251118-1430-redis-caching.md
    ├── PLAN-20251118-1500-auth-system.md
    └── PLAN-20251119-0900-api-endpoints.md
```

## File Naming Convention

### Format

```
PLAN-YYYYMMDD-HHMM-{feature-slug}.md
```

### Components

| Component | Description | Example |
|-----------|-------------|---------|
| `PLAN-` | Fixed prefix | `PLAN-` |
| `YYYYMMDD` | Date (ISO format) | `20251118` |
| `HHMM` | Time (24-hour) | `1430` |
| `{feature-slug}` | Kebab-case feature name | `redis-caching` |
| `.md` | Markdown extension | `.md` |

### Examples

- `PLAN-20251118-1430-redis-caching.md`
- `PLAN-20251118-1500-auth-system.md`
- `PLAN-20251119-0900-api-rate-limiting.md`

### Benefits

1. **Sortable**: Files naturally sort by creation time
2. **Unique**: Timestamp prevents conflicts
3. **Descriptive**: Feature slug provides context
4. **Git-friendly**: No special characters, consistent format
5. **Searchable**: Easy to find by date or feature

## Plan Format Specification

### Required Frontmatter

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

### Frontmatter Fields

| Field | Type | Values | Required | Description |
|-------|------|--------|----------|-------------|
| `plan_id` | string | Matches filename | ✅ Yes | Unique plan identifier |
| `title` | string | Human-readable | ✅ Yes | Feature name |
| `created` | datetime | ISO format | ✅ Yes | Creation timestamp |
| `status` | enum | See below | ✅ Yes | Current status |
| `author` | string | "Claude Code" | ✅ Yes | Plan creator |
| `phase` | enum | See below | ✅ Yes | Current phase |

#### Status Values

- `draft`: Plan being created
- `in_progress`: Implementation started
- `completed`: All success criteria met
- `cancelled`: Plan abandoned

#### Phase Values

- `planning`: Defining approach
- `implementation`: Executing steps
- `testing`: Verification phase
- `complete`: All done

### Required Sections

1. **Summary** (2-3 lines)
   - What: Feature description
   - Why: Business/technical reason
   - Approach: High-level strategy

2. **📁 File Changes**
   - Count: New, Modified, Deleted
   - List each file with purpose

3. **🔢 Implementation Steps**
   - Numbered steps
   - Each with verification method
   - Time estimates

4. **🧪 Test Plan**
   - Unit tests
   - Integration tests
   - Manual tests

5. **⚠️ Risks & Mitigations**
   - Each risk with probability/impact
   - Mitigation strategy
   - Contingency plan

6. **🔄 Rollback Plan**
   - Exact commands
   - Verification steps
   - Data recovery

7. **✅ Success Criteria**
   - Measurable criteria
   - Checklist format

## Master Plan Tracker

### Location

`docs/plan.md`

### Purpose

- Track all plans in project
- Identify current active plan
- Maintain plan history
- Provide quick navigation

### Frontmatter

```yaml
---
title: Master Plan Tracker
last_updated: 2025-11-18 14:30
active_plan: PLAN-20251118-1430-redis-caching
total_plans: 5
completed_plans: 3
cancelled_plans: 1
---
```

### Sections

#### 1. Current Active Plan

Shows currently active plan with status and phase.

```markdown
## 📌 Current Active Plan

**Plan ID:** [PLAN-20251118-1430-redis-caching](./plans/PLAN-20251118-1430-redis-caching.md)
**Title:** Redis Caching Layer
**Status:** in_progress
**Phase:** implementation
**Started:** 2025-11-18 14:30
```

#### 2. Plan History

Categorized list of all plans.

```markdown
## 📋 Plan History

### 🔄 In Progress
- [PLAN-20251118-1430-redis-caching](./plans/PLAN-20251118-1430-redis-caching.md) - Redis Caching Layer

### ✅ Completed
- [PLAN-20251117-0900-auth-system](./plans/PLAN-20251117-0900-auth-system.md) - Authentication System ✅
- [PLAN-20251116-1000-api-endpoints](./plans/PLAN-20251116-1000-api-endpoints.md) - API Endpoints ✅

### ❌ Cancelled
- [PLAN-20251115-1200-old-approach](./plans/PLAN-20251115-1200-old-approach.md) - Old Approach ❌
```

#### 3. Quick Navigation

Grep commands for finding plans.

```markdown
## 🔍 Quick Navigation

### Find Plans by Status
```bash
grep "status: in_progress" docs/plans/*.md
grep "status: completed" docs/plans/*.md
```
```

## Workflow Examples

### Scenario 1: Create New Plan (No Active Plan)

**User:** "Create implementation plan for Redis caching"

**Claude Process:**

1. Check `docs/plan.md`:
   ```bash
   test -f docs/plan.md && cat docs/plan.md
   ```

2. Read frontmatter → `active_plan: null`

3. Create new plan:
   - Generate `PLAN-20251118-1430-redis-caching.md`
   - Follow planning methodology
   - Validate format

4. Update `docs/plan.md`:
   ```yaml
   active_plan: PLAN-20251118-1430-redis-caching
   total_plans: 1
   ```

5. Add to history:
   ```markdown
   ### 🔄 In Progress
   - [PLAN-20251118-1430-redis-caching](./plans/PLAN-20251118-1430-redis-caching.md) - Redis Caching Layer
   ```

### Scenario 2: Create New Plan (Active Plan Exists)

**User:** "Create implementation plan for authentication"

**Claude Process:**

1. Check `docs/plan.md`:
   ```yaml
   active_plan: PLAN-20251118-1430-redis-caching
   ```

2. Ask user:
   ```
   Active plan found: Redis Caching (in_progress).

   Options:
   1. Continue Redis caching plan
   2. Create new authentication plan (mark Redis as paused)

   What would you like to do?
   ```

3. If user chooses "Create new":
   - Update Redis plan status: `paused` or `cancelled`
   - Move to appropriate section in `docs/plan.md`
   - Create new auth plan
   - Set as active plan

### Scenario 3: Continue Existing Plan

**User:** "continue plan"

**Claude Process:**

1. Read `docs/plan.md`:
   ```yaml
   active_plan: PLAN-20251118-1430-redis-caching
   ```

2. Load plan file:
   ```bash
   cat docs/plans/PLAN-20251118-1430-redis-caching.md
   ```

3. Check frontmatter:
   ```yaml
   phase: implementation
   status: in_progress
   ```

4. Review implementation steps, identify next step

5. Ask user:
   ```
   Continuing Redis Caching plan:
   - Phase: implementation
   - Last step: Step 3 completed
   - Next step: Step 4 - Add cache integration

   Proceed with Step 4?
   ```

6. Execute next steps, update plan status

### Scenario 4: Complete Plan

**User:** "All tests pass, mark plan complete"

**Claude Process:**

1. Verify success criteria all checked

2. Update plan file:
   ```yaml
   status: completed
   phase: complete
   ```

3. Update `docs/plan.md`:
   - Clear `active_plan: null`
   - Move from "In Progress" to "Completed" with ✅
   - Update `completed_plans` count
   - Update `last_updated` timestamp

## Format Validation

### Validation Checklist

**Frontmatter:**
- [ ] `plan_id` matches filename
- [ ] `plan_id` format: `PLAN-YYYYMMDD-HHMM-{slug}`
- [ ] `title` is human-readable
- [ ] `created` timestamp present
- [ ] `status` is valid enum value
- [ ] `author` is "Claude Code"
- [ ] `phase` is valid enum value

**Sections:**
- [ ] Summary is 2-3 lines
- [ ] File Changes lists specific files
- [ ] Implementation Steps are numbered
- [ ] Each step has verification method
- [ ] Test Plan has Unit, Integration, Manual
- [ ] Risks have mitigations
- [ ] Rollback Plan has exact commands
- [ ] Success Criteria are checkboxes

**Master Tracker:**
- [ ] `docs/plan.md` exists
- [ ] `active_plan` field updated
- [ ] Plan added to history section
- [ ] `last_updated` timestamp set
- [ ] Statistics updated

### Validation Script

```bash
# Validate plan format
validate_plan() {
  local plan_file="$1"

  # Check frontmatter
  grep -q "^plan_id:" "$plan_file" || echo "❌ Missing plan_id"
  grep -q "^status:" "$plan_file" || echo "❌ Missing status"
  grep -q "^phase:" "$plan_file" || echo "❌ Missing phase"

  # Check sections
  grep -q "## Summary" "$plan_file" || echo "❌ Missing Summary"
  grep -q "## 📁 File Changes" "$plan_file" || echo "❌ Missing File Changes"
  grep -q "## 🔢 Implementation Steps" "$plan_file" || echo "❌ Missing Steps"
  grep -q "## 🧪 Test Plan" "$plan_file" || echo "❌ Missing Test Plan"
  grep -q "## ⚠️ Risks" "$plan_file" || echo "❌ Missing Risks"
  grep -q "## 🔄 Rollback Plan" "$plan_file" || echo "❌ Missing Rollback"
  grep -q "## ✅ Success Criteria" "$plan_file" || echo "❌ Missing Criteria"

  echo "✅ Validation complete"
}

# Usage
validate_plan docs/plans/PLAN-20251118-1430-redis-caching.md
```

## Troubleshooting

### Plan Not Found

**Problem:** Claude says plan not found

**Solutions:**
1. Check filename format matches `PLAN-YYYYMMDD-HHMM-{slug}.md`
2. Verify file is in `docs/plans/` directory
3. Check `docs/plan.md` has correct `active_plan` value

### Master Tracker Out of Sync

**Problem:** `docs/plan.md` shows wrong active plan

**Solutions:**
1. Manually update `active_plan` field
2. Check plan file status matches history section
3. Regenerate tracker from plan files:

```bash
# List all in-progress plans
grep -l "status: in_progress" docs/plans/*.md

# Update active_plan to most recent
```

### Multiple Active Plans

**Problem:** Multiple plans show `status: in_progress`

**Solutions:**
1. Decide which plan is truly active
2. Update others to `paused` or `cancelled`
3. Update `docs/plan.md` to reflect single active plan

### Missing Sections

**Problem:** Plan missing required sections

**Solutions:**
1. Copy template from `templates/plan-template.md`
2. Fill in missing sections
3. Re-validate with checklist

### Invalid Status/Phase

**Problem:** Frontmatter has invalid status or phase

**Solutions:**
1. Check valid values:
   - Status: `draft`, `in_progress`, `completed`, `cancelled`
   - Phase: `planning`, `implementation`, `testing`, `complete`
2. Update to valid value
3. Update `docs/plan.md` if needed

---

**Reference Version:** 1.0
**Last Updated:** 2025-11-18
**Maintained By:** Claude Code
