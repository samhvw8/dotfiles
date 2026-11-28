#!/bin/bash
# verify-stop — Stop hook. Catches code or UI changes made during this session
# that were not followed by a test/verify run (or a visual check for UI files).
# Blocks at most once per change set; allows an explicit `Not tested: ... — risk: ...`
# escape hatch in the last assistant message.

command -v jq >/dev/null 2>&1 || exit 0

input=$(cat)
[ -z "$input" ] && exit 0

{ read -r active; read -r session; read -r transcript; read -r cwd; } < <(
  printf '%s' "$input" | jq -r '(.stop_hook_active // false), (.session_id // ""), (.transcript_path // ""), (.cwd // "")' 2>/dev/null)
[ "$active" = "true" ] && exit 0
[ -z "$session" ] && exit 0

# Run once per session: a project that ships its own copy of this hook in
# .claude/hooks/ runs that copy, and the user-level copy steps aside.
proj="${CLAUDE_PROJECT_DIR:-$(git -C "${cwd:-.}" rev-parse --show-toplevel 2>/dev/null)}"
own="$proj/.claude/hooks/$(basename "$0")"
if [ -n "$proj" ] && [ -f "$own" ] &&
  [ "$(cd "$(dirname "$own")" && pwd -P)" != "$(cd "$(dirname "$0")" && pwd -P)" ]; then
  exit 0
fi

# Escape hatch: allow stop when the last assistant message explicitly states
# `Not tested: <why> — risk: <what could break>` (em-dash or hyphen).
last_msg=$(printf '%s' "$input" | jq -r '.last_assistant_message // ""' 2>/dev/null)
if [ -z "$last_msg" ] && [ -f "$transcript" ]; then
  last_msg=$(jq -rs '
    [ .[] | select(.type == "assistant")
      | (.message.content | if type == "string" then .
         elif type == "array" then ([.[] | select(.type == "text") | .text // ""] | join("\n"))
         else "" end)
      | select(length > 0) ] | last // ""' "$transcript" 2>/dev/null)
fi
if printf '%s' "$last_msg" | grep -qE 'Not tested:.*(—|--|-)[[:space:]]*risk:'; then
  exit 0
fi

state="${TMPDIR:-/tmp}/verify-stop/$session"
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

# Extract tool-call windows ("<start> <end> <path>") plus the latest verify and
# UI-verify completion timestamps from the transcript.
last_verify=0
last_ui_verify=0
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

  { read -r last_verify; read -r last_ui_verify; } < <(
    jq -rn '
      def ep: if type == "string" then (try (sub("\\.[0-9]+"; "") | fromdateiso8601) catch null) else null end;
      def is_ui($n; $c):
        ($n | test("bsk|cua|browser|playwright|playwriter|screenshot"; "i")) or
        ($c | test("(^|[^a-zA-Z0-9])(bsk|cua|browser|playwright|playwriter|screenshot)([^a-zA-Z0-9]|$)"; "i"));
      def is_verify($n; $c):
        is_ui($n; $c) or
        ($n | test("bombadil"; "i")) or
        ($c | test("(^|[^a-zA-Z0-9_])(test|pytest|vitest|jest|verify|check|build|bombadil|tsc|mypy|pyright|eslint|ruff|clippy)([^a-zA-Z0-9_]|$)|cargo[[:space:]]+test|go[[:space:]]+test|mise[[:space:]]+run"; "i"));
      reduce inputs as $e ({u: [], r: {}};
        if $e.type == "assistant" then
          .u += [$e.message.content[]? | select(.type == "tool_use")
                 | {id, s: ($e.timestamp | ep),
                    n: (.name // ""),
                    c: ([.input | (.command // empty), (.code // empty)] | map(strings) | join(" "))}]
        elif $e.type == "user" and ($e.message.content | type) == "array" then
          .r += ([$e.message.content[] | select(.type == "tool_result")
                  | {key: .tool_use_id, value: ($e.timestamp | ep)}] | from_entries)
        else . end)
      | .r as $r
      | ([.u[] | select(.s != null and is_verify(.n; .c)) | ($r[.id] // .s)] | max // 0),
        ([.u[] | select(.s != null and is_ui(.n; .c))     | ($r[.id] // .s)] | max // 0)' \
      "$transcript" 2>/dev/null)
  case $last_verify in ''|*[!0-9]*) last_verify=0 ;; esac
  case $last_ui_verify in ''|*[!0-9]*) last_ui_verify=0 ;; esac
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
    git status --porcelain -uall -z 2>/dev/null | tr '\0' '\n' \
      | awk 'skip { skip = 0; print; next } /^[RC]/ { skip = 1 } length($0) > 3 { print substr($0, 4) }' \
      > "$state/files"
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

# The git root holding path $1, or nothing.
repo_root() {
  local d="$1"
  while [ ! -d "$d" ] && [ "$d" != "/" ]; do d="${d%/*}"; [ -n "$d" ] || d="/"; done
  [ "$d" = "/" ] && return
  cd -P "$d" 2>/dev/null && while [ ! -e .git ]; do up=$PWD; cd -P ..; [ "$PWD" = "$up" ] && exit 1; done && pwd -P
}

# Map each named path to its repo root, once per folder ("." is the cwd).
cwd_root=""
[ -n "$cwd" ] && cwd_root=$(repo_root "$cwd")
: > "$state/roots"
seen=$'\n'
while IFS= read -r p; do
  [ -z "$p" ] && continue
  d="$p"; [ -d "$d" ] || d="${d%/*}"
  case $seen in *$'\n'"$d"$'\n'*) continue ;; esac
  seen="$seen$d"$'\n'
  r=$(repo_root "$d")
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

format_files() {
  local list="$1"
  local shown more
  shown=$(printf '%s\n' "$list" | head -n 10 | sed 's/^/  - /')
  more=$(( $(printf '%s\n' "$list" | wc -l) - 10 ))
  [ "$more" -gt 0 ] && shown="$shown"$'\n'"  - … and $more more"
  printf '%s' "$shown"
}

report=""
while IFS= read -r r; do
  [ -z "$r" ] && continue
  marker="$state/$(printf '%s' "$r" | shasum | cut -c1-16)"
  mark=0; [ -s "$marker" ] && read -r mark < "$marker"
  case $mark in ''|*[!0-9]*) mark=0 ;; esac

  # Keep changes within this session's tool-call windows (2s rounding),
  # ignoring docs, markdown, lockfiles, metadata dirs, and image artifacts.
  timed=$( {
    session_changes "$r"
    [ -n "$since" ] && git -C "$r" log --since="$since" --name-only --format=format:%x01%ct 2>/dev/null \
      | awk 'index($0, "\001") == 1 { t = substr($0, 2); next } NF { print t, $0 }'
  } | awk -v r="$r" '
      FILENAME == ARGV[1] { split($0, a, "\t"); if (a[1] == r) { n++; s[n] = a[2]; e[n] = a[3] }; next }
      { m = $1
        for (i = 1; i <= n; i++) if (m >= s[i] - 2 && m <= e[i] + 2) { print; next } }' \
      "$state/windows" - \
    | grep -vE ' (.*/)?\.okf/| (.*/)?\.claude/| (.*/)?LICENSE(\.[^/]+)?$' \
    | grep -vE '\.(md|mdx|txt|rst|adoc|png|jpe?g|gif|webp|ico|pdf)$' \
    | grep -vE ' (.*/)?(uv\.lock|poetry\.lock|package-lock\.json|pnpm-lock\.yaml|yarn\.lock|bun\.lockb?|Cargo\.lock|go\.sum|Gemfile\.lock|composer\.lock|mise\.lock|flake\.lock|Podfile\.lock)$' )

  [ -z "$timed" ] && continue

  untested=$(printf '%s\n' "$timed" | awk -v m="$mark" -v v="$last_verify" '
    NF > 1 && $1 > m && $1 > v')
  unverified_ui=$(printf '%s\n' "$timed" | awk -v m="$mark" -v u="$last_ui_verify" '
    { p = $0; sub(/^[0-9]+ /, "", p) }
    NF > 1 && $1 > m && $1 > u && p ~ /\.(tsx|jsx|vue|svelte|css|html|swift)$/')

  [ -z "$untested" ] && [ -z "$unverified_ui" ] && continue

  # Record the newest flagged change time so this change set blocks only once.
  { printf '%s\n' "$untested"; printf '%s\n' "$unverified_ui"; } \
    | awk -v m="$mark" '$1 > m { m = $1 } END { print m }' > "$marker"

  mise_hint=""
  for mf in "$r/mise.toml" "$r/.mise.toml"; do
    if [ -f "$mf" ] && grep -qE '^[[:space:]]*(\[tasks\.verify\]|tasks\.verify[[:space:]]*=)' "$mf" 2>/dev/null; then
      mise_hint="  Run: mise run verify"
      break
    fi
  done

  if [ -n "$untested" ]; then
    files=$(format_files "$(printf '%s\n' "$untested" | sed 's/^[0-9]* //' | sort -u)")
    report="$report"$'\n'"$r — code changed after last test/verify run:"$'\n'"$files"
    [ -n "$mise_hint" ] && report="$report"$'\n'"$mise_hint"
  fi
  if [ -n "$unverified_ui" ]; then
    ufiles=$(format_files "$(printf '%s\n' "$unverified_ui" | sed 's/^[0-9]* //' | sort -u)")
    report="$report"$'\n'"$r — UI changed without a visual check (bsk/cua/browser/playwright/screenshot):"$'\n'"$ufiles"
  fi
done <<< "$roots"

[ -z "$report" ] && exit 0

reason="Verification check before stopping:$report

Run the relevant test/verify check (and a visual check for UI changes) before stopping, or state why in your reply with \`Not tested: <why> — risk: <what could break>\`."

jq -n --arg r "$reason" '{decision: "block", reason: $r}'
