# /// script
# requires-python = ">=3.10"
# dependencies = ["pyyaml>=6"]
# ///
"""Index an idea bank: links, convergence, migration-gap candidates, known-bricks coverage.

Usage: uv run idea_index.py <bank-root> [--json out.json] [--suggest-merges] [--write | --check]

Deterministic and offline. Gap candidates are a list for judgement, not findings.
--write regenerates the views made from frontmatter (including `parts` and `links`): a `# Related` section in every
brick, card, lens and move, and `bricks/index.md`. It also moves a frontmatter
`signature` into the body. --check exits 1 when any of these is out of date.
"""
from __future__ import annotations

import argparse
import difflib
import json
import re
import sys
from collections import defaultdict
from pathlib import Path

import yaml

RESERVED = {"index.md", "log.md"}
FM_RE = re.compile(r"\A---\s*\n(.*?)\n---\s*\n?(.*)\Z", re.S)


def as_list(value) -> list:
    if value is None:
        return []
    if isinstance(value, list):
        return [v for v in value if v is not None]
    return [value]


def load(root: Path) -> list[dict]:
    """Parse every concept under root. A file with broken frontmatter is an error, not skipped."""
    concepts, errors = [], []
    for path in sorted(root.rglob("*.md")):
        if path.name in RESERVED:
            continue
        text = path.read_text(encoding="utf-8")
        m = FM_RE.match(text)
        if not m:
            errors.append(f"{path.relative_to(root)}: no frontmatter")
            continue
        try:
            fm = yaml.safe_load(m.group(1)) or {}
        except yaml.YAMLError as e:
            errors.append(f"{path.relative_to(root)}: bad YAML ({e.__class__.__name__})")
            continue
        if not isinstance(fm, dict) or not fm.get("type"):
            errors.append(f"{path.relative_to(root)}: missing type")
            continue
        concepts.append({"slug": path.stem, "path": str(path.relative_to(root)), "fm": fm, "body": m.group(2)})
    if errors:
        raise SystemExit("idea_index: cannot parse bank:\n  " + "\n  ".join(errors))
    return concepts


UNIT_TYPES = {"brick": "Brick", "lens": "Lens", "card": "Idea Card"}  # bare slugs resolve in this order
DEFAULT_CUT = "default"  # the cut of a `parts` entry that names no lens


def unit_graph(concepts: list[dict]) -> dict:
    """`parts` (split / bind) and `links` (connect without merging) across bricks, lenses and cards.

    Each `parts` entry belongs to a cut: the lens it was split through (`cut`, else `default`).
    A unit may hold several cuts side by side. Depth is relative and computed: a unit with no
    parts is 0, a whole is 1 + its deepest part over all cuts. Nothing stores a level name, so a
    unit split further later needs no relabelling.
    """
    live = {f"{k}:{c['slug']}": c for c in concepts for k, t in UNIT_TYPES.items()
            if c["fm"]["type"] == t and c["fm"].get("status") != "deprecated"}

    def resolve(ref) -> str | None:
        ref = str(ref)
        if ":" in ref:
            return ref if ref in live else None
        return next((f"{k}:{ref}" for k in UNIT_TYPES if f"{k}:{ref}" in live), None)

    parts: dict[str, list[str]] = {}  # whole -> distinct parts over all cuts (depth uses this)
    part_cuts: dict[str, dict[str, list[str]]] = {}  # whole -> cut (lens) -> parts, in frontmatter order
    cut_how: dict[str, dict[tuple[str, str], str]] = {}  # whole -> (cut, part) -> "how: note"
    part_how: dict[str, dict[str, str]] = {}  # whole -> part -> "how: note", for parts that say how they were found
    part_of: dict[str, set[str]] = defaultdict(set)
    links, broken = [], []
    for key, c in sorted(live.items()):
        ps, cuts = [], {}
        for entry in as_list(c["fm"].get("parts")):
            entry = entry if isinstance(entry, dict) else {"to": entry}
            ref = entry.get("to", "")
            cut = str(entry.get("cut") or DEFAULT_CUT)
            r = resolve(ref)
            if r:
                if r not in ps:
                    ps.append(r)
                if r not in cuts.setdefault(cut, []):
                    cuts[cut].append(r)
                part_of[r].add(key)
                if entry.get("how"):
                    how = str(entry["how"]) + (f": {entry['note']}" if entry.get("note") else "")
                    cut_how.setdefault(key, {})[(cut, r)] = how
                    part_how.setdefault(key, {}).setdefault(r, how)
            else:
                broken.append({"from": key, "to": f"part:{ref}"})
        if ps:
            parts[key] = ps
            part_cuts[key] = cuts
        for l in as_list(c["fm"].get("links")):
            l = l if isinstance(l, dict) else {"to": l}
            to = resolve(l.get("to", ""))
            if not to:
                broken.append({"from": key, "to": f"link:{l.get('to')}"})
                continue
            via = resolve(l["via"]) if l.get("via") else None
            if l.get("via") and not via:
                broken.append({"from": key, "to": f"via:{l['via']}"})
            links.append({"a": key, "b": to, "via": via, "note": l.get("note", "")})

    depth: dict[str, int] = {}
    cycles: list[list[str]] = []
    open_: set[str] = set()

    def visit(k: str, stack: list[str]) -> int:
        if k in depth:
            return depth[k]
        if k in open_:
            cyc = stack[stack.index(k):]
            if sorted(cyc) not in [sorted(c) for c in cycles]:
                cycles.append(cyc)
            return 0
        open_.add(k)
        stack.append(k)
        d = 1 + max((visit(p, stack) for p in parts.get(k, [])), default=-1)
        stack.pop()
        open_.discard(k)
        depth[k] = d
        return d

    for k in sorted(set(parts) | set(part_of)):
        visit(k, [])
    return {"parts": parts, "part_cuts": part_cuts, "cut_how": cut_how, "part_how": part_how,
            "part_of": {k: sorted(v) for k, v in sorted(part_of.items())},
            "depth": dict(sorted(depth.items())), "part_cycles": cycles, "unit_links": links, "broken": broken}


def brick_fields(fm: dict, moved: dict[str, set[str]] | None = None, slug: str | None = None) -> set[str]:
    """Fields a brick has reached: declared, migration rows, names, and migrate-brick moves."""
    fields = set(as_list(fm.get("fields")))
    if moved and slug:
        fields |= moved.get(slug, set())
    fields |= {m.get("field") for m in as_list(fm.get("migrations")) if isinstance(m, dict) and m.get("field")}
    fields |= set((fm.get("names") or {}).keys()) if isinstance(fm.get("names"), dict) else set()
    return fields


def brick_roles(fm: dict) -> set[str]:
    roles = set(as_list(fm.get("roles")))
    roles |= {m.get("role") for m in as_list(fm.get("migrations")) if isinstance(m, dict) and m.get("role")}
    return roles


def parse_known_bricks(body: str) -> dict[str, str]:
    """Read the table rows `| slug | seen/owned | ... |` from me/known-bricks.md."""
    known = {}
    for line in body.splitlines():
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        if len(cells) >= 2 and cells[1].lower() in {"seen", "owned"}:
            known[cells[0].strip("`")] = cells[1].lower()
    return known


def table_rows(body: str, section: str) -> list[dict[str, str]]:
    """Rows of the first markdown table under `# <section>`, keyed by lower-case header."""
    lines, inside = body.splitlines(), False
    rows, header = [], None
    for line in lines:
        if line.startswith("# "):
            if inside and header:
                break
            inside = line[2:].strip().lower() == section.lower()
            continue
        if not inside or not line.strip().startswith("|"):
            if inside and header and not line.strip():
                break
            continue
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        if header is None:
            header = [c.lower() for c in cells]
        elif not set("".join(cells)) <= set("-: "):
            rows.append(dict(zip(header, cells)))
    return rows


STOP = {"to", "the", "a", "an", "of", "by", "and", "for", "in", "on", "with", "from", "into", "as", "at"}


def tokens(tag: str) -> set[str]:
    return {t for t in tag.lower().split("-") if t and t not in STOP}


