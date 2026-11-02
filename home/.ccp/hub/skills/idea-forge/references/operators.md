# Operators

Each operator acts on the recipe of a card: its roles, the atom in each role,
the operator that combines them, the bet, and the constraints of its time. The
`move_type` names come from the idea-bank schema. Atom migration is
`migrate-atom` (keep the atom, change its field or role, with `atom`,
`from_field`, `to_field`); `transfer` keeps the bet and lets the atoms change.

## Walk them all

For each role in the recipe, ask every operator's question. Then ask the
operator-level and bet-level ones once. Write a variant even when it looks
weak; ranking comes later, and the weak-looking ones are where the unpopular gems
sit.

| Operator | Question to ask | Productive when |
|----------|-----------------|-----------------|
| `substitute-atom` | What else does this role's job? Search the bank by role tag, then other fields by signature | The atom was chosen for a reason that no longer holds, or a cheaper atom exists |
| `substitute-operator` | What if the parts combine as a loop, tree, gate, adversarial pair, distillation or ensemble instead? | The current operator is a sequence by habit |
| `remove` | Drop this atom: does the bet still hold? What does the system lose? | An atom looks decorative, or the paper never ablated it |
| `lift-constraint` | Which choice was forced by cost, compute, data, tools or "no LLM then"? Rebuild it as if the limit were gone | The card's `Constraints of the time` names a limit whose price dropped |
| `invert` | Reverse the order, the direction of flow, or who does what (human ↔ model, teacher ↔ student, train ↔ test) | The field has a default direction nobody questions |
| `migrate-atom` | Keep this atom; which field or role could use it? | The index lists the atom as a migration-gap candidate, or its signature fits a tension elsewhere |
| `transfer` | Apply the same bet to a tension in another field; the atoms may change | The bet is about a structure, not a domain |
| `cross-card` | Take an atom or operator from another card in the bank | Two cards share a role tag or a tension |
| `resolve-contradiction` | Where does the recipe trade X against not-X? Separate them in time, space, scale or condition | The card's layer 1 shows a trade-off and layer 2 says "not resolved" |
| `lens-transfer` | How would person or field X see this problem? What bottleneck would they name? | The bank has a lens or person file with a strong picture |
| `lens-inversion` | Assume the dominant lens of the field is wrong. Which solution appears? | One view dominates and nobody stands in the empty region |

## Contradiction separation (TRIZ)

| Separate in | Ask | Example |
|-------------|-----|---------|
| Time | Can X happen at one stage and not-X at another? | Think long at inference, not at training (chain of thought) |
| Space | Can one part have X and another part not-X? | A small fast path plus a large slow path |
| Scale | Can the whole have X while the parts have not-X? | Each unit is sparse, the population is dense |
| Condition | Can X hold only when a condition is met? | Spend compute only on hard inputs |

## Atom migration

Keep the atom; move it to a field or role it has not reached. This is the
other half of substitution: substitution keeps the role and changes the atom,
migration keeps the atom and changes the role or field.

Candidates come from three places:
1. `idea_index.py` migration-gap candidates: an atom's role tags match a card's
   `tensions` in a field the atom has not reached.
2. Convergence: unrelated fields filled the same role with different atoms, so
   the role is real; the field that still lacks a good atom is a target.
3. Hot slots: a role whose atom keeps being substituted is open design space.

## Structure-mapping (judge each candidate)

A name match is not a migration. For each candidate:
1. Write the atom's signature: input, output, objective, constraint.
2. Write what the target role needs, in the same four slots, from the target
   card's layers 1 and 4.
3. Map slot by slot. Note each slot that does not map and what would have to
   change.
4. Check the relations, not the objects: the atom's objective must relate input
   to output the way the target needs. Two systems that share nouns but differ
   in relations are not a match (Gentner's structure-mapping: systematic
   relational match beats surface similarity).
5. Verdict: maps, maps with a change (name it), or does not map. Only the first
   two become variants.

## Sources of D

In order: the bank (cheapest, already structured), Sam's known atoms (he can
reason about them), the delegated clusters (a one-line interface is enough to
use an atom without learning it), then a search by signature in the target
field. A D from a delegated cluster that becomes load-bearing for Sam's work gets
checked with `paper-appraisal` before money or GPU time goes into it.
