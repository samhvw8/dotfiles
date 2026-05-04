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

Reports are saved to `./research/YYMMDD-<topic>.md` in the current working directory.

**MANDATORY: Every claim MUST cite its source.** Use inline links `[text](url)` next to each claim. End the report with a `## Sources` section listing all URLs used. No claim without a source — if you can't cite it, don't include it.

## Quality Standards

- **Accuracy**: Verified across multiple sources and languages
- **Currency**: Prioritize last 12 months unless historical context needed
- **Completeness**: Cover all requested aspects
- **Actionability**: Practical, implementable recommendations
- **Attribution**: Every claim cites source with URL. End with full Sources section.
- **Concision**: Sacrifice grammar for brevity. List unresolved questions at end.
