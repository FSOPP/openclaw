# Feature Specification: clawdbot — Compatibility Shim Package

**Feature Branch**: `001-discovery-packages`  
**Created**: 2026-02-21  
**Status**: Draft  
**Input**: Discovered from project analysis of `/home/tuanna47/workspace/FSO/openclaw/packages/clawdbot`

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Preserve legacy module imports (Priority: P1)

As an existing `clawdbot` package consumer, I can keep importing `clawdbot` and receive OpenClaw exports, so I can migrate without immediate code changes.

**Why this priority**: Backward compatibility for existing consumers is the core value stated by the package description and module entrypoint.

**Independent Test**: From this package directory, verify the top-level module re-exports OpenClaw by inspecting `index.js` and package `exports` metadata.

**Acceptance Scenarios**:

1. **Given** a consumer resolves the package root entrypoint, **When** the module loads, **Then** it re-exports from `openclaw`.
2. **Given** package metadata is read, **When** the consumer resolves `.` from `exports`, **Then** it points to `./index.js`.

**Evidence**:

- `packages/clawdbot/index.js#L1`
- `packages/clawdbot/package.json#L9-L11`
- `packages/clawdbot/package.json#L4`
  x

---

### User Story 2 - Preserve legacy CLI invocation contract (Priority: P2)

As a user of the legacy `clawdbot` command name, I expect the package contract to expose a `clawdbot` binary mapping so existing automation references remain valid.

**Why this priority**: CLI compatibility is important but secondary to module import compatibility because this subpackage currently only declares metadata for CLI mapping.

**Independent Test**: Verify package metadata includes a `bin.clawdbot` field and `./cli-entry` export that both target `./bin/clawdbot.js`.

**Acceptance Scenarios**:

1. **Given** package metadata is read, **When** inspecting `bin`, **Then** it defines `clawdbot` mapped to `./bin/clawdbot.js`.
2. **Given** package metadata is read, **When** inspecting `exports["./cli-entry"]`, **Then** it maps to `./bin/clawdbot.js`.

**Evidence**:

- `packages/clawdbot/package.json#L5-L7`
- `packages/clawdbot/package.json#L11`

---

### User Story 3 - Notify users of rename intent (Priority: P3)

As a maintainer or installer workflow author, I can run the package rename warning script and surface that `clawdbot` was renamed to `openclaw`.

**Why this priority**: Rename messaging improves migration clarity but is lower priority than compatibility contracts.

**Independent Test**: Execute `node scripts/postinstall.js` in this package and verify the warning message output.

**Acceptance Scenarios**:

1. **Given** the script file exists, **When** `scripts/postinstall.js` executes, **Then** it prints `clawdbot renamed -> openclaw`.
2. **Given** the package source is inspected, **When** looking for migration messaging, **Then** a dedicated warning script is present under `scripts/postinstall.js`.

**Evidence**:

- `packages/clawdbot/scripts/postinstall.js#L1`
- `packages/clawdbot/scripts/postinstall.js#L1`

### Edge Cases

- The package metadata points to `./bin/clawdbot.js`, but the file is missing in the scoped module.
- Consumers may rely on `openclaw` workspace resolution behavior that differs outside the monorepo.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The package MUST identify itself as a compatibility shim forwarding to OpenClaw.
  - **Evidence**: `packages/clawdbot/package.json#L4`
- **FR-002**: The package root module MUST re-export from `openclaw`.
  - **Evidence**: `packages/clawdbot/index.js#L1`
- **FR-003**: The package metadata MUST declare a `clawdbot` CLI binary mapping to `./bin/clawdbot.js`.
  - **Evidence**: `packages/clawdbot/package.json#L5-L7`
- **FR-004**: The package metadata MUST declare `./cli-entry` in `exports` mapped to `./bin/clawdbot.js`.
  - **Evidence**: `packages/clawdbot/package.json#L9-L12`
- **FR-005**: The package MUST declare a runtime dependency on `openclaw`.
  - **Evidence**: `packages/clawdbot/package.json#L13-L15`
- **FR-006**: The package source MUST include a rename warning script that emits a user-facing rename message.
  - **Evidence**: `packages/clawdbot/scripts/postinstall.js#L1`

### Key Entities _(include if feature involves data)_

- **Package Manifest Contract**: Declarative compatibility contract in `package.json` including `name`, `description`, `bin`, `exports`, and `dependencies`.
- **Compatibility Entrypoint**: `index.js` bridge that forwards module exports to `openclaw`.
- **Rename Warning Script**: `scripts/postinstall.js` message emitter indicating the package rename.

### Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: `package.json` contains all required compatibility fields (`description`, `bin.clawdbot`, `exports["."]`, `exports["./cli-entry"]`, `dependencies.openclaw`) and each points to a non-empty value.
- **SC-002**: `index.js` contains exactly one forwarder statement that re-exports from `openclaw`.
- **SC-003**: Executing `node scripts/postinstall.js` emits the rename warning text containing both `clawdbot` and `openclaw`.

### Assumptions

- **No local README in scope**: Purpose and behavior were inferred from package metadata and source files only because no `README*` was found under `packages/clawdbot`.
- **No nested docs in scope**: No `docs/` directory was found under `packages/clawdbot`, so usage narratives were inferred from code and manifest.
- **Cross-package dependency exists**: This module imports/depends on `openclaw` outside `packages/clawdbot`; shared implementation is intentionally out of scope for this discovered spec.
- **CLI file mismatch noted**: `bin.clawdbot` and `./cli-entry` target `./bin/clawdbot.js`, but that file was not found during this scoped scan.
