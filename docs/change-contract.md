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
- Delivery classification: `source-only / shipped-extension / operational-only`
- Resolved workspace root:
- Canonical source:
- Generated destination:
- Ownership evidence:
- Protected paths:
- Blockers:

Delivery classification rules:

- `source-only`: documentation, maintainer workflow, tests, or source work that the user explicitly does not want packaged/installed.
- `shipped-extension`: code, packaged Copilot assets, tool registration, manifests, parser/runtime behavior, or any change that must be exercised from the installed VSIX.
- `operational-only`: a standalone build/package/install/activation/smoke request against already-existing source.

For an implementation/fix/change request classified as `shipped-extension`, the accepted task includes the bounded local delivery chain for the exact artifact: version preparation when needed, build, package, package verification, one local install, activation confirmation after host reload, and the narrowest live smoke test. Publish, marketplace release, deployment, production actions, and unrelated consumer writes remain separately approval-gated.

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

## Delivery plan

- Package identity/version strategy:
- Canonical build/package command:
- Package-content verification:
- Local install step, if `shipped-extension`:
- Activation proof after reload:
- Live smoke scenario for the changed path:
- Consumer-write approval needed during smoke: `yes / no`

For `source-only`, mark non-applicable delivery steps as `N/A` and explain why.

## Validation plan

| Acceptance criterion | Check | Expected evidence |
| --- | --- | --- |
| `[criterion]` | `[test/review]` | `[result]` |

For write-capable tests, identify the isolated temporary consumer workspace and the post-test control-plane guard.

For `shipped-extension`, validation must distinguish source checks, package verification, installed version, active version, and live smoke evidence. Installation alone is not runtime proof.

## Rollback or recovery

`[How to restore prior behavior or safely disable the change]`

## Approval

- Implementation authorized by:
- Same-task local build/package/install authorization, if `shipped-extension`:
- Consumer write approved by, if applicable:
- Publish/deploy/production approval, if applicable:
- Extra high-risk approval, if required:
