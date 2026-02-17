# Design Patterns & Architecture Guidelines

## Dependency Injection
- Use `createDefaultDeps` pattern for CLI command dependencies
- Allows easy testing by injecting mock deps

## Plugin System
- Extensions are workspace packages under `extensions/`
- Each plugin has its own `package.json`
- Runtime deps in `dependencies`; `openclaw` in `devDependencies` or `peerDependencies`
- Plugin install: `npm install --omit=dev` in plugin dir
- Runtime resolves `openclaw/plugin-sdk` via jiti alias
- Avoid `workspace:*` in `dependencies` (breaks npm install)

## Channel Architecture
- All messaging channels (built-in + extension) must be considered when refactoring shared logic
- Channel registry: `src/channels/registry.ts` defines `ChatChannelId`, channel metadata, ordering
- Channel-specific code in dedicated directories: `src/telegram/`, `src/discord/`, etc.
- Extension channels: `extensions/matrix/`, `extensions/msteams/`, etc.

## Gateway Server
- Express 5 with WebSocket support
- Session management with file-system persistence
- Hot-reload support for config changes
- Plugin loading and lifecycle management
- Hooks system for extensibility
- Model catalog and failover routing

## Configuration
- Config dir: `~/.openclaw/` (resolved via `src/utils.ts` → `resolveConfigDir`)
- Credentials: `~/.openclaw/credentials/`
- Sessions: `~/.openclaw/sessions/`
- Managed via `openclaw config set ...`

## Anti-Patterns to Avoid
- No prototype mutation for sharing behavior
- No `@ts-nocheck` or disabling `no-explicit-any`
- No re-export wrapper files
- No `Type.Union` in tool schemas (google-antigravity)
- No `format` property name in tool schemas
- Never edit `node_modules`
- Never update Carbon dependency
- Patched deps (`pnpm.patchedDependencies`) must use exact versions (no ^/~)

## Testing Patterns
- Prefer per-instance stubs over prototype mutation in tests
- Framework: Vitest with V8 coverage
- Test naming: `*.test.ts` (unit), `*.e2e.test.ts` (e2e)
- Coverage thresholds: 70% lines/branches/functions/statements
- Max 16 test workers

## Multi-Agent Safety
- Don't create/apply git stash without explicit request
- Don't switch branches without explicit request
- Don't modify git worktrees without explicit request
- Scope commits to your changes only
- Focus reports on your edits

## SwiftUI (iOS/macOS)
- Prefer Observation framework (`@Observable`, `@Bindable`) over `ObservableObject`/`@StateObject`
