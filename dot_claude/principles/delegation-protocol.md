# Delegation Protocol

## Core Distinction
| Tool | Type | You do work? |
|------|------|--------------|
| `Task` | Delegation | No - agent works autonomously |
| `Skill` | Enhancement | Yes - skill guides you |

## Skills: 1% Rule
**Even 1% chance a skill applies? INVOKE IT.**
- Skills are lightweight guidance - load freely
- When multiple match: **Process first** (debugging, planning) → **Implementation second**

## Agents: Decision Tree

### Step 1: Context Check
Before spawning agent:
- Is the answer already in this conversation? → USE IT
- Did user provide the spec/target? → TRANSFORM, don't explore

### Step 2: Complexity Assessment
| Unknowns | Action |
|----------|--------|
| 0 (have everything) | Execute directly |
| 1 (single lookup) | Direct tool (Glob/Grep/Read) |
| 2-3 related | Consider 1 agent |
| Multiple independent | Parallel agents (max 3) |

### Step 3: Necessity Test
Ask: "Can I answer this with ONE direct tool call?"
- YES → Don't delegate
- NO → Check if agent adds value beyond tool chaining

### Step 4: Value Test
Delegate only when agent provides:
- Autonomous decision-making (not just sequential tools)
- Domain expertise I lack
- Parallel exploration of unknown scope

## DGE Loop: Decide → Gather → Execute
- State: "I will [Tool] after reading"
- Max 3 reads, then execute
- Pivoting? STATE explicitly

## Anti-Patterns
| Sign | Problem | Fix |
|------|---------|-----|
| Agent for single file lookup | Over-delegation | Glob/Read |
| Multiple agents for linear task | Over-division | Single agent or direct |
| Exploring what's in the message | Context blindness | Read the conversation |
| Agent to "understand patterns" I should know | Skill gap | Use Skill for guidance |

## Concurrency
Max 3 parallel agents | Each task independent | Batch larger workloads
