# Paper Details

Source: HeavySkill: Heavy Thinking as the Inner Skill in Agentic Harness (arxiv 2605.02396)
Authors: Jianing Wang et al. (Meituan LongCat team)
Repo: github.com/wjn1996/HeavySkill

## Serialized Memory Cache (§2.2)

Structured context storing candidate trajectories for deliberation:
- Trajectories are **shuffled** to prevent position bias
- Token limits enforced through pruning (truncate reasoning, preserve answers)
- Formal: C(xc) inputs into sequential deliberation

## Trajectory Selection Strategies (Appendix A)

Tested across 256 parallel trajectories:

| Strategy | Performance |
|----------|-------------|
| Max-Answer-Num | Significantly best — consensus-based selection |
| Max-Diversity | Moderate |
| Random | Moderate |
| Max-Length | Worst |

Max-Answer-Num: group trajectories by extracted answer, select from most-frequent answer groups first. Use when K > 5 to select top 4.

## Iterative Deliberation (§2.3)

At iteration t: xc(t) = T_πφ(xc(t-1), K(t-1)) ∥ x(t-1)

Upward HM@K trend but divergent HP@K degradation — trade-off between iterative depth and information consistency. Cap at 2-3 iterations.

## Model Separation (§4.2)

Fixed parallel reasoner (R1-Distill-Qwen-7B), varied deliberators:
- HM@K outperforms M@K regardless of deliberation model
- Counter-intuitive: Qwen2.5-32B-Instruct (weaker at independent reasoning) yields expected gains through synthesis
- Deliberation relies on synthesis ability, not peak reasoning power

## RLVR Integration (Appendix B)

VeRL framework + GSPO algorithm on R1-Distill-Qwen-7B:
- ~10% HM@4 improvement in 100 training steps
- K=16 config shows entropy collapse due to sequence length constraints
- Proves heavy thinking width/depth are learnable via RL

## Key Metrics

- Mean@K (M@K): average accuracy across K trajectories
- Pass@K (P@K): at least one trajectory correct (upper bound)
- Vote@K (V@K): majority voting accuracy
- Heavy-Mean@K (HM@K): average accuracy after deliberation
- Heavy-Pass@K (HP@K): oracle deliberation (at least one summary correct)

Performance hierarchy: HP@K ≥ HM@K ≥ V@K ≥ M@K
