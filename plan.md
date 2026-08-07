Investigate ONLY the remaining Electron failure:

Package.json Chat Participant Configuration Tests activation events include onChatParticipant trigger

This is a bounded read-only investigation. Do not modify files yet.

Determine whether this failure represents:

* a real extension manifest/product defect, or
* a stale test expectation that no longer matches the current VS Code Chat Participant contribution/activation contract.

Specifically inspect:

1. the failing assertion and its test history;
2. current package.json contributes.chatParticipants;
3. whether the participant is already successfully registered/usable through the current contribution contract;
4. the extension’s current engines.vscode target and any relevant manifest assumptions;
5. git history showing whether explicit activationEvents was intentionally removed or superseded;
6. neighboring package/activation tests and current chat-participant implementation;
7. whether adding explicit onChatParticipant:<participant-id> would be required behavior, merely redundant compatibility metadata, or potentially unnecessary.

Do NOT add activationEvents merely to make the test pass.
Do NOT change production code or tests.

Return:

* ROOT_CAUSE: STALE_TEST | PRODUCT_DEFECT | COMPATIBILITY_REQUIREMENT | INCONCLUSIVE
* exact evidence
* canonical behavior
* smallest recommended fix
* exact files that would need to change
* regression tests required
* Files changed: NONE

Keep this task strictly limited to this one remaining activation-event failure. Do not investigate or modify the Config Explain failure.
