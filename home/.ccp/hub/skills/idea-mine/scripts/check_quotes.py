# /// script
# requires-python = ">=3.10"
# ///
"""Find quotes in an idea card that do not appear in the source text.

Usage: uv run check_quotes.py <card.md> <source.txt|md> [--min-ratio 0.9] [--min-words 4]

Extracts every double-quoted span of --min-words or more words (default 4) from
the card body, one line at a time (curly or straight quotes). Marks pair as
balanced spans: from an opening mark, the candidate ends are the 1st, 3rd, 5th...
later mark, so two quotes on one line never merge, while a quote holding the
source's own inner quotes still pairs whole. The longest candidate that matches
the source wins; otherwise the quote is the nearest pair. Then it looks
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


def pick(cands, source, min_ratio):
    """Longest matching span wins; otherwise the nearest pair (the plain quote)."""
    for end, text in reversed(cands):
        r = best_ratio(norm(text), source)
        if r >= min_ratio:
            return text, r, end
    end, text = cands[0]
    return text, best_ratio(norm(text), source), end


def quotes(line: str, source: str, min_ratio: float, min_words: int):
    marks = [m.start() for m in QMARK.finditer(line)]
    i = 0
    while i < len(marks) - 1:
        cands = [(j, line[marks[i] + 1:marks[j]]) for j in range(i + 1, len(marks), 2)]
        text, r, end = pick(cands, source, min_ratio)
        if len(text.split()) >= min_words:
            yield text, r
        i = end + 1


def main() -> int:
    args = sys.argv[1:]
    if len(args) < 2:
        print(__doc__)
        return 2
    min_ratio = float(args[args.index("--min-ratio") + 1]) if "--min-ratio" in args else 0.9
    min_words = int(args[args.index("--min-words") + 1]) if "--min-words" in args else 4
    card = body(Path(args[0]).read_text(errors="replace"))
    source = norm(Path(args[1]).read_text(errors="replace"))
    results = [qr for line in card.splitlines() for qr in quotes(line, source, min_ratio, min_words)]
    if not results:
        print(f"no quotes of {min_words}+ words found")
        return 0
    failed = 0
    for q, r in results:
        ok = r >= min_ratio
        failed += not ok
        print(f"{'ok  ' if ok else 'MISS'} {r:.2f}  \"{q[:90]}{'...' if len(q) > 90 else ''}\"")
    print(f"{len(results) - failed}/{len(results)} quotes found in source")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
