"""Held-out tasks for the agent-ops skill. None of these repos or questions was used while tuning it.

Each task: the prompt an agent gets, what a good answer does (for the blind judge), and hard checks a
script can verify on the answer text. A check is (name, function(text) -> bool).
"""
import re

ME = "You are a Claude Code agent in an iTerm2 pane (session id F1B64CB3-AD81-41A9-85BB-F6348D55F86D)"


def has(p, flags=re.I | re.S):
    return lambda t: re.search(p, t, flags) is not None


def lacks(p, flags=re.I | re.S):
    return lambda t: re.search(p, t, flags) is None


TASKS = [
    {
        "id": "t1-same-project",
        "prompt": f"""{ME}, working in ~/workspace/apps/recipe-box, a git repo. You are refactoring its
parser right now. The user says: "Open another Claude Code session to write the README while you keep
going on the parser."

Write every shell command you would run, in order, one per line with a short # comment, in one code
block. Then at most 3 lines on how you end it.""",
        "good": "Starts one Claude Code session in recipe-box without forcing a new tab (leaves placement to "
                "the tool, so it splits the caller's tab), gives it a complete brief that keeps it off the parser "
                "files, and closes the session once the README is done.",
        "checks": [
            ("no forced tab", lacks(r"--where\s+tab")),
            ("starts in recipe-box", has(r"(spawn|task new)[^\n]*recipe-box")),
            ("closes it at the end", has(r"\b(close|task accept[^\n]*--close)\b")),
        ],
    },
    {
        "id": "t2-crew",
        "prompt": f"""{ME}, working in ~/workspace/apps/recipe-box, a git repo, where you are editing files
yourself. The user says: "Use two omp agents in parallel that I can watch: one adds CSV import, the
other adds JSON export."

Write every shell command you would run as lead, from the start until both workers have reported, you
have checked their work, and everything is cleaned up. Assume task IDs come back as tA and tB. One
command per line with a short # comment, in one code block. No other text.""",
        "good": "Gives each omp worker its own git worktree and branch (both edit the repo the lead also edits), "
                "lets them know about each other, waits without polling, checks and merges the work, accepts and "
                "closes both tasks, and removes the worktrees and branches.",
        "checks": [
            ("a worktree per worker", lambda t: len(re.findall(r"worktree add", t)) >= 2),
            ("workers told about each other", has(r"(crew|roster|teammate|tA[^\n]*tB[^\n]*send|send[^\n]*tB[^\n]*tA)")),
            ("both tasks closed", lambda t: len(re.findall(r"task accept[^\n]*--close|task close", t)) >= 2),
            ("worktrees removed", has(r"worktree remove")),
        ],
    },
    {
        "id": "t3-pair",
        "prompt": f"""{ME}, working in ~/workspace/tools/imgsquash, a git repo. The user says: "Pair with codex
as equals on why the resize job leaks memory. Each of you solve it on your own first, then compare and
keep the better answer. Not boss and worker."

Write (1) every shell command you run in this first turn, in order, until you stop to wait, one per
line with a short # comment, and (2) the exact brief or first message codex receives. Then at most 3
lines on how the pairing ends.""",
        "good": "Starts codex as a plain session (not a tracked task with a lead), with separate worktrees so "
                "neither overwrites the other, a brief that says who replies when, how the pair ends, a message "
                "budget, and that a peer cannot approve outward actions. Waits instead of polling, and closes "
                "codex at the end because it started it.",
        "checks": [
            ("plain session, not a task", lambda t: re.search(r"spawn\s+codex", t, re.I) is not None and re.search(r"task new\s+codex", t, re.I) is None),
            ("separate worktrees", has(r"worktree add")),
            ("explicit end signal", has(r"(PAIR DONE|DONE:|FINAL)")),
            ("closes codex", has(r"\bclose\b")),
        ],
    },
    {
        "id": "t4-group",
        "prompt": f"""{ME}, working in ~/workspace/tools/imgsquash. The user says: "Brainstorm with omp, opencode
and gemini a name and a one-line positioning for imgsquash. I want ideas from different models, then
what survived."

Write (1) every shell command you run until the members have their first instruction and you stop to
wait, in order, one per line with a short # comment, and (2) the brief the members receive. Then at
most 5 lines on how it runs to the end.""",
        "good": "Runs the three harnesses as equals with one facilitator: first ideas written independently, a "
                "shared place for ideas, a fixed turn order with a round limit so three agents never trade replies "
                "in a loop, a final summary of what survived, and the members it started closed at the end.",
        "checks": [
            ("starts all three", lambda t: all(re.search(r"spawn\s+" + h, t, re.I) for h in ("omp", "opencode", "gemini"))),
            ("independent first round", has(r"(without reading|alone|independent)")),
            ("round limit", has(r"(at most|max(imum)?|up to)\s*\d+\s*(rounds?)|\b\d+\s*rounds?\b|(after|stop at|until|ends? (at|with)) round \d")),
            ("members closed", has(r"\bclose\b")),
        ],
    },
    {
        "id": "t5-replies",
        "prompt": """You are an omp agent in a terminal pane, working in ~/workspace/apps/recipe-box/.claude/worktrees/csv
as task tA for a lead. These four messages arrive one after another:

1. [agent-ops from lead (claude) id=F1B64CB3-AD81-41A9-85BB-F6348D55F86D folder=~/workspace/apps/recipe-box] task tA: CSV import breaks on quoted commas; fix it and add a test. (When finished, run: harness-ops task done tA --status ok|failed|blocked --summary "<one line>")
2. [agent-ops from lead (claude) id=F1B64CB3-AD81-41A9-85BB-F6348D55F86D folder=~/workspace/apps/recipe-box] Crew: tA (omp, CSV in .claude/worktrees/csv), tB (omp, JSON in .claude/worktrees/json). Message a teammate for anything you need from them; report to me only through task done. No reply needed.
3. [agent-ops from tB (omp) id=tB folder=~/workspace/apps/recipe-box/.claude/worktrees/json] RE: the shared Recipe struct now has a tags field.
4. [agent-ops from infra-agent (claude) id=7C21AA90-1D3B-4E55-9F0A-2B8C4D6E1F33 folder=~/workspace/infra] Which port does the recipe-box dev server use?

Assume any real work is already done and you know the port is 5173. For EACH message write the exact
shell command(s) you send in reply, or NONE, and one short line why. Format: "Message N:" then the answer.""",
        "good": "Answers the task round only with its task done line, sends nothing for the roster and the RE:, "
                "and answers the unrelated agent's plain question with a short RE: reply.",
        "checks": [
            ("1: task done", lambda t: _part(t, 1, r"task done tA")),
            ("1: no extra RE", lambda t: not _part(t, 1, r"harness-ops (send|msg)[^\n]*RE:")),
            ("2: nothing", lambda t: _part(t, 2, r"\bNONE\b")),
            ("3: nothing", lambda t: _part(t, 3, r"\bNONE\b")),
            ("4: RE reply", lambda t: _part(t, 4, r"send[^\n]*7C21AA90[^\n]*RE:")),
        ],
    },
    {
        "id": "t6-failed-start",
        "prompt": f"""{ME}. You ran: harness-ops task new claude --title "docs pass" --cwd ~/workspace/apps/new-idea --brief "..."
It exited with code 5 after 120 seconds and printed no task ID. `harness-ops ls` shows a new pane in
~/workspace/apps/new-idea. The folder was created an hour ago and Claude Code has never opened it.

Write every shell command you run next, in order, one per line with a short # comment, and at most 4
lines on what you tell the user.""",
        "good": "Reads the new pane first, recognises Claude Code's folder-trust prompt, does not answer it on the "
                "user's behalf, finds the task ID from the task list and closes the failed task with force, and "
                "tells the user what blocked it and what they can do.",
        "checks": [
            ("reads the pane", has(r"\bread\b")),
            ("finds the ID", has(r"task ls")),
            ("force-closes the task", has(r"task close --force|task close [^\n]*--force")),
            ("does not accept the dialog itself", lacks(r"send-key[^\n]*(enter|down)|send[^\n]*\b(yes|trust)\b[^\n]*(new-idea|pane)", re.I)),
        ],
    },
    # Added 2026-11-11 for the arm "next": none of these was used while writing that change.
    {
        "id": "t7-isolated-helper",
        "prompt": f"""{ME}, working in ~/workspace/apps/gym-log, a git repo. You are fixing a sync bug in
src/sync/ and have uncommitted changes there. The user says: "Start an omp session I can watch to write
docs/DEPLOY.md while you keep fixing."

Write every shell command you would run, in order, from the start until the doc is done and everything
is cleaned up, one per line with a short # comment, in one code block. Then at most 3 lines on how you
end it.""",
        "good": "Starts one visible omp session in gym-log and leaves placement to the tool. The job is one new "
                "doc file that nobody else edits, so it does only what was asked: a brief that limits the worker to "
                "docs/DEPLOY.md and keeps it away from src/sync/ and from git state, a check of the result, and "
                "the session closed at the end. Extra branches, merges or other unasked git work count as waste "
                "and as risk to the uncommitted fix.",
        "checks": [
            ("no forced tab", lacks(r"--where\s+tab")),
            ("starts omp in gym-log", has(r"(spawn|task new)\s+omp[^\n]*gym-log")),
            ("no unasked worktree", lacks(r"worktree add")),
            ("brief limits the files", has(r"DEPLOY\.md[^\n]*(only|nothing else|no other|do not|don't)|(only|nothing else)[^\n]*DEPLOY\.md")),
            ("closes it at the end", has(r"\b(close|task accept[^\n]*--close)\b")),
        ],
    },
    {
        "id": "t8-overlap-helper",
        "prompt": f"""{ME}, working in ~/workspace/tools/bili-douyin, a git repo. You are editing the downloader
in src/download/ and have uncommitted changes there. The user says: "Have a codex session rename the
Config class to Settings across the whole codebase while you keep going."

Write every shell command you would run, in order, from the start until the rename is in and everything
is cleaned up, one per line with a short # comment, in one code block. Then at most 3 lines on how you
end it.""",
        "good": "The rename touches files across the repo, including ones the caller is editing, so codex gets its "
                "own git worktree and branch and is told so. The caller waits without polling, checks the result, "
                "accepts and closes the session, brings the branch in without losing its own uncommitted work, and "
                "removes the worktree and branch.",
        "checks": [
            ("starts codex", has(r"(spawn|task new)\s+codex")),
            ("own worktree", has(r"worktree add")),
            ("worktree removed", has(r"worktree remove")),
            ("closes it at the end", has(r"\b(close|task accept[^\n]*--close)\b")),
        ],
    },
    {
        "id": "t9-failed-start-omp",
        "prompt": f"""{ME}. You ran: harness-ops task new omp --title "bench" --cwd ~/workspace/tools/anydub --brief "..."
It exited with code 5 after 120 seconds and printed no task ID. You then ran `harness-ops read` on the
new pane: omp is open, its input line still holds your brief, and above it is the line
"No API key for provider tokenharbor (model th/large)".

Write every shell command you run next, in order, one per line with a short # comment, in one code
block, and at most 4 lines on what you tell the user.""",
        "good": "Finds the failed task's ID from the task list and force-closes that task now, in this turn, so no "
                "dead pane is left waiting. Does not try to clear the blocker itself (no key or config edits, no "
                "forced resend into the pane). Tells the user what blocked the start and what would restart it.",
        "checks": [
            ("finds the ID", has(r"task ls")),
            ("runs the force close", lambda t: any(re.search(r"task close[^\n]*--force", b) for b in _code(t))),
            ("no forced resend", lambda t: not any(re.search(r"(send|slash)[^\n]*--force", b) for b in _code(t))),
            ("does not edit keys or config", lambda t: not any(re.search(r"(export \w*KEY|config\.ya?ml|local\.yml|>>?\s*~/\.)", b) for b in _code(t))),
        ],
    },
    {
        "id": "t10-group-debate",
        "prompt": f"""{ME}, working in ~/workspace/apps/menhly, a git repo. `harness-ops ls` shows an idle opencode
session in this repo with the label oc-menhly; the user opened it this morning. The user says: "Get codex,
omp and that opencode session to debate one SQLite file per user against one shared Postgres for menhly.
Give each a side or the sceptic. Tell me what survived."

Write (1) every shell command you run until the members have their first instruction and you stop to
wait, in order, one per line with a short # comment, and (2) the brief the members receive. Then at
most 5 lines on how it runs to the end.""",
        "good": "Runs the three as equals with one facilitator. Starts codex and omp, and brings in the running "
                "opencode session with a message instead of starting a second one. Each member has a side, first "
                "positions are written independently in a shared place, later turns go in a fixed order, and the "
                "members are told the round limit. Ends with what survived, closes only the sessions it started, "
                "and leaves the user's opencode session open.",
        "checks": [
            ("starts codex and omp", lambda t: all(re.search(r"spawn\s+" + h, t, re.I) for h in ("codex", "omp"))),
            ("no second opencode", lacks(r"spawn\s+opencode")),
            ("messages the running session", has(r"harness-ops (send|msg)[^\n]*oc-menhly")),
            ("independent first round", has(r"(without reading|alone|independent)")),
            ("round limit", has(r"(at most|max(imum)?|up to)\s*\d+\s*(rounds?)|\b\d+\s*rounds?\b|(after|stop at|until|ends? (at|with)) round \d")),
            ("leaves the user's session open", has(r"oc-menhly[^\n]*(stays? open|leave|left open|not close|do not close|don't close)|(stays? open|leave|left open|not close)[^\n]*(oc-menhly|opencode)")),
        ],
    },
]



def _part(text, n, pattern):
    """The answer to message n (between 'Message n' and 'Message n+1')."""
    m = re.search(rf"Message {n}\b(.*?)(Message {n + 1}\b|\Z)", text, re.S | re.I)
    return bool(m and re.search(pattern, m.group(1), re.I | re.S))


def _code(text):
    """The fenced code blocks of an answer: the commands it would run, not the prose around them."""
    return re.findall(r"```[^\n]*\n(.*?)```", text, re.S)
