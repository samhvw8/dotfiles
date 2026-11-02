# Matching atoms by structure

Names lie across fields. "Sparse coding" (neuroscience), "dictionary learning"
(signal processing), "SAE features" (interpretability) and "compressed sensing
basis" share one structure. Match on the structure, never on the name or an
embedding of it.

## Before you create an atom

1. Write the candidate's signature: input, output, objective, constraint, and a
   one-line math form when there is one.
2. Run `idea_index.py` and list atoms whose `roles` overlap the candidate's role,
   then read their `# Signature` sections. `atoms/index.md` lists the roles
   that two or more atoms share, and each atom's `# Related` section names the
   atoms that share its roles. Also scan atoms in fields related to the
   source's field.
3. Compare relation by relation (structure-mapping): does the input map to the
   input, the objective to the objective, the constraint to the constraint, with
   the same relations between them? Surface features (domain words, data type)
   don't count; a shared relation does.
4. Decide:
   - **Same structure:** link the existing atom in the card's `atoms`. Add this
     field's name to `names`, the card to `cards`, the field to `fields`, the
     role to `roles` if new, and a `migrations` row when the field or role is
     new (`field`, `year` of the source, `source`, `role`, `match_confidence`).
   - **Same role, different structure:** a new atom. This is a substitution
     candidate: note in the card's `Mutations` that the role has two atoms.
   - **Same structure, new role:** link it and add the role. This is a migration;
     it is often the most valuable line on the card.
5. When unsure, link, set `match_confidence: low` on the migration row, and
   write "(match uncertain: <what differs>)" in the atom's `# Migrations`
   paragraph. The index lists low-confidence rows for review. A wrong split is harder to find later than a
   flagged merge.

## Naming a new atom

File name: the role-level slug of the structure (`sparse-overcomplete-code`), not
one field's name. Title: a neutral description. Put every field's own name in
`names`.

## Migration rows

One row per arrival in a new field or role: when the structure was first used
there, by which source, for which job. The rows over time are the atom's story
(compression → neuroscience → machine learning → interpretability), and the
index uses them to find gaps: fields with an open tension that the atom has not
reached.
