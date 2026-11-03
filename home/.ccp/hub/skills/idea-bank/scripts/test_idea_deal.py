"""Tests for idea_deal.py. Run: uv run --with pytest --with pyyaml pytest <this dir>"""
import importlib.util
import json
import random
from pathlib import Path

import pytest

HERE = Path(__file__).parent
spec = importlib.util.spec_from_file_location("idea_deal", HERE / "idea_deal.py")
D = importlib.util.module_from_spec(spec)
spec.loader.exec_module(D)
BANK = HERE / "fixtures" / "bank"


@pytest.fixture(scope="module")
def bank():
    return D.Bank(BANK)


def test_menu_counts(bank):
    m = bank.menu()
    assert m["bank"]["atoms"] == 2 and m["move"]["pool"] == 3
    assert m["role"]["pool"] == 1  # sparse-represent-signal is shared by both atoms
    assert m["gap"]["pool"] == 2


def test_same_seed_same_hand(bank):
    a = bank.deal("move", 2, random.Random(5))
    b = bank.deal("move", 2, random.Random(5))
    assert a == b


def test_role_deal_shares_the_role(bank):
    h = bank.deal("role", 5, random.Random(1))
    assert h["role"] == "sparse-represent-signal"
    assert {i["slug"] for i in h["items"]} == {"fixed-basis-transform", "sparse-overcomplete-code"}
    assert all("sparse-represent-signal" in i["roles"] for i in h["items"])


def test_signature_is_only_the_list(bank):
    it = bank.item("atom", "sparse-overcomplete-code")
    assert it["signature"] == "" or "**Input:**" in it["signature"]


def test_gap_hand_has_distinct_atoms(bank):
    h = bank.deal("gap", 5, random.Random(3))
    slugs = [i["slug"] for i in h["items"]]
    assert len(slugs) == len(set(slugs))
    assert all(i["target_field"] == "genomics" for i in h["items"])


def test_move_deal_skips_the_moves_own_cards(bank):
    for s in range(10):
        h = bank.deal("move", 3, random.Random(s))
        fm = bank.moves[h["items"][0]["slug"]]["fm"]
        own = {fm.get("card"), fm.get("child"), fm.get("parent")}
        assert not {i["slug"] for i in h["items"][1:]} & own


def test_empty_pool_crashes_with_a_message(bank):
    with pytest.raises(SystemExit, match="no lens"):
        bank.deal("lens", 3, random.Random(0))


def test_unknown_role_crashes(bank):
    with pytest.raises(SystemExit, match="no atom has role"):
        bank.deal("role", 3, random.Random(0), role="nope")


def test_cli_prints_seed_and_json(capsys):
    assert D.main([str(BANK), "deal", "move", "-x", "2", "--seed", "42", "--json"]) == 0
    assert json.loads(capsys.readouterr().out)["seed"] == 42
    assert D.main([str(BANK), "deal", "move", "--seed", "42"]) == 0
    assert "(seed 42)" in capsys.readouterr().out
    assert D.main([str(BANK), "menu"]) == 0
