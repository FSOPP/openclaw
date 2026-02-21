# Feature Specification: Spec from Project — Reverse-Engineer Specs from Existing Codebases

**Feature Branch**: `001-spec-from-project`  
**Created**: 2026-02-20  
**Status**: Draft  
**Input**: User description: "create specs by document existing projects"

## User Scenarios & Testing _(mandatory)_

### User Story 1 — Generate a Spec from an Existing Project (Priority: P1)

A developer has an existing codebase with no formal specification. They want to
run a single speckit command (`/speckit.discover`) that analyzes the project's
source code, README, configuration files, and structure to produce a populated
`spec.md` capturing what the project already does — its purpose, user scenarios,
functional requirements, key entities, and success criteria.

**Why this priority**: This is the core value proposition. Without the ability to
generate a spec from an existing project, the entire feature has no purpose.
Every other story depends on this capability being functional.

**Independent Test**: Run the command against a sample project with a README, a
few source files, and a config file. Verify the output `spec.md` contains
populated sections for user scenarios, functional requirements, entities, and
success criteria — with no raw template placeholders remaining.

**Acceptance Scenarios**:

1. **Given** a project directory with a README and source files, **When** the
   user runs the spec-from-project command pointing at that directory, **Then**
   the system produces a `spec.md` file with all mandatory sections filled in
   based on project analysis.
2. **Given** a project with no README but with source files and a `package.json`
   (or equivalent manifest), **When** the command is run, **Then** the system
   still produces a reasonable spec by inferring purpose and capabilities from
   the manifest and code structure.
3. **Given** a project whose analyzed content would leave ambiguous areas,
   **When** the spec is generated, **Then** ambiguous areas are marked with
   `[NEEDS CLARIFICATION: ...]` (maximum 3 markers) and reasonable defaults are
   documented in an Assumptions section.

---

### User Story 2 — Scope Analysis to a Subdirectory or Module (Priority: P2)

A developer working in a monorepo or large project wants to generate a spec for
only a specific subdirectory or module (e.g., a single extension or package)
rather than the entire repository.

**Why this priority**: Large projects are common. Without scoping, the generated
spec would be too broad to be useful for monorepos with dozens of packages or
modules. This makes the tool practical for real-world codebases.

**Independent Test**: Run the command against a monorepo-style project, passing a
subdirectory path. Verify the output spec focuses only on that subdirectory's
functionality, entities, and requirements — and does not include unrelated
modules.

**Acceptance Scenarios**:

1. **Given** a monorepo with multiple packages, **When** the user runs the
   command with a path scoped to one package, **Then** the generated spec
   describes only that package's purpose, scenarios, and requirements.
2. **Given** a scoped analysis, **When** the target subdirectory has
   dependencies on shared code in the parent project, **Then** those
   dependencies are noted in the spec's Assumptions section but the spec does
   not attempt to fully document the shared code.

---

### User Story 3 — Interactive Refinement of Generated Spec (Priority: P3)

After the initial spec is generated, the developer wants to review it and
interactively refine unclear or incorrect inferences before finalizing. The
system should present key decisions (e.g., inferred user roles, primary use
cases) and let the developer confirm, correct, or expand them.

**Why this priority**: Automated analysis will inevitably make imperfect
inferences. Interactive refinement transforms a "good enough" draft into an
accurate specification. This is valuable but not essential for an MVP — a
developer can also manually edit the generated spec.

**Independent Test**: Run the command in interactive mode against a project.
Verify the system presents at least one question about an inferred aspect and
updates the spec based on the user's answer. Then verify the finalized spec
reflects the user's corrections.

**Acceptance Scenarios**:

1. **Given** a generated spec with `[NEEDS CLARIFICATION]` markers, **When** the
   user runs the refinement step, **Then** the system presents each marker as a
   question with suggested answers and updates the spec with the user's choices.
2. **Given** a generated spec with no `[NEEDS CLARIFICATION]` markers, **When**
   the user runs the refinement step, **Then** the system confirms the spec is
   complete and no further input is needed.

---

### Edge Cases

- What happens when the target directory is empty or contains no recognizable
  source files? The system MUST produce a clear error message indicating
  insufficient content for analysis rather than generating a vacuous spec.
- What happens when the project is extremely large (thousands of files)? The
  system MUST use sampling or prioritization (e.g., focus on entry points,
  public APIs, top-level modules) to stay within reasonable processing time and
  output length.
- What happens when the project uses an unsupported or unrecognized language?
  The system MUST still attempt analysis based on file structure, READMEs, and
  manifest files, and note the limitation in the Assumptions section.
- What happens when the project already has a `spec.md`? The system MUST warn
  the user and require explicit confirmation before overwriting.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST analyze a target project directory and produce a
  `spec.md` file following the speckit spec template structure.
- **FR-002**: System MUST extract project purpose and description from README
  files, manifest files (e.g., `package.json`, `pyproject.toml`, `Cargo.toml`),
  and doc comments.
- **FR-003**: System MUST infer user scenarios from entry points, CLI commands,
  API endpoints, UI components, or other user-facing interfaces discovered in
  the codebase.
