# Delegation Protocol (MANDATORY)

> **Why this file exists:** Your memory is wiped on every session refresh. You retain NOTHING from prior conversations. The ONLY way to persist knowledge, behavior, and expertise is through **files** — CLAUDE.md, rules/, skills, agents, and memory/. This protocol is your survival manual. Every rule here is a MUST, not a suggestion. Violating these rules means regressing to a blank, unguided state that wastes the user's time re-teaching you.

## Core Distinction

| Tool | Type | You do work? |
|------|------|--------------|
| `Task` | Delegation | No — agent works autonomously |
| `Skill` | Enhancement | Yes — skill guides you |

## Memory Loss Mitigation

You MUST understand the persistence hierarchy:

| Layer | What it preserves | When to use |
|-------|-------------------|-------------|
| **CLAUDE.md** | Identity, rules, tool config | Core behavior that NEVER changes |
| **rules/** | Domain protocols, workflows | Structured guidance for specific domains |
| **Skills** | Step-by-step process guidance | When you need HOW to do something — even 1% relevance triggers invocation |
| **Agents** | Autonomous task execution | When work requires independent judgment or parallel exploration |
| **memory/** | User preferences, project context | Cross-session knowledge about the user and their projects |

**Why skills and agents matter more than you think:** Without them, you are a blank slate guessing at best practices. Skills encode hard-won process knowledge. Agents encode delegation patterns. Skipping them means the user must re-teach you every session. This is unacceptable.

## Skills: 1% Rule (MANDATORY)

**Even 1% chance a skill applies? You MUST invoke it. No exceptions.**

- Skills are your only way to access process knowledge that survives memory loss
- Skipping a skill = discarding expertise the user already configured for you
- You MUST check available skills BEFORE taking any action
- When multiple skills match: **Process first** (debugging, planning) → **Implementation second**
- You MUST NEVER justify skipping a skill with "I already know how to do this" — you don't, your memory was wiped

## Fresh Conversation Research Protocol (MANDATORY)

When you receive a **new feature request, brainstorm task, or unfamiliar problem** in a fresh conversation, you MUST follow this research protocol before implementation:

### Step 1: Read Local First
- MUST read relevant local files (code, configs, docs) to understand current state
- MUST run `git log`, `git diff`, or `git blame` if the task involves existing code
- Use local findings to craft precise search queries

### Step 2: Research (via lead-researcher)

**ALWAYS invoke the `lead-researcher` skill** — it is the MANDATORY entry point for ALL research. Never spawn `researcher` agents directly.

The brain decides agent count, languages, iterations, and depth at runtime. Only hard default: **EN + ZH + ZH-TW** when no language specified. "Quick/nhanh/fast" research still goes through lead-researcher — the skill assigns fewer agents and iterations, you do NOT bypass it to save time.

**How it works:**
1. YOU invoke `lead-researcher` skill → it guides you to triage, confirm plan, decompose, assign
2. YOU spawn `gatherer` agents per the plan (each gets 1 language + 1 sub-topic)
3. Agents return findings → YOU (the forager brain) REFLECT: verify data accuracy, extract gems, filter SEO noise, check intent-data match → then synthesize

**Do NOT:**
- Invoke the `research` skill directly for research — it's methodology, not orchestration
- Spawn `researcher` agents without going through `lead-researcher` first
- Do WebSearch yourself — use direct WebSearch ONLY for single-fact lookups (e.g., "what version is X", "is library Y deprecated"). "Quick research" / "research nhanh" is STILL research — route through lead-researcher.

### Step 3: GitHub Research
MUST use `gh` CLI with multi-language queries (English + Chinese + Russian terms). Run searches in **parallel Bash calls**, not sequentially. MUST search repos, code, issues, AND PRs — not just repos.

```bash
# Wave 1: Repos + Code (fire simultaneously)
gh search repos "[topic]" --sort stars --limit 10
gh search repos "[中文关键词]" --sort stars --limit 10
gh search code "[pattern]" --language python --limit 10
gh search code "[pattern]" --language typescript --limit 10

# Wave 2: Issues + PRs (fire simultaneously)
gh search issues "[topic] broken OR error OR blocked" --sort updated --limit 10
gh search issues "[topic] alternative OR migration" --sort updated --limit 10
gh search prs "[topic]" --sort updated --limit 10
gh search commits "[topic]" --sort committer-date --limit 10
```

Issues/PRs surface what repo search misses: real breakage reports, workarounds, pain points, and active development signals.

### Step 4: Synthesize
- MUST compare findings across sources before proposing a solution
- MUST cite which approach you chose and why
- If conflicting advice exists, present the tension to the user

### When to Skip Research
You may skip web/GitHub research ONLY when:
- The task is a simple bug fix with a clear root cause already identified
- The user explicitly says "don't research, just do it"
- The task is purely mechanical (rename, move file, format)

## Agents: Decision Tree

### Step 1: Context Check
Before spawning an agent, you MUST verify:
- Is the answer already in this conversation? → MUST use it
- Did user provide the spec/target? → MUST transform, NEVER explore what's already given

### Step 2: Complexity Assessment

| Unknowns | Action |
|----------|--------|
| 0 (have everything) | MUST execute directly |
| 1 (single lookup) | MUST use direct tool (Glob/Grep/Read) |
| 2-3 related | MUST consider 1 agent |
| Multiple independent | MUST use parallel agents (max 3) |

### Step 3: Necessity Test
Ask: "Can I answer this with ONE direct tool call?"
- YES → MUST NOT delegate
- NO → MUST check if agent adds value beyond tool chaining

### Step 4: Value Test
Delegate ONLY when agent provides:
- Autonomous decision-making (not just sequential tools)
- Domain expertise you lack
- Parallel exploration of unknown scope

## DGE Loop: Decide → Gather → Execute (MANDATORY)

- MUST state commitment before gathering: "I will [Tool] after reading"
- MUST execute within max 3 reads
- MUST NOT silently pivot — state explicitly: "Changing from X to Y because..."
- MUST NOT enter infinite refinement loops ("one more file to be sure...")

## Orchestration Patterns

### Parallel Execution
MUST launch multiple agents simultaneously when tasks are independent:
- Different aspects of same system (frontend + backend)
- Multiple independent searches
- Code + Tests + Docs for non-conflicting components

**Max 3 concurrent agents.** MUST batch larger workloads into waves.

### Sequential Chaining
MUST chain when outputs become inputs:
- Planning → Implementation → Testing → Review
- Research → Design → Code → Documentation

### Sub-Agent Prompting
MUST equip every sub-agent with relevant skills AND MCP tools. An agent without its tools is blind.

**Template:**
```
"[Overall Objective] [What This Task Contributes to Overall Objective]
[Task description]

RECOMMENDED SKILLS: [skill-name] - [when to use]
Use Skill tool for guidance.

RECOMMENDED MCP TOOLS: [tool-name] - [when to use]
Load via ToolSearch before calling."
```

**MCP matching rules (MANDATORY):**

| Agent task | MUST include MCP |
|------------|------------------|
| Research / web search | `mcp__parallax__web_search`, `mcp__parallax__fetch_page` — on par with WebSearch/WebFetch, bypasses bot-protection |
| Code exploration / architecture | `mcp__codebase__search_graph`, `mcp__codebase__trace_path`, `mcp__codebase__query_graph` |
| Browser interaction | `mcp__claude-in-chrome__*` (list specific tools needed) |
| Documentation lookup | `mcp__plugin_context7_context7__*` |
| GitHub operations | `gh` CLI (not MCP, but MUST mention in prompt) |

**Skill matching rules (MANDATORY):**

| Agent task | MUST recommend skill |
|------------|---------------------|
| Research | `lead-researcher` (entry point), `deep-gather` (if agent IS a gatherer) |
| Code review | `code-review`, `code-quality` |
| Frontend / UI | `frontend-design`, `design-principles`, `taste-skill` |
| Planning | `planning`, `sequential-thinking` |
| Problem solving | `problem-solving`, `sequential-thinking` |
| Git operations | `git-workflow` |
| Infrastructure | `infra-engineer` |
| Database work | `databases` |

**The rule:** if YOU would use a skill/MCP for this task, the agent MUST know about it too.

## Anti-Patterns (MUST AVOID)

| Sign | Problem | Fix |
|------|---------|-----|
| Agent for single file lookup | Over-delegation | MUST use Glob/Read |
| Multiple agents for linear task | Over-division | MUST use single agent or direct |
| Exploring what's in the message | Context blindness | MUST read the conversation |
| Agent to "understand patterns" | Skill gap | MUST use Skill for guidance |
| Confuse Skill with delegation | Wrong tool type | Skill = guidance, Task = delegation |
| Sequential launches for independent tasks | Wasted time | MUST parallel launch |
| Spawn agents without skill guidance | Missing context | MUST include RECOMMENDED SKILLS |
| Skip web research on new tasks | Reinventing the wheel | MUST research first (Step 2-3 above) |
| Skip skills because "I know how" | Memory arrogance | MUST invoke — your memory was wiped |
| Implement before reading local code | Context blindness | MUST read local files + git first |
| Using research skill to do searches yourself | Context bloat + bias | MUST delegate to researcher agent — fresh context, parallel, no bias |
| Spawn agent without MCP tools | Tool blindness | MUST include relevant MCP tools (parallax for research, codebase for code, etc.) |
| Use only WebSearch, skip Parallax | Tool tunnel vision | MUST mention both — parallax bypasses bot-protection, fetches JS-rendered pages |
| Spawn code agent without codebase MCP | Grep fallback waste | MUST equip with codebase MCP tools for structural queries |
