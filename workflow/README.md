# Request-to-Result Workflow

This is the canonical execution flow for Copilot agents.

## Modes

| Mode | Entry point | Expected result |
| --- | --- | --- |
| Build | `/build` or an explicit “implement/fix/build” request | Target resolution, plan, bounded implementation, verification, result |
| Plan | `/plan-change` or an ambiguous request | Target resolution and evidence-backed plan; no edits |
| Verify | `/verify-change` | Independent assessment of the target and current diff |
| Explain | Direct question | Evidence-backed explanation; no edits |

## Phase 1 — Intake

1. Extract goal, value, acceptance criteria, constraints, out-of-scope work, and any explicitly named target.
2. Classify the mode and risk.
3. Ask only questions whose answers can change the implementation or safety.

Output state: `INTAKE` or `BLOCKED`.

## Phase 2 — Target resolution

Before planning or implementation:

1. classify the target as `extension-source`, `consumer-etl-workspace`, `temporary-test-workspace`, or `unknown`;
2. resolve and canonicalize the workspace root;
3. resolve the canonical source and intended destination;
4. identify ownership evidence and protected paths;
5. block ambiguous or unsafe targets.

Output state: `TARGET_RESOLVED` or `BLOCKED`.

An unqualified “agent” request targets an extension-produced agent. It does not authorize changes to maintainer agents under the extension repository’s `.github/agents/**`.

Generated-output operations are allowed only for:

- an explicitly selected `consumer-etl-workspace`, after preview, validation, and approval; or
- a unique `temporary-test-workspace` during a write-capable test.

Use platform APIs for path and temporary-directory handling. Normalize Windows and POSIX paths before comparison and reject traversal outside the selected workspace.

## Phase 3 — Context

1. Read the relevant sections of `docs/business-context.md`.
2. Read the affected parts of `docs/system-map.md`, `workflow/targets.yml`, and accepted ADRs.
3. Inspect only code, manifests, writers, tests, and contracts needed for the request.
4. Separate facts, assumptions, and unknowns.

Output state: `CONTEXT_READY` or `BLOCKED`.

## Phase 4 — Plan

1. Describe current and desired behavior.
2. Identify callers, contracts, manifests, writers, tests, and blast radius.
3. Record behavior and protected paths that must not change.
4. Choose the smallest coherent implementation.
5. Define acceptance checks, test isolation, and rollback/recovery.

Use `docs/change-contract.md` for non-trivial work.

Output state: `PLAN_READY` or `BLOCKED`.

## Phase 5 — Implementation

Proceed when the user explicitly requested implementation and the risk does not require extra confirmation.

1. Implement the plan without unrelated cleanup.
2. Change generated products at their canonical source or generator.
3. Add or update regression coverage.
4. Keep public interfaces compatible unless the approved plan changes them.
5. Reassess if the discovered target or blast radius differs from the plan.

Do not remove or disable end-user agent generation. `@etl /workflow create` must retain its preview-first, approval-gated consumer generation behavior.

Output state: `IMPLEMENTED` or `BLOCKED`.

## Phase 6 — Verification

Verification is a separate reasoning pass:

1. review the exact diff and resolved target;
2. map each acceptance criterion to evidence;
3. run relevant tests and contract checks;
4. verify ownership boundaries and protected behavior;
5. confirm write-capable tests used temporary consumer workspaces;
6. confirm tests left the extension repository’s `.github/**` unchanged;
7. search for hidden assumptions, stale docs, skipped errors, path traversal, Windows path issues, and accidental scope.

The verifier reports findings; it does not silently repair them.

Output state: `VERIFIED`, `CHANGES_REQUIRED`, or `BLOCKED`.

## Phase 7 — Result

Return `templates/result.md` with:

- target resolution;
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
| Medium | Shared component, generator, dependency, or observable behavior | Plan plus regression evidence |
| High | Auth, secrets, destructive action, persistent schema, public contract removal, deployment | Explicit additional confirmation and recovery plan |

When risk is uncertain, classify upward and explain why.
