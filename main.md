Use the attached OFW naming standards and CZ/Synapse naming convention screenshots as source of truth.

Update the generated customer orders flow to use the correct OFW job naming and table naming.

Requirements:

1. Set the OFW job name to:
   ACJ_ETL_DPV_CUSTOMER_ORDERS_CURATED_PUBLISH

2. Do not treat the generated config filename as the OFW job name.
   The config filename may remain an internal generated file, but the actual job/orchestration name must follow OFW standards.

3. Apply naming rules from the screenshots:
   - OFW job names must be UPPERCASE
   - ADLS / Delta / Synapse object names must be lowercase
   - Synapse base table suffix must be _base_table
   - Synapse temp tables must be _stage and _ctas
   - DAC/simple view should keep the logical object name

4. For this scenario, use these object names:
   - ADLS silver object: customer_orders_curated
   - Synapse base table: customer_orders_curated_base_table
   - Synapse stage temp table: customer_orders_curated_base_table_stage
   - Synapse ctas temp table: customer_orders_curated_base_table_ctas
   - DAC/simple view: customer_orders_curated

5. If the code currently uses any incorrect names like:
   - CUSTOMER_ORDER_BASE-TABLE
   - STAGE_BASE-TABLE
   - mixed case
   - hyphenated base-table suffixes
   replace them with the correct underscore-based convention.

6. Show me explicitly:
   - final OFW job name
   - final ADLS object name
   - final Synapse base table name
   - final stage table name
   - final ctas table name
   - final DAC view name

7. If there is any uncertainty whether tenant id should be included in the OFW name, do not invent it. Keep:
   ACJ_ETL_DPV_CUSTOMER_ORDERS_CURATED_PUBLISH

Return a short report showing exactly where these names were updated.
