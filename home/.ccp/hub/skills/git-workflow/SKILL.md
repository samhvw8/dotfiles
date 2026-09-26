---
name: git-workflow
description: "Sam's git conventions: split staged changes into atomic single-responsibility commits, conventional-commit messages, branch naming, and history cleanup without interactive commands. Use when committing (especially many files), writing commit messages, naming branches, preparing a PR, or squashing/rewriting history."
---

# Git Workflow & Best Practices

## Purpose

Comprehensive guide for git operations with emphasis on clean history, atomic commits, and professional workflows. Automatically analyzes staged changes and enforces single-responsibility principle.

## When to Use

Activate for any git operation:
- Committing changes (especially multiple files)
- Creating branches
- Merging or rebasing
- Managing git history
- Writing commit messages
- Organizing staging area
- Code review preparation
- Repository management

## Core Philosophy

### Single Responsibility Rule ⭐

Before committing, analyze staged changes and divide them into atomic commits.

**Process:**
1. Run `git status` to see all staged files
2. Identify different concerns/features
3. Unstage everything: `git reset HEAD`
4. Stage files by concern, one group at a time
5. Commit each group with focused message
6. Repeat until all changes are committed

**Why:** Makes history reviewable, revertable, and maintainable.

### Gate Before Commit

**Ask:** "If I need to revert only one of these changes tomorrow, can I?"

- **NO** → multiple concerns → split into separate commits
- **YES** → Proceed with single commit

**Common trap:** "All files are related to the same feature request" is NOT a valid reason to bundle. Each independently revertable change = separate commit.

---

## Commit Organization

### Analyzing Staged Changes

```bash
# Check what's staged
git status

# See file-level summary
git diff --cached --stat

# See detailed changes
git diff --cached

# Check specific file
git diff --cached path/to/file
```

### Grouping Strategies

**By Feature:**
- Auth system changes → one commit
- Payment module → separate commit
- User profile → another commit

**By Layer:**
- Database migrations → first commit
- Backend API → second commit
- Frontend UI → third commit
- Tests → fourth commit

**By Type:**
- New features (feat)
- Bug fixes (fix)
- Refactoring (refactor)
- Documentation (docs)
- Performance (perf)
- Tests (test)

**By Dependency:**
- Foundation/infrastructure first
- Features that depend on foundation second

### Division Workflow

```bash
# 1. Analyze current state
git status
git diff --cached --stat

# 2. Unstage everything
git reset HEAD

# 3. Stage first logical group
git add file1.ts file2.ts directory/

# 4. Verify what's staged
git diff --cached --stat

# 5. Commit with focused message
git commit -m "type: concise description"

# 6. Repeat steps 3-5 for remaining groups
```

### Example: Real Scenario

**Situation:** 29 files staged with mixed concerns

```bash
# Before - messy staging
$ git status
Changes to be committed:
  # Trading Styles feature (25 files)
  modified:   src/app/styles/page.tsx
  new file:   src/core/domain/models/TradingStyle.ts
  new file:   src/infrastructure/database/migrations/create_trading_styles.ts
  ...
  # History enhancements (4 files)
  modified:   src/app/history/page.tsx
  modified:   src/app/api/history/recommendations/route.ts
  ...
```

**Solution:**

```bash
# 1. Reset staging
git reset HEAD

# 2. Commit #1 - Trading Styles feature
git add \
  package.json pnpm-lock.yaml \
  src/app/styles/ \
  src/core/domain/models/TradingStyle.ts \
  src/core/ports/ITradingStyleRepository.ts \
  src/infrastructure/database/TradingStyleRepository.ts \
  src/infrastructure/database/migrations/create_trading_styles.ts

git commit -m "feat: add trading style persona system for AI-powered analysis"

# 3. Commit #2 - History enhancements
git add \
  src/app/history/page.tsx \
  src/app/api/history/recommendations/route.ts \
  src/infrastructure/database/TimeseriesRepository.ts \
  src/components/layout/AppLayout.tsx

git commit -m "feat: add search and filtering to history page"
```

**Result:** Clean, focused commits that are independently reviewable and revertable.

---

## Commit Messages

### Conventional Commits Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat` - New feature
- `fix` - Bug fix
- `refactor` - Code restructuring (no behavior change)
- `perf` - Performance improvement
- `docs` - Documentation only
- `style` - Formatting, whitespace, semicolons
- `test` - Adding/updating tests
- `chore` - Maintenance, dependencies
- `build` - Build system changes
- `ci` - CI/CD configuration
- `revert` - Revert previous commit

### Subject Line Rules

- Use imperative mood: "Add feature" not "Added feature"
- Start with lowercase (no capital first letter)
- No period at end
- 50 characters maximum
- Be specific and descriptive

### Body Guidelines

- Explain WHAT and WHY, not HOW
- Wrap at 72 characters
- Use bullet points for multiple changes
- Reference issue numbers: `Fixes #123`
- Include breaking changes

### Examples

**Good:**
```bash
git commit -m "$(cat <<'EOF'
feat: add trading style filtering to history page

Implemented comprehensive search and filtering:
- Multi-criteria filtering (action, type, risk, style)
- Partial symbol search with case-insensitive matching
- LEFT JOIN with trading_styles table
- Extended API with new query parameters

Fixes #456
EOF
)"
```

**Bad:**
```bash
git commit -m "Fixed stuff"
git commit -m "WIP"
git commit -m "Updated files"
```

---

## Branching Strategy

### Branch Naming

**Format:** `type/description-in-kebab-case`

**Types:**
- `feature/` - New features
- `fix/` - Bug fixes
- `refactor/` - Code improvements
- `docs/` - Documentation
- `test/` - Test additions
- `chore/` - Maintenance

