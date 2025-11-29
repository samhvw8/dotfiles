# Implementation Planner - Quick Reference

## Decision Tree: Should I Decompose?

```
┌─────────────────────────────────┐
│   New Feature Request           │
└──────────────┬──────────────────┘
               │
               ▼
    ┌──────────────────────┐
    │ User says "one plan" │
    │ "single plan" or     │◄─── User Preference Override
    │ "don't split"?       │
    └──────┬───────────────┘
           │
    ┌──────┴────────┐
    │               │
    ▼ YES           ▼ NO
┌──────────┐   ┌──────────────┐
│STANDALONE│   │  Complexity  │◄─── Files > 5? Time > 3 days?
│(Honor    │   │  Assessment  │     Risk = High?
│Request)  │   └──────┬───────┘
└──────────┘          │
               ┌──────┴────────┐
               │               │
               ▼               ▼
           ┌───────┐      ┌──────────┐
           │  YES  │      │    NO    │
           │ (≥3✓) │      │  (<3✓)   │
           └───┬───┘      └────┬─────┘
               │               │
               ▼               ▼
        ┌────────────┐    ┌──────────────┐
        │   OFFER    │    │ STANDALONE   │
        │ Decompose? │    │ Single Plan  │
        │  (Ask user)│    │              │
        └─────┬──────┘    └──────────────┘
              │
      ┌───────┴────────┐
      │                │
      ▼ Accept         ▼ Decline
 ┌─────────────┐  ┌──────────────┐
 │ DECOMPOSE   │  │ STANDALONE   │
 │ Parent +    │  │ (Honor user  │
 │ Children    │  │  choice)     │
 └─────────────┘  └──────────────┘
```

## Complexity Thresholds

| Metric | Atomic (✅) | Too Large (⚠️) | Decompose (❌) |
|--------|------------|---------------|----------------|
| **Files** | 1-3 | 4-5 | > 5 |
| **Days** | < 1 | 1-3 | > 3 |
| **Domains** | 1 | 2 | > 2 |
| **Dependencies** | 0-1 | 2-3 | > 3 |
| **LOC** | < 200 | 200-400 | > 400 |

**Rule:** If 3+ metrics in "Decompose" column → Create parent + children

## Plan Types Cheat Sheet

### 🏗️ Parent Plan (Architecture)

**Purpose:** High-level design
**Contains:**
- ✅ Architecture diagrams
- ✅ Data structures (interfaces)
- ✅ Integration contracts
- ✅ Child plan dependencies
- ❌ Implementation steps
- ❌ Code examples
- ❌ Unit tests

**Frontmatter:**
```yaml
plan_type: parent
child_plans: [PLAN-ID-1, PLAN-ID-2, ...]
complexity: high
```

**Execute:** `/exec-plan` orchestrates children, runs integration tests

---

### 🔧 Child Plan (Implementation)

**Purpose:** Implement one component
**Contains:**
- ✅ File changes (3-5 files)
- ✅ Implementation steps
- ✅ Unit tests
- ✅ Integration tests
- ✅ Design notes (WHAT/WHY)
- ❌ Full code (just pseudo-code)

**Frontmatter:**
```yaml
plan_type: child
parent_plan: PLAN-ID
dependencies: [PLAN-ID-X, ...]
complexity: low | medium
```

**Execute:** `/exec-plan` checks dependencies, implements, updates parent

---

### ⚡ Standalone Plan (Simple)

**Purpose:** Complete small feature
**Contains:**
- ✅ All sections (architecture + implementation)
- ✅ File changes (1-5 files)
- ✅ Tests
- ✅ Complete in one plan

**Frontmatter:**
```yaml
plan_type: standalone
complexity: low
```

**Execute:** `/exec-plan` implements directly

## Plan Content: Design vs Code

### ✅ GOOD: Design-Focused

```markdown
## Data Structures

interface User {
  id: string
  email: string
}

## Logic Flow

1. Receive user input
2. Validate email format
3. Check database for existing user
4. Hash password
5. Store user record
6. Return success
```

### ❌ BAD: Code-Heavy

```markdown
## Implementation

function createUser(data) {
  const user = new User();
  user.email = data.email;
  user.password = bcrypt.hash(data.password);
  await db.users.insert(user);
  return { success: true };
}
```

**Rule:** Plans describe WHAT and WHY, not HOW (code)

## Dependency Patterns

### Pattern 1: Parallel (No Dependencies)

