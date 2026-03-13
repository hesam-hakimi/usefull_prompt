You are in the main workspace that contains:
- `etl_framework_extension` (the extension source code to modify)
- `etl-framework-adb` (the reference framework repo to read from)

Fix the generator in `etl_framework_extension` so generated ETL jobs use referenced include files instead of keeping everything inline.

Observed behavior:
- The generated file `job_conf/silver/customer_orders_curated.json` is inline.
- Real jobs in `etl-framework-adb` use include-based structure.

Expected behavior:
1. Top-level job config stays small.
2. SQL/module sections move into separate referenced include files.
3. Local write creates:
   - the top-level job config
   - the include files it references
4. Follow the real framework pattern from `etl-framework-adb`.

Search only in `etl_framework_extension/src` for the implementation code.
Most likely files:
- `src/renderers/JobConfigRenderer.ts`
- `src/renderers/IncludeFileRenderer.ts`
- `src/builders/BlueprintBuilder.ts`

Requirements:
- preserve architecture
- name exact file, class, and function changed
- after the fix, tell me to run F5 and retest the same `@etl /create ...` request
