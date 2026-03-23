You are continuing the ETL Framework VS Code extension debugging work. Do not start from scratch. Use the current workspace and existing implementation.

IMPORTANT:
- First create a TODO list and keep it updated.
- Do not mark the work complete until every TODO is either implemented or explicitly explained with evidence.
- Do not just rely on unit tests. I need real runtime evidence from the actual extension flow as much as tooling allows.
- Do not silently use a template/reference. The system must clearly disclose what template/reference was selected, why, and how it affected output.
- Do not hallucinate framework structure. Use the actual repos in the current workspace as source of truth.

Workspace repos available:
1. etl_framework_extension
2. etl-framework-adb
3. sample_repo
4. etl-framework-gen-utils

Primary objective:
Finish the remaining debugging/verification work and produce final evidence that the ETL create flow behaves correctly end-to-end for the customer_orders scenario.

Known status so far:
- Tests are passing.
- Template discovery and naming logic were improved.
- Validation/write gating was added.
- Inline ENV_CONFIG parsing was added.
- There is still an open question whether the real runtime behavior in the Extension Development Host fully matches the intended flow.
- I need final proof, not just theory.

Use this exact create scenario for runtime verification:
@etl /create Read data from bronze customer_orders, filter active records, derive order_status, write to silver table customer_orders_curated, then publish to Synapse table stage.customer_orders_curated in dev.
1-source: abfss://bronze@edaaaedle1devsrz.dfs.core.windows.net/BRONZE/customer_order
2-USE THIS filter FOR STATUS: order_status = 'completed'
3-target folder ON ADLS: ${adls.curated.customer_order.root}/customer_orders_curated
4-synapse: STAGING TABLE : STAGING.CUSTOMER_ORDER_STAGE_BASE-TABLE AND TABLE NAME IS ORDER.CUSTOMER_ORDER_BASE-TABLE standard stage and etl.usp_process_main_v2
4-active flag: active_flag = 1
ENV_CONFIG=env_conf/dev/env_config_dpv_dev.yaml

What you must do:

TODO 1 — Gather repo evidence
- Inspect etl-framework-adb for real framework expectations:
  - job config structure
  - module ordering
  - include patterns
  - variable naming / resolution expectations
  - validation expectations
- Inspect sample_repo for sample job/env config patterns.
- Inspect etl-framework-gen-utils as legacy/previous solution reference.
- Produce a compact evidence summary showing what each repo contributes.
- Explicitly state which rules are authoritative and which are only hints/examples.

TODO 2 — Verify actual runtime path
Trace the exact runtime path for /create in the current extension:
- extension activation
- chat participant
- session service
- template discovery
- env config detection/reuse
- job shape selection
- artifact generation
- pre-write validation
- write/deploy gating
Show the concrete functions/classes involved and confirm there are no hidden alternative paths still generating old EXTRACT/LOAD behavior.

TODO 3 — Prove real runtime behavior, not just tests
I need runtime evidence from the actual extension flow for the customer_orders scenario.
If you can trigger it directly, do so.
If you cannot fully trigger F5 from your environment, then:
- instrument the code so the next real run captures definitive evidence in ETL Copilot output
- make the logs explicit and minimal-noise
- ensure logs show:
  - selected template mode
  - selected template path
  - whether template is full_structure / hints_only / none
  - reason for selection
  - env config mode and resolved path
  - selected job shape
  - generated artifact paths
  - validation result
  - whether write is blocked or allowed
- then run whatever automated/runtime harness you can run and clearly separate:
  - true Extension Host runtime evidence
  - simulated test-harness evidence

TODO 4 — Close the remaining user-facing gaps
Verify and fix these behaviors if still broken:
A. If ENV_CONFIG is provided inline in the first command, the system must not ask for env config again.
B. The system must disclose which template/reference job was selected.
C. The user must be able to choose:
   - reference job/template
   - template hints only
   - build from scratch
D. The system must allow structured choice, not require free typing where UI selection is possible.
E. If job shape = Single Job Config, it must not silently generate split EXTRACT/LOAD output.
F. Optional artifacts must be clearly separated from the main job config so the user is not confused.
G. Validation must catch invalid include files / invalid JSON / placeholder SQL / unresolved variables before write.
H. Write and deploy must be blocked when validation fails.
I. The final chat response must clearly explain:
   - what was generated
   - what was reused
   - what was blocked
   - what template/reference influenced the result

TODO 5 — Verify customer_orders output quality
For the exact customer_orders scenario, verify whether the generated output is framework-compatible.
Check at minimum:
- source is treated as bronze source, not silver source
- naming is sensible and derived from source/target correctly
- module order is correct for the real framework
- single job config vs split behavior follows user choice
- env config is reused, not recreated, when path exists
- generated include files are valid and meaningful
- no placeholder SQL such as TODO/TBD/FIXME/NULL AS placeholder remains
- unresolved variables are either valid framework variables or flagged properly
- job config references include files correctly
- output does not just mimic a random reference job incorrectly

TODO 6 — Add strong regression coverage
Add or update tests for:
- inline ENV_CONFIG reuse
- template disclosure in final response
- build from scratch mode
- template hints only mode
- full structure template mode
- Single Job Config does not create split job artifacts
- invalid include files block write
- unresolved variables block write when they should
- customer_orders scenario naming/module order/output shape
- comparison against legacy/sample patterns where useful

TODO 7 — Final report
At the end, give me a final report with these sections:
1. TODO checklist with status
2. Repos inspected and what each one contributed
3. Runtime path map
4. Runtime evidence
5. Customer_orders result assessment
6. Remaining issues, if any
7. Exact files changed
8. Compile/test results
9. Whether debugging is now truly complete

Rules:
- Do not say “completed” unless runtime evidence is strong enough.
- If any part is still uncertain, say exactly what is uncertain.
- Prefer evidence over explanation.
- Keep changes production-oriented, not demo-only.
- Reuse the existing architecture where possible; do not introduce unnecessary redesign.
