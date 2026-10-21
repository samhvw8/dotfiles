#!/bin/bash
# Tests for okf-stop.sh: a change counts only when this session could have made it.
# Run: bash okf-stop/tests/okf-stop.test.sh
set -u
hook="$(cd "$(dirname "$0")/.." && pwd)/scripts/okf-stop.sh"
tmp=$(mktemp -d); trap 'rm -rf "$tmp"' EXIT
export TMPDIR="$tmp/state"; mkdir -p "$TMPDIR"
export GIT_AUTHOR_NAME=t GIT_AUTHOR_EMAIL=t@t GIT_COMMITTER_NAME=t GIT_COMMITTER_EMAIL=t@t
fail=0
now=$(date +%s)

iso() { if date -u -r 0 >/dev/null 2>&1; then date -u -r "$1" +%Y-%m-%dT%H:%M:%S.000Z; else date -u -d "@$1" +%Y-%m-%dT%H:%M:%S.000Z; fi; }
stamp() { if date -r 0 >/dev/null 2>&1; then date -r "$1" +%Y%m%d%H%M.%S; else date -d "@$1" +%Y%m%d%H%M.%S; fi; }
# Set a file's mtime to epoch $1.
age() { touch -t "$(stamp "$1")" "$2"; }

mkrepo() { mkdir -p "$1/.okf" "$1/src"; git -C "$1" init -q; echo x > "$1/.okf/index.md"; echo a > "$1/src/a.txt";
  git -C "$1" add -A; GIT_COMMITTER_DATE="@$((now-90000)) +0000" git -C "$1" commit -qm init --date="@$((now-90000)) +0000"; }

# Transcript entries.
start() { printf '{"type":"user","timestamp":"%s","message":{"content":"hi"}}\n' "$(iso "$1")"; }
call() { # epoch id input-json
  printf '{"type":"assistant","timestamp":"%s","message":{"content":[{"type":"tool_use","id":"%s","input":%s}]}}\n' "$(iso "$1")" "$2" "$3"; }
result() { printf '{"type":"user","timestamp":"%s","message":{"content":[{"type":"tool_result","tool_use_id":"%s","content":"ok"}]}}\n' "$(iso "$1")" "$2"; }

run() { # name transcript cwd -> prints hook output
  jq -cn --arg s "$1" --arg t "$2" --arg c "$3" '{session_id:$s, transcript_path:$t, cwd:$c}' | bash "$hook"; }
expect_block() { case $2 in *'"block"'*) echo "ok   $1" ;; *) echo "FAIL $1: expected a block"; fail=1 ;; esac; }
expect_pass() { [ -z "$2" ] && echo "ok   $1" || { echo "FAIL $1: expected no block, got: $2"; fail=1; }; }

# 1. A repo only read; another process writes to it later, between our tool calls.
r="$tmp/r1"; mkrepo "$r"; t="$tmp/t1.jsonl"
{ start $((now-3600)); call $((now-3000)) c1 "{\"command\":\"cat $r/src/a.txt\"}"; result $((now-2999)) c1; } > "$t"
echo other > "$r/src/bench.csv"; age $((now-1000)) "$r/src/bench.csv"
expect_pass "read-only repo, file written by someone else later" "$(run s1 "$t" "$tmp")"

# 2. A file written by an Edit call in that repo.
r="$tmp/r2"; mkrepo "$r"; t="$tmp/t2.jsonl"
{ start $((now-3600)); call $((now-1000)) c1 "{\"file_path\":\"$r/src/a.txt\"}"; result $((now-998)) c1; } > "$t"
echo b > "$r/src/a.txt"; age $((now-999)) "$r/src/a.txt"
expect_block "file edited during this session's tool call" "$(run s2 "$t" "$tmp")"

# 3. The cwd repo, changed by a Bash call that names no path.
r="$tmp/r3"; mkrepo "$r"; t="$tmp/t3.jsonl"
{ start $((now-3600)); call $((now-500)) c1 '{"command":"make gen"}'; result $((now-490)) c1; } > "$t"
echo g > "$r/src/gen.txt"; age $((now-495)) "$r/src/gen.txt"
expect_block "cwd repo changed by a relative Bash call" "$(run s3 "$t" "$r")"

# 4. The cwd repo, changed by another session while this one was idle.
r="$tmp/r4"; mkrepo "$r"; t="$tmp/t4.jsonl"
{ start $((now-3600)); call $((now-3000)) c1 '{"command":"ls"}'; result $((now-2999)) c1; } > "$t"
echo g > "$r/src/other.txt"; age $((now-1500)) "$r/src/other.txt"
expect_pass "cwd repo changed while this session was idle" "$(run s4 "$t" "$r")"

