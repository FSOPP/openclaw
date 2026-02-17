# Suggested Commands

## Development
| Command | Purpose |
|---|---|
| `pnpm install` | Install all dependencies |
| `pnpm openclaw ...` or `pnpm dev` | Run CLI in dev mode |
| `pnpm gateway:dev` | Run gateway in dev mode (skips channels) |
| `pnpm gateway:watch` | Run gateway with file watching |
| `pnpm tui:dev` | Run TUI in dev mode |

## Build & Type-check
| Command | Purpose |
|---|---|
| `pnpm build` | Full build (canvas bundle, tsdown, plugin-sdk dts, etc.) → `dist/` |
| `pnpm tsgo` | TypeScript type-checking (uses native preview) |

## Lint & Format
| Command | Purpose |
|---|---|
| `pnpm check` | Full check: format + typecheck + lint |
| `pnpm lint` | Run Oxlint with type-aware |
| `pnpm lint:fix` | Run Oxlint with auto-fix + format |
| `pnpm format` | Format with Oxfmt (write) |
| `pnpm format:check` | Check formatting only |

## Testing
| Command | Purpose |
|---|---|
| `pnpm test` | Run all tests (parallel runner) |
| `pnpm test:fast` | Run unit tests only (vitest.unit.config.ts) |
| `pnpm test:coverage` | Run unit tests with V8 coverage |
| `pnpm test:watch` | Watch mode for tests |
| `pnpm test:e2e` | Run end-to-end tests |
| `pnpm test:live` | Run live tests (requires `OPENCLAW_LIVE_TEST=1`) |

## Pre-commit Hook
| Command | Purpose |
|---|---|
| `git config core.hooksPath git-hooks` | Install git hooks (done by `prepare` script) |
| Pre-commit hook runs: oxlint --type-aware --fix + oxfmt --write on staged files |

## Release & Check
| Command | Purpose |
|---|---|
| `pnpm release:check` | Pre-release validation |
| `pnpm protocol:check` | Validate protocol schema is in sync |
| `pnpm check:loc` | Check for file LOC limit (500 max) |

## Mobile & Native
| Command | Purpose |
|---|---|
| `pnpm mac:package` | Package macOS app |
| `pnpm ios:build` | Build iOS app |
| `pnpm android:run` | Build + install + launch Android app |

## System Utilities (Linux)
| Command | Purpose |
|---|---|
| `git`, `ls`, `cd`, `grep`, `find` | Standard Linux utils |
| `scripts/committer "<msg>" <file...>` | Scoped commits (avoids manual git add/commit) |
