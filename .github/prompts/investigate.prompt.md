---
description: Run a read-only evidence investigation, classify pending questions, and return a structured evidence packet without implementing changes.
mode: agent
---

Use the Orchestrator and Evidence Researcher contracts.

Treat the supplied text as the exact investigation question.

This prompt is read-only. Do not edit, build, package, install, publish, deploy, register, run, or change Git state.

Before investigation, output:

## Target Resolution

- Task ID:
- Request class: `read-only-investigation`
- Target type:
- Resolved workspace root:
- Canonical source:
- Generated destination:
- Protected paths:
- Evidence:
- Blockers:

Then:

1. read `workflow/execution-recovery.md`;
2. invoke `Evidence Researcher` as an actual subagent;
3. require `EVIDENCE_READY` or `EVIDENCE_BLOCKED`;
4. classify every pending user question;
5. return the complete `templates/evidence-packet.md` structure;
6. identify whether the next mutation would remain in the current task or require a new task;
7. stop without invoking Planner or implementing anything.

Do not role-play Evidence Researcher in the Orchestrator context. If the subagent is unavailable, return `EVIDENCE_BLOCKED`.
