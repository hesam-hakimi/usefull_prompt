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

## Consumer workspace and external-path policy

When the extension runs in a consumer ETL workspace:

1. Resolve every user-supplied relative path against the explicitly selected consumer workspace.
2. Do not search the extension source repository for a similarly named file.
3. Do not fall back to examples, documentation, fixtures, or sample files located in the extension source repository.
4. Do not request access to an external directory merely because the requested consumer file was not found.
5. Packaged product resources may be loaded only through the extension’s supported packaged-resource mechanism.
6. An external file may be read only when:
   - the user explicitly selected that exact file or directory;
   - it is necessary for the current request;
   - the resolved path is displayed before reading;
   - the platform’s permission flow approves access.
7. If a referenced consumer file cannot be found under the selected workspace, stop and report the missing relative path.

For example, a request referring to:

```text
sttm/CD-Renewal_DataMapping_V2.2 1.xlsx
```

must first resolve to:

```text
<selected-consumer-workspace>/sttm/CD-Renewal_DataMapping_V2.2 1.xlsx
```

It must not silently resolve to an extension-development sample directory such as:

```text
<extension-source>/docs/product/sttm-document-understanding/sample_sttm/**
```

Extension examples and fixtures are development evidence, not consumer input.

## Windows and POSIX portability

The extension and its tests must work on Windows and POSIX systems.

Path handling must:

- use platform-aware filesystem APIs such as `path.resolve`, `path.join`, `path.relative`, and `path.normalize`;
- avoid constructing filesystem paths with manual `/` or `\` concatenation;
- normalize separators before comparing managed relative paths;
- account for Windows drive letters and case-insensitive path comparison where applicable;
- reject cross-drive containment assumptions;
- reject `..` traversal after resolution;
- ensure every generated destination remains inside the selected workspace;
- keep stored manifest destinations in normalized repository-relative POSIX form when a portable serialized format is required;
- never use `process.cwd()` as an implicit consumer target;
- never derive consumer output from `__dirname`, extension installation paths, or extension development paths.

Write-capable tests must use unique temporary directories created through the operating system’s temporary-directory APIs.

Windows regression tests must cover:

- drive-letter normalization;
- mixed `\` and `/` separators;
- case-insensitive containment where applicable;
- spaces in workspace and input filenames;
- multi-root workspace selection;
- traversal attempts;
- source and destination paths on different drives;
- cleanup after successful and failed tests.

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

`DONE` is terminal only for the exact task, request contract, diff, and artifacts that were verified.

For every later user message, classify it as one of:

- same-task read-only clarification;
- new read-only request;
- new mutating or operational request.

A new mutating or operational request starts a new task at `INTAKE`, even when it appears in the same chat or after a restore checkpoint.

This includes:

- version bumps;
- new edits;
- build;
- package;
- install;
- publish;
- deploy;
- repair;
- upgrade;
- regeneration;
- any action that changes files, installed software, external state, or produced artifacts.

Do not reuse a previous task’s:

- `TARGET_RESOLVED`;
- `PLAN_READY`;
- `VERIFIED`;
- approval;
- diff;
- test evidence;
- package evidence.

Package verification and successful installation do not prove that the newly installed extension is active.

Report:

- `INSTALLED_NOT_ACTIVATED` after installation but before host reload;
- `ACTIVATED_NOT_SMOKE_TESTED` after reload but before a live test;
- `POST_INSTALL_VERIFIED` only after a live smoke test executes against the newly activated version.

Follow `workflow/README.md` for the complete phase contract.

## Automatic orchestration

The user should not have to switch manually between Orchestrator, Planner, and Verifier.

For non-trivial mutating tasks, the Orchestrator must automatically coordinate this lifecycle:

```text
User
  → Orchestrator
  → Planner
  → Orchestrator implementation
  → fresh Verifier
  → Orchestrator final result
