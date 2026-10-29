---
name: paper-download
description: "Use whenever the user asks to search, find, download, fetch, save, or snowball academic papers, preprints, or PDFs to disk from arXiv, bioRxiv, medRxiv, OpenReview, PubMed/PMC, ACL Anthology, PMLR, CVF, NeurIPS, HAL, Zenodo, Sci-Hub, or Anna's Archive (annas-archive.gd/.gl/.pk, scidb, md5), or when Parallax fetch_page returns 'abstract only' and the full PDF is needed locally."
---

# Paper download & search

<role>
You search, rank, snowball, and retrieve verified academic paper PDFs, BibTeX entries, metadata sidecars, and peer-review threads to local disk using `paperhunt`, choosing the cleanest open-access or preprint route first and falling back to shadow libraries only when open routes fail.
</role>

## Quick commands (`paperhunt`)

`paperhunt` (`~/.local/share/mise/shims/paperhunt`, installed via `mise use -g github:samhvw8/paperhunt`, source in `~/workspace/tools/paperhunt`) federates queries across 5 academic search engines (OpenAlex, Europe PMC, arXiv, OpenReview, Crossref), traverses citation graphs, and downloads verified PDFs across both open-access repositories and shadow libraries in parallel (`-j N`).

| Goal | Command |
|------|---------|
| Search across 5 academic engines with RRF + citation velocity ranking | `paperhunt search [flags] "<query>"` |
| Search and immediately download top N papers in parallel | `paperhunt search -d -o <dir> --limit 10 "<query>"` |
| Filter search by journal or venue | `paperhunt search --journal "Nature Human Behaviour" "<query>"` |
| Filter search by publication year range and open-access only | `paperhunt search --year 2022-2026 --oa-only "<query>"` |
| Snowball citation graph (backward references + forward citations) | `paperhunt snowball <doi-or-arxiv-or-url>` |
| Download one or more papers in parallel (`-j N`) to current dir | `paperhunt get -j 4 <id-or-url>...` |
| Save to a specific file or folder with BibTeX + JSON metadata | `paperhunt get -o <dir-or-file.pdf> --meta --bib <id-or-url>` |
| Download paper + OpenReview peer-review thread (`.reviews.md`) | `paperhunt get -o <dir> --reviews <openreview-url-or-id>` |
| Strict legal open-access / preprint only (skip Sci-Hub & Anna's Archive) | `paperhunt get --oa-only <id-or-url>` |
| Inspect all resolved IDs, retraction status, code repos, and OA PDF URLs without downloading | `paperhunt info <id-or-url>` |
| Pull full multi-file bundle (PDF + arXiv `.tex` + BibTeX + OpenReview + PMC XML) | `paperhunt bundle -d <dir> <id-or-url>` |

## How the search and waterfall work

### 1. Federated Search & Ranking
`paperhunt search` queries up to five engines concurrently:
- **OpenAlex:** 250M+ research works with normalized venue IDs, citation counts, and citation velocity.
- **Europe PMC:** Biomedical literature, clinical trials, and PubMed Central links.
- **arXiv:** STEM preprints and versioned e-prints.
- **OpenReview:** Submissions, accepted papers, and reviews for top ML venues (ICLR, NeurIPS, ICML).
- **Crossref:** Official DOI registration metadata and publisher bibliographic records.

Results are clustered into canonical works by DOI, arXiv ID, PMID, PMCID, OpenReview forum, and normalized title key, then ranked using **Reciprocal Rank Fusion (RRF)** boosted by annual citation velocity ($\log_{10}(1 + \text{velocity})$).

### 2. Multi-Tier PDF Waterfall
`paperhunt` tries PDF candidates in strict priority order:
1. **Direct & Preprint Repositories (no paywall, no captcha):**
   - **arXiv:** `https://arxiv.org/pdf/<id>.pdf` (also resolves `10.48550/arXiv.<id>` and `huggingface.co/papers/<id>`).
   - **PubMed Central AWS S3 (`pmc-oa-opendata`):** `https://pmc-oa-opendata.s3.amazonaws.com/<PMCID>.1/<PMCID>.pdf` — bypasses `pmc.ncbi.nlm.nih.gov` challenges.
   - **bioRxiv / medRxiv:** `https://www.biorxiv.org/content/10.1101/<id>v<N>.full.pdf` sent with `Accept-Encoding: identity` so Cloudflare's CDN does not truncate gzip streams.
   - **ML & CS Open Access:** Direct PDF derivation for ACL Anthology (`aclanthology.org/<id>.pdf`), PMLR (`proceedings.mlr.press`), CVF (`openaccess.thecvf.com`), NeurIPS (`papers.nips.cc`), HAL (`hal.science/<id>/document`), and Zenodo (`/api/records/<id>`).
   - **OpenReview:** Resolves bare forum URLs (`https://openreview.net/forum?id=<id>`) or `forum@group` refs to their title and cross-fetches the arXiv/OpenAlex PDF when anonymous `/pdf?id=` is gated by Cloudflare Turnstile (403). Sends `OPENREVIEW_TOKEN` or `OPENREVIEW_COOKIE` when set.
2. **Two-Source Preprint Fallback:**
   - When a closed-access publisher DOI has no open-access location, `paperhunt` queries arXiv and OpenAlex by title to locate unlinked author preprints before attempting shadow libraries.
3. **Open-Access Aggregators:**
   - **OpenAlex & Unpaywall:** Tries `best_oa_location.pdf_url` and repository `oa_locations` (`UNPAYWALL_EMAIL` optional).
   - If a candidate returns an HTML landing page containing `<meta name="citation_pdf_url">`, `paperhunt` extracts and fetches the embedded PDF URL automatically.
4. **Shadow-Library Fallback (skipped when `--oa-only` is passed):**
   - **Sci-Hub (`sci-hub.ru`, `.se`, `.st`):** Automatically solves Sci-Hub's SHA-256 **Altcha proof-of-work** widget (`/captcha/challenge/<id>` -> `/captcha/solution/<id>`) in pure Go, preserves session cookies across mirror redirects, and downloads the PDF.
   - **Anna's Archive (`annas-archive.gd`, `.gl`, `.pk`):** Accepts `/scidb/<doi>` and `/md5/<md5>` URLs directly. Uses the official fast-download API (`/dyn/api/fast_download.json?md5=<md5>&key=<key>`) when `ANNAS_SECRET_KEY` is set, and falls back to LibGen (`libgen.li`, `libgen.is`) when only an MD5 is available.

## Hard rules

1. **Every downloaded file is verified.** `paperhunt` checks for a `%PDF-` magic header in the first 1024 bytes, trims any leading garbage bytes, and rejects HTML challenge pages or truncated stubs (`< 4 KB`). Never rename an unverified response to `.pdf`.
2. **Report retraction status immediately.** `paperhunt` checks OpenAlex and Europe PMC for retractions and expressions of concern and prints `[WARNING: RETRACTED]`. Always surface this to the user.
3. **Read local PDFs cleanly.** Once `paperhunt` saves `<slug>.pdf`, read it with `read` (`path: "<slug>.pdf"`) or inspect the extracted `.tex` source from `paperhunt bundle`.
