The create flow is still incorrect.

Observed runtime behavior from the Extension Development Host:
1. It generated TWO job config files:
   - `CUSTOMER_ORDER_EXTRACT.json`
   - `CUSTOMER_ORDER_LOAD.json`
2. The first generated job starts with `data_transformation` instead of `data_sourcing_process`
3. The second generated job reloads data instead of continuing the same ETL flow
4. It also updated the existing env config, even though I explicitly provided an existing env config path to reuse

This violates the required behavior.

Fix the implementation now.

# Required behavior

## A. Reuse existing env config exactly
If the user provides an existing env config path, the extension must:
- reuse that exact file
- NOT create a new env config
- NOT mutate/update the existing env config during `@etl /create`

Only create a new env config when the user explicitly says `new` or says the env config does not exist.

## B. Generate ONE job config by default
For a normal `@etl /create` request, generate exactly:
- 1 job config file
- plus include/sql helper files only if needed

Do NOT split into:
- extract job
- load job
- onboarding file

unless the user explicitly asks for a multi-job pipeline or onboarding artifacts.

## C. Framework module order must be correct
The generated single job must follow the ETL framework pattern:

1. `data_sourcing_process`
   - defines `sourceList`
   - reads the real source path/table
   - creates the sourced/temp view alias

2. `data_transformation`
   - consumes the sourced view created by the sourcing module
   - does not read the original source path again

3. downstream target writer / load_enrich / Synapse publish modules
   - consume prior module outputs
   - remain inside the SAME job config

## D. Synapse publish stays in the same job
The Synapse publish step must be another module in the same generated job config.
Do not create a separate `*_LOAD.json` job for this default scenario.

## E. No onboarding artifact by default
Do not generate `job_onboarding_*.json` during normal create flow unless the user explicitly asks for onboarding/deployment registration.

# What to change

Trace the code path from:
- `CreateJobSessionService`
through
- blueprint building
- artifact rendering
- writing

Find where the legacy split extract/load generation is still being used, and replace it with a single-job generation path.

Most likely areas to inspect:
- `CreateJobSessionService`
- `BlueprintBuilder`
- job rendering / writer logic
- any specialized generator still producing extract/load pairs
- any onboarding generation hooked into normal create flow

# Acceptance criteria

Using this request:
`@etl /create Read data from bronze customer_orders, filter active records, derive order_status, write to silver table customer_orders_curated, then publish to Synapse table stage.customer_orders_curated in dev.`

and this env config reply:
`env_conf/dev/env_config_dpv_dev.yaml`

the result must be:

1. exactly ONE job config file generated
2. no separate `*_EXTRACT.json`
3. no separate `*_LOAD.json`
4. no onboarding file generated
5. existing env config is reused and not modified
6. first module is `data_sourcing_process`
7. transformation SQL reads from the sourced/temp view, not directly from source path again
8. Synapse publish is a later module in the same job config

# Tests to add/update

Add/update tests to verify:
- existing env config path => reuse only, no mutation
- default create => exactly one job config artifact
- no onboarding artifact in default create flow
- module order starts with `data_sourcing_process`
- Synapse publish remains in same job config

# Output format

Do not give me a summary first.
Show:
1. exact files changed
2. exact functions changed
3. why the old split-job path was still being used
4. compile/test results
5. exact retest steps
