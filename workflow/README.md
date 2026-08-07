# Agent Workflow Contract

This directory defines the repository’s mandatory task lifecycle, target policy, handoff rules, delivery behavior, and completion gates.

The workflow applies to all maintainer agents operating in this repository.

For shipped extension changes, `workflow/shipped-extension-delivery.md` is part of this contract. For evidence and recovery, use `workflow/execution-recovery.md`.

## Delivery classification

Every mutating extension task is exactly one of:

- `source-only` — documentation, maintainer workflow, tests, or source work the user explicitly does not want packaged or installed;
- `shipped-extension` — extension code, parser/runtime behavior, packaged Copilot assets, tool registration, manifests, dependencies, or any product behavior that must be exercised from the installed VSIX;
- `operational-only` — a standalone build/package/install/activation/smoke request against already-existing source.

An implementation/fix/change request classified as `shipped-extension` owns one bounded local delivery chain for the exact task artifact. The user must not be required to send separate messages merely to build, package, verify, or locally install that same artifact.

This local delivery authorization never includes marketplace publishing, remote deployment, production actions, destructive external changes, or unrelated consumer writes.

## Primary lifecycle

The normal source lifecycle is:

```text
INTAKE
  ↓
TARGET_RESOLVED
  ↓
CONTEXT_READY
  ↓
PLAN_READY
  ↓
IMPLEMENTING
  ↓
IMPLEMENTED
  ↓
VERIFIED
```

What happens next depends on delivery classification:

```text
source-only:
VERIFIED → DONE

shipped-extension:
VERIFIED
  ↓
BUILT
  ↓
PACKAGED
  ↓
PACKAGE_VERIFIED
  ↓
INSTALLED_NOT_ACTIVATED
  ↓
ACTIVATED_NOT_SMOKE_TESTED
  ↓
POST_INSTALL_VERIFIED
  ↓
DONE

operational-only:
perform only the explicitly requested operational stages
```

At any stage, the task may move to `BLOCKED`.

`BLOCKED` is required when correctness, authorization, target ownership, evidence, tooling, or validation cannot be established safely.

## Agent topology

The default automatic workflow is:

```text
User request
    ↓
Orchestrator
    ↓
Evidence Researcher, when required
    ↓
Planner
    ↓
Orchestrator implementation
    ↓
Source/package validation
    ↓
Fresh Verifier
    ↓
source-only → final response
    ↓
shipped-extension → local install → reload → live smoke → fresh live Verifier when required → final response
```

The user should interact with the Orchestrator.

The user is not expected to switch manually between agents or to create artificial follow-up tasks for routine shipped-extension delivery stages.

## Roles

### Orchestrator

The Orchestrator owns the task lifecycle.

Responsibilities:

- classify the request and delivery mode;
- resolve target ownership;
- display the target-resolution report;
- gather relevant context;
- invoke Evidence Researcher when required;
- delegate planning;
- review and narrow the plan when necessary;
- implement the approved scope;
- run source validation;
- build/package/verify/install shipped-extension artifacts when applicable;
- delegate independent verification;
- correct grounded verified defects before the package-verification boundary;
- resume the same shipped-extension task after host reload when the exact installed package is unchanged and checkpoint state remains trustworthy;
- run the narrowest changed-path live smoke;
- return the final result or exact non-terminal lifecycle state.

The Orchestrator must not claim independent verification unless a fresh Verifier actually performed it.

### Planner

The Planner is read-only.

Responsibilities:

- evaluate the request and evidence;
- identify current and desired behavior;
- define scope and exclusions;
- identify affected contracts and tests;
- identify protected paths;
- classify delivery;
- propose the smallest coherent plan;
- identify risks and blockers;
- for `shipped-extension`, include version/package identity, canonical build/package path, package verification, local install, activation boundary, and exact live smoke criteria.

The Planner returns `PLAN_READY` or `PLAN_BLOCKED`.

The Planner does not edit files, run destructive commands, publish, deploy, install, or approve writes.

### Verifier

The Verifier is fresh and read-only.

Responsibilities:

- independently inspect target resolution and delivery classification;
- compare implementation with the original request;
- inspect exact changed files;
- inspect compatibility and protected paths;
- review test evidence;
- inspect package identity/content evidence when applicable;
- reproduce relevant validation when possible;
- separate pre-existing failures from new regressions;
- distinguish package verification, installation, activation, and live runtime proof;
- reject unsupported completion claims.

The Verifier returns `VERIFIED`, `CHANGES_REQUIRED`, or `BLOCKED`.

A pre-install `VERIFIED` result for `shipped-extension` means the verified package may continue to local install. It does not mean the task is `DONE`.

## State contract

### `INTAKE`

Entry condition:

- a new user request has arrived.

Required work:

- assign a task ID;
- classify the request;
- classify delivery;
- extract outcome, acceptance criteria, constraints, exclusions, and target hints;
- determine whether it is read-only, mutating, or operational.

Exit condition:

- the request is sufficiently understood to resolve its target.

A genuinely new mutating or operational user message begins a new task at `INTAKE`.

Examples of later standalone requests that are new tasks:

- “now build it” after the earlier task ended;
- “bump the version” as a new request;
- “install the VSIX” when no active shipped-extension task already authorizes the install;
- “publish it”;
- “make one more change”;
- “repair the generated agents”;
- “upgrade the workflow assets”.

Do not apply this new-task rule between build/package/verify/install/activation/smoke stages that are already part of the same authorized `shipped-extension` task.

Previous approvals and verification evidence do not carry into a genuinely new task.

### `TARGET_RESOLVED`

Required work:

- classify the target;
- classify delivery;
- resolve the workspace root;
- identify canonical source;
- identify generated destination;
- enumerate protected paths;
- record evidence and blockers.

Allowed target types:

```text
extension-source
consumer-etl-workspace
temporary-test-workspace
unknown
```

Mandatory visible report:

```text
Task ID:
Request class:
Target type:
Delivery classification:
Workspace root:
Canonical source:
Generated destination:
Protected paths:
Evidence:
Blockers:
```

Do not invoke Planner or edit files before emitting this report.

Exit condition:

- target ownership is explicit and safe.

If target type is `unknown`, stop with `BLOCKED`.

### `CONTEXT_READY`

Required work:

- inspect only relevant files;
- identify current behavior;
- identify desired behavior;
- locate affected callers, manifests, writers, contracts, tests, package inputs, and runtime path when applicable;
- record invariants and protected paths;
- identify conflicts in sources of truth.

Do not search unrelated folders merely to accumulate context.

When operating in a consumer workspace:

- resolve relative user paths against that workspace;
- do not search extension-source examples as fallback;
- do not request permission to read unrelated external directories;
- block if the requested consumer input is missing.

Exit condition:

- sufficient grounded evidence exists for planning.

### `PLAN_READY`

For non-trivial mutating work, the Orchestrator delegates to Planner.

Planner input must include:

- original request;
- task ID;
- target-resolution report;
- delivery classification;
- acceptance criteria;
- relevant evidence;
- current behavior;
- desired behavior;
- protected paths;
- constraints and exclusions;
- known blockers.

Planner output must include:

```text
Status: PLAN_READY | PLAN_BLOCKED
Current behavior:
Desired behavior:
Scope:
Out of scope:
Files/components:
Contracts:
Tests:
Risks:
Implementation sequence:
Delivery sequence:
Verification contract:
```

For `shipped-extension`, `Delivery sequence` must cover package/version identity, canonical build/package commands, package verification, one local install, host reload boundary, and exact changed-path smoke criteria.

The Orchestrator reviews the plan before implementation.

Exit condition:

- the Orchestrator accepts a bounded plan.

### `IMPLEMENTING`

Required behavior:

- edit only the resolved canonical source;
- keep the diff narrow;
- preserve public contracts unless change is required;
- add or update regression tests;
- avoid unrelated cleanup;
- preserve unrelated working-tree changes;
- keep protected paths untouched.

If implementation evidence invalidates the plan, return to `CONTEXT_READY` or `PLAN_READY`.

### `IMPLEMENTED`

Entry requirements:

