# /// script
# requires-python = ">=3.10"
# dependencies = ["pyyaml>=6", "numpy>=1.26"]
# ///
"""Search an idea bank: EmbeddingGemma 2 vectors over several views per concept, fused with BM25.
Optional: Personalized PageRank over the bank's links (--graph).

Usage:
  uv run idea_search.py <bank-root> index                     # embed new or changed chunks
  uv run idea_search.py <bank-root> search "<text>" [-k 30] [--type atom|card|lens|move] [--graph] [--json]
  uv run idea_search.py <bank-root> like <atom-slug> [-k 10] [--other-fields] [--json]

Chunks: an atom gives a signature view, a gloss view (title, description, the prose), one
view per field in `names`, one per migration paragraph and one for `# Where it fails`. A
card gives its head, one chunk per layer section, one per Recipe, Raw and Mutations row.
Lenses and moves are one chunk each. Generated `# Related` sections are never embedded: the
graph step uses the links themselves.

Vectors are cached in <bank-root>/.index/eg2.npz, keyed by the exact embedded text, so
`index` embeds only what changed. The cache is derived data: keep it out of git.
The ranking is a shortlist for an LLM structure check, not a verdict. Bench (2026-11-03, 175
rows that were linked to an existing atom, query = the source quote only): hybrid recall@10
0.72, @30 0.81; one vector per file 0.51 @10; the graph step added nothing at @10, so it is off
by default. Read a shortlist of 30, not 10.

IDEA_LLAMA_SERVER  llama-server binary (default: newest llama.cpp mise has installed, then PATH)
"""
from __future__ import annotations

import argparse
import hashlib
import http.client
import importlib.util
import json
import math
import os
import re
import shlex
import shutil
import socket
import subprocess
import sys
import tempfile
import time
import uuid
from collections import Counter, defaultdict
from pathlib import Path

import numpy as np

HERE = Path(__file__).parent
_spec = importlib.util.spec_from_file_location("idea_index", HERE / "idea_index.py")
ix = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(ix)

GGUF = "ggml-org/embeddinggemma-2-GGUF:Q8_0"
CTX = 8192
QUERY = "task: search result | query: {}"
DOC = "title: {} | text: {}"
SYM = "task: sentence similarity | query: {}"
CACHE = Path(".index") / "eg2.npz"
TYPES = {"atom": "Atom", "card": "Idea Card", "lens": "Lens", "move": "Move"}
REL_RE = ix.REL_RE


# ---------- chunks ----------

def sections(body: str) -> list[tuple[str, str]]:
    """Top-level `# Heading` sections of a body, generated Related block removed."""
    body = REL_RE.sub("\n", body)
    out, head, buf = [], "", []
    for line in body.splitlines():
        if line.startswith("# "):
            if head or "".join(buf).strip():
                out.append((head, "\n".join(buf).strip()))
            head, buf = line[2:].strip(), []
        else:
            buf.append(line)
    if head or "".join(buf).strip():
        out.append((head, "\n".join(buf).strip()))
    return out


def paragraphs(text: str) -> list[str]:
    return [p.strip() for p in re.split(r"\n\s*\n", text) if p.strip()]


def table_rows(text: str) -> list[list[str]]:
    rows = []
    for line in text.splitlines():
        s = line.strip()
        if s.startswith("|") and not set(s) <= set("|-: "):
            rows.append([c.strip() for c in s.strip("|").split("|")])
    return rows[1:] if rows else []  # drop the header row


def items(text: str) -> list[str]:
    """List items, quote lines and table rows of a section, one per entry."""
    out = []
    for line in text.splitlines():
        s = line.strip()
        if s.startswith(("- ", "* ", "> ")) or re.match(r"^\d+\.\s", s):
            out.append(s.lstrip("-*> ").strip())
        elif out and s and not s.startswith("|") and not s.startswith("#"):
            out[-1] += " " + s
    return out or ([r for r in (" | ".join(row) for row in table_rows(text))] if "|" in text else paragraphs(text))


def chunks(concepts: list[dict]) -> list[dict]:
    """Every searchable chunk: {slug, type, view, title, text, mentions, field}."""
    card_slugs = {c["slug"] for c in concepts if c["fm"]["type"] == "Idea Card"}
    out = []

    def add(c, view, text, field=None):
        text = re.sub(r"\s+", " ", text).strip()
        if text:
            mentions = sorted({s for s in card_slugs if s in text})
            out.append({"slug": c["slug"], "type": c["fm"]["type"], "view": view, "title": c["fm"].get("title") or c["slug"],
                        "text": text, "mentions": mentions, "field": field})

    for c in concepts:
        fm, t = c["fm"], c["fm"]["type"]
        secs = sections(c["body"])
        head = f"{fm.get('title', '')}. {fm.get('description', '')}"
        if t == "Atom":
            sig = dict(secs).get("Signature", "")
            sig_list = "\n".join(l for l in sig.splitlines() if l.strip().startswith("- **"))
            prose = "\n".join(l for l in sig.splitlines() if not l.strip().startswith("- **"))
            add(c, "sig", re.sub(r"\*\*", "", sig_list) or fm.get("description", ""))
            add(c, "gloss", f"{head} {prose}")
            names = fm.get("names") if isinstance(fm.get("names"), dict) else {}
            for field, ns in names.items():
                add(c, "names", f"{field}: " + "; ".join(map(str, ix.as_list(ns))), field=field)
            for p in paragraphs(dict(secs).get("Migrations", "")):
                add(c, "mig", p)
            add(c, "fails", dict(secs).get("Where it fails", "") or str(fm.get("fails_when") or ""))
        elif t == "Idea Card":
            add(c, "head", head, field=fm.get("field"))
            for h, text in secs:
                if h.startswith("Recipe"):
                    for row in table_rows(text):
                        add(c, "recipe", " | ".join(row), field=fm.get("field"))
                elif h in ("Raw", "Mutations", "Gems"):
                    for it in items(text):
                        add(c, h.lower(), it, field=fm.get("field"))
                elif text:
                    add(c, "layer", f"{h}: {text}", field=fm.get("field"))
        elif t in ("Lens", "Move"):
            add(c, "whole", head + " " + " ".join(f"{h}: {x}" for h, x in secs))
    return out


# ---------- embedder ----------

def llama_binary() -> str:
    if os.environ.get("IDEA_LLAMA_SERVER"):
        return os.environ["IDEA_LLAMA_SERVER"]
    try:
        r = subprocess.run(["mise", "ls", "--installed", "--json", "github:ggml-org/llama.cpp"],
                           capture_output=True, text=True, timeout=10)
        installs = json.loads(r.stdout or "[]")
    except (OSError, ValueError, subprocess.TimeoutExpired):
        installs = []
    build = lambda v: int(v.get("version", "").lstrip("b")) if v.get("version", "").lstrip("b").isdigit() else -1
    for v in sorted(installs, key=build, reverse=True):
        p = Path(v.get("install_path", "")) / "llama-server"
        if p.is_file():
            return str(p)
    found = shutil.which("llama-server")
    if not found:
        raise SystemExit("idea_search: needs llama.cpp's llama-server: set IDEA_LLAMA_SERVER or install "
                         "github:ggml-org/llama.cpp with mise")
    return found


class _UnixHTTP(http.client.HTTPConnection):
    def __init__(self, sock_path: str, timeout: float):
        super().__init__("localhost", timeout=timeout)
        self.sock_path = sock_path

    def connect(self) -> None:
        s = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
        s.settimeout(self.timeout)
        s.connect(self.sock_path)
        self.sock = s


