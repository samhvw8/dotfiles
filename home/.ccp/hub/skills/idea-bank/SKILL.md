---
name: idea-bank
description: "Shared store and formats for Sam's idea work: where the bank lives ($IDEA_HOME), the schema for idea cards, bricks, lenses, moves, readings, scout batches and Sam's state files, how bricks are split, bound and linked (`parts`, `links`), the index script that finds links, convergence and migration gaps, the search script (embeddings + BM25) that finds existing bricks, and how to commit the bank. Use when another idea skill (idea-scout, co-read, idea-forge, idea-mine) writes or reads the bank, when Sam asks to search the bank or his ideas for something, find or dedupe bricks, see what a brick is part of or linked to, run the idea index, or see convergence and migration gaps. Not for deciding what to read or how to collaborate; the caller skills own that."
---

# Idea bank

This skill owns the mechanism: location, formats, links, index, commits.
The caller skills own policy: what to read, how Sam and Claude split the work,
what goes in a batch. Keep that split, so one schema change reaches every caller.

## What a brick is

Every idea skill works with bricks. Read this before you split, bind, name or
match one.

A **brick** is any piece of an idea that does one job you can name: it takes
something in, gives something out, and keeps to a constraint. "Filters bad
samples" is a brick. "A cheap check before a strong one" is a brick. A whole
method seen as one block is a brick too.

- **No fixed size.** A brick can be cut into smaller bricks, and bricks bind into
  a bigger brick. No brick is the smallest piece: never call a brick atomic or
  final. Today's split goes only as far as today's view can see.
- **Scissors and tape are tools, not facts.** Cutting and binding are operations
  you apply through a lens: a way of looking, such as "where does the cost go" or
  "what does the data pass through". Different lenses cut the same brick in
  different places. Keep every cut, each with its lens in `cut`
  (`references/schema.md`, Parts and links). A new cut never replaces an old one.
- **A later view may cut again.** When a new lens shows more structure inside a
  brick, add a cut. Do not rename, move or relabel the brick.
- **Name by job, not by identity.** "filters bad samples", not "reward model".
  The same structure in two fields is one brick with two names.
- **Same brick means same structure.** Match input, output, objective,
  constraint and math form. Names and embeddings mislead.

Bricks live in `bricks/`, one per file (`type: Brick`). A card records one
source and the bricks its recipe uses. A lens records a way of seeing. A move
records how one source changed another source's bricks.

## Find the bank

Resolve the root once per session, in this order:

1. `$IDEA_HOME`, when it is set.
2. `~/workspace/knowledge/ideas`, when `~/workspace/knowledge` exists.
3. `~/knowledge/ideas`.

Create the root and the layout below on first use. When the root came from a
default, tell Sam once which path you use. Never write bank files anywhere else,
because a second copy splits the links.

## Layout

| Path | Holds | Type (`schema.md`) |
|------|-------|--------------------|
| `bricks/` | One brick per file, named by its role-level slug | `Brick` |
| `lenses/` | One view model per file | `Lens` |
| `moves/` | One move (diff between a source and its parent) per file | `Move` |
| `cards/` | One six-layer card per source | `Idea Card` |
| `people/` | Optional profiles | `Person` |
| `readings/` | `YYMMDD-<slug>.md`, one per reading session | `Reading` |
| `batches/` | `YYMMDD-batch-<n>.md`, one per scout batch | `Scout Batch` |
| `me/` | Sam's state: `scopes`, `interest-state`, `known-bricks`, `taste`, `progress` | `State` |

Bulk runs (`idea-mine`) stage outside the bank and merge in only after the
index on the staged folder shows no broken links (`schema.md`, Bulk staging).

Every directory has an `index.md` (no frontmatter). Add a line there and a dated
line in the bundle's `log.md` when you create a concept. `bricks/index.md` is the
exception: `idea_index.py --write` regenerates it. The bank is an area of an
OKF bundle: load the `okf` skill before restructuring it.

## Rules

- **Files in English, chat in Sam's language.** Bank files are read by every
  model and tool; the chat follows the language Sam writes in.
- **Formats come from `references/schema.md` only.** Read it before writing any
  bank file. Do not invent fields in a caller skill; add them to the schema.
- **Intent is quoted or marked.** Every field that states what an author meant,
  felt or believed carries a quote with its section, or `(inferred)`. Without this
  rule a model writes tidy intentions the author never had.
- **Keep the raw beside the bricks.** A card stores the quotes and a source
  pointer next to its bricks. Summaries drop nuance that later retrieval needs.
- **Name bricks by role, not by identity.** "filters bad samples", not "reward
  model". Substitution and migration only work at the role level.
- **Best effort, then Sam corrects.** Splitting, linking, merging and naming
  units is Claude's work, done as far as Claude can judge, not held back for a
  perfect rule. Mark a doubtful call `(inferred)` and make it anyway. Record
  each correction Sam makes (in the unit's file, and as a row in
  `me/progress.md`), so the next pass starts from it.
