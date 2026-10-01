"""Tests for skills/arena/bracket.py. Standard library only.

    python3 -m unittest discover -s tests -v

The headline test drives a full 100-agent tournament through the real command
line with random winners and checks it ends with exactly one survivor.
"""
import collections
import json
import os
import random
import re
import shutil
import subprocess
import sys
import tempfile
import unittest

HERE = os.path.dirname(os.path.abspath(__file__))
SKILL = os.path.dirname(HERE)
REPO = SKILL
BRACKET = os.path.join(SKILL, "bracket.py")
sys.path.insert(0, SKILL)

import bracket as B  # noqa: E402

EM_DASH, EN_DASH = chr(0x2014), chr(0x2013)   # spelled as code points so this file stays clean


OFFLINE = {k: v for k, v in os.environ.items() if k != "TYPESAFE_API_KEY"}   # never call Jev from tests


def cli(*args):
    return subprocess.run([sys.executable, BRACKET] + [str(a) for a in args],
                          capture_output=True, text=True, env=OFFLINE)


def write(path, text):
    with open(path, "w", encoding="utf-8") as fh:
        fh.write(text)


def read(path):
    with open(path, encoding="utf-8") as fh:
        return fh.read()


def load(d):
    with open(os.path.join(d, "arena.json"), encoding="utf-8") as fh:
        return json.load(fh)


