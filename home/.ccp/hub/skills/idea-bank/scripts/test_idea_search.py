"""Tests for idea_search.py without a model: the embedder is replaced by hashed bag-of-words vectors.
Run: uv run --with pytest --with pyyaml --with numpy pytest <this dir>"""
import hashlib
import importlib.util
import shutil
from pathlib import Path

import numpy as np
import pytest

HERE = Path(__file__).parent
spec = importlib.util.spec_from_file_location("idea_search", HERE / "idea_search.py")
S = importlib.util.module_from_spec(spec)
spec.loader.exec_module(S)
BANK = HERE / "fixtures" / "bank"


def fake_vec(text: str) -> np.ndarray:
    v = np.zeros(64, np.float32)
    for w in S.toks(text):
        v[int(hashlib.md5(w.encode()).hexdigest(), 16) % 64] += 1
    return v / max(np.linalg.norm(v), 1e-12)


class FakeEmbedder:
    calls = 0

    def __enter__(self):
        return self

    def __exit__(self, *a):
        pass

    def embed(self, texts):
        FakeEmbedder.calls += 1
        return np.stack([fake_vec(t) for t in texts])


@pytest.fixture
def bank(tmp_path, monkeypatch):
    monkeypatch.setattr(S, "Embedder", FakeEmbedder)
    dst = tmp_path / "bank"
    shutil.copytree(BANK, dst)
    S.ix.main([str(dst), "--write"])  # body signatures and Related blocks, as in a real bank
    return dst


def test_chunks_skip_related_and_split_views(bank):
    ch = S.chunks(S.ix.load(bank))
    assert not any("related:begin" in c["text"] or "Used in [" in c["text"] for c in ch)
    views = {(c["slug"], c["view"]) for c in ch}
    assert ("sparse-overcomplete-code", "sig") in views
    names = [c for c in ch if c["slug"] == "sparse-overcomplete-code" and c["view"] == "names"]
    assert {c["field"] for c in names} == {"neuroscience", "machine-learning", "interpretability"}
    sig = next(c for c in ch if c["slug"] == "sparse-overcomplete-code" and c["view"] == "sig")
    assert sig["text"].startswith("- Input: signal")


def test_index_is_incremental(bank):
    FakeEmbedder.calls = 0
    S.Index(bank)
    assert FakeEmbedder.calls == 1 and (bank / S.CACHE).is_file()
    S.Index(bank)
    assert FakeEmbedder.calls == 1  # nothing changed, nothing embedded
    p = bank / "atoms" / "fixed-basis-transform.md"
    p.write_text(p.read_text().replace("fixed basis", "fixed cosine basis"))
    assert S.Index(bank).embedded >= 1


def test_search_finds_atom_by_words(bank):
    idx = S.Index(bank)
    q = "learn a basis so each signal is a sparse mix"
    res = idx.search(S.Embedder().embed([S.QUERY.format(q)])[0], q, idx.mask(types={"Atom"}))
    assert res[0]["slug"] == "sparse-overcomplete-code"
    assert all(r["type"] == "Atom" for r in res)


def test_mask_removes_chunks(bank):
    idx = S.Index(bank)
    m = idx.mask(types={"Atom"}, keep=lambda c: c["slug"] != "sparse-overcomplete-code")
    q = "sparse coefficients"
    res = idx.search(S.Embedder().embed([q])[0], q, m)
    assert "sparse-overcomplete-code" not in {r["slug"] for r in res}


def test_bm25_prefers_rare_shared_word():
    b = S.BM25(["the cat sat", "the dog sat", "a dictionary of atoms"])
    s = b.scores("dictionary sat")
    assert s.argmax() == 2


def test_ppr_spreads_and_respects_drop():
    g = {"a": {"b"}, "b": {"a", "c"}, "c": {"b"}}
    r = S.ppr(g, {"a": 1.0})
    assert r["a"] > r["b"] > r["c"] > 0
    assert "c" not in S.ppr(g, {"a": 1.0}, drop={"b"})


def test_rrf_rewards_agreement():
    s = S.rrf(["x", "y"], ["y", "z"])
    assert max(s, key=s.get) == "y"


def test_like_other_fields(bank):
    idx = S.Index(bank)
    res = idx.like("sparse-overcomplete-code", 5, other_fields=False)
    assert [r["slug"] for r in res] == ["fixed-basis-transform"]
    assert res[0]["shared_roles"] == ["sparse-represent-signal"]


def test_apply_rerank_puts_ranked_first_and_keeps_the_rest():
    out = S.apply_rerank('noise {"ranked": ["c", "x-not-in-list", "a", "c"]} noise', ["a", "b", "c", "d"])
    assert out == ["c", "a", "b", "d"]


def test_apply_rerank_fails_loudly_without_json():
    with pytest.raises(ValueError):
        S.apply_rerank("I cannot rank these", ["a"])


def test_rerank_prompt_hides_fused_order(bank):
    idx = S.Index(bank)
    p = S.rerank_prompt(idx, "q", ["sparse-overcomplete-code", "fixed-basis-transform"])
    assert "`sparse-overcomplete-code`" in p and "- Input: signal" in p and '{"ranked"' in p
