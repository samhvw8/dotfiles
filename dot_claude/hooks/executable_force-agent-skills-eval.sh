#!/bin/bash
# UserPromptSubmit hook that forces explicit delegation evaluation

cat << 'EOF'
📋 MANDATORY DELEGATION SEQUENCE

**Execution Priority:**
1. Specialized sub-agent (Task tool) → First choice
2. Skill (Skill tool) → If no specialized agent
3. general-purpose agent OR manual → Last resort

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Step 1 - EVALUATE AGENTS:
Scan available subagent_types. For top matches: [agent] - YES/NO - [reason]

Step 2 - EVALUATE SKILLS (only if no agent fits):
Scan <available_skills>. For top matches: [skill] - YES/NO - [reason]

Step 3 - ACTIVATE:
- Agent YES → Task(subagent_type="agent-name") NOW
  └─ Include in prompt: "Check <available_skills> and use Skill tool for matching tasks"
- Skill YES → Skill("skill-name") NOW
- Neither → general-purpose agent OR manual

Step 4 - IMPLEMENT:
Only after Step 3 is complete, proceed with implementation.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ INDEPENDENCE RULE: Each task MUST be self-contained—no dependencies on concurrent tasks.

🔢 MAX CONCURRENT AGENTS: 3 parallel agents max. If >3 tasks, batch into waves.

⚡ ORCHESTRATE, DON'T IMPLEMENT: Delegate to subagents. Review their work at the end.

🔧 SUB-AGENT SKILL INHERITANCE: When delegating, instruct sub-agents to check <available_skills> and use Skill tool for matching tasks.
EOF