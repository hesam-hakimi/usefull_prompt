# Fix the ETL extension so write actually happens for the customer_orders scenario

## Task
Patch the implementation so this scenario passes end-to-end and files are written:

- read bronze `customer_orders`
- filter active records
- derive `order_status`
- write curated output
- prepare Synapse publish flow

## Current failure
Write is blocked by validation. Main blocker:

- sourced view alias `vw_customer_order` was not found in generated/include SQL

Related issues seen in output:
- source table is `customer_orders` but generated path leaf becomes `customer_order`
- source alias becomes `vw_customer_order`
- `curated_load_enrich` flow still renders non-curated zone `silver`
- reused env config missing external include should stay warning-only, not hard block

## Required fixes

### 1. Preserve source naming exactly
Do not singularize `customer_orders`.

Expected:
- path leaf: `customer_orders`
- source alias: `vw_customer_orders`

Not:
- `customer_order`
- `vw_customer_order`

### 2. Make transform SQL consume the exact sourced alias
If the sourced alias is `vw_customer_orders`, generated transform SQL or generated include content must read from:

```sql
FROM vw_customer_orders
```

### 3. Fix curated load/enrich rendering
When output strategy is `curated_load_enrich`, render framework-valid curated/enrich config.
Do not emit non-curated `silver` token if validator rejects it for `load_enrich_process`.

### 4. Write gate behavior
Only hard validation errors should block write.
Warnings must not block file creation.

Keep these as warnings unless explicitly fatal:
- missing external include from reused env config
- Synapse out-of-pilot warnings
- human review required notes
- merge caution warnings

## Files to inspect
Patch the real implementation, especially logic around:
- source alias/path derivation
- transform/include SQL generation
- output strategy planning/rendering
- pre-write validation
- write/apply flow

Likely files include:
- `BlueprintBuilder.ts`
- `JobConfigRenderer.ts`
- sourcing helpers
- transformation helpers
- output strategy planner / validator
- pre-write validation pipeline
- write/apply coordinator

## Acceptance criteria

### For this scenario
Input intent:
- bronze `customer_orders`
- active filter
- derive `order_status`
- curated write
- Synapse publish

### Expected output
- source path uses `customer_orders`
- source alias is `vw_customer_orders`
- transform SQL references `vw_customer_orders`
- output strategy `curated_load_enrich` passes validator
- no blocking alias error
- write is allowed if only warnings remain
- files are actually written to disk

## Tests to add/update
Add/update tests for:

1. plural source table names are preserved
2. generated source alias matches generated transform SQL
3. `curated_load_enrich` renders validator-accepted config
4. warnings do not block write
5. end-to-end `customer_orders` scenario writes files successfully

## Deliverables
After patching, report back with:
- root cause
- files changed
- exact fix applied
- before/after snippet
- full test results
