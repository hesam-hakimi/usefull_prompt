You are performing the bounded technical and evidence remediation required
before PR #7 may be marked Ready for Review.

Repository:
TD-Enterprise/kmai-td-genie

Pull request:
#7

Expected PR branch:
asktd_v2

This task may modify files, but must not:

- modify the user's existing dirty checkout;
- overwrite or discard local work;
- modify COPILOT_AGENT_EXECUTION_PROMPT.md;
- start Phase 1;
- add roadmap, chargeback, Databricks, ADLS, Event Hubs, Redis runtime,
  usage collector, durable outbox, LangSmith, Sentinel, Dynatrace, or
  unrelated functionality;
- change repository settings;
- mark the PR ready;
- approve or merge;
- push without explicit user approval;
- use npm audit fix --force;
- introduce secrets or API keys.

──────────────────────────────────────────────────────────────────────
1. REQUIRE AUTHENTICATED SOURCE OF TRUTH
──────────────────────────────────────────────────────────────────────

Before making any change:

1. Run read-only authentication checks:

   gh auth status
   git fetch --prune origin

2. Read the actual PR #7 metadata and determine:

- PR head branch;
- actual PR head SHA;
- base branch;
- actual base SHA;
- draft status;
- mergeability;
- behind status.

3. If GitHub authentication or fetch still fails:

STOP.

Return:

BLOCKED — authenticated GitHub source of truth is unavailable.

Do not modify any file.

4. Do not use a stale local origin/asktd_v2 ref as the source of truth.

──────────────────────────────────────────────────────────────────────
2. PROTECT THE EXISTING WORKTREE
──────────────────────────────────────────────────────────────────────

The user's existing checkout contains unrelated local work.

Do not stash, restore, reset, switch, clean, or overwrite it.

Create a clean isolated worktree outside the repository based on the actual
PR #7 head SHA.

Confirm:

- isolated worktree starts clean;
- validation and edits occur only there;
- the actual PR head SHA is recorded.

──────────────────────────────────────────────────────────────────────
3. VERIFY THE INTENDED GOLDEN BASELINE
──────────────────────────────────────────────────────────────────────

Inspect:

- current golden fixture;
- golden inventory;
- live golden runner;
- Phase 0 status/evidence documents;
- definition of done;
- final approval handoff;
- previous committed evidence.

Determine whether 26 is the intended current baseline.

Use evidence, not assumption.

If the current fixture intentionally contains 26 reviewed questions and a
fresh approved live run passes 26/26:

- update stale references from 25 to 26;
- do not remove a question merely to match stale documentation.

If one of the 26 questions is unapproved or accidental:

- do not silently delete it;
- report the discrepancy as BLOCKED and identify the required approver.

Do not retain transient live logs containing sensitive output in Git.

──────────────────────────────────────────────────────────────────────
4. CORRECT CURRENT ARCHITECTURE EVIDENCE
──────────────────────────────────────────────────────────────────────

Update the private current architecture documents to match verified code.

Required current facts:

- Vite produces static files under src/frontend/build.
- React static assets and FastAPI are packaged in one App Service artifact.
- FastAPI/Uvicorn serves the SPA and API.
- Browser/backend calls use same-origin HTTPS.
- JSON REST and POST /api/chat/stream SSE are both supported.
- Authentication is:
  Browser/MSAL → Entra → token returned to browser →
  Authorization: Bearer sent to FastAPI → FastAPI validates with Entra JWKS.
- Do not draw Entra directly sending group claims/JWT to FastAPI.
- Primary and fallback orchestrators are current in-process runtime logic.
- Azure OpenAI is called directly through current SDK/AutoGen configuration.
- Do not show an enterprise LLM Gateway as current.
- Validation is in-process application logic.
- Do not show a standalone validation service.
- Azure AI Search is conditional fallback metadata text search.
- Do not show current vector/hybrid retrieval.
- Azure SQL supports analytics plus current authorization/access-management,
  change-history, available-data, and diagnostic responsibilities.
- Redis is configured but unused.
- Databricks, ADLS, Event Hubs, usage collector, durable outbox, LangSmith,
  Sentinel, Dynatrace, and Datadog runtime monitoring are not current.

Inspect and update at minimum:

- docs/presentations/architecture/current/current_architecture.md
- docs/presentations/architecture/current/current_architecture.mmd

Search all Phase 0 evidence for contradictory current-architecture claims and
update only the evidence documents that actually contain stale claims.

Keep Markdown and Mermaid source consistent.

Validate Mermaid syntax where repository tooling permits.

──────────────────────────────────────────────────────────────────────
5. CORRECT PHASE 0 STATUS AND EVIDENCE
──────────────────────────────────────────────────────────────────────

Inspect and update as required:

- PHASE_0_DEFINITION_OF_DONE.md
- PHASE_0_FINAL_APPROVAL_HANDOFF.md
- PHASE_0_STATUS_AND_EVIDENCE.md
- PHASE_0_APPROVAL_OWNER_MANUAL_ACTION_CHECKLIST.md
- GOLDEN_BASELINE_INVENTORY.md
- PHASE_0_DATA_FLOW_DIAGRAM.md
- PHASE_0_THREAT_MODEL_DRAFT.md
- PHASE_0_ENVIRONMENT_MATRIX.md
- branch-protection/required-check guidance

Rules:

- do not state that repository settings are active without GitHub evidence;
- do not state that approvals exist unless recorded;
- do not state that checks are required without exact displayed names;
- do not state that the PR is ready or mergeable unless confirmed;
- distinguish:
  CURRENT,
  PARTIALLY IMPLEMENTED,
  CONFIGURED BUT UNUSED,
  PLANNED,
  MANUAL ACTION REQUIRED;
- do not present broad-Beta requirements as Phase 0 implementation;
- preserve Phase 0 technical scope;
- record the exact final test results only after validation on the actual PR
  head.

If rollback instructions are fragmented and no usable Phase 0 rollback
runbook exists, create:

PHASE_0_ROLLBACK_RUNBOOK.md

It must cover:

- pre-merge rollback;
- configuration rollback;
- application-version rollback;
- evidence rollback;
- post-merge revert;
- responsible role;
- validation after rollback;
- no secrets or private endpoint values.

──────────────────────────────────────────────────────────────────────
6. FIX DIFF WHITESPACE
──────────────────────────────────────────────────────────────────────

Fix the CODEOWNERS blank-line-at-EOF issue so:

git diff --check <base>...HEAD

passes.

Do not claim the feature-branch CODEOWNERS is effective for PR #7.

Add a clear note in governance evidence:

- base-branch CODEOWNERS is empty;
- current PR cannot receive enforced Code Owner review from the new rules;
- a separate CODEOWNERS bootstrap PR to the base branch is required before
  PR #7 formal review.

Do not modify main in this task.

──────────────────────────────────────────────────────────────────────
7. ANALYZE FRONTEND SECURITY FINDINGS
──────────────────────────────────────────────────────────────────────

Run:

npm audit --json
npm ls brace-expansion postcss

Determine for each vulnerability:

- exact package and version;
- dependency chain;
- direct or transitive;
- runtime or dev/build-only;
- exploitability in the deployed React static-build model;
- minimal non-breaking remediation;
- whether lock-file-only change is sufficient;
- whether a direct dependency update is required;
- whether a breaking update would be required.

Do not use:

npm audit fix --force

If a safe non-breaking patch is available:

- apply only the minimal dependency/lock-file change;
- run frontend test, lint, build, and audit again.

If no safe non-breaking fix exists:

- do not force a major update;
- add a documented security disposition section to the Phase 0 approval
  evidence;
- mark Security/Platform acceptance as still required;
- keep the release gate blocked.

Do not claim vulnerabilities are accepted without written approval.

──────────────────────────────────────────────────────────────────────
8. model_used: not_observed
──────────────────────────────────────────────────────────────────────

Update the Phase 0 handoff/checklist to state:

- this is currently an observability/metering limitation;
- no evidence shows impact on authentication, authorization, SQL safety, or
  answer correctness;
- the recommended disposition is non-blocking only after written acceptance
  from Architecture/Engineering, QA, and Data;
- an issue/ticket, owner, and target phase/date are still required.

Do not fabricate the issue, owner, date, or approval.

──────────────────────────────────────────────────────────────────────
9. FINAL VALIDATION ON ACTUAL PR HEAD
──────────────────────────────────────────────────────────────────────

After all repository-controlled fixes, run the canonical validation against
the actual PR #7 head plus the proposed working-tree changes:

- backend full suite and coverage;
- skipped-test reason probe;
- offline golden baseline;
- approved live golden baseline;
- chart-renderer regression;
- dependency alignment;
- frontend npm ci;
- frontend npm audit;
- frontend tests;
- frontend lint;
- frontend production build;
- repository-defined security/policy scans;
- secret-pattern scan;
- git diff --check.

For each command report:

- exact command;
- exit code;
- duration;
- passed/failed/skipped;
- warnings;
- coverage;
- artifact/evidence location.

Do not commit sensitive live-run output.

──────────────────────────────────────────────────────────────────────
10. STOP BEFORE COMMIT OR PUSH
──────────────────────────────────────────────────────────────────────

Do not commit, push, open a PR, mark Ready for Review, or merge.

Return one Markdown report with:

# Phase 0 Repository-Controlled Remediation Result

## Actual PR identity
## Files changed
## Architecture corrections
## Evidence corrections
## Golden-baseline decision
## CODEOWNERS status
## npm audit findings and disposition
## model_used disposition
## Validation results
## Remaining repository blockers
## Remaining administrator actions
## Remaining stakeholder approvals
## Safe to commit: YES/NO
## Safe to push to PR #7: YES/NO
## Safe to mark Ready for Review: YES/NO
## Safe to merge: YES/NO

End with an exact list of every changed file.
