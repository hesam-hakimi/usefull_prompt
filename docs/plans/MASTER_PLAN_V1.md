# askAlpha — Master Product and Delivery Plan

**Status:** Proposed program source of truth — revision 1.6  
**Audience:** Product, business, architecture, engineering, security, IAM, data, QA, platform/DevOps, operations, Finance, and implementation agents  
**Purpose:** Define the current verified baseline, product boundaries, enterprise architecture principles, phased delivery plan, governance model, and release gates for askAlpha.

---

## 1. Document authority and evidence rules

This revision consolidates the roadmap, the POC review findings, and a read-only audit of the private application repository performed against `origin/asktd_v2` on 2026-08-04.

Every statement must use one of these statuses:

- **Current / implemented:** supported by private code, configuration, packaging, deployment, and wired runtime evidence.
- **Technically validated:** tested in the relevant repository/environment, but not necessarily approved or released.
- **Observed in POC:** demonstrated or stated in a meeting, but not fully code/deployment verified.
- **Configured but unused:** configuration exists, but no live client/dependency/path is wired.
- **Partially implemented:** only part of the required control exists.
- **Planned:** committed roadmap or backlog work not yet implemented.
- **Target:** future enterprise design subject to approval and delivery.
- **Open for confirmation:** evidence is insufficient or conflicting.

Meeting statements and architecture diagrams are not implementation evidence. Current-state claims must be revalidated after material private-repository or deployment changes.

---

## 2. Executive summary

askAlpha is an enterprise conversational-analytics capability that allows authorized business users to ask questions in plain language and receive governed answers from trusted data.

Its business purpose is to reduce avoidable operational-report development and reporting backlog while preserving structured, regulatory, scheduled, and pixel-perfect reporting in Power BI or other approved BI tools.

The product is not a general unrestricted text-to-SQL system and is not a blanket replacement for Power BI. It combines:

- a deterministic primary path for common and high-risk questions;
- a bounded LLM-assisted fallback path;
- enterprise authentication and authorization;
- governed metadata and KPI definitions;
- read-only SQL safety;
- inspectable semantic planning;
- controlled visualization and reporting;
- production-grade audit, evaluation, monitoring, and cost governance.

The current POC has useful enterprise foundations, but broad Beta and production require additional controls, especially complete user/data/export audit, automated quality evaluation, fine-grained data authorization, hardened visualization code execution, secure caching, multi-source execution, and production operations.

---

## 3. Product scope and boundaries

### 3.1 In scope

- Natural-language business questions over approved governed data products.
- Deterministic recipes and semantic plans for high-value/high-risk questions.
- Controlled generated-SQL fallback when curated routes cannot answer.
- Role-, group-, dataset-, table-, field-, and row-aware authorization.
- Narrative, table, KPI, chart, report-block, and approved export outputs.
- Metadata registry, KPI catalog, glossary, examples, instructions, joins, grains, source capabilities, and output templates.
- SQL Server/Azure SQL and Databricks SQL through source-neutral adapters.
- Governed self-service onboarding for hundreds of tables.
- Automated golden/unseen evaluation, reconciliation, hallucination/error tracking, and release thresholds.
- User/query/data/export audit, agent/LLM trace, and model-usage metering as distinct correlated record streams.
- Scope-aware caching after authorization.
- Production deployment, monitoring, SLOs, runbooks, recovery, rollback, and cost controls.

### 3.2 Out of scope for the production-safe core

- Unrestricted natural-language-to-SQL over unknown or unauthorized schemas.
- Direct write operations against business data.
- Autonomous metadata publication, deployment, or permission changes without approval.
- Cross-source joins in the first multi-source release.
- Required Power BI integration as a core release blocker.
- Formal chargeback before complete metering, reconciliation, approval, and financial close controls.
- Unsupported custom application-to-application API authentication.

### 3.3 Power BI relationship

Power BI remains appropriate for:

- regulatory and mandatory reporting;
- scheduled dashboards;
- standardized/pixel-perfect output;
- externally distributed or formally controlled reports.

