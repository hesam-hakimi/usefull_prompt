Fix the ETL create summary so reused environment config is reported correctly.

Observed problem:
- The summary still says `New file: conf/env/silver_to_synapse_env_config.yml`
- In this workspace, the actual behavior is reuse of the shared env config such as `env_config_dev.yaml`
- The summary should not claim a new env file was created when the shared env config is being reused

Expected behavior:
1. If env config is reused, the summary must say it is reusing the shared env config
2. Show the actual reused env config name/path, for example `env_conf/dev/env_config_dev.yaml`
3. Do not show a fake generated env-config path when reuse is happening
4. Keep the existing note that env linkage is external and table registration is not implemented in MVP

Patch the smallest safe surface first.

Most likely areas:
- `src/renderers/EnvConfigRenderer.ts`
- `src/chat/ETLChatParticipant.ts`
- `ETLChatParticipant.handleCreateJob()`
- `src/writers/RepoWriter.ts`
- any summary/result model that decides whether env config is `new` vs `reused`

Requirements:
- preserve current architecture
- do not implement SQL table registration
- name the exact file, class, and function changed
- after the fix, tell me to retest `@etl /create ...`
