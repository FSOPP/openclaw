# Quickstart: `/speckit.discover`

## Prerequisites

- VS Code with GitHub Copilot Chat extension
- The `speckit.discover` agent mode configured
- A project with source files to analyze

## Usage

### 1. Create a feature branch

```bash
# From your repo root
.specify/scripts/bash/create-new-feature.sh "Document my existing project"
```

### 2. Run the discover command

In VS Code Copilot Chat, type:

```
/speckit.discover
```

To analyze the current project (repo root). Or scope to a subdirectory:

```
/speckit.discover extensions/telegram
```

### 3. Review progress output

The agent will report progress through 5 analysis phases:

```
Phase 1/5: Manifest & Documentation — project name, dependencies, entry points
Phase 2/5: Directory Tree — modules, file counts
Phase 3/5: API Surface — commands, routes, exports
Phase 4/5: Source Sampling — data models, domain entities, patterns
Phase 5/5: Spec Generation — writing spec.md
```

### 4. Review the generated spec

The spec is written to `specs/<branch>/spec.md`. Check:

- [ ] User scenarios match real usage patterns
- [ ] Functional requirements describe actual capabilities
- [ ] Key entities match the project's domain model
- [ ] Success criteria are measurable
- [ ] Any `[NEEDS CLARIFICATION]` markers are accurate

### 5. Refine (optional)

If the spec has `[NEEDS CLARIFICATION]` markers, run:

```
/speckit.clarify
```

## What Gets Analyzed

| Source                    | What's Extracted                                |
| ------------------------- | ----------------------------------------------- |
| `package.json` / manifest | Name, description, deps, scripts, entry points  |
| `README.md`               | Purpose, usage, architecture overview           |
| Directory tree            | Module structure, naming conventions            |
| Config files              | Build targets, test framework, deployment setup |
| Entry points              | CLI commands, API routes, UI flows              |
| Source samples            | Data models, domain entities, patterns          |

## Limits

- Maximum 20 files read during analysis
- Source files capped at 200 lines each
- Maximum 3 `[NEEDS CLARIFICATION]` markers in output
- Rich manifest parsing for Node.js/TypeScript only (other languages: best-effort)

## Example Output

Running `/speckit.discover` against a typical Node.js CLI project produces:

```markdown
# Feature Specification: my-tool — CLI for Managing Widgets

**Feature Branch**: `001-document-my-tool`
**Created**: 2026-02-20
**Status**: Draft
**Input**: Discovered from project analysis of `/path/to/my-tool`

## User Scenarios & Testing _(mandatory)_

### User Story 1 — Create a Widget (Priority: P1)

...

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST allow users to create widgets via `my-tool create`
  ...

### Key Entities

- **Widget**: Core domain object. Attributes: name, type, config, status.
  ...

## Success Criteria _(mandatory)_

- **SC-001**: All 12 CLI commands documented in spec match implemented commands
  ...
```
