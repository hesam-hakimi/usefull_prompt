Do not assume this is a memory/cache issue.

Investigate why the generated job config references `adls.curated.customer_order.root`.

Tasks:
1. Search the entire workspace for exact string `adls.curated.customer_order.root`.
2. Find the exact code path that generates this target variable/reference.
3. Log the final generated target-path expression before validation.
4. Log all merged effective config keys starting with:
   - adls.
   - data.
   - destination.
   - curated.
5. Compare the generated target reference against real framework keys from env/common config.
6. Replace the invented key with the real framework convention used in this repo.
7. Re-run the same customer_orders scenario and prove:
   - which target variable is now used
   - whether it exists in merged config
   - whether validation passes

Important:
- Treat this as a wrong generated reference / naming mismatch, not a memory issue.
- Show exact before/after target variable names in the final report.
