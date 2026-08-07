Fix ONLY the VS Code/Electron integration-test workspace visibility defect.

Repository:
etl_framework_extension

Branch:
feature/v3-agentic-redesign

This is a narrowly scoped IMPLEMENT + TEST + VERIFY task.

Do NOT investigate or fix any of the other integration-test failure groups in this task.

Known evidence from the completed integration-test triage:

The full Electron integration runner executed:

- Total: 136
- Passed: 120
- Failed: 14
- Pending: 2

Five distinct root-cause groups were identified.

This task addresses ONLY root-cause group #5:

ENVIRONMENTAL — Config Explain tests lack workspace visibility in the current VS Code/Electron test host.

Affected tests identified by the investigation include:

- explain.integration.tests.ts
  - builds lineage and include graph from workspace files
  - resolves env variables for lineage outputs

- ConfigExplainInputResolver.tests.ts
  - resolves workspace files by relative path
  - resolves workspace files by bare filename

Observed errors include:

- expected the `etl_framework_extension` workspace folder but it was not available through `vscode.workspace.workspaceFolders`
- job config file could not be found in the workspace

Existing evidence:

- `runTests.ts` launches the VS Code/Electron tests without explicitly opening the repository as the test workspace.
- `explain.integration.tests.ts` expects `vscode.workspace.workspaceFolders` to include `etl_framework_extension`.
- Older July 30 Electron logs show these tests passing.
- The investigation classified this as an ENVIRONMENTAL/test-host workspace-visibility issue, not a Config Explain product-logic defect.
- There is no evidence linking this failure group to:
  - ExcelJS changes
  - STTM parser changes
  - copied Copilot workflow/control-plane assets
  - packaged `resources/copilot/**`

Objective:

Make the VS Code/Electron integration runner deterministically open the intended repository/workspace so integration tests see the expected workspace folder.

Required behavior:

1. Inspect the current VS Code Electron test bootstrap, especially:
   - runTests.ts
   - VS Code test-electron launch configuration
   - any integration-test bootstrap/helper responsible for workspace launch.

2. Confirm the exact root cause before editing.

3. Implement the SMALLEST GENERIC fix that makes the intended repository/workspace explicit when launching the Electron integration tests.

4. Do NOT add a special case for:
   - `etl_framework_extension`
   - Config Explain
   - any individual test name.

The runner should generically launch against the intended test workspace/repository.

5. Prefer fixing the test harness/bootstrap rather than weakening product code or test assertions.

6. Do NOT change Config Explain production behavior unless evidence proves the production implementation itself is defective.

7. Do NOT:
   - modify or skip the affected tests merely to make them green;
   - weaken assertions;
   - hard-code a machine-specific absolute path;
   - suppress failures;
   - modify STTM parser semantics;
   - modify ExcelJS packaging behavior;
   - modify `.github/**`, `AGENTS.md`, `workflow/**`, or consumer-workspace files;
   - fix any of the other four root-cause groups.

After implementation run:

A. the affected Config Explain tests;
B. the relevant Electron integration test path;
C. the normal repository-supported integration test command (`npm run test`) if feasible.

Report the exact before/after result.

Then invoke a FRESH independent Verifier.

Acceptance criteria:

PASS only if all of the following are true:

1. The Electron test host opens the intended repository/workspace deterministically.
2. `vscode.workspace.workspaceFolders` contains the expected launched workspace during integration execution.
3. The four failures belonging to this ENVIRONMENTAL group pass.
4. No test was skipped, weakened, suppressed, or rewritten merely to pass.
5. No machine-specific path was introduced.
6. Config Explain production behavior was not unnecessarily changed.
7. STTM/ExcelJS behavior remains unchanged.
8. Protected workflow/control-plane paths remain untouched.
9. Fresh Verifier returns VERIFIED.

Important:

The remaining integration failures are OUT OF SCOPE.

Do not fix:
- Run Diagnosis regressions
- Artifact Reuse Router matching
- Copilot workflow command routing
- activationEvents/chatParticipants contract

If the full suite still contains those failures after this fix, REPORT THEM ONLY.

Final report:

## Workspace Visibility Fix

### Root Cause
### Files Changed
### Exact Fix
### Focused Test Result
### Full Integration Result
### Remaining Failures by Existing Root-Cause Group
### Verifier Result
### Files Outside Scope Changed

Do not package or install the VSIX in this task.
This is a source/test-harness correction only.
