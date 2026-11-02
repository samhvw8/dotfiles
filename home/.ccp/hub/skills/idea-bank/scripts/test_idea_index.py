"""Tests for idea_index.py. Run: uv run --with pytest --with pyyaml pytest <this dir>"""
import importlib.util
import json
from pathlib import Path

import pytest

HERE = Path(__file__).parent
spec = importlib.util.spec_from_file_location("idea_index", HERE / "idea_index.py")
ix_mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(ix_mod)
BANK = HERE / "fixtures" / "bank"


@pytest.fixture(scope="module")
def ix():
    return ix_mod.build(ix_mod.load(BANK))


def test_counts(ix):
    assert ix["counts"] == {"Atom": 2, "Idea Card": 5, "Move": 3, "Reading": 1, "State": 1}


def test_broken_link_found(ix):
    assert {"from": "card:sae-features", "to": "atom:relu-encoder"} in ix["broken_links"]
    assert len(ix["broken_links"]) == 1


def test_one_way_link(ix):
    # sae-features lists the atom, the atom does not list the card
    assert {"from": "card:sae-features", "to": "atom:sparse-overcomplete-code"} in ix["one_way_links"]


def test_links_are_bidirectional_union(ix):
    assert ix["links"]["sparse-overcomplete-code"] == ["ksvd-2006", "olshausen-field-1996", "sae-features"]


def test_migrations_widen_fields(ix):
    top = ix["atoms_by_field_count"][0]
    assert top["atom"] == "sparse-overcomplete-code"
    assert top["fields"] == ["interpretability", "machine-learning", "mechanistic-interpretability", "neuroscience"]


def test_convergence_on_unrelated_fields(ix):
    roles = {c["role"]: c for c in ix["convergence"]}
    assert "sparse-represent-signal" in roles
    assert roles["sparse-represent-signal"]["unrelated_pairs"] == [["fixed-basis-transform", "sparse-overcomplete-code"]]


def test_hot_slot(ix):
    assert ix["hot_slots"] == [{"role": "sparse-represent-signal", "moves": ["fixed-to-learned-basis", "learned-basis-ksvd"]}]


def test_migration_gap_candidates(ix):
    gaps = {(g["atom"], g["field"]) for g in ix["migration_gap_candidates"]}
    assert gaps == {("fixed-basis-transform", "genomics"), ("sparse-overcomplete-code", "genomics")}


def test_no_gap_inside_reached_field(ix):
    assert all(g["field"] not in g["atom_fields"] for g in ix["migration_gap_candidates"])


def test_known_atoms(ix):
    k = ix["known_atoms"]
    assert k["owned"] == ["fixed-basis-transform"]
    assert k["unknown_slugs"] == ["ghost-atom"]
    assert k["owned_share"] == 0.5


def test_bad_frontmatter_crashes(tmp_path):
    (tmp_path / "bad.md").write_text("no frontmatter here\n")
    with pytest.raises(SystemExit):
        ix_mod.load(tmp_path)


def test_cli_json(tmp_path, capsys):
    out = tmp_path / "ix.json"
    assert ix_mod.main([str(BANK), "--json", str(out)]) == 0
    assert json.loads(out.read_text())["hot_slots"]
    assert "Migration-gap candidates" in capsys.readouterr().out


def test_migrate_atom_moves_widen_fields_but_not_hot_slots(ix):
    assert ix["migrate_atom_moves"] == [{"move": "sparse-code-to-sae", "atom": "sparse-overcomplete-code",
                                         "from_field": "neuroscience", "to_field": "mechanistic-interpretability"}]
    assert [h["role"] for h in ix["hot_slots"]] == ["sparse-represent-signal"]
    assert len(ix["hot_slots"][0]["moves"]) == 2


def test_low_confidence_listed(ix):
    assert ix["low_confidence_matches"] == [{"atom": "sparse-overcomplete-code", "field": "machine-learning",
                                             "source": "ksvd-2006", "role": "denoise-signal"}]


def test_constraints_index(ix):
    assert ix["constraints"] == {"compute-per-pixel-cost": ["jpeg"]}


def test_level3_hints_counted(ix):
    assert ix["reading_hints"] == [{"reading": "261102-sae", "mode": "deep", "level3_hints": 1, "notes": 3}]