askAlpha is appropriate for:

- ad-hoc questions;
- conversational exploration;
- dynamic follow-up;
- operational insight;
- report-rationalization opportunities.

---

## 4. Verified current architecture and runtime baseline

### 4.1 Deployment boundary

The private-repository audit confirmed:

- Vite builds React production assets under `src/frontend/build`.
- The React build is included in the Python artifact.
- React static assets and FastAPI deploy together in one Azure App Service package.
- `startup.sh` starts one Uvicorn/FastAPI process.
- FastAPI serves the SPA at `/` and API routes under `/api/...`.
- React is not a separate server-side runtime, Static Web App, CDN, or second App Service.

### 4.2 Browser and API flow

```text
Browser
  -> HTTPS GET / and /assets/*
  -> packaged React static assets served by FastAPI
  -> same-origin HTTPS API calls
       -> JSON REST endpoints
       -> POST /api/chat/stream using text/event-stream
       -> POST /api/chat JSON fallback
```

### 4.3 Identity flow

```text
Browser / React
  -> MSAL login/token acquisition from Microsoft Entra ID
  -> Authorization: Bearer <token> to FastAPI
FastAPI
  -> Entra JWKS lookup and JWT validation
  -> issuer, audience, scope, group-overage, and stable-user checks
  -> trusted UserAuthContext
  -> effective authorization from SQL-backed access management when enabled
```

Entra does not call FastAPI directly with claims. The browser obtains and sends the token.

### 4.4 Current orchestration and agents

`POST /api/chat` invokes `handle_chat()`, which builds the primary `Orchestrator` and `FallbackOrchestrator`.

The primary path handles:

- greetings;
- deny-all authorization;
- deterministic source plans and recipes;
- SQL-backed available-data paths;
- governed rendering and validation.

The route-dependent fallback path may use:

- intent router;
- registry router;
- requirement clarity;
- metadata retriever;
- report planner;
- SQL generator/repair;
- SQL safety guard;
- DB executor;
- error triage;
- visualization coder;
- report/executive writer;
- executive reviewer.

### 4.5 Current Azure dependencies

- **Azure SQL — Current:** analytical query execution; available-data stores; authorization/access-management control data; access-change history; SQL diagnostics; optional client-auth diagnostics.
- **Azure AI Search — Current, conditional fallback:** simple text search over field/table/relationship metadata indexes for generated-SQL grounding. It is not the primary answer engine and is not currently vector/hybrid retrieval.
- **Azure OpenAI — Current:** direct SDK/AutoGen calls to `AZURE_OPENAI_ENDPOINT`. No enterprise LLM Gateway is present in the live code path.
- **Managed Identity — Current:** user-assigned Managed Identity is configured. Azure SQL uses `ActiveDirectoryMsi`; Azure OpenAI/Search use managed identity unless an approved supported credential override is configured.

### 4.6 Current in-process validation

There is no standalone validation service or pre-LLM microservice. Current controls are application logic:

- Pydantic/request validation;
- JWT/authentication and authorization validation;
- configuration validation;
- prompt-data preparation/safety logic;
- SQL policy/authorization validation after SQL generation and before database execution.

Future work may strengthen the control, but documentation must not depict it as a current separate service.

### 4.7 Current diagnostics and audit state

- JSON/debug responses may contain authorized traces, debug panels, executed queries, and redacted SQL.
- Runtime and SQL diagnostic routes exist.
- These diagnostics are not a compliance-grade user-query audit service.
- User-query audit is absent.
- Export audit is absent.
- Data-access audit is partial: authorization decisions are logged, and access-management changes have a SQL change log; complete durable data-read audit is absent.

### 4.8 Configured or planned, not current

- Redis: configured but unused by the runtime; current caches are in-process.
- Datadog: generic workflow option only; no runtime integration.
- LangSmith: absent.
- Azure Sentinel: absent.
- Dynatrace: absent.
- Databricks, ADLS, Event Hubs, usage collector, and durable outbox: planned/target only.

### 4.9 Current POC limitations observed in review

