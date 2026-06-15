# Goal State Examples

How goal_state looks for different query types.

## Bounded Comparison

```
Query: "Compare Drizzle vs Prisma for type-safe PostgreSQL"

goal_state = {
  question: "Which ORM is better for type-safe PostgreSQL: Drizzle or Prisma?",
  sub_questions: [
    { q: "Type safety comparison", confidence: "gap" },
    { q: "Performance benchmarks", confidence: "gap" },
    { q: "Migration workflow", confidence: "gap" },
    { q: "Community/ecosystem maturity", confidence: "gap" }
  ],
  coverage: { "type-safety": "gap", "performance": "gap", "migrations": "gap", "ecosystem": "gap" },
  iteration: 0,
  max_iterations: 5,
  phase: "exploration",
  new_items_log: [],
  contradictions: [],
  expanded_topics: []
}
```

This might NOT need forager — lead-researcher handles bounded comparisons well. Forager adds value when sub-questions aren't known upfront.

## Open-Ended Exploration

```
Query: "How should we approach real-time collaboration in our app?"

goal_state = {
  question: "What are the architectural approaches for real-time collaboration?",
  sub_questions: [
    { q: "CRDT vs OT tradeoffs", confidence: "gap" },
    { q: "Existing solutions/libraries", confidence: "gap" },
    { q: "Scale characteristics", confidence: "gap" }
  ],
  coverage: { "crdt-vs-ot": "gap", "solutions": "gap", "scale": "gap" },
  iteration: 0,
  max_iterations: 5,
  phase: "exploration",
  new_items_log: [],
  contradictions: [],
  expanded_topics: []
}

// After iteration 2, reflect discovers "offline-first" as critical sub-topic:
// → ASK USER: "Research shows offline-first sync is a major design axis. Add to scope?"
// → If yes: expanded_topics.push({ topic: "offline-first sync", reason: "...", iteration: 2 })
```

## Multi-Domain Investigation

```
Query: "How do successful indie hackers validate and launch products?"

goal_state = {
  question: "Product validation and launch strategies for indie hackers",
  sub_questions: [
    { q: "Validation methods before building", confidence: "gap" },
    { q: "Launch channels and strategies", confidence: "gap" },
    { q: "Pricing discovery", confidence: "gap" },
    { q: "Common failure patterns", confidence: "gap" }
  ],
  coverage: { ... },
  iteration: 0,
  max_iterations: 8,  // deep mode — multi-domain
  phase: "exploration",
  new_items_log: [],
  contradictions: [],
  expanded_topics: []
}
```

## Goal State Evolution (iteration by iteration)

```
Iteration 1: coverage all "gap", 12 new items → exploration
Iteration 2: coverage 2 "partial" 2 "gap", 8 new items → still exploring
Iteration 3: coverage 3 "partial" 1 "gap", 5 new items → FOCUS FORMULATING
  → phase transitions to "focused"
  → remaining queries target the 1 gap + confirm the 3 partials
Iteration 4: coverage 3 "covered" 1 "partial", 2 new items → focused collection
Iteration 5: coverage all "covered", 1 new item → SATURATED → terminate
```

## Related

- [SKILL.md](../SKILL.md) — forager skill main file
- [methodology-map.md](methodology-map.md) — human methodology sources
