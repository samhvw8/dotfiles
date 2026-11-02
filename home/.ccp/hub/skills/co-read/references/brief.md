# Brief mode

Claude explains a source so Sam can decide whether to go deep. Sam reads and asks
questions. Budget: Sam should finish it in 5–10 minutes.

## Template

```markdown
**Source:** <title> · <type> · <date> · read basis: <abstract | passages | full-text | + talk/posts>

## The one idea
<one sentence a smart outsider would repeat>

## How the authors see the problem (view model)
- Picture: <...> <"quote" (Section) | (inferred)>
- Bottleneck: <what they think is the real constraint; what they ignore>
- Expected solution shape: <scale vs structure, learned vs designed, ...>
- Taste: <what they find elegant or ugly>
- Surprise: <what surprised them, and what prior that reveals>
- Story told vs real thinking: <where the paper's framing differs from talks,
  posts, rebuttals or v1; "no outside source found" when none>

## The recipe
Bet: "If <X is the real bottleneck>, then <Y> should work." <quote | (inferred)>

| Role (the job) | Atom | Known to Sam? |
|----------------|------|---------------|
Operator: <sequence | loop | gate | ...>
Constraints of the time: <what forced an atom choice>
Rejected alternatives: <"we tried X but ..." quotes, or none found>

## New atoms (at most 2)
### <atom, named by role>
<two sentences> · Picture: <one everyday image with the same structure> ·
Breaks when: <where the picture stops matching>

## Gems
- [gem: <type>] <one line, with the quote or section it rests on>

## Mutation teasers
- <operator>: <one line>

Stop here, or go deep?
```

## Rules

- **i+1.** Explain with atoms Sam owns (`me/known-atoms.md`). Introduce at most two
  new atoms. When the source needs more, say "this source needs N new atoms; I
  taught the two that carry the idea" and list the rest by name.
- **Delegated clusters** get the interface form for their atoms: input, output,
  role, cost, when it fails. No internals.
- **Quote or mark.** Every view-model line and the bet carry a quote with its
  section, or `(inferred)`. Evidence weight is one tag at the end; it never
  removes an idea.
- **Gem lines are specific.** Name the gem type and the passage. For `unpopular`,
  give the diagnosed reason from the schema's table.
- **Answer Sam's questions from the source first,** then from the bank, then from
  general knowledge, and say which.
- **Write the card** after a brief (Claude may write it in brief mode), so the bank
  grows even when Sam stops here. Mark it `read_basis` honestly.

## Worked example (illustration: invented source, made-up numbers)

**Source:** "Spaced flashcards for motor skills" (invented blog post by a climbing
coach) · post · read basis: full-text

**The one idea:** practise a climbing move in short spaced bouts across days,
because the body consolidates movement between sessions the way memory does.

**View model**
- Picture: "your fingers remember overnight, not during the session" (Section 2).
- Bottleneck: consolidation time, not training volume (inferred).
- Expected solution shape: scheduling, not new drills (inferred).
- Surprise: "my best students trained less" (Section 4): his prior was volume.
- Story told vs real thinking: no outside source found.

**Recipe** · Bet: "If consolidation between sessions is the bottleneck, spacing
beats volume" (Section 2).

| Role | Atom | Known to Sam? |
|------|------|---------------|
| schedule-practice-over-time | spaced repetition | owned |
| consolidate-after-signal | sleep-dependent consolidation | new |

Operator: loop (practise → sleep → practise). Constraints of the time: none
named. Rejected alternatives: "long weekend sessions burned people out" (Section 3).

**New atom: consolidate-after-signal.** Practice leaves a fragile trace; a later
offline phase (often sleep) turns it into a stable change. Picture: wet concrete
that sets overnight. Breaks when: the change needs no offline phase at all.

**Gems**
- [gem: migration-gap] Spaced repetition is mature in memory research and barely
  used in coaching motor skills (Section 1).

**Mutation teasers**
- transfer: the same bet for posture habits at a desk.
- substitute-atom: replace sleep with a short nap as the consolidation gate.

Stop here, or go deep?
