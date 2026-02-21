# Feature Specification: moltbot — OpenClaw Compatibility Shim Package

**Feature Branch**: `002-discovery-packages-moltbot`  
**Created**: 2026-02-21  
**Status**: Draft  
**Input**: Discovered from project analysis of `/home/tuanna47/workspace/FSO/openclaw/packages/moltbot`

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Preserve existing CLI command usage (Priority: P1)

As an existing `moltbot` user, I can keep invoking the `moltbot` command while the underlying implementation forwards to OpenClaw, so automation and operator habits continue working during rename/migration.

**Why this priority**: CLI command continuity is the core value of this package’s compatibility role.

**Independent Test**: Can be fully tested by verifying package metadata exposes the `moltbot` binary and CLI export target without requiring any other package behavior.

**Acceptance Scenarios**:

1. **Given** the package manifest is loaded, **When** inspecting `bin`, **Then** it defines `moltbot` mapped to `./bin/moltbot.js`.
2. **Given** the package manifest is loaded, **When** inspecting `exports["./cli-entry"]`, **Then** it maps to `./bin/moltbot.js`.

**Evidence**:

- `packages/moltbot/package.json` (`bin.moltbot`, `exports["./cli-entry"]`)
- `packages/moltbot/package.json` (`description`: "Compatibility shim that forwards to openclaw")

---

### User Story 2 - Keep programmatic imports compatible (Priority: P2)

As an integrator importing from `moltbot`, I can continue importing symbols while receiving OpenClaw’s exported API surface.

**Why this priority**: Import compatibility protects existing integrations, but is secondary to executable CLI continuity.

**Independent Test**: Can be fully tested by checking package export configuration and module source that re-exports from `openclaw`.

**Acceptance Scenarios**:

1. **Given** the package root export is resolved, **When** the runtime loads `.` export, **Then** it points to `./index.js`.
2. **Given** `./index.js` is evaluated, **When** imports are processed, **Then** it re-exports all exports from `openclaw`.

**Evidence**:

- `packages/moltbot/package.json` (`exports["."]` -> `./index.js`)
- `packages/moltbot/index.js` (`export * from "openclaw";`)

---

### User Story 3 - Notify users of package rename at install time (Priority: P3)

As a maintainer/operator installing the package, I receive an explicit rename warning so I know migration target naming (`openclaw`).

**Why this priority**: Installation guidance improves migration clarity, but does not block core compatibility behavior.

**Independent Test**: Can be fully tested by executing the postinstall script and asserting the warning text is emitted.

**Acceptance Scenarios**:

1. **Given** the postinstall script is executed, **When** it runs, **Then** it prints a rename warning that includes both `moltbot` and `openclaw`.
2. **Given** a user inspects install script source, **When** reading the warning text, **Then** the rename direction is explicit (`moltbot renamed -> openclaw`).

**Evidence**:

- `packages/moltbot/scripts/postinstall.js` (`console.warn("moltbot renamed -> openclaw")`)

### Edge Cases

- If `openclaw` cannot be resolved in the consumer environment, import compatibility fails despite shim structure.
- If packaging/publish excludes `./bin/moltbot.js`, CLI alias metadata exists but the executable target is unavailable at runtime.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The package MUST declare itself as a compatibility shim forwarding behavior to OpenClaw through package metadata and description.
  - **Evidence**: `packages/moltbot/package.json` (`description`: "Compatibility shim that forwards to openclaw")
- **FR-002**: The package MUST expose a `moltbot` CLI command mapping via `bin` and a CLI export mapping via `exports["./cli-entry"]`, both targeting `./bin/moltbot.js`.
  - **Evidence**: `packages/moltbot/package.json` (`bin.moltbot`, `exports["./cli-entry"]`)
- **FR-003**: The package MUST expose programmatic compatibility by mapping root export `.` to `./index.js`, where `./index.js` re-exports from `openclaw`.
  - **Evidence**: `packages/moltbot/package.json` (`exports["."]`), `packages/moltbot/index.js` (`export * from "openclaw";`)
- **FR-004**: The package MUST provide an install-time rename warning from `moltbot` to `openclaw` through its postinstall script source.
  - **Evidence**: `packages/moltbot/scripts/postinstall.js` (`console.warn("moltbot renamed -> openclaw")`)
- **FR-005**: The package MUST declare a dependency on `openclaw` to support forwarding behavior.
  - **Evidence**: `packages/moltbot/package.json` (`dependencies.openclaw`)

### Key Entities _(include if feature involves data)_

- **MoltbotPackageManifest**: Package metadata entity describing compatibility behavior (`name`, `version`, `description`, `type`, `bin`, `exports`, `dependencies`).
- **CompatibilityEntrypoint**: Module export shim entity (`index.js`) that forwards public API surface to `openclaw`.
- **InstallRenameNotice**: Postinstall warning entity (`scripts/postinstall.js`) that communicates migration direction from old package name to new package name.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Static manifest inspection confirms all required compatibility mappings are present: `bin.moltbot`, `exports["."]`, and `exports["./cli-entry"]` (pass/fail).
- **SC-002**: Static source inspection confirms `index.js` contains a forwarding re-export from `openclaw` (pass/fail).
- **SC-003**: Static source inspection confirms postinstall script emits a rename warning containing both package names (`moltbot`, `openclaw`) (pass/fail).

## Assumptions

- **Scope**: Analysis is intentionally limited to `/packages/moltbot` per subdirectory discovery request.
  - **Chosen default**: Do not inspect sibling packages or repo-wide command wiring.
  - **Rationale**: Speckit discover subdirectory mode requires scoped analysis.
- **Documentation availability**: No README or CONTRIBUTING file exists under the target path.
  - **Chosen default**: Infer package purpose from `package.json` and source files only.
  - **Rationale**: No local package documentation artifact was found in scope.
- **Cross-package dependency**: `moltbot` forwards behavior to dependency `openclaw` outside target path.
  - **Chosen default**: Treat `openclaw` internals as external to this spec and document only dependency existence.
  - **Rationale**: Subdirectory mode requires noting cross-package dependencies without full external analysis.
- **CLI file presence**: Manifest references `./bin/moltbot.js`, but this file is not present in the analyzed directory listing.
  - **Chosen default**: Record mapping as declared capability and treat packaging/runtime existence as out-of-scope validation.
  - **Rationale**: Discovery output is evidence-based on current in-scope files and metadata.
