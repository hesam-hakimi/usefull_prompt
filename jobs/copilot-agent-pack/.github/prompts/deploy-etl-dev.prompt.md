---
description: 'Deploy validated ETL artifacts to DBFS in dev after approval'
agent: 'ETL Framework Deployer'
tools:
  - td-etl.previewUploadPlan
  - td-etl.uploadFilesToDbfs
  - td-etl.verifyDbfsUpload
---

Deploy validated artifacts to DBFS in dev.

Approval:
${input:approval:Type APPROVED to continue}

Rules:
- continue only if approval is exactly APPROVED
- upload only validated artifacts
- verify every target path after upload
- do not deploy to higher environments
- do not update SQL Server config tables in MVP

Return:
- Upload plan
- Files uploaded
- Verification results
- Exact class/function to fix if upload or verification fails
