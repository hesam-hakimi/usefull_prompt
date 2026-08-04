/build

Task ID:
STTM-LONG-CELL-RETRIEVAL-PACKAGE-001

This is a new mutating and operational task. Start again at INTAKE.

Goal:
Verify, complete if necessary, package, and install the already-implemented
STTM long-cell and targeted-rule retrieval fix so the installed Extension can
retrieve complete BR/TR/JC/FT rule contents without truncation or asking the
user to paste workbook cells.

Current verified runtime state:
- Active installed Extension version: 0.3.135.
- etl_interpret_sttm is registered, runtime-ready, and available.
- The selected consumer STTM is read successfully.
- Cross-sheet IDs are resolved.
- The active 0.3.135 tool truncates long referenced rule contents at roughly
  180 characters.
- The active tool schema exposes only:
  sttmPath, sttmPaths, workspaceRoot, and includeAudit.
- It exposes no targeted retrieval by reference ID, sheet, or range.
- The read-only acceptance test returned PARTIAL: 10 of 13 criteria passed.
- Criterion 7 failed and criteria 8 and 9 were partial because of the same
  long-cell retrieval defect.
- A previous source session reportedly implemented and unit-tested:
  - untruncated Full Referenced Rule Definitions;
  - targeted retrieval by referenceIds, sheet, and range;
  - ER resolution;
  - rule-level sheet/row/cell/version/version-date provenance;
  - current-versus-previous-version evidence.
- That source fix was never packaged, installed, activated, or live-tested.

Do not repeat broad evidence research unless inspection of the current source
contradicts the confirmed report.

Target resolution:
- Target type: extension-source.
- Canonical source: current Extension runtime/tool/parser implementation,
  package manifests, bundle configuration, and relevant tests.
- Generated destination: new VSIX only.
- Consumer workspace is a read-only live-test target and must not be modified.

Protected and out of scope:
- Do not modify .github/**.
- Do not modify AGENTS.md.
- Do not modify workflow/**.
- Do not modify COPY_ORDER.md.
- Do not modify maintainer agents.
- Do not modify consumer ETL files.
- Do not create or repair CD Renewal ETL artifacts in this task.
- Do not resolve the BR_0003/TR_0003 versus BR_0007/TR_0007 business-label
  conflict in this task.
- Do not add terminal, Python, pandas, openpyxl, CSV, Markdown, manual-paste, or
  sample_sttm fallbacks.
- Preserve unrelated working-tree WIP exactly.

Required investigation:
1. Inspect the exact current source diff and identify whether the reported
   long-cell retrieval fix is present.
2. Identify the exact parser, DTO, serializer, renderer, tool-schema, and
   registration changes involved.
3. Confirm where the active 0.3.135 runtime applies the approximately
   180-character truncation.
4. Confirm that the current source fix removes truncation from the structured
   and model-visible paths.
5. Confirm that the active tool input schema will expose targeted retrieval
   using the actual implemented parameter names, expected to include:
   - referenceIds;
   - sheet;
   - range.
6. Confirm current and previous rule descriptions remain distinguishable.
7. Confirm complete provenance includes:
   - workbook identity;
   - sheet;
   - row;
   - cell or range;
   - rule ID;
   - version;
   - version date.
8. Preserve selected-workspace containment and reject sample, source,
   installation, stale-session, traversal, and external-path fallbacks.

Required implementation:
1. Reuse the already-implemented source fix when it is correct.
2. Implement only missing portions needed to satisfy the acceptance criteria.
3. etl_interpret_sttm must retain its broad workbook interpretation behavior.
4. Add or preserve targeted retrieval for long rules and cells.
5. Full returned contents must not end in an artificial ellipsis.
6. A rule present in the workbook must not become a user clarification merely
   because its initial summary was shortened.
7. Blank ER descriptions in the workbook must remain explicitly blank and must
   not be invented.
8. Bump the package version from 0.3.135 to 0.3.136 so activation of the new
   build can be independently proven.

Required regression tests:
1. Retrieve the complete content of:
   - BR_0003;
   - TR_0003;
   - BR_0007;
   - TR_0007;
   - JC_001;
   - FT_001;
   - FT_002;
   - FT_003.
2. Verify no artificial truncation or trailing ellipsis.
3. Verify targeted retrieval by rule/reference ID.
4. Verify targeted retrieval by sheet and range where supported.
5. Verify current and previous descriptions are distinguishable.
6. Verify exact sheet/row/cell/version/version-date provenance.
7. Verify multiline SQL, CASE, JOIN, UNION ALL, Unicode, and long-cell content.
8. Verify missing IDs and invalid ranges fail with exact blockers.
9. Verify another workspace cannot reuse a prior workbook retrieval context.
10. Verify a changed workbook invalidates stale retrieval evidence when the
    implementation has workbook identity/checksum binding.
11. Verify Windows paths, spaces in the XLSX filename, and POSIX equivalents.
12. Verify no extension-source, sample_sttm, or external fallback.
13. Verify no workbook content is requested from the user when it exists.
14. Verify no consumer files are written during interpretation and preview.
15. Verify protected paths remain byte-identical.

Package and runtime validation:
1. Build the source.
2. Package databricks-etl-copilot-0.3.136.vsix.
3. Inspect the final VSIX and its actual contributed tool schema.
4. Extract the VSIX into a clean temporary directory.
5. Load the packaged parser/tool implementation without repository
   node_modules or source-only files.
6. Parse an XLSX fixture and retrieve the complete long rules.
7. Run targeted tests and broader relevant tests.
8. Demonstrate any claimed pre-existing failure against the task-start
   baseline rather than merely asserting it.
9. Invoke a fresh Verifier.

Installation lifecycle:
1. Install version 0.3.136.
2. Do not report POST_INSTALL_VERIFIED before VS Code reload and a live
   consumer-workspace test.
3. After installation, report exactly:
   INSTALLED_NOT_ACTIVATED
4. Stop and provide the user with the required reload and smoke-test steps.

Required completion report:
- exact root cause;
- exact source files changed;
- exact tool-schema change;
- exact tests and results;
- VSIX contents and version;
- installation result;
- protected paths;
- unrelated WIP preserved;
- Planner result;
- fresh Verifier result;
- lifecycle state.

Do not report DONE merely because build, package, verification, or installation
succeeded. Live completion requires the activated 0.3.136 consumer test.
