# Explanation of `tsconfig.json` Configuration

This is a TypeScript configuration file for the **openclaw** project. Here's what each option does:

## Compiler Options

1. **`allowImportingTsExtensions: true`** — Allows importing files with `.ts` extensions directly in import paths (requires `noEmit` to be enabled).

2. **`allowSyntheticDefaultImports: true`** — Allows `import x from "module"` syntax even if the module doesn't have a default export.

3. **`declaration: true`** — Generates `.d.ts` type declaration files alongside compiled output.

4. **`esModuleInterop: true`** — Enables better interop between CommonJS and ES module imports by emitting helper code.

5. **`experimentalDecorators: true`** — Enables support for the legacy TypeScript decorator syntax (e.g., `@decorator`).

6. **`forceConsistentCasingInFileNames: true`** — Ensures imports match the exact casing of file names on disk, preventing issues on case-sensitive file systems (like Linux).

7. **`lib: ["DOM", "DOM.Iterable", "ES2023", "ScriptHost"]`** — Includes type definitions for browser DOM APIs, iterable DOM collections, ES2023 features, and the Windows Script Host.

8. **`module: "NodeNext"`** — Uses Node.js's native ESM/CJS resolution strategy for module output.

9. **`moduleResolution: "NodeNext"`** — Resolves modules using Node.js's modern algorithm (supporting `exports` fields in `package.json`).

10. **`noEmit: true`** — TypeScript will only type-check; no JavaScript output files are produced (a bundler likely handles transpilation).

11. **`noEmitOnError: true`** — Prevents any output if type-checking errors exist.

12. **`outDir: "dist"`** — Specifies the output directory (largely symbolic here since `noEmit` is `true`).

13. **`resolveJsonModule: true`** — Allows importing `.json` files as modules.

14. **`skipLibCheck: true`** — Skips type-checking of `.d.ts` declaration files for faster builds.

15. **`strict: true`** — Enables all strict type-checking options (`strictNullChecks`, `noImplicitAny`, etc.).

16. **`target: "es2023"`** — Compiles to ES2023 JavaScript syntax (modern features like array grouping, etc.).

17. **`useDefineForClassFields: false`** — Uses the legacy TypeScript behavior for class field initialization (assignment in constructor) instead of `Object.defineProperty`.

18. **`paths`** — Defines module path aliases:
    - **`"openclaw/plugin-sdk"`** → `./src/plugin-sdk/index.ts`
    - **`"openclaw/plugin-sdk/*"`** → `./src/plugin-sdk/*.ts`
    - **`"openclaw/plugin-sdk/account-id"`** → `./src/plugin-sdk/account-id.ts`

    This allows importing from `openclaw/plugin-sdk` without using relative paths.

## Project Scope

- **`include`** — Type-checks files in `src/`, `ui/`, and `extensions/` directories.
- **`exclude`** — Ignores `node_modules`, `dist`, and test files (`*.test.ts`).

## Summary

This config is set up for a **type-check-only** workflow (no emit) on a modern Node.js project that uses both DOM and server-side APIs, with path aliases for an internal plugin SDK.
