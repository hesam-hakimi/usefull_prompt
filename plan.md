Improve the Phase 1 platform-readiness contract so that an implemented code
integration is never confused with an integration validated in a deployed
environment.

Repository:
TD-Enterprise/kmai-td-genie

Expected branch:
phase1/foundation-contracts

Expected stacked Draft PR:
#10

Current validated state:

- The Phase 1 readiness endpoint is feature-flagged.
- GET /api/platform/readiness returns 404 when disabled.
- It is authenticated and admin-gated when enabled.
- Local smoke validation passed using mock authentication and SQLite.
- No Azure/App Service/database/cloud resource was changed.
- Azure SQL, Azure OpenAI, and Azure AI Search integrations exist in current
  code, but were not validated end-to-end in a deployed Phase 1 environment.
- Redis is configured but unused.
- Databricks SQL, ADLS, Event Hubs, and other target components are planned.
- Shared Development deployment remains blocked until an isolated target or
  proven capture/restore process exists.

Purpose:

Make the readiness response distinguish clearly between:

1. whether a capability exists in the code/configuration;
2. whether it has been validated in the current environment;
3. whether approvals or external dependencies remain outstanding.

Do not deploy during this task.

──────────────────────────────────────────────────────────────────────
1. SAFE SETUP
──────────────────────────────────────────────────────────────────────

1. Confirm authenticated GitHub access and fetch origin.

2. Verify the actual current head of:

   - branch phase1/foundation-contracts;
   - Draft PR #10.

3. Protect the user’s existing checkout.

Use the existing isolated Phase 1 worktree or create a clean isolated worktree.

4. Do not modify:

   - PR #7;
   - PR #9;
   - Phase 0 evidence;
   - Phase 0 architecture;
   - CODEOWNERS;
   - GitHub workflows;
   - dependency-remediation files;
   - authentication or Managed Identity behavior;
   - deployment manifests;
   - COPILOT_AGENT_EXECUTION_PROMPT.md.

──────────────────────────────────────────────────────────────────────
2. CONTRACT CHANGE
──────────────────────────────────────────────────────────────────────

Update each platform-capability entry so it reports separate fields.

Required conceptual structure:

{
  "capability": "azure_sql",
  "implementation_status": "implemented",
  "environment_validation_status": "not_validated",
  "approval_status": "not_required",
  "readiness_summary": "Integration exists in code but has not been validated in the current deployed Phase 1 environment."
}

Use typed enums rather than arbitrary strings.

Implementation status must support at least:

- implemented
- partially_implemented
- configured_but_unused
- planned
- unavailable

Environment validation status must support at least:

- not_applicable
- not_validated
- validated_local
- validated_development
- blocked
- unavailable

Approval status must support at least:

- not_required
- approval_pending
- approved
- blocked
- unknown

Definitions:

- implemented:
  the current application contains a wired runtime integration.

- configured_but_unused:
  configuration exists, but no active runtime integration is wired.

- planned:
  roadmap or contract exists, but no current runtime integration exists.

- validated_local:
  behavior was tested only through local process, mock, fake, SQLite, or
  other non-cloud validation.

- validated_development:
  the actual integration was exercised successfully in the approved deployed
  Development environment.

- not_validated:
  implementation exists, but no qualifying validation evidence exists for the
  current environment.

- not_applicable:
  environment validation is not meaningful because the capability is only
  planned or intentionally unused.

- blocked:
  validation cannot proceed because an access, environment, networking,
  approval, rollback, or platform dependency is unresolved.

Do not use "implemented" to imply deployed connectivity or operational
approval.

──────────────────────────────────────────────────────────────────────
3. EXPECTED CURRENT CLASSIFICATION
──────────────────────────────────────────────────────────────────────

Derive the final values from code and evidence, but the expected classification
is approximately:

Azure SQL:
- implementation_status: implemented
- environment_validation_status: not_validated
- approval_status: approval_pending or unknown where appropriate

Azure OpenAI:
- implementation_status: implemented
- environment_validation_status: not_validated
- approval_status: approval_pending or unknown where appropriate

Azure AI Search:
- implementation_status: implemented
- environment_validation_status: not_validated
- approval_status: approval_pending or unknown where appropriate

Managed Identity:
- implementation_status: implemented
- environment_validation_status: not_validated
- approval_status: approval_pending where platform confirmation is required

Redis:
- implementation_status: configured_but_unused
- environment_validation_status: not_applicable
- approval_status: approval_pending or unknown

Databricks SQL:
- implementation_status: planned
- environment_validation_status: blocked or not_applicable
- approval_status: approval_pending

ADLS:
- implementation_status: planned
- environment_validation_status: blocked or not_applicable
- approval_status: approval_pending

Event Hubs:
- implementation_status: planned
- environment_validation_status: not_applicable
- approval_status: approval_pending

Do not hard-code a positive environment validation result merely from the
presence of configuration.

──────────────────────────────────────────────────────────────────────
4. BACKWARD COMPATIBILITY
──────────────────────────────────────────────────────────────────────

Inspect the current readiness response and all consumers.

Prefer an additive API change.

If an existing field named `status` is already returned:

- preserve it temporarily if a consumer or test depends on it;
- clearly mark it as a compatibility/summary field;
- derive it deterministically from the new typed fields;
- do not allow it to contradict implementation_status,
  environment_validation_status, or approval_status.

Do not change existing Phase 0 APIs.

The readiness endpoint must remain:

- disabled by default;
- feature-flag controlled;
- authenticated;
- admin-gated;
- read-only;
- non-provisioning;
- non-mutating.

──────────────────────────────────────────────────────────────────────
5. SECURITY AND REDACTION
──────────────────────────────────────────────────────────────────────

The response must not expose:

- tenant IDs;
- client IDs;
- Managed Identity object/client IDs;
- tokens;
- secrets;
- connection strings;
- resource URLs;
- private endpoints;
- subscription IDs;
- resource-group names;
- database server names;
- raw configuration values.

Return only:

- booleans;
- typed status enums;
- safe capability names;
- safe explanatory summaries;
- non-sensitive approval-gate names.

Preserve fail-closed configuration validation.

──────────────────────────────────────────────────────────────────────
6. EVIDENCE MODEL
──────────────────────────────────────────────────────────────────────

Where useful, add a non-sensitive validation-evidence structure such as:

{
  "validation_scope": "local",
  "validated": true,
  "validation_method": "automated_test",
  "environment": "local"
}

Do not return:

- local filesystem paths;
- usernames;
- raw commit metadata unless already approved for exposure;
- test logs;
- cloud resource identifiers.

Do not claim validated_development unless evidence comes from the actual
approved Development deployment.

──────────────────────────────────────────────────────────────────────
7. TESTS
──────────────────────────────────────────────────────────────────────

Add or update focused tests covering:

1. typed enum validation;
2. every supported implementation status;
3. every supported environment validation status;
4. every supported approval status;
5. deterministic compatibility-status derivation;
6. endpoint disabled → 404;
7. enabled anonymous request → 401;
8. enabled non-admin request → 403;
9. enabled admin request → 200;
10. no sensitive values in response;
11. implemented but not environment-validated capability;
12. configured-but-unused capability;
13. planned and approval-pending capability;
14. blocked validation state;
15. local validation must not become validated_development;
16. invalid or contradictory status combinations fail closed.

Examples of contradictory combinations to reject or normalize explicitly:

- planned + validated_development
- unavailable + approved and operational
- configured_but_unused + validated_development runtime
- implementation absent but status reported as fully operational

──────────────────────────────────────────────────────────────────────
8. LOCAL SMOKE VALIDATION
──────────────────────────────────────────────────────────────────────

Run two local rounds.

Round A:

PHASE1_PLATFORM_READINESS_ENABLED=true

Verify:

- health;
- React SPA;
- static assets;
- /api/config;
- /api/platform/readiness;
- authentication;
- authorization;
- REST;
- SSE;
- redaction;
- new status fields.

Round B:

PHASE1_PLATFORM_READINESS_ENABLED unset or false

Verify:

- Phase 0 behavior remains unchanged;
- readiness endpoint returns 404;
- no persistent configuration remains.

Use only approved local mock authentication and SQLite.

Do not access or mutate Azure resources.

──────────────────────────────────────────────────────────────────────
9. REGRESSION VALIDATION
──────────────────────────────────────────────────────────────────────

Run:

- focused readiness tests;
- backend full suite;
- backend coverage;
- authentication tests;
- authorization tests;
- SQL safety tests;
- API contract tests;
- offline golden baseline;
- relevant frontend tests if any frontend contract is touched;
- secret-pattern scan;
- git diff --check.

Report actual results.

Do not alter an approved baseline merely to make tests pass.

──────────────────────────────────────────────────────────────────────
10. REVIEW, COMMIT, AND PR UPDATE
──────────────────────────────────────────────────────────────────────

Before commit, show:

git status --short
git diff --name-status
git diff --stat
git diff --check

Confirm:

- only Phase 1 readiness-contract files changed;
- no Phase 0 files changed;
- no deployment files changed;
- no secrets or temporary logs are included;
- no generated runtime files are committed;
- current behavior remains default;
- no environment is falsely marked validated.

If all validations pass:

1. Create one focused commit:

   feat: separate platform implementation and validation status

2. Push normally to:

   phase1/foundation-contracts

3. Update existing Draft PR #10.

4. Add a PR summary explaining:

   - implementation status is distinct from environment validation;
   - local smoke is not cloud validation;
   - Azure integrations remain not validated for the deployed Phase 1
     environment;
   - actual Development validation remains blocked pending an isolated target
     or proven rollback process.

5. Keep PR #10 Draft.
6. Do not merge.
7. Do not deploy.

──────────────────────────────────────────────────────────────────────
11. FINAL REPORT
──────────────────────────────────────────────────────────────────────

Return:

# Phase 1 Readiness Status Separation Result

## Branch and PR
## Previous ambiguity
## New contract
## Status definitions
## Capability classifications
## Backward compatibility
## Security/redaction
## Files changed
## Focused tests
## Full regression results
## Local smoke results
## Cloud validation still pending
## Commit SHA
## PR #10 update
## Remaining deployment blocker
## Rollback

End with:

- Implementation and validation status separated: YES/NO
- Existing Phase 0 behavior preserved: YES/NO
- Sensitive configuration exposed: YES/NO
- Safe to continue Phase 1 development: YES/NO
- Safe to deploy to shared Development now: NO
- Safe to deploy once an isolated target exists: YES/NO
- Safe to merge before Phase 0 closure: NO