- planned source change is complete;
- exact diff has been inspected;
- relevant targeted checks have run;
- target resolution remains unchanged.

This is not a completion state.

For `source-only`, prepare the normal independent verification handoff.

For `shipped-extension`, continue through the planned build/package path, verify package contents, record exact package identity/path, then create the pre-install independent verification handoff.

### `VERIFIED`

The Verifier must independently confirm the applicable stage:

1. target and ownership are correct;
2. delivery classification is correct;
3. requested behavior is implemented;
4. acceptance criteria for the current stage are satisfied;
5. protected paths remain untouched;
6. compatibility is preserved or intentionally changed;
7. tests support the result;
8. pre-existing failures are not misreported as new successes or regressions;
9. Windows and POSIX behavior is covered where path logic changed;
10. generated output uses the intended workspace;
11. no external-directory fallback was introduced;
12. package identity/content matches the exact source diff when applicable.

A Verifier response must use:

```text
Status: VERIFIED | CHANGES_REQUIRED | BLOCKED
Lifecycle stage:
Target:
Delivery classification:
Acceptance criteria:
Changed files:
Protected paths:
Validation reproduced:
Package/runtime identity:
Compatibility:
Findings:
Residual risk:
```

If `CHANGES_REQUIRED`, the task returns to `IMPLEMENTING` when remediation is still valid inside the current task.

After corrections, use a fresh verification pass.

For `source-only`, `VERIFIED` may lead to `DONE`.

For `shipped-extension`, pre-install `VERIFIED` leads to local installation; it is not task completion.

### `DONE`

`DONE` is allowed only when:

- the exact task has been verified;
- all material acceptance criteria pass;
- risks are reported;
- files and checks are enumerated;
- Planner and Verifier outcomes are recorded when required;
- for `shipped-extension`, the lifecycle reached `POST_INSTALL_VERIFIED` against the newly active version.

`DONE` applies only to the exact task, diff, package identity when applicable, and artifacts verified.

A later standalone operational request starts again at `INTAKE`.

## Target ownership matrix

| Target class | Canonical source | Destination | Mutation policy |
| --- | --- | --- | --- |
| Maintainer workflow | `.github/**`, `AGENTS.md`, `workflow/**` | Extension repository | Only by explicit request |
| Product Copilot assets | `resources/copilot/**` | VSIX/package | Edit canonical source, then follow shipped-extension delivery when installed behavior must change |
| Product generation logic | `src/customization/**` | Runtime-generated consumer files | Edit implementation/tests; follow shipped-extension delivery when runtime behavior changes |
| Consumer generated assets | Packaged templates and generator | `<consumer-workspace>/.github/**` | Preview, validate, approve, then write |
| Test generated assets | Test fixture source | Temporary workspace | Never write to repository root |

## Generated-agent boundary

The same relative path can have different ownership in different repositories.

```text
<extension-source>/.github/agents/**
```

contains maintainer agents.

```text
<extension-source>/resources/copilot/agents/**
```

contains product templates shipped by the extension.

```text
<consumer-workspace>/.github/agents/**
```

contains managed ETL agents generated for the end user.

Rules:

- changing a product agent means changing its packaged template or generator;
- changing a maintainer agent requires explicit maintainer-workflow authorization;
- consumer output is not the canonical source;
- unmanaged consumer agents must not be overwritten;
- managed ownership must be proven through stable IDs and manifest evidence.

## Consumer input resolution

A consumer-relative file must be resolved as:

```text
resolve(selectedWorkspaceRoot, userSuppliedRelativePath)
```

The resolver must ensure:

```text
resolvedPath ∈ selectedWorkspaceRoot
```

It must not fall back to:

- extension source;
- extension installation directory;
- development fixtures;
- documentation samples;
- `process.cwd()`;
- the first workspace folder without explicit selection in a multi-root workspace.

If the file is missing, report:

```text
BLOCKED: requested consumer input was not found under the selected workspace.
```

Do not ask for broad external-directory access unless the user explicitly selected an external input.

## Test isolation

Write-capable tests must:

