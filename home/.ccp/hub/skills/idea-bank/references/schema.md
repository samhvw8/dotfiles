# Idea bank schema

The single source of truth for bank formats. Every caller skill writes these
shapes and nothing else. All files are OKF concepts: YAML frontmatter with a
non-empty `type`, markdown body, English text.

Common frontmatter on every type: `type`, `title`, `description`, `tags`,
`generated: { by, at }` (actor convention: `claude-code/<model>`, `human:sam`).
Add `verified: { by: "human:sam", at }` when Sam signed the content off.

Links between bank files use bundle-relative paths, for example
`/ideas/atoms/sparse-overcomplete-code.md`. The index script reads the slugs in
the list fields below, so keep those fields as plain slugs (file name without
`.md`), not links.

**Frontmatter lists are the source of truth; the link views are generated.**
`idea_index.py --write` adds a `# Related` section at the end of every atom,
card, lens and move (real markdown links, each with its relation in words), and
rewrites `atoms/index.md` (shared roles first, then all atoms). The section sits
between `<!-- related:begin ... -->` and `<!-- related:end -->` markers. Never
edit inside them: change the frontmatter list and run `--write` again.
`--check` exits 1 when a view is out of date. Text outside the markers is kept.

Keep frontmatter short: slugs, enums and one-line values. Long prose goes in
the body, where a stray colon or quote cannot break the parse.

## Rendering for Sam

Bank files use this schema's terms. Chat output to Sam does not: he reads it to
learn, and private jargon makes it harder to learn from. Every caller skill
follows these rules for anything shown in chat.

1. **Open with a headline frame.** One plain sentence that holds the whole idea,
   ideally as a sharp picture ("theory as compiler, advice as cache").
2. **Plain words.** A schema term (atom, gem type, layer, zoom, move type,
   cluster, lens) appears only when Sam already owns it (`me/known-atoms.md`), or
   with a one-phrase gloss the first time: "part (the job it does)", "a gap where
   a tool from one field fits another". Never print frontmatter, slugs, cluster
   levels, read-basis tags, guesses about what Sam knows, or notes to yourself.
   Those go in bank files.
3. **Quotation marks mean verbatim.** Use them only for text copied exactly from
   the source. Paraphrase without quote marks. Before output, check every quote
   against the source; when the text is on disk, run
   `~/.claude/skills/idea-mine/scripts/check_quotes.py <file> <source-text>`, and
   fix or unquote each flagged quote.
4. **Say who says it.** Keep three voices apart: the author (quoted or
   paraphrased with the section), commenters (in a social thread, name the
   poster), and Claude ("(my reading)"; the bank's `(inferred)` renders this way). Never state Claude's diagnosis as the
   author's, and never state as a finding something the source does not show.
5. **Label what is not from the source.** Anything from the bank: "(from your
   bank: <card or atom in plain words>)". Anything from memory: "(from memory,
   unchecked)". Never cite bank content or earlier batches as if the source said it.

## Field vocabulary

- **field**: a lower-case, hyphenated discipline slug: `image-compression`,
  `neuroscience`, `machine-learning`, `learning-science`, `exercise-physiology`,
  `epidemiology`, `medicine`, `ux-design`, `labor-economics`,
  `software-engineering`, `product`, `marketing`. Reuse an existing slug before
  you make a new one (`idea_index.py` lists them).
- **role tag**: a lower-case, hyphenated verb phrase for a job an atom does:
  `sparse-represent-signal`, `filter-bad-samples`, `consolidate-after-signal`.
  Roles describe the job, never the implementation.
- **intent marker**: a quote with its section (`"..." (Methods > 3.2)`), or the
  text `(inferred)` after a claim that is Claude's reading.

### YAML pitfalls

Four bank files once failed their first parse. Quote a frontmatter value when it
contains `: ` (colon and space), starts with `%`, `@`, `*`, `&`, `!`, `|`, `>`
or a quote mark, or is a flow-list item that contains a comma
(`[ "a, b", c ]`). Quote dates and times you want kept as strings
(`at: '2026-11-02T00:00:00Z'`). Run the OKF validator after writing.

