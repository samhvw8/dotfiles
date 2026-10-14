# GRADE: certainty of a body of evidence

GRADE rates certainty for **one outcome across all studies**, not one paper. Use
the GRADE book (book.gradepro.org, successor to the 2013 GRADE handbook) and the
Core GRADE series (BMJ 2025, 7 papers) as the current sources.

## Levels

| Level | Meaning |
|-------|---------|
| High | The true effect is probably close to the estimate |
| Moderate | The true effect is probably close; it may differ substantially |
| Low | The true effect may differ substantially |
| Very low | The true effect is probably substantially different |

## Starting point

| Body of evidence | Starts at |
|------------------|-----------|
| Randomised trials | High |
| Non-randomised studies (NRSI), conventional / Core GRADE | Low |
| NRSI assessed with ROBINS-I | High, then rate down for risk of bias (the tool carries confounding). Final ratings should align with the conventional approach |

State which starting rule you used.

## Rate down (each by 1 or 2 levels)

| Domain | Ask | Evidence to cite |
|--------|-----|------------------|
| Risk of bias | Do studies at high risk (RoB 2 high, ROBINS-I serious/critical) carry much of the weight? Would excluding them change the answer? | The per-study tool judgements |
| Inconsistency | Do point estimates differ in direction or across decision thresholds? Do CIs overlap? Is heterogeneity unexplained (I², tau², subgroup checks)? | Forest plot, I² with its CI |
| Indirectness | Do population, intervention, comparator or outcome differ from the question? Surrogate outcome? Only indirect comparisons? | PICO of each study vs the question |
| Imprecision | Does the CI cross the decision threshold (or the null when no threshold is set)? Is the sample below the optimal information size? Few events? | Pooled estimate and CI, total events |
| Publication bias (dissemination bias) | Small, industry-funded, positive studies only? Funnel asymmetry (≥10 studies)? Registered trials missing results? | Funnel plot, registry search |

## Rate up (NRSI only, and only when not rated down for risk of bias)

| Domain | Rule of thumb |
|--------|---------------|
| Large effect | RR > 2 or < 0.5: up 1. RR > 5 or < 0.2: up 2 (convert OR to RR first) |
| Dose-response gradient | A clear gradient across exposure levels: up 1 |
| Plausible residual confounding | All plausible confounding would shrink the shown effect (or create one where none was found): up 1 |

## How to apply

1. Fix the question as PICO and choose the outcomes (critical vs important).
2. For each outcome: list the studies, their tool judgements, the pooled estimate.
3. Walk the five down domains, then the three up domains. For each, write
   "not serious / serious (-1) / very serious (-2)" and one reason with a citation.
4. Do not count one flaw twice. If small trials explain both imprecision and
   possible publication bias, rate it where it does the most harm and say so.
5. Report the final level and a one-line plain-language statement ("X probably
   reduces Y slightly" for moderate; "may" for low; "very uncertain" for very low).

## Qualitative findings

GRADE certainty does not apply. Use GRADE-CERQual (`cerqual.md`).

## Diagnostic accuracy

Same five down domains; risk of bias comes from QUADAS-3. Rate sensitivity and
specificity (or the downstream patient outcome) separately.

## ML/AI benchmarks

No GRADE equivalent. Do not invent one. Use `ml-papers.md` and give a qualitative
confidence with reasons.
