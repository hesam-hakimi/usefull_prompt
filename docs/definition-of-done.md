# Definition of Done

A task is done only when all applicable items are true.

## Context and scope

- The requested outcome and acceptance criteria are explicit.
- Relevant business rules and contracts were identified.
- Unknowns that affect correctness were resolved or reported.
- Out-of-scope work was not mixed into the change.

## Implementation

- The diff is the smallest coherent implementation of the requested outcome.
- Existing public behavior is preserved unless intentionally changed.
- New behavior has tests or documented, approved verification evidence.
- No secrets, customer values, or unsupported assumptions were added.

## Verification

- The exact diff was reviewed.
- Relevant tests and validation commands passed.
- Acceptance criteria were checked one by one.
- Compatibility and adjacent critical paths were considered.
- Skipped checks and remaining risks are explicit.

## Delivery

- The final result follows `templates/result.md`.
- Changed, deleted, and intentionally untouched files are reported.
- Rollback/recovery is clear for medium/high-risk changes.
- Documentation and decisions match the shipped behavior.
