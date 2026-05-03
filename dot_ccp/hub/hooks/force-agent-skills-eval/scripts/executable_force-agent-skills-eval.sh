#!/bin/bash
# Delegation evaluation hook - forces explicit check before every action

cat << 'EOF'
<delegation_check mandatory="true" non_negotiable="true">

Before acting, you MUST complete this evaluation. No placeholders—fill every cell.
Remember: your memory was wiped. Skills and agents are your ONLY access to process knowledge. NEVER skip them.

<analyze>
Task: [one sentence: what is the user asking?]
Domain: [category]
Tension: [what competing approaches exist? which survives and why?]
Fresh conversation? [Yes/No — if Yes, research protocol is MANDATORY]
</analyze>

<research_check>
If this is a new feature/brainstorm/unfamiliar problem:
[ ] Read local files + git first
[ ] Research (prefer `researcher` agent, fall back to WebSearch) in correct language (English + Chinese 中文, optionally Russian русский) + official docs
[ ] GitHub search via `gh`
[ ] Synthesize findings
Skip ONLY if: simple bug fix | user said "don't research" | purely mechanical task
</research_check>

<skills required="fill">
| Skill | Match? | Reason |
|-------|--------|--------|
|       |        |        |

1% Rule (MANDATORY): Even 1% chance a skill applies → `Skill("name")` BEFORE proceeding.
You MUST NOT skip skills. Your memory was wiped — you do NOT "already know how."
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