class Embedder:
    """llama-server on a private Unix socket for the life of a `with` block. A small shell
    waits on stdin and kills the server when this process closes the pipe or dies."""

    def __init__(self):
        self.sock = str(Path(tempfile.gettempdir()) / f"idea-eg2-{uuid.uuid4().hex[:12]}.sock")
        self.logf = self.sock[:-5] + ".log"
        self.proc = None

    def __enter__(self):
        args = [llama_binary(), "-hf", GGUF, "--embeddings", "-c", str(CTX), "-b", str(CTX), "-ub", str(CTX),
                "-ngl", "99", "--no-webui", "--no-mmproj", "--host", self.sock]
        cmd = shlex.join(args)
        s, lf = shlex.quote(self.sock), shlex.quote(self.logf)
        start = f"{{ {cmd} --offline || {{ rm -f {s}; {cmd}; }}; }}"
        body = f"rm -f {s}; {{ {start} > {lf} 2>&1; rm -f {s}; kill 0; }} & cat > /dev/null; rm -f {s} {lf}; kill 0"
        self.proc = subprocess.Popen(["sh", "-c", f"exec sh -c {shlex.quote(body)}"], stdin=subprocess.PIPE,
                                     stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True)
        t0 = time.time()
        while time.time() - t0 < 900:
            if self.proc.poll() is not None:
                tail = Path(self.logf).read_text(errors="replace")[-1500:] if Path(self.logf).exists() else ""
                raise SystemExit(f"idea_search: llama-server exited before it was ready:\n{tail}")
            try:
                if self._call("GET", "/health", None, 2).get("status") == "ok":
                    return self
            except (OSError, http.client.HTTPException, ValueError):
                pass
            time.sleep(0.05)
        self.__exit__()
        raise SystemExit("idea_search: llama-server did not start in 900 s")

    def __exit__(self, *exc):
        if self.proc and self.proc.poll() is None:
            try:
                self.proc.stdin.close()
                self.proc.wait(timeout=10)
            except (OSError, subprocess.TimeoutExpired):
                self.proc.kill()

    def _call(self, method, path, payload, timeout=300):
        c = _UnixHTTP(self.sock, timeout)
        try:
            c.request(method, path, body=json.dumps(payload) if payload is not None else None,
                      headers={"Content-Type": "application/json"})
            r = c.getresponse()
            body = r.read()
            if r.status != 200:
                raise OSError(f"llama-server {path}: HTTP {r.status} {body[:300]!r}")
            return json.loads(body)
        finally:
            c.close()

    def embed(self, texts: list[str], batch: int = 32) -> np.ndarray:
        out = []
        for i in range(0, len(texts), batch):
            data = sorted(self._call("POST", "/v1/embeddings", {"input": texts[i:i + batch]})["data"],
                          key=lambda d: d["index"])
            out += [d["embedding"] for d in data]
        v = np.asarray(out, dtype=np.float32)
        if not np.isfinite(v).all():
            raise SystemExit("idea_search: embedder returned NaN or inf")
        return v / np.linalg.norm(v, axis=1, keepdims=True).clip(1e-12)


def key(text: str) -> str:
    return hashlib.sha1(f"{GGUF}\n{text}".encode()).hexdigest()


class VectorCache:
    def __init__(self, root: Path):
        self.path = root / CACHE
        self.vecs: dict[str, np.ndarray] = {}
        if self.path.is_file():
            z = np.load(self.path)
            self.vecs = dict(zip(z["keys"].tolist(), z["vecs"]))

    def ensure(self, texts: list[str]) -> int:
        """Embed the texts not cached yet. Returns how many were embedded."""
        todo = list(dict.fromkeys(t for t in texts if key(t) not in self.vecs))
        if todo:
            with Embedder() as e:
                for t, v in zip(todo, e.embed(todo)):
                    self.vecs[key(t)] = v
        return len(todo)

    def get(self, texts: list[str]) -> np.ndarray:
        return np.stack([self.vecs[key(t)] for t in texts]) if texts else np.zeros((0, 768), np.float32)

    def save(self, keep: set[str] | None = None) -> None:
        ks = sorted(k for k in self.vecs if keep is None or k in keep)
        self.path.parent.mkdir(parents=True, exist_ok=True)
        tmp = self.path.with_name(self.path.stem + ".tmp.npz")
        np.savez(tmp, keys=np.array(ks), vecs=np.stack([self.vecs[k] for k in ks]) if ks else np.zeros((0, 768), np.float32))
        tmp.replace(self.path)


