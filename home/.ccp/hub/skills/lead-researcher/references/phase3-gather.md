# Phase 3: GATHER

Part of the [lead-researcher skill](../SKILL.md). Read this when you spawn gatherer squads: the lead prompt template and the in-flight rule.

### Phase 3: GATHER (the loop's gather step)

This is the GATHER step of the iterate loop — spawn gatherer agents for the current sub-questions. Brain decides how many agents.

Spawn `gatherer` agents as plain subagents (no `name`); only the Team venue starts gatherers as harness-ops tasks ([team-research](team-research.md)). Spawn each assignment as a squad in one message: a `model: "sonnet"` lead with the prompt below, plus three `model: "haiku", effort: "high"` slices (code, social, docs) with the slice and budget lines from [gather-squad](gather-squad.md). When the three slices return, spawn one opener on their `UNOPENED LEADS`. Give each member its own report path. Spawn the squad the plan confirmed: a slice dropped or re-aimed for the source stack stays that way, and when there is no code slice (GitHub out of the stack) or no social slice, delete the lead-prompt line that hands that work to the missing helper. Each prompt:

```
Research: [1 specific sub-question]
Language: [1 assigned language — search ONLY in this language]
Output: Return findings as structured data, NOT a formatted report. Search until you find gems or exhaust the topic.

PARALLEL: in each turn, send several independent tool calls at once, spread across different sites. Fetch pages in batches with batch_fetch (up to 10 URLs per call). Do not call Reddit; the social helper owns it. Do not run `gh search`; the code helper owns the GitHub search quota. Speed comes from parallel calls, never from stopping early: keep going until new searches stop turning up gems.
COVERAGE PASS (before you stop): list the sub-areas named in the research question. For each sub-area with fewer than 3 GEMs, run at least 2 more searches on it with different keywords or different sites, and open the best results. Stop only when one full coverage pass adds no new GEM. Put the final per-sub-area GEM counts in the report.

Elite forum targeting: Include at least 2 site:-targeted searches on these forums:
[list 2-4 forums from the table in elite-forum-targeting.md for this language]
Also discover additional niche forums via "[topic] 论坛 社区 精华" queries.
Prioritize elite/niche communities over content farms.

Scope: ONLY [sub-topic]. Do NOT investigate [other sub-topics].
Report path: [./research/YYMMDD-topic/lang-subtopic.md]

Tag each finding as GEM/MEH/NOISE:
- GEM: a number, a named incident, an exact error, or a working workaround — from practitioner experience, on a page you actually fetched. A search snippet or issue title you did not open is MEH at most. A restatement of vendor docs is MEH unless it contradicts a practitioner report.
- MEH: partial signal, some specifics but also generic
- NOISE: generic praise, listicles, no downsides, undated, affiliate links, keyword stuffing
List each incident once, even if several sources repeat it (cite them together). Prioritize GEM findings. Report NOISE count but don't expand on them.

RECOMMENDED SKILLS: deep-gather - use for search-fetch loop methodology
```

**Max 6 agents in flight — rolling, not waves.** Fire the first batch (up to 6) in a single message; as each completes, launch the next queued agent without waiting for the rest.
