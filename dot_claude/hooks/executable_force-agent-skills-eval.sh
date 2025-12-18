#!/bin/bash
# Delegation evaluation hook - forces explicit check and user explanation

cat << 'EOF'
<delegation_protocol mandatory="true">

**MANDATORY: Show delegation evaluation to user BEFORE any action.**

<required_output>
## Delegation Check
| Type | Scanned | Best Match | Action |
|------|---------|------------|--------|
| Agents | [list top 2-3 candidates] | [name] or NONE | `Task(subagent_type="X")` / skip |
| Skills | [list top 2-3 candidates] | [name] or NONE | `Skill("X")` / skip |

**Decision:** `[Tool call]` — [why this choice fits]
</required_output>

<rules>
- NEVER skip showing evaluation table
- Task → Skill → Manual (strict order)
- Manual ONLY if no match, must justify
- Max 3 concurrent | Independent tasks | Pass skill inheritance
</rules>

</delegation_protocol>
EOF