# Retrieval with Parallax

Parallax retrieves; you judge. Keep calls token-cheap: find wide, read narrow.

## 1. Find papers

| Need | Call |
|------|------|
| Literature on a question | `web_search` with `tags: ["science"]` |
| Specific engines | `engines: ["arxiv", "openalex", ...]` (overrides `tags`) |
| Physics / HEP | `engines: ["inspirehep"]` (opt-in, not in the science tag) |
| Datasets, software, grey literature | `engines: ["zenodo"]` (opt-in) |
| ML conference papers with their reviews | `social_search` with `platform: "openreview"` (gives thread refs; see section 3) |
| Only on-topic hits | add `focus: "<topic in plain words>"` |

The science tag covers arXiv, PubMed, Europe PMC, HAL, OpenAlex, Crossref,
OpenReview and sci-bot (answered literature reviews). Engine names live in
`parallax://search/engines`; read it rather than guess.

Search tips:
- Search for systematic reviews first (`"systematic review" <topic>`). A good,
  recent review saves appraising twenty primary studies, but appraise the review.
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

If the header says "abstract only": try the preprint (arXiv, bioRxiv, medRxiv),
the PMC copy, or the author's repository (HAL, Zenodo). If none exists, write
"not appraised: abstract only".

## 3. Peer review (ML/AI papers)

1. `social_search` with `platform: "openreview"` and the paper's title or topic.
   Each hit carries a thread ref of the form `forum@group`, for example
   `taHwqSrbrb@ICLR.cc/2025/Conference/Submission2019`.
2. `social_thread` with `platform: "openreview"` and `id: "<that ref>"` returns
   the submission, every review with its fields as the venue names them (rating,
   confidence, soundness, strengths, weaknesses…), the author rebuttals, the
   comments and the meta-review, nested by reply. No login is needed.
3. The Decision note is not in that route. The venue line ("ICLR 2025 Poster",
   "Submitted to ICLR 2025" = not accepted or still under review) carries the
   outcome. A bare forum id or an `openreview.net/forum?id=` URL works only when
   the scraper has `OPENREVIEW_TOKEN`/`OPENREVIEW_COOKIE`; without it the call
   names the variables. Use the ref.

OpenReview allows about 20 calls a minute (5 for older venues) per IP. A `429`
reply says when to retry; do not loop. Reviews are evidence of what experts
questioned, not a verdict: check each raised weakness in the paper yourself. If a
thread cannot be read, record "OpenReview reviews: not retrieved" as missing
evidence. Do not guess the reviews.

## 4. Critique and discussion

`social_search` with the paper URL (DOI or arXiv) as `query` and no platform finds
Hacker News, Reddit and Lemmy threads about it. Use them to find claimed errors,
failed replications and author replies. A comment is a lead to check in the paper,
not evidence by itself. Add `platform`/`tags` to widen (`tags: ["dev"]` for ML).

Also search for: `"<title>" replication`, `"<title>" erratum`, `"<title>" comment`
(journals publish letters and commentaries), and PubPeer by URL with `fetch_page`.