def suggest_merges(concepts: list[dict], min_jaccard: float = 0.5, min_ratio: float = 0.85) -> list[dict]:
    """Near-duplicate role tags and tensions, for an LLM to confirm. Deterministic."""
    uses: dict[str, set[str]] = defaultdict(set)      # tag -> where it is used (kind:slug)
    filled_by: dict[str, set[str]] = defaultdict(set)  # tag -> bricks that fill it
    for c in concepts:
        fm, slug, t = c["fm"], c["slug"], c["fm"]["type"]
        if t == "Idea Card":
            for tag in as_list(fm.get("roles")):
                uses[tag].add(f"card-role:{slug}")
            for tag in as_list(fm.get("tensions")):
                uses[tag].add(f"tension:{slug}")
        elif t == "Brick" and fm.get("status") != "deprecated":
            for tag in brick_roles(fm):
                uses[tag].add(f"brick:{slug}")
                filled_by[tag].add(slug)
        elif t == "Move" and fm.get("role"):
            uses[fm["role"]].add(f"move:{slug}")
    tags = sorted(uses)
    out = []
    for i, a in enumerate(tags):
        ta = tokens(a)
        for b in tags[i + 1:]:
            tb = tokens(b)
            jac = len(ta & tb) / len(ta | tb) if ta | tb else 0.0
            ratio = difflib.SequenceMatcher(None, a, b).ratio()
            shared = sorted(filled_by[a] & filled_by[b])
            if jac >= min_jaccard or ratio >= min_ratio or (shared and jac > 0):
                out.append({"a": a, "b": b, "jaccard": round(jac, 2), "ratio": round(ratio, 2),
                            "shared_bricks": shared, "uses_a": len(uses[a]), "uses_b": len(uses[b])})
    out.sort(key=lambda r: (-(len(r["shared_bricks"]) > 0), -r["jaccard"], -r["ratio"], r["a"], r["b"]))
    return out


