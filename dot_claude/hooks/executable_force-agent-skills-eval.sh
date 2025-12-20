#!/bin/bash
# Delegation evaluation hook - forces explicit check and user explanation

cat << 'EOF'
<delegation_protocol mandatory="true">

**MANDATORY: Show delegation evaluation to user BEFORE any action.**

<required_output>
## Delegation Check
| Type | Scanned | Best Match | Action |
|------|---------|------------|--------|
| Agents | [list top 2-3 candidates] | [name] or NONE | `Task(subagent_type="X")` = DELEGATE |
| Skills | [list top 2-3 candidates] | [name] or NONE | `Skill("X")` = GET CONTEXT, then YOU execute |

**Decision:** `[Tool call]` — [why this choice fits]
</required_output>

<critical_distinction>
## Agents (Task tool) = DELEGATION
- Agent does the work autonomously
- You hand off completely

## Skills (Skill tool) = CONTEXT ENHANCEMENT
- Skills give YOU instructions/workflow
- YOU still do the work yourself
- Skills are NOT delegation!
</critical_distinction>

<rules>
- NEVER skip showing evaluation table
- Agent match → DELEGATE via Task tool
- Skill match (no agent) → Invoke Skill for context, then YOU execute manually
- Manual ONLY if no agent AND no skill, must justify
- Max 3 concurrent agents | Independent tasks
- **IMPORTANT**: When delegating to agent, pass relevant skills in prompt:
  "RECOMMENDED SKILLS: [skill-name] - [when to use]. Use Skill tool for guidance."
- **CRITICAL - SKILL INVOCATION IS MANDATORY**: When a skill matches your context, you MUST invoke it via `Skill("skill-name")`. You MAY gather context first (git status, file reads, etc.), but you CANNOT skip the skill invocation before executing. The workflow is: Delegation Check → Gather Info (optional) → Invoke Skill → Execute with guidance.
</rules>

</delegation_protocol>
EOF