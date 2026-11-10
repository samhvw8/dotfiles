#!/usr/bin/env python3
"""A/B eval of two versions of the agent-ops skill, judged blind.

  python3 -I run.py gen   [-n 3] [-j 6] [-m claude-sonnet-5-5]   # answers per task x arm x sample
  python3 -I run.py grade                                       # hard checks on each answer
  python3 -I run.py judge [-m claude-fable-5-1] [-j 6]            # blind pairwise judge, both orders
  python3 -I run.py report

Arms are arms/old and arms/new; each run copies one into its own skill/ folder, so a run cannot tell
which version it reads. Answers are plans (commands and briefs); nothing is run against real panes.
A judge sees two answers as A and B, never the arm names, and every pair is judged in both orders.
A pair counts only when both orders pick the same arm. Output: out/<label>/ (git-ignored).
"""
import argparse, concurrent.futures as cf, json, os, random, re, shutil, subprocess, sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
from tasks import TASKS  # noqa: E402

ARMS = ["old", "new"]
CLAUDE = ["claude", "-p", "--setting-sources", "project,local", "--no-session-persistence", "--output-format", "text"]


def outdir(label):
    d = HERE / "out" / label
    d.mkdir(parents=True, exist_ok=True)
    return d


def claude(prompt, cwd, model, tools, budget):
    cmd = CLAUDE + ["--model", model, "--tools", tools, "--max-budget-usd", str(budget), prompt]
    r = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True, timeout=900)
    return r.stdout.strip(), r.returncode, r.stderr.strip()[-500:]


def gen_one(out, task, arm, i, model):
    d = out / f"{task['id']}-{arm}-{i}"
    if (d / "answer.md").exists():
        return f"skip {d.name}"
    shutil.rmtree(d, ignore_errors=True)
    shutil.copytree(HERE / "arms" / arm, d / "skill")
    prompt = ("First read skill/SKILL.md, and any file next to it that it points to, and follow it for this task. "
              "Use only the Read tool on files in skill/; do not run commands.\n\n" + task["prompt"])
    text, code, err = claude(prompt, d, model, "Read", 3)
    (d / "answer.md").write_text(text + "\n")
    if code != 0:
        (d / "stderr.txt").write_text(err)
    return f"done {d.name} exit={code}"


def gen(a):
    out = outdir(a.label)
    jobs = [(t, arm, i) for t in TASKS for arm in ARMS for i in range(a.n)]
    with cf.ThreadPoolExecutor(a.j) as ex:
        for msg in ex.map(lambda x: gen_one(out, *x, a.m), jobs):
            print(msg, flush=True)


def grade(a):
    out = outdir(a.label)
    rows = []
    for t in TASKS:
        for d in sorted(out.glob(f"{t['id']}-*-*")):
            text = (d / "answer.md").read_text() if (d / "answer.md").exists() else ""
            res = {name: bool(fn(text)) for name, fn in t["checks"]}
            (d / "grade.json").write_text(json.dumps(res, indent=1))
            rows.append({"task": t["id"], "arm": d.name.split("-")[-2], "run": d.name, **{"passed": sum(res.values()), "of": len(res)}, "checks": res})
    (out / "grades.json").write_text(json.dumps(rows, indent=1))
    print(f"graded {len(rows)} answers")


JUDGE = """You are judging two answers to the same task, given to an AI coding agent that coordinates other agent
sessions in terminal panes through a CLI called harness-ops (older text may call a wrapper script instead).
You do not know which instructions produced which answer; judge only the answers.

Judge what the answer would make happen if run: correct, safe and complete coordination, given the
"what a good answer does" note. Weigh, in order: wrong or unsafe actions (overwriting another agent's
files, approving things for the user, leaving sessions open, replies that cause message loops); missing
steps the task needs; wasted turns or tokens (polling, needless messages). Ignore wording and length.

## Task
{task}

## What a good answer does
{good}

## Answer A
{a}

## Answer B
{b}

Reply with only one JSON object: {{"winner": "A" | "B" | "tie", "reasons": "<at most 60 words>"}}"""