def build(concepts: list[dict]) -> dict:
    by_type: dict[str, dict[str, dict]] = defaultdict(dict)
    for c in concepts:
        by_type[c["fm"]["type"]][c["slug"]] = c
    bricks = {s: c["fm"] for s, c in by_type["Brick"].items() if c["fm"].get("status") != "deprecated"}
    cards = {s: c["fm"] for s, c in by_type["Idea Card"].items()}
    moves = {s: c["fm"] for s, c in by_type["Move"].items()}
    readings = by_type["Reading"]

    moved: dict[str, set[str]] = defaultdict(set)
    migrate_moves = []
    for ms, fm in sorted(moves.items()):
        if fm.get("move_type") == "migrate-brick" and fm.get("brick"):
            if fm.get("to_field"):
                moved[fm["brick"]].add(fm["to_field"])
            migrate_moves.append({"move": ms, "brick": fm["brick"], "from_field": fm.get("from_field"), "to_field": fm.get("to_field")})

    def fields_of(slug: str) -> set[str]:
        return brick_fields(bricks[slug], moved, slug)

    broken, one_way = [], []
    for cs, fm in cards.items():
        for a in as_list(fm.get("bricks")):
            if a not in bricks:
                broken.append({"from": f"card:{cs}", "to": f"brick:{a}"})
            elif cs not in as_list(bricks[a].get("cards")):
                one_way.append({"from": f"card:{cs}", "to": f"brick:{a}"})
        for mv in as_list(fm.get("moves")):
            if mv not in moves:
                broken.append({"from": f"card:{cs}", "to": f"move:{mv}"})
    for a, fm in bricks.items():
        for cs in as_list(fm.get("cards")):
            if cs not in cards:
                broken.append({"from": f"brick:{a}", "to": f"card:{cs}"})
    for ms, fm in moves.items():
        for key in ("from_brick", "to_brick", "brick"):
            if fm.get(key) and fm[key] not in bricks:
                broken.append({"from": f"move:{ms}", "to": f"brick:{fm[key]}"})

    links = {a: sorted(set(as_list(fm.get("cards"))) | {cs for cs, cfm in cards.items() if a in as_list(cfm.get("bricks"))})
             for a, fm in bricks.items()}
    by_field_count = sorted(({"brick": a, "fields": sorted(fields_of(a))} for a in bricks),
                            key=lambda r: (-len(r["fields"]), r["brick"]))

    role_bricks: dict[str, list[str]] = defaultdict(list)
    for a, fm in bricks.items():
        for r in brick_roles(fm):
            role_bricks[r].append(a)
    convergence = []
    for role, members in sorted(role_bricks.items()):
        members = sorted(members)
        unrelated = [(x, y) for i, x in enumerate(members) for y in members[i + 1:]
                     if not (fields_of(x) & fields_of(y))]
        if unrelated:
            convergence.append({"role": role, "bricks": members,
                                "fields": {m: sorted(fields_of(m)) for m in members},
                                "unrelated_pairs": [list(p) for p in unrelated]})

    slot_moves: dict[str, list[str]] = defaultdict(list)
    for ms, fm in moves.items():
        if fm.get("move_type") == "substitute-brick" and fm.get("role"):
            slot_moves[fm["role"]].append(ms)
    hot_slots = [{"role": r, "moves": sorted(ms)} for r, ms in sorted(slot_moves.items()) if len(ms) >= 2]

    gaps = []
    for cs, fm in sorted(cards.items()):
        field = fm.get("field")
        tensions = set(as_list(fm.get("tensions")))
        if not field or not tensions:
            continue
        for a, afm in sorted(bricks.items()):
            matched = sorted(brick_roles(afm) & tensions)
            if matched and field not in fields_of(a):
                gaps.append({"brick": a, "card": cs, "field": field, "roles": matched,
                             "brick_fields": sorted(fields_of(a))})

    low_confidence = [{"brick": a, "field": m.get("field"), "source": m.get("source"), "role": m.get("role")}
                      for a, fm in sorted(bricks.items()) for m in as_list(fm.get("migrations"))
                      if isinstance(m, dict) and str(m.get("match_confidence", "")).lower() == "low"]

    constraints: dict[str, list[str]] = defaultdict(list)
    evidence_limits: dict[str, list[str]] = defaultdict(list)
    for cs, fm in sorted(cards.items()):
        for c in as_list(fm.get("constraints")):
            constraints[c].append(cs)
        for c in as_list(fm.get("evidence_limits")):
            evidence_limits[c].append(cs)

    hints = []
    for rs, c in sorted(readings.items()):
        rows = table_rows(c["body"], "Notes")
        hints.append({"reading": rs, "mode": c["fm"].get("mode"),
                      "level3_hints": sum(1 for r in rows if r.get("hint", "").strip() == "3"),
                      "notes": len(rows)})

    known_state = by_type["State"].get("known-bricks")
    known = parse_known_bricks(known_state["body"]) if known_state else {}
    coverage = {
        "owned": sorted(k for k, v in known.items() if v == "owned"),
        "seen": sorted(k for k, v in known.items() if v == "seen"),
        "unknown_slugs": sorted(k for k in known if k not in bricks),
        "bank_bricks": len(bricks),
        "owned_share": round(sum(1 for k, v in known.items() if v == "owned" and k in bricks) / len(bricks), 3) if bricks else 0.0,
    }

    g = unit_graph(concepts)
    broken += g["broken"]

    return {
        "counts": {t: len(v) for t, v in sorted(by_type.items())},
        "parts": g["parts"],
        "part_cuts": g["part_cuts"],
        "part_how": {w: {p: h.split(":", 1)[0] for p, h in d.items()} for w, d in g["part_how"].items()},
        "part_of": g["part_of"],
        "depth": g["depth"],
        "part_cycles": g["part_cycles"],
        "unit_links": g["unit_links"],
        "fields": sorted({f for a in bricks for f in fields_of(a)} | {fm.get("field") for fm in cards.values() if fm.get("field")}),
        "links": links,
        "broken_links": broken,
        "one_way_links": one_way,
        "bricks_by_field_count": by_field_count,
        "convergence": convergence,
        "hot_slots": hot_slots,
        "migration_gap_candidates": gaps,
        "migrate_brick_moves": migrate_moves,
        "low_confidence_matches": low_confidence,
        "constraints": dict(sorted(constraints.items())),
        "evidence_limits": dict(sorted(evidence_limits.items())),
        "reading_hints": hints,
        "known_bricks": coverage,
    }


