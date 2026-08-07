Investigate only the remaining Copilot workflow command-routing integration failure.

Do not modify any files yet.
Do not package or install.
Do not investigate Artifact Reuse, Run Diagnosis, STTM, Config Explain, or activationEvents in this task.

Known current state:
- Workspace visibility: fixed and verified.
- Run Diagnosis regressions: fixed and verified.
- Artifact Reuse intent routing: fixed and independently VERIFIED.
- The remaining Electron failure to investigate in this task is the workflow command-routing contract.

Observed failure:
chatParticipantActivation.test.ts expects the workflow phrase to route to:
  databricks-etl-copilot.previewCopilotWorkflow

Current implementation appears to route through:
  databricks-etl-copilot.manageCopilotWorkflow
with an action argument.

Your task is to determine the authoritative intended contract before proposing any change.

Investigate:

1. The failing test and its exact expectation.
2. The current implementation in ETLChatParticipant and related workflow routing code.
3. package.json command/contribution declarations.
4. Current call sites for:
   - previewCopilotWorkflow
   - manageCopilotWorkflow
5. Git history/blame around the change from direct preview routing to manager-command + action routing.
6. Whether the newer manager-command architecture intentionally supersedes the older direct preview command.
7. Whether packaged/product agents, prompts, or workflow assets depend on one contract or the other.

Classify the root cause as exactly one of:

A. PRODUCT_DEFECT
   Current implementation accidentally broke the intended direct command contract.

B. STALE_TEST
   Manager-command + action is the intentional canonical architecture and the test still asserts the old contract.

C. CONTRACT_INCONSISTENCY
   Different authoritative product surfaces currently require incompatible routing contracts.

D. INSUFFICIENT_EVIDENCE

Do not choose based only on which code is newest.
Use product architecture and repository evidence.

Return:

CURRENT_ROUTING:
...

EXPECTED_BY_TEST:
...

COMMAND_REGISTRATION:
...

CALL_SITE_EVIDENCE:
...

GIT_HISTORY_EVIDENCE:
...

PACKAGED_PRODUCT_IMPACT:
...

ROOT_CAUSE:
A | B | C | D

RECOMMENDED_FIX:
- exact file(s) that should change
- whether production code or test should change
- why

REGRESSION_TESTS_REQUIRED:
...

FILES_CHANGED:
None
