# Contract: Agent Prompt Interface — `speckit.discover`

## Prompt File

```yaml
# .github/prompts/speckit.discover.prompt.md
---
agent: speckit.discover
---
```

## Agent Mode Definition

The `speckit.discover` agent mode MUST be configured with mode instructions that
define the following workflow.

### Input

The agent receives `$ARGUMENTS` from the user — typically a target path or empty
(defaults to repo root).

### Workflow Phases

#### Phase 0: Setup

1. Run `.specify/scripts/bash/setup-discover.sh --json [TARGET_PATH]` from repo root
2. Parse JSON output into `DiscoverSetup` fields
3. If `SPEC_EXISTS` is `"true"`, warn and ask user for confirmation before proceeding
4. If user declines, stop

#### Phase 1: Manifest & Documentation Analysis

1. Search `TARGET_PATH` for manifest files using `file_search`:
   - `**/package.json`, `**/pyproject.toml`, `**/Cargo.toml`, `**/go.mod`,
     `**/pom.xml`, `**/*.csproj`
2. Read the root manifest file (full content)
3. Search for and read `README.md` (or `README`, `README.rst`)
4. Output progress: Phase 1 findings (project name, description, language, deps)

#### Phase 2: Directory Tree Scan

1. `list_dir` at `TARGET_PATH` root
2. `list_dir` 1-2 levels deeper for key directories (src/, lib/, app/, etc.)
3. Identify modules, packages, and top-level organizational structure
4. Output progress: directories scanned, modules found, file count estimate

#### Phase 3: API Surface Analysis

1. Identify entry points from manifest data (`bin`, `main`, `scripts`)
2. Use `grep_search` to find:
   - CLI command registrations
   - API route definitions
   - Exported public interfaces
   - UI component registrations
3. Read entry point files (exports and signatures, not full implementations)
4. Output progress: entry points found, commands, routes, exports

#### Phase 4: Source Sampling

1. Select 2-3 representative files per module (prioritize: index files, main
   classes, model definitions)
2. Read first 100-200 lines of each sampled file
3. Extract: class names, function signatures, data models, domain terminology
4. Cap total file reads at 20 across all phases
5. Output progress: files sampled, entities found, patterns detected

#### Phase 5: Spec Generation

1. Load `SPEC_TEMPLATE` content as structural reference
2. Synthesize collected data into spec sections:
   - Header from `DiscoverSetup` + project metadata
   - User scenarios from entry points + README usage
   - Functional requirements from current capabilities
   - Key entities from data models and domain objects
   - Success criteria from README goals + test/CI structure
   - Assumptions from any gaps filled with defaults
3. Apply quality checks (no template placeholders, max 3 clarification markers)
4. Write completed spec to `SPEC_FILE`
5. Output summary: sections filled, markers placed, files analyzed

### Error Handling

| Condition                   | Agent Response                                                                |
| --------------------------- | ----------------------------------------------------------------------------- |
| Empty target directory      | Print error: "Target directory contains no recognizable source files." Stop.  |
| No manifest found           | Continue with README + file structure analysis. Note in Assumptions.          |
| No README found             | Continue with manifest + code analysis. Note in Assumptions.                  |
| Neither manifest nor README | Print warning, attempt analysis from file structure only. Add Assumption.     |
| Context window pressure     | Stop sampling, generate spec from data collected so far. Note in Assumptions. |
| Overwrite declined          | Print "Spec generation cancelled." Stop.                                      |

### Scoping Rules (Subdirectory Mode)

When `TARGET_PATH` is a subdirectory of the repo root:

- Tier 1-2: Read manifest/README from `TARGET_PATH`, not repo root
- Tier 3: Scan tree only within `TARGET_PATH`
- Tier 4-6: Analyze only files under `TARGET_PATH`
- Cross-package dependencies noted in Assumptions section (not documented fully)
- Spec title reflects the scoped module, not the entire repo

### Output Guarantees

- Exactly one file written: `SPEC_FILE` (the generated `spec.md`)
- No other files created or modified
- All mandatory spec sections populated
- Maximum 3 `[NEEDS CLARIFICATION]` markers
- Zero raw template placeholders