def render(ix: dict) -> str:
    out = ["# Idea index", "", "Counts: " + (", ".join(f"{k} {v}" for k, v in ix["counts"].items()) or "empty bank"), ""]
    out += ["Fields: " + (", ".join(ix["fields"]) or "none"), ""]
    out += ["## Broken links"] + ([f"- {b['from']} -> {b['to']}" for b in ix["broken_links"]] or ["- none"]) + [""]
    out += ["## One-way links (brick does not list the card)"] + ([f"- {b['from']} -> {b['to']}" for b in ix["one_way_links"]] or ["- none"]) + [""]
    out += ["## Bricks by field count"] + ([f"- {r['brick']}: {len(r['fields'])} ({', '.join(r['fields'])})" for r in ix["bricks_by_field_count"]] or ["- none"]) + [""]
    out += ["## Convergence"] + ([f"- {c['role']}: {', '.join(c['bricks'])}" for c in ix["convergence"]] or ["- none"]) + [""]
    out += ["## Hot slots"] + ([f"- {h['role']}: {len(h['moves'])} substitutions ({', '.join(h['moves'])})" for h in ix["hot_slots"]] or ["- none"]) + [""]
    out += ["## Migration-gap candidates (judge each by structure)"] + (
        [f"- {g['brick']} -> {g['field']} (card {g['card']}, roles {', '.join(g['roles'])})" for g in ix["migration_gap_candidates"]] or ["- none"]) + [""]
    out += ["## Migrate-brick moves"] + ([f"- {m['move']}: {m['brick']} {m['from_field']} -> {m['to_field']}" for m in ix["migrate_brick_moves"]] or ["- none"]) + [""]
    out += ["## Low-confidence matches (review)"] + ([f"- {m['brick']} in {m['field']} ({m['source']})" for m in ix["low_confidence_matches"]] or ["- none"]) + [""]
    deep = sorted(ix["depth"].items(), key=lambda kv: (-kv[1], kv[0]))
    out += ["## Parts (depth is relative: 0 = no parts yet)"] + (
        [f"- {k}: depth {d}, {len(ix['parts'].get(k, []))} parts in {len(ix['part_cuts'].get(k, {}))} cut(s), "
         f"part of {len(ix['part_of'].get(k, []))}" for k, d in deep[:15]]
        + ([f"- ... {len(deep) - 15} more"] if len(deep) > 15 else []) or ["- none"]) + [""]
    out += ["## Part cycles (fix: a unit cannot contain itself)"] + ([f"- {' -> '.join(c)}" for c in ix["part_cycles"]] or ["- none"]) + [""]
    out += [f"## Unit links: {len(ix['unit_links'])}", ""]
    out += ["## Constraints of the time"] + ([f"- {c}: {', '.join(cs)}" for c, cs in ix["constraints"].items()] or ["- none"]) + [""]
    out += ["## Evidence limits"] + ([f"- {c}: {', '.join(cs)}" for c, cs in ix["evidence_limits"].items()] or ["- none"]) + [""]
    out += ["## Level-3 hints per reading"] + ([f"- {h['reading']} ({h['mode']}): {h['level3_hints']} of {h['notes']} notes" for h in ix["reading_hints"]] or ["- none"]) + [""]
    k = ix["known_bricks"]
    out += ["## Known bricks", f"- owned {len(k['owned'])}, seen {len(k['seen'])}, bank bricks {k['bank_bricks']}, owned share {k['owned_share']}"]
    if k["unknown_slugs"]:
        out.append(f"- slugs not in bank: {', '.join(k['unknown_slugs'])}")
    return "\n".join(out) + "\n"


REL_BEGIN = "<!-- related:begin (generated by idea_index.py --write; edit the frontmatter lists, not this section) -->"
REL_END = "<!-- related:end -->"
REL_RE = re.compile(r"\n*<!-- related:begin.*?<!-- related:end -->\n*", re.S)
SIG_KEYS = ("input", "output", "objective", "constraint", "math")
DIRS = {"Brick": "bricks", "Idea Card": "cards", "Lens": "lenses", "Move": "moves"}


def link_prefix(root: Path) -> str:
    """Bundle-relative prefix of the bank (`/ideas`) when the bank sits in an OKF bundle, else ''."""
    root = root.resolve()
    for anc in [root, *root.parents]:
        idx = anc / "index.md"
        if idx.is_file() and "okf_version" in idx.read_text(encoding="utf-8")[:200]:
            rel = root.relative_to(anc).as_posix()
            return "" if rel == "." else "/" + rel
    return ""