def doc_text(ch: dict) -> str:
    return DOC.format(ch["title"], ch["text"])


def sym_text(ch: dict) -> str:
    return SYM.format(ch["text"])


# ---------- lexical + graph ----------

TOKEN = re.compile(r"[a-z0-9]+")


def toks(s: str) -> list[str]:
    return [t for t in TOKEN.findall(s.lower()) if t not in ix.STOP and len(t) > 1]


class BM25:
    def __init__(self, docs: list[str], k1: float = 1.2, b: float = 0.75):
        self.tf = [Counter(toks(d)) for d in docs]
        self.len = np.array([sum(t.values()) for t in self.tf], dtype=float)
        self.avg = self.len.mean() if len(self.len) else 1.0
        df = Counter(w for t in self.tf for w in t)
        n = len(docs)
        self.idf = {w: math.log(1 + (n - d + 0.5) / (d + 0.5)) for w, d in df.items()}
        self.k1, self.b = k1, b

    def scores(self, q: str) -> np.ndarray:
        s = np.zeros(len(self.tf))
        for w in set(toks(q)):
            if w not in self.idf:
                continue
            for i, t in enumerate(self.tf):
                f = t.get(w)
                if f:
                    s[i] += self.idf[w] * f * (self.k1 + 1) / (f + self.k1 * (1 - self.b + self.b * self.len[i] / self.avg))
        return s


def graph(concepts: list[dict]) -> dict[str, set[str]]:
    """Undirected links between concepts, keyed `type:slug`; roles become `role:<tag>` nodes."""
    g: dict[str, set[str]] = defaultdict(set)
    node = {c["slug"]: f"{c['fm']['type']}:{c['slug']}" for c in concepts}

    def link(a, b):
        if a and b and a != b:
            g[a].add(b)
            g[b].add(a)
    for c in concepts:
        fm, me = c["fm"], node[c["slug"]]
        t = fm["type"]
        if t == "Atom":
            for k in ix.as_list(fm.get("cards")):
                link(me, node.get(k))
            for r in ix.atom_roles(fm):
                link(me, f"role:{r}")
        elif t == "Idea Card":
            for key_ in ("atoms", "lenses", "moves"):
                for k in ix.as_list(fm.get(key_)):
                    link(me, node.get(k))
            if fm.get("parent"):
                link(me, node.get(fm["parent"]))
        elif t == "Lens":
            for k in ix.as_list(fm.get("cards")):
                link(me, node.get(k))
        elif t == "Move":
            for key_ in ("parent", "child", "card", "from_atom", "to_atom", "atom"):
                link(me, node.get(fm.get(key_) or ""))
    return g


def ppr(g: dict[str, set[str]], seeds: dict[str, float], alpha: float = 0.5, iters: int = 30,
        drop: set[str] = frozenset()) -> dict[str, float]:
    """Personalized PageRank by power iteration; `drop` nodes are removed from the graph."""
    tot = sum(seeds.values()) or 1.0
    p = {n: w / tot for n, w in seeds.items() if n not in drop}
    r = dict(p)
    for _ in range(iters):
        nxt = defaultdict(float)
        for n, w in r.items():
            nb = [m for m in g.get(n, ()) if m not in drop]
            if nb:
                share = (1 - alpha) * w / len(nb)
                for m in nb:
                    nxt[m] += share
        for n, w in p.items():
            nxt[n] += alpha * w
        r = nxt
    return dict(r)


