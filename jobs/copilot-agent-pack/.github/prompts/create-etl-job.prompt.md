---
description: 'Create a new ETL job package from a natural-language request'
agent: 'ETL Framework Author'
tools:
  - td-etl.findSimilarJobs
  - td-etl.readJobConfig
  - td-etl.readEnvConfig
  - td-etl.getSourceSchema
  - td-etl.getTargetSchema
  - td-etl.resolveRepoPaths
  - td-etl.resolveDbfsPaths
  - td-etl.buildJobBlueprint
  - td-etl.generateJobConfig
  - td-etl.generateIncludeFiles
  - td-etl.generateTransformationLogic
  - td-etl.generateEnvConfig
  - td-etl.validateGeneratedArtifacts
  - td-etl.previewUploadPlan
---

Create a new ETL framework job package.

User request:
${input:userRequest:Describe the ETL job in plain English}

Required behavior:
1. classify the request as `create_new_job`
2. default environment to `dev` unless explicitly provided
3. search for the closest valid existing job family before generating from scratch
4. resolve whether the env config can be reused
5. generate **all** required artifacts:
   - top-level job config `.json`
   - referenced include files
   - transformation logic files
   - env config `.yml` only if required
6. validate syntax, includes, schema compatibility, SQL logic, and path plan
7. do not upload to DBFS automatically
8. produce a deployment-ready summary

Return sections:
- Classification
- Evidence gathered
- Strategy selected
- Artifacts to create or modify
- Validation results
- Dev DBFS upload plan
- Exact files/functions/classes to change if code changes are needed
