# askAlpha — Safety, Observability, Audit, and Quality Addendum

**Status:** Normative revision 1.6  
**Relationship to other documents:** The requirements in this addendum are incorporated into the Master Plan, Product Backlog, and Quality Gates. This file retains the detailed rationale and contracts.

---

## 1. Verified current state

A read-only audit of the private application repository against `origin/asktd_v2` established the following:

- React is packaged static output served by FastAPI from one Azure App Service artifact.
- Browser/API communication uses same-origin HTTPS JSON REST and SSE.
- MSAL obtains the Entra token in the browser; FastAPI validates bearer JWTs using Entra JWKS.
- Primary and fallback orchestrators are wired; agents are route-dependent.
- Azure OpenAI is called directly. No enterprise LLM Gateway is present in the live code path.
- Current validation is in-process application logic, not a standalone service.
- SQL safety/authorization validation occurs after generated SQL and before DB execution.
- Azure SQL supports analytics plus authorization/control/diagnostic responsibilities.
- Azure AI Search performs conditional fallback metadata text search, not vector/hybrid retrieval.
- Redis is configured but unused by the runtime.
- JSON traces/diagnostics exist but do not satisfy durable compliance audit.
- User-query audit and export audit are absent.
- Data-access audit is partial: authorization decisions and access-management changes are logged, but complete data-read audit is absent.
- LangSmith, Azure Sentinel, and Dynatrace are absent; Datadog has a generic workflow option but no runtime integration.
- Databricks, ADLS, Event Hubs, usage collector, and durable outbox are planned/target only.

These facts supersede earlier diagrams or statements that contradict them.

---

## 2. Validation and safety boundary

### 2.1 Current behavior

The current application performs in-process:

- request/Pydantic validation;
- JWT/authentication and authorization validation;
- configuration validation;
- prompt-data preparation/safety handling;
- SQL policy and authorization validation after SQL generation and before execution.

There is no separate validation microservice and no live enterprise LLM Gateway.

### 2.2 Required product hardening

The product must formalize a staged request-safety policy:

```text
Request
  → schema/size validation
  → identity and authorization context
  → harmful/unsupported/prompt-injection policy
  → route and data-scope eligibility
  → approved model call when needed
  → generated-SQL policy/authorization validation
  → data execution
```

Where a request can be safely rejected before a model call, tests must prove that no provider call and no provider cost occurred.

### 2.3 Required evidence

- reason code for blocked/clarified requests;
- redacted trace/audit reference;
- tests for prompt injection and policy override attempts;
- proof that metadata instructions cannot weaken runtime controls;
- no standalone-service claim unless the architecture actually changes.

---

## 3. Three distinct correlated record streams

The product requires three separate records with common correlation IDs.

### 3.1 User/data/export audit

Purpose: compliance, investigation, accountability, records management.

Minimum fields:

- `request_id`, `trace_id`;
- trusted `subject_id`, tenant, application/environment;
- authorization version and scope hash;
- operation and route;
- source/data product/dataset/object/field references;
- query/result outcome and permitted summary metrics such as row count;
- export/download/print action where applicable;
- timestamp, latency, app version;
- audit-delivery status.

Do not store raw result rows unless separately approved.

### 3.2 Agent/LLM decision trace

Purpose: explainability, debugging, quality improvement.

Minimum fields:

- plan and metadata/KPI versions;
- route and agent transitions;
- validation outcomes;
- model-call references;
- retry/repair/escalation/reviewer feedback;
- stop reason;
- approved redacted evidence references.

### 3.3 Model usage event

Purpose: operational usage, cost, showback, reconciliation, future approved chargeback.

Minimum fields:

- `model_call_id`, `request_id`, `trace_id`;
- requested/actual model and deployment;
- policy version, agent, route, reason, attempt;
- provider-observed input/output/total usage and status;
- latency and result status;
- trusted organizational-attribution snapshot;
- price-catalog version and cost status.

### 3.4 Separation rule

The streams may be joined through correlation IDs, but they have different:

- authoritative owners;
- schemas;
- access controls;
- retention periods;
- privacy constraints;
- reporting purposes.

Model usage is not a substitute for user/data audit. JSON diagnostics are not a substitute for either.

---

## 4. Complete audit requirement

### 4.1 Current gap

Current code has:

- authorization decision logging;
- SQL-backed access-management change history;
- debug traces and diagnostics.

It does not have:

- durable user-question audit;
- complete data-read/object-access audit;
- backend export audit.

### 4.2 Broad-Beta requirement

Before broad Beta with restricted data, the system must be able to answer:

- who asked;
- what operation was requested;
- which authorization policy/version applied;
- which source/data objects were accessed;
- what outcome occurred;
- whether data was exported/downloaded/printed;
- whether the audit record was delivered successfully.

### 4.3 Audit reliability

