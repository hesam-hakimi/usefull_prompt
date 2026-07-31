---
description: Automatically take each mutating request through target resolution, delegated planning, bounded implementation, independent subagent verification, and a concise result.
mode: agent
---

Use the Orchestrator contract in `.github/agents/orchestrator.agent.md`.

Treat the text supplied with this prompt as the change request. If it is unstructured, extract the request contract yourself.

Before planning or editing, output:

## Target Resolution

- Task ID:
- Request class:
- Target type:
- Resolved workspace root:
- Canonical source:
- Generated destination:
- Protected paths:
- Evidence:
- Blockers:

Follow `AGENTS.md` and `workflow/README.md` end to end:

1. classify the current message and start a new task for every new mutating or operational request;
2. resolve the target and ownership, then emit the complete `## Target Resolution` report before any delegation, edit, build, package, install, publish, deploy, or write-capable tool call;
3. understand the request and relevant business context;
4. invoke `Planner` as an actual subagent and require `PLAN_READY`;
5. implement the bounded plan when authorized;
6. validate the exact diff, operation manifest, target, and produced artifacts;
7. invoke `Verifier` as a fresh, independent subagent;
8. if it returns `CHANGES_REQUIRED`, remediate only its grounded findings and invoke a new Verifier, for at most two remediation cycles;
9. return `DONE` only after `VERIFIED`; otherwise return `BLOCKED`;
10. return `templates/result.md`.

Do not role-play or simulate Planner or Verifier inside the Orchestrator context. If subagent invocation is unavailable, stop with `BLOCKED`.

After `DONE`, do not append a version bump, edit, build, package, install, publish, deploy, repair, or upgrade to the completed task. Give it a new task ID and run the full workflow again. Previous approval and verification apply only to the earlier request and artifacts.

If installation completes without reloading or restarting the host, report `INSTALLED_NOT_ACTIVATED`. Report `POST_INSTALL_VERIFIED` only after a live smoke check of the newly activated version.

Do not continue when the target is `unknown`. Do not invent missing business facts or use the extension source as a generated-output destination.
