# Using MCP Tools: Complete Guide

Comprehensive guide for discovering, executing, and managing MCP tools from configured servers.

---

## Table of Contents

1. [Configuration](#configuration)
2. [Gemini CLI Integration (Primary)](#gemini-cli-integration-primary)
3. [Direct Script Execution (Secondary)](#direct-script-execution-secondary)
4. [Subagent Delegation (Fallback)](#subagent-delegation-fallback)
5. [Tool Discovery](#tool-discovery)
6. [Multi-Server Management](#multi-server-management)
7. [Troubleshooting](#troubleshooting)

---

## Configuration

### MCP Server Configuration File

MCP servers configured in `.claude/.mcp.json`:

```json
{
  "mcpServers": {
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"]
    },
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/allowed/path"]
    },
    "brave-search": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-brave-search"],
      "env": {
        "BRAVE_API_KEY": "${BRAVE_API_KEY}"
      }
    },
    "puppeteer": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-puppeteer"]
    }
  }
}
```

### Environment Variables

Reference env vars with `${VAR_NAME}` syntax:

```json
{
  "api-server": {
    "command": "node",
    "args": ["server.js"],
    "env": {
      "API_KEY": "${MY_API_KEY}",
      "BASE_URL": "${API_BASE_URL}"
    }
  }
}
```

### Configuration Loading Order

Scripts check for config in this order:
1. `process.env` (runtime environment)
2. `.claude/skills/mcp/.env`
3. `.claude/.env`

---

## Gemini CLI Integration (Primary)

**Recommended primary method** for MCP tool execution.

### Installation

```bash
npm install -g gemini-cli
gemini --version
```

### Configuration

Create symlink to share MCP config with Gemini CLI:

```bash
# Unix/Linux/macOS
mkdir -p .gemini
ln -sf .claude/.mcp.json .gemini/settings.json

# Windows (requires admin or developer mode)
mkdir .gemini
mklink .gemini\settings.json .claude\.mcp.json
```

Add to `.gitignore`:
```
.gemini/settings.json
```

### Critical Usage Pattern

**IMPORTANT**: Use stdin piping, NOT `-p` flag.

```bash
# ❌ WRONG - Skips MCP initialization!
gemini -y -m gemini-2.5-flash -p "Take a screenshot"

# ✅ CORRECT - Initializes MCP servers
echo "Take a screenshot" | gemini -y -m gemini-2.5-flash
```

**Why**: The `-p` flag runs in "quick mode" and bypasses MCP server connection initialization. Always use stdin piping (echo + pipe).

### Essential Flags

- `-y`: Skip confirmation prompts (auto-approve tool execution)
- `-m <model>`: Model selection
  - `gemini-2.5-flash` (fast, recommended for MCP)
  - `gemini-2.5-flash` (balanced)
  - `gemini-pro` (high quality)

### Usage Examples

**Screenshot Capture**:
```bash
echo "Take a screenshot of https://www.google.com" | gemini -y -m gemini-2.5-flash
```

**Memory Operations**:
```bash
echo "Remember that Alice is a React developer working on e-commerce" | gemini -y -m gemini-2.5-flash
```

**Web Research**:
```bash
echo "Search for latest Next.js 15 features and summarize top 3" | gemini -y -m gemini-2.5-flash
```

**Multi-Tool Orchestration**:
```bash
echo "Search for Claude AI docs, screenshot homepage, save to memory" | gemini -y -m gemini-2.5-flash
```

**Browser Automation**:
```bash
echo "Navigate to https://example.com, click signup, take screenshot" | gemini -y -m gemini-2.5-flash
```

### How It Works

1. **Configuration Loading**: Reads `.gemini/settings.json` (symlinked to `.claude/.mcp.json`)
2. **Server Connection**: Connects to all configured MCP servers
3. **Tool Discovery**: Lists all available tools from servers
4. **Prompt Analysis**: Gemini model analyzes the prompt
5. **Tool Selection**: Automatically selects relevant tools
6. **Execution**: Calls tools with appropriate parameters
7. **Result Synthesis**: Combines tool outputs into coherent response

### Structured JSON Responses

Create `GEMINI.md` in project root to enforce JSON-only responses:

```markdown
# Gemini CLI Response Format

You are executing MCP tools. Always respond in this exact JSON format:

{
  "server": "server_name",
  "tool": "tool_name",
  "success": true,
  "result": <data>,
  "error": null
}

Rules:
- Maximum 500 characters
- JSON only, no markdown formatting
- No explanations outside JSON
- If error: set success=false, populate error field
```

**Benefits**:
- Programmatically parseable output
- Consistent error reporting
- Auto-loaded by Gemini CLI
- No natural language ambiguity

### Advanced Configuration

**Trusted Servers** (skip confirmations):

```json
{
  "mcpServers": {
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"],
      "trust": true
    }
  }
}
```

**Tool Filtering**:

```json
{
  "chrome-devtools": {
    "command": "npx",
    "args": ["-y", "chrome-devtools-mcp@latest"],
    "includeTools": ["navigate_page", "screenshot"],
    "excludeTools": ["evaluate_js"]
  }
}
```

### Debugging

**Check MCP Status**:
```bash
gemini
> /mcp
```

Shows connected servers, available tools, configuration errors.

**Verify Symlink**:
```bash
# Unix/Linux/macOS
ls -la .gemini/settings.json

# Windows
dir .gemini\settings.json
```

**Debug Mode**:
```bash
echo "Take a screenshot" | gemini --debug
```

---

## Direct Script Execution (Secondary)

Manual tool specification when you know exact server/tool needed.

### Installation

```bash
cd .claude/skills/mcp/scripts
npm install
```

### Available Commands

**List Tools** (saves to `assets/tools.json`):
```bash
npx tsx cli.ts list-tools
```

**List Prompts**:
```bash
npx tsx cli.ts list-prompts
```

**List Resources**:
```bash
npx tsx cli.ts list-resources
```

**Call Tool**:
```bash
npx tsx cli.ts call-tool <server> <tool> '<json-args>'
```

### Examples

**Memory Operations**:
```bash
npx tsx cli.ts call-tool memory create_entities '{
  "entities": [
    {"name": "Alice", "type": "person", "observations": ["React developer"]}
  ]
}'
```

**Filesystem Operations**:
```bash
npx tsx cli.ts call-tool filesystem read_file '{"path": "/path/to/file.txt"}'
```

**Puppeteer Screenshot**:
```bash
npx tsx cli.ts call-tool puppeteer screenshot '{
  "url": "https://example.com",
  "name": "example-screenshot"
}'
```

### When to Use

- Need specific server/tool control
- Gemini CLI unavailable
- Scripting/automation scenarios
- Debugging specific tool behavior

---

## Subagent Delegation (Fallback)

Delegate to `mcp-manager` agent when Gemini unavailable or for complex workflows.

### Pattern

```
Main Agent → mcp-manager Subagent → Tool Discovery/Execution → Report Back
```

### Benefits

- Main context stays clean
- Only relevant tool definitions loaded when needed
- Handles multi-tool orchestration
- Provides structured feedback

### When to Use

- Gemini CLI unavailable
- Complex multi-step workflows
- Need context-efficient tool discovery
- Building MCP client implementations

---

## Tool Discovery

### List All Tools

```bash
npx tsx cli.ts list-tools
```

Output saved to `assets/tools.json` with complete schemas:

```json
{
  "memory": [
    {
      "name": "create_entities",
      "description": "Create new entities in the knowledge graph",
      "inputSchema": {
        "type": "object",
        "properties": {
          "entities": {
            "type": "array",
            "items": {"type": "object"}
          }
        }
      }
    }
  ]
}
```

### Intelligent Tool Selection

LLM reads `assets/tools.json` directly for context-aware filtering:

- Better than keyword matching algorithms
- Understands synonyms and intent
- Considers task context
- Selects relevant tools across servers

### Progressive Disclosure

Only load tool definitions when needed:

1. Check `assets/tools.json` for overview
2. Filter relevant tools by task
3. Load only necessary tool details
4. Execute with proper parameters

---

## Multi-Server Management

### Configuration

Multiple servers in `.claude/.mcp.json`:

```json
{
  "mcpServers": {
    "memory": {...},
    "filesystem": {...},
    "brave-search": {...},
    "puppeteer": {...}
  }
}
```

### Orchestration Patterns

**Sequential**:
```bash
echo "Search web, then save results to memory, then take screenshot" | gemini -y
```

**Parallel** (Gemini decides):
```bash
echo "Search docs AND capture screenshot simultaneously" | gemini -y
```

**Conditional**:
```bash
echo "If search finds results, save to memory, else notify user" | gemini -y
```

### Server Identification

Each tool knows its source server:

```json
{
  "server": "puppeteer",
  "tool": "screenshot",
  "result": "screenshot.png"
}
```

Enables proper routing across multiple servers.

---

## Troubleshooting

### Connection Errors

**Stdio Transport**:
- Verify command and arguments correct in `.claude/.mcp.json`
- Check executable is in PATH
- Ensure required dependencies installed

**HTTP/SSE Transport**:
- Check URL is accessible
- Verify headers/authentication
- Ensure server is running

### Tool Not Found

**Check Configuration**:
```bash
gemini
> /mcp
```

**Verify Tool List**:
```bash
npx tsx cli.ts list-tools
```

**Check Symlink**:
```bash
ls -la .gemini/settings.json
```

### Execution Failures

**Use Debug Mode**:
```bash
echo "Your task" | gemini --debug
```

**Check Environment Variables**:
```bash
echo $API_KEY
printenv | grep -i api
```

**Verify Direct Script**:
```bash
npx tsx cli.ts call-tool server tool '{}'
```

### Performance Issues

**Use Faster Model**:
```bash
echo "Task" | gemini -y -m gemini-2.5-flash
```

**Filter Tools**:
```json
{
  "server": {
    "includeTools": ["tool1", "tool2"]
  }
}
```

**Check Response Size**:
- Verify pagination working
- Check CHARACTER_LIMIT respected
- Review tool output verbosity

---

## Execution Priority

Follow this order for maximum efficiency:

### 1. Gemini CLI (Primary)

**When**: All tasks when available

**Benefits**:
- Automatic tool discovery
- Intelligent selection
- Fastest execution
- Natural language interface

**Command**:
```bash
echo "<task>" | gemini -y -m gemini-2.5-flash
```

### 2. Direct Scripts (Secondary)

**When**: Need specific server/tool control

**Benefits**:
- Explicit tool specification
- No LLM overhead
- Scripting/automation friendly

**Command**:
```bash
npx tsx cli.ts call-tool server tool '{"args": "value"}'
```

### 3. Subagent (Fallback)

**When**: Gemini unavailable or complex workflows

**Benefits**:
- Context-efficient
- Handles discovery + execution
- Structured feedback

**Pattern**: Delegate to `mcp-manager` agent

---

## Scripts Reference

### mcp-client.ts

Core MCP client manager:
- Config loading from `.claude/.mcp.json`
- Multi-server connection management
- Tool/prompt/resource listing
- Tool execution with error handling
- Connection lifecycle management

### cli.ts

Command-line interface:

```bash
# List all tools (saves to assets/tools.json)
npx tsx cli.ts list-tools

# List all prompts
npx tsx cli.ts list-prompts

# List all resources
npx tsx cli.ts list-resources

# Execute tool
npx tsx cli.ts call-tool <server> <tool> '<json>'
```

---

## Integration Strategy

### With Agent Workflows

**Pattern 1: Direct Gemini**
```
Task → Gemini CLI → Tool Execution → Result
```

**Pattern 2: Script Automation**
```
Script → Direct CLI → Multiple Tools → Aggregated Results
```

**Pattern 3: Subagent Delegation**
```
Main Agent → mcp-manager → Tool Discovery → Execution → Report
```

### With Development Workflow

1. **Build** MCP server (see `references/building-servers.md`)
2. **Configure** in `.claude/.mcp.json`
3. **Test** with Gemini CLI
4. **Iterate** based on results
5. **Evaluate** with comprehensive questions

---

## Comparison Matrix

| Method | Speed | Flexibility | Setup | Best For |
|--------|-------|-------------|-------|----------|
| Gemini CLI | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | All tasks, natural language |
| Direct Scripts | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | Specific tools, automation |
| mcp-manager | ⭐ | ⭐⭐ | ⭐⭐⭐ | Complex workflows, fallback |

**Recommendation**: Gemini CLI primary, direct scripts for specific needs, subagent for complex workflows.

---

## Resources

### Documentation
- [Gemini CLI Docs](https://geminicli.com/docs)
- [MCP Server Config](https://geminicli.com/docs/tools/mcp-server)
- [Tool Reference](https://geminicli.com/docs/tools/mcp-server/#tool-interaction)

### Related References
- Configuration: `references/protocol-basics.md`
- Building servers: `references/building-servers.md`
- Best practices: `references/best-practices.md`
