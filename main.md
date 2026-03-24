You have completed the main ETL extension debugging phase. Now move to acceptance and release-hardening.

Create TODOs first and keep them updated.

Objective:
Run the next phase as a true acceptance phase for the ETL create flow, using the customer_orders scenario as the primary golden path.

Primary scenario:
@etl /create Read data from bronze customer_orders, filter active records, derive order_status, write to silver table customer_orders_curated, then publish to Synapse table stage.customer_orders_curated in dev.
1-source: abfss://bronze@edaaaedle1devsrz.dfs.core.windows.net/BRONZE/customer_order
2-USE THIS filter FOR STATUS: order_status = 'completed'
3-target folder ON ADLS: ${adls.curated.customer_order.root}/customer_orders_curated
4-synapse: STAGING TABLE : STAGING.CUSTOMER_ORDER_STAGE_BASE-TABLE AND TABLE NAME IS ORDER.CUSTOMER_ORDER_BASE-TABLE standard stage and etl.usp_process_main_v2
4-active flag: active_flag = 1
ENV_CONFIG=env_conf/dev/env_config_dpv_dev.yaml

Tasks:
1. Build a golden acceptance checklist for this scenario.
2. Validate the actual end-to-end runtime flow in the Extension Development Host path as much as tooling allows.
3. Ensure the final response clearly discloses:
   - template/reference choice
   - template mode
   - env config reuse/create decision
   - selected job shape
   - optional artifacts selected or skipped
   - validation result
   - write/deploy allowed or blocked
4. Verify that Single Job Config produces exactly one main job config artifact.
5. Verify optional artifacts are only generated when explicitly selected.
6. Verify generated artifacts are framework-compatible using etl-framework-adb as authoritative source and sample_repo as example source.
7. Decide whether explicit source/target zones are a product requirement or whether intent extraction must also support less explicit prompts. If support is missing, document the gap clearly or implement it.
8. Tighten acceptance coverage with tests for the exact customer_orders golden path.
9. Produce a final acceptance report with:
   - TODO checklist
   - golden acceptance checklist
   - runtime evidence
   - gaps/risks
   - exact files changed
   - compile/test/audit results
   - release readiness verdict

Rules:
- Do not say “release ready” unless the acceptance checklist is satisfied.
- Prefer evidence over explanation.
- Do not silently rely on templates.
- Use etl-framework-adb as authoritative for framework rules.
- Use sample_repo as examples only.
- Keep changes production-oriented.
