#!/bin/bash
# Memory save hook — Stop event
# Reminds Claude to save important observations from this turn
# Output: stdout text injected as context for continuation

cat <<'EOF'
<memory_save_protocol mandatory="true">

Before finishing, review this turn for observations worth persisting. Use `mcp__agentmemory__memory_save` for ANY of:

| What to save | type | Example concepts |
|-------------|------|-----------------|
| Decisions made and reasoning | architecture | "chose X over Y because..." |
| Bugs found and root causes | bug | "null ref in auth, caused by..." |
| Code patterns discovered | pattern | "project uses repository pattern" |
| User preferences learned | preference | "prefers tabs, dislikes comments" |
| Workflow insights | workflow | "deploy via gh actions, not manual" |
| Facts about the codebase | fact | "main entry is src/index.ts" |

**Rules:**
- Save ONLY genuinely useful observations (not trivial actions like "read a file")
- Include relevant `files` paths and `concepts` keywords for future recall
- If nothing noteworthy happened this turn, skip saving — do NOT force it
- Max 3 saves per turn to avoid noise

</memory_save_protocol>
EOF
