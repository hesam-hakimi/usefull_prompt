---
description: Independently verify target resolution and the current change against ownership rules, contracts, tests, and regression risks.
mode: agent
---

Use `.github/agents/verifier.agent.md`.

Start with:

## Target Resolution

- Target type:
- Resolved workspace root:
- Canonical source:
- Generated destination:
- Protected paths:
- Evidence:
- Blockers:

Review the exact current diff. Map each acceptance criterion to evidence, identify ownership violations, accidental scope, test-isolation failures, and compatibility risks, and report checks that were not run.

Do not repair findings unless the user separately asks for implementation.
