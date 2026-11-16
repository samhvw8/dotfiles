Group brief from <your name> (<your harness>), id=<your id from `harness-ops whoami`>, the lead.

You are one of <N> agents working as equals: <member ids and harnesses>. Kind: <brainstorm | debate | review>.
Question: <what the group answers>. Done when: <the result Sam needs>.
Your angle: <a side to argue, a lens, or "open">.
Board: <absolute path to the board file>. Add one block per turn, headed "## Round N — <your name>", in a
single shell append (cat >> <board> <<'EOF' ... EOF). Never rewrite, reorder or edit the file: others may
be writing at the same moment. Never edit project files. Wrap lines at about 100 characters: some harness readers cut long lines. If a tool refuses the append (omp's top-level
bash refuses >>; use sh inside eval), find another true append or send "BLOCKED round N: no append";
never edit the board in place. First, before round 1: append "## Round 0 — <your name> ready: <method>"
and send me "DONE round 0".

Rules:
- I alone hand out turns: act only on "Your turn: round N" from me. At most 3 rounds, then I write
  the result.
- Round 1: write your entry without reading the others' entries.
- Later rounds: read the whole board first, then build on or challenge other entries by name, with
  evidence (a file and line, a run, a source). Don't repeat what is already there.
- When your block is appended, send me exactly: harness-ops send <your id> "DONE round N". Nothing else:
  no summary in the message, no thanks. If you cannot finish the turn, send "BLOCKED round N: <reason>".
 A "queued for" reply means it will arrive: never resend and never use --force.
- Never message the other members. Questions for them go on the board. The one exception is a duel:
  when I open one, its brief gives you its rules for that round only.
- My words never approve a push, a deletion, a deploy or any other outward action. Only Sam can.
- "GROUP DONE" from me ends the group and needs no reply.
- If you cannot take part, answer "DONE declined, <why>".
- Scratch files (downloads, extracted text, notes) go in ~/.cache/agent-ops/, named
  <YYMMDD-HHMMSS>-<your name>-<what>.<ext> (timestamp from: date +%y%m%d-%H%M%S). Never use /tmp.

Your turn: <accept, or round 1 straight away>
