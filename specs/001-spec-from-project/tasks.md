# Tasks: Spec from Project — `/speckit.discover`

**Input**: Design documents from `/specs/001-spec-from-project/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Not explicitly requested in the feature specification. Tests omitted.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Prompt file: `.github/prompts/`
- Shell scripts: `.specify/scripts/bash/`
- Templates: `.specify/templates/`
- Agent mode config: `.vscode/` (VS Code settings)
- No new files in `src/` for MVP

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the base files and configuration needed by all user stories

- [x] T001 Create the prompt file stub at `.github/prompts/speckit.discover.prompt.md` with YAML front matter `agent: speckit.discover`
- [x] T002 Create the setup script at `.specify/scripts/bash/setup-discover.sh` with argument parsing skeleton sourcing `.specify/scripts/bash/common.sh`
- [x] T003 Register the `speckit.discover` agent mode in the VS Code chat agent configuration (`.vscode/settings.json` or equivalent agent mode definition file)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Implement the setup script logic that ALL user stories depend on — path resolution, validation, and JSON output

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Implement path resolution in `.specify/scripts/bash/setup-discover.sh`: source `common.sh`, call `get_repo_root`, `get_current_branch`, `get_feature_paths`, resolve `FEATURE_DIR`, `SPEC_FILE`, `SPEC_TEMPLATE` paths
- [x] T005 Implement `TARGET_PATH` handling in `.specify/scripts/bash/setup-discover.sh`: accept optional positional argument, default to repo root, validate path exists and is a directory, resolve to absolute path
- [x] T006 Implement `SPEC_EXISTS` check in `.specify/scripts/bash/setup-discover.sh`: detect whether `spec.md` already exists at `SPEC_FILE`, set `SPEC_EXISTS` to `"true"` or `"false"`
- [x] T007 Implement JSON and text output in `.specify/scripts/bash/setup-discover.sh`: `--json` flag outputs single-line JSON with fields `FEATURE_DIR`, `SPEC_FILE`, `SPEC_TEMPLATE`, `TARGET_PATH`, `SPEC_EXISTS`, `BRANCH`, `HAS_GIT`; default outputs human-readable text
- [x] T008 Implement error handling in `.specify/scripts/bash/setup-discover.sh`: print errors/warnings to stderr following `common.sh` conventions, exit 1 for fatal errors (missing target path, target not a directory), non-fatal warning for missing feature branch
- [x] T009 [P] Implement `--help` flag in `.specify/scripts/bash/setup-discover.sh`: print usage synopsis per contract (`setup-discover.sh [--json] [--help] [TARGET_PATH]`) and exit 0
- [x] T010 Set executable permission on `.specify/scripts/bash/setup-discover.sh` (`chmod +x`)

**Checkpoint**: `setup-discover.sh --json` runs successfully, returning valid JSON with all fields. `setup-discover.sh --json /some/path` resolves the target path correctly.

---

## Phase 3: User Story 1 — Generate a Spec from an Existing Project (Priority: P1) 🎯 MVP

**Goal**: A developer runs `/speckit.discover` and gets a fully populated `spec.md` from their existing codebase

**Independent Test**: Run `/speckit.discover` against a sample project with a README, source files, and a `package.json`. Verify the output `spec.md` has all mandatory sections populated with no raw template placeholders.

### Implementation for User Story 1

- [x] T011 [US1] Write the agent mode instructions — Phase 0 (Setup): define the instruction block that runs `setup-discover.sh --json`, parses JSON output, checks `SPEC_EXISTS` and prompts for confirmation if `"true"`, stops if user declines. Add to agent mode definition for `speckit.discover`.
- [x] T012 [US1] Write the agent mode instructions — Phase 1 (Manifest & Documentation): define the instruction block that searches `TARGET_PATH` for manifest files (`**/package.json`, `**/pyproject.toml`, `**/Cargo.toml`, `**/go.mod`), reads root manifest fully, searches for and reads `README.md`, outputs progress summary. Add to agent mode definition for `speckit.discover`.
- [x] T013 [US1] Write the agent mode instructions — Phase 2 (Directory Tree): define the instruction block that runs `list_dir` at `TARGET_PATH` root and 1-2 levels deeper for key directories (`src/`, `lib/`, `app/`, `extensions/`), identifies modules and packages, outputs progress. Add to agent mode definition for `speckit.discover`.
- [x] T014 [US1] Write the agent mode instructions — Phase 3 (API Surface): define the instruction block that identifies entry points from manifest (`bin`, `main`, `scripts`), uses `grep_search` for CLI commands, API routes, exported interfaces, reads entry point files (signatures/exports only), outputs progress. Add to agent mode definition for `speckit.discover`.
- [x] T015 [US1] Write the agent mode instructions — Phase 4 (Source Sampling): define the instruction block that selects 2-3 representative files per module (index files, main classes, model definitions), reads first 100-200 lines each, extracts class names, function signatures, data models, caps total file reads at 20, outputs progress. Add to agent mode definition for `speckit.discover`.
- [x] T016 [US1] Write the agent mode instructions — Phase 5 (Spec Generation): define the instruction block that loads `SPEC_TEMPLATE`, synthesizes analysis data into spec sections (header, user scenarios from entry points + README, FRs from current capabilities, entities from data models, success criteria from README goals + test framework), applies quality checks (no placeholders, max 3 clarification markers), writes to `SPEC_FILE`, outputs summary. Add to agent mode definition for `speckit.discover`.
- [x] T017 [US1] Write the agent mode instructions — Error Handling: define instruction blocks for all error conditions from the contract: empty target directory → clear error and stop; no manifest → continue with README + structure, note in Assumptions; no README → continue with manifest + code, note in Assumptions; neither → warning + best-effort; context pressure → stop sampling + generate from collected data. Add to agent mode definition for `speckit.discover`.
- [x] T018 [US1] Write the agent mode instructions — Progress Reporting: define the instruction block requiring structured phase markers after each tier (`Phase N/4: <name>` with bullet list of 2-5 key findings), plus a Summary section on completion (total files analyzed, modules discovered, sections filled, clarification markers placed). Add to agent mode definition for `speckit.discover`.
- [x] T019 [US1] Write the agent mode instructions — Quality Validation: define the instruction block that checks the generated spec before writing: all mandatory sections populated (User Scenarios, Requirements, Success Criteria), no raw template placeholders (`[FEATURE NAME]`, `[DATE]`, `[Brief Title]`), max 3 `[NEEDS CLARIFICATION]` markers, user stories prioritized P1/P2/P3, acceptance scenarios in Given/When/Then format. Add to agent mode definition for `speckit.discover`.

**Checkpoint**: At this point, `/speckit.discover` should produce a complete, validated `spec.md` from any project with a README and source files. The core value proposition is functional.

---

## Phase 4: User Story 2 — Scope Analysis to a Subdirectory or Module (Priority: P2)

**Goal**: A developer can pass a subdirectory path to `/speckit.discover` and get a spec focused only on that module

**Independent Test**: Run `/speckit.discover extensions/telegram` against the OpenClaw monorepo. Verify the output spec describes only the Telegram extension, not the entire repo.

### Implementation for User Story 2

- [x] T020 [US2] Write the agent mode instructions — Scoping Rules: define the instruction block that, when `TARGET_PATH` is a subdirectory of repo root, restricts all analysis tiers to that subtree: manifest/README from `TARGET_PATH` (not repo root), directory tree only within `TARGET_PATH`, source sampling only from `TARGET_PATH`, spec title reflects scoped module name. Add to agent mode definition for `speckit.discover`.
- [x] T021 [US2] Write the agent mode instructions — Cross-Package Dependencies: define the instruction block that, during scoped analysis, notes dependencies on shared code in the parent project in the Assumptions section without attempting to document the shared code fully. Add to agent mode definition for `speckit.discover`.
- [x] T022 [US2] Update the setup script `.specify/scripts/bash/setup-discover.sh` to validate that `TARGET_PATH` subdirectory exists within or outside the repo root, resolving relative paths correctly for both cases

**Checkpoint**: `/speckit.discover path/to/subdir` produces a spec scoped to that subdirectory, with no leakage from unrelated modules.

---

## Phase 5: User Story 3 — Interactive Refinement of Generated Spec (Priority: P3)

**Goal**: After spec generation, the developer can interactively resolve `[NEEDS CLARIFICATION]` markers

**Independent Test**: Generate a spec with clarification markers, then run the refinement step. Verify the system asks about each marker and updates the spec with user answers.

### Implementation for User Story 3

- [x] T023 [US3] Write the agent mode instructions — Refinement Trigger: define the instruction block that, after spec generation, checks for `[NEEDS CLARIFICATION]` markers in the output. If markers exist, offer to enter interactive refinement. If no markers, confirm spec is complete. Add to agent mode definition for `speckit.discover`.
- [x] T024 [US3] Write the agent mode instructions — Interactive Questions: define the instruction block that presents each `[NEEDS CLARIFICATION: <topic>]` marker as a question with 2-3 suggested answers, accepts user input, replaces the marker in `SPEC_FILE` with the user's choice, and re-validates the spec. Add to agent mode definition for `speckit.discover`.
- [x] T025 [US3] Write the agent mode instructions — Refinement Summary: define the instruction block that, after all markers are resolved, outputs a summary of changes made (markers resolved, sections updated) and confirms the spec is now complete. Add to agent mode definition for `speckit.discover`.

**Checkpoint**: Full workflow works end-to-end: generate spec → identify markers → interactively refine → finalized spec with zero markers.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Edge case handling, documentation, and validation across all stories

- [x] T026 [P] Write edge case handling instructions for empty/unrecognizable directories: agent outputs clear error message "Target directory contains no recognizable source files" and stops without generating a spec. Add to agent mode definition for `speckit.discover`.
- [x] T027 [P] Write edge case handling instructions for extremely large projects (thousands of files): agent samples at most 3 files per module, prioritizes entry points and public API, caps total file reads at 20, notes sampling limitations in Assumptions. Add to agent mode definition for `speckit.discover`.
- [x] T028 [P] Write edge case handling instructions for unsupported/unrecognized languages: agent falls back to README + file structure analysis, notes language limitation in Assumptions section. Add to agent mode definition for `speckit.discover`.
- [x] T029 Add documentation for `/speckit.discover` usage in the speckit README or docs — command synopsis, options, examples, limits. File path TBD based on existing speckit docs location.
- [x] T030 Run quickstart.md validation: manually execute the quickstart flow against a sample project and verify all steps produce expected output

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 completion — BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational (Phase 2) completion
  - US1 (Phase 3) should be completed first as MVP
  - US2 (Phase 4) can start after Phase 2 but benefits from US1 being complete
  - US3 (Phase 5) depends on US1 (needs spec generation to work before refinement)
- **Polish (Phase 6)**: Depends on US1 being complete; can run in parallel with US2/US3

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) — no dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) — independent of US1 (scoping is setup-script + prompt logic)
- **User Story 3 (P3)**: Depends on US1 (requires spec generation to produce markers for refinement)

### Within Each User Story

- Agent mode instruction blocks can be written in parallel (different sections of the same file)
- Setup script changes (US2 T022) can run in parallel with prompt instruction writing
- Quality validation (T019) should be written last within US1

### Parallel Opportunities

- T001, T002, T003 can all run in parallel (different files)
- T009 can run in parallel with T004-T008 (independent `--help` flag)
- T011-T015 can be written in parallel (each is a self-contained instruction block for a different phase)
- T020, T021 can run in parallel (different instruction blocks)
- T023, T024, T025 are sequential (refinement trigger → questions → summary)
- T026, T027, T028 can all run in parallel (independent edge cases)

---

## Parallel Example: User Story 1

```bash
# Write all analysis phase instructions in parallel (T012-T015):
Task: "Phase 1 (Manifest & Documentation) instructions"
Task: "Phase 2 (Directory Tree) instructions"
Task: "Phase 3 (API Surface) instructions"
Task: "Phase 4 (Source Sampling) instructions"

