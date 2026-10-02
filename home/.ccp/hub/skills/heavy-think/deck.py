#!/usr/bin/env python3
"""deck.py: deal from the perspective deck (references/perspectives.json).

Used by heavy-think (Brainstorm, Perspectives, Unstick, Decompose), the heavy-thinker agent and
/council, which imports it.

    python3 deck.py presets                                    # lens sets by question shape, with their rubric
    python3 deck.py deal --members 3 [--preset P] [--seed S] --question "the problem"   # lens + technique cards
    python3 deck.py deal --members 3 --no-technique            # lenses only (decisions, technical problems)
    python3 deck.py deal --lenses "operator,EU regulator: Would this pass a GDPR review?"
    python3 deck.py deal --members 3 --preset code-review --no-technique --lenses "DBA on call: What pages me?"   # a review panel; --lenses take the first seats, the preset fills the rest
    python3 deck.py reframes [--set every-option-wrong]        # Unstick strategies
    python3 deck.py decompositions [--set technical-system]    # Decompose strategies
    python3 deck.py debates                                    # debate formats and the evidence-backed rules
    python3 deck.py rubric [creative|decision]                 # scoring weights

Pass the problem with --question (or --question-file) and the deck is fitted to it first:
lenses, techniques and provocations (deal), or reframes and decompositions (their listings),
keep only the entries that fit, one yes/no question per entry. Clef (Cloudflare Workers AI,
free daily allocation) asks them when the `cf` CLI is logged in, or CLOUDFLARE_AI_TOKEN and
CLOUDFLARE_ACCOUNT_ID are set. If Clef is unavailable or fails, Jev (TypeSafe) asks them when
TYPESAFE_API_KEY is set. Otherwise BM25 ranks entries by the words they share with the question.
A scorer that fails prints a "deck warn:" line on stderr. A pool with too few fitting entries
is used in full, at random. --relevance off skips it. A preset or --lenses is always kept as chosen.

A lens id from the deck, or a custom lens written as "Name: the question it asks". Separate
entries with ";" when a custom question contains commas.

Python 3.8+, standard library only.
"""
import argparse
import json
import math
import os
import random
import re
import shutil
import subprocess
import sys
import time
import urllib.error
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
DECK_PATH = os.path.join(HERE, "references", "perspectives.json")
RUBRIC_PATH = os.path.join(HERE, "references", "rubric.md")
REQUIRED_FAMILIES = ("challenger", "stakeholder", "temporal")
NO_TECHNIQUE = {"id": "none", "name": "None",
                "how": "No set technique: generate however your lens works best."}


JEV_URL = "https://api.typesafe.ai/v1/systemone"
JEV_MODEL = "jev-latest"
CLEF_URL = "https://api.cloudflare.com/client/v4/accounts/%s/ai/run/@cf/cloudflare/%s"
CLEF_MODEL = os.environ.get("ARENA_CLEF_MODEL", "").strip() or "clef"   # or clef-flash: ~1/3 the neurons
CLEF_MAX_QUESTIONS = 64    # Clef's per-request limit
CF_CONFIG = os.path.expanduser("~/.config/cloudflare/config/default.json")
RELEVANCE_MIN = 0.6    # Jev: probability it fits (it rates most lenses 0.5+). BM25: share of the best score
CLEF_MIN = 0.5         # Clef spreads its scores wider (0.03 to 0.85 on the lenses), so its bar is lower
RELEVANCE_FLOOR = 4    # a pool with fewer fitting entries than this (or than the members) is used in full


class DeckError(Exception):
    pass


def _by_id(items):
    return {it["id"]: it for it in items}


