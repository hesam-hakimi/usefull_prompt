# Implement Existing Artifact Reuse / Update Layer

## Goal
Add a new layer that decides whether the extension should:
- reuse an existing job artifact set,
- patch an existing artifact set,
- or create a new one.

This must work after:
- intent extraction
- output strategy selection
- env config discovery/reuse
- env patch planning

The new layer must minimize unnecessary regeneration and preserve existing valid artifacts whenever safe.

---

## What this layer should do

For a new ETL request, the extension should search the workspace for existing artifacts and classify the situation into one of these modes:

- `reuse_existing_artifacts`
- `patch_existing_artifacts`
- `create_new_artifacts`
- `manual_review_required`

This layer must inspect:
- existing top-level job config files
- existing include files
- existing env config references / selected env config
- module structure
- output strategy compatibility
- naming compatibility
- path compatibility
- doc-driven output strategy expectations

---

## New files to create

### `src/core/artifacts/ArtifactReuseTypes.ts`
Add types for:
- `ArtifactCandidate`
- `ArtifactReuseDecision`
- `ArtifactPatchPlan`
- `ArtifactPatchItem`
- `ArtifactReuseInput`

### `src/core/artifacts/ArtifactDiscovery.ts`
Responsibility:
- search workspace for candidate job configs and related include files
- detect artifact family/group
- collect related files
- detect module names, include refs, output strategy, env assumptions

### `src/core/artifacts/ArtifactReuseScorer.ts`
Responsibility:
- score candidates against the current request
- compare:
  - source intent
  - transformation shape
  - output strategy
  - env compatibility
  - naming similarity
  - doc-driven required structure
- return ranked candidates

### `src/core/artifacts/ArtifactReuseAdvisor.ts`
Responsibility:
- choose one of:
  - `reuse_existing_artifacts`
  - `patch_existing_artifacts`
  - `create_new_artifacts`
  - `manual_review_required`
- explain why
- produce a chat-friendly summary

### `src/core/artifacts/ArtifactPatchPlanner.ts`
Responsibility:
- create a minimal patch plan for:
  - top-level job config
  - include files
  - output strategy sections
  - env references
- keep valid existing sections unchanged whenever possible

### `src/test/suite/artifactReuse.test.ts`
Add new tests for discovery, scoring, reuse decisions, and patch plan creation.

---

## Existing files to modify

Update these files so the new layer is part of the main flow:

- `src/index.ts`
- `src/core/intent/IntentExtractor.ts`
- `src/core/blueprint/BlueprintBuilder.ts`
- `src/core/session/SessionState.ts`
- `src/core/session/CreateJobResponse.ts`
- `src/core/session/CreateJobSessionService.ts`
- `src/chat/ETLChatParticipant.ts`
- `src/core/validation/PreWriteValidationPipeline.ts`
- `src/test/suite/extension.test.ts`

---

## Decision logic

### Choose `reuse_existing_artifacts` when:
- a candidate matches strongly on source, transformation intent, output strategy, and env compatibility
- no required structure is missing
- no doc-driven mismatch exists

### Choose `patch_existing_artifacts` when:
- a close candidate exists
- only a few fields or files need updates
- patching is safer than full regeneration

### Choose `create_new_artifacts` when:
- no strong candidate exists
- matching candidates are too far apart
- patching would be more disruptive than new generation

### Choose `manual_review_required` when:
- multiple strong candidates conflict
- patching would affect too many files
- key doc-driven structures are incompatible
- env/output/runtime requirements are too far apart

---

## Scoring factors

Score candidates using:
- source match
- transformation shape match
- output strategy match
- required runtime/env compatibility
- include file compatibility
- naming compatibility
- doc-driven module compliance
- artifact family consistency

Penalize:
- conflicting output strategies
- missing required include structure
- invalid doc-driven naming
- unrelated source/table family
- too many required file changes

---

## Patch planning rules

When patching:
- preserve existing valid module keys
- preserve valid include refs
- preserve valid output strategy sections
- only update fields that must change
- do not rewrite whole files if a targeted patch is enough

The patch plan should clearly separate:
- `safe_updates`
- `new_files_needed`
- `manual_review_items`

---

## Chat UX requirements

Add a new response section:

### Artifact Reuse Decision
- mode
- confidence
- matched candidate
- reasons
- files to reuse
- files to patch
- files to create
- manual review items

If patching is selected, show a concise diff-style summary.

---

## Validation rules

Before write/deploy:
- validate patched artifacts with the same existing validation pipeline
- ensure reused files still satisfy doc-driven rules
- ensure output strategy still matches
- ensure env requirements remain satisfied
- block write if the patch plan creates invalid artifact combinations

---

## Tests to add

Add tests for:
1. strong candidate => reuse
2. close candidate => patch
3. no candidate => create new
4. conflicting candidates => manual review
5. patch plan only updates minimal fields
6. output strategy mismatch prevents reuse
7. env mismatch prevents unsafe reuse
8. include structure mismatch triggers patch or review
9. final response includes reuse decision section

Also add end-to-end tests for:
- existing customer_orders job gets patched, not rebuilt
- existing tibco/dataout config family gets reused correctly
- existing curated load/enrich family stays stable

---

## Important constraints

- Do not regress env config discovery/reuse logic
- Do not regress output strategy logic
- Do not replace valid existing artifacts unnecessarily
- Do not auto-apply placeholder suggestions as final values
- Keep changes deterministic and testable

---

## Deliverables

Return:
1. files created
2. files modified
3. reuse decision rules
4. patch planning rules
5. tests added
6. `npm test` result
7. a sample before/after reuse decision summary

Do not stop after partial implementation.
