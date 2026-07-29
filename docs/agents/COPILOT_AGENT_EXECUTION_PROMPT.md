# GitHub Copilot Agent — Master Execution Prompt

Copy the prompt below into GitHub Copilot Agent mode after these documents are committed to the repository.

---

You are implementing the askAlpha roadmap in this repository.

## Authoritative documents

Read these files completely before proposing or changing code:

1. `docs/plans/MASTER_PLAN_V1.md`
2. `docs/plans/PRODUCT_ORDER_AND_BACKLOG.md`
3. `docs/plans/QUALITY_GATES.md`
4. `docs/plans/PRODUCT_ORDER_AND_BACKLOG.md`
5. `docs/TECHNICAL_DOCUMENTATION.md` or the current equivalent technical document
6. Repository contribution instructions, CODEOWNERS, ADRs, and existing test documentation

Treat `MASTER_PLAN_V1.md` as the delivery source of truth. Treat the technical documentation and live code as the source of truth for current behavior. When they disagree, do not guess: record the discrepancy and propose the smallest safe correction.

## Current assignment

Implement only the issue or phase explicitly named by the user. Do not start later phases or unrelated refactors.

For the first execution slice, prioritize:

1. repository quality controls required by Epic 0;
2. the dedicated login/authentication experience in Epic 1;
3. baseline/golden test preparation in Epic 2.

The application currently enters the landing page directly. Add an explicit login/auth bootstrap experience without replacing the existing Entra/MSAL identity approach.

## Required workflow

1. Inspect the repository before writing a plan.
2. Identify the live entrypoints, active runtime paths, existing tests, and inactive/legacy code.
3. State assumptions and unresolved questions that materially affect scope, security, compatibility, or deployment.
4. Produce a focused implementation plan with files, contracts, tests, migration, feature flag, and rollback.
5. Create or use a dedicated feature branch.
6. Implement the smallest compatibility slice that delivers the requested outcome.
7. Add or update tests before declaring completion.
8. Run all relevant backend and frontend tests, lint, build, and security checks available in the repository.
9. Update documentation and ADRs in the same change.
10. Open a pull request with evidence. Do not merge it.

## Architecture rules

- Preserve the deterministic primary path.
- Keep generated SQL in the bounded fallback path unless an approved design says otherwise.
- Do not remove current JSON/YAML/Python fallbacks until parity and rollback are proven.
- Move ordinary questions, roles, intents, datasets, fields, joins, KPIs, synonyms, recipe metadata, and output-template mappings behind a governed registry rather than adding new hardcoded branches.
- Keep SQL safety, identifier validation, authorization enforcement, and deterministic sensitive formatting in code.
- Require a typed semantic query plan before analytical SQL execution.
- Do not silently choose a dataset for ambiguous questions.
- Filter unauthorized metadata and routing candidates before they reach the model or UI, and validate SQL authorization again before execution.
- Keep API response compatibility unless the issue explicitly authorizes a versioned contract change.
- Redis and Azure AI Search are not assumed to be primary runtime dependencies. Verify live wiring before changing them.
- Do not introduce a new orchestration framework solely for novelty. Add planner/agent complexity only when it solves an approved requirement and is covered by tests and observability.


## Scale, self-service, and multi-source rules

- Design the metadata platform for hundreds of tables; never send the full catalog to an LLM. Narrow candidates by authorization, domain, source, intent, and capability first.
- Support governed authoring of glossary terms, financial definitions, examples, negative examples, expected semantic plans, KPIs, instructions, questions, and output templates.
- All authoring follows draft -> validate -> test -> approve -> publish -> monitor -> rollback/retire.
- Metadata instructions may influence interpretation and presentation but may never override auth, privacy, SQL safety, row/scan/time limits, redaction, or audit.
- Use a source-neutral `DataSourceAdapter` and `DataSourceRegistry`. Refactor SQL Server behind an adapter before adding Databricks SQL.
- Keep semantic plans independent of SQL dialect. Compile validated plans into T-SQL or Databricks SQL through explicit dialect components.
- Do not add `if backend == ...` branches to the orchestrator for normal source execution.
- Qualify authorization and audit by source, catalog/database, schema, object, and field.
- Block cross-source joins in the first release.
- Add parity, dialect-conformance, source-auth, cancellation, timeout, and query-correlation tests.
- Bulk metadata import must be incremental, idempotent, resumable, auditable, and safe for schema drift.

## Login/auth requirements

- Add a dedicated login route/page.
- Use an explicit auth state machine: initializing, unauthenticated, redirecting, authenticated, error.
- Do not render protected landing/chat/report/admin content while authentication is unresolved.
- Reuse existing MSAL/Entra configuration and backend token validation.
- Preserve mock auth only for approved local/dev/test/CI-safe environments.
- Add protected-route handling, post-login return route, sign-out, expired-session recovery, and safe user-facing errors.
- Do not expose raw token, group, issuer, audience, or configuration details in the UI or logs.
- Include accessibility and responsive behavior.
- Add frontend and backend tests for all auth states and environment restrictions.

## Quality and security rules

- Never commit secrets, tokens, credentials, customer data, or production data.
- Never weaken SQL read-only or authorization guards to make a test pass.
- Never log raw prompts, SQL literals, result data, tokens, or sensitive claims without an approved redaction design.
- Never enable mock auth in hosted production.
- Never add broad wildcard authorization.
- Never self-approve or self-merge.
- Stop and report if the requested implementation would bypass a release gate or contradict a documented security requirement.

## Test expectations

At minimum, add tests appropriate to the slice:

- unit tests;
- API/DTO contract tests;
- integration tests for the changed runtime path;
- security and authorization regression tests;
- frontend route/auth tests for user-facing auth changes;
- golden/parity tests when routing, metadata, SQL, KPI, or rendering changes;
- build/lint/type checks;
- deployment smoke tests when runtime configuration changes.

## Pull request format

Use this structure:

### Summary
What changed and why.

### Scope
Included and explicitly excluded work.

### Current-to-target behavior
How behavior changes while preserving compatibility.

### Architecture and security
Contracts, authorization, SQL/data safety, redaction, and ADR references.

### Files changed
Each important file and its purpose.

### Tests and evidence
Commands, results, screenshots, traces, and regression comparisons.

### Migration and feature flag
How the change is enabled safely.

### Rollback
Exact rollback steps.

### Risks and follow-ups
Known limitations and later work.

## Completion standard

Do not report the work as complete unless:

- acceptance criteria are met;
- relevant tests pass;
- documentation is updated;
- observability and redaction are addressed;
- migration and rollback are proven;
- no unrelated dirty files are included;
- the pull request is ready for human review.
