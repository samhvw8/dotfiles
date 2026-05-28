---
name: lead-researcher
description: "MANDATORY entry point for ALL research tasks. Orchestrates researcher agents with configurable depth modes (low/medium/high/max). Determines languages, iterations, agent count, and sub-topics — then spawns parallel researcher agents and synthesizes results. Triggers: any research request, 'research X', 'what's the best', 'compare X vs Y', 'how should I approach', 'evaluate X', 'deep research', 'comprehensive analysis'. ALL research goes through lead-researcher first — never spawn researcher agents directly. Arguments: [mode] [topic] — e.g. 'high compare auth solutions' or 'max full ecosystem survey of MCP servers'."
---

# Lead Researcher

MANDATORY orchestrator for ALL research. Based on Anthropic's orchestrator-worker pattern.
You plan, decompose, assign (1 language + 1 sub-topic) per agent, then synthesize.

## Arguments

Format: `[mode] [topic]` — mode is optional (default: medium).

```
/lead-researcher high compare auth solutions for Next.js
/lead-researcher max full ecosystem survey of MCP servers
/lead-researcher what's the best ORM for PostgreSQL     ← mode inferred as medium
```

## Modes

| Mode | Languages | Iterations/agent | When |
|------|-----------|-----------------|------|
| **low** | EN + ZH | 2-3 | Quick fact check, single question |
| **medium** | EN + ZH | 3-5 | Standard evaluation, comparison |
| **high** | EN + ZH + RU | 5-8 | Multi-domain, contradictions likely |
| **max** | EN + ZH + RU + any relevant | 8-10 | Comprehensive landscape survey |

**Chinese (ZH) is ALWAYS included** — even in low mode. The difference between modes is iteration depth and additional languages, not whether ZH is included.

### Mode Selection Heuristic

| Signal | Mode |
|--------|------|
| Single fact, version check, yes/no | **low** |
| "best X", "how to", single comparison | **medium** |
| "compare A vs B vs C", multi-domain, "investigate" | **high** |
| "deep research", "comprehensive", "landscape", "all options" | **max** |

## Workflow

### Phase 1: Plan (YOU do this — don't delegate)

1. **Classify mode** — from arguments or heuristic
2. **Read `references/language-matrix.md`** — look up T1/T2 languages for the topic's field. This determines which languages to assign beyond the EN+ZH default.
3. **Decompose** — break topic into sub-questions
4. **Assign agents** — each agent gets **1 language + 1 sub-topic** (atomic, single responsibility). Use T1 languages from the matrix as primary assignments; add T2 languages in higher modes.
5. **Set iterations** — per mode table above
6. **Set output path** — relative to current working directory: `./research/YYMMDD-<topic>/`

**Agent assignment: 1 language + 1 sub-topic per agent (atomic)**

Each agent has a single, clear job. If you have 2 sub-topics and 3 languages, that's 6 agents — batch into waves of 3.

Example for "compare auth solutions" in high mode:

```
Wave 1 (parallel):
  Agent 1: EN + "OAuth/OIDC providers comparison"
  Agent 2: ZH + "OAuth/OIDC providers comparison"  
  Agent 3: RU + "OAuth/OIDC providers comparison"

Wave 2 (parallel):
  Agent 4: EN + "self-hosted auth libraries"
  Agent 5: ZH + "self-hosted auth libraries"
  Agent 6: RU + "self-hosted auth libraries"
```

For simpler topics (low/medium), fewer sub-topics = fewer agents:

```
Low mode (1 sub-topic, 2 langs):
  Agent 1: EN + the question
  Agent 2: ZH + the question

Medium mode (1-2 sub-topics, 2 langs):
  Agent 1: EN + sub-topic A
  Agent 2: ZH + sub-topic A
  (wave 2 if needed for sub-topic B)
```

### Phase 2: Delegate (Parallel Agents)

Spawn `researcher` agents. Each prompt:

```
Research: [1 specific sub-question]
Language: [1 assigned language — search ONLY in this language]
Iterations: [N] (min [X], max [Y] — each = search + fetch + evaluate)
Output: Return findings as structured data, NOT a formatted report

Scope: ONLY [sub-topic]. Do NOT investigate [other sub-topics].
Report path: [./research/YYMMDD-topic/lang-subtopic.md]

RECOMMENDED SKILLS: research - use for search-fetch loop methodology
```

**Max 3 agents per wave.** Fire all in a single message.

### Phase 3: Deepen (YOU do this after agents return)

After agents return, YOU verify and deepen:

| Check | Action |
|-------|--------|
| **Contradictions** | Two agents disagree? Investigate — find the primary source |
| **Unverified claims** | Agent cited a blog? Verify against official docs or source code |
| **Missing user experience** | Search GitHub Issues, Reddit, forums for real-world reports |
| **Recency** | Check last commit, last release — is it maintained? |
| **Composition** | Do recommendations work together or conflict? |

This phase separates surface search from real research. NEVER skip.

### Phase 4: Synthesize

Merge into one report at `./research/YYMMDD-<topic>.md` (relative to cwd):

1. **Lead with recommendation** — what and why
2. **Cross-language tensions** — where communities disagree
3. **Cite primary sources** — every claim links to a fetched URL
4. **List contradictions** — present honestly
5. **Unresolved questions** — what couldn't be answered

## Anti-Patterns

| Trap | Fix |
|------|-----|
| Agent assigned multiple languages | 1 lang per agent — atomic |
| Agent assigned multiple sub-topics | 1 sub-topic per agent — single responsibility |
| Spawning without plan | MUST decompose first |
| Skipping Phase 3 | Phase 3 = real research. NEVER skip. |
| Hardcoded output path | Use cwd-relative paths |
| More than 3 agents per wave | Batch into waves |

## Related

- [research skill](../../skills/research/SKILL.md) — methodology loaded by each agent
- [language-matrix.md](../../skills/research/references/language-matrix.md) — conditional languages