```
PLAN-A (independent) ─┐
                       ├─→ Can execute simultaneously
PLAN-B (independent) ─┘
```

**Example:** Cart + Payment (different domains)

### Pattern 2: Sequential (Linear Dependencies)

```
PLAN-A → PLAN-B → PLAN-C
```

**Example:** Auth → Profile → Settings

### Pattern 3: Hybrid (Mixed Dependencies)

```
PLAN-A ─┐
         ├─→ PLAN-C → PLAN-D
PLAN-B ─┘
```

**Example:** Cart + Payment → Orders → Inventory

## Command Quick Reference

### Create Plan

```bash
/impl-plan checkout-system
# Assesses complexity
# Creates parent + children if needed
# Or creates standalone if simple
```

### Execute Plan

```bash
/exec-plan
# Auto-detects plan type
# Handles dependencies
# Updates progress
```

### Check Progress

```bash
/check-plan
# Shows active plan
# Lists child progress (if parent)
# Shows blockers
```

### Continue Planning

```bash
/continue-plan
# Loads active plan
# Continues from current phase
```

## File Structure

```
docs/
├── plan.md                           # Master tracker
└── plans/
    ├── PLAN-20251124-1400-checkout-system.md       # Parent
    ├── PLAN-20251124-1430-cart-management.md       # Child 1
    ├── PLAN-20251124-1445-payment-integration.md   # Child 2
    ├── PLAN-20251124-1500-order-processing.md      # Child 3
    └── PLAN-20251124-1515-inventory-update.md      # Child 4
```

## Execution Flow Example

### Large Feature (Decomposed)

```
User: "Implement checkout system"
  ↓
Complexity Assessment: 15 files, 8 days, 4 domains → DECOMPOSE
  ↓
Create Parent Plan (Architecture)
  ↓
Create 4 Child Plans (Implementation)
  ↓
Execute: /exec-plan PLAN-parent
  ↓
Phase 1: Execute Cart + Payment (parallel)
  ↓
Phase 2: Execute Orders (depends on Cart + Payment)
  ↓
Phase 3: Execute Inventory (depends on Orders)
  ↓
Run System Integration Tests
  ↓
Complete ✅
```

### Small Feature (Standalone)

```
User: "Add dark mode toggle"
  ↓
Complexity Assessment: 2 files, 4 hours, 1 domain → STANDALONE
  ↓
Create Standalone Plan
  ↓
Execute: /exec-plan
  ↓
Implement directly
  ↓
Complete ✅
```

## Common Mistakes to Avoid

❌ **Don't:** Put implementation code in plans
✅ **Do:** Use pseudo-code and design notes

❌ **Don't:** Create child plans that are still too large
✅ **Do:** Ensure each child is < 5 files, < 3 days

❌ **Don't:** Forget to check dependencies before executing child
✅ **Do:** Let `/exec-plan` handle dependency checking

❌ **Don't:** Create parent plan with implementation steps
✅ **Do:** Parent = architecture only, children = implementation

❌ **Don't:** Decompose simple features unnecessarily
✅ **Do:** Use complexity thresholds to decide

❌ **Don't:** Force decomposition when user wants one plan
✅ **Do:** Honor user's explicit preference, even if complex

❌ **Don't:** Ignore user saying "just one plan" or "don't split"
✅ **Do:** Create standalone plan, warn about complexity if needed

## Templates Location

- Parent: `.claude/skills/implementation-planner/templates/parent-plan-template.md`
- Child: `.claude/skills/implementation-planner/templates/child-plan-template.md`
- Standalone: `.claude/skills/implementation-planner/templates/plan-template.md`

## Key Principles

1. **Atomic plans** - One plan, one focused change
2. **Design over code** - Plans are blueprints, not implementation
3. **Clear dependencies** - Define execution order explicitly
4. **Parallel when possible** - Independent children execute simultaneously
5. **Verify at each step** - Each step has clear pass/fail criteria
6. **Safe rollback** - Granular revert per child plan

## Success Metrics

**Atomic Plan:**
- Files modified: ≤ 5
- Estimated time: ≤ 3 days
- Cognitive load: "Fits in head"
- Risk: Low-Medium

**Parent Plan:**
- All children completed
- System tests pass
- Feature acceptance criteria met

**Child Plan:**
- Implementation steps complete
- Unit tests pass
- Integration tests pass
- Parent contracts satisfied
