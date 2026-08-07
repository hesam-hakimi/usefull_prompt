Investigate ONLY the final remaining Electron failure:

"Config Explain Integration resolves env variables for lineage outputs"

This is a bounded, read-only source investigation.

Task classification: source-only investigation.
Target type: extension-source.

Do not modify any files.
Do not package, install, reload, publish, or run a live smoke test.
Do not investigate any already-resolved Chat Participant, STTM, Run Diagnosis,
Artifact Reuse, or Copilot workflow-routing issue.

Known baseline after the previous verified correction:

- Full Electron result:
  138 total / 135 passed / 1 failed / 2 pending
- The only failed test is:
  Config Explain Integration resolves env variables for lineage outputs
- The two pending Chat API tests are unchanged and outside this investigation.

Required investigation:

1. Reproduce only the named failure using the narrowest supported Electron/Mocha
   filter.

2. Report:
   - exact test file and line;
   - exact failing assertion;
   - expected value;
   - complete actual value;
   - relevant stack trace.

3. Trace the complete data path, with file and function provenance:

   test fixture
   → job/config input
   → include resolution
   → environment configuration
   → HOCON/environment-variable substitution
   → Config Explain resolver/service
   → lineage target construction
   → rendered/asserted output

4. The previous evidence suggested that the test expects a lineage target similar
   to:

   synapse:acz0001.digital_event

   Confirm the exact expected value from the test itself. Do not assume or
   fabricate it.

5. Locate the authoritative origin of every component of the expected target:

   - provider/type, such as "synapse";
   - environment or account identifier, such as "acz0001";
   - object/table name, such as "digital_event".

   Show the exact fixture/config/include/environment entries from which each
   component should be derived.

6. Determine whether the variable:
   - is not parsed;
   - is parsed but not substituted;
   - is substituted with the wrong precedence;
   - is lost during include resolution;
   - is resolved correctly but dropped during lineage normalization;
   - is present in the model but omitted by rendering;
   - or is no longer part of the canonical contract.

7. Compare:
   - direct resolver/service output;
   - focused unit-test output, if available;
   - Electron-host output.

   Identify the first layer where expected and actual values diverge.

8. Inspect neighboring Config Explain tests and relevant git history to determine
   whether this is:

   - PRODUCT_DEFECT
   - STALE_TEST
   - FIXTURE_DEFECT
   - TEST_HOST_ENVIRONMENT
   - INTENTIONAL_CONTRACT_CHANGE
   - INCONCLUSIVE

9. Do not:
   - hard-code "synapse:acz0001.digital_event";
   - weaken or delete the assertion;
   - change test data merely to make the test pass;
   - add fallback values;
   - infer missing environment values;
   - modify consumer-workspace files;
   - modify .github/**, workflow/**, AGENTS.md, packaged Copilot assets, or
     unrelated dirty files.

10. Capture the dirty-file baseline before investigation and distinguish all
    pre-existing changes from this task.

Return exactly these sections:

## ROOT_CAUSE
One of:
PRODUCT_DEFECT
STALE_TEST
FIXTURE_DEFECT
TEST_HOST_ENVIRONMENT
INTENTIONAL_CONTRACT_CHANGE
INCONCLUSIVE

## FAILURE_REPRODUCTION
- command
- test file and line
- expected
- actual
- stack evidence

## END_TO_END_PROVENANCE
A table with:
Layer | File | Function/Test | Input | Output | Correct/Incorrect

## FIRST_DIVERGENCE
The exact first function or transformation where the expected lineage target is
lost or changed.

## CANONICAL_BEHAVIOR
What Config Explain should return and why, based only on repository evidence.

## SMALLEST_RECOMMENDED_FIX
Specify whether production code, fixture, or test should change.
Do not implement it in this turn.

## EXACT_FILES_THAT_WOULD_CHANGE

## REGRESSION_TESTS_REQUIRED

## SCOPE_CONFIRMATION
- Files changed: NONE
- Package/install performed: NO
- Consumer workspace modified: NO
