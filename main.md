# Final doc-fidelity verification pass for output strategy

The implementation is much better and tests are passing, but I want one final pass focused only on fidelity to the framework docs I provided.

Do not optimize for preserving the current rendered shape if it differs from the framework examples.
Use the docs as source of truth.

## Re-check these specific items

### 1. Keep module keys aligned with framework examples
Verify whether the framework expects stable module keys like:
- `db_data_out`
- `db_ctrl_out`
- `tibco_data_out`
- `tibco_ctrl_out`

If yes:
- keep those as module keys
- move table-specific naming to the correct doc-driven field such as `name`, rendered view name, output artifact name, or include content
- do not rename module keys to `orders_db_data_out` / `orders_tibco_data_out` unless the docs explicitly require that

### 2. Re-check include file naming against docs
The framework docs I shared showed examples like:
- `../sql/database_out.yaml`
- `../sql/database_ctrl_out.yaml`
- `../sql/tibco_out.yaml`
- `../sql/tibco_ctrl_out.yaml`

Verify whether include refs should stay generic as above.
If yes, revert include naming to the framework convention and keep doc-driven table specificity elsewhere.

### 3. Re-check database_out root variable
From the screenshots I shared earlier, the database-out examples appeared to use a path rooted from:
- `${adls.source.root}` with `/db_dataout/...`

Please verify whether `${adls.dataout.root}` is truly correct.
If the actual framework example is `${adls.source.root}/db_dataout/...`, update implementation and tests accordingly.

### 4. Re-check tibco_out root variables
Verify whether the framework docs truly support:
- `${tmp.tibco.data.dir}`
- `${tmp.tibco.ctrl.dir}`

versus an ADLS-style root convention like the examples I shared earlier.
If the current variables are only internal abstractions, prove that clearly in code/tests/comments.
Otherwise align them to the doc examples.

### 5. Re-check exact TIBCO assert.sql.after format
My provided doc showed a required TIBCO assert format with a literal:
- `'tibco' AS log_type`

Please verify whether this should remain literal and not conditional.
If the framework doc requires fixed `'tibco'`, remove:
- `CASE WHEN '${enable.tibco.out}' = 'true' THEN 'tibco' ELSE 'info' END`

unless there is a separate authoritative source for that behavior.

### 6. Re-check database_out view/source naming
Verify whether:
- `FROM orders_output_vw`

matches the framework convention.
If the framework expects the database-out assertion to read from a doc-driven derived view name, render that exact convention instead.

## Required output from you

Report back with:

1. exact files changed
2. whether each of the 6 items above was:
   - confirmed correct as implemented
   - or corrected
3. full final rendered artifact for:
   - database_out
   - tibco_out
4. full final `assert.sql.after` for both
5. explicit statement of the final conventions for:
   - module keys
   - include refs
   - root variables
   - output view/name conventions

Do not shorten examples with `...`.
Show full final rendered artifacts.
