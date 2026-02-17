# Task Completion Checklist

## Before Committing / Pushing

1. **Lint + Format**: Run `pnpm check` (runs format:check + tsgo + lint)
   - Or separately: `pnpm format:check` and `pnpm lint`
   - Fix issues: `pnpm lint:fix` (auto-fixes lint + reformats)

2. **Type-check**: Run `pnpm tsgo` (TypeScript native preview)

3. **Tests**: Run `pnpm test` (or `pnpm test:fast` for unit-only)
   - If touching logic, run `pnpm test:coverage` to verify 70% threshold

4. **File size check**: `pnpm check:loc` (files should stay under ~500 LOC)

5. **Commit scoped**: Use `scripts/committer "<msg>" <file...>` for scoped commits
   - Follow concise, action-oriented commit messages: e.g. `CLI: add verbose flag to send`
   - Group related changes; avoid bundling unrelated refactors

## Before PR Submission
- Reference `.github/pull_request_template.md` for PR template
- Ensure CI checks pass (build + check + test)
- Keep PRs focused (one thing per PR)
- Protocol check if touching protocol: `pnpm protocol:check`

## Before Release
- Run `node --import tsx scripts/release-check.ts`
- Run `pnpm release:check`
- Run `pnpm test:install:smoke`

## Pre-commit Hook (automatic)
The git pre-commit hook automatically:
1. Filters staged files
2. Runs `oxlint --type-aware --fix` on lint-eligible files
3. Runs `oxfmt --write` on format-eligible files
4. Re-stages modified files