def load_deck(path=DECK_PATH):
    with open(path, encoding="utf-8") as fh:
        deck = json.load(fh)
    for key in ("lenses", "techniques", "provocations", "presets", "reframes", "decompositions"):
        items = deck.get(key) or []
        if not items:
            raise DeckError("perspectives.json has no '%s' entries" % key)
        ids = [it["id"] for it in items]
        if len(set(ids)) != len(ids):
            raise DeckError("perspectives.json has a duplicate id in '%s'" % key)
    lens_ids = set(l["id"] for l in deck["lenses"])
    families = set(deck.get("families") or {})
    for l in deck["lenses"]:
        if not l.get("delivers"):
            raise DeckError("lens '%s' needs 'delivers': the output it must produce" % l["id"])
        if l["family"] not in families:
            raise DeckError("lens '%s' has unknown family '%s'" % (l["id"], l["family"]))
        for c in l.get("clashes", []):
            if c not in lens_ids:
                raise DeckError("lens '%s' clashes with unknown lens '%s'" % (l["id"], c))
    rubrics = deck.get("rubrics") or {}
    for p in deck["presets"]:
        for c in p["lenses"] + p.get("deep_add", []):
            if c not in lens_ids:
                raise DeckError("preset '%s' names unknown lens '%s'" % (p["id"], c))
        if p.get("rubric") and p["rubric"] not in rubrics:
            raise DeckError("preset '%s' names unknown rubric '%s'" % (p["id"], p["rubric"]))
    for setkey, itemkey, field in (("reframe_sets", "reframes", "reframes"),
                                   ("decomposition_sets", "decompositions", "decompositions")):
        known = set(it["id"] for it in deck[itemkey])
        for s in deck.get(setkey) or []:
            for x in s[field] + s.get("deep_add", []):
                if x not in known:
                    raise DeckError("%s '%s' names unknown entry '%s'" % (setkey, s["id"], x))
    ids = [x["id"] for x in deck.get("debates") or []]
    if len(set(ids)) != len(ids):
        raise DeckError("perspectives.json has a duplicate id in 'debates'")
    for name, r in rubrics.items():
        if sum(r["weights"].values()) != 100:
            raise DeckError("rubric '%s' weights must add up to 100" % name)
    return deck


def rubric_weights(deck, profile):
    r = (deck.get("rubrics") or {}).get(profile)
    if not r:
        raise DeckError("no rubric profile '%s' (one of: %s)" % (profile, ", ".join(deck.get("rubrics") or {})))
    return list(r["weights"].items())


def preset_rubric(deck, preset):
    p = _by_id(deck["presets"]).get(preset) if preset else None
    return (p or {}).get("rubric")


def parse_lens_spec(spec, deck):
    """'operator, EU regulator: Would this pass a GDPR review?' -> deck ids and custom lens dicts."""
    lenses = _by_id(deck["lenses"])
    out = []
    parts = spec.split(";") if ";" in spec else re.split(r",(?![^:]*\?)", spec)
    for raw in [x.strip() for x in parts if x.strip()]:
        if ":" in raw:
            name, asks = [x.strip() for x in raw.split(":", 1)]
            if not name or not asks:
                raise DeckError("a custom lens needs 'Name: the question it asks', not '%s'" % raw)
            lid = "custom-" + re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
            out.append({"id": lid, "family": "custom", "name": name, "asks": asks,
                        "sees": "What only someone asking that question would notice.",
                        "misses": "Everything outside that question; the other members cover it.",
                        "delivers": "A direct answer to that question, with the evidence for it.",
                        "clashes": []})
        elif raw in lenses:
            out.append(dict(lenses[raw]))
        else:
            raise DeckError("no lens called '%s'. Use a deck id or 'Name: question'" % raw)
    return out


