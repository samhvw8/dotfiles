# Retrieval Tools

Knowledge base for web retrieval MCP servers and APIs. Use this to understand what tools exist and recommend installations — NOT as a fixed checklist. At runtime, discover and use **all** available tools in the session.

## Tool Selection Matrix

| Need | Tool | Why |
|------|------|-----|
| Simple static page | Fetch MCP / Jina | Free, fast, sufficient |
| Search + scrape + crawl | Firecrawl MCP | Best all-rounder; autonomous agent; 80% token savings |
| Semantic search (research) | Exa MCP | Neural embedding; deep multi-turn search |
| General search | Tavily / Brave / Serper | Keyword-based; good for broad queries |
| JS-rendered / interactive | Playwright MCP | Full browser; handles auth/sessions |
| Anti-bot bypass | Scrapfly (95-98%) / Bright Data | Enterprise proxy networks |
| Geo-restricted content | UpRock (190+ countries) / Bright Data (200 loc) | Real devices / residential IPs |
| Structured platform data | Apify MCP | Pre-built extractors for 120+ domains |
| Self-hosted / private | Crawl4AI (Docker) / SearXNG | Free; no external API dependency |

## Budget Tiers

### Free ($0/mo)

```
Fetch MCP        — simple pages (built-in)
TinyFish MCP     — search (5/min) + JS-rendered fetch (25/min)
Playwright MCP   — browser automation (MIT)
Exa              — 1K semantic searches/mo
```

### Recommended (~$25/mo)

```
Firecrawl Hobby  — $16/mo, 3K credits (search+scrape+crawl+agent)
Exa free tier    — 1K req/mo semantic search
Playwright       — $0, browser automation
```

### Enterprise (variable)

```
Bright Data MCP  — 150M+ IPs, 200 geo-locations, 60+ tools
Scrapfly MCP     — 95-98% anti-bot bypass rates
```

## Escalation Pattern

```
1. Try Fetch MCP / Jina (free, simple)
   ↓ blocked or JS-rendered?
2. Try Firecrawl / TinyFish (search + scrape)
   ↓ anti-bot wall?
3. Try Scrapfly / Bright Data (proxy bypass)
   ↓ geo-restricted?
4. Try UpRock / Bright Data with country targeting
```

## Paywalled Content (Legal Alternatives)

| Source | For |
|--------|-----|
| arXiv, bioRxiv, SSRN | Academic preprints |
| Unpaywall, CORE, Semantic Scholar | Open access mirrors |
| Archive.org Wayback Machine | Historical snapshots |
| Author personal sites | Self-hosted papers |
| Google/Bing cache | Cached versions (declining availability) |

## Anti-Bot Bypass Rates

| Tool | Cloudflare | Akamai | DataDome | Imperva |
|------|-----------|--------|----------|---------|
| Scrapfly | 98% | 97% | 96% | 96% |
| Bright Data | High | High | High | High |
| Crawl4AI | 3-tier auto-escalation | - | - | - |
| Firecrawl | Moderate | Moderate | - | - |

## Related

- [SKILL.md](../SKILL.md) — main research methodology
- [language-matrix.md](language-matrix.md) — country/language selection
