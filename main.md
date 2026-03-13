Fix the ETL artifact generator so generated jobs use referenced include files instead of putting everything inline in one job config.

Observed behavior:
- The generated job config at `job_conf/silver/customer_orders_curated.json` keeps SQL and module details inline.
- In the real ETL framework, job configs should reference separate include files where appropriate.

Expected behavior:
1. The top-level job config should stay small and reference separate include files.
2. SQL or module-specific sections should be moved into referenced include files using the real framework style.
3. The generated output should follow patterns from real jobs in `etl-framework-adb`.
4. Local write should create both:
   - the top-level job config
   - the referenced include files

Patch the smallest safe surface first.

Most likely areas:
- `src/renderers/JobConfigRenderer.ts`
- `src/renderers/IncludeFileRenderer.ts`
- `src/builders/BlueprintBuilder.ts`
- any template or artifact assembly logic that decides inline vs include output

Requirements:
- preserve current architecture
- use the real framework repo in this workspace as the source of truth
- name the exact file, class, and function changed
- after the fix, tell me to run F5 and retest the same `@etl /create ...` request
