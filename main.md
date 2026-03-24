Create TODOs first and keep them updated until everything below is verified with real runtime evidence.

We have implemented the include-resolution fix and context-aware validation pipeline. Now do the final end-to-end verification using the real customer_orders scenario.

Goal:
Prove that the fix works in the actual create flow, not only in unit tests.

Required verification steps:

1. Run the real customer_orders create scenario end-to-end with:
   - reused existing env config
   - single job config mode
   - no optional artifacts unless explicitly selected

2. Capture runtime evidence for the full flow:
   - template decision
   - env config reuse decision
   - include graph resolution
   - merged/effective config build
   - variable resolution
   - validation result
   - write result

3. Confirm these exact acceptance criteria:
   - no new env config file is created when reuse mode is selected
   - includes are resolved recursively before validation
   - reused env config content is not incorrectly rejected because of HOCON syntax
   - required properties are validated on effective root config only
   - unresolved-variable errors for keys defined through included env/common configs are gone
   - single_job creates exactly one top-level job config
   - fragment/include files are not treated as standalone root configs
   - write is allowed only when final validation passes

4. Show the exact files written for the passing scenario.

5. Add or update regression tests if any missing runtime behavior is discovered.

6. Provide a final report with:
   - exact request used
   - runtime output summary
   - files written
   - whether validation passed
   - whether write was allowed
   - whether any remaining gap still exists

Important:
Do not only summarize. Show concrete runtime evidence from the real scenario.
If anything still fails, stop and fix it before closing the report.
