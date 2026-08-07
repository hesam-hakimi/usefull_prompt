# Definition of Done

A task is done only when all applicable items are true.

## Context, target, and scope

- The requested outcome and acceptance criteria are explicit.
- The target type, workspace root, canonical source, and destination were resolved.
- Delivery classification is explicit: `source-only`, `shipped-extension`, or `operational-only`.
- Protected maintainer paths were identified.
- Relevant business rules, contracts, manifests, writers, consumers, package inputs, and runtime path were identified when applicable.
- Unknowns that affect correctness were resolved or reported.
- Out-of-scope work was not mixed into the change.

## Implementation

- The diff is the smallest coherent implementation of the requested outcome.
- Product assets were changed at their canonical source or generator.
- Existing public behavior is preserved unless intentionally changed.
- `@etl /workflow create` remains functional when in scope.
- Unmanaged consumer assets remain untouched.
- New behavior has tests or documented, approved verification evidence.
- No secrets, customer values, or unsupported assumptions were added.

## Verification

- The exact diff and resolved target were reviewed.
- Relevant tests and validation commands passed.
- Write-capable tests used isolated temporary consumer workspaces.
- Tests left the extension repository’s control plane unchanged unless maintainer workflow was explicitly the target.
- Windows and POSIX path behavior was considered where paths changed.
- Acceptance criteria were checked one by one.
- Compatibility and adjacent critical paths were considered.
- Skipped checks and remaining risks are explicit.
- A fresh independent Verifier reviewed the required stage for every non-trivial mutating task.

## Delivery classification

### `source-only`

A source-only task may reach `DONE` after independent source verification when the user explicitly does not want the change packaged or installed.

### `shipped-extension`

A shipped-extension task is **not done** at source verification. All applicable items below must be true:

- package/version identity is distinguishable from the active/installed build when needed;
- canonical build completed successfully;
- the VSIX/package was created;
- package contents and manifest/version were independently verified;
- the exact verified package was locally installed once;
- installation state was reported as `INSTALLED_NOT_ACTIVATED` until host reload/restart;
- the active runtime version was confirmed after reload/restart;
- the narrowest live smoke scenario exercised the specific changed path;
- any mutating consumer smoke used the normal exact preview/write approval boundary;
- a fresh Verifier reviewed live evidence when required by the changed-path contract;
- the final lifecycle state reached `POST_INSTALL_VERIFIED`.

Only then may a shipped-extension task reach `DONE`.

The same implementation/fix task owns this bounded local build/package/verify/install/activation/smoke chain. Do not require a second user request merely to perform those routine local delivery steps. Publish, marketplace release, deployment, production actions, destructive external changes, and unrelated consumer writes remain separately approval-gated.

### `operational-only`

An operational-only task is done only when the exact requested lifecycle segment is completed and its evidence is reported. Do not infer later states from earlier ones.

## Delivery report

- The final result follows `templates/result.md`.
- Changed, deleted, protected, and intentionally untouched files are reported.
- Package path/version, installed version, active version, and smoke evidence are reported when applicable.
- Rollback/recovery is clear for medium/high-risk changes.
- Documentation and decisions match the shipped behavior.