- durable write/retry;
- idempotency;
- observable failures;
- least-privilege audit search/export;
- audit of audit access;
- retention and legal/compliance approval;
- redaction and no-secret policy;
- recovery/replay where required.

---

## 5. Automated answer quality and hallucination control

### 5.1 Current gap

POC review indicated:

- approximately four-table evaluation scope;
- largely manual output/SQL review;
- observed hallucinations;
- no enterprise-scale automated quality proof.

### 5.2 Required evaluation system

- reviewed golden questions;
- unseen questions;
- paraphrases and negative examples;
- expected route/source/dataset/plan;
- expected fields, joins, grain, filters, and KPI;
- SQL constraints and safety outcomes;
- trusted source-query/report reconciliation;
- no-data, ambiguity, unauthorized, and failure cases;
- hallucination/error taxonomy;
- severity and release thresholds;
- manual adjudication workflow;
- canary/regression/rollback.

### 5.3 Evidence indicators

Use evidence such as:

- authorization passed;
- semantic plan validated;
- SQL safety passed;
- metadata/source coverage;
- data freshness;
- reviewer outcome;
- reconciliation status.

Do not represent an uncalibrated probability percentage as correctness.

---

## 6. Bounded reviewer feedback loop

A reviewer may send a draft back for correction, but must be controlled by policy:

- maximum attempts;
- maximum elapsed time;
- maximum tokens and request cost;
- allowed repair categories;
- no permission/safety override;
- explicit final stop reason;
- safe clarification, partial answer, deterministic fallback, or blocked response.

Every iteration creates trace and usage references when the corresponding systems are enabled.

---

## 7. Visualization sandbox security

Any agent/tool that executes visualization code must enforce:

- process isolation;
- default-deny network;
- restricted working directory/filesystem;
- library/import allowlist;
- no arbitrary package installation;
- no shell/subprocess access unless explicitly sandboxed and approved;
- no environment credential/host mount access;
- CPU, memory, process-count, and timeout limits;
- input/output size/type validation;
- image/artifact sanitization;
- authorization-aware artifact access;
- retention and cleanup;
- malicious-code/data-exfiltration tests.

A successful chart render is not sufficient evidence of sandbox safety.

---

## 8. Secure caching

### 8.1 Current state

Redis configuration exists, but no Redis runtime client/path is wired. Current caching is in-process only.

### 8.2 Target contract

Cache security is based on effective authorization scope, not only user ID.

Required result-key fields:

- environment;
- source/data product/dataset;
- semantic-plan/query hash;
- authorization-scope hash;
- authorization version;
- row/column policy version;
- metadata/KPI version;
- data-freshness version;
- output shape.

Authorization occurs before lookup and write. An unrestricted result must never be cached and filtered only in the browser.

Redis or another managed cache is introduced only after benchmark, security/lifecycle approval, isolation/freshness testing, observability, and a kill switch.

---

## 9. Event Hubs and enterprise monitoring

### 9.1 Current state

Event Hubs and enterprise monitoring integrations are not wired in the current runtime.

### 9.2 Target event flow

```text
Usage / Audit / Agent-Trace Collectors
  → Durable Outbox
  → Azure Event Hubs
  → Databricks Event Processing
  → ADLS Curated History
  → Monitoring / Audit / Showback / Reconciliation
```

Event Hubs is asynchronous event transport. It is not the analytical query engine, metadata store, or answer source.

### 9.3 Tool responsibility

An approved enterprise monitoring/SIEM solution may receive operational/security signals. Agent tracing, user/data audit, and usage facts retain their distinct authoritative stores/contracts even when surfaced through common dashboards.

Do not claim Azure Sentinel, Dynatrace, Datadog, or LangSmith integration until the chosen tool is approved, implemented, and live-verified.

---

## 10. Release gates added by this addendum

### Broad Beta

- complete user/query/data/export audit;
- fine-grained fail-closed authorization;
- automated golden/unseen/reconciliation thresholds;
- bounded reviewer/model behavior;
- visualization-sandbox security tests;
- no sensitive leakage in logs/traces/audit/usage;
- current architecture revalidated;
- operational ownership, alerts, runbooks, and rollback.

### Production

- supported environment and IAM topology;
- row-level authorization for all restricted data;
- approved audit retention/SIEM integration;
- event delivery/replay/dead-letter if event pipeline enabled;
- cache isolation/freshness if cache enabled;
- capacity/recovery/canary/rollback;
- usage reconciliation and approvals before chargeback.

---

## 11. Stop-the-line conditions

- unaudited required access/export;
- authorization failure open;
- sensitive data in logs/traces/audit/usage;
- sandbox escape;
- unbounded reviewer/model loop;
- material quality/reconciliation failure;
- cross-scope cache leakage;
- current documentation falsely presents planned/configured-unused components as implemented;
- fabricated demo data presented as real;
- unrecoverable required audit/usage event loss.
