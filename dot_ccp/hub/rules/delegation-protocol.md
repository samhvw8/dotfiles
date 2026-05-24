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

### Step 2: Research (Multi-Language)
You MUST search for best practices and solutions across elite developer communities in multiple languages. Use the correct language for each query — do NOT search in English for Chinese/Russian results.

| Language | Priority | Guidance |
|----------|----------|----------|
| **English** | MUST | Search in English. Target elite English-speaking developer communities and official documentation. |
| **Chinese** | MUST | Search in Chinese (中文). Target elite Chinese developer communities. Use Chinese technical terms (e.g., 最佳实践, 解决方案, 架构设计). |
| **Russian** | MUST | Search in Russian (русский). Target elite Russian developer communities. Strong in algorithms, systems, security. |
| **Conditional** | Topic-dependent | Add JA (game/embedded/robotics/mfg/auto), KO (gaming/security/CTF), DE (Industry 4.0/automotive), PT-BR (fintech/Brazil). See `research` skill `references/language-matrix.md`. |

**Research execution — ALWAYS delegate to agents, NEVER do searches yourself:**
- **Single-domain research** → spawn `researcher` agent (fresh context, no bias from current conversation)
- **Multi-domain research** (2+ domains, 5+ sources, contradictions likely) → spawn 2-3 `researcher` agents in parallel, each focused on a distinct sub-topic
- **Complex research** (contradictory landscape, needs orchestration) → invoke `lead-researcher` skill to orchestrate

**Why agents over skills for research:** Sub-agents start with fresh context — no bias from prior conversation data. They can run in parallel. Raw search results stay out of the main context window, saving tokens. The agent synthesizes and returns only findings.

**Do NOT** invoke the `research` skill to do searches yourself. Use direct WebSearch ONLY for quick single-fact lookups (e.g., "what version is X").

- MUST also search official project websites and documentation
- MUST NOT include year in search queries (prefer newest results)
- MUST NOT hardcode specific forum names — discover the best sources dynamically

### Step 3: GitHub Research
MUST use `gh` CLI with multi-language queries (English + Chinese + Russian terms). Run searches in **parallel Bash calls**, not sequentially.

```bash
# Fire these simultaneously
gh search repos "[topic]" --sort stars --limit 10
gh search repos "[中文关键词]" --sort stars --limit 10
gh search code "[pattern]" --language python --limit 10
gh search code "[pattern]" --language typescript --limit 10
```

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
MUST always pass relevant skills to sub-agents:
```
"[Overall Objective] [What This Task Contributes to Overall Objective]
[Task description]

RECOMMENDED SKILLS: [skill-name] - [when to use]
Use Skill tool for guidance."
```

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
