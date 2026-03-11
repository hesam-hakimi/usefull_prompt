# Architecture for the ETL Copilot VS Code Extension

## Product summary
The extension integrates with GitHub Copilot Chat inside VS Code to help ETL developers create framework-aligned ETL artifacts faster and more safely.

## Supported MVP scenario
- read from bronze
- apply transformations
- write Delta to silver/gold
- write/manipulate Synapse at the job level
- generate top-level job config JSON
- reuse or generate env config YAML
- generate all referenced include files
- validate all generated artifacts
- optionally upload to DBFS in `dev` after approval

## Repo strategy
Use the extension repo as the implementation repo.
If the ETL framework repo is available in the same workspace, treat it as a read-rich context source for:
- real module names
- config patterns
- include conventions
- naming patterns
- validation expectations

## Processing flow
1. User sends a natural language request in Copilot Chat.
2. `TaskClassifier` determines the task type.
3. `IntentExtractor` builds a `JobIntent`.
4. `ClarificationEngine` identifies missing required fields.
5. `MetadataResolver` resolves source/target/environment context.
6. `SimilarJobFinder` and `TemplateStrategySelector` choose clone/template/scratch strategy.
7. `BlueprintBuilder` produces a `JobBlueprint`.
8. `TransformationCompiler` creates transformation logic.
9. Renderers produce the full artifact set.
10. Validators check syntax, includes, compatibility, and upload safety.
11. `DeploymentPlanner` creates a repo-write and DBFS upload plan.
12. `ApprovalGate` enforces consent before DBFS upload.
13. `DbfsPublisher` uploads only in `dev` and only after approval.

## Architectural layers
### Chat layer
Owns VS Code Copilot integration, request routing, and response summaries.

### Domain layer
Owns task classification, intent extraction, and clarification logic.

### Planning layer
Owns metadata resolution, similar-job discovery, strategy selection, and blueprint construction.

### Generation layer
Owns transformation compilation, top-level config rendering, env config rendering, include generation, and artifact assembly.

### Validation layer
Owns syntax, include, compatibility, and upload-plan validation.

### Deployment layer
Owns repo writes, DBFS path resolution, approval, preview, and upload.

### Diagnostics layer
Owns bug classification and fix suggestion generation.

## Guiding principles
- repo first
- deterministic output
- validation before upload
- approval before DBFS upload
- small named classes
- minimal coupling
- clone/template before scratch when possible
