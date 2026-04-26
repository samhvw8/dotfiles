# Surgical Changes

Touch only what you must. Every changed line traces to the request.

## Editing Existing Code

- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated issues, mention them — don't fix them.

## Orphan Cleanup

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

## Diff Discipline

Before finishing, review every changed line:

| Check | Pass? |
|-------|-------|
| Does this line trace to the user's request? | Required |
| Did I change formatting/style I wasn't asked to? | Revert |
| Did I add error handling for impossible cases? | Remove |
| Did I add abstractions for single-use code? | Inline |
| Did I "improve" code adjacent to my change? | Revert |

## Scope Boundary

| Do | Don't |
|----|-------|
| Fix what was asked | Fix what you noticed nearby |
| Add requested features | Add "while I'm here" features |
| Match existing patterns | Introduce "better" patterns |
| Clean up your own mess | Clean up pre-existing mess |
| Mention unrelated issues | Silently fix unrelated issues |
