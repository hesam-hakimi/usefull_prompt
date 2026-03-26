# Implement Review / Apply Action Layer for Artifact Reuse Decisions

## Goal
Build the next layer after Artifact Discovery / Scoring / Advisor / Patch Planner.

This new layer must turn the planned decisions into actual user-visible actions:
- review
- confirm
- apply
- validate again
- then continue to write/deploy only when safe

The current system already has:
- ArtifactDiscovery
- ArtifactReuseScorer
- ArtifactReuseAdvisor
- ArtifactPatchPlanner

Now add the layer that executes the chosen action safely.

---

## What this layer must do

After the advisor returns one of these modes:
- `reuse_existing_artifacts`
- `patch_existing_artifacts`
- `create_new_artifacts`
- `manual_review_required`

the extension must:

1. render a clear decision summary in chat
2. show the exact files affected
3. show patch vs create vs reuse intent
4. support an explicit user action
5. apply the selected action safely
6. rerun validation after apply
7. block unsafe continuation if validation fails

---

## New files to create

### `src/core/artifacts/ArtifactActionTypes.ts`
Add types for:
- `ArtifactAction`
- `ArtifactActionMode`
- `ArtifactActionPreview`
- `ArtifactApplyResult`
- `ArtifactValidationAfterApply`
- `ArtifactReviewItem`

### `src/core/artifacts/ArtifactActionCoordinator.ts`
Responsibility:
- take reuse decision + patch plan + user preference
- decide which action is available
- build an action preview
- invoke the correct downstream applier

### `src/core/artifacts/ArtifactPatchApplier.ts`
Responsibility:
- apply patch plans to existing files
- preserve untouched content
- only modify approved sections
- support dry-run preview mode first

### `src/core/artifacts/NewArtifactWriter.ts`
Responsibility:
- create new files from scaffold plans
- ensure parent folders exist
- preserve canonical file naming and include structure

### `src/core/artifacts/ArtifactReviewRenderer.ts`
Responsibility:
- format chat-friendly review content
- include:
  - chosen mode
  - confidence
  - files to reuse
  - files to patch
  - files to create
  - manual review items
  - validation status

### `src/test/suite/artifactAction.test.ts`
Tests for action preview, apply flow, validation-after-apply, and blocked unsafe writes.

---

## Existing files to modify

Update these files:
- `src/index.ts`
- `src/core/session/SessionState.ts`
- `src/core/session/CreateJobResponse.ts`
- `src/core/session/CreateJobSessionService.ts`
- `src/chat/ETLChatParticipant.ts`
- `src/core/validation/PreWriteValidationPipeline.ts`
- `src/test/suite/extension.test.ts`

---

## New action modes

Introduce these action modes:

- `preview_only`
- `reuse_confirmed`
- `patch_confirmed`
- `create_new_confirmed`
- `manual_review_required`
- `apply_blocked`

The user should not silently fall into apply mode.

---

## Session flow changes

### After artifact reuse decision
Store in session state:
- selected candidate
- decision mode
- patch plan
- auto-applicability flag
- review summary
- files to touch

### Chat behavior
The user should see a section like:

## Artifact Action Review
- decision: patch_existing_artifacts
- confidence: high
- matched artifact set: ...
- files to reuse: ...
- files to patch: ...
- files to create: ...
- manual review items: ...

## Available Actions
- preview patch
- apply patch
- create new instead
- keep existing only
- manual review

---

## Apply rules

### `reuse_existing_artifacts`
- do not regenerate files
- reuse the artifact set
- rerun validation against the reused artifacts
- if validation passes, continue
- if validation fails, downgrade to manual review

### `patch_existing_artifacts`
- generate patch preview first
- only apply targeted changes
- do not overwrite unrelated content
- rerun validation after patch
- block continuation if validation fails

### `create_new_artifacts`
- create all required files from scaffold plan
- rerun validation
- block continuation if validation fails

### `manual_review_required`
- do not auto-apply
- render a structured review summary
- clearly explain why it is unsafe to proceed automatically

---

## Validation after apply

After any apply operation:
1. run existing validation pipeline
2. run output strategy validation
3. run env/runtime readiness checks
4. confirm include refs still resolve
5. confirm artifact family is still coherent

Return:
- `ok`
- `warnings`
- `errors`
- `filesTouched`

---

## Safety rules

- Never overwrite unrelated lines or files
- Never auto-apply when decision mode is manual review
- Never skip validation-after-apply
- Never claim success before validation reruns
- Preserve HOCON/YAML structure exactly
- Preserve include filenames and doc-driven naming
- Preserve user-owned SQL unless patch plan explicitly says to update it

---

## Diff / preview behavior

For patch mode, the preview should include:
- file path
- patch type
- changed sections
- before/after snippets where practical
- whether change is safe-auto or needs review

For create-new mode, preview should include:
- all new files
- artifact family
- env config handling
- include files generated

---

## Tests to add

Add tests for:
1. reuse mode -> preview + validation succeeds
2. patch mode -> preview + apply + validation succeeds
3. create-new mode -> create + validation succeeds
4. manual review mode blocks apply
5. validation failure after patch blocks continuation
6. unrelated file content is preserved
7. chat response includes action review section
8. extension end-to-end path supports preview/apply/revalidate flow

Also add one regression test where:
- an existing artifact family is found
- patch plan updates only one include file
- top-level job config remains unchanged
- final validation still passes

---

## Deliverables

Return:
1. new files created
2. existing files modified
3. action modes implemented
4. example preview output
5. example apply output
6. validation-after-apply result shape
7. `npm test` result

Do not stop at planning. Implement the layer and run tests.
