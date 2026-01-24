#!/bin/bash
# Delegation evaluation hook - forces explicit check and user explanation

cat << 'EOF'
<delegation_check mandatory="true">

⚠️ OUTPUT THIS EVALUATION before taking action. Follow DGE: Decide → Gather → Execute.

<skills_check>
## Skills (from Task tool "Available skills:" section)
[Scan available skills - fill table with 2-5 candidates]

| Skill | Trigger Match? | Action |
|-------|----------------|--------|
| ... | Yes/No | ... |

**1% Rule:** Even 1% chance skill applies? → INVOKE `Skill("name")` immediately
</skills_check>

<agents_check>
## Agents (follow Decision Tree)
[Fill table with 2-5 agent candidates]

### Decision Tree Evaluation
1. **Context Check:** Is answer in conversation? Did user provide spec?
2. **Complexity:** How many unknowns? (0=direct, 1=tool, 2-3=agent, 3+=parallel)
3. **Necessity:** Can ONE direct tool call solve this?
4. **Value:** Does agent add autonomous decision-making?

| Agent | Passes Tree? | Justification |
|-------|--------------|---------------|
| ... | Yes/No | ... |
</agents_check>

<action_decision>
## Decision
- [ ] Skill: `Skill("X")` → then execute myself
- [ ] Agent: `Task(subagent_type="X")` → delegate
- [ ] Direct: Execute with tools myself

**DGE:** State commitment → Gather (max 3 reads) → Execute immediately
</action_decision>

</delegation_check>
EOF
