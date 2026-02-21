# Discover Monorepo Fixture

This fixture models a monorepo-like target for scoped discovery runs.

## Modules

- package-a (target scope)
- package-b (unrelated sibling)
- shared (cross-package dependency)

Use this fixture to validate that scoped output excludes unrelated modules.
