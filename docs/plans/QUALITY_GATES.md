# askAlpha — Quality Gates and Acceptance Standard

**Status:** Revision 1.6 — mandatory controls for human developers and implementation agents

## 1. Mandatory engineering rules

1. Never implement directly on the protected default branch.
2. Never remove a working path before parity, telemetry, rollback, and approval exist.
3. Never describe a meeting statement, roadmap item, configuration-only value, or diagram as current implementation without private code/config/deployment evidence.
4. Never depict in-process logic as a standalone deployed service without evidence.
5. Never show React as a separate deployed runtime while the verified package serves static React assets through FastAPI.
6. Never reverse the identity flow: browser/MSAL obtains the Entra token; browser sends bearer token; FastAPI validates with Entra JWKS.
7. Never omit SSE when documenting current chat transport; current chat supports JSON REST and `text/event-stream`.
8. Never execute unvalidated generated SQL.
9. Never expose unauthorized metadata, schema, SQL, prompts, traces, result values, group claims, audit records, or usage details.
10. Never enable mock authentication in an unsafe hosted environment.
11. Never claim Redis, Databricks, ADLS, Event Hubs, durable outbox, usage collector, LangSmith, Azure Sentinel, Dynatrace, Datadog runtime monitoring, or an enterprise LLM Gateway is current unless live evidence exists.
12. Never treat current JSON diagnostics as complete user-query/data/export audit.
13. Never allow metadata instructions or model escalation to weaken authentication, authorization, privacy, SQL safety, limits, redaction, audit, or cost policy.
14. Never change API response shape silently.
15. Never merge a PR without tests, evidence, documentation, known limitations, and rollback.
16. Agents may create branches and PRs but may not self-approve or self-merge.
17. Never trust client-supplied user, team, department, cost center, authorization scope, token usage, or cost.
18. Never store raw prompts, responses, SQL literals, result rows, credentials, access tokens, or secrets in usage facts.
19. Never present estimated or unreconciled cost as final chargeback.
20. Never cache unrestricted data and filter it only in the UI.

## 2. Evidence-status gate

Every architecture/product PR must classify affected components as:

- Current / implemented
- Technically validated
- Observed in POC
- Configured but unused
- Partially implemented
- Planned
- Target
- Open for confirmation

### Required evidence for a “Current” claim

At least one direct wired-runtime path plus relevant supporting evidence:

- source code and call graph;
- dependency/configuration actually consumed by the path;
- packaging/deployment manifest;
- target-environment runtime evidence;
- tests or diagnostic evidence tied to a commit.

A config key by itself is not sufficient.

## 3. Test pyramid

### 3.1 Unit tests

- Auth state, route guards, JWT validation helpers, group-overage behavior.
- Effective authorization and deny-all behavior.
- Metadata registry schemas, provenance, lifecycle, and conflict validation.
- Semantic-plan validation.
- SQL AST/read-only/object/join/grain/limit policy.
- Prompt/request safety policy and reason codes.
- Reviewer-loop attempt/time/token/cost stop conditions.
- Visualization sandbox policy, import allowlist, artifact validation, cleanup.
- Cache key, authorization-scope hash, version invalidation, kill switch.
- Audit, trace, usage event serialization/redaction/idempotency.
- Model policy selection and bounded escalation.
- Provider usage extraction for streaming/non-streaming responses.
- Hierarchy snapshot and effective-dated price selection.

### 3.2 Contract tests

At minimum:

- `/api/config`
- `/api/auth/profile`
- `/api/questions`
- `/api/roles`
- `/api/registry`
- `/api/chat`
- `/api/chat/stream`
- diagnostics endpoints
- access-management endpoints
- future audit/usage/reporting/export endpoints

Verify JSON and SSE behavior separately, including client fallback.

### 3.3 Integration tests

- React static build packaged and served by FastAPI from the App Service artifact.
- MSAL-shaped browser token flow and backend Entra JWT validation.
- SQL-backed authorization resolution.
- Primary deterministic path.
- Fallback/generated-SQL path using conditional Azure AI Search metadata grounding.
- Direct Azure OpenAI call path and approved credential behavior.
- SQL Server/Azure SQL execution, diagnostics, timeout, cancellation, and parity.
- Databricks pilot execution when implemented.
- Registry import/validate/publish/rollback/drift.
- Complete audit-event creation and durable delivery when implemented.
- Reviewer feedback, retry, safe stop, and final outcome.
- Visualization sandbox execution, timeout, resource limits, and artifact cleanup.
- Cache isolation and invalidation when enabled.
- Usage-event/outbox/reconciliation flow when enabled.

