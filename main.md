Good progress. This is now much closer to real proof.

Create TODOs first and keep them updated until every item below is fully completed.

What is already proven:
- invalid artifact detection
- blocked write on validation failure
- successful write on passing validation
- compile + tests passing
- repair pass is invoked and re-validated

What is still NOT sufficient and must now be fixed / verified:

1. Repair pass quality
The current repair pass is not acceptable because it turns SQL into an empty string.
I need the repair logic to preserve valid SQL structure and only remove/fix the invalid fragment.
Example: if SQL contains TODO comments or NULL placeholder logic, repair should either:
- replace only the invalid fragment with a safe placeholder expression, or
- fail without corrupting the rest of the SQL.
Do not “repair” by blanking the SQL.

2. Real business scenario proof
Run the actual customer_orders -> silver -> Synapse scenario, not only toy scenarios like orders_clean/customers_clean.
Use the same type of request I’ve been testing:
@etl /create Read data from bronze customer_orders, filter active records, derive order_status, write to silver table customer_orders_curated, then publish to Synapse table stage.customer_orders_curated in dev.
Include ENV_CONFIG inline when needed.

3. Real output evidence for the real scenario
Show:
- exact request
- selected template mode / template path / reason
- selected job shape
- actual generated artifact paths
- validation result
- whether write was blocked or allowed
- final written files

4. Manual Run Extension validation
Do not stop at test-run proof.
Validate the actual “Run Extension” / F5 flow and show:
- prelaunch task output
- extension host launch success
- no npm:watch prelaunch failure
- no stale launch/task mapping issues

5. Explicit deploy-path coverage
Add or show proof that the same validation gate blocks /deploy on invalid artifacts, not just /write.

6. Final output format
Return:
- TODO checklist
- files changed
- repair logic change summary
- real customer_orders failing run (if intentionally made invalid)
- real customer_orders passing run
- manual F5 / Run Extension proof
- compile result
- test result

Important:
- Do not use only synthetic/sample output
- Do not use only toy scenarios
- Do not claim repair succeeded if it only empties SQL
- Keep the repair conservative and non-destructive
