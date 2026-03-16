Change the ETL create flow so env config selection is explicit and validation uses the real framework parsing behavior.

New required behavior:
1. When the user asks to create a job, the extension must first ask the user to specify the env config file to use.
2. If the user provides an existing env config file, reuse that file.
3. If the user says the env config does not exist, create a new env config file.
4. After generating the job config, validate that the job config can be parsed/resolved with the selected env config.
5. To implement that validation, inspect the source code in `etl-framework-adb` and find how the framework parses/resolves job config with env config.
6. Use the real framework source code as the source of truth for this validation behavior.
7. If parse/resolve validation fails, show the user the failure and do not proceed as if generation succeeded.

Expected UX:
- user requests job creation
- extension asks: which env config file should be used?
- user answers with either:
  - an existing env config path/name
  - or says it does not exist
- extension then reuses or creates env config
- extension generates job config
- extension validates job+env together using framework-compatible parsing/resolution
- extension reports success or detailed validation failure

Patch the smallest safe surface first.

Most likely files:
- `src/chat/ETLChatParticipant.ts`
- `ETLChatParticipant.handleCreateJob()`
- `src/renderers/EnvConfigRenderer.ts`
- `src/validation/ValidationOrchestrator.ts`
- any new service needed for framework-compatible config parsing validation

Requirements:
- preserve architecture
- use `etl-framework-adb` source code as the reference for parser/loader behavior
- name the exact file, class, and function changed
- after the fix, tell me exactly how to retest this new interaction
