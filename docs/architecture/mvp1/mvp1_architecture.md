# askAlpha — MVP1 SpruceX Architecture

**Status:** Planned / dependent on access, data-product onboarding, and approval  
**Baseline dependency:** This view evolves the verified current architecture. It does not redefine current hosting, identity, or model-access behavior without new repository/platform evidence.

MVP1 keeps React static assets and FastAPI in one Azure App Service package, preserves the browser-MSAL-bearer-token flow, and adds approved access to initial Databricks/ADLS governed data products. It also introduces the minimum audit and quality controls required before broader business testing with restricted data.

## Architecture diagram

```mermaid
flowchart LR
    user["Business User<br/>Browser"]

    subgraph sprucex["MVP1 SpruceX / Azure environment — planned"]
        direction LR

        subgraph app["Azure App Service package"]
            direction TB
            react["Packaged React build<br/>Static HTML / CSS / JS"]
            api["FastAPI / Uvicorn<br/>JSON REST + SSE"]
            runtime["Primary + fallback orchestration"]

            subgraph controls["Planned MVP1 in-process controls"]
                safety["Strengthened request safety"]
                audit["User / query / data / export audit writer"]
                quality["Golden + unseen evaluation<br/>Baseline reconciliation"]
            end

            react -->|"Same-origin HTTPS<br/>REST or SSE + Bearer JWT"| api
            api --> runtime
            api -.-> safety
            api -.-> audit
            runtime -.-> quality
        end

        entra["Microsoft Entra ID / JWKS"]
        mi["Approved workload identity<br/>Managed Identity where supported"]
        openai["Azure OpenAI<br/>Approved model access"]
        search["Azure AI Search<br/>Conditional metadata grounding"]
        sql["Azure SQL<br/>Control plane + audit records"]
        dbsql["Azure Databricks<br/>SQL Warehouse"]
        adls["ADLS Gen2<br/>Governed data products"]

        api -->|"Uses"| mi
        mi --> openai
        mi --> search
        mi --> sql
        mi --> dbsql

        runtime -->|"Current/control queries"| sql
        runtime -.->|"Fallback grounding"| search
        runtime -->|"Model calls"| openai
        runtime -->|"Governed analytical SQL"| dbsql
        dbsql -->|"Reads governed data"| adls
        audit -->|"Durable MVP audit records"| sql
    end

    user -->|"HTTPS GET / and /assets/*"| react
    user -.->|"MSAL login / token acquisition"| entra
    api -.->|"JWKS + issuer/audience/scope validation"| entra

    classDef actor fill:#e7f6eb,stroke:#008a00,stroke-width:1.5px,color:#1a1a1a;
    classDef app fill:#eef7ee,stroke:#008a00,stroke-width:1.5px,color:#1a1a1a;
    classDef control fill:#f7f7f7,stroke:#777777,stroke-width:1.2px,color:#1a1a1a;
    classDef identity fill:#e7f0f9,stroke:#205e91,stroke-width:1.5px,color:#1a1a1a;
    classDef data fill:#fff6e0,stroke:#b77800,stroke-width:1.5px,color:#1a1a1a;
    classDef ai fill:#eef3ff,stroke:#205e91,stroke-width:1.5px,color:#1a1a1a;

    class user actor;
    class react,api,runtime app;
    class safety,audit,quality control;
    class entra,mi identity;
    class sql,dbsql,adls data;
    class openai,search ai;

    style sprucex fill:#ffffff,stroke:#64a878,stroke-width:2px,stroke-dasharray:6 4
    style app fill:#ffffff,stroke:#9ab7a7,stroke-width:1.5px,stroke-dasharray:5 4
    style controls fill:#ffffff,stroke:#999999,stroke-width:1.1px,stroke-dasharray:3 3
```

## What MVP1 adds to the verified current baseline

- SpruceX onboarding and approved network/firewall path.
- DAC/data-product approval and identity mapping.
- One initial Azure Databricks SQL Warehouse analytical execution path.
- ADLS-backed governed data products.
- Source-qualified authorization for the pilot data product.
- Durable minimum audit for user, question, authorization scope, accessed objects, result/export action, and outcome.
- Golden and unseen-question evaluation, including reconciliation against trusted source queries or baseline reports.
- Explicit hallucination/error taxonomy and approved acceptance thresholds.
- Bounded reviewer retries, timeout, token budget, and safe-stop behavior.
- Hardened visualization code execution where code-based charts are enabled.

## Current behavior that remains unchanged unless separately approved

- React remains packaged static output served by FastAPI in the same App Service package.
- The browser obtains an Entra token through MSAL and sends the bearer token to FastAPI.
- FastAPI validates JWTs using Entra JWKS and resolves effective authorization.
- JSON and SSE remain the browser/API response mechanisms.
- Azure AI Search remains conditional fallback metadata grounding, not the primary analytical engine.
- Current model calls go directly to Azure OpenAI. An enterprise model gateway must not be shown or introduced without explicit platform/IAM approval and repository implementation evidence.

## MVP1 dependencies and open confirmations

- SpruceX user and service access.
- Firewall/private-network reachability.
- DAC approval and named data owners.
- Availability of Databricks SQL Warehouse and Unity Catalog capabilities.
- Approved App Service-to-Databricks workload identity.
- Catalog/schema/object authorization model.
- Data freshness, reconciliation, and pilot SLO.
- Audit retention, access, and SIEM/monitoring destination.

## Explicitly outside this MVP1 view

- Cross-source joins.
- Redis as a required runtime dependency.
- Event Hubs, durable outbox, and enterprise-scale telemetry pipeline.
- Formal showback or chargeback.
- Application Gateway/WAF unless separately approved for this stage.
- Rich Power BI replacement or pixel-perfect reporting.

## MVP1 exit evidence

MVP1 is not complete merely because a database connection succeeds. Exit requires:

1. authenticated and authorized pilot-user access;
2. one governed data product queried through the approved Databricks path;
3. fail-closed object and row-scope behavior;
4. durable user/query/data/export audit evidence;
5. golden and unseen-question thresholds;
6. baseline reconciliation;
7. sandbox-security evidence for code-generated visualization;
8. bounded reviewer/model-call behavior;
9. operational diagnostics and rollback evidence;
10. explicit Product, Data, Security, Architecture, QA, Platform, and Operations sign-off for the pilot.
