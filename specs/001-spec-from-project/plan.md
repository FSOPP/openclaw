# Implementation Plan: Spec from Project — Reverse-Engineer Specs from Existing Codebases

**Branch**: `001-spec-from-project` | **Date**: 2026-02-20 | **Spec**: [spec.md](specs/001-spec-from-project/spec.md)
**Input**: Feature specification from `/specs/001-spec-from-project/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Add a `/speckit.discover` command that analyzes an existing codebase (file tree,
manifests, READMEs, entry points, source samples) and synthesizes a populated
`spec.md` — capturing the project's purpose, user scenarios, functional
requirements, key entities, and success criteria. The command runs entirely within
the host AI agent session (no external LLM API), outputs to the standard
`specs/<branch>/spec.md` location, and supports scoping to a subdirectory for
monorepo use. An optional interactive refinement step resolves any
`[NEEDS CLARIFICATION]` markers.

## Technical Context

**Language/Version**: TypeScript (ESM), Node 22+, Bun-compatible  
**Primary Dependencies**: `@clack/prompts` (spinner/progress), `osc-progress`,
existing speckit shell scripts (`.specify/scripts/bash/*`), spec template
(`.specify/templates/spec-template.md`)  
**Storage**: File system only — reads target project files, writes `spec.md` to
`specs/<branch>/` directory  
**Testing**: Vitest with V8 coverage thresholds (70% lines/branches/functions/statements)  
**Target Platform**: CLI — runs wherever `openclaw` runs (Linux, macOS, Windows via Node/Bun)  
**Project Type**: Single project (extends existing speckit tooling)  
**Performance Goals**: Complete analysis + spec generation in <5 minutes wall-clock
for typical projects (per SC-001); handle large projects (thousands of files) via
sampling/prioritization  
**Constraints**: Must stay within AI agent context window limits; tiered analysis
strategy (manifest → tree → API surface → sampled files) balances accuracy vs.
token budget. Maximum 3 `[NEEDS CLARIFICATION]` markers per generated spec.  
**Scale/Scope**: Target projects ranging from small single-package repos to large
monorepos with dozens of modules. MVP rich parsing for Node.js/TypeScript only;
other languages via best-effort inference.

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| #   | Principle                           | Status  | Notes                                                                                                      |
| --- | ----------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------- |
| I   | TypeScript-First with Strict Typing | ✅ PASS | All new code is TypeScript ESM. No `any`, no `@ts-nocheck`.                                                |
| II  | Extension Architecture              | ✅ PASS | This is a core speckit command (prompt file + shell script), not an extension. No extension deps affected. |
| III | Test Discipline                     | ✅ PASS | Colocated `*.test.ts` files planned. Vitest coverage thresholds apply.                                     |
| IV  | Multi-Channel Parity                | ✅ N/A  | Feature is a developer-facing CLI/agent command, not a messaging channel feature.                          |
| V   | Security and Privacy                | ✅ PASS | No credentials handled. Reads local project files only. No external API calls.                             |
| VI  | Code Quality Gates                  | ✅ PASS | Must pass `pnpm build`, `pnpm check`, `pnpm test`. Files kept under ~500 LOC.                              |
| VII | Release Governance                  | ✅ PASS | No version changes. Feature ships as a new prompt file + supporting script; no npm publish required.       |

**Additional Constraints Check**:

- CLI progress: Will use `src/cli/progress.ts` spinners ✅
- Tool schema guardrails: N/A (no tool schemas) ✅
- Multi-agent safety: No git stash/worktree/branch switching ✅

**Gate Result**: ✅ ALL PASS — proceed to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/001-spec-from-project/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
.github/prompts/
└── speckit.discover.prompt.md    # New prompt file defining the /speckit.discover agent

.specify/
├── scripts/bash/
│   └── setup-discover.sh         # New setup script for discover command
└── templates/
    └── spec-template.md          # Existing — used as output format (no changes)

src/                              # No new source files in src/ for MVP
```

**Structure Decision**: This feature follows the existing speckit command pattern —
a prompt file (`.github/prompts/speckit.discover.prompt.md`) that defines the
agent mode, paired with a setup shell script
(`.specify/scripts/bash/setup-discover.sh`) for directory resolution and
validation. The spec generation logic lives entirely in the prompt instructions
(executed by the host AI agent), mirroring how `/speckit.specify` and
`/speckit.clarify` operate. No new TypeScript source files are needed in `src/`
for MVP — the agent uses existing workspace tools (file reads, directory listing,
terminal commands) to analyze the target project.

## Constitution Re-Check (Post-Design)

_Re-evaluated after Phase 1 design artifacts were produced._

| #   | Principle              | Status  | Post-Design Notes                                                                 |
| --- | ---------------------- | ------- | --------------------------------------------------------------------------------- |
| I   | TypeScript-First       | ✅ PASS | No new TS source files in MVP. Shell script follows existing pattern.             |
| II  | Extension Architecture | ✅ PASS | Core command — no extension deps introduced.                                      |
| III | Test Discipline        | ✅ PASS | Shell script testable via existing patterns. Agent prompt tested via integration. |
| IV  | Multi-Channel Parity   | ✅ N/A  | Developer-facing CLI/agent tooling only.                                          |
| V   | Security and Privacy   | ✅ PASS | Reads local files only. No credentials, tokens, or PII.                           |
| VI  | Code Quality Gates     | ✅ PASS | Shell script <100 LOC. Prompt file is a stub. No new build artifacts.             |
| VII | Release Governance     | ✅ PASS | No version bumps. No npm publish.                                                 |

**Post-Design Gate Result**: ✅ ALL PASS — ready for `/speckit.tasks`.

## Complexity Tracking

> No constitution violations. No complexity justifications needed.
