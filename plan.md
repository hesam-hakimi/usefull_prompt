Proceed with option 1: run the complete Phase 1 local smoke and integration validation.

Use the isolated Phase 1 worktree and do not deploy to Azure.

Set:

PHASE1_PLATFORM_READINESS_ENABLED=true

for the local test process only.

Requirements:

1. Start the application locally using the repository-supported startup method.
2. Use only safe local/mock authentication supported by the Development configuration.
3. Do not alter Azure App Service settings, packaged shared-environment config, databases, or cloud resources.
4. Run and record:

- application health
- React SPA load
- static assets
- GET /api/config
- GET /api/platform/readiness
- readiness endpoint disabled behavior when the flag is false
- readiness endpoint enabled behavior when the flag is true
- anonymous protected-route rejection
- authenticated local/mock access
- role and authorization checks
- POST /api/chat
- POST /api/chat/stream using SSE
- deterministic route
- fallback route where safely testable
- diagnostics redaction
- invalid configuration handling
- feature-flag rollback to false

5. Verify the new endpoint:

- is disabled by default;
- returns 404 when disabled;
- requires appropriate authentication/authorization when enabled;
- exposes no secrets, tokens, private URLs, connection strings, or sensitive configuration;
- accurately distinguishes implemented, configured-but-unused, planned, approval-pending, blocked, and unavailable capabilities;
- does not perform Azure resource provisioning or mutate configuration.

6. Run focused tests and the relevant full regression suite.

7. Stop the local process after testing and confirm no persistent environment changes remain.

8. Do not commit additional changes merely to make the smoke test pass without first reporting the defect.

Return:

# Phase 1 Local Smoke Validation

## Branch and commit SHA
## Local startup command
## Environment and feature flags
## Endpoint results
## Authentication and authorization results
## REST and SSE results
## Readiness contract validation
## Security/redaction validation
## Regression tests
## Defects found
## Persistent changes remaining
## Safe to continue Phase 1 development: YES/NO
## Safe to deploy once an isolated target exists: YES/NO
