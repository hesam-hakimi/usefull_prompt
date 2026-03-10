---
description: 'Clone a similar ETL job and adapt it to a new source, target, or transformation set'
agent: 'ETL Framework Author'
tools:
  - td-etl.findSimilarJobs
  - td-etl.readJobConfig
  - td-etl.readEnvConfig
  - td-etl.getSourceSchema
  - td-etl.getTargetSchema
  - td-etl.buildJobBlueprint
  - td-etl.generateJobConfig
  - td-etl.generateIncludeFiles
  - td-etl.generateTransformationLogic
  - td-etl.validateGeneratedArtifacts
---

Clone and adapt an existing ETL job.

Request:
${input:userRequest:Describe the new job and, if known, the existing similar job}

Requirements:
- first identify the closest existing job
- explain why it is the closest match
- reuse structure and naming patterns where safe
- update only what must change
- generate missing include files as needed
- validate the resulting package
- show an exact diff-style summary of changed artifacts
- name the class/function that should be fixed if the clone strategy fails