# 5. A commit made by someone else between our tool calls.
r="$tmp/r5"; mkrepo "$r"; t="$tmp/t5.jsonl"
{ start $((now-3600)); call $((now-3000)) c1 "{\"command\":\"ls $r\"}"; result $((now-2999)) c1; } > "$t"
echo c > "$r/src/c.txt"; git -C "$r" add -A
GIT_COMMITTER_DATE="@$((now-1500)) +0000" git -C "$r" commit -qm other --date="@$((now-1500)) +0000"
expect_pass "commit by someone else between our calls" "$(run s5 "$t" "$tmp")"

# 6. A commit made during this session's tool call.
r="$tmp/r6"; mkrepo "$r"; t="$tmp/t6.jsonl"
{ start $((now-3600)); call $((now-1502)) c1 "{\"command\":\"git -C $r commit -am x\"}"; result $((now-1499)) c1; } > "$t"
echo c > "$r/src/c.txt"; git -C "$r" add -A
GIT_COMMITTER_DATE="@$((now-1500)) +0000" git -C "$r" commit -qm mine --date="@$((now-1500)) +0000"
expect_block "commit during this session's tool call" "$(run s6 "$t" "$tmp")"

# 7. A background call keeps writing after its result came back.
r="$tmp/r7"; mkrepo "$r"; t="$tmp/t7.jsonl"
{ start $((now-3600)); call $((now-2000)) c1 "{\"command\":\"$r/gen.sh\",\"run_in_background\":true}"; result $((now-1999)) c1; } > "$t"
echo g > "$r/src/late.txt"; age $((now-100)) "$r/src/late.txt"
expect_block "background call writes after its result" "$(run s7 "$t" "$tmp")"

# 8. A deleted file counts by its folder's time.
r="$tmp/r8"; mkrepo "$r"; t="$tmp/t8.jsonl"
{ start $((now-3600)); call $((now-800)) c1 "{\"command\":\"rm $r/src/a.txt\"}"; result $((now-799)) c1; } > "$t"
rm "$r/src/a.txt"; age $((now-800)) "$r/src"
expect_block "file deleted during this session's tool call" "$(run s8 "$t" "$tmp")"

# 9. The bundle was updated early; code changed after that.
r="$tmp/r9"; mkrepo "$r"; t="$tmp/t9.jsonl"
{ start $((now-3600)); call $((now-2000)) c1 "{\"file_path\":\"$r/.okf/index.md\"}"; result $((now-1998)) c1
  call $((now-1000)) c2 "{\"file_path\":\"$r/src/a.txt\"}"; result $((now-998)) c2; } > "$t"
echo y > "$r/.okf/index.md"; age $((now-1999)) "$r/.okf/index.md"
echo b > "$r/src/a.txt"; age $((now-999)) "$r/src/a.txt"
expect_block "code changed after the bundle was updated" "$(run s9 "$t" "$tmp")"

# 10. Code changed, then the bundle was updated.
r="$tmp/r10"; mkrepo "$r"; t="$tmp/t10.jsonl"
{ start $((now-3600)); call $((now-2000)) c1 "{\"file_path\":\"$r/src/a.txt\"}"; result $((now-1998)) c1
  call $((now-1000)) c2 "{\"file_path\":\"$r/.okf/index.md\"}"; result $((now-998)) c2; } > "$t"
echo b > "$r/src/a.txt"; age $((now-1999)) "$r/src/a.txt"
echo y > "$r/.okf/index.md"; age $((now-999)) "$r/.okf/index.md"
expect_pass "bundle updated after the code change" "$(run s10 "$t" "$tmp")"

# 11-12. After a block: no new change passes; a later change blocks again.
r="$tmp/r11"; mkrepo "$r"; t="$tmp/t11.jsonl"
{ start $((now-3600)); call $((now-2000)) c1 "{\"file_path\":\"$r/src/a.txt\"}"; result $((now-1998)) c1; } > "$t"
echo b > "$r/src/a.txt"; age $((now-1999)) "$r/src/a.txt"
expect_block "first stop after a change" "$(run s11 "$t" "$tmp")"
expect_pass "second stop, nothing new" "$(run s11 "$t" "$tmp")"
{ call $((now-500)) c2 "{\"file_path\":\"$r/src/b.txt\"}"; result $((now-498)) c2; } >> "$t"
echo n > "$r/src/b.txt"; age $((now-499)) "$r/src/b.txt"
expect_block "new change after the block" "$(run s11 "$t" "$tmp")"

# 13. Only a lockfile changed after the bundle: lockfiles never need a bundle update.
r="$tmp/r13"; mkrepo "$r"; t="$tmp/t13.jsonl"
{ start $((now-3600)); call $((now-2000)) c1 "{\"file_path\":\"$r/.okf/index.md\"}"; result $((now-1998)) c1
  call $((now-1000)) c2 '{"command":"uv sync"}'; result $((now-990)) c2; } > "$t"
echo y > "$r/.okf/index.md"; age $((now-1999)) "$r/.okf/index.md"
echo l > "$r/uv.lock"; age $((now-995)) "$r/uv.lock"
expect_pass "only a lockfile changed after the bundle" "$(run s13 "$t" "$r")"

exit $fail
