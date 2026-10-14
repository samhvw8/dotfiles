# Pre-read checks

Do these before spending tokens on the full text. Each one can end the appraisal
or change how you read it.

| Check | How | If it fails |
|-------|-----|-------------|
| Retraction | `fetch_page` facts header ("Retracted"); Crossref/Retraction Watch notice; PubMed "Retracted Publication" tag; search `"<title>" retraction` | Exclude. Say "excluded: retracted (<date>, <reason>)". |
| Expression of concern, correction | Same sources | Keep, but read the notice and apply it to the domains it touches |
| Preprint vs peer-reviewed | Facts header; venue; arXiv/medRxiv/bioRxiv URL | Appraise, flag "preprint, not peer-reviewed". Look for a later published version and compare results |
| Venue | Is the journal indexed (MEDLINE, DOAJ for OA journals), with a known publisher? Unknown venue + fast acceptance + broad scope + fee spam = predatory pattern | Flag "unknown or predatory-pattern venue". Appraise the methods anyway; a bad venue does not make bad methods, but raises the bar for "not reported" |
| Registration | Trial registry ID (ClinicalTrials.gov, ISRCTN, ...), PROSPERO for reviews, OSF for pre-registration | Not registered: note it; it feeds selective-reporting domains |
| Funding | `section: "Funding"` | Record the funder and its role in design, analysis and reporting |
| Conflicts of interest | `section: "Competing interests"` or "Conflicts" | Record. Industry funding is not bias by itself; funder control of analysis or reporting is a concern for the reporting domains |
| Version read | Facts header "copy read" | Always say which version you appraised |

Rules:
- Missing funding or COI statement is "not reported", not "none".
- Never treat citation count, impact factor or author fame as a quality signal.
- One check failing (preprint, industry funding) is a flag, not a verdict. Only
  retraction excludes.
