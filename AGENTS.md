# Agent Operating Contract

This file is the canonical contract for all GitHub Copilot agents working in this repository.

## Mission

Turn user intent into the smallest correct change while preserving established business behavior, public contracts, asset ownership, and operational safety.

Natural language is an interface, not permission to guess. Agents must ground decisions in explicit user instructions, accepted business context, architecture decisions, current contracts, tests, and repository evidence.

**Do not guess.** When evidence is missing, ask, preserve the unknown, or report a blocker.

## Sources of truth

Read only what is relevant to the current request, in this order:

1. The user's current, explicit instruction.
2. Asset ownership and target policy in `workflow/targets.yml`.
3. Accepted rules and invariants in `docs/business-context.md`.
4. Accepted decisions in `docs/decisions/`.
5. Public contracts, schemas, and compatibility notes in `docs/system-map.md`.
6. Existing tests and observable behavior.
7. Implementation details.

If two sources conflict, stop and surface the conflict. Do not silently choose the most convenient source.

Blank template fields and missing documentation mean **unknown**, not permission to infer.

## Asset ownership and target resolution

Relative paths alone do not determine ownership. Always identify which workspace owns the path.

| Scope | Canonical location | Policy |
| --- | --- | --- |
| Extension maintainer control plane | `<extension-repo>/.github/**` and `AGENTS.md` | Protected; edit only when explicitly requested |
| Packaged product source | `resources/copilot/**` | Canonical source for extension-delivered agents, prompts, skills, instructions, and knowledge |
| Runtime generation logic | `src/customization/**` | Creates, audits, repairs, and upgrades managed consumer assets |
| Consumer-generated output | `<consumer-workspace>/.github/**` | Generated only after preview, validation, and approval |
| Test output | Unique temporary consumer workspace | The only permitted generated-output location during tests |

Before planning or editing an agent, prompt, instruction, workflow, or generated asset, report:

- target type;
- resolved workspace root;
- canonical source;
- generated destination, if applicable;
- protected paths that will remain untouched;
- evidence and blockers.

Allowed target types:

- `extension-source`;
- `consumer-etl-workspace`;
- `temporary-test-workspace`;
- `unknown`.

If the user says “agent” without qualification, interpret it as an extension-produced agent. Resolve its source under `resources/copilot/agents/**`.

Do not modify `<extension-repo>/.github/agents/**` unless the user explicitly asks to change a maintainer agent or repository-development workflow.

Generated consumer files are not source files. Modify their canonical template or generator, then regenerate and validate them.

`@etl /workflow create` must continue generating managed ETL agents under the selected consumer workspace’s `.github/agents/**`, but only after preview and explicit approval.

Tests must generate assets only inside isolated temporary consumer workspaces. They must never use the extension repository, `process.cwd()`, or the extension installation directory as an implicit destination.

If the target is `extension-source`, `unknown`, or outside the selected workspace for a generated-output operation, stop with `BLOCKED`.

## Workflow states

Every task moves through these states:

`INTAKE → TARGET_RESOLVED → CONTEXT_READY → PLAN_READY → IMPLEMENTING → IMPLEMENTED → VERIFIED → DONE`

At any state, use `BLOCKED` when required evidence, authority, tooling, target resolution, or validation is missing.

Before moving beyond `TARGET_RESOLVED`, emit a visible target-resolution report containing:

- task ID;
- request class;
- target type;
- resolved workspace root;
- canonical source;
- generated destination, if applicable;
- protected paths;
- evidence and blockers.

Do not invoke Planner, edit files, run a write-capable tool, build, package, install, publish, or deploy before this report is emitted.

`DONE` is terminal only for the exact task, request contract, diff, and artifacts that were verified. For every later user message, classify it as one of:

- same-task read-only clarification;
- new read-only request;
- new mutating or operational request.

A new mutating or operational request starts a new task at `INTAKE`, even when it appears in the same chat or after a restore checkpoint. This includes version bumps, new edits, build, package, install, publish, deploy, repair, upgrade, and any action that can change files, installed software, external state, or produced artifacts. Do not reuse a previous task's `TARGET_RESOLVED`, `PLAN_READY`, `VERIFIED`, approval, diff, or test evidence.

Package verification and successful installation do not prove that the newly installed extension is active. Report `INSTALLED_NOT_ACTIVATED` until the relevant host is reloaded or restarted. Report `POST_INSTALL_VERIFIED` only after a live smoke check runs against the newly activated version.

Follow `workflow/README.md` for the phase contract.

## Intake contract

Extract these fields from the user's request:

- desired outcome;
- reason or business value;
- acceptance criteria;
- constraints;
- explicitly out-of-scope work;
- relevant files, components, or examples;
- requested mode: plan, implement, verify, or explain;
- requested target, when explicitly provided.

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

1. Resolve the target and canonical source.
2. Identify the current behavior and the desired behavior.
3. Locate affected callers, public contracts, manifests, writers, and tests.
4. Record what must remain unchanged, including protected control-plane paths.
5. Classify the risk and blast radius.
6. For non-trivial work, complete `docs/change-contract.md`.

During implementation:

- make the narrowest coherent diff;
- preserve names and interfaces unless change is required;
- do not mix cleanup with behavior changes;
- do not delete unfamiliar code merely because it looks unused;
- add or update tests for changed behavior;
- prefer deterministic code and validation over prompt-only enforcement;
- keep secrets and customer-specific values out of prompts, logs, examples, and generated files;
- never treat every consumer file under `.github/**` as extension-owned;
- use managed-asset identity and checksums when auditing, repairing, or upgrading generated assets.

Before completion:

- inspect the exact diff;
- confirm the resolved target did not change during implementation;
- run the smallest relevant checks first, then broader checks when available;
- verify acceptance criteria one by one;
- check backward compatibility and adjacent critical paths;
- confirm tests did not modify the extension repository’s `.github/**`;
- distinguish verified facts from assumptions;
- never claim a check passed if it was not run.

## Regression policy

Existing behavior is presumed intentional until evidence shows otherwise.

For a behavior change, an agent must do at least one of the following:

- point to an existing test that captures the old contract and update it intentionally;
- add a characterization test before changing the behavior;
- document why a test cannot be created and obtain explicit approval for the risk.

A passing test suite is necessary evidence, not proof that the requested behavior is correct. The verifier must also compare the implementation with the request, ownership boundaries, and business invariants.

## Output contract

Every completed task must return:

1. **Status** — `done`, `blocked`, or `plan-ready`.
2. **Target resolution** — target type, workspace root, canonical source, destination, and protected paths.
3. **Outcome** — what changed from the user's perspective.
4. **Files** — created, changed, deleted, or intentionally untouched.
5. **Compatibility** — preserved contracts and intentional behavior changes.
6. **Validation** — exact checks run and their results.
7. **Risks** — remaining uncertainty, skipped checks, or follow-up work.

Use `templates/result.md` as the detailed format. Keep the answer concise, but never omit material risk.

## Stop conditions

Stop and report a blocker when:

- a required business rule or acceptance criterion is unknown;
- the requested change conflicts with an accepted invariant;
- the exact target, workspace root, ownership, or canonical source cannot be identified safely;
- a generated-output operation resolves to the extension source, installation directory, unknown target, or a path outside the selected workspace;
- a required tool or dependency is unavailable;
- validation fails repeatedly without a grounded cause;
- completing the task would exceed the user's authorization;
- sensitive data would need to be copied, exposed, or guessed.

Do not work around a stop condition with ad hoc scripts, unrelated rewrites, direct edits to generated output, or weakened validation.
