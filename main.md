Create TODOs first and keep them updated until everything is verified.

We are now starting the next phase: end-to-end acceptance verification for real ETL generation flows.

Context:
- Validation/include-resolution debugging is complete.
- Output-quality hardening is complete.
- 112/112 tests are passing.
- Golden scenarios for naming, module order, include paths, variable naming, Synapse publishing, env-config reuse, and template disclosure are passing.

New goal:
Prove that the extension works correctly in real user-facing create flows inside the Extension Development Host, using realistic prompts and actual generated files.

Do the following:

1. Define a small acceptance suite of real prompts, including at minimum:
   - customer_orders single_job with reused env config
   - customer_orders split_extract_load with reused env config
   - build-from-scratch flow
   - template-hints-only flow
   - full-structure-template flow
   - optional onboarding artifact
   - optional validation query artifact
   - one negative scenario that must fail validation and block write

2. For each scenario, verify all of the following:
   - correct template decision shown in response
   - correct env-config reuse behavior
   - correct job-shape behavior
   - correct generated file count
   - correct generated paths
   - correct module order
   - correct include strategy
   - no placeholder/TODO fragments
   - write blocked on fail / allowed on pass

3. Add runtime-evidence tests where possible, but do not stop at tests.
   Also produce a user-facing acceptance report based on actual extension behavior.

4. Compare generated files against:
   - etl-framework-adb
   - sample_repo
   - source framework repo conventions
   and identify any remaining differences that are still acceptable vs must-fix.

5. If any mismatch exists between tests and real Extension Host behavior, fix the generator/flow logic, not just the tests.

6. Produce a final acceptance report containing:
   - scenarios executed
   - pass/fail result per scenario
   - screenshots or runtime evidence summary
   - exact files generated
   - remaining known limitations
   - recommendation: ready for pilot / not ready

Important rules:
- Keep TODOs visible and updated.
- Do not mark any item complete without verification evidence.
- Focus on real extension behavior, not only unit tests.
- If a bug appears, fix it and rerun the affected acceptance scenario before closing the task.

