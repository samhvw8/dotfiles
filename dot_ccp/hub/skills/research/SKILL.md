---
name: research
description: "Single-agent research methodology — the search-fetch loop, query templates, GitHub patterns, and retrieval tools. Loaded by researcher agents spawned from lead-researcher. Do NOT use this skill directly for research — use lead-researcher instead, which orchestrates agents with configurable depth (low/medium/high/max). This skill is methodology, not orchestration."
---

# Research Methodology

Search-fetch loop methodology for a single researcher agent. This skill is loaded BY researcher agents — not invoked directly.
Honoring **YAGNI**, **KISS**, **DRY**. Be honest, be brutal, straight to the point, be concise.

**Your caller (lead-researcher) assigned you:** a topic, language(s), and iteration count. Follow those assignments. Search in your assigned language(s) — don't default to English unless assigned English.

## Phase 1: Scope Definition

Before searching, define:
- Key terms and concepts to investigate
- Recency requirements (how current must information be)
- Evaluation criteria and research depth boundaries
- Which languages/communities are most likely to have strong signal for this topic

## Phase 2: Search in Assigned Language(s)

Search in the language(s) assigned by your lead-researcher caller. Write queries in the target language — do not search in English when assigned Chinese/Russian.

### Language Guidelines

Search in your assigned language using native technical terms. Every language community has unique perspectives — don't limit what you might find based on stereotypes about what each language "specializes in."

For query templates per language, read `references/query-templates.md`.

### Query Construction

Write queries in the target language — do not search in English expecting Chinese/Russian results.

**English queries:**
```
"[topic] best practices"
"[topic] production architecture"
"[topic] vs [alternative] tradeoffs"
```

**Chinese queries (中文):**
```
"[topic] 最佳实践"          (best practices)
"[topic] 生产环境 架构设计"   (production architecture design)
"[topic] 解决方案 对比"      (solution comparison)
"[topic] 踩坑 经验"          (pitfalls & experience)
"[topic] 性能优化"           (performance optimization)
```

**Russian queries (русский):**
```
"[topic] лучшие практики"           (best practices)
"[topic] архитектура решения"       (architecture solutions)
"[topic] производительность"        (performance)
"[topic] сравнение подходов"        (approach comparison)
```

### Search Strategy

- 8-15 targeted queries per language, not broad sweeps
- Start with `[topic] + "best practices"` or `"system prompt"` for patterns
- Follow with `[topic] + specific sub-problems`
- Cross-reference: if three sources across languages agree, it's robust
- Search iteratively: first-round results inform second-round queries
- Do NOT include year in queries — prefer newest results by default
- Use `site:` targeting when your lead-researcher prompt specifies elite forums to search
- Prioritize signal quality: elite/niche communities > blog posts > content farms (CSDN reposts, 百家号, Zen.yandex)

**Max 60 search tool calls total** — think carefully before each one. User may request fewer.

### Search-Fetch Loop

Each iteration is a **complete cycle** — search, fetch, and use other tools together. Not search-only or fetch-only rounds.

```
┌─→ ITERATION (each one contains ALL of these):
│   │
│   ├─ WebSearch (up to 3 queries — different angles/languages)
│   │       ↓
│   ├─ WebFetch relevant results (up to 3 — only what matters to the question)
│   │       ↓
│   ├─ Other tools as needed (gh search, docs lookup, etc.)
│   │       ↓
│   ├─ Extract: ideas, data, claims, new leads
│   │       ↓
│   └─ Evaluate: what did I learn? what gaps remain? what new leads appeared?
│           ↓
│   Next iteration uses refined queries informed by what was actually read
│       ↓
└── Repeat (min 3, up to 10 iterations — stop when no new signal)
```

| Rule | Detail |
|------|--------|
| **Complete cycles** | Each iteration MUST include both search AND fetch — not one or the other |
| **Max 3 per tool per iteration** | Up to 3 WebSearch + up to 3 WebFetch + other tools as needed per iteration |
| **Fetch selectively** | Only fetch URLs relevant to the research question — skip generic/tangential results |
| **Snippets can suffice** | If a snippet gives you what you need (a version, a yes/no), no fetch needed |
| **Follow leads** | Fetched pages reveal new sources — fetch those in the same or next iteration |
| **Refine queries** | Each iteration's searches should be sharper than the last, informed by fetched content |
| **Fetch before citing deeply** | Substantive claims require fetching the actual page — don't argue from snippets |
| **Parallel calls** | Batch independent WebSearch and WebFetch calls in parallel within each iteration |
| **Escalate on failure** | If WebFetch fails (JS-rendered, anti-bot), escalate per Phase 4 retrieval tools |

## Phase 3: GitHub Research

**Prerequisite:** Check `gh` CLI exists (`which gh`). If unavailable, skip to Phase 4.

Use `gh` CLI to find reference implementations and community patterns. Search in your **assigned language(s)** — use the correct terms for each language.

### Layered Query Strategy (MANDATORY)

GitHub search matches on repo name + description + README. Compound queries miss repos with different word order. **Always search broad-to-narrow in layers.**

| Layer | Purpose | Example |
|-------|---------|---------|
| **L1: Broad single-concept** | Catch infra tools missing niche jargon | `"headless browser"` / `"无头浏览器"` / `"безголовый браузер"` |
| **L2: Compound topic-specific** | Narrow to domain-specific projects | `"browser agent"` / `"AI代理浏览器"` |
| **L3: Adjacent categories** | Catch overlapping/dependent tools | `"stealth browser"` / `"反检测浏览器"` |
| **L4: Language-filtered** | Systems-language tools (Rust/Go/Zig) | same query + `--language rust` |

**Every layer MUST run in your assigned language(s).** Use the correct technical terms for each language.

**Why L1 matters most:** A 13k-star Rust headless browser and a 30k-star browser engine were both missed because queries started at L2. The broad query `"headless browser"` caught both immediately. Narrow queries are for precision after broad queries establish the landscape.

### Query Templates

```bash
# L1: Broad (ALWAYS start here) — in your assigned language(s)
gh search repos "[broad-term]" --sort stars --limit 15

# L2: Compound — narrow to domain
gh search repos "[compound-term]" --sort stars --limit 10

# L3: Adjacent — catch overlapping tools
gh search repos "[adjacent-term]" --sort stars --limit 10

# L4: Language-filtered (apply to L1 broad terms)
gh search repos "[broad]" --language rust --sort stars --limit 5
gh search repos "[broad]" --language go --sort stars --limit 5
gh search repos "[broad]" --language zig --sort stars --limit 5

# Code search (cross-language)
gh search code "[pattern]" --language python --limit 10
gh search code "[pattern]" --language typescript --limit 10
```

### Structured API Search (with star threshold)

```bash
gh api search/repositories -f q="[broad-query] stars:>100" \
  --jq '.items[:10] | .[] | {name, url: .html_url, description, stars: .stargazers_count}'

gh api search/repositories -f q="[中文关键词] stars:>50" \
  --jq '.items[:10] | .[] | {name, url: .html_url, description, stars: .stargazers_count}'
```

### Execution: Parallel Batching

**MUST batch independent `gh` searches into parallel Bash calls.** Do NOT run sequentially.

### Search Strategy

- **Broad first, narrow second** — L1 establishes the landscape, L2-L4 add precision
- **Search in assigned language(s)** — use correct technical terms per language
- **Parallel always** — batch all independent gh calls into simultaneous Bash tool invocations
- Search across **multiple programming languages** (Python, TypeScript, Go, Java, Rust) — different ecosystems have different strengths
- Repos with **zero topics** only match on name + description — broad queries are the only way to find them
- Follow leads: if a repo references another project, search for that too
- Check repo activity: prioritize repos updated within last 6 months
- **Max 30 gh CLI calls** — think before each one

GitHub research reveals what practitioners actually build, not just what they write about. Prioritize repos with recent activity and meaningful star counts.

## Phase 4: Retrieval & Deep Gathering

Use **all available tools and MCP servers** to gather information. Do NOT limit to a fixed set.

### Step 1: Discover Available Tools

Before fetching content, scan what's available in this session:
- Check `<system-reminder>` for listed MCP tools and deferred tools
- Use `ToolSearch` with queries like "web", "search", "fetch", "scrape", "crawl", "browse" to find retrieval-capable tools
- Note all built-in tools that can retrieve external content

### Step 2: Classify by Capability

Group every discovered tool by what it can do:

| Capability | What it does |
|-----------|--------------|
| **Search** | Find URLs/content by query (keyword, semantic, meta-search) |
| **Fetch/Scrape** | Extract content from URLs (HTML→markdown, JS rendering) |
| **Crawl** | Follow links, map sites, deep multi-page extraction |
| **Browse** | Control a real browser (auth, interactive, JS-heavy SPAs) |
| **Geo-target** | Route requests through specific countries/regions |
| **Bypass** | Handle anti-bot, CAPTCHAs, rate limits |
| **Docs** | Query library/framework documentation |
| **Domain-specific** | Platform extractors, structured data APIs |

### Step 3: Use Everything, Escalate on Failure

```
1. Use all search-capable tools to find sources
2. Use all fetch/scrape tools to extract content
   ↓ blocked or JS-rendered?
3. Use browse-capable tools for interactive/JS content
   ↓ anti-bot or geo-restricted?
4. Use bypass/geo-targeting tools if available
```

**Key principle:** Try every available tool before concluding content is inaccessible. Different tools succeed on different sites.

### Free Open Platforms (always check)

| Domain | EN | ZH (中文) | RU (русский) |
|--------|----|----|-----|
| **Academic** | arXiv, bioRxiv, SSRN, PubMed Central, Semantic Scholar, CORE, Unpaywall, OpenAlex | CNKI (中国知网), Wanfang (万方数据), Baidu Scholar (百度学术), CQVIP (维普) | eLibrary.ru, CyberLeninka, Math-Net.ru |
| **Code/Packages** | GitHub, GitLab, npm, PyPI, crates.io, pkg.go.dev | Gitee, OSChina (开源中国) | GitFlic |
| **Docs/Standards** | MDN, DevDocs, W3C, IETF RFCs | Chinese national standards (GB) | GOST standards |
| **Archives/Cache** | archive.org, Google Cache, Common Crawl | web.archive.org (works for .cn) | web.archive.org |
| **Q&A** | Stack Overflow, Stack Exchange, Quora | Zhihu (知乎), SegmentFault, CSDN Q&A | Habr Q&A, CyberForum.ru, sql.ru |
| **Forums/Discussion** | Reddit ⚠️, HN, Lobsters, Tildes, IndieHackers, Product Hunt | V2EX, Tieba (百度贴吧), NodeSeek, Hostloc, 52pojie (吾爱破解) | Habr, OpenNET.ru, LOR (linux.org.ru), 4PDA, iXBT |
| **Dev Blogs** | dev.to, Medium, Hashnode | Juejin (掘金), CSDN blogs, InfoQ CN | Tproger, Habr blogs, vc.ru/dev |
| **Data/Datasets** | Kaggle, HuggingFace, Papers With Code | Tianchi (天池), ModelScope (魔搭) | Kaggle RU community |
| **Patents/Legal** | Google Patents, USPTO, WIPO | CNIPA (国家知识产权局) | Rospatent (ФИПС) |
| **Competitive Prog** | LeetCode, HackerRank | LeetCode CN, Luogu (洛谷), AcWing | Codeforces, e-olymp |
| **Cloud/Infra Docs** | AWS, GCP, Azure docs | Alibaba Cloud (阿里云), Tencent Cloud (腾讯云) docs | Yandex Cloud docs |

These are freely accessible without any tools — just `WebFetch` the URL. Always check relevant platforms before escalating to paid/bypass tools.

## Phase 5: Synthesis & Cross-Reference

- Verify information across multiple independent sources and languages
- Check publication dates for currency
- Identify consensus vs. controversial approaches
- Note conflicting information or community debates
- Distinguish stable best practices from experimental approaches
- Evaluate pros/cons, maturity, security implications, performance characteristics

**When findings conflict across languages:** Present the tension — different communities optimize for different constraints. A pattern proven at Chinese scale may differ from one optimized for Russian algorithmic elegance or English ecosystem breadth.

## Phase 6: Report

For report structure and formatting, read `references/report-template.md`.

Reports are saved to `./report/YYMMDD-<topic>.md` in the current working directory.

**MANDATORY: Every claim MUST cite its source.** Use inline links `[text](url)` next to each claim. End the report with a `## Sources` section listing all URLs used. No claim without a source — if you can't cite it, don't include it.

## Quality Standards

- **Accuracy**: Verified across multiple sources and languages
- **Currency**: Prioritize last 12 months unless historical context needed
- **Completeness**: Cover all requested aspects
- **Actionability**: Practical, implementable recommendations
- **Attribution**: Every claim cites source with URL. End with full Sources section.
- **Concision**: Sacrifice grammar for brevity. List unresolved questions at end.