def deal_lenses(n, rng, deck, preset=None, explicit=None):
    """n distinct lenses. Explicit lenses or a preset go first and are kept as chosen.
    A random deal seats every required family (and a wildcard from 4 up), then fills
    the least-represented families, preferring lenses that clash with someone already
    seated. A preset gives up a seat to a missing family only where it doubled one up."""
    lenses = _by_id(deck["lenses"])
    if n < 1:
        raise DeckError("deal at least 1 lens")
    chosen = []
    p = None
    for l in explicit or []:
        if l["id"] not in [c["id"] for c in chosen]:
            chosen.append(dict(l))
    if preset:
        # Explicit lenses take the first seats; the preset fills the rest.
        p = _by_id(deck["presets"]).get(preset)
        if not p:
            raise DeckError("no preset called '%s' (run presets)" % preset)
        for x in dict.fromkeys(p["lenses"] + p.get("deep_add", [])):
            if x not in [c["id"] for c in chosen]:
                chosen.append(dict(lenses[x]))
    chosen = chosen[:n]
    if n > len(chosen) + sum(1 for lid in lenses if lid not in [c["id"] for c in chosen]):
        raise DeckError("the deck has %d lenses, not enough for %d members" % (len(lenses), n))

    def ids():
        return [c["id"] for c in chosen]

    def clash_score(lid):
        mine = set(lenses[lid].get("clashes", []))
        theirs = sum(1 for c in chosen if lid in c.get("clashes", []))
        return len(mine & set(ids())) + theirs

    def pick_from(family):
        pool = [lid for lid in lenses if lenses[lid]["family"] == family and lid not in ids()]
        if not pool:
            return None
        rng.shuffle(pool)
        pool.sort(key=lambda lid: -clash_score(lid))
        return dict(lenses[pool[0]])

    # A preset with "wildcard": false (the review panels) never seats one: a moonshot finds no defects.
    wild = not (p and p.get("wildcard") is False)
    required = list(REQUIRED_FAMILIES) + (["wildcard"] if n >= 4 and wild else [])
    for fam in required:
        if any(c["family"] == fam for c in chosen):
            continue
        lens = pick_from(fam)
        if not lens:
            continue
        if len(chosen) < n:
            chosen.append(lens)
        elif not explicit:
            counts = {}
            for c in chosen:
                counts[c["family"]] = counts.get(c["family"], 0) + 1
            dup = next((c for c in reversed(chosen) if counts[c["family"]] > 1), None)
            if dup:
                chosen[chosen.index(dup)] = lens
    families = [f for f in deck["families"] if wild or f != "wildcard"]
    while len(chosen) < n:
        counts = {f: sum(1 for c in chosen if c["family"] == f) for f in families}
        for fam in sorted(families, key=lambda f: (counts[f], rng.random())):
            lens = pick_from(fam)
            if lens:
                chosen.append(lens)
                break
    return chosen


def deal_cards(n, seed, deck, preset=None, explicit=None, techniques=True):
    """One card per member: a lens, a technique (or none), and a provocation for later."""
    rng = random.Random("council-deal:%s" % seed)
    lenses = deal_lenses(n, rng, deck, preset, explicit)
    techs = list(deck["techniques"])
    rng.shuffle(techs)
    provs = list(deck["provocations"])
    rng.shuffle(provs)
    order = list(range(n))
    rng.shuffle(order)
    return [{"lens": lenses[k],
             "technique": dict(techs[i % len(techs)]) if techniques else dict(NO_TECHNIQUE),
             "provocation": dict(provs[i % len(provs)])} for i, k in enumerate(order)]


# ---------------------------------------------------------------- relevance (Clef, Jev, BM25, random)
#
# The same chain as the arena skill's card relevance. Each skill keeps its own copy, since a
# skill is linked on its own and cannot import from another.

def _entry_text(pool, it):
    if pool == "lenses":
        return {"kind": "perspective (lens)", "name": it["name"], "asks": it["asks"], "delivers": it["delivers"]}
    if pool == "provocations":
        return {"kind": "provocation", "text": it["text"]}
    kind = {"techniques": "idea-generation technique", "reframes": "reframing strategy",
            "decompositions": "decomposition strategy"}[pool]
    return {"kind": kind, "name": it["name"], "how": it["how"]}


