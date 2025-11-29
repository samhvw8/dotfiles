# Plan Decomposition Example

## Scenario: E-commerce Checkout System

User requests: "Implement a complete checkout system with cart, payment, and order management"

### Step 1: Complexity Assessment

**Initial Analysis:**
- Files affected: ~15 files (exceeds 5 file threshold ✗)
- Estimated time: ~8 days (exceeds 3 day threshold ✗)
- Multiple domains: Cart, Payment, Orders, Inventory (4 domains ✗)
- Risk level: HIGH (payment integration, data consistency)

**Decision:** DECOMPOSE into parent + child plans

### Step 2: Identify Bounded Contexts

Break the feature into independent, cohesive components:

1. **Cart Management** - User's shopping cart CRUD operations
2. **Payment Integration** - Payment gateway integration
3. **Order Processing** - Create and track orders
4. **Inventory Update** - Decrement stock after purchase

### Step 3: Define Dependencies

```
Execution Flow:

Phase 1 (Parallel - No dependencies):
├── Child 1: Cart Management (independent)
└── Child 2: Payment Integration (independent)

Phase 2 (Sequential - Requires Phase 1):
└── Child 3: Order Processing (needs Cart + Payment)

Phase 3 (Sequential - Requires Phase 2):
└── Child 4: Inventory Update (needs Orders)

Integration Tests (Requires all phases):
└── System-wide checkout flow test
```

### Step 4: Create Parent Plan

**File:** `docs/plans/PLAN-20251124-1400-checkout-system.md`

```yaml
---
plan_id: PLAN-20251124-1400-checkout-system
title: E-commerce Checkout System
plan_type: parent
child_plans:
  - PLAN-20251124-1430-cart-management
  - PLAN-20251124-1445-payment-integration
  - PLAN-20251124-1500-order-processing
  - PLAN-20251124-1515-inventory-update
complexity: high
estimated_duration: 8 days
---
```

