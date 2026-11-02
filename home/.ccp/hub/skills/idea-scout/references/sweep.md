# Sweep and filter (L1)

## Raw material

Gems live where authors are least polished. Look past the abstract:

| Source | What it gives |
|--------|---------------|
| Methods, Discussion, Future work, footnotes | Rejected alternatives, constraints of the time, hunches ("we believe", "intuitively", "surprisingly") |
| OpenReview reviews and rebuttals | Why the authors chose X over Y; what they refuse to concede (their core belief) |
| arXiv v1 → v2 diff | How the framing changed under review |
| Author talks, podcasts, threads, blogs | The view model in plain words, often before the paper |
| Rejected or workshop papers, theses | Unfashionable or early bets |
| "Sleeping beauties": old, little-cited work in a scope | Ideas whose constraint may have lifted |
| Non-English communities (ZH, ZH-TW, others the topic needs) | Ideas the English field has not read |

## Tools

- `web_search` with `tags: ["science"]` for papers; add `focus` naming the gem you
  want (for example "a mechanism moved from another field into <scope>").
- `social_search` (no platform for the default mix, or `tags` such as `cn`) for
  threads, then `social_thread` on a promising id. Social returns are often thin;
  retry with a broader query or without `focus` before you give up, and say in the
  batch's `Basis` when social returned nothing.
- `fetch_page` / `batch_fetch` with a `query` such as "what problem do the authors
  see, why do they think their approach works, what surprised them, what did they
  try that failed" to read the passages that hold intent.
- `lead-researcher` in ideas mode for a large or new scope.

## Queries by gem type

| Gem type | Query shape |
|----------|-------------|
| `migration-gap` | "<method from field X> applied to <scope problem>"; "<scope problem> borrowed from <physics, control, ML, ecology>" |
| `lifted-constraint` | "<old technique> revisited", "now feasible", "<technique> with LLMs" |
| `unpopular` | "alternative explanation", "challenges the consensus", "replication failure" + "<scope>" |
| `view-model` | author interviews, "why I think", essays by researchers in the scope |
| `convergence` | the same role named in two fields' vocabularies |
| `rejected-alternative` | "we also tried", "did not work", "negative result" + "<scope>" |

Use each scope's own vocabulary and one neighbouring field's vocabulary. Don't put a
year in a query; prefer recent items by sorting what comes back.

## Keep or drop

1. Name the gem type from the source's text. No gem: drop.
2. For `unpopular`, diagnose the reason with the schema table. "The bet is wrong": drop.
3. Check scope fit. No fit: keep only as an explore candidate.
4. Check the source is not already a card in `cards/` (same `resource`).
5. Rank the keepers: gem strength first, then relevance to Sam's scopes and projects,
   then how many atoms it adds beyond his known set (fewer is better at stage 1).
6. Take the batch size and explore slots from `me/interest-state.md` settings.

Record how each kept source was read (`abstract`, `passages`, `full-text`, `post`)
for the batch's `Basis` section. When only an abstract was open, say so on the card.
