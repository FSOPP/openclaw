---
title: Speckit
summary: Use Speckit slash commands to discover, specify, clarify, plan, and task new or existing features.
---

# Speckit

Speckit is the spec-first workflow for OpenClaw feature development.

## Discover

Generate a draft spec from an existing codebase or module:

```text
/speckit.discover
```

Scope discovery to a subdirectory/module:

```text
/speckit.discover extensions/msteams
```

### Discover behavior

- Runs setup via `.specify/scripts/bash/setup-discover.sh --json`
- Prompts before overwriting an existing `spec.md`
- Uses tiered analysis (manifest/docs, tree, API surface, source sampling)
- Requires source evidence for generated scenarios/requirements
- Redacts secret-like values in summaries and output content

## Clarify

Resolve ambiguity markers after discovery/specification:

```text
/speckit.clarify
```

## Plan

Create implementation design docs from spec:

```text
/speckit.plan
```

## Tasks

Generate implementation task breakdown from plan docs:

```text
/speckit.tasks
```

## Implement

Execute tasks phase-by-phase and update task checkboxes:

```text
/speckit.implement
```

## Typical flow

```text
/speckit.discover [optional/path]
/speckit.clarify
/speckit.plan
/speckit.tasks
/speckit.implement
```