```

### Planner handoff

After `CONTEXT_READY`, the Orchestrator must invoke the Planner with:

- the original user request;
- task ID;
- target-resolution report;
- relevant evidence;
- acceptance criteria;
- constraints;
- protected paths;
- current behavior;
- desired behavior;
- known risks and blockers.

The Planner is read-only. It must return exactly one of:

- `PLAN_READY`;
- `PLAN_BLOCKED`.

The Orchestrator must review the plan critically. Planner output is advice, not permission to expand scope.

The Orchestrator may narrow the plan when evidence supports doing so, but must record the reason.

### Verifier handoff

After implementation and local validation reach `IMPLEMENTED`, the Orchestrator must invoke a **fresh Verifier**.

The Verifier must receive:

- the original request;
- target-resolution report;
- acceptance criteria;
- protected paths;
- intended change contract;
- exact changed-file list;
- exact diff or equivalent change evidence;
- tests and checks already executed;
- generated or packaged artifacts;
- known pre-existing failures.

Do not give the Verifier a conclusion to echo.

The Verifier is read-only and must independently return exactly one of:

- `VERIFIED`;
- `CHANGES_REQUIRED`;
- `BLOCKED`.

If the result is `CHANGES_REQUIRED`, the Orchestrator must:

1. return to `IMPLEMENTING`;
2. apply only grounded corrective changes;
3. rerun relevant validation;
4. invoke a fresh verification pass.

The Orchestrator may reach `DONE` only after `VERIFIED`.

### Automatic delegation exceptions

Planner delegation may be skipped only for:

- a read-only explanation;
- a trivial, mechanically obvious edit with no behavioral effect;
- an urgent correction where the user explicitly requests no planning.

Verifier delegation may not be skipped for a non-trivial mutating task.

If the platform cannot invoke the required subagent, report `BLOCKED` instead of pretending independent verification occurred.

## Intake contract

Extract these fields from the user’s request:

- desired outcome;
- reason or business value;
- acceptance criteria;
- constraints;
- explicitly out-of-scope work;
- relevant files, components, or examples;
- requested mode: plan, implement, verify, or explain;
- requested target, when explicitly provided.

Ask only focused questions that materially affect correctness.

Do not make the user restate information already available.

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

A user’s approval for one preview, manifest, write, package, install, or deployment is valid only for that exact operation.

Approval must not be reused after:

- content changes;
- destination changes;
- workspace changes;
- target changes;
- task changes;
- package rebuilds;
- host reloads;
- conversation restore checkpoints.

## Change-safety invariants

Before editing:

1. Resolve the target and canonical source.
2. Identify current and desired behavior.
3. Locate affected callers, public contracts, manifests, writers, and tests.
4. Record what must remain unchanged, including protected control-plane paths.
5. Classify risk and blast radius.
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
- use managed-asset identity and checksums when auditing, repairing, or upgrading generated assets;
- do not edit generated consumer output when the canonical source or generator should be changed;
- do not modify maintainer agents as a side effect of product-agent work.

Before completion:

- inspect the exact diff;
- confirm the resolved target did not change during implementation;
- run the smallest relevant checks first, then broader checks when available;
- verify acceptance criteria individually;
- check backward compatibility and adjacent critical paths;
- confirm tests did not modify the extension repository’s `.github/**`;
- distinguish verified facts from assumptions;
- never claim a check passed if it was not run;
- invoke the independent Verifier when required.

## Test isolation

Every write-capable test must operate in a unique temporary consumer workspace.

Required test behavior:

1. Create the fixture using the operating system’s temporary-directory APIs.
2. Populate only the minimum files needed by the scenario.
3. Pass the fixture root explicitly to the target resolver or writer.
4. Verify the resolved target is `temporary-test-workspace`.
5. Write only within that fixture.
6. Clean up in teardown or `finally`, including after failure.
7. Never delete or clean broad paths.
8. Never use the extension repository as a consumer test workspace.
9. Confirm the extension repository’s `.github/**` is unchanged after the test run.

The actual production writer must also fail closed if a test or caller supplies:

- the extension source root;
- the extension installation root;
- an unknown target;
- a destination outside the selected workspace;
- a path containing unresolved traversal;
- a destination whose ownership cannot be established.

## Regression policy

Existing behavior is presumed intentional until evidence shows otherwise.

For a behavior change, an agent must do at least one of the following:

- point to an existing test capturing the old contract and update it intentionally;
- add a characterization test before changing behavior;
- document why a test cannot be created and obtain explicit approval for the risk.

A passing test suite is necessary evidence, not proof that the requested behavior is correct.

The Verifier must also compare the implementation with:

- the original request;
- target ownership;
- acceptance criteria;
- business invariants;
- compatibility requirements;
- protected paths;
- exact output destinations.

Pre-existing failures must be demonstrated rather than asserted.

When possible, compare:

- results with the task diff applied;
- results with only the task diff temporarily removed;
- the set of failing tests in both states.

Do not modify or discard unrelated working-tree changes to produce this comparison.

## Build, package, and installation lifecycle

Build, package, install, activate, and post-install verification are separate operations.

### Build

A successful build proves only that the requested build command completed.

Report:

- exact command;
- exit code;
- relevant output artifact;
- source version;
- checks run before or during the build.

### Package

A successful package operation must be followed by package-content verification.

Verify:

- expected bundle exists;
- required packaged resources exist;
- forbidden development files are absent;
- expected agent templates are present;
- package version matches the requested version;
- package path is exact and unambiguous.

### Install

Installation is an operational mutation and requires a new task or explicit authorization.

After installation, report:

```text
INSTALLED_NOT_ACTIVATED
```

until VS Code or the relevant Extension Development Host is reloaded.

### Activation

After reload or restart, confirm that the active extension version matches the installed version.

If activation cannot be observed, report:

```text
ACTIVATION_UNVERIFIED
```

### Live smoke test

Post-install completion requires at least one live smoke check against the activated version.

The smoke check must verify the specific changed path, not merely that the extension appears in the installed-extension list.

For consumer write behavior, a valid smoke check should confirm:

- selected workspace root;
- exact previewed files;
- exact approved files;
- exact written files;
- unchanged read-only files;
- no external-directory fallback;
- no extension-source writes;
- Windows-safe path resolution where relevant.

Only then report:

```text
POST_INSTALL_VERIFIED
```

## Output contract

Every completed task must return:

1. **Status** — `done`, `blocked`, `plan-ready`, or the applicable installation lifecycle state.
2. **Target resolution** — target type, workspace root, canonical source, destination, and protected paths.
3. **Outcome** — what changed from the user’s perspective.
4. **Files** — created, changed, deleted, or intentionally untouched.
5. **Compatibility** — preserved contracts and intentional behavior changes.
6. **Validation** — exact checks run and results.
7. **Delegation evidence** — Planner and Verifier outcomes when required.
8. **Risks** — remaining uncertainty, skipped checks, or follow-up work.

Use `templates/result.md` as the detailed format.

Keep the answer concise, but never omit material risk.

## Stop conditions

Stop and report a blocker when:

- a required business rule or acceptance criterion is unknown;
- the requested change conflicts with an accepted invariant;
- exact target, workspace root, ownership, or canonical source cannot be identified safely;
- a generated-output operation resolves to extension source, installation directory, unknown target, or outside the selected workspace;
- a consumer-relative input path is missing and only an external or extension-source fallback can be found;
- a required tool or dependency is unavailable;
- required Planner or Verifier delegation cannot be performed;
- validation fails repeatedly without a grounded cause;
- completing the task would exceed the user’s authorization;
- sensitive data would need to be copied, exposed, or guessed.

Do not work around a stop condition with:

- ad hoc scripts;
- unrelated rewrites;
- direct edits to generated output;
- weakened validation;
- fabricated evidence;
- extension-source sample data;
- unapproved external-directory access;
- manual writes outside the trusted writer.
