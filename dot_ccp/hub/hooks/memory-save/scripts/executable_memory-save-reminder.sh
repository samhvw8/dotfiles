#!/bin/bash
# Memory save hook — Stop event
# Uses JSON additionalContext so the reminder actually reaches Claude.
# Plain stdout from Stop hooks goes to debug log only — Claude never sees it.

cat <<'ENDJSON'
{
  "hookSpecificOutput": {
    "hookEventName": "Stop",
    "additionalContext": "<memory_save_protocol mandatory=\"true\">\n\nBefore finishing, review this turn for observations worth persisting. Use `mcp__agentmemory__memory_save` for ANY of:\n\n| What to save | type | Example concepts |\n|-------------|------|------------------|\n| Decisions made and reasoning | architecture | \"chose X over Y because...\" |\n| Bugs found and root causes | bug | \"null ref in auth, caused by...\" |\n| Code patterns discovered | pattern | \"project uses repository pattern\" |\n| User preferences learned | preference | \"prefers tabs, dislikes comments\" |\n| Workflow insights | workflow | \"deploy via gh actions, not manual\" |\n| Facts about the codebase | fact | \"main entry is src/index.ts\" |\n\n**Rules:**\n- Save ONLY genuinely useful observations (not trivial actions like \"read a file\")\n- Include relevant `files` paths and `concepts` keywords for future recall\n- If nothing noteworthy happened this turn, skip saving — do NOT force it\n- Max 3 saves per turn to avoid noise\n\n</memory_save_protocol>"
  }
}
ENDJSON
