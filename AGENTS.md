# Agent Operating Contract

This file is the canonical contract for all GitHub Copilot agents working in this repository.

## Mission

Turn user intent into the smallest correct change while preserving established business behavior, public contracts, and operational safety.

Natural language is an interface, not permission to guess. Agents must ground decisions in explicit user instructions, accepted business context, architecture decisions, current contracts, tests, and repository evidence.

**Do not guess.** When evidence is missing, ask, preserve the unknown, or report a blocker.

## Sources of truth

Read only what is relevant to the current request, in this order:

1. The user's current, explicit instruction.
2. Accepted rules and invariants in `docs/business-context.md`.
3. Accepted decisions in `docs/decisions/`.
4. Public contracts, schemas, and compatibility notes in `docs/system-map.md`.
5. Existing tests and observable behavior.
6. Implementation details.

If two sources conflict, stop and surface the conflict. Do not silently choose the most convenient source.

Blank template fields and missing documentation mean **unknown**, not permission to infer.

## Workflow states

Every task moves through these states:

`INTAKE → CONTEXT_READY → PLAN_READY → IMPLEMENTING → IMPLEMENTED → VERIFIED → DONE`

At any state, use `BLOCKED` when required evidence, authority, tooling, or validation is missing.

Follow `workflow/README.md` for the phase contract.

## Intake contract

Extract these fields from the user's request:

- desired outcome;
- reason or business value;
- acceptance criteria;
- constraints;
- explicitly out-of-scope work;
- relevant files, components, or examples;
- requested mode: plan, implement, verify, or explain.

Ask only focused questions that materially affect correctness. Do not make the user restate information already available.

## Authorization and risk

An explicit instruction such as “implement”, “build”, “fix”, or “change” authorizes in-scope workspace edits after a plan is formed.

Additional confirmation is required before:

- destructive or irreversible changes;
- authentication, authorization, security, privacy, or secret-handling changes;
- persistent data migrations or schema compatibility breaks;
- removal or incompatible change of a public API, event, CLI, file format, or data contract;
- broad refactors whose blast radius cannot be bounded;
- deployment, publishing, external messages, or production actions.

When the request is ambiguous about mutation, return a plan and wait.

## Change-safety invariants

Before editing:

1. Identify the current behavior and the desired behavior.
2. Locate affected callers, public contracts, and tests.
3. Record what must remain unchanged.
4. Classify the risk and blast radius.
5. For non-trivial work, complete `docs/change-contract.md`.

During implementation:

- make the narrowest coherent diff;
- preserve names and interfaces unless change is required;
- do not mix cleanup with behavior changes;
- do not delete unfamiliar code merely because it looks unused;
- add or update tests for changed behavior;
- prefer deterministic code and validation over prompt-only enforcement;
- keep secrets and customer-specific values out of prompts, logs, examples, and generated files.

Before completion:

- inspect the exact diff;
- run the smallest relevant checks first, then broader checks when available;
- verify acceptance criteria one by one;
- check backward compatibility and adjacent critical paths;
- distinguish verified facts from assumptions;
- never claim a check passed if it was not run.

## Regression policy

Existing behavior is presumed intentional until evidence shows otherwise.

For a behavior change, an agent must do at least one of the following:

- point to an existing test that captures the old contract and update it intentionally;
- add a characterization test before changing the behavior;
- document why a test cannot be created and obtain explicit approval for the risk.

A passing test suite is necessary evidence, not proof that the requested behavior is correct. The verifier must also compare the implementation with the request and business invariants.

## Output contract

Every completed task must return:

1. **Status** — `done`, `blocked`, or `plan-ready`.
2. **Outcome** — what changed from the user's perspective.
3. **Files** — created, changed, deleted, or intentionally untouched.
4. **Compatibility** — preserved contracts and intentional behavior changes.
5. **Validation** — exact checks run and their results.
6. **Risks** — remaining uncertainty, skipped checks, or follow-up work.

Use `templates/result.md` as the detailed format. Keep the answer concise, but never omit material risk.

## Stop conditions

Stop and report a blocker when:

- a required business rule or acceptance criterion is unknown;
- the requested change conflicts with an accepted invariant;
- the exact target cannot be identified safely;
- a required tool or dependency is unavailable;
- validation fails repeatedly without a grounded cause;
- completing the task would exceed the user's authorization;
- sensitive data would need to be copied, exposed, or guessed.

Do not work around a stop condition with ad hoc scripts, unrelated rewrites, or weakened validation.
