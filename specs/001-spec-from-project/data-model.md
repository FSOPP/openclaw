# Data Model: Spec from Project — `/speckit.discover`

**Date**: 2026-02-20  
**Branch**: `001-spec-from-project`

## Entities

### 1. DiscoverSetup

The output of the `setup-discover.sh` initialization script, providing resolved
paths and state for the discover agent.

| Field           | Type                     | Description                                                        |
| --------------- | ------------------------ | ------------------------------------------------------------------ |
| `FEATURE_DIR`   | `string` (absolute path) | Specs directory for the current feature branch (`specs/<branch>/`) |
| `SPEC_FILE`     | `string` (absolute path) | Target output path for generated `spec.md`                         |
| `SPEC_TEMPLATE` | `string` (absolute path) | Path to `.specify/templates/spec-template.md`                      |
| `TARGET_PATH`   | `string` (absolute path) | Root directory of the project to analyze                           |
| `SPEC_EXISTS`   | `"true" \| "false"`      | Whether `spec.md` already exists at `SPEC_FILE`                    |
| `BRANCH`        | `string`                 | Current branch name (e.g., `001-spec-from-project`)                |
| `HAS_GIT`       | `"true" \| "false"`      | Whether the workspace is a git repository                          |

**Validation**: `TARGET_PATH` must exist and be a directory. `SPEC_TEMPLATE`
must exist. If `SPEC_EXISTS` is `"true"`, the agent must warn and require
confirmation before overwriting.

---

### 2. AnalysisContext

The accumulated knowledge from scanning the target project, built incrementally
across analysis tiers.

| Field                  | Type              | Description                                                            |
| ---------------------- | ----------------- | ---------------------------------------------------------------------- |
| `projectName`          | `string`          | Name extracted from manifest or directory name                         |
| `projectDescription`   | `string \| null`  | Description from manifest or README intro                              |
| `language`             | `string`          | Primary language/framework (e.g., "TypeScript", "Python")              |
| `manifestType`         | `string \| null`  | Type of manifest found (e.g., "package.json", "pyproject.toml")        |
| `manifestData`         | `ManifestData`    | Parsed metadata from manifest file                                     |
| `readmeContent`        | `string \| null`  | Full content of README (truncated if >500 lines)                       |
| `directoryTree`        | `DirectoryNode[]` | Scanned file tree (2-3 levels deep)                                    |
| `entryPoints`          | `EntryPoint[]`    | Discovered entry points / public API surface                           |
| `modules`              | `Module[]`        | Detected modules / packages / top-level directories                    |
| `sampledFiles`         | `SampledFile[]`   | Representative source files read for pattern detection                 |
| `detectedPatterns`     | `string[]`        | Architectural patterns found (e.g., "CLI app", "REST API", "monorepo") |
| `assumptions`          | `Assumption[]`    | Reasonable defaults chosen when info insufficient                      |
| `clarificationMarkers` | `string[]`        | Topics requiring user clarification (max 3)                            |

---

### 3. ManifestData

Structured metadata extracted from a project manifest file.

| Field             | Type                             | Description                  |
| ----------------- | -------------------------------- | ---------------------------- |
| `name`            | `string`                         | Package/project name         |
| `version`         | `string \| null`                 | Version string               |
| `description`     | `string \| null`                 | Package description          |
| `scripts`         | `Record<string, string>`         | Build/test/dev scripts       |
| `dependencies`    | `string[]`                       | Runtime dependency names     |
| `devDependencies` | `string[]`                       | Dev dependency names         |
| `entryPoint`      | `string \| null`                 | Main/bin entry point path    |
| `engines`         | `Record<string, string> \| null` | Runtime version requirements |

---

### 4. EntryPoint

A user-facing interface discovered in the codebase.

