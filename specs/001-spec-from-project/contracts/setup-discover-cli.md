# Contract: Setup Script CLI — `setup-discover.sh`

## Synopsis

```bash
.specify/scripts/bash/setup-discover.sh [--json] [--help] [TARGET_PATH]
```

## Arguments

| Argument      | Required | Default                               | Description                                                   |
| ------------- | -------- | ------------------------------------- | ------------------------------------------------------------- |
| `TARGET_PATH` | No       | Current working directory (repo root) | Absolute or relative path to the project directory to analyze |
| `--json`      | No       | `false`                               | Output result as JSON instead of human-readable text          |
| `--help`      | No       | —                                     | Print usage and exit                                          |

## JSON Output Schema

When `--json` is passed, the script outputs a single-line JSON object to stdout:

```json
{
  "FEATURE_DIR": "/absolute/path/to/specs/001-feature/",
  "SPEC_FILE": "/absolute/path/to/specs/001-feature/spec.md",
  "SPEC_TEMPLATE": "/absolute/path/to/.specify/templates/spec-template.md",
  "TARGET_PATH": "/absolute/path/to/project-to-analyze",
  "SPEC_EXISTS": "false",
  "BRANCH": "001-feature-name",
  "HAS_GIT": "true"
}
```

### Field Definitions

| Field           | Type                     | Description                                                 |
| --------------- | ------------------------ | ----------------------------------------------------------- |
| `FEATURE_DIR`   | `string` (absolute path) | Specs output directory for current feature branch           |
| `SPEC_FILE`     | `string` (absolute path) | Full path where `spec.md` will be written                   |
| `SPEC_TEMPLATE` | `string` (absolute path) | Path to the spec template used as output format reference   |
| `TARGET_PATH`   | `string` (absolute path) | Resolved absolute path to the project being analyzed        |
| `SPEC_EXISTS`   | `"true" \| "false"`      | Whether a `spec.md` already exists at `SPEC_FILE`           |
| `BRANCH`        | `string`                 | Current branch name (from git or `SPECIFY_FEATURE` env var) |
| `HAS_GIT`       | `"true" \| "false"`      | Whether the workspace has a git repository                  |

## Text Output (default)

When `--json` is not passed, the script prints human-readable status lines:

```
Feature dir: /path/to/specs/001-feature/
Spec file: /path/to/specs/001-feature/spec.md
Target path: /path/to/project
Spec exists: false
```

## Exit Codes

| Code | Meaning                                                                           |
| ---- | --------------------------------------------------------------------------------- |
| `0`  | Success — paths resolved, output printed                                          |
| `1`  | Error — invalid arguments, target path does not exist, or not on a feature branch |

## Error Conditions

| Condition                          | Behavior                                                                |
| ---------------------------------- | ----------------------------------------------------------------------- |
| `TARGET_PATH` does not exist       | Print `ERROR: Target path does not exist: <path>` to stderr, exit 1     |
| `TARGET_PATH` is not a directory   | Print `ERROR: Target path is not a directory: <path>` to stderr, exit 1 |
| Not on a feature branch (git mode) | Warning to stderr (non-fatal, per `common.sh` convention)               |
| Spec template missing              | Warning to stderr; script continues (agent can handle gracefully)       |

## Dependencies

- Sources `.specify/scripts/bash/common.sh` for `get_repo_root`, `get_current_branch`, `get_feature_paths`, `check_feature_branch`
- Uses `realpath` or `cd && pwd` for path resolution
- Uses `mkdir -p` for directory creation

## Postconditions

- `FEATURE_DIR` directory exists (created if needed)
- No files are written — script is read-only except for directory creation
- `spec.md` is NOT created by this script (the agent writes it)
