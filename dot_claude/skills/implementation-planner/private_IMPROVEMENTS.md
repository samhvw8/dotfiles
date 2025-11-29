# Implementation Planner Improvements

## Summary

Enhanced the implementation-planner skill and related commands to support **atomic plan decomposition** with a story-point-like approach, focusing on design documentation rather than code implementation.

## Key Improvements

### 1. Plan Decomposition Protocol (Story Point Approach)

**Added complexity assessment thresholds:**

| Indicator | Threshold | Recommendation |
|-----------|-----------|----------------|
| Files Modified | > 5 files | Suggest decomposition |
| Estimated Time | > 3 days | Suggest decomposition |
| Dependencies | > 3 external systems | Suggest decomposition |
| Risk Level | High complexity + High impact | Suggest decomposition |
| Cognitive Load | Can't hold in head | Suggest decomposition |

**IMPORTANT: User Preference Override**
- If user explicitly says "just one plan", "single plan", "don't split" → **Honor request**
- Create standalone plan regardless of complexity
- Can warn about complexity, but respect user's decision
- Decomposition is a **recommendation**, not mandatory

**New decomposition strategy:**
- Identify bounded contexts (independent, cohesive units)
- Define execution order (sequential, parallel, hybrid)
- Create parent plan for architecture
- Create child plans for implementation
- **Always ask user if unsure** about their preference

### 2. Plan Hierarchy System

**Three plan types:**

#### Parent Plans (Architecture)
- **Purpose:** High-level design, contracts, integration points
- **Contains:** Architecture diagrams, data structures, interfaces
- **Does NOT contain:** Implementation steps, detailed code, unit tests
- **Frontmatter:** `plan_type: parent`, `child_plans: [...]`

#### Child Plans (Implementation)
- **Purpose:** Implement one bounded context
- **Contains:** File changes, implementation steps, unit tests
- **Complexity:** Always low-medium (decompose further if high)
- **Frontmatter:** `plan_type: child`, `parent_plan: PLAN-ID`, `dependencies: [...]`

#### Standalone Plans (Simple Features)
- **Purpose:** Features that don't need decomposition
- **Contains:** Complete implementation in one plan
- **Complexity:** Low (< 5 files, < 3 days)

### 3. Design-Focused Plan Content

**Plans now emphasize DESIGN over CODE:**

✅ **What Plans SHOULD Contain:**
- Architecture diagrams (ASCII art, Mermaid)
- Data structures (interfaces, types, schemas)
- Critical notes (gotchas, constraints, decisions)
- Logic flow (pseudo-code, flowcharts)
- Integration contracts (API shapes, event formats)

❌ **What Plans Should NOT Contain:**
- Full implementation code
- Detailed code examples (small snippets for clarity only)
- Copy-paste ready code

**Rationale:**
- Plans are **blueprints**, not **implementation**
- Keep plans lightweight and focused on WHAT, not HOW
- Actual code belongs in implementation phase, not planning phase

### 4. New Templates

**Created specialized templates:**

1. **Parent Plan Template** (`templates/parent-plan-template.md`)
   - Architecture overview
   - Data structures and contracts
   - Child plan dependencies
   - System-wide tests
   - Feature-level rollback

2. **Child Plan Template** (`templates/child-plan-template.md`)
   - Component boundaries
   - Focused implementation steps
   - Unit + integration tests
   - Component-level rollback
   - Parent context reference

3. **Updated Main Template** (`templates/plan-template.md`)
   - Added complexity assessment section
   - Added architecture overview section
   - Added data structures section
   - Replaced code examples with design notes
   - Added plan hierarchy support

### 5. Enhanced Exec-Plan Command

**Updated `/exec-plan` to handle plan hierarchy:**

#### For Parent Plans:
1. DO NOT implement parent directly (architecture only)
2. Parse child_plans array
3. Check dependencies between children
4. Orchestrate child plan execution
5. Run system-wide integration tests after all children complete

#### For Child Plans:
1. Check dependencies field
2. Verify dependencies are completed (block if not)
3. Execute implementation steps
4. Run unit + integration tests
5. Update parent plan progress
6. Notify what's unblocked

#### For Standalone Plans:
- Execute as before (simple implementation flow)

### 6. Atomic Plan Principles

**Added core principle #6 and #7:**