**Parent Plan Contents:**
- ✅ Architecture diagram showing all 4 components
- ✅ Data structures (interfaces for Cart, Order, Payment, Inventory)
- ✅ Integration contracts between components
- ✅ System-wide test plan
- ✅ Feature-level rollback strategy
- ❌ NO implementation steps (that's for children)
- ❌ NO code examples (except interface definitions)

### Step 5: Create Child Plans

#### Child 1: Cart Management

**File:** `docs/plans/PLAN-20251124-1430-cart-management.md`

```yaml
---
plan_id: PLAN-20251124-1430-cart-management
title: Cart Management Component
plan_type: child
parent_plan: PLAN-20251124-1400-checkout-system
dependencies: []  # No dependencies, can start immediately
complexity: low
estimated_duration: 2 days
---
```

**Child Plan Contents:**
- ✅ Files to create: 3 files (~200 LOC total)
- ✅ Implementation steps: 5 steps with verification
- ✅ Unit tests: 8 test cases
- ✅ Integration tests: 2 tests
- ✅ Design notes and logic flows (pseudo-code)
- ❌ NO full implementation code (just interfaces/types)

#### Child 2: Payment Integration

**File:** `docs/plans/PLAN-20251124-1445-payment-integration.md`

```yaml
---
plan_id: PLAN-20251124-1445-payment-integration
title: Payment Gateway Integration
plan_type: child
parent_plan: PLAN-20251124-1400-checkout-system
dependencies: []  # No dependencies, can run parallel with Cart
complexity: medium
estimated_duration: 2 days
---
```

**Child Plan Contents:**
- ✅ Files to create: 4 files (~300 LOC total)
- ✅ Implementation steps: 6 steps with verification
- ✅ Critical notes: API keys, webhooks, security
- ✅ Unit tests: 10 test cases (including error cases)
- ✅ Integration tests: 3 tests (with mock payment gateway)

#### Child 3: Order Processing

**File:** `docs/plans/PLAN-20251124-1500-order-processing.md`

```yaml
---
plan_id: PLAN-20251124-1500-order-processing
title: Order Processing Component
plan_type: child
parent_plan: PLAN-20251124-1400-checkout-system
dependencies:
  - PLAN-20251124-1430-cart-management    # Needs cart data
  - PLAN-20251124-1445-payment-integration # Needs payment result
complexity: medium
estimated_duration: 2 days
---
```

**Child Plan Contents:**
- ✅ Files to create: 5 files (~250 LOC total)
- ✅ Depends on Cart and Payment contracts from parent plan
- ✅ Implementation steps: 7 steps
- ✅ Database migration for orders table
- ✅ Unit tests: 9 test cases
- ✅ Integration tests: Test with Cart + Payment mocks

#### Child 4: Inventory Update

**File:** `docs/plans/PLAN-20251124-1515-inventory-update.md`

```yaml
---
plan_id: PLAN-20251124-1515-inventory-update
title: Inventory Update Component
plan_type: child
parent_plan: PLAN-20251124-1400-checkout-system
dependencies:
  - PLAN-20251124-1500-order-processing  # Needs order data
complexity: low
estimated_duration: 2 days
---
```

**Child Plan Contents:**
- ✅ Files to create: 3 files (~150 LOC total)
- ✅ Implementation steps: 5 steps
- ✅ Critical notes: Race conditions, transaction handling
- ✅ Unit tests: 7 test cases (including concurrency)
- ✅ Integration tests: Test inventory rollback on order cancellation

### Step 6: Execution Flow

#### Week 1: Parallel Development

**Day 1-2:**
```bash
# Start both children in parallel (no dependencies)
/exec-plan PLAN-20251124-1430-cart-management
# Simultaneously (different developer or time-boxed):
/exec-plan PLAN-20251124-1445-payment-integration
```

**Results:**
- Cart: 3 files created, 8 unit tests passing ✅
- Payment: 4 files created, 10 unit tests passing ✅

#### Week 1: Sequential Development

**Day 3-4:**
```bash
# Now Cart + Payment are done, can proceed
/exec-plan PLAN-20251124-1500-order-processing
```

**Results:**
- Orders: 5 files created, integrates with Cart + Payment ✅
- 9 unit tests passing ✅
- Integration tests confirm Cart → Payment → Orders flow ✅

#### Week 2: Final Component

**Day 5-6:**
```bash
# Orders complete, can proceed
/exec-plan PLAN-20251124-1515-inventory-update
```

**Results:**
- Inventory: 3 files created, integrates with Orders ✅
- 7 unit tests passing ✅
- Transaction handling verified ✅

#### Week 2: Integration

**Day 7-8:**
```bash
# All children complete, run system tests
# Run tests from parent plan: PLAN-20251124-1400-checkout-system
npm run test:integration:checkout
```

**System-Wide Tests (from parent plan):**
- [ ] Complete checkout flow: Cart → Payment → Order → Inventory ✅
- [ ] Rollback flow: Failed payment → cart restored ✅
- [ ] Concurrent checkout: Multiple users → no race conditions ✅
- [ ] Performance: Checkout completes in < 2s ✅

### Benefits of Decomposition

**Without Decomposition (Monolithic 8-day plan):**
- ❌ 15 files in one plan - hard to track
- ❌ ~900 LOC across multiple domains - cognitive overload
- ❌ Single point of failure - one bug blocks everything
- ❌ Hard to parallelize - sequential work only
- ❌ Risky rollback - all-or-nothing

**With Decomposition (Parent + 4 children):**
- ✅ 3-5 files per child - easy to track
- ✅ ~150-300 LOC per child - manageable chunks
- ✅ Isolated failures - bug in one child doesn't block others
- ✅ Parallel work - Cart + Payment developed simultaneously
- ✅ Safe rollback - can revert individual children
- ✅ Clear progress - 25% done after each child completes
- ✅ Reusable components - Payment integration can be used elsewhere

### When NOT to Decompose

**Example: Simple Feature Flags**
- Files affected: 2 files (config + component)
- Estimated time: 4 hours
- Single domain: Configuration
- Low complexity

**Decision:** Standalone plan (no decomposition needed)

### Summary

**Decomposition Checklist:**
- [ ] Feature exceeds complexity thresholds? (> 5 files, > 3 days, > 3 domains)
- [ ] Can identify independent bounded contexts?
- [ ] Are there clear integration contracts?
- [ ] Would decomposition enable parallel work?
- [ ] Would smaller plans reduce risk?

**If 3+ checkboxes true → Decompose into parent + children**
**If < 3 checkboxes true → Create standalone plan**
