READ-ONLY LIVE SMOKE TEST

Do not create, modify, publish, deploy, onboard, register, run, or write any
file.

Use the Product ETL Orchestrator exactly as loaded after installing and
activating version 0.3.138.

Do not open or change Configure Tools.

Authoritative STTM:
sttm/CD-Renewal_DataMapping_V2.2 1.xlsx

1. Call etl_capabilities without any manual tool selection.

Report:
- whether the tool was callable;
- active Extension ID and version;
- selected workspace root;
- target classification;
- runtimeReady;
- available;
- blockers;
- number of registered Databricks ETL Copilot tools.

Fail immediately if:
- etl_capabilities is unavailable;
- the active version is not exactly 0.3.138;
- runtimeReady is not true;
- available is not true.

2. Call etl_interpret_sttm using exactly the supplied workspace-relative file.

Retrieve:

- BR_0003
- TR_0003
- BR_0007
- TR_0007

3. Verify version-history behavior.

Expected:

BR_0003 and TR_0003:
- current version 2.2 dated 2026-04-06;
- previous version 2.1 dated 2025-11-20;
- current and previous texts independently retrievable and complete;
- previousExists=true.

BR_0007 and TR_0007:
- current version 1.4 dated 2025-04-15;
- exactly one revision in the workbook;
- previousExists=false;
- previous text/version/date are null or absent;
- previousAbsentReason states:
  "No previous revision exists in the workbook."

The absence of a previous revision for BR_0007/TR_0007 is expected and must be
reported as PASS, not as a parser or retrieval failure.

4. Confirm:
- no artificial long-cell truncation;
- no request to paste workbook content;
- no extension-source, installation, external, or sample_sttm path was used;
- no files were written;
- the TR_0003 v2.2 versus TR_0007 v1.4 label conflict is reported but not
  automatically resolved.

Return exactly:

## Test Status
## Active Runtime
## Capability Result
## BR_0003 Version Evidence
## TR_0003 Version Evidence
## BR_0007 Single-Revision Evidence
## TR_0007 Single-Revision Evidence
## Label Conflict
## Files Written
## Acceptance Verdict

Files Written must be:

None

PASS requires all of the following:

1. etl_capabilities was callable without manually selecting it.
2. Active version is 0.3.138.
3. runtimeReady=true.
4. available=true.
5. BR_0003 current and previous values are complete.
6. TR_0003 current and previous values are complete.
7. BR_0007 correctly reports previousExists=false.
8. TR_0007 correctly reports previousExists=false.
9. No long-cell truncation exists.
10. No workbook content was requested from the user.
11. No external or sample path was used.
12. No files were written.