def rrf(*ranked: list[str], k: int = 60) -> dict[str, float]:
    s: dict[str, float] = defaultdict(float)
    for lst in ranked:
        for i, n in enumerate(lst):
            s[n] += 1.0 / (k + i + 1)
    return s


# ---------- the index ----------

class Index:
    def __init__(self, root: Path, embed_missing: bool = True):
        self.root = root
        self.concepts = ix.load(root)
        self.by_node = {f"{c['fm']['type']}:{c['slug']}": c for c in self.concepts}
        self.chunks = chunks(self.concepts)
        self.cache = VectorCache(root)
        texts = [doc_text(c) for c in self.chunks] + [sym_text(c) for c in self.chunks if c["view"] == "sig"]
        self.embedded = self.cache.ensure(texts) if embed_missing else 0
        self.cache.save(keep={key(t) for t in texts} | set())
        self.doc = self.cache.get([doc_text(c) for c in self.chunks])
        self.sig_rows = [i for i, c in enumerate(self.chunks) if c["view"] == "sig"]
        self.sym = self.cache.get([sym_text(self.chunks[i]) for i in self.sig_rows])
        self.bm25 = BM25([f"{c['title']} {c['text']}" for c in self.chunks])
        self.g = graph(self.concepts)
        self.node = [f"{c['type']}:{c['slug']}" for c in self.chunks]

    def _best(self, scores: np.ndarray, mask: np.ndarray) -> list[tuple[str, float, int]]:
        best: dict[str, tuple[float, int]] = {}
        for i in np.flatnonzero(mask):
            n = self.node[i]
            if n not in best or scores[i] > best[n][0]:
                best[n] = (float(scores[i]), int(i))
        return sorted(((n, s, i) for n, (s, i) in best.items()), key=lambda x: -x[1])

    def mask(self, types: set[str] | None = None, views: set[str] | None = None, keep=None) -> np.ndarray:
        return np.array([(types is None or c["type"] in types) and (views is None or c["view"] in views)
                         and (keep is None or keep(c)) for c in self.chunks])

    def search(self, qvec: np.ndarray | None, qtext: str, mask: np.ndarray, *, dense: bool = True, lexical: bool = True,
               use_graph: bool = False, wide: int = 30, drop_nodes: set[str] = frozenset()) -> list[dict]:
        lists, best_chunk, dense_rank, lex_rank = [], {}, [], []
        if dense and qvec is not None:
            d = self._best(self.doc @ qvec, mask)[:wide]
            dense_rank = [n for n, _, _ in d]
            lists.append(dense_rank)
            for n, s, i in d:
                best_chunk.setdefault(n, i)
        if lexical:
            raw = self.bm25.scores(qtext)
            l = [x for x in self._best(raw, mask & (raw > 0))][:wide]
            lex_rank = [n for n, _, _ in l]
            lists.append(lex_rank)
            for n, s, i in l:
                best_chunk.setdefault(n, i)
        fused = rrf(*lists)
        allowed = {self.node[i] for i in np.flatnonzero(mask)}
        if use_graph and fused:
            seeds = dict(sorted(fused.items(), key=lambda kv: -kv[1])[:10])
            pr = ppr(self.g, seeds, drop=set(drop_nodes))
            graph_rank = [n for n, _ in sorted(pr.items(), key=lambda kv: -kv[1]) if n in allowed][:wide]
            fused = rrf(*lists, graph_rank)
        ranked = sorted(((n, s) for n, s in fused.items() if n in allowed), key=lambda kv: -kv[1])
        out = []
        for n, s in ranked:
            c = self.by_node[n]
            i = best_chunk.get(n)
            out.append({"node": n, "slug": c["slug"], "type": c["fm"]["type"], "title": c["fm"].get("title"),
                        "score": round(s, 5), "dense_rank": dense_rank.index(n) + 1 if n in dense_rank else None,
                        "lexical_rank": lex_rank.index(n) + 1 if n in lex_rank else None,
                        "via": (self.chunks[i]["view"] + ": " + self.chunks[i]["text"][:160]) if i is not None else "graph"})
        return out

    def like(self, slug: str, k: int, other_fields: bool) -> list[dict]:
        """Atoms with a similar signature (symmetric prompt), with topic overlap shown beside it."""
        rows = {self.chunks[i]["slug"]: j for j, i in enumerate(self.sig_rows)}
        if slug not in rows:
            raise SystemExit(f"idea_search: no atom named {slug}")
        fm = self.by_node[f"Atom:{slug}"]["fm"]
        my_fields = ix.atom_fields(fm)
        sims = self.sym @ self.sym[rows[slug]]
        gloss = {c["slug"]: i for i, c in enumerate(self.chunks) if c["view"] == "gloss"}
        out = []
        for s2, j in rows.items():
            if s2 == slug:
                continue
            fm2 = self.by_node[f"Atom:{s2}"]["fm"]
            if fm2.get("status") == "deprecated":
                continue
            shared = sorted(my_fields & ix.atom_fields(fm2))
            if other_fields and shared:
                continue
            topic = float(self.doc[gloss[s2]] @ self.doc[gloss[slug]]) if s2 in gloss and slug in gloss else 0.0
            out.append({"slug": s2, "title": fm2.get("title"), "signature_sim": round(float(sims[j]), 4),
                        "topic_sim": round(topic, 4), "shared_fields": shared,
                        "shared_roles": sorted(ix.atom_roles(fm) & ix.atom_roles(fm2))})
        out.sort(key=lambda r: -r["signature_sim"])
        return out[:k]


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("root", type=Path)
    sub = ap.add_subparsers(dest="cmd", required=True)
    sub.add_parser("index", help="embed new or changed chunks")
    s = sub.add_parser("search", help="hybrid search: vectors + BM25 + graph")
    s.add_argument("query")
    s.add_argument("-k", type=int, default=30)
    s.add_argument("--type", choices=sorted(TYPES), action="append")
    s.add_argument("--graph", action="store_true", help="add Personalized PageRank over the links (no gain measured yet)")
    s.add_argument("--json", action="store_true")
    lk = sub.add_parser("like", help="atoms whose signature is close to this atom's")
    lk.add_argument("slug")
    lk.add_argument("-k", type=int, default=10)
    lk.add_argument("--other-fields", action="store_true", help="only atoms that share no field with it")
    lk.add_argument("--json", action="store_true")
    a = ap.parse_args(argv)
    if not a.root.is_dir():
        print(f"idea_search: {a.root} is not a directory", file=sys.stderr)
        return 2
    idx = Index(a.root)
    if a.cmd == "index":
        print(f"idea_search: {len(idx.chunks)} chunks, {idx.embedded} newly embedded, cache {a.root / CACHE}")
        return 0
    if a.cmd == "search":
        with Embedder() as e:
            q = e.embed([QUERY.format(a.query)])[0]
        types = {TYPES[t] for t in a.type} if a.type else None
        res = idx.search(q, a.query, idx.mask(types=types), use_graph=a.graph)[:a.k]
        if a.json:
            print(json.dumps(res, indent=1))
        else:
            for r in res:
                print(f"{r['type']:9} {r['slug']}  (dense {r['dense_rank'] or '-'}, lexical {r['lexical_rank'] or '-'})\n"
                      f"          {r['title']}\n          via {r['via']}")
        return 0
    res = idx.like(a.slug, a.k, a.other_fields)
    if a.json:
        print(json.dumps(res, indent=1))
    else:
        for r in res:
            print(f"{r['signature_sim']:.3f} sig  {r['topic_sim']:.3f} topic  {r['slug']}  fields shared: "
                  f"{', '.join(r['shared_fields']) or 'none'}; roles shared: {', '.join(r['shared_roles']) or 'none'}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
