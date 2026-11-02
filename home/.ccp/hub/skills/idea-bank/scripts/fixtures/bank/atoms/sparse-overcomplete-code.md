---
type: Atom
title: Sparse code over an overcomplete basis
description: Learn a basis so each signal is a sparse mix of its elements.
signature: { input: signal, output: sparse coefficients, objective: reconstruction + L1, constraint: sparsity }
names: { neuroscience: [sparse coding], machine-learning: [dictionary learning, K-SVD], interpretability: [sparse autoencoder features] }
roles: [sparse-represent-signal]
fields: [neuroscience]
cards: [olshausen-field-1996, ksvd-2006]
migrations:
  - { field: neuroscience, year: 1996, source: olshausen-field-1996, role: explain-receptive-fields }
  - { field: machine-learning, year: 2006, source: ksvd-2006, role: denoise-signal, match_confidence: low }
  - { field: interpretability, year: 2023, source: sae-features, role: decompose-activations }
---
