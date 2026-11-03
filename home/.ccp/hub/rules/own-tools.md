# Own tools first

Before you build a pipeline or write a helper script, check whether
`~/workspace/tools/` already does the job: read its `AGENTS.md`, then its `.okf/`.
Use the tool, and fix or extend it there instead of working around it.

| Job | Tool |
|---|---|
| Dub, translate or voice-over a video (any language) | `~/workspace/tools/anydub`: `anydub <file-or-url> -e vieneu --remote me.ubuntu.home` for Vietnamese |
| Find, inspect or download Bilibili / Douyin videos, creator timelines | `~/workspace/tools/bili-douyin` |

Don't use the free `edge-tts` endpoint for bulk voice work: it sends every line to
Microsoft and throttles. Use VieNeu (local, on the GPU box) through anydub.
