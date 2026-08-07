Fix only the pretest ESLint blocker that currently prevents the real integration test from running.

Repository:
etl_framework_extension

Branch:
feature/v3-agentic-redesign

Known evidence from the previous verified task:

- `npm run test` is the repository's real VS Code/Electron integration-test command.
- However it currently stops in its pretest lint phase.
- The blocking lint error is:
  src/core/sttm/SttmExcelWorkbookParser.ts:53
  @typescript-eslint/no-var-requires

Critical historical constraint:

The literal/static `require('exceljs')` in SttmExcelWorkbookParser was introduced intentionally because the previous aliased/dynamic require prevented esbuild from bundling exceljs into the shipped VSIX.

That behavior was previously fixed and validated using an extracted-VSIX parser test.

DO NOT regress that fix.

Task:

1. Inspect the exact lint failure and the current ExcelJS loading implementation.

2. Make the smallest safe correction that allows ESLint/pretest to pass while preserving the existing ExcelJS bundling/runtime behavior.

Preferred solution:
- If the literal `require('exceljs')` is intentionally required for esbuild static analysis, use the narrowest justified ESLint suppression/comment for that exact line.
- Document WHY the literal require must remain.

Do NOT:
- change it back to an aliased/dynamic require;
- introduce a generic runtime require wrapper;
- alter parser semantics;
- alter STTM parsing behavior;
- change workbook interpretation;
- modify unrelated lint rules globally;
- modify consumer workspace files;
- fix unrelated existing unit-test baseline failures.

Only use a different loading implementation if repository evidence proves it preserves the extracted-VSIX ExcelJS bundling behavior exactly.

Validation requirements:

1. Run the focused lint/pretest validation.
2. Run `npm run test`.

Important:
`npm run test` must now get PAST the pretest/lint stage and actually invoke the VS Code/Electron integration runner. Merely proving that the command exists is not sufficient.

3. Run the existing extracted-VSIX/STTM parser packaging test that proves ExcelJS remains available from the packaged extension, if that test is available.

4. Run the relevant focused STTM parser tests.

5. Do not fix the five previously recorded unrelated unit-baseline failures in this task.

6. Invoke a fresh independent Verifier.

Delivery classification:

- If the implementation is only a narrowly-scoped lint suppression/comment and runtime output is unchanged, classify this task as source-only.
- If any executable parser/runtime implementation changes, classify it as shipped-extension and follow the repository's shipped-extension lifecycle contract.

Return:

1. root cause
2. exact file(s) changed
3. exact change made
4. confirmation that literal/static ExcelJS bundling semantics were preserved
5. lint result
6. evidence that `npm run test` actually reached the integration runner
7. extracted-VSIX ExcelJS/parser test result
8. verifier verdict
9. residual blockers

Do not fix any unrelated issue discovered during this task.
