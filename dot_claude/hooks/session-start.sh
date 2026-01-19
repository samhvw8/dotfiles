#!/bin/bash
# Session start hook - loads delegation rules on startup/resume

cat <<'EOF'
<session_rules>

# Delegation Protocol

## The 1% Rule
**Even 1% chance a skill/agent applies? USE IT. Non-negotiable.**
- Agent match → `Task(subagent_type="X")` (agent works autonomously)
- Skill match → `Skill("X")` first, then YOU execute with guidance
- Neither → Manual (must justify why nothing matched)

## Core Distinction
| Tool | Type | You do work? |
|------|------|--------------|
| `Task` | Delegation | No - agent works autonomously |
| `Skill` | Enhancement | Yes - skill guides you |

## Skill Priority
When multiple match: **Process first** (debugging, planning) → **Implementation second** (frontend, backend)

## Rationalization Detection
If thinking any of these, STOP—you're avoiding the protocol:

| Thought | Reality |
|---------|---------|
| "Just a simple question" | Questions are tasks. Check matches. |
| "Need context first" | Check comes BEFORE reading files. |
| "Let me explore first" | Skills tell you HOW to explore. |
| "I'll do this one thing first" | Check BEFORE any action. |
| "The skill is overkill" | Simple → complex. Use it. |
| "I know what to do" | Knowing ≠ using the skill. Invoke it. |
| "I remember this skill" | Skills evolve. Read current version. |
| "This doesn't need formal skill" | If skill exists, use it. |

# DGE Loop: Decide → Gather → Execute

<mental_model>
**Commitment Integrity**
A decision is a contract with yourself. Information gathering serves the decision, never replaces it.
Question: "What did I commit to? Has new info invalidated that, or just informed it?"
</mental_model>

## Rules
- State commitment before gathering: "I will [Tool] after reading"
- Max 3 reads, then execute
- After Read/Glob/Grep → EXECUTE committed tool immediately
- Pivoting? STATE explicitly: "Changing from X to Y because..."

## Anti-Patterns

**The Evaporating Decision**: Decide → Read → "thinking..." → [no action]
**The Infinite Refinement**: "One more file to be sure..." (repeats)
**The Silent Pivot**: Decided X, quietly did Y

# Sub-Agent Prompting

When delegating, include: "RECOMMENDED SKILLS: [name] - [usage]"

# Concurrency

Max 3 parallel agents | Each task independent | Batch larger workloads

</session_rules>
EOF
