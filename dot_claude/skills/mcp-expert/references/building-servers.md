# Building MCP Servers: Complete Guide

Comprehensive guide for creating high-quality MCP servers that enable LLMs to accomplish real-world tasks.

---

## Table of Contents

1. [Agent-Centric Design Principles](#agent-centric-design-principles)
2. [Development Workflow](#development-workflow)
3. [Python Implementation (FastMCP)](#python-implementation-fastmcp)
4. [TypeScript Implementation (MCP SDK)](#typescript-implementation-mcp-sdk)
5. [Tool Design Patterns](#tool-design-patterns)
6. [Response Formats](#response-formats)
7. [Pagination & Character Limits](#pagination--character-limits)
8. [Error Handling](#error-handling)
9. [Creating Evaluations](#creating-evaluations)

---

## Agent-Centric Design Principles

Build tools for AI agents, not just API wrappers.

### Build for Workflows, Not Endpoints
- Consolidate related operations (e.g., `schedule_event` checks availability AND creates event)
- Focus on complete tasks, not individual API calls
- Consider what workflows agents actually need to accomplish

### Optimize for Limited Context
- Agents have constrained context windows - make every token count
- Return high-signal information, not exhaustive data dumps
- Provide "concise" vs "detailed" response format options
- Default to human-readable identifiers over technical codes

### Design Actionable Error Messages
- Error messages should guide agents toward correct usage
- Suggest specific next steps: "Try using filter='active_only'"
- Make errors educational, not just diagnostic

### Follow Natural Task Subdivisions
- Tool names should reflect how humans think about tasks
- Group related tools with consistent prefixes
- Design around natural workflows, not just API structure

### Use Evaluation-Driven Development
- Create realistic evaluation scenarios early
- Let agent feedback drive tool improvements
- Prototype quickly and iterate based on actual agent performance

---

## Development Workflow

### Phase 1: Research & Planning

**1.1 Study MCP Protocol**
- Fetch: `https://modelcontextprotocol.io/llms-full.txt`
- Understand tools, resources, prompts, transports

**1.2 Study Framework Documentation**

Python:
- Fetch: `https://raw.githubusercontent.com/modelcontextprotocol/python-sdk/main/README.md`
- Review: `references/python-guide.md`

TypeScript:
- Fetch: `https://raw.githubusercontent.com/modelcontextprotocol/typescript-sdk/main/README.md`
- Review: `references/typescript-guide.md`

**1.3 Study API Documentation Exhaustively**
- Official API reference
- Authentication requirements
- Rate limiting, pagination
- Error responses
- Available endpoints and parameters
- Data models and schemas

**1.4 Create Implementation Plan**
- List most valuable endpoints to implement
- Identify shared utilities needed
- Design input/output formats
- Plan error handling strategies
- Consider pagination and character limits

### Phase 2: Implementation

**2.1 Set Up Project Structure**

Python: Single `.py` file or module structure
TypeScript: Full project with `src/`, `package.json`, `tsconfig.json`

**2.2 Implement Core Infrastructure First**
- API request helper functions
- Error handling utilities
- Response formatting (JSON and Markdown)
- Pagination helpers
- Authentication/token management

**2.3 Implement Tools Systematically**

For each tool:
1. Define input schema (Pydantic or Zod)
2. Write comprehensive descriptions
3. Implement tool logic using shared utilities
4. Add proper annotations (readOnlyHint, etc.)
5. Handle errors gracefully

**2.4 Follow Language-Specific Best Practices**

Load appropriate guide:
- Python → `references/python-guide.md`
- TypeScript → `references/typescript-guide.md`

### Phase 3: Review & Testing

**3.1 Code Quality Review**
- DRY: No duplicated code
- Composability: Shared logic extracted
- Consistency: Similar operations return similar formats
- Error Handling: All external calls covered
- Type Safety: Full type coverage
- Documentation: Comprehensive docstrings

**3.2 Test & Build**

Python:
```bash
python -m py_compile your_server.py
# Or use evaluation harness
```

TypeScript:
```bash
npm run build  # Must complete without errors
```

**IMPORTANT**: Servers are long-running processes. Don't run directly in main thread. Use:
- Evaluation harness (recommended)
- tmux for manual testing
- `timeout 5s` for quick checks

**3.3 Quality Checklist**

See language-specific guide for complete checklist.

### Phase 4: Evaluation

Create 10 realistic, complex evaluation questions.

**Load** `references/evaluation-guide.md` for complete methodology.

**Key Requirements**:
- Questions must be READ-ONLY and NON-DESTRUCTIVE
- Each requires multiple tool calls (potentially dozens)
- Answers must be single, verifiable values
- Answers must be STABLE (won't change over time)

---

## Python Implementation (FastMCP)

**Complete guide**: `references/python-guide.md`

### Quick Start

```python
from mcp.server.fastmcp import FastMCP
from pydantic import BaseModel, Field, field_validator, ConfigDict

mcp = FastMCP("service_mcp")

class SearchInput(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True, validate_assignment=True)
    
    query: str = Field(..., min_length=2, max_length=200, 
                       description="Search query")
    limit: int = Field(default=20, ge=1, le=100)

@mcp.tool(
    name="service_search",
    annotations={
        "readOnlyHint": True,
        "destructiveHint": False,
        "idempotentHint": True,
        "openWorldHint": True
    }
)
async def search(params: SearchInput) -> str:
    """Search for items in the service.
    
    Args:
        params (SearchInput): Validated search parameters
        
    Returns:
        str: JSON-formatted search results
    """
    # Implementation
    pass

if __name__ == "__main__":
    mcp.run()
```

### Key Features
- Automatic schema generation from Pydantic models
- Decorator-based tool registration (`@mcp.tool`)
- Type hints throughout
- Async/await for all I/O
- Context injection for progress reporting

**Full details**: `references/python-guide.md`

---

## TypeScript Implementation (MCP SDK)

**Complete guide**: `references/typescript-guide.md`

### Quick Start

```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "service-mcp-server",
  version: "1.0.0"
});

const SearchInputSchema = z.object({
  query: z.string().min(2).max(200).describe("Search query"),
  limit: z.number().int().min(1).max(100).default(20)
}).strict();

server.registerTool(
  "service_search",
  {
    title: "Search Service",
    description: "Search for items in the service",
    inputSchema: SearchInputSchema,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true
    }
  },
  async (params: z.infer<typeof SearchInputSchema>) => {
    // Implementation
    return {
      content: [{type: "text", text: JSON.stringify(result)}]
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main();
```

### Key Features
- Zod schemas for runtime validation
- Explicit `registerTool` configuration
- TypeScript strict mode
- No `any` types
- Build process required (`npm run build`)

**Full details**: `references/typescript-guide.md`

---

## Tool Design Patterns

### Naming Conventions

**Server Names**:
- Python: `{service}_mcp` (e.g., `slack_mcp`)
- TypeScript: `{service}-mcp-server` (e.g., `slack-mcp-server`)

**Tool Names**:
- Format: `{service}_{action}_{resource}`
- Use snake_case
- Include service prefix to avoid conflicts
- Examples:
  - `slack_send_message` (not `send_message`)
  - `github_create_issue` (not `create_issue`)
  - `asana_list_tasks` (not `list_tasks`)

### Tool Annotations

```python
annotations={
    "readOnlyHint": True,      # Tool doesn't modify environment
    "destructiveHint": False,  # Tool doesn't perform destructive updates
    "idempotentHint": True,    # Repeated calls have no additional effect
    "openWorldHint": True      # Tool interacts with external entities
}
```

**Note**: Annotations are hints, not security guarantees.

### Tool Documentation

Every tool needs:
- One-line summary
- Detailed explanation of purpose
- Explicit parameter types with examples
- Complete return type schema
- Usage examples (when to use, when not to use)
- Error handling documentation

---

## Response Formats

Support both JSON and Markdown for flexibility.

### JSON Format (`response_format="json"`)
- Machine-readable structured data
- Include all available fields
- Consistent field names and types
- Use for programmatic processing

### Markdown Format (`response_format="markdown"`)
- Human-readable formatted text
- Use headers, lists, formatting
- Convert timestamps to readable format
- Show names with IDs in parentheses
- Omit verbose metadata
- Use for presenting to users

### Implementation

Python:
```python
from enum import Enum

class ResponseFormat(str, Enum):
    MARKDOWN = "markdown"
    JSON = "json"

class SearchInput(BaseModel):
    response_format: ResponseFormat = Field(default=ResponseFormat.MARKDOWN)
```

TypeScript:
```typescript
enum ResponseFormat {
  MARKDOWN = "markdown",
  JSON = "json"
}

const schema = z.object({
  response_format: z.nativeEnum(ResponseFormat).default(ResponseFormat.MARKDOWN)
});
```

---

## Pagination & Character Limits

### Pagination

Always implement for list operations:

```python
class ListInput(BaseModel):
    limit: Optional[int] = Field(default=20, ge=1, le=100)
    offset: Optional[int] = Field(default=0, ge=0)

# Response structure
{
    "total": 150,
    "count": 20,
    "offset": 0,
    "items": [...],
    "has_more": True,
    "next_offset": 20
}
```

### Character Limits

Prevent overwhelming responses:

```python
CHARACTER_LIMIT = 25000  # Module-level constant

if len(result) > CHARACTER_LIMIT:
    truncated_data = data[:max(1, len(data) // 2)]
    response["truncated"] = True
    response["truncation_message"] = (
        f"Response truncated from {len(data)} to {len(truncated_data)} items. "
        f"Use 'offset' parameter or add filters to see more results."
    )
```

---

## Error Handling

### Principles
- Clear, actionable error messages
- Guide agents toward correct usage
- Don't expose internal errors
- Log security-relevant errors
- Clean up resources

### Implementation

Python:
```python
def _handle_api_error(e: Exception) -> str:
    if isinstance(e, httpx.HTTPStatusError):
        if e.response.status_code == 404:
            return "Error: Resource not found. Please check the ID is correct."
        elif e.response.status_code == 403:
            return "Error: Permission denied. You don't have access."
        elif e.response.status_code == 429:
            return "Error: Rate limit exceeded. Please wait."
    return f"Error: Unexpected error occurred: {type(e).__name__}"
```

TypeScript:
```typescript
function handleApiError(error: unknown): string {
  if (error instanceof AxiosError) {
    switch (error.response?.status) {
      case 404: return "Error: Resource not found. Check the ID.";
      case 403: return "Error: Permission denied.";
      case 429: return "Error: Rate limit exceeded. Wait before retrying.";
    }
  }
  return `Error: ${error instanceof Error ? error.message : String(error)}`;
}
```

---

## Creating Evaluations

**Complete guide**: `references/evaluation-guide.md`

### Overview

Create 10 questions that test whether LLMs can use your server effectively.

### Requirements

**Questions must be**:
- Independent (no dependencies on other questions)
- Read-only and non-destructive
- Complex (requiring multiple tool calls)
- Realistic (real human use cases)
- Unambiguous with clear single answer
- Based on stable data (won't change over time)

**Answers must be**:
- Single verifiable values (username, ID, count, date, etc.)
- Human-readable where possible
- Verifiable via direct string comparison
- Stable (based on historical/closed data)

### Process

1. **Study Documentation**: Understand API and MCP server tools
2. **Explore Content**: Use READ-ONLY operations to find specific content
3. **Generate Questions**: Create 10 complex, realistic questions
4. **Verify Answers**: Solve each yourself to ensure correctness

### Output Format

```xml
<evaluation>
  <qa_pair>
    <question>Find the project created in Q2 2024 with the highest number of completed tasks. What is the project name?</question>
    <answer>Website Redesign</answer>
  </qa_pair>
  <qa_pair>
    <question>Search for issues labeled "bug" closed in March 2024. Which user closed the most? Provide username.</question>
    <answer>sarah_dev</answer>
  </qa_pair>
</evaluation>
```

### Running Evaluations

```bash
pip install anthropic mcp
export ANTHROPIC_API_KEY=your_key

python scripts/evaluation.py \
  -t stdio \
  -c python \
  -a your_server.py \
  -e API_KEY=xxx \
  evaluation.xml
```

**Load** `references/evaluation-guide.md` for complete details.

---

## Resources

### MCP Protocol
- Spec: `https://modelcontextprotocol.io/llms-full.txt`
- Protocol basics: `references/protocol-basics.md`

### SDK Documentation
- Python: `https://raw.githubusercontent.com/modelcontextprotocol/python-sdk/main/README.md`
- TypeScript: `https://raw.githubusercontent.com/modelcontextprotocol/typescript-sdk/main/README.md`

### Implementation Guides
- Python: `references/python-guide.md`
- TypeScript: `references/typescript-guide.md`

### Standards & Best Practices
- Best practices: `references/best-practices.md`
- Evaluation guide: `references/evaluation-guide.md`

---

## Quality Checklist

### Strategic Design
- [ ] Tools enable complete workflows, not just API wrappers
- [ ] Tool names reflect natural task subdivisions
- [ ] Response formats optimize for agent context efficiency
- [ ] Human-readable identifiers used where appropriate
- [ ] Error messages guide agents toward correct usage

### Implementation
- [ ] Most important tools implemented
- [ ] All tools have descriptive names and documentation
- [ ] Proper annotations (readOnlyHint, etc.)
- [ ] Input validation with Pydantic/Zod
- [ ] Comprehensive docstrings with schemas
- [ ] Error handling for all external calls

### Code Quality
- [ ] Common functionality extracted (DRY)
- [ ] Async/await for all I/O
- [ ] Type hints/strict TypeScript throughout
- [ ] Pagination implemented where applicable
- [ ] CHARACTER_LIMIT respected with clear truncation
- [ ] Consistent response formats

### Testing
- [ ] Build completes successfully
- [ ] Sample tool calls work
- [ ] Evaluations created and passing

**Load language-specific guide for complete checklist.**