- **FR-004**: System MUST derive functional requirements from the project's
  existing capabilities — what it currently does, not what it should do.
- **FR-005**: System MUST identify key entities (data models, domain objects,
  configuration structures) and list them in the Key Entities section.
- **FR-006**: System MUST generate measurable success criteria based on
  the project's stated goals, performance characteristics, or test coverage.
- **FR-007**: System MUST support scoping analysis to a specific subdirectory
  via a path argument.
- **FR-008**: System MUST respect the maximum of 3 `[NEEDS CLARIFICATION]`
  markers per spec, using reasonable defaults for all other ambiguities.
- **FR-009**: System MUST warn and require confirmation before overwriting an
  existing `spec.md` in the target spec directory.
- **FR-010**: System MUST produce a valid spec that passes the speckit quality
  checklist validation (no raw template placeholders, all mandatory sections
  populated).
- **FR-011**: System MUST use a tiered analysis strategy: (1) read manifest
  files and README in full, (2) scan the full directory tree, (3) analyze
  public API surface (entry points, exports, CLI commands), and (4) sample
  representative source files from each discovered module. This balances
  accuracy against context window and processing time constraints.
- **FR-012**: System MUST provide structured progress feedback during analysis:
  print each phase as it starts (e.g., "Reading manifest...", "Scanning
  directory tree...", "Analyzing entry points...", "Generating spec...") using
  the project's spinner utilities. On completion, print a summary of what was
  analyzed (files read, modules found, clarification markers placed). On
  failure, print the specific phase that failed and the reason.

### Key Entities

- **Project**: The target codebase being analyzed. Key attributes: root path,
  language/framework, manifest file, README content, entry points.
- **Spec Document**: The generated `spec.md` output. Key attributes: feature
  name, user stories, functional requirements, entities, success criteria,
  assumptions, clarification markers.
- **Analysis Context**: The collected information from the project analysis.
  Key attributes: file tree, manifest metadata, README content, public API
  surface, detected patterns, inferred purpose.
- **Assumption**: A reasonable default chosen when project documentation is
  insufficient. Key attributes: topic, chosen default, rationale, confidence
  level.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: A developer can generate a complete spec from a typical project
  (with README and source files) in under 5 minutes of wall-clock time,
  including any interactive refinement.
- **SC-002**: The generated spec has all mandatory sections populated (User
  Scenarios, Requirements, Success Criteria) with zero raw template
  placeholders remaining.
- **SC-003**: At least 80% of inferred user scenarios and functional
  requirements are judged accurate by the project's maintainer on first
  generation (before manual editing).
- **SC-004**: The generated spec passes the speckit quality checklist
  validation without manual intervention in at least 90% of runs against
  projects that have a README.
- **SC-005**: Scoped analysis (subdirectory) produces a spec that contains
  no requirements or scenarios from unrelated parts of the monorepo.

## Assumptions

- The primary input for analysis is the project's file structure, README/docs,
  manifest files, and public source code. The system does not need to execute
  the project or run its tests to generate a spec.
- **Analysis engine**: The system uses the host AI agent (the Copilot/Claude
  session already running the speckit command) to analyze collected file
  contents and synthesize the spec. No external LLM API calls, API keys, or
  per-run token costs are required beyond the existing agent session. This
  mirrors how `/speckit.specify` and `/speckit.clarify` already operate.
- The spec template structure from `.specify/templates/spec-template.md` is
  used as the output format. The generated spec follows the same conventions
  as specs created by `/speckit.specify` for new features.
- **Supported project types (MVP)**: Rich manifest parsing targets
  Node.js/TypeScript projects (`package.json`, `tsconfig.json`). Other
  languages receive best-effort analysis via README, file structure, and
  host LLM inference — no dedicated manifest parsers are built for them
  in the initial implementation.
- The feature integrates into the existing speckit command suite as a dedicated
  command: `/speckit.discover <path>`. It has its own prompt file
  (`.github/prompts/speckit.discover.prompt.md`) and execution flow, but
  outputs to the same `specs/<branch>/spec.md` location used by
  `/speckit.specify`.

## Clarifications

### Session 2026-02-20

- Q: What analysis engine should the system use to analyze the codebase? → A: Host agent LLM — use the AI agent already running the speckit command to analyze collected file contents. No extra deps or cost beyond the current session.
- Q: How deep should analysis go for large projects? → A: Tiered — full manifest/README + directory tree + public API surface (entry points, exports, CLI) + sampled representative files per module.
- Q: Which project types/languages are in-scope for rich manifest parsing? → A: Node.js/TypeScript only (`package.json`/`tsconfig.json`). Other languages get best-effort analysis via README + file structure.
- Q: How should users invoke this feature? → A: Dedicated command `/speckit.discover` with its own prompt file and execution flow, outputting to the same spec location as `/speckit.specify`.
- Q: What feedback does the user get during analysis? → A: Structured progress logging — print each analysis phase with spinner, completion summary of files/modules analyzed, and phase-specific error messages on failure.
