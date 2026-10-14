# ROBINS-I V2: non-randomised studies of interventions

Version: **ROBINS-I V2, revised draft of 20 November 2025** (riskofbias.info). It
covers follow-up (cohort) studies and is still marked "draft, subject to change".
The 2016 ROBINS-I had seven domains; V2 has six. Name the version you use and do
not mix the two lists.

Assess one **result** for one effect of interest: intention-to-treat effect, or a
per-protocol effect (when the analysis accounts for protocol deviations). First
specify the **target trial** the study tries to emulate, the confounders that
matter, and the effect of interest.

Answers: V2 adds "strong" vs "weak" yes/no in place of "probably yes/no".
Algorithms map answers to proposed judgements. A **triage** section (part B) maps
quickly to Critical when that is obvious.

Levels per domain and overall: **Low**, **Moderate**, **Serious**, **Critical**.
In domain 1, "Low" reads "Low (except for concerns about uncontrolled confounding)".

## Domains (V2)

| # | Domain | Key questions (short form) |
|---|--------|---------------------------|
| 1 | Confounding | Were all important baseline confounders measured validly and controlled (design or analysis)? Two variants: ITT effect (baseline confounding only); per-protocol effect (baseline and time-varying confounding, e.g. needing g-methods) |
| 2 | Classification of interventions | Were intervention groups clearly defined and classified from information at the start? Could classification depend on the outcome? Is there **immortal time** from misclassified follow-up? |
| 3 | Selection of participants into the study (or analysis) | Did follow-up start at the same time as the intervention? Was selection related to both intervention and outcome? Immortal time from selection? Prevalent users? |
| 4 | Missing data | Were data complete for intervention, confounders and outcome? Was the analysis method valid under a plausible missingness mechanism? (Much expanded in V2) |
| 5 | Measurement of the outcome | Could measurement differ between groups? Were assessors aware of the intervention? |
| 6 | Selection of the reported result | Was there a pre-specified analysis plan? Selected from several outcome measures, analyses or subgroups? |

V2 dropped the 2016 domain "deviations from intended interventions" and the
pre-specification of co-interventions.

## Overall judgement

The overall level is at least the worst domain level. Several Serious domains can
make the result Critical. **Critical = too problematic to provide useful evidence**;
leave it out of the synthesis and say so.

## Where to look

`section: "Methods"` (data source, eligibility, time zero, exposure definition),
`query: "adjusted for"` / `"confounders"`, `query: "missing data"`,
`section: "Statistical analysis"`, the protocol or registration if any.

## Feeds GRADE as

Use ROBINS-I-assessed NRSI starting at High, then rate down for risk of bias
(see `grade.md`). Critical results do not enter the rating.
