# Compute Awareness

K parallel trajectories = K× token cost. Deliberation adds another pass. Total cost ≈ (K+1)× single inference.

| K | Relative Cost | Justified When |
|---|--------------|----------------|
| 1 | 1× (no HeavySkill) | Easy problem, high confidence |
| 3 | ~4× | Standard hard problems |
| 5 | ~6× | Competition-grade, correctness critical |
| 8+ | ~9×+ | Workflow/batch only — research-grade |

## Decision Heuristic

If the cost of a wrong answer < cost of K extra inferences → skip HeavySkill.
If a wrong answer is expensive (production bug, exam, proof) → compute pays for itself.

## Non-Monotonic Performance

Performance degrades past optimal thinking length. More compute ≠ always better.

- Easy problems: sequential revision outperforms parallel sampling (Snell et al., ICLR 2025)
- Hard problems: parallel resampling/tree search outperforms sequential revision
- Iterative deliberation: HM@K improves but HP@K degrades past ~3 iterations (noise accumulation)

Match K to difficulty. Don't default to maximum.
