#!/bin/bash
# Delegation evaluation hook - forces agent/skill check before manual work

cat << 'EOF'
<delegation_protocol>
PRIORITY: Task(subagent_type="agent") → Skill("skill") → Manual

<evaluate>
1. Scan subagent_types → Match? Task(subagent_type="name", prompt="...")
2. Scan <available_skills> → Match? Skill("name")
3. No match → general-purpose agent OR manual
</evaluate>

<rules>
- Max 3 concurrent agents (batch if more)
- Independent tasks only (no cross-dependencies)
- Sub-agents: "Check <available_skills>, use Skill tool if match"
</rules>
</delegation_protocol>
EOF