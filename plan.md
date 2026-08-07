Continue with the Copilot workflow command-routing failure that was just investigated.

The investigation concluded STALE_TEST, not a product defect.

Authoritative current contract:

* ETLChatParticipant routes high-confidence natural workflow phrases through databricks-etl-copilot.manageCopilotWorkflow.
* The lifecycle operation is passed as WorkflowAction (preview, setup, audit, repair, upgrade, etc.).
* WorkflowManagerCommand then dispatches the action to the appropriate direct lifecycle command.
* Product documentation, newer routing tests, command registration, and git history all confirm that this manager-based architecture is intentional.
* The stale expectation is in chatParticipantActivation.test.ts, approximately the workflow-routing tests around lines 80–113.

Implement the smallest source-only test correction.

Requirements:

1. Do not change ETLChatParticipant.ts, WorkflowManagerCommand.ts, production routing behavior, command registration, or packaged product assets.
2. Update chatParticipantActivation.test.ts so the tests validate the canonical manager contract instead of expecting direct lifecycle commands.
3. Capture command arguments where necessary and assert:
    * result.metadata.workflowCommand === COPILOT_WORKFLOW_COMMANDS.manage
    * result.metadata.workflowAction equals the expected action for each phrase
    * the executed command is COPILOT_WORKFLOW_COMMANDS.manage
    * the matching lifecycle action is passed to the manager.
4. Cover at least the existing preview/setup/audit/repair/upgrade workflow phrases currently represented by the stale tests.
5. Preserve the second layer of behavior: WorkflowManagerCommand must still dispatch those manager actions to the corresponding direct lifecycle commands. Do not remove or weaken the existing backward-compatible dispatch tests.
6. Run the narrowest relevant test set first:
    * chatParticipantActivation.test.ts
    * relevant phase5AgentRouter workflow-routing tests
    * relevant copilotWorkflowCustomization manager-dispatch tests
7. Only run broader tests if those focused results indicate a regression or if required by the repository contract.
8. Capture the task-start dirty-tree baseline. Do not treat pre-existing dirty files as changes from this task.
9. Invoke a fresh independent Verifier on the exact task diff and focused evidence.

Acceptance criteria:

* stale direct-command expectations are gone;
* natural workflow phrases resolve to manageCopilotWorkflow + WorkflowAction;
* manager-to-direct-command dispatch remains verified;
* no production behavior is changed;
* no unrelated files are modified.

Delivery classification: source-only.
Do not package, install, reload, or run live smoke for this task.

At the end report:

* exact files changed;
* old vs new assertion contract;
* focused test results;
* independent Verifier result;
* remaining unrelated failing test groups, without fixing them.
