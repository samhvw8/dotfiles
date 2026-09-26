#!/bin/bash
# okf-stop — Stop hook. Companion to okf-docs: that one points at the bundle when a
# session starts; this one catches work that changed a repo with a bundle without
# touching the bundle, however the session got there (cd, absolute paths, Bash edits).
#
# A repo is checked when the session touched it: the cwd's repo, plus any path in a
# tool call's file_path or Bash command. "Changed" is uncommitted changes plus commits
# made since the session started. If a repo with .okf/ has changes outside .okf/ and
# none inside, block the stop once per repo per session with a pointer to the okf
# skill. Like okf-docs, it carries no OKF rules: the skill is the source of truth.

input=$(cat)
command -v jq >/dev/null 2>&1 || exit 0

[ "$(printf '%s' "$input" | jq -r '.stop_hook_active // false')" = "true" ] && exit 0
session=$(printf '%s' "$input" | jq -r '.session_id // empty')
transcript=$(printf '%s' "$input" | jq -r '.transcript_path // empty')
cwd=$(printf '%s' "$input" | jq -r '.cwd // empty')
[ -z "$session" ] && exit 0

state="${TMPDIR:-/tmp}/okf-stop/$session"
mkdir -p "$state" 2>/dev/null || exit 0

# Candidate paths: cwd, plus paths named in this session's tool calls.
paths=$( {
  [ -n "$cwd" ] && printf '%s\n' "$cwd"
  if [ -f "$transcript" ]; then
    jq -r 'select(.type=="assistant") | .message.content[]?
           | select(.type=="tool_use") | .input
           | (.file_path // empty), (.path // empty), (.command // empty)' "$transcript" 2>/dev/null \
      | grep -oE '(~|\$HOME|/)[A-Za-z0-9._@+/-]+' \
      | sed -e "s|^~|$HOME|" -e "s|^\$HOME|$HOME|"
  fi
} | sort -u )

since=""
[ -f "$transcript" ] && since=$(jq -r '.timestamp // empty' "$transcript" 2>/dev/null | head -n 1)

# Resolve each path to a git root that has a bundle, once per root.
roots=""
while IFS= read -r p; do
  [ -z "$p" ] && continue
  d="$p"
  while [ ! -d "$d" ] && [ "$d" != "/" ]; do d=$(dirname "$d"); done
  [ "$d" = "/" ] && continue
  r=$(git -C "$d" rev-parse --show-toplevel 2>/dev/null) || continue
  [ -d "$r/.okf" ] || continue
  case $'\n'"$roots"$'\n' in *$'\n'"$r"$'\n'*) ;; *) roots="$roots"$'\n'"$r" ;; esac
done <<< "$paths"

report=""
while IFS= read -r r; do
  [ -z "$r" ] && continue
  marker="$state/$(printf '%s' "$r" | shasum | cut -c1-16)"
  [ -e "$marker" ] && continue
  changed=$( {
    git -C "$r" status --porcelain -uall 2>/dev/null | cut -c4- | sed 's/.* -> //'
    [ -n "$since" ] && git -C "$r" log --since="$since" --name-only --format= 2>/dev/null
  } | grep -v '^$' \
    | grep -vE '(^|/)(CLAUDE|SKILL|AGENTS|README|CHANGELOG)\.md$|(^|/)rules/[^/]+\.md$|(^|/)\.claude/' \
    | sort -u )
  [ -z "$changed" ] && continue
  printf '%s\n' "$changed" | grep -q '^\.okf/' && continue
  touch "$marker"
  files=$(printf '%s\n' "$changed" | head -n 10 | sed 's/^/  - /')
  more=$(( $(printf '%s\n' "$changed" | wc -l) - 10 ))
  [ "$more" -gt 0 ] && files="$files"$'\n'"  - … and $more more"
  report="$report"$'\n'"$r/.okf — changed this session, bundle untouched:"$'\n'"$files"
done <<< "$roots"

[ -z "$report" ] && exit 0

reason="OKF check before stopping:$report

If these changes affect anything the bundle describes, load the \`okf\` skill, update the affected concepts and log.md, and run the validator. If they don't, say so in one line and stop. This check runs once per repo per session."

jq -n --arg r "$reason" '{decision: "block", reason: $r}'
