---
name: idea-forge
description: "Makes new ideas by recombining bricks, then designs the cheapest test that could kill each one: combine bricks from several sources, swap one piece of a method for a piece from another field, change how the pieces fit together (sequence, loop, gate), remove, invert or move a piece. Starts from an idea card, Sam's seed (\"what if we swap C for D\"), bricks a session just found, or a hand dealt from the bank (deal mode, present mode only: both write rough ideas from dealt bricks, lenses or moves, then read a few together). By default Claude does all of it; after Sam types /idea-present, Sam writes first. Use when Sam asks what new ideas come from mixing sources or parts, how to combine, swap or rearrange pieces, what to build or try next from a source, whether a piece from one field works in another, or asks to deal some bricks. Not for breaking a source into bricks (idea-mine), reading a source with Sam (co-read) or finding sources (idea-scout)."
---

# Idea forge

Make new ideas from old recipes. By default Sam is absent and Claude does every
step, best effort; in present mode (idea-bank, "Presence mode") Sam does the
generative part first.
Two goals hold at once: (A) Sam ends with ideas he can act on, and (B) Sam's own
idea-making gets stronger. A list of variants Sam only nods at serves (A) and
erodes (B), so in present mode the order below is not optional.

Formats, slugs, move types and gem types come from
`~/.claude/skills/idea-bank/references/schema.md`; bank location, index and
commits come from the `idea-bank` skill. Load it first, and read its "What a brick
is" before you recombine bricks. Files are English; chat is
in the language Sam writes in, by "Rendering for Sam" in the idea-bank schema.
Label bank content "(from your bank: ...)" and outside knowledge "(from memory,
unchecked)"; never cite a card or batch as if the source said it. For a social
source, root each variant in the named poster whose point it builds on, and keep
the original post apart from replies.

## Inputs

- A card (`cards/<slug>.md`), a reading in progress, or a seed line from Sam.
- The bank: bricks, lenses, moves, and `me/known-bricks.md`, `me/interest-state.md`.
- `idea_index.py` output for the bricks involved (convergence, hot slots,
  migration-gap candidates).

If there is no card yet, draft the recipe (roles, bricks by role, operator, bet,
constraints of the time) with Sam before forging: operators act on roles, and a
recipe named by brick identity gives only shallow swaps.

## The session

**1. Sam's variants first (present mode only).** In absent mode, go to step 2;
that is not a skip. Ask Sam for his variants before showing any of
Claude's: "Your variants first, even one line, even wrong." Keep Claude's list
hidden until he commits. If Sam says skip, give Claude's list and log a skip in
`me/progress.md`. Why: the generation effect; an answer read first anchors Sam
and takes away the thinking that builds (B). Sam's variants also show where
Claude's distribution is stuck.

**2. Claude exhausts the neighbourhood.** Walk every operator over every role of
the recipe, not the three that come first. `references/operators.md` holds the
procedure per operator and the questions that make each one productive. Two
sources of candidates beat free association:
- **The bank.** For substitute-brick and cross-card, take D from any card or
  field whose brick fills the same role tag. Match by structural signature
  (input, output, objective, constraint), never by name or embedding similarity:
  the same structure hides under different words in each field.
- **The index.** Migration-gap candidates and convergence lists from
  `idea_index.py` are brick migrations waiting to be judged: keep the brick, move
  it to a new field or role. Judge each by structure before it becomes a
  variant.

Aim for breadth before ranking: 15-40 raw variants on a rich card is normal.
Drop exact duplicates of Sam's variants but say which of his you also reached.

**3. Check each surviving variant.** Short, one line per check:
- **Role fit:** does D really do C's job here? Name what breaks (an input it
  cannot take, a constraint it violates, a scale it fails at).
- **Novelty:** one or two searches by structure terms (the signature in words,
  plus the target field), not only by the obvious keywords. Parallax
  `web_search` (`tags: ["science"]` for papers), `social_search`, and GitHub via
  `gh search`. Already done: link it, keep it only as a move to learn from.
- **Unpopular?** When prior work exists but is ignored, diagnose why with the
  schema's table. A wrong bet is dropped; a lifted constraint, wrong field,
  fashion, poor execution or other language community makes it a gem.
- **Cheapest kill-test:** the result that would kill it, what it costs, and
  whether it runs on toy data, in a notebook, or on the home GPU.
  `references/kill-tests.md` has the design rules.

**4. Rank by generativity, not truth.** Order by: how many viable follow-ons the
variant opens, how far it transfers, how cheap its kill-test is, and fit with
Sam's scopes and core clusters. Evidence weight is a tag, never a filter. Show
the top 5-8 with one line each; keep the rest in the file.

**5. Sam scores and kills.** Sam marks each shown variant keep / kill / later
with a reason. Push back on weak reasons ("boring", "won't work") with the
strongest case for the variant, once; Sam's call stands. Record disagreements
that a test could settle. Record every variant Sam produced that Claude did not:
it goes in `me/progress.md` (Sam-unique mutations) and tells Claude where it was
stuck in its default.

