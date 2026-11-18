---
name: quick-search
description: Light, single-agent search for "does X exist", "how do I do X", "what are my options for X", picking a tool, library or approach, or checking a claim. Use when one search is too narrow and lead-researcher is too heavy. Covers official docs, GitHub and social in one pass, reads the top sources, and reports the whole option space plus what it did not cover. Escalate to lead-researcher for a costly or hard-to-reverse decision, conflicting sources, non-English sources, or gaps that remain after about 15 queries.
---

# Quick search

Goal: the whole option space in about 10-15 queries, at one agent's cost.

## 1. Frame (no searching yet)

- Restate the question in plain words. Note what you already know from local code and docs.
- Pick 2 angles: **A, the official path** (docs, vendor, SDK) and **B, alternatives and
  real-world pain** (other ways, issues, forums). Add a third only if the question needs it
  (cost, security, migration).
- Write down your guess at the answer. Keep it out of wave 1.

## 2. Wave 1: broad, in parallel (6-10 queries)

Per angle:

- one query in the user's own plain words;
- one with synonyms or another common name for the thing;
- one that asks for the space: "options", "alternatives", "ways to", "X vs Y".

Spread them across kinds of source: web search; GitHub (`gh search issues|code|repos`,
anchored on a product or exact name, because GitHub matches literal words); social
(Parallax `social_search`, or `site:reddit.com` in web search). Send the batch in one go.

## 3. Read

- Fetch the 3-5 best pages: official docs first, then the most-discussed issue or thread.
  A snippet is a lead, not evidence.
- Keep a list: option, how it works, what it needs, limits, source.

## 4. Wave 2: narrow (up to 5 queries)

- Only now use the exact terms wave 1 taught you (API names, flags, error strings) to fill
  gaps and to check the 1-2 claims your answer rests on.
- When a claim is cheap to test (run a snippet, call an API), test it.

## 5. Report

- The answer in one line, first.
- A table of every option found, not only the best one.
- Which claims are verified (primary source or a run) and which rest on snippets.
- The angles you did not cover ("no social signal", "English only").
- Show the query log only when asked.

## Stop or escalate

- Stop when wave 2 adds nothing new.
- Hand over to `lead-researcher` when the decision is costly or hard to undo, sources
  conflict, the topic needs non-English sources, or gaps remain after about 15 queries.
  Pass it your option table so it does not start from zero.

## Tools and limits

- Claude Code: Parallax MCP (`mcp__claude_ai_Parallax__*`) when connected, else
  `parallax call` (`parallax-cli` skill); WebSearch and WebFetch; `gh`.
- omp and agy: `parallax call`, `web_search` / `read`, `gh`.
- Employer or client code: generic queries only, with no company names, identifiers or code.
