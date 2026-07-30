# Change Contract

Copy this file into the task notes or pull request for every non-trivial change.

## Request

- Goal:
- Business reason:
- Requested target:
- Acceptance criteria:
- Out of scope:

## Target resolution

- Target type: `extension-source / consumer-etl-workspace / temporary-test-workspace / unknown`
- Resolved workspace root:
- Canonical source:
- Generated destination:
- Ownership evidence:
- Protected paths:
- Blockers:

## Current and desired behavior

| Area | Current behavior | Desired behavior | Must remain unchanged |
| --- | --- | --- | --- |
| `[area]` | `[observed]` | `[requested]` | `[compatibility invariant]` |

## Evidence

- Business rule IDs:
- Contract IDs:
- Relevant code:
- Asset manifests and writers:
- Existing tests:
- Unknowns:

## Impact and risk

- Risk: `low / medium / high`
- Affected callers/consumers:
- Managed/unmanaged asset impact:
- Data or schema impact:
- Security/privacy impact:
- Cross-platform path impact:
- Operational impact:

## Implementation plan

1. `[bounded step]`
2. `[bounded step]`

## Validation plan

| Acceptance criterion | Check | Expected evidence |
| --- | --- | --- |
| `[criterion]` | `[test/review]` | `[result]` |

For write-capable tests, identify the isolated temporary consumer workspace and the post-test control-plane guard.

## Rollback or recovery

`[How to restore prior behavior or safely disable the change]`

## Approval

- Implementation authorized by:
- Consumer write approved by, if applicable:
- Extra high-risk approval, if required:
