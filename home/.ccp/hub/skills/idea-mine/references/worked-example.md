# Worked example (illustration)

One full card, to show the shape and the level of detail. **Illustration:** the
quotes below are paraphrases from memory of Olshausen & Field (1996), not checked
against the paper. A real card quotes verbatim and passes `check_quotes.py`.

```markdown
---
type: Idea Card
title: "Emergence of simple-cell receptive field properties by learning a sparse code for natural images"
description: A learned, overcomplete basis with a sparsity cost on its coefficients reproduces V1 simple-cell receptive fields from natural images.
tags: [ideas, card, vision]
resource: https://doi.org/10.1038/381607a0
field: neuroscience
atoms: [sparse-overcomplete-code]
lenses: [efficient-coding]
roles: [sparse-represent-signal, learn-basis-from-data]
tensions: []
parent: fixed-basis-image-coding
moves: [fixed-to-learned-basis]
gem_types: [migration-gap, view-model]
evidence: moderate
read_basis: full-text
intent_sources: [paper]
constraints: [compute-per-patch-cost]
status: draft
generated: { by: claude-code/claude-opus-5-5, at: 2026-11-02T00:00:00Z }
---

# View model (layer 0)
- Picture: the visual cortex is a coding system shaped by the statistics of natural images (paraphrase, Introduction)
- Bottleneck: not the neurons' wiring but the right objective; find the objective and the receptive fields follow (inferred)
- Expected solution shape: learned from data, not designed by hand (inferred)
- Taste: one simple objective (reconstruct well, use few active units) over a hand-built model of each cell type (inferred)
- Surprise: localized, oriented, bandpass filters appear without being asked for (paraphrase, Results)
- Source domain of the picture: information theory and image compression (efficient coding, Barlow)

# Contradiction (layer 1)
Want a representation that keeps all the image information, and want almost all units silent for any one image.

# Resolution principle (layer 2)
Separation by scale: an overcomplete basis (more basis functions than pixels) lets each image use only a few of many functions.

# Bet (layer 3)
"If V1 is optimized for sparse codes of natural images, then learning such a code should reproduce its receptive fields." (paraphrase of the paper's framing)

# Recipe (layer 4)
| Role | Atom (slug) | Signature (input -> output, objective) | Why this atom |
|------|-------------|----------------------------------------|---------------|
| sparse-represent-signal | sparse-overcomplete-code | image patch -> sparse coefficients; reconstruction error + sparsity penalty; basis larger than input | The sparsity term encodes the efficient-coding bet (inferred) |
| learn-basis-from-data | (new) gradient-learned basis | image patches -> basis functions; minimise the same cost | Fixed bases (Fourier, wavelets) assume the answer; learning tests the bet (inferred) |
Operator: loop (alternate inferring coefficients and updating the basis)

# Diff and constraints (layer 5)
- Parent: fixed-basis image coding (DCT, wavelets) and PCA models of receptive fields
- Move: substitute-atom (fixed basis → learned overcomplete basis + sparsity), see /ideas/moves/fixed-to-learned-basis.md
- Constraints of the time: small image patches (about 12x12) and slow optimization, set by 1990s compute (inferred)
- Rejected alternatives: PCA gives global, non-localized filters, unlike cells (paraphrase)

# Story told vs real thinking
Not checked: no talks or drafts read for this illustration.

# Raw
(illustration: a real card lists each verbatim quote with its section here)

# Mutations
| Operator | Variant | Role fit | Novelty link | Kill test | Sam verdict | Origin |
|----------|---------|----------|--------------|-----------|-------------|--------|
| lift-constraint | Learn on whole images or video; patch size and compute limits are gone | Same role, larger input | not searched | Train on full frames; does the basis stay localised? | | claude |
| transfer | The same bet on sound | Same bet, new atoms per modality | later work did this (cochlear-like filters) | — | | claude |
| migrate-atom | The same atom on a network's activations | Role becomes decompose-activations | later: sparse autoencoders for interpretability | — | | claude |
```

What makes this card useful later:

- The atom is named by structure (`sparse-overcomplete-code`), so the
  interpretability card that calls it "SAE features" links to the same file.
- The move file (`fixed-to-learned-basis`) is reusable: "replace a designed basis
  with a learned one plus a constraint" applies far beyond vision.
- The mutations predicted real later work, which is the kind of check the lineage
  backtest scores.
