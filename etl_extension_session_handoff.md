# ETL Extension Session Handoff

Last updated: 2026-03-18

This document is a handoff summary for continuing the ETL VS Code extension work in a new ChatGPT session.
It is compiled from the conversation history available in this thread plus the useful screenshots shared during the work.

---

## 1) Project context

We are building and debugging a **VS Code + GitHub Copilot Chat extension** for a Databricks ETL framework.
The extension is intended to support commands such as:

```text
@etl /create Read data from bronze customer_orders, filter active records, derive order_status, write to silver table customer_orders_curated, then publish to Synapse table stage.customer_orders_curated in dev.
```

The extension should generate framework-compatible artifacts such as:
- job config
- include files
- optional env config
- optional onboarding / other artifacts
- validation output

The work has focused heavily on:
- env config reuse vs creation
- job config generation shape
- framework-compatible module order
- template/reference selection
- stateful multi-step orchestration in chat
- runtime/debug logging

---

## 2) Core framework facts established during the conversation

These are important and should be treated as source-of-truth requirements unless explicitly changed.

### 2.1 Env config linkage
- The **job config does not directly reference the env config**.
- The link between job config and env config is handled **externally at runtime / via deployment metadata / onboarding metadata**.
- There is effectively a mapping table or metadata concept that says which job uses which job config and which env config.

### 2.2 Source / transform / writer pattern
The desired framework flow is:
1. **data_sourcing_process** reads from the source and creates temp views
2. **data_transformation** consumes those temp views
3. **dataframe_writer / load_enrich_process / data_sync** writes to target systems

Important user clarification:
- sourcing modules should read the real source
- later modules should consume the sourced view
- transformation should not be the first module
- a load/output module should not re-read directly from the original source if the framework pattern expects consumption of the sourced/transformed view

### 2.3 Single-job vs split-job
Two possible output structures exist conceptually:
- **single job config**
- **split extract/load**

The user wants this to be an explicit choice in the flow and not something the system silently decides.

### 2.4 Template/reference behavior
The system should not silently copy patterns from arbitrary existing jobs.
It should:
- discover suitable template/reference jobs
- explain which candidate(s) it found
- explain why they are relevant
- ask the user whether to use a template or not
- allow the user to say **do not use template** and build from scratch

The user explicitly noted that the system appeared to be referencing jobs such as:
- `customer_interaction` jobs
- `Application_Metric_Load.json`

without asking first.

This is not acceptable behavior.

---

## 3) User-required behavior (must be preserved)

These are the most important behavioral requirements gathered from the session.

### 3.1 Env config selection rules
The extension should:
1. Ask the user which env config file should be used **only if the prompt does not already specify one**
2. If the user provides an existing env config path, it must **reuse** it
3. If the user says the env config does not exist / wants a new one, it may create a new env config
4. It must not silently create a new env config when a valid existing one was already provided
5. It should validate that the chosen env config is suitable for the requested environment (dev/test/prod/etc.)

### 3.2 Inline env config support
If the initial prompt contains something like:

```text
ENV_CONFIG=env_conf/dev/env_config_dpv_dev.yaml
```

then the extension should:
- parse it from the initial request
- resolve it immediately
- skip the env config question
- proceed directly to the next step

### 3.3 Template choice rules
The system should ask whether to use a template/reference.
Possible user choices should include:
- use recommended template fully
- use template only as hints / structure
- do not use template
- pick from several candidates

The system should also tell the user **which job/template it is proposing**.

### 3.4 UI selection rules
For steps with constrained choices, the user should **select options**, not type arbitrary free text.
This especially applies to:
- env config choice from discovered candidates
- job shape selection
- template mode selection
- optional artifact selection
- possibly selecting multiple references when more than one is needed

The user specifically asked that if multiple job config patterns are relevant, the user should choose between options and this should be reflected in the UI.

### 3.5 Job shape selection rules
If the user selects **Single Job Config**:
- generate exactly **one** job config
- do not generate `*_EXTRACT.json`
- do not generate `*_LOAD.json`
- do not split the pipeline into multiple jobs unless the user explicitly selected that

If the user selects **Split Extract/Load**:
- then separate job configs may be generated

### 3.6 Optional artifacts
Optional artifacts should be explicit choices, not automatically forced.
Examples discussed:
- onboarding
- success email job
- validation query
- smoke test

### 3.7 Validation after generation
After creating the job, the system should check whether the generated job config can actually be parsed/resolved using the selected env config.
The user explicitly asked that this validation should be based on **how the real framework source code implements parsing/resolution**.

---

## 4) Important runtime symptoms observed in screenshots

These observed behaviors are key because they show the gap between intended code changes and actual runtime behavior.

### 4.1 Existing env config in the initial prompt was ignored
The user provided inline env config in the initial command, for example:

```text
ENV_CONFIG=env_conf/dev/env_config_dpv_dev.yaml
```

Yet the extension still asked:

> Which env config file should be used for dev?

This indicates that inline `ENV_CONFIG=` parsing was either:
- not invoked on the actual runtime path, or
- parsed but discarded before state progression, or
- not correctly resolved on Windows/path-glob logic

### 4.2 Wrong / auto-chosen references
At different times the system appeared to use unrelated jobs as references, such as:
- customer interaction jobs
- `Application_Metric_Load.json`

This happened without clearly asking the user for consent.

### 4.3 Single-job choice still produced multiple files
Even when the user selected **Single Job Config**, screenshots later showed generation of:
- env config
- job config
- onboarding file

or in other runs:
- `CUSTOMER_ORDERS_CURATED_EXTRACT.json`
- `CUSTOMER_ORDERS_CURATED_LOAD.json`
- onboarding JSON

This means the runtime behavior still drifted into split-job or template-driven output.

### 4.4 Wrong module ordering / structure
Problematic generated files showed cases where:
- the first module looked like `data_transformation`
- or a load file seemed to read from the source directly
- or the overall pipeline shape did not match the expected `data_sourcing_process -> data_transformation -> writer/synapse`

### 4.5 Silent env creation / recreation
Even after reuse was expected, the output sometimes still showed creation of a new env config such as:
- `env_conf_customer_orders_dev.yaml`

This contradicted the requirement to reuse the existing env config when supplied.

### 4.6 Wrong reference model influences output shape
The user identified that some of the bad output likely happened because the extension was using existing split-style jobs as reference patterns, for example customer interaction jobs with separate extract/load files.

This is a strong clue: **template/reference discovery is influencing output shape without explicit user confirmation**.

---

## 5) Major phases of the work completed in the session

### Phase A - Env config linkage clarification
Early in the work, the system initially behaved as if env config might be embedded or newly generated.
A key correction was established:
- env config linkage is external
- job config should not imply direct inline linkage to env config
- metadata / onboarding / deployment mapping handles association

### Phase B - Env config reuse vs create
The extension then evolved toward:
- discovering candidate env configs
- reusing existing env configs
- exposing reuse/create mode in summaries

There were repeated fixes around:
- workspace search for env configs
- lower match thresholds
- HOCON/YAML compatibility assumptions
- path normalization

### Phase C - Source/temp-view behavior
Blueprint and renderer changes were made so that:
- sourced data creates a temp view
- transformation references the sourced view alias instead of the original table path

This aligned the output more closely with the framework pattern.

### Phase D - Single vs split output structure
The extension was refactored to support explicit job shape selection:
- `single_job`
- `split_extract_load`

But runtime regressions still showed split behavior appearing when single job was selected.

### Phase E - Orchestration service refactor
A major refactor introduced a stateful orchestration layer around job creation.
Screenshots showed the introduction of files such as:
- `CreateJobResponse.ts`
- `ArtifactFile.ts`
- `FollowUpQuestion.ts`
- `SessionState.ts`
- `SessionStateStore.ts`
- `InMemorySessionStateStore.ts`
- `CreateJobSessionService.ts`
- `EnvConfigSelector.ts`
- `FrameworkParseValidator.ts`

The intent was to make `ETLChatParticipant` a thin adapter and centralize multi-step logic.

### Phase F - Inline `ENV_CONFIG=` parsing
Later changes explicitly aimed to parse inline `ENV_CONFIG=` from the initial prompt and skip the env question.
This was called out as a missing feature and then added.
However, screenshots still showed runtime cases where it was not honored.

### Phase G - Structured UI-driven selection
A later redesign introduced structured UI/state concepts such as:
- template mode
- job shape
- optional artifacts
- structured follow-up questions
- candidate templates with scoring/recommendation

From screenshots, new conceptual types included:
- `TemplateMode`: `full_structure | hints_only | none`
- `JobShape`: `single_job | split_extract_load`
- `OptionalArtifact`: `onboarding | success_email | validation_query | smoke_test`

Services shown in screenshots:
- `UISelectionService`
- `TemplateDiscoveryService`

### Phase H - Diagnostic logging
The latest stage added extensive runtime logging, especially in:
- `EnvConfigSelector.ts`
- `CreateJobSessionService.ts`

The stated purpose was to debug why:
- provided env configs were not being reused
- job shape choices were not respected
- files were being created unexpectedly

---

## 6) Important code/files explicitly mentioned during the session

Below is a consolidated list of important files/classes/functions mentioned in chat or visible in screenshots.

### Main orchestration / chat
- `src/chat/ETLChatParticipant.ts`
- `src/core/session/CreateJobSessionService.ts`
- `src/core/session/SessionState.ts`
- `src/core/session/SessionStateStore.ts`
- `src/core/session/InMemorySessionStateStore.ts`

### Env config
- `src/core/env/EnvConfigSelector.ts`
- `src/renderers/EnvConfigRenderer.ts`

### Validation
- `src/core/validate/FrameworkParseValidator.ts`
- `HOCONConfigValidator.ts` (visible in a later screenshot)

### Blueprint / render
- `BlueprintBuilder.ts`
- `JobConfigRenderer.ts`
- `IncludeFileRenderer.ts`
- `RepoWriter.ts`

### Intent / classification
- `src/classifiers/IntentExtractor.ts`
- `TaskClassifier.ts`
- `TemplateSelector.ts`

### Structured selection / template support
- `UISelectionService.ts`
- `TemplateDiscoveryService.ts`

### Contracts / types
- `CreateJobResponse.ts`
- `ArtifactFile.ts`
- `FollowUpQuestion.ts`
- `index.ts` (types)

---

## 7) What the user ultimately wants the product to do

This section is the most important product-level requirement summary.

### Desired happy path
For a request like:

```text
@etl /create Read data from bronze customer_orders, filter active records, derive order_status, write to silver table customer_orders_curated, then publish to Synapse table stage.customer_orders_curated in dev.
```

with inline env config such as:

```text
ENV_CONFIG=env_conf/dev/env_config_dpv_dev.yaml
```

The ideal flow should be:

1. Parse intent, environment, source, transforms, targets
2. Parse and resolve inline env config
3. Skip env question if valid env config exists
4. Discover relevant template/reference candidates
5. Ask the user whether to:
   - use recommended template fully
   - use template as hints only
   - build from scratch
6. If multiple relevant reference jobs exist, present them as selectable options
7. Ask for job shape selection:
   - single job config
   - split extract/load
8. Ask for optional artifacts selection
9. Generate artifacts accordingly
10. Validate generated config against framework parsing/resolution using the selected env config
11. Clearly tell the user:
   - which env config was used
   - which template/reference job(s) were used, if any
   - which files were generated
   - whether validation passed

### Very important guardrails
The system must **not**:
- silently switch to another template
- silently create a new env config when reuse was possible
- silently split a single-job request into extract/load
- silently create onboarding unless selected/required by explicit rules
- silently reference unrelated jobs like `customer_interaction` or `Application_Metric_Load.json`

---

## 8) Open bugs / unresolved issues at the end of the session

These issues were still active.

### Bug 1 - Inline env config still not always honored at runtime
Even after adding code for inline `ENV_CONFIG=` parsing, screenshots still showed the env config question appearing.

### Bug 2 - Reference/template use is still too implicit
The extension still appears to use existing job configs as hidden references instead of showing candidates and asking the user first.

### Bug 3 - Single-job choice still drifts into wrong outputs
Despite a UI step for choosing **Single Job Config**, runtime output still sometimes produced:
- multiple files
- onboarding
- split job naming
- incorrect module ordering

### Bug 4 - Runtime behavior still mismatches the claimed code behavior
At several points, the code/debug summaries claimed:
- only one job config is generated
- no EXTRACT/LOAD pattern exists in the codebase
- onboarding generation is not in the code path

But runtime screenshots contradicted that.

This means one of the following is still true:
- wrong code path is running
- stale compiled output / stale window / cached extension instance is still involved
- another augmentation layer is influencing output
- template/reference logic is rewriting shape later in the flow
- the chat participant is not the only place affecting final artifacts

### Bug 5 - Wrong template/reference changes output family
The user identified that customer interaction and application metric job families likely influenced generation.
This should be elevated to a first-class debugging focus.

---

## 9) Diagnostic logging recently added

The latest screenshots showed that diagnostic logging was added.

### In `EnvConfigSelector.ts`
Logging reportedly covers:
- constructor/output channel hookup
- `resolveSelection()`
- `resolvePath()`
- resolution attempts for:
  - absolute path
  - glob patterns
  - workspace folder logic
- Windows path normalization / backslash handling
- multiple glob fallback patterns

### In `CreateJobSessionService.ts`
Logging reportedly covers:
- passing output channel to env selector
- `buildArtifacts()` details
- env decision (`reuse` vs `create`)
- selected/evaluated job shape
- reasons for reuse/create
- generated file paths

### Intended runtime checks from logs
The plan was to inspect output channel messages like:
- `resolvePath called with input=...`
- `Trying glob pattern: ...`
- `EnvDecision: mode=..., path=...`
- `Evaluating job shape: single_job`

Interpretation guidance that emerged in the chat:
- if `resolvePath` fails, file discovery/path logic is still wrong
- if env mode is `reuse` but path is `undefined`, state propagation is broken
- if job shape becomes `split_extract_load` after selecting `single_job`, UI/state parsing is broken

---

## 10) Important conclusions from screenshot evidence

These conclusions are useful in a new session:

1. The user repeatedly provided a valid env config path inline, and the system still asked for env config.
2. The system sometimes generated outputs influenced by unrelated reference jobs.
3. The system did not clearly tell the user which template/reference it used.
4. The system sometimes generated onboarding even when the user was focused on single job config behavior.
5. The user strongly prefers **explicit choice and transparency** over automatic convenience behavior.

---

## 11) Recommended next debugging priorities

Use this order in the next session.

### Priority 1 - Enforce inline env config before any question
Add or verify a hard gate in the flow:
- parse inline env config from the original request
- resolve it immediately
- if valid, set reuse mode and skip env prompt entirely

### Priority 2 - Block hidden template auto-apply
No template/reference may be applied until the user explicitly chooses one of:
- full structure
- hints only
- none

### Priority 3 - Make job shape authoritative
If the user selected `single_job`, then downstream rendering must be blocked from producing:
- `*_EXTRACT.json`
- `*_LOAD.json`
- implicit split pipeline behavior

### Priority 4 - Separate optional artifacts from core job generation
Onboarding and other optional artifacts should not be created unless:
- the user selected them, or
- there is an explicit policy that requires them for a certain path

### Priority 5 - Surface reference/template provenance
The response should always say:
- which reference/template candidates were found
- which one was selected
- why it was recommended

### Priority 6 - Add end-to-end tests for real user scenario
Create a high-value e2e/unit test around the exact scenario below:
- prompt contains `ENV_CONFIG=env_conf/dev/env_config_dpv_dev.yaml`
- user selects `Single Job Config`
- result should be one job config only
- env config should be reused
- no onboarding unless explicitly selected
- first module should be sourcing
- transformation should use sourced view

---

## 12) Suggested starter prompt for the next session

Use this in a new session to continue quickly:

```text
Please continue from this ETL extension handoff document.

We are debugging a VS Code Copilot Chat ETL extension.
The highest-priority unresolved issues are:
1. Inline ENV_CONFIG in the initial prompt is still being ignored at runtime.
2. The extension still appears to auto-apply hidden reference/templates without asking the user.
3. Selecting Single Job Config still sometimes produces multiple artifacts or wrong output shape.
4. The extension must tell the user which reference/template job it wants to use before applying it.
5. Optional artifacts like onboarding must not be auto-created unless explicitly selected.

Please first restate the current system design, then propose the exact code changes needed, then create a step-by-step test plan.
```

---

## 13) Suggested prompt to give GitHub Copilot / Codex

```text
Please work on the ETL VS Code extension using the attached handoff summary as the source of truth.

Goals:
1. Honor inline ENV_CONFIG=... in the initial @etl /create request and skip the env question when valid.
2. Never auto-apply a template/reference job without explicit user confirmation.
3. Before generation, show candidate reference/template jobs and let the user choose:
   - full structure
   - hints only
   - none
4. Support structured UI selection for:
   - env config choice
   - template/reference choice
   - job shape (single_job vs split_extract_load)
   - optional artifacts
5. If single_job is selected, generate exactly one job config and do not generate EXTRACT/LOAD split files.
6. Do not auto-create onboarding unless explicitly selected.
7. Ensure module order is framework-compatible:
   - data_sourcing_process first
   - data_transformation consumes sourced view
   - writer/synapse later
8. After generation, validate that the generated config can be resolved/parsed using the selected env config.
9. In the response, explicitly state:
   - which env config was used
   - whether it was reused or created
   - which template/reference job(s) were found and which one was used
   - which files were generated
   - whether validation passed
10. Add/maintain detailed TODOs and do not stop until all TODOs are implemented and tested.

Also add or update tests for:
- inline ENV_CONFIG parsing
- reuse vs create env config
- explicit template/reference selection
- single_job generation
- split_extract_load generation
- optional artifact selection
- no hidden onboarding generation
- correct module ordering
- sourced-view usage in transform SQL

Finally, provide:
- a concise change summary
- exact files changed
- exact tests added/updated
- manual retest steps
```

---

## 14) Short glossary of recurring terms

- **env config reuse**: using an existing env config path instead of creating a new env config file
- **single_job**: one job config containing the full pipeline
- **split_extract_load**: separate extract and load job configs
- **template/reference job**: an existing job config used as a model/pattern for new generation
- **hints_only**: use a reference only as guidance, not as a strict clone
- **data_sourcing_process**: framework stage that reads source and creates temp view(s)
- **data_transformation**: framework stage that consumes sourced view(s)
- **onboarding**: deployment/metadata linkage artifact that can connect job config and env config externally

---

## 15) Final state snapshot at the end of the session

At the end of the session:
- the design direction became much clearer
- structured multi-step orchestration had been introduced
- template/UI selection concepts were added
- diagnostic logging was added
- but runtime still did not fully match intended behavior

So the project is **not blocked conceptually**, but it is still in a **runtime correctness / orchestration integrity** phase.
The next session should focus on narrowing the gap between:
- intended code path
- actual runtime output

