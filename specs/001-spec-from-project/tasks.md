# Tasks: Spec from Project — `/speckit.discover`

**Input**: Design documents from `/specs/001-spec-from-project/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Include targeted tests because the plan requires Vitest/script behavior validation for discover flow.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish discover command scaffolding and documentation stubs used by all stories

- [x] T001 Create prompt front matter for discover in `.github/prompts/speckit.discover.prompt.md`
- [x] T002 Create discover agent instruction shell in `.github/agents/speckit.discover.agent.md`
- [x] T003 Create setup script skeleton for discover in `.specify/scripts/bash/setup-discover.sh`
- [x] T004 [P] Register discover mode in `.specify/scripts/bash/update-agent-context.sh`
- [x] T005 [P] Add discover contracts index entry in `specs/001-spec-from-project/contracts/README.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Implement core setup, safety, and validation primitives required before story work

**⚠️ CRITICAL**: No user story implementation starts until this phase is complete

- [x] T006 Implement argument parsing (`--json`, `--help`, optional target path) in `.specify/scripts/bash/setup-discover.sh`
- [x] T007 Implement feature/repo path resolution via `common.sh` helpers in `.specify/scripts/bash/setup-discover.sh`
- [x] T008 Implement target directory existence/readability validation in `.specify/scripts/bash/setup-discover.sh`
- [x] T009 Implement discover setup JSON/text output contract fields in `.specify/scripts/bash/setup-discover.sh`
- [x] T010 Implement existing spec overwrite detection (`SPEC_EXISTS`) in `.specify/scripts/bash/setup-discover.sh`
- [x] T011 [P] Implement setup-script stderr warnings/error exit behavior in `.specify/scripts/bash/setup-discover.sh`
- [x] T012 [P] Add executable bit and usage text checks in `test/specify/setup-discover-cli.test.ts`
- [x] T013 Add setup script contract assertions (JSON schema + exit codes) in `test/specify/setup-discover-cli.test.ts`

**Checkpoint**: `setup-discover.sh --json` returns valid contract output and failures are deterministic.

---

## Phase 3: User Story 1 — Generate a Spec from an Existing Project (Priority: P1) 🎯 MVP

**Goal**: Generate a complete `spec.md` from an existing project with strict evidence and redaction guarantees

**Independent Test**: Run discover on a fixture project with README + source + manifest and confirm populated mandatory sections with zero template placeholders.

### Tests for User Story 1

- [x] T014 [P] [US1] Add integration fixture for discover baseline project in `test/fixtures/speckit/discover-basic/README.md`
- [x] T015 [P] [US1] Add discover generation integration test for mandatory sections in `test/specify/discover-generate.test.ts`
- [x] T016 [P] [US1] Add evidence-required test (omit unsupported items) in `test/specify/discover-evidence.test.ts`
- [x] T017 [P] [US1] Add secret-redaction regression test for output snippets in `test/specify/discover-redaction.test.ts`

### Implementation for User Story 1

- [x] T018 [US1] Implement Phase 0 setup/overwrite-confirm workflow in `.github/agents/speckit.discover.agent.md`
- [x] T019 [US1] Implement Phase 1 manifest+README full-read workflow in `.github/agents/speckit.discover.agent.md`
- [x] T020 [US1] Implement Phase 2 scoped directory scan workflow in `.github/agents/speckit.discover.agent.md`
- [x] T021 [US1] Implement Phase 3 public API/entry-point mapping workflow in `.github/agents/speckit.discover.agent.md`
- [x] T022 [US1] Implement Phase 4 representative source sampling workflow in `.github/agents/speckit.discover.agent.md`
- [x] T023 [US1] Implement Phase 5 spec synthesis and write-to-`SPEC_FILE` workflow in `.github/agents/speckit.discover.agent.md`
- [x] T024 [US1] Implement strict evidence attachment/omission rules in `.github/agents/speckit.discover.agent.md`
- [x] T025 [US1] Implement secret redaction requirements for snippets/summaries in `.github/agents/speckit.discover.agent.md`
- [x] T026 [US1] Implement structured phase progress and completion summary output in `.github/agents/speckit.discover.agent.md`
- [x] T027 [US1] Implement quality gates (mandatory sections, marker cap, placeholder ban) in `.github/agents/speckit.discover.agent.md`

**Checkpoint**: US1 produces a complete, evidence-backed, redacted spec for a typical project in one run.

---

## Phase 4: User Story 2 — Scope Analysis to a Subdirectory or Module (Priority: P2)

**Goal**: Generate a spec for only the requested module/subdirectory without unrelated monorepo leakage

**Independent Test**: Run discover on a monorepo fixture with `TARGET_PATH` set to one package and verify output includes only that package scope plus dependency assumptions.

### Tests for User Story 2

- [x] T028 [P] [US2] Add monorepo scoped fixture with multiple packages in `test/fixtures/speckit/discover-monorepo/README.md`
- [x] T029 [P] [US2] Add scoped-analysis isolation test (no unrelated scenarios/FRs) in `test/specify/discover-scope.test.ts`
- [x] T030 [P] [US2] Add dependency-assumption test for shared parent modules in `test/specify/discover-scope-deps.test.ts`

### Implementation for User Story 2

