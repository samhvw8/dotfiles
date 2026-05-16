#!/bin/bash
# Documentation rules enforcement — UserPromptSubmit event

cat <<'ENDJSON'
{
  "hookSpecificOutput": {
    "hookEventName": "UserPromptSubmit",
    "additionalContext": "<doc_rules_check>\n\nIf you write or edit any .md files this turn, verify compliance:\n\n| Rule | Check |\n|------|-------|\n| One heading per file | File name IS the heading (kebab-case) |\n| Max 100 lines | Split longer content into separate files |\n| Nested folders | Sub-sections become subdirectories |\n| Cross-links | Add `## Related` section with links |\n| Kebab-case names | No numbers in file names |\n| Tables over prose | Prefer tables and code blocks |\n| No monolithic docs | Split at logical section boundaries |\n\nIf no .md files are touched, ignore this.\n\n</doc_rules_check>"
  }
}
ENDJSON
