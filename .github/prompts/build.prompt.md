---
description: Take a plain-language request through target resolution, context, implementation, verification, and a concise result.
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
3. form a bounded change plan;
4. implement when authorized;
5. validate the exact diff and target;
6. perform an independent verifier pass;
7. return `templates/result.md`.

Do not continue when the target is `unknown`. Do not invent missing business facts or use the extension source as a generated-output destination.
