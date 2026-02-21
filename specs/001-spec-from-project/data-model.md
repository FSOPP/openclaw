# Data Model: Spec from Project — `/speckit.discover`

**Date**: 2026-02-21  
**Branch**: `001-spec-from-project`

## Core Entities

### 1. DiscoverRun

Execution context for a single discover invocation.

| Field             | Type      | Description                                        |
| ----------------- | --------- | -------------------------------------------------- |
| `featureDir`      | `string`  | Absolute specs directory (`specs/<branch>/`)       |
| `specFile`        | `string`  | Absolute output path for generated `spec.md`       |
| `targetPath`      | `string`  | Scoped analysis root (repo root or subdirectory)   |
| `specExists`      | `boolean` | Whether `spec.md` already exists before generation |
| `interactiveMode` | `"auto"`  | Prompt behavior: ask only when ambiguities exist   |

**Validation rules**

- `targetPath` must exist and be readable.
- If `specExists=true`, overwrite requires explicit confirmation.

---

### 2. AnalysisContext

Collected discovery evidence and derived understanding.

| Field               | Type                    | Description                                 |
| ------------------- | ----------------------- | ------------------------------------------- |
| `projectMetadata`   | `ProjectMetadata`       | Name/description/runtime/dependencies       |
| `directorySnapshot` | `DirectorySnapshot`     | Scanned tree summary + module boundaries    |
| `apiSurface`        | `ApiSurfaceItem[]`      | Entry points, exports, commands, routes     |
| `sampledSources`    | `SourceSample[]`        | Representative implementation evidence      |
| `assumptions`       | `Assumption[]`          | Defaults used when evidence is insufficient |
| `clarifications`    | `ClarificationMarker[]` | Unresolved ambiguities (max 3)              |

---

### 3. EvidenceItem

Traceability payload attached to every scenario/requirement.

| Field         | Type        | Description                                            |
| ------------- | ----------- | ------------------------------------------------------ | ------ | --------- | ----------------- |
| `sourcePath`  | `string`    | Relative source/doc path used as evidence              |
| `sourceKind`  | `"manifest" | "readme"                                               | "code" | "config"` | Evidence category |
| `locator`     | `string`    | Symbol/section/command anchor within source            |
| `excerptHash` | `string`    | Stable hash fingerprint of excerpt (no secret leakage) |

**Validation rules**

- Every generated User Story inference and FR item has >=1 `EvidenceItem`.
- If no evidence can be attached, omit the inferred item.

---

### 4. RedactedSnippet

Sanitized textual snippet safe for summaries/spec output.

| Field            | Type     | Description                               |
| ---------------- | -------- | ----------------------------------------- |
| `rawDigest`      | `string` | Non-reversible digest of raw snippet      |
| `redactedText`   | `string` | Snippet with secret-like values masked    |
| `redactionCount` | `number` | Number of redaction substitutions applied |

**Validation rules**

- Raw secrets (token/key/password/private key/connection string values) are not
  emitted to terminal summary or `spec.md`.

---

### 5. SpecDocument

Final generated specification.

| Field                    | Type                      | Description                                    |
| ------------------------ | ------------------------- | ---------------------------------------------- |
| `header`                 | `SpecHeader`              | Feature name, branch, date, status, input      |
| `userStories`            | `UserStory[]`             | Prioritized scenarios with tests and evidence  |
| `functionalRequirements` | `FunctionalRequirement[]` | Current capabilities only; each with evidence  |
| `keyEntities`            | `KeyEntity[]`             | Domain/config entities inferred from code/docs |
| `successCriteria`        | `SuccessCriterion[]`      | Measurable outcomes tied to behavior           |
| `assumptions`            | `Assumption[]`            | Stated defaults and rationale                  |

---

## Relationships

```text
DiscoverRun -> AnalysisContext -> SpecDocument
AnalysisContext -> EvidenceItem[*]
AnalysisContext -> RedactedSnippet[*]
SpecDocument.userStories[*] -> EvidenceItem[1..*]
SpecDocument.functionalRequirements[*] -> EvidenceItem[1..*]
```

## State Transitions

```text
Initialized
   -> ContextCollected (manifests/docs/tree/API/samples)
   -> EvidenceValidated (strict traceability gate)
   -> RedactionApplied (secret-safe output gate)
   -> SpecGenerated
   -> ClarificationPrompted? (only when markers exist)
   -> Completed
```
