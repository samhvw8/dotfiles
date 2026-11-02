import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).parent
SCRIPT = HERE / "check_quotes.py"
SOURCE = ("Methods. We trained the network on natural image patches. Surprisingly, "
          "the learned basis functions were localized, oriented and bandpass, "
          "much like simple cells in primary visual cortex.")


def run(tmp_path, card_body):
    card = tmp_path / "card.md"
    card.write_text("---\ntype: Idea Card\ntitle: \"A quoted title with many words in it here\"\n---\n" + card_body)
    src = tmp_path / "src.md"
    src.write_text(SOURCE)
    return subprocess.run([sys.executable, str(SCRIPT), str(card), str(src)], capture_output=True, text=True)


def test_exact_quote_passes(tmp_path):
    r = run(tmp_path, '- Surprise: "the learned basis functions were localized, oriented and bandpass" (Results)\n')
    assert r.returncode == 0, r.stdout
    assert "1/1" in r.stdout


def test_small_transcription_difference_passes(tmp_path):
    r = run(tmp_path, '- "the learned basis functions were localised oriented and bandpass much like simple cells"\n')
    assert r.returncode == 0, r.stdout


def test_invented_quote_fails(tmp_path):
    r = run(tmp_path, '- Bet: "if the cortex is efficient then learning should reproduce the cells exactly"\n')
    assert r.returncode == 1
    assert "MISS" in r.stdout


def test_frontmatter_quotes_ignored(tmp_path):
    r = run(tmp_path, "No quotes here.\n")
    assert r.returncode == 0
    assert "no quotes" in r.stdout


def test_short_quotes_ignored(tmp_path):
    r = run(tmp_path, '- Picture: "sparse code" (inferred)\n')
    assert "no quotes" in r.stdout


def test_nested_inner_quotes_pass(tmp_path):
    src = tmp_path / "s.md"
    src.write_text('the critical assumption of the model is "trading" WM resources for memory strengthening, such that')
    card = tmp_path / "c.md"
    card.write_text('- Picture: "the critical assumption of the model is "trading" WM resources for memory strengthening" (Discussion)\n'
                    '- Bottleneck: the pool, not accuracy (inferred)\n')
    r = subprocess.run([sys.executable, str(SCRIPT), str(card), str(src)], capture_output=True, text=True)
    assert r.returncode == 0, r.stdout


def test_quotes_do_not_pair_across_lines(tmp_path):
    r = run(tmp_path, '- A: "the learned basis functions were localized, oriented and bandpass" (Results)\n'
                      '- B: plain claim with "short" mark (inferred)\n')
    assert r.returncode == 0, r.stdout
