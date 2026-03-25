Do not continue the transformation-strategy implementation.

The current milestone is the OUTPUT / DELIVERY layer, not the transformation layer.

Use only these framework docs as primary source:
- src/context_files/load_enrich.md
- src/context_files/dataframe_writer.md
- src/context_files/dataout_database.md
- src/context_files/dataout_tibco.md

Goal:
Implement a new rule-driven OutputStrategy layer that decides how the final result should be delivered after sourcing/transformation.

Required strategies:
1. curated_load_enrich
   - use load_enrich_process for curated-zone writes
   - reserved for curated/silver/gold target writes with merge/cdc/scd semantics

2. file_export_dataframe_writer
   - use dataframe_writer for normal file outputs

3. database_out
   - create database data file + database control file pattern
   - both use dataframe_writer
   - write to ADLS first
   - assert.sql.after must generate the metadata required for downstream ADLS-to-database pipeline

4. tibco_out
   - create tibco data file + tibco control file pattern
   - both use dataframe_writer
   - assert.sql.after must generate the metadata contract documented in dataout_tibco.md
   - support mailbox, filename, pin_container, pin_delete_files, and ETL2.0 env fallback behavior

Strict rules:
- Do not create or modify transformation advisor/planner/validator logic except where absolutely required for integration.
- Do not re-implement DataTransformation* files.
- Do not use load_enrich_process for database_out or tibco_out.
- Do not use dataframe_writer for curated merge/scd/cdc cases when load_enrich_process is the documented framework path.
- Use exact documented config key names from the docs.
- Surface the chosen output strategy in session state and chat response.
- Add validators for each output strategy.
- Add tests for:
  - curated_load_enrich
  - database_out
  - tibco_out
  - invalid mixed strategy config
  - required metadata generation in assert.sql.after

Before coding:
1. Print a short implementation plan.
2. List the files you will create/modify.
3. Explain how the new layer fits after transformation and before rendering/validation.
4. Then implement.
5. Run lint and tests.
6. Report only real results; do not say tests passed unless they actually ran successfully.
