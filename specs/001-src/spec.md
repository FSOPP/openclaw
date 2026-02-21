# Feature Specification: src — OpenClaw Core Runtime Surface

**Feature Branch**: `001-src`  
**Created**: 2026-02-21  
**Status**: Draft  
**Input**: Discovered from project analysis of `/home/tuanna47/workspace/FSO/openclaw/src`

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Run OpenClaw as a unified CLI + gateway control plane (Priority: P1)

An operator starts OpenClaw from the CLI, accesses operational commands, and runs gateway-backed workflows from one runtime surface.

**Why this priority**: This is the project’s core value path: command-line control plus gateway execution.

**Independent Test**: Build a program, verify primary root commands register, then run the CLI entry flow without invoking browser/media features.

**Acceptance Scenarios**:

1. **Given** the operator runs OpenClaw, **When** the CLI initializes, **Then** it builds and parses a commander program with registered command groups.
2. **Given** the operator needs operational checks, **When** they run status/health/sessions commands, **Then** command handlers are available under one CLI program.

**Evidence**:

- `src/index.ts#L48` (`buildProgram`) and `src/index.ts#L89` (`parseAsync`)
- `src/cli/program/build-program.ts#L8` (`buildProgram`) and `src/cli/program/build-program.ts#L17` (`registerProgramCommands`)
- `src/cli/program/register.status-health-sessions.ts#L29`, `#L81`, `#L112`

---

### User Story 2 - Send and manage messages across configured channels (Priority: P1)

An operator uses message commands to send/read/manage channel messages through normalized channel action dispatch.

**Why this priority**: Messaging is a primary end-user workflow for OpenClaw’s multi-channel gateway purpose.

**Independent Test**: Execute `message` command registration and invoke `messageCommand` with an action payload; confirm action dispatch path is selected.

**Acceptance Scenarios**:

1. **Given** message subcommands are registered, **When** the operator invokes `message send`, **Then** the CLI routes to message action execution.
2. **Given** an unsupported action, **When** the operator invokes message command, **Then** the command path fails fast with an unknown-action error.

**Evidence**:

- `src/cli/program/register.message.ts#L26` (`message` command) and `src/cli/program/register.message.ts#L56`
- `src/commands/message.ts#L14` (`messageCommand`) and `src/commands/message.ts#L33` (`runMessageAction`)

---

### User Story 3 - Operate gateway and local HTTP control endpoints (Priority: P2)

An operator runs the gateway and associated local HTTP services (browser control/media retrieval) with explicit auth and route registration.

**Why this priority**: Operational reliability and local control interfaces are essential but secondary to base CLI + messaging.

**Independent Test**: Start gateway service APIs and verify method/event registries plus browser/media endpoint registration on loopback.

**Acceptance Scenarios**:

1. **Given** gateway startup is requested, **When** server initialization occurs, **Then** typed gateway handlers and method/event catalogs are available.
2. **Given** browser control is enabled in config, **When** the browser server starts, **Then** it listens on loopback with auth middleware and registered routes.

**Evidence**:

- `src/gateway/server.impl.ts#L162` (`startGatewayServer`)
- `src/gateway/server-methods.ts#L177` (`coreGatewayHandlers`)
- `src/gateway/server-methods-list.ts#L100` and `src/gateway/server-methods-list.ts#L105`
- `src/browser/server.ts#L25`, `src/browser/server.ts#L49`, `src/browser/server.ts#L59`
- `src/media/server.ts#L35` (`GET /media/:id`)

---

### User Story 4 - Extend behavior through plugins, hooks, and routing rules (Priority: P3)

A maintainer composes custom behavior by defining plugin contracts, hook metadata, and agent-routing bindings without changing the core runtime loop.

**Why this priority**: Extensibility is strategic for integrations, but base operation must work first.

**Independent Test**: Validate typed entities for hooks/plugins/routing and confirm lazy sub-CLI/plugin command entrypoints exist.

**Acceptance Scenarios**:

1. **Given** hook metadata is defined, **When** hook entries are loaded, **Then** event and invocation policy fields are represented in typed hook entries.
2. **Given** channel/account/peer context, **When** route resolution is evaluated, **Then** a resolved agent route includes agent/account/session-key metadata.

