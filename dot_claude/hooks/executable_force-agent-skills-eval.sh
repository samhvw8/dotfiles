#!/bin/bash
# Delegation evaluation hook - forces explicit check and user explanation

cat << 'EOF'
<delegation_check>
## Matches
## Agents
[List 2-5 agent candidates with brief justification]

## Skills
[List 2-5 skill candidates with brief justification]

## Quick Reference
| Type | Rule | Action |
|------|------|--------|
| Skill | 1% match → INVOKE | `Skill("X")` → then execute |
| Agent | Pass decision tree first | `Task(subagent_type="X")` |

**Agent Decision Tree:** Context check → Complexity (unknowns) → Necessity (1 tool?) → Value test
*(Full rules in session_rules)*
</delegation_check>
EOF
