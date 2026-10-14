# Reporting guidelines: what should be in the paper

Reporting guidelines are not appraisal tools. Use them as a map of where to look
and to tell "not reported" from "not done". A missing item is "no information" for
the matching risk-of-bias question.

| Design | Guideline (current) | Notes |
|--------|---------------------|-------|
| Randomised trial | **CONSORT 2025** (30 items; supersedes CONSORT 2010) | New "Open science" section: registration (2), protocol and SAP access (3), data sharing (4), funding and COI (5a/5b). Many extensions (cluster, non-inferiority, harms, CONSORT-AI, ...) |
| Systematic review | **PRISMA 2020** (27 items) | Extensions: PRISMA-S (search), -DTA, -NMA, -ScR, -P (protocols), -LSR (living) |
| Observational (cohort, case-control, cross-sectional) | **STROBE** (22 items) | No successor found as of 2026-10-12 |
| Diagnostic accuracy | **STARD 2015**; **STARD-AI** (Nat Med 2025) for AI tests | Pairs with QUADAS-3 |
| Prediction model | **TRIPOD+AI** (BMJ 2024, 27 items; supersedes TRIPOD 2015) | Pairs with PROBAST+AI |
| ML conference paper | **NeurIPS paper checklist** (16 items) | See `ml-papers.md` |

Find any other guideline at equator-network.org.

## How to use

- Fetch the checklist the authors submitted (often a supplement). Check two or three
  of their "reported on page X" claims against the page.
- Where the guideline expects an item and the paper lacks it, write
  "not reported (<guideline> item <n>)".
- Never mark a study high risk only because it is badly reported. Mark the domain
  "no information" and lower confidence in your judgement.
