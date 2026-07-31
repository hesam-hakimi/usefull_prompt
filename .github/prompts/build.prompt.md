---
description: Automatically take a request through target resolution, delegated planning, bounded implementation, independent subagent verification, and a concise result.
mode: agent
---

Use the Orchestrator contract in `.github/agents/orchestrator.agent.md`.

Treat the text supplied with this prompt as the change request. If it is unstructured, extract the request contract yourself.

Before planning or editing, output:

## Target Resolution

- Target type:
- Resolved workspace root:
- Canonical source:
- Generated destination:
- Protected paths:
- Evidence:
- Blockers:

Follow `AGENTS.md` and `workflow/README.md` end to end:

1. resolve the target and ownership;
2. understand the request and relevant business context;
3. invoke `Planner` as an actual subagent and require `PLAN_READY`;
4. implement the bounded plan when authorized;
5. validate the exact diff and target;
6. invoke `Verifier` as a fresh, independent subagent;
7. if it returns `CHANGES_REQUIRED`, remediate only its grounded findings and invoke a new Verifier, for at most two remediation cycles;
8. return `DONE` only after `VERIFIED`; otherwise return `BLOCKED`;
9. return `templates/result.md`.

Do not role-play or simulate Planner or Verifier inside the Orchestrator context. If subagent invocation is unavailable, stop with `BLOCKED`.

Do not continue when the target is `unknown`. Do not invent missing business facts or use the extension source as a generated-output destination.
