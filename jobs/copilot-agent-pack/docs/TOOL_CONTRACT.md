# Tool Contract for the VS Code Extension

These are recommended tool IDs and responsibilities for your extension.

If your current extension uses different names, keep the semantics and update the agent frontmatter to match.

## Discovery tools

### `td-etl.findSimilarJobs`
Find the closest matching job configs based on:
- source pattern
- target pattern
- job family
- naming convention
- module usage

**Input**
- request summary
- environment
- optional source path
- optional target table

**Output**
- ranked list of similar jobs
- job paths
- confidence
- reasons for match

### `td-etl.readJobConfig`
Read a top-level job config and optionally its include tree.

### `td-etl.readEnvConfig`
Read an env config and return a structured summary.

### `td-etl.getSourceSchema`
Return source schema from ADLS / Databricks / framework-resolved source.

### `td-etl.getTargetSchema`
Return target Delta or Synapse schema.

### `td-etl.resolveRepoPaths`
Resolve the canonical repo output paths for generated artifacts.

### `td-etl.resolveDbfsPaths`
Resolve the DBFS upload paths for generated artifacts.

## Planning/generation tools

### `td-etl.buildJobBlueprint`
Build a structured blueprint from intent + discovery evidence.

### `td-etl.generateJobConfig`
Render the top-level job config `.json`.

### `td-etl.generateIncludeFiles`
Render all referenced include files.

### `td-etl.generateTransformationLogic`
Generate SQL / transformation fragments / assertions.

### `td-etl.generateEnvConfig`
Create or patch env config only when necessary.

## Validation tools

### `td-etl.validateJsonConfig`
Validate top-level job config syntax and required fields.

### `td-etl.validateYamlConfig`
Validate env config syntax and required fields.

### `td-etl.validateIncludes`
Validate that all include paths exist and that all referenced files are present.

### `td-etl.validateSqlLogic`
Validate SQL logic using parsing or target-engine-compatible checks.

### `td-etl.validateSourceTargetCompatibility`
Validate source/target column compatibility, keys, partitions, and writer settings.

### `td-etl.validateDbfsUploadPlan`
Validate DBFS target paths and upload readiness.

### `td-etl.validateGeneratedArtifacts`
Aggregate validation for all artifact types.

## Deployment tools

### `td-etl.previewUploadPlan`
Return the planned repo->DBFS mapping without writing anything.

### `td-etl.uploadFilesToDbfs`
Upload generated artifacts to DBFS in `dev` only.

### `td-etl.verifyDbfsUpload`
Verify that each uploaded path exists and matches the expected payload.

## Tool design rules

1. Discovery tools must be read-only.
2. Generation tools must not upload.
3. Validation tools must not write.
4. Upload tools must require approval from the chat flow.
5. Every tool should return structured JSON, not prose.
6. Every tool error should include:
   - `phase`
   - `artifact`
   - `recommendedOwner`
   - `recommendedFunction`
   - `message`

## Example error shape

```json
{
  "phase": "validation",
  "artifact": "job_conf/conf/eprm_cie1_eprm_flat_490001.json",
  "recommendedOwner": "ValidationOrchestrator",
  "recommendedFunction": "validateIncludes",
  "message": "Referenced include './sql/eprm_cie1_header.yml' was not generated."
}
```
