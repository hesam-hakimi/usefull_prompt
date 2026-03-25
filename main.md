# Next step: make output strategy fully doc-driven using the provided framework docs

The previous regression is fixed and the suite is green again.

## Current stable checkpoint

Confirmed from the last run:

- trivial writer SQL is no longer externalized
- output/write SQL stays inline
- generic `then` no longer forces false multi-step transformation splitting
- simple curated flow now passes
- `npm test` passes
- remaining lint warnings are pre-existing
- VS Code mutex warning is non-blocking for now

Do not re-open that regression unless required.

---

## Goal of this step

Implement the **next layer** of output generation so the extension chooses and renders the correct output modules using the framework guidance from these docs:

- `src/context_files/load_enrich.md`
- `src/context_files/dataframe_writer.md`
- `src/context_files/dataout_database.md`
- `src/context_files/dataout_tibco.md`

The result must be **rule-driven**, not hardcoded to one example like `customer_orders`.

---

## What to build

Create or complete a doc-driven output strategy layer that decides among these output modes:

1. `curated_load_enrich`
   - use `load_enrich_process`
   - for curated silver/gold write flows where framework-managed load/merge behavior is needed

2. `generic_dataframe_write`
   - use `dataframe_writer`
   - for generic file/delta/csv/parquet/synapse output when `load_enrich_process` is not the correct framework path

3. `database_out`
   - generate the required dual-module pattern:
     - database data file
     - database control file
   - follow the rules from `dataout_database.md`

4. `tibco_out`
   - generate the required dual-module pattern:
     - tibco data file
     - tibco control file
   - follow the rules from `dataout_tibco.md`

---

## Required design rules

### A. Strategy decision must be explicit
Add or complete an output decision object stored in session state and returned in chat response, similar to the transformation decision.

It should clearly state:
- selected strategy
- confidence
- reasons
- warnings

### B. Use the docs as the source of truth
Do not invent config shapes.

Use the docs to drive:
- module name
- method
- required options
- inline vs include behavior
- metadata/assertion requirements
- special path/filename rules
- dual-file requirements
- TIBCO-specific or database-specific metadata fields

### C. Preserve backward compatibility for simple curated flows
Simple bronze-to-silver / bronze-to-gold flows that previously worked must still render correctly and pass validation.

Do not break:
- inline write behavior
- simple writer naming
- current passing acceptance flow

### D. Separate decision from rendering
Keep these responsibilities separate:
- advisor: decide the output strategy
- planner: convert the strategy into a blueprint/output plan
- validator: ensure emitted config matches framework requirements
- renderer/builder: render the actual modules/files

---

## Output decision guidance

### 1. Use `curated_load_enrich` when:
- request is writing into curated zone
- load/merge/SCD/CDC semantics are implied
- target is framework-managed curated output
- docs indicate `load_enrich_process` is the correct mechanism

### 2. Use `generic_dataframe_write` when:
- request is simply writing a dataframe/file/output
- output is csv/parquet/delta/synapse
- no specialized curated load behavior is required
- docs indicate `dataframe_writer` is sufficient

### 3. Use `database_out` when:
- intent explicitly indicates data-out to database
- required metadata handoff is needed
- dual-file pattern is needed:
  - database data file
  - database control file

### 4. Use `tibco_out` when:
- intent explicitly indicates tibco/mailbox delivery
- dual-file tibco pattern is required:
  - data file
  - control file
- TIBCO metadata requirements must be generated

---

## Required validations

Implement or complete validations from the docs.

### For `load_enrich_process`
Validate at least:
- module/method are correct
- write mode / zone / keys / CDC / SCD fields are consistent
- curated-zone semantics are respected
- invalid mixes of SCD/CDC flags are rejected or warned appropriately

### For `dataframe_writer`
Validate at least:
- supported format
- required `sql`
- required `options`
- valid path / mode / partitioning / compression / filename constraints
- synapse-specific options when synapse output is selected

### For `database_out`
Validate at least:
- both data and control modules exist
- correct include or SQL structure
- required metadata/assertion output exists for next step
- required path/schema/table fields exist
- generated config follows the dual-file contract from the doc

### For `tibco_out`
Validate at least:
- both data and control modules exist
- filename/mailbox/container/assertion metadata are present
- ETL2.0 additions are handled correctly if applicable
- control/data path logic matches the doc
- required `assert.sql.after` metadata shape is present

---

## Intent extraction updates

Extend intent extraction so the user prompt can signal:
- curated write / curated publish
- generic dataframe/file output
- database out
- tibco out

Use wording clues, but keep decisions conservative.
If ambiguous, prefer warning/review-required over inventing specialized output behavior.

---

## Files to create or complete

Create or update the relevant files for:
- output strategy advisor
- output strategy planner
- output strategy validator
- output strategy types/index
- intent extraction
- session state
- create response
- chat participant output summary
- pre-write validation pipeline
- blueprint builder / renderer integration
- tests

Keep naming aligned with the current structure already introduced in the project.

---

## Tests required

Add/update tests for all of these:

1. simple curated flow chooses `curated_load_enrich` or the correct existing curated strategy and still passes
2. generic dataframe write chooses `generic_dataframe_write`
3. database-out request generates both:
   - db data out
   - db control out
4. tibco-out request generates both:
   - tibco data out
   - tibco control out
5. missing required database-out metadata fails validation
6. missing required tibco metadata fails validation
7. output decision is surfaced in:
   - session state
   - create response
   - chat summary
8. old passing customer_orders scenario still passes

---

## Important constraints

- Do not reintroduce trivial SQL externalization for writer/output modules.
- Do not hardcode `customer_orders`.
- Do not change passing behavior unless required by the docs.
- Prefer doc-driven rule tables/helpers over scattered conditionals.
- Keep UX clear:
  - show selected output strategy
  - explain why it was chosen
  - show warnings when assumptions are made

---

## Deliverables at the end

Report back with:

1. output strategies implemented
2. decision rules added
3. validation rules added
4. files changed
5. before/after example for:
   - curated load/enrich
   - database out
   - tibco out
6. actual results for:
   - lint
   - tests

Do the implementation and run the tests.
