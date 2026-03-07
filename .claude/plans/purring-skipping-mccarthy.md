# Fix: chezmoi init --data flag format

## Context
Running `curl -L https://raw.githubusercontent.com/samhvw8/dotfiles/master/setup.sh | bash` fails with:
```
chezmoi: accepts at most 1 arg(s), received 3
```

The `--data` flag on line 87 of `setup.sh` uses `key=value` format (`--data "minimal=false"`), but chezmoi expects JSON format. The bare `=` syntax causes chezmoi to misparse the arguments.

## Fix
**File:** `setup.sh` line 87

Change:
```bash
chezmoi init --apply --data "minimal=${MINIMAL}" --data "conda=${CONDA}" https://github.com/samhvw8/dotfiles.git
```

To:
```bash
chezmoi init --apply --data "{\"minimal\":${MINIMAL},\"conda\":${CONDA}}" https://github.com/samhvw8/dotfiles.git
```

This passes both data values as a single JSON object, which is the format chezmoi v2.69+ expects.

## Verification
- Run `bash setup.sh` on a clean environment (or temporarily move `~/.local/share/chezmoi` aside)
- Confirm chezmoi prompts for git name/email and applies successfully
