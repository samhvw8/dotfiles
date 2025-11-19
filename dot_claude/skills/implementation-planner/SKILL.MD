---
name: implementation-planner
description: Create minimal-change, reversible implementation plans with verification steps and standardized format. Use when user requests "impl plan", "implementation plan", "how should we implement", "plan implementation", "implementation strategy", "continue plan", or mentions implementation planning, development roadmap. Automatically checks docs/plan.md for active plans before creating new ones.
auto_invoke: true
tags: [implementation, planning, architecture, minimal-change, reversibility, plan-format, plan-tracking]
---

# Implementation Planner Skill

Systematic methodology for creating implementation plans that are surgical, reversible, and minimize risk while maximizing clarity. All plans follow standardized format and are tracked in master plan file.

## When Claude Should Use This Skill

Claude will automatically invoke this skill when:
- User requests implementation plan creation
- User asks "how should we implement...", "create a plan for..."
- User says "continue plan" or "continue planning"
- Complex feature requires structured approach
- Need to break down requirements into executable steps
- Transforming research into actionable blueprint

## Pre-Planning Protocol

**ALWAYS execute before creating new plan:**

1. **Check for active plan**:
   ```bash
   # Check if master plan tracker exists
   test -f docs/plan.md && cat docs/plan.md
   ```

2. **If active plan exists**:
   - Ask user: "Active plan found: [PLAN-ID]. Continue this plan or create new one?"
   - If continue: Load active plan and continue from current phase
   - If new: Mark current plan as cancelled/completed and create new

3. **If no active plan**:
   - Proceed with new plan creation

## Plan Format Standards

### Naming Convention
- **Format**: `PLAN-YYYYMMDD-HHMM-{feature-slug}.md`
- **Example**: `PLAN-20251118-1430-redis-caching.md`
- **Location**: `docs/plans/`

### Required Frontmatter
```yaml
---
plan_id: PLAN-YYYYMMDD-HHMM-{slug}
title: [Feature Name]
created: YYYY-MM-DD HH:MM
status: draft | in_progress | completed | cancelled
author: Claude Code
phase: planning | implementation | testing | complete
---
```

### Required Sections
1. **Summary** - 2-3 lines: what + why + approach
2. **File Changes** - New: N, Modified: N, Deleted: N with purposes
3. **Implementation Steps** - Numbered with verification
4. **Test Plan** - Unit + integration + manual tests
5. **Risks & Mitigations** - Each risk with mitigation and contingency
6. **Rollback Plan** - Exact rollback procedure
7. **Success Criteria** - Measurable definition of "done"

## Master Plan Tracker (docs/plan.md)

### Structure
```markdown
---
title: Master Plan Tracker
last_updated: YYYY-MM-DD HH:MM
active_plan: PLAN-YYYYMMDD-HHMM-{slug}
---

# Master Plan Tracker

## 📌 Current Active Plan
[Link to current plan with status and phase]

## 📋 Plan History
- In Progress: [List]
- Completed: [List with ✅]
- Cancelled: [List with ❌]

## 🔍 Quick Navigation
[Grep commands for finding plans]
```

### Update Workflow

**When creating new plan:**
1. Generate plan file in `docs/plans/`
2. Update `docs/plan.md`:
   - Set `active_plan` to new plan ID
   - Add to "In Progress" section
   - Update `last_updated` timestamp

**When completing plan:**
1. Update plan file `status: completed`
2. Update `docs/plan.md`:
   - Move from "In Progress" to "Completed" with ✅
   - Clear `active_plan` or set to next plan
   - Update `last_updated` timestamp

**When cancelling plan:**
1. Update plan file `status: cancelled`
2. Update `docs/plan.md`:
   - Move from "In Progress" to "Cancelled" with ❌
   - Clear `active_plan`
   - Update `last_updated` timestamp

## Core Principles (BRAHMA Constitution)

1. **Simplicity over complexity** (KISS, YAGNI)
2. **Minimal changes only** - Touch fewest files possible
3. **Reversibility mandatory** - Every change must be undoable
4. **Verification at each step** - Clear success criteria
5. **Format consistency** - All plans follow same structure

## Planning Methodology Protocol

### Step 1: Codebase Discovery (< 90 seconds)

**Objective**: Understand existing structure before planning changes

**Actions**:

1. **Structure scan** (use Glob tool):
   - Source files: `src/**/*.{ext}`
   - Config files: `*.config.{ext}`, `.{ext}rc`
   - Test files: `**/*.test.{ext}`, `**/*.spec.{ext}`
   - Documentation: `docs/*.md`, `README.md`

2. **Pattern recognition** (use Grep + Read):
   - How similar features are currently implemented
   - Naming conventions (file names, function names)
   - Code style (indentation, formatting)
   - Import/export patterns
   - Test patterns and frameworks

3. **Integration point identification**:
   - Where does new code connect to existing code?
   - Configuration files that need updates
   - Entry points (main.ts, index.js, etc.)
   - Dependency injection patterns

4. **Constraint discovery**:
   - Existing dependencies that limit choices
   - Framework conventions that must be followed
   - Security/auth patterns that must be maintained
   - Performance SLAs to meet

**Output**:
```
Codebase Profile:
- Primary language: [TypeScript/Python/Go/etc.]
- Framework: [Next.js/Django/Gin/etc.]
- Structure: [src/ organization pattern]
- Test framework: [Jest/pytest/etc.]
- Key patterns: [Dependency injection / Factory / etc.]
- Integration points: [config.ts, app.ts, etc.]
```

**Anti-stagnation**: Max 90 seconds - if codebase is large, focus on areas relevant to feature only

### Step 2: Minimal Change Analysis (< 60 seconds)

**Objective**: Identify the smallest set of changes that accomplishes the goal

**Questions to answer**:

1. **New vs Modify**:
   - Can we extend existing code (better) or must we modify it?
   - Can new functionality live in new files (preferred)?
   - What's the smallest interface between new and existing code?

2. **Reuse vs Rebuild**:
   - What existing utilities/services can be reused?
   - What patterns can we follow from similar features?
   - What must be built from scratch (minimize this)?

3. **Scope boundaries**:
   - What's the absolute minimum to make feature work?
   - What's "nice to have" that can be deferred?
   - What edge cases must be handled vs can be documented as limitations?

4. **Reversibility**:
   - How easily can each change be undone?
   - Are we modifying core/critical files (higher risk)?
   - Can we use feature flags for gradual rollout?

**Output**:
```
Minimal Change Strategy:
- New files: [N] (primary work here)
- Modified files: [N] (minimal edits)
- Deleted files: 0 (avoid deletions, use deprecation)
- Core files touched: [N] (minimize this)
- Reversibility: [Git revert / Config toggle / Feature flag]
```

**Principles**:
- Prefer extension over modification
- Prefer new files over editing existing
- Prefer configuration over code
- Prefer composition over inheritance

### Step 3: Risk Assessment (< 30 seconds)

**Objective**: Identify what could go wrong and plan mitigations

**Categories of risk**:

1. **Breaking changes**:
   - Will this affect existing functionality?
   - Are we modifying shared/core modules?
   - Could this break other features?

2. **Performance risks**:
   - Will this add latency to critical paths?
   - Memory/CPU impact on existing operations?
   - Database query performance degradation?

3. **Security risks**:
   - Does this handle user input (validate & sanitize)?
   - Are credentials/secrets managed properly?
   - Could this introduce injection vulnerabilities?

