lImplement the confirmed stale-test correction for the remaining Chat Participant activation-event failure.

Task classification: source-only test correction.
Target type: extension-source.
Do not package, install, reload, or run a live smoke test.

The read-only investigation is complete and authoritative:

ROOT_CAUSE: STALE_TEST

Canonical behavior:
- package.json contributes the Chat Participant through:
  contributes.chatParticipants
- The contributed participant id is:
  databricks-etl-copilot.etl
- ETLChatParticipant uses the same id.
- Extension activation registers the runtime handler through:
  vscode.chat.createChatParticipant(...)
- For the supported VS Code range ^1.95.0, VS Code derives the corresponding
  onChatParticipant:<id> activation event from contributes.chatParticipants.
- Explicit activationEvents metadata is not required.
- Do not add activationEvents to package.json.

Required change:
Modify only the stale assertion block in:

chatParticipantActivation.test.ts
approximately lines 180–199

Replace the assertion that directly reads:

packageJson.activationEvents

and requires an explicit onChatParticipant:* entry.

The corrected test must instead validate the canonical end-to-end identity contract:

1. package.json contributes a Chat Participant with id:
   databricks-etl-copilot.etl

2. The implementation's participant-id constant matches the contributed manifest id.

3. The runtime registration uses:
   vscode.chat.createChatParticipant
   with that same participant id.

4. The test must not require explicit activationEvents for VS Code ^1.95.0.

Scope restrictions:
- Do not modify package.json.
- Do not modify ETLChatParticipant.ts.
- Do not modify extension.ts.
- Do not modify production routing or activation behavior.
- Do not modify packaged Copilot assets.
- Do not change unrelated tests.
- Do not clean, revert, or include pre-existing dirty files.

Execution procedure:
1. Capture git status and the exact dirty-file baseline before editing.
2. Make the smallest coherent test-only change.
3. Run the corrected focused Electron test.
4. Run neighboring Chat Participant/package/VSIX manifest tests to ensure:
   - the participant contribution still exists;
   - the participant id remains consistent;
   - slash commands and package manifest checks remain valid.
5. Run the normal full Electron/integration command:
   npm run test
6. Invoke a fresh independent Verifier against only this task's diff.
   Provide the task-start dirty-file baseline so pre-existing dirty files are
   not incorrectly attributed to this task.

Expected outcome:
- Exactly one intended file changed:
  chatParticipantActivation.test.ts
- The activation-event test passes.
- No production file changes.
- No explicit activationEvents added to package.json.
- Compared with the current baseline of:
  138 total / 134 passed / 2 failed / 2 pending
  the expected result is:
  138 total / 135 passed / 1 failed / 2 pending
  unless the test harness count changes for an explicitly explained reason.
- The only expected remaining failure is:
  Config Explain Integration resolves env variables for lineage outputs

Return:
- task classification;
- exact file and assertion changed;
- before/after test counts;
- exact remaining failed and pending tests;
- confirmation that package.json and production code were untouched;
- scoped independent Verifier verdict;
- Files changed.
