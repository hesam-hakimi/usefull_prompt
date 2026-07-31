# Agent Workflow Contract

This directory defines the repository’s mandatory task lifecycle, target policy, handoff rules, and completion gates.

The workflow applies to all maintainer agents operating in this repository.

## Primary lifecycle

Every task follows this state machine:

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
  ↓
DONE
```

At any stage, the task may move to:

```text
BLOCKED
```

`BLOCKED` is required when correctness, authorization, target ownership, or validation cannot be established safely.

## Agent topology

The default automatic workflow is:

```text
User request
    ↓
Orchestrator
    ↓
Planner
    ↓
Orchestrator implementation
    ↓
Fresh Verifier
    ↓
Orchestrator final response
```

The user should interact with the Orchestrator.

The user is not expected to switch manually between agents.

## Roles

### Orchestrator

The Orchestrator owns the task lifecycle.

Responsibilities:

- classify the request;
- resolve target ownership;
- display the target-resolution report;
- gather relevant context;
- delegate planning;
- review and narrow the plan when necessary;
- implement the approved scope;
- run validation;
- delegate independent verification;
- correct verified defects;
- return the final result.

The Orchestrator must not claim independent verification unless a fresh Verifier actually performed it.

### Planner

The Planner is read-only.

Responsibilities:

- evaluate the request and evidence;
- identify current and desired behavior;
- define scope and exclusions;
- identify affected contracts and tests;
- identify protected paths;
- propose the smallest coherent plan;
- identify risks and blockers.

The Planner returns:

```text
PLAN_READY
```

or:

```text
PLAN_BLOCKED
```

The Planner does not edit files, run destructive commands, publish, deploy, install, or approve writes.

### Verifier

The Verifier is fresh and read-only.

Responsibilities:

- independently inspect target resolution;
- compare implementation with the original request;
- inspect exact changed files;
- inspect compatibility and protected paths;
- review test evidence;
- reproduce relevant validation when possible;
- separate pre-existing failures from new regressions;
- reject unsupported completion claims.

The Verifier returns:

```text
VERIFIED
```

```text
CHANGES_REQUIRED
```

or:

```text
BLOCKED
```

## State contract

### `INTAKE`

Entry condition:

- a new user request has arrived.

Required work:

- assign a task ID;
- classify the request;
- extract outcome, acceptance criteria, constraints, exclusions, and target hints;
- determine whether it is read-only, mutating, or operational.

Exit condition:

- the request is sufficiently understood to resolve its target.

A new mutating or operational user message always begins a new task at `INTAKE`.

Examples:

- “now build it”;
- “bump the version”;
- “install the VSIX”;
- “publish it”;
- “make one more change”;
- “repair the generated agents”;
- “upgrade the workflow assets”.

Previous approvals and verification evidence do not carry into the new task.

### `TARGET_RESOLVED`

Required work:

- classify the target;
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
- locate affected callers, manifests, writers, contracts, and tests;
- record invariants and protected paths;
- identify conflicts in sources of truth.

Do not search unrelated folders to accumulate context.

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
Verification contract:
```

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

- planned change is complete;
- exact diff has been inspected;
- relevant targeted checks have run;
- generated or packaged artifacts have been inspected when applicable;
- target resolution remains unchanged.

This is not a completion state.

The Orchestrator must now create the verification handoff.

### `VERIFIED`

The Verifier must independently confirm:

1. target and ownership are correct;
2. requested behavior is implemented;
3. acceptance criteria are satisfied;
4. protected paths remain untouched;
5. compatibility is preserved or intentionally changed;
6. tests support the result;
7. pre-existing failures are not misreported as new successes or regressions;
8. Windows and POSIX behavior is covered where path logic changed;
9. generated output uses the intended workspace;
10. no external-directory fallback was introduced.

A Verifier response must use:

```text
Status: VERIFIED | CHANGES_REQUIRED | BLOCKED
Target:
Acceptance criteria:
Changed files:
Protected paths:
Validation reproduced:
Compatibility:
Findings:
Residual risk:
```

If `CHANGES_REQUIRED`, the task returns to `IMPLEMENTING`.

After corrections, use a fresh verification pass.

### `DONE`

`DONE` is allowed only when:

- the exact task has been verified;
- all material acceptance criteria pass;
- risks are reported;
- files and checks are enumerated;
- Planner and Verifier outcomes are recorded when required.

`DONE` applies only to the exact task, diff, and artifacts verified.

A later operational request starts again at `INTAKE`.

## Target ownership matrix

| Target class | Canonical source | Destination | Mutation policy |
| --- | --- | --- | --- |
| Maintainer workflow | `.github/**`, `AGENTS.md`, `workflow/**` | Extension repository | Only by explicit request |
| Product Copilot assets | `resources/copilot/**` | VSIX/package | Edit source, then package and verify |
| Product generation logic | `src/customization/**` | Runtime-generated consumer files | Edit implementation and tests |
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
8. confirm repository `.github/**` remains unchanged.

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

These are separate states:

```text
SOURCE_VERIFIED
  → BUILT
  → PACKAGED
  → PACKAGE_VERIFIED
  → INSTALLED_NOT_ACTIVATED
  → ACTIVATED_NOT_SMOKE_TESTED
  → POST_INSTALL_VERIFIED
```

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
- required templates included;
- forbidden files absent;
- manifest checks pass.

### `INSTALLED_NOT_ACTIVATED`

Installation succeeded, but the running VS Code window may still use the previous extension version.

Required user action:

```text
Developer: Reload Window
```

or restart the host.

### `ACTIVATED_NOT_SMOKE_TESTED`

The installed version is active, but the changed behavior has not yet been exercised live.

### `POST_INSTALL_VERIFIED`

The activated extension passed a live scenario covering the changed behavior.

Installation alone must never be reported as full product verification.

## Approval boundary

Approval belongs to:

- one task;
- one preview;
- one manifest;
- one workspace;
- one selected artifact set;
- one exact content checksum;
- one operational action.

Approval is invalid if any of these change.

The writer must fail closed when previewed and requested state differ.

## Result format

Use `templates/result.md`.

Minimum final report:

```text
Status:
Task ID:

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

Delegation:
- Planner
- Verifier

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
