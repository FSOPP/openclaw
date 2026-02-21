<!--
  Sync Impact Report
  ==================
  Version change: N/A → 1.0.0 (initial ratification)
  Modified principles: N/A (initial)
  Added sections:
    - Core Principles (7 principles)
    - Additional Constraints
    - Development Workflow
    - Governance
  Removed sections: N/A
  Templates requiring updates:
    - .specify/templates/plan-template.md ✅ aligned (Constitution Check section present)
    - .specify/templates/spec-template.md ✅ aligned (requirements & testing sections present)
    - .specify/templates/tasks-template.md ✅ aligned (phased task structure present)
  Follow-up TODOs: none
-->

# OpenClaw Constitution

## Core Principles

### I. TypeScript-First with Strict Typing

All source code MUST be written in TypeScript (ESM). Contributors MUST NOT use
`any` types, `@ts-nocheck` directives, or disable `no-explicit-any` lint rules.
Root causes MUST be fixed rather than suppressed. Oxlint and Oxfmt configuration
changes require explicit justification and approval.

**Rationale**: Strict typing prevents entire categories of runtime errors, enables
reliable refactoring across a large codebase, and ensures tooling (IDE, linting,
CI) provides accurate feedback.

### II. Extension Architecture

Every integration MUST be built as a plugin/extension under `extensions/` using
the OpenClaw Plugin SDK (`openclaw/plugin-sdk`). Extensions MUST keep their own
dependencies in their `package.json`; they MUST NOT add extension-only deps to
the root `package.json`. Runtime deps MUST live in `dependencies` (not
`devDependencies`). The `workspace:*` protocol MUST NOT appear in extension
`dependencies` blocks.

**Rationale**: A clean extension boundary keeps the core lightweight, allows
independent versioning and deployment of integrations, and prevents dependency
conflicts between unrelated channels.

### III. Test Discipline

All features MUST be accompanied by tests. The project uses Vitest with V8
coverage thresholds enforced at 70% for lines, branches, functions, and
statements. Test files MUST be colocated with source (`*.test.ts`); end-to-end
tests use `*.e2e.test.ts`. Contributors MUST run `pnpm test` before pushing
when touching logic. Per-instance stubs are preferred over prototype mutation
in tests.

**Rationale**: Coverage thresholds prevent regression drift. Colocated tests
keep context close to implementation and reduce discovery friction.

### IV. Multi-Channel Parity

When modifying shared logic (routing, allowlists, pairing, command gating,
onboarding, documentation), contributors MUST consider ALL built-in channels
AND extension channels. Channel additions MUST update every relevant UI surface
(macOS app, web UI, mobile if applicable), onboarding/overview docs, status and
configuration forms, and `.github/labeler.yml` with matching GitHub labels.

**Rationale**: OpenClaw's value is cross-channel reach. Partial channel support
degrades the user experience and creates hidden incompatibilities.

### V. Security and Privacy

Real phone numbers, videos, API keys, tokens, or live configuration values MUST
NEVER be committed. Tests, docs, and examples MUST use obviously fake
placeholders. Web provider credentials are stored at `~/.openclaw/credentials/`
and MUST NOT be logged or transmitted outside the local machine. Patching
dependencies (pnpm patches, overrides, vendored changes) requires explicit
maintainer approval.

**Rationale**: A single leaked credential or PII value can compromise users and
erode trust. Explicit approval for dependency patches prevents supply-chain
risk.

### VI. Code Quality Gates

All code MUST pass the following gates before merge: `pnpm build` (type-check
and compile), `pnpm check` (Oxlint + Oxfmt), and `pnpm test`. Pre-commit hooks
(`prek install`) enforce the same checks as CI. Files SHOULD be kept under
~500 LOC; extract helpers rather than creating "V2" copies. Class behavior
MUST NOT be shared via prototype mutation; use explicit
inheritance/composition. Brief code comments are required for tricky or
non-obvious logic.

**Rationale**: Automated gates catch errors before review. LOC limits and
composition rules keep the codebase navigable and type-safe.

### VII. Release Governance

The project maintains three release channels: **stable** (tagged `vYYYY.M.D`,
npm dist-tag `latest`), **beta** (tagged `vYYYY.M.D-beta.N`, npm dist-tag
`beta`), and **dev** (moving head on `main`). Version numbers MUST NOT be
changed without the operator's explicit consent. All release and publish steps
require maintainer approval. The changelog MUST contain user-facing changes
only; internal/meta notes are excluded.

**Rationale**: Clear release channels let users choose their risk tolerance.
Operator consent prevents accidental version bumps from CI or automated
tooling.

## Additional Constraints

- **Runtime baseline**: Node 22+ is required. Both pnpm and Bun execution
  paths MUST be kept working.
- **Dependency management**: Any dependency with `pnpm.patchedDependencies`
  MUST use an exact version (no `^`/`~`). The Carbon dependency MUST NOT
  be updated.
- **CLI patterns**: Progress indicators MUST use `src/cli/progress.ts`
  (`osc-progress` + `@clack/prompts` spinner). Status output MUST use
  `src/terminal/table.ts` for tables and ANSI-safe wrapping.
- **Tool schema guardrails**: `Type.Union` MUST NOT be used in tool input
  schemas; no `anyOf`/`oneOf`/`allOf`. Use `stringEnum`/`optionalStringEnum`
  for string lists. The raw `format` property name MUST be avoided in tool
  schemas.
- **Multi-agent safety**: Agents MUST NOT create/apply/drop `git stash`
  entries, create/remove/modify `git worktree` checkouts, or switch branches
  unless explicitly requested. Commits MUST be scoped to the agent's own
  changes.

## Development Workflow

- **Commit convention**: Use `scripts/committer "<msg>" <file...>` for atomic,
  scoped commits. Messages follow concise, action-oriented Conventional Commit
  style (e.g., `CLI: add verbose flag to send`).
- **PR process**: One concern per PR. Run `pnpm build && pnpm check && pnpm test`
  before submission. AI-assisted PRs MUST be marked and include testing status.
- **Code review**: All PRs require maintainer review. Complexity MUST be
  justified. The PR template at `.github/pull_request_template.md` is
  canonical.
- **Documentation**: Docs are Mintlify-hosted at `docs.openclaw.ai`. Internal
  doc links MUST be root-relative without `.md`/`.mdx` extensions. Headings
  MUST avoid em dashes and apostrophes (breaks Mintlify anchors). Docs content
  MUST be generic — no personal device names, hostnames, or paths.
- **Formatting/lint churn**: Formatting-only diffs MUST be auto-resolved
  without user confirmation. Semantic (logic/data/behavior) changes require
  explicit approval.

## Governance

This constitution is the authoritative governance document for the OpenClaw
project. All pull requests, code reviews, and architectural decisions MUST
verify compliance with these principles.

**Amendment procedure**: Amendments require documentation of the change,
maintainer approval, and a migration plan for any affected code or workflows.
Version increments follow semantic versioning:

- **MAJOR**: Backward-incompatible principle removals or redefinitions.
- **MINOR**: New principle/section added or materially expanded guidance.
- **PATCH**: Clarifications, wording, typo fixes, non-semantic refinements.

**Compliance review**: Every PR review MUST include a constitution compliance
check. The `plan-template.md` Constitution Check gate enforces this at the
design phase. Violations MUST be resolved before merge unless explicitly
waived by a maintainer with documented rationale.

**Runtime guidance**: See `AGENTS.md` at the repository root for detailed
development guidance, troubleshooting, and agent-specific operational notes.

**Version**: 1.0.0 | **Ratified**: 2026-02-20 | **Last Amended**: 2026-02-20
