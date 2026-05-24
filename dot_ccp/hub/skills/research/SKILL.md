---
name: research
description: "Single-agent technical research across English, Chinese (中文), and Russian (русский) communities. Web search + GitHub (gh CLI) + retrieval tools → synthesis → report. Use when: 'what's the best way to', 'how should I approach', 'what are the options for', evaluating a technology, or any question needing current external knowledge. For complex multi-domain research (2+ fields, 5+ sources, contradictory landscape), escalate to lead-researcher skill instead."
---

# Research

Multi-language technical research methodology. Honoring **YAGNI**, **KISS**, **DRY**.
Be honest, be brutal, straight to the point, be concise.

## Phase 1: Scope Definition

Before searching, define:
- Key terms and concepts to investigate
- Recency requirements (how current must information be)
- Evaluation criteria and research depth boundaries
- Which languages/communities are most likely to have strong signal for this topic

## Phase 2: Multi-Language Search

Search across language communities using the correct language for each query. Different communities surface different signal — English has breadth, Chinese has scale-tested production patterns, Russian has systems/algorithmic depth.

### Search Language Matrix

#### Always Search (every query)

| Language | Priority | Query Language | Guidance |
|----------|----------|----------------|----------|
| **English** | MUST | English | Official docs, engineering blogs, conference talks. Broadest coverage. |
| **Chinese (中文)** | MUST | Chinese | Use Chinese technical terms. Rich in production-scale patterns, mobile/fintech, infrastructure at scale. |
| **Russian (русский)** | MUST | Russian | Use Russian technical terms. Strong in systems programming, algorithms, competitive programming, security. |

#### Conditional Languages (add when topic matches field matrix)

| Language | Priority | When to add | Key platforms |
|----------|----------|-------------|---------------|
| **Japanese (JA)** | MUST (conditional) | Game dev, embedded/IoT, robotics, manufacturing, automotive | Qiita, Zenn |
| **Korean (KO)** | RECOMMENDED | Mobile gaming, security/CTF, e-commerce | Velog, Tistory |
| **German (DE)** | RECOMMENDED | Industry 4.0, automotive SW, embedded, robotics | Heise.de, Golem.de |
| **Portuguese (PT-BR)** | RECOMMENDED | Fintech/payments (Brazil-specific) | TabNews, iMasters |
| **Vietnamese (VI)** | OPTIONAL | Outsourcing patterns, CTF/security | Viblo |

For full field-to-language matrix and the UNIQUE decision test for when to add a language, read `references/language-matrix.md`.
For query templates in conditional languages, read `references/query-templates.md`.

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
- Fetch full pages when snippets are insufficient — depth over breadth
- Search iteratively: first-round results inform second-round queries
- Do NOT include year in queries — prefer newest results by default
- Let the model discover the best sources dynamically — do not hardcode forum names

**Max 60 search tool calls total** — think carefully before each one. User may request fewer.

## Phase 3: GitHub Research

**Prerequisite:** Check `gh` CLI exists (`which gh`). If unavailable, skip to Phase 4.

Use `gh` CLI to find reference implementations and community patterns. Search in **multiple languages** — Chinese repos surface production patterns, Russian repos surface algorithmic/systems implementations.

### Multi-Language GitHub Search Matrix

**English queries:**
```bash
gh search repos "[topic]" --sort stars --limit 10
gh search code "[topic] [pattern]" --limit 10
gh search code "[topic]" --language python --limit 10
gh search code "[topic]" --language typescript --limit 10
gh search code "[topic]" --language go --limit 10
gh search code "[topic]" --language java --limit 10
gh search code "[topic]" --language rust --limit 10
```

**Chinese queries (中文):**
```bash
gh search repos "[topic 中文关键词]" --sort stars --limit 10
gh search repos "[topic] 中转" --sort stars --limit 10
gh search repos "[topic] 实现" --sort stars --limit 10
gh search code "[中文关键词]" --limit 10
```

**Russian queries (русский):**
```bash
gh search repos "[topic русские термины]" --sort stars --limit 10
gh search code "[русские термины]" --limit 10
```

### Structured API Search (with star threshold)

```bash
# English
gh api search/repositories -f q="[query] stars:>100" \
  --jq '.items[:10] | .[] | {name, url: .html_url, description, stars: .stargazers_count}'

# Chinese keywords
gh api search/repositories -f q="[中文关键词] stars:>50" \
  --jq '.items[:10] | .[] | {name, url: .html_url, description, stars: .stargazers_count}'
```

### Execution: Run Multiple gh Searches in Parallel

**MUST batch independent `gh` searches into parallel Bash calls.** Do NOT run them one-by-one sequentially.

Example — launch all these simultaneously in one message:
```
Bash: gh search repos "[topic]" --sort stars --limit 10; echo "---"; gh search repos "[中文]" --sort stars --limit 10
Bash: gh search code "[topic]" --language python --limit 10; echo "---"; gh search code "[topic]" --language typescript --limit 10
Bash: gh api search/repositories -f q="[query] stars:>100" --jq '...'
```

Group by independence: repo searches together, code searches together, API searches together. Fire all groups in a single response turn.

### Search Strategy

- **Parallel first** — batch all independent gh calls into simultaneous Bash tool invocations
- Search across **multiple programming languages** (Python, TypeScript, Go, Java, Rust) — different ecosystems have different strengths
- Use Chinese terms in repo/code search — many Chinese devs write READMEs and code comments in Chinese
- Combine broad topic search + specific pattern search (e.g., function names, config keys, model IDs)
- Check repo activity: prioritize repos updated within last 6 months
- Follow leads: if a repo references another project, search for that too
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
