---
description: Analyze an existing codebase and generate a populated spec.md capturing the project's purpose, user scenarios, functional requirements, key entities, and success criteria.
handoffs:
  - label: Build Technical Plan
    agent: speckit.plan
    prompt: Create a plan for the spec. I am building with...
  - label: Clarify Spec Requirements
    agent: speckit.clarify
    prompt: Clarify specification requirements
    send: true
  - label: Create Tasks
    agent: speckit.tasks
    prompt: Break the plan into tasks
    send: true
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Outline

Analyze an existing codebase and produce a fully populated `spec.md` from it. The user
may pass a target path as `$ARGUMENTS` (defaults to repo root).

---

## Phase 0: Setup

1. Run `.specify/scripts/bash/setup-discover.sh --json $ARGUMENTS` from repo root.
   - If `$ARGUMENTS` is provided, pass it as the `TARGET_PATH` positional argument.
   - If empty, run without a positional argument (defaults to repo root).
   - For single quotes in args like "I'm Groot", use escape syntax: e.g 'I'\''m Groot' (or double-quote if possible: "I'm Groot").

2. Parse the JSON output and extract these fields:
   - `FEATURE_DIR` — specs output directory
   - `SPEC_FILE` — full path where `spec.md` will be written
   - `SPEC_TEMPLATE` — path to the spec template
   - `TARGET_PATH` — resolved absolute path to the project to analyze
   - `SPEC_EXISTS` — whether `spec.md` already exists
   - `BRANCH` — current branch name
   - `HAS_GIT` — whether workspace has git

3. If `SPEC_EXISTS` is `"true"`:
   - Warn the user: "A spec.md already exists at `SPEC_FILE`. Continuing will overwrite it."
   - Ask for explicit confirmation before proceeding.
   - If the user declines, print "Spec generation cancelled." and **STOP**.

4. If JSON parsing fails, abort and instruct user to verify feature branch environment.

---

## Phase 1: Manifest & Documentation Analysis

**Goal**: Extract project identity, dependencies, and purpose from manifest files and documentation.

1. Search `TARGET_PATH` for manifest files using `file_search`:
   - `**/package.json` (exclude `node_modules`)
   - `**/pyproject.toml`
   - `**/Cargo.toml`
   - `**/go.mod`
   - `**/pom.xml`
   - `**/*.csproj`

2. Read the **root-level** manifest file fully (the one in `TARGET_PATH`, not nested sub-packages).
   - Extract: project name, description, version, dependencies, scripts/commands, entry points (`bin`, `main`), engines/runtime requirements.

