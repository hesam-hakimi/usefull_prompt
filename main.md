# Fix write-blocking validation issue in ETL extension

## Problem
The extension generates artifacts, but does not write them because pre-write validation fails.

From the latest run:
- blocking error: sourced view alias `vw_customer_order` was not found in any include SQL
- warnings:
  - path suffix `customer_order` does not match source table `customer_orders`
  - `load_enrich_process` module `write_curated` uses non-curated zone `silver`
  - reused env config references an include file not present in the current workspace

The write step is being blocked after planning because generated artifacts are internally inconsistent.

---

## Root cause to fix

### 1. Naming drift in source derivation
The table is `customer_orders`, but generated values become:
- path leaf: `customer_order`
- alias: `vw_customer_order`

This breaks transform validation because include SQL does not consume the exact sourced alias.

### 2. Output strategy mismatch
The chosen output strategy is `curated_load_enrich`, but rendered config still uses non-curated zone `silver`.

### 3. Write gate behavior
Warnings and pilot-review messages should not block file creation.
Only real validation errors should block write.

---

## Required fixes

### Fix A — preserve source naming consistently
Find the code that derives:
- source path leaf
- sourced alias / view name

For source table `customer_orders`, emit:
- path leaf: `customer_orders`
- alias: `vw_customer_orders`

Do not singularize automatically unless a framework rule explicitly requires it.

---

### Fix B — ensure generated transform/include SQL consumes the sourced alias
If the read source alias is `vw_customer_orders`, then generated transformation SQL or generated include file content must reference that exact alias.

Expected example:
```sql
SELECT ...
FROM vw_customer_orders
WHERE ...
