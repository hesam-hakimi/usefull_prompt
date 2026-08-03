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
- Resolved workspace root:
- Canonical source:
- Generated destination:
- Protected paths:
- Evidence:
- Blockers:

Follow `AGENTS.md`, `workflow/README.md`, and `workflow/execution-recovery.md` end to end:

1. classify the current message and start a new task for every new mutating or operational request;
2. resolve the target and ownership, then emit the complete `## Target Resolution` report before any delegation, edit, build, package, install, publish, deploy, or write-capable tool call;
3. understand the request and load only relevant context;
4. evaluate the evidence-research triggers;
5. when triggered, invoke `Evidence Researcher` as an actual subagent and require `EVIDENCE_READY`;
6. classify every proposed user question before asking it, and do not ask for information derivable from authorized sources;
7. invoke `Planner` as an actual subagent and require `PLAN_READY`;
8. implement the bounded plan when authorized;
9. validate the exact diff, operation manifest, target, and produced artifacts;
10. emit execution checkpoints at implementation, package, install, activation, smoke, blocker, and handoff boundaries;
11. invoke `Verifier` as a fresh, independent subagent;
12. if it returns `CHANGES_REQUIRED`, remediate only grounded findings that remain in the same task and invoke a new Verifier, for at most two remediation cycles;
13. if an unexpected failure requires new source/package behavior, dependency, package identity, target, or approval, stop the current task and start a new task at `INTAKE`;
14. return `DONE` only after `VERIFIED`; otherwise return `BLOCKED` or the exact installation lifecycle state;
15. return `templates/result.md`.

Do not role-play or simulate Evidence Researcher, Planner, or Verifier inside the Orchestrator context. If required subagent invocation is unavailable, stop with `BLOCKED`.

Do not repeatedly retry a failed action without new evidence. Do not convert a tooling gap into a request for the user to paste or reconstruct existing data.

After `DONE`, do not append a version bump, edit, build, package, install, publish, deploy, repair, or upgrade to the completed task. Give it a new task ID and run the full workflow again. Previous approval and verification apply only to the earlier request and artifacts.

If installation completes without reloading or restarting the host, report `INSTALLED_NOT_ACTIVATED`. Report `POST_INSTALL_VERIFIED` only after a live smoke check of the newly activated version.

Do not continue when the target is `unknown`. Do not invent missing business facts or use the extension source as a generated-output destination.
