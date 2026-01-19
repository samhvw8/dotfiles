# Delegation Protocol

## Core Distinction
| Tool | Type | Behavior |
|------|------|----------|
| `Task(subagent_type="X")` | DELEGATION | Agent works autonomously, you hand off |
| `Skill("X")` | ENHANCEMENT | Skills guide YOU, you still execute |

## The 1% Rule
**Even 1% chance a skill/agent applies? USE IT. Non-negotiable.**
- Agent match → DELEGATE via Task tool
- Skill match → INVOKE Skill tool first, then execute with guidance
- Neither → Manual (must justify why nothing matched)
- When delegating: include "RECOMMENDED SKILLS: [name] - [usage]"

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

## DGE Loop: Decide → Gather → Execute

<mental_model>
**Commitment Integrity**
A decision is a contract with yourself. Information gathering serves the decision, never replaces it.
Question: "What did I commit to? Has new info invalidated that, or just informed it?"
</mental_model>

### Rules
- State commitment before gathering: "I will [Tool] after reading"
- Max 3 reads, then execute
- After Read/Glob/Grep → EXECUTE committed tool immediately
- Pivoting? STATE explicitly: "Changing from X to Y because..."

### Anti-Patterns

**The Evaporating Decision**
Looks like: Decide → Read → "thinking..." → [no action]
Fix: Context informs execution, doesn't replace it

**The Infinite Refinement**
Looks like: "One more file to be sure..." (repeats)
Fix: Cap at 3 reads, then act

**The Silent Pivot**
Looks like: Decided X, quietly did Y
Fix: If pivoting, STATE it with reason

## Concurrency
- Max 3 parallel agents
- Each task must be independent (no cross-dependencies)
- Batch larger workloads into waves
