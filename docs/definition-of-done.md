# Definition of Done

A task is done only when all applicable items are true.

## Context, target, and scope

- The requested outcome and acceptance criteria are explicit.
- The target type, workspace root, canonical source, and destination were resolved.
- Protected maintainer paths were identified.
- Relevant business rules, contracts, manifests, writers, and consumers were identified.
- Unknowns that affect correctness were resolved or reported.
- Out-of-scope work was not mixed into the change.

## Implementation

- The diff is the smallest coherent implementation of the requested outcome.
- Product assets were changed at their canonical source or generator.
- Existing public behavior is preserved unless intentionally changed.
- `@etl /workflow create` remains functional when in scope.
- Unmanaged consumer assets remain untouched.
- New behavior has tests or documented, approved verification evidence.
- No secrets, customer values, or unsupported assumptions were added.

## Verification

- The exact diff and resolved target were reviewed.
- Relevant tests and validation commands passed.
- Write-capable tests used isolated temporary consumer workspaces.
- Tests left the extension repository’s control plane unchanged.
- Windows and POSIX path behavior was considered where paths changed.
- Acceptance criteria were checked one by one.
- Compatibility and adjacent critical paths were considered.
- Skipped checks and remaining risks are explicit.

## Delivery

- The final result follows `templates/result.md`.
- Changed, deleted, protected, and intentionally untouched files are reported.
- Rollback/recovery is clear for medium/high-risk changes.
- Documentation and decisions match the shipped behavior.
