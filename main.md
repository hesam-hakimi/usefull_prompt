# Next pass: end-to-end artifact fidelity and framework-shape verification

The output hardening pass is complete and green.

Current confirmed state:
- database/tibco include format is `.yaml`
- output defaults are centralized in `OutputStrategyConfig.ts`
- shared helpers render include paths, output paths, module names, view names, and assertion templates
- rendered-config tests are passing
- current test result: 258 passing, 0 errors, only pre-existing warnings

## Goal

Now perform an end-to-end fidelity pass to verify that the **actual generated artifacts** match framework conventions, not only internal planner/test expectations.

## What to do

### 1. Add artifact-level golden tests
Add tests that generate full job artifacts and compare them against expected framework-shaped outputs for these scenarios:

1. curated load/enrich
2. generic dataframe write
3. database out
4. tibco out

Validate at artifact level:
- module block names
- include file names and extensions
- include paths
- inline SQL vs external include placement
- options.module / options.method
- assert.sql.after structure
- output path shape
- filename / control-file naming
- required env placeholders
- required fallbacks

### 2. Verify actual emitted include file contents
Do not only test the include reference path.
Also verify that the generated `.yaml` include files contain the correct SQL/body shape and are consistent with framework docs.

For database out:
- verify `database_out.yaml`
- verify `database_ctrl_out.yaml`

For tibco out:
- verify `tibco_out.yaml`
- verify `tibco_ctrl_out.yaml`

### 3. Add “prompt-to-artifact” acceptance coverage
Add acceptance tests that start from realistic user prompts and assert the final rendered artifact set.

Example prompts:
- “Read bronze customer_orders, filter active records, derive order_status, write to silver”
- “Read curated orders and send data out to database with control file”
- “Read curated orders and send data out to TIBCO with control file”
- “Write transformed dataframe to parquet/csv only”

For each, assert:
- chosen strategy
- rendered job config
- rendered include files
- warnings if applicable

### 4. Enforce no drift between docs and renderer
Create one small verification layer that fails when known framework conventions drift.

Examples:
- database/tibco include extension must remain `.yaml`
- database/tibco strategy must stay dual-file
- curated load/enrich must keep inline writer SQL unless explicitly documented otherwise
- trivial writer SQL must never be externalized

### 5. Report exact sample artifacts
At the end, print the full before/after rendered examples for:
- one database_out job
- one tibco_out job

Do not abbreviate with `...` in the final report.
Show the real rendered shapes.

## Constraints
- Do not regress current passing tests.
- Do not reintroduce `.json` include refs for database/tibco.
- Do not externalize trivial writer SQL.
- Keep centralized config-driven helpers.
- Prefer exact framework shape over invented simplification.

## Deliverables
Report back with:
1. files changed
2. new tests added
3. full rendered sample artifacts for database_out and tibco_out
4. actual lint/test results
5. any remaining ambiguity still requiring framework clarification
