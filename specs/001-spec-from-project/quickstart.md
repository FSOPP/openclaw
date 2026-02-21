# Quickstart: `/speckit.discover`

## Prerequisites

- Existing feature spec in `specs/<branch>/spec.md`
- VS Code with Copilot Chat and speckit agent modes available
- Project files readable from the selected analysis path

## Run Discover

From Copilot Chat:

```text
/speckit.discover
```

Scope to a subdirectory/module:

```text
/speckit.discover extensions/msteams
```

## Expected Runtime Flow

1. Run setup (`setup-discover.sh --json`) and resolve paths.
2. If `spec.md` already exists, require explicit overwrite confirmation.
3. Execute tiered analysis (manifests/docs, tree, API surface, sampling).
4. Generate `spec.md` with strict evidence for all scenarios/FRs.
5. Emit completion summary (files, modules, clarification markers).
6. Prompt for clarification only if ambiguity markers are present.

## Validation Checklist

- Generated spec has no template placeholders.
- Every user scenario and functional requirement has explicit source evidence.
- Secret-like values are redacted in output snippets/summary.
- Clarification markers are at most 3.
- Scoped runs exclude unrelated module requirements/scenarios.

## Common Follow-up

If clarification markers exist, run:

```text
/speckit.clarify
```

Then continue planning:

```text
/speckit.plan
```
