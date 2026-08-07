# Change Result

## Status

`done / plan-ready / blocked / INSTALLED_NOT_ACTIVATED / ACTIVATED_NOT_SMOKE_TESTED / POST_INSTALL_VERIFIED`

## Task identity

- Task ID:
- Request class:
- Delivery classification: `source-only / shipped-extension / operational-only`

## Target resolution

- Target type:
- Workspace root:
- Canonical source:
- Generated destination:
- Protected paths kept unchanged:
- Evidence:

## Outcome

`[What changed or what is ready from the user's perspective]`

## File effects

| File | Effect | Reason |
| --- | --- | --- |
| `[path]` | `created / changed / deleted / untouched` | `[reason]` |

## Compatibility

- Preserved:
- Intentionally changed:
- Consumers checked:
- Operating systems checked:

## Validation

| Check | Result | Evidence |
| --- | --- | --- |
| `[command/review]` | `passed / failed / not run` | `[concise evidence]` |

## Delivery evidence

For `source-only`, mark non-applicable fields `N/A`.

- Source version/commit:
- Package version:
- Package path:
- Package-content verification:
- Installed version:
- Active version:
- Host reload/restart state:
- Live smoke scenario:
- Live smoke result:
- Consumer write approval used, if any:

Do not infer activation from installation or live behavior from package verification.

## Delegation evidence

- Evidence Researcher: `not required / EVIDENCE_READY / EVIDENCE_BLOCKED`
- Planner: `PLAN_READY / PLAN_BLOCKED / skipped with allowed reason`
- Pre-install/source-package Verifier: `VERIFIED / CHANGES_REQUIRED / BLOCKED / N/A`
- Post-activation live Verifier: `VERIFIED / CHANGES_REQUIRED / BLOCKED / N/A`

## Remaining risks

- `[risk, uncertainty, or skipped check]`

## Next action

`[None, Developer: Reload Window, a focused user decision, or a bounded follow-up]`

A shipped-extension task may report `done` only after `POST_INSTALL_VERIFIED`. If local installation succeeded but the host has not reloaded, report `INSTALLED_NOT_ACTIVATED` instead of `done`.
