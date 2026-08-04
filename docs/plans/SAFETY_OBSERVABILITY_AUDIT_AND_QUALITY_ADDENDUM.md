# askAlpha — Safety, Observability, Audit, and Answer-Quality Addendum

**Status:** Normative roadmap addendum — revision 1.5  
**Applies to:** `MASTER_PLAN_V1.md`, `PRODUCT_ORDER_AND_BACKLOG.md`, `QUALITY_GATES.md`, and the architecture pack  
**Source basis:** Findings and recommendations from the LLM Gateway POC review and subsequent architecture review  
**Purpose:** Record product controls and release gates that were not sufficiently explicit in the original delivery pack.

> This document adds requirements. It does not claim that planned controls are already implemented.

---

## 1. Executive decision

The POC demonstrates a useful conversational analytics flow, but broader Beta and production use require three independently governed control planes:

1. **User and data-access audit** — who asked, what data was accessed, and what was exported.
2. **Agent and LLM decision trace** — how the system planned, called models, selected metadata, reviewed, repaired, and produced the answer.
3. **Model usage metering** — model, token, latency, retry, agent, route, and cost-accounting facts.

These records may share correlation IDs, but they must not be treated as the same record or delegated to one tool without proving complete coverage.

---

## 2. Confirmed POC findings and status

| Area | Current evidence | Required product disposition |
|---|---|---|
| Pre-LLM filtering | Application-level validation occurs before the model/gateway request to reject harmful or invalid requests and avoid unnecessary model cost. | Formalize as a tested, versioned, observable safety and cost guard. |
| Reviewer feedback loop | The final reviewer checks whether the generated report answers the question and can return feedback to the first planning/generation step. | Bound retries, time, tokens, and stop conditions; record reviewer reasons and outcomes. |
| Visualization execution | Visualization code runs in a sandbox, creates plot artifacts such as PNG files, and passes them to the writer/response flow. | Define and test network, filesystem, package, CPU, memory, timeout, artifact, and sanitization restrictions. |
| Current explainability | Current diagnostic output is primarily JSON showing decisions, semantic/model queries, tables, metadata, and suggested plots. | Preserve machine-readable trace; add a human-readable graph only as a governed future feature. |
| Cache | No live result cache is currently deployed; repeated questions fetch fresh data from SQL Server. | Introduce caching only after benchmark and security review, with effective-authorization-scope keys and version-aware invalidation. |
| Answer quality | Quality and generated SQL are currently reviewed manually; hallucinations have been observed. | Add automated golden and unseen-question evaluation, error taxonomy, thresholds, regression evidence, and safe-stop behavior. |
| POC scale | Current evaluation is limited by access to approximately four tables. | Do not present the POC as enterprise-scale proof; expand evaluation as governed data products are onboarded. |
| Current metadata sources | Metadata is assembled from EDC, data models, Bitbucket assets, and historical queries. | Add provenance, ownership, versioning, conflict detection, and governed power-user authoring. |
| User/data/export audit | No complete built-in record currently proves who asked what, saw what data, or exported what. | Treat this as mandatory before broad Beta use with restricted data. |
| Event transport | Azure Event Hubs was proposed, but the producer/consumer and purpose were not sufficiently clear in the original diagram. | Use Event Hubs only for explicitly defined usage, audit, feedback, or operational events; it is not the analytical query engine. |
| Enterprise monitoring | Azure Sentinel, Dynatrace, and Datadog were discussed as possible enterprise integrations. | Select approved tools and define responsibility boundaries; do not claim integration before implementation evidence exists. |
| Confidence display | A percentage/probability score was suggested as an explainability idea. | Treat as an open design item. Prefer evidence indicators unless a score is calibrated and validated. |

---

## 3. Mandatory product additions

### 3.1 P0/P1 — required before broad Beta or restricted-data use

#### A. User, data-access, and export auditing

For every governed request, record at minimum:

- trace/request ID;
- trusted subject ID and tenant;
- effective authorization-scope/version;
- question/request classification without unnecessary sensitive text;
- source, dataset, object, and approved field scope;
- query/plan identifier and policy versions;
- result shape and row/column counts;
- export event, format, destination category, and outcome;
- timestamp, environment, application version, and status;
- denial and policy-failure reasons;
- retention and records-management classification.

Raw result rows, secrets, access tokens, and unrestricted prompt/response content must not be copied into audit records.

#### B. Automated answer-quality evaluation

Create a versioned evaluation system containing:

- reviewed golden questions;
- unseen questions not used as prompt examples;
- expected intent, source, dataset, fields, joins, grain, filters, KPI, and output shape;
- expected SQL characteristics or approved SQL hash where suitable;
- expected authorization decision;
- result reconciliation against trusted baseline reports or source queries;
- hallucination and error taxonomy;
- quality thresholds by route and risk;
- regression history and release comparison;
- safe clarification or blocked behavior when confidence/evidence is insufficient.

#### C. Formal pre-LLM safety and cost guard

Before any model call:

- validate request shape and size;
- reject harmful commands and prohibited content;
- enforce authorization-aware metadata narrowing;
- enforce route, context, token, retry, and cost limits;
- avoid sending requests that can be answered deterministically;
- record a redacted safety decision and policy version;
- test bypass attempts and failure behavior.

This control complements enterprise gateway filtering; it does not replace the approved LLM Gateway or platform safety controls.

#### D. Bounded reviewer and repair loop

The reviewer/coverage agent must:

- produce structured pass/fail/needs-clarification output;
- identify the unmet part of the user request;
- never alter authorization or safety decisions;
- have bounded retries, time, model calls, and token budget;
- stop safely after repeated validated failure;
- record feedback, attempt number, route, and final disposition;
- avoid infinite or cost-unbounded loops.

#### E. Visualization sandbox hardening

The visualization execution environment must enforce:

- no unrestricted outbound network access;
- isolated temporary filesystem;
- allowlisted libraries and file types;
- CPU, memory, execution-time, output-size, and chart-point limits;
- no secrets or runtime credentials available to generated code;
- artifact scanning and sanitization;
- deterministic cleanup and retention policy;
- security regression tests for sandbox escape and malicious payloads.

#### F. Minimum operational observability

Before broader rollout, operators must be able to correlate:

```text
User Request
  -> Authentication and Authorization
  -> Safety Decision
  -> Semantic Plan
  -> Model and Data Calls
  -> Reviewer Outcome
  -> Final Response or Failure
```

Logs and traces must be redacted and access-controlled.

---

### 3.2 P2 — scale, operability, and governed self-service

#### A. Human-readable explainability view

Provide an authorized visual trace showing major steps and outcomes without exposing prompts, hidden reasoning, sensitive metadata, SQL literals, or unauthorized object names.

Recommended display elements:

- route selected;
- authorized source/dataset;
- metadata and KPI versions;
- SQL validation status;
- data freshness;
- reviewer result;
- retry count;
- final evidence and limitation indicators.

#### B. Secure scope-aware cache

Result caching must occur only after authorization and mandatory data security filtering. Cache identity must include:

- environment and source;
- semantic-plan/query hash;
- effective authorization-scope hash;
- authorization version;
- row/column policy versions;
- metadata/KPI versions;
- data-freshness version;
- output shape.

Never cache unrestricted results and filter them only in the browser.

#### C. Governed power-user metadata authoring

Power users may propose dataset descriptions, KPIs, glossary terms, examples, negative examples, joins, and instructions through:

```text
Draft -> Validate -> Test -> Approve -> Publish -> Monitor -> Rollback/Retire
```

Published metadata must retain source provenance, owner, effective dates, validation evidence, and rollback state.

#### D. Event and monitoring integration

Define event schemas and ownership before enabling Event Hubs or enterprise monitoring integrations.

Event categories should be explicit:

- model usage;
- user/data/export audit;
- agent/LLM trace;
- application operations;
- feedback and quality outcomes.

Event Hubs transports events; Databricks/ADLS processes and retains analytical history; approved monitoring/SIEM tools support operational and security monitoring.

---

## 4. Confidence and evidence policy

Do not display an uncalibrated confidence percentage as if it proves answer correctness.

