#!/bin/bash
# cost-remind — UserPromptSubmit
# Keeps the CLAUDE.md cost rule next to each decision. One plain sentence:
# numbered gates here get recited back as ceremony.
cat >/dev/null
printf '{"hookSpecificOutput":{"hookEventName":"UserPromptSubmit","additionalContext":"Plans that add anything end with a \\"Runs:\\" line. Build effort is never a reason."}}\n'