### 3.4 Security tests

- Mock auth rejected in unsafe hosted environments.
- Invalid JWT signature, issuer, audience, scope, user identifier, and group-overage handling.
- Unauthorized source/dataset/table/view/field/row scope.
- Metadata and error-message object-name leakage.
- SQL comments, multiple statements, DDL/DML, unsafe functions, SELECT INTO, bypass attempts.
- Prompt injection and attempts to override policy through metadata/instructions.
- Block-before-model behavior for requests eligible for pre-model rejection.
- Malicious visualization code: network, filesystem, subprocess, package install, environment/credential access, resource exhaustion.
- Cross-user/cross-scope cache leakage and stale-permission use.
- Audit spoofing, omission, unauthorized reading/export, and sensitive-field leakage.
- Client spoofing of identity, hierarchy, model, usage, cost, or authorization version.
- Cross-source join attempt while disabled.
- Secret/dependency/static scans.

### 3.5 Golden and unseen-question evaluation

Cover:

- balances, trends, product/account analytics;
- retail/commercial/segment breakdowns;
- concentration, FDIC, originations, attrition, deposits/withdrawals;
- date/time-window variants;
- top-N/ranking;
- ambiguity and clarification;
- no-data and unauthorized cases;
- report and visualization requests;
- deterministic versus fallback route;
- glossary/acronym/effective-date conflicts;
- expected source, dataset, semantic plan, fields, joins, grain, filters, and output;
- SQL Server/Databricks parity for portable plans;
- expected reviewer/model behavior and bounded call count;
- reconciliation with trusted source query/report.

Track hallucination/error severity and require approved thresholds by route/risk.

### 3.6 Performance and resilience tests

- p50/p95 by route.
- Concurrent authenticated users.
- JSON versus SSE overhead.
- Large permitted results.
- query/model cancellation and timeout;
- retry/circuit-breaker/backpressure behavior;
- Azure OpenAI/Azure SQL/AI Search latency;
- Databricks latency/cost when introduced;
- cache on/off comparison when enabled;
- instrumentation/audit overhead;
- outbox backlog/replay/dead-letter recovery;
- bulk metadata onboarding and drift processing;
- backup/recovery/canary/rollback.

## 4. Verified-current architecture gate

Before publishing a current architecture update, confirm:

- React build path and packaging.
- FastAPI/Uvicorn startup and static mount.
- same-origin REST and SSE routes.
- browser/MSAL → Entra token acquisition.
- browser → FastAPI bearer-token flow.
- FastAPI → Entra JWKS validation.
- primary and fallback orchestrators and wired agents.
- direct model endpoint versus gateway.
- Azure SQL current responsibilities.
- Azure AI Search current route and retrieval type.
- Managed Identity and any approved credential override.
- current diagnostics versus durable audit.
- configured-unused and planned components.

The PR must include a “do not show as current” section.

## 5. Phase 0 closure gate

- Final private-PR scope is clean and unrelated roadmap/product edits are excluded.
- Backend/frontend/golden validation passes on final SHA.
- Branch protection/ruleset and exact required checks are active.
- Effective `CODEOWNERS` review exists.
- Skips/warnings and observability follow-ups are documented.
- Threat model, data flow, environment matrix, definition of done, evidence, and rollback are attached.
- Product, Security, Architecture/Engineering, Data, QA, Platform/DevOps, and Operations approvals are recorded.

New POC findings do not automatically reopen Phase 0 unless they prove a current security/correctness blocker.

## 6. Broad Beta gate

Before restricted-data broad Beta:

- IAM-approved application/token/group topology.
- Current architecture revalidated against the target commit/environment.
- Fine-grained authorization and required row-level security fail closed.
- User-query audit is durable and active.
- Data-read/object-access audit is durable and active.
- Export/download audit is active.
- Audit delivery failures are visible and recoverable.
- Golden, unseen-question, and reconciliation thresholds pass.
- Hallucination/error severity remains within approved threshold.
- Reviewer iterations, time, token, cost, and repair scope are bounded.
- Visualization sandbox security corpus passes.
- No unauthorized or sensitive content appears in logs, traces, audit, or usage facts.
- deployment smoke, SLO, alert, runbook, rollback, and incident-simulation evidence exists.
- Product, Security, Architecture, Data, QA, Platform, and Operations approvals are recorded.