def views(concepts: list[dict], prefix: str) -> dict[str, str]:
    """Generated `# Related` block per concept path (bank-relative), from frontmatter lists only."""
    by = {t: {c["slug"]: c for c in concepts if c["fm"]["type"] == t} for t in DIRS}

    def ln(t: str, slug: str) -> str | None:
        c = by[t].get(slug)
        if not c:
            return None
        return f"[{c['fm'].get('title') or slug}]({prefix}/{DIRS[t]}/{slug}.md)"

    out: dict[str, list[str]] = defaultdict(list)
    bricks = {s: c["fm"] for s, c in by["Brick"].items()}
    role_bricks: dict[str, list[str]] = defaultdict(list)
    for s, fm in bricks.items():
        if fm.get("status") != "deprecated":
            for r in brick_roles(fm):
                role_bricks[r].append(s)

    card_bricks: dict[str, set[str]] = defaultdict(set)   # union of both directions
    for cs, c in by["Idea Card"].items():
        card_bricks[cs] |= set(as_list(c["fm"].get("bricks")))
    for s, fm in bricks.items():
        for cs in as_list(fm.get("cards")):
            card_bricks[cs].add(s)
    brick_cards: dict[str, set[str]] = defaultdict(set)
    for cs, ss in card_bricks.items():
        for s in ss:
            brick_cards[s].add(cs)
    move_refs: dict[tuple[str, str], list[tuple[str, str]]] = defaultdict(list)  # (type, slug) -> [(move, how)]
    for ms, c in by["Move"].items():
        fm = c["fm"]
        for key, t, how in (("from_brick", "Brick", "from this brick"), ("to_brick", "Brick", "to this brick"),
                            ("brick", "Brick", "moves this brick"), ("parent", "Idea Card", "parent"),
                            ("child", "Idea Card", "child"), ("card", "Idea Card", "child")):
            if fm.get(key):
                move_refs[(t, fm[key])].append((ms, how))
    lens_cards: dict[str, set[str]] = defaultdict(set)
    for cs, c in by["Idea Card"].items():
        for l in as_list(c["fm"].get("lenses")):
            lens_cards[l].add(cs)
    for l, c in by["Lens"].items():
        lens_cards[l] |= set(as_list(c["fm"].get("cards")))

    for s, fm in sorted(bricks.items()):
        lines = out[f"bricks/{s}"]
        role_in = {m.get("source"): m.get("role") for m in as_list(fm.get("migrations")) if isinstance(m, dict)}
        for cs in sorted(brick_cards[s]):
            l = ln("Idea Card", cs)
            if l:
                field = by["Idea Card"][cs]["fm"].get("field")
                lines.append(f"- Used in {l}" + (f" ({field})" if field else "") + (f", as `{role_in[cs]}`" if role_in.get(cs) else "") + ".")
        for r in sorted(brick_roles(fm)):
            for o in sorted(set(role_bricks[r]) - {s}):
                ofields = sorted(brick_fields(bricks[o]))
                lines.append(f"- Shares role `{r}` with {ln('Brick', o)}" + (f" ({', '.join(ofields)})" if ofields else "") + ".")
        for ms, how in sorted(set(move_refs[("Brick", s)])):
            mfm = by["Move"][ms]["fm"]
            lines.append(f"- Move {ln('Move', ms)} ({mfm.get('move_type', 'move')}, {how}).")
    for cs, c in sorted(by["Idea Card"].items()):
        fm, lines = c["fm"], out[f"cards/{cs}"]
        for a in sorted(card_bricks[cs]):
            l = ln("Brick", a)
            lines.append(f"- Brick {l}." if l else f"- Brick `{a}` (no file yet).")
        for l in sorted(set(as_list(fm.get("lenses"))) | {x for x, cc in lens_cards.items() if cs in cc}):
            lk = ln("Lens", l)
            if lk:
                lines.append(f"- Lens {lk}.")
        if fm.get("parent") and ln("Idea Card", fm["parent"]):
            lines.append(f"- Parent card {ln('Idea Card', fm['parent'])}.")
        mv = set(as_list(fm.get("moves"))) | {m for m, _ in move_refs[("Idea Card", cs)]}
        for ms in sorted(mv):
            l = ln("Move", ms)
            if l:
                mfm = by["Move"][ms]["fm"]
                role = f" on `{mfm['role']}`" if mfm.get("role") else ""
                lines.append(f"- Move {l} ({mfm.get('move_type', 'move')}{role}).")
    for l, c in sorted(by["Lens"].items()):
        lines = out[f"lenses/{l}"]
        for cs in sorted(lens_cards[l]):
            lk = ln("Idea Card", cs)
            if lk:
                lines.append(f"- Seen in {lk}.")
    for ms, c in sorted(by["Move"].items()):
        fm, lines = c["fm"], out[f"moves/{ms}"]
        for key, t, label in (("parent", "Idea Card", "Parent card"), ("child", "Idea Card", "Child card"),
                              ("card", "Idea Card", "Child card"), ("from_brick", "Brick", "From brick"),
                              ("to_brick", "Brick", "To brick"), ("brick", "Brick", "Brick moved")):
            l = ln(t, fm.get(key) or "")
            row = f"- {label} {l}." if l else None
            if row and row not in lines:
                lines.append(row)

    g = unit_graph(concepts)
    kt = {k: t for k, t in UNIT_TYPES.items()}

    def at(key: str) -> str:
        k, slug = key.split(":", 1)
        return f"{DIRS[kt[k]]}/{slug}"

    def lk(key: str) -> str:
        k, slug = key.split(":", 1)
        return ln(kt[k], slug) or f"`{slug}`"
    for key, cuts in g["part_cuts"].items():
        how = g["cut_how"].get(key, {})
        for cut, ps in cuts.items():  # one line per cut, the lens named (linked when it is a lens file)
            lens = ln("Lens", cut) or f"`{cut}`"
            out[at(key)].append(f"- Parts by cut {lens}: " + ", ".join(
                lk(p) + (f" ({how[(cut, p)]})" if (cut, p) in how else "") for p in ps) + ".")
    for key, wholes in g["part_of"].items():
        out[at(key)] += [f"- Part of {lk(w)}." for w in wholes]
    for l in g["unit_links"]:
        tail = (f" via {lk(l['via'])}" if l["via"] else "") + (f": {l['note']}" if l["note"] else "") + "."
        out[at(l["a"])].append(f"- Linked to {lk(l['b'])}{tail}")
        out[at(l["b"])].append(f"- Linked to {lk(l['a'])}{tail}")
    return {k: "\n".join(v) for k, v in out.items()}


