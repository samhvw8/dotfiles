#!/bin/bash
# Documentation rules enforcement — Stop event
# Reminds about doc conventions at end of turn if .md files may have been touched

cat <<'EOF'
<doc_rules_check>

If you wrote or edited any .md files this turn, verify compliance:

| Rule | Check |
|------|-------|
| One heading per file | File name IS the heading (kebab-case) |
| Max 100 lines | Split longer content into separate files |
| Nested folders | Sub-sections become subdirectories |
| Cross-links | Add `## Related` section with links |
| Kebab-case names | No numbers in file names |
| Tables over prose | Prefer tables and code blocks |
| No monolithic docs | Split at logical section boundaries |

If no .md files were touched, ignore this.

</doc_rules_check>
EOF
