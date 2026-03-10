# Copilot instructions for the TD ETL authoring repository

You are working on a repository that generates and deploys ETL framework artifacts for Databricks.

## Mission

Turn natural-language ETL requests into valid framework artifacts with minimal, explicit, and reviewable changes.

The supported V1 business flow is:
- read from bronze
- transform data
- write Delta to silver or gold
- write or manipulate Synapse target at the job level

## Non-negotiable rules

1. Never invent source schemas, target schemas, DBFS paths, or framework module behavior.
2. Always search existing repo artifacts, framework source, and similar job patterns before generating new files.
3. Prefer clone-or-template generation over scratch generation when a close pattern exists.
4. Treat Bitbucket repo files as the source of truth.
5. Only upload to DBFS in `dev`, and only after explicit approval.
6. Never propose direct upload to higher environments.
7. Generate **all** required referenced include files, not just the top-level job config.
8. Reuse env config when possible; create or modify env config only when the job truly needs job-level settings.
9. Validate syntax, includes, source existence, target existence, SQL logic, and deployment path before any upload.
10. Never silently overwrite existing files. Show a diff summary or change summary first.
11. Keep edits minimal and focused. Do not refactor unrelated code.
12. If a tool fails, report which function, class, or file needs to be changed.

## Repository expectations

### Artifact types
- top-level job config: `.json`
- env config: `.yml`
- referenced include files: `.yml`, `.yaml`, `.json`, or SQL-like config files depending on the template family

### Generation order
1. classify request
2. gather context
3. find similar jobs and env configs
4. resolve source schema
5. resolve target schema and Synapse shape
6. resolve path strategy
7. build a job blueprint
8. generate files
9. validate
10. show deployment plan
11. upload to DBFS in dev only after approval

## Required output shape in chat

When asked to create or modify an ETL job, always respond in this structure:

### 1. Task classification
- create new job
- clone existing job
- modify existing job
- troubleshoot existing job

### 2. Inputs resolved
- source path / source object
- environment
- target Delta layer
- target Delta table/path
- target Synapse table
- similar jobs found
- env config reuse decision

### 3. Artifacts to create or update
List exact files.

### 4. Validation results
List:
- syntax validation
- include validation
- schema validation
- SQL validation
- path validation

### 5. Deployment plan
For dev only:
- repo paths
- DBFS target paths
- approval required before upload

### 6. Risks / unknowns
If anything is unresolved, state it explicitly.

## Naming standards

- module names: snake_case
- view names: lowercase snake_case
- table names: lowercase snake_case unless the framework/job family requires otherwise
- functions and classes introduced in the extension must have stable, descriptive names
- file names must match the job family naming convention already present in the repo

## Error-handling behavior

If generation fails:
- identify the failing phase
- identify the exact class/function responsible
- propose the smallest safe fix
- do not rewrite the entire system unless necessary

## Preferred internal code structure for the extension

Use these names when implementing or modifying the extension:

- `EtlAuthoringParticipant.handleRequest`
- `TaskClassifier.classify`
- `IntentExtractor.extract`
- `BlueprintBuilder.build`
- `SimilarJobResolver.findClosestMatches`
- `EnvConfigResolver.resolveForJob`
- `PathResolver.resolveRepoPaths`
- `PathResolver.resolveDbfsPaths`
- `TransformationCompiler.compile`
- `JobConfigRenderer.renderTopLevelConfig`
- `IncludeFileRenderer.renderAll`
- `ValidationOrchestrator.validateAll`
- `DbfsPublisher.uploadArtifacts`
- `DeploymentPlanBuilder.build`
- `RuntimeDiagnosticService.summarizeFailure`

If the existing codebase already has equivalent components, prefer extending them rather than creating duplicates.

## When writing code

- preserve backward compatibility unless the task explicitly allows breaking changes
- add targeted tests for new behavior
- document assumptions close to the code
- keep business rules out of UI files
- keep prompt text out of service implementation where possible; store prompt templates in dedicated files
