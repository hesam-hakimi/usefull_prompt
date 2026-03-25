# Fix output-strategy regression without changing intended design

You already implemented the output strategy layer, but the latest run shows acceptance regressions.

## Current failure summary

From the latest test run:

- `npm test` ran
- lint reported warnings only, no new errors
- **8 tests are failing in the extension E2E / acceptance suite**
- important failures include:
  - `customer_orders scenario passes and writes after validation: expected write count 1 but got 0`
  - scenarios `1-7` in End-to-End Acceptance Tests returned `failed` instead of `completed`
  - multiple failures mention:
    - `Trivial SQL fragment split into its own file: conf/sql/write_curated.json`
- VS Code test harness also logged:
  - `Error mutex already exists`

## Objective

Fix the regression introduced by the output-strategy changes **without removing the new output-strategy architecture**.

Do not start a new feature.
Do not redesign the system.
Do a focused bug-fix pass.

---

## What to investigate first

### 1. Trivial SQL externalization regression
Find where output rendering now externalizes small/trivial SQL fragments into files like:

- `conf/sql/write_curated.json`

This appears to be breaking the acceptance expectations for the simple curated flow.

For simple write/output modules, trivial SQL such as:
- `SELECT * FROM main_transform`
- similar one-line writer SQL
should **not** be unnecessarily split into separate include files unless the framework/docs explicitly require it.

Check whether the new output planner or renderer is applying externalization too aggressively.

### 2. Missing write after validation
Trace why the `customer_orders` scenario now ends with:

- expected write count = 1
- actual write count = 0

Determine whether:
- the writer module is no longer emitted
- the writer module is emitted incorrectly
- validation blocks it
- the output strategy planner selects the wrong output mode
- the rendered artifact path/type prevents the acceptance harness from counting the write
- the artifact is being converted into a split include pattern that the acceptance tests do not treat as a real write step

### 3. End-to-end status regression
Investigate why scenarios now end as:
- `failed`
instead of:
- `completed`

Do not patch this superficially.
Find the first causal regression in the flow.

---

## Required fix behavior

### A. Preserve the new output strategy layer
Keep:
- advisor
- planner
- validator
- chat/session/response integration

Do **not** remove the architecture.

### B. Restore old acceptance behavior for simple curated write flows
For a simple case like:

- read bronze customer_orders
- filter active records
- derive order_status
- write to silver

the generated result must still behave like a normal successful curated write flow.

If the output strategy chooses curated/load behavior, the rendered output must still satisfy the acceptance harness expectations.

### C. Stop splitting trivial output SQL into separate files
Implement a rule like this:

- trivial writer/output SQL stays inline
- only substantial SQL that benefits from externalization should be split
- do not externalize tiny pass-through write SQL unless explicitly required

This rule must be narrow and safe.

### D. Keep transformation externalization rules separate from output externalization rules
Do not let transformation SQL splitting logic accidentally apply to output/write modules.

---

## Implementation guidance

### 1. Review these areas carefully
Inspect and fix the interaction among:
- `OutputStrategyPlanner.ts`
- `BlueprintBuilder.ts`
- `JobConfigRenderer.ts`
- any include/externalization helper used during rendering
- pre-write validation
- acceptance fixture expectations

### 2. Distinguish between:
- transformation SQL modules
- output/write modules
- database_out dual-file output
- tibco_out dual-file output
- curated load/enrich flow

Make sure trivial output modules are not treated like transformation modules for externalization purposes.

### 3. Acceptance compatibility matters
If the acceptance suite expects:
- one write module
- one final write artifact
- direct inline SQL for simple writer cases

then preserve that behavior.

Do not force a more “modular” rendering if it breaks expected framework behavior.

---

## Required code changes

Make the minimum necessary code changes to:
- stop trivial output SQL splitting
- restore simple write counting
- restore scenario completion status
- preserve output-strategy architecture

Add/update tests to cover the regression.

---

## Required tests

Add or update focused tests for:

1. simple curated flow still produces one effective write step
2. trivial output SQL is kept inline
3. transformation SQL externalization rules do not leak into writer/output modules
4. database_out still uses its expected dual-file pattern
5. tibco_out still uses its expected dual-file pattern
6. output-strategy decision still appears in state/response/chat
7. customer_orders acceptance scenario passes again

If a fixture changed unnecessarily, revert it unless the new behavior is explicitly required by the docs.

---

## VS Code mutex note

The test harness warning
- `Error mutex already exists`
may be environmental.

Do not blame that first.

First fix the deterministic regression shown by:
- write count = 0
- trivial SQL split into its own file
- scenario status = failed

Then re-run tests.
If failures remain and are only harness-related, report that separately.

---

## Deliverables

At the end provide:

1. Root cause found
2. Files changed
3. Exact fix applied
4. Before/after example for the simple curated write case
5. Actual command results for:
   - lint
   - tests

Do not stop at “I found the issue”.
Fix it and run the tests.
