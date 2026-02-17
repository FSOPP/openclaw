# Testing Guide

## Test Framework
- **Vitest** with V8 coverage engine
- Coverage thresholds: 70% lines/branches/functions/statements
- Max workers: 16

## Config Files
| File | Scope |
|---|---|
| `vitest.config.ts` | Base config (aliases, workers, timeouts) |
| `vitest.unit.config.ts` | Unit tests only (excludes gateway + extensions) |
| `vitest.e2e.config.ts` | End-to-end tests |
| `vitest.gateway.config.ts` | Gateway-specific tests |
| `vitest.extensions.config.ts` | Extension tests |
| `vitest.live.config.ts` | Live tests (real API keys needed) |

## Running Tests
```bash
pnpm test               # All tests (parallel runner script)
pnpm test:fast           # Unit tests only
pnpm test:coverage       # Unit tests with coverage
pnpm test:watch          # Watch mode
pnpm test:e2e            # E2E tests
pnpm test:live           # Live tests (OPENCLAW_LIVE_TEST=1)
```

## Test File Naming
- Unit: `foo.test.ts` (colocated next to `foo.ts`)
- E2E: `foo.e2e.test.ts`

## Test Patterns
- Prefer per-instance stubs over `SomeClass.prototype.method = ...`
- Use `createDefaultDeps` pattern for dependency injection in tested commands
- Test helpers in `src/test-helpers/` and `src/test-utils/`
- Gateway test helpers: `src/gateway/test-helpers.ts`

## Docker Tests
```bash
pnpm test:docker:all       # All Docker-based tests
pnpm test:docker:live-models  # Live model tests in Docker
pnpm test:docker:onboard   # Onboarding E2E in Docker
pnpm test:docker:plugins   # Plugin tests in Docker
```

## Important Notes
- Pure test additions/fixes don't need changelog entries
- Don't set workers above 16
- Mobile testing: prefer connected real devices over simulators
