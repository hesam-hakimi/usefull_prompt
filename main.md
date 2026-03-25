Run `npm test` now.

After it finishes, give me a final verification report with:
1. files created
2. files modified
3. exact transformation rules implemented from `data_transformation.md`
4. test results summary
5. sample before/after output for a simple request like:
   “read bronze customer_orders, filter active records, derive order_status, write to silver”
6. proof that this simple scenario stays as a single transformation module unless multi-step is explicitly justified
7. any remaining ambiguities or assumptions
