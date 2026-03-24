Create TODOs first and keep them updated.

The include-resolution and validation-pipeline debugging track is now considered complete. Start the next phase: output-quality hardening for ETL artifact generation.

Goal:
Verify that generated ETL artifacts are not only valid, but also framework-faithful and production-usable.

Do the following:

1. Define 5-8 golden end-to-end scenarios using real-style prompts:
   - customer_orders single_job
   - customer_orders split_extract_load
   - reuse existing env config
   - build from scratch
   - template hints only
   - full-structure template
   - optional onboarding config
   - optional validation/smoke artifact

2. For each scenario, compare generated output against:
   - etl-framework-adb patterns
   - sample_repo examples
   - expected framework conventions for:
     - job naming
     - module order
     - include strategy
     - variable naming
     - source/target structure
     - synapse publish structure

3. Add automated regression tests that verify:
   - output structure
   - key property presence
   - module ordering
   - include path conventions
   - template disclosure in chat response
   - reuse-mode behavior
   - split vs single-job behavior

4. If generated output uses placeholders, generic names, invalid SQL fragments, or weak framework conventions, fix the generator logic instead of only changing tests.

5. Produce a final report with:
   - scenarios tested
   - pass/fail per scenario
   - gaps found
   - fixes made
   - remaining known limitations

Important:
Do not stop at “validation passed”.
This phase is about framework fidelity and output quality.
Use TODO tracking and only mark items done when implemented and verified by tests.
