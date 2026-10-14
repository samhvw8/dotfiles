# ML/AI empirical papers

There is no GRADE or RoB tool for benchmark and methods papers. Judge the claim
against the checks below, each with a quoted sentence or table from the full text,
and give a qualitative confidence (high / moderate / low / very low) with reasons.
A clinical prediction model goes to `probast-ai.md` first.

## Checks

| Area | Ask | Red flags |
|------|-----|-----------|
| Claim scope | Does the abstract's claim match what the experiments test? | "State of the art" on one benchmark; general claims from one domain |
| Baselines | Strong, recent baselines? Same data, compute and tuning budget for baselines as for the method? | Baselines copied from old papers; only the new method tuned; missing obvious simple baseline |
| Ablations | Is each component's contribution isolated? | Gains attributed to a component never removed |
| Seeds and variance | Number of runs/seeds stated? Std, CIs or significance tests? | Single run; gains smaller than seed variance; best-of-N reported as typical |
| Data leakage | Train/validation/test separated? Test used for model selection or early stopping? Preprocessing fit on all data? Near-duplicates across splits? | Tuning on test; no held-out set; temporal leakage |
| Benchmark contamination (LLMs) | Could the test set be in pre-training data? Contamination check done (n-gram overlap, canary, post-cutoff test set)? | Public benchmark older than the model's cutoff, no check |
| Evaluation validity | Does the metric measure the claimed ability? LLM-as-judge validated against humans? Prompt and decoding settings fixed across systems? | Cherry-picked examples; metric gaming; judge from the same model family |
| Compute | Training and inference compute reported? Is the gain bought with more compute? | Unequal budgets hidden |
| Reproducibility | Code, data, weights, configs released? Enough detail to reproduce? | "Code available on request"; missing hyperparameters |
| Statistics | Multiple comparisons across many tasks? Effect sizes, not just bold numbers? | Bold best-in-row with overlapping error bars |
| Peer review | OpenReview ratings, confidence, reviewer agreement, rebuttal, meta-review, decision | Wide rating spread; unresolved reviewer objections; rejected elsewhere |

## NeurIPS paper checklist as a lens

The NeurIPS checklist (current guide at neurips.cc/public/guides/PaperChecklist)
asks authors to answer Yes / No / NA with justification. Its 16 items name what a
good empirical paper reports:

1. Claims 2. Limitations 3. Theory, assumptions and proofs 4. Experimental result
reproducibility 5. Open access to data and code 6. Experimental setting/details
7. Experiment statistical significance 8. Experiments compute resources 9. Code of
ethics 10. Broader impacts 11. Safeguards 12. Licenses 13. Assets 14. Crowdsourcing
and research with human subjects 15. IRB approvals 16. Declaration of LLM usage

Read the authors' answers (usually in the appendix) and check items 4-8 against
the paper. An answer of "No" with a reason is honest; a "Yes" the paper does not
back up is a flag.

## OpenReview

Find the paper with `social_search platform=openreview`, then
`social_thread platform=openreview id=<forum@group ref from the hit>` (see
`retrieval.md` section 3). Record: each reviewer's rating and confidence, the main
objections, whether the rebuttal answered them, the meta-review, and the outcome
from the venue line ("ICLR 2025 Poster" vs "Submitted to ICLR 2025"). If the thread
cannot be read, write "OpenReview reviews: not retrieved" under Could not check.

## Confidence

| Level | Typical profile |
|-------|-----------------|
| High | Strong tuned baselines, ablations, multiple seeds with intervals, leakage and contamination checked, code released, independent replication |
| Moderate | Most of the above; one gap that is unlikely to reverse the result |
| Low | Single runs or weak baselines or unchecked contamination; result could vanish |
| Very low | Leakage likely, claim beyond evidence, or not reproducible |
