# Implement Conversation UX / Orchestration Layer for ETL Artifact Reuse

## Goal
Build the next layer after:
- Artifact Discovery
- Artifact Scoring
- Artifact Advisor
- Patch Planning
- Review / Apply Action Layer

This layer must turn the internal decision engine into a clean Copilot Chat workflow.

The user should be able to interact naturally in chat, and the system should guide them through:
1. discovery
2. recommendation
3. review
4. confirmation
5. apply
6. validate
7. continue

---

## What this layer must solve

Right now the core machinery exists, but the UX is still too low-level.

We need a conversation orchestration layer that:
- recognizes reuse-related requests from chat
- surfaces decision summaries in a user-friendly structure
- supports explicit user follow-up actions
- keeps multi-turn session continuity
- prevents accidental apply without confirmation
- resumes ETL generation after reuse/apply succeeds

---

## New files to create

### `src/chat/ArtifactReuseIntentRouter.ts`
Detect these user intents from chat:
- discover existing artifacts
- recommend reuse
- preview patch
- apply patch
- preview create
- apply create
- keep existing only
- request manual review
- show readiness
- continue generation

### `src/chat/ArtifactReuseConversationCoordinator.ts`
Responsibilities:
- orchestrate the full multi-turn flow
- read/write session state
- decide next allowed action
- route to preview/apply/review/generation
- block invalid transitions

### `src/chat/ArtifactReuseResponseBuilder.ts`
Responsibilities:
- build compact, user-friendly markdown responses
- provide structured sections for:
  - recommendation
  - review
  - available actions
  - apply result
  - validation result
  - next step

### `src/test/suite/artifactReuseConversation.test.ts`
Conversation-level tests for multi-turn UX and state transitions.

---

## Existing files to modify

Update:
- `src/chat/ETLChatParticipant.ts`
- `src/core/session/SessionState.ts`
- `src/core/session/CreateJobSessionService.ts`
- `src/core/session/CreateJobResponse.ts`
- `src/index.ts`
- `src/test/suite/extension.test.ts`

---

## Session state additions

Add fields to session state for:
- `artifactReuseDecision`
- `artifactReviewPreview`
- `lastArtifactAction`
- `lastApplyResult`
- `postApplyValidation`
- `awaitingUserConfirmation`
- `allowedNextActions`
- `resumeGenerationAfterApply`

The system must survive multi-turn conversation without losing context.

---

## Conversation states

Implement these states:

- `idle`
- `reuse_discovered`
- `review_presented`
- `awaiting_confirmation`
- `preview_rendered`
- `apply_in_progress`
- `apply_succeeded`
- `apply_failed`
- `manual_review_required`
- `ready_to_continue_generation`

---

## Supported user utterances

The router should understand natural prompts like:

- "can we reuse existing artifacts?"
- "find a matching env config and job config"
- "show me what would change"
- "preview the patch"
- "apply the patch"
- "create new files instead"
- "keep the existing files"
- "show why this is blocked"
- "continue with generation"
- "what do you recommend?"
- "show readiness"

Do not require exact command syntax.

---

## Chat response structure

### Recommendation response
Use a format like:

## Recommendation
- mode: patch_existing_artifacts
- confidence: high
- matched artifact family: ...
- why this was selected: ...

## Files
- reuse: ...
- patch: ...
- create: ...

## Available actions
- preview patch
- apply patch
- create new instead
- keep existing only
- manual review

---

### Preview response
Use a format like:

## Patch Preview
- target files: ...
- safe auto-apply: yes/no
- affected sections: ...

## Before / After
(show short snippets)

## Available actions
- apply patch
- create new instead
- manual review

---

### Apply result response
Use a format like:

## Apply Result
- mode: patch_confirmed
- files touched: ...
- backups created: yes/no

## Validation After Apply
- syntax: pass/fail
- references: pass/fail
- strategy coherence: pass/fail
- runtime readiness: pass/fail

## Next step
- continue generation
or
- manual review required

---

## UX rules

- Never auto-apply just because a good match exists
- Always require explicit user confirmation before apply
- Always show available next actions
- Always show blocked reason when action is disallowed
- Always rerun validation after apply
- If apply succeeds, offer to continue generation immediately
- If apply fails, preserve session state and explain recovery options

---

## Allowed action transitions

Examples:

- `reuse_discovered` -> `review_presented`
- `review_presented` -> `awaiting_confirmation`
- `awaiting_confirmation` -> `preview_rendered`
- `preview_rendered` -> `apply_in_progress`
- `apply_in_progress` -> `apply_succeeded` or `apply_failed`
- `apply_succeeded` -> `ready_to_continue_generation`

Disallow invalid jumps such as:
- applying before preview/review when patch mode requires preview
- continuing generation when apply failed
- continuing generation when manual review is still required

---

## Continue-generation integration

After successful reuse/apply:
- the system must continue with the normal ETL generation flow
- reused/patched artifacts become the active source of truth
- chat should say clearly whether generation is:
  - reusing existing files
  - patching existing files
  - creating new files

The final response should include:
- selected env config mode
- artifact reuse mode
- readiness status
- generated/updated files

---

## Tests to add

Add tests for:
1. natural-language prompt triggers reuse discovery
2. recommendation is shown with allowed actions
3. preview patch updates session state
4. apply patch requires confirmation
5. apply create requires confirmation
6. manual review blocks continue-generation
7. successful apply unlocks continue-generation
8. failed apply keeps session recoverable
9. session state survives multi-turn flow
10. end-to-end conversation path from "reuse artifacts" to "continue generation"

---

## Deliverables

Return:
1. files created
2. files modified
3. conversation states added
4. supported user utterances
5. example recommendation response
6. example preview response
7. example apply result response
8. `npm test` result

Do not stop at planning. Implement the conversation UX layer and run tests.
