#!/bin/bash
# Delegation evaluation hook - forces explicit check and user explanation

cat << 'EOF'
<delegation_check mandatory="true" non_negotiable="true">

Before acting, you MUST complete this evaluation. No placeholders—fill every cell.

<analyze>
Task: [one sentence: what is the user asking?]
Domain: [category]
Tension: [what competing approaches exist? which survives and why?]
</analyze>

<skills required="fill">
| Skill | Match? | Reason |
|-------|--------|--------|
|       |        |        |

1% Rule: Any chance a skill applies → `Skill("name")` before proceeding.
</skills>

<agents required="fill">
| Agent | Use? | Decision Tree Result |
|-------|------|----------------------|
|       |      |                      |

Tree: (1) Answer in context? → use it. (2) Unknowns: 0=direct, 1=tool, 2+=agent. (3) ONE tool call solves it? → don't delegate. (4) Agent adds autonomy? → delegate.
</agents>

<decision>
[ ] `Skill("___")` → then execute
[ ] `Task(subagent_type="___")` → delegate
[ ] Direct execution (justify: ___)
</decision>

<commit>
"I will ___ using ___" → Gather (≤3 reads) → Execute immediately.
</commit>

</delegation_check>
EOF
