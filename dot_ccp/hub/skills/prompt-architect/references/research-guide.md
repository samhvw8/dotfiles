# Research & Retrieve Guide

The LLM is the CPU, the context window is RAM, and the prompt architect is the OS responsible for loading the right information.

## What to Retrieve

**Domain knowledge** — The expert lens the prompt needs to embody:
- Current best practices, standards, frameworks in the target domain
- Common failure modes, anti-patterns, edge cases practitioners encounter
- Key mental models and decision heuristics experts actually use

**Prompt architectures** — How production systems structure similar prompts:
- Leaked/published system prompts from comparable tools (GitHub repos: `system-prompts-and-models-of-ai-tools`, `leaked-system-prompts`, `awesome-system-prompts`)
- Prompt patterns from Cursor, v0, Manus, Devin, Claude Code for structural inspiration
- GitHub Gists with prompt architectures for similar domains

**Research & techniques** — Academic and practitioner findings:
- ArXiv papers on prompt optimization relevant to the task type (retrieval-augmented prompting, self-refine, multi-agent debate, chain-of-thought variants)
- Anthropic's latest prompt engineering documentation for Claude-specific patterns
- Model-specific guidance (Claude XML preference, GPT structured outputs, Gemini few-shot preference)

**Community knowledge** — Practitioner insights from the field:
- X/Twitter threads from prompt engineers and AI builders on similar domains
- Blog posts and case studies from teams who've shipped similar agents
- Open-source agent implementations with mature prompt design

## How to Search

- Use 3-6 targeted queries, not one broad sweep
- Start with domain + "system prompt" or "agent prompt" for architectural patterns
- Follow with domain + specific sub-problems (e.g., "Magento code review anti-patterns" not just "Magento")
- Cross-reference findings: if three sources agree on a pattern, it's likely robust
- Fetch full pages when snippets are insufficient — depth matters more than breadth
- Search iteratively: first-round results inform second-round queries

## How to Synthesize

- Extract structural patterns (how sections are organized, what gets its own tag)
- Identify domain-specific mental models and tensions
- Note anti-patterns and failure modes that appear across sources
- Distinguish between model-specific quirks (Claude XML, GPT JSON mode) and universal principles
- Discard marketing fluff, preserve practitioner signal

## Integration Rule

Research feeds directly into:
- **Soul tensions** — Domain research reveals the real competing forces practitioners navigate
- **Mental models** — Extracted from how domain experts actually conceptualize problems, not invented
- **Anti-patterns** — Sourced from documented failure modes, not hypothetical
- **Voice and register** — Calibrated to how practitioners in this domain actually communicate
- **Boundaries** — Informed by what comparable production prompts scope in vs. out