## Idea Card (`cards/<slug>.md`)

One card per source (paper, article, post, talk, repo, synthesis note).

**Synthesis notes** (a research note that summarises many studies or views, such
as `~/workspace/knowledge/topics/...`) are cards with `source_kind:
synthesis-note`: `read_basis: full-text` means the note was read in full, the
body opens with a `Basis:` line (what the note itself rests on: number and kind
of sources, its own grade), `evidence` follows the note's own grade, and the card
may hold several bets (`# Bets`). A move's parent may be a view reported inside
the note rather than an earlier paper.

```yaml
---
type: Idea Card
title: <source title>
description: <the one idea, one sentence>
tags: [ideas, card, <cluster>]
resource: <canonical URL or DOI>
field: <field slug of the source>
atoms: [<atom slug>, ...]          # atoms used in the recipe
lenses: [<lens slug>, ...]         # view models the author uses
roles: [<role tag>, ...]           # roles the recipe needs filled
tensions: [<role tag>, ...]        # roles the field still lacks a good atom for
parent: <card slug or URL>         # the source this one mutated, if known
moves: [<move slug>, ...]
gem_types: [<gem type>, ...]       # from the taxonomy below
evidence: none | anecdote | weak | moderate | strong   # a tag; never filters
read_basis: abstract | passages | full-text | talk | post
source_kind: primary | synthesis-note | social | talk | repo
intent_sources: [openreview | talk | v1-diff | tweet | repo | rebuttal | interview | blog | paper | note, ...]
constraints: [<constraint slug>, ...]  # limits that forced a METHOD choice, e.g. llm-judge-cost, trial-length
evidence_limits: [<slug>, ...]     # limits on how far the EVIDENCE reaches, e.g. no-control-group
status: draft | stable             # stable once Sam or a review signed it off
generated: { by: ..., at: ... }
---
```

`constraints` slugs name a limit that forced how the work was done, usually a
priced one (`gpu-hour-cost`, `label-cost`, `context-length`, `llm-token-cost`,
`no-vision-model`, `trial-length`, `sample-size-cost`), so a later price tracker
can find every card a price drop unlocks. `evidence_limits` slugs name what the
evidence cannot show (`observational-only`, `no-control-group`,
`self-report-only`, `single-study-evidence`, `animal-model-only`,
`narrow-sample-population`); they feed "Where it is weak", never the price
tracker. Reuse slugs. Older cards with both kinds in `constraints` still parse;
split them when you next touch the card.

Body sections, in this order:

```markdown
# View model (layer 0)
- Picture: <how the author pictures the problem> <intent marker>
- Bottleneck: <what they believe is the real constraint; what they treat as noise>
- Expected solution shape: <scale vs structure, learned vs designed, ...>
- Taste: <what they find elegant or ugly>
- Surprise: <what surprised them; it shows their prior>
- Source domain of the picture: <field the picture is borrowed from>

# Contradiction (layer 1)
<want X and not-X: where the obvious approach trades off>

# Resolution principle (layer 2)
<separation in time / space / scale / condition, or "trades off, not resolved">

# Bet (layer 3)
If <X is the real bottleneck>, then <Y> should work. (inferred)
<Quote marks only when the bet is verbatim in the source, with its section.>

# Bets (synthesis notes only, optional)
1. <the card's main bet, same as above>
2. <bet of another study or view the note reports> (<section>; whose bet)

# Recipe (layer 4)
| Role | Atom (slug) | Signature (input -> output, objective) | Why this atom (author's reason or (inferred)) |
|------|-------------|----------------------------------------|-----------------------------------------------|
Operator: <sequence | loop | gate | nesting | adversarial | distill | ensemble | tree | other: ...>

# Diff and constraints (layer 5)
- Parent: <what the source mutated>
- Move: <move type, link to moves/>
- Constraints of the time: <compute, data, tools, cost that forced an atom choice>
- Rejected alternatives: <"we tried X but..." quotes>

# Gems
- <gem type>: <the reason, in one line, with the passage it rests on>

# Story told vs real thinking
<where the paper's framing differs from talks, posts, rebuttals or v1 drafts>

# Raw
<the quotes the layers rest on, each with its section, plus the source pointer>

# Mutations
| Operator | Variant | Role fit | Novelty link | Kill test | Sam verdict | Origin |
|----------|---------|----------|--------------|-----------|-------------|--------|
```

