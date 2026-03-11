# Implement Validation and Dev Deployment

Use the `developer` agent.

Implement the validation and controlled dev deployment layer.

## Validation requirements
Add validation for:
- JSON syntax
- YAML syntax
- include references
- source existence
- target compatibility
- SQL validation using Databricks tools where possible
- path plan correctness
- cluster readiness when deployment is requested

## Deployment rules
- local generation first
- no deploy before validation
- `dev` only
- explicit approval required
- use Databricks runtime tools for execution and result inspection

## Required code targets
Implement or update:
- `ValidationOrchestrator.validateAll`
- `ApprovalGate.requireApproval`
- `DbfsPublisher.uploadArtifacts`
- `RunObserver.inspectRun`
- `TroubleshootingAdvisor.diagnose`

## Databricks tools to use where appropriate
- `getCurrentClusterStatus`
- `startDatabricksCluster`
- `executeDatabricksSqlOnCluster`
- `executeDatabricksPythonOnCluster`
- `explainDatabricksSql`
- `createAndRunDatabricksJobFromCode`
- `updateDatabricksJobFromCode`
- `getDatabricksRunDetails`
- `getDatabricksRunOutput`
- `analyzeDatabricksRunPerformance`
- `analyzeDatabricksRunStages`
- `getDatabricksRunSparkMetrics`

## Output requirements
Name exact file paths, classes, and functions changed.
