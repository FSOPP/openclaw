# Code Style & Conventions

## Language & Module System
- TypeScript (ESM) with strict mode enabled
- Target: ES2023, Module: NodeNext
- Use `.js` extension for cross-package imports (ESM convention)
- Type-only imports: `import type { X }` for types

## Naming
- **Product name**: "OpenClaw" in docs/headings; `openclaw` for CLI/package/paths/config keys
- Functions/variables: camelCase
- Types/interfaces: PascalCase
- Constants: UPPER_SNAKE_CASE for true constants, camelCase for config-like consts

## Typing Rules
- **Strict typing always** — avoid `any`
- Never add `@ts-nocheck`
- Never disable `no-explicit-any` lint rule
- Fix root causes instead of suppressing

## File Organization
- Files under ~500 LOC preferred (700 LOC as soft upper guardrail)
- Tests colocated: `*.test.ts` next to source; e2e in `*.e2e.test.ts`
- Extract helpers instead of creating "V2" copies
- Direct imports only — no re-export wrapper files

## Code Quality
- Brief comments for tricky/non-obvious logic
- No prototype mutation for sharing behavior — use explicit inheritance/composition
- Use existing centralized utilities:
  - Time formatting: `src/infra/format-time`
  - Terminal tables: `src/terminal/table.ts`
  - Terminal theme/colors: `src/terminal/palette.ts`
  - Progress/spinners: `src/cli/progress.ts`
  - CLI options: `src/cli/`
  - DI: `createDefaultDeps` pattern

## No Redundancy Rule
- Before creating any utility/helper, search for existing implementations
- Import from original source, do not re-export
- Never create local `formatAge`, `formatDuration` etc. — use centralized modules

## Decorators (Control UI)
- Lit with **legacy** decorators (experimentalDecorators: true, useDefineForClassFields: false)
- Use `@state()` and `@property()` pattern

## Formatting & Lint Config
- Oxfmt: configured in `.oxfmtrc.jsonc` (sorts imports, sorts package.json scripts)
- Oxlint: configured in `.oxlintrc.json` (type-aware, correctness/perf/suspicious as error)
- Pre-commit hook: auto-runs oxlint --fix + oxfmt --write on staged files

## Tool Schema (google-antigravity)
- Avoid `Type.Union` in tool input schemas (no anyOf/oneOf/allOf)
- Use `stringEnum`/`optionalStringEnum` for string lists
- Use `Type.Optional(...)` instead of `... | null`
- Avoid raw `format` property names in tool schemas
