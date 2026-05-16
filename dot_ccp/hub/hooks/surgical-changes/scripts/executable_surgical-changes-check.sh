#!/bin/bash
# Surgical changes enforcement — PostToolUse (Write|Edit)
# Reminds about diff discipline after every code edit

INPUT_JSON=$(cat)

FILE_PATH=$(echo "$INPUT_JSON" | python3 -c "
import sys, json
data = json.load(sys.stdin)
ti = data.get('tool_input', data)
print(ti.get('file_path', ti.get('filePath', ti.get('path', ''))))
" 2>/dev/null)

# Skip non-code files and hook scripts themselves
case "$FILE_PATH" in
  *.md) exit 0 ;;
  */hooks/*)  exit 0 ;;
  "") exit 0 ;;
esac

cat <<'EOF'
<surgical_change_reminder>
Diff discipline — verify every changed line:
- Does this line trace to the user's request?
- Did you change formatting/style you weren't asked to?
- Did you add error handling for impossible cases?
- Did you "improve" code adjacent to your change?
If any answer is wrong → revert that part.
</surgical_change_reminder>
EOF
