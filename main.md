/build

Goal:
Fix the packaged-runtime STTM parser dependency so the installed VSIX can
execute etl_interpret_sttm against .xlsx files without failing with
"Cannot find module 'exceljs'".

Current verified state:
- Version 0.3.134 is installed and activated.
- etl_interpret_sttm is now contributed, registered, visible, and invoked.
- Workspace-relative STTM resolution succeeds.
- The invocation fails inside the installed extension with:
  Cannot find module 'exceljs'
- This is a VSIX runtime-dependency closure defect, not a workbook, workspace,
  prompt, skill, or target-resolution defect.
- The existing parser must be preserved and reused.
- Reinstalling the same 0.3.134 VSIX will not fix the missing dependency.

Target:
- Extension source and package/runtime tests only.
- Produce version 0.3.135.
- Do not modify consumer ETL files.
- Do not modify maintainer control-plane files.
- AGENTS.md, workflow/**, and COPY_ORDER.md are pre-existing WIP and must remain
  untouched and excluded from this task's commit.

Required investigation:
1. Inspect package.json and package-lock.json to determine whether exceljs is:
   - absent,
   - dev-only,
   - transitive-only,
   - or declared as a production dependency.
2. Inspect the bundler configuration and compiled output for an unresolved
   require/import of exceljs.
3. Inspect .vscodeignore, package files configuration, VSCE arguments, and any
   --no-dependencies packaging behavior.
4. Extract the built 0.3.134 VSIX and confirm exactly why exceljs cannot be
   resolved from the packaged extension root.
5. Do not rewrite or replace SttmExcelWorkbookParser unless a separate parser
   defect is demonstrated.

Required implementation:
1. Choose and document one supported packaging strategy:
   a. bundle exceljs into the compiled extension output, or
   b. declare it as a production dependency and include exceljs plus required
      transitive dependencies in the VSIX.
2. Ensure no unresolved runtime dependency remains in the installed package.
3. Update etl_capabilities so a registered parser is not reported as available
   unless its runtime dependencies can actually load.
4. Return structured capability evidence:
   registered, runtimeReady, available, and exact blockers.
5. Preserve fail-closed behavior. Do not add terminal, Python, openpyxl, manual
   binary reading, sample_sttm fallback, or full-workbook paste as an automatic
   workaround.
6. Bump the package and lockfile version to 0.3.135.

Required tests:
1. Build the VSIX and extract it into a unique temporary directory.
2. Load the STTM parser from the extracted packaged runtime, not the source
   repository runtime.
3. Parse a small real .xlsx fixture and verify:
   - sheet inventory,
   - mappings,
   - and sheet/row/cell provenance.
4. If exceljs remains external, prove require.resolve('exceljs') succeeds from
   the extracted extension root.
5. If exceljs is bundled, prove compiled output has no unresolved runtime
   require/import for exceljs.
6. etl_capabilities must report runtimeReady=false with an exact blocker when
   the parser dependency is intentionally unavailable in a negative test.
7. VSIX inspection must show no machine-specific paths.
8. Existing target-containment and sample_sttm rejection tests must continue to
   pass.
9. Real repository .github/** and other protected paths must remain unchanged.

Activation verification:
1. Build databricks-etl-copilot-0.3.135.vsix.
2. Install it.
3. Reload VS Code.
4. Confirm active version 0.3.135.
5. In a consumer workspace run:
   sttm/CD-Renewal_DataMapping_V2.2 1.xlsx
6. Confirm:
   etl_capabilities reports the parser runtime-ready,
   etl_interpret_sttm successfully reads the workbook,
   and the workflow proceeds to an artifact preview without asking the user
   to paste workbook contents.

Completion:
- Invoke a fresh Verifier.
- Report implementation, package, installation, activation, and live smoke-test
  evidence separately.
- Do not report DONE until the extracted-VSIX parser test and activated live
  smoke test both pass.