4. **Integration risks**:
   - Dependencies on external services (what if they're down)?
   - API version mismatches?
   - Race conditions or concurrency issues?

5. **Testing gaps**:
   - What's hard to unit test (integration test instead)?
   - What scenarios might we miss?
   - What's the fallback if tests don't catch an issue?

**For each identified risk**:
```
Risk: [Description]
Probability: [High/Medium/Low]
Impact: [High/Medium/Low]
Mitigation: [How to prevent]
Detection: [How we'll know if it happens]
Contingency: [What we'll do if it happens]
```

**Anti-pattern**: Don't identify risks without mitigations - every risk needs an answer

### Step 4: Implementation Sequence (< 30 seconds)

**Objective**: Order the work for safety and clarity

**Sequencing principles**:

1. **Dependencies first**: Build foundation before dependent features
2. **Tests alongside**: Write tests as you implement (or before - TDD)
3. **Incremental integration**: Connect to existing system gradually
4. **Verification checkpoints**: Each step has clear pass/fail criteria

**Step structure**:
```
Step N: [Action verb] [What]
- Task: [Detailed description]
- Files: [Which files to change]
- Code: [Specific code examples]
- Verification: [How to confirm success]
- Time estimate: [X minutes]
```

**Verification methods**:
- Unit test passes: `npm test path/to/test`
- Build succeeds: `npm run build`
- Manual check: "Navigate to X and confirm Y is visible"
- Integration test: `npm run test:integration`
- Performance check: `npm run benchmark` (if applicable)

**Total time estimate**: Sum of all step estimates + 20% buffer

### Step 5: Rollback Planning (< 20 seconds)

**Objective**: Ensure every change can be undone safely

**Rollback mechanisms** (in priority order):

1. **Git revert** (simplest):
   ```bash
   git reset --hard [checkpoint-commit]
   ```
   Good when: All changes in one commit, no DB migrations

2. **Feature flag toggle** (gradual rollout):
   ```javascript
   if (featureFlags.newFeature === true) {
     // new code
   } else {
     // old code
   }
   ```
   Good when: Want to test in production, quick rollback needed

3. **Configuration rollback**:
   Restore previous config files
   Good when: Changes are mostly configuration-driven

4. **Partial rollback**:
   Keep working parts, revert broken parts
   Good when: Multiple independent changes, some work

**Rollback plan must include**:
- Exact commands to execute
- Verification steps after rollback
- Data migration rollback (if DB changes made)
- Cache invalidation (if caching involved)

**Rollback triggers** (when to execute rollback):
- Tests fail in production
- Performance degrades > [threshold]%
- Error rate increases > [threshold]%
- Critical functionality breaks

### Step 6: Plan Documentation (< 30 seconds)

**Objective**: Structure all above findings into clear, executable plan with standard format

**Implementation Plan Format**:

```markdown
---
plan_id: PLAN-YYYYMMDD-HHMM-{slug}
title: [Feature Name]
created: YYYY-MM-DD HH:MM
status: draft
author: Claude Code
phase: planning
---

# 🗺️ Implementation Plan: [Feature Name]

## Summary
[2-3 lines: what + why + approach]

## 📁 File Changes
**New:** [N files with purposes]
**Modified:** [N files with purposes]
**Deleted:** [N files - prefer 0]

### New Files
1. `path/to/file.ts` (~LOC lines)
   - Purpose: [What this file does]
   - Exports: [What it exports]
   - Dependencies: [What it depends on]

### Modified Files
1. `path/to/existing.ts`
   - Changes: [What will change]
   - Impact: [What this affects]

## 🔢 Implementation Steps

### Step 1: [Action Verb] [What]
**Task:** [Detailed description]
**Files:** [Which files]
**Code Example:**
```language
[Code snippet]
```
**Verification:** [How to confirm success]
**Time Estimate:** [X minutes]

[Repeat for each step]

## 🧪 Test Plan

### Unit Tests
- [ ] Test case 1: [Description]
- [ ] Test case 2: [Description]

### Integration Tests
- [ ] Integration test 1: [Description]

### Manual Tests
- [ ] Manual test 1: [Description]

## ⚠️ Risks & Mitigations

### Risk 1: [Description]
**Probability:** [High/Medium/Low]
**Impact:** [High/Medium/Low]
**Mitigation:** [How to prevent]
**Detection:** [How we'll know]
**Contingency:** [What we'll do if it happens]

[Repeat for each risk]

## 🔄 Rollback Plan

**Method:** [Git revert / Feature flag / Config]

**Procedure:**
```bash
# Step-by-step rollback commands
```

**Verification After Rollback:**
- [ ] Verification step 1
- [ ] Verification step 2

## ✅ Success Criteria

- [ ] Criterion 1: [Measurable]
- [ ] Criterion 2: [Measurable]
- [ ] All tests pass
- [ ] Performance within SLA
- [ ] Security review passed
```

**Checklist before delivering**:
- ✓ Frontmatter complete and valid
- ✓ Every file change has a clear purpose
- ✓ Every step has verification method
- ✓ All risks have mitigations
- ✓ Rollback plan is complete
- ✓ Success criteria are measurable
- ✓ Time estimates are realistic
- ✓ Master plan tracker updated

## Format Validation

**Before finalizing plan, validate:**

1. **Frontmatter check**:
   - `plan_id` matches filename
   - `status` is valid enum value
   - `phase` is valid enum value
   - `created` timestamp present

2. **Section check**:
   - All 7 required sections present
   - Summary is 2-3 lines max
   - File changes list specific files
   - Steps are numbered and have verification
   - Risks have mitigations
   - Rollback plan has exact commands
   - Success criteria are checkboxes

3. **Master tracker check**:
   - `docs/plan.md` updated
   - Active plan set correctly
   - History section updated
   - Last updated timestamp set

## Quality Standards

### Completeness
- **File changes**: Specify exact files with line-level changes where possible
- **Steps**: Each step is atomic (can be done and verified independently)
- **Tests**: Cover happy path + at least 2 edge cases + 1 error case
- **Risks**: All major risks identified (breaking, performance, security)

### Clarity
- **Actionable**: Developer can execute without additional questions
- **Verifiable**: Each step has objective pass/fail criteria
- **Unambiguous**: No "probably" or "maybe" - specific instructions only

### Safety
- **Reversible**: Every change can be undone
- **Incremental**: Changes build up gradually (not big bang)
- **Validated**: Tests verify correctness at each step
- **Isolated**: Failure of one step doesn't break entire system

### Format Consistency
- **Naming**: Follows PLAN-YYYYMMDD-HHMM-{slug} format
- **Structure**: All required sections present
- **Frontmatter**: Valid YAML with required fields
- **Tracked**: Recorded in master plan tracker

## Common Pitfalls to Avoid

❌ **Don't**:
- Create plan without checking docs/plan.md first
- Use inconsistent naming or missing frontmatter
- Plan modifications to many files simultaneously (hard to verify)
- Skip risk assessment ("hope for the best")
- Forget rollback plan
- Make plans that require perfect execution (allow for errors)
- Over-engineer ("we might need this someday")
- Under-estimate time (plans should be realistic)
- Forget to update master plan tracker

✅ **Do**:
- ALWAYS check docs/plan.md before creating new plan
- Use standardized format for all plans
- Update master tracker immediately after creating/updating plan
- Touch fewest files possible (minimal blast radius)
- Identify risks and plan mitigations explicitly
- Always include rollback procedure
- Build in verification checkpoints at every step
- Follow YAGNI (You Aren't Gonna Need It) - only what's needed now
- Add 20% time buffer for unexpected issues
- Validate plan format before finalizing

## Continue Planning Workflow

**When user says "continue plan":**

1. **Load active plan**:
   ```bash
   # Read master tracker
   cat docs/plan.md
   # Extract active_plan value
   # Load that plan file
   ```

2. **Determine current phase**:
   - Check `phase` field in plan frontmatter
   - Check which steps are completed (if tracking in plan)

3. **Continue from current phase**:
   - If `planning`: Continue adding/refining implementation steps
   - If `implementation`: Help execute next steps, update status
   - If `testing`: Help with test execution and validation
   - If `complete`: Ask if user wants to review or start new plan

4. **Update plan status**:
   - Update `phase` as work progresses
   - Update `status` when complete/cancelled
   - Update `docs/plan.md` to reflect current state

## Performance Targets

- **Total planning time**: < 3 minutes for typical features
- **Plan accuracy**: 95%+ of files identified correctly
- **Risk coverage**: 100% of major risks identified
- **Time estimates**: Within 30% of actual implementation time
- **Format compliance**: 100% - all plans follow standard format

## Example Usage

**Scenario 1: New Plan Creation**

User: "Create implementation plan for Redis caching"

Claude:
1. Checks `docs/plan.md` - no active plan
2. Creates `docs/plans/PLAN-20251118-1430-redis-caching.md`
3. Follows methodology: discover → analyze → assess → sequence → rollback → document
4. Validates format compliance
5. Updates `docs/plan.md` with new active plan
6. Delivers complete, formatted plan

**Scenario 2: Continue Existing Plan**

User: "continue plan"

Claude:
1. Reads `docs/plan.md` - finds active plan: PLAN-20251118-1430-redis-caching
2. Reads plan file - sees `phase: implementation`, Step 3 in progress
3. Asks: "Continue implementation of Redis caching from Step 4?"
4. Proceeds with next steps when user confirms
5. Updates plan status as work progresses

**Scenario 3: Active Plan Exists**

User: "Create implementation plan for authentication"

Claude:
1. Checks `docs/plan.md` - finds active plan: PLAN-20251118-1430-redis-caching
2. Asks: "Active plan found: Redis caching (in_progress). Create new plan for authentication or continue Redis caching?"
3. If new: Mark Redis plan as cancelled/paused, create new plan
4. If continue: Load Redis plan and continue

---

**This skill ensures plans are safe, minimal, clear, executable, consistently formatted, and properly tracked across the entire project lifecycle.**