def related_block(lines: str) -> str:
    return f"{REL_BEGIN}\n# Related\n\n{lines or '- none yet'}\n{REL_END}\n"


def with_related(body: str, lines: str) -> str:
    stripped = REL_RE.sub("\n", body).rstrip("\n")
    return (stripped + "\n\n" if stripped.strip() else "") + related_block(lines)


def sig_lines(sig) -> str:
    if isinstance(sig, dict):
        rows = [f"- **{k.capitalize()}:** {sig[k]}" for k in SIG_KEYS if sig.get(k) not in (None, "")]
        rows += [f"- **{k.capitalize()}:** {v}" for k, v in sig.items() if k not in SIG_KEYS and v not in (None, "")]
        return "\n".join(rows)
    return f"- {sig}"


def lift_signature(fm_text: str, body: str, sig) -> tuple[str, str]:
    """Remove `signature:` (and its indented lines) from the frontmatter text; put it as a list under # Signature."""
    out, skip = [], False
    for line in fm_text.splitlines():
        if line.startswith("signature:"):
            skip = True
            continue
        if skip and (line.startswith((" ", "\t")) or not line.strip()):
            continue
        skip = False
        out.append(line)
    block = sig_lines(sig)
    if re.search(r"^# Signature[ \t]*$", body, re.M):
        body = re.sub(r"^# Signature[ \t]*\n+", lambda m: f"# Signature\n{block}\n\n", body, count=1, flags=re.M)
    else:
        body = f"# Signature\n{block}\n\n" + body.lstrip("\n")
    return "\n".join(out), body


