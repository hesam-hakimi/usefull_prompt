---
description: 'Fix ETL artifact generation errors and identify the exact extension component to change'
agent: 'ETL Framework Validator'
tools:
  - td-etl.readJobConfig
  - td-etl.readEnvConfig
  - td-etl.validateJsonConfig
  - td-etl.validateYamlConfig
  - td-etl.validateIncludes
  - td-etl.validateSqlLogic
  - td-etl.validateSourceTargetCompatibility
---

Analyze the current ETL artifacts and fix the generation problem.

Context:
${input:errorSummary:Paste the validation error, runtime error, or wrong-output summary}

Your task:
1. identify the failing artifact
2. identify the failing phase
3. identify the exact class/function most likely responsible
4. propose the smallest safe fix
5. if the issue is in the prompt or instructions, say so explicitly
6. if the issue is in code, name the file, class, and function to change
7. do not suggest broad rewrites unless unavoidable

Return:
- Root cause
- Failing artifact(s)
- Fix owner
- Proposed patch scope
- Regression tests to add
