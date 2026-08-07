Investigate the 14 integration-test failures now exposed by the repaired `npm run test` path.

Repository:
etl_framework_extension

Branch:
feature/v3-agentic-redesign

This is an INVESTIGATION-ONLY task.

Context already VERIFIED:

- The pretest ESLint blocker in SttmExcelWorkbookParser.ts was fixed with a single line-scoped suppression.
- The literal `require('exceljs')` remains unchanged.
- `npm run pretest` passes.
- `npm run test` now successfully reaches the VS Code/Electron integration runner.
- The runner executed 136 Mocha tests:
  - 120 passed
  - 14 failed
  - 2 pending
- Focused STTM parser tests: 35 passing.
- Extracted-VSIX STTM packaged-runtime tests: 5 passing.
- The previous change was independently VERIFIED.

Objective:

Determine exactly what the 14 integration failures are and whether they are:

A. pre-existing baseline failures,
B. caused by current branch/WIP changes,
C. caused by environment or VS Code/test-host conditions,
D. caused by stale generated/packaged assets,
E. genuine product regressions.

DO NOT FIX ANYTHING IN THIS TASK.

Steps:

1. Re-run or inspect the integration test result using the existing repository-supported test path.
   Use MOCHA_RESULT_FILE or the existing result artifact if useful.

2. Produce the exact list of all 14 failing tests:
   - suite
   - test name
   - source test file
   - exact failure/error
   - relevant stack location

3. Group failures by root-cause signature.
   Do not treat 14 assertions with the same root cause as 14 independent defects.

4. For every failure group, inspect the relevant test and implementation evidence and classify it as:
   - PRE_EXISTING_BASELINE
   - CURRENT_WIP_REGRESSION
   - ENVIRONMENTAL
   - STALE_GENERATED_ASSET
   - PRODUCT_DEFECT
   - INCONCLUSIVE

5. Specifically check whether any failures are related to:
   - the recently copied maintainer workflow assets;
   - orchestrator / planner / verifier / evidence-researcher assets;
   - packaged `resources/copilot/**`;
   - customization/generated-agent drift;
   - STTM parsing;
   - ExcelJS packaging/runtime;
   - VS Code version/test-host behavior.

6. Check repository history/baseline evidence where possible to determine whether each failure existed before the current relevant changes.
   Do not simply call something "pre-existing" because it is outside the previous task scope.

7. Separate the 2 pending tests from the 14 failures and explain why they are pending.

8. Do not modify:
   - source files
   - tests
   - baselines
   - snapshots
   - generated assets
   - .github/**
   - workflow/**
   - consumer workspace files

9. Do not suppress, skip, loosen, or rewrite any failing test.

Return a concise but complete report:

## Integration Test Triage

### Summary
- total
- passed
- failed
- pending
- number of distinct root-cause groups

### Failure Groups

For each group:
- classification
- affected tests
- exact error
- evidence
- likely root cause
- whether it blocks extension development/release
- recommended next action

### Pending Tests
Explain both pending tests.

### Relationship to Recent Changes
State explicitly whether there is evidence linking any failure to:
- the ExcelJS lint fix,
- STTM parser changes,
- copied workflow/control-plane assets,
- other current working-tree changes.

### Priority
Rank only the genuine/unresolved failure groups P0/P1/P2.

### Files Changed
Must be: NONE.

Do not implement fixes.