- **Presence mode: Sam is absent unless he turns it on.** This is the only
  definition; the other idea skills point here.
  - **Absent (default).** Claude does every step itself, best effort: splits,
    recombines, writes variants, cards and kill-test predictions, files drafts.
    It never stops to ask Sam to write first, and logs no skip: absence is not a
    skip.
  - **Present.** On after Sam types `/idea-present` (or `/idea-present on`) in
    this conversation, until `/idea-present off`. The "Sam writes first" steps of
    co-read, idea-forge and idea-scout then run as written, and skips are counted.
  - Steps that only make sense with Sam (co-read deep mode, idea-forge deal mode,
    Sam's own kill-test prediction, scout's gem-type guess) run only in present
    mode. In absent mode, offer them in one line: "Type /idea-present to do this
    together." and stop there. Asking for one of these steps ("deal me some
    bricks", "go deep") does not turn present mode on; only the switch does.
  - The switch lives in the conversation. A new session, or a compaction summary
    that does not show it, is absent.
- **State is data, not config.** Levels, budgets and ratios live in `me/`.
  No skill hardcodes a topic level or a number Sam can change at runtime.

## Link and dedupe bricks

Two bricks are the same when their structural signatures match (input, output,
objective, constraint, math form), whatever each field calls them. Judge this by
structure mapping: compare the relations, not the names. Name or embedding
similarity misleads here, because each field renames the same structure
("sparse coding", "dictionary learning", "SAE features").

To merge: keep the older file, move the other names into `names`, append the
other file's `migrations` and `cards`, and leave the removed file as
`status: deprecated` with a link to the kept one. Log the merge.

## Search the bank

```bash
uv run <this skill's folder>/scripts/idea_search.py <bank-root> index                    # embed changed chunks
uv run <this skill's folder>/scripts/idea_search.py <bank-root> search "<text>" --type brick [--rerank]
uv run <this skill's folder>/scripts/idea_search.py <bank-root> like <brick> --other-fields
```

`search` fuses EmbeddingGemma 2 vectors (several chunks per file: signature,
gloss, names per field, migrations; card layers and rows) with BM25 and returns
30 candidates. `like` ranks bricks by signature and shows topic similarity and
shared fields beside it. It starts llama.cpp's `llama-server` for one command
and stops it after (first index of the bank: about a minute on the Mac).
Vectors are cached in `<bank-root>/.index/`, which is git-ignored derived data.

The list is a shortlist, not an answer. Judge each candidate by structure
before you link or merge it: on the bench the correct brick was in the top 10
for 72% of real links and in the top 30 for 81%. `--rerank` reorders the brick
shortlist by structure with one Haiku call (about $0.002): on held-out rows the
right brick came first 53% of the time instead of 39%. Use it when a reader will
look at only the first few rows (bulk mode); a model that reads all 30 does the
same job itself. `--graph` adds Personalized PageRank over the links; no graph
variant beat plain fusion on held-out rows at this bank size.

## Run the index

```bash
uv run <this skill's folder>/scripts/idea_index.py <bank-root> [--json out.json]
uv run <this skill's folder>/scripts/idea_index.py <bank-root> --write   # regenerate link views
uv run <this skill's folder>/scripts/idea_index.py <bank-root> --check   # exit 1 if views are stale
```

It is deterministic and offline. It reports:

- brick ↔ card links and broken links;
- bricks by number of fields;
- **convergence**: one role filled by bricks from two or more fields, and hot
  slots (a card role whose brick was substituted two or more times in `moves/`);
- **migration-gap candidates**: a brick whose role tags match a card's
  `tensions` in a field the brick has not reached yet;
- `migrate-brick` moves (they widen a brick's fields; hot slots count only
  `substitute-brick`);
- low-confidence migration matches, for review;
- cards by constraint of the time (input for a later price tracker);
- level-3 hints per reading;
- known-bricks coverage (`me/known-bricks.md`).

Gap candidates are a list for judgement, not findings. Open each candidate and
judge by structure whether the brick could fill the role in that field before you
show it to Sam.

## Monthly view

Once a month, or when Sam asks: run the index, then show Sam the convergence
list, the top gap candidates you judged real, and bricks that moved from "seen" to
"owned" in `me/known-bricks.md`. Callers (`idea-scout` retro) use this view.

## Commit after each session

The bank sits inside a git repo (by default `~/workspace/knowledge`). After a
session that changed bank files:

1. Regenerate the link views: `idea_index.py <bank-root> --write`, then
   refresh the search cache: `idea_search.py <bank-root> index`.
2. Validate: `uv run ~/.claude/skills/validate/scripts/okf_validate.py <bundle-root> --strict`.
3. Stage only bank paths and the bundle `log.md`: `git -C <repo> add <bank-root> <bundle>/log.md`.
4. Commit with a conventional message, for example `feat(ideas): add card for <slug>`.
   Add no AI attribution lines.

If the root is not in a git repo, say so once and suggest `git init`; do not
create a repo yourself.

## References

- `references/schema.md`: every type's frontmatter and body template, the gem
  taxonomy, the unpopularity diagnosis and the mutation operators.
- `scripts/idea_search.py`: hybrid search; `scripts/test_idea_search.py`
  tests it without a model. Bench: `~/workspace/tools/idea-evals/search-bench`.
- `scripts/idea_deal.py`: deals a hand (bricks, lenses, moves) for idea-forge's
  deal mode; `scripts/test_idea_deal.py` tests it.
- `scripts/idea_index.py`: the index; `scripts/test_idea_index.py` and
  `scripts/fixtures/` test it.
