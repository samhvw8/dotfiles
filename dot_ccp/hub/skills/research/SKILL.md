---
name: research
description: "Multi-language technical research across English, Chinese (中文), and Russian (русский) developer communities. Phases: scope → multi-language search → GitHub research → retrieval tools → synthesis → report. Capabilities: technology evaluation, architecture analysis, best practices research, trade-off assessment, solution design, competitive analysis. Actions: research, analyze, evaluate, compare, recommend technical solutions. Keywords: research, technology evaluation, best practices, architecture analysis, trade-offs, scalability, security, YAGNI, KISS, DRY, technical analysis, solution design, feasibility study, 最佳实践, 架构设计, лучшие практики. Use when: researching technologies, evaluating architectures, analyzing best practices, comparing solutions, assessing technical trade-offs, planning scalable/secure systems. Also use when: user asks 'what's the best way to', 'how should I approach', 'what are the options for', or any question that benefits from current external knowledge rather than training data alone."
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

| Language | Priority | Query Language | Guidance |
|----------|----------|----------------|----------|
| **English** | MUST | English | Official docs, engineering blogs, conference talks. Broadest coverage. |
| **Chinese (中文)** | MUST | Chinese | Use Chinese technical terms. Rich in production-scale patterns, mobile/fintech, infrastructure at scale. |
| **Russian (русский)** | RECOMMENDED | Russian | Use Russian technical terms. Strong in systems programming, algorithms, competitive programming, security. |

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

Use `gh` CLI to find reference implementations and community patterns:

```bash
# Find top repos
gh search repos "[topic]" --sort stars --limit 5

# Find code patterns
gh search code "[pattern]" --language [lang] --limit 10

# Structured search with star threshold
gh api search/repositories -f q="[query] stars:>100" \
  --jq '.items[:5] | .[] | {name, url, description, stars: .stargazers_count}'
```

GitHub research reveals what practitioners actually build, not just what they write about. Prioritize repos with recent activity and meaningful star counts.

## Phase 4: Retrieval Tools

Use any available retrieval tools to gather deeper knowledge:

**context7 MCP** (library/framework docs):
- Use `resolve-library-id` to find the library, then `query-docs` for specific topics
- Especially valuable for API syntax, version-specific behavior, and configuration

**Web Fetch** — fetch full pages when search snippets are insufficient

**Official documentation** — always check the official project docs, not just community content

**MCP resources** — check for any domain-specific MCP servers that expose relevant data

The right retrieval tool depends on the domain. Prefer primary sources (official docs, source code) over secondary (blog posts, tutorials).

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

Reports are saved to `./plans/<plan-name>/reports/YYMMDD-<topic>.md`.
If no plan name is given, ask the caller to provide one.

## Quality Standards

- **Accuracy**: Verified across multiple sources and languages
- **Currency**: Prioritize last 12 months unless historical context needed
- **Completeness**: Cover all requested aspects
- **Actionability**: Practical, implementable recommendations
- **Attribution**: Cite sources, provide links, note source language
- **Concision**: Sacrifice grammar for brevity. List unresolved questions at end.