| Field         | Type                                          | Description                                                |
| ------------- | --------------------------------------------- | ---------------------------------------------------------- |
| `type`        | `"cli" \| "api" \| "ui" \| "lib" \| "script"` | Kind of entry point                                        |
| `path`        | `string`                                      | File path relative to project root                         |
| `name`        | `string`                                      | Command name, route prefix, component name, or export name |
| `description` | `string \| null`                              | Inferred purpose from comments/naming                      |

---

### 5. Module

A logical grouping of source code within the project.

| Field       | Type             | Description                                     |
| ----------- | ---------------- | ----------------------------------------------- |
| `name`      | `string`         | Module/package/directory name                   |
| `path`      | `string`         | Relative path from project root                 |
| `fileCount` | `number`         | Number of source files in module                |
| `purpose`   | `string \| null` | Inferred purpose from naming/structure          |
| `entities`  | `string[]`       | Data models/domain objects found in this module |

---

### 6. SampledFile

A source file selected for deeper analysis.

| Field       | Type             | Description                         |
| ----------- | ---------------- | ----------------------------------- |
| `path`      | `string`         | Relative path from project root     |
| `module`    | `string`         | Which module this file belongs to   |
| `linesRead` | `number`         | How many lines were read (cap: 200) |
| `exports`   | `string[]`       | Exported symbols found              |
| `classes`   | `string[]`       | Class names defined                 |
| `functions` | `string[]`       | Top-level function names            |
| `purpose`   | `string \| null` | Inferred purpose                    |

---

### 7. Assumption

A reasonable default chosen when project documentation is insufficient.

| Field           | Type                          | Description                           |
| --------------- | ----------------------------- | ------------------------------------- |
| `topic`         | `string`                      | What aspect is being assumed          |
| `chosenDefault` | `string`                      | The default value/behavior chosen     |
| `rationale`     | `string`                      | Why this default is reasonable        |
| `confidence`    | `"high" \| "medium" \| "low"` | Agent's confidence in this assumption |

---

### 8. SpecDocument

The output `spec.md` — follows the spec template structure.

| Section                             | Required               | Source                                                          |
| ----------------------------------- | ---------------------- | --------------------------------------------------------------- |
| Header (name, branch, date, status) | Yes                    | `DiscoverSetup` + `AnalysisContext.projectName`                 |
| User Scenarios & Testing            | Yes                    | Inferred from `EntryPoint[]` + `readmeContent`                  |
| Edge Cases                          | Yes                    | Inferred from patterns + common failure modes                   |
| Functional Requirements             | Yes                    | Derived from current capabilities (`EntryPoint[]` + `Module[]`) |
| Key Entities                        | Yes (if data involved) | Extracted from `SampledFile[].classes` + data model patterns    |
| Success Criteria                    | Yes                    | Derived from README goals, test coverage, performance hints     |
| Assumptions                         | Yes (if any)           | Directly from `AnalysisContext.assumptions`                     |

---

## State Transitions

```
[Start]
   │
   ▼
┌──────────────────────┐
│   setup-discover.sh  │ → DiscoverSetup (JSON)
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Tier 1: Manifests   │ → ManifestData populated
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Tier 2: README/Docs │ → readmeContent populated
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Tier 3: Dir Tree    │ → directoryTree + modules populated
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Tier 4: Config      │ → detectedPatterns enriched
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Tier 5: API Surface │ → entryPoints populated
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Tier 6: Sampling    │ → sampledFiles + entities populated
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Spec Generation     │ → SpecDocument written to SPEC_FILE
└──────────┬───────────┘
           │
           ▼
[Done — report summary]
```

## Relationships

```
DiscoverSetup ──uses──▶ AnalysisContext ──produces──▶ SpecDocument
                              │
                              ├── contains ──▶ ManifestData (0..1)
                              ├── contains ──▶ EntryPoint[] (0..*)
                              ├── contains ──▶ Module[] (0..*)
                              ├── contains ──▶ SampledFile[] (0..*)
                              └── contains ──▶ Assumption[] (0..*)
```