- Demonstration coverage was approximately four tables.
- Quality checking was largely manual.
- Hallucinations were acknowledged.
- Repeated questions are not served from a distributed result cache.
- Visual agent explainability is not implemented; current explainability is primarily JSON/diagnostic output.

These findings do not automatically reopen technically completed Phase 0. They become explicit Beta/production requirements unless they reveal a current release-blocking security or correctness defect.

---

## 5. Enterprise architecture principles

1. **Governed before dynamic.** Runtime behavior comes from validated, versioned, publishable metadata.
2. **Deterministic before generative.** Prefer curated recipes and typed rendering for common/high-risk questions.
3. **Plan before SQL.** Every analytical answer has an inspectable semantic plan.
4. **Authorization at every boundary.** Filter metadata, routes, SQL objects, traces, charts, reports, cache entries, and exports.
5. **Fail closed.** Missing or invalid entitlement returns no data.
6. **Read only by construction.** Generated SQL is single-statement `SELECT/WITH`, allowlisted, bounded, and policy-validated.
7. **One approved application boundary first.** Keep React/FastAPI within one security boundary where practical.
8. **Managed Identity first.** Do not introduce unapproved keys, secrets, or app-to-app authentication.
9. **Source-neutral orchestration.** Orchestration operates on semantic plans and adapter capabilities.
10. **Audit, trace, and usage are distinct.** Correlate them without conflating purpose, schema, retention, or access.
11. **Security before caching.** Cache only authorized results keyed by effective scope and policy/data versions.
12. **Bound every loop and call.** Retries, reviewer iterations, model calls, query time, rows, joins, context, and cost have limits.
13. **Evidence before confidence.** Prefer evidence indicators over uncalibrated confidence percentages.
14. **Self-service is governed.** Maker-checker review, validation, publication, rollback, and emergency disable are mandatory.
15. **Small reversible changes.** Every implementation slice has feature flags, tests, evidence, and rollback.

---

## 6. Metadata and data ownership

### Enterprise data platform / Unity Catalog owns technical metadata

- catalog/schema/table/view;
- columns/types;
- physical location;
- lineage and freshness;
- technical owner;
- physical permissions;
- schema changes and technical audit.

### askAlpha owns business and semantic metadata

- glossary and financial terms;
- KPI definitions and formulas;
- intents and question templates;
- positive/negative examples;
- expected semantic plans;
- approved joins and grains;
- business rules/instructions;
- output templates;
- model policy;
- publication/approval/rollback state.

### Current metadata provenance

Current metadata sources observed or stated include:

- EDC;
- data models;
- Bitbucket assets;
- historical queries;
- current Azure AI Search metadata indexes.

Every imported/published record must carry source reference, owner, import time, validation state, version, effective dates, approval, and retirement state.

---

## 7. Security, authorization, and caching

### 7.1 Identity

Trusted identity comes from the validated backend token:

- subject/user identifier;
- tenant;
- issuer/audience;
- application-assigned group object IDs;
- approved direct entitlement references.

Do not use display names or browser-supplied region, portfolio, role, team, or cost center as authoritative security values.

### 7.2 Fine-grained authorization

Authorization may cover:

- domain;
- source/data product;
- dataset/table/view;
- field/column;
- row/record scope;
- KPI;
- report/export;
- admin operation.

Azure SQL should use trusted session context and row-level security where applicable. Databricks should use approved identity passthrough, security views, row filters/ABAC, or mandatory compiled predicates. Shared application identity must not be treated as end-user identity.

Security predicates apply before aggregates, rankings, KPIs, charts, reports, exports, and cache.

### 7.3 Secure cache

Result-cache keys include:

- environment;
- source/dataset;
- semantic-plan/query hash;
- authorization-scope hash;
- authorization version;
- row/column policy version;
- metadata/KPI version;
- data-freshness version;
- output shape.

Redis or another managed cache is introduced only after benchmark, security review, lifecycle approval, isolation tests, and a kill switch.

---

## 8. Audit, observability, and quality architecture

### 8.1 User/data/export audit

Must answer who asked, what was requested, which authorization version applied, which objects were accessed, what result/export action occurred, and the outcome/time/correlation IDs.

### 8.2 Agent/LLM decision trace

Captures route, plan, agent transitions, validation outcomes, retries, repair, reviewer feedback, and approved redacted diagnostic references.

### 8.3 Model usage metering

Captures each provider call, including retries, repairs, fallbacks, escalations, shadows, and reviewer calls; provider-observed token usage; model/deployment; policy version; latency; outcome; and trusted organizational attribution.

### 8.4 Automated quality system

Required capabilities:

- golden questions;
- unseen questions;
- expected route/plan/source;
- SQL constraints and expected metrics;
- trusted baseline report/source-query reconciliation;
- hallucination/error taxonomy;
- release thresholds;
- manual-review queue;
- trend dashboards;
- regression rollback.

### 8.5 Evidence indicators

Prefer indicators such as:

- authorization passed;
- semantic plan validated;
- SQL safety passed;
- source/metadata coverage;
- data freshness;
- reviewer result;
- baseline reconciliation status.

Do not display a probability/confidence percentage unless it is calibrated, validated, explained, and approved.

---

## 9. Phased delivery roadmap

### Phase 0 — Secure foundation and governance

**Status:** Technically validated; formal closure pending repository controls/evidence/approvals.

Deliver:

- login and protected routes;
- safe hosted authentication behavior;
- golden baseline and coverage threshold;
- threat model, data flow, environment matrix, definition of done;
- branch/PR governance evidence;
- rollback and compatibility evidence.

New POC findings do not automatically reopen this phase. A confirmed current security/correctness defect may still block closure.

### Phase 1 — IAM, SpruceX, and verified deployment alignment

Deliver:

- identity architecture ADR;
- approved application-registration/token topology;
- ApplicationGroup claim behavior;
- Managed Identity/workload-identity matrix;
- App Service/private networking confirmation;
- current architecture maintained from code evidence;
- Beta promotion checklist;
- SpruceX access/firewall/DAC readiness.

### Phase 2 — Metadata registry and semantic foundation

Deliver:

- versioned metadata registry;
- technical-metadata integration;
- glossary/KPI catalog;
- source registry and adapter capabilities;
- intents/questions/examples/instructions;
- semantic plan;
- validation, approval, publish, rollback, drift detection;
- provenance for EDC/models/Bitbucket/historical queries.

### Phase 3 — Fine-grained authorization, audit, quality, and safe execution

Deliver:

- dataset/table/column/row authorization;
- Azure SQL RLS and Databricks security design;
- complete user/query/data/export audit;
- automated golden/unseen evaluation;
- reconciliation and hallucination thresholds;
- bounded reviewer loop;
- hardened visualization sandbox;
- pre-model request-safety policy;
- secure-cache contract and isolation tests.

### Phase 4 — SQL Server and Databricks scale

Deliver:

- source-neutral adapters;
- SQL Server parity;
- Databricks SQL adapter;
- Unity Catalog/ADLS integration;
- one governed pilot data product;
- dialect, timeout, cancellation, audit, performance, and parity tests;
- cross-source joins blocked initially.

### Phase 5 — Model governance, usage, and observability

Deliver:

- centralized runtime-model policy;
- per-call model usage;
- request aggregation;
- trusted organizational attribution;
- durable outbox and Event Hubs pipeline where approved;
- agent trace and enterprise monitoring integration;
- showback and provider-bill reconciliation;
- chargeback only after approval.

### Phase 6 — Governed self-service

Deliver:

- Metadata Admin Studio;
- bulk/incremental onboarding for at least 500 tables;
- glossary/KPI/example/instruction editors;
- semantic/SQL preview and test console;
- maker-checker approval;
- publish/rollback/emergency disable;
- drift/impact analysis and owner notification.

### Phase 7 — Production operations and adoption

Deliver:

- approved ingress and App Service deployment;
- SLO/SLA dashboards, alerts, runbooks, backup/recovery;
- canary and rollback;
- load/capacity/security testing;
- cache/aggregate optimization;
- audit/usage retention and compliance operations;
- adoption, report-rationalization, quality, and cost dashboards.

---

## 10. Broad Beta release gate

Before broad Beta with restricted data:

- current architecture is revalidated against repository/deployment evidence;
- IAM topology and ApplicationGroup behavior are approved;
- authorization fails closed;
- row-level access is defined for all restricted pilot data;
- complete user/query/data/export auditing is active;
- export cannot occur without an audit record;
- golden/unseen/reconciliation thresholds pass;
- visualization sandbox tests pass;
- reviewer/model retries and budgets are bounded;
- traces/logs/audit records contain no unauthorized sensitive content;
- deployment, monitoring, runbook, and rollback evidence exists;
- Product, Security, Architecture, Data, QA, Platform, and Operations approvals are recorded.

---

## 11. Production release gate

In addition to the Broad Beta gate:

- supported production environment and lifecycle ownership confirmed;
- private networking/DNS/firewall validated;
- high availability, capacity, backup, recovery, and canary tested;
- source/data-product owners approve freshness and quality SLOs;
- audit retention, SIEM/monitoring, and compliance controls approved;
- cache isolation/freshness proven if enabled;
- event delivery/replay/idempotency/dead-letter proven if enabled;
- usage/request/aggregate reconciliation proven;
- Finance approval recorded if chargeback is in scope;
- rollback is executable and tested.

---

## 12. Decisions to preserve

1. Do not confuse private runtime implementation with public roadmap documentation.
2. Do not claim planned services are deployed.
3. Keep React and FastAPI in one approved boundary where practical.
4. Preserve Managed Identity and avoid unapproved keys/secrets.
5. Do not introduce unsupported custom app-to-app API authentication.
6. Use group object IDs, not names, as authorization keys.
7. Row-level authorization fails closed.
8. Cache only authorized results and key by effective scope.
9. Azure AI Search is bounded metadata retrieval, not analytical execution.
10. Databricks/ADLS are strategic planned data-plane components, not current POC runtime.
11. Runtime model routing is centralized and bounded.
12. Meter every actual model call once metering is implemented.
13. Showback precedes chargeback.
14. Audit, agent trace, and usage metering remain distinct.
15. Power BI and askAlpha are complementary.
16. Fabricated/illustrative demo data must be labeled.
17. Current architecture must be generated from code/config/deployment evidence, not roadmap assumptions.

---

## 13. Open questions

### IAM and platform

- Final one-app versus separate SPA/API registration topology?
- Delegated token rules if registrations are separated?
- Nested-group and guest behavior?
- Approved App Service-to-Databricks identity?
- Are Application Gateway, Event Hubs, managed cache, and enterprise monitoring services approved?

### Data and authorization

- Which pilot datasets require row-level security?
- Required scope dimensions: region, branch, portfolio, product, legal entity, customer segment?
- Who owns entitlement mappings and propagation SLA?
- Which Databricks security capability is approved?

### Quality and operations

- Golden/unseen pass thresholds?
- Reconciliation tolerance?
- Hallucination severity taxonomy and stop-the-line threshold?
- Audit retention and protected access model?
- Interactive p95 SLO and concurrency target?

### Usage and cost

- Price-catalog owner?
- Provider-bill reconciliation tolerance?
- Showback/chargeback approval owners?
- Usage-event retention?

---

## 14. Immediate next actions

1. Complete formal Phase 0 closure without adding unrelated product work to the private PR.
2. Maintain the corrected current architecture and revalidate after runtime changes.
3. Create/approve the IAM and SpruceX identity/network ADR.
4. Convert audit, automated evaluation, sandbox hardening, and bounded-review requirements into implementation slices.
5. Define the row-level entitlement model before broad Beta.
6. Select one Databricks pilot data product and baseline report/query set.
7. Establish the Product Requirement Traceability Matrix.
8. Perform a cross-document consistency audit before moving the public documentation PR out of draft.
