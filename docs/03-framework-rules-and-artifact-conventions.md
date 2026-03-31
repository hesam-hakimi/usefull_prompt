# 03. Framework Rules and Artifact Conventions

This file is the most important reference when creating future prompts that touch artifact generation.

## Rule 1: The framework is configuration-driven

The ETL framework is driven by HOCON/JSON-like job configs and include files.

Do not invent ad hoc structures if the framework already has a pattern.

---

## Rule 2: Output strategy must match the actual output intent

The system must decide among these major output shapes:

- `curated_load_enrich`
- `generic_dataframe_write`
- `database_out`
- `tibco_out`

Do not collapse them into one generic writer abstraction if the docs require different structure.

---

## Rule 3: Externalization rules matter

A major bug earlier in development came from externalizing SQL too aggressively.

### Correct approach
- transformation SQL may be externalized when appropriate
- trivial output/write SQL should usually remain inline
- do not generate trivial writer include files just because SQL exists

---

## Rule 4: Env config linkage is external to the job config

A key operational rule from the broader project:
- job config does not directly embed the env config linkage as an invented property
- mapping of job config to env config is managed externally at runtime/deployment level

Future prompts must not “solve” env reuse by inventing fake linkage inside the job config.

---

# A. Curated load/enrich conventions

## When to use
Use this strategy when the request implies:
- curated output
- merge / CDC / SCD semantics
- framework load-enrich behavior
- target is curated zone, not a generic file write

## Module
- `load_enrich_process`

## Required ideas from docs
- input is transformed dataframe from transform module
- supports first load vs incremental load
- supports CDC / SCD1 / SCD2 style behavior
- writes delta in curated/enrich area
- audit behavior exists

## Important config examples captured from docs
Typical keys seen in screenshots:

- `sql`
- `options.module: "load_enrich_process"`
- `options.method: "process"`
- `target-path`
- `target-table`
- `keys`
- `mode-of-write`
- `cdc-flag`
- `scd2-flag`
- `scd1-flag`
- `scd2.input-table-keys`
- `scd2.target-table-keys`
- `partition-by`
- `target-format`
- `name`
- `zone-name`

## Important behavior
- for curated load/enrich, zone rendering must be framework-valid
- one specific fix mapped silver/gold intent to a framework-valid curated rendering for this strategy
- future prompts must not leave invalid zone names that fail validators

---

# B. Generic dataframe_writer conventions

## When to use
Use generic dataframe writer when:
- no curated merge / CDC / SCD semantics are required
- request is just a file/database-style write
- no specialized database_out or tibco_out pattern is required

## Supported output formats from docs/screenshots
- Synapse
- Delta
- Parquet
- CSV
- CSV with compression and file rename

## Common keys captured from docs
- `type`
- `sql`
- `include`
- `loggable`
- `options.module: dataframe_writer`
- `options.method: process`
- `options.format`
- `options.mode`
- `options.path`
- `options.partitionBy`
- `options.repartition`
- `options.file_name`
- `options.compression`
- `options.header`
- `options.schema`
- `options.table`
- `options.mailbox`
- `options.filename`
- `options.dbTable`
- `options.url`
- `options.tempDir`
- `options.preActions`
- `options.postActions`
- `assert.sql.after`

## Important behavior
- non-Synapse targets write directly
- Synapse targets stage data and rely on special post-actions / stored procedures
- file rename rules apply mostly to CSV and often require constraints like `repartition: 1`
- validators should warn on unknown options rather than silently ignore them

---

# C. database_out conventions

This pattern was heavily refined during doc-fidelity work.

## Overall workflow
Database out is not just a single write.

It is a **dual-file pattern**:
1. data file
2. control file

Both are produced via dataframe_writer-style modules plus assertion metadata for downstream database loading.

## Required module shape
Two modules are expected:

- `db_data_out`
- `db_ctrl_out`

## Include conventions
Use generic YAML include refs, not invented table-prefixed names:

- `../sql/database_out.yaml`
- `../sql/database_ctrl_out.yaml`

Earlier incorrect drift:
- table-prefixed include names
- JSON include refs
- invented generic output roots

Those were later corrected.

## Root variable and path pattern
The corrected convention reported in the conversation:

- root variable: `${adls.source.root}`
- path pattern for data file:
  - `/db_dataout/{table}/${runid}/${etl.effective.end.date}`
- control path uses `_ctrl` suffix

## Name / view conventions
Stable module keys remain generic, but table-specific names are rendered separately.

