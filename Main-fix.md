You are working inside a multi-repo VS Code workspace for ETL Framework job generation.

Your task is to refactor and harden the ETL Copilot extension so it uses the framework repo as the source of truth, compares against legacy/sample repos, and generates framework-correct job configs with explicit user choices.

IMPORTANT:
Create and maintain a TODO list from the beginning.
Do not stop until every TODO is either implemented and tested, or explicitly marked blocked with a concrete reason.
After every major change, update the TODOs.
At the end, provide a checklist showing each requirement and whether it is complete.

==================================================
1. WORKSPACE REPO ROLES
==================================================

Treat the workspace repos with this precedence:

1) etl-framework-adb
   - PRIMARY source of truth for framework behavior
   - Use this repo to understand actual parsing, validation, include handling, env config behavior, module order, and expected config structure

2) etl-framework-gen-utils
   - SECONDARY source of truth for generation/helper logic
   - Use this repo to compare generation patterns, helpers, naming logic, and any prior generation implementation

3) sample_repo
   - TEMPLATE / SAMPLE library
   - Use this repo to discover candidate templates and examples
   - Do NOT assume sample_repo defines framework rules unless confirmed by etl-framework-adb

4) etl_framework_extension
   - The codebase being modified

5) Business repo outputs / generated files in workspace
   - OBSERVED patterns only
   - Do NOT treat them as authoritative unless verified against etl-framework-adb

If etl-framework-adb conflicts with any sample or output pattern, prefer etl-framework-adb and explain the difference.

==================================================
2. CORE BEHAVIOR CHANGES REQUIRED
==================================================

Implement these behaviors in the extension:

A. ENV CONFIG SELECTION
- If the user provides ENV_CONFIG inline in the initial request, parse it and try to use it immediately
- Supported forms should include at least:
  - ENV_CONFIG=path
  - env_config=path
  - --env-config=path
  - env config: path
- If a valid existing env config path is provided, do NOT ask the env question again
- Reuse the existing env config
- Only create a new env config if the user explicitly says it does not exist or chooses create-new

B. TEMPLATE DISCOVERY + USER CHOICE
Before generation, the system must evaluate whether a template/reference should be used.

Required behavior:
- Search for relevant candidate templates in:
  - sample_repo
  - business-repo output folders
  - optionally etl-framework-gen-utils if useful for generation references
- Score candidates by relevance
- Present structured choices to the user:
  - Use recommended template structure
  - Use template hints only
  - Do not use a template
  - If multiple strong candidates exist, allow selecting one or more relevant references for comparison
- The system must NOT silently choose and apply a reference job
- It must explicitly tell the user:
  - which file(s) are candidate references
  - from which repo
  - why each was suggested
  - whether the candidate is being used as:
    - full_structure
    - hints_only
    - comparison_only
- If the user says “do not use template”, generation must start from scratch

C. MULTI-CHOICE UI FOR JOB SHAPE
The system must not force the user to type free text for structured choices.
Implement structured selection UI where possible.

At minimum support:
- Job shape:
  - single_job
  - split_extract_load
- Optional artifacts:
  - onboarding
  - success_email
  - validation_query
  - smoke_test
- Template mode:
  - full_structure
  - hints_only
  - none

If VS Code Chat buttons are limited, use QuickPick or another structured UI path. Do not rely on arbitrary text when the choice can be structured.

D. MULTIPLE JOB-CONFIG REFERENCES / TEMPLATES
Support the case where more than one reference job config is relevant.
Examples:
- extract + load
- load + success email
- onboarding + job config
If multiple references are needed, let the user select them from structured options.

E. GENERATION LOGIC MUST FOLLOW FRAMEWORK
The generated job config must follow behavior verified from etl-framework-adb:
- correct module types
- correct module order
- correct sourcing/transform/writer/synapse flow
- correct include usage
- correct env linkage behavior
- correct variable naming and resolution expectations

Specifically verify the intended flow for:
- data sourcing module creates/defines the sourced data/view correctly
- transformation consumes the sourced view, not the raw source path directly when framework expects view consumption
- downstream write / sync / publish modules are framework-compatible
- Synapse publish behavior matches framework expectations

F. NO SILENT EXTRACT/LOAD SPLIT
Do not generate separate EXTRACT/LOAD files unless:
- the user explicitly selected split_extract_load
OR
- framework logic clearly requires it and the UI told the user

If single_job is selected, exactly one job config must be generated.

G. NO SILENT ONBOARDING FILE CREATION
Do not create onboarding unless:
- user selected it
OR
- the extension UI explicitly recommended it and the user accepted

H. PARSE VALIDATION AFTER GENERATION
After generating the job config, validate it against framework-compatible rules.
Use etl-framework-adb code to determine how parsing / include / env resolution is actually done.

The validator must check:
- selected env config can be applied
- includes resolve
- required variables resolve
- job config structure is parse-compatible
- module order/types are compatible
- obvious missing required settings are reported

If parse validation fails:
- do not silently continue
- show a structured validation result
- explain what failed
- point to source of failure if possible

==================================================
3. REQUIRED NEW CAPABILITIES / SERVICES
==================================================

Implement or improve these capabilities in the extension:

1) Framework code discovery
- Add code that can inspect / learn from etl-framework-adb
- Identify parser, validator, include handling, env binding, module expectations

2) Framework pattern extractor
- Normalize discovered framework rules into reusable extension-side logic

3) Template discovery and ranking
- Discover candidate templates from sample_repo and output repos
- Score and explain why they match

4) Legacy/output comparison
- Compare:
  - current extension output
  - old generated outputs
  - sample repo
  - framework truth
- Show where they differ

5) Reference disclosure
- Whenever a reference/template is used, the response must explicitly disclose:
  - repo
  - file path
  - usage mode
  - why it was chosen

6) Structured selection service
- Centralize UI-driven selection for:
  - env config
  - template mode
  - template/reference candidate
  - job shape
  - optional artifacts

7) Framework parse validator
- Centralize validation of generated config against env config and framework behavior

==================================================
4. COMPARISON / COVERAGE ANALYSIS REQUIREMENT
==================================================

Because the workspace now contains:
- etl-framework-adb
- sample_repo
- etl-framework-gen-utils
- etl_framework_extension

You must compare the new extension against the other repos.

Build a coverage matrix that answers:
- Which behaviors are implemented in the extension today?
- Which behaviors exist in etl-framework-gen-utils?
- Which patterns exist in sample_repo?
- Which framework behaviors are confirmed by etl-framework-adb?
- Which extension behaviors are missing?
- Which legacy/sample patterns are incorrect relative to framework truth?

The coverage matrix must include at least:
- env config reuse
- inline ENV_CONFIG parsing
- template discovery
- template transparency
- user choice for template mode
- single vs split job shape
- optional artifacts
- source module behavior
- transform consumption of sourced view
- include generation
- parse validation
- onboarding generation
- synapse publish behavior
- reference disclosure

==================================================
5. IMPORTANT GUARDRAILS
==================================================

Do NOT:
- invent framework behavior from outputs alone
- silently copy from a reference file
- silently create new env configs when an existing one was provided
- silently generate onboarding
- silently split one job into extract/load
- assume sample_repo is correct when framework code disagrees
- assume business repo outputs are correct without framework confirmation

Always:
- say which repo/file was used as reference
- say whether it was full_structure / hints_only / comparison_only
- explain why that reference was suggested
- prefer framework truth over observed output patterns

==================================================
6. LOGGING / DIAGNOSTICS
==================================================

Add robust runtime logging so the ETL Copilot output channel shows:

- incoming request
- parsed ENV_CONFIG value (if any)
- resolved env decision:
  - reuse / create / clarify / not_found
- chosen job shape
- template candidates found
- selected template mode
- selected reference file(s)
- whether single or split generation path is being used
- generated artifact paths
- validation results
- reason when onboarding or optional artifacts are added or skipped

Make sure logs are useful enough to debug:
- why env config was not reused
- why a template was chosen
- why split_extract_load happened
- why onboarding was created
- why parse validation failed

==================================================
7. TESTING REQUIREMENTS
==================================================

Add or update tests for all key cases.

Minimum required tests:
1. inline ENV_CONFIG valid existing path -> skips env question and reuses file
2. inline ENV_CONFIG invalid path -> structured clarification / not_found
3. explicit user chooses create new env config -> new env created
4. template candidates found -> structured selection shown
5. template mode = none -> no template used
6. template mode = full_structure -> template disclosed and applied
7. template mode = hints_only -> template disclosed and only hints used
8. single_job selected -> exactly one job config generated
9. split_extract_load selected -> separate EXTRACT/LOAD generated only then
10. onboarding not selected -> onboarding not generated
11. onboarding selected -> onboarding generated
12. sourced view / source module behavior matches framework expectation
13. transformation references sourced view when framework expects it
14. generated config passes framework parse validation
15. validation failure returns structured result
16. reference disclosure appears in response
17. comparison / coverage service reports missing behaviors correctly

Run compile and tests before finishing.

==================================================
8. IMPLEMENTATION PROCESS
==================================================

Follow this process:

Step 1:
Inspect all relevant repos and create TODOs.

Step 2:
Produce a short “workspace source-of-truth map” explaining:
- what each repo is for
- what can be trusted from each repo

Step 3:
Implement framework discovery / extraction first.

Step 4:
Implement inline ENV_CONFIG parsing + env reuse fixes.

Step 5:
Implement template discovery + disclosure + structured selection.

Step 6:
Implement job shape selection.

Step 7:
Implement optional artifact selection.

Step 8:
Implement framework parse validation.

Step 9:
Add comparison / coverage report.

Step 10:
Run tests and provide final checklist.

==================================================
9. RESPONSE FORMAT WHILE WORKING
==================================================

While working, give concise status updates that include:
- files changed
- functions/classes changed
- which TODOs were completed
- whether compile/tests passed

When a reference/template is used or suggested, always print:
- repo:
- file:
- reason:
- mode:

==================================================
10. DEFINITION OF DONE
==================================================

This task is only done when all of the following are true:

- ENV_CONFIG inline parsing works
- existing env config is reused when provided
- new env config is only created when user explicitly chooses it
- template discovery works across the added repos
- user is asked whether to use a template
- user can choose full_structure / hints_only / none
- user can choose single_job vs split_extract_load via structured UI
- optional artifacts are structured choices
- single_job produces exactly one job config
- split_extract_load only happens when explicitly selected
- onboarding is not silently generated
- framework behavior is derived from etl-framework-adb
- generated config is validated against framework-compatible parsing rules
- response explicitly discloses which reference/template was used
- comparison/coverage matrix is available
- compile passes
- tests pass
- final checklist maps every requirement to implemented code

Start by inspecting the workspace and building the TODO list now.