Mutations columns: `Operator` is a `move_type`; `Role fit` says whether the new
atom does the role and what breaks; `Novelty link` is the closest prior work
found, or `none found (<query>)`; `Kill test` is the cheapest test or its result;
`Sam verdict` is `keep`, `kill (<reason>)` or empty; `Origin` is `sam` or `claude`.

## Atom (`atoms/<role-slug>.md`)

Name the file by the structure's role, not one field's name for it.

```yaml
---
type: Atom
title: <neutral name, e.g. "Sparse code over an overcomplete basis">
description: <signature in one sentence>
tags: [ideas, atom]
names: { <field slug>: [<names used there>] }
roles: [<role tag>, ...]           # jobs it has done anywhere
fields: [<field slug>, ...]        # fields it has reached
cards: [<card slug>, ...]
migrations:
  - { field: <slug>, year: <yyyy | unknown>, source: <url or card slug>, role: <role tag>, match_confidence: high }
kill_tests:
  - { date: <yyyy-mm-dd>, hypothesis: <...>, result: survived | killed | inconclusive, note: <...> }
cost: <optional: what using it costs: compute, data, money, latency>
fails_when: <optional: the conditions where it breaks>
status: draft | stable | deprecated
generated: { by: ..., at: ... }
---
```

Migration rows may add `match_confidence: high | medium | low`: how sure the
structure match is that put this row here. The index lists `low` rows for review.
`cost` and `fails_when` make the interface form used for delegated clusters
(role, signature, cost, fails_when) without reading the body.

Body: `# Signature`, `# Migrations` (the story of each move, one paragraph
each), `# Where it fails`, then the generated `# Related`. The signature is a
list in the body, not frontmatter, followed by the structure in words:

```markdown
# Signature
- **Input:** <what goes in>
- **Output:** <what comes out>
- **Objective:** <what is optimised or kept>
- **Constraint:** <sparsity, budget, ...>
- **Math:** <one-line form, optional>

<the structure in a few plain sentences>
```

An atom written with a frontmatter `signature:` still parses; `--write` moves
it into this list.

## Lens (`lenses/<slug>.md`)

A view model as a reusable node. It migrates like an atom.

```yaml
---
type: Lens
title: <e.g. "Compression is intelligence">
description: <the picture in one sentence>
tags: [ideas, lens]
people: [<person slug>, ...]
fields: [<field slug>, ...]
cards: [<card slug>, ...]
migrations:
  - { field: <slug>, year: <yyyy | unknown>, source: <url or card slug> }
generated: { by: ..., at: ... }
---
```

Create a Lens file the second time a view model appears across sources. A view
seen once goes in the `## Candidates (seen once)` section of `lenses/index.md` (one line: the
picture in plain words, the card that holds it), so the second sighting finds it.

Body: `# Picture`, `# What it predicts`, `# What it ignores`, `# Inverse lens`
(the opposite assumption, for lens inversion).

## Move (`moves/<slug>.md`)

The diff between a child source and its parent: the reusable unit of an idea.

```yaml
---
type: Move
title: <e.g. "Human-written steps -> self-generated steps + filter">
description: <one sentence>
tags: [ideas, move]
move_type: substitute-atom | substitute-operator | remove | lift-constraint | invert | migrate-atom | transfer | cross-card | resolve-contradiction | lens-transfer | lens-inversion | correct-parameter | relabel | retarget
parent: <card slug or URL>
child: <card slug or URL>
card: <card slug of the child, when it exists>
role: <role tag the move acted on>
from_atom: <atom slug>             # for substitute-atom
to_atom: <atom slug>
atom: <atom slug>                  # for migrate-atom: the atom that moved
from_field: <field slug>           # for migrate-atom and transfer
to_field: <field slug>
generated: { by: ..., at: ... }
---
```