Example pattern:
- module key: `db_data_out`
- rendered `name`: `{table}_db_data_out`
- view/source naming was reported as `{table}_db_data_out`

## Required options typically seen
- `module: "dataframe_writer"`
- `method: "process"`
- `mode: "overwrite"`
- `format: "csv"`
- `header: true`
- `schema`
- `table`
- `path`

## assert.sql.after
The database_out flow requires downstream metadata generation via assertion SQL.

Key ideas seen repeatedly:
- literal `'database' AS log_type`
- metadata must contain things like:
  - `pin_row_count`
  - `pin_file_path`
  - `pin_schema`
  - `pin_table`
  - often connection-related pins
  - delimiter/header-related pins where required

## Important correction
At one point the implementation drifted toward:
- `${adls.dataout.root}`
- table-prefixed include names
- unstable naming

The later doc-fidelity verification corrected this back to:
- `${adls.source.root}`
- generic include refs
- stable module keys
- table-specific naming moved into rendered values like `name`

---

# D. tibco_out conventions

Like database_out, this is a specialized pattern.

## Overall workflow
TIBCO out is also a dual-file flow:
1. data file
2. control file

## Module shape captured from screenshots
Examples seen:
- `tibco_data_out`
- control module sometimes shown as `dataout_tibco_control`

Because there was some naming drift in screenshots/reports, future sessions should confirm the exact current control module key in the repo before refactoring.

## Include conventions
Use YAML include refs:
- `../sql/tibco_out.yaml`
- `../sql/tibco_ctrl_out.yaml`

## Root variable and path conventions
The corrected/final conventions discussed:

- root variable: `${adls.tibco.root}`
- structured path includes a TIBCO-specific folder like `tibco-data-files`
- control path includes a control-specific suffix/folder

## Important options from docs
- `module: "dataframe_writer"`
- `method: "process"`
- `mode: "overwrite"`
- `format: "csv"` for data file
- `format: "text"` for control file
- `filename`
- `repartition: 1`
- `mailbox`
- optional codec/compression support
- possible enable/delete flags in env config

## TIBCO-specific assertions
Important corrections from doc-fidelity review:
- assertion should use literal `'tibco' AS log_type`
- do not replace with conditional CASE expression unless docs support it
- metadata typically includes:
  - `pin_file_path`
  - `pin_container`
  - `pin_file_format`
  - `pin_mailbox`
  - `pin_filename`
  - optional `pin_delete_files`

## ETL2.0 additions captured from screenshots
- `pin_container` can come from env config when not provided
- `pin_delete_files` may default to true but can be overridden
- env config can provide values used across TIBCO jobs

---

# E. Naming and structural rules future prompts should preserve

## Stable module keys vs rendered names
A major lesson:

- **module keys** may need to stay stable/generic for framework convention
- **rendered names** may carry table-specific naming

Do not assume everything should become table-prefixed.

## Include files
For specialized output strategies:
- use YAML where docs say YAML
- do not convert them to JSON just because transformation includes are JSON-like

## Transformation include
For the curated customer_orders scenario, a transform include such as `main_transform.json` was used in temp runs.  
That is acceptable for the transform layer, but this should not be generalized to database/tibco include conventions.

---

# F. File/folder structure expected in generated artifacts

A typical generated artifact set may look like:

```text
conf/
  jobs/
    <job_name>_config.json
  sql/
    main_transform.json
    database_out.yaml
    database_ctrl_out.yaml
    tibco_out.yaml
    tibco_ctrl_out.yaml
```

Not every scenario needs every file.

---

# G. HOCON/job config structure pattern

Representative shape:

```hocon
modules: {
  read_source: { ... }
  main_transform: { ... }
  write_curated: { ... }
  db_data_out: { ... }
  db_ctrl_out: { ... }
  tibco_data_out: { ... }
}
```

Key reminder:
- env config linkage is external at runtime
- include refs must be valid/relative/resolvable
- transform modules should consume the sourced alias/view
- output modules should match selected output strategy exactly

---

# H. Prompt rules to avoid repeating earlier mistakes

When writing future prompts, explicitly tell Copilot:

1. Do not invent framework structure.
2. Keep output strategy doc-driven.
3. Keep transformation/externalization rules intact.
4. Keep env reuse external to the job config.
5. Preserve stable module keys where docs require them.
6. Use real include file extensions and patterns from framework docs.
7. Do not weaken validators to make tests pass.
8. Validate real workspace writes, not only temp repo output.
