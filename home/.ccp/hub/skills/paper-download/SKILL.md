---
name: paper-download
description: "Use whenever the user asks to download, fetch, save, or grab academic papers, preprints, or PDFs to disk from arXiv, bioRxiv, medRxiv, OpenReview, PubMed/PMC, ACL Anthology, PMLR, CVF, NeurIPS, HAL, Zenodo, Sci-Hub, or Anna's Archive (annas-archive.gd/.gl/.pk, scidb, md5), or when Parallax fetch_page returns 'abstract only' and the full PDF is needed locally."
---

# Paper download

<role>
You retrieve verified academic paper PDFs, BibTeX entries, metadata sidecars, and peer-review threads to local disk using `paperget`, choosing the cleanest open-access or preprint route first and falling back to shadow libraries only when open routes fail.
</role>

## Quick commands (`paperget`)

`paperget` (`~/.local/bin/paperget`, source in `~/workspace/tools/paperget`) resolves DOIs, arXiv IDs, bioRxiv/medRxiv links, OpenReview links, PMIDs/PMCIDs, Anna's Archive `/scidb/` or `/md5/` URLs, and paper titles.

| Goal | Command |
|------|---------|
| Download one or more papers to current dir | `paperget get <id-or-url>...` |
| Save to a specific file or folder with BibTeX + JSON metadata | `paperget get -o <dir-or-file.pdf> --meta --bib <id-or-url>` |
| Download paper + OpenReview peer-review thread (`.reviews.md`) | `paperget get -o <dir> --reviews <openreview-url-or-id>` |
| Strict legal open-access / preprint only (skip Sci-Hub & Anna's Archive) | `paperget get --oa-only <id-or-url>` |
| Inspect all resolved IDs, retraction status, code repos, and OA PDF URLs without downloading | `paperget info <id-or-url>` |
| Pull full multi-file bundle (PDF + arXiv `.tex` + BibTeX + OpenReview + PMC XML) | `paperget bundle -d <dir> <id-or-url>` |

## How the waterfall works

`paperget` cross-resolves identifiers in parallel across OpenAlex, Europe PMC, arXiv, bioRxiv/medRxiv, Unpaywall, Hugging Face Papers, Zenodo, and OpenReview (`api2.openreview.net` and `api.openreview.net`), then tries PDF candidates in priority order:

1. **Direct & Preprint Repositories (no paywall, no captcha):**
   - **arXiv:** `https://arxiv.org/pdf/<id>.pdf` (also resolves `10.48550/arXiv.<id>` and `huggingface.co/papers/<id>`).
   - **PubMed Central AWS S3 (`pmc-oa-opendata`):** `https://pmc-oa-opendata.s3.amazonaws.com/<PMCID>.1/<PMCID>.pdf` — bypasses `pmc.ncbi.nlm.nih.gov` PoW challenges.
   - **bioRxiv / medRxiv:** `https://www.biorxiv.org/content/10.1101/<id>v<N>.full.pdf` sent with `Accept-Encoding: identity` so Cloudflare's CDN does not truncate gzip streams.
   - **ML & CS Open Access:** Direct PDF derivation for ACL Anthology (`aclanthology.org/<id>.pdf`), PMLR (`proceedings.mlr.press`), CVF (`openaccess.thecvf.com`), NeurIPS (`papers.nips.cc`), HAL (`hal.science/<id>/document`), and Zenodo (`/api/records/<id>`).
   - **OpenReview:** Resolves bare forum URLs (`https://openreview.net/forum?id=<id>`) or `forum@group` refs to their title and cross-fetches the arXiv/OpenAlex PDF when anonymous `/pdf?id=` is gated by Cloudflare Turnstile (403). Sends `OPENREVIEW_TOKEN` or `OPENREVIEW_COOKIE` when set.
2. **Open-Access Aggregators:**
   - **OpenAlex & Unpaywall:** Tries `best_oa_location.pdf_url` and repository `oa_locations` (`UNPAYWALL_EMAIL` optional).
   - If a candidate returns an HTML landing page containing `<meta name="citation_pdf_url">`, `paperget` extracts and fetches the embedded PDF URL automatically.
3. **Shadow-Library Fallback (skipped when `--oa-only` is passed):**
   - **Sci-Hub (`sci-hub.ru`, `.se`, `.st`):** Automatically solves Sci-Hub's SHA-256 **Altcha proof-of-work** widget (`/captcha/challenge/<id>` -> `/captcha/solution/<id>`) in pure Go, preserves session cookies across mirror redirects, and downloads the PDF.
   - **Anna's Archive (`annas-archive.gd`, `.gl`, `.pk`):** Accepts `/scidb/<doi>` and `/md5/<md5>` URLs directly. Uses the official fast-download API (`/dyn/api/fast_download.json?md5=<md5>&key=<key>`) when `ANNAS_SECRET_KEY` is set, and falls back to LibGen (`libgen.li`, `libgen.is`) when only an MD5 is available.

## When DDoS-Guard blocks a browser-only Anna's Archive slow partner page

Anna's Archive's `/scidb/<doi>` is backed by Sci-Hub (`paperget` fetches the PDF directly via Sci-Hub's Altcha PoW without touching DDoS-Guard). For book-only `/md5/<md5>` records with no `ANNAS_SECRET_KEY` and no LibGen mirror:
- Open `https://annas-archive.gd/md5/<md5>` in a headed browser via `browser` (`app: { relay: false }` or user's Chrome) so DDoS-Guard's `/.well-known/ddos-guard/mark/` canvas challenge completes and grab the slow-download link.

## Hard rules

1. **Every downloaded file is verified.** `paperget` checks for a `%PDF-` magic header in the first 1024 bytes, trims any leading garbage bytes, and rejects HTML challenge pages or truncated stubs (`< 4 KB`). Never rename an unverified response to `.pdf`.
2. **Report retraction status immediately.** `paperget` checks OpenAlex and Europe PMC for retractions and expressions of concern and prints `[WARNING: RETRACTED]`. Always surface this to the user.
3. **Read local PDFs cleanly.** Once `paperget` saves `<slug>.pdf`, read it with `read` (`path: "<slug>.pdf"`) or inspect the extracted `.tex` source from `paperget bundle`.
