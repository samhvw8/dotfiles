# Perspectives prompts

Prompts for heavy-think Perspectives mode: several lenses look at one subject, and you synthesize. The
general prompt comes first. The review variant (severity, a reviewer prompt, a verifier, a verdict) is
below it, for when the ASK is review.

## Perspective prompt

One per lens, all in one message. Drop the provocation the deck prints: it is for ideation.

```
You are looking at a subject through one lens, alongside other people who each hold a different one.
Give the view only your lens gives. Don't try to be balanced; the balance comes from the others.

SUBJECT: {what it is, and where: text, paths, a URL, a command, or the situation in a few lines}
ASK: {understand | evaluate | advise | explain}: {the user's question in their words}
CONTEXT: {who it's for, what's at stake, what's fixed}

YOUR LENS: {lens_name}: {lens_asks}
YOU SEE: {lens_sees}
YOU MUST DELIVER: {lens_delivers}

Read or think through the whole subject before you write. Point at it when you make a claim (a quote,
a line, a number, a moment in the situation); if you can't point at anything, say it's a hunch.

Output:

## My read
{one or two sentences: how this looks from your lens}

## What I notice first

## What matters most from here
{and why it matters to the people your lens stands for}

## What worries me
{concrete, with what you're pointing at; "nothing serious" is a valid answer}

## What I'd do
{for advise and evaluate; for understand, what you'd want to know next; for explain, the explanation
your audience needs}

## Blind spot
{what your lens can't judge here}
```

## Synthesis

1. **Agreement**: what several lenses saw independently. The most robust part of the answer.
2. **Disagreement**: where they pull apart, and the value or assumption underneath the split.
3. **Singletons**: what only one lens saw, kept if it matters.
4. **Blind spots**: what no lens could see, and whether it matters for the ask.
5. **Answer the ASK**: a map (understand), a read with reasons (evaluate), a recommendation with the
   trade-off and the strongest dissent (advise), one version per audience (explain). Say which lens you
   weigh most here, and why.

```
## Answer
{the answer to the ask, up front}

## Where the lenses agree
## Where they split
{each split: who, on what, and what it turns on}
## Only one lens saw
## Not covered
```

---

# Review variant

Use when the ASK is review: something has to pass a bar (a merge, a publish, an approval). The scoring
weights are the `review` profile in `perspectives.json`, with anchors in `rubric.md`.

### Severity

Severity is measured against the BAR in the frame, not against perfection.

| Severity | Meaning |
|----------|---------|
| CRITICAL | The artifact fails its purpose, or causes harm that is hard to undo: data loss, an exploit, a wrong decision, a false claim someone will act on. Blocks the bar on its own. |
| HIGH | A real defect on a path that will be taken, or a gap the reader or user will hit. Fix before it passes. |
| MEDIUM | A defect on an edge path, or a weakness that costs later (maintenance, confusion, cost). Fix soon or track. |
| LOW | Polish. Worth a line, never worth a debate. |

### Reviewer prompt

One per seat, all in one message. Give the artifact by path, command or URL when the reviewer can read
it, so you do not paste the same large text into every prompt; paste it when it is short or not on disk.
Drop the provocation the deck prints: it is for ideation.

