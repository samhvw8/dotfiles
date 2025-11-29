# User Preference Override Examples

## Overview

Users can override complexity-based decomposition by explicitly stating their preference. The system **always honors user choice**, even if it contradicts complexity thresholds.

## Trigger Phrases

**Single Plan Indicators:**
- "just one plan"
- "single plan"
- "one comprehensive plan"
- "don't split"
- "don't decompose"
- "keep it together"
- "don't break it up"
- "all in one"

**Decomposition Indicators:**
- "break it down"
- "split into multiple plans"
- "make it smaller"
- "decompose this"
- "separate plans"
- "divide into parts"

## Example Scenarios

### Scenario 1: User Explicitly Wants Single Plan

**User Request:**
```
"Implement a complete checkout system with cart, payment, and order management.
Just create one plan, I want to see everything together."
```

**Claude's Response:**
```
Understood. I'll create a single comprehensive plan for the checkout system.

⚠️ Complexity Note: This feature involves:
- ~15 files across multiple domains
- Estimated 8 days of work
- High complexity (cart + payment + orders)

I'm creating one comprehensive plan as requested, though it exceeds typical
atomic plan thresholds (< 5 files, < 3 days). You can break it down later
if needed.

Creating: PLAN-20251124-1400-checkout-system.md (standalone)
```

**Result:**
- ✅ Creates **one standalone plan** with all sections
- ✅ Includes complexity warning
- ✅ Honors user's explicit preference
- ❌ Does NOT create parent + children

---

### Scenario 2: User Wants Decomposition

**User Request:**
```
"Implement a complete checkout system. Break it down into smaller,
manageable plans so I can track progress easily."
```

**Claude's Response:**
```
I'll decompose this into smaller, trackable plans.

Complexity Assessment:
- ~15 files, 8 days, 4 domains (Cart, Payment, Orders, Inventory)
- Recommendation: Decompose ✓

Creating parent + child plans:
- Parent: PLAN-20251124-1400-checkout-system (architecture)
- Child 1: PLAN-20251124-1430-cart-management (2 days)
- Child 2: PLAN-20251124-1445-payment-integration (2 days)
- Child 3: PLAN-20251124-1500-order-processing (2 days)
- Child 4: PLAN-20251124-1515-inventory-update (2 days)

Dependencies: Cart + Payment → Orders → Inventory
```

**Result:**
- ✅ Creates **parent + 4 children**
- ✅ Honors user's request for breakdown
- ✅ Provides clear progress tracking

---

### Scenario 3: Ambiguous Request (Ask User)

**User Request:**
```
"Implement a complete checkout system with cart, payment, and order management."
```

**Claude's Response:**
```
I've assessed this feature's complexity:

Complexity Assessment:
- Files affected: ~15 files (exceeds 5 file threshold)
- Estimated time: ~8 days (exceeds 3 day threshold)
- Domains: 4 (Cart, Payment, Orders, Inventory)
- Recommendation: Decompose for easier tracking

Would you like me to:
A) Create one comprehensive plan (all features together)
B) Decompose into smaller plans (parent + 4 children for better tracking)

Option B allows parallel work and clearer progress (25% → 50% → 75% → 100%).
```

**User Responds: "Just one plan please"**

**Claude's Response:**
```
Creating one comprehensive standalone plan as requested.

Creating: PLAN-20251124-1400-checkout-system.md (standalone)
```

**Result:**
- ✅ Asked for clarification
- ✅ Honored user's decision
- ❌ Did not force decomposition

---

### Scenario 4: User Changes Mind

**Initial Request:**
```
"Create a plan for checkout system. Keep it in one plan."
```

**Claude Creates:** Standalone plan

**User Later Says:**
```
"Actually, this is too complex. Can you break it into smaller plans?"
```

**Claude's Response:**
```
I'll decompose the existing standalone plan into a parent + child structure.

Converting PLAN-20251124-1400-checkout-system:
- Mark original as cancelled/archived
- Create new parent plan with architecture
- Extract bounded contexts into 4 child plans

Proceeding with decomposition...
```

**Result:**
- ✅ Respects user's new preference
- ✅ Archives original standalone plan
- ✅ Creates new parent + children structure

---

### Scenario 5: Simple Feature, User Suggests Decomposition

**User Request:**
```
"Add a dark mode toggle. Break it into multiple plans."
```

**Claude's Response:**
```
Complexity Assessment:
- Files affected: 2 files (config + component)
- Estimated time: 4 hours
- Single domain: UI configuration
- Recommendation: Standalone (decomposition not beneficial)

This is a simple feature that doesn't benefit from decomposition:
- Only 2 files
- < 1 day of work
- Single cohesive change

I recommend creating one standalone plan. However, if you prefer, I can
artificially split it into:
- Plan 1: Configuration setup
- Plan 2: Component implementation

Would you like me to keep it as one plan (recommended) or split it?
```

**User Responds: "Keep it as one"**

**Claude's Response:**
```
Creating standalone plan for dark mode toggle.
```

**Result:**
- ✅ Provided guidance against unnecessary decomposition
- ✅ Offered to honor user's preference anyway
- ✅ User made informed decision

---

## Decision Matrix

| User Says | Complexity | Action | Notes |
|-----------|-----------|--------|-------|
| "Just one plan" | Low | Standalone | Easy decision |
| "Just one plan" | High | Standalone | Honor request + warn |
| "Break it down" | Low | Ask user | Suggest standalone |
| "Break it down" | High | Parent + Children | Honor request |
| (Nothing) | Low | Standalone | Default for simple |
| (Nothing) | High | Ask user | Offer recommendation |

## Best Practices

### When to Ask User

**Always ask when:**
- Complexity is borderline (3-5 files, 2-4 days)
- User's intent is unclear
- Feature could reasonably go either way

**Example Question:**
```
This feature is moderately complex (4 files, 2 days). Would you like:
A) One standalone plan (simpler, all-in-one)
B) Decompose into 2 smaller plans (easier tracking)

I slightly recommend [option] because [reason], but either works.
```

### When to Warn User

**Warn (but honor) when:**
- User wants single plan for very complex feature (> 10 files, > 5 days)
- User wants decomposition for trivial feature (1-2 files, < 4 hours)

**Warning Format:**
```
⚠️ Note: This [feature] is [very complex / very simple]. Creating [one plan /
multiple plans] as requested, but [alternative] might be easier to [manage /
track / implement].
```

### Never Override User

**NEVER:**
- Force decomposition when user says "just one plan"
- Force standalone when user says "break it down"
- Decide for user when they've stated preference
- Assume user is wrong

**ALWAYS:**
- Honor explicit user preference
- Provide reasoning if recommendation differs
- Ask for clarification when ambiguous
- Respect user's final decision

## Summary

**Golden Rule:** User preference > Complexity thresholds

**Process:**
1. Check for explicit user preference
2. If stated → Honor it (warn if needed)
3. If ambiguous → Assess complexity and ask
4. Provide recommendation, respect choice
5. Never force a structure the user doesn't want
