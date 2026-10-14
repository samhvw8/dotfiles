# PROBAST+AI: prediction models (regression or AI/ML)

Version: **PROBAST+AI**, BMJ 2025;388:e082505 (24 March 2025). Updates
PROBAST-2019 and covers regression and AI/machine-learning models. Use it for
diagnostic and prognostic prediction models and algorithms; for a clinical AI
paper whose claim is a prediction, use this before `ml-papers.md`.

Two parts, assessed separately:

| Part | Judges | Levels |
|------|--------|--------|
| Model development | **Quality** concerns | Low, High, Unclear |
| Model evaluation (validation) | **Risk of bias** (18 signalling questions) | Low, High, Unclear |
| Both, domains 1-3 | **Applicability** to your question | Low, High, Unclear concern |

Answers: Yes, Probably yes, No, Probably no, No information, Not applicable. A "no"
flags a concern; it does not set the domain to High by itself. "Unclear" means the
report is insufficient.

## Four domains (both parts)

| # | Domain | What to check (short form) |
|---|--------|---------------------------|
| 1 | Participants and data sources | Appropriate data source (cohort, trial, registry, EHR)? Inclusions and exclusions appropriate? Data represent the intended-use population? |
| 2 | Predictors | Defined and measured the same way for all? Assessed without outcome knowledge? Available at the moment of prediction (no leakage)? Preprocessing described? |
| 3 | Outcome | Pre-specified, standard definition? Determined without predictor knowledge? Same for all? Appropriate time interval? |
| 4 | Analysis | Enough participants/events? Missing data handled? Overfitting and optimism handled (internal validation, tuning separate from test)? Calibration **and** discrimination reported? Class imbalance handled without distorting calibration? Fairness across subgroups? |

## Overall

Combine the four domain ratings into overall quality (development) or risk of bias
(evaluation), plus overall applicability. One High domain usually makes the overall
High. Report development and evaluation separately.

## Where to look

`section: "Methods"` (data source, predictors, outcome), `query: "calibration"`,
`query: "external validation"`, `query: "missing data"`, the TRIPOD+AI checklist
in the supplement.

## Feeds GRADE as

Risk of bias for model performance estimates. Applicability concerns feed
indirectness.