- [x] T031 [US2] Implement subdirectory scoping rules for all analysis phases in `.github/agents/speckit.discover.agent.md`
- [x] T032 [US2] Implement scoped-module naming/title behavior in generated header rules in `.github/agents/speckit.discover.agent.md`
- [x] T033 [US2] Implement cross-package dependency assumption capture for scoped runs in `.github/agents/speckit.discover.agent.md`
- [x] T034 [US2] Implement relative/absolute path normalization edge cases for scoped targets in `.specify/scripts/bash/setup-discover.sh`

**Checkpoint**: US2 outputs are strictly scoped to target module and remain independently valid.

---

## Phase 5: User Story 3 — Interactive Refinement of Generated Spec (Priority: P3)

**Goal**: Resolve `[NEEDS CLARIFICATION]` markers interactively and finalize spec content in place

**Independent Test**: Run discover on an ambiguous fixture, answer prompts, and verify markers are replaced with user-confirmed content in `spec.md`.

### Tests for User Story 3

- [x] T035 [P] [US3] Add clarification-marker fixture for ambiguous project signals in `test/fixtures/speckit/discover-ambiguous/README.md`
- [x] T036 [P] [US3] Add interactive refinement flow test for marker prompts in `test/specify/discover-refine.test.ts`
- [x] T037 [P] [US3] Add no-marker fast-path test (no prompt required) in `test/specify/discover-refine-noop.test.ts`

### Implementation for User Story 3

- [x] T038 [US3] Implement post-generation marker detection and refinement trigger in `.github/agents/speckit.discover.agent.md`
- [x] T039 [US3] Implement per-marker question flow with suggested options and freeform answer handling in `.github/agents/speckit.discover.agent.md`
- [x] T040 [US3] Implement in-place marker replacement and final validation pass in `.github/agents/speckit.discover.agent.md`
- [x] T041 [US3] Implement refinement completion summary (resolved markers and sections touched) in `.github/agents/speckit.discover.agent.md`

**Checkpoint**: US3 resolves ambiguities interactively while preserving template validity constraints.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final consistency, docs, and quickstart validation across all stories

- [x] T042 [P] Add edge-case handling instructions for empty/unreadable targets in `.github/agents/speckit.discover.agent.md`
- [x] T043 [P] Add large-repo sampling/timeout guardrails in `.github/agents/speckit.discover.agent.md`
- [x] T044 [P] Add unsupported-language fallback assumptions guidance in `.github/agents/speckit.discover.agent.md`
- [x] T045 Update discover usage and scoped examples in `docs/tools/speckit.md`
- [x] T046 Run quickstart validation checklist documented in `specs/001-spec-from-project/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies; starts immediately.
- **Phase 2 (Foundational)**: Depends on Phase 1; blocks all story implementation.
- **Phase 3 (US1)**: Depends on Phase 2; defines MVP and must complete before US3.
- **Phase 4 (US2)**: Depends on Phase 2; can run in parallel with/after US1.
- **Phase 5 (US3)**: Depends on Phase 3 because refinement requires generated markers/spec output.
- **Phase 6 (Polish)**: Depends on completion of targeted stories (US1 minimum; ideally US1+US2+US3).

### User Story Dependencies

- **US1 (P1)**: Independent after foundational work.
- **US2 (P2)**: Independent after foundational work; integrates best with US1 output expectations.
- **US3 (P3)**: Requires US1 generation pipeline to exist first.

### Parallel Opportunities

- **Setup**: T004 and T005 can run in parallel with T001-T003.
- **Foundational**: T011 and T012 can run in parallel after core parser/output tasks begin.
- **US1**: T014-T017 can run in parallel; T024-T027 follow core phase implementation.
- **US2**: T028-T030 can run in parallel; T031-T033 run before T034 final path normalization pass.
- **US3**: T035-T037 can run in parallel; T038-T041 execute sequentially.
- **Polish**: T042-T044 can run in parallel.

---

## Parallel Example: User Story 1

```bash
# Parallel test authoring (different files)
Task T015 in test/specify/discover-generate.test.ts
Task T016 in test/specify/discover-evidence.test.ts
Task T017 in test/specify/discover-redaction.test.ts

# Parallel analysis-phase authoring (same story, ordered by dependencies)
Task T019 manifest/docs phase
Task T020 tree scan phase
Task T021 API surface phase
Task T022 source sampling phase
```

## Parallel Example: User Story 2

```bash
# Parallel scoped-run tests
Task T029 in test/specify/discover-scope.test.ts
Task T030 in test/specify/discover-scope-deps.test.ts

# Parallel implementation blocks before script normalization
Task T031 phase scoping rules
Task T032 scoped header rules
Task T033 shared dependency assumptions
```

## Parallel Example: User Story 3

```bash
# Parallel refinement tests
Task T036 in test/specify/discover-refine.test.ts
Task T037 in test/specify/discover-refine-noop.test.ts

# Sequential runtime refinement behavior
Task T038 marker detection -> T039 prompt flow -> T040 replace+validate -> T041 summary
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 and Phase 2 to stabilize setup contract.
2. Complete Phase 3 (US1) and validate against the basic fixture.
3. Demo/ship MVP once US1 independent test passes.

### Incremental Delivery

1. Deliver US1 (core generation).
2. Deliver US2 (scoped monorepo analysis).
3. Deliver US3 (interactive refinement).
4. Finish Phase 6 polish and quickstart validation.

### Parallel Team Strategy

1. One developer handles `.specify/scripts/bash/setup-discover.sh` tasks.
2. One developer handles `.github/agents/speckit.discover.agent.md` analysis phases.
3. One developer handles `test/specify/*.test.ts` coverage per story.
