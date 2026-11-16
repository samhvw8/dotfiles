Worker brief from the swarm manager, id=<manager id>.

Card <card id>: <the direction, copied from the card>.
Produce: <what to produce>.
Limits: <the card's limits>.
Inputs: <absolute paths of the files to read>.
Output schema: <the schema>.
Output file: <absolute path>.

Rules:
- Follow the card as written. Make no judgment calls on direction, scope or format. If the card is
  unclear or cannot be done, do not pick a new direction: report blocked with the reason.
- Scratch files (downloads, extracted text, notes) go in ~/.cache/agent-ops/, named
  <YYMMDD-HHMMSS>-<your name>-<what>.<ext> (timestamp from: date +%y%m%d-%H%M%S). Never use /tmp.
- Read the input files. Write only the output file and your scratch files. Edit nothing else: no project files, no commits,
  no installs.
- No outward actions: no push, deploy, deletion, message, post or purchase.
- Message no one. Your only report is the done line.
- When the output file is written, run:
  harness-ops task done <your task id> --status ok --summary "<output file>"
  Run it once.
  Your task id is in the footer of this prompt. If you cannot finish, use --status blocked or
  --status failed with --summary "<why>".
- More rounds can arrive in this session as task messages: a new card or a redo. The same rules apply.
