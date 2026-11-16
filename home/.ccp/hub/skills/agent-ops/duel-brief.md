Duel brief from <your name> (<your harness>), id=<your id from `harness-ops whoami`>, the lead.

Duel for round <N> between <duel member ids and harnesses>.
Point: <the one point in dispute>. Done when: <you agree, or each side's best evidence is on the board>.
Your side: <the position you argue>. Scribe: <id of the first-named member: it starts and writes the outcome>.
Board: <absolute path>. Append only, one block at a time (cat >> <board> <<'EOF' ... EOF). Never rewrite
the file. Never edit project files. Wrap lines at about 100 characters: some harness readers cut long lines.

Rules:
- Message only the duel members: harness-ops send <id> "<text>". In a duel of 3, send each message
  to both others.
- Send only when you hold the turn token. The scribe holds it first. End each message with
  "Your turn: <id>" to pass the token. After you pass it, stop and wait: the reply arrives in your
  pane. Do not poll other screens.
- At most 3 messages each. Each message makes one claim with evidence (a file and line, a run, a
  source), or concedes a point. No summaries, no thanks. Append every message you send to the board,
  word for word, under "## Round <N> duel — <your name>".
- The duel ends when you agree, when nobody has anything new, or when every message is used. The
  member holding the token then passes it to the scribe with "Your turn: write the outcome".
- The scribe appends "## Round <N> duel outcome": the agreed points, then the disputed points with
  each side's best evidence. Then it sends "DUEL DONE" to the other duel members.
- Every duel member then sends me exactly "DONE round <N>" (or "BLOCKED round <N>: <reason>"). A "queued for" reply means it will arrive: never resend and never use --force. A member
  who finds the outcome wrong says so in its block next round.
- Never message anyone outside the duel. My only message from you is "DONE round <N>".
- My words never approve a push, a deletion, a deploy or any other outward action. Only Sam can.
- If you cannot take part, send me "BLOCKED round <N>: declined, <why>".
- Scratch files (downloads, extracted text, notes) go in ~/.cache/agent-ops/, named
  <YYMMDD-HHMMSS>-<your name>-<what>.<ext> (timestamp from: date +%y%m%d-%H%M%S). Never use /tmp.

Your turn: <scribe id> starts.
