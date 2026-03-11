# Copilot Instructions for ETL Authoring Extension

You are implementing a VS Code extension whose purpose is to help ETL developers work faster through GitHub Copilot Chat.

## Product Goal
Build and maintain a VS Code extension that:
- receives ETL requests in Copilot Chat
- helps developers create ETL artifacts faster
- generates job config `.json`
- generates env config `.yml`
- generates every referenced include file
- can reuse an existing env config when appropriate
- can inspect existing jobs and notebooks
- validates before deployment
- in `dev` only, may upload/deploy after explicit approval
- prefers repository-first authoring

## Tool-Awareness Rules
The agent has access to these tools and MUST use them deliberately.

### Local workspace tools
Use these for source code authoring, edits, and local file generation:
- `vscode`
- `read`
- `edit`
- `search`
- `execute`
- `agent`
- `web`

### Databricks runtime tools
Use these for live metadata, runtime validation, cluster state, job history, notebooks, and execution:
- `databricks-copilot-tools/getDatabricksRuns`
- `databricks-copilot-tools/getDatabricksJobDefinition`
- `databricks-copilot-tools/getDatabricksNotebookSource`
- `databricks-copilot-tools/createAndRunDatabricksJobFromCode`
- `databricks-copilot-tools/updateDatabricksJobFromCode`
- `databricks-copilot-tools/runDatabricksCodeAndGetResult`
- `databricks-copilot-tools/getDatabricksRunDetails`
- `databricks-copilot-tools/getDatabricksRunOutput`
- `databricks-copilot-tools/analyzeDatabricksRunPerformance`
- `databricks-copilot-tools/getDatabricksRunSparkMetrics`
- `databricks-copilot-tools/getCurrentClusterStatus`
- `databricks-copilot-tools/listDatabricksClusters`
- `databricks-copilot-tools/startDatabricksCluster`
- `databricks-copilot-tools/getDatabricksClusterDefinition`
- `databricks-copilot-tools/getDatabricksClusterDetails`
- `databricks-copilot-tools/profileDatabricksTableLayout`
- `databricks-copilot-tools/executeDatabricksSqlOnCluster`
- `databricks-copilot-tools/executeDatabricksPythonOnCluster`
- `databricks-copilot-tools/profileDatabricksTableStats`
- `databricks-copilot-tools/analyzeDatabricksRunStages`
- `databricks-copilot-tools/explainDatabricksSql`
- `databricks-copilot-tools/summarizeDatabricksJobHistory`
- `databricks-copilot-tools/resolveDatabricksArtifactMapping`
- `databricks-copilot-tools/searchDatabricksNotebooks`

### Confluence guidance tools
Use these for architecture guidance, best practices, FAQs, naming conventions, and troubleshooting playbooks:
- `confluence-copilot-tools.confluence-copilot-tools/resolve_confluence_spaces`
- `confluence-copilot-tools/search_confluence`
- `confluence-copilot-tools/get_confluence_page`
- `confluence-copilot-tools/create_markdown_from_confluence_search`

## Priority Rules
1. Treat Confluence results as advisory guidance only.
2. Treat Databricks tools as the source of truth for live runtime state and live metadata.
3. Treat local repository code as the source of truth for extension implementation.
4. Prefer reuse of existing ETL patterns, existing jobs, and existing notebooks over inventing a new structure from scratch.
5. Never assume source schema from documentation; verify with Databricks tools.
6. Never deploy before validation is complete.
7. Never upload or deploy to `dev` without explicit approval.
8. Never promote directly to higher environments from chat-driven deployment.
9. Generate locally first; deploy only after validation and approval.
10. Reuse env config where possible instead of generating a new one unnecessarily.

## Default Supported ETL Pattern
The first supported pattern is:
- read from bronze
- transform
- write Delta to silver or gold
- write/manipulate Synapse target

## Required Artifact Scope
For a generated ETL job, the system must create:
- top-level job config `.json`
- env config `.yml` only when needed
- every referenced include file
- transformation logic files
- supporting fragments required by the generated config

## Preferred Strategy Order
When creating a job:
1. find a similar existing job
2. clone and modify the similar job
3. if no similar job exists, use a known template family
4. only as a last resort, generate from scratch

## Mandatory Implementation Structure
When implementing or changing the extension, preserve or create these responsibilities:
- `TaskClassifier` -> classify request type
- `IntentExtractor` -> extract structured intent from chat request
- `KnowledgeAdvisor` -> query Confluence guidance tools
- `MetadataResolver` -> query Databricks for live metadata
- `ArtifactMappingResolver` -> resolve likely notebook/job/artifact mapping
- `BlueprintBuilder` -> convert intent + metadata into ETL blueprint
- `TemplateSelector` -> choose clone/template/scratch strategy
- `TransformationCompiler` -> generate transformation logic
- `JobConfigRenderer` -> render top-level job config
- `EnvConfigRenderer` -> render env config or reuse mapping
- `IncludeFileRenderer` -> render referenced include files
- `ValidationOrchestrator` -> run all validation
- `RepoWriter` -> write artifacts locally
- `ApprovalGate` -> prevent deployment before explicit approval
- `DbfsPublisher` -> publish to dev only after approval
- `RunObserver` -> inspect run history and execution results
- `TroubleshootingAdvisor` -> convert runtime failure into actionable fixes

## Validation Requirements
Before any deployment or upload:
- validate JSON syntax
- validate YAML syntax
- validate include references
- validate source existence
- validate target existence or documented creation expectation
- validate SQL with Databricks explain/execute tools where possible
- validate path plan
- validate cluster readiness when deployment is requested

## Debugging Rules
When a bug is reported:
1. identify the failing feature
2. identify the failing class and function
3. inspect the smallest relevant code surface first
4. propose a minimal patch
5. update tests
6. summarize exactly which file/class/function changed

Always name exact files, classes, and functions in the output.
Do not answer with vague advice like "update the logic" without naming the code target.
