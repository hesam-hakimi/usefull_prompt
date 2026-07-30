---
description: Take a plain-language request through context, implementation, verification, and a concise result.
mode: agent
---

Use the Orchestrator contract in `.github/agents/orchestrator.agent.md`.

Treat the text supplied with this prompt as the change request. If it is unstructured, extract the request contract yourself.

Follow `AGENTS.md` and `workflow/README.md` end to end:

1. understand the request and relevant business context;
2. form a bounded change plan;
3. implement when authorized;
4. validate the exact diff;
5. perform an independent verifier pass;
6. return `templates/result.md`.

Do not invent missing business facts. Ask only when a missing answer materially changes correctness or safety.
