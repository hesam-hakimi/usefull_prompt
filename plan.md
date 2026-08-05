You are starting Phase 1 development for the private askAlpha / AskTD application while Phase 0 formal closure continues in parallel.

Repository:
TD-Enterprise/kmai-td-genie

Current Phase 0 pull request:
PR #7

Current Phase 0 branch:
asktd_v2

Important context:

- Phase 0 implementation is technically healthy.
- PR #7 remains Draft and is still pending:
  - dependency-security remediation;
  - CODEOWNERS/base-branch governance;
  - repository rules and required checks;
  - stakeholder approvals;
  - merge and post-merge validation.
- Phase 1 development may proceed in parallel.
- Phase 1 may be deployed from its own branch to an approved Development environment.
- Phase 1 must not be promoted to Beta or Production until required approvals are complete.
- Phase 1 work must not modify, reopen, or contaminate Phase 0 evidence.

This task authorizes only a bounded Phase 1 foundation slice. It does not authorize implementation of the entire roadmap.

──────────────────────────────────────────────────────────────────────
1. SOURCE OF TRUTH AND SAFE SETUP
──────────────────────────────────────────────────────────────────────

1. Confirm authenticated GitHub access:

   gh auth status
   git fetch --prune origin

2. Read the actual current state of:

   - PR #7;
   - branch asktd_v2;
   - latest main;
   - open CODEOWNERS bootstrap PR;
   - frontend dependency-remediation work, if already created.

3. Protect the user’s existing checkout.

Do not:

- stash;
- reset;
- clean;
- overwrite;
- switch the user’s dirty working tree;
- delete local files.

Use an isolated worktree outside the current checkout.

4. Use the current authenticated PR #7 head as the temporary Phase 1 base unless repository evidence shows a more appropriate approved base.

5. Create a new branch:

   phase1/foundation-contracts

6. Record:

- repository;
- base branch;
- base SHA;
- Phase 1 branch;
- relationship to PR #7;
- whether the branch is stacked on PR #7.

──────────────────────────────────────────────────────────────────────
2. PHASE 0 FREEZE BOUNDARY
──────────────────────────────────────────────────────────────────────

Do not modify:

- PR #7;
- PR #9;
- CODEOWNERS;
- Phase 0 evidence documents;
- Phase 0 architecture files;
- branch-protection documentation;
- GitHub workflows;
- dependency-security files;
- COPILOT_AGENT_EXECUTION_PROMPT.md;
- authentication behavior;
- Managed Identity behavior;
- deployment ownership or repository settings.

Do not:

- change Phase 0 baselines;
- alter golden evidence to make tests pass;
- mix Phase 1 changes into Phase 0 commits;
- remove current deterministic or fallback runtime paths;
- introduce secrets or API keys;
- perform destructive database migrations;
- deploy to Beta or Production;
- merge Phase 1 into main.

──────────────────────────────────────────────────────────────────────
3. DISCOVER THE CONTROLLING PHASE 1 SCOPE
──────────────────────────────────────────────────────────────────────

Read the private repository plans, architecture, backlog, ADRs, and current code.

Determine the exact approved Phase 1 objective.

Based on the current project reference, Phase 1 is expected to focus on IAM and SpruceX alignment, including areas such as:

- identity architecture;
- approved application-registration topology;
- ApplicationGroup claims;
- Managed Identity access matrix;
- SpruceX resource and networking alignment;
- Azure SQL control-plane confirmation;
- App Service deployment boundary;
- Databricks identity/connectivity discovery;
- Beta-readiness checklist.

Do not assume all of these are ready for implementation.

Classify each candidate item as:

- SAFE TO IMPLEMENT NOW
- SAFE TO DESIGN NOW
- REQUIRES IAM APPROVAL
- REQUIRES SPRUCEX/PLATFORM APPROVAL
- REQUIRES SECURITY APPROVAL
- REQUIRES DATA OWNER APPROVAL
- BLOCKED

Return a short proposed Phase 1 slice before coding.

Prefer the smallest useful slice that:

- does not depend on unresolved platform approvals;
- preserves current runtime behavior;
- is reversible;
- is testable in Development;
- creates reusable contracts for later integration.

