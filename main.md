Fix the ETL job generator so the generated job config follows the real ETL framework structure.

Observed problem:
- The generated file starts with a transformation-style module like `read_bronze_customer_orders`.
- In the real framework, the job should begin with `data_sourcing_process` and define source entries under it.

Expected behavior:
- The first module should be `data_sourcing_process`
- It should include a `sourceList`
- It should define source objects in the framework style
- Later transform and writer modules can reference the sourced data

Use the real framework repo in this workspace as the source of truth for structure:
- compare the generated file with real job configs in `etl-framework-adb`
- patch the generator to match the real pattern

Inspect and patch the smallest safe surface first.
Most likely areas:
- `src/builders/BlueprintBuilder.ts`
- `src/compilers/TransformationCompiler.ts`
- `src/renderers/JobConfigRenderer.ts`
- any template-selection logic that decides the first module shape

Requirements:
1. Preserve the current architecture.
2. Make the smallest safe fix.
3. Name the exact file, class, and function changed.
4. After the fix, tell me to run F5 again and retest `@etl /create ...`
