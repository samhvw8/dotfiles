#!/bin/bash
# Tests for verify-stop.sh.
# Run: bash ~/.dotfiles/home/.ccp/hub/hooks/verify-stop/tests/test-verify-stop.sh
set -u
hook="$(cd "$(dirname "$0")/.." && pwd)/scripts/verify-stop.sh"
tmp=$(mktemp -d); trap 'rm -rf "$tmp"' EXIT
export TMPDIR="$tmp/state"; mkdir -p "$TMPDIR"
export GIT_AUTHOR_NAME=t GIT_AUTHOR_EMAIL=t@t GIT_COMMITTER_NAME=t GIT_COMMITTER_EMAIL=t@t
fail=0
now=$(date +%s)

iso() { if date -u -r 0 >/dev/null 2>&1; then date -u -r "$1" +%Y-%m-%dT%H:%M:%S.000Z; else date -u -d "@$1" +%Y-%m-%dT%H:%M:%S.000Z; fi; }
stamp() { if date -r 0 >/dev/null 2>&1; then date -r "$1" +%Y%m%d%H%M.%S; else date -d "@$1" +%Y%m%d%H%M.%S; fi; }
age() { touch -t "$(stamp "$1")" "$2"; }

mkrepo() {
  mkdir -p "$1/src"
  git -C "$1" init -q
  echo "export const x = 1;" > "$1/src/a.ts"
  echo "export function App() { return <div/>; }" > "$1/src/App.tsx"
  echo "# Readme" > "$1/README.md"
  git -C "$1" add -A
  GIT_COMMITTER_DATE="@$((now-90000)) +0000" git -C "$1" commit -qm init --date="@$((now-90000)) +0000"
}

# Transcript builders.
start() { printf '{"type":"user","timestamp":"%s","message":{"content":"hi"}}\n' "$(iso "$1")"; }
call() { # epoch id name input-json
  printf '{"type":"assistant","timestamp":"%s","message":{"content":[{"type":"tool_use","id":"%s","name":"%s","input":%s}]}}\n' "$(iso "$1")" "$2" "$3" "$4"; }
result() { printf '{"type":"user","timestamp":"%s","message":{"content":[{"type":"tool_result","tool_use_id":"%s","content":"ok"}]}}\n' "$(iso "$1")" "$2"; }
say() { # epoch text
  jq -cn --arg ts "$(iso "$1")" --arg txt "$2" '{"type":"assistant","timestamp":$ts,"message":{"content":[{"type":"text","text":$txt}]}}'; }

run() { # session transcript cwd -> prints hook output
  jq -cn --arg s "$1" --arg t "$2" --arg c "$3" '{session_id:$s, transcript_path:$t, cwd:$c}' | bash "$hook"; }
expect_block() { case $2 in *'"block"'*) echo "ok   $1" ;; *) echo "FAIL $1: expected a block, got: $2"; fail=1 ;; esac; }
expect_pass() { [ -z "$2" ] && echo "ok   $1" || { echo "FAIL $1: expected no block, got: $2"; fail=1; }; }
expect_contains() { case $2 in *"$3"*) echo "ok   $1" ;; *) echo "FAIL $1: expected '$3' in: $2"; fail=1 ;; esac; }

# 1. Read-only / no code changes (only docs changed) -> allow.
r="$tmp/r1"; mkrepo "$r"; t="$tmp/t1.jsonl"
{ start $((now-3600))
  call $((now-1000)) c1 Read "{\"file_path\":\"$r/src/a.ts\"}"; result $((now-999)) c1
  call $((now-900)) c2 Edit "{\"file_path\":\"$r/README.md\"}"; result $((now-899)) c2; } > "$t"
echo "updated" >> "$r/README.md"; age $((now-899)) "$r/README.md"
expect_pass "1. read-only / docs-only change allows stop" "$(run s1 "$t" "$r")"

# 2. Code changed, no test run -> block once, then second stop with same state -> allow.
r="$tmp/r2"; mkrepo "$r"; t="$tmp/t2.jsonl"
{ start $((now-3600))
  call $((now-1000)) c1 Edit "{\"file_path\":\"$r/src/a.ts\"}"; result $((now-998)) c1; } > "$t"
