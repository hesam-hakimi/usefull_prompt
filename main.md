You need to fix a regression in the ETL VS Code extension create flow.

Current broken runtime behavior observed from manual test:
1. User provides inline env config in the FIRST command:
   ENV_CONFIG=env_conf/dev/env_config_dpv_dev.yaml
   but the extension still creates a NEW env file instead of reusing it.
2. User selects "Single Job Config" in the UI, but the extension still generates:
   - customer_orders_curated_load.json
   - job_onboarding_customer_orders_dev.json
   instead of exactly one single job config.
3. The extension is still implicitly using an existing template/reference pattern (for example Application_Metric_Load.json-like behavior) without explicitly asking the user which template to use.
4. The extension does NOT tell the user which reference/template/job config it selected before generating.
5. The final generated config still does not strictly follow the intended framework flow constraints.

What must be implemented now
A. Template selection must be explicit
- Never silently use a reference job/template.
- After env config is resolved, the system must discover candidate templates and present them to the user.
- It must clearly show:
  - candidate path
  - why it matches
  - whether it is recommended
- Then it must ask the user to choose one of:
  1. Use full structure from selected template
  2. Use template as hints only
  3. Do not use any template
- If the user says no template, the system must build from scratch.

B. Job shape selection must be enforced
- After template decision, explicitly ask:
  - Single Job Config
  - Split Extract/Load
- If user selects Single Job Config:
  - generate exactly ONE job config file
  - do NOT generate *_EXTRACT.json
  - do NOT generate *_LOAD.json
  - do NOT generate onboarding file unless user explicitly selected onboarding as optional artifact
- If user selects Split Extract/Load:
  - only then generate separate extract/load configs

C. Optional artifacts must be explicit
- Ask user whether they want optional artifacts such as:
  - onboarding
  - success email
  - validation query
  - smoke test
- If user does not select onboarding, do not create onboarding json.

D. Inline ENV_CONFIG parsing must be authoritative
- If first command includes:
  ENV_CONFIG=...
  then the extension must:
  - parse it
  - validate it exists
  - validate it matches requested environment
  - reuse it
  - skip the env question entirely
- It must NOT create a new env file in this case.
- The selected/reused env config path must be carried all the way through final artifact generation.

E. The system must tell the user what reference/template is being used
Before generating artifacts, show a structured summary like:
- env config mode: reuse/create
- env config path
- selected template path OR "no template"
- template mode: full_structure / hints_only / none
- selected job shape: single_job / split_extract_load
- selected optional artifacts
Then wait for confirmation or continue based on the UI flow.

F. Framework generation rules for Single Job Config
For the user request:
"Read data from bronze customer_orders, filter active records, derive order_status, write to silver table customer_orders_curated, then publish to Synapse table stage.customer_orders_curated in dev."

If Single Job Config is selected, output must satisfy:
1. exactly one job config file
2. first module must be framework-compatible sourcing step, not a direct template load-only structure
3. flow must represent:
   - source read / temp view creation
   - transformation consuming sourced view
   - curated write
   - synapse publish in the SAME job config
4. must not create a separate load-only config when single-job was selected

G. State handling bug must be fixed
Selections from prior steps are currently not honored at final generation.
Fix session state so these values persist and are used by the final build path:
- selectedTemplatePath
- templateMode
- jobShape
- optionalArtifacts
- envConfigMode
- envConfigPath

H. Add tests
Create/update tests to prove:
1. inline ENV_CONFIG skips env question and reuses existing file
2. when Single Job Config is selected, exactly one job config is generated
3. no *_EXTRACT.json or *_LOAD.json is created in single-job mode
4. onboarding is not generated unless explicitly selected
5. template is never auto-applied without explicit user selection
6. selected template path is shown to the user before generation
7. selected job shape is honored by final artifact generation
8. selected env config path is honored by final artifact generation

I. Debugging requirement
Add temporary debug logging to the output channel for the exact final state used by generation:
- envConfigPath
- envConfigMode
- selectedTemplatePath
- templateMode
- jobShape
- optionalArtifacts
- final artifact paths generated

Important:
- Do not give me a high-level summary only.
- Make concrete code changes.
- Create TODOs first.
- Then implement them one by one.
- After implementation, run compile/tests.
- Then provide:
  1. files changed
  2. exact functions changed
  3. test results
  4. manual retest steps
  5. expected visible UI behavior after fix
