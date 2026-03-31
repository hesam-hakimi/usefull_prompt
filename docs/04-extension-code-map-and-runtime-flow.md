# 04. Extension Code Map and Runtime Flow

This file maps the most important components discussed during the project.  
Exact file paths and signatures should always be verified against the repo before edits.

## Major file families mentioned during the project

### Core generation / planning
- `BlueprintBuilder.ts`
- `JobConfigRenderer.ts`
- `IntentExtractor.ts`
- `CreateJobSessionService.ts`
- `SessionState.ts`
- `CreateJobResponse.ts`
- `ETLChatParticipant.ts`
- `PreWriteValidationPipeline.ts`

### Transformation layer
- `DataTransformationAdvisor.ts`
- `TransformationSqlPlanner.ts`
- `DataTransformationConfigValidator.ts`
- `DataTransformationContextProvider.ts`

### Output strategy layer
- `OutputStrategyAdvisor.ts`
- `OutputStrategyPlanner.ts`
- `OutputStrategyConfigValidator.ts`
- `OutputStrategyContextProvider.ts`
- `OutputStrategyConfig.ts`

### Runtime readiness
- `RuntimeReadinessTypes.ts`
- `RuntimeReadinessEvaluator.ts`

### Env config reuse
- `EnvConfigDiscoveryTypes.ts`
- `EnvConfigDiscovery.ts`
- `EnvConfigScorer.ts`
- `EnvConfigRecommendationAdvisor.ts`

### Env config patch planning
- `EnvConfigPatchTypes.ts`
- `EnvConfigPatchPlanner.ts`

### Artifact reuse / scoring / patch planning
- `ArtifactReuseTypes.ts`
- `ArtifactDiscovery.ts`
- `ArtifactReuseScorer.ts`
- `ArtifactReuseAdvisor.ts`
- `ArtifactPatchPlanner.ts`

### Artifact action / apply / review
- `ArtifactActionTypes.ts`
- `ArtifactActionCoordinator.ts`
- `ArtifactPatchApplier.ts`
- `NewArtifactWriter.ts`
- `ArtifactReviewRenderer.ts`

### Conversation orchestration
- `ArtifactReuseIntentRouter.ts`
- `ArtifactReuseConversationCoordinator.ts`
- `ArtifactReuseResponseBuilder.ts`

### Tests
- `outputStrategy.test.ts`
- `runtimeReadiness.tests.ts`
- `envConfigDiscovery.tests.ts`
- `envConfigPatch.test.ts`
- `artifactReuse.test.ts`
- `artifactAction.test.ts`
- `artifactReuseConversation.test.ts`
- `extension.test.ts`
- `artifactFidelity.test.ts`
- other strategy/source-specific test files

---

## Intended end-to-end runtime flow

## 1. User request enters through chat
Likely through:
- `ETLChatParticipant.ts`

Responsibilities:
- parse commands like create/write/review flows
- call downstream planning services
- render response sections
- later call write path

## 2. Intent extraction
Likely through:
- `IntentExtractor.ts`
- plus newer reuse/conversation intent routing files for reuse flows

Responsibilities:
- classify source/output intent
- detect special cases like database_out/tibco_out
- detect reuse preferences
- detect transformation shape hints

## 3. Session state update
Likely through:
- `SessionState.ts`
- `CreateJobSessionService.ts`

Responsibilities:
- persist decisions between turns
- store artifacts in memory/session
- allow follow-up commands to reuse previous decisions

This is a critical area for debugging real write failures.

## 4. Strategy planning layers
Multiple decision layers contribute:
- sourcing
- transformation
- output
- env reuse
- artifact reuse
- runtime readiness

These feed a canonical blueprint rather than writing files directly.

## 5. Blueprint construction
Likely through:
- `BlueprintBuilder.ts`

Responsibilities:
- combine the decisions into a coherent artifact model
- create module configs and include refs
- keep sourcing alias, transform input, and output strategy aligned

## 6. Rendering
Likely through:
- `JobConfigRenderer.ts`
- include file renderers/helpers

Responsibilities:
- convert internal blueprint structures into actual HOCON/JSON/YAML artifacts
- preserve naming conventions
- preserve include refs
- keep output-specific rules intact

## 7. Pre-write validation
Likely through:
- `PreWriteValidationPipeline.ts`
- validators for sourcing/transformation/output/readiness

Responsibilities:
- reject invalid artifact sets before write
- surface warnings/errors in chat
- ensure required assertions/options exist

## 8. Write command
Expected flow:
- user runs `@etl /write`
- session artifacts are retrieved
- workspace path is resolved
- files are written via repo/file writers
- summary returned to chat

This is the most important live operational flow to confirm.

---

## Temp repo vs real workspace path

A critical lesson from the project:

### In tests
A temp repo writer or equivalent test harness overrides workspace path resolution.

That means passing tests can prove:
- artifact shapes
- naming
- include refs
- write orchestration logic in principle

But they do **not** alone prove:
- actual writes hit the user-selected workspace in the live extension host

### In production / extension host
The write path must rely on the real workspace resolution method.

Important names mentioned in the chat:
- `RepoWriter.getWorkspacePath()`
- `handleWriteCommand`
- `ETLChatParticipant.ts`

Future debugging must inspect this exact path carefully.

---

## Known critical relationships between components

### Sourcing -> transformation
- source alias chosen by sourcing must be the alias consumed by transform SQL
- earlier bug: alias mismatch blocked validation
- fix: use sourced alias as initial transform input view

### Transformation -> output
- output strategy should consume transform result consistently
- externalization rules must not turn trivial output SQL into meaningless include files

### Output strategy -> validation
- selected output strategy determines which validator rules must apply
- database_out/tibco_out require specialized assertions/options

### Session state -> write
- if session artifacts are not preserved correctly, preview may succeed but write may create nothing

### Renderer -> repo writer
- previewed artifact content and written artifact content must match
- if renderer output differs between preview and write code paths, trust is broken

---

## Real workspace write checklist

When debugging `@etl /write`, trace these questions in order:

1. Did `/create` place artifacts in session state?
2. Does `/write` retrieve the same artifact set?
3. Is the workspace root resolved to the actual selected repo folder?
4. Are relative artifact paths expanded correctly?
5. Are include files written together with main job config?
6. Are writes blocked by validators, or only warned?
7. Does chat clearly report write outcome?
8. Are files maybe written somewhere unexpected?

---

## Signals that mean the system is still not fixed

Any of the following means more work is needed:

- preview shows correct artifacts, but no files exist in workspace
- only main job config is written but include files are missing
- Synapse publish section appears in preview but not written file
- temp tests pass while real extension host still writes nothing
- write path resolves to temp/test path instead of user workspace
- chat says success without listing actual created files

---

## Safe future refactor rules

When editing this area:

- keep planning separate from rendering
- keep rendering separate from writing
- do not bypass validators just to get writes
- do not mix temp-test path logic into production code
- keep user-facing write summaries explicit