echo "export const x = 2;" > "$r/src/a.ts"; age $((now-999)) "$r/src/a.ts"
expect_block "2a. code changed without test blocks first stop" "$(run s2 "$t" "$r")"
expect_pass  "2b. second stop with same state allows stop" "$(run s2 "$t" "$r")"

# 3. Code changed, test ran after edit -> allow.
r="$tmp/r3"; mkrepo "$r"; t="$tmp/t3.jsonl"
{ start $((now-3600))
  call $((now-1000)) c1 Edit "{\"file_path\":\"$r/src/a.ts\"}"; result $((now-998)) c1
  call $((now-900)) c2 Bash '{"command":"vitest run"}'; result $((now-895)) c2; } > "$t"
echo "export const x = 3;" > "$r/src/a.ts"; age $((now-999)) "$r/src/a.ts"
expect_pass "3. code changed with test run after edit allows stop" "$(run s3 "$t" "$r")"

# 4. UI file (.tsx) changed, unit test ran but no bsk/cua/screenshot -> block.
r="$tmp/r4"; mkrepo "$r"; t="$tmp/t4.jsonl"
{ start $((now-3600))
  call $((now-1000)) c1 Edit "{\"file_path\":\"$r/src/App.tsx\"}"; result $((now-998)) c1
  call $((now-900)) c2 Bash '{"command":"vitest run"}'; result $((now-895)) c2; } > "$t"
echo "export function App() { return <h1>hi</h1>; }" > "$r/src/App.tsx"; age $((now-999)) "$r/src/App.tsx"
out4=$(run s4 "$t" "$r")
expect_block "4a. UI file with unit test only blocks stop" "$out4"
expect_contains "4b. block mentions UI visual check" "$out4" "UI changed without a visual check"

# 5. UI file (.tsx) changed, bsk screenshot ran after edit -> allow.
r="$tmp/r5"; mkrepo "$r"; t="$tmp/t5.jsonl"
{ start $((now-3600))
  call $((now-1000)) c1 Edit "{\"file_path\":\"$r/src/App.tsx\"}"; result $((now-998)) c1
  call $((now-900)) c2 Bash '{"command":"bsk screenshot /tmp/out.png"}'; result $((now-895)) c2; } > "$t"
echo "export function App() { return <h1>hi</h1>; }" > "$r/src/App.tsx"; age $((now-999)) "$r/src/App.tsx"
expect_pass "5. UI file with bsk screenshot after edit allows stop" "$(run s5 "$t" "$r")"

# 6. Code changed, no test, but last assistant reply has `Not tested: ... — risk: ...` -> allow.
r="$tmp/r6"; mkrepo "$r"; t="$tmp/t6.jsonl"
{ start $((now-3600))
  call $((now-1000)) c1 Edit "{\"file_path\":\"$r/src/a.ts\"}"; result $((now-998)) c1
  say $((now-950)) "Done. Not tested: auth gate — risk: login flow"; } > "$t"
echo "export const x = 6;" > "$r/src/a.ts"; age $((now-999)) "$r/src/a.ts"
expect_pass "6. escape hatch in last assistant reply allows stop" "$(run s6 "$t" "$r")"

# 7. Repo with [tasks.verify] in mise.toml -> block message names `mise run verify`.
r="$tmp/r7"; mkrepo "$r"; t="$tmp/t7.jsonl"
cat > "$r/mise.toml" <<'EOF'
[tasks.verify]
run = "vitest run"
EOF
git -C "$r" add mise.toml
GIT_COMMITTER_DATE="@$((now-80000)) +0000" git -C "$r" commit -qm "add mise" --date="@$((now-80000)) +0000"
{ start $((now-3600))
  call $((now-1000)) c1 Edit "{\"file_path\":\"$r/src/a.ts\"}"; result $((now-998)) c1; } > "$t"
echo "export const x = 7;" > "$r/src/a.ts"; age $((now-999)) "$r/src/a.ts"
out7=$(run s7 "$t" "$r")
expect_block "7a. repo with [tasks.verify] blocks stop" "$out7"
expect_contains "7b. block names mise run verify" "$out7" "mise run verify"

exit $fail
