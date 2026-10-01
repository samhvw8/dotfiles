#!/usr/bin/env python3
"""council.py: the state machine behind /council full mode.

A full council runs a creative session as rounds of file-based sub-agents, so it
scales past the 2 to 4 live teammates of a live council, needs no agent-teams flag,
and survives a context compaction: everything lives in council.json.

    python3 council.py plan [--members 8 --cross 2 --judges 3 --shortlist 4]   # calls per phase. Writes nothing.
    python3 council.py deal --members 4 [--preset P] [--seed S]                # cards only, for a live council
    python3 council.py presets                                                 # the preset lens sets
    python3 council.py init --brief-file brief.md [--members 8] [--preset P | --lenses a,b,c] [--seed S]
    python3 council.py next                       # what to do now, and the exact command for it
    python3 council.py prompts <phase>            # write the briefs, list the jobs still to run
    python3 council.py check <phase>              # which outputs are still missing
    python3 council.py collect                    # read the pool or the judges' scores into the state
    python3 council.py status                     # where the run is
    python3 council.py harvest                    # shortlist, scores, lineage and the files to read
    python3 council.py card <member>              # one member's card

Phases, in order: diverge, cross1 .. crossC, cluster, score, develop, stress.
Every command takes --dir; without it, the run named in .council/LATEST is used.

Python 3.8+, standard library only.
"""
import argparse
import json
import os
import random
import re
import sys
import time

HERE = os.path.dirname(os.path.abspath(__file__))
SELF = os.path.abspath(__file__)
SKILL_PATH = os.path.join(HERE, "SKILL.md")

ROOT = ".council"
LATEST = "LATEST"
STATE_FILE = "council.json"
TEMPLATES = ("diverge", "cross", "curator", "judge", "developer", "stress")

DEFAULTS = {"members": 8, "cross": 2, "judges": 3, "shortlist": 4, "parallel": 6}
QUICK = {"members": 5, "cross": 1, "judges": 2, "shortlist": 3}



# ---------------------------------------------------------------- the deck

def _find_deck():
    """deck.py lives in the heavy-think skill next door. Try it beside this file first
    (the linked skills folder), then beside the real file (the dotfiles copy)."""
    for base in (HERE, os.path.dirname(os.path.realpath(__file__))):
        cand = os.path.join(os.path.dirname(base), "heavy-think")
        if os.path.isfile(os.path.join(cand, "deck.py")):
            return cand
    raise SystemExit("council: needs the heavy-think skill (deck.py and references/perspectives.json) "
                     "beside it. Link heavy-think into this profile.")


sys.path.insert(0, _find_deck())
import deck as D  # noqa: E402

load_deck = D.load_deck
deal_cards = D.deal_cards
RUBRIC_PATH = D.RUBRIC_PATH


class CouncilError(Exception):
    pass


def member_ids(n):
    return ["m%02d" % i for i in range(1, n + 1)]


def make_ring(members, agents, seed):
    """Seat the members in a ring where neighbours come from different families
    wherever possible. Cross-pollination partners are read off this ring."""
    rng = random.Random("council-ring:%s" % seed)
    left = list(members)
    rng.shuffle(left)
    ring = [left.pop(0)]
    while left:
        fam = agents[ring[-1]]["card"]["lens"]["family"]
        j = next((k for k, m in enumerate(left) if agents[m]["card"]["lens"]["family"] != fam), 0)
        ring.append(left.pop(j))
    return ring


