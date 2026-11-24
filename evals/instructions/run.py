#!/usr/bin/env python3
"""A/B eval of the always-loaded instruction set (profile CLAUDE.md + hub rules + ~/CLAUDE.local.md).

  python3 -I run.py build  --label L [--base main]     # write the arms to out/L/arms/
  python3 -I run.py gen    --label L [-n 2] [-j 6]     # answers per task x arm x sample
  python3 -I run.py grade  --label L                   # hard checks
  python3 -I run.py judge  --label L [-j 6]            # blind pairwise judge, both orders
  python3 -I run.py report --label L                   # out/L/REPORT.md

Arms: old (the base commit + ~/CLAUDE.local.md as it was), new (working tree + ~/CLAUDE.local.md),
bare (working tree, no ~/CLAUDE.local.md: a machine that has only this repository).
Each run gets its arm through --append-system-prompt-file with CLAUDE_CODE_DISABLE_CLAUDE_MDS=1, so
the live CLAUDE.md and rules load into no arm. Every step skips work that is already on disk.
"""
import argparse, concurrent.futures as cf, json, os, pathlib, re, subprocess, sys

HERE = pathlib.Path(__file__).resolve().parent
REPO = HERE.parent.parent
sys.path.insert(0, str(HERE))
from tasks import TASKS, PLAN  # noqa: E402

PROFILE = "home/.ccp/profiles/default/CLAUDE.md"
RULES = "home/.ccp/hub/rules"
LOCAL = pathlib.Path.home() / "CLAUDE.local.md"
LOCAL_CUT = "## This machine's servers and tools"   # everything from here on was added by the change
ARMS = ["old", "new", "bare"]
PAIRS = [("old", "new"), ("old", "bare")]
CLAUDE = ["claude", "-p", "--setting-sources", "project,local", "--no-session-persistence", "--output-format", "text"]
OWNER = os.environ.get("EVAL_OWNER_NAME", "")   # the user's first name: masked for the judge, never stored here
MASK = [(re.compile(r"\bSinzi\b"), "the agent")]
if OWNER:
    MASK += [(re.compile(rf"\b{re.escape(OWNER)}'s\b"), "the user's"), (re.compile(rf"\b{re.escape(OWNER)}\b"), "the user")]


def outdir(label):
    d = HERE / "out" / label
    d.mkdir(parents=True, exist_ok=True)
    return d


def git_show(base, path):
    return subprocess.run(["git", "show", f"{base}:{path}"], cwd=REPO, capture_output=True, text=True, check=True).stdout


def linked_rules():
    d = pathlib.Path.home() / ".claude" / "rules"
    return sorted(p.name for p in d.glob("*.md"))


def build(a):
    arms = outdir(a.label) / "arms"
    arms.mkdir(exist_ok=True)
    names = linked_rules()
    local_new = LOCAL.read_text()
    local_old = local_new.split(LOCAL_CUT)[0].rstrip() + "\n"
    if local_old == local_new:
        sys.exit(f"cut marker not found in {LOCAL}")

    def pack(profile, rules, local):
        parts = [f"Contents of ~/.claude/CLAUDE.md (global instructions):\n\n{profile}"]
        parts += [f"Contents of ~/.claude/rules/{n} (global instructions):\n\n{t}" for n, t in rules]
        if local:
            parts.append(f"Contents of ~/CLAUDE.local.md (machine-local instructions):\n\n{local}")
        return "# Instructions for this session\n\n" + "\n\n".join(parts)

    old = pack(git_show(a.base, PROFILE), [(n, git_show(a.base, f"{RULES}/{n}")) for n in names], local_old)
    cur_rules = [(n, (REPO / RULES / n).read_text()) for n in names]
    cur_profile = (REPO / PROFILE).read_text()
    for arm, text in (("old", old), ("new", pack(cur_profile, cur_rules, local_new)), ("bare", pack(cur_profile, cur_rules, ""))):
        (arms / f"{arm}.md").write_text(text)
        print(f"{arm}: {len(text)} chars")


