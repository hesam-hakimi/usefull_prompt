You are working in a multi-root VS Code workspace with two folders:

- `etl_framework_extension` → the extension source code that must be modified
- `etl-framework-adb` → read-only reference repo for the real ETL framework behavior, config structure, parser/loading behavior, and examples

Your task is to implement **Milestone 1** of a production-grade refactor.

# Goal

Refactor the extension so the `@etl /create` flow is driven by a reusable orchestration service instead of embedding business logic directly inside the chat participant.

Do **not** build the backend API yet.

The outcome of this milestone must be:
- multi-turn create flow managed by a reusable session service
- explicit env config selection step
- support for reusing an existing env config or creating a new one
- generation of a **single ETL framework job** by default
- validation that job config + env config can be parsed/resolved together using framework-compatible behavior from `etl-framework-adb`
- `ETLChatParticipant` reduced to a thin adapter

# Very important rules

1. Modify code only in `etl_framework_extension` unless explicitly stated otherwise.
2. Read `etl-framework-adb` for source-of-truth behavior.
3. Preserve the current architecture as much as possible.
4. Do not introduce the backend REST API in this milestone.
5. Do not implement SQL metadata table registration.
6. Do not generate split extract/load/onboarding artifacts by default.
7. Default output must be **one ETL framework job config**.
8. The job flow must follow the framework pattern:
   - first module: `data_sourcing_process`
   - sourcing defines `sourceList` and source objects
   - sourcing creates the sourced/temp view
   - later `data_transformation` modules consume that sourced view
   - downstream writer / Synapse steps consume earlier module outputs, not reload the same object again unless a real framework example requires it
9. If the user supplies an existing env config path, reuse that exact env config.
10. Only create a new env config when the user explicitly says it does not exist or asks to create a new one.

# Refactor target

Create a reusable core orchestration layer inside `etl_framework_extension/src/core`.

## Required new structure

Create these folders/files if they do not exist:

- `src/core/contracts/CreateJobResponse.ts`
- `src/core/contracts/ArtifactFile.ts`
- `src/core/contracts/FollowUpQuestion.ts`
- `src/core/session/SessionState.ts`
- `src/core/session/SessionStateStore.ts`
- `src/core/session/InMemorySessionStateStore.ts`
- `src/core/session/CreateJobSessionService.ts`
- `src/core/env/EnvConfigSelector.ts`
- `src/core/validate/FrameworkParseValidator.ts`

If some existing files already cover part of this responsibility, reuse them instead of duplicating logic. Create only the minimum safe new surface.

# Required behavior

## 1. Session-driven create flow

Implement a reusable session service:

### `CreateJobSessionService`
This must become the main orchestrator for `@etl /create`.

Required methods:

- `startSession(initialMessage: string): Promise<SessionState>`
- `handleUserReply(sessionId: string, message: string): Promise<SessionState>`
- `getSessionState(sessionId: string): Promise<SessionState | undefined>`

Responsibilities:
- classify the create request
- extract intent
- detect missing information
- ask the user which env config file should be used
- accept follow-up answer
- decide reuse vs create for env config
- generate artifacts
- validate job + env together
- return a structured result

## 2. Explicit env config step

Implement `EnvConfigSelector` with behavior:

- if user asks to create a job and no env config has been selected yet, the system must ask:
  - which env config file should be used?
- if the user provides a path to an existing env config:
  - reuse that exact file
- if the user says `"new"` or clearly says the env config does not exist:
  - create a new env config
- if the user gives an env config for the wrong environment:
  - ask for clarification instead of silently creating a new one

Required methods:
- `listCandidateEnvConfigs(requestedEnv: string): Promise<string[]>`
- `resolveSelection(input: string, requestedEnv: string): Promise<EnvSelectionDecision>`

Use the workspace and `etl-framework-adb` to discover real env config files.

## 3. Framework-compatible validation

Implement `FrameworkParseValidator`.

Read the real framework source in `etl-framework-adb` and find how job config + env config are parsed/resolved together.

For this milestone, implement the smallest safe validation layer that can answer:
- can the generated job config be parsed/resolved together with the selected env config?
- if not, what failed?

