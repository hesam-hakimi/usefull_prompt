Create TODOs first and keep them updated until everything below is completed.

We have narrowed the real runtime issue. Do NOT restart from scratch. Fix the remaining real blocker using the actual workspace structure and real runtime evidence.

Current real runtime state from the latest customer_orders run:
- Reused env config: env_conf/dev/env_config_dpv_dev.yaml
- Existing env config is not modified
- Strict syntax validation for reused env config is skipped correctly
- Source path generation is now much better and no longer the main blocker
- Remaining blocking validation error:
  - Unresolved variable: adls.curated.customer_order.root
- Current non-blocking warning:
  - Include not found in workspace: ../../../etl-curated-aaacz/version_conf/version_placeholders.yaml
    from env_conf/conf/common_config.yaml
- Chat also shows include files:
  - sql/ascend2/customer_orders_curated/customer_orders_curated_source.yaml
  - conf/sql/transform_filter.json
  - conf/sql/transform_derive.json
  - conf/sql/write_target.json

What I need:
Find out exactly why the generated output still references `adls.curated.customer_order.root`, and change generation/validation so it follows the REAL framework convention used in this repo.

Mandatory tasks:
1. Add targeted runtime logging for this exact scenario:
   - selected env config path
   - include resolution chain for env_conf/dev/env_config_dpv_dev.yaml
   - effective merged key list filtered to:
     - adls.*
     - source.*
     - destination.*
     - curated.*
     - synapse.*
     - data.dir / ctrl.dir / metadata.dir
   - the exact generated target-path expression
   - the exact code path that decided to use `adls.curated.customer_order.root`
   - whether that variable exists in the merged effective config
   - closest matching real keys from workspace/env/common config

2. Inspect the real workspace patterns before changing code:
   - sample repo
   - etl framework repo
   - current real env/common config chain
   - existing job config examples that write curated/silver outputs
   Determine the actual naming convention for target output paths in this repo.
   Do NOT invent a new variable convention.

3. Fix target path generation:
   - If the framework expects an existing generic target variable, use that
   - If the framework expects composition from smaller keys, generate that correctly
   - Do NOT generate `adls.curated.customer_order.root` unless it is actually defined in merged config
   - Reuse real framework naming from examples in the workspace

4. Fix validation behavior for external includes:
   - Missing include outside workspace should remain a warning unless it is required to resolve a variable actually used by this request
   - Clearly distinguish:
     - blocking unresolved variable
     - non-blocking external include not present locally

5. Add regression coverage for this exact scenario:
   - reused env config
   - nested common-config include chain
   - bronze -> silver customer_orders single-job flow
   - full source abfss path provided by user
   - target path generated using real framework convention
   - validation passes when merged effective config contains the required target definition
   - write blocked only for true unresolved runtime dependencies

6. Prove the fix with REAL runtime evidence in the Extension Development Host:
   - rerun the same customer_orders request
   - show the generated target expression
   - show validation result
   - show whether write is blocked or allowed
   - show exact runtime logs that explain why the chosen target variable/expression is correct

Acceptance criteria:
1. The real customer_orders run must no longer fail on:
   - Unresolved variable: adls.curated.customer_order.root
2. The generated target path/expression must match actual framework patterns from the real workspace.
3. External include warning must not block write unless it truly causes unresolved variables for this request.
4. Final response must include:
   - TODO checklist
   - files changed
   - exact root cause
   - before vs after target-path generation logic
   - real runtime proof from the actual workspace
   - compile result
   - test result

Important:
- Do not declare success from tests alone.
- Real runtime proof is mandatory.
- Use the real repo as source of truth.
- Be explicit about which exact existing key/pattern replaced `adls.curated.customer_order.root`.
