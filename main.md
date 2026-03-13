The create summary is still wrong.

Observed behavior after retest:
- It still shows `New file: conf/env/silver_to_synapse_env_config.yml`
- It should show reuse of the shared env config instead
- It already shows the external-linkage note correctly

Expected behavior:
- If a shared env config already exists, the create summary must say it is reusing that env config
- It must show the real reused env config path/name
- It must not show a generated env-config file path when reuse is happening

Please inspect where the create summary is assembled and patch the smallest safe surface.

Most likely areas:
- `src/chat/ETLChatParticipant.ts`
- `ETLChatParticipant.handleCreateJob()`
- `src/writers/RepoWriter.ts`
- `RepoWriter.previewArtifacts()`
- any rendered-artifact result model passed from `EnvConfigRenderer` into the summary

Requirements:
1. Preserve the current architecture.
2. Do not implement SQL registration.
3. Name the exact file, class, and function changed.
4. After the fix, tell me to run F5 and retest `@etl /create ...` again.