The output should be normalized, for example:
- `ok: boolean`
- `errors: string[]`
- `warnings: string[]`

Reuse existing validation logic where possible.

If a full parser integration is too large for this milestone, implement a framework-aligned validation shim that:
- validates includes can resolve
- validates selected env config exists
- validates variables referenced by job config are resolvable from env config / known framework context
- makes it obvious where a future real parser hook can be plugged in

But first inspect `etl-framework-adb` and align with the actual framework loading behavior as closely as possible.

## 4. ETLChatParticipant must become thin

Refactor `src/chat/ETLChatParticipant.ts` so it no longer owns the main create-flow business logic.

It should:
- start a session if none exists
- pass user follow-up replies to the session service
- render whatever the session service returns

It must not duplicate orchestration logic that now belongs in `CreateJobSessionService`.

## 5. Preserve existing rendering/writing pieces where possible

Use existing components where practical:
- blueprint builder
- job config renderer
- include renderer
- repo writer
- env config renderer
- validation orchestrator

But wire them through the new session service instead of directly from the chat participant.

# Required session states

Implement a clear session-state model such as:

- `awaiting_env_config`
- `awaiting_clarification`
- `building`
- `completed`
- `failed`

The exact naming can vary, but it must clearly support a multi-turn flow.

# Required output contract

When the create flow finishes successfully, the result must explicitly include structured fields such as:

- whether env config was reused or created
- the selected env config path
- job config artifact list
- validation result
- warnings
- summary text

Do not let the UI infer truth from filenames alone.

# Existing behavior to preserve/fix

The current system has had these issues. Your refactor must move the design in the right direction:

- wrong creation of a new env config when an existing one was supplied
- split extract/load jobs instead of one job
- job starting with `data_transformation` instead of `data_sourcing_process`
- downstream modules reloading source paths instead of consuming sourced views
- summary text drifting from actual artifact behavior

Milestone 1 does not have to fix every historical bug in one shot, but the new orchestration design must make these problems addressable through one reusable flow.

# Tests required

Add or update tests so this milestone is protected.

Create tests for at least these scenarios:

## Scenario A: existing DEV env config reuse
Input flow:
1. user sends create request for DEV
2. system asks for env config
3. user provides existing DEV env config path

Expected:
- env config mode is `reuse`
- selected env config path equals the supplied path
- no new env config file is created
- session completes or moves to generation/validation stage appropriately

## Scenario B: new env config creation
Input flow:
1. user sends create request
2. system asks for env config
3. user replies `new`

Expected:
- env config mode is `create`
- session continues with env creation path

## Scenario C: wrong-environment env config
Input flow:
1. user requests DEV
2. user provides non-DEV env config path

Expected:
- session asks for clarification
- system does not silently create a new env config

## Scenario D: chat participant delegation
Expected:
- `ETLChatParticipant` delegates create flow to `CreateJobSessionService`
- multi-turn follow-up works through session state

Use the current test style in the repo. Keep tests small and safe.

# Implementation guidance

1. First inspect these existing files:
   - `src/chat/ETLChatParticipant.ts`
   - current builder/renderer/writer/validation files
2. Then inspect relevant framework examples and parser/loading behavior in:
   - `etl-framework-adb`
3. Then refactor incrementally.

# Deliverables

At the end, report:

1. exact files changed
2. exact new classes/functions added
3. exact tests added/updated
4. how to retest manually in VS Code

# Manual retest instructions you must provide at the end

Your final response must include exact retest steps for this flow:

1. launch extension host with F5
2. run:
   `@etl /create Read data from bronze customer_orders, filter active records, derive order_status, write to silver table customer_orders_curated, then publish to Synapse table stage.customer_orders_curated in dev.`
3. verify the extension asks which env config file should be used
4. reply with an existing DEV env config path
5. verify the flow reuses that env config instead of creating a new one
6. verify the flow returns generation + validation result via the session service

Now implement Milestone 1.
Before coding, inspect existing code and framework reference behavior.
Make the smallest safe refactor that establishes this foundation.
