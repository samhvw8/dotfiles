# Sources and version checks

All checked on **2026-10-12** with Parallax (`web_search`, `fetch_page`,
`batch_fetch`). Recheck any row older than a year before relying on it.

| Tool | Current version | Verified facts | Source |
|------|-----------------|----------------|--------|
| GRADE | GRADE book + Core GRADE (BMJ 2025, 7 papers) | 4 levels; 5 down domains; 3 up domains (NRSI); RCTs start High, NRSI Low; NRSI may start High with ROBINS-I | book.gradepro.org/guideline/overview-of-the-grade-approach; gdt.gradepro.org/app/handbook (2013 handbook, Tables 5.2/5.3); bmj.com/content/389/bmj-2024-083864 (Core GRADE 4); core-grade.healthsci.mcmaster.ca/papers |
| RoB 2 | 22 Aug 2019 (BMJ 2019;366:l4898); cluster and crossover variants rev. 18 Mar 2021 | 5 domains; Low / Some concerns / High | riskofbias.info/welcome/rob-2-0-tool; abstracts.cochrane.org/2019-santiago/assessing-risk-bias-randomized-trials-rob-2; bmj.com/content/366/bmj.l4898 |
| ROBINS-I | **V2, revised draft 20 Nov 2025** (still "draft, subject to change") | 6 domains (V2 dropped "deviations from intended interventions"); Low / Moderate / Serious / Critical; algorithms, strong/weak answers, triage part B, immortal-time questions | riskofbias.info/welcome/robins-i-v2; ROBINS-I_cribsheet_20November2025.pdf (Google Drive, linked there); cochrane.org/events/version-2-robins-i-tool |
| ROBINS-E | 24 Mar 2024 (Environ Int, doi:10.1016/j.envint.2024.108602) | 7 domains; Low / Some concerns / High / Very high; 3 judgements per domain | riskofbias.info/welcome/robins-e-tool; Cochrane Bias Methods Group slides (methods.cochrane.org, Sept 2023) |
| AMSTAR 2 | 2017 (BMJ 2017;358:j4008); no AMSTAR 3 found | 7 critical items (2, 4, 7, 9, 11, 13, 15); High / Moderate / Low / Critically low | bmj.com/content/358/bmj.j4008; amstar.ca |
| ROBIS | 1.2 (PDF on Bristol site) | 3 phases; 4 domains | bristol.ac.uk/population-health-sciences/projects/robis/robis-tool |
| QUADAS | **QUADAS-3**, Ann Intern Med 17 Feb 2026 (doi:10.7326/ANNALS-25-02104); E&E doi:10.7326/ANNALS-25-04943 | 6 phases; 4 domains (Participants, Index test, Target condition, Analysis); signalling questions 1.1-4.4; Low / High / Insufficient information | bristol.ac.uk/.../quadas/quadas-3; acpjournals.org/doi/10.7326/ANNALS-25-02104 |
| PROBAST | **PROBAST+AI**, BMJ 2025;388:e082505 (24 Mar 2025) | Development (quality) and evaluation (risk of bias, 18 signalling questions); 4 domains; Low / High / Unclear; applicability for domains 1-3 | pmc.ncbi.nlm.nih.gov/articles/PMC11931409; pubmed.ncbi.nlm.nih.gov/40127903 |
| GRADE-CERQual | Implementation Science 2018 series | 4 components; High / Moderate / Low / Very low; dissemination bias explored | cerqual.org; link.springer.com/article/10.1186/s13012-017-0688-3 |
| JBI | Suite under revision; RCT tool 2023, quasi-experimental 2024 | Checklist names per design | jbi.global/critical-appraisal-tools; pubmed 36727247, 38287725 |
| CONSORT | **CONSORT 2025** (30 items; supersedes 2010) | Open science section items 2-5 | thelancet.com PIIS0140-6736(25)00672-5; equator-network.org/reporting-guidelines/consort |
| PRISMA | PRISMA 2020 (27 items); EQUATOR record updated Feb 2025, no successor | Extensions list | equator-network.org/reporting-guidelines/prisma; bmj.com/content/372/bmj.n71 |
| STROBE | 2007 (22 items); no successor found | — | strobe-statement.org/checklists; EQUATOR "under development" page |
| STARD | STARD 2015; STARD-AI (Nat Med, Sep/Oct 2025) | — | equator-network.org/reporting-guidelines/stard; nature.com/articles/s41591-025-03953-8 |
| TRIPOD | **TRIPOD+AI** (BMJ 2024;385:e078378, 27 items; supersedes TRIPOD 2015) | — | bmj.com/content/385/bmj-2023-078378 |
| NeurIPS checklist | Current guide (linked from the 2026 Main Track Handbook) | 16 items incl. "Declaration of LLM usage" | neurips.cc/public/guides/PaperChecklist |

## Not verified

- ROBINS-I V2 signalling questions: only domain names and changes were read. The
  reference gives key questions per domain, not V2's numbered questions; use the
  cribsheet for those.
- ROBINS-E signalling questions: domain names verified, questions summarised.
- RoB 2 signalling questions: domain names verified; question wording is the
  well-known 2019 set, written in short form, not re-read line by line.
- AMSTAR 2 non-critical item wording: critical items verified; the other nine are
  the 2017 list in short form.
- ROBIS judgement levels (low / high / unclear): not on the page read.
- Whether GRADE's "NRSI start High" rule applies to ROBINS-E.
- STARD 2015 item count; CERQual "start High" convention.
- Parallax features described as given in the brief: `fetch_page` paper facts
  header and sections for DOI URLs, and `social_thread platform=openreview`, were
  being built on 2026-10-12. `openreview` was not yet in the scraper source.
