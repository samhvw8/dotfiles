# Surgical Changes

Touch only what you must. Every changed line should trace back to the request.

| Do | Don't |
|----|-------|
| Fix what was asked | Fix what you noticed nearby |
| Match the surrounding style | Introduce a "better" pattern mid-task |
| Clean up orphans *your* change created | Delete pre-existing dead code |
| Mention unrelated problems you spot | Silently fix them |

Reformatting untouched lines, adding error handling for impossible cases, and
abstracting single-use code all count as scope creep — they bury the real change in
diff noise.

This isn't a ban on judgement. If the requested change is genuinely unsafe without
an adjacent fix, make it and say why. And when the user asks for a cleanup or a
refactor, that *is* the scope — go do it properly.

## Related

- [se.md](se.md) — verifiable goals
