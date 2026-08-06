# Verify Rahona DAC Phase 0 Discovery

Use the `rahona-dac-verifier` agent.

Independently verify all public-safe Rahona Analytics Zone Data Access and Control discovery artifacts under:

`docs/rahona-dac/discovery/**`

## Required checks

- Re-check a representative sample of the most important Confluence pages, Jira issues, and accessible Excel artifacts.
- Confirm that every source is actually about the Rahona Analytics Zone Data Access and Control process, not another meaning of `DAC`.
- Confirm that factual claims are supported by their stated evidence category.
- Confirm that official policy, observed implementation, historical examples, inference, and unresolved questions are not conflated.
- Detect stale evidence, contradictions, unsupported assumptions, missing evidence, and incorrect source authority.
- Verify that historical Jira behavior was not presented as policy.
- Verify that no MAL Code, schema, table/view, owner, approver, security classification, PII/PCI flag, data treatment, request status, or timeline was invented.
- Verify that SharePoint gaps are precise enough for manual retrieval.
- Verify that public files contain no internal URLs, page IDs, raw Jira keys, employee identities, email addresses, AD groups, real asset identifiers, secrets, screenshots, copied proprietary text, or raw SharePoint content.
- Verify that no file outside `docs/rahona-dac/discovery/**` was modified by the research activity.

## Output boundary

Write only:

`docs/rahona-dac/discovery/phase-0-verification.md`

Do not modify the researcher's documents.

Use this structure:

```markdown
# Phase 0 Verification

## Verdict
PASS | PASS WITH GAPS | BLOCKED

## Scope Reviewed

## Evidence Re-checked

## Supported Findings

## Unsupported or Weakly Supported Claims

## Acronym Disambiguation Review

## Source Conflicts

## Privacy and Public-Repository Review

## Missing SharePoint Evidence

## Required Corrections

## Recommendation
```

Use exactly one verdict:

- `PASS`
- `PASS WITH GAPS`
- `BLOCKED`

Do not silently correct errors. Report exact required corrections for human review.
