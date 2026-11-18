# Matching bricks by structure

Names lie across fields. "Sparse coding" (neuroscience), "dictionary learning"
(signal processing), "SAE features" (interpretability) and "compressed sensing
basis" share one structure. Match on the structure, never on the name or an
embedding of it.

## Before you create a brick

1. Write the candidate's signature: input, output, objective, constraint, and a
   one-line math form when there is one.
2. Search the bank with the candidate's signature plus the source's own words
   for it: `uv run ~/.claude/skills/idea-bank/scripts/idea_search.py <bank>
   search "<signature>. <source quote>" --type brick` (top 30). Read the whole
   shortlist: the right brick is often not first (bench: in the top 10 for 72% of
   real links, the top 30 for 81%). Then also list bricks whose `roles` overlap
   the candidate's role (`idea_index.py`), and read their `# Signature` sections. `bricks/index.md` lists the roles
   that two or more bricks share, and each brick's `# Related` section names the
   bricks that share its roles. Also scan bricks in fields related to the
   source's field.
3. Compare relation by relation (structure-mapping): does the input map to the
   input, the objective to the objective, the constraint to the constraint, with
   the same relations between them? Surface features (domain words, data type)
   don't count; a shared relation does.
4. Decide:
   - **Same structure:** link the existing brick in the card's `bricks`. Add this
     field's name to `names`, the card to `cards`, the field to `fields`, the
     role to `roles` if new, and a `migrations` row when the field or role is
     new (`field`, `year` of the source, `source`, `role`, `match_confidence`).
   - **Same role, different structure:** a new brick. This is a substitution
     candidate: note in the card's `Mutations` that the role has two bricks.
   - **Same structure, new role:** link it and add the role. This is a migration;
     it is often the most valuable line on the card.
5. When unsure, link, set `match_confidence: low` on the migration row, and
   write "(match uncertain: <what differs>)" in the brick's `# Migrations`
   paragraph. The index lists low-confidence rows for review. A wrong split is harder to find later than a
   flagged merge.

## Naming a new brick

File name: the role-level slug of the structure (`sparse-overcomplete-code`), not
one field's name. Title: a neutral description. Put every field's own name in
`names`.

## Migration rows

One row per arrival in a new field or role: when the structure was first used
there, by which source, for which job. The rows over time are the brick's story
(compression → neuroscience → machine learning → interpretability), and the
index uses them to find gaps: fields with an open tension that the brick has not
reached.
