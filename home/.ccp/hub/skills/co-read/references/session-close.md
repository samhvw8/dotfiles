# Close a session

Formats come from `~/.claude/skills/idea-bank/references/schema.md`. Then commit
with the idea-bank steps.

| File | Write |
|------|-------|
| `readings/YYMMDD-<slug>.md` | `Reading`: mode (`brief`, `deep` or `skim`), stage, `# Recall` (step-0 result or `skipped: overloaded`), Sam's guess, the notes table `\| Sam \| Claude \| gem \| hint \|` (hint 1–3 for each Claude note, `-` for Sam's), disagreements, mutations as the schema's Mutations table (Sam's rows first, origin `sam`), kill test, teach-back, what we learned |
| `cards/<slug>.md` | `Idea Card`. Deep mode: Sam's text, plus Claude's links and the Raw section. Brief mode: Claude may write it |
| `atoms/`, `lenses/`, `moves/` | New atoms, lenses and moves met in the session; update `cards` and `migrations` on existing ones |
| `me/known-atoms.md` | `seen` for each new atom in a core or adjacent cluster; `owned` only with evidence (Sam explained it, or spotted it in another source); write the evidence |
| `me/taste.md` | Gems Sam saw that Claude missed, with gem type |
| `me/progress.md` | One row: date, reading, mode, unaided gems (finding gems), roles named right of total (naming roles), Sam-unique mutations (proposing mutations), level-3 hints, gems Claude missed, skips. Check the stage criteria; propose a stage change to Sam, never apply it silently |
| `me/interest-state.md` | When Sam zoomed, add 1 to the cluster's `Zooms`; when he said "go deep on X", log the signal. Propose a level change, Sam decides |

Last, tell Sam in one or two lines what changed in his state (new owned atoms,
stage, a rising skip share) in his chat language.