**6. Kill-test.** For the variant Sam picks:
1. Sam writes his prediction first (present mode); in absent mode Claude writes
   it, still before the run.
2. Fix the kill criterion and the metric before the run. Never change them after
   seeing results.
3. Claude builds the harness (data loading, plots, boilerplate). In a deep
   session Sam writes the 20-ish core lines that implement the brick; that
   hands-on step is where the next idea comes from.
4. Run it. For paper code use `paper-replicate`; for GPU work check the home
   server's load first (`ssh me.ubuntu.home nvidia-smi`, `tmux ls`).
5. Report the real number against the criterion, including a miss.

## Deal mode

**Gate, before anything else:** has Sam typed `/idea-present` in this conversation
(and not `/idea-present off` since)? If not, deal nothing. Reply with one line,
"Deal mode needs you: type /idea-present and we start.", and stop. A request to
deal is not the switch.

A second way in, from the bank instead of a card. Ideas here need not be good:
they are material to read and sharpen together. Goal (B) carries the weight, so
no novelty search and no kill-test unless Sam asks for one on a kept idea.

1. **Menu.** Run `idea_deal.py <bank> menu` (in `idea-bank/scripts`) and show
   the kinds with their real pool sizes: `role` (same job, other fields), `lens`
   (one lens over bricks from fields it has not seen), `gap` (a brick and a field
   it has not reached), `pair` (two bricks with no shared field), `move` (replay
   a past move on other cards). Sam picks the kind, `x` (items dealt) and `y`
   (ideas each), or says "you pick".
2. **Deal.** Run `idea_deal.py <bank> deal <kind> -x <x>`. Show the hand as is,
   with its seed.
3. **Sealed ideas, both sides.** Claude writes its `y` ideas into the session
   file first and does not show them. Sam writes his, as rough as he likes.
   Then both lists are shown side by side. Neither goes first in the chat, so
   neither anchors the other. If Sam asks to see Claude's first, show them and
   log `claude-first` in the Skips column.
   Each idea is one line of recipe (which item, which operator, which role) plus
   "why it might work" and "what would kill it", one line each. Mark Claude's
   reasons `(inferred)`.
4. **Read together.** Sam picks how many to read, `y` or fewer, from either
   list. For each one: both suggest one change to it (Sam first), then Sam
   marks keep / kill / later with a reason. Claude argues for or against with
   reasons, once, as a peer.
5. **Write back.** The session is a Reading with `mode: deal` and a `deal`
   block (kind, seed, x, items). All ideas go in `# Mutations` with origin `sam`
   or `claude` and Sam's verdict; ideas nobody read stay there unmarked. A kept
   idea Sam wants to pursue goes through the normal session (steps 3 and 6)
   later. Add a `deal` row to `me/progress.md`.

## Writing back

- Write every variant as a row of the schema's Mutations table: operator,
  variant, role fit, novelty link, kill test, Sam verdict, origin (`sam` or
  `claude`). In a reading session the table goes in the reading's `# Mutations`
  and the run in `# Kill test`; outside a session, in the card's `# Mutations`.
- Every kill-test result goes in the brick's `kill_tests` (survived, killed,
  inconclusive, with a note), so the bank remembers what was tried.
- A variant that survives its kill-test becomes a `Move` file (`move_type`,
  `parent`, `child`, `role`, `from_brick`, `to_brick`; for a brick migration
  `move_type: migrate-brick` with `brick`, `from_field`, `to_field`), and any new
  brick gets its own file with its signature and a migration row.
- Update `me/progress.md`: Sam-unique mutations, skips.
- Commit through `idea-bank`.

## Rules

- **In present mode, Sam generates first, every round.** Claude's list never appears before Sam's
  attempt unless Sam skips, and skips are logged.
- **No invented mechanism.** When a variant's reason is Claude's reading, mark it
  `(inferred)`. When nobody knows why it would work, say so; the kill-test
  exists for that.
- **Structure over names.** A variant built on a word match ("both are called
  attention") is not a migration until the signatures match.
- **The judge is outside the model.** A variant is "promising" after a run or a
  found prior result, not after Claude finds it convincing.
- **Peers.** Claude disagrees with reasons and accepts being overruled. No praise
  for weak variants, no deference to strong-sounding ones.

## Later phases (documented, not built)

- **Constraint-price tracker:** a table of constraints (cost per 1M tokens, GPU
  hour, labeling cost, context length) with current prices. When one drops about
  10x, scan bricks whose `Constraints of the time` cite it and propose
  lift-constraint variants. Needs a scheduled job; it goes in a Runs line with an
  owner and a kill condition when built.
- **Prediction registry:** dated predictions ("this brick will reach field Y
  within 6 months"), scored at 3 and 6 months. It is the outside judge for
  migration predictions.

## References

- `references/operators.md`: each operator and brick migration, how to apply it,
  questions that make it productive, structure-mapping steps.
- `references/kill-tests.md`: cheap kill-test design, novelty search by
  structure, writing results back.
- `references/worked-example.md`: the sparse-coding chain forged end to end
  (illustration).
