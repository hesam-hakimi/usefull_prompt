Investigate and, only if proven necessary, fix Electron test-failure exit-code
propagation.

Task classification: source-only test-harness reliability.
Target type: extension-source.

Current trusted baseline:

- npm run test:
  138 total / 136 passed / 0 failed / 2 pending
- The two pending tests are:
  1. Chat Participant Activation Tests vscode.chat API is available when
     Copilot Chat is installed
  2. Chat Participant Activation Tests Extension activates when chat API is
     available
- The Config Explain fixture correction is complete and independently VERIFIED.

PRIMARY QUESTION

Does one real, non-pending Electron/Mocha test failure reliably cause:

npm run test

to exit with a non-zero process exit code?

Do not infer the answer from renderer text or historical observations. Prove it
with a controlled negative execution.

SAFETY AND SCOPE

- Capture `git status --porcelain` before starting.
- Do not alter the current repository merely to manufacture a failure.
- Create a unique temporary-test-workspace under the operating system temp
  directory.
- Any deliberately failing test must exist only inside that temporary workspace.
- Do not leave an intentionally failing test in the main worktree.
- Do not modify consumer workspaces.
- Do not package, install, reload, publish, or run a product live-smoke test.
- Do not touch `.github/**`, `workflow/**`, `AGENTS.md`,
  `resources/copilot/**`, or unrelated dirty files.
- Do not modify production extension behavior.

CONTROLLED NEGATIVE TEST

1. Create an isolated temporary copy containing only what is necessary to run
   the compiled Electron test harness.

2. In that temporary copy only, introduce one deterministic, non-pending Mocha
   failure with a unique test title such as:

   CONTROLLED_EXIT_CODE_FAILURE

3. Run the exact same command path used by the repository:

   npm run test

4. Capture all four evidence surfaces:

   - inner Mocha totals;
   - Electron/renderer result;
   - `@vscode/test-electron` `runTests()` resolution or rejection;
   - outer shell process exit code.

5. A valid negative test must show exactly one intentional failure and must not
   depend on timing, network access, Chat API availability, or another existing
   test.

TRACE THE PROPAGATION PATH

Inspect and report the complete path, including exact files and functions:

package.json test script
→ pretest
→ src/test/runTests.ts
→ @vscode/test-electron runTests()
→ extension test entry
→ Mocha runner/suite
→ reporter/result-file handling
→ promise resolution/rejection
→ main catch block
→ process exit code

Inspect likely relevant surfaces, but change nothing until the negative
reproduction is complete:

- package.json
- src/test/runTests.ts
- src/test/suite/index.ts or equivalent suite entry
- custom reporters or result-file writers
- VS Code task wrappers, if they affect the observed exit code

CLASSIFICATION

Return one of:

- EXIT_PROPAGATION_CORRECT
- TEST_HARNESS_FALSE_GREEN
- INVOCATION_WRAPPER_FALSE_GREEN
- RESULT_FILE_ONLY_MISINTERPRETATION
- INCONCLUSIVE

IMPLEMENTATION GATE

If the controlled negative test already returns a non-zero exit code:

- do not change source;
- explain why the historical observation appeared green;
- return EXIT_PROPAGATION_CORRECT or
  RESULT_FILE_ONLY_MISINTERPRETATION.

If the controlled negative test produces a Mocha failure but the outer command
returns exit code 0:

1. Identify the exact first layer that swallows or fails to propagate the
   failure.

2. Implement the smallest generic correction in the test harness only.

3. Do not special-case the controlled test title or any existing test.

4. Add a permanent regression test that validates propagation without leaving a
   permanently failing repository test. The regression may launch a temporary
   synthetic failing fixture/process and assert a non-zero child exit code.

5. Do not weaken handling of pending/skipped tests. Pending tests alone must
   continue to allow a successful exit.

REQUIRED VALIDATION AFTER ANY FIX

A. Controlled negative run:

- at least one non-pending failure;
- outer process exit code must be non-zero.

B. Normal repository run:

npm run test

Expected:

138 total / 136 passed / 0 failed / 2 pending

Outer process exit code must be zero.

C. Run relevant unit tests for the modified harness.

D. Invoke a fresh independent Verifier using:

- task-start dirty-file baseline;
- exact task diff;
- controlled negative evidence;
- normal green-run evidence.

The Verifier must confirm:

- failure produces non-zero;
- clean run produces zero;
- pending-only state is not treated as failure;
- no production or consumer code changed;
- no intentionally failing test remains.

RETURN EXACTLY

## CLASSIFICATION

## CONTROLLED_NEGATIVE_RESULT
- temporary workspace
- injected test title
- Mocha totals
- runTests resolution/rejection
- shell exit code

## PROPAGATION_TRACE
Table:
Layer | File | Function | Observed behavior | Correct/Incorrect

## FIRST_DIVERGENCE

## IMPLEMENTATION
State either:
- No source change required
or
- exact generic fix implemented

## REGRESSION_TEST

## NORMAL_FULL_TEST_RESULT
Include totals and outer exit code.

## VERIFIER_RESULT

## SCOPE_CONFIRMATION
- Main task-diff files
- Temporary files created and removed
- Pre-existing dirty files
- Production runtime files changed
- Consumer files changed
- Package/install/reload status

## FILES_CHANGED
