# Gather squad (v2)

Every gatherer assignment (1 sub-question × 1 language) runs as a **squad**. Goal: miss nothing first, finish fast second.

| Member | Model | Scope | Budget |
|---|---|---|---|
| Lead | `sonnet` | The whole assignment, every source except Reddit | No cap: search until gems run out |
| Code | `haiku`, `effort: 'high'` | GitHub issues/discussions and X only | 20 tool calls: 15 search/open, last 5 reserved to open unopened issues |
| Social | `haiku`, `effort: 'high'` | Reddit and the language's social platforms (table below). Only member that touches Reddit | 15 tool calls |
| Docs | `haiku`, `effort: 'high'` | Official docs, changelogs, release notes, vendor blogs, tech media | 15 tool calls |
| Opener | `haiku`, `effort: 'high'` | No searching: opens the `UNOPENED LEADS` the three slices listed | 10 tool calls. Spawn when the three slices have returned |

Every slice report ends with an `UNOPENED LEADS:` section (up to 10 URLs, 5–10 word reason each). The opener gets the union, issue threads and Reddit threads first.

## Evidence (A/B rounds 2026-10-09: `~/workspace/research/261009-squad-r2/result.md`, r3, r4, `261009-squad-v2/result.md`, `261009-squad-r6/result.md`, `261009-squad-r7/result.md`)

| Change | Result | Kept |
|---|---|---|
| Strict tags (GEM needs a page actually fetched; titles/snippets are MEH; each incident once) | Tag inflation 60%→14% (EN), 33%→10% (ZH); code slice went from 42 title-only "gems" (0 real) to 9–12 real | Yes |
| Parallel calls per turn | Lead not faster on average; bursts to Reddit got HTTP 429 and zeroed a social slice | Yes, but across different sites only |
| Lead capped at 30 calls and limited to forums/blogs | Saved 70–140 s, lost 8–10 gems (EN 51→43, ZH 23→13) | No |
| Opener agent after the slices | +9 new gems on 42 (+21%), 1 decision-grade; ran 3 min past the lead at 14 calls | Yes, at 10 calls |
| Code slice 20 calls with 5 reserved for opening | New gems beyond the lead 5→13; finished inside the lead's time | Yes |
| Code slice alone (Grafana r7, lead no longer on `gh search`) | 270 s, 17 calls; 22 of 54 gh calls failed on quoting; Discussions not searchable with `gh search`. Exact command forms: 10 → 39 self-tagged gems, 270 → 366 s | Yes |
| Social slice Reddit via logged-in browser (`scripts/reddit-read.sh`) when Parallax is blocked | 0 → 6 gems, 152 s | Yes |
| Docs slice 20 calls with reserve | 10→11 new gems; ran 17 s past the lead | No |
| Lead COVERAGE PASS (2 more searches per sub-area with <3 GEMs before stopping) | Grafana round, 2 blind pairs: 26 vs 17 and 35 vs 20 unique gems; +75–110 s lead time, still under the code slice + opener path | Yes |
| Full v2.1 squad vs v1 squad (Keycloak, 2 blind pairs) | 77 vs 54 and 68 vs 48 unique gems; v2 leads alone weaker (17 vs 26 searches), fixed by the coverage pass | Yes |

Source slices add about half of all gems (EN): the lead alone misses them. The squad's pace is set by the code slice + opener (about 500 s in round 7), not the lead (230–270 s with the coverage pass); social and docs slices take 2–3 min.

## Social platforms per language

| Language | Social slice platforms |
|---|---|
| EN | Reddit, Bluesky, Mastodon (needs base_url), dev.to threads |
| ZH | 即刻, 小红书, 微博, Bilibili, 掘金 沸点 (check `parallax://social/platforms` ids first) |
| ZH-TW | Threads, Dcard, Facebook groups, Plurk |
| Other | the language's main discussion platforms |

## Rate limits (Parallax, 2026-10)

- Reddit: about one call at a time across the whole session. Search returns HTTP 429 under parallel load; `get_post` sometimes returns HTTP 403 (login wall). Only the social slice calls Reddit, one call per turn. Even serial calls hit an upstream 429 for long stretches (Keycloak round: 4 social slices, 0–3 threads read each), so a social slice with no Reddit reads is not coverage.
- GitHub search API: 30 requests/min per account, shared by every agent in the session. Only the code slice runs `gh search`; the lead and other slices use `gh issue view` (core API, 5,000/h) or batch_fetch on issue URLs. A lead that also runs `gh search` exhausts the quota and gets `[]`.
- Dcard has been down in Parallax since 2026-10-03. Bilibili comments return HTTP 412. V2EX search is flaky; use `engines:["sov2ex"]`.
- When a platform is down, the slice says so in its report; do not count the slice as coverage.
- Reddit fallback (tested 2026-10-09): Parallax Reddit was blocked for a whole session, but `bsk` on `old.reddit.com/.../.json` in the logged-in browser returned the full post and comments. It needs Chrome running with the bsk extension.