Examples: few-shot CoT → zero-shot CoT (`remove`: exemplars), CoT → Tree of
Thoughts (`substitute-operator`: sequence → tree), CoT → STaR (`substitute-atom`:
human-written steps → self-generated + filter), sparse coding → sparse
autoencoder features (`migrate-atom`: same atom, field neuroscience →
interpretability, role explain-receptive-fields → decompose-activations).

## Person (`people/<slug>.md`, optional)

```yaml
---
type: Person
title: <name>
description: <their recurring bet in one sentence>
tags: [ideas, person]
lenses: [<lens slug>, ...]
generated: { by: ..., at: ... }
---
```

Body: `# Recurring bets`, `# Taste`, `# Public hunches` (table: date, hunch,
source, later outcome or "open"). Hunches are tracked to learn whose intuition
runs ahead, not to grade truth.

## Reading (`readings/YYMMDD-<slug>.md`)

```yaml
---
type: Reading
title: <source title>
description: <what the session found, one sentence>
tags: [ideas, reading]
card: <card slug>                  # omitted in a deal session
mode: brief | deep | skim | deal
deal: { kind: role | lens | gap | pair | move, seed: <int>, x: <int>, items: [<slug>, ...] }  # deal only
stage: 1 | 2 | 3 | 4               # Sam's handover stage during the session
generated: { by: ..., at: ... }
---
```

