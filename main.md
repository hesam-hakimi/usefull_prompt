You are the independent final auditor for formal Phase 0 closure of the private askAlpha / AskTD application.

Repository:
TD-Enterprise/kmai-td-genie

Pull request:
#7

Expected feature branch:
asktd_v2

Purpose:
Determine whether Phase 0 is:

1. technically complete;
2. ready for formal closure;
3. formally closed;
4. safe to mark Ready for Review;
5. safe to merge.

This is a READ-ONLY audit.

Do not implement, repair, refactor, update documentation, modify configuration, commit, push, merge, change the PR, mark the PR ready, change repository settings, create issues, or start Phase 1.

Do not expose credentials, tokens, secrets, connection strings, private URLs, customer data, SQL result rows, or sensitive claims.

Use the actual private repository, GitHub PR, workflows, checks, configuration, and code as the source of truth.

Do not rely on an outdated local branch.

──────────────────────────────────────────────────────────────────────
A. SAFE AUDIT SETUP
──────────────────────────────────────────────────────────────────────

1. Confirm:

- repository root;
- origin remote without exposing credentials;
- current local branch;
- local HEAD SHA;
- local working-tree status;
- upstream branch;
- whether the current checkout has local edits;
- whether the local ref is ahead of or behind the remote branch.

2. Fetch current remote references without modifying tracked files:

- fetch origin;
- determine the actual head SHA of PR #7;
- determine the actual base branch and base SHA;
- determine whether PR #7 is open, draft, mergeable, behind the base, or blocked.

Use GitHub/gh read-only commands where available.

3. Do not overwrite, stash, restore, switch, reset, or clean the user's current working tree.

If the current checkout is not clean or is not exactly at the PR head SHA, use an isolated temporary detached worktree outside the repository for validation.

The temporary worktree may be created only for this audit and must be removed after the audit.

Do not modify the user's existing checkout.

4. State clearly:

- PR head branch;
- PR head SHA;
- base branch;
- base SHA;
- whether all validation was performed on the actual PR head.

If validation was not performed on the actual PR head, mark the corresponding gate BLOCKED.

──────────────────────────────────────────────────────────────────────
B. VERIFIED CURRENT ARCHITECTURE BASELINE
──────────────────────────────────────────────────────────────────────

The previous read-only code audit reported the following current-state facts.

Verify every item again against the actual PR head. Do not blindly accept them.

1. React/Vite produces production static assets under:

src/frontend/build

2. React static assets and FastAPI are packaged into one Azure App Service artifact.

3. FastAPI/Uvicorn serves:

- the React SPA;
- static assets;
- JSON REST API routes;
- SSE through POST /api/chat/stream where supported.

4. Browser-to-backend communication uses same-origin HTTPS.

5. Authentication flow is:

Browser React/MSAL
→ Microsoft Entra ID login/token acquisition
→ browser receives token
→ browser sends Authorization: Bearer <token> to FastAPI
→ FastAPI validates the token using Entra JWKS
→ issuer, audience, scope, group-overage, and stable-user-ID checks
→ UserAuthContext

6. Microsoft Entra ID does not directly send JWT/group claims to FastAPI without the browser/MSAL step.

7. The primary orchestrator and fallback orchestrator are in the live request path.

8. Runtime agents are route-dependent.

9. Azure OpenAI is called directly through the Azure OpenAI SDK and/or AutoGen configuration using the configured Azure OpenAI endpoint.

10. No enterprise LLM Gateway is present in the live current code path unless new evidence proves otherwise.

11. Validation before model execution is in-process FastAPI/application logic, including relevant request, authentication, configuration, prompt-data, policy, and input validation.

12. There is no separately deployed current validation microservice or gateway unless new evidence proves otherwise.

13. SQL safety validation occurs before database execution on generated-SQL paths.

14. Azure SQL currently supports more than analytical data access. Verify whether it also supports:

- authorization/access-management tables;
- access-change history;
- diagnostics;
- client-auth diagnostics;
- available-data paths.

15. Azure AI Search is a conditional fallback/generated-SQL metadata-grounding path.

16. Current Azure AI Search behavior is metadata text search unless code proves vector or hybrid retrieval.

17. A user-assigned Managed Identity is configured for approved Azure service access.

18. JSON/debug diagnostics may include redacted traces, debug panels, executed-query information, SQL diagnostics, runtime diagnostics, and log-tail information when enabled.