1. create a unique temporary directory;
2. initialize the minimum consumer fixture;
3. pass the fixture root explicitly;
4. classify it as `temporary-test-workspace`;
5. verify containment;
6. perform writes only inside it;
7. clean up after success and failure;
8. confirm repository `.github/**` remains unchanged unless maintainer workflow itself is the explicit test target.

Forbidden test destinations:

```text
process.cwd()
repository root
extension development path
extension installation path
unvalidated workspaceFolders[0]
```

## Windows compatibility contract

All path-sensitive changes must be tested on Windows-style and POSIX-style paths.

Required properties:

- separator normalization;
- drive-letter handling;
- case-aware or case-insensitive comparison as appropriate;
- safe containment;
- no traversal;
- no cross-drive false containment;
- spaces in paths;
- portable serialized manifest paths;
- temporary-directory cleanup.

Do not compare paths using raw string prefixes.

Unsafe:

```ts
candidate.startsWith(workspaceRoot)
```

Safer conceptual form:

```ts
const relative = path.relative(workspaceRoot, candidate);
const contained =
  relative !== "" &&
  !relative.startsWith("..") &&
  !path.isAbsolute(relative);
```

The implementation must also handle equality with the workspace root when equality is valid for the operation.

## Build and installation lifecycle

These are separate evidence states:

```text
SOURCE_VERIFIED
  → BUILT
  → PACKAGED
  → PACKAGE_VERIFIED
  → INSTALLED_NOT_ACTIVATED
  → ACTIVATED_NOT_SMOKE_TESTED
  → POST_INSTALL_VERIFIED
```

The complete rules are in `workflow/shipped-extension-delivery.md`.

### `BUILT`

Evidence:

- build command;
- exit code;
- source version;
- output path.

### `PACKAGED`

Evidence:

- package command;
- produced package path;
- produced version.

### `PACKAGE_VERIFIED`

Evidence:

- bundle included;
- required templates/resources/registrations included when applicable;
- forbidden files absent;
- manifest/version checks pass;
- package corresponds to the exact verified source diff.

### `INSTALLED_NOT_ACTIVATED`

For a verified `shipped-extension` artifact, install exactly the verified local package once as part of the same task.

Installation succeeded, but the running VS Code window may still use the previous extension version.

Required user/environment action:

```text
Developer: Reload Window
```

or restart the host.

The reload itself does not start a new task for the exact unchanged installed package.

### `ACTIVATED_NOT_SMOKE_TESTED`

The installed version is confirmed active, but the changed behavior has not yet been exercised live.

### `POST_INSTALL_VERIFIED`

The newly activated extension passed a live scenario covering the changed behavior.

Installation alone must never be reported as full product verification.

## Approval boundary

Approval belongs to exact scope and identity.

For a `shipped-extension` implementation/fix/change, the original request authorizes the routine bounded local version/build/package/package-verification/install/activation/read-only-smoke chain for the exact unchanged artifact.

Approval is still separately required for:

- mutating consumer writes or smoke scenarios under the normal preview/write contract;
- marketplace publishing;
- remote deployment;
- production actions;
- destructive external changes;
- other operations outside the accepted task.

Approval or verification is invalidated when content, destination, workspace, target, or verified package identity changes.

The writer must fail closed when previewed and requested state differ.

## Result format

Use `templates/result.md`.

Minimum report:

```text
Status:
Task ID:
Delivery classification:

Target resolution:
- target type
- workspace root
- canonical source
- destination
- protected paths

Outcome:

Files:
- created
- changed
- deleted
- untouched

Compatibility:

Validation:

Delivery evidence:
- source/package/installed/active versions
- package path
- activation state
- smoke result

Delegation:
- Evidence Researcher when required
- Planner
- pre-install Verifier
- live Verifier when required

Risks:
```

## Stop rather than guess

Use `BLOCKED` when:

- target ownership is unknown;
- a consumer file is missing and only an external fallback exists;
- canonical source cannot be found;
- required business evidence conflicts;
- the requested operation exceeds authorization;
- independent verification cannot be performed;
- a generated destination escapes the selected workspace;
- validation cannot establish safety.

A blocker is a valid workflow outcome. Fabricated certainty is not.
