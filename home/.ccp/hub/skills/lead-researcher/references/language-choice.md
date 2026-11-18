# Language choice and agent assignment

Part of the [lead-researcher skill](../SKILL.md). Read this when you decide which languages go on which sub-question, or lay out the assignments and the rolling pool.

#### Language per sub-question

EN + ZH + ZH-TW is the candidate set. Put a language on a sub-question when that language's community holds evidence the others don't: practitioner experience written in it, a local market, local vendors or local law. Leave it off when:
- the sub-question is answered by primary documents in another language (release notes, version support policy, vendor pricing pages, a statute): a ZH squad there re-reads the EN docs;
- the topic is local to a place outside the set (Vietnamese e-invoicing: VI primary, EN for analysis; ZH only with a concrete reason);
- your Phase 0 scan already found the language only relays news from elsewhere. Give it the one sub-question where it is most likely to hold something (usually practitioner pain or failure modes), and let REASONING add more if it surprises you. A language you expect to be thin does not get a squad on every sub-question.

Add languages the same way: DE for an evidence question whose main researchers publish in German, JA where a key case is Japanese. Each language in the plan carries a short reason; each default language you left off is listed with why, so the user can put it back.

**Agent assignment: 1 language + 1 sub-topic per assignment (atomic)**

Each assignment has a single, clear job and runs as a squad. With 2 sub-topics, EN on both, ZH on one and ZH-TW on none, that's 3 assignments, about 15 agents. Run them as a rolling pool, ≤6 in flight; when one returns, launch the next queued agent immediately.

Example for "compare auth solutions" (provider docs are EN; ZH practitioners have self-hosting experience):

```
Assignments:
  A1: EN + "OAuth/OIDC providers comparison"
  A2: EN + "self-hosted auth libraries"
  A3: ZH + "self-hosted auth libraries"
  (ZH-TW left off: thin community for this topic; REASONING may add it)

In flight (≤6): A1 lead + its 3 slices, A2 lead + A2 code slice
Queued (each starts the moment any slot frees): the rest of A2, then A3, then the openers
  (brain may add follow-up assignments as early results land)
```
