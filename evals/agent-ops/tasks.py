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
            ("round limit", has(r"(at most|max(imum)?|up to)\s*\d+\s*(rounds?)|\b\d+\s*rounds?\b")),
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
            ("1: no extra RE", lambda t: not _part(t, 1, r"send[^\n]*RE:")),
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
]


def _part(text, n, pattern):
    """The answer to message n (between 'Message n' and 'Message n+1')."""
    m = re.search(rf"Message {n}\b(.*?)(Message {n + 1}\b|\Z)", text, re.S | re.I)
    return bool(m and re.search(pattern, m.group(1), re.I | re.S))