**Evidence**:

- `src/hooks/types.ts#L47` (`HookEntry`)
- `src/plugins/types.ts#L57` (`OpenClawPluginToolContext`) and `src/plugins/types.ts#L115` (`ProviderPlugin`)
- `src/routing/resolve-route.ts#L38` (`ResolvedAgentRoute`)
- `src/cli/program/register.subclis.ts#L38` (lazy sub-CLI registry)

### Edge Cases

- Unknown message actions are supplied via CLI options, requiring explicit validation failure (`src/commands/message.ts#L23-L30`).
- Media IDs may be malformed, expired, or oversized, requiring safe rejection and cleanup (`src/media/server.ts#L35-L81`).
- Binding/routing rules can be ambiguous across channel/account/peer scopes and require deterministic fallback (`src/routing/resolve-route.ts#L69-L220`).

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The system MUST construct a single CLI program and register command groups before parsing user argv.
  - **Evidence**: `src/cli/program/build-program.ts#L8-L18`, `src/index.ts#L48-L89`
- **FR-002**: The system MUST expose operational command groups for status, health, and sessions from the primary CLI surface.
  - **Evidence**: `src/cli/program/register.status-health-sessions.ts#L29-L140`
- **FR-003**: The system MUST execute channel message actions through a normalized action dispatcher with explicit unknown-action rejection.
  - **Evidence**: `src/commands/message.ts#L14-L40`
- **FR-004**: The system MUST provide a gateway server startup path with discoverable method/event catalogs and request handlers.
  - **Evidence**: `src/gateway/server.impl.ts#L162-L220`, `src/gateway/server-methods.ts#L177`, `src/gateway/server-methods-list.ts#L100-L123`
- **FR-005**: The system MUST expose browser control and media HTTP endpoints on local server bindings with request validation/auth handling.
  - **Evidence**: `src/browser/server.ts#L25-L60`, `src/media/server.ts#L35-L99`
- **FR-006**: The system MUST model extensibility contracts for plugins, hooks, channels, and routing using typed entities.
  - **Evidence**: `src/plugins/types.ts#L57-L151`, `src/hooks/types.ts#L1-L64`, `src/routing/resolve-route.ts#L20-L54`, `src/channels/plugins/types.plugin.ts#L48`

### Key Entities _(include if feature involves data)_

- **GatewayServerOptions**: Gateway startup contract controlling bind mode, auth overrides, endpoint toggles, and startup behavior.
- **ResolvedAgentRoute**: Route decision artifact containing `agentId`, `channel`, `accountId`, `sessionKey`, and `matchedBy` reason.
- **HookEntry**: Hook descriptor linking hook metadata/frontmatter with invocation policy and source path.
- **ProviderPlugin**: Provider extension contract defining provider metadata, auth methods, models, and optional credential formatting/refresh behavior.
- **ChannelPlugin**: Channel extension contract for channel capabilities, adapters, and gateway method integration.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Discovery output documents at least 4 independently testable user stories mapped to current `src` capabilities, each with explicit source evidence.
- **SC-002**: Discovery output documents at least 6 functional requirements, each using `MUST` language and attached evidence locators.
- **SC-003**: Discovery output identifies at least 5 typed key entities from `src` contracts spanning gateway, routing, hooks, and plugins.
- **SC-004**: Generated spec contains zero unresolved template placeholders and at most 3 clarification markers.

## Assumptions

- `src` has no local manifest; project metadata (name/version/runtime/scripts) is inferred from parent-level `package.json` one directory above target scope.
- No `README` exists at `src` root; documentation intent is inferred from source code and one scoped doc at `src/hooks/bundled/README.md`.
- Analysis is intentionally scoped to `src`; extensions/apps/docs outside target are not deeply documented, though `src` references shared/external packages and plugin catalogs.
- Source sampling used the defined 20-read budget in phases 1-4, so deeper implementation internals beyond sampled files may be omitted.

## Evidence & Redaction Requirements

- Every user story and functional requirement includes explicit source evidence with file path and line locator.
- Inferred items without verifiable evidence are omitted from this spec.
- No raw secret-like values (API keys, tokens, passwords, connection strings, private keys) are included.
