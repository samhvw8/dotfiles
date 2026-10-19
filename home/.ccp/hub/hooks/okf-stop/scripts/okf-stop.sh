#!/bin/bash
# okf-stop — Stop hook. Companion to okf-docs: that one points at the bundle when a
# session starts; this one catches work that changed a repo with a bundle without
# touching the bundle, however the session got there (cd, absolute paths, Bash edits).
#
# A repo is checked when the session touched it: the cwd's repo, plus any path in a
# tool call's file_path, path or Bash command. A change counts only when its time
# (a file's mtime, a deleted file's folder mtime, a commit's time) falls inside one of
# this session's tool calls on that repo: from the call to its result, or to now for a
# background call. The cwd's repo takes every call, since relative paths name no repo.
# So a repo another session or process changes while this one is idle or only read it
# is not this session's change. If a repo with .okf/ has counted changes outside .okf/
# and none inside, block the stop once per repo per session with a pointer to the okf
# skill. Like okf-docs, it carries no OKF rules: the skill is the source of truth.

command -v jq >/dev/null 2>&1 || exit 0

# One jq call for all four input fields, one per line.
{ read -r active; read -r session; read -r transcript; read -r cwd; } < <(
  jq -r '(.stop_hook_active // false), (.session_id // ""), (.transcript_path // ""), (.cwd // "")' 2>/dev/null)
[ "$active" = "true" ] && exit 0
[ -z "$session" ] && exit 0

state="${TMPDIR:-/tmp}/okf-stop/$session"
mkdir -p "$state" 2>/dev/null || exit 0

now=$(date +%s)

# Session start: the transcript's first timestamp, as written and as epoch seconds.
since=""
since_epoch=0
if [ -f "$transcript" ]; then
  { read -r since; read -r since_epoch; } < <(
    jq -rn 'first(inputs | .timestamp // empty) | ., (sub("\\.[0-9]+"; "") | fromdateiso8601)' \
      "$transcript" 2>/dev/null)
  case $since_epoch in ''|*[!0-9]*) since_epoch=0 ;; esac
fi

# This session's tool calls, one "<start> <end> <path>" per path a call names, plus
# "<start> <end> ." per call for the cwd's repo. No transcript: the cwd, any time.
if [ -f "$transcript" ]; then
  jq -rn --argjson now "$now" '
    def ep: if type == "string" then (try (sub("\\.[0-9]+"; "") | fromdateiso8601) catch null) else null end;
    reduce inputs as $e ({u: [], r: {}};
      if $e.type == "assistant" then
        .u += [$e.message.content[]? | select(.type == "tool_use")
               | {id, s: ($e.timestamp | ep), bg: (.input.run_in_background == true),
                  x: ([.input | (.file_path // empty), (.path // empty), (.command // empty)]
                      | map(strings) | join(" "))}]
      elif $e.type == "user" and ($e.message.content | type) == "array" then
        .r += ([$e.message.content[] | select(.type == "tool_result")
                | {key: .tool_use_id, value: ($e.timestamp | ep)}] | from_entries)
      else . end)
    | .r as $r | .u[] | select(.s != null)
    | "\(.s) \(if .bg then $now else ($r[.id] // $now) end)" as $w
    | "\($w) .", (.x | scan("(?:~|\\$HOME|/)[A-Za-z0-9._@+/-]+") | "\($w) \(.)")' \
    "$transcript" 2>/dev/null \
    | sed -e "s| ~| $HOME|" -e "s| \$HOME| $HOME|" > "$state/calls"
else
  printf '0 %s .\n' "$now" > "$state/calls"
fi

# Modification times, one "<epoch> <path>" per line, for NUL-separated paths on stdin.
if stat -c %Y / >/dev/null 2>&1; then mtimes() { xargs -0 stat -c '%Y %n' 2>/dev/null; }
else mtimes() { xargs -0 stat -f '%m %N' 2>/dev/null; }
fi

# Uncommitted paths in repo $1 changed since the session started, as "<epoch> <path>".
session_changes() {
  ( cd "$1" || exit 0
    # -z leaves names unquoted; a rename's second entry is its old name,
    # which no longer exists, so the rename counts when its folder changed.
    git status --porcelain -uall -z 2>/dev/null | tr '\0' '\n' \
      | awk 'skip { skip = 0; print; next } /^[RC]/ { skip = 1 } length($0) > 3 { print substr($0, 4) }' \
      > "$state/files"
    # Each file is checked by its own time, or a deleted one by its folder's. Batched:
    # a stat per file is too slow for a repo with thousands of untracked files.
    tr '\n' '\0' < "$state/files" | mtimes > "$state/stat"
    awk 'FILENAME == ARGV[1] { sub(/^[0-9]+ /, ""); seen[$0] = 1; next }
         !($0 in seen) { d = $0; if (!sub(/\/[^\/]*$/, "", d)) d = "."; print d }' \
      "$state/stat" "$state/files" | sort -u | tr '\n' '\0' | mtimes > "$state/dirstat"
    awk -v t="$since_epoch" '
      FILENAME == ARGV[1] { m = $1; sub(/^[0-9]+ /, ""); file[$0] = m; next }
      FILENAME == ARGV[2] { m = $1; sub(/^[0-9]+ /, ""); dir[$0] = m; next }
      $0 in file { if (file[$0] >= t) print file[$0], $0; next }
      { d = $0; if (!sub(/\/[^\/]*$/, "", d)) d = "."; if (dir[d] >= t) print dir[d], $0 }' \
      "$state/stat" "$state/dirstat" "$state/files"
    rm -f "$state/files" "$state/stat" "$state/dirstat" )
}

# The git root with a bundle that holds path $1, or nothing. The repo root is the
# nearest folder up with a .git; a git call per folder is slow.
bundle_root() {
  local d="$1"
  while [ ! -d "$d" ] && [ "$d" != "/" ]; do d="${d%/*}"; [ -n "$d" ] || d="/"; done
  [ "$d" = "/" ] && return
  local r
  r=$(cd -P "$d" 2>/dev/null && while [ ! -e .git ]; do up=$PWD; cd -P ..; [ "$PWD" = "$up" ] && exit 1; done; pwd -P) || return
  [ -d "$r/.okf" ] && printf '%s\n' "$r"
}

# Map each named path to its bundle root, once per folder ("." is the cwd).
cwd_root=""
[ -n "$cwd" ] && cwd_root=$(bundle_root "$cwd")
: > "$state/roots"
seen=$'\n'
while IFS= read -r p; do
  [ -z "$p" ] && continue
  d="$p"; [ -d "$d" ] || d="${d%/*}"
  case $seen in *$'\n'"$d"$'\n'*) continue ;; esac
  seen="$seen$d"$'\n'
  r=$(bundle_root "$d")
  [ -n "$r" ] && printf '%s\t%s\n' "$d" "$r" >> "$state/roots"
done < <(cut -d' ' -f3- "$state/calls" | grep -vx '\.' | sort -u)

# Windows per root, "<root>\t<start>\t<end>", from each call that names the root.
awk -v cwd="$cwd_root" '
  FILENAME == ARGV[1] { split($0, a, "\t"); root[a[1]] = a[2]; next }
  { s = $1; e = $2; p = $0; sub(/^[0-9]+ [0-9]+ /, "", p)
    if (p == ".") { if (cwd != "") print cwd "\t" s "\t" e; next }
    d = p; if (!(d in root)) sub(/\/[^\/]*$/, "", d)
    if (d in root) print root[d] "\t" s "\t" e }' \
  "$state/roots" "$state/calls" | sort -u > "$state/windows"
roots=$(cut -f1 "$state/windows" | sort -u)

report=""
while IFS= read -r r; do
  [ -z "$r" ] && continue
  marker="$state/$(printf '%s' "$r" | shasum | cut -c1-16)"
  [ -e "$marker" ] && continue
  # Keep a change only if its time falls in a window of this root (2s for rounding).
  changed=$( {
    session_changes "$r"
    [ -n "$since" ] && git -C "$r" log --since="$since" --name-only --format=format:%x01%ct 2>/dev/null \
      | awk 'index($0, "\001") == 1 { t = substr($0, 2); next } NF { print t, $0 }'
  } | awk -v r="$r" '
      FILENAME == ARGV[1] { split($0, a, "\t"); if (a[1] == r) { n++; s[n] = a[2]; e[n] = a[3] }; next }
      { m = $1; p = $0; sub(/^[0-9]+ /, "", p)
        for (i = 1; i <= n; i++) if (m >= s[i] - 2 && m <= e[i] + 2) { print p; next } }' \
      "$state/windows" - \
    | grep -v '^$' \
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
