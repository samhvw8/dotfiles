---
name: idea-mine
description: "Atomize a source (paper, article, journal piece, talk, repo, social thread) into a six-layer idea card for Sam's idea bank without Sam present: the author's view model and bet, the atoms named by the job they do, the operator, the diff from the parent source, and the gems. Use to fill the bank in bulk (\"mine these 50 papers on X\", \"atomize this cluster\"), to prepare a source before a co-read session, or when another idea skill needs a card. Not a substitute for Sam's own reading: to read or review a source with Sam, use co-read; to judge whether a claim is true, use paper-appraisal."
---

# Idea mine

You turn a source into an Idea Card that someone can recombine later: swap an
atom, move it to another field, lift a constraint, invert a lens. You read for the
move the authors made and why, not for whether their claims hold. A wrong paper
with a good bet still gets a full card.

The bank formats belong to `idea-bank`. Read its schema before you write a file,
and write only those shapes: `~/.claude/skills/idea-bank/references/schema.md`.
Resolve the bank root the way `idea-bank` says (`$IDEA_HOME` first).

## Why this skill exists

A plain read produces a summary: what the paper says, in its own vocabulary.
That is useless for recombination, for three reasons this skill fixes:

- **Vocabulary hides structure.** "Sparse coding", "dictionary learning" and "SAE
  features" are one atom. Name atoms by the job they do and write their
  structural signature, so the bank can see the match across fields.
- **The paper hides the thinking.** A paper is written after the result, so its
  story is reconstructed. Intent, hunches and dead ends live in rebuttals, talks,
  early drafts and "we tried X but" passages. Go there.
- **A summary drops the raw.** Extracted facts lose nuance that later questions
  need. Keep the quotes each layer rests on in the card's `Raw` section.

## Workflow (one source)

1. **Get the raw material.** Full text first: Parallax `fetch_page` on the DOI,
   arXiv, PMC or publisher URL (read the outline, then sections). If it returns
   "abstract only", get the PDF or TeX with `paper-download` (`paperhunt get`,
   `paperhunt bundle`). Set `read_basis` honestly; an abstract-only card is
   allowed, and says so.
2. **Search where intent leaks.** Spend a few calls on the places in
   `references/intent-sources.md`: OpenReview reviews and rebuttals, the arXiv
   v1 → v2 diff, author talks and threads before the paper, the code repo's
   history and "why did you" issues, related-work framing, rejected alternatives,
   "surprisingly" and "we believe" sentences. Stop when two places give nothing new.
   List the places that gave intent in the card's `intent_sources`.
3. **Find the parent.** `paperhunt snowball <id>` (backward references) or the
   related-work section names the source this one mutated. Write the diff as a
   Move file with a `move_type` from the schema. Record the constraints of the
   time: compute, data, tools, cost that forced an atom choice, in the body and
   as slugs in `constraints` (`gpu-hour-cost`, `label-cost`; reuse slugs). Limits
   on what the evidence can show go in `evidence_limits` instead. Set
   `source_kind`; a synthesis note follows the schema's synthesis-note rules
   (Basis line, the note's grade, several bets in `# Bets`).
4. **Fill the six layers** in schema order (view model, contradiction,
   resolution principle, bet, recipe, diff and constraints), then "Story told vs
   real thinking", `Raw`, and optional `Mutations` (the schema's table, origin
   `claude`). The recipe table keeps the atom slug, its signature and the
   author's reason in separate columns. New cards get `status: draft`.
5. **Match atoms before you create them.** For each recipe role, search the bank
   for an atom with the same structural signature under another field's name, as
   `references/atom-matching.md` describes. Link the existing atom, add the new
   field's name and a migration row when the field or role is new, with
   `match_confidence` (`high`, `medium`, `low`). Create a new atom only when no
   signature matches.
6. **Lenses and people.** When the view model already exists as a Lens, link it
   and add this card; when you see it a second time across sources, create the
   Lens. A Person file is optional, for authors whose bets recur.
7. **Tag gems** from the schema's taxonomy. For `unpopular`, write which reason
   from the schema's table applies; "the bet is wrong" means no gem.
8. **Check and commit.** Run `scripts/check_quotes.py` against the source text
   (it finds quotes that are not in the source), fix or mark them, run the
   `idea-bank` index, validate the bundle, and commit as `idea-bank` says.

## Rules for the card

- **Every intent claim carries a marker:** a quote with its section, or
  `(inferred)`. This covers the picture, bottleneck, taste, surprise, bet, and the
  "why this atom" column. Models invent tidy intentions; the marker is how a
  reader tells the author's mind from yours.
- **Never invent mechanism.** If the source does not say why something works,
  write "the source does not explain why".
- **Roles are verb phrases about the job** (`filter-bad-samples`), never the
  implementation (`reward-model`). If a role names a technique, rewrite it.
- **Evidence is a tag, never a filter.** Set `evidence` and move on. A weak study
  with a reusable bet keeps every layer.
- **Reuse slugs.** Run `idea_index.py` first and reuse its field and role slugs;
  the index matches gap candidates on exact role tags.
- **Social posts and articles get the same card.** Layer 0 is often clearer in a
  post than in a paper; layers 1, 2 or 5 may be "not stated". Say so; don't fill.

## Bulk mode

For many sources (a cluster, a reading list, 50 papers):

1. Build the list with `paperhunt search` or the caller's list; dedupe by DOI or
   arXiv ID; skip sources that already have a card.
2. Run one subagent per source, never more than 6 in flight, as a rolling pool.
   Count running agents from real completion notices only, never from your own
   text. Use the
   brief in `references/bulk-mode.md`; it carries the schema path, the bank root,
   the slugs from the index, and the quote rule, because subagents do not load
   this skill.
3. Have each subagent write its card to a staging folder outside the bank (for
   example `$TMPDIR/idea-mine-<date>/`, schema "Bulk staging"). You merge:
   match atoms across the batch (two subagents may create the same atom under
   two names), then move cards into the bank.
4. Verify a sample yourself: at least one card in five, plus every card with a
   `migration-gap`, `lifted-constraint` or `unpopular` tag. Run
   `scripts/check_quotes.py` on all of them; read the flagged quotes against the source.
5. Run the index and report to the caller (anything shown to Sam follows
   "Rendering for Sam" in the idea-bank schema): cards written, atoms created vs
   linked, broken links, convergence, and migration-gap candidates you judged
   real by structure (the index only lists candidates).

## Preparing a co-read session

When `co-read` asks for prep, write the card as usual but keep it out of Sam's
sight: `co-read` hides Claude's notes until Sam has written his own. Mark the
card `status: draft` and tell the caller its path.

## Output to the caller

One short block per source: card path, the one idea, gem types, atoms created or
linked, the parent and move, `read_basis`, and anything you could not get
(paywall, no rebuttal found). In bulk mode, the table from step 5.

## References

- `~/.claude/skills/idea-bank/references/schema.md`: every format (owned by `idea-bank`).
- `references/intent-sources.md`: where intent leaks and how to query each place.
- `references/atom-matching.md`: matching atoms by structure across fields; migration rows.
- `references/bulk-mode.md`: the subagent brief and the merge procedure.
- `references/worked-example.md`: one full card (illustration).
- `scripts/check_quotes.py`: run it; finds card quotes missing from the source text.