class TempDir(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.mkdtemp(prefix="arena-test-")
        self.cwd = os.getcwd()
        os.chdir(self.tmp)   # init writes .arena/LATEST into the working directory

    def tearDown(self):
        os.chdir(self.cwd)
        shutil.rmtree(self.tmp, ignore_errors=True)

    def ok(self, *args):
        r = cli(*args)
        self.assertEqual(r.returncode, 0, "bracket.py %s failed:\n%s%s" % (" ".join(map(str, args)), r.stdout, r.stderr))
        return r.stdout


class SimulatedTournament(TempDir):
    """Random winners, driven only through the CLI: init, pairings, record, advance, status, winner."""

    def run_tournament(self, n, seed):
        d = os.path.join(self.tmp, "run-%d" % n)
        self.ok("init", "--agents", n, "--seed", seed, "--task", "Simulated task.", "--dir", d)
        rng = random.Random(seed)
        alive_at_start = []
        while True:
            state = load(d)
            if state["champion"]:
                break
            rd = state["rounds"][-1]
            alive_at_start.append(len(rd["alive"]))
            out = self.ok("pairings", "--dir", d)
            self.assertIn("round %d:" % rd["n"], out)
            in_round = [x for m in rd["matches"] for x in (m["a"], m["b"])] + ([rd["bye"]] if rd["bye"] else [])
            self.assertEqual(sorted(in_round), sorted(rd["alive"]), "everyone alive plays once or gets the bye")
            self.assertEqual(len(in_round), len(set(in_round)))
            for m in rd["matches"]:
                self.ok("record", m["id"], rng.choice([m["a"], m["b"]]), "--reason", "simulated", "--dir", d)
            self.ok("advance", "--dir", d)
        alive_at_start.append(1)
        return d, load(d), alive_at_start

    def test_100_agents_reach_exactly_one_survivor(self):
        d, state, sizes = self.run_tournament(100, 7)
        self.assertEqual(sizes, [100, 50, 25, 13, 7, 4, 2, 1])
        self.assertEqual(len(state["rounds"]), 7)
        alive = [a for a, v in state["agents"].items() if v["alive"]]
        self.assertEqual(alive, [state["champion"]])
        dead = [v for v in state["agents"].values() if not v["alive"]]
        self.assertEqual(len(dead), 99)
        self.assertTrue(all(v["eliminated_in"] and v["eliminated_by"] for v in dead))
        self.assertEqual(sum(len(rd["matches"]) for rd in state["rounds"]), 99)
        self.assertEqual([rd["bye"] is not None for rd in state["rounds"]],
                         [False, False, True, True, True, False, False])
        self.assertTrue(all(v["byes"] <= 1 for v in state["agents"].values()), "no agent gets two byes")
        status = self.ok("status", "--dir", d)
        self.assertIn("now: 1 alive, 99 eliminated, champion %s" % state["champion"], status)
        won = self.ok("winner", "--dir", d)
        self.assertIn("CHAMPION  %s" % state["champion"], won)
        self.assertIn("7 played, 100 agents in, 1 left", won)
        self.assertIn("last one standing", self.ok("pairings", "--dir", d))

    def test_16_agents(self):
        _, state, sizes = self.run_tournament(16, 3)
        self.assertEqual(sizes, [16, 8, 4, 2, 1])
        self.assertEqual(len(state["rounds"]), 4)
        self.assertTrue(all(rd["bye"] is None for rd in state["rounds"]))
        self.assertEqual(sum(v["alive"] for v in state["agents"].values()), 1)

    def test_7_agents_with_a_bye(self):
        _, state, sizes = self.run_tournament(7, 11)
        self.assertEqual(sizes, [7, 4, 2, 1])
        self.assertEqual(len(state["rounds"]), 3)
        self.assertIsNotNone(state["rounds"][0]["bye"])
        self.assertEqual(sum(v["alive"] for v in state["agents"].values()), 1)

    def test_1_agent_is_already_the_winner(self):
        d, state, sizes = self.run_tournament(1, 1)
        self.assertEqual(sizes, [1])
        self.assertEqual(state["rounds"], [])
        self.assertEqual(state["champion"], "a001")
        self.assertIn("0 played, 1 agents in, 1 left", self.ok("winner", "--dir", d))
        self.assertIn("last one standing", self.ok("pairings", "--dir", d))

    def test_many_sizes_and_seeds_always_end_with_one(self):
        data = B.load_strategies()
        for n in (2, 3, 5, 9, 16, 31, 64, 100, 101, 144, 250):
            for seed in range(3):
                st = B.new_state(n, seed, data, os.path.join(self.tmp, "api"))
                rng = random.Random(seed)
                sizes = []
                while not st["champion"]:
                    rd = B.current_round(st)
                    sizes.append(len(rd["alive"]))
                    for m in rd["matches"]:
                        B.record(st, m["id"], rng.choice([m["a"], m["b"]]))
                    B.advance(st)
                self.assertEqual(sizes + [1], B.bracket_sizes(n))
                self.assertEqual(len(B.alive_ids(st)), 1)


class Dealer(unittest.TestCase):
    def setUp(self):
        self.data = B.load_strategies()

    def test_card_count(self):
        self.assertEqual(len(self.data["reasoning"]), 24)
        self.assertEqual(len(self.data["workflows"]), 21)
        self.assertEqual(len(self.data["strategies"]), 20)
        self.assertEqual(B.combo_count(self.data), 10080)

    def check(self, n, seed):
        cards = B.deal(n, seed, self.data)
        self.assertEqual(len(cards), n)
        self.assertEqual(len(set(cards)), n, "no card is dealt twice")
        R, W, S = (len(self.data[k]) for k in ("reasoning", "workflows", "strategies"))
        for dim, size in enumerate((R, W, S)):
            count = collections.Counter(c[dim] for c in cards)
            per = [count.get(i, 0) for i in range(size)]
            self.assertLessEqual(max(per) - min(per), 1, "balanced: n=%d seed=%d dim=%d %s" % (n, seed, dim, per))
        if n <= S * min(R, W):
            for a, b in ((0, 1), (0, 2), (1, 2)):
                pairs = collections.Counter((c[a], c[b]) for c in cards)
                self.assertEqual(max(pairs.values()), 1, "two agents share two parts: n=%d seed=%d" % (n, seed))
        return cards

    def test_100_agents_unique_balanced_and_every_part_used(self):
        cards = self.check(100, 7)
        self.assertEqual(len({c[0] for c in cards}), 24)
        self.assertEqual(len({c[1] for c in cards}), 21)
        self.assertEqual(len({c[2] for c in cards}), 20)

    def test_guarantees_hold_across_sizes_and_seeds(self):
        for n in (1, 2, 7, 16, 32, 50, 99, 100, 101, 144, 288, 420):
            for seed in range(25):
                self.check(n, seed)
        for n in (421, 1000):
            self.check(n, 1)

    def test_deterministic_for_a_seed(self):
        self.assertEqual(B.deal(100, 42, self.data), B.deal(100, 42, self.data))
        self.assertNotEqual(B.deal(100, 42, self.data), B.deal(100, 43, self.data))

    def test_out_of_range(self):
        with self.assertRaises(B.ArenaError):
            B.deal(0, 1, self.data)
        with self.assertRaises(B.ArenaError):
            B.deal(10081, 1, self.data)

    def test_pairing_prefers_different_reasoning_modes(self):
        for seed in range(50):
            st = B.new_state(100, seed, self.data, "/tmp/unused")
            same = 0
            for m in st["rounds"][0]["matches"]:
                a, b = st["agents"][m["a"]], st["agents"][m["b"]]
                same += a["card"]["reasoning"]["id"] == b["card"]["reasoning"]["id"]
            self.assertLessEqual(same, 1, "at most one forced same-mode match in a 50-match round")


class Plan(unittest.TestCase):
    def test_numbers(self):
        self.assertEqual(B.bracket_sizes(100), [100, 50, 25, 13, 7, 4, 2, 1])
        t = B.plan_totals(100, 10)
        self.assertEqual((t["rounds"], t["calls"], t["waves"]), (7, 595, 70))
        t = B.plan_totals(16, 10)
        self.assertEqual((t["rounds"], t["calls"], t["waves"]), (4, 91, 16))


class Verdicts(unittest.TestCase):
    def scores(self, c, m, s, r, cl, fatal=False):
        return {"correctness": c, "completeness": m, "specificity": s, "robustness": r, "clarity": cl, "fatal": fatal}

    def test_weights_match_the_rubric(self):
        with open(os.path.join(SKILL, "rubric.md"), encoding="utf-8") as fh:
            rows = re.findall(r"^\| (\w+) \| (\d+) \|", fh.read(), re.M)
        self.assertEqual([(k.lower(), int(w)) for k, w in rows], list(B.WEIGHTS))
        self.assertEqual(sum(w for _, w in B.WEIGHTS), 100)

    def test_total(self):
        self.assertEqual(B.weighted_total(self.scores(10, 10, 10, 10, 10)), 100.0)
        self.assertEqual(B.weighted_total(self.scores(8, 6, 7, 5, 9)), 68.5)   # (240 + 150 + 105 + 100 + 90) / 10
        self.assertIsNone(B.weighted_total({"correctness": 8}))

    def test_scores_beat_the_judges_pick(self):
        v = {"scores": {"a001": self.scores(5, 5, 5, 5, 5), "a002": self.scores(8, 8, 8, 8, 8)}, "winner": "a001"}
        w, totals, note = B.decide(v, "a001", "a002")
        self.assertEqual(w, "a002")
        self.assertIn("scores win", note)

    def test_fatal_rule(self):
        v = {"scores": {"a001": self.scores(9, 9, 9, 9, 9, fatal=True), "a002": self.scores(4, 4, 4, 4, 4)}}
        self.assertEqual(B.decide(v, "a001", "a002")[0], "a002")

    def test_tie_goes_to_fewer_standing_attacks(self):
        v = {"scores": {"a001": self.scores(7, 7, 7, 7, 7), "a002": self.scores(7, 7, 7, 7, 7)},
             "standing": {"a001": ["x", "y"], "a002": ["z"]}}
        self.assertEqual(B.decide(v, "a001", "a002")[0], "a002")

    def test_incomplete_scores_fall_back_to_the_pick(self):
        v = {"scores": {"a001": {"correctness": 3}}, "winner": "a001"}
        self.assertEqual(B.decide(v, "a001", "a002")[0], "a001")
        with self.assertRaises(B.ArenaError):
            B.decide({"scores": {}}, "a001", "a002")

    def test_json_inside_a_code_fence(self):
        self.assertEqual(B.extract_json('```json\n{"winner": "a001"}\n```'), {"winner": "a001"})
        self.assertIsNone(B.extract_json("no json here"))


class FullPipelineWithFakeAgents(TempDir):
    """Every phase, through the CLI, with fake sub-agents writing the files real ones would."""

    TASK = "Write a haiku about the sea.\nIt must mention salt.\nLiteral braces stay: {{name}} and {not_a_placeholder}."

    def fake_outputs(self, state, phase, jobs, rng):
        for j in jobs:
            for path in j["outputs"]:
                os.makedirs(os.path.dirname(path), exist_ok=True)
            if phase == "spawn":
                body = "Salt on the wind, from %s." % j["agent"]
                write(j["outputs"][0], body)
            elif phase == "attack":
                write(j["outputs"][0], "ATTACK 1 [MINOR] too short\nWhere: line 1\nProblem: it is short.\n")
            elif phase == "defend":
                write(j["outputs"][0], "ATTACK 1: CONCEDE. Made it longer.\n")
                write(j["outputs"][1], "Salt on the long wind, revised by %s." % j["agent"])
            elif phase == "judge":
                a, b = j["a"], j["b"]
                s = lambda: {k: rng.randint(3, 10) for k, _ in B.WEIGHTS}
                v = {"match": j["match"], "scores": {a: s(), b: s()}, "winner": a, "reason": "fake",
                     "survived": ["too short"], "standing": {a: [], b: []}}
                write(j["outputs"][0], json.dumps(v))
            elif phase == "learn":
                write(j["outputs"][0], "LEARN 1 from a001: salt\nDON'T LEARN 1 from a002: foam\nReason: BLOAT.\n")
                write(j["outputs"][1], "Salt rethought by %s." % j["agent"])
            elif phase == "probe":
                write(j["outputs"][0], "ATTACK 1 [MINOR] [REGRESSION] lost a word\nWhere: x\nProblem: y\n")
            elif phase == "refine":
                write(j["outputs"][0], "a001 ATTACK 1: CONCEDE. fixed\n")
                write(j["outputs"][1], "Salt refined by %s." % j["agent"])
            elif phase in ("recheck", "final"):
                v = {"scores": {"X": {k: 8 for k, _ in B.WEIGHTS}, "Y": {k: 4 for k, _ in B.WEIGHTS}},
                     "winner": "X", "reason": "fake", "fixed": ["salt"]}
                write(j["outputs"][0], json.dumps(v))

    def test_every_phase_to_done(self):
        d = os.path.join(self.tmp, "run")
        task_file = os.path.join(self.tmp, "task.md")
        base_file = os.path.join(self.tmp, "baseline.md")
        write(task_file, self.TASK)
        write(base_file, "The sea is big.")
        self.ok("init", "--agents", 5, "--seed", 9, "--task-file", task_file, "--baseline-file", base_file, "--dir", d)
        self.assertTrue(os.path.isfile(os.path.join(d, "rubric.md")), "the run has its own rubric copy")
        rng = random.Random(9)
        seen = []
        for _ in range(200):
            out = self.ok("next", "--dir", d)
            phase = re.search(r"^(NEXT: (\w+)|DONE)", out, re.M)
            phase = "done" if phase.group(0) == "DONE" else phase.group(2)
            seen.append(phase)
            if phase == "done":
                break
            if phase in ("collect", "advance"):
                self.ok(phase, "--dir", d)
                continue
            listing = self.ok("prompts", phase, "--dir", d)
            state = load(d)
            jobs = B.phase_jobs(state, phase)
            for j in jobs:
                self.assertIn(j["prompt"], listing)
                with open(j["prompt"], encoding="utf-8") as fh:
                    brief = fh.read()
                self.assertNotIn("{{agent", brief)
                self.assertNotIn("{{out", brief)
                self.assertNotRegex(brief.replace("{{name}}", ""), r"\{\{\w+\}\}", "unfilled placeholder")
                if phase == "spawn":
                    task_block = brief.split("=== THE TASK (identical for every competitor) ===\n")[1]
                    task_block = task_block.split("\n=== END OF THE TASK ===")[0]
                    self.assertEqual(task_block, self.TASK)
                    card = state["agents"][j["agent"]]["card"]
                    self.assertIn("Reasoning mode: %s." % card["reasoning"]["name"], brief)
                    self.assertIn("NOT satisfied", brief)
                if phase in ("judge", "recheck"):
                    self.assertNotIn("Reasoning mode", brief, "judges never see the cards")
                if phase == "defend":
                    self.assertIn("which you may learn from", brief)
                if phase == "learn":
                    for t in state["learn"]["teachers"]:
                        self.assertIn(t, brief)
                    self.assertIn("DON'T LEARN", brief)
            self.fake_outputs(state, phase, jobs, rng)
            self.ok("check", phase, "--dir", d)
        self.assertEqual(seen[-1], "done")
        self.assertIn("spawn", seen)
        self.assertIn("final", seen)
        for ph in B.LEARN_PHASES:
            self.assertIn(ph, seen)
        self.assertLess(seen.index("recheck"), seen.index("final"), "learning settles before the final check")
        self.assertEqual(seen.count("advance"), 3, "5 agents take 3 rounds")
        state = load(d)
        champ = state["agents"][state["champion"]]
        lr = state["learn"]
        self.assertIn(".solution.md", lr["original"], "the original is the champion's last revision")
        if lr["result"]["better"] == "refined":
            self.assertTrue(champ["solution"].endswith(os.path.join("learn", "refined.md")))
            self.assertIn("refined by %s" % state["champion"], read(champ["solution"]))
        else:
            self.assertEqual(champ["solution"], lr["original"])
        blind = B.blind_dir(d, "final")
        self.assertEqual(sorted(os.listdir(blind)), ["X.md", "Y.md", "rubric.md"], "nothing else beside the blind pair")
        pair = {read(os.path.join(blind, "X.md")).strip(), read(os.path.join(blind, "Y.md")).strip()}
        self.assertIn("The sea is big.", pair)
        self.assertIn(read(champ["solution"]).strip(), pair, "the final check sees the post-learn champion")
        rep = json.loads(self.ok("winner", "--json", "--dir", d))
        self.assertEqual(rep["rounds"], 3)
        self.assertEqual(rep["final"]["better"], state["final"]["X"])
        self.assertTrue(rep["attacks_survived"])

    def test_spawn_briefs_share_one_task_and_differ_in_card(self):
        d = os.path.join(self.tmp, "run16")
        self.ok("init", "--seed", 4, "--task", self.TASK, "--dir", d)
        self.ok("prompts", "spawn", "--dir", d)
        blocks, cards = set(), set()
        for name in sorted(os.listdir(os.path.join(d, "prompts", "r0"))):
            brief = read(os.path.join(d, "prompts", "r0", name))
            blocks.add(brief.split("=== THE TASK (identical for every competitor) ===\n")[1].split("\n=== END")[0])
            cards.add(brief.split("=== YOUR STRATEGY CARD ===")[1].split("=== END OF THE CARD ===")[0])
        self.assertEqual(len(os.listdir(os.path.join(d, "prompts", "r0"))), 16)
        self.assertEqual(blocks, {self.TASK}, "every competitor gets the exact same task text")
        self.assertEqual(len(cards), 16, "every competitor gets a different card")

    def test_unreadable_verdict_is_set_aside_and_rerun(self):
        d = os.path.join(self.tmp, "bad")
        self.ok("init", "--agents", 2, "--seed", 1, "--task", "t", "--dir", d)
        state = load(d)
        m = state["rounds"][0]["matches"][0]
        path = B.verdict_out(d, 1, m["id"])
        os.makedirs(os.path.dirname(path), exist_ok=True)
        write(path, "the judge rambled and wrote no json")
        r = cli("collect", "--dir", d)
        self.assertEqual(r.returncode, 1)
        self.assertIn("unreadable", r.stdout)
        self.assertFalse(os.path.exists(path))
        self.assertTrue(os.path.exists(path + ".unreadable"))


class Guards(TempDir):
    def test_init_refuses_to_overwrite_and_bad_sizes(self):
        d = os.path.join(self.tmp, "run")
        self.ok("init", "--agents", 4, "--task", "t", "--dir", d)
        self.assertEqual(cli("init", "--agents", 4, "--task", "t", "--dir", d).returncode, 2)
        self.assertEqual(cli("init", "--agents", 0, "--task", "t", "--dir", d + "2").returncode, 2)
        self.assertEqual(cli("init", "--agents", 10081, "--task", "t", "--dir", d + "3").returncode, 2)
        self.assertEqual(cli("init", "--quick", "--agents", 8, "--task", "t", "--dir", d + "4").returncode, 2)
        self.assertEqual(cli("init", "--agents", 4, "--task", "   ", "--dir", d + "5").returncode, 2)

    def test_sizes(self):
        for flag, n in ((None, 16), ("--quick", 8), ("--full", 100)):
            d = os.path.join(self.tmp, "size-%s" % n)
            self.ok("init", *([flag] if flag else []), "--task", "t", "--dir", d)
            self.assertEqual(load(d)["agents_n"], n)
        self.assertEqual(cli("init", "--quick", "--full", "--task", "t", "--dir", d + "x").returncode, 2)

    def test_record_rejects_an_outsider(self):
        d = os.path.join(self.tmp, "rec")
        self.ok("init", "--agents", 4, "--seed", 2, "--task", "t", "--dir", d)
        m = load(d)["rounds"][0]["matches"][0]
        outsider = next(a for a in load(d)["agents"] if a not in (m["a"], m["b"]))
        self.assertEqual(cli("record", m["id"], outsider, "--dir", d).returncode, 2)
        self.assertEqual(cli("advance", "--dir", d).returncode, 2, "cannot advance with open matches")

    def test_templates_are_all_in_skill_md(self):
        self.assertEqual(sorted(B.load_templates()), sorted(B.TEMPLATES))

    def test_no_em_dashes_anywhere(self):
        for root, dirs, files in os.walk(REPO):
            dirs[:] = [x for x in dirs if x not in (".git", "__pycache__")]
            for name in files:
                path = os.path.join(root, name)
                with open(path, encoding="utf-8", errors="ignore") as fh:
                    text = fh.read()
                self.assertNotIn(EM_DASH, text, "em dash in %s" % os.path.relpath(path, REPO))
                self.assertNotIn(EN_DASH, text, "en dash in %s" % os.path.relpath(path, REPO))


class Learn(TempDir):
    def finish(self, n, *extra):
        d = os.path.join(self.tmp, "learn-%d-%s" % (n, "-".join(map(str, extra)) or "on"))
        self.ok("init", "--agents", n, "--seed", 3, "--task", "t", "--dir", d, *extra)
        for aid in load(d)["agents"]:
            os.makedirs(os.path.join(d, "r0"), exist_ok=True)
            write(os.path.join(d, "r0", aid + ".md"), "solution of %s" % aid)
        rng = random.Random(3)
        while not load(d)["champion"]:
            for m in load(d)["rounds"][-1]["matches"]:
                self.ok("record", m["id"], rng.choice([m["a"], m["b"]]), "--dir", d)
            self.ok("advance", "--dir", d)
        return d, load(d)

    def test_teachers_are_the_strongest_eliminated_and_probers_include_the_runner_up(self):
        d, st = self.finish(16)
        lr = st["learn"]
        champ = st["champion"]
        self.assertEqual(len(lr["teachers"]), B.DEFAULT_LEARN_FROM)
        self.assertNotIn(champ, lr["teachers"])
        runner_up = st["rounds"][-1]["matches"][0]["loser"]
        self.assertEqual(lr["teachers"][0], runner_up)
        self.assertEqual(lr["probers"][0], runner_up)
        self.assertEqual(len(set(lr["probers"])), len(lr["probers"]))
        rounds = [st["agents"][t]["eliminated_in"] for t in lr["teachers"]]
        self.assertEqual(rounds, sorted(rounds, reverse=True), "furthest-going first")
        self.assertIn("NEXT: learn", self.ok("next", "--dir", d))

    def test_no_learn_goes_straight_to_done(self):
        d, st = self.finish(8, "--no-learn")
        self.assertIsNone(st["learn"])
        self.assertIn("DONE", self.ok("next", "--dir", d))

    def test_two_agents_learn_from_one_and_one_agent_skips(self):
        d, st = self.finish(2)
        self.assertEqual(len(st["learn"]["teachers"]), 1)
        self.assertEqual(len(st["learn"]["probers"]), 1)
        d1 = os.path.join(self.tmp, "solo")
        self.ok("init", "--agents", 1, "--seed", 1, "--task", "t", "--dir", d1)
        self.assertIsNone(load(d1)["learn"])

    def test_original_kept_when_it_wins_the_recheck(self):
        d, st = self.finish(4)
        for phase in B.LEARN_PHASES:
            self.ok("prompts", phase, "--dir", d)
            for j in B.phase_jobs(load(d), phase):
                for p in j["outputs"]:
                    os.makedirs(os.path.dirname(p), exist_ok=True)
                    write(p, "x")
        lr = load(d)["learn"]
        orig = lr["X"] == "original"
        v = {"scores": {"X": {k: 9 if orig else 3 for k, _ in B.WEIGHTS},
                        "Y": {k: 3 if orig else 9 for k, _ in B.WEIGHTS}}, "winner": "X" if orig else "Y"}
        write(os.path.join(d, "learn", "recheck.verdict.json"), json.dumps(v))
        self.ok("collect", "--dir", d)
        st = load(d)
        self.assertEqual(st["learn"]["result"]["better"], "original")
        self.assertEqual(st["agents"][st["champion"]]["solution"], lr["original"])


if __name__ == "__main__":
    unittest.main(verbosity=2)


class AuditFixes(TempDir):
    """One test per bug found in the audit."""

    def fresh(self, n=4, seed=2, name="run"):
        d = os.path.join(self.tmp, name)
        self.ok("init", "--agents", n, "--seed", seed, "--task", "t", "--dir", d)
        for aid in load(d)["agents"]:
            os.makedirs(os.path.join(d, "r0"), exist_ok=True)
            write(os.path.join(d, "r0", aid + ".md"), "solution of %s" % aid)
        return d

    def win_round(self, d):
        for m in load(d)["rounds"][-1]["matches"]:
            self.ok("record", m["id"], m["a"], "--dir", d)
        self.ok("advance", "--dir", d)

    def test_a_closed_rounds_match_id_is_refused(self):
        d = self.fresh()
        self.win_round(d)
        m = load(d)["rounds"][-1]["matches"][0]
        r = cli("record", "r1-m01", m["a"], "--dir", d)
        self.assertEqual(r.returncode, 2, r.stdout)
        self.assertIn("not in the open round", r.stderr)
        self.assertIsNone(load(d)["rounds"][-1]["matches"][0]["winner"])
        self.ok("record", "m1", m["a"], "--dir", d)   # the bare number still works

    def test_init_with_dir_points_latest_at_the_new_run(self):
        cwd = os.path.join(self.tmp, "proj")
        os.makedirs(cwd)
        for name in ("one", "two"):
            r = subprocess.run([sys.executable, BRACKET, "init", "--agents", "2", "--task", "t", "--dir",
                                os.path.join(cwd, ".arena", name)], cwd=cwd, capture_output=True, text=True)
            self.assertEqual(r.returncode, 0, r.stderr)
        r = subprocess.run([sys.executable, BRACKET, "status"], cwd=cwd, capture_output=True, text=True)
        self.assertIn(os.path.join(".arena", "two"), r.stdout)

    def test_no_output_never_replaces_a_solution(self):
        d = self.fresh()
        st = load(d)
        m = st["rounds"][0]["matches"][0]
        for aid in (m["a"], m["b"]):
            p = B.revised_out(d, 1, m["id"], aid)
            os.makedirs(os.path.dirname(p), exist_ok=True)
            write(p, "NO OUTPUT\n")
        # the judge brief points at the solution each side came in with
        jobs = B.write_prompts(load(d), "judge")
        brief = read(next(j["prompt"] for j in jobs if j["match"] == m["id"]))
        self.assertIn(os.path.join(d, "r0", m["a"] + ".md"), brief)
        self.assertNotIn(B.revised_out(d, 1, m["id"], m["a"]), brief)
        self.win_round(d)
        self.assertEqual(load(d)["agents"][m["a"]]["solution"], os.path.join(d, "r0", m["a"] + ".md"))

    def test_nan_scores_and_trailing_braces(self):
        nan = {k: 7 for k, _ in B.WEIGHTS}
        nan["correctness"] = float("nan")
        self.assertIsNone(B.weighted_total(nan))
        text = '```json\n{"winner": "a001", "scores": {}}\n```\nNote: see {standing} above.'
        self.assertEqual(B.extract_json(text)["winner"], "a001")

    def test_incomplete_scores_still_obey_the_fatal_rule(self):
        v = {"scores": {"a001": {"correctness": 9, "fatal": True}, "a002": {"correctness": 2}}, "winner": "a001"}
        self.assertEqual(B.decide(v, "a001", "a002")[0], "a002")

    def test_recheck_before_refine_is_a_clean_error(self):
        d = self.fresh(n=2)
        self.win_round(d)
        r = cli("prompts", "recheck", "--dir", d)
        self.assertEqual(r.returncode, 2)
        self.assertIn("Run refine first", r.stderr)
        self.assertNotIn("Traceback", r.stderr)

    def test_bad_learn_from_writes_nothing(self):
        d = os.path.join(self.tmp, "nope")
        self.assertEqual(cli("init", "--agents", 4, "--task", "t", "--learn-from", 0, "--dir", d).returncode, 2)
        self.assertFalse(os.path.exists(d))

    def test_templates_are_frozen_per_run(self):
        d = self.fresh()
        self.assertTrue(os.path.isfile(os.path.join(d, B.TEMPLATES_FILE)))
        frozen = os.path.join(d, B.TEMPLATES_FILE)
        write(frozen, read(frozen).replace("Only one of you gets out of this match.", "FROZEN-MARKER"))
        jobs = B.write_prompts(load(d), "attack")
        self.assertIn("FROZEN-MARKER", read(jobs[0]["prompt"]))

    def test_defender_sees_its_own_attacks_and_word_count(self):
        d = self.fresh()
        jobs = B.write_prompts(load(d), "defend")
        j = jobs[0]
        brief = read(j["prompt"])
        self.assertIn(B.attack_out(d, 1, j["match"], j["agent"]), brief)
        self.assertIn("(3 words)", brief)

    def test_refiner_names_one_prober_when_there_is_one(self):
        d = self.fresh(n=2)
        self.win_round(d)
        st = load(d)
        self.assertEqual(len(st["learn"]["probers"]), 1)
        for name in ("ledger.md", "rethink.md", "probe.%s.md" % st["learn"]["probers"][0]):
            os.makedirs(os.path.join(d, "learn"), exist_ok=True)
            write(os.path.join(d, "learn", name), "x")
        jobs = B.write_prompts(st, "refine")
        brief = read(jobs[0]["prompt"])
        self.assertIn("attacked by one competitor you eliminated", brief)

    def test_clean_waits_for_done_then_deletes_scratch(self):
        d = self.fresh(n=2)
        self.ok("prompts", "spawn", "--dir", d)
        write(os.path.join(d, "scratch", "a001", "big.bin"), "x" * 1000)
        self.assertEqual(cli("clean", "--dir", d).returncode, 2)
        self.ok("clean", "--force", "--dir", d)
        self.assertFalse(os.path.exists(os.path.join(d, "scratch")))


class Relevance(TempDir):
    """Jev fits the deck to the task. The HTTP call is stubbed; the policy is tested for real."""

    def fake_scores(self, data, fits):
        """fits(key, item) -> probability."""
        return {k: {it["id"]: fits(k, it) for it in data[k]} for k, _ in B.DECK_KEYS}

    def test_questions_cover_every_card_part_with_its_text(self):
        data = B.load_strategies()
        qs = B.relevance_questions(data)
        self.assertEqual(len(qs), sum(len(data[k]) for k, _ in B.DECK_KEYS))
        it = data["strategies"][0]
        q = qs["strategies:%s" % it["id"]]
        self.assertEqual(q["type"], "noul")
        self.assertEqual(q["instructions"]["approach"]["how"], it["how"])
        self.assertIn("`task`", q["instructions"]["question"])

    def test_keeps_what_fits_best_first(self):
        data = B.load_strategies()
        good = {k: set(it["id"] for it in data[k][:6]) for k, _ in B.DECK_KEYS}
        scores = self.fake_scores(data, lambda k, it: 0.9 if it["id"] in good[k] else 0.1)
        out, kept, note = B.pool_deck(data, scores, 16)
        for k, _ in B.DECK_KEYS:
            self.assertEqual(set(kept[k]), good[k])
        self.assertEqual(note, "")

    def test_a_thin_list_is_dealt_in_full(self):
        data = B.load_strategies()
        scores = self.fake_scores(data, lambda k, it: 0.9 if (k != "strategies" or it["id"] == data[k][0]["id"]) else 0.1)
        out, kept, note = B.pool_deck(data, scores, 16)
        self.assertIsNone(kept["strategies"])
        self.assertEqual(len(out["strategies"]), len(data["strategies"]))
        self.assertEqual(len(out["reasoning"]), len(data["reasoning"]))
        self.assertIn("strategies", note)

    def test_too_few_cards_means_the_whole_deck(self):
        data = B.load_strategies()
        top = {k: set(it["id"] for it in data[k][:4]) for k, _ in B.DECK_KEYS}
        scores = self.fake_scores(data, lambda k, it: 0.9 if it["id"] in top[k] else 0.1)
        out, kept, note = B.pool_deck(data, scores, 100)   # 4 x 4 x 4 = 64 < 100
        self.assertIs(out, data)
        self.assertTrue(all(v is None for v in kept.values()))
        self.assertIn("whole deck", note)

    def test_bm25_ranks_the_part_that_shares_the_tasks_words(self):
        data = {"reasoning": [{"id": "r1", "name": "Security audit", "how": "Hunt for injection, auth bypass and secrets."},
                              {"id": "r2", "name": "Poetry", "how": "Write with rhythm, imagery and metaphor."}],
                "workflows": [{"id": "w1", "name": "Draft", "how": "Write a draft."}],
                "strategies": [{"id": "s1", "name": "Speed", "how": "Ship fast."}]}
        sc = B.bm25_scores("Audit this login handler for injection and auth bypass bugs.", data)
        self.assertEqual(sc["reasoning"]["r1"], 1.0)
        self.assertLess(sc["reasoning"]["r2"], 0.5)
        self.assertEqual(sc["strategies"]["s1"], 0.0, "no shared words, no score")

    def test_jev_failure_falls_back_to_bm25_in_auto_but_not_in_jev(self):
        data = B.load_strategies()

        def broken(state, qs, key):
            raise B.ArenaError("HTTP 500")
        dealt, rep = B.fit_deck("t", data, 16, mode="auto", key="k", ask=broken)
        self.assertEqual(rep["method"], "bm25")
        self.assertIn("Jev failed", rep["fallback"])
        with self.assertRaises(B.ArenaError):
            B.fit_deck("t", data, 16, mode="jev", key="k", ask=broken)
        with self.assertRaises(B.ArenaError):
            B.fit_deck("t", data, 16, mode="jev", key=None)
        self.assertEqual(B.fit_deck("t", data, 16, mode="off"), (data, None))

    def test_bad_answer_is_an_error_not_a_guess(self):
        data = B.load_strategies()
        ask = lambda state, qs, key: {"answers": {q: {"type": "noul", "noul": 0.7} for q in list(qs)[1:]}}
        with self.assertRaises(B.ArenaError):
            B.score_relevance("t", data, "k", ask=ask)

    def test_init_deals_only_fitting_cards(self):
        data = B.load_strategies()
        good = {k: set(it["id"] for it in data[k][-5:]) for k, _ in B.DECK_KEYS}
        seen = {}

        def fake(state, qs, key):
            seen["state"], seen["n"] = state, len(qs)
            return {"model": "jev-test", "answers": {
                q: {"type": "noul", "noul": 0.8 if q.split(":", 1)[1] in good[q.split(":", 1)[0]] else 0.2}
                for q in qs}}
        old_ask, old_key = B.ask_jev, os.environ.get("TYPESAFE_API_KEY")
        B.ask_jev, os.environ["TYPESAFE_API_KEY"] = fake, "test-key"
        try:
            d = os.path.join(self.tmp, "fit")
            self.assertEqual(B.main(["init", "--agents", "16", "--seed", "3", "--task", "Write a haiku.", "--dir", d]), 0)
        finally:
            B.ask_jev = old_ask
            if old_key is None:
                os.environ.pop("TYPESAFE_API_KEY", None)
            else:
                os.environ["TYPESAFE_API_KEY"] = old_key
        self.assertEqual(seen["state"], {"task": "Write a haiku."})
        self.assertEqual(seen["n"], 65)
        st = load(d)
        names = {"reasoning": "reasoning", "workflows": "workflow", "strategies": "strategy"}
        for a in st["agents"].values():
            for k, _ in B.DECK_KEYS:
                self.assertIn(a["card"][names[k]]["id"], good[k])
        self.assertEqual(st["relevance"]["method"], "jev")
        self.assertEqual(st["relevance"]["model"], "jev-test")
        self.assertTrue(os.path.isfile(os.path.join(d, B.RELEVANCE_FILE)))

    def test_without_a_key_auto_uses_bm25_and_jev_refuses(self):
        env = dict(OFFLINE)
        run = lambda *a: subprocess.run([sys.executable, BRACKET] + list(a), capture_output=True, text=True, env=env)
        r = run("init", "--agents", "4", "--task", "t", "--dir", os.path.join(self.tmp, "auto"))
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertIn("by BM25", r.stdout)
        self.assertIn("TYPESAFE_API_KEY is not set", r.stdout)
        self.assertEqual(load(os.path.join(self.tmp, "auto"))["relevance"]["method"], "bm25")
        r = run("init", "--agents", "4", "--task", "t", "--relevance", "jev", "--dir", os.path.join(self.tmp, "req"))
        self.assertEqual(r.returncode, 2)
        self.assertFalse(os.path.exists(os.path.join(self.tmp, "req")), "nothing written")
        r = run("init", "--agents", "4", "--task", "t", "--relevance", "off", "--dir", os.path.join(self.tmp, "off"))
        self.assertNotIn("fitted", r.stdout)
        self.assertIsNone(load(os.path.join(self.tmp, "off"))["relevance"])