# Then sequentially:
Task: "Phase 5 (Spec Generation) instructions" — synthesizes results from all phases
Task: "Quality Validation instructions" — validates the generated output
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T003) — create prompt file, setup script, agent mode
2. Complete Phase 2: Foundational (T004-T010) — working setup script with JSON output
3. Complete Phase 3: User Story 1 (T011-T019) — full spec generation from existing project
4. **STOP and VALIDATE**: Run `/speckit.discover` against a real project, verify output
5. Ship MVP if spec quality is acceptable

### Incremental Delivery

1. Complete Setup + Foundational → infrastructure ready
2. Add User Story 1 → spec generation works → MVP!
3. Add User Story 2 → subdirectory scoping works → monorepo support
4. Add User Story 3 → interactive refinement works → full feature
5. Polish → edge cases, docs, validation

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (prompt instructions for analysis + generation)
   - Developer B: User Story 2 (scoping logic in setup script + prompt)
3. After US1 is complete:
   - Developer A: User Story 3 (refinement — depends on US1)
   - Developer B: Polish (edge cases, docs)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- All agent mode instruction tasks (T011-T028) are written into the same agent mode definition — coordinate if working in parallel
- The setup script (`.specify/scripts/bash/setup-discover.sh`) is the only Bash file; all other logic lives in agent mode prompt instructions
- No TypeScript source files in `src/` for MVP — the agent uses existing workspace tools
- Commit after each task or logical group
- Stop at any checkpoint to validate independently
