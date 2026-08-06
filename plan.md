STRICT READ-ONLY STTM PARSER ACCEPTANCE TEST

This is NOT a job-creation, solution-design, framework-fit, artifact-readiness, onboarding, deployment, or implementation request.

The only purpose of this test is to prove that the installed Databricks ETL Copilot can generically read and interpret a NEW STTM workbook without relying on prior CD-Renewal-specific knowledge.

Authoritative input:
sttm/CD-Renewal_DataMapping_V3.0 1.xlsx

Use ONLY the installed product ETL tools needed for this test:
1. etl_capabilities
2. etl_interpret_sttm

Do NOT:
- inspect job_conf, env_conf, sql, job_onboarding, deployment files, or repository implementation artifacts
- call etl_get_framework_rules
- call etl_search_examples
- call etl_inspect_existing_job
- inspect existing jobs
- analyze environment reuse
- decide CREATE vs UPDATE
- choose writer/output strategies
- design transformation SQL
- create a solution plan
- determine deploy/run readiness
- investigate onboarding
- inspect companion repositories
- use Jira, Confluence, ADF, Databricks runtime, or SQL Server tools
- resolve business conflicts
- ask me how conflicts should be resolved
- infer missing mappings or infrastructure values
- create, modify, preview, validate, or write any artifact

First call etl_capabilities and report:
- extension id
- active version
- target classification
- runtimeReady
- available
- blockers
- registered ETL tool count

Then call etl_interpret_sttm against EXACTLY the workbook path above.

Validate only the parser behavior and report:

A. Workbook identity
- resolved workspace-relative path
- detected workbook version
- latest revision date
- recognized sheets
- active mapping count
- rule count
- parser confidence/diagnostics if returned

B. V3 change discovery
Determine from this workbook itself whether the latest revision introduces:
- mfastatus
- transferamount
- transferfrom
- transferto
- transferstatus
- cdclosuresuccessful

For each field, report only evidence available from the STTM:
- target field
- source/business-rule evidence
- transformation-rule ID
- complete transformation rule text when available

C. Targeted rule retrieval
Retrieve and report the complete, untruncated definitions for:
- TR_0035
- TR_0041

D. Generic parser behavior
State explicitly whether all conclusions above came from THIS workbook through etl_interpret_sttm rather than:
- another STTM workbook
- repo examples
- generated CD-Renewal knowledge
- previous chat memory
- manually pasted workbook content

E. Problems found in the workbook
You MAY identify inconsistencies visible directly in the STTM, such as conflicting revisions or rule references.
Report them as observations only.
DO NOT resolve them and DO NOT turn them into implementation questions.

Stop immediately after this report.

Required final format:

## Test Status
PASS / PARTIAL / FAIL

## Runtime
...

## Workbook Parsed
...

## V3 Fields
| Field | Mapping Evidence | BR | TR | Complete Rule Retrieved |
...

## Targeted Rules
### TR_0035
...
### TR_0041
...

## Workbook Observations
...

## Generic-Behavior Verdict
PASS/FAIL with one short explanation.

## Files Written
None

A PASS means:
- etl_capabilities is callable automatically
- the exact supplied workbook is parsed
- V3 changes are discovered from that workbook
- TR_0035 and TR_0041 can be retrieved without truncation
- no other workbook/example/repository implementation is used as a substitute
- no artifacts are created or modified