def partners(state, member, rnd):
    """Cross round k reads the members k seats away on both sides of the ring. The last
    round also reads the member straight across the ring, so ideas from opposite sides
    meet before the curator, not only inside it."""
    ring = state["ring"]
    n = len(ring)
    i = ring.index(member)
    offsets = [rnd, -rnd]
    if rnd == state["cross"] and n >= 5:
        offsets.append(n // 2)
    out = []
    for off in offsets:
        p = ring[(i + off) % n]
        if p != member and p not in out:
            out.append(p)
    return out


# ---------------------------------------------------------------- phases and paths

def phases(state):
    return ["diverge"] + ["cross%d" % k for k in range(1, state["cross"] + 1)] + \
        ["cluster", "score", "develop", "stress"]


def stage_file(d, member, stage):
    """stage 0 is the member's diverge file, stage k its cross round k file."""
    if stage == 0:
        return os.path.join(d, "diverge", member + ".md")
    return os.path.join(d, "cross%d" % stage, member + ".md")


def pool_out(d):
    return os.path.join(d, "pool.json")


def score_out(d, judge):
    return os.path.join(d, "score", judge + ".json")


def develop_out(d, cid):
    return os.path.join(d, "develop", cid + ".md")


def stress_out(d, cid):
    return os.path.join(d, "stress", cid + ".md")


def prompt_path(d, phase, job_id):
    return os.path.join(d, "prompts", phase, job_id + ".md")


def _has_output(path):
    return os.path.isfile(path) and os.path.getsize(path) > 0


def judge_ids(state):
    return ["j%d" % i for i in range(1, state["judges"] + 1)]


def all_idea_files(state):
    d = state["dir"]
    files = []
    for m in sorted(state["members"]):
        for stage in range(0, state["cross"] + 1):
            files.append(stage_file(d, m, stage))
    return files


# ---------------------------------------------------------------- state

def new_state(n, seed, deck, run_dir, cross, judges, shortlist, parallel, preset=None, explicit=None,
              rubric=None, techniques=True):
    run_dir = os.path.abspath(run_dir)
    ids = member_ids(n)
    rubric = rubric or D.preset_rubric(deck, preset) or "creative"
    weights = D.rubric_weights(deck, rubric)
    agents = {}
    for mid, card in zip(ids, deal_cards(n, seed, deck, preset, explicit, techniques=techniques)):
        agents[mid] = {"card": card}
    state = {
        "version": 2,
        "created": time.strftime("%Y-%m-%d %H:%M:%S"),
        "seed": seed,
        "dir": run_dir,
        "members_n": n,
        "cross": cross,
        "judges": judges,
        "shortlist_n": shortlist,
        "pool_max": max(shortlist * 3, 8),
        "parallel": parallel,
        "preset": preset,
        "rubric": rubric,
        "weights": weights,
        "members": agents,
        "pool": None,
        "scores": None,
        "shortlist": None,
    }
    state["ring"] = make_ring(ids, agents, seed)
    return state


def plan_rows(n, cross, judges, shortlist):
    return [("diverge", n)] + [("cross%d" % k, n) for k in range(1, cross + 1)] + \
        [("cluster", 1), ("score", judges), ("develop", shortlist), ("stress", shortlist)]


# ---------------------------------------------------------------- jobs

def phase_jobs(state, phase):
    if phase not in phases(state):
        raise CouncilError("unknown phase '%s' (one of: %s)" % (phase, ", ".join(phases(state))))
    d = state["dir"]
    jobs = []
    if phase == "diverge" or phase.startswith("cross"):
        stage = 0 if phase == "diverge" else int(phase[5:])
        for m in sorted(state["members"]):
            jobs.append({"id": "%s.%s" % (m, phase), "kind": "diverge" if stage == 0 else "cross",
                         "phase": phase, "member": m, "stage": stage,
                         "outputs": [stage_file(d, m, stage)]})
    elif phase == "cluster":
        jobs.append({"id": "curator", "kind": "curator", "phase": phase, "outputs": [pool_out(d)]})
    elif phase == "score":
        if state["pool"] is not None:
            for j in judge_ids(state):
                jobs.append({"id": j, "kind": "judge", "phase": phase, "judge": j,
                             "outputs": [score_out(d, j)]})
    elif phase in ("develop", "stress"):
        for cid in state["shortlist"] or []:
            out = develop_out(d, cid) if phase == "develop" else stress_out(d, cid)
            jobs.append({"id": "%s.%s" % (cid, phase), "kind": "developer" if phase == "develop" else "stress",
                         "phase": phase, "concept": cid, "outputs": [out]})
    for j in jobs:
        j["prompt"] = prompt_path(d, phase, j["id"])
    return jobs


def missing_jobs(jobs):
    return [j for j in jobs if not all(_has_output(p) for p in j["outputs"])]


def next_action(state):
    """(phase, jobs_left, jobs_total). phase is a phase name, 'collect' or 'done'."""
    for phase in phases(state):
        if phase == "score" and state["pool"] is None:
            return "collect", [], []
        if phase == "develop" and state["shortlist"] is None:
            return "collect", [], []
        jobs = phase_jobs(state, phase)
        left = missing_jobs(jobs)
        if left:
            return phase, left, jobs
    return "done", [], []


# ---------------------------------------------------------------- templates

_TEMPLATE_RE = re.compile(r"<!-- template:([a-z]+) -->\s*```text\n(.*?)\n```\s*<!-- /template:\1 -->", re.S)
_PLACEHOLDER_RE = re.compile(r"\{\{(\w+)\}\}")


def load_templates(path=SKILL_PATH):
    with open(path, encoding="utf-8") as fh:
        text = fh.read()
    found = {m.group(1): m.group(2) for m in _TEMPLATE_RE.finditer(text)}
    missing = [t for t in TEMPLATES if t not in found]
    if missing:
        raise CouncilError("SKILL.md is missing prompt templates: %s" % ", ".join(missing))
    return found


def fill(template, values):
    """One pass, so a brief that itself contains {{braces}} is left exactly as written."""
    wanted = set(_PLACEHOLDER_RE.findall(template))
    missing = sorted(wanted - set(values))
    if missing:
        raise CouncilError("no value for placeholder(s): %s" % ", ".join(missing))
    return _PLACEHOLDER_RE.sub(lambda m: str(values[m.group(1)]), template)


def read_brief(state):
    with open(os.path.join(state["dir"], "brief.md"), encoding="utf-8") as fh:
        return fh.read().rstrip("\n")


def _bullets(paths):
    return "\n".join("- " + p for p in paths)


def concept(state, cid):
    for c in state["pool"] or []:
        if c["id"] == cid:
            return c
    raise CouncilError("no concept '%s' in the pool" % cid)


def render_job(state, job, templates, brief):
    d = state["dir"]
    v = {"brief": brief, "council_dir": d, "rubric": os.path.join(d, "rubric.md"),
         "n": state["members_n"], "out": job["outputs"][0]}
    kind = job["kind"]
    if kind in ("diverge", "cross"):
        m = job["member"]
        card = state["members"][m]["card"]
        v.update(member=m, lens_name=card["lens"]["name"], lens_asks=card["lens"]["asks"],
                 lens_delivers=card["lens"].get("delivers", "A direct answer to your lens's question."),
                 lens_sees=card["lens"]["sees"], lens_misses=card["lens"]["misses"],
                 technique_name=card["technique"]["name"], technique_how=card["technique"]["how"])
        if kind == "cross":
            k = job["stage"]
            ps = partners(state, m, k)
            reads = []
            for p in ps:
                reads.append(stage_file(d, p, k - 1))
                if k - 1 > 0:
                    reads.append(stage_file(d, p, 0))
            v.update(round=k, own_file=stage_file(d, m, k - 1), partner_files=_bullets(reads),
                     partners=", ".join(ps))
            if k == state["cross"]:
                v["provocation"] = ("The facilitator's provocation for this round. Answer it with at least one "
                                    "build: \"%s\"" % card["provocation"]["text"])
            else:
                v["provocation"] = "No provocation this round."
    elif kind == "curator":
        v.update(idea_files=_bullets(all_idea_files(state)), pool_max=state["pool_max"], orphan_slots=ORPHAN_SLOTS)
    elif kind == "judge":
        crit = [k for k, _ in state["weights"]]
        v.update(judge=job["judge"], pool=pool_out(d), profile=state["rubric"],
                 criteria=", ".join("%s (%d)" % tuple(kv) for kv in state["weights"]),
                 score_fields=", ".join('"%s": 0' % k for k in crit))
    elif kind in ("developer", "stress"):
        c = concept(state, job["concept"])
        srcs = sorted(set(stage_file(d, m, s) for m in c.get("members", []) if m in state["members"]
                          for s in range(0, state["cross"] + 1)))
        v.update(concept_id=c["id"], concept_title=c["title"], concept_pitch=c["pitch"],
                 parents=", ".join(c.get("parents", [])) or "none listed", source_files=_bullets(srcs) or "- none",
                 develop_file=develop_out(d, c["id"]))
    return fill(templates[kind], v)


def write_prompts(state, phase):
    jobs = phase_jobs(state, phase)
    left = missing_jobs(jobs)
    if not left:
        return left
    templates = load_templates()
    brief = read_brief(state)
    for j in left:
        for p in j["outputs"] + [j["prompt"]]:
            os.makedirs(os.path.dirname(p), exist_ok=True)
        with open(j["prompt"], "w", encoding="utf-8") as fh:
            fh.write(render_job(state, j, templates, brief) + "\n")
    return left


# ---------------------------------------------------------------- collect

def extract_json(text):
    text = text.strip()
    try:
        return json.loads(text)
    except ValueError:
        pass
    i, j = text.find("{"), text.rfind("}")
    if i != -1 and j > i:
        try:
            return json.loads(text[i:j + 1])
        except ValueError:
            return None
    return None


def _set_aside(path):
    os.replace(path, path + ".unreadable")


ORPHAN_SLOTS = 3


def parse_pool(state, data):
    """Concepts, plus up to ORPHAN_SLOTS orphans: single odd ideas the curator copies
    as written instead of folding them into a tamer concept."""
    if not isinstance(data, dict) or not isinstance(data.get("concepts"), list) or not data["concepts"]:
        raise CouncilError("pool.json needs a non-empty 'concepts' list")
    orphans = data.get("orphans") if isinstance(data.get("orphans"), list) else []
    items = [(c, False) for c in data["concepts"][:state["pool_max"]]] + \
        [(c, True) for c in orphans[:ORPHAN_SLOTS]]
    out, seen = [], set()
    for c, orphan in items:
        if not isinstance(c, dict):
            raise CouncilError("a concept is not a JSON object")
        cid = str(c.get("id") or "").strip().upper()
        if not re.match(r"^C\d+$", cid) or cid in seen:
            raise CouncilError("concept id '%s' is missing, malformed (want C01) or repeated" % cid)
        if not str(c.get("title") or "").strip() or not str(c.get("pitch") or "").strip():
            raise CouncilError("concept %s needs a title and a pitch" % cid)
        parents = [str(p).strip().lower() for p in c.get("parents") or []]
        members = sorted(set(str(m).strip().lower() for m in (c.get("members") or [])) |
                         set(p.split(".")[0] for p in parents if re.match(r"^m\d+\.", p)))
        seen.add(cid)
        out.append({"id": cid, "title": str(c["title"]).strip(), "pitch": str(c["pitch"]).strip(),
                    "parents": parents, "members": [m for m in members if m in state["members"]],
                    "orphan": orphan})
    return out


def weighted_total(scores, weights):
    if not isinstance(scores, dict):
        return None
    total = 0.0
    for key, weight in weights:
        v = scores.get(key)
        if isinstance(v, bool):
            return None
        try:
            v = float(v)
        except (TypeError, ValueError):
            return None
        total += max(0.0, min(10.0, v)) * weight
    return round(total / 10.0, 2)


def _truthy(v):
    if isinstance(v, str):
        return v.strip().lower() in ("true", "yes", "1")
    return bool(v)


def tally(state, verdicts):
    """Average the judges per concept, drop the majority off-brief ones, and take the
    top of the table. The last slot is the dissent slot: the concept one judge loved
    most that the average left out, when that judge's total beats the slot's average.
    Divisive ideas are where the novelty usually is."""
    table = {}
    for c in state["pool"]:
        totals, off, nov = [], 0, []
        for v in verdicts:
            s = (v.get("scores") or {}).get(c["id"])
            t = weighted_total(s, state["weights"])
            if t is None:
                continue
            totals.append(t)
            nov.append(float(s.get(state["weights"][0][0], 0)))
            off += 1 if _truthy(s.get("off_brief")) else 0
        if not totals:
            continue
        table[c["id"]] = {"mean": round(sum(totals) / len(totals), 2), "max": max(totals),
                          "spread": round(max(totals) - min(totals), 2), "judges": len(totals),
                          "novelty": round(sum(nov) / len(nov), 2), "off_brief": off * 2 > len(totals)}
    eligible = sorted((cid for cid, r in table.items() if not r["off_brief"]),
                      key=lambda cid: (-table[cid]["mean"], -table[cid]["novelty"], cid))
    k = min(state["shortlist_n"], len(eligible))
    short = eligible[:k]
    if k >= 2:
        rest = [cid for cid in eligible if cid not in short]
        if rest:
            dissent = max(rest, key=lambda cid: (table[cid]["max"], table[cid]["spread"]))
            if table[dissent]["max"] > table[short[-1]]["mean"]:
                table[dissent]["dissent"] = True
                short[-1] = dissent
    return table, short


def collect(state):
    d = state["dir"]
    if state["pool"] is None:
        path = pool_out(d)
        if not _has_output(path):
            return [("pool", "missing", "")]
        with open(path, encoding="utf-8", errors="replace") as fh:
            data = extract_json(fh.read())
        try:
            state["pool"] = parse_pool(state, data)
        except (CouncilError, D.DeckError) as e:
            _set_aside(path)
            return [("pool", "unreadable", str(e))]
        return [("pool", "recorded", "%d concepts" % len(state["pool"]))]
    if state["shortlist"] is None:
        results, verdicts = [], []
        for j in judge_ids(state):
            path = score_out(d, j)
            if not _has_output(path):
                results.append((j, "missing", ""))
                continue
            with open(path, encoding="utf-8", errors="replace") as fh:
                v = extract_json(fh.read())
            if not isinstance(v, dict) or not isinstance(v.get("scores"), dict):
                _set_aside(path)
                results.append((j, "unreadable", "no 'scores' object"))
                continue
            v["scores"] = {str(k).strip().upper(): s for k, s in v["scores"].items()}
            verdicts.append(v)
            results.append((j, "read", "%d concepts scored" % len(v["scores"])))
        if any(r[1] != "read" for r in results):
            return results
        table, short = tally(state, verdicts)
        if not short:
            raise CouncilError("no concept survived scoring (all off-brief?). Rerun cluster or narrow the brief")
        state["scores"], state["shortlist"] = table, short
        results.append(("shortlist", "recorded", ", ".join(short)))
        return results
    return []


# ---------------------------------------------------------------- io

def run_dir_from(args):
    if getattr(args, "dir", None):
        return os.path.abspath(args.dir)
    latest = os.path.join(ROOT, LATEST)
    if not os.path.isfile(latest):
        raise CouncilError("no council here: run init first, or pass --dir")
    with open(latest, encoding="utf-8") as fh:
        return os.path.abspath(os.path.join(ROOT, fh.read().strip()))


def load_state(args):
    d = run_dir_from(args)
    path = os.path.join(d, STATE_FILE)
    if not os.path.isfile(path):
        raise CouncilError("no %s in %s" % (STATE_FILE, d))
    with open(path, encoding="utf-8") as fh:
        return json.load(fh)


def save_state(state):
    path = os.path.join(state["dir"], STATE_FILE)
    tmp = path + ".tmp"
    with open(tmp, "w", encoding="utf-8") as fh:
        json.dump(state, fh, indent=2)
    os.replace(tmp, path)


def _cmd(*parts):
    return " ".join(["python3", '"%s"' % SELF] + list(parts))


def _card_line(card):
    return "%s (%s) + %s" % (card["lens"]["name"], card["lens"]["family"], card["technique"]["name"])


def _sizes(args):
    base = dict(DEFAULTS)
    if getattr(args, "quick", False):
        base.update(QUICK)
    for key in ("members", "cross", "judges", "shortlist", "parallel"):
        val = getattr(args, key, None)
        if val is not None:
            base[key] = val
    if base["cross"] < 1:
        raise CouncilError("--cross must be at least 1: cross-pollination is the point of a council")
    if base["judges"] < 1 or base["shortlist"] < 1:
        raise CouncilError("--judges and --shortlist must be at least 1")
    return base


# ---------------------------------------------------------------- commands

def cmd_plan(args):
    s = _sizes(args)
    rows = plan_rows(s["members"], s["cross"], s["judges"], s["shortlist"])
    total = sum(n for _, n in rows)
    for name, n in rows:
        print("%-9s %3d call%s" % (name, n, "" if n == 1 else "s"))
    print("total     %3d sub-agent calls, at most %d in flight" % (total, s["parallel"]))
    print("summary: %d members, %d cross round%s, %d judges, %d on the shortlist, %d calls"
          % (s["members"], s["cross"], "" if s["cross"] == 1 else "s", s["judges"], s["shortlist"], total))


def cmd_deal(args):
    D.cmd_deal(args)


def cmd_presets(args):
    D.cmd_presets(args)


def cmd_init(args):
    deck = load_deck()
    s = _sizes(args)
    if args.brief_file:
        with open(args.brief_file, encoding="utf-8") as fh:
            brief = fh.read()
    elif args.brief:
        brief = args.brief
    else:
        raise CouncilError("pass --brief-file or --brief")
    if not brief.strip():
        raise CouncilError("the brief is empty")
    seed = args.seed if args.seed is not None else random.randrange(1, 10 ** 6)
    explicit = D.parse_lens_spec(args.lenses, deck) if args.lenses else None
    # Fit the deck to the brief before dealing: Jev, else BM25, else the whole pool (deck.py).
    full = deck
    deck, relevance = D.fit_deck(deck, brief, s["members"], mode=args.relevance, minimum=args.relevance_min,
                                 techniques=not args.no_technique, preset=args.preset, key=D._key())
    name = time.strftime("%Y%m%d-%H%M%S")
    run_dir = os.path.join(ROOT, name)
    os.makedirs(run_dir, exist_ok=False)
    state = new_state(s["members"], seed, deck, run_dir, s["cross"], s["judges"], s["shortlist"],
                      s["parallel"], args.preset, explicit, rubric=args.rubric, techniques=not args.no_technique)
    state["relevance"] = ({k: relevance.get(k) for k in ("method", "model", "minimum", "fallback", "notes")}
                          if relevance else None)
    if relevance:
        with open(os.path.join(run_dir, "relevance.json"), "w", encoding="utf-8") as fh:
            json.dump(relevance, fh, indent=1)
            fh.write("\n")
    with open(os.path.join(run_dir, "brief.md"), "w", encoding="utf-8") as fh:
        fh.write(brief.rstrip("\n") + "\n")
    with open(RUBRIC_PATH, encoding="utf-8") as src, \
            open(os.path.join(run_dir, "rubric.md"), "w", encoding="utf-8") as dst:
        dst.write(src.read())
    save_state(state)
    with open(os.path.join(ROOT, LATEST), "w", encoding="utf-8") as fh:
        fh.write(name + "\n")
    total = sum(n for _, n in plan_rows(s["members"], s["cross"], s["judges"], s["shortlist"]))
    print("council %s: %d members, seed %s, %s rubric, %d calls"
          % (state["dir"], s["members"], seed, state["rubric"], total))
    for line in D.report_lines(relevance, full):
        print(line)
    for m in sorted(state["members"]):
        print("  %s  %s" % (m, _card_line(state["members"][m]["card"])))
    print("next: %s" % _cmd("next"))


def cmd_next(args):
    state = load_state(args)
    phase, left, jobs = next_action(state)
    if phase == "done":
        print("DONE. Run %s, then read the develop and stress files it lists." % _cmd("harvest"))
    elif phase == "collect":
        print("collect: %s" % _cmd("collect"))
    else:
        print("phase %s: %d of %d jobs left" % (phase, len(left), len(jobs)))
        print("run: %s" % _cmd("prompts", phase))


def cmd_prompts(args):
    state = load_state(args)
    left = write_prompts(state, args.phase)
    if not left:
        print("nothing left in %s. %s" % (args.phase, _cmd("next")))
        return
    print("%d job%s in %s. Keep at most %d in flight; launch the next as each finishes:"
          % (len(left), "" if len(left) == 1 else "s", args.phase, state["parallel"]))
    for j in left:
        print("  %-18s %s" % (j["id"], j["prompt"]))


def cmd_check(args):
    state = load_state(args)
    jobs = phase_jobs(state, args.phase)
    left = missing_jobs(jobs)
    print("%s: %d of %d done" % (args.phase, len(jobs) - len(left), len(jobs)))
    for j in left:
        for p in j["outputs"]:
            if not _has_output(p):
                print("  missing %s (%s)" % (p, j["id"]))


def cmd_collect(args):
    state = load_state(args)
    results = collect(state)
    save_state(state)
    if not results:
        print("nothing to collect")
    for what, status, note in results:
        print("%-10s %-10s %s" % (what, status, note))
    print("next: %s" % _cmd("next"))


def cmd_status(args):
    state = load_state(args)
    print("council %s, seed %s, %d members" % (state["dir"], state["seed"], state["members_n"]))
    for phase in phases(state):
        try:
            jobs = phase_jobs(state, phase)
        except CouncilError:
            jobs = []
        if not jobs:
            print("  %-9s waiting" % phase)
            continue
        done = len(jobs) - len(missing_jobs(jobs))
        print("  %-9s %d/%d" % (phase, done, len(jobs)))
    if state["pool"] is not None:
        print("pool: %d concepts" % len(state["pool"]))
    if state["shortlist"]:
        print("shortlist: %s" % ", ".join(state["shortlist"]))


def cmd_harvest(args):
    state = load_state(args)
    if not state["shortlist"]:
        raise CouncilError("no shortlist yet: %s" % _cmd("next"))
    members = state["members"]
    table = state["scores"] or {}
    print("SHORTLIST")
    for cid in state["shortlist"]:
        c = concept(state, cid)
        r = table.get(cid, {})
        lenses = ", ".join("%s %s" % (m, members[m]["card"]["lens"]["name"]) for m in c["members"]) or "?"
        tag = "  [dissent slot: one judge scored it %s]" % r.get("max") if r.get("dissent") else ""
        tag += "  [orphan: one member's idea, kept as written]" if c.get("orphan") else ""
        print("\n%s  %s  mean %s, spread %s%s" % (cid, c["title"], r.get("mean"), r.get("spread"), tag))
        print("  pitch: %s" % c["pitch"])
        print("  lineage: %s" % (", ".join(c["parents"]) or "none"))
        print("  lenses: %s" % lenses)
        print("  read: %s" % develop_out(state["dir"], cid))
        print("        %s" % stress_out(state["dir"], cid))
    rest = sorted((cid for cid in table if cid not in state["shortlist"]),
                  key=lambda cid: -table[cid]["mean"])
    if rest:
        print("\nREST OF THE POOL")
        for cid in rest:
            r = table[cid]
            flag = " OFF-BRIEF" if r["off_brief"] else ""
            print("  %s  %-6s spread %-6s %s%s" % (cid, r["mean"], r["spread"], concept(state, cid)["title"], flag))
    print("\nrun folder: %s" % state["dir"])


def cmd_card(args):
    state = load_state(args)
    m = args.member.strip().lower()
    if m not in state["members"]:
        raise CouncilError("no member '%s'" % m)
    c = state["members"][m]["card"]
    print("%s: %s" % (m, _card_line(c)))
    print("  asks: %s" % c["lens"]["asks"])
    print("  technique: %s" % c["technique"]["how"])
    print("  provocation: %s" % c["provocation"]["text"])


def build_parser():
    p = argparse.ArgumentParser(prog="council.py", description="state machine for /council full mode")
    sub = p.add_subparsers(dest="cmd", required=True)
    common = argparse.ArgumentParser(add_help=False)
    common.add_argument("--dir", help="run folder (default: .council/LATEST)")
    sizes = argparse.ArgumentParser(add_help=False)
    sizes.add_argument("--members", type=int)
    sizes.add_argument("--cross", type=int, help="cross-pollination rounds")
    sizes.add_argument("--judges", type=int)
    sizes.add_argument("--shortlist", type=int)
    sizes.add_argument("--parallel", type=int, help="sub-agents in flight at once")
    sizes.add_argument("--quick", action="store_true", help="5 members, 1 cross round, 2 judges, 3 shortlisted")

    sub.add_parser("plan", parents=[sizes], help="calls per phase")
    s = sub.add_parser("deal", help="deal cards without starting a run (live council)")
    s.add_argument("--members", type=int, default=4)
    s.add_argument("--preset")
    s.add_argument("--lenses", help="deck ids and/or custom 'Name: question'")
    s.add_argument("--no-technique", action="store_true")
    s.add_argument("--seed")
    D.add_relevance_args(s)
    sub.add_parser("presets", help="list preset lens sets")
    s = sub.add_parser("init", parents=[sizes], help="deal the cards and write council.json")
    s.add_argument("--brief-file")
    s.add_argument("--brief")
    s.add_argument("--preset")
    s.add_argument("--lenses", help="deck ids and/or custom 'Name: question'")
    s.add_argument("--rubric", choices=("creative", "decision"), help="default: the preset's, else creative")
    s.add_argument("--no-technique", action="store_true", help="lenses only")
    s.add_argument("--seed")
    s.add_argument("--relevance", choices=("auto", "jev", "bm25", "off"), default="auto",
                   help="fit the deck to the brief first: auto (default) uses Jev if TYPESAFE_API_KEY is "
                        "set, else BM25. jev: Jev or fail. bm25: BM25 only. off: the whole deck")
    s.add_argument("--relevance-min", type=float, default=D.RELEVANCE_MIN,
                   help="the bar an entry must clear (default %g)" % D.RELEVANCE_MIN)
    sub.add_parser("next", parents=[common], help="what to do now")
    for name in ("prompts", "check"):
        s = sub.add_parser(name, parents=[common])
        s.add_argument("phase")
    sub.add_parser("collect", parents=[common], help="read the pool or the scores")
    sub.add_parser("status", parents=[common])
    sub.add_parser("harvest", parents=[common], help="shortlist, scores, lineage")
    s = sub.add_parser("card", parents=[common])
    s.add_argument("member")
    return p


def main(argv=None):
    args = build_parser().parse_args(argv)
    handler = globals()["cmd_" + args.cmd]
    try:
        handler(args)
    except CouncilError as e:
        print("council: %s" % e, file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
