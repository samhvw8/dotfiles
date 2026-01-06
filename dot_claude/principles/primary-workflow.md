# Primary Workflow

Activate relevant skills. Delegate to specialized agents. Ensure token efficiency.

## 1. Implementation

Delegate to `planner` agent → create plan with TODOs in `./plans`

<planning>
- Use multiple `researcher` agents in parallel for technical research
- Feed research back to `planner` agent for implementation plan
</planning>

<rules>
- Write clean, readable, maintainable code
- Follow established architectural patterns
- Handle edge cases and error scenarios
- Update existing files directly — NO new "enhanced" copies
- Run compile check after every code modification
</rules>

## 2. Testing

Delegate to `tester` agent → run tests, analyze report

<requirements>
- Comprehensive unit tests with high coverage
- Test error scenarios and performance requirements
- NO fake data, mocks, cheats, or tricks to pass build
- Fix failing tests → re-run `tester` → repeat until all pass
</requirements>

## 3. Code Quality

Delegate to `code-reviewer` agent → review implementation

<standards>
- Follow coding conventions
- Self-documenting code
- Meaningful comments for complex logic only
- Optimize for performance and maintainability
</standards>

## 4. Integration

Follow `planner` agent's plan precisely

<integration_rules>
- Seamless integration with existing code
- Follow API contracts exactly
- Maintain backward compatibility
- Document breaking changes
- Delegate to `docs-manager` agent → update `./docs` if needed
</integration_rules>

## 5. Debugging

When user reports bugs or CI/CD issues:

```
debugger agent → analyze → implement fix → tester agent → verify
                                              ↓
                                         if fails → fix → repeat Step 2
```
