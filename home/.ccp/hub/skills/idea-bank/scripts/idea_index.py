# /// script
# requires-python = ">=3.10"
# dependencies = ["pyyaml>=6"]
# ///
"""Index an idea bank: links, convergence, migration-gap candidates, known-atoms coverage.

Usage: uv run idea_index.py <bank-root> [--json out.json] [--suggest-merges]

Deterministic and offline. Gap candidates are a list for judgement, not findings.
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


def atom_fields(fm: dict, moved: dict[str, set[str]] | None = None, slug: str | None = None) -> set[str]:
    """Fields an atom has reached: declared, migration rows, names, and migrate-atom moves."""
    fields = set(as_list(fm.get("fields")))
    if moved and slug:
        fields |= moved.get(slug, set())
    fields |= {m.get("field") for m in as_list(fm.get("migrations")) if isinstance(m, dict) and m.get("field")}
    fields |= set((fm.get("names") or {}).keys()) if isinstance(fm.get("names"), dict) else set()
    return fields


def atom_roles(fm: dict) -> set[str]:
    roles = set(as_list(fm.get("roles")))
    roles |= {m.get("role") for m in as_list(fm.get("migrations")) if isinstance(m, dict) and m.get("role")}
    return roles


def parse_known_atoms(body: str) -> dict[str, str]:
    """Read the table rows `| slug | seen/owned | ... |` from me/known-atoms.md."""
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
    filled_by: dict[str, set[str]] = defaultdict(set)  # tag -> atoms that fill it
    for c in concepts:
        fm, slug, t = c["fm"], c["slug"], c["fm"]["type"]
        if t == "Idea Card":
            for tag in as_list(fm.get("roles")):
                uses[tag].add(f"card-role:{slug}")
            for tag in as_list(fm.get("tensions")):
                uses[tag].add(f"tension:{slug}")
        elif t == "Atom" and fm.get("status") != "deprecated":
            for tag in atom_roles(fm):
                uses[tag].add(f"atom:{slug}")
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
                            "shared_atoms": shared, "uses_a": len(uses[a]), "uses_b": len(uses[b])})
    out.sort(key=lambda r: (-(len(r["shared_atoms"]) > 0), -r["jaccard"], -r["ratio"], r["a"], r["b"]))
    return out


def build(concepts: list[dict]) -> dict:
    by_type: dict[str, dict[str, dict]] = defaultdict(dict)
    for c in concepts:
        by_type[c["fm"]["type"]][c["slug"]] = c
    atoms = {s: c["fm"] for s, c in by_type["Atom"].items() if c["fm"].get("status") != "deprecated"}
    cards = {s: c["fm"] for s, c in by_type["Idea Card"].items()}
    moves = {s: c["fm"] for s, c in by_type["Move"].items()}
    readings = by_type["Reading"]

    moved: dict[str, set[str]] = defaultdict(set)
    migrate_moves = []
    for ms, fm in sorted(moves.items()):
        if fm.get("move_type") == "migrate-atom" and fm.get("atom"):
            if fm.get("to_field"):
                moved[fm["atom"]].add(fm["to_field"])
            migrate_moves.append({"move": ms, "atom": fm["atom"], "from_field": fm.get("from_field"), "to_field": fm.get("to_field")})

    def fields_of(slug: str) -> set[str]:
        return atom_fields(atoms[slug], moved, slug)

    broken, one_way = [], []
    for cs, fm in cards.items():
        for a in as_list(fm.get("atoms")):
            if a not in atoms:
                broken.append({"from": f"card:{cs}", "to": f"atom:{a}"})
            elif cs not in as_list(atoms[a].get("cards")):
                one_way.append({"from": f"card:{cs}", "to": f"atom:{a}"})
        for mv in as_list(fm.get("moves")):
            if mv not in moves:
                broken.append({"from": f"card:{cs}", "to": f"move:{mv}"})
    for a, fm in atoms.items():
        for cs in as_list(fm.get("cards")):
            if cs not in cards:
                broken.append({"from": f"atom:{a}", "to": f"card:{cs}"})
    for ms, fm in moves.items():
        for key in ("from_atom", "to_atom", "atom"):
            if fm.get(key) and fm[key] not in atoms:
                broken.append({"from": f"move:{ms}", "to": f"atom:{fm[key]}"})

    links = {a: sorted(set(as_list(fm.get("cards"))) | {cs for cs, cfm in cards.items() if a in as_list(cfm.get("atoms"))})
             for a, fm in atoms.items()}
    by_field_count = sorted(({"atom": a, "fields": sorted(fields_of(a))} for a in atoms),
                            key=lambda r: (-len(r["fields"]), r["atom"]))

    role_atoms: dict[str, list[str]] = defaultdict(list)
    for a, fm in atoms.items():
        for r in atom_roles(fm):
            role_atoms[r].append(a)
    convergence = []
    for role, members in sorted(role_atoms.items()):
        members = sorted(members)
        unrelated = [(x, y) for i, x in enumerate(members) for y in members[i + 1:]
                     if not (fields_of(x) & fields_of(y))]
        if unrelated:
            convergence.append({"role": role, "atoms": members,
                                "fields": {m: sorted(fields_of(m)) for m in members},
                                "unrelated_pairs": [list(p) for p in unrelated]})

    slot_moves: dict[str, list[str]] = defaultdict(list)
    for ms, fm in moves.items():
        if fm.get("move_type") == "substitute-atom" and fm.get("role"):
            slot_moves[fm["role"]].append(ms)
    hot_slots = [{"role": r, "moves": sorted(ms)} for r, ms in sorted(slot_moves.items()) if len(ms) >= 2]

    gaps = []
    for cs, fm in sorted(cards.items()):
        field = fm.get("field")
        tensions = set(as_list(fm.get("tensions")))
        if not field or not tensions:
            continue
        for a, afm in sorted(atoms.items()):
            matched = sorted(atom_roles(afm) & tensions)
            if matched and field not in fields_of(a):
                gaps.append({"atom": a, "card": cs, "field": field, "roles": matched,
                             "atom_fields": sorted(fields_of(a))})

    low_confidence = [{"atom": a, "field": m.get("field"), "source": m.get("source"), "role": m.get("role")}
                      for a, fm in sorted(atoms.items()) for m in as_list(fm.get("migrations"))
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

    known_state = by_type["State"].get("known-atoms")
    known = parse_known_atoms(known_state["body"]) if known_state else {}
    coverage = {
        "owned": sorted(k for k, v in known.items() if v == "owned"),
        "seen": sorted(k for k, v in known.items() if v == "seen"),
        "unknown_slugs": sorted(k for k in known if k not in atoms),
        "bank_atoms": len(atoms),
        "owned_share": round(sum(1 for k, v in known.items() if v == "owned" and k in atoms) / len(atoms), 3) if atoms else 0.0,
    }

    return {
        "counts": {t: len(v) for t, v in sorted(by_type.items())},
        "fields": sorted({f for a in atoms for f in fields_of(a)} | {fm.get("field") for fm in cards.values() if fm.get("field")}),
        "links": links,
        "broken_links": broken,
        "one_way_links": one_way,
        "atoms_by_field_count": by_field_count,
        "convergence": convergence,
        "hot_slots": hot_slots,
        "migration_gap_candidates": gaps,
        "migrate_atom_moves": migrate_moves,
        "low_confidence_matches": low_confidence,
        "constraints": dict(sorted(constraints.items())),
        "evidence_limits": dict(sorted(evidence_limits.items())),
        "reading_hints": hints,
        "known_atoms": coverage,
    }


def render(ix: dict) -> str:
    out = ["# Idea index", "", "Counts: " + (", ".join(f"{k} {v}" for k, v in ix["counts"].items()) or "empty bank"), ""]
    out += ["Fields: " + (", ".join(ix["fields"]) or "none"), ""]
    out += ["## Broken links"] + ([f"- {b['from']} -> {b['to']}" for b in ix["broken_links"]] or ["- none"]) + [""]
    out += ["## One-way links (atom does not list the card)"] + ([f"- {b['from']} -> {b['to']}" for b in ix["one_way_links"]] or ["- none"]) + [""]
    out += ["## Atoms by field count"] + ([f"- {r['atom']}: {len(r['fields'])} ({', '.join(r['fields'])})" for r in ix["atoms_by_field_count"]] or ["- none"]) + [""]
    out += ["## Convergence"] + ([f"- {c['role']}: {', '.join(c['atoms'])}" for c in ix["convergence"]] or ["- none"]) + [""]
    out += ["## Hot slots"] + ([f"- {h['role']}: {len(h['moves'])} substitutions ({', '.join(h['moves'])})" for h in ix["hot_slots"]] or ["- none"]) + [""]
    out += ["## Migration-gap candidates (judge each by structure)"] + (
        [f"- {g['atom']} -> {g['field']} (card {g['card']}, roles {', '.join(g['roles'])})" for g in ix["migration_gap_candidates"]] or ["- none"]) + [""]
    out += ["## Migrate-atom moves"] + ([f"- {m['move']}: {m['atom']} {m['from_field']} -> {m['to_field']}" for m in ix["migrate_atom_moves"]] or ["- none"]) + [""]
    out += ["## Low-confidence matches (review)"] + ([f"- {m['atom']} in {m['field']} ({m['source']})" for m in ix["low_confidence_matches"]] or ["- none"]) + [""]
    out += ["## Constraints of the time"] + ([f"- {c}: {', '.join(cs)}" for c, cs in ix["constraints"].items()] or ["- none"]) + [""]
    out += ["## Evidence limits"] + ([f"- {c}: {', '.join(cs)}" for c, cs in ix["evidence_limits"].items()] or ["- none"]) + [""]
    out += ["## Level-3 hints per reading"] + ([f"- {h['reading']} ({h['mode']}): {h['level3_hints']} of {h['notes']} notes" for h in ix["reading_hints"]] or ["- none"]) + [""]
    k = ix["known_atoms"]
    out += ["## Known atoms", f"- owned {len(k['owned'])}, seen {len(k['seen'])}, bank atoms {k['bank_atoms']}, owned share {k['owned_share']}"]
    if k["unknown_slugs"]:
        out.append(f"- slugs not in bank: {', '.join(k['unknown_slugs'])}")
    return "\n".join(out) + "\n"


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("root", type=Path)
    ap.add_argument("--json", type=Path, help="also write the index as JSON to this path")
    ap.add_argument("--suggest-merges", action="store_true",
                    help="also list near-duplicate role tags and tensions for an LLM to confirm")
    args = ap.parse_args(argv)
    if not args.root.is_dir():
        print(f"idea_index: {args.root} is not a directory", file=sys.stderr)
        return 2
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
                                 + (f", shared atoms {', '.join(r['shared_atoms'])}" if r["shared_atoms"] else "")
                                 + f"; uses {r['uses_a']}/{r['uses_b']})\n" for r in rows) or "- none\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
