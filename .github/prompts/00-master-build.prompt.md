# Build the Databricks ETL Copilot Extension

Use the `developer` agent to build or extend the VS Code extension that accelerates ETL development using GitHub Copilot Chat.

## Product objective
Create a production-oriented extension that helps ETL developers:
- describe ETL work in natural language
- inspect existing Databricks jobs/notebooks
- generate ETL artifacts locally
- validate those artifacts
- upload/deploy to `dev` only after approval
- diagnose runtime failures

## Tool rules
- Use Confluence tools first for guidance if pattern choice, naming, or best-practice questions are unclear.
- Use Databricks tools as source of truth for runtime metadata, schemas, notebooks, jobs, and execution.
- Use local workspace tools for code changes and generated files.
- Do not deploy before validation.
- Do not upload to `dev` without approval.

## Required implementation targets
Implement or preserve:
- `TaskClassifier`
- `IntentExtractor`
- `KnowledgeAdvisor`
- `MetadataResolver`
- `ArtifactMappingResolver`
- `BlueprintBuilder`
- `TemplateSelector`
- `TransformationCompiler`
- `JobConfigRenderer`
- `EnvConfigRenderer`
- `IncludeFileRenderer`
- `ValidationOrchestrator`
- `RepoWriter`
- `ApprovalGate`
- `DbfsPublisher`
- `RunObserver`
- `TroubleshootingAdvisor`

## Work sequence
1. Inspect the current file tree.
2. Identify existing classes/functions that already match the required design.
3. Create missing modules with clean interfaces.
4. Add or update commands/chat integration.
5. Add tests.
6. Summarize exact files/classes/functions changed.

## Output requirements
At the end, provide:
- exact files added/changed
- exact class/function names
- validation performed
- remaining gaps