```
You are reviewing an existing artifact through one lens. You find problems; you do not rewrite it.

ARTIFACT: {what it is, and where: paths, a diff command, a URL, or the text below}
PURPOSE: {what it is meant to do, and for whom}
BAR: {what "passes" means here: merge to main, publish, approve the budget, hand to a new hire}
OUT OF SCOPE: {what not to review, e.g. pre-existing code the change does not touch}

YOUR LENS: {lens_name}: {lens_asks}
YOU SEE: {lens_sees}
YOU MUST DELIVER: {lens_delivers}

Read the whole artifact before writing anything, and enough of its surroundings to judge it (the
callers of changed code, the doc's audience, the plan's dependencies). Then review through your lens
ONLY. Other reviewers cover the other lenses; a finding outside yours is noise here.

Rules:
- Evidence or no finding. Quote the line, cite file:line, or name the input that triggers it. A
  finding you cannot point at is a hunch: put it under Suspicions, not Findings.
- Judge against the BAR, not against how you would have written it. Taste is not a finding.
- Empty is a valid answer. Do not pad to look thorough.
- Say what is good when it is good through your lens; the author keeps what is not named.

Output:

## Findings
### {lens_id}.1 {one-line claim}
- Severity: CRITICAL | HIGH | MEDIUM | LOW
- Where: {file:line, section, slide, step}
- Evidence: {the quote, the input, the trace}
- Impact: {what goes wrong, for whom, when}
- Fix direction: {one or two lines, not a rewrite}
- Confidence: 0-10

## Suspicions
{things that look wrong but you could not prove, and what would settle each}

## What holds up
{what is sound through your lens, briefly}

## Blind spot
{what your lens could not judge here, so the synthesis knows the gap}
```

### Verifier prompt

For every CRITICAL or HIGH finding, and any finding that would change the verdict alone. Settle it
yourself when one read does it (open the line, run the test). Otherwise spawn a fresh agent that sees
the artifact and the claim, not the reviewer's reasoning, so it does not inherit the reviewer's framing.
Rolling, at most 6 in flight.

```
A reviewer claims the artifact below has a defect. Your job is to try to refute the claim, and to
concede it only if it survives.

ARTIFACT: {same as the reviewers'}
CLAIM: {the one-line claim, Where, and Evidence, verbatim}

1. Check the evidence against the artifact itself. Does the quoted line say that? Does the input
   reach that path? Does the source say what it is cited for?
2. Look for what would make the claim false: a guard elsewhere, a caller that never passes that
   input, context the reviewer did not read, a requirement that does not exist.
3. If it holds, is the severity right for this BAR?

Output:
VERDICT: CONFIRMED | REFUTED | UNCERTAIN
SEVERITY: {as claimed, or corrected, with one line why}
REASON: {the evidence that decided it, with file:line or quote}
```

Refuted findings are dropped and named once in the report, so the author knows they were checked.
Uncertain ones stay, marked unverified, and cannot block the verdict alone.

### Synthesis (you, never delegated)

1. **Merge.** Two lenses reporting one root cause are one finding. Keep the strongest evidence, list
   both lenses, and raise the confidence: independent agreement is signal.
2. **Collide.** Find fixes that pull against each other: the Adversary wants a check the Minimalist
   wants deleted; the Cost Tracer's cache is the Maintainer's hidden state. Name the trade-off and pick,
   or hand the pick to the author with both sides stated.
3. **Cross-cut.** Look for what no single lens reported but two findings imply together: a missing
   requirement (Requester) on the path with the unhandled state (Correctness) is a worse finding than
   either.
4. **Mind the gaps.** Union the Blind spot sections. If the panel left the artifact's riskiest part
   unread, say so, or seat one more lens for it.
5. **Rank.** Score each surviving finding on the `review` profile (impact 45, confidence 35,
   actionability 20) and sort by severity, then score. The total is a sort key, not a verdict.
6. **Verdict** against the BAR.

```
## Verdict: PASS | PASS WITH FIXES | REVISE | REJECT
{One paragraph: why, against the bar. PASS WITH FIXES lists the fixes; REVISE means the shape is right
but the defects need another round; REJECT means the shape is wrong, and says what shape would pass.}

## Must fix (CRITICAL, HIGH)
1. {claim} ({where}). {evidence, in one line}. Seen by: {lenses}. {verified | unverified}
   Fix: {direction}

## Should fix (MEDIUM)
## Consider (LOW)
## Trade-offs to decide
{collisions where fixing one finding worsens another; both sides, and your pick}
## Cross-cutting
{findings that exist only in combination}
## What holds up
## Checked and dropped
{refuted claims, one line each}
## Not reviewed
{blind spots the panel left, and what it would take to cover them}
```

### Re-review

After the author revises, re-seat the same panel on the changed parts and the open findings only, not
the whole artifact. A second full pass mostly re-reports what was already decided.