## Prompt lines

Lead, add to the Phase 3 prompt:

```
PARALLEL: in each turn, send several independent tool calls at once, spread across different sites (for example a web search, a forum search and a batch_fetch together). Fetch pages in batches with batch_fetch (up to 10 URLs per call). Do not call Reddit; the social helper owns it. Do not run `gh search`; the code helper owns the GitHub search quota. Open issues it cannot reach with `gh issue view` or batch_fetch. Speed comes from parallel calls, never from stopping early: keep going until new searches stop turning up gems.
COVERAGE PASS (before you stop): list the sub-areas named in the research question. For each sub-area with fewer than 3 GEMs, run at least 2 more searches on it with different keywords or different sites, and open the best results. Stop only when one full coverage pass adds no new GEM. Put the final per-sub-area GEM counts in the report.
```

Code slice:

```
YOUR SLICE: GitHub issues/discussions and X only. Other agents cover the rest.
For trackers off GitHub, use their JSON APIs, not their web pages (web pages return boilerplate or HTTP 429): GitLab `https://gitlab.com/api/v4/projects/<url-encoded path>/issues?search=<q>&order_by=updated_at`, Forgejo/Gitea/Codeberg `https://codeberg.org/api/v1/repos/<owner>/<repo>/issues?q=<q>&type=issues`.
Use these exact forms (put the repo in --repo, never `repo:` inside the quoted query; 22 of 54 calls failed that way):
  gh search issues "<q>" --repo <owner/repo> --sort comments --limit 20 --json number,title,commentsCount,url
  gh api graphql -f query='query($q:String!){search(query:$q,type:DISCUSSION,first:20){nodes{... on Discussion{number title url comments{totalCount}}}}}' -f q='repo:<owner/repo> <q>'
Search Discussions too: many projects (Grafana, Next.js, Vercel) answer production problems there, not in Issues. Open discussions with batch_fetch on their URLs.
HARD BUDGET: at most 20 tool calls, in two phases:
- Phase 1 (calls 1–15): search and open as usual.
- Phase 2 (calls 16–20, RESERVED): stop searching. Open the most promising issues you saw but did not open (many comments, incident titles), several `gh issue view <n> -R <repo> --comments` per turn.
At the end add `UNOPENED LEADS:` with up to 10 URLs you still did not open, each with a 5–10 word reason.
```

Social and docs slices:

```
YOUR SLICE: [platforms]. Other agents cover the rest.
HARD BUDGET: at most 15 tool calls in total, then stop and report.
[social only] Never send more than one Reddit call at a time; parallel Reddit calls get HTTP 429. Expand threads with get_post max_comments.
[social only] If Reddit returns HTTP 429, 403 or HTML instead of JSON, read Reddit through the owner's logged-in browser with one Bash call per batch:
  ~/.claude/skills/lead-researcher/scripts/reddit-read.sh "<thread or search URL>" ["<URL>" ...]
  Search inside a subreddit (an unrestricted search returns unrelated posts): https://old.reddit.com/r/<sub>/search.json?q=<q>&restrict_sr=1&sort=top&t=all
  Pass 3–5 thread URLs per call. It prints the post body and comments (3 levels) for threads, and title/score/comments/link for searches.
Read only. Never post, vote or open account pages.
At the end add `UNOPENED LEADS:` with up to 10 URLs you saw but did not open, each with a 5–10 word reason.
```

Opener:

```
YOUR JOB: you are the OPENER. Other agents listed the leads below but did not open them. Do not search. Open them (GitHub issues and Reddit threads first; vendor docs last) and report what they contain. AI bot answers in issue threads are MEH unless a human confirms them.
HARD BUDGET: at most 10 tool calls, then stop and report.
LEADS: [union of the slices' UNOPENED LEADS]
```

## Merge

REASONING reads all five reports together. Dedupe by URL and by incident before weighing; slices repeat each other's top finding. Re-judge slice GEM tags.

## Pool

A squad is 4 agents plus the opener. With the 6-in-flight pool, queue the next squad's slices behind a running lead: slices finish in 1–5 min, so the pool drains.
