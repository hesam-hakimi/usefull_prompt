# Fix remaining doc-drift in database_out and tibco_out artifacts

The latest pass is better and all tests pass, but the rendered artifacts are still not fully aligned with the framework docs.

Do **not** optimize for keeping the current snapshots if they are wrong.
Use the framework docs as the source of truth and update implementation + tests together.

## What is still wrong

### 1. database_out paths are too generic
Current rendered sample uses:
- `${adls.destination.root}/orders`
- `${adls.destination.root}/orders_ctrl`

But the framework docs for database out show a dedicated database-dataout path pattern, including run-level structure. Update the planner/config so database out follows the documented path convention instead of generic destination-root shortcuts.

### 2. tibco_out paths are too generic
Current rendered sample uses destination-root style paths.

But the TIBCO doc shows:
- TIBCO-specific root
- separate data/control folders
- runid/effective-date structure
- file movement metadata driven by assert.sql.after

Update tibco output rendering to follow the documented path convention exactly.

### 3. assert.sql.after is still oversimplified
Current output uses simplified insert statements.

That is not enough.

For `database_out`, render the doc-driven metadata generation needed for the next ADLS-to-database step.

For `tibco_out`, render the required pins from the doc, including the exact metadata shape for:
- pin_file_path
- pin_file_format
- pin_mailbox
- pin_filename
- pin_container
- pin_delete_files when applicable / with env fallback

### 4. output names are too generic
Current names like:
- `db_data_out`
- `db_ctrl_out`
- `tibco_data_out`
- `tibco_ctrl_out`

need to be checked against the framework docs and made doc-driven where required.

If the docs imply names derived from table/module context, implement that instead of fixed literals.

### 5. validate actual artifact fidelity, not only passing tests
The current tests may now be validating the wrong rendered shape.
Update them so they verify the true framework shape from docs.

## Required implementation work

Update the output strategy implementation so the rendered artifacts are doc-driven for:
- include file names
- include file paths
- output paths
- module names
- artifact names
- assert.sql.after templates
- env fallbacks

Likely files to inspect/update:
- `OutputStrategyConfig.ts`
- `OutputStrategyPlanner.ts`
- `OutputStrategyContextProvider.ts`
- `OutputStrategyConfigValidator.ts`
- `JobConfigRenderer.ts` if needed
- related tests / golden snapshots

## Required tests

Add or update artifact-level golden tests so they verify:

### database_out
- rendered job config matches doc-driven dual-file pattern
- include refs use `.yaml`
- data path and control path match the documented convention
- assert.sql.after contains the required metadata logic
- include file bodies match the expected SQL shape

### tibco_out
- rendered job config matches doc-driven dual-file pattern
- uses TIBCO root / TIBCO folder convention from docs
- data/control filenames and paths match docs
- assert.sql.after contains required pins
- env fallbacks are applied correctly

## Output required from you

When done, report back with:

1. exact files changed
2. exact before/after rendered artifacts for:
   - database_out
   - tibco_out
3. exact assert.sql.after rendered text for both
4. exact path patterns now used
5. test results

Do not shorten examples with `...`.
Show the full rendered artifact samples.