19. Redis is configured or reserved, but no live Redis client/runtime cache is currently wired unless new evidence proves otherwise.

20. Current audit status must be reverified:

- durable user-query audit: expected absent;
- full data-read audit: expected absent or partial;
- authorization decision logging: expected partial/current;
- access-management change log: expected current;
- export audit: expected absent.

21. The following are not current runtime components unless new code/config evidence proves otherwise:

- Databricks SQL Warehouse;
- ADLS as the current governed analytical source or audit store;
- Azure Event Hubs;
- usage collector;
- durable outbox;
- LangSmith;
- Azure Sentinel integration;
- Dynatrace integration;
- Datadog application-runtime monitoring.

22. A generic deployment-workflow option for Datadog does not by itself prove application-runtime Datadog integration.

For every architecture fact, report:

| Component or flow | Status | Current role | Code/config evidence | Confidence |

Use only these statuses:

- CURRENT
- PARTIALLY IMPLEMENTED
- CONFIGURED BUT UNUSED
- PLANNED
- ABSENT
- UNCONFIRMED

──────────────────────────────────────────────────────────────────────
C. CURRENT RUNTIME SEQUENCE
──────────────────────────────────────────────────────────────────────

Reconstruct the exact current runtime sequence from build to response.

Cover at least:

1. frontend install/test/build;
2. Vite build output;
3. application packaging;
4. App Service startup;
5. FastAPI/Uvicorn startup;
6. SPA/static-asset serving;
7. /api/config;
8. MSAL initialization;
9. Entra login/token acquisition;
10. protected browser API request;
11. bearer-token extraction;
12. JWT/JWKS validation;
13. effective authorization resolution;
14. POST /api/chat;
15. POST /api/chat/stream and SSE fallback behavior;
16. construction of Azure SQL, Azure AI Search, Azure OpenAI, orchestrator, and agent dependencies;
17. primary deterministic route;
18. fallback/generated-SQL route;
19. metadata retrieval;
20. model call;
21. SQL safety/authorization validation;
22. Azure SQL execution;
23. result rendering;
24. JSON serialization;
25. optional debug/diagnostic response;
26. SSE phase events and final response.

For each step include relevant files and functions.

Do not include target-state components.

──────────────────────────────────────────────────────────────────────
D. PRIVATE PHASE 0 EVIDENCE ALIGNMENT
──────────────────────────────────────────────────────────────────────

Locate and audit all Phase 0 evidence files, including the following where present:

- PHASE_0_THREAT_MODEL_DRAFT.md
- PHASE_0_DATA_FLOW_DIAGRAM.md
- PHASE_0_ENVIRONMENT_MATRIX.md
- PHASE_0_DEFINITION_OF_DONE.md
- PHASE_0_FINAL_APPROVAL_HANDOFF.md
- branch-protection documentation
- required-check documentation
- golden-baseline evidence
- Managed Identity / Azure OpenAI compatibility rationale
- rollback instructions
- any Phase 0 approval checklist or evidence index

For each document report:

| Document | Exact path | In PR #7 | Accurate against current code | Missing/incorrect claims | Gate status |

Check specifically for the following documentation errors:

1. React shown as a separately hosted service, Static Web App, CDN, or second App Service without evidence.

2. React shown as a server-side runtime inside App Service rather than packaged static build output served by FastAPI.

3. Authentication arrow incorrectly shown as:

Entra → FastAPI with JWT/group claims

without showing the browser/MSAL token acquisition and bearer-token submission.

4. Frontend/backend communication shown as REST only while omitting SSE.

5. Enterprise LLM Gateway shown as current.

6. Validation shown as a standalone deployed service.

7. Azure AI Search shown as:

- primary analytical engine;
- always invoked;
- vector/hybrid retrieval without code evidence.

8. Azure SQL described too narrowly as application data only.

9. Redis shown as a live runtime cache.

10. Databricks, ADLS, Event Hubs, usage collector, durable outbox, LangSmith, Sentinel, Dynatrace, or Datadog shown as current runtime components.

11. Full user-query, data-read, or export audit shown as implemented.

12. Planned or target architecture represented as current.

Any factual mismatch in a formal Phase 0 evidence document must be marked:

MANUAL CORRECTION REQUIRED BEFORE FORMAL CLOSURE

