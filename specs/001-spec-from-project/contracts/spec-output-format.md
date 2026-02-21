# Contract: Spec Output Format

The `/speckit.discover` command produces a `spec.md` file that follows the exact
same structure as the spec template at `.specify/templates/spec-template.md`.

## Mandatory Sections

Every generated spec MUST contain these sections, fully populated:

### 1. Header

```markdown
# Feature Specification: <Project Name> — <Inferred Subtitle>

**Feature Branch**: `<branch>`  
**Created**: <YYYY-MM-DD>  
**Status**: Draft  
**Input**: Discovered from project analysis of `<TARGET_PATH>`
```

**Rules**:

- `<Project Name>` derived from manifest `name` field or directory name
- `<Inferred Subtitle>` is a brief phrase describing the project's purpose
- `**Input**` uses "Discovered from project analysis" (not "User description")
- `**Status**` is always `Draft`

### 2. User Scenarios & Testing

```markdown
## User Scenarios & Testing _(mandatory)_

### User Story N — <Title> (Priority: P<N>)

<Plain-language description of this user journey>

**Why this priority**: <Rationale>

**Independent Test**: <How to test this story in isolation>

**Acceptance Scenarios**:

1. **Given** <state>, **When** <action>, **Then** <outcome>
2. **Given** <state>, **When** <action>, **Then** <outcome>

---

### Edge Cases

- What happens when <boundary condition>? <Answer>
- How does system handle <error scenario>? <Answer>
```

**Rules**:

- Minimum 2 user stories, maximum 7
- Stories prioritized P1, P2, P3, etc.
- P1 MUST represent the core value proposition of the project
- Each story independently testable
- Minimum 2 acceptance scenarios per story
- Minimum 2 edge cases
- Stories inferred from: CLI commands, API endpoints, UI flows, README usage sections

### 3. Requirements

```markdown
## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST <capability derived from existing code>
- **FR-002**: System MUST <capability derived from existing code>

### Key Entities

- **<Entity>**: <Description, key attributes>
```

**Rules**:

- Minimum 3 functional requirements
- FRs describe what the project **currently does** (not aspirational)
- FRs use `MUST` language per RFC 2119
- Key entities extracted from data models, classes, domain objects, configs
- Each entity includes key attributes (without implementation details)

### 4. Success Criteria

```markdown
## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: <Measurable outcome>
- **SC-002**: <Measurable outcome>
```

**Rules**:

- Minimum 2 success criteria
- Criteria are measurable (numbers, percentages, binary pass/fail)
- Derived from: test coverage, performance benchmarks, README goals, CI checks

### 5. Assumptions (conditional)

```markdown
## Assumptions

- <Assumption with rationale>
```

**Rules**:

- Included when the agent made reasonable defaults due to insufficient info
- Each assumption states what was assumed and why

### 6. Clarifications (conditional)

```markdown
## Clarifications

### Session <DATE>

- Q: <Question> → A: <Answer or [NEEDS CLARIFICATION: ...]>
```

**Rules**:

- Maximum 3 `[NEEDS CLARIFICATION: <topic>]` markers in the entire document
- Each marker describes what specific information is missing
- Markers placed inline in the section where clarification is needed

## Quality Checks

The generated spec MUST pass these checks:

| Check                            | Rule                                                       |
| -------------------------------- | ---------------------------------------------------------- |
| No raw placeholders              | No `[FEATURE NAME]`, `[DATE]`, `[Brief Title]`, etc.       |
| All mandatory sections populated | Scenarios, Requirements, Success Criteria all have content |
| Clarification cap                | Maximum 3 `[NEEDS CLARIFICATION]` markers                  |
| Priority ordering                | User stories ordered P1, P2, P3...                         |
| Given/When/Then format           | All acceptance scenarios use this format                   |
| Measurable criteria              | All SC-xxx items contain measurable language               |
| Current-state FRs                | FRs describe existing capabilities, not wishlists          |