Body sections: `# Recall` (step-0 result: questions, Sam's answers, right or
wrong; or `skipped: overloaded` / `skipped: <reason>`), `# Sam's guess` (written
before reading), `# Notes` (table: `| Sam | Claude | gem | hint |`; `gem` is a gem
type, `hint` is the level 1-3 a Claude note was opened at, or `-` for Sam's own
notes; the index counts `hint` = 3), `# Disagreements` (table: point, Sam's view, Claude's view, how to
settle, status), `# Mutations` (Sam's first, then Claude's, each with Sam's
keep/kill and reason), `# Kill test` (prediction written before the run, result),
`# Teach-back` (Sam's five sentences and the gaps probed), `# What we learned`
(new atoms, lenses, moves, open questions).

## Scout Batch (`batches/YYMMDD-batch-<n>.md`)

```yaml
---
type: Scout Batch
title: Scout batch <n> (<yyyy-mm-dd>)
description: <scopes covered and card count>
tags: [ideas, scout]
status: draft                      # stable once Sam has voted
sources: [{ id, resource, title }, ...]
generated: { by: ..., at: ... }
---
```

Body: `# Basis` (how each card was read), `# Votes` (table: `| # | Card |
Cluster | Level | Guess | Vote | One word | Zoom |`; `Level` is the cluster level
or `unset`; `Guess` is Sam's gem-type guess before seeing the card's reason, from
stage 2 on, else empty; `Vote` is `up | down | later`; `Zoom` is `yes` when Sam
asked for the brief of that card, else empty), then one section per card
when the cards are stored in the file.

## State files (`me/`, type `State`)

Each is one file, edited at runtime. No skill hardcodes their values.

| File | Body |
|------|------|
| `scopes.md` | Table: scope, since, note |
| `interest-state.md` | `# Clusters` table: `| Cluster | Level | Zooms | Signals | Since |`; `Level` is `core`, `adjacent`, `delegated` or empty; `Zooms` counts briefs Sam asked for in that cluster. A cluster with no level gets the short role-level card; the one-line interface card is for `delegated` only. `# Settings`: cards per batch, explore slots per batch, weekly card budget. `# Change log` table: date, cluster, from → to, why. Sam's commands win, in any language |
| `known-atoms.md` | Table: atom slug, level (`seen`, `owned`), since, evidence (how Sam showed it: explained it, spotted it in a new source). Only core and adjacent clusters |
| `taste.md` | Table: date, source, gem Sam saw that Claude missed, gem type. Table: date, card, vote, one-word reason |
| `progress.md` | Table, one row per session: `| Date | Reading | Mode | Unaided gems | Roles named right | Sam-unique mutations | Level-3 hints | Gems Claude missed | Skips |`. `Mode` is `brief`, `deep`, `skim` or `deal`. The three skill columns are finding gems (`Unaided gems`), naming roles (`Roles named right`, of total) and proposing mutations (`Sam-unique mutations`). `# Stage` with the criteria below |

Handover stages (defaults; change them in `progress.md` from real data):

| Stage | Sam does | Move up when |
|-------|----------|--------------|
| 1 | Votes with one-word reasons; asks in briefs | About 30 atoms `owned` |
| 2 | Guesses the gem type before reading the card's reason | Over 60 % of guesses right |
| 3 | Writes the recipe for chosen sources; Claude reviews | Sam's cards need few corrections |
| 4 | Full co-reads on hard sources; brings new scopes and seeds | — |

## Bulk staging

`idea-mine` in bulk writes into a staging folder outside the bank (for example
`$TMPDIR/idea-mine-<date>/`, with the same layout), then merges in:

1. Dedupe atoms against the bank by structure, rewrite slugs, append migrations
   and cards to existing atoms.
2. **Normalize role tags and tensions.** Run
   `idea_index.py <staging> --suggest-merges` (and on the bank plus staging
   together). For each suggested pair, decide by meaning whether the two tags
   name the same job; rewrite the losing tag everywhere (cards' `roles` and
   `tensions`, atoms' `roles` and migration rows, moves' `role`). Keep the tag
   the bank already uses. The index matches tags exactly, so an unmerged
   synonym hides a migration gap.
3. Copy only after `idea_index.py` on the staged folder reports no broken links.

A half-finished bulk run never touches the bank.

## Gem taxonomy

Use these values in `gem_types` and in `[gem: ...]` margin tags.

| Gem type | What it is |
|----------|-----------|
| `migration-gap` | An atom mature in field X fits an open tension in field Y, and Y has not used it |
| `lifted-constraint` | An atom was forced by a limit of its time; the limit has gone |
| `unpopular` | Few agree, and the reason is diagnosed as one of the gem reasons below |
| `view-model` | The author's picture, hunch or surprise is reusable beyond the source |
| `convergence` | Unrelated groups reached the same role with different atoms: the role is real |
| `rejected-alternative` | A "we tried X but" passage; X may win once its constraint is gone |
| `contradiction-resolved` | The source resolves a want-X-and-not-X instead of trading off |

### Why is it unpopular?

| Reason | Gem? |
|--------|------|
| The bet is wrong | No: drop it |
| A constraint of its time, now lifted | Yes: pair with `lifted-constraint` |
| Wrong vocabulary or field: the people who need it don't read it | Yes: pair with `migration-gap` |
| Unfashionable: the field is chasing another direction | Yes |
| Poor execution, good bet | Yes: redo it well |
| Lives in another language community | Yes |

## Mutation operators

| Operator (`move_type`) | Move |
|------------------------|------|
| `substitute-atom` | Keep the role, change the atom (C → D) |
| `substitute-operator` | Change how atoms combine: sequence → loop, tree, gate, adversarial |
| `remove` | Drop an atom; does the bet still hold? |
| `lift-constraint` | Rebuild an atom as if its limit were gone |
| `invert` | Reverse order, direction, or who does what |
| `migrate-atom` | Keep the atom, move it to another field or role |
| `transfer` | Keep the bet, apply it to another field's tension (the atoms may change) |
| `correct-parameter` | Keep the recipe, fix a number the parent got wrong (a dose, a threshold, a ratio) |
| `relabel` | Keep the structure, rename what it is for; the new name changes who uses it |
| `retarget` | Keep the method, change the outcome it optimises or is judged by |
| `cross-card` | Take an atom or operator from another card |
| `resolve-contradiction` | Separate the want-X-and-not-X in time, space, scale or condition |
| `lens-transfer` | See problem P through another person's or field's lens |
| `lens-inversion` | Assume the opposite of the dominant lens and see which solution appears |