def claude(prompt, cwd, model, budget, system_file=None):
    cmd = CLAUDE + ["--model", model, "--tools", "", "--max-budget-usd", str(budget)]
    if system_file:
        cmd += ["--append-system-prompt-file", str(system_file)]
    env = dict(os.environ, CLAUDE_CODE_DISABLE_CLAUDE_MDS="1")
    r = subprocess.run(cmd, cwd=cwd, input=prompt, capture_output=True, text=True, timeout=900, env=env)
    return r.stdout.strip(), r.returncode, r.stderr.strip()[-400:]


def gen_one(out, t, arm, i, model):
    f = out / "gen" / f"{t['id']}-{arm}-{i}.md"
    if f.exists() and f.stat().st_size > 0:
        return f"skip {f.name}"
    cwd = out / "cwd"
    cwd.mkdir(exist_ok=True)
    text, code, err = claude(PLAN + t["prompt"], cwd, model, 1, out / "arms" / f"{arm}.md")
    if code != 0 or not text:
        return f"FAILED {f.name}: exit {code} {err}"
    f.write_text(text)
    return f"gen {f.name}"


def gen(a):
    out = outdir(a.label)
    (out / "gen").mkdir(exist_ok=True)
    jobs = [(t, arm, i) for t in TASKS for arm in ARMS for i in range(a.n)]
    with cf.ThreadPoolExecutor(a.j) as ex:
        for msg in ex.map(lambda x: gen_one(out, *x, a.m), jobs):
            print(msg, flush=True)


def check(pattern, text):
    pattern = pattern.replace("{owner}", re.escape(OWNER) if OWNER else r"(?!x)x")
    if pattern.startswith("NOT:"):
        return re.search(pattern[4:], text) is None
    return re.search(pattern, text) is not None


def grade(a):
    out = outdir(a.label)
    res = {}
    for f in sorted((out / "gen").glob("*.md")):
        tid, arm, _ = f.stem.rsplit("-", 2)
        t = next(x for x in TASKS if x["id"] == tid)
        text = f.read_text()
        for name, pat in t["checks"].items():
            res.setdefault(tid, {}).setdefault(name, {}).setdefault(arm, []).append(check(pat, text))
    (out / "grade.json").write_text(json.dumps(res, indent=1))
    print(f"graded {len(res)} tasks")


JUDGE = """You compare two answers to the same task. Two different instruction sets produced them.
You do not know which instructions produced which answer; judge only the answers.

Task given to the agent:
{task}

What a good answer does:
{good}

=== Answer A ===
{a}

=== Answer B ===
{b}

Which answer does the good-answer description better? Judge substance, not length or polish.
Reply with one JSON object and nothing else:
{{"winner": "A" or "B" or "tie", "reason": "<one or two sentences>"}}"""


def mask(text):
    for rx, rep in MASK:
        text = rx.sub(rep, text)
    return text


def judge_one(out, t, left, right, tag, order, model):
    f = out / "judge" / f"{t['id']}-{tag}-{order}.json"
    if f.exists():
        return f"skip {f.name}"
    la, lb = (left, right) if order == 0 else (right, left)
    fa, fb = out / "gen" / f"{t['id']}-{la}.md", out / "gen" / f"{t['id']}-{lb}.md"
    if not (fa.exists() and fb.exists()):
        return f"MISSING answers for {f.name}"
    prompt = JUDGE.format(task=t["prompt"], good=t["good"], a=mask(fa.read_text()), b=mask(fb.read_text()))
    text, code, err = claude(prompt, out, model, 2)
    m = re.search(r"\{.*\}", text, re.S)
    try:
        v = json.loads(m.group(0))
    except Exception:
        return f"FAILED {f.name}: exit {code} {err or text[:200]}"
    win = {"A": la, "B": lb}.get(v.get("winner"), "tie")
    f.write_text(json.dumps({"winner": win, "reason": v.get("reason", ""), "a": la, "b": lb}))
    return f"judged {f.name}: {win}"


