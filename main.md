# Next step: apply the customer_orders write fix and verify real file creation

Implement the fix from `fix_etl_extension_customer_orders.md`.

## Execute in this order

1. Patch the code for the alias/path/output validation issues.
2. Run all tests.
3. Launch the extension host again.
4. Re-run the same scenario:

- read bronze `customer_orders`
- filter active records
- derive `order_status`
- write curated output
- prepare Synapse publish flow

## Required verification

### A. Validation
Confirm these are no longer blocking:
- sourced alias mismatch
- `customer_order` vs `customer_orders`
- invalid curated load/enrich zone rendering

### B. Generated artifact correctness
Show the exact generated job config and confirm:
- source path leaf is `customer_orders`
- source alias is `vw_customer_orders`
- transform SQL reads from `vw_customer_orders`
- curated output uses framework-valid `curated_load_enrich` rendering

### C. Real write result
Prove files were actually created on disk by showing:
- written file paths
- file names
- whether overwrite or create happened
- file contents or representative excerpts

### D. Regression
After customer_orders passes, run these regression checks:
1. generic dataframe writer flow
2. database_out flow
3. tibco_out flow
4. reused env config flow with warnings only

## Acceptance criteria
- extension writes files successfully
- warnings do not block write
- only true validation errors block write
- no regression in existing passing tests
- report exact root cause, files changed, and before/after output
