# Kill-tests and novelty checks

## Novelty search by structure

Keyword search finds work that uses the same words, and misses the same idea in
another vocabulary. Write two queries per variant:
1. **Structure query:** the signature in plain words plus the target field
   ("learned sparse basis over activations, interpretability").
2. **Field-name query:** the target field's likely name for it, if you can guess
   one ("dictionary learning neural network features").

Tools: Parallax `web_search` with `tags: ["science"]` for papers (`hf_papers`
engine for ML), `social_search` for practitioner threads, `gh search repos` and
`gh search code` for implementations. Fetch the best hit's abstract or README
before you call a variant "done before". Record the link either way.

Outcomes:
- **Done and known:** link it, keep the variant only as a move to learn from.
- **Done and ignored:** diagnose with the schema's "Why is it unpopular?" table.
- **Not found in two searches:** say "not found in two searches", not "novel".

## Design the cheapest kill-test

A kill-test answers one question: is there a result that would make Sam drop
this variant? Design it before you design anything else.

| Ask | Good answer |
|-----|-------------|
| What result kills it? | A number and a direction: "if the learned basis does not beat DCT on reconstruction at equal sparsity, kill" |
| What is the cheapest data that can show it? | Toy or synthetic data first; a public dataset second; real data last |
| What is the baseline? | The atom it replaces, run under the same budget and tuning |
| How long does it take? | Minutes to hours. A kill-test that takes weeks is a project, not a test |
| Where does it run? | Laptop notebook; home GPU (check `nvidia-smi` and `tmux ls` first); paper code via `paper-replicate` |

Watch for the usual ways a test lies: the new atom gets more tuning than the
baseline, the metric is tuned on the test data, survivors-only averages, and a
criterion moved after the result.

## Protocol

1. Sam writes his prediction (direction and rough size).
2. Fix the kill criterion, metric and baseline in the reading or card file
   before the run.
3. Build and run. Sam writes the core lines in a deep session; Claude writes the
   harness.
4. Report the real number against the criterion. A miss with the real output is
   a full result.
5. Write back: atom `kill_tests` row; a `Move` file when the variant survives;
   `me/progress.md` updated.

## Result values

`survived` (passed the criterion), `killed` (failed it), `inconclusive` (the test
could not decide: say why and what test would). Never upgrade inconclusive to
survived.
