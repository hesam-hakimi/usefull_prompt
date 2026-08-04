TEST MODE: READ-ONLY LIVE STTM RETRIEVAL ACCEPTANCE TEST

Do not create, modify, publish, deploy, onboard, register, schedule, run, or
write any file.

Expected active Extension version:
0.3.136

Selected consumer workspace:
Use only the explicitly selected consumer ETL workspace.

Authoritative STTM:
sttm/CD-Renewal_DataMapping_V2.2 1.xlsx

1. Call etl_capabilities.

Report:
- active Extension version;
- selected workspace root;
- target classification;
- resolved STTM path;
- whether etl_interpret_sttm is registered;
- runtimeReady;
- available;
- blockers;
- the active etl_interpret_sttm input schema.

Stop with FAIL_ACTIVE_VERSION if the active version is not 0.3.136.

2. Call etl_interpret_sttm on exactly the supplied workspace-relative file.

3. Use the targeted retrieval capabilities exposed by the active schema.
The expected capabilities include referenceIds and/or sheet/range retrieval.

Retrieve the complete original contents of:

- BR_0003
- TR_0003
- BR_0007
- TR_0007
- JC_001
- FT_001
- FT_002
- FT_003

For every item return:

- exact rule ID;
- complete content without artificial truncation;
- sheet;
- row;
- cell or range;
- current version;
- version date;
- previous-version content where present;
- workbook identity or hash where supported.

Do not:
- return an artificial trailing ellipsis;
- ask me to paste any workbook cell;
- ask me to export the workbook;
- use terminal, Python, pandas, openpyxl, or manual binary reading;
- read extension source, installation files, sample_sttm, or another workspace;
- write any file.

4. Re-evaluate the known response-label conflict using complete content:

- BR_0003 / TR_0003 current Version 2.2;
- BR_0007 / TR_0007 older aggregation Version 1.4.

Report the exact conflicting labels and affected artifact, but do not make the
business decision and do not write aggregation SQL.

5. Produce a preview-only manifest.

Return exactly:

## Test Status

## Active Runtime

## Active Tool Schema

## Targeted Retrieval Results

## Long-Cell Integrity

## Current and Previous Version Evidence

## Version Conflict Evidence

## Preview Manifest

## Files Written

The Files Written value must be:

None

## Acceptance Verdict

Evaluate:

1. Active version is 0.3.136.
2. Parser is registered, runtime-ready, and available.
3. Exact workspace-relative XLSX was read.
4. Targeted retrieval is exposed.
5. BR_0003 is complete.
6. TR_0003 is complete.
7. BR_0007 is complete.
8. TR_0007 is complete.
9. JC_001 is complete.
10. FT_001 is complete.
11. Current and previous versions are distinguishable.
12. Exact provenance is present.
13. No workbook content was requested from the user.
14. No files were written.

PASS requires all 14 criteria.
