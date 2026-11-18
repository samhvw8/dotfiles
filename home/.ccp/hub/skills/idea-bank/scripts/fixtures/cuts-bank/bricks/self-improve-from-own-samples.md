---
type: Brick
title: Self-improve from own samples
description: A model makes samples, keeps the good ones and trains on them.
roles: [improve-without-labels]
fields: [machine-learning]
parts:
  - { to: generate-candidates, how: split, cut: cost-flow, note: most of the compute }
  - { to: filter-bad-samples, how: split, cut: cost-flow }
  - { to: generate-candidates, how: judge, cut: data-path }
  - { to: score-samples, how: split, cut: data-path }
  - { to: filter-bad-samples, cut: data-path }
---

# Signature
- **Input:** a model and unlabeled prompts
- **Output:** a better model
