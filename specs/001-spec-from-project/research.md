# Research: Spec from Project — `/speckit.discover`

**Date**: 2026-02-21  
**Branch**: `001-spec-from-project`

## Decision 1: Command Architecture

### Decision

Keep discover aligned with existing speckit architecture: lightweight prompt
stub in `.github/prompts/`, behavior in `.github/agents/`, and setup in
`.specify/scripts/bash/setup-discover.sh`.

### Rationale

This pattern is already used across the speckit command family and minimizes
new surface area while keeping behavior deterministic.

### Alternatives considered

- Embed heavy instructions directly in prompt file
- Implement discover as a standalone CLI command in `src/commands`

---

## Decision 2: Tiered Analysis Strategy for Large Repositories

### Decision

Use an ordered analysis pipeline:

1. manifests + README/docs (full read),
2. directory scan,
3. public API surface,
4. representative source sampling.

### Rationale

This balances signal quality with context and runtime limits, and matches
requirements for scale and scoped subdirectory analysis.

### Alternatives considered

- Exhaustive deep read of all files (too slow/noisy)
- Fixed allowlist-only parsing (misses project-specific signals)

---

## Decision 3: Secret Handling in Generated Outputs

### Decision

Redact likely secrets in extracted snippets, progress output, and generated
spec content. Raw secret values never appear in output artifacts.

### Rationale

The repository already centralizes redaction patterns in logging/security code;
discover should follow that security posture for analysis artifacts too.

### Alternatives considered

- No redaction by default (unsafe)
- Block entire generation on any potential secret (too disruptive for MVP)

---

## Decision 4: Evidence Traceability Strictness

### Decision

Every generated user scenario and functional requirement must include explicit
source evidence. If evidence is missing, omit the item.

### Rationale

Strict traceability improves trust/reviewability and directly enforces
FR-015/SC-006.

### Alternatives considered

- Narrative-only inferred items with no source evidence
- Optional appendix-level evidence map only

---

## Decision 5: Interaction Mode

### Decision

Run non-interactively by default and prompt only when ambiguity markers are
present.

### Rationale

Deterministic default behavior works for scripted/CI-like usage while preserving
guided refinement for uncertain inferences.

### Alternatives considered

- Always interactive
- Never interactive

---

## Decision 6: File Inclusion Policy

### Decision

All readable files in scoped target are eligible for analysis by default;
unreadable files are skipped.

### Rationale

This preserves maximum discoverability while still allowing tiered sampling and
phase prioritization for deeper semantic extraction.

### Alternatives considered

- Default denylist of generated/vendor paths
- Strict allowlist of known source/manifests only

---

## Decision 7: Progress Feedback Contract

### Decision

Emit structured phase progress and completion summary in discover flow, while
reusing shared CLI progress utilities where terminal execution applies.

### Rationale

Users need transparent phase-level visibility and failure localization; this is
also explicitly required by FR-012.

### Alternatives considered

- Unstructured/noisy free-form progress logs
- Silent generation with final output only
