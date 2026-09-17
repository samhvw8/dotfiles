# Source Types

Searchable sources beyond GitHub, by domain, with how to query each. Pick the stack that matches the research goal — GitHub is tier-1 only for code/dev topics.

## Code / Dev / Tooling

| Source | How to query |
|--------|--------------|
| GitHub | `gh search repos/code/issues`, `gh api search/repositories` |
| Package registries | npm (`npm search`, npmjs.com), PyPI (pypi.org), crates.io, pkg.go.dev, Maven Central, Packagist, RubyGems, NuGet |
| Stack Overflow / Stack Exchange | `site:stackoverflow.com [q]`, api.stackexchange.com |
| Elite dev forums | Lobsters, HN (`site:news.ycombinator.com`), V2EX, Habr — see [elite-forums](elite-forums/overview.md) |
| Docs & changelogs | official docs, `site:` vendor, GitHub releases/CHANGELOG |

## Academic / Scientific

| Source | How to query |
|--------|--------------|
| arXiv | arxiv.org, `site:arxiv.org`, arXiv API |
| Semantic Scholar | semanticscholar.org + API (free) |
| Google Scholar | scholar.google.com |
| PubMed / PMC | pubmed.ncbi.nlm.nih.gov + E-utilities API |
| Papers with Code | paperswithcode.com (links papers ↔ repos) |
| OpenReview / SSRN | openreview.net, ssrn.com (preprints, reviews) |

## Business / Market / Strategy

| Source | How to query |
|--------|--------------|
| Analyst firms | Gartner, Forrester, IDC (often paywalled — find summaries) |
| Consultancies | McKinsey, BCG, Bain, Deloitte insights pages |
| Market data | Statista, CB Insights, Crunchbase, PitchBook |
| Filings | SEC EDGAR (10-K/10-Q), annual reports, investor decks |

## Product / Consumer / Reviews

| Source | How to query |
|--------|--------------|
| Software reviews | G2, Capterra, TrustRadius, Trustpilot |
| App stores | Apple App Store, Google Play (ratings + reviews) |
| Launch / buzz | Product Hunt, Reddit (subreddit-specific), YouTube reviews |
| Comparison | "X vs Y" sites — verify, often affiliate-biased |

## Data / Statistics

| Source | How to query |
|--------|--------------|
| Datasets | Kaggle, HuggingFace datasets, data.world |
| Official stats | data.gov, Eurostat, World Bank, OECD, IMF, Our World in Data |

## Legal / Standards / Regulatory

| Source | How to query |
|--------|--------------|
| Standards | IETF RFCs (datatracker), ISO, W3C, ECMA |
| Gov / regulator | official `.gov` / regulator sites, EUR-Lex, Federal Register |
| Records | court records, patent search (Google Patents, USPTO) |

## News / Current Events

| Source | How to query |
|--------|--------------|
| Wire / press | Reuters, AP, trade press for the domain |
| Aggregators | Google News, specialized newsletters |

## Selection Rule

1. **Recommend** a stack for the goal → **confirm with the user** at runtime (Phase 1, Question 4). Do not hardcode — GitHub included only if the user keeps it.
2. Within the confirmed stack: practitioner/primary > analysis > blogs > content farms.
3. Multi-domain goals combine stacks; assign each gatherer agent one stack × language.

## Related

- [elite-forums overview](elite-forums/overview.md) — per-language practitioner communities
- [language-matrix](language-matrix.md) — field → language mapping
- [lead-researcher SKILL](../SKILL.md) — Source Priority section that loads this catalog
