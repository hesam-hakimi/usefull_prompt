---
description: Take each mutating request through target resolution, conditional evidence research, delegated planning, bounded implementation, independent verification, and explicit package/runtime lifecycle gates.
mode: agent
---

Use the Orchestrator contract in `.github/agents/orchestrator.agent.md`.

Treat the text supplied with this prompt as the change request. If it is unstructured, extract the request contract yourself.

Before planning or editing, output:

## Target Resolution

- Task ID:
- Request class:
- Target type:
- Delivery classification:
- Resolved workspace root:
- Canonical source:
- Generated destination:
- Protected paths:
- Evidence:
- Blockers:

Follow `AGENTS.md`, `workflow/README.md`, `workflow/execution-recovery.md`, and `workflow/shipped-extension-delivery.md` end to end:

1. classify the current message and start a new task for every genuinely new mutating or operational request;
2. classify delivery as `source-only`, `shipped-extension`, or `operational-only`;
3. resolve the target and ownership, then emit the complete `## Target Resolution` report before any delegation, edit, build, package, install, publish, deploy, or write-capable tool call;
4. understand the request and load only relevant context;
5. evaluate the evidence-research triggers;
6. when triggered, invoke `Evidence Researcher` as an actual subagent and require `EVIDENCE_READY`;
7. classify every proposed user question before asking it, and do not ask for information derivable from authorized sources;
8. invoke `Planner` as an actual subagent and require `PLAN_READY`; for `shipped-extension`, require the plan to include version/package identity, canonical build/package path, package verification, local install, activation boundary, and exact live smoke acceptance criteria;
9. implement the bounded plan when authorized;
10. validate the exact diff, operation manifest, target, and source-level artifacts;
11. for `shipped-extension`, continue automatically through the delivery chain instead of stopping at source validation:
    - prepare a distinguishable package version when needed; if the user did not specify a version and a collision would occur, use the next patch version only;
    - build using the repository's canonical path;
    - create the VSIX/package;
    - verify package identity, contents, required product resources/registrations, forbidden-file absence, and exact package path;
12. emit execution checkpoints at implementation, package verification, install, activation, smoke, blocker, and handoff boundaries;
13. invoke `Verifier` as a fresh, independent subagent with the exact diff, tests, and package evidence when applicable;
14. if it returns `CHANGES_REQUIRED`, remediate only grounded findings that remain in the same task and invoke a new Verifier, for at most two remediation cycles before package verification;
15. for a verified `shipped-extension` artifact, locally install exactly the verified package once without asking for a separate build/package/install request; do not publish or deploy it;
16. after install, report `INSTALLED_NOT_ACTIVATED` and stop only for the required host reload/restart;
17. after the user reloads/restarts, resume the same shipped-extension task from the checkpoint when the exact installed package/version is unchanged and trusted task state is provable; confirm the active version before smoke testing;
18. run the narrowest live smoke scenario that exercises the changed path; read-only smoke is included, while mutating consumer smoke remains preview/write approval-gated;
19. invoke a fresh Verifier on live evidence when the changed-path contract requires independent runtime confirmation;
20. report `POST_INSTALL_VERIFIED` only after the newly active version passes the changed live scenario; only then may a shipped-extension task return `DONE`;
21. if an unexpected failure requires new source/package behavior, dependency, package identity after verification, target, or approval, stop the current task and start a new task at `INTAKE`;
22. for `source-only`, return `DONE` after the normal independent verification gates; for `operational-only`, perform only the explicitly requested operational stages;
23. return `templates/result.md`.

Do not role-play or simulate Evidence Researcher, Planner, or Verifier inside the Orchestrator context. If required subagent invocation is unavailable, stop with `BLOCKED`.

Do not repeatedly retry a failed action without new evidence. Do not convert a tooling gap into a request for the user to paste or reconstruct existing data.

After `DONE`, a later version bump, edit, build, package, install, publish, deploy, repair, or upgrade is a new request and gets a new task ID. This new-task rule must not split the automatic local delivery chain of an already-authorized `shipped-extension` task.

If installation completes without reloading or restarting the host, report `INSTALLED_NOT_ACTIVATED`. Report `POST_INSTALL_VERIFIED` only after a live smoke check of the newly activated version.

Do not continue when the target is `unknown`. Do not invent missing business facts or use the extension source as a generated-output destination.
