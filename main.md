# Next hardening pass: make output generation fully template-driven and doc-aligned

The output strategy layer is now working and tests are green. Keep the current architecture and behavior intact.

## Current stable checkpoint

Already working:
- output strategies implemented:
  - curated_load_enrich
  - generic_dataframe_write
  - database_out
  - tibco_out
- planner/advisor/validator are wired
- BlueprintBuilder and PreWriteValidationPipeline are integrated
- tests pass
- do not regress the current passing suite

---

## Goal of this pass

Harden the implementation so output rendering is not only strategy-driven, but also **fully template-driven from framework docs/config conventions**, especially for:

- include artifact naming
- include artifact format
- assert.sql.after templates
- database/tibco filename and path patterns
- env fallbacks for mailbox/container/root variables

---

## What to improve

### 1. Align include artifact generation with framework conventions
Review the framework docs and current renderer behavior.

If the framework expects YAML-style include files for database/tibco data-out, then:
- stop generating `.json` include files for those flows
- generate the correct include format consistently

If JSON is supported and intentional, prove that in code comments/tests and make it explicit.

Do not leave this ambiguous.

---

### 2. Make `assert.sql.after` selection fully template-driven
Right now the generated examples still show shortened placeholder-style assertions like:

- `SELECT true AS assertion, 'database' AS log_type, ...`
- `SELECT true AS assertion, 'tibco' AS log_type, ...`

Replace this with a doc-driven template selection approach.

Requirements:
- choose the correct assertion template for:
  - database data file
  - database control file
  - tibco data file
  - tibco control file
- fill the required placeholders from strategy/context/env
- validate that all required pins/fields are present before rendering
- fail clearly if required doc-driven inputs are missing

---

### 3. Make include filenames and output filenames configurable
Add a doc/context-driven config layer for:
- include filenames
- generated output filenames
- control file suffixes
- codec suffixes
- path segment naming
- mailbox/container fallbacks

At minimum, support controlled defaults from one central place instead of scattering literal names.

Examples to centralize:
- `database_out`
- `database_ctrl_out`
- `tibco_out`
- `tibco_ctrl_out`
- output file extension / suffix rules
- control file naming rules
- gzip / codec naming adjustments

---

### 4. Make database/tibco path rendering rule-driven
Centralize rendering for:
- ADLS root
- strategy-specific folder prefix
- entity/table segment
- runid segment
- effective date segment
- data vs control subfolder naming
- tibco mailbox-related path rules
- env fallback behavior

This must be deterministic and testable.

---

### 5. Add golden snapshot tests for rendered config
Add snapshot-style tests for the final rendered config blocks, not only decision tests.

Create exact output expectations for:
- curated load/enrich
- generic dataframe write
- database out
- tibco out

Validate:
- module names
- method names
- include paths
- inline SQL vs include usage
- assert.sql.after shape
- filenames
- path patterns
- required options

---

## Constraints

- Do not regress the current passing suite.
- Do not reintroduce trivial SQL externalization for writer/output modules.
- Do not hardcode `customer_orders`.
- Keep current strategy architecture.
- Prefer one central rule source over scattered literals.
- If a framework rule is still ambiguous, emit a warning and keep the current safe default.

---

## Files likely to touch

Only modify what is needed, likely around:
- output strategy context/provider
- output strategy planner
- output strategy validator
- blueprint builder / renderer
- include rendering helper(s)
- tests / snapshots

---

## Deliverables

At the end, report back with:

1. what was made fully template-driven
2. whether database/tibco include format is JSON or YAML and why
3. what defaults were centralized
4. which env fallbacks were added
5. before/after for:
   - database out
   - tibco out
6. actual lint/test results
