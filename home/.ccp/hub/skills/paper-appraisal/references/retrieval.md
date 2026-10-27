# Retrieval with Parallax and paperhunt

Parallax and `paperhunt` retrieve; you judge. Keep calls token-cheap: find wide, read narrow.

## 1. Find papers

| Need | Call |
|------|------|
| Literature on a question (Parallax) | `web_search` with `tags: ["science"]` (add `focus: "<topic in plain words>"`) |
| Federated search with RRF + citation velocity (`paperhunt`) | `paperhunt search [flags] "<query>"` — queries OpenAlex, Europe PMC, arXiv, OpenReview, and Crossref in parallel (`--sort rrf\|cited\|velocity\|date`, `--journal "<venue>"`, `--year 2020-2026`, `--oa-only`, `--limit N`, `--json`) |
| Citation graph snowballing (backward refs + forward citations) | `paperhunt snowball [flags] <doi-or-arxiv-or-url>` (`--direction both\|refs\|cited`, `--sort cited\|velocity\|date`, `--oa-only`) |
| Specific Parallax engines | `engines: ["arxiv", "openalex", ...]` (overrides `tags`) |
| Physics / HEP | `engines: ["inspirehep"]` (opt-in, not in the science tag) |
| Datasets, software, grey literature | `engines: ["zenodo"]` (opt-in) |
| ML conference papers with their reviews | `social_search` with `platform: "openreview"` or `paperhunt search --source openreview "<query>"` |

The Parallax `science` tag covers arXiv, PubMed, Europe PMC, HAL, OpenAlex, Crossref,
OpenReview and sci-bot (answered literature reviews). Engine names live in
`parallax://search/engines`; read it rather than guess.

Search tips:
- Search for systematic reviews first (`"systematic review" <topic>`). A good,
  recent review saves appraising twenty primary studies, but appraise the review.
- Use `paperhunt search --sort velocity "<topic>"` to surface fast-rising recent
  papers alongside classic highly cited works, and `paperhunt snowball <seed-id>`
  to trace what a landmark paper cited and what cited it since.
- Search the trial registry ID or DOI when you have it; it finds the protocol,
  corrections and retraction notices.
- Record how many hits you found and how you chose the ones you read.

## 2. Read the full text

`fetch_page` on a DOI URL (`https://doi.org/10.xxxx/...`), an arXiv, PMC, Europe
PMC, PubMed, bioRxiv or medRxiv URL returns the free, legal open-access full text
in sections (Europe PMC JATS, arXiv HTML, the preprint server, or the OA copy
OpenAlex knows), under a facts header. Do not pass `raw`, `country` or
`screenshot`: those skip the paper resolver.

| Header line | Use it for |
|-------------|-----------|
| `**Paper:**` venue · year · status as the source states it ("journal publication (Europe PMC: MED)", "preprint (medRxiv)") | Preprint check. The header never says "peer-reviewed"; infer it from the venue |
| `**Type:**` publication types per source ("Randomized Controlled Trial", "Meta-Analysis", "article") | Design hint only; confirm the design in Methods |
| `**Retracted:**` no / YES (with the notices listed) | YES = exclude. Also read any expression of concern listed |
| `**Cited by:**` | Context only, never quality |
| `**IDs:**` DOI, PMID, PMCID | Search corrections, comments and the registry |
| `**Registrations cited in the text:**` | Trial/review registry IDs, pulled by pattern and not verified: open the registry to check outcome switching |
| `**Published version:**` (on a preprint) | Fetch it and compare results |
| `**Full text:**` which copy was read, license, what was left out (references, sub-articles) | Say which version you appraised |
| `**Full text:** not openly available — abstract only` | No free full text: do not appraise |

Back matter comes as its own sections when the source has it: `Funding
Statement`, `Competing interests`, `Data Availability`, `Supporting information`.

Read in this order to stay cheap:
1. `outline: true` to see the sections and their offsets.
2. `section: "Methods,Results"` (comma-separated, substring match). Add
   `"Statistical analysis"`, `"Limitations"`, `"Funding"`, `"Conflicts"`,
   `"Data availability"` as the tool needs.
3. `query: "<question>"` for one fact: `"how was allocation concealed"`,
   `"how were missing outcome data handled"`.
4. Supplement or protocol: fetch it by URL when the paper points to it. The
   registered protocol is the check for outcome switching.

Several papers: `batch_fetch` (1-20 URLs) with the same `query`.

If the header says "abstract only" (or when you need exact `.tex` equations, PMC JATS XML/supplements, or local PDFs):
1. Try the preprint (arXiv, bioRxiv, medRxiv), the PMC copy, or the author's
   repository (HAL, Zenodo) via `fetch_page`.
2. Run `paperhunt get -o /tmp/papers --meta --bib --reviews <doi-or-url>` (or
   `paperhunt bundle -d /tmp/papers <doi-or-url>` for unpacked arXiv `.tex` + PMC
   XML + OpenReview `reviews.md`; see `paper-download` and `paper-replicate`) to
   pull the verified PDF or `.tex` source locally via its OA, preprint,
   two-source title-to-preprint fallback, PMC S3, and shadow-library waterfall,
   then read `/tmp/papers/<slug>.pdf` (or `tex/*.tex`) with `read`.
3. Only if both `fetch_page` and `paperhunt` cannot retrieve the full text, write
   "not appraised: abstract only".

## 3. Around and after the paper

What to check, and in what order, is in `after-publication.md`. Retrieval notes:

- Forward citations and replications: `paperhunt snowball --direction cited --sort cited <doi-or-id>` lists works that cite the paper via OpenAlex.
- OpenReview reviews: `social_search` with `platform: "openreview"` then `social_thread` with `forum@group`, or `paperhunt get --reviews -o /tmp/papers <openreview-url-or-id>` to save the full peer-review and rebuttal thread as `.reviews.md`.
- `social_search` with the paper URL finds Hacker News, Reddit and Lemmy threads. Use it only when the paper drew public attention; for most papers it returns unrelated hits.
