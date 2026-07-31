# Request-to-Result Workflow

This is the canonical execution flow for Copilot agents.

## Modes

| Mode | Entry point | Expected result |
| --- | --- | --- |
| Build | `/build` or an explicit “implement/fix/build” request | Target resolution, delegated plan, bounded implementation, independent subagent verification, result |
| Plan | `/plan-change` or an ambiguous request | Target resolution and evidence-backed plan; no edits |
| Verify | `/verify-change` | Independent assessment of the target and current diff |
| Explain | Direct question | Evidence-backed explanation; no edits |

## Automatic subagent orchestration

`/build` uses Orchestrator as the parent agent and runs this sequence without requiring the user to switch agents:

`Orchestrator → Planner subagent → Orchestrator implementation → fresh Verifier subagent → Result`

Rules:

1. Planner and Verifier must be invoked through the agent tool as actual subagents.
2. Orchestrator must not role-play, simulate, or replace either subagent.
3. Verifier receives factual inputs: the original request, acceptance criteria, resolved target, protected paths, exact diff or operation manifest, and test evidence.
4. `VERIFIED` advances to `DONE`.
5. `CHANGES_REQUIRED` returns control to Orchestrator for the smallest grounded correction, followed by a new Verifier subagent.
6. A maximum of two remediation cycles is allowed; unresolved findings then produce `BLOCKED`.
7. `BLOCKED` stops the workflow.
8. If subagent invocation is unavailable, the workflow fails closed with `BLOCKED`.

The `handoffs` frontmatter feature is not the automation mechanism for `/build`: handoff buttons are user-guided transitions. The agent tool and the `agents` allowlist are the required automatic delegation mechanism.

## Task boundaries and re-entry

Each task has its own request contract, task ID, target resolution, plan, approval, diff or operation manifest, evidence, verification, and result.

`DONE` is terminal for that exact task only. Before acting on any later message, Orchestrator classifies it as:

- same-task read-only clarification;
- new read-only request;
- new mutating or operational request.

A new mutating or operational request restarts the state machine at `INTAKE`, even in the same chat or after a restore checkpoint. Examples include a version bump, edit, build, package, install, publish, deploy, repair, or upgrade. The new task must emit its own `TARGET_RESOLVED` report, invoke a new Planner, perform only its bounded action, and invoke a fresh Verifier. Evidence, approval, and `VERIFIED` status from a completed task cannot be reused.

Package verification and installation success prove only artifact and installation state. Until the extension host is reloaded or restarted, report `INSTALLED_NOT_ACTIVATED`. Only a live smoke check against the newly activated version may report `POST_INSTALL_VERIFIED`.

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

Immediately emit a visible report with task ID, request class, target type, workspace root, canonical source, generated destination when applicable, protected paths, evidence, and blockers. Planner invocation and all mutating or operational actions are forbidden until this report is visible.

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

1. Orchestrator invokes Planner as a subagent.
2. Planner describes current and desired behavior.
3. Planner identifies callers, contracts, manifests, writers, tests, and blast radius.
4. Planner records behavior and protected paths that must not change.
5. Planner chooses the smallest coherent implementation.
6. Planner defines acceptance checks, test isolation, and rollback/recovery.

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

Orchestrator must invoke Verifier as a fresh subagent after implementation or the bounded operational action and relevant checks.

The Verifier:

1. reviews the exact diff or operation manifest and resolved target;
2. maps each acceptance criterion to evidence;
3. runs or inspects relevant tests and contract checks;
4. verifies ownership boundaries and protected behavior;
5. confirms write-capable tests used temporary consumer workspaces;
6. confirms tests left the extension repository’s `.github/**` unchanged;
7. searches for hidden assumptions, stale docs, skipped errors, path traversal, Windows path issues, and accidental scope;
8. distinguishes packaged, installed, activated, and live-smoke-verified states.

The Verifier reports findings; it does not silently repair them.

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
