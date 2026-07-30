# Request-to-Result Workflow

This is the canonical execution flow for Copilot agents.

## Modes

| Mode | Entry point | Expected result |
| --- | --- | --- |
| Build | `/build` or an explicit “implement/fix/build” request | Plan, bounded implementation, verification, result |
| Plan | `/plan-change` or an ambiguous request | Evidence-backed plan; no edits |
| Verify | `/verify-change` | Independent assessment of the current diff |
| Explain | Direct question | Evidence-backed explanation; no edits |

## Phase 1 — Intake

1. Extract goal, value, acceptance criteria, constraints, and out-of-scope work.
2. Classify the mode and risk.
3. Ask only questions whose answers can change the implementation or safety.

Output state: `INTAKE` or `BLOCKED`.

## Phase 2 — Context

1. Read the relevant sections of `docs/business-context.md`.
2. Read the affected parts of `docs/system-map.md` and accepted ADRs.
3. Inspect only code, tests, and contracts needed for the request.
4. Separate facts, assumptions, and unknowns.

Output state: `CONTEXT_READY` or `BLOCKED`.

## Phase 3 — Plan

1. Describe current and desired behavior.
2. Identify callers, contracts, tests, and blast radius.
3. Record behavior that must not change.
4. Choose the smallest coherent implementation.
5. Define acceptance checks and rollback/recovery.

Use `docs/change-contract.md` for non-trivial work.

Output state: `PLAN_READY` or `BLOCKED`.

## Phase 4 — Implementation

Proceed when the user explicitly requested implementation and the risk does not require extra confirmation.

1. Implement the plan without unrelated cleanup.
2. Add or update regression coverage.
3. Keep public interfaces compatible unless the approved plan changes them.
4. Reassess if the discovered blast radius is larger than planned.

Output state: `IMPLEMENTED` or `BLOCKED`.

## Phase 5 — Verification

Verification is a separate reasoning pass:

1. Review the exact diff.
2. Map each acceptance criterion to evidence.
3. Run relevant tests and contract checks.
4. Check protected behavior and adjacent critical paths.
5. Search for hidden assumptions, stale docs, skipped errors, and accidental scope.

The verifier reports findings; it does not silently repair them.

Output state: `VERIFIED`, `CHANGES_REQUIRED`, or `BLOCKED`.

## Phase 6 — Result

Return `templates/result.md` with:

- user-visible outcome;
- exact file effects;
- compatibility statement;
- validation evidence;
- remaining risk and next action.

Output state: `DONE`, `PLAN_READY`, or `BLOCKED`.

## Risk guide

| Risk | Typical examples | Gate |
| --- | --- | --- |
| Low | Docs, isolated internal behavior, test-only change | Explicit implementation request |
| Medium | Shared component, dependency change, observable behavior | Plan plus regression evidence |
| High | Auth, secrets, destructive action, persistent schema, public contract removal, deployment | Explicit additional confirmation and recovery plan |

When risk is uncertain, classify upward and explain why.