──────────────────────────────────────────────────────────────────────
4. RECOMMENDED FIRST SLICE
──────────────────────────────────────────────────────────────────────

Unless repository evidence identifies a better approved slice, implement:

Phase 1A — Identity and Platform Readiness Contracts

Possible deliverables:

1. A typed identity/runtime configuration contract covering:

   - auth mode;
   - tenant;
   - issuer;
   - audience;
   - delegated scopes;
   - application-assigned group claim name;
   - stable subject identifier;
   - group object IDs;
   - Managed Identity client identifier;
   - environment;
   - mock-auth restrictions.

2. A Managed Identity access matrix represented as governed configuration or documentation-linked typed structures, without provisioning resources.

3. A source-neutral platform capability contract for:

   - Azure SQL;
   - Azure OpenAI;
   - Azure AI Search;
   - future Databricks SQL;
   - ADLS;
   - optional Event Hubs;
   - optional cache.

4. A readiness/status model using explicit states:

   - implemented;
   - configured but unused;
   - technically validated;
   - planned;
   - approval pending;
   - blocked;
   - unavailable.

5. A read-only readiness endpoint or internal service only if consistent with current repository architecture.

6. Feature flags for all new Phase 1 behavior.

7. Unit tests, validation tests, and compatibility tests.

Do not provision resources or enable target-state integrations merely because their contracts exist.

──────────────────────────────────────────────────────────────────────
5. ARCHITECTURE RULES
──────────────────────────────────────────────────────────────────────

Preserve these current verified facts:

- React is built as static assets.
- React assets and FastAPI are packaged together in one Azure App Service artifact.
- FastAPI/Uvicorn serves SPA, REST API, and SSE.
- Browser/MSAL obtains the Entra token.
- Browser sends Authorization: Bearer to FastAPI.
- FastAPI validates the token with Entra JWKS.
- Azure OpenAI is currently called directly.
- There is no live enterprise LLM Gateway.
- Validation is in-process application logic.
- Azure SQL supports analytics and current control/authorization responsibilities.
- Azure AI Search is a conditional fallback metadata text-search path.
- Redis is configured but unused.
- Databricks, ADLS, Event Hubs, usage collector, and durable outbox are not current runtime components.

Do not misrepresent a contract or planned adapter as a deployed service.

──────────────────────────────────────────────────────────────────────
6. IMPLEMENTATION REQUIREMENTS
──────────────────────────────────────────────────────────────────────

For every new change:

- existing Phase 0 behavior remains the default;
- new behavior is disabled by default where applicable;
- API compatibility is preserved;
- auth and authorization remain fail-closed;
- Managed Identity remains the preferred Azure access pattern;
- no API key or secret is introduced;
- no unsupported app-to-app API authentication is introduced;
- no client-provided user or group identity is trusted;
- no unrestricted data access is added;
- no destructive schema change is performed;
- rollback is possible by disabling the feature flag or reverting the commit.

If a database structure is required:

- make it additive only;
- include forward and rollback scripts;
- do not run the migration automatically;
- use no production or restricted data;
- document owner and approval dependency.

──────────────────────────────────────────────────────────────────────
7. DEVELOPMENT DEPLOYMENT IS ALLOWED
──────────────────────────────────────────────────────────────────────

Phase 1 may be deployed from its feature branch to an approved Development environment.

Before deployment, confirm:

- exact target environment;
- exact App Service/resource;
- branch;
- commit SHA;
- deployment workflow;
- deployment slot, if any;
- current deployed version;
- rollback artifact/version;
- packaged config source;
- whether the environment is shared with Phase 0 validation;
- whether any persistent database/config change will occur.

Deployment rules:

- Development only;
- label it as:

  Experimental Phase 1 Development Deployment
  Not Phase 0 closure evidence
  Not approved for Beta or Production

- preserve the Phase 0 rollback artifact;
- preserve current environment configuration;
- no irreversible database migration;
- no production data;
- no Beta/Production promotion;
- feature flags must permit disabling Phase 1 behavior;
- record deployment branch and SHA.

If the Development environment is the same environment used for Phase 0 evidence:

- capture the existing deployed SHA and configuration first;
- confirm rollback procedure;
- do not overwrite required Phase 0 evidence;
- run Phase 0 smoke checks after rollback if rollback is performed.

──────────────────────────────────────────────────────────────────────
8. TESTING
──────────────────────────────────────────────────────────────────────

Run before deployment:

- focused Phase 1 tests;
- backend full test suite;
- backend coverage;
- authentication tests;
- authorization tests;
- SQL safety tests;
- API contract tests;
- offline golden baseline;
- frontend tests if touched;
- frontend lint if touched;
- frontend production build if touched;
- dependency/security scans;
- secret-pattern scan;
- git diff --check.

Do not update approved baselines merely to make tests pass.

Record:

| Validation | Command | Passed | Failed | Skipped | Warnings | Coverage |

──────────────────────────────────────────────────────────────────────
9. DEVELOPMENT DEPLOYMENT VALIDATION
──────────────────────────────────────────────────────────────────────

After Development deployment, run:

- application health check;
- React SPA load;
- /api/config;
- Entra/MSAL authentication;
- bearer-token validation;
- protected-route rejection for anonymous access;
- role/group authorization;
- JSON REST chat request;
- SSE chat stream;
- Azure SQL connectivity;
- Azure OpenAI connectivity;
- Azure AI Search fallback path where safely testable;
- current deterministic path;
- current fallback route;
- diagnostics redaction;
- rollback verification.

Record:

- environment;
- deployment run ID;
- deployed commit SHA;
- app version;
- start/end time;
- test results;
- known limitations.

Do not use this deployment as Phase 0 closure evidence.

──────────────────────────────────────────────────────────────────────
10. REVIEW BEFORE COMMIT
──────────────────────────────────────────────────────────────────────

Show:

git status --short
git diff --name-status
git diff --stat
git diff --check

Confirm:

- no Phase 0 evidence changed;
- no PR #7 or PR #9 files changed;
- no dependency-remediation changes are mixed in;
- no secrets or temporary logs are included;
- no generated deployment artifacts are committed unintentionally;
- no target-state service is falsely described as implemented;
- all new behavior is reversible;
- all tests pass.

──────────────────────────────────────────────────────────────────────
11. COMMIT, PUSH, AND DRAFT PR
──────────────────────────────────────────────────────────────────────

If the bounded slice is safe:

1. Create one focused commit:

   feat: add Phase 1 identity and platform readiness foundation

2. Push the Phase 1 branch without force push.

3. Create a Draft stacked PR targeting:

   asktd_v2

4. Add this notice to the PR body:

   This is a stacked Phase 1 development PR based on PR #7.

   Development deployment is allowed for controlled testing only.

   This PR must not be merged into main or promoted to Beta/Production until:

   - Phase 0 is formally closed;
   - PR #7 is merged;
   - CODEOWNERS and dependency remediation are completed;
   - this branch is rebased onto final main;
   - all validation is rerun;
   - required Phase 1 IAM, Security, Platform, and Data approvals are obtained.

5. Do not mark Ready for Review.
6. Do not merge.
7. Do not deploy to Beta or Production.

──────────────────────────────────────────────────────────────────────
12. FINAL REPORT
──────────────────────────────────────────────────────────────────────

Return:

# Phase 1 Parallel Development Result

## Source of truth
## Phase 0 freeze confirmation
## Controlling Phase 1 scope
## Safe-to-start items
## Approval-blocked items
## Selected Phase 1 slice
## Architecture and contracts added
## Feature flags
## Files changed
## Tests
## Development deployment target
## Deployment run and SHA
## Development smoke-test results
## Compatibility impact
## Security impact
## Database/config impact
## Rollback
## Draft PR
## Rebase plan after Phase 0
## Remaining approvals
## Remaining risks

End with:

- Safe to continue Phase 1 development: YES/NO
- Safe to deploy to Development: YES/NO
- Safe to use as Phase 0 evidence: NO
- Safe to merge before Phase 0 closure: NO
- Safe to promote to Beta: NO
- Safe to promote to Production: NO
