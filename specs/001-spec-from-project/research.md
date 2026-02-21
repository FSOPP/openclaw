# Research: Spec from Project — `/speckit.discover`

**Date**: 2026-02-20  
**Branch**: `001-spec-from-project`

## 1. Existing Speckit Command Pattern

### Decision

Replicate the exact pattern used by all other speckit commands: a **minimal
prompt file** in `.github/prompts/` with YAML front matter, paired with a
**setup shell script** in `.specify/scripts/bash/`.

### Rationale

Every existing speckit prompt file (`speckit.specify`, `speckit.clarify`,
`speckit.plan`, `speckit.analyze`, `speckit.tasks`, `speckit.implement`,
`speckit.checklist`, `speckit.constitution`, `speckit.taskstoissues`) follows
the identical stub pattern:

```yaml
---
agent: speckit.<name>
---
```

The `agent:` key declares a VS Code Copilot agent mode. Actual behavior is
defined in the agent mode configuration (not the prompt file body). Shell
scripts handle directory setup, validation, and template copying.

### Alternatives Considered

- **Inline prompt instructions in `.prompt.md`**: Not how the project works.
  All prompts are agent-mode stubs.
- **TypeScript source in `src/`**: Rejected — MVP follows the "agent prompt +
  shell script" pattern, mirroring `/speckit.specify` and `/speckit.clarify`.

---

## 2. File Analysis Strategy (Tiered Approach)

### Decision

Implement a tiered analysis strategy executed by the host AI agent within the
prompt instructions, balancing accuracy against context window limits.

### Analysis Tiers

| Phase                      | What to Read                                                        | Why                                            | Budget                           |
| -------------------------- | ------------------------------------------------------------------- | ---------------------------------------------- | -------------------------------- |
| **Tier 1: Manifests**      | `package.json`, `pyproject.toml`, `Cargo.toml`, `go.mod`, `pom.xml` | Name, description, deps, scripts, entry points | Full read — small files          |
| **Tier 2: Documentation**  | `README.md`, `CONTRIBUTING.md`, `docs/index.md`                     | Purpose, architecture, usage                   | Full read — typically <500 lines |
| **Tier 3: Directory tree** | `list_dir` recursively (2-3 levels deep)                            | Module structure, naming conventions           | Tree only — no file contents     |
| **Tier 4: Config**         | `tsconfig.json`, `.eslintrc*`, `Dockerfile`, CI configs             | Build setup, deployment targets                | Full read — small files          |
| **Tier 5: API surface**    | Entry points (`src/index.ts`, `src/main.ts`, `src/cli/*`), exports  | Public interface, commands, routes             | Exports/signatures only          |
| **Tier 6: Sampled source** | 2-3 representative files per discovered module                      | Implementation patterns, entities              | First 100-200 lines each         |

### Context Window Management Rules

- Never read entire large files (>300 lines) unless manifest/README.
- Use `grep_search` for patterns (class names, exports, routes) before full reads.
- Use `file_search` with globs to discover files, not exhaustive directory reads.
- For monorepos: root manifest → top-level `list_dir` → descend only into scoped dir.
- Cap file reads at 20 files total for analysis phase.
- Stop collecting data when every spec section can be filled.

### Risks & Mitigations

| Risk                                   | Mitigation                                                                     |
| -------------------------------------- | ------------------------------------------------------------------------------ |
| Context window overflow on large repos | Tier-gated analysis, hard cap (20 file reads, 200 lines max per source file)   |
| Missing domain-specific details        | Interactive refinement step (P3); `[NEEDS CLARIFICATION]` markers (max 3)      |
| Non-TS project analysis quality        | Fall back to README + file structure inference; note limitation in Assumptions |

---

## 3. Setup Script Pattern

### Decision

Create `.specify/scripts/bash/setup-discover.sh` following the exact conventions
of `create-new-feature.sh` and `setup-plan.sh`.

### Canonical Script Structure

```bash
#!/usr/bin/env bash
set -e

# 1. Argument parsing (loop with case)
# 2. Source common.sh
# 3. Resolve paths via get_feature_paths
# 4. Validate prerequisites (branch naming, directory existence)
# 5. Create directories / copy templates / check existing files
# 6. Output JSON or text
```

### Discover-Specific Differences

Unlike `create-new-feature.sh`, the discover setup script:

- Does **not** create a new git branch (feature branch already exists)
- Does **not** need `--short-name` or `--number` args
- **Does** accept an optional `TARGET_PATH` argument for the directory to analyze
- **Does** check for existing `spec.md` and warn (per FR-009)

### JSON Output Format

```json
{
  "FEATURE_DIR": "/path/to/specs/001-feature/",
  "SPEC_FILE": "/path/to/specs/001-feature/spec.md",
  "SPEC_TEMPLATE": "/path/to/.specify/templates/spec-template.md",
  "TARGET_PATH": "/path/to/project-to-analyze",
  "SPEC_EXISTS": "false",
  "BRANCH": "001-feature-name"
}
```

### Error Handling Conventions

- Errors to stderr: `echo "ERROR: ..." >&2`
- Warnings: `>&2 echo "[specify] Warning: ..."`
- Non-zero exit for fatal errors (`exit 1`)
- Graceful fallbacks for missing templates
- `set -e` at top for fail-fast

---

## 4. Spec Template Structure

### Decision

The generated `spec.md` must populate every mandatory section of
`.specify/templates/spec-template.md`. No raw template placeholders may remain.

### Mandatory Sections

1. **Header**: Feature name, branch, date, status, input description
2. **User Scenarios & Testing**: Prioritized user stories with Given/When/Then
   acceptance scenarios, plus edge cases
3. **Requirements**: Functional requirements (FR-001, FR-002, ...) and key
   entities
4. **Success Criteria**: Measurable outcomes (SC-001, SC-002, ...)

### Template Rules

- No raw template placeholders (`[FEATURE NAME]`, `[DATE]`, etc.) in output
- Maximum 3 `[NEEDS CLARIFICATION: ...]` markers (per FR-008)
- All mandatory sections populated
- User stories prioritized (P1, P2, P3) and independently testable
- Acceptance scenarios use Given/When/Then format
- FRs derived from what the codebase _already does_ (current capabilities)
- Entities from data models, domain objects, config structures in source
- Success criteria from test coverage, performance characteristics, README goals

---

## 5. Progress and Feedback Pattern

### Decision

Since the discover command runs as an **agent prompt** (not a CLI binary),
progress is reported via structured text output in the agent's response stream.

### Rationale

`src/cli/progress.ts` provides `createCliProgress()` with `@clack/prompts`
spinners and `osc-progress` bars, but these are for CLI terminal commands. The
speckit discover command runs _inside a Copilot Chat agent session_ and cannot
invoke terminal spinners.

### Recommended Pattern

The agent prompt should output structured phase markers:

```
## Analysis Progress

**Phase 1/4: Reading manifests**
- Found: package.json (name: "my-project", 12 dependencies)
- Found: tsconfig.json (target: ESNext)

**Phase 2/4: Scanning directory tree**
- Scanned 3 levels, found 8 directories, 42 files
- Detected modules: src/api, src/models, src/utils

**Phase 3/4: Analyzing API surface**
- Entry points: src/index.ts
- Exported modules: 3 public packages

**Phase 4/4: Generating spec**
- Writing spec.md
- Sections filled: 4/4 mandatory, 1 clarification marker

## Summary
Analyzed 15 files across 3 modules. Generated spec with 3 user stories,
8 functional requirements, 4 key entities, and 3 success criteria.
```

### Alternatives Considered

- Running terminal commands from agent for `createCliProgress()`: Not viable —
  `run_in_terminal` doesn't stream in real time; spinner would complete before
  output returned.

---

## 6. Edge Cases and Cross-Cutting Concerns

| Concern                                      | Resolution                                                                                                           |
| -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `spec.md` already exists                     | `setup-discover.sh` checks and outputs `SPEC_EXISTS=true`; prompt warns and asks for confirmation before overwriting |
| Empty or unrecognizable project directory    | Prompt detects empty tree in Tier 3 and produces clear error message (per edge case in spec)                         |
| Extremely large project (thousands of files) | Tiered analysis + 20-file cap + sampling only representative files per module                                        |
| Non-git repos                                | `common.sh` already handles this via `SPECIFY_FEATURE` env var and directory fallback                                |
| Monorepo scope leakage                       | When `TARGET_PATH` is a subdirectory, restrict Tier 3+ to that subtree; cross-package deps noted in Assumptions only |
| Unsupported language                         | Best-effort via README + file structure; note limitation in Assumptions section                                      |
| Script permissions                           | Match existing scripts' `+x` permission; verified by git                                                             |
