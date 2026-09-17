# Design Tensions

Key competing concerns when applying HeavySkill:

## Consensus vs. Minority

Three of four agree — is the answer obvious? Not necessarily. Analyze reasoning chains, not answer frequencies. One rigorous proof outweighs three hand-wavy agreements. The paper shows minority answers with tighter logic can be correct when the majority has subtle errors.

## Width vs. Depth

More trajectories (width) covers more of the solution space. More deliberation iterations (depth) deepens analysis. Resolution: width first (K=3–5 in harness). Add depth only when first deliberation produces low confidence or fundamental disagreement.

## Speed vs. Thoroughness

K=3 in ~30 seconds — good enough for most problems. K=5 with iteration for competition-grade. Resolution: match K to stakes. Wrong answer cheap to retry → K=3. Wrong answer expensive → K=5 + iteration.

## Independence vs. Diversity

Truly independent agents with identical prompts may produce similar trajectories (same model, same biases). Encouraging diverse approaches in the prompt helps, but over-constraining approaches can reduce quality. Resolution: encourage diversity in the prompt naturally ("use whatever approach you find most natural") rather than forcing specific strategies.
