# /// script
# requires-python = ">=3.10"
# dependencies = ["pyyaml>=6"]
# ///
"""Deal a hand of atoms, lenses and moves from the idea bank, for a deal session in idea-forge.

Usage:
  idea_deal.py <bank> menu                       # what each kind of deal can draw from right now
  idea_deal.py <bank> deal <kind> [-x 5] [--seed N] [--role TAG] [--json]

Kinds:
  role  atoms that share one role tag, across fields (same job, other field)
  lens  one lens + x atoms from fields the lens has not been seen in
  gap   x migration-gap rows: an atom and a field it has not reached
  pair  x//2 pairs of atoms whose fields do not overlap
  move  one past move + x cards it was not made on (replay the move there)

The seed is printed, so the same hand can be dealt again.
"""
import argparse
import importlib.util
import json
import random
import re
import sys
from pathlib import Path

_spec = importlib.util.spec_from_file_location("idea_index", Path(__file__).with_name("idea_index.py"))
ix = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(ix)

KINDS = ("role", "lens", "gap", "pair", "move")
SIG_RE = re.compile(r"^# Signature\n(.*?)(?=^# |\Z)", re.M | re.S)


class Bank:
    def __init__(self, root: Path):
        self.concepts = ix.load(root)
        self.index = ix.build(self.concepts)
        live = [c for c in self.concepts if c["fm"].get("status") != "deprecated"]
        by = lambda t: {c["slug"]: c for c in live if c["fm"]["type"] == t}
        self.atoms, self.lenses, self.moves, self.cards = by("Atom"), by("Lens"), by("Move"), by("Idea Card")
        moved: dict[str, set[str]] = {}
        for m in self.moves.values():
            fm = m["fm"]
            if fm.get("move_type") == "migrate-atom" and fm.get("atom") and fm.get("to_field"):
                moved.setdefault(fm["atom"], set()).add(fm["to_field"])
        self.fields = {s: ix.atom_fields(c["fm"], moved, s) for s, c in self.atoms.items()}
        self.roles: dict[str, list[str]] = {}
        for s, c in self.atoms.items():
            for r in ix.atom_roles(c["fm"]):
                self.roles.setdefault(r, []).append(s)
        self.shared_roles = {r: sorted(a) for r, a in self.roles.items() if len(a) >= 2}

    def menu(self) -> dict:
        far_pairs = sum(1 for i, a in enumerate(self.atoms) for b in list(self.atoms)[i + 1:]
                        if self.fields[a] and self.fields[b] and not self.fields[a] & self.fields[b])
        return {
            "role": {"pool": len(self.shared_roles), "unit": "roles with 2+ atoms",
                     "largest": sorted(((r, len(a)) for r, a in self.shared_roles.items()), key=lambda x: -x[1])[:5]},
            "lens": {"pool": len(self.lenses), "unit": "lenses"},
            "gap": {"pool": len(self.index["migration_gap_candidates"]), "unit": "atom-field gaps"},
            "pair": {"pool": far_pairs, "unit": "atom pairs with no shared field"},
            "move": {"pool": len(self.moves), "unit": "moves"},
            "bank": {k: len(v) for k, v in (("atoms", self.atoms), ("lenses", self.lenses),
                                            ("moves", self.moves), ("cards", self.cards))},
        }

    def item(self, kind: str, slug: str) -> dict:
        c = {"atom": self.atoms, "lens": self.lenses, "move": self.moves, "card": self.cards}[kind][slug]
        fm = c["fm"]
        out = {"kind": kind, "slug": slug, "title": fm.get("title", slug), "gloss": fm.get("description", ""),
               "path": c["path"]}
        if kind == "atom":
            out["fields"] = sorted(self.fields[slug])
            out["roles"] = sorted(ix.atom_roles(fm))
            m = SIG_RE.search(c["body"])
            out["signature"] = " ".join(l[2:].strip() for l in m.group(1).splitlines() if l.startswith("- ")) if m else ""
        elif kind == "lens":
            out["fields"] = ix.as_list(fm.get("fields"))
        elif kind == "move":
            out.update({k: fm.get(k) for k in ("move_type", "role", "parent", "child", "card") if fm.get(k)})
        elif kind == "card":
            out["field"] = fm.get("field")
        return out

    def deal(self, kind: str, x: int, rng: random.Random, role: str | None = None) -> dict:
        if kind not in KINDS:
            raise SystemExit(f"idea_deal: unknown kind {kind!r}; pick one of {', '.join(KINDS)}")
        hand: dict = {"kind": kind, "items": []}
        if kind == "role":
            if role is None:
                if not self.shared_roles:
                    raise SystemExit("idea_deal: no role has 2+ atoms yet; try another kind")
                role = rng.choice(sorted(self.shared_roles))
            elif role not in self.roles:
                raise SystemExit(f"idea_deal: no atom has role {role!r}")
            members = sorted(self.roles[role])
            hand["role"] = role
            hand["items"] = [self.item("atom", a) for a in rng.sample(members, min(x, len(members)))]
        elif kind == "lens":
            if not self.lenses:
                raise SystemExit("idea_deal: the bank has no lens yet; try another kind")
            lens = rng.choice(sorted(self.lenses))
            seen = set(ix.as_list(self.lenses[lens]["fm"].get("fields")))
            pool = sorted(a for a in self.atoms if self.fields[a] and not self.fields[a] & seen)
            hand["items"] = [self.item("lens", lens)] + [self.item("atom", a) for a in self._spread(pool, x, rng)]
        elif kind == "gap":
            gaps = self.index["migration_gap_candidates"][:]
            if not gaps:
                raise SystemExit("idea_deal: no migration gap yet; try another kind")
            rng.shuffle(gaps)
            seen_atoms = set()
            for g in gaps:  # one row per atom, so the hand is x different atoms
                if len(hand["items"]) == x:
                    break
                if g["atom"] in seen_atoms:
                    continue
                seen_atoms.add(g["atom"])
                it = self.item("atom", g["atom"]) if g["atom"] in self.atoms else {"kind": "atom", "slug": g["atom"]}
                it["target_field"] = g["field"]
                it["via_card"] = g["card"]
                hand["items"].append(it)
        elif kind == "pair":
            atoms = sorted(a for a in self.atoms if self.fields[a])
            pairs, tries = [], 0
            while len(pairs) < max(1, x // 2) and tries < 5000:
                tries += 1
                a, b = rng.sample(atoms, 2)
                if not self.fields[a] & self.fields[b] and {a, b} not in pairs:
                    pairs.append({a, b})
            hand["pairs"] = [[self.item("atom", a) for a in sorted(p)] for p in pairs]
            hand["items"] = [i for p in hand["pairs"] for i in p]
        elif kind == "move":
            if not self.moves:
                raise SystemExit("idea_deal: the bank has no move yet; try another kind")
            mv = rng.choice(sorted(self.moves))
            fm = self.moves[mv]["fm"]
            own = {fm.get("card"), fm.get("child"), fm.get("parent")}
            pool = sorted(c for c in self.cards if c not in own)
            hand["items"] = [self.item("move", mv)] + [self.item("card", c) for c in rng.sample(pool, min(x, len(pool)))]
        return hand

    def _spread(self, pool: list[str], x: int, rng: random.Random) -> list[str]:
        """Pick x atoms, preferring ones whose fields differ from those already picked."""
        pool = pool[:]
        rng.shuffle(pool)
        picked, used = [], set()
        for a in pool:
            if len(picked) == x:
                break
            if not self.fields[a] & used:
                picked.append(a)
                used |= self.fields[a]
        for a in pool:
            if len(picked) == x:
                break
            if a not in picked:
                picked.append(a)
        return picked


def render(hand: dict, seed: int) -> str:
    head = f"# Deal: {hand['kind']} (seed {seed})"
    if hand.get("role"):
        head += f", role `{hand['role']}`"
    lines = [head, ""]

    def line(it):
        if "title" not in it:
            return f"- atom `{it['slug']}` (no file)" + (f" -> **{it['target_field']}**" if it.get("target_field") else "")
        s = f"- {it['kind']} **{it['title']}** (`{it['path']}`)"
        if it.get("fields"):
            s += f" [{', '.join(it['fields'])}]"
        if it.get("field"):
            s += f" [{it['field']}]"
        if it.get("move_type"):
            s += f" {{{it['move_type']}" + (f", role {it['role']}" if it.get("role") else "") + "}"
        if it.get("target_field"):
            s += f" -> **{it['target_field']}** (via {it['via_card']})"
        s += f"\n  {it['gloss']}"
        if it.get("signature"):
            s += f"\n  Signature: {it['signature']}"
        return s
    if hand.get("pairs"):
        for n, p in enumerate(hand["pairs"], 1):
            lines.append(f"## Pair {n}")
            lines += [line(i) for i in p]
    else:
        lines += [line(i) for i in hand["items"]]
    return "\n".join(lines) + "\n"


def render_menu(m: dict) -> str:
    b = m.pop("bank")
    out = [f"# Deal menu (bank: {b['atoms']} atoms, {b['lenses']} lenses, {b['moves']} moves, {b['cards']} cards)", ""]
    for k in KINDS:
        row = m[k]
        s = f"- {k}: {row['pool']} {row['unit']}"
        if row.get("largest"):
            s += " (largest: " + ", ".join(f"{r} x{n}" for r, n in row["largest"]) + ")"
        out.append(s)
    return "\n".join(out) + "\n"


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("root", type=Path)
    sub = ap.add_subparsers(dest="cmd", required=True)
    sub.add_parser("menu")
    d = sub.add_parser("deal")
    d.add_argument("kind", choices=KINDS)
    d.add_argument("-x", type=int, default=5, help="how many items to draw (default 5)")
    d.add_argument("--seed", type=int, help="replay a hand; a random seed is printed when omitted")
    d.add_argument("--role", help="role kind only: deal this role tag")
    d.add_argument("--json", action="store_true")
    args = ap.parse_args(argv)
    if not args.root.is_dir():
        print(f"idea_deal: {args.root} is not a directory", file=sys.stderr)
        return 2
    bank = Bank(args.root)
    if args.cmd == "menu":
        sys.stdout.write(render_menu(bank.menu()))
        return 0
    if args.x < 1:
        print("idea_deal: -x must be 1 or more", file=sys.stderr)
        return 2
    seed = args.seed if args.seed is not None else random.SystemRandom().randrange(10**6)
    hand = bank.deal(args.kind, args.x, random.Random(seed), role=args.role)
    hand["seed"] = seed
    sys.stdout.write(json.dumps(hand, indent=2) + "\n" if args.json else render(hand, seed))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
