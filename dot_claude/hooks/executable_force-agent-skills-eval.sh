#!/bin/bash
# Delegation evaluation hook - forces explicit check and user explanation

cat << 'EOF'
<delegation_check mandatory="true">

<skills_check>
## Skills (from Task tool "Available skills:" section)
[List 2-5 skill candidates - check if ANY can be triggered]

| Skill | Trigger Match? | Action |
|-------|----------------|--------|
| [name] | Yes/No | `Skill("name")` if Yes |

**Rule:** 1% match → INVOKE immediately before any other action
</skills_check>

<agents_check>
## Agents (follow Decision Tree)
[List 2-5 agent candidates with brief justification]

### Decision Tree Evaluation
1. **Context Check:** Is answer in conversation? Did user provide spec?
2. **Complexity:** How many unknowns? (0=direct, 1=tool, 2-3=agent, 3+=parallel)
3. **Necessity:** Can ONE direct tool call solve this?
4. **Value:** Does agent add autonomous decision-making?

| Agent | Passes Tree? | Justification |
|-------|--------------|---------------|
| [name] | Yes/No | [reason] |
</agents_check>

<action_decision>
## Decision
- [ ] Skill: `Skill("X")` → then execute myself
- [ ] Agent: `Task(subagent_type="X")` → delegate
- [ ] Direct: Execute with tools myself
</action_decision>

</delegation_check>
EOF