def bricks_index(concepts: list[dict]) -> str:
    bricks = {c["slug"]: c["fm"] for c in concepts if c["fm"]["type"] == "Brick"}
    live = {s: fm for s, fm in bricks.items() if fm.get("status") != "deprecated"}
    role_bricks: dict[str, list[str]] = defaultdict(list)
    for s, fm in live.items():
        for r in brick_roles(fm):
            role_bricks[r].append(s)
    shared = {r: sorted(ss) for r, ss in sorted(role_bricks.items()) if len(ss) >= 2}
    out = ["# bricks", "",
           "Generated by `idea_index.py --write` from brick frontmatter; do not edit by hand.", "",
           "## Shared roles", "",
           "Roles that two or more bricks fill: the places to compare or substitute. Every other role has one brick; grep `roles:` for it.", ""]
    out += [f"* `{r}` - " + ", ".join(f"[{live[s].get('title') or s}]({s}.md) ({', '.join(sorted(brick_fields(live[s]))) or 'no field'})" for s in ss)
            for r, ss in shared.items()] or ["* none yet"]
    out += ["", "## All bricks", ""]
    for s, fm in sorted(bricks.items(), key=lambda kv: (kv[1].get("title") or kv[0]).lower()):
        dep = " (deprecated)" if fm.get("status") == "deprecated" else ""
        out.append(f"* [{fm.get('title') or s}]({s}.md){dep} - {fm.get('description', '')}".rstrip(" -"))
    return "\n".join(out) + "\n"


def sync_views(root: Path, write: bool) -> list[str]:
    """Bring generated views up to date. Returns bank-relative paths that changed (or would change)."""
    concepts = load(root)
    rel = views(concepts, link_prefix(root))
    changed = []
    for c in concepts:
        t = c["fm"]["type"]
        if t not in DIRS:
            continue
        path = root / c["path"]
        text = path.read_text(encoding="utf-8")
        m = FM_RE.match(text)
        fm_text, body = m.group(1), m.group(2)
        if t == "Brick" and c["fm"].get("signature") is not None:
            fm_text, body = lift_signature(fm_text, body, c["fm"]["signature"])
        new = f"---\n{fm_text}\n---\n\n" + with_related(body.lstrip("\n"), rel.get(f"{DIRS[t]}/{c['slug']}", ""))
        if new != text:
            changed.append(c["path"])
            if write:
                path.write_text(new, encoding="utf-8")
    bricks_dir = root / "bricks"
    if bricks_dir.is_dir():
        idx = bricks_dir / "index.md"
        new = bricks_index(load(root) if write else concepts)
        if not idx.is_file() or idx.read_text(encoding="utf-8") != new:
            changed.append("bricks/index.md")
            if write:
                idx.write_text(new, encoding="utf-8")
    return changed


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("root", type=Path)
    ap.add_argument("--json", type=Path, help="also write the index as JSON to this path")
    ap.add_argument("--suggest-merges", action="store_true",
                    help="also list near-duplicate role tags and tensions for an LLM to confirm")
    mode = ap.add_mutually_exclusive_group()
    mode.add_argument("--write", action="store_true",
                      help="regenerate # Related sections and bricks/index.md; move frontmatter signatures to the body")
    mode.add_argument("--check", action="store_true", help="exit 1 when generated views are out of date")
    args = ap.parse_args(argv)
    if not args.root.is_dir():
        print(f"idea_index: {args.root} is not a directory", file=sys.stderr)
        return 2
    if args.write or args.check:
        changed = sync_views(args.root, write=args.write)
        verb = "updated" if args.write else "out of date"
        print(f"idea_index: {len(changed)} file(s) {verb}" + "".join(f"\n  {p}" for p in changed))
        return 1 if (args.check and changed) else 0
    concepts = load(args.root)
    ix = build(concepts)
    if args.suggest_merges:
        ix["merge_suggestions"] = suggest_merges(concepts)
    if args.json:
        args.json.write_text(json.dumps(ix, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    sys.stdout.write(render(ix))
    if args.suggest_merges:
        rows = ix["merge_suggestions"]
        sys.stdout.write("\n## Merge suggestions (confirm by meaning before merging)\n")
        sys.stdout.write("".join(f"- {r['a']} ~ {r['b']} (jaccard {r['jaccard']}, ratio {r['ratio']}"
                                 + (f", shared bricks {', '.join(r['shared_bricks'])}" if r["shared_bricks"] else "")
                                 + f"; uses {r['uses_a']}/{r['uses_b']})\n" for r in rows) or "- none\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
