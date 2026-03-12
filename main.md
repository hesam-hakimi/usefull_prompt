Fix the ETL generation flow so it matches the real framework behavior for environment config linkage.

Observed reality:
- The generated job config does NOT reference the env config inside the file.
- In the real framework, a separate table maps which job runs with which job config and which env config.
- For now, MVP does NOT update that table.
- The extension may reuse a shared env config like `env_config_dev.yaml`, but it should not imply that the job config contains the reference.

Expected behavior:
1. Do not expect or search for an env-config reference inside the generated job config.
2. If a shared env config is reused, present it as external runtime metadata, not as an in-file linkage.
3. The create flow summary should clearly say:
   - generated job config path
   - reused/shared env config name/path if applicable
   - table registration is not yet implemented in MVP
4. Do not generate a fake job-specific env-config reference inside the job config.

Patch the smallest safe surface first.

Most likely areas:
- `src/renderers/EnvConfigRenderer.ts`
- `src/chat/ETLChatParticipant.ts`
- `ETLChatParticipant.handleCreateJob()`
- any result/summary model used after generation
- any validation logic that assumes the job config must point to env config

Requirements:
- preserve current architecture
- do not implement SQL table registration yet
- name the exact file, class, and function changed
- after the fix, tell me what to retest
