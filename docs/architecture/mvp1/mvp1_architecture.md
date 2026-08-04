# askAlpha — MVP1 SpruceX Architecture

**Status:** Planned / dependent on access, onboarding, and pilot quality evidence

This diagram shows the intended MVP1 state after SpruceX onboarding and approved access to the initial governed data products. It preserves the current App Service boundary while adding Databricks and ADLS for analytical execution and introducing the minimum safety, audit, and quality evidence required for controlled business-user testing.

## Architecture diagram

```mermaid
flowchart LR
    user["Business Users"]

    subgraph sprucex["SpruceX / Azure Environment"]
        direction LR

        subgraph hosting["Azure App Service (ASP)"]
            direction TB
            react["React SPA<br/>Static HTML / CSS / JS"]
            api["FastAPI Backend<br/>REST API"]
            safety["Pre-LLM Validation<br/>& Cost Guard"]
            audit["Minimum User / Query<br/>Data-Access Audit"]
            trace["JSON Trace<br/>& Quality Evidence"]
            react -->|"HTTPS REST API"| api
            api -->|"Validate Before Model Call"| safety
            api -->|"Audit Event"| audit
            api -.->|"Diagnostic Event"| trace
        end

        entra["Microsoft Entra ID"]
        mi["Managed Identity"]
        openai["Azure OpenAI"]
        search["Azure AI Search<br/>Metadata Retrieval"]
        sql["Azure SQL<br/>Control Plane"]
        dbsql["Azure Databricks<br/>SQL Warehouse"]
        adls["ADLS Gen2<br/>Governed Data Products"]

        api -->|"Uses"| mi
        safety -->|"Approved Model Request"| openai
        api -->|"Metadata Retrieval"| search
        api -->|"Control / Metadata"| sql
        audit -->|"Audit Records"| sql
        api -->|"Governed Analytical SQL"| dbsql
        dbsql -->|"Reads Governed Data"| adls

        mi -.->|"Authentication"| openai
        mi -.->|"Authentication"| search
        mi -.->|"Authentication"| sql
        mi -.->|"Approved Workload Identity"| dbsql
    end

    user -->|"HTTPS"| react
    react -.->|"Sign-in"| entra
    entra -.->|"JWT / Application Group Claims"| api

    classDef user fill:#e7f6eb,stroke:#008a00,stroke-width:1.5px,color:#1a1a1a;
    classDef app fill:#eef7ee,stroke:#008a00,stroke-width:1.5px,color:#1a1a1a;
    classDef control fill:#f3f7e8,stroke:#708b1e,stroke-width:1.5px,color:#1a1a1a;
    classDef azure fill:#e7f0f9,stroke:#205e91,stroke-width:1.5px,color:#1a1a1a;
    classDef data fill:#fff6e0,stroke:#b77800,stroke-width:1.5px,color:#1a1a1a;
    classDef telemetry fill:#f3eafa,stroke:#6f42a5,stroke-width:1.5px,color:#1a1a1a;

    class user user;
    class react,api app;
    class safety control;
    class entra,mi,openai,search azure;
    class sql,dbsql,adls data;
    class audit,trace telemetry;

    style sprucex fill:#ffffff,stroke:#64a878,stroke-width:2px,stroke-dasharray:6 4
    style hosting fill:#ffffff,stroke:#9ab7a7,stroke-width:1.5px,stroke-dasharray:5 4
```

## MVP1 quality and audit gates

MVP1 is not complete merely because connectivity to a data product works. The pilot must also demonstrate:

- application-level validation before every model/gateway call;
- fail-closed authorization for the selected source, dataset, objects, fields, and row scope;
- minimum user/query/data-access audit tied to a trusted request ID;
- reviewed golden questions and unseen questions;
- comparison against existing trusted reports or source queries;
- expected semantic-plan and SQL characteristics;
- hallucination/error classification and release thresholds;
- bounded reviewer feedback loops with observable stop conditions;
- safe visualization-sandbox controls where generated code is used;
- clear disclosure of data coverage, known limitations, and freshness.

Broad business-user testing with restricted data must not begin until the audit and authorization gates are satisfied.

## Assumptions and evidence boundary

- MVP1 depends on SpruceX access, networking/firewall readiness, DAC approvals, data-product onboarding, and an approved App Service-to-Databricks identity.
- Azure SQL remains the control plane; Databricks SQL becomes the analytical execution engine for onboarded data products.
- The audit shown here is the minimum MVP1 control. The final enterprise architecture keeps user/data/export audit, agent/LLM trace, and model-usage metering as separate correlated streams.
- Cross-source joins, advanced caching, Event Hubs, formal chargeback, broad self-service publishing, and rich dashboards are outside this MVP1 view.
- This is planned architecture and must not be described as already implemented.
- Report-rationalization commitments must be based on reconciled pilot evidence, not only on a successful demonstration.

## Communication summary

- Browser access uses HTTPS.
- React communicates with FastAPI through an HTTPS REST API.
- Microsoft Entra ID provides user authentication.
- The backend validates the token and authorization context.
- Requests are validated before model calls.
- Azure service access uses Managed Identity or another explicitly approved workload identity.

See `docs/plans/SAFETY_OBSERVABILITY_AUDIT_AND_QUALITY_ADDENDUM.md` for the controlling requirements.
