# Criteria Component

## Contents
- 1. Find the standard
- 2. Keep the domain's scoring method
- 3. Build the block (gates, criteria, evidence)
- 4. Freeze or fetch
- 5. Check it
- Anti-patterns
- Use with other skills

A drop-in block that gives an agent the domain's own definition of "good": gates,
criteria, levels, weights and, when the standard prescribes one, a process. Every
item names its source. Use it inside a generated prompt, or write it as a stand-alone
rubric file that a judge reads (arena, council, an LLM-as-judge step).

**Use when** the prompt judges, reviews, audits, grades, selects, or must meet a
professional standard: code review, paper appraisal, UX audit, contract review, a
food-safety check, a hiring screen.
**Skip when** the task is open creative work with no standard (use the `creative`
profile of heavy-think's rubric instead), or a mechanical transformation.

## 1. Find the standard

Most fields already wrote down what "good" means. Find it before inventing anything.

**Source ladder** (stronger first):

| Rank | Source | Use it for |
|------|--------|-----------|
| 1 | Formal standard or official tool: ISO, WCAG, OWASP ASVS, RoB 2, GRADE, CONSORT, HACCP, SOC 2, IFRS | The criteria, levels and version |
| 2 | Regulator, professional body, venue (a journal's or conference's reviewer form) | Local or venue-specific criteria |
| 3 | Published checklists from firms or teams that do the work | Practical criteria the standard leaves implicit |
| 4 | Practitioner talk (Reddit, X, HN, forums via social search; for local domains also local news of inspection results, regulator FAQs, and local-language forums or groups) | What reviewers really check, and what fails in practice. Never authority. If nothing turns up, say so in the sources |
| 5 | Criteria you write yourself | Gaps only. Label each one `[invented]` |

**Queries** (3–6, iterate):
- `<domain> standard`, `<domain> checklist`, `<domain> assessment criteria`, `<domain> rubric`, `<domain> audit`
- `<venue or regulator> reviewer guidelines`, `<regulator> guidance <topic>`
- `<standard> latest version`, `<standard> replaces` (catch superseded versions)
- Social: `what do <role> actually check`, `<domain> review mistakes`, `<domain> red flags`
- A local domain (national law, tax, health rules) needs the local language and the local regulator.

Record for every source: name, version, status (in force, amended, suspended, draft), date checked, URL. Laws and standards move: check `<standard> latest version`, amendments and suspensions, and prefer the issuer's own text over summaries when they disagree.

## 2. Keep the domain's scoring method

Some fields forbid numeric totals. Use their method, not a generic 0–10 sum.

| Domain method | Example | Output |
|---------------|---------|--------|
| Judgement levels per domain, no summing | RoB 2, AMSTAR 2, ROBINS | low / some concerns / high, with reasons |
| Certainty per outcome | GRADE | high / moderate / low / very low |
| Conformance levels | WCAG A/AA/AAA, OWASP ASVS L1–L3 | pass / fail per item at a level |
| Per-item conformance with remediation | Regulatory inspections, audits (e.g. meets / fixable by a deadline / fails) | A level per item, no total; fixable items become remediation actions |
| Weighted score | Grant panels, vendor selection, arena matches | 0–10 per criterion, weights sum to 100 |

Use a weighted total only when the domain uses one, or when the job is ranking
alternatives against each other.

## 3. Build the block

```xml
<criteria source="<standard or 'mixed'>" version="<v>" checked="<YYYY-MM-DD>" scope="<what it covers, what it does not>">
Gates (pass/fail; one fail fails the whole, whatever the score):
- G1 <criterion>: passes when <observable condition>. Source: <ref>. Check: <tool or script> | judge

Criteria (graded):
- C1 <name> (weight <n> | levels <scale>): <the question the judge asks>
  - <top level>: <observable anchor>
  - <middle level>: <observable anchor>
  - <bottom level>: <observable anchor>
  - Evidence: <what the judge must quote or point to>

Evidence tags: [observed] seen in the artifact or a photo; [self-reported] only stated by the party being judged; [both] they agree.
Can't tell: absent information is "can't tell", not a fail. List each one as a request for a specific document or photo.
Verdict: <how gates and levels combine, including "no conclusion" when a gate is can't tell>

Process (only when the standard prescribes an order): <steps, with source>
</criteria>
```

Design rules:
- **Gates are yes/no; quality criteria are graded with anchors.** Decomposed yes/no checks raise agreement between LLM judges (CheckEval, ACL ARR 2025), but graded scales beat binary decomposition for some quality judgements ("Ask, Then Grade", JUDGe 2026). Use each where it fits.
- **Anchors describe observable behavior**, not adjectives (the BARS idea). "Cites a table row for every claim" beats "well supported".
- **A gate is a requirement the standard itself treats as disqualifying** (a legal must, a safety hazard, a hard spec). Say which kind each gate is. If failing it would not stop the work or the business, make it a graded criterion.
- **Weigh evidence by who supplied it.** Self-report alone never passes a gate; record it as "meets (unverified)". When observation and self-report conflict, observation wins and the conflict is reported. This stops a party from passing by leaving answers out.
- **Mark what a tool can check.** When a tool decides a gate (axe or Lighthouse for WCAG items, a linter, a schema validator, a calculator for a total), name it in `Check:` and run it instead of asking a model. A model judge is for what no tool can decide.
- **3–8 graded criteria.** More dilutes the judge's attention and the weights.
- **Every judgement cites evidence** from the artifact: a quote, a line, a figure.
- **Language:** write the block in the prompt's language. Keep legal and standard terms and clause numbers in the original, so they can be checked against the source.
- **Criteria say what good looks like; process says in what order to work.** Put process in execution phases, and only when the order matters.

## 4. Freeze or fetch

| | Build time (default) | Run time |
|---|---|---|
| When | The domain is fixed by the prompt | The domain is an input ("review any field") |
| Cost | 3–6 searches once | Searches on every run, unless cached |
| Consistency | Same rubric every run; scores compare | Rubric can drift; scores stop comparing |

Run time: instruct the agent to save each rubric it builds (for example
`criteria/<domain-slug>.md`, with the `checked` date) and reuse it. It refreshes only
when the standard publishes a new version, never per run. Say this in the prompt's
Runs line.

Either way, put a refresh trigger in `scope` ("rebuild when <law> is revised"), most of all when a source is suspended, amended or about to change.

## 5. Check it

- **Agreement test:** would two judges with this block give the same verdict on the same artifact?
- **Observable test:** can each anchor be checked from the artifact alone?
- **Gate test:** is each gate disqualifying under the standard itself? If not, make it a graded criterion.
- **Evidence test:** can the judged party pass a gate by self-report or by leaving answers out?
- **Source test:** does every criterion have a source, or an `[invented]` label?
- **Tool test:** is every gate a tool can decide marked with that tool?
- **Version test:** is the version current, and is the `checked` date set?

## Anti-patterns

**Generic quality words**
The trap: "clarity, completeness, accuracy" feel safe and fit any domain.
The correction: if the field has a standard, its criteria replace the generic ones.

**Summing levels**
The trap: a number looks objective.
The correction: when a tool uses levels (RoB 2, GRADE), a total is a category error.

**Forum as authority**
The trap: a viral thread sounds like expertise.
The correction: practitioner talk finds gaps and failure modes; standards set the criteria.

**Stale version**
The trap: training data knows QUADAS-2, the field moved to QUADAS-3.
The correction: search `<standard> latest version` every time you build.

## Use with other skills

For arena, council or heavy-think judges, convert the block to
`heavy-think/references/rubric.md` form: criteria scored 0–10 with anchors, weights
that sum to 100, and gates as `fatal`.
