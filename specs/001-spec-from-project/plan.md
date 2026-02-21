# Implementation Plan: Spec from Project — Reverse-Engineer Specs from Existing Codebases

**Branch**: `001-spec-from-project` | **Date**: 2026-02-21 | **Spec**: [/specs/001-spec-from-project/spec.md](/specs/001-spec-from-project/spec.md)
**Input**: Feature specification from `/specs/001-spec-from-project/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Add `/speckit.discover` as a first-class speckit workflow that reverse-engineers
an existing project into a fully populated `spec.md`. The approach is tiered:
read manifests/docs in full, scan tree, map public API surface, sample source,
and generate strictly evidenced requirements/scenarios with secret redaction,
overwrite confirmation, and conditional interactive clarification only when
ambiguities remain.

## Technical Context

**Language/Version**: TypeScript (ESM) + Bash scripts, Node >=22.12.0  
**Primary Dependencies**: Existing speckit agent/prompt flow, `@clack/prompts`, `osc-progress`, `commander`, filesystem tooling in `.specify/scripts/bash/common.sh`  
**Storage**: Filesystem only (`specs/<branch>/spec.md` and Phase 0/1 artifacts)  
**Testing**: Vitest (`pnpm test`), type/lint gates (`pnpm tsgo`, `pnpm check`) plus targeted script behavior checks  
**Target Platform**: VS Code Copilot Chat workflow on Linux/macOS/Windows dev environments
**Project Type**: Monorepo CLI + prompt-agent workflow  
**Performance Goals**: Complete typical project discovery under 5 minutes (SC-001) with phase progress feedback  
**Constraints**: Max 3 clarification markers; strict evidence per generated scenario/requirement (FR-015); redact secrets (FR-013); explicit overwrite confirmation (FR-009); default non-interactive unless ambiguities exist (FR-016)  
**Scale/Scope**: Whole-repo or scoped subdirectory analysis; must handle very large trees using tiered scanning + representative sampling

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- **I. TypeScript-First with Strict Typing**: PASS. Planned changes stay in
  existing TypeScript/agent/script surfaces; no `any`/suppression required.
- **II. Extension Architecture**: PASS (N/A). Feature is speckit workflow and
  scripts; no extension-boundary changes.
- **III. Test Discipline**: PASS with action. Add/adjust tests for discover
  setup/behavior as part of implementation tasks; run `pnpm test` before merge.
- **IV. Multi-Channel Parity**: PASS (N/A). No channel routing/gating changes.
- **V. Security and Privacy**: PASS. Design mandates secret redaction in output
  artifacts/log summaries and disallows raw secret leakage.
- **VI. Code Quality Gates**: PASS. Implementation must satisfy `pnpm build`,
  `pnpm check`, and `pnpm test`.
- **VII. Release Governance**: PASS. No version/publish work in scope.

**Gate Result (pre-Phase-0)**: PASS

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
.github/
├── agents/
│   └── speckit.discover.agent.md
└── prompts/
  └── speckit.discover.prompt.md

.specify/
├── scripts/bash/
│   ├── common.sh
│   ├── setup-discover.sh
│   └── update-agent-context.sh
└── templates/
  └── spec-template.md

src/
├── cli/
│   └── progress.ts
└── logging/
  └── redact.ts

specs/001-spec-from-project/
└── contracts/
  ├── discover-contracts.md
  ├── setup-discover-cli.md
  └── spec-output-format.md
```

**Structure Decision**: Use the existing speckit command architecture (prompt +
agent mode + setup script). Keep implementation concentrated in
`.github/agents/`, `.github/prompts/`, and `.specify/scripts/bash/`, while
reusing shared CLI progress and redaction utilities from `src/`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --------- | ---------- | ------------------------------------ |
| None      | N/A        | N/A                                  |

## Post-Design Constitution Check

- **I. TypeScript-First with Strict Typing**: PASS. Data model/contracts use
  typed structures and no rule suppression.
- **II. Extension Architecture**: PASS (N/A). No extension dependency drift.
- **III. Test Discipline**: PASS with implementation follow-through required in
  `/speckit.tasks` (unit + integration checks for discover flow).
- **IV. Multi-Channel Parity**: PASS (N/A).
- **V. Security and Privacy**: PASS. Redaction is explicit in FR-013 and
  represented in data model/contracts.
- **VI. Code Quality Gates**: PASS. Plan preserves standard build/lint/test
  gates and shared utility reuse.
- **VII. Release Governance**: PASS. No release workflow changes.

**Gate Result (post-Phase-1)**: PASS
