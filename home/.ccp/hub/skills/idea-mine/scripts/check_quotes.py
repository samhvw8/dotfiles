# /// script
# requires-python = ">=3.10"
# ///
"""Find quotes in an idea card that do not appear in the source text.

Usage: uv run check_quotes.py <card.md> <source.txt|md> [--min-ratio 0.9]

Extracts every double-quoted span of 6+ words from the card body, one line at
a time (curly or straight quotes; a quote may contain the source's own inner
quotes, so for each opening mark the longest span that matches wins), then looks
for it in the source after normalizing case,
whitespace and punctuation. A quote passes when it is found exactly, or when the
best fuzzy window match reaches --min-ratio (default 0.9, which allows small
transcription differences such as a dropped comma or a hyphenation break).
Prints one line per quote and exits 1 when any quote fails, so a caller can
fix the quote or mark the claim "(inferred)".
"""
import difflib
import re
import sys
from pathlib import Path

QMARK = re.compile(r"[\"“”]")
MIN_WORDS = 6


def norm(text: str) -> str:
    text = text.lower().replace("’", "'").replace("-\n", "")
    text = re.sub(r"[^\w\s']", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def body(card: str) -> str:
    if card.startswith("---"):
        end = card.find("\n---", 3)
        if end != -1:
            return card[end + 4:]
    return card


def best_ratio(quote: str, source: str) -> float:
    if quote in source:
        return 1.0
    words, n = source.split(), len(quote.split())
    target = quote.split()
    best = 0.0
    # Slide a window of the quote's length; anchor on the first or last word to stay fast.
    starts = {i for i, w in enumerate(words) if w in (target[0], target[-1])}
    for i in starts:
        for j in (i, i - n + 1):
            if 0 <= j and j + n <= len(words):
                r = difflib.SequenceMatcher(None, target, words[j:j + n]).ratio()
                best = max(best, r)
    return best


def spans(line: str):
    """Candidate quotes on one line: from each opening mark, every later mark."""
    marks = [m.start() for m in QMARK.finditer(line)]
    i = 0
    while i < len(marks) - 1:
        cands = [(marks[j], line[marks[i] + 1:marks[j]]) for j in range(i + 1, len(marks))]
        cands = [(end, t) for end, t in cands if len(t.split()) >= MIN_WORDS]
        if not cands:
            i += 1
            continue
        yield cands
        last = cands[0][0]
        i = marks.index(last) + 1


def check(cands, source, min_ratio):
    """Longest matching span wins; otherwise report the shortest candidate."""
    for end, text in reversed(cands):
        r = best_ratio(norm(text), source)
        if r >= min_ratio:
            return text, r, end
    text = cands[0][1]
    return text, best_ratio(norm(text), source), cands[0][0]


def main() -> int:
    args = sys.argv[1:]
    if len(args) < 2:
        print(__doc__)
        return 2
    min_ratio = float(args[args.index("--min-ratio") + 1]) if "--min-ratio" in args else 0.9
    card = body(Path(args[0]).read_text(errors="replace"))
    source = norm(Path(args[1]).read_text(errors="replace"))
    results = []
    for line in card.splitlines():
        for cands in spans(line):
            results.append(check(cands, source, min_ratio))
    if not results:
        print("no quotes of 6+ words found")
        return 0
    quotes = [q for q, _, _ in results]
    failed = 0
    for q, r, _ in results:
        ok = r >= min_ratio
        failed += not ok
        print(f"{'ok  ' if ok else 'MISS'} {r:.2f}  \"{q[:90]}{'...' if len(q) > 90 else ''}\"")
    print(f"{len(quotes) - failed}/{len(quotes)} quotes found in source")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