## 7. Multi-source gate

- SQL Server/Azure SQL parity passes through the adapter.
- Databricks pilot passes identity, authorization, semantic plan, dialect, SQL policy, query, result, audit, timeout, cancellation, quality, and performance tests.
- Core orchestration has no normal-path source-specific branching.
- Cross-source joins remain blocked unless separately approved.
- Technical metadata ownership remains with the data platform; askAlpha business/semantic metadata is governed separately.

## 8. Cache gate

If cache is enabled:

- authorization is resolved before cache lookup/write;
- keys include authorization-scope hash and all required policy/data versions;
- access changes prevent old entries from matching;
- no unrestricted result is cached for UI filtering;
- isolation, freshness, invalidation, TTL, kill-switch, and observability tests pass;
- measured performance/cost benefit justifies the service.

## 9. Model-routing and usage gate

- Runtime agents cannot select models independently.
- Policy version, requested/actual model, route, reason, attempts, validation outcome, latency, and provider-observed usage are recorded when implemented.
- Every retry/repair/fallback/escalation/shadow/reviewer call is included.
- High-risk requests do not silently downgrade to an unapproved model.
- Missing usage is observable, not silently estimated.
- Metering failure does not fail chat; undelivered events remain recoverable.
- Event/request/daily/monthly totals reconcile.
- Showback is reviewed before chargeback.
- Formal chargeback requires provider-bill reconciliation and named Finance/Platform/Product/Security approvals.

## 10. Production release gate

- Broad Beta, multi-source, cache, and model/usage gates pass as applicable.
- Supported production environment and lifecycle ownership confirmed.
- private endpoint/VNet/DNS/firewall/workload identity validated.
- capacity, availability, backup, recovery, canary, and rollback tested.
- audit retention, compliance, records management, and SIEM/monitoring approved.
- data-product freshness/quality ownership and SLOs confirmed.
- no unresolved critical/high security findings.
- source-of-truth documentation updated.

## 11. Required PR evidence

Every implementation PR includes:

- requirement/issue and traceability-matrix reference;
- scope/out-of-scope;
- evidence status of affected components;
- current and intended behavior;
- architecture/ADR reference;
- security/authorization/data/KPI/audit/usage impact;
- API/metadata compatibility impact;
- changed files and rationale;
- tests and results;
- screenshots for user-facing changes;
- redacted trace/audit evidence;
- migration/feature flag;
- rollback;
- known limitations and follow-ups.

## 12. Quality metrics

Track at least:

- golden and unseen pass rate;
- reconciliation variance;
- hallucination/error rate by severity;
- answer coverage, clarification, no-route, fallback, and validation-failure rates;
- authorization denial and audit-delivery failure rates;
- unaudited export count;
- p50/p95 latency and timeout/error rate;
- metadata publish/drift/conflict metrics;
- source/dialect execution success;
- cache hit rate, isolation failures, stale-entry prevention;
- model quality, tokens, latency, retries, escalation, and cost by policy/model/agent/route;
- usage delivery, outbox age, dead-letter, duplicate prevention, and reconciliation variance;
- change failure rate and mean time to recovery.

## 13. Stop-the-line conditions

Pause rollout or disable the affected feature when:

- unauthorized data/metadata may have been exposed;
- authorization or row policy fails open;
- user/data/export activity cannot be attributed where required;
- export occurs without required audit;
- logs/traces/audit/usage contain secrets, tokens, raw sensitive result data, or unauthorized content;
- SQL safety can be bypassed;
- visualization code escapes network/filesystem/process/resource boundaries;
- reviewer/model loop exceeds approved limits;
- golden/unseen/reconciliation threshold fails;
- certified KPI has an unreconciled material difference;
- cache crosses authorization scope or serves stale permission;
- source routing reaches an unintended engine;
- current documentation presents a target/configured-unused component as implemented;
- fabricated demo data is presented as real;
- usage events are materially missing, duplicated, unrecoverable, or unreconcilable;
- estimated cost is presented as final chargeback;
- rollback is unavailable or untested for the affected release.
