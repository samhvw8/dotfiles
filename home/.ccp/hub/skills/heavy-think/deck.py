#!/usr/bin/env python3
"""deck.py: deal from the perspective deck (references/perspectives.json).

Used by heavy-think (Brainstorm, Unstick, Decompose), the heavy-thinker agent and
/council, which imports it.

    python3 deck.py presets                                    # lens sets by question shape, with their rubric
    python3 deck.py deal --members 3 [--preset P] [--seed S]   # lens + technique cards
    python3 deck.py deal --members 3 --no-technique            # lenses only (decisions, technical problems)
    python3 deck.py deal --lenses "operator,EU regulator: Would this pass a GDPR review?"
    python3 deck.py reframes [--set every-option-wrong]        # Unstick strategies
    python3 deck.py decompositions [--set technical-system]    # Decompose strategies
    python3 deck.py debates                                    # debate formats and the evidence-backed rules
    python3 deck.py rubric [creative|decision]                 # scoring weights

A lens id from the deck, or a custom lens written as "Name: the question it asks". Separate
entries with ";" when a custom question contains commas.

Python 3.8+, standard library only.
"""
import argparse
import json
import os
import random
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
DECK_PATH = os.path.join(HERE, "references", "perspectives.json")
RUBRIC_PATH = os.path.join(HERE, "references", "rubric.md")
REQUIRED_FAMILIES = ("challenger", "stakeholder", "temporal")
NO_TECHNIQUE = {"id": "none", "name": "None",
                "how": "No set technique: generate however your lens works best."}


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
    if explicit:
        for l in explicit:
            if l["id"] not in [c["id"] for c in chosen]:
                chosen.append(dict(l))
    elif preset:
        p = _by_id(deck["presets"]).get(preset)
        if not p:
            raise DeckError("no preset called '%s' (run presets)" % preset)
        chosen = [dict(lenses[x]) for x in dict.fromkeys(p["lenses"] + p.get("deep_add", []))]
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

    required = list(REQUIRED_FAMILIES) + (["wildcard"] if n >= 4 else [])
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
    families = list(deck["families"])
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
    cards = deal_cards(args.members, seed, deck, args.preset, explicit, techniques=not args.no_technique)
    rubric = preset_rubric(deck, args.preset)
    print("seed %s%s" % (seed, ", rubric %s" % rubric if rubric else ""))
    for i, c in enumerate(cards, 1):
        l = c["lens"]
        print("\n%d. %s [%s]: %s" % (i, l["name"], l["family"], l["asks"]))
        print("   sees: %s" % l["sees"])
        print("   must deliver: %s" % l["delivers"])
        if not args.no_technique:
            print("   technique: %s. %s" % (c["technique"]["name"], c["technique"]["how"]))
        print("   provocation for later: %s" % c["provocation"]["text"])


def _list_with_sets(items, sets, field, chosen):
    by = _by_id(items)
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
    _list_with_sets(deck["reframes"], deck.get("reframe_sets") or [], "reframes", args.set)


def cmd_decompositions(args):
    deck = load_deck()
    _list_with_sets(deck["decompositions"], deck.get("decomposition_sets") or [], "decompositions", args.set)


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


def build_parser():
    p = argparse.ArgumentParser(prog="deck.py", description="deal from the perspective deck")
    sub = p.add_subparsers(dest="cmd", required=True)
    sub.add_parser("presets")
    s = sub.add_parser("deal")
    s.add_argument("--members", type=int, default=3)
    s.add_argument("--preset")
    s.add_argument("--lenses", help="deck ids and/or custom 'Name: question', comma-separated")
    s.add_argument("--no-technique", action="store_true", help="lenses only")
    s.add_argument("--seed")
    s = sub.add_parser("reframes")
    s.add_argument("--set")
    s = sub.add_parser("decompositions")
    s.add_argument("--set")
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