6. **Atomic plans** - One plan, one cohesive change (< 5 files, < 3 days)
7. **Design over code** - Plans contain notes, diagrams, data structures - NOT code

**Benefits:**
- Easy to track progress (25%, 50%, 75%, 100%)
- Isolated failures (one child fails, others continue)
- Parallel work (independent children execute simultaneously)
- Safe rollback (revert individual children)
- Cognitive clarity (each plan fits in head)

## Updated Files

### Core Skill Files
1. ✅ `/skills/implementation-planner/SKILL.MD` - Added decomposition protocol, updated principles
2. ✅ `/skills/implementation-planner/templates/plan-template.md` - Updated with hierarchy support
3. ✅ `/skills/implementation-planner/templates/parent-plan-template.md` - NEW
4. ✅ `/skills/implementation-planner/templates/child-plan-template.md` - NEW
5. ✅ `/skills/implementation-planner/examples/decomposition-example.md` - NEW

### Commands
6. ✅ `/commands/exec-plan.md` - Enhanced for parent/child/standalone execution

## Usage Examples

### Example 1: User Requests Large Feature

```
User: "Implement complete e-commerce checkout with cart, payment, and inventory"

Claude:
1. Assesses complexity:
   - Files: ~15 files (exceeds threshold)
   - Time: ~8 days (exceeds threshold)
   - Domains: 4 (Cart, Payment, Orders, Inventory)
   → Decision: DECOMPOSE

2. Creates parent plan:
   - Architecture diagram showing 4 components
   - Data structures (Cart, Order, Payment, Inventory interfaces)
   - Integration contracts between components
   - NO implementation steps

3. Creates 4 child plans:
   - Cart Management (2 days, independent)
   - Payment Integration (2 days, independent)
   - Order Processing (2 days, depends on Cart + Payment)
   - Inventory Update (2 days, depends on Orders)

4. User executes:
   /exec-plan PLAN-parent
   → Orchestrates children in correct order
   → Runs system tests after all complete
```

### Example 2: User Requests Small Feature

```
User: "Add feature flag for dark mode"

Claude:
1. Assesses complexity:
   - Files: 2 files (config + component)
   - Time: 4 hours
   - Single domain: Configuration
   → Decision: STANDALONE (no decomposition)

2. Creates standalone plan:
   - Simple implementation steps
   - Unit tests
   - No parent/child hierarchy needed
```

## Migration Guide

**For existing plans:**
- Standalone plans work as-is (backward compatible)
- Add `plan_type: standalone` to frontmatter (optional, defaults to standalone)

**For new large features:**
1. Use decomposition checklist
2. If decompose: Create parent + children using new templates
3. If standalone: Use updated main template

## Benefits Summary

### For Users
- ✅ Clear progress tracking (% complete based on children)
- ✅ Easier to understand (smaller, focused plans)
- ✅ Less overwhelming (tackle one child at a time)
- ✅ Flexible execution (can pause/resume individual children)

### For Implementation
- ✅ Parallel work possible (independent children)
- ✅ Isolated failures (one child fails, others unaffected)
- ✅ Safer rollback (revert individual children)
- ✅ Easier testing (unit test each child, then integration)

### For Planning
- ✅ Focus on architecture first (parent plan)
- ✅ Less code in plans (design-focused)
- ✅ Clearer contracts (interfaces defined upfront)
- ✅ Better risk management (complexity distributed)

## Metrics

**Before Improvements:**
- Monolithic plans: ~900 LOC across 15 files
- Cognitive load: Very high
- Parallel work: Not possible
- Rollback risk: High (all-or-nothing)

**After Improvements:**
- Atomic plans: ~200 LOC per child (4 children)
- Cognitive load: Low (each child manageable)
- Parallel work: Possible (2+ children simultaneously)
- Rollback risk: Low (granular revert)

## Next Steps

**Recommended workflow:**
1. When user requests feature, run complexity assessment
2. If complex → Use decomposition protocol
3. Create parent plan (architecture only)
4. Create child plans (implementation details)
5. Execute with `/exec-plan` (handles hierarchy automatically)

**Future enhancements:**
- Visual dependency graphs for parent plans
- Automated complexity scoring
- Plan templates for common patterns (auth, CRUD, API integration)
- Progress dashboard showing parent + children status
