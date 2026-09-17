# Methodology Map

Which human research methodology contributes what to forager.

## Loop Step → Methodology

| Forager step | Human methodology | What it contributes | Key decision rule |
|---|---|---|---|
| **Search (inner loop)** | Information Foraging (Pirolli & Card 1999) | Patch exploitation model | Stay in patch while marginal return > environment average; leave when scent weakens |
| **Query evolution** | Berry Picking (Bates 1989) | 6 search techniques, query mutation | Each document changes the query itself — footnote chasing, citation search, journal run, area scanning, subject search, author search |
| **Reflect** | Intelligence Cycle (CIA) | Analysis→new collection requirements | Analysis reveals gaps → gaps become collection requirements → collection fills gaps → new gaps emerge |
| **Branch vs deepen** | ACH (Heuer, CIA) | Diagnostic evidence test, falsification | Seek to REFUTE, not confirm. Evidence supporting all hypotheses = non-diagnostic noise. Expand when findings don't discriminate |
| **Phase transition** | Kuhlthau ISP (1991) | Exploration→focus formulation→collection | Uncertainty peaks during exploration; focus formulation is the turning point; after it, switch to targeted collection |
| **Termination** | Grounded Theory Saturation | No new categories/themes/dimensions | Code saturation: ~9-12 data units. Meaning saturation: ~16-24. Stop when 2+ consecutive iterations yield <2 new items |
| **Scope control** | CGAR test + Artifact linkage | Goal-relevance filter, drift detection | New finding must serve Context/Goal/Artifact/Requirements. If thread produces no output → drift. Max 3 levels deep |
| **Scope expansion triggers** | I&W (Indicators & Warnings) | Pre-defined expansion triggers | Before starting: define what findings would warrant scope expansion. Prevents reactive unbounded growth |

## Falsification Principle (ACH)

The most counterintuitive and powerful heuristic. During reflect:

```
DON'T ask: "What evidence supports my current understanding?"
DO ask:    "What evidence would REFUTE my current understanding?"
```

If you can't find refuting evidence → understanding is robust.
If you find refuting evidence → that's the most valuable finding of the iteration.

## Phase Transition Signals (Kuhlthau)

| Signal | You're in... | Do... |
|--------|-------------|-------|
| Many new concepts each iteration, understanding shifting | Exploration | Broad diverse queries, follow leads |
| New concepts slowing, core picture forming but gaps remain | Transition | Start narrowing, target specific gaps |
| Few new concepts, clear picture, filling edges | Focused | Targeted confirmatory queries only |
| Zero new concepts, everything confirms existing picture | Saturated | Stop |

## Saturation Curve

Track `new_items_per_iteration`. The curve shape tells you where you are:

```
Items │ ██
      │ ██ ██
      │ ██ ██ ██
      │ ██ ██ ██ ██
      │ ██ ██ ██ ██ ░░
      │ ██ ██ ██ ██ ░░ ░░
      └──────────────────── Iterations
        1  2  3  4  5  6
        ←exploration→ ←focused→ ←saturated→
```

## Related

- [SKILL.md](../SKILL.md) — forager skill main file
- [goal-state-examples.md](goal-state-examples.md) — example goal states
