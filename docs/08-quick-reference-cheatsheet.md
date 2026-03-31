# 08. Quick Reference Cheatsheet

## Use this when you need the fast version

## Output strategy selection

- **curated load/enrich**  
  Use when request implies curated write with merge / CDC / SCD semantics.

- **generic dataframe write**  
  Use for normal file writes when no specialized framework delivery pattern is requested.

- **database_out**  
  Use for database delivery flow with dual-file output and assertion metadata.

- **tibco_out**  
  Use for TIBCO mailbox delivery with data + control file pattern.

---

## Never do these

- Do **not** invent fake env-config linkage inside job config.
- Do **not** flatten `database_out` and `tibco_out` into one generic writer pattern.
- Do **not** externalize trivial output/write SQL into separate include files.
- Do **not** claim success from temp-repo test output alone.
- Do **not** weaken validators to make write succeed.
- Do **not** convert YAML include conventions to JSON without evidence.

---

## Key conventions to remember

### Curated load/enrich
- module: `load_enrich_process`
- must render framework-valid curated zone behavior
- output semantics matter more than generic writer convenience

### Generic dataframe_writer
- module: `dataframe_writer`
- supports delta/parquet/csv/synapse-style outputs
- keep output SQL inline unless there is a strong reason otherwise

### database_out
- dual-file pattern
- stable module keys like `db_data_out`, `db_ctrl_out`
- generic YAML include refs like:
  - `../sql/database_out.yaml`
  - `../sql/database_ctrl_out.yaml`
- root variable should follow framework doc convention:
  - `${adls.source.root}`

### tibco_out
- dual-file pattern
- YAML include refs like:
  - `../sql/tibco_out.yaml`
  - `../sql/tibco_ctrl_out.yaml`
- root variable should follow framework doc convention:
  - `${adls.tibco.root}`
- assertion uses literal `'tibco' AS log_type`

---

## Golden scenario

Use this scenario for debugging and acceptance:

- source: `customer_orders`
- transform: filter active rows + derive `order_status`
- output: curated load/enrich
- optional publish: Synapse
- env config: reuse existing

What must stay true:
- source table remains `customer_orders`
- alias remains `vw_customer_orders`
- transform reads from `vw_customer_orders`
- output strategy remains curated load/enrich
- include refs resolve
- real workspace write works

---

## Real write proof checklist

A fix is not complete unless all are true:

- `/create` stores artifacts in session state
- `/write` consumes the same artifacts
- actual workspace root is resolved correctly
- files are created in the real workspace
- include files are written too
- chat clearly reports what was written

---

## Best next step

Validate the **real workspace write flow** in the Extension Development Host.
