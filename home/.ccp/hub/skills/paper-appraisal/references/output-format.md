# Output format

## Per paper

```markdown
### <Short title> (<first author> <year>), <DOI or URL>
- Copy read: <publisher / PMC / arXiv v2 / abstract only>
- Status: peer-reviewed | preprint · retracted: no · venue: <name, flag if unknown>
- Funding / COI: <quoted or "not reported">
- Design: <e.g. parallel-group RCT, n=412, 12-week follow-up>
- Result appraised: <outcome, time point, analysis, effect of interest>
- Tool: <RoB 2 (2019) | ROBINS-I V2 (Nov 2025 draft) | ...>

| Domain | Judgement | Supporting quote (section) |
|--------|-----------|---------------------------|
| D1 Randomisation process | Low | "Allocation was concealed using a central web-based system" (Methods > Randomisation) |
| D3 Missing outcome data | Some concerns | "18% of participants did not complete the 12-week assessment" (Results > Participant flow); no sensitivity analysis reported |
| ... | ... | ... |
| **Overall** | **Some concerns** | Driven by D3 |

- Not reported (vs not done): <list>
- Critique found: <HN/Reddit/OpenReview/letters, one line each, or "none found">
- Could not check: <walled reviews, supplement unavailable, ...>
```

A paper with only an abstract:

```markdown
### <title> — not appraised: abstract only
Reason: no free full text (tried DOI, PMC, preprint). Excluded from the rating
(or: included, certainty lowered one more level for this reason).
```

A retracted paper:

```markdown
### <title> — excluded: retracted (<date>, <reason from notice>)
```

## For the question overall

```markdown
## Certainty of evidence: <outcome>
Question (PICO): <...>
Studies: <n> (<designs>), <participants>; effect <estimate, 95% CI>
Starting level: High (RCTs) | Low (NRSI, conventional) | High (NRSI with ROBINS-I)

| GRADE domain | Rating | Reason |
|--------------|--------|--------|
| Risk of bias | Serious (-1) | 3 of 5 trials (61% weight) some concerns or high in D3 |
| Inconsistency | Not serious | I² = 12%, all estimates same direction |
| Indirectness | Not serious | Populations match the question |
| Imprecision | Serious (-1) | 95% CI crosses the decision threshold |
| Publication bias | Undetected | 5 studies, too few for a funnel plot; registries checked |
| Upgrades (NRSI) | None | — |

**Certainty: Low.** Plain statement: "<intervention> may <effect> <outcome>."
```

Qualitative findings use the CERQual table (`cerqual.md`). ML/AI papers use the
check table and confidence level in `ml-papers.md`.

## Style

- Short sentences. Tables over prose.
- Quotes are verbatim, in quotation marks, with the section name.
- Say how papers were chosen when not all found papers were read.
