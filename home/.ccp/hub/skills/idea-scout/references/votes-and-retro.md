# Votes, levels and the retro

## Recording votes

Sam votes `up`, `down` or `later`, each with one word. For each vote:

1. Fill the batch's vote table: `Vote`, `One word`, `Guess` (Sam's gem-type guess,
   from stage 2), `Zoom` (`yes` when he asked for the brief). Set the batch
   `status: stable` once every card has a vote.
2. Add a row to the votes table in `me/taste.md`: date, card, vote, word.
3. In `me/interest-state.md`, add the signal to the cluster's row (create the row
   with no level if the cluster is new): for example `2 up since 2026-11`.
4. If Sam zooms, add 1 to the cluster's `Zooms` column, mark `Zoom: yes` in the
   batch, and open that source in `co-read` brief mode.

Sam's one-word reasons are the cheapest view of his taste. Read `taste.md` before
every sweep and let it shift the ranking: a word that keeps coming back with `up`
names something to look for; one that keeps coming with `down` names something to drop.

## Proposing level changes

Propose, never apply. Suggest a level up when a cluster gets repeated `up` votes,
zooms or questions over two or more batches. Suggest a level down when a cluster's
cards get `down` or no votes over several batches. Write the proposal with its
evidence (the counts) and let Sam decide. Apply Sam's commands at once and log them
in the change log: date, cluster, from → to, why ("Sam: go deep on X").

## Retro (monthly, or when asked)

1. Read `me/progress.md`, the month's batches, votes and readings.
2. Report A/B balance:
   - (A) ideas: cards voted `up`, zooms, readings, mutations that reached a kill test,
     kill tests that survived.
   - (B) Sam's growth: unaided gems per session (trend), level-3 hints (trend),
     atoms moved from `seen` to `owned`, current handover stage and its criterion.
   Say plainly when one side is moving and the other is flat.
3. Up-vote rate per cluster and for explore cards. Propose level changes and an
   explore-ratio change with the numbers behind them.
4. Skip ratio from `progress.md`. If it is rising, say so directly.
5. Run `uv run ~/.claude/skills/idea-bank/scripts/idea_index.py <bank>`. Judge each
   migration-gap candidate by structure; show only the ones you judge real, plus the
   convergence list.
6. Write the retro as a short note in chat (Sam's language). Changes to state files
   wait for Sam's yes.

Retro report shape:

```markdown
A — ideas: <counts>. B — growth: <counts and trends>. Balance: <one line>.
Clusters: <up-rate table>. Proposed: <level changes, explore ratio, with evidence>.
Skips: <ratio, trend>. Bank: <convergence>, <real gap candidates>.
```
