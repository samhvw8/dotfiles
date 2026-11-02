---
name: idea-forge
description: "Turns an idea card or Sam's seed (\"what if we swap C for something like D\") into new idea variants, then designs the cheapest test that could kill each one. Sam proposes his variants first; Claude then exhausts the neighbourhood with the idea-bank mutation operators (substitute an atom, change the operator, remove, lift a constraint, invert, migrate an atom, transfer, cross-card, resolve the contradiction, lens transfer or inversion) and atom migration across fields, checks each variant for role fit and novelty, and runs kill-tests. Use after a co-read or brief, when Sam brings a seed or hunch, asks what to build or try next from a source, or asks whether an atom from one field could work in another. Not for reading or explaining a source (co-read) or finding sources (idea-scout)."
---

# Idea forge

Make new ideas from old recipes, with Sam doing the generative part first.
Two goals hold at once: (A) Sam ends with ideas he can act on, and (B) Sam's own
idea-making gets stronger. A list of variants Sam only nods at serves (A) and
erodes (B), so the order below is not optional.

Formats, slugs, move types and gem types come from
`~/.claude/skills/idea-bank/references/schema.md`; bank location, index and
commits come from the `idea-bank` skill. Load it first. Files are English; chat is
in the language Sam writes in.

## Inputs

- A card (`cards/<slug>.md`), a reading in progress, or a seed line from Sam.
- The bank: atoms, lenses, moves, and `me/known-atoms.md`, `me/interest-state.md`.
- `idea_index.py` output for the atoms involved (convergence, hot slots,
  migration-gap candidates).

If there is no card yet, draft the recipe (roles, atoms by role, operator, bet,
constraints of the time) with Sam before forging: operators act on roles, and a
recipe named by atom identity gives only shallow swaps.

## The session

**1. Sam's variants first.** Ask Sam for his variants before showing any of
Claude's: "Your variants first, even one line, even wrong." Keep Claude's list
hidden until he commits. If Sam says skip, give Claude's list and log a skip in
`me/progress.md`. Why: the generation effect; an answer read first anchors Sam
and takes away the thinking that builds (B). Sam's variants also show where
Claude's distribution is stuck.

**2. Claude exhausts the neighbourhood.** Walk every operator over every role of
the recipe, not the three that come first. `references/operators.md` holds the
procedure per operator and the questions that make each one productive. Two
sources of candidates beat free association:
- **The bank.** For substitute-atom and cross-card, take D from any card or
  field whose atom fills the same role tag. Match by structural signature
  (input, output, objective, constraint), never by name or embedding similarity:
  the same structure hides under different words in each field.
- **The index.** Migration-gap candidates and convergence lists from
  `idea_index.py` are atom migrations waiting to be judged: keep the atom, move
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
1. Sam writes his prediction first.
2. Fix the kill criterion and the metric before the run. Never change them after
   seeing results.
3. Claude builds the harness (data loading, plots, boilerplate). In a deep
   session Sam writes the 20-ish core lines that implement the atom; that
   hands-on step is where the next idea comes from.
4. Run it. For paper code use `paper-replicate`; for GPU work check the home
   server's load first (`ssh me.ubuntu.home nvidia-smi`, `tmux ls`).
5. Report the real number against the criterion, including a miss.

## Writing back

- Write every variant as a row of the schema's Mutations table: operator,
  variant, role fit, novelty link, kill test, Sam verdict, origin (`sam` or
  `claude`). In a reading session the table goes in the reading's `# Mutations`
  and the run in `# Kill test`; outside a session, in the card's `# Mutations`.
- Every kill-test result goes in the atom's `kill_tests` (survived, killed,
  inconclusive, with a note), so the bank remembers what was tried.
- A variant that survives its kill-test becomes a `Move` file (`move_type`,
  `parent`, `child`, `role`, `from_atom`, `to_atom`; for an atom migration
  `move_type: migrate-atom` with `atom`, `from_field`, `to_field`), and any new
  atom gets its own file with its signature and a migration row.
- Update `me/progress.md`: Sam-unique mutations, skips.
- Commit through `idea-bank`.

## Rules

- **Sam generates first, every round.** Claude's list never appears before Sam's
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
  10x, scan atoms whose `Constraints of the time` cite it and propose
  lift-constraint variants. Needs a scheduled job; it goes in a Runs line with an
  owner and a kill condition when built.
- **Prediction registry:** dated predictions ("this atom will reach field Y
  within 6 months"), scored at 3 and 6 months. It is the outside judge for
  migration predictions.

## References

- `references/operators.md`: each operator and atom migration, how to apply it,
  questions that make it productive, structure-mapping steps.
- `references/kill-tests.md`: cheap kill-test design, novelty search by
  structure, writing results back.
- `references/worked-example.md`: the sparse-coding chain forged end to end
  (illustration).
