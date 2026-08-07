Fix only the two BLOCKER findings from the latest Databricks ETL workflow validation.

Repository:
etl_framework_extension

Current branch:
feature/v3-agentic-redesign

Scope is maintainer control-plane workflow assets only.

BLOCKER 1 — orchestrator.agent.md

The workflow validator currently fails with:

orchestrator.agent.md is missing required rule:
workflow/shipped-extension-delivery.md

Update orchestrator.agent.md with the smallest coherent change so its existing "Follow" / required-workflow-source contract explicitly includes:

workflow/shipped-extension-delivery.md

Preserve the existing wording and ordering style as much as possible.
Do not redesign the agent.

BLOCKER 2 — definition-of-done.md

The current Definition of Done does not encode the shipped-extension lifecycle gate.

Add the smallest coherent shipped-extension delivery section stating that:

- source-level implementation/test/verification is not sufficient to declare a shipped-extension task done;
- a shipped-extension task is NOT done at source verification;
- PACKAGE, INSTALL, required host RELOAD, LIVE_SMOKE, and POST_INSTALL_VERIFIED must complete as applicable;
- the task may report DONE only after POST_INSTALL_VERIFIED;
- lifecycle states must remain consistent with:
  workflow/shipped-extension-delivery.md
  workflow/README.md
  workflow/targets.yml
  templates/result.md

Use the existing workflow terminology exactly where possible.
Do not invent another lifecycle.

IMPORTANT SCOPE BOUNDARIES

Do not modify:
- resources/copilot/**
- src/customization/**
- consumer ETL workspaces
- packaged product agents/skills/prompts
- unrelated workflow assets

Do not fix the MEDIUM/LOW findings in this task:
- stale test:integration/test:all references in SKILL.md
- validate-workflow.mjs fail-fast behavior
- missing package npm alias

After the two edits:

1. Run:
   node scripts/validate-workflow.mjs

2. Run:
   node scripts/assert-control-plane-clean.mjs

3. Confirm the workflow validator reaches the success state:
   "Copilot workflow contract is valid."

4. If validation exposes another BLOCKER after these two are fixed,
   STOP and report it rather than broadening scope.

5. Have a fresh independent Verifier review only these two changes.

Return:
- validation result
- exact files changed
- exact relevant sections changed
- verifier verdict
- any residual blocker

Do not build a VSIX.
Do not package.
Do not install.
Do not modify the test environment.
