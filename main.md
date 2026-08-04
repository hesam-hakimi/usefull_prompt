TEST MODE: READ-ONLY FINAL CAPABILITIES AND STTM VERSION ACCEPTANCE TEST

Expected active Extension version:
0.3.137

Do not create, modify, publish, deploy, onboard, register, run, or write any
file.

Authoritative STTM:
sttm/CD-Renewal_DataMapping_V2.2 1.xlsx

1. Call etl_capabilities.

Report:
- active Extension ID and version;
- active status;
- selected workspace root;
- target classification;
- etl_interpret_sttm registered;
- runtimeReady;
- available;
- blockers;
- active input schema, including referenceIds, sheet, and range.

Stop with FAIL_ACTIVE_VERSION if the active version is not exactly 0.3.137.

2. Call etl_interpret_sttm using the exact workspace-relative STTM.

3. Perform targeted retrieval for:

- BR_0003
- TR_0003
- BR_0007
- TR_0007

For every rule return:

- exact current text;
- current version;
- current version date;
- current sheet/row/cell or range;
- exact previous text;
- previous version;
- previous version date;
- previous sheet/row/cell or range.

Expected evidence:

BR_0003 and TR_0003:
- current version: 2.2
- current date: 2026-04-06
- previous version: 2.1
- previous date: 2025-11-20
- current and previous text must be separate and complete.

BR_0007 and TR_0007:
- current version: 1.4
- current date: 2025-04-15
- previous: null unless the workbook contains authoritative prior content.

4. Confirm:
- current and previous text are not concatenated;
- version numbers and dates are associated with the correct text;
- no artificial truncation exists;
- no workbook content is requested from the user;
- no external/sample/source path is accessed;
- no file is written.

5. Re-evaluate the TR_0003 versus TR_0007 label conflict using the exact current
texts. Report the conflict only. Do not resolve the business decision and do
not generate aggregation SQL.

Return:

## Test Status
## Active Runtime
## Capability Result
## Active Tool Schema
## BR_0003 Versioned Retrieval
## TR_0003 Versioned Retrieval
## BR_0007 Versioned Retrieval
## TR_0007 Versioned Retrieval
## Version Conflict Evidence
## Files Written
## Acceptance Verdict

Files Written must be:

None

Acceptance criteria:

1. Active version is 0.3.137.
2. etl_capabilities is callable.
3. etl_capabilities reports active-runtime evidence.
4. STTM parser is registered, runtime-ready, and available.
5. Targeted retrieval schema is exposed.
6. BR_0003 current and previous text are separate and complete.
7. TR_0003 current and previous text are separate and complete.
8. BR_0007 correctly reports no previous version when none exists.
9. TR_0007 correctly reports no previous version when none exists.
10. Version/date provenance is correctly associated.
11. No artificial truncation exists.
12. No workbook content was requested from the user.
13. No external or sample path was accessed.
14. No files were written.

PASS requires all 14 criteria.