Prefer evidence indicators such as:

- authenticated and authorized request;
- semantic-plan validation passed;
- metadata/KPI version used;
- SQL safety validation passed;
- trusted source and freshness;
- reviewer/coverage result;
- baseline reconciliation status;
- known limitations or unresolved ambiguity.

A numeric score may be introduced only after calibration, reliability analysis, user research, threshold approval, and evidence that users interpret it correctly.

---

## 5. Architecture implications by stage

### Current POC

- Preserve the application-level pre-LLM validation control.
- Preserve current JSON diagnostic traces.
- Document the reviewer feedback loop and sandboxed visualization execution.
- Clearly state that complete user/data/export auditing, live caching, and visual explainability are not yet implemented.
- Clearly state the limited four-table evaluation scope.

### MVP1

- Add governed data-product onboarding and Databricks/ADLS connectivity only after access approval.
- Require golden plus unseen-question evaluation against trusted baseline reports.
- Require a minimum user/query/data-access audit before business-user testing on restricted data.
- Preserve bounded safety, authorization, reviewer, and sandbox controls.
- Do not make broad report-rationalization commitments until output reconciliation is proven for the pilot reports.

### Target production

- Keep user/data/export audit, agent/LLM trace, and model usage metering as distinct correlated streams.
- Use a durable outbox and explicit event schemas for recoverable delivery.
- Integrate with approved enterprise monitoring/SIEM tooling.
- Apply fail-closed authorization before aggregation, cache, visualization, report generation, and export.
- Require operational ownership, retention, incident response, replay, and evidence-based release gates.

---

## 6. Demo and stakeholder communication rules

- Label fabricated or illustrative data clearly.
- Distinguish implemented, technically validated, planned, target, and open-for-confirmation capabilities.
- Do not present the four-table POC as proof of broad enterprise scale.
- Position askAlpha as complementary to Power BI: conversational/ad-hoc exploration versus regulatory, scheduled, structured, or pixel-perfect reporting.
- Do not present Event Hubs, cache, enterprise monitoring, visual explainability, chargeback, or complete data-access auditing as implemented without repository and environment evidence.
- Review roadmap and demo materials with the named product/stakeholder owners before wider distribution.

---

## 7. Release-gate additions

Broad Beta with restricted data is blocked unless all of the following are true:

- user/data/export audit completeness is tested;
- authorization is fail-closed and enforced before aggregates and outputs;
- pre-LLM safety controls pass bypass tests;
- automated evaluation meets approved quality thresholds;
- hallucination and material-answer-error rates are within approved limits;
- reviewer loops are bounded and observable;
- visualization sandbox security tests pass;
- logs and traces are redacted;
- baseline-report reconciliation passes for the selected pilot use cases;
- rollback and emergency-disable procedures are demonstrated.

Production is additionally blocked unless:

- enterprise monitoring/SIEM ownership and integration are approved;
- retention and records-management requirements are satisfied;
- Event Hubs/outbox replay and dead-letter recovery are tested if enabled;
- scope-aware cache isolation and invalidation tests pass if cache is enabled;
- usage, audit, and agent-trace streams can be reconciled by request ID without exposing sensitive content.

---

## 8. Backlog mapping

These requirements refine the existing backlog as follows:

- **Epic 2:** add unseen-question evaluation, hallucination taxonomy, and baseline reconciliation.
- **Epic 4:** add evidence indicators and bounded clarification/reviewer contracts.
- **Epic 8:** add pre-LLM safety guard and visualization-sandbox security controls.
- **Epic 9:** separate user/data/export audit from agent/LLM trace and operational observability.
- **Epic 9A:** retain model-usage metering as a distinct correlated stream.
- **Epic 10:** add enterprise monitoring integration and audit-storage verification to deployment smoke tests.
- **Epic 12:** require authorization-scope-aware cache keys and invalidation.
- **Epic 13:** add metadata provenance for EDC, data models, Bitbucket, and historical-query sources.
- **Epic 14:** require export audit and sandboxed visualization traceability.

Until the master plan is consolidated into a later revision, this addendum is the controlling requirement where it is more specific than the earlier documents.
