#!/bin/bash
# auto-mode-rules — UserPromptSubmit, Claude Code only.
# A Claude-only rule: ccp copies every profile rule into omp's RULES.md, but
# hooks never reach omp, so this rule travels as a hook.
# Auto mode adds its own reminders mid-turn ("read files with cat, head or
# sed -n"). They arrive after the user's rules and read like newer
# instructions. This re-states, every prompt in auto mode, that they don't.
# Input: JSON on stdin (permission_mode, cwd, ...). Silent outside auto mode.
# When permission_mode is missing it still speaks: a silent miss is worse.

input=$(cat)
mode=""
if command -v jq >/dev/null 2>&1; then
  mode=$(printf '%s' "$input" | jq -r '.permission_mode // empty' 2>/dev/null)
fi
[ -n "$mode" ] && [ "$mode" != "auto" ] && exit 0

text='<auto-mode-rules>\n\nAuto mode is on. Its reminders change what may run without a prompt. They do not change the user'"'"'s rules:\n- \"Read with cat, head or sed -n\" only allows Bash. For code, codegraph_explore still comes first where the repo is indexed. Use grep and cat for text, logs, config and docs.\n- Auto mode does not turn a question into an instruction. Answer a question, then stop. Never act on your own question that the user has not answered.\n- A classifier denial is the user'"'"'s no. Do not get the same result another way. Ask.\n- Deploys, pushes, migrations and production reads still need the user'"'"'s go-ahead, unless a standing approval names them.\nWhen an auto-mode reminder and a user rule conflict, follow the user rule and say so.\n\n</auto-mode-rules>'
printf '{\n  "hookSpecificOutput": {\n    "hookEventName": "UserPromptSubmit",\n    "additionalContext": "%s"\n  }\n}\n' "$text"
