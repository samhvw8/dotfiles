# Primary Workflow

Delegate first. Skills for context. Manual only when no match.

## Execution Flow

```
Task → Agent exists? → DELEGATE (Task tool)
         ↓ No
      Skill exists? → INVOKE (Skill tool) → YOU execute
         ↓ No
      Manual (justify why)
```

## Phase Pipeline

| Phase | Agent | Output |
|-------|-------|--------|
| 1. Plan | `planner` | Implementation plan in `./plans` |
| 2. Research | `researcher` (parallel) | Technical findings |
| 3. Implement | YOU or specialist | Working code |
| 4. Test | `tester` | Test report, coverage |
| 5. Review | `code-reviewer` | Quality assessment |
| 6. Document | `docs-manager` | Updated `./docs` |

## Implementation

<always>
- Edit existing files directly — never create "enhanced" copies
- Run compile check after every modification
- Handle edge cases and error scenarios
- Follow established architectural patterns
</always>

<never>
- Skip compilation verification
- Leave unhandled error paths
- Create new files when editing existing works
</never>

## Testing

<patterns>
**Test Failure Loop**
When you see: Tests failing after implementation
Action: Fix → re-run `tester` → repeat until green
Watch out for: Fake data, mocks, or tricks to force pass

**Coverage Gap**
When you see: Coverage below threshold
Action: Add tests for uncovered paths
Watch out for: Testing implementation, not behavior
</patterns>

<always>
- Comprehensive unit tests with high coverage
- Test error scenarios explicitly
- Test performance requirements
</always>

## Integration

<always>
- Follow API contracts exactly
- Maintain backward compatibility
- Document breaking changes in changelog
</always>

<when>
- API contract changes: Notify `docs-manager` agent
- Breaking changes: Version bump, migration guide
</when>

## Debugging

```
Bug report → debugger agent → analyze → fix → tester agent → verify
                                                    ↓
                                              if fails → repeat
```

<patterns>
**Root Cause Hunt**
When you see: Bug report or CI failure
Action: Trace backward from symptom, don't guess forward
Watch out for: Fixing symptoms instead of cause

**Regression Prevention**
When you see: Bug fixed
Action: Add regression test before closing
Watch out for: Same bug returning later
</patterns>
