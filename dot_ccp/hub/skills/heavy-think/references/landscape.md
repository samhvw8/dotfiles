# Landscape Context

HeavySkill sits between simpler and more complex test-time scaling approaches:

| Approach | Mechanism | HeavySkill's Edge |
|----------|-----------|-------------------|
| Best-of-N | Sample N, pick best via reward model | Deliberation > selection — HeavySkill outperforms consistently |
| Majority Voting | Sample N, pick most common answer | Can only SELECT from existing answers; HeavySkill GENERATES new ones |
| Self-Consistency | Sample diverse CoT paths, marginalize to select | +17.9% on GSM8K, but still selection-based, not generative synthesis |
| Forest-of-Thought | Parallel trees + error correction | More complex, requires explicit search structure; HeavySkill is simpler and portable |

A smaller model with HeavySkill can outperform a 14x larger model without it (Snell et al., ICLR 2025).

## Key Benchmark Results

| Benchmark | Model | K | Mean@K | HM@4 | Vote@4 |
|-----------|-------|---|--------|-------|--------|
| AIME25 | GPT-5 | 8 | 92.5% | 96.7% | 96.7% |
| AIME25 | DeepSeek V3.2 | 8 | 93.3% | 96.7% | 93.3% |
| LiveCodeBench | GPT-OSS-20B | 8 | 69.7% | 85.5% | — |
| IFEval | R1-Distill-Qwen3-8B | 8 | 35.7% | 69.3% | — |

The IFEval result (+33.6% absolute) is particularly striking.

## Thinking-Model Synergy

Extended thinking models already do internal deliberation. HeavySkill adds EXTERNAL diversity that internal thinking cannot — they complement, not compete. Multiple independent external trajectories explore parts of the solution space that a single thinking chain might miss.
