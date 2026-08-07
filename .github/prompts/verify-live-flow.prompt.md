---
description: Verify package, installation, activation, and the exact live behavior changed by a task without treating installation as runtime proof.
mode: agent
---

Use the Orchestrator contract and the lifecycle gates in `workflow/README.md`, `workflow/execution-recovery.md`, and `workflow/shipped-extension-delivery.md`.

Treat the supplied text as the exact live-verification scenario.

## Authorization mode

First determine whether this is:

1. **same-task continuation** — a previously authorized `shipped-extension` implementation/fix is resuming from a trusted execution checkpoint after package verification/install/reload; or
2. **standalone operational request** — the user is independently asking to verify/build/package/install/run an already-existing artifact.

For a same-task continuation, do **not** require a second user request merely to confirm activation or run the included read-only changed-path smoke. The original shipped-extension request already authorized the bounded local delivery chain for the exact unchanged package. A mutating consumer smoke still requires the normal exact preview/write approval for the selected workspace and files.

For a standalone operational request, this prompt does not authorize build, package, install, reload, write, publish, deploy, register, or run actions unless the user explicitly includes that operation and its exact scope.

A source or package-content change after package verification invalidates the continuation and requires a new task at `INTAKE` with a new package identity when applicable.

## Required sequence

1. Emit `## Target Resolution`, including delivery classification.
2. Record task ID/checkpoint identity, source version, package version/path, installed version, active version, host type, selected consumer workspace, and expected live behavior.
3. Verify the checkpoint still refers to the exact unchanged verified package before reusing same-task state.
4. Verify package identity and extracted contents when package evidence is part of the request.
5. If the installed version is not active, report `INSTALLED_NOT_ACTIVATED` and the exact required user action; do not claim live verification.
6. After activation is proven, run only the narrowest authorized smoke scenario that exercises the changed path.
7. Verify the changed behavior, relevant tool path, workspace containment, read/write disposition, and absence of extension-source, sample, or unauthorized external fallback.
8. If smoke reveals a defect requiring source or package changes, stop, emit an execution checkpoint, classify it, and state that remediation requires a new task at `INTAKE`.
9. Invoke a fresh `Verifier` for the observed live evidence when independent live confirmation is required by the changed-path contract.
10. Report `POST_INSTALL_VERIFIED` only when the newly active version passed the exact smoke scenario.

Return:

- lifecycle state;
- delivery classification;
- task/checkpoint identity;
- package/install/active identities;
- exact smoke input;
- tools and paths exercised;
- files or external state changed;
- acceptance criteria;
- verifier result;
- blockers and next action.
