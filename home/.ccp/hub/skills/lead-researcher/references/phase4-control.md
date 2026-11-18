# Phase 4: CONTROL

Part of the [lead-researcher skill](../SKILL.md). Read this when gatherers have returned and you run REFLECT and STEER: coverage, structured checks, gem extraction, gap-fill.

### Phase 4: CONTROL — Reflect & Steer (the forager brain)

This is the loop's **CONTROL** step — the fused **forager** brain. After GATHER returns, the control agent runs REFLECT (assess coverage) → STEER (deepen / expand / stop). Full methodology: [forager](forager/overview.md). The checks below are the REFLECT pass; STEER then decides the next iteration or exit.

**Step 1: Coverage Assessment**

For each sub-question from Phase 2, assess:

| Sub-question | Status | Sources | Confidence |
|---|---|---|---|
| [sub-q 1] | gap / partial / covered | count | low / medium / high |
| [sub-q 2] | ... | ... | ... |

Confidence levels: **high** = 3+ independent sources agree. **medium** = 2 sources or single authoritative source. **low** = 1 source or blog-only.

**Step 2: Structured Checks**

| Check | Question | Action if YES |
|-------|----------|---------------|
| **Intent-data mismatch** | Does the data answer what the user ACTUALLY asked? User implied X is real/used, but data says "doesn't exist"? | **HIGHEST PRIORITY** — you may be searching for the wrong thing. Re-examine the search term. Ask user to clarify OR pivot search target. NEVER relay "it doesn't exist" without checking if YOU misidentified the target |
| **Scent redirect** | Did search results consistently redirect to a DIFFERENT term/project? (e.g., searching "OpenCrawl" but all results point to "OpenClaw") | Follow the scent — this IS the signal. The user likely means the thing search redirects to |
| **Contradictions** | Do agents disagree on facts? | Investigate primary source — one is wrong |
| **Non-diagnostic findings** | Does a finding support ALL options equally? | Deprioritize — it doesn't help decide (ACH principle) |
| **Missing failure modes** | Did any agent cover what goes WRONG? | Search GitHub Issues, forums for real-world pain |
| **Recency** | Are recommended tools still maintained? | Check last commit, last release date |
| **Refutation test** | What would DISPROVE the emerging recommendation? | Search for that evidence — if absent, recommendation is robust |
| **Composition** | Do recommendations work together or conflict? | Test the combination, not just individual parts |
| **Data accuracy** | Are specific numbers (costs, stars, dates) verified from primary sources, or just repeated from one blog? | Cross-check load-bearing claims against primary source (GitHub, official docs, actual invoices). Unverified numbers must be flagged |
| **Distribution** | Is the data representative or just outliers/cherry-picked? What's the spread? | Report range (min-median-max), not just one data point. Flag if sample size is too small to generalize |

**Step 3: Gem Extraction** (gather is the small step; this is where value lives)

Gather collects raw data. YOUR job is to find **gems** — real practitioner insights buried under SEO noise. Apply [gem-detection](forager/gem-detection.md) scoring:

| Tag | Criteria | Action |
|-----|----------|--------|
| **GEM** | Specific numbers + pain/failure + verifiable (code, config, error logs) | Keep, cite prominently in synthesis |
| **MEH** | Partial signal — some specifics but also generic | Use only if no gem available |
| **NOISE** | SEO patterns: generic praise, listicles, no downsides, undated, affiliate | **Drop from synthesis** |

**Rule: a synthesis built from NOISE is worse than saying "insufficient data."** 2 gems > 20 noise items.

**Step 4: Gap-Targeted Deepening**

If coverage assessment shows gaps:
- Spawn 1-2 targeted agents to fill specific gaps (not broad re-search)
- Use refined queries informed by what was already found
- Focus on the failure-mode and refutation checks — these are highest value
- If gem count is 0 after gather → the search target may be wrong. Re-examine before deepening

This phase separates surface search from real research. NEVER skip.
