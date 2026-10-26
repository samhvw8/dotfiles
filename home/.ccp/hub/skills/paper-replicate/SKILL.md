---
name: paper-replicate
description: "Use whenever the user wants to replicate, reproduce, implement, or audit the code of an academic paper (arXiv, OpenReview, bioRxiv, DOI), or asks for a paper + LaTeX source + code workspace bundle."
---

# Paper replicate

<role>
You turn a research paper into a verified, runnable engineering workspace. You pull the paper's PDF, unpacked LaTeX source (`.tex` / `.bib`), OpenReview peer reviews, and official code repository into one directory, then audit and map every equation, architecture block, and hyperparameter table against the actual code.
</role>

## Workflow

| Step | Action | Command / Tool |
|------|--------|----------------|
| 1. Bundle | Pull PDF, arXiv `.tex` source, BibTeX, OpenReview `reviews.md`, PMC XML, and shallow-clone the discovered GitHub/HF repo | `paperget bundle --clone -d <workspace-dir> <id-or-url>` |
| 2. Read exact math & tables | Read `.tex` files in `<slug>/tex/` first (lossless LaTeX macros, exact architecture tables, appendix hyperparameters); fall back to `<slug>/paper.pdf` | `read` on `<slug>/tex/*.tex` or `<slug>/paper.pdf` |
| 3. Check reviewer & author notes | Read `<slug>/reviews.md` for implementation clarifications, missing hyperparameters, baseline bugs, and author rebuttal fixes | `read` on `<slug>/reviews.md` |
| 4. Map paper ↔ code | Map every core equation, loss term, model block, and training hyperparameter from the paper to exact file:line locations in `<slug>/code/` (or plan them from scratch if no official repo exists) | `codegraph_explore` or `grep` / `read` in `<slug>/code/` |
| 5. Smoke-verify | Run a minimal forward/backward pass, unit test, or synthetic-batch check to prove the implementation executes cleanly | `bash` / `eval` |

## What `paperget bundle` creates

Running `paperget bundle --clone -d . <id-or-url>` produces `<slug>/`:
- `paper.pdf` — verified PDF (`%PDF-`, SHA-256 recorded in `paper.json`).
- `paper.json` & `paper.bib` — cross-resolved metadata (DOI, arXiv, PMID, PMCID, OpenReview forum, retraction flags, discovered code repositories) and BibTeX entry.
- `tex/` — unpacked arXiv e-print source (`https://arxiv.org/e-print/<id>`): exact `.tex` equations, `.bbl`/`.bib` bibliography, and vector figures.
- `reviews.md` — full OpenReview peer-review and author-rebuttal thread when the paper was reviewed on OpenReview.
- `pmc/` — JATS XML and plain text from `pmc-oa-opendata` S3 when the paper is in PubMed Central (pass `--supplements` to include supplementary data archives).
- `code-repos.json` & `code/` — GitHub/HuggingFace/GitLab repositories discovered from Hugging Face Papers API, OpenReview `code` fields, abstract/comments, `.tex` source, and PDF bytes, shallow-cloned into `code/` when `--clone` is passed.

## Paper-to-code audit checklist

Always build this table before writing or running reproduction code:

| Artifact / Hyperparameter | Paper specification (section / `.tex` line / equation) | Code location (`code/path:line`) | Match? |
|---------------------------|--------------------------------------------------------|----------------------------------|--------|
| Model architecture & dimensions | e.g. `tex/method.tex:112`, Eq. 4 | `code/models/net.py:45` | Exact / Mismatch / Missing |
| Objective / loss function & weights | e.g. `tex/method.tex:188`, Eq. 9 ($\lambda = 0.05$) | `code/train.py:130` | Exact / Mismatch / Missing |
| Optimizer, LR schedule, batch size | e.g. `tex/experiments.tex:64`, Table 6 | `code/configs/default.yaml:12` | Exact / Mismatch / Missing |
| Data preprocessing & splits | e.g. `tex/appendix.tex:40` | `code/data/dataset.py:88` | Exact / Mismatch / Missing |
| Evaluation metric & post-processing | e.g. `tex/experiments.tex:95` | `code/eval.py:52` | Exact / Mismatch / Missing |

## Hard rules

1. **Prefer `.tex` over PDF parsing for math and tables.** When `tex/` exists, read the `.tex` source directly so subscripts, custom macros (`\newcommand`), and multi-column tables are never garbled.
2. **Code vs. paper discrepancies must be surfaced.** Official repos frequently leave debug defaults, different learning rates, or omitted regularizers in `configs/`. List every discrepancy between the paper text and `code/` before running experiments.
3. **Never fabricate missing weights or private datasets.** If the authors released only inference code or omitted preprocessing scripts, state what is missing and build a synthetic-data smoke test for the reachable components.
