Use the current successful customer_orders run as the baseline, but fix output quality issues in the generator itself.

Problem confirmed from real Extension Development Host output:
1. Reuse mode is correct, but the generated artifacts still have quality issues.
2. Source path is hardcoded as a full abfss URI instead of preserving framework variable-based references where appropriate.
3. The flow is over-split into extra transform artifacts for a simple bronze-to-silver case.
4. Some values are duplicated across root job config and include artifacts.
5. The goal is not just “validation passes”; the goal is “framework-compatible, minimal, clean output”.

Source of truth:
- etl-framework-adb = authoritative framework conventions
- sample_repo = example output patterns
- etl-framework-gen-utils = legacy/reference only, not authoritative generator logic

Required fixes:
1. Keep env reuse behavior exactly as-is:
   - do NOT create a new env config
   - do NOT modify existing env config
   - response must continue to say reused existing env config

2. Fix source-path rendering:
   - do NOT emit hardcoded absolute bronze abfss URIs when a framework variable/root expression should be used
   - preserve symbolic/env-based expressions in generated output
   - use authoritative repo conventions to choose the correct variable form
   - do not invent fake variables

3. Reduce unnecessary fragmentation:
   - for simple bronze-to-silver requests like this one, do not generate separate transform_filter + transform_derive artifacts unless the framework truly requires it
   - prefer one transformation step when filter + derive can be represented cleanly together
   - avoid duplicate logic between read_source and transform modules

4. Remove duplicated semantics:
   - source path/filter should not be redundantly represented in multiple places unless required by framework patterns
   - include files should contain only what belongs there

5. Compare generated output against sample_repo + framework examples:
   - job naming
   - module ordering
   - include layout
   - variable usage
   - Synapse publish structure
   - minimal artifact count for simple scenarios

6. Add/adjust tests:
   - customer_orders single-job reused-env scenario must assert:
     a) no env file is written
     b) source uses framework variable form, not hardcoded abfss literal
     c) target path uses framework variable form
     d) simple scenario does not create unnecessary extra transform artifacts
     e) no TODO/TBD/placeholders
   - update golden output assertions accordingly

7. Produce a short final report with:
   - before vs after artifact structure
   - before vs after path rendering
   - exact files now generated
   - compile/test results

Important acceptance criteria:
- Reuse mode stays intact
- No new env config file
- No hardcoded full source abfss URI in final generated artifacts when a framework variable expression is expected
- Minimal artifact set for this simple case
- Output must match framework/sample patterns better than current output

Create TODOs first, inspect the real generated customer_orders files, inspect authoritative examples in etl-framework-adb and sample_repo, then implement the fix.