def relevance_questions(pools):
    """One Noul per entry. pools: {pool name: [entries]}. Ids are for code only."""
    questions = {}
    for pool, items in pools.items():
        for it in items:
            entry = _entry_text(pool, it)
            questions["%s.%s" % (pool, it["id"])] = {
                "type": "noul",
                "instructions": {
                    "question": ("Someone will think about the problem in `question` using the %s in "
                                 "`entry`. Does it fit this particular problem: would it likely surface "
                                 "something useful about it?" % entry["kind"]),
                    "entry": entry,
                },
                "criteria": {
                    "true": "It fits: applied to this problem it would likely surface a real insight, risk or option.",
                    "false": ("It does not fit: it is about concerns this problem does not have, or would only "
                              "produce generic or off-topic output here."),
                },
            }
    return questions


def warn(msg):
    """A scorer problem the caller should see: one line on stderr, the run goes on."""
    print("deck warn: %s" % msg, file=sys.stderr)


def post_systemone(name, url, token, state, model, questions, attempts=3):
    """POST one System One request. Retries a 429 or a 5xx with backoff; anything else is an error."""
    body = json.dumps({"state": state, "model": model, "questions": questions}).encode("utf-8")
    for attempt in range(attempts):
        req = urllib.request.Request(url, data=body, method="POST", headers={
            "Authorization": "Bearer %s" % token, "Content-Type": "application/json"})
        try:
            with urllib.request.urlopen(req, timeout=90) as resp:
                return json.loads(resp.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            if (e.code == 429 or e.code >= 500) and attempt + 1 < attempts:
                try:
                    wait = float(e.headers.get("retry-after") or 0)
                except ValueError:
                    wait = 0
                time.sleep(max(wait, 2 ** attempt))
                continue
            raise DeckError("%s returned HTTP %d: %s" % (name, e.code, e.read().decode("utf-8", "replace")[:300]))
        except (urllib.error.URLError, OSError, ValueError) as e:
            if attempt + 1 < attempts:
                time.sleep(2 ** attempt)
                continue
            raise DeckError("could not reach %s: %s" % (name, e))


def ask_jev(state, questions, key, url=JEV_URL, model=JEV_MODEL):
    return post_systemone("Jev", url, key, state, model, questions)


def cloudflare_auth():
    """(token, account id) for Workers AI, or None. The `cf` CLI's OAuth login comes first (`cf auth
    whoami` refreshes it when expired); else CLOUDFLARE_AI_TOKEN (or CLOUDFLARE_API_TOKEN) and
    CLOUDFLARE_ACCOUNT_ID. Returns None quietly: having no login is not a fault."""
    account = os.environ.get("CLOUDFLARE_ACCOUNT_ID", "").strip()
    cf = shutil.which("cf")
    if cf:
        try:
            out = subprocess.run([cf, "auth", "whoami", "-q"], capture_output=True, text=True, timeout=30)
            who = json.loads(out.stdout)
            with open(CF_CONFIG, encoding="utf-8") as fh:
                token = json.load(fh).get("oauth_token", "")
            accounts = [a.get("id") for a in who.get("accounts") or [] if isinstance(a, dict)]
            acc = account or (accounts[0] if len(accounts) == 1 else "")
            if who.get("tokenValid") and token and acc:
                return token, acc
        except subprocess.TimeoutExpired:
            warn("cf auth whoami timed out after 30s, skipping Clef")
        except (OSError, ValueError, AttributeError, subprocess.SubprocessError) as e:
            warn("cf auth whoami failed (%s: %s), skipping Clef" % (type(e).__name__, str(e)[:200]))
    token = (os.environ.get("CLOUDFLARE_AI_TOKEN", "") or os.environ.get("CLOUDFLARE_API_TOKEN", "")).strip()
    return (token, account) if token and account else None


def ask_clef(state, questions, auth, model=None):
    """Clef takes at most 64 questions a request: split evenly and merge the answers."""
    token, account = auth
    model = model or CLEF_MODEL
    ids = list(questions)
    chunks = max(1, -(-len(ids) // CLEF_MAX_QUESTIONS))
    size = max(1, -(-len(ids) // chunks))
    answers = {}
    for i in range(0, len(ids), size):
        part = {q: questions[q] for q in ids[i:i + size]}
        resp = post_systemone("Clef", CLEF_URL % (account, model), token, state, model, part) or {}
        if not resp.get("success", True):
            raise DeckError("Clef failed: %s" % json.dumps(resp.get("errors"))[:300])
        answers.update((resp.get("result", resp) or {}).get("answers") or {})
    return {"model": "@cf/cloudflare/%s" % model, "answers": answers}


def jev_scores(question, pools, key, ask=None, name="Jev"):
    """The scorer's probability that each entry fits. Jev by default; Clef passes its own ask."""
    questions = relevance_questions(pools)
    resp = (ask or ask_jev)({"question": question}, questions, key) or {}
    answers = resp.get("answers") or {}
    out = {pool: {} for pool in pools}
    for qid in questions:
        a = answers.get(qid)
        p = a.get("noul") if isinstance(a, dict) else None
        if isinstance(p, bool) or not isinstance(p, (int, float)) or p != p or p in (float("inf"), float("-inf")):
            raise DeckError("%s gave no usable answer for %s" % (name, qid))
        pool, iid = qid.split(".", 1)
        out[pool][iid] = float(p)
    return out, resp.get("model")


_STOP = set("""a an and are as at be been but by can do does for from has have how if in into is it
its not of on or so than that the their them then there these they this to too was we were what when
where which who will with you your our must should would could may might also only any all each every
more most other some such no nor own same very just about above after again against before below
between both during further here once out over under until while why""".split())


def _terms(text):
    words = re.findall(r"[a-z0-9]+", text.lower())
    return [w[:-1] if len(w) > 4 and w.endswith("s") else w for w in words if len(w) > 2 and w not in _STOP]


def bm25_scores(question, pools, k1=1.2, b=0.75):
    """BM25 of every entry against the question (its distinct words as the query, each pool its
    own corpus), normalised per pool so the best entry scores 1.0 (0 when nothing matches)."""
    query = set(_terms(question))
    out = {}
    for pool, items in pools.items():
        docs = [(it["id"], _terms(" ".join(str(v) for v in _entry_text(pool, it).values()))) for it in items]
        n = len(docs)
        avg = (sum(len(t) for _, t in docs) / float(n)) if n else 1.0
        df = {}
        for _, t in docs:
            for w in set(t):
                df[w] = df.get(w, 0) + 1
        raw = {}
        for iid, t in docs:
            tf = {}
            for w in t:
                tf[w] = tf.get(w, 0) + 1
            score = 0.0
            for w in query & set(tf):
                idf = math.log(1 + (n - df[w] + 0.5) / (df[w] + 0.5))
                score += idf * tf[w] * (k1 + 1) / (tf[w] + k1 * (1 - b + b * len(t) / (avg or 1.0)))
            raw[iid] = score
        top = max(raw.values()) if raw else 0.0
        out[pool] = {iid: (v / top if top > 0 else 0.0) for iid, v in raw.items()}
    return out


def score_pools(question, pools, mode="auto", key=None, ask=None, cf_auth=None, ask_cf=None):
    """Score the pools with Clef, else Jev, else BM25. Returns (scores, report) or (None, None) for
    off. mode: auto (each in turn; a failure falls back to the next), clef or jev (that one or
    fail), bm25, off. report["minimum"] is the default bar for the scorer used."""
    if mode == "off":
        return None, None
    report = {"method": None, "model": None, "fallback": None}
    scores, skipped = None, []
    for method, name, cred, asker, missing in (
            ("clef", "Clef", cf_auth, ask_cf or ask_clef,
             "no Cloudflare login (cf auth login, or CLOUDFLARE_AI_TOKEN + CLOUDFLARE_ACCOUNT_ID)"),
            ("jev", "Jev", key, ask or ask_jev, "TYPESAFE_API_KEY is not set")):
        if mode not in ("auto", method):
            continue
        if not cred:
            if mode == method:
                raise DeckError("--relevance %s needs %s. Use --relevance auto to fall back"
                                % (method, missing.replace(" is not set", "")))
            skipped.append(missing)
            continue
        try:
            scores, report["model"] = jev_scores(question, pools, cred, ask=asker, name=name)
            report["method"] = method
            break
        except DeckError as e:
            if mode == method:
                raise
            warn("%s failed: %s" % (name, e))
            skipped.append("%s failed (%s)" % (name, e))
    if scores is None:
        scores, report["method"] = bm25_scores(question, pools), "bm25"
    if skipped:
        report["fallback"] = "%s, used %s" % ("; ".join(skipped), {"clef": "Clef", "jev": "Jev"}.get(report["method"], "BM25"))
    report["minimum"] = CLEF_MIN if report["method"] == "clef" else RELEVANCE_MIN
    return scores, report


def _fitting(items, scores, minimum):
    return sorted((it for it in items if scores[it["id"]] >= minimum), key=lambda it: (-scores[it["id"]], it["id"]))


def fit_deck(deck, question, n, mode="auto", minimum=None, techniques=True, preset=None,
             key=None, ask=None, cf_auth=None, ask_cf=None):
    """A copy of the deck whose lenses, techniques and provocations fit the question.

    Lenses: fewer than max(n, floor) fit means every lens. Otherwise the fitting ones, plus,
    for each family the deal must seat, that whole family when none of it fits, plus a
    preset's lenses, which are always kept. Techniques and provocations: the fitting ones,
    or all of them when fewer than max(n, floor) fit. minimum None means the scorer's own bar.
    Returns (deck, report or None)."""
    pools = {"lenses": deck["lenses"], "provocations": deck["provocations"]}
    if techniques:
        pools["techniques"] = deck["techniques"]
    scores, report = score_pools(question, pools, mode, key=key, ask=ask, cf_auth=cf_auth, ask_cf=ask_cf)
    if scores is None:
        return deck, None
    minimum = report["minimum"] if minimum is None else minimum
    out = dict(deck)
    floor = max(n, RELEVANCE_FLOOR)
    notes, kept = [], {}

    fits = _fitting(deck["lenses"], scores["lenses"], minimum)
    if len(fits) < floor:
        kept["lenses"] = None
        notes.append("fewer than %d lenses fit, dealt from all of them" % floor)
    else:
        ids = set(l["id"] for l in fits)
        required = list(REQUIRED_FAMILIES) + (["wildcard"] if n >= 4 else [])
        for fam in required:
            if not any(l["family"] == fam for l in fits):
                ids |= set(l["id"] for l in deck["lenses"] if l["family"] == fam)
                notes.append("no %s lens fits, any %s lens may be dealt" % (fam, fam))
        p = _by_id(deck["presets"]).get(preset) if preset else None
        if p:
            ids |= set(p["lenses"] + p.get("deep_add", []))
        out["lenses"] = [l for l in deck["lenses"] if l["id"] in ids]
        kept["lenses"] = [l["id"] for l in fits]

    for pool in ("techniques", "provocations"):
        if pool not in scores:
            continue
        fits = _fitting(deck[pool], scores[pool], minimum)
        if len(fits) < floor:
            kept[pool] = None
            notes.append("fewer than %d %s fit, dealt from all of them" % (floor, pool))
        else:
            out[pool] = fits
            kept[pool] = [it["id"] for it in fits]
    report.update(minimum=minimum, kept=kept, notes=notes, scores=scores)
    return out, report


def report_lines(report, deck):
    """What the fit did, for the user: one line, plus any notes."""
    if not report:
        return []
    by = report.get("model") or report["method"] if report["method"] != "bm25" else "BM25"
    parts = ["%s of %d %s" % (len(v) if v is not None else "all", len(deck[k]), k)
             for k, v in report["kept"].items()]
    lines = ["fitted to the question by %s: %s" % (by, ", ".join(parts))]
    lines += ["  note: %s" % x for x in [report.get("fallback")] + report.get("notes", []) if x]
    return lines


def _question(args):
    if getattr(args, "question_file", None):
        with open(args.question_file, encoding="utf-8") as fh:
            return fh.read().strip()
    return (getattr(args, "question", None) or "").strip()


def _key():
    return os.environ.get("TYPESAFE_API_KEY", "").strip() or None


def _cf(mode):
    """Cloudflare credentials, looked up only when the mode may use Clef."""
    return cloudflare_auth() if mode in ("auto", "clef") else None


# ---------------------------------------------------------------- cli

def _seed(args):
    return args.seed if args.seed is not None else random.randrange(1, 10 ** 6)


def cmd_presets(args):
    deck = load_deck()
    for p in deck["presets"]:
        print("%-18s %s  [rubric: %s]" % (p["id"], p["shape"], p.get("rubric", "creative")))
        print("%-18s lenses: %s | deep adds: %s" % ("", ", ".join(p["lenses"]), ", ".join(p.get("deep_add", []))))


def cmd_deal(args):
    deck = load_deck()
    seed = _seed(args)
    explicit = parse_lens_spec(args.lenses, deck) if args.lenses else None
    question = _question(args)
    full = deck
    report = None
    if question and getattr(args, "relevance", "auto") != "off":
        deck, report = fit_deck(deck, question, args.members, mode=args.relevance, minimum=args.relevance_min,
                                techniques=not args.no_technique, preset=args.preset, key=_key(),
                                cf_auth=_cf(args.relevance))
    cards = deal_cards(args.members, seed, deck, args.preset, explicit, techniques=not args.no_technique)
    rubric = preset_rubric(deck, args.preset)
    print("seed %s%s" % (seed, ", rubric %s" % rubric if rubric else ""))
    for line in report_lines(report, full):
        print(line)
    for i, c in enumerate(cards, 1):
        l = c["lens"]
        print("\n%d. %s [%s]: %s" % (i, l["name"], l["family"], l["asks"]))
        print("   sees: %s" % l["sees"])
        print("   must deliver: %s" % l["delivers"])
        if not args.no_technique:
            print("   technique: %s. %s" % (c["technique"]["name"], c["technique"]["how"]))
        print("   provocation for later: %s" % c["provocation"]["text"])


def _list_with_sets(items, sets, field, chosen, args=None):
    by = _by_id(items)
    question = _question(args) if args else ""
    if question and args.relevance != "off":
        scores, report = score_pools(question, {field: items}, args.relevance, key=_key(),
                                     cf_auth=_cf(args.relevance))
        sc = scores[field]
        minimum = report["minimum"] if args.relevance_min is None else args.relevance_min
        report["minimum"] = minimum
        report.update(kept={field: None}, notes=[])
        if chosen:
            s = _by_id(sets).get(chosen)
            if not s:
                raise DeckError("no set '%s' (one of: %s)" % (chosen, ", ".join(x["id"] for x in sets)))
            print("%s: %s" % (s["id"], s["when"]))
            for x in s[field] + s.get("deep_add", []):
                print("  %.2f  %s. %s" % (sc[x], by[x]["name"], by[x]["how"]))
        else:
            fits = _fitting(items, sc, minimum)
            floor = min(3, len(items))
            if len(fits) < floor:
                report["notes"].append("fewer than %d fit, listing all of them" % floor)
                fits = sorted(items, key=lambda it: -sc[it["id"]])
            else:
                report["kept"][field] = [it["id"] for it in fits]
            for x in fits:
                print("  %.2f  %-18s %s. %s" % (sc[x["id"]], x["id"], x["name"], x["how"]))
        for line in report_lines(report, {field: items}):
            print(line)
        return
    if chosen:
        s = _by_id(sets).get(chosen)
        if not s:
            raise DeckError("no set '%s' (one of: %s)" % (chosen, ", ".join(x["id"] for x in sets)))
        print("%s: %s" % (s["id"], s["when"]))
        for x in s[field]:
            print("  %s. %s" % (by[x]["name"], by[x]["how"]))
        for x in s.get("deep_add", []):
            print("  (deep) %s. %s" % (by[x]["name"], by[x]["how"]))
        return
    for x in items:
        print("%-18s %s. %s" % (x["id"], x["name"], x["how"]))
    print("")
    for s in sets:
        print("set %-18s %s: %s (deep adds %s)" % (s["id"], s["when"], ", ".join(s[field]), ", ".join(s.get("deep_add", []))))


def cmd_reframes(args):
    deck = load_deck()
    _list_with_sets(deck["reframes"], deck.get("reframe_sets") or [], "reframes", args.set, args)


def cmd_decompositions(args):
    deck = load_deck()
    _list_with_sets(deck["decompositions"], deck.get("decomposition_sets") or [], "decompositions", args.set, args)


def cmd_debates(args):
    deck = load_deck()
    for x in deck.get("debates") or []:
        print("%-18s %s. %s\n%-18s when: %s" % (x["id"], x["name"], x["how"], "", x["when"]))
    print("\nRules:")
    for r in deck.get("debate_rules") or []:
        print("- %s  [%s]" % (r["rule"], r["source"]))


def cmd_rubric(args):
    deck = load_deck()
    for name, r in deck["rubrics"].items():
        if args.profile and name != args.profile:
            continue
        print("%-9s %s" % (name, r["use_for"]))
        print("%-9s %s" % ("", ", ".join("%s %d" % kv for kv in r["weights"].items())))
    print("anchors: %s" % RUBRIC_PATH)


def add_relevance_args(s):
    """--question and the relevance flags. council.py adds them to its own parsers too."""
    s.add_argument("--question", help="the problem: fit the deck to it before dealing or listing")
    s.add_argument("--question-file", help="the problem, read from a file")
    s.add_argument("--relevance", choices=("auto", "clef", "jev", "bm25", "off"), default="auto",
                   help="with a question: auto (default) uses Clef if Cloudflare is logged in, else Jev if "
                        "TYPESAFE_API_KEY is set, else BM25. clef / jev: that one or fail. bm25: BM25 only. "
                        "off: the whole deck. Clef model: ARENA_CLEF_MODEL (default clef; clef-flash uses "
                        "about a third of the free daily neurons)")
    s.add_argument("--relevance-min", type=float, default=None,
                   help="the bar an entry must clear: Clef's or Jev's probability that it fits, or for BM25 "
                        "its share of the best score in its pool (default %g for Clef, %g otherwise)"
                        % (CLEF_MIN, RELEVANCE_MIN))


def build_parser():
    p = argparse.ArgumentParser(prog="deck.py", description="deal from the perspective deck")
    sub = p.add_subparsers(dest="cmd", required=True)
    sub.add_parser("presets")
    s = sub.add_parser("deal")
    s.add_argument("--members", type=int, default=3)
    s.add_argument("--preset")
    s.add_argument("--lenses", help="deck ids and/or custom 'Name: question', comma-separated; with --preset they take "
                        "the first seats and the preset fills the rest")
    s.add_argument("--no-technique", action="store_true", help="lenses only")
    s.add_argument("--seed")
    add_relevance_args(s)
    s = sub.add_parser("reframes")
    s.add_argument("--set")
    add_relevance_args(s)
    s = sub.add_parser("decompositions")
    s.add_argument("--set")
    add_relevance_args(s)
    sub.add_parser("debates")
    s = sub.add_parser("rubric")
    s.add_argument("profile", nargs="?")
    return p


def main(argv=None):
    args = build_parser().parse_args(argv)
    try:
        globals()["cmd_" + args.cmd](args)
    except DeckError as e:
        print("deck: %s" % e, file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
