---
description: 'Diagnose ETL job runtime failures and map them to the right framework or extension component'
agent: 'ETL Framework Validator'
tools:
  - td-etl.readJobConfig
  - td-etl.readEnvConfig
  - td-etl.validateIncludes
  - td-etl.validateSqlLogic
  - td-etl.getSourceSchema
  - td-etl.getTargetSchema
---

Diagnose an ETL runtime failure.

Failure context:
${input:failureContext:Paste the job error, stack trace, failing module name, or suspicious output}

Tasks:
1. identify whether the failure is from:
   - source resolution
   - transformation SQL
   - include resolution
   - Delta write
   - Synapse write
   - DBFS pathing
   - env config mismatch
2. map the failure to the smallest responsible function/class
3. propose the minimum safe patch
4. propose tests to prevent recurrence

Return:
- Failure category
- Root cause
- Responsible file/class/function
- Proposed fix
- Tests to add
