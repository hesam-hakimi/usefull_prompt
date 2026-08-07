Fix ONLY the remaining Artifact Reuse intent-routing regression.

Repository:
etl_framework_extension

Branch:
feature/v3-agentic-redesign

This is a narrowly scoped:
INVESTIGATE → IMPLEMENT → TEST → VERIFY task.

Current verified Electron baseline:

136 total
130 passed
4 failed
2 pending

The following work is already complete and MUST NOT be modified:

- Workspace visibility fix
- Run Diagnosis regression closure
- STTM / ExcelJS fixes
- workflow lifecycle/control-plane fixes

The Run Diagnosis group is VERIFIED and must remain untouched.

==================================================
TARGET FAILURE
==================================================

Address ONLY the Artifact Reuse intent-router failure.

Known failing test:

artifactReuseConversation.test.ts
`detectIntent does not treat canonical ABFSS create prompt as artifact reuse`

Observed:
actual intent = show_readiness

Expected:
intent = none

Previous investigation found that the canonical create prompt contains ordinary
data/filter language such as:

    status = 'passed'

and ArtifactReuseIntentRouter currently matches the bare keyword `status`,
causing a normal ETL CREATE request to be incorrectly classified as artifact
reuse/readiness.

This is suspected to be over-broad intent matching.

==================================================
GOAL
==================================================

A normal ETL create/onboarding request must NOT become an artifact-reuse or
readiness request merely because it contains generic domain words such as:

- status
- passed
- failed
- config
- job
- file
- table

Artifact reuse/readiness should be selected only when there is positive,
contextual evidence that the user is actually asking about an existing,
previously generated, managed, reusable, stale, drifted, or reusable artifact.

==================================================
REQUIRED INVESTIGATION
==================================================

Before editing:

1. Reproduce the single failing Artifact Reuse test.

2. Inspect the complete intent-detection contract and precedence around:
   - normal ETL CREATE
   - artifact reuse
   - readiness
   - existing/generated artifact inspection
   - stale/drift detection

3. Inspect:
   - ArtifactReuseIntentRouter
   - the failing conversation test
   - canonical create prompts/corpus used by the test
   - surrounding intent/router tests
   - git history if needed to understand intended behavior

4. Determine whether the failure is:
   PRODUCT_DEFECT
   STALE_TEST
   FIXTURE_DEFECT
   or CONTRACT_AMBIGUITY.

Do not assume PRODUCT_DEFECT until evidence supports it.

==================================================
IMPLEMENTATION RULE
==================================================

If this is the suspected product defect:

Replace over-broad bare-keyword matching with contextual intent detection.

Do NOT merely special-case the word `status`.

Do NOT special-case the exact failing prompt.

Do NOT special-case ABFSS, CD Renewal, a specific workspace, table, or job.

Positive reuse/readiness intent should require meaningful evidence such as
explicit user intent around concepts like:

- reuse/reuse existing
- existing artifact
- previously generated
- generated before
- managed artifact
- stale
- drift
- readiness
- refresh/regenerate
- compare existing
- inspect existing
- update existing

Use the repository's existing intent architecture and precedence rather than
inventing an unrelated classifier.

A normal CREATE request remains CREATE even if its SQL/STTM/config content
contains domain words that overlap with reuse vocabulary.

==================================================
NEGATIVE REGRESSION CASES REQUIRED
==================================================

Add/confirm tests proving that ordinary create requests containing phrases like:

- status = 'passed'
- failed status
- job status
- table status
- status column
- passed records
- config status

do NOT become artifact reuse/readiness requests.

==================================================
POSITIVE REGRESSION CASES REQUIRED
==================================================

Also prove that genuine reuse/readiness requests still route correctly, for
example semantically equivalent cases such as:

- reuse the existing generated ETL artifacts
- inspect whether the previously generated job is still reusable
- check whether the managed artifacts are stale
- show readiness for the existing artifact
- regenerate only if the existing artifact has drifted

Use existing canonical wording where available.

==================================================
SCOPE GUARDRAILS
==================================================

Do NOT modify:

- Run Diagnosis code/tests
- runTests.ts workspace visibility fix
- STTM parser
- ExcelJS logic
- `.github/**`
- `AGENTS.md`
- `workflow/**`
- Config Explain behavior
- Copilot workflow command routing
- activationEvents/chatParticipants
- consumer ETL workspaces

Do not package or install the VSIX.

This is source/test correction only.

==================================================
VALIDATION
==================================================

Run:

1. focused ArtifactReuseIntentRouter unit tests
2. artifactReuseConversation integration tests
3. relevant intent-routing regression suite
4. normal full Electron `npm run test`
5. fresh independent Verifier

Report exact before/after counts.

Expected full Electron target if no unrelated transient failure occurs:

136 total
131 passed
3 failed
2 pending

Do not modify the other three existing failure groups merely to reach that
number.

==================================================
ACCEPTANCE CRITERIA
==================================================

PASS only if:

1. The canonical normal CREATE prompt is no longer routed to show_readiness.
2. Generic words such as `status` cannot independently trigger artifact reuse.
3. Genuine artifact-reuse/readiness requests still work.
4. No broad weakening of intent detection occurred.
5. No request-specific hard-code was introduced.
6. Focused tests pass.
7. Full Electron test executes.
8. Other existing failure groups remain untouched.
9. Fresh Verifier returns VERIFIED.

==================================================
FINAL REPORT
==================================================

## Artifact Reuse Intent Regression Closure

### Baseline
### Reproduction
### Root Cause
### Classification
PRODUCT_DEFECT / STALE_TEST / FIXTURE_DEFECT / CONTRACT_AMBIGUITY

### Canonical Intent Contract
Explain positive and negative routing criteria.

### Files Changed
### Negative Regression Tests
### Positive Regression Tests
### Focused Test Results
### Full Electron Result
### Remaining Existing Failure Groups
### Verifier Result
### Out-of-Scope Files Changed

Do not package/install.
Stop after source-level verification.
