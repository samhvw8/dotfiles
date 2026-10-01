// surgical-changes — opencode 2 port of the Claude Code PostToolUse hook:
// after an edit to a code file, remind the model to check every changed line.
//
// opencode 2 plugins default-export { id, setup } (`define` from
// @opencode-ai/plugin/v2/promise is an identity function, so it is not
// imported: this file lives in a dotfiles repo with no node_modules).

const REMINDER = `<surgical_change_reminder>
Diff discipline — verify every changed line:
- Does this line trace to the user's request?
- Did you change formatting/style you weren't asked to?
- Did you add error handling for impossible cases?
- Did you "improve" code adjacent to your change?
If any answer is wrong → revert that part.
</surgical_change_reminder>`

// Paths an edit touched: edit/write take `path`; patch carries them in patchText.
function editedPaths(tool: string, input: any): string[] {
  if (tool === "edit" || tool === "write") {
    const path = input?.path ?? input?.filePath ?? input?.file_path
    return typeof path === "string" ? [path] : []
  }
  if (tool === "patch" && typeof input?.patchText === "string") {
    return [...input.patchText.matchAll(/^\*\*\* (?:Add|Update) File: (.+)$/gm)].map((m) => m[1].trim())
  }
  return []
}

const isCode = (path: string) => !path.endsWith(".md") && !path.includes("/hooks/")

export default {
  id: "surgical-changes",
  setup: async (ctx: any) => {
    if (typeof ctx?.tool?.hook !== "function") {
      console.warn("surgical-changes: this opencode has no tool hooks; plugin inactive")
      return
    }
    await ctx.tool.hook("execute.after", async (event: any) => {
      if (event.status !== "completed" || !event.result) return
      if (!editedPaths(event.tool, event.input).some(isCode)) return
      const content = Array.isArray(event.result.content) ? event.result.content : []
      event.result.content = [...content, { type: "text", text: REMINDER }]
    })
  },
}