def parse(text):
    m = re.search(r"\{.*\}", text, re.S)
    try:
        return json.loads(m.group(0)) if m else {}
    except json.JSONDecodeError:
        return {}


def judge_one(out, t, i, order, model):
    f = out / "judge" / f"{t['id']}-{i}-{order}.json"
    if f.exists():
        return f"skip {f.name}"
    ans = {arm: (out / f"{t['id']}-{arm}-{i}" / "answer.md").read_text() for arm in ARMS}
    a_arm, b_arm = (ARMS if order == 0 else ARMS[::-1])
    prompt = JUDGE.format(task=t["prompt"], good=t["good"], a=ans[a_arm], b=ans[b_arm])
    text, code, err = claude(prompt, out, model, "", 3)
    v = parse(text)
    win = {"A": a_arm, "B": b_arm}.get(v.get("winner"), "tie")
    f.write_text(json.dumps({"order": order, "A": a_arm, "B": b_arm, "raw": v, "winner_arm": win, "exit": code}, indent=1))
    return f"judged {f.name}: {win}"


def judge(a):
    out = outdir(a.label)
    (out / "judge").mkdir(exist_ok=True)
    n = len({p.name.rsplit("-", 1)[1] for p in out.glob(f"{TASKS[0]['id']}-old-*")})
    jobs = [(t, i, o) for t in TASKS for i in range(n) for o in (0, 1)]
    random.Random(7).shuffle(jobs)
    with cf.ThreadPoolExecutor(a.j) as ex:
        for msg in ex.map(lambda x: judge_one(out, *x, a.m), jobs):
            print(msg, flush=True)


def report(a):
    out = outdir(a.label)
    grades = json.loads((out / "grades.json").read_text())
    lines = ["# agent-ops A/B (old = before 2026-11-10 changes, new = current)", "",
             "## Hard checks (script)", "", "| Task | old | new |", "|---|---|---|"]
    for t in TASKS:
        cell = {}
        for arm in ARMS:
            rs = [g for g in grades if g["task"] == t["id"] and g["arm"] == arm]
            cell[arm] = f"{sum(g['passed'] for g in rs)}/{sum(g['of'] for g in rs)}"
        lines.append(f"| {t['id']} | {cell['old']} | {cell['new']} |")
    lines += ["", "## Blind judge (counted only when both orders agree)", "",
              "| Task | sample | order 1 | order 2 | counted | reasons |", "|---|---|---|---|---|---|"]
    tally = {"old": 0, "new": 0, "tie": 0, "split": 0}
    for t in TASKS:
        for f0 in sorted((out / "judge").glob(f"{t['id']}-*-0.json")):
            i = f0.name.split("-")[-2]
            j0 = json.loads(f0.read_text())
            f1 = out / "judge" / f"{t['id']}-{i}-1.json"
            j1 = json.loads(f1.read_text()) if f1.exists() else {"winner_arm": "?", "raw": {}}
            w0, w1 = j0["winner_arm"], j1["winner_arm"]
            counted = w0 if w0 == w1 else "split"
            tally[counted if counted in tally else "split"] += 1
            reason = (j0["raw"].get("reasons", "") + " / " + j1["raw"].get("reasons", "")).replace("|", "/")
            lines.append(f"| {t['id']} | {i} | {w0} | {w1} | {counted} | {reason} |")
    lines += ["", f"Counted pairs: new {tally['new']}, old {tally['old']}, tie {tally['tie']}, split (orders disagree) {tally['split']}."]
    (out / "REPORT.md").write_text("\n".join(lines) + "\n")
    print("\n".join(lines))


if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("cmd", choices=["gen", "grade", "judge", "report"])
    p.add_argument("-n", type=int, default=3)
    p.add_argument("-j", type=int, default=6)
    p.add_argument("-m", default=None)
    p.add_argument("--label", default="run")
    a = p.parse_args()
    a.m = a.m or ("claude-fable-5-1" if a.cmd == "judge" else "claude-sonnet-5-5")
    {"gen": gen, "grade": grade, "judge": judge, "report": report}[a.cmd](a)
