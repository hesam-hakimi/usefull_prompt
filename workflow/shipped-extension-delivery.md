# Shipped Extension Delivery Contract

This contract defines the mandatory local delivery lifecycle for changes that must be exercised from the installed Databricks ETL Copilot VSIX. It supplements `AGENTS.md`, `workflow/README.md`, and `workflow/execution-recovery.md`.

## Classification

Every extension mutation must be classified as exactly one of:

- `source-only` — documentation, maintainer workflow, tests, or source work the user explicitly does not want packaged or installed;
- `shipped-extension` — extension code, parser/runtime behavior, packaged Copilot assets, tool registration, manifests, dependencies, or any product behavior that must be observed from the installed VSIX;
- `operational-only` — a standalone build/package/install/activation/smoke request against already-existing source.

An explicit implementation/fix/change request classified as `shipped-extension` authorizes one bounded **local** delivery chain for the exact artifact produced by that task. The user must not be required to send separate follow-up messages merely to build, package, verify, or locally install that same artifact.

This authorization does **not** include marketplace publishing, remote deployment, production actions, destructive external changes, or unrelated consumer-workspace writes.

## Mandatory lifecycle

A `shipped-extension` task does not end at source verification.

```text
INTAKE
→ TARGET_RESOLVED
→ CONTEXT_READY
→ PLAN_READY
→ IMPLEMENTING
→ IMPLEMENTED
→ SOURCE_VERIFIED
→ BUILT
→ PACKAGED
→ PACKAGE_VERIFIED
→ INSTALLED_NOT_ACTIVATED
→ ACTIVATED_NOT_SMOKE_TESTED
→ POST_INSTALL_VERIFIED
→ DONE
```

`BLOCKED` may occur at any stage.

For `source-only`, the normal lifecycle may finish after independent source verification. For `operational-only`, start at `INTAKE`, resolve the exact existing artifact, and perform only the requested operational stages.

## Required execution sequence

For `shipped-extension` work:

1. Resolve target ownership and emit the normal target-resolution report before mutation.
2. Plan the source change **and** the delivery path. The plan must identify package identity/version handling, canonical build/package commands, package verification, local install, host reload boundary, and the exact live smoke scenario.
3. Implement the smallest coherent diff and run the relevant source tests.
4. If the package version would collide with the currently active or installed artifact and the user did not specify a version, use the next patch version only. Never auto-bump minor or major versions.
5. Build using the repository's canonical build path.
6. Create the VSIX/package.
7. Verify the package before installation. At minimum verify:
   - expected extension/version identity;
   - expected compiled bundle(s);
   - required `resources/copilot/**` product assets when applicable;
   - required tool/agent/prompt/skill registrations when applicable;
   - absence of forbidden development-only or machine-specific files;
   - exact package path.
8. Invoke a fresh independent Verifier with the original request, exact diff, tests, package identity, package path, and package-content evidence.
9. If the Verifier returns `VERIFIED`, locally install **exactly that verified package once**. Do not publish or deploy it.
10. After installation, report `INSTALLED_NOT_ACTIVATED` and emit an execution checkpoint. Do not claim the new behavior is live until the host reloads/restarts.
11. The required host reload/restart is a user/environment action, not a new task. Resume the same task after reload only when the exact installed package/version is unchanged and trusted checkpoint state is still provable.
12. Confirm the active runtime version before smoke testing.
13. Run the narrowest live smoke scenario that exercises the changed path. Read-only smoke is included in the shipped-extension delivery task. A mutating consumer smoke still requires the normal preview/write approval for the exact workspace and files.
14. When the changed-path contract requires independent live confirmation, invoke a fresh Verifier on the observed runtime evidence.
15. Report `POST_INSTALL_VERIFIED` only after the newly active version passes the changed live scenario. Only then may the shipped-extension task reach `DONE`.

## Checkpoints

Emit `## Execution Checkpoint` after:

- implementation;
- package verification;
- installation;
- before host reload/restart;
- activation confirmation;
- live smoke;
- any blocker or handoff.

The checkpoint must preserve the exact source version, package version/path, installed version, active version when known, changed files, checks run, and next allowed action.

## Failure and remediation boundaries

Before `PACKAGE_VERIFIED`, grounded same-task remediation may continue within the accepted scope and remediation-cycle limit.

After `PACKAGE_VERIFIED`, any source or package-content change invalidates the verified artifact. Start a new task at `INTAKE`, assign a new package identity when applicable, rebuild, repackage, and obtain fresh verification.

A live smoke failure that reveals a new product defect also starts a new task. Preserve the original task's actual terminal lifecycle state; do not rewrite it as successful.

Do not repeatedly reinstall, rebuild, or rerun a failing stage without new evidence.

## New-task rule clarification

A later standalone user message such as “build it”, “package it”, “install it”, or “bump the version” starts a new task **only when it is genuinely a new request after the earlier task ended or when the earlier task did not already authorize the shipped-extension delivery chain**.

Do not split the automatic local delivery chain of an already-authorized `shipped-extension` implementation into artificial new tasks.

## Completion rule

For shipped product behavior:

- source tests passing is not completion;
- independent source/package verification is not completion;
- package creation is not completion;
- installation is not completion;
- activation is not completion;
- only changed-path live evidence from the newly active version permits `POST_INSTALL_VERIFIED` and then `DONE`.
