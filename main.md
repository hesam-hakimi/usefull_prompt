Fix the ETL blueprint generation so it follows the real framework flow for sourcing vs transformation.

Observed problem:
- The generated output still does not model the ETL flow correctly.
- `data_sourcing_process` should define the source and create the source/temp view.
- `data_transformation` should consume that sourced view.
- Right now the generated include/output is mixing concerns and the transformation include is acting like sourcing.

Expected behavior:
1. `data_sourcing_process`:
   - defines `sourceList`
   - defines the source object
   - reads from the real source path/table
   - produces the sourced view
2. `data_transformation`:
   - reads from the sourced/temp view created by sourcing
   - applies business transformations only
3. top-level job config and include files must follow real examples from `etl-framework-adb`

Use `etl-framework-adb` in this workspace as the source of truth.

Patch the smallest safe surface first.

Most likely files:
- `src/builders/BlueprintBuilder.ts`
- `src/renderers/JobConfigRenderer.ts`
- `src/renderers/IncludeFileRenderer.ts`

Requirements:
- preserve architecture
- name the exact file, class, and function changed
- after the fix, tell me to run F5 and retest the same `@etl /create ...` request
