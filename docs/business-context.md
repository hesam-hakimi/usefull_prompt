# Business Context

> Status: draft  
> Owner: `[name or team]`  
> Last reviewed: `[YYYY-MM-DD]`

Agents must treat unfilled fields as unknown and ask focused questions when an unknown affects correctness.

## Product mission

`[What problem does this product solve, for whom, and why does it matter?]`

## Users and stakeholders

| User or stakeholder | Need | Critical outcome | Failure impact |
| --- | --- | --- | --- |
| `[role]` | `[need]` | `[outcome]` | `[impact]` |

## Critical user journeys

| ID | Journey | Success condition | Must not regress |
| --- | --- | --- | --- |
| `J-001` | `[journey]` | `[observable result]` | `[protected behavior]` |

## Business rules and invariants

| ID | Rule | Evidence/source | Change authority |
| --- | --- | --- | --- |
| `BR-001` | `[rule stated as a testable fact]` | `[link/file/owner]` | `[who may approve a change]` |

Rules should be specific enough to test. If a rule cannot be verified, record it under Open questions instead of presenting it as fact.

## Domain vocabulary

| Term | Canonical meaning | Do not confuse with |
| --- | --- | --- |
| `[term]` | `[meaning]` | `[similar but different term]` |

Agents should use this vocabulary in plans, code, tests, and user-facing output.

## Data and compliance boundaries

- Sensitive data: `[types and handling rules]`
- Retention: `[rules]`
- Access control: `[rules]`
- Audit requirements: `[rules]`
- External systems: `[trusted sources and boundaries]`

## Non-goals

- `[What this product or workflow intentionally does not do]`

## Operational priorities

Rank the priorities that resolve trade-offs:

1. `[example: correctness]`
2. `[example: backward compatibility]`
3. `[example: latency]`
4. `[example: implementation speed]`

## Open questions

| ID | Question | Why it matters | Owner |
| --- | --- | --- | --- |
| `BQ-001` | `[unknown]` | `[affected decision]` | `[owner]` |