**Examples:**
```bash
feature/trading-style-personas
fix/history-filter-bug
refactor/database-queries
docs/api-documentation
```

### Branch Workflow

```bash
# Create and switch to new branch
git checkout -b feature/new-feature

# Work on changes
git add ...
git commit -m "..."

# Keep branch updated with main
git fetch origin
git rebase origin/main

# Push to remote
git push origin feature/new-feature

# Create pull request (via GitHub/GitLab UI)
```

---

## Staging Operations

### Selective Staging

```bash
# Stage specific files
git add file1.ts file2.ts

# Stage entire directory
git add src/features/

# Stage all changes
git add .

# Stage by file extension
git add *.ts
```

### Staging Part of a File

Interactive commands (`git add -p`, `git add -i`) don't work in this harness. To stage only some hunks, write them to a patch and apply it to the index:

```bash
git diff path/to/file > /tmp/all.patch   # edit down to the hunks you want
git apply --cached /tmp/part.patch
```

### Unstaging

```bash
# Unstage all files
git reset HEAD

# Unstage specific file
git restore --staged file.ts

# Unstage directory
git restore --staged src/features/
```

---

## History Management

### Amending Commits

```bash
# Add forgotten files to last commit
git add forgotten-file.ts
git commit --amend --no-edit

# Change last commit message
git commit --amend -m "new message"
```

**⚠️ Warning:** Only amend commits that haven't been pushed!

### Squashing and Rewriting (non-interactive)

`git rebase -i` needs an editor and doesn't work in this harness. Before pushing:

```bash
# Squash the last 3 commits into one
git reset --soft HEAD~3
git commit -m "type: combined message"

# Fold a fix into an earlier commit
git commit --fixup <hash>
git rebase --autosquash <hash>~1   # git 2.44+ autosquashes without -i
```

---

## Pull Requests

### Pull Request Workflow

```bash
# 1. Update local main
git checkout main
git pull origin main

# 2. Create feature branch
git checkout -b feature/new-feature

# 3. Make changes and commit atomically
# (following single-responsibility rule)

# 4. Keep branch updated
git fetch origin
git rebase origin/main

# 5. Push to remote
git push origin feature/new-feature

# 6. Create PR via GitHub/GitLab UI

# 7. Address review feedback
git add .
git commit -m "fix: address review comments"
git push origin feature/new-feature

# 8. After PR merged, clean up
git checkout main
git pull origin main
git branch -d feature/new-feature
```

---

## Recovery

Find the lost commit with `git reflog`, then recover it onto a new branch — `git branch recovered <hash>` — rather than `git reset --hard <hash>`, which also discards uncommitted work in the tree.

---

## Best Practices Checklist

### Before Committing

- [ ] Run `git status` to analyze staged files
- [ ] **⛔ GATE:** "Can I revert ONLY ONE change independently?" If NO → split commits
- [ ] Group changes by single responsibility
- [ ] Unstage unrelated files
- [ ] Stage only related files together
- [ ] Review `git diff --cached` before committing
- [ ] Write clear, descriptive commit message
- [ ] Follow conventional commit format
- [ ] Ensure code builds successfully
- [ ] Run tests if applicable
- [ ] Verify commit is independently reviewable

### Branch Management

- [ ] Use descriptive branch names
- [ ] Keep branches short-lived
- [ ] Rebase regularly with main
- [ ] Delete merged branches
- [ ] Don't commit directly to main

### Commit Quality

- [ ] Atomic commits (one concern per commit)
- [ ] Meaningful commit messages
- [ ] No WIP or "fix stuff" messages
- [ ] No commented-out code in commits
- [ ] No generated files (unless necessary)
- [ ] No secrets or credentials

### Code Review

- [ ] Small, focused pull requests
- [ ] Descriptive PR title and description
- [ ] Reference related issues
- [ ] Self-review before requesting review
- [ ] Address all review comments
- [ ] Keep commits clean during review

---

## Anti-Patterns to Avoid

### ❌ Giant Mixed Commits
```bash
git add .
git commit -m "various changes"
```
**Problem:** Impossible to review, revert, or understand

**Fix:** Divide into atomic commits by concern

### ❌ "Related" Bundling
```bash
# Multiple features bundled because "they're all for the same task"
git add src/components/Form.tsx src/components/PDFExport.tsx src/types/ src/config/
git commit -m "feat: add form and PDF export with new field types"
```
**Problem:** "Related to same request" ≠ "Same commit". Cannot revert PDF without losing Form.

**Test:** Can you revert just ONE of these features independently? No? Split it.

**Fix:**
```bash
git add src/config/ src/types/
git commit -m "feat: add field mapping configuration"

git add src/components/Form.tsx
git commit -m "feat: add editable form component"

git add src/components/PDFExport.tsx
git commit -m "feat: add PDF export with bank-style layout"
```

### ❌ Committing Directly to Main
```bash
git checkout main
git commit -m "quick fix"
git push
```
**Problem:** Bypasses code review, risky

**Fix:** Always use feature branches

### ❌ Force Push to Shared Branches
```bash
git push --force origin main
```
**Problem:** Destroys others' work, breaks history

**Fix:** Use `--force-with-lease` and only on your branches

### ❌ Large Binary Files
```bash
git add large-video.mp4
git commit -m "add video"
```
**Problem:** Bloats repository size forever

**Fix:** Use Git LFS or external storage

### ❌ Committing Secrets
```bash
git add .env
git commit -m "add config"
```
**Problem:** Security vulnerability, hard to remove

**Fix:** Use .gitignore, environment variables, secrets management

### ❌ Meaningless Messages
```bash
git commit -m "fix"
git commit -m "update"
git commit -m "wip"
```
**Problem:** History is useless for debugging

**Fix:** Write descriptive, specific commit messages

---