def judge(a):
    out = outdir(a.label)
    (out / "judge").mkdir(exist_ok=True)
    jobs = []
    for t in TASKS:
        if t["feature"]:
            continue
        for x, y in PAIRS:
            for i in range(a.n):
                jobs += [(t, f"{x}-{i}", f"{y}-{i}", f"{x}_{y}-{i}", o) for o in (0, 1)]
        jobs += [(t, "old-0", "old-1", "noise_old-0", o) for o in (0, 1)]   # same-arm pair: the noise floor
    with cf.ThreadPoolExecutor(a.j) as ex:
        for msg in ex.map(lambda x: judge_one(out, *x, a.m), jobs):
            print(msg, flush=True)


def report(a):
    out = outdir(a.label)
    lines = [f"# Instruction-set A/B: {a.label}", "", "## Blind judge (a pair counts only when both orders agree)", ""]
    groups = {}
    for f0 in sorted((out / "judge").glob("*-0.json")):
        f1 = f0.with_name(f0.name[:-7] + "-1.json")
        if not f1.exists():
            continue
        v0, v1 = json.loads(f0.read_text()), json.loads(f1.read_text())
        tid, tag = re.match(r"(.+?)-((?:old_new|old_bare|noise_old)-\d)$", f0.stem[:-2]).groups()
        kind = tag.rsplit("-", 1)[0]
        left, right = v0["a"].rsplit("-", 1)[0], v0["b"].rsplit("-", 1)[0]
        if kind == "noise_old":
            verdict = "agree" if v0["winner"] == v1["winner"] and v0["winner"] != "tie" else "no count"
        else:
            w0, w1 = v0["winner"].rsplit("-", 1)[0], v1["winner"].rsplit("-", 1)[0]
            verdict = w0 if w0 == w1 and w0 != "tie" else "no count"
        groups.setdefault(kind, []).append((tid, tag, verdict, v0["reason"], v1["reason"]))
    for kind, rows in groups.items():
        tally = {}
        for r in rows:
            tally[r[2]] = tally.get(r[2], 0) + 1
        lines += [f"### {kind}: " + ", ".join(f"{k} {v}" for k, v in sorted(tally.items())), "",
                  "| Task | Verdict | Reason (order 1) | Reason (order 2) |", "|---|---|---|---|"]
        lines += [f"| {tid} {tag[-1]} | {v} | {r0.replace('|', '/')} | {r1.replace('|', '/')} |" for tid, tag, v, r0, r1 in rows]
        lines.append("")
    g = json.loads((out / "grade.json").read_text())
    lines += ["## Hard checks (passes / samples per arm)", "", "| Task | Check | old | new | bare |", "|---|---|---|---|---|"]
    for tid, checks in g.items():
        for name, arms in checks.items():
            cell = lambda arm: f"{sum(arms.get(arm, []))}/{len(arms.get(arm, []))}"
            lines.append(f"| {tid} | {name} | {cell('old')} | {cell('new')} | {cell('bare')} |")
    (out / "REPORT.md").write_text("\n".join(lines) + "\n")
    print(out / "REPORT.md")


if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("cmd", choices=["build", "gen", "grade", "judge", "report"])
    p.add_argument("--label", required=True)
    p.add_argument("--base", default="main")
    p.add_argument("-n", type=int, default=2)
    p.add_argument("-j", type=int, default=6)
    p.add_argument("-m", default=None)
    a = p.parse_args()
    a.m = a.m or ("claude-fable-5-2" if a.cmd == "judge" else "claude-sonnet-5-5")
    {"build": build, "gen": gen, "grade": grade, "judge": judge, "report": report}[a.cmd](a)
