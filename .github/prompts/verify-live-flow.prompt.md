---
description: Verify package, installation, activation, and the exact live behavior changed by a task without treating installation as runtime proof.
mode: agent
---

Use the Orchestrator contract and the lifecycle gates in `workflow/README.md` and `workflow/execution-recovery.md`.

Treat the supplied text as the exact live-verification scenario.

This prompt does not authorize build, package, install, reload, write, publish, deploy, register, or run actions unless the user explicitly includes that operation and its exact scope.

Required sequence:

1. Emit `## Target Resolution`.
2. Record source version, package version, installed version, active version, host type, selected consumer workspace, and expected live behavior.
3. Verify package identity and extracted contents when package evidence is part of the request.
4. If the installed version is not active, report `INSTALLED_NOT_ACTIVATED` and the exact required user action; do not claim live verification.
5. After activation is proven, run only the exact authorized smoke scenario.
6. Verify the changed behavior, relevant tool path, workspace containment, read/write disposition, and absence of extension-source or sample fallback.
7. If smoke reveals a defect requiring source or package changes, stop, emit an execution checkpoint, classify it, and require a new task at `INTAKE`.
8. Invoke a fresh `Verifier` for the observed live evidence.
9. Report `POST_INSTALL_VERIFIED` only when the newly active version passed the exact smoke scenario.

Return:

- lifecycle state;
- package/install/active identities;
- exact smoke input;
- tools and paths exercised;
- files or external state changed;
- acceptance criteria;
- verifier result;
- blockers and next action.
