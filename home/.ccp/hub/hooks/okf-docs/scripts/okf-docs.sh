#!/bin/bash
# okf-docs — SessionStart hook. Project documentation is OKF (Open Knowledge Format).
# Input: JSON on stdin (cwd, source, ...). Output: plain stdout, added as context.
#
# Carries NO OKF rules on purpose: the `okf` skill and the spec it bundles are the
# single source of truth, so this hook cannot drift from the spec. It only decides
# which pointer the model gets:
#   1. .okf/ found from cwd up to the git root -> bundle path + its root index.md
#   2. no bundle                               -> write docs as OKF via the skill
#
# The walk stops at the git root (non-repo: cwd only), so a personal ~/.okf never
# masquerades as project documentation.

input=$(cat)

cwd=""
if command -v jq >/dev/null 2>&1; then
  cwd=$(printf '%s' "$input" | jq -r '.cwd // empty' 2>/dev/null)
fi
[ -z "$cwd" ] && cwd="$PWD"
# Resolve symlinks (macOS /tmp -> /private/tmp) so the walk can meet git's resolved root.
cwd=$(cd "$cwd" 2>/dev/null && pwd -P || printf '%s' "$cwd")

MAX_INDEX_LINES=60

root=$(git -C "$cwd" rev-parse --show-toplevel 2>/dev/null)
[ -z "$root" ] && root="$cwd"

bundle=""
d="$cwd"
while :; do
  if [ -d "$d/.okf" ]; then bundle="$d/.okf"; break; fi
  { [ "$d" = "$root" ] || [ "$d" = "/" ]; } && break
  d=$(dirname "$d")
done

if [ -n "$bundle" ]; then
  cat <<NOTE
<okf_docs>
This project's knowledge lives in an OKF (Open Knowledge Format) bundle: \`$bundle\`
- Before reading, writing or restructuring it, load the \`okf\` skill and follow it. The skill carries the spec: work from it, not from memory of OKF.
- Treat the bundle as the project's documentation: consult it when it bears on the task, and update it in the same change as the code it describes.
NOTE
  index="$bundle/index.md"
  if [ -f "$index" ]; then
    total=$(wc -l < "$index" | tr -d ' ')
    echo "--- $index ---"
    head -n "$MAX_INDEX_LINES" "$index"
    [ "$total" -gt "$MAX_INDEX_LINES" ] && echo "[... $((total - MAX_INDEX_LINES)) more lines, read the file for the rest]"
  else
    echo "(No index.md at the bundle root.)"
  fi
  echo "</okf_docs>"
elif git -C "$cwd" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  # Repo without a bundle yet. Outside a repo there's no project to document: silent.
  cat <<'NOTE'
<okf_docs>
Documentation convention: project knowledge is written as OKF (Open Knowledge Format) bundles. None exists here yet.
- When the task calls for documentation, load the `okf` skill first and follow it. The skill carries the spec: don't write OKF from memory.
- READMEs, changelogs and agent config (CLAUDE.md, SKILL.md, rules) keep their own conventions.
</okf_docs>
NOTE
fi
