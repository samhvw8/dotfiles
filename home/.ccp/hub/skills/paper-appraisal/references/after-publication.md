# What surrounds the paper

The PDF is the authors' advert for everything around it. The evidence also
includes what the authors promised before (a registration, protocol or
preregistration), what they released with the paper (data, code, materials), and
what happened after (corrections, comments, failed or successful replications,
fixes in the released code). The most decisive finding often lives there, not in
the paper.

Run this step **before** the full-text read. What it finds tells you where to read
hardest.

## Every field

| Source | Look for | Red flag |
|--------|----------|----------|
| Retraction, expression of concern, correction | Facts header, publisher notice, `"<title>" erratum` | See `pre-read-checks.md` |
| PubPeer | `fetch_page` on `pubpeer.com/search?q=<DOI>` | Image duplication, data or analysis questions the authors left unanswered |
| Letters and commentaries | `"<title>" comment`, `"<title>" response`, journal letters | A reanalysis that reverses the result |
| Replications | Citing papers that re-test the same effect, outcome or benchmark (OpenAlex `cites:<id>` plus a full-text search for it); read only their comparison result, at most 3 papers. Psychology and social science: FORRT Replications & Reversals (forrt.org/reversals) | Preregistered, well-powered replications find no effect |
| Discussion threads | `social_search` with the paper URL, only when the paper drew public attention | A thread is a lead to check in the paper, never evidence alone |

## By field: the record the authors promised or released

| Field | Check | Red flag |
|-------|-------|----------|
| Clinical trial, health intervention | Registry record (ClinicalTrials.gov, ISRCTN, EU CTR, WHO ICTRP), protocol and statistical analysis plan | Primary outcome or time point changed from the registration; registered after enrolment; results posted to the registry differ from the paper |
| Systematic review | PROSPERO or OSF protocol | Outcomes or inclusion criteria changed without a stated reason |
| Psychology, cognitive and behavioural science | Preregistration (OSF, AsPredicted), Registered Report status, open data and materials on OSF | Analyses or hypotheses differ from the preregistration; "preregistered" without a link; data "available on request" |
| Mechanistic and lab biology | Data deposits (GEO, PDB, PRIDE, …) named in the paper; RRIDs; cell-line authentication | Accession missing or not matching the paper; PubPeer image concerns |
| ML and computational work | The released code repository (method below) and public reviews | A bug the authors admit after publication; post-publication changes to data, evaluation or config |

## Code repositories

On the repo host, in at most 3 calls:

1. Read replies by the paper's authors (match logins and names to the author list)
   or the repo maintainers, across open and closed issues. Filter by who wrote
   the reply, not by keywords. Keywords are only a fallback.
2. List commits since the publication date that touch data, evaluation or config.
3. Search the code for any constant or file those replies or commits name.

Red flags:
- An author admits a bug in an issue reply.
- The released code keeps a bug "so the paper's numbers reproduce". Then the tables
  measure the buggy system: reproducing the numbers does not make them correct.
- A post-publication commit changes data, evaluation or config. Then the current
  code is not the code behind the paper's tables.

Running released weights or re-running analyses is out of scope. List it under
"Could not check".

One way that worked (GitHub, checked 2026-10-16):

```bash
gh api "repos/OWNER/REPO/issues/comments" --paginate --jq '.[] | select(.author_association|test("OWNER|MEMBER|COLLABORATOR")) | "#\(.issue_url|split("/")|last) \(.user.login): \(.body[0:300])"'
gh api "repos/OWNER/REPO/commits?since=YYYY-MM-DDT00:00:00Z" --paginate --jq '.[] | "\(.commit.author.date[0:10]) \(.commit.message|split("\n")[0])"'
gh search code --repo OWNER/REPO "<constant>"
```

The role filter misses an author who only comments without repo rights. Then also
keep comments whose login matches the author list.

## Public reviews

Some venues publish their reviews (OpenReview conferences, eLife, F1000Research,
BMJ and other open-peer-review journals); most do not. Make one search for the
reviews. An empty result means "reviews not public": say so and move on. An error
means "not retrieved": list it under "Could not check". Reviews are evidence of
what experts questioned, not a verdict: check each raised weakness in the paper.
