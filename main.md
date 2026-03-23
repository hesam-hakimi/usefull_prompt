You need to add strict pre-write validation to the ETL job generation flow.

Goal:
The extension must NEVER write invalid or incomplete generated files to disk. It must generate artifacts in memory, validate them, optionally repair once, re-validate, and only then write files.

Create TODOs first and keep them updated until everything is implemented and tested.

Implement a validation pipeline with these stages:

1. Artifact syntax validation
- Parse every generated file based on extension/type:
  - .json => strict JSON parse
  - .yaml/.yml => YAML parse
  - framework config/HOCON => parse using framework-compatible logic
  - SQL includes => validate as SQL text artifact, not JSON/YAML
- Fail if extension/content type mismatch is detected

2. Artifact set / job-shape validation
- If user selected single_job:
  - exactly one job config file is allowed
  - no EXTRACT/LOAD split files
- If user selected split_extract_load:
  - exactly expected split files must exist
- Onboarding/success_email/validation_query/smoke_test must only be created if explicitly selected
- Fail on unexpected extra artifacts

3. Framework-aware validation
Use etl-framework-adb as the source of truth.
Validate:
- required top-level properties
- module order
- allowed module types
- include references exist
- include file types are correct
- env config variables resolve correctly
- source/transform/write/synapse flow matches framework expectations

4. Semantic validation
Add hard-fail checks for:
- TODO / TBD / FIXME placeholders
- NULL AS <requested_derived_column> unless explicitly intended
- empty SQL or nearly-empty SQL
- unresolved required ${...} variables
- suspicious mixed/duplicated source paths
- transform referencing raw source path when framework expects sourced view
- one-file-per-trivial-SQL-fragment over-splitting unless framework explicitly requires it

5. Repair pass
If validation fails:
- attempt one repair pass for fixable issues
- then re-run all validation
- if still failing, stop and do NOT write files

6. Write gate
Files must only be written when validation succeeds.
If validation fails, return a structured response with:
- status
- generated artifacts in memory
- errors
- warnings
- repairAttempted
- writeBlocked=true

7. Logging
Add detailed ETL Copilot output logging for:
- generated artifacts before write
- validation stages
- each validator result
- repair attempt
- final write decision

8. Tests
Add tests for:
- invalid JSON include blocked
- YAML/JSON mismatch blocked
- unresolved env variables blocked
- placeholder SQL blocked
- single_job shape rejects split artifacts
- unexpected onboarding blocked
- failed validation prevents write
- successful validation allows write
- repair pass re-validates before write

Important:
- Do not rely on sample outputs alone
- Prefer etl-framework-adb behavior over observed generated artifacts
- Do not silently write broken files
- Do not silently downgrade validation failures to warnings

At the end provide:
- TODO checklist
- files/classes/functions changed
- compile result
- test result
- sample validation-failure output
- sample successful write output