Do not modify the document during this audit.

──────────────────────────────────────────────────────────────────────
E. PR SCOPE AND REPOSITORY CLEANLINESS
──────────────────────────────────────────────────────────────────────

Audit PR #7 scope.

Report:

- actual changed-file count;
- additions/deletions where available;
- all changed files grouped into:
  - production code;
  - frontend;
  - tests;
  - configuration/dependency;
  - Phase 0 evidence/governance;
  - workflow/repository controls;
  - unexpected or unrelated.

Confirm whether:

COPILOT_AGENT_EXECUTION_PROMPT.md

is excluded from PR #7.

Flag:

- unrelated askAlpha roadmap work;
- chargeback work;
- Phase 1 implementation;
- unrelated prompt changes;
- refactoring not required by Phase 0;
- generated files or artifacts that should not be committed;
- secrets or sensitive values.

Run:

git diff --check

against the actual PR head/base diff.

Report staged, unstaged, and untracked files in the isolated validation checkout.

──────────────────────────────────────────────────────────────────────
F. CODEOWNERS
──────────────────────────────────────────────────────────────────────

Verify the effective CODEOWNERS state from the PR base branch.

Report:

- whether CODEOWNERS exists;
- exact path;
- whether GitHub will use it for PR #7;
- whether it exists on the base branch;
- whether the file is syntactically valid;
- whether referenced users/teams can be verified;
- coverage for:
  - backend;
  - frontend;
  - tests;
  - authentication;
  - authorization;
  - SQL safety;
  - workflows;
  - deployment;
  - Phase 0 evidence;
  - CODEOWNERS itself;
  - .github directory.

If CODEOWNERS exists only on the feature branch and not the base branch, state that it cannot enforce Code Owner review for the current PR until merged into the base.

──────────────────────────────────────────────────────────────────────
G. BRANCH RULESET / PROTECTION
──────────────────────────────────────────────────────────────────────

Using read-only GitHub API or gh commands, inspect the effective rules for the PR base branch.

Verify whether the following are enforced:

- require pull request before merge;
- required number of approvals;
- require Code Owner review;
- dismiss stale approvals after new commits;
- require conversation resolution;
- require required status checks;
- require branch to be up to date where compatible;
- prevent direct pushes;
- prevent force pushes;
- prevent branch deletion;
- restrict bypass actors;
- signed commits, only if enterprise policy requires them;
- merge queue/merge_group support, only if applicable.

Report:

| Rule | Effective status | Evidence | Blocking issue |

If repository permissions do not allow reading these settings, mark:

MANUAL ACTION REQUIRED

and list the exact screenshots or administrator evidence required.

A documented intention to configure rules is not equivalent to an active rule.

──────────────────────────────────────────────────────────────────────
H. EXACT REQUIRED CHECKS
──────────────────────────────────────────────────────────────────────

Do not infer required-check names only from workflow filenames.

Use PR #7 statusCheckRollup, Checks UI data, workflow runs, and job names to identify the exact displayed check names on the actual PR head SHA.

Report:

| Exact displayed check name | Workflow | Job | Source GitHub App | Status | Head SHA | Required by rule |

Inspect reusable workflows carefully. The displayed check may combine caller and reusable job names.

Candidate workflow names previously observed include:

- call-edp-gt-open-pr-workflow
- call-edp-gt-snapshot-workflow
- call-edp-gt-snapshot-cd-workflow
- call-edp-gt-release-artifact-workflow
- call-edp-gt-release-workflow
- call-update-workflows
- call-ct-workflow
- reusable-aacdf-orchestrator-workflow

Do not assume all are required.

Check for:

- skipped checks caused by path filters;
- duplicate check names from different GitHub Apps;
- checks run against an old SHA;
- checks that never report;
- reusable-job failures hidden behind caller status;
- stale successful runs;
- checks required by rules but absent from the current PR.

──────────────────────────────────────────────────────────────────────
I. FINAL AUTOMATED VALIDATION
──────────────────────────────────────────────────────────────────────

Discover canonical commands from repository documentation, workflow files, pyproject.toml, package.json, scripts, and existing Phase 0 evidence.

Run all safe, non-destructive validation against the actual PR head.

Expected previously reported baseline:

- Backend: 652 passed, 3 skipped
- Backend coverage: 85.52%
- Backend warnings: previously 8
- Offline golden baseline: 10 passed
- Live golden baseline: 25 passed, 0 failed, 0 blocked, 0 skipped
- Frontend: 29 files, 154 tests passed
- Frontend lint: passed
- Frontend build: passed
- Initial JavaScript gzip: 70.08 KB
- git diff --check: passed
- requirements.txt and pyproject.toml aligned at:
  openai>=1.99.3,<3

Do not force the results to match these values. Report actual results.

For every command record:

| Validation | Exact command | Exit code | Duration | Passed | Failed | Skipped | Warnings | Coverage | Result |

Run, where safely available:

- backend unit/integration tests;
- backend coverage;
- offline golden baseline;
- frontend tests;
- frontend lint;
- frontend build;
- dependency alignment check;
- repository-defined policy/security checks;
- git diff --check;
- secret/dependency/static scans if part of the normal repository workflow.

Live golden baseline:

- run only if it is an already-approved, non-destructive operation;
- do not create credentials;
- do not alter cloud resources;
- preserve Managed Identity;
- do not use API keys or secrets;
- verify that evidence is tied to the current PR head SHA.

If live execution is unavailable, determine whether existing evidence is tied to the exact final SHA. Otherwise mark it MANUAL ACTION REQUIRED or BLOCKED.

If a validation command mutates tracked source files, stop and report the mutation.

──────────────────────────────────────────────────────────────────────
J. SKIPS AND WARNINGS
──────────────────────────────────────────────────────────────────────

List every skipped test and warning individually.

Classify each as:

- intentional and documented;
- environment-dependent;
- deprecation;
- security concern;
- functional concern;
- flaky;
- unknown.

For each, state:

- source;
- reason;
- Phase 0 blocking status;
- required disposition.

Do not suppress or repair them.

──────────────────────────────────────────────────────────────────────
K. PRODUCTION DEFECT
──────────────────────────────────────────────────────────────────────

Verify the chart-renderer defect fix:

- identify the exact production file;
- verify title=None is not passed into Altair .properties() for untitled charts;
- identify regression tests;
- confirm backward compatibility;
- verify the fix exists on the actual PR head.

Mark PASS only with code and test evidence.

──────────────────────────────────────────────────────────────────────
L. SECURITY AND IDENTITY BOUNDARY
──────────────────────────────────────────────────────────────────────

Verify:

- hosted environments reject unsafe mock authentication;
- JWT issuer, audience, scope, signature/JWKS, group overage, and stable-user-ID checks exist;
- protected routes cannot be accessed anonymously;
- client-supplied group/user identity is not trusted;
- Managed Identity is preserved for Azure service access where configured;
- no new API keys, secrets, or unsupported credentials were introduced;
- no unsupported custom app-to-app API authentication was introduced;
- generated SQL remains read-only and policy/authorization validated;
- errors and diagnostics are redacted;
- current audit gaps are described accurately;
- no Phase 1 capability is falsely represented as a Phase 0 implementation.

Do not treat absent future capabilities such as complete user/data/export audit, Redis caching, Databricks, Event Hubs, durable outbox, or usage metering as automatic Phase 0 blockers unless:

- Phase 0 approved requirements explicitly require them; or
- their absence creates a current security/correctness defect.

──────────────────────────────────────────────────────────────────────
M. model_used: not_observed
──────────────────────────────────────────────────────────────────────

Search for every relevant occurrence of:

model_used
not_observed
model_used: not_observed

Report:

- exact location;
- runtime/test/evidence path;
- reason;
- whether it affects:
  - authentication;
  - authorization;
  - SQL safety;
  - answer correctness;
  - only observability/metering;
- whether an issue/ticket exists;
- owner;
- target phase/date;
- approval of non-blocking disposition.

Recommend one:

A. PHASE 0 BLOCKER
B. ACCEPTED NON-BLOCKING FOLLOW-UP
C. NOT APPLICABLE

Do not silently choose B without supporting evidence.

──────────────────────────────────────────────────────────────────────
N. APPROVALS AND REVIEW STATE
──────────────────────────────────────────────────────────────────────

Inspect PR reviews, comments, linked tickets, and approval evidence.

Report whether formal approval is recorded for:

- Product;
- Security;
- Architecture / Engineering;
- Data;
- QA;
- Platform / DevOps;
- Operations.

For each report:

| Approval area | Approver/team | Evidence | Date | Decision | Current/stale |

Valid decisions:

- APPROVED
- APPROVED WITH NON-BLOCKING FOLLOW-UP
- NOT APPROVED
- NOT FOUND
- STALE AFTER NEW COMMIT

Do not infer approval from meeting attendance or informal discussion.

Also report:

- PR draft status;
- unresolved conversations;
- requested changes;
- stale approvals;
- review decision;
- merge state;
- whether the branch is behind the base;
- whether the PR can currently merge.

──────────────────────────────────────────────────────────────────────
O. PHASE 0 VERSUS BETA REQUIREMENTS
──────────────────────────────────────────────────────────────────────

Do not automatically reopen technically completed Phase 0 because the following broader requirements remain planned:

- complete user-query/data-access/export audit;
- automated unseen-question evaluation;
- scope-aware production cache;
- Databricks/ADLS integration;
- Event Hubs;
- model usage collector;
- durable outbox;
- enterprise monitoring integrations;
- formal showback/chargeback;
- advanced visualization sandbox hardening.

Classify each finding as one of:

- CURRENT PHASE 0 DEFECT
- PHASE 0 EVIDENCE CORRECTION
- FORMAL PHASE 0 GOVERNANCE ACTION
- BROAD BETA REQUIREMENT
- PRODUCTION REQUIREMENT
- NON-BLOCKING FOLLOW-UP

Explain the classification.

──────────────────────────────────────────────────────────────────────
P. FINAL REPORT
──────────────────────────────────────────────────────────────────────

Return one complete Markdown report in the chat.

Do not write it into the repository.

If the UI truncates the report, you may additionally save a copy only to a temporary path outside the repository and report that path. Do not add it to Git.

Use this exact structure:

# Phase 0 Formal Closure Audit

## 1. Executive conclusion

Use exactly one conclusion:

- FORMALLY CLOSED
- READY FOR FORMAL CLOSURE
- TECHNICALLY COMPLETE, MANUAL CLOSURE PENDING
- NOT READY FOR CLOSURE

## 2. Repository and PR identity
## 3. Actual PR head and validation environment
## 4. Verified current architecture
## 5. Exact runtime sequence
## 6. Phase 0 evidence alignment
## 7. PR scope and cleanliness
## 8. CODEOWNERS
## 9. Branch ruleset/protection
## 10. Exact required checks
## 11. Automated validation results
## 12. Skips and warnings
## 13. Production defect verification
## 14. Security and identity validation
## 15. model_used disposition
## 16. Approval and review state
## 17. Phase 0 blockers
## 18. Manual closure actions
## 19. Broad Beta requirements
## 20. Production requirements
## 21. Evidence/screenshots required from repository administrator
## 22. Final recommendation

For every gate use exactly one status:

- PASS
- MANUAL ACTION REQUIRED
- BLOCKED
- NOT APPLICABLE

End the report with this exact checklist:

- Actual PR head SHA:
- Actual base SHA:
- Validation ran on actual PR head: YES/NO
- Working tree clean in validation environment: YES/NO
- Actual PR changed-file count:
- Unrelated files in PR: YES/NO
- Private Phase 0 evidence accurate: YES/NO
- CODEOWNERS effective from base branch: YES/NO/UNCONFIRMED
- Branch rules actively enforced: YES/NO/UNCONFIRMED
- Exact required checks identified: YES/NO
- All required checks green on final SHA: YES/NO
- Automated validation complete: YES/NO
- Blocking skips or warnings: YES/NO
- Formal functional approvals complete: YES/NO
- PR conversations resolved: YES/NO
- PR is still draft: YES/NO
- PR merged: YES/NO
- Phase 0 technically complete: YES/NO
- Phase 0 formally closed: YES/NO
- Safe to mark Ready for Review now: YES/NO
- Safe to merge now: YES/NO

Important decision rule:

Phase 0 cannot be reported as FORMALLY CLOSED unless all of the following are true:

1. private Phase 0 evidence matches the verified current implementation;
2. final validation passed on the actual PR head SHA;
3. active repository controls are evidenced;
4. exact required checks are enforced and green;
5. required reviews and functional approvals are recorded;
6. review conversations are resolved;
7. PR #7 has been merged;
8. post-merge validation has passed or its required evidence is recorded.

Do not claim formal closure based only on technical test success.
