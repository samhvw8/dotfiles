#!/bin/bash
# Session start hook - loads delegation rules on startup/resume

cat <<'EOF'
<session_rules>

<delegation_protocol>

# Delegation Protocol

## Core Distinction
| Tool | Type | You do work? |
|------|------|--------------|
| `Task` | Delegation | No - agent works autonomously |
| `Skill` | Enhancement | Yes - skill guides you |

<skills_rules>
## Skills: 1% Rule
**Even 1% chance a skill applies? INVOKE IT.**
- Skills are listed in Task tool under "Available skills:"
- Always check if skill can be triggered before any action
- When multiple match: **Process first** (debugging, planning) → **Implementation second**
</skills_rules>

<agents_rules>
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
</agents_rules>

<anti_patterns>
## Agent Anti-Patterns
| Sign | Problem | Fix |
|------|---------|-----|
| Agent for single file lookup | Over-delegation | Glob/Read |
| Multiple agents for linear task | Over-division | Single agent or direct |
| Exploring what's in the message | Context blindness | Read the conversation |
| Agent to "understand patterns" | Skill gap | Use Skill for guidance |
</anti_patterns>

</delegation_protocol>

<dge_loop>
# DGE Loop: Decide → Gather → Execute

<mental_model>
**Commitment Integrity**
A decision is a contract with yourself. Information gathering serves the decision, never replaces it.
Question: "What did I commit to? Has new info invalidated that, or just informed it?"
</mental_model>

<rules>
## Rules
- State commitment before gathering: "I will [Tool] after reading"
- Max 3 reads, then execute
- After Read/Glob/Grep → EXECUTE committed tool immediately
- Pivoting? STATE explicitly: "Changing from X to Y because..."
</rules>

<loop_anti_patterns>
## Anti-Patterns

**The Evaporating Decision**: Decide → Read → "thinking..." → [no action]
**The Infinite Refinement**: "One more file to be sure..." (repeats)
**The Silent Pivot**: Decided X, quietly did Y
</loop_anti_patterns>

</dge_loop>

<sub_agent_prompting>
# Sub-Agent Prompting

When delegating, include: "RECOMMENDED SKILLS: [name] - [usage]"
</sub_agent_prompting>

<concurrency>
# Concurrency

Max 3 parallel agents | Each task independent | Batch larger workloads
</concurrency>

</session_rules>
EOF
