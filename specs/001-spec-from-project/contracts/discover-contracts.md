# Contracts: Spec from Project — `/speckit.discover`

**Date**: 2026-02-21  
**Branch**: `001-spec-from-project`

## Overview

The `/speckit.discover` feature has no REST/GraphQL API. Its contracts are:

1. **Shell script interface** — setup + path resolution contract
2. **Agent execution interface** — phase flow and behavior constraints
3. **Spec output contract** — generated section and evidence guarantees

---

## Contract 1: `setup-discover.sh` CLI Interface

### Synopsis

```
.specify/scripts/bash/setup-discover.sh [--json] [--help] [TARGET_PATH]
```

### Arguments

| Argument       | Required | Default                                | Description                                                   |
| -------------- | -------- | -------------------------------------- | ------------------------------------------------------------- |
| `TARGET_PATH`  | No       | Repository root (from `get_repo_root`) | Absolute or relative path to the project directory to analyze |
| `--json`       | No       | `false`                                | Output result as JSON instead of human-readable text          |
| `--help`, `-h` | No       | —                                      | Show usage and exit                                           |

### JSON Output Schema

```json
{
  "FEATURE_DIR": "<string: absolute path to specs/<branch>/>",
  "SPEC_FILE": "<string: absolute path to specs/<branch>/spec.md>",
  "SPEC_TEMPLATE": "<string: absolute path to .specify/templates/spec-template.md>",
  "TARGET_PATH": "<string: absolute path to project directory to analyze>",
  "SPEC_EXISTS": "<'true' | 'false'>",
  "BRANCH": "<string: current branch name>",
  "HAS_GIT": "<'true' | 'false'>"
}
```

### Exit Codes

| Code | Meaning                                                   |
| ---- | --------------------------------------------------------- |
| `0`  | Success                                                   |
| `1`  | Error: `TARGET_PATH` does not exist or is not a directory |
| `1`  | Error: not on a feature branch (and not in non-git mode)  |

### Error Output (stderr)

- `ERROR: Target path does not exist: <path>` (exit 1)
- `ERROR: Target path is not a directory: <path>` (exit 1)
- `[specify] Warning: spec.md already exists at <path>` (no exit, outputs
  `SPEC_EXISTS=true`)
- `[specify] Warning: Git repository not detected; skipped branch validation`
  (no exit)

---

## Contract 2: Agent Prompt Interface

### Prompt File

**Path**: `.github/prompts/speckit.discover.prompt.md`

**Format**:

```yaml
---
agent: speckit.discover
---
```

### Agent Mode Behavior Contract

The `speckit.discover` agent mode MUST:

1. **Accept** `$ARGUMENTS` — a project path (optional, defaults to repo root)
2. **Run** `setup-discover.sh --json [TARGET_PATH]` to initialize
3. **Parse** JSON output for file paths and state
4. **Check** `SPEC_EXISTS` — if `"true"`, warn user and ask for confirmation
5. **Execute** tiered analysis (6 phases) on `TARGET_PATH`
6. **Redact** secret-like values from snippets/status output before emission
7. **Generate** `spec.md` at `SPEC_FILE` using spec template structure
8. **Attach evidence** to every generated scenario and FR item
9. **Omit** any scenario/FR item that lacks explicit evidence
10. **Prompt** only when clarification markers exist; otherwise complete
11. **Report** analysis summary (files read, modules found, clarification markers)

### Analysis Phases (ordered)

| Phase | Action                                    | Output                             |
| ----- | ----------------------------------------- | ---------------------------------- |
| 1     | Read manifest files at `TARGET_PATH` root | Project name, deps, scripts        |
| 2     | Read README and documentation files       | Purpose, usage, architecture       |
| 3     | Scan directory tree (2-3 levels)          | Module structure, file counts      |
| 4     | Read config files (tsconfig, CI, Docker)  | Build/deploy patterns              |
| 5     | Analyze entry points and exports          | CLI commands, API routes, UI flows |
| 6     | Sample representative source files        | Entities, patterns, domain objects |

### Generated Spec Constraints

- All mandatory sections populated (User Scenarios, Requirements, Success Criteria)
- No raw template placeholders remaining
- Maximum 3 `[NEEDS CLARIFICATION: ...]` markers
- User stories prioritized (P1, P2, P3) with Given/When/Then scenarios
- FRs describe current capabilities (what project does), not aspirations
- Every generated scenario/FR includes explicit source evidence
- Secret-like values are redacted from generated snippets/summaries

---

## Contract 3: Spec Output Interface

### Required Output Properties

| Property            | Requirement                                                          |
| ------------------- | -------------------------------------------------------------------- |
| Mandatory sections  | Header, User Scenarios, Requirements, Success Criteria all populated |
| Evidence strictness | Every scenario/FR references at least one source path + locator      |
| Ambiguity markers   | Maximum 3 markers in generated output                                |
| Secret safety       | No raw secret values in output text                                  |
| Scope fidelity      | Scoped runs do not include unrelated module requirements             |

### Inputs (read-only)

The agent reads the following files from `TARGET_PATH`:

| File Pattern                                                        | Read Strategy                              | Required                        |
| ------------------------------------------------------------------- | ------------------------------------------ | ------------------------------- |
| `package.json`, `pyproject.toml`, `Cargo.toml`, `go.mod`, `pom.xml` | Full read                                  | At least one manifest or README |
| `README.md`, `README`, `README.rst`                                 | Full read                                  | At least one manifest or README |
| `tsconfig.json`, `.eslintrc*`, `Dockerfile`, CI configs             | Full read                                  | No                              |
| Directory tree                                                      | `list_dir` 2-3 levels                      | Yes                             |
| Entry point files (e.g., `src/index.ts`, `src/main.ts`)             | Exports/signatures + command/route mapping | No                              |
| Representative source files (per module)                            | Targeted sampled reads                     | No                              |

**Invariant**: If `TARGET_PATH` has no meaningful analyzable content, return a
clear error and do not emit a vacuous spec.

### Outputs (created/modified)

| File                     | Action           | Condition                            |
| ------------------------ | ---------------- | ------------------------------------ |
| `specs/<branch>/spec.md` | Create new       | `SPEC_EXISTS=false`                  |
| `specs/<branch>/spec.md` | Overwrite        | `SPEC_EXISTS=true` AND user confirms |
| `specs/<branch>/`        | Create directory | If not exists                        |

**Invariant**: The generated `spec.md` MUST be a valid Markdown file that
conforms to the spec template structure in
`.specify/templates/spec-template.md`.
