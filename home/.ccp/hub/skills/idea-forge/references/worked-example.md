# Worked example: the sparse-coding chain (illustration)

Labels: the chain is history; the session around it is made up to show the
procedure. No numbers here are measured.

## The card

Source: Olshausen and Field (1996), "Emergence of simple-cell receptive field
properties by learning a sparse code for natural images".

- Bet: if V1 cells are an efficient code for natural images, then learning a
  basis under a sparsity constraint should produce receptive fields like V1's.
- Recipe: role `sparse-represent-signal` ← atom `sparse-overcomplete-code`
  (learned basis, L1 penalty); operator: alternate between inferring codes and
  updating the basis (loop).
- Parent: fixed-basis transforms (DCT, wavelets) used for image compression.
- Move from parent: `substitute-atom` on `sparse-represent-signal`: fixed basis →
  learned basis.
- Constraints of the time: compute limited patches to small sizes; no large
  image corpora.

## Step 1: Sam first

Sam writes: "Use the same learned sparse basis for audio instead of images."

## Step 2: Claude's neighbourhood (excerpt)

| Operator | Variant |
|----------|---------|
| `transfer` | Same bet (efficient code explains a sensory area) applied to auditory nerve responses. Sam reached this one too |
| `substitute-operator` | Replace the infer/update loop with a feed-forward encoder trained end to end (amortised inference) |
| `lift-constraint` | Patch size was set by compute; learn the basis on large patches or whole images |
| `migrate-atom` | Keep `sparse-overcomplete-code`, move it to a model's internal activations: role `separate-mixed-features` in interpretability |
| `invert` | Instead of learning a basis to explain the data, fix the basis and learn which data it explains well |
| `remove` | Drop the sparsity term: does a V1-like basis still appear? (It does not: the term is load-bearing) |

## Step 3: checks on the migration variant

- Role fit: signature maps. Input = activation vectors, output = sparse codes over
  a learned dictionary, objective = reconstruction + sparsity. What changes: scale
  (millions of vectors) forces amortised inference, so it pairs with the
  `substitute-operator` variant.
- Novelty: the structure query "learned sparse dictionary over neural network
  activations" finds sparse-autoencoder interpretability work. Verdict: done and
  known; keep it as a move to learn from. In the real chain this migration did
  happen, via K-SVD in signal processing and later sparse autoencoders on
  language-model activations.
- Kill-test design had it been new: on a small model, does the learned dictionary
  give features that are more monosemantic than the raw neurons under a fixed
  labelling rubric? Kill if not.

## Step 4: what the session teaches

- The productive variant came from migration, not substitution.
- Two operators combined (migration + amortised encoder) made it workable at
  scale. Combinations of two operators are worth trying when one alone breaks a
  constraint.
- Sam's transfer variant was real and old; Claude's list added the migration.
  That gap is what `me/progress.md` records.
