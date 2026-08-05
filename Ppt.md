# askAlpha Demo Deck

**Audience:** Business stakeholders / AI2 team  
**Purpose:** Demonstrate the current POC honestly, explain business value, and distinguish current capability from MVP1 and target-state commitments.

---

# Slide 1 — askAlpha

## Stop Searching. Start Asking.

### Conversational Analytics for Governed Enterprise Data

askAlpha helps authorized business users ask questions in natural language and explore answers without requesting a new operational report for every follow-up.

### Speaker Notes

“Today we are not presenting another fixed reporting tool. We are demonstrating a conversational way to explore governed data. The purpose of this POC is to show the interaction and collect business feedback—not to claim that every production capability is already complete.”

---

# Slide 2 — The Business Challenge

- New question → new report request
- Development and testing lead time
- Fixed output for a changing need
- Repeated maintenance and reporting backlog

## Business users need answers, not a new report for every question.

### Speaker Notes

“Structured and mandatory reports still have an important role. The opportunity is to reduce the operational and ad-hoc reporting workload where users mainly need an answer and the ability to ask a follow-up.”

---

# Slide 3 — askAlpha and Power BI

| Power BI | askAlpha |
|---|---|
| Regulatory and mandatory reports | Conversational analytics |
| Scheduled dashboards | Ad-hoc questions |
| Standardized/pixel-perfect layouts | Dynamic exploration |
| Repeated distribution | Interactive follow-up |

> **Complementary solutions—not a blanket replacement.**

### Speaker Notes

“Power BI remains the right choice for regulatory, scheduled, standardized, and pixel-perfect reporting. askAlpha complements it by helping users explore questions that do not require a fixed dashboard.”

---

# Slide 4 — Our Vision

Instead of requesting another report, users can ask:

- Show delinquent accounts below $100K.
- Which region has the highest delinquency?
- Show fiscal-year applications by product.
- Compare this month with last month.
- Drill into the top contributors.

### Speaker Notes

“One answer can lead naturally to the next question. That is the core difference between a fixed report and conversational exploration.”

---

# Slide 5 — Current User Experience

```text
Open the askAlpha URL
  → Sign in with Microsoft Entra ID
  → Ask a natural-language question
  → Receive a governed POC response
  → Ask a follow-up
```

No local installation or SQL knowledge is required for the business user.

### Speaker Notes

“The React interface is delivered through the application URL. The browser signs in through Entra and communicates with the FastAPI backend using secure API calls.”

---

# Slide 6 — What the Current POC Demonstrates

- Entra/MSAL sign-in and backend token validation
- React chat experience
- JSON and streaming responses
- Primary deterministic and bounded fallback paths
- Azure SQL query execution
- Conditional metadata grounding through Azure AI Search
- Direct Azure OpenAI model calls
- Tables, narrative, and visualization paths
- Authorized debug/diagnostic output

### Speaker Notes

“These are the capabilities supported by the current implementation evidence. We are being careful not to present planned services such as Databricks, Event Hubs, Redis runtime caching, or full audit as current.”

---

# Slide 7 — Demo Scope and Limitations

## Current POC boundary

- Demonstrated against a limited dataset of approximately four tables
- Quality review is still substantially manual
- Hallucinations have been observed and require automated evaluation
- No distributed Redis result cache is active
- Complete user/data/export audit is not yet implemented
- Rich visual explainability is future work; current diagnostics are primarily JSON-based

> Any fabricated or illustrative sample data must be visibly labeled.

### Speaker Notes

“This slide is important for setting expectations. The architecture is intended to grow, but the current POC is not enterprise-scale proof. Business validation, audit, authorization, and automated quality gates are part of the next delivery stages.”

---

# Slide 8 — How a Question Is Processed

```text
Authenticated request
  → Authorization
  → Deterministic route when available
  → Conditional metadata grounding and generated-SQL fallback when needed
  → SQL safety and authorization validation
  → Azure SQL execution
  → Answer and optional follow-up
```

### Speaker Notes

“The application prefers governed deterministic behavior where possible. The generated-SQL route is a bounded fallback and its SQL is validated before execution.”

---

# Slide 9 — Example Business Question

**How many applications were submitted this fiscal year by product?**

askAlpha may return:

- a concise answer;
- a table by product;
- a business summary;
- suggested follow-up questions.

### Speaker Notes

“We will validate the result against a trusted source query or existing baseline report. The value is not only the first answer; it is the ability to continue exploring.”

---

# Slide 10 — MVP1 Priorities

- SpruceX access, firewall, DAC, and data-product onboarding
- Initial Databricks/ADLS governed data-product pilot
- Fine-grained authorization and row-scope controls
- Durable user/query/data/export audit
- Golden and unseen-question evaluation
- Baseline reconciliation and hallucination thresholds
- Bounded reviewer behavior
- Hardened visualization sandbox

### Speaker Notes

“MVP1 is not only a connectivity milestone. It must prove security, auditability, quality, and reconciliation for the pilot data product.”

---

# Slide 11 — Target Enterprise Capabilities

- Governed metadata and KPI registry
- Multiple approved data sources
- Scope-aware secure caching
- Agent decision trace and enterprise monitoring
- Per-call usage metering and showback
- Event-driven audit/usage processing
- Governed self-service onboarding
- Production SLOs, runbooks, recovery, and rollback

### Speaker Notes

“These are target capabilities, not current implementation claims. Each remains subject to the roadmap, platform availability, and security/governance approval.”

---

# Slide 12 — Business Value

- Faster access to operational insight
- Fewer avoidable ad-hoc report requests
- Interactive follow-up
- Better use of governed data
- Clearer ownership of KPI and metadata
- Measurable quality, audit, and cost over time

### Speaker Notes

“The goal is not to maximize the number of AI features. It is to deliver trusted self-service analytics while reducing unnecessary reporting effort.”

---

# Slide 13 — Success Criteria

Business users can:

- ask approved questions naturally;
- receive authorized and reconcilable answers;
- understand evidence and limitations;
- ask follow-up questions;
- use Power BI when fixed reporting remains appropriate.

The product team can:

- trace and audit use;
- measure quality and cost;
- block unsafe behavior;
- roll back changes safely.

### Speaker Notes

“Success is not simply that the application generates an answer. Success means the answer is authorized, testable, auditable, supportable, and useful.”

---

# Slide 14 — Closing

## Stop Searching. Start Asking.

### Ask better. Decide faster—using governed data.

### Speaker Notes

“Today’s POC shows the direction and current interaction. The next step is to validate the pilot against real governed data products with the required security, audit, and quality controls.”
