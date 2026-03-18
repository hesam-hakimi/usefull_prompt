I reloaded VS Code and launched a fresh Extension Development Host, but runtime still shows old behavior.

This means the issue is not only stale compiled output. There is still another runtime path being used.

Please trace the FULL runtime path for @etl /create from command entry to artifact write/render and identify every place that can:
1. ask for env config
2. build artifacts
3. render preview
4. handle "write"
5. create files on disk

Search for all call sites related to:
- ETLChatParticipant
- CreateJobSessionService
- RepoWriter
- artifact rendering
- write/persist flow
- any legacy generator path
- any direct file creation path
- any code creating *_EXTRACT.json or *_LOAD.json
- any onboarding generation path

I need a definitive runtime map showing:
entrypoint -> classifier -> session/orchestrator -> builder -> renderer -> writer

Then remove or disable every legacy split-job path so the runtime uses ONLY the new single-job orchestration path.

Acceptance criteria:
- exact prompt with ENV_CONFIG=... should skip env question
- only one job config file is generated
- no EXTRACT/LOAD files
- no onboarding file
- first module is data_sourcing_process
- existing env config is reused, not recreated
