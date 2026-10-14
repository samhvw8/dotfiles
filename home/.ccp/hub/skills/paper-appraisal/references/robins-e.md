# ROBINS-E: non-randomised studies of exposures

Version: **ROBINS-E, 24 March 2024** (Environment International 2024,
doi:10.1016/j.envint.2024.108602). For follow-up studies of the effect of an
exposure (environmental, occupational, behavioural) on an outcome. Specify the
causal effect the result estimates before answering.

For each domain make three judgements: **risk of bias**, **predicted direction of
bias**, and **whether the bias threatens conclusions** about an important effect.
Repeat all three overall.

Levels: **Low**, **Some concerns**, **High**, **Very high**. In domain 1, "Low"
reads "Low (except for concerns about uncontrolled confounding)".

## Domains

| # | Domain | Key questions (short form) |
|---|--------|---------------------------|
| 1 | Confounding | Were important confounders measured well and controlled? Any residual or time-varying confounding? |
| 2 | Measurement of the exposure | Was exposure measured validly and the same way for all? Could measurement depend on the outcome (recall)? |
| 3 | Selection of participants into the study (or analysis) | Did selection depend on exposure and outcome? Did follow-up start at exposure start? |
| 4 | Post-exposure interventions | Did interventions after exposure (e.g. treatment) differ by exposure and affect the outcome? Usually low |
| 5 | Missing data | Complete data for exposure, confounders, outcome? Valid handling? |
| 6 | Measurement of the outcome | Could measurement differ by exposure? Were assessors aware? |
| 7 | Selection of the reported result | Pre-specified analysis? Chosen among many exposures, outcomes or models? |

## Where to look

`section: "Methods"` (cohort source, exposure assessment), `query: "adjusted for"`,
`query: "sensitivity analysis"`, `section: "Limitations"`.

## Feeds GRADE as

Risk of bias for the outcome. The GRADE book states the "start High" rule for
ROBINS-I; whether it applies to ROBINS-E was not checked (see `sources.md`). Use
the conventional start (Low) unless the review's own GRADE guidance says otherwise,
and state which rule you used. Exposure questions often also need rating down for
indirectness.