3. Search for and read documentation files at `TARGET_PATH`:
   - `README.md`, `README`, `README.rst` — read fully (truncate to first 500 lines if very long).
   - Also look for `CONTRIBUTING.md`, `docs/` folder structure (just note existence, don't read deeply).

4. Output a progress summary:
   ```
   Phase 1/5: Manifest & Documentation
   - Project: <name> (<version>)
   - Language: <primary language/framework>
   - Dependencies: <count> runtime, <count> dev
   - README: <found/not found> (<line count> lines)
   - Key scripts: <list of important scripts>
   ```

**Error Handling**:

- No manifest found → continue with README + structure analysis. Note in Assumptions: "No manifest file found; project metadata inferred from README and directory structure."
- No README found → continue with manifest + code analysis. Note in Assumptions: "No README found; project purpose inferred from manifest and source code."
- Neither manifest nor README → print warning "No manifest or README found. Proceeding with best-effort analysis from file structure only." Add an Assumption entry.

---

## Phase 2: Directory Tree Scan

**Goal**: Understand the project's module structure, organization, and scale.

1. Run `list_dir` at `TARGET_PATH` root.

2. For key directories found at root level, run `list_dir` 1-2 levels deeper:
   - Common source directories: `src/`, `lib/`, `app/`, `pkg/`, `cmd/`, `internal/`
   - Extension/plugin directories: `extensions/`, `plugins/`, `packages/`
   - Test directories: `test/`, `tests/`, `__tests__/`, `spec/`
   - Config/infra: `scripts/`, `tools/`, `infra/`, `.github/`

3. Identify modules and packages:
   - Each top-level directory with source files is a potential module.
   - Sub-directories with their own manifest (e.g., `extensions/*/package.json`) are sub-packages.
   - Note the approximate file count per module.

4. Output a progress summary:
   ```
   Phase 2/5: Directory Tree
   - Root entries: <count> dirs, <count> files
   - Modules identified: <list of module names>
   - Sub-packages: <list of sub-package names if any>
   - Estimated source files: <approximate total>
   ```

---

## Phase 3: API Surface Analysis

**Goal**: Discover the project's public interface — CLI commands, API routes, exported functions, UI entry points.

1. Identify entry points from manifest data:
   - `bin` field → CLI commands
   - `main` / `module` / `exports` → library entry points
   - `scripts` → build/test/dev commands

2. Use `grep_search` to find key patterns in source files under `TARGET_PATH`:
   - CLI command registrations (e.g., `.command(`, `program.`, `yargs`, `commander`)
   - API route definitions (e.g., `app.get(`, `router.post(`, `@Get(`, `@Post(`)
   - Exported public interfaces (e.g., `export class`, `export function`, `export default`, `module.exports`)
   - UI component registrations or page definitions

3. Read entry point files identified above — focus on **exports and signatures** only, not full implementations. Read first 100-200 lines max per file.

4. Output a progress summary:
   ```
   Phase 3/5: API Surface
   - Entry points found: <count>
   - CLI commands: <list or count>
   - API routes: <list or count>
   - Public exports: <count>
   ```

---

## Phase 4: Source Sampling

**Goal**: Extract domain terminology, data models, and architectural patterns from representative source files.

1. Select 2-3 representative files per module, prioritizing:
   - Index/barrel files (`index.ts`, `mod.rs`, `__init__.py`)
   - Main classes or services
   - Model/entity definitions
   - Configuration/type definitions

2. Read the first 100-200 lines of each sampled file.

3. Extract from each file:
   - Class names and their key methods
   - Function signatures (name, parameters, return type)
   - Data model shapes (interfaces, types, structs, schemas)
   - Domain-specific terminology and concepts

4. **Cap total file reads at 20 across ALL phases** (1-4 combined). If approaching the cap, stop sampling and proceed with data collected so far.

5. Output a progress summary:
   ```
   Phase 4/5: Source Sampling
   - Files sampled: <count> / 20 budget
   - Classes found: <list of key class names>
   - Domain entities: <list of data models>
   - Patterns detected: <e.g., "CLI app", "monorepo", "REST API", "event-driven">
   ```

---

## Phase 5: Spec Generation

**Goal**: Synthesize all collected data into a complete, validated spec document.

1. Load `SPEC_TEMPLATE` content as the structural reference for the output format.

2. Synthesize the analysis data into spec sections:

   **Header**:
   - `# Feature Specification: <projectName> — <inferred subtitle>`
   - `**Feature Branch**: \`<BRANCH>\``
   - `**Created**: <today's date YYYY-MM-DD>`
   - `**Status**: Draft`
   - `**Input**: Discovered from project analysis of \`<TARGET_PATH>\``

   **User Scenarios & Testing**:
   - Derive user stories from:
     - CLI commands → "User runs `<command>` to `<purpose>`"
     - API endpoints → "User calls `<endpoint>` to `<purpose>`"
     - README usage sections → documented workflows
     - UI flows → user interactions
   - Create 2-7 user stories, prioritized P1/P2/P3
   - P1 MUST represent the project's core value proposition
   - Each story needs:
     - Plain-language description
     - Priority rationale
     - Independent test description
     - Minimum 2 acceptance scenarios in Given/When/Then format
   - Include minimum 2 edge cases

   **Requirements — Functional Requirements**:
   - Derive FRs from **current capabilities** (what the project does), not aspirations
   - Minimum 3 FRs, each using RFC 2119 `MUST` language
   - Each FR must be testable

   **Requirements — Key Entities**:
   - Extract from data models, classes, domain objects discovered in Phase 4
   - Include key attributes (without implementation details)

   **Success Criteria**:
   - Derive from: README goals, test framework presence, CI configuration, performance hints
   - Minimum 2 measurable criteria
   - Each criterion must be binary pass/fail or quantitative

   **Assumptions** (if any):
   - Include all assumptions gathered during analysis
   - Each with topic, chosen default, and rationale

   **Evidence & Redaction Requirements**:
   - Attach explicit source evidence (file path + locator) to every generated user scenario and functional requirement.
   - If evidence cannot be attached for an inferred scenario/requirement, omit it from the output.
   - Redact likely secrets in snippets and status output; raw secret values never appear in output artifacts.
   - Ensure the generated `spec.md` does not contain raw API keys, access tokens, passwords, private keys, or connection strings.

3. **Quality Validation** — before writing, check the generated spec:
   - [ ] All mandatory sections populated (User Scenarios, Requirements, Success Criteria)
   - [ ] No raw template placeholders remaining (`[FEATURE NAME]`, `[DATE]`, `[Brief Title]`, etc.)
   - [ ] Maximum 3 `[NEEDS CLARIFICATION: ...]` markers in the entire document
   - [ ] User stories are prioritized P1, P2, P3, etc.
   - [ ] All acceptance scenarios use Given/When/Then format
   - [ ] Success criteria contain measurable language
   - [ ] FRs describe current capabilities, not wishlists
   - [ ] Every user scenario and functional requirement has explicit source evidence
   - [ ] Items lacking source evidence are omitted from the generated output
   - [ ] Secret-like values are redacted in snippets, status output, and generated `spec.md`
   - If any check fails, fix the issue before writing.

4. Write the completed spec to `SPEC_FILE`.

5. Output a completion summary:

   ```
   Phase 5/5: Spec Generation — Complete

   Summary:
   - Total files analyzed: <count>
   - Modules discovered: <count>
   - Sections filled: <list>
   - User stories: <count> (P1: <count>, P2: <count>, P3: <count>)
   - Functional requirements: <count>
   - Key entities: <count>
   - Success criteria: <count>
   - Clarification markers: <count> / 3 max
   - Assumptions: <count>

   Spec written to: <SPEC_FILE>
   ```

---

## Scoping Rules (Subdirectory Mode) — User Story 2

When `TARGET_PATH` is a subdirectory of the repo root (not the repo root itself):

- **Phase 1**: Read manifest and README from `TARGET_PATH`, NOT the repo root. If no manifest exists in the subdirectory, look one level up but note this in Assumptions.
- **Phase 2**: Scan directory tree ONLY within `TARGET_PATH`. Do not scan sibling directories.
- **Phase 3**: Analyze API surface only from files under `TARGET_PATH`.
- **Phase 4**: Sample source files only from `TARGET_PATH`.
- **Spec title**: Reflect the scoped module name (e.g., "Feature Specification: telegram — Telegram Channel Extension"), not the entire repo name.
- **Cross-package dependencies**: If the scoped module imports from outside `TARGET_PATH` (e.g., shared utilities, parent package), note these dependencies in the Assumptions section. Do NOT attempt to fully document the shared code — just mention the dependency exists.

---

## Interactive Refinement — User Story 3

After spec generation is complete:

1. **Check for clarification markers**: Scan the generated spec for `[NEEDS CLARIFICATION: ...]` markers.

2. **If markers exist** (1-3 markers):
   - Offer to enter interactive refinement: "The generated spec has `<N>` clarification markers. Would you like to resolve them now?"
   - If the user accepts:
     - For each `[NEEDS CLARIFICATION: <topic>]` marker:
       - Present the topic as a question to the user
       - Provide 2-3 suggested answers based on the analysis context
       - Accept the user's choice or custom answer
       - Replace the marker in `SPEC_FILE` with the user's answer
     - After all markers are resolved, re-validate the spec (quality checks from Phase 5)
     - Output a refinement summary:
       ```
       Refinement Complete:
       - Markers resolved: <count>
       - Sections updated: <list>
       - Spec is now complete with zero clarification markers.
       ```
   - If the user declines, confirm: "Spec saved with `<N>` clarification markers. You can resolve them later with `/speckit.clarify`."

3. **If no markers exist**:
   - Confirm: "Spec is complete — no clarification markers found. Ready for `/speckit.plan`."

---

## Error Handling

| Condition                                    | Agent Response                                                                                                                                                                                    |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Empty target directory (no files at all)     | Print error: "Target directory contains no recognizable source files." **STOP** — do not generate a spec.                                                                                         |
| No manifest found                            | Continue with README + file structure analysis. Note in Assumptions.                                                                                                                              |
| No README found                              | Continue with manifest + code analysis. Note in Assumptions.                                                                                                                                      |
| Neither manifest nor README                  | Print warning, attempt best-effort analysis from file structure and source code only. Add Assumption.                                                                                             |
| Context window pressure                      | Stop sampling immediately, generate spec from data collected so far. Add Assumption: "Analysis was truncated due to context limits; spec may be incomplete."                                      |
| `setup-discover.sh` fails                    | Print the error message from stderr and **STOP**.                                                                                                                                                 |
| Overwrite declined                           | Print "Spec generation cancelled." **STOP**.                                                                                                                                                      |
| Extremely large project (thousands of files) | Sample at most 3 files per module. Prioritize entry points and public API. Cap total file reads at 20. Note sampling limitations in Assumptions.                                                  |
| Unsupported/unrecognized language            | Fall back to README + file structure analysis. Note language limitation in Assumptions: "Primary language `<lang>` has limited analysis support; spec inferred from structure and documentation." |

---

## Progress Reporting

After each phase, output a structured progress marker following this format:

```
Phase N/5: <Phase Name>
- Finding 1
- Finding 2
- Finding 3 (keep to 2-5 key findings)
```

After all phases complete, output a **Summary** section with:

- Total files analyzed
- Modules discovered
- Sections filled in spec
- Clarification markers placed
- Next steps recommendation

---

## Constraints & Limits

- **Maximum 20 files** read during the entire analysis (across all phases)
- **Source files capped** at 200 lines each during sampling
- **Maximum 3** `[NEEDS CLARIFICATION]` markers in the output spec
- **Rich manifest parsing** for Node.js/TypeScript only (other languages: best-effort from README + file structure)
- **No external API calls** — all analysis uses local file reads and workspace tools
- **Exactly one file written**: `SPEC_FILE` (the generated `spec.md`)
- **No modifications** to existing project files
