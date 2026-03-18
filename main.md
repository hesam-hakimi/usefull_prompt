Refactor the ETL Copilot extension to support structured UI-driven selection for env config, template usage, job shape, and optional artifacts.

## Goal
The user must not be forced to type free-text selections when the system already knows the valid choices.

The system should:
1. Parse inline env config when the user includes `ENV_CONFIG=...` in the create prompt.
2. If inline env config is valid, skip the env-config question.
3. If no env config is provided, ask the user to choose from discovered env config files or choose "Create new env config".
4. Detect candidate template job configs and ASK the user whether to:
   - use the template as full structure
   - use the template as hints only
   - ignore templates and build from scratch
5. If more than one valid job structure exists, ASK the user to choose the job shape:
   - single_job
   - split_extract_load
6. Optional artifacts must be multi-select:
   - onboarding
   - success_email
   - validation_query
   - smoke_test

## Mandatory behavior
- If user selects `single_job`, DO NOT generate `*_EXTRACT.json` or `*_LOAD.json`
- If user selects `split_extract_load`, two job configs are allowed
- Template selection must never silently force split-job behavior
- Template mode `hints_only` must only reuse naming/conventions, not full structure
- If user says "do not use template", system must build from scratch
- If multiple options exist, present them as selectable UI options, not plain text instructions

## UI implementation rules
Use:
- Chat follow-up suggestions for simple single-choice flows
- Chat response buttons that invoke commands for complex selection flows
- QuickPick for single-select and multi-select choices
- QuickPick `canSelectMany=true` for optional artifacts

## Required code changes

### 1. Add structured follow-up model
Create types for:
- StructuredFollowUpQuestion
- SelectOption
- SelectionMode ('single' | 'multi')
- TemplateMode ('full_structure' | 'hints_only' | 'none')
- JobShape ('single_job' | 'split_extract_load')
- OptionalArtifact ('onboarding' | 'success_email' | 'validation_query' | 'smoke_test')

### 2. Extend session state
Session status must support:
- awaiting_env_config
- awaiting_template_choice
- awaiting_job_shape
- awaiting_optional_artifacts
- building
- validating
- completed
- failed

Store:
- selected env config path
- env config mode (reuse/create)
- selected template path
- template mode
- selected job shape
- selected optional artifacts

### 3. Inline ENV_CONFIG parsing
In CreateJobSessionService.startSession(prompt):
- detect inline forms:
  - ENV_CONFIG=path
  - env_config=path
  - --env-config=path
  - env_config:path
- normalize and validate the path
- if valid, resolve selection immediately and skip env question
- if invalid, ask clarification instead of silently ignoring it

### 4. Template discovery and selection
Add a TemplateSelector service:
- find candidate job config templates in workspace
- score them
- return selectable options with label + description + recommended flag

If candidates exist, ask the user:
- Use recommended template
- Use template as hints only
- Build from scratch

### 5. Job shape selection
If the intent can map to more than one valid output pattern, ask:
- Single job
- Split extract/load

This must be explicit and user-driven.

### 6. Artifact generation contract
Rendered artifacts must distinguish:
- main job config
- include files
- env config (created only when mode=create)
- optional artifacts

If env config is reused:
- no new env config file content should be generated
- only path/reference should be returned

### 7. Framework parse validation
After artifact generation:
- validate the generated job config against the chosen env config
- validate includes
- validate variable resolution
- return warnings/errors in a structured result

Use actual framework-compatible parsing logic if available. Do not use a placeholder validator if the framework parser already exists in the repo or can be called.

## Rendering rules
Response summary must show:
- selected env config path
- whether env config was reused or created
- whether template was used
- template mode
- selected job shape
- optional artifacts selected
- validation results

## Tests to add
1. inline ENV_CONFIG path skips env question
2. invalid inline ENV_CONFIG asks for clarification
3. template candidates trigger template selection
4. selecting `none` builds from scratch
5. selecting `hints_only` does not force template structure
6. multiple valid job shapes trigger job-shape question
7. selecting `single_job` generates exactly one job config
8. selecting `split_extract_load` generates two job configs
9. optional artifact multi-select generates only selected artifacts
10. reused env config does not create a new env file
11. framework parse validation runs after build
12. validation failure is surfaced in response

## Important
Do not use free-text follow-up parsing for selection if the choice set is already known.
Prefer command-driven selection UI and QuickPick where appropriate.
Keep ETLChatParticipant thin; orchestration should remain in CreateJobSessionService and related services.
