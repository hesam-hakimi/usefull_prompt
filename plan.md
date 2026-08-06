READ-ONLY AUTHORITATIVE-STTM RECONCILIATION AND EVIDENCE-CLOSURE TEST

Do not write, create, modify, publish, deploy, onboard, register, schedule, or
run anything in this phase.

User-selected STTM:

sttm/CD-Renewal_DataMapping_V3.0.1.xlsx

Important:
Do NOT depend on the user telling you whether this workbook is "new",
"updated", or "a new version".

The supplied STTM path is the authoritative STTM input for this task.

──────────────────────────────────────────────────────────────────────────────
1. Runtime preflight
──────────────────────────────────────────────────────────────────────────────

Call etl_capabilities.

Report:

- active Extension ID;
- active Extension version;
- selected workspace root;
- target classification;
- etl_interpret_sttm registered;
- runtimeReady;
- available;
- blockers.

Stop only for a real runtime/tool blocker.

──────────────────────────────────────────────────────────────────────────────
2. Authoritative Input Binding
──────────────────────────────────────────────────────────────────────────────

Resolve the supplied relative path against the explicitly selected consumer
workspace.

Establish the strongest workbook identity currently supported, using:

- canonical selected workspace;
- canonical relative STTM path;
- workbook fingerprint/hash if the runtime exposes one;
- otherwise another deterministic runtime identity if available.

Do not fabricate a hash.

If the runtime cannot expose a workbook fingerprint, report:

WORKBOOK_IDENTITY_LIMITATION

but continue using the exact selected workspace + canonical path as the task
binding.

Rules:

- Do not reuse STTM-derived facts from an earlier workbook merely because the
  job name is the same.
- Do not use session-memory STTM values as authoritative evidence.
- Do not use sample_sttm.
- Do not inspect Extension source/install/example folders.
- Do not substitute another STTM if this one cannot be read.
- Do not treat the version embedded in the filename as authoritative.

Detect the actual current version/version date from workbook evidence.

If filename version and workbook version differ, report the difference rather
than silently choosing the filename.

──────────────────────────────────────────────────────────────────────────────
3. Parse and inventory the current workbook
──────────────────────────────────────────────────────────────────────────────

Call etl_interpret_sttm on exactly:

sttm/CD-Renewal_DataMapping_V3.0.1.xlsx

Inventory all recognized sheets and relevant helper sheets.

At minimum reconcile:

- Revision History
- Table & Schema Definition
- File & Schema Definition
- Field Mapping
- Business Rules
- Transformation Rules or Logic
- Join Clause
- Error Messages
- Appendix

Report:
- detected workbook/revision version;
- revision date;
- recognized sheet inventory;
- active mapping count;
- relevant parser diagnostics.

──────────────────────────────────────────────────────────────────────────────
4. V3 revision reconciliation
──────────────────────────────────────────────────────────────────────────────

Use Revision History as navigation evidence, then verify every change against
the actual schema/mapping/rule sheets.

Verify the V3 revision that references these additions:

- mfastatus
- transferamount
- transferfrom
- transferto
- transferstatus
- cdclosuresuccessful

For each item do NOT stop at Revision History.

Trace it through:

Revision History
→ File/Table Schema
→ Field Mapping
→ BR/TR/JC/FT
→ Source
→ Target

Return exact provenance.

──────────────────────────────────────────────────────────────────────────────
5. Complete V3 output schema
──────────────────────────────────────────────────────────────────────────────

Retrieve the complete relevant File & Schema Definition for:

digital_cd_renewal_requests_*.csv

For each active output field report:

- F_SCHM ID;
- technical field name;
- business field name;
- data type;
- sequence/position;
- mandatory flag;
- version;
- version date;
- comments when relevant.

Clearly identify the six V3-added fields.

Do not infer schema from filenames or Revision History alone.

──────────────────────────────────────────────────────────────────────────────
6. Complete field-mapping traceability
──────────────────────────────────────────────────────────────────────────────

For each of these fields:

- mfastatus
- transferamount
- transferfrom
- transferto
- transferstatus
- cdclosuresuccessful

retrieve the complete active Field Mapping row.

Return:

- Field Mapping row/ID;
- source schema ID;
- source entity/table;
- source technical field;
- target schema ID;
- target technical field;
- BR ID;
- TR ID;
- JC ID;
- FT ID;
- current version;
- version date;
- exact transformation/mapping evidence.

Do not infer missing mappings from similar fields.

If a mapping is genuinely absent, classify it as MISSING_EVIDENCE.

If the information exists but cannot be retrieved because of a tool
limitation, classify it as TOOLING_GAP.

Do not ask the user for data that exists in the workbook.

──────────────────────────────────────────────────────────────────────────────
7. Rule resolution
──────────────────────────────────────────────────────────────────────────────

Retrieve complete targeted evidence for every rule referenced by the six V3
fields.

Specifically inspect:

TR_0035
TR_0041

and any associated BR/JC/FT IDs.

For TR_0035:
determine exactly which fields legitimately use Straight Move and from which
source fields.

Do not interpret "Straight Move" as permission to invent a source mapping.

For TR_0041:
return the complete CASE logic exactly as represented in the workbook,
including its source transaction/entity evidence.

Do not simplify, normalize, or rewrite its business logic during this phase.

──────────────────────────────────────────────────────────────────────────────
8. Source and operation graph
──────────────────────────────────────────────────────────────────────────────

Build the source/operation graph solely from active workbook evidence.

Determine which V3 mappings, if any, use:

DepositAccounts_GET_CD_FundTransfer_MT

and identify any other operation/transaction types required by the active
mappings.

For every source relationship report:

- source entity;
- transaction/operation;
- mapped fields;
- applicable join ID;
- exact join evidence.

Do not create a new join merely because a new operation exists.

If the STTM specifies a source but provides no supported relationship to the
existing graph, report:

MISSING_EVIDENCE

rather than inventing a join.

──────────────────────────────────────────────────────────────────────────────
9. Reconcile older rules against the current workbook
──────────────────────────────────────────────────────────────────────────────

Using this current authoritative workbook, retrieve and compare:

- BR_0003
- TR_0003
- BR_0007
- TR_0007

Use current-version semantics correctly:

- when a previous revision exists, retrieve current and previous separately;
- when no previous revision exists, previousExists=false is valid evidence.

Determine whether the known response-label versus aggregation-label conflict
still exists in the current authoritative workbook.

If it still exists:

Classification:
BUSINESS_CONFLICT

Affected artifact:
identify the exact dependent report/output.

Do NOT:
- select one rule as authoritative on your own;
- rewrite TR_0007;
- rewrite TR_0003;
- normalize the labels;
- generate "corrected" aggregation SQL.

Unrelated artifacts may continue toward preview when safe.

──────────────────────────────────────────────────────────────────────────────
10. Repository reconciliation
──────────────────────────────────────────────────────────────────────────────

Inspect the current consumer repository.

Determine:

- whether the ETL job already exists;
- whether this task is CREATE or UPDATE;
- existing job config;
- existing development env config;
- shared includes;
- existing SQL/include layout;
- output writer conventions;
- existing onboarding artifact.

A changed/new STTM does NOT automatically mean a new job.

If the same ETL job already exists, treat the new STTM as an UPDATE candidate
unless current evidence proves otherwise.

Prefer reuse of the existing repository-conformant env config.

Do not create a second env config merely because generation is possible.

Do not create two competing job configs.

──────────────────────────────────────────────────────────────────────────────
11. Infrastructure evidence challenge
──────────────────────────────────────────────────────────────────────────────

Explicitly test whether current evidence supports any of these proposed values:

- Oracle target;
- JDBC delivery;
- JDBC URL;
- driver class;
- username/password;
- secret reference;
- database writer;
- new storage account;
- new ABFS/DBFS root;
- new cluster;
- append;
- overwrite;
- merge;
- upsert.

For each return one of:

CONFIRMED_FROM_STTM
CONFIRMED_FROM_REPOSITORY
CONFIRMED_FROM_FRAMEWORK
EXPLICIT_USER_DECISION
MISSING_EVIDENCE
INFERRED_NOT_ALLOWED

Do not add an infrastructure value because it seems plausible.

Do not emit TODO infrastructure values into an artifact intended for
validation/write.

──────────────────────────────────────────────────────────────────────────────
12. Evidence Closure Gate
──────────────────────────────────────────────────────────────────────────────

Before declaring any artifact READY_FOR_PREVIEW, classify every artifact-shaping
decision as exactly one of:

CONFIRMED_FROM_STTM
CONFIRMED_FROM_REPOSITORY
CONFIRMED_FROM_FRAMEWORK
EXPLICIT_USER_DECISION
BUSINESS_CONFLICT
MISSING_EVIDENCE
TOOLING_GAP
INFERRED_NOT_ALLOWED

Rules:

- CONFIRMED_* may proceed.
- EXPLICIT_USER_DECISION may proceed with recorded provenance.
- BUSINESS_CONFLICT blocks only dependent artifacts.
- MISSING_EVIDENCE blocks affected artifacts.
- TOOLING_GAP is a product/tool blocker, not a user business question.
- INFERRED_NOT_ALLOWED must never enter a rendered or written artifact.

Before asking the user any question, prove that it cannot be answered from:

1. the authoritative STTM;
2. the current repository;
3. Framework tools/contracts.

──────────────────────────────────────────────────────────────────────────────
13. Preview eligibility only
──────────────────────────────────────────────────────────────────────────────

Do NOT render final files yet.

For each expected artifact report:

READY_FOR_PREVIEW
CONFLICT
BLOCKED

Consider at minimum:

- job config;
- env config;
- shared includes;
- transformation SQL/includes;
- main target writer;
- digital_cd_renewal_requests CSV writer;
- cd_successfailure aggregation writer;
- onboarding.

For every CONFLICT/BLOCKED item include:

- exact blocker;
- evidence source;
- whether unrelated artifacts may continue.

──────────────────────────────────────────────────────────────────────────────
Required output
──────────────────────────────────────────────────────────────────────────────

Return exactly these sections:

## Active Runtime

## Authoritative STTM Binding
- selected workspace
- canonical relative path
- workbook identity/fingerprint if available
- detected workbook version
- detected revision date

## Workbook Inventory

## V3 Revision Evidence

## V3 Output Schema

## V3 Field Mapping Matrix

## V3 Source and Operation Graph

## TR_0035 Evidence

## TR_0041 Evidence

## Current Rule Reconciliation

## Existing Repository Analysis

## Infrastructure Evidence Challenge

## Evidence Closure Matrix

## Business Conflicts

## Missing Evidence

## Tooling Gaps

## Inferred Decisions Rejected

## Preview Eligibility

## Questions Requiring User Decision

Only genuine non-derivable questions may appear here.

## Files Written

None

Do not call etl_write_to_workspace.
Do not publish to DBFS.
Do not deploy, onboard, register, schedule, or run.
