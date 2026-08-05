# askAlpha — Product Requirement Traceability Matrix

**Status:** Revision 1.0  
**Purpose:** Connect POC findings, repository evidence, product requirements, backlog epics, release gates, owners, and implementation evidence.

## Status vocabulary

- Current / implemented
- Technically validated
- Observed in POC
- Configured but unused
- Partially implemented
- Planned
- Target
- Open for confirmation

## Matrix

| ID | Requirement / finding | Source | Current status | Backlog / phase | Release gate | Primary owner(s) | Required evidence / next action |
|---|---|---|---|---|---|---|---|
| ARC-001 | React build is packaged static output served by FastAPI in one App Service artifact | Private repo audit | Current | Epic 1 / Phase 1 | Current architecture gate | Engineering / Platform | Revalidate after packaging/startup changes |
| ARC-002 | Browser/API supports same-origin JSON REST and SSE | Private repo audit | Current | Epic 1 | Contract/current architecture gate | Frontend / Backend | API and streaming contract tests |
| IAM-001 | Browser/MSAL obtains Entra token; FastAPI validates bearer JWT using JWKS | Private repo audit | Current | Epic 7 / Phase 1 | IAM/Beta gate | IAM / Security / Engineering | Token-flow, issuer/audience/scope/group tests |
| IAM-002 | ApplicationGroup object IDs are used as authorization keys | IAM/product decision | Planned/partially implemented | Epic 7 | Broad Beta | IAM / Security / Product | Written IAM approval and effective-access tests |
| AI-001 | Current model calls go directly to Azure OpenAI; no live enterprise LLM Gateway | Private repo audit | Current | Epic 1 / Epic 12 | Current architecture gate | Engineering / Platform | Revalidate endpoint/client path after model-access changes |
| SAFE-001 | Current request/auth/config/prompt validation is in-process | Private repo audit | Current | Epic 8 | Security gate | Engineering / Security | Unit/integration evidence; no standalone-service claim |
| SAFE-002 | Generated SQL is validated after generation and before execution | Private repo audit | Current | Epic 8 | Broad Beta | Engineering / Security / Data | SQL bypass corpus and authorization tests |
| SAFE-003 | Strengthen pre-model rejection for harmful/unsupported/prompt-injection requests | POC review / product requirement | Planned | Epic 8 / Phase 3 | Broad Beta | Security / Engineering | Reason codes and proof blocked requests avoid model calls where applicable |
| DATA-001 | Azure SQL currently supports analytics plus authz/control/diagnostics | Private repo audit | Current | Epic 1 / Epic 6 | Current architecture gate | Engineering / Data | Maintain role inventory and parity tests |
| DATA-002 | Azure AI Search is conditional fallback metadata text search, not vector/hybrid | Private repo audit | Current | Epic 3 / Epic 4 | Current architecture gate | Engineering / Metadata owner | Route tests and retrieval-type evidence |
| DATA-003 | Databricks SQL and ADLS pilot | Roadmap / architecture | Planned | Epic 6 / Phase 4 | Multi-source gate | Data / Platform / Engineering | Access, identity, DAC, pilot, parity, audit, quality evidence |
| META-001 | Metadata provenance from EDC, models, Bitbucket, historical queries | POC review | Observed/planned governance | Epic 3 | Metadata publish gate | Data owners / Product | Source reference, owner, version, approval, rollback |
| AUTHZ-001 | Fine-grained dataset/table/field/row authorization fails closed | Product/security requirement | Planned/partial | Epic 7 / Phase 3 | Broad Beta | Security / Data / Engineering | RLS/security-view/predicate and cross-user tests |
| AUD-001 | Durable user-query audit | Private repo audit / POC review | Absent | Epic 9 | Broad Beta | Security / Compliance / Engineering | Durable event, retention, protected access, recovery tests |
| AUD-002 | Complete data-read/object-access audit | Private repo audit / POC review | Partially implemented | Epic 9 | Broad Beta | Security / Data / Engineering | Extend authz logs/change log to durable read audit |
| AUD-003 | Export/download/print audit | Private repo audit / POC review | Absent | Epic 9 | Broad Beta | Security / Product / Engineering | Backend-governed export/audit contract and tests |
| TRACE-001 | JSON traces/diagnostics are available but are not audit | Private repo audit | Current | Epic 11 | Diagnostics gate | Engineering / Operations | Redaction/access tests and clear documentation |
| TRACE-002 | Visual agent/LLM decision trace | POC review | Planned | Epic 11 / Phase 5 | Production readiness | Engineering / Operations / Security | Approved trace platform, schema, access, retention |
| QUAL-001 | Automated golden and unseen-question evaluation | POC review | Planned | Epic 10 / Phase 3 | Broad Beta | QA / Product / Data | Approved datasets, thresholds, dashboard, rollback |
| QUAL-002 | Hallucination/error taxonomy and release thresholds | POC review | Planned | Epic 10 | Broad Beta | QA / Product / Model governance | Severity definitions and stop-the-line thresholds |
| QUAL-003 | Baseline report/source-query reconciliation | Business demo requirement | Planned | Epic 10 | Broad Beta / pilot | Data / QA / Business owner | Approved reference queries/reports and tolerance |
| QUAL-004 | Evidence indicators instead of uncalibrated confidence percentage | POC suggestion analysis | Planned policy | Epic 10 / Epic 11 | UX/model-risk review | Product / Model governance | Indicator design and calibration approval if percentage used |
| AGENT-001 | Reviewer feedback loop is bounded | POC review / product requirement | Planned hardening | Epic 11 / Epic 12 | Broad Beta | Engineering / Product / Security | Attempts/time/token/cost/repair/stop tests |
| VIZ-001 | Visualization code execution sandbox hardening | POC review | Planned | Epic 8B / Phase 3 | Broad Beta | Security / Engineering | Network/filesystem/process/resource/artifact security corpus |
| CACHE-001 | Redis config exists but no runtime client/path | Private repo audit | Configured but unused | Epic 13 | Current architecture gate | Engineering / Platform | Do not claim runtime cache |
| CACHE-002 | Authorization-scope-aware caching | Product requirement | Planned | Epic 13 | Cache gate | Security / Architecture / Engineering | Scope-key, invalidation, isolation, benchmark, kill switch |
| USE-001 | Per-provider-call usage collector | Private repo audit / roadmap | Planned | Epic 12 / Phase 5 | Metering gate | Engineering / Platform | Idempotent event and streaming/non-streaming extraction |
| USE-002 | Durable outbox and Event Hubs transport | Private repo audit / roadmap | Planned | Epic 12 / Phase 5 | Metering/production gate | Platform / Engineering | Retry, dead-letter, replay, idempotency, backlog alerts |
| USE-003 | Showback before chargeback | Product/Finance decision | Planned | Epic 12 | Finance gate | Finance / Platform / Product | Reconciliation, approvals, close/adjustment/dispute controls |
| OPS-001 | Approved enterprise monitoring/SIEM integration | POC review | Planned/open tool selection | Epic 15 / Phase 7 | Production gate | Operations / Security / Platform | Select tool, integrate, alert/runbook/retention evidence |
| OPS-002 | LangSmith, Sentinel, Dynatrace are not current; Datadog runtime is not current | Private repo audit | Absent/configured-unused | Epic 1 / Epic 15 | Current architecture gate | Architecture / Operations | Do not show current; reclassify only after live verification |
| DEMO-001 | Current POC evaluation boundary is approximately four tables | POC review | Observed in POC | Epic 2 / Epic 10 | Communication/quality gate | Product / QA | Label scope; do not present as enterprise-scale proof |
| DEMO-002 | Illustrative/fabricated data must be labeled | POC review | Required communication control | Epic 16 | Demo/release review | Product / Communications | Visible label and stakeholder review |
| BI-001 | askAlpha complements rather than replaces Power BI | Business alignment | Preserved decision | Master Plan / Epic 16 | Product governance | Product / Business | Consistent demo, roadmap, and stakeholder messaging |
| P0-001 | New POC findings do not automatically reopen technically complete Phase 0 | Program decision | Preserved | Epic 0 | Phase 0 closure | Product / Engineering / Security | Reopen only for confirmed current blocker |

## Maintenance rules

1. Every new requirement receives an ID before implementation.
2. Every implementation PR references one or more IDs.
3. Status changes require evidence and owner/date.
4. A requirement cannot move to “Current” based only on documentation or a demo.
5. Closed/retired requirements retain history.
6. The matrix is reviewed at each phase gate and before the public documentation PR leaves draft.
