#!/bin/bash
# okf-stop — Stop hook. Companion to okf-docs: that one points at the bundle when a
# session starts; this one catches work that changed a repo with a bundle without
# touching the bundle, however the session got there (cd, absolute paths, Bash edits).
#
# A repo is checked when the session touched it: the cwd's repo, plus any path in a
# tool call's file_path or Bash command. "Changed" is commits made since the session
# started, plus uncommitted files modified since then: work left uncommitted by an
# earlier session, or a repo this one only read, is not this session's change (a
# deleted file counts when its folder changed since then). If a repo with .okf/ has
# changes outside .okf/ and none inside, block the stop once per repo per session with
# a pointer to the okf skill. Like okf-docs, it carries no OKF rules: the skill is the source of truth.

command -v jq >/dev/null 2>&1 || exit 0

# One jq call for all four input fields, one per line.
{ read -r active; read -r session; read -r transcript; read -r cwd; } < <(
  jq -r '(.stop_hook_active // false), (.session_id // ""), (.transcript_path // ""), (.cwd // "")' 2>/dev/null)
[ "$active" = "true" ] && exit 0
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

# Session start: the transcript's first timestamp, as written and as epoch seconds.
since=""
since_epoch=0
if [ -f "$transcript" ]; then
  { read -r since; read -r since_epoch; } < <(
    jq -rn 'first(inputs | .timestamp // empty) | ., (sub("\\.[0-9]+"; "") | fromdateiso8601)' \
      "$transcript" 2>/dev/null)
  case $since_epoch in ''|*[!0-9]*) since_epoch=0 ;; esac
fi

# Modification times, one "<epoch> <path>" per line, for NUL-separated paths on stdin.
if stat -c %Y / >/dev/null 2>&1; then mtimes() { xargs -0 stat -c '%Y %n' 2>/dev/null; }
else mtimes() { xargs -0 stat -f '%m %N' 2>/dev/null; }
fi

# Uncommitted paths in repo $1 that changed since the session started.
session_changes() {
  ( cd "$1" || exit 0
    # -z leaves names unquoted; a rename's second entry is its old name,
    # which no longer exists, so the rename counts when its folder changed.
    git status --porcelain -uall -z 2>/dev/null | tr '\0' '\n' \
      | awk 'skip { skip = 0; print; next } /^[RC]/ { skip = 1 } length($0) > 3 { print substr($0, 4) }' \
      > "$state/files"
    [ "$since_epoch" -gt 0 ] || { cat "$state/files"; exit 0; }
    # Each file is checked by its own time, or a deleted one by its folder's. Batched:
    # a stat per file is too slow for a repo with thousands of untracked files.
    tr '\n' '\0' < "$state/files" | mtimes > "$state/stat"
    awk 'FILENAME == ARGV[1] { sub(/^[0-9]+ /, ""); seen[$0] = 1; next }
         !($0 in seen) { d = $0; if (!sub(/\/[^\/]*$/, "", d)) d = "."; print d }' \
      "$state/stat" "$state/files" | sort -u | tr '\n' '\0' | mtimes > "$state/dirstat"
    awk -v t="$since_epoch" '
      FILENAME == ARGV[1] { m = $1; sub(/^[0-9]+ /, ""); file[$0] = m; next }
      FILENAME == ARGV[2] { m = $1; sub(/^[0-9]+ /, ""); dir[$0] = m; next }
      $0 in file { if (file[$0] >= t) print; next }
      { d = $0; if (!sub(/\/[^\/]*$/, "", d)) d = "."; if (dir[d] >= t) print }' \
      "$state/stat" "$state/dirstat" "$state/files"
    rm -f "$state/files" "$state/stat" "$state/dirstat" )
}

# Resolve each path to a git root that has a bundle, once per root.
roots=""
seen=$'\n'
while IFS= read -r p; do
  [ -z "$p" ] && continue
  d="$p"
  while [ ! -d "$d" ] && [ "$d" != "/" ]; do d="${d%/*}"; [ -n "$d" ] || d="/"; done
  [ "$d" = "/" ] && continue
  # Many paths share a folder: resolve it once.
  case $seen in *$'\n'"$d"$'\n'*) continue ;; esac
  seen="$seen$d"$'\n'
  # The repo root is the nearest folder up with a .git; a git call per folder is slow.
  r=$(cd -P "$d" 2>/dev/null && while [ ! -e .git ]; do up=$PWD; cd -P ..; [ "$PWD" = "$up" ] && exit 1; done; pwd -P) || continue
  [ -d "$r/.okf" ] || continue
  case $'\n'"$roots"$'\n' in *$'\n'"$r"$'\n'*) ;; *) roots="$roots"$'\n'"$r" ;; esac
done <<< "$paths"

report=""
while IFS= read -r r; do
  [ -z "$r" ] && continue
  marker="$state/$(printf '%s' "$r" | shasum | cut -c1-16)"
  [ -e "$marker" ] && continue
  changed=$( {
    session_changes "$r"
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
