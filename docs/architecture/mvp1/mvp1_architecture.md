# askAlpha — MVP1 SpruceX Architecture

**Status:** Planned / dependent on access and onboarding

This diagram shows the intended MVP1 state after SpruceX onboarding and approved access to the initial governed data products. It preserves the current App Service boundary while adding Databricks and ADLS for analytical execution.

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
            react -->|"HTTPS REST API"| api
        end

        entra["Microsoft Entra ID"]
        mi["Managed Identity"]
        openai["Azure OpenAI"]
        search["Azure AI Search<br/>Metadata Retrieval"]
        sql["Azure SQL<br/>Control Plane"]
        dbsql["Azure Databricks<br/>SQL Warehouse"]
        adls["ADLS Gen2<br/>Governed Data Products"]

        api -->|"Uses"| mi
        mi -->|"Managed Identity"| openai
        mi -->|"Managed Identity"| search
        mi -->|"Managed Identity"| sql
        mi -->|"Approved Workload Identity"| dbsql
        api -->|"Analytical SQL"| dbsql
        dbsql -->|"Reads Governed Data"| adls
    end

    user -->|"HTTPS"| react
    react -.->|"Sign-in"| entra
    entra -.->|"JWT / Application Group Claims"| api

    classDef user fill:#e7f6eb,stroke:#008a00,stroke-width:1.5px,color:#1a1a1a;
    classDef app fill:#eef7ee,stroke:#008a00,stroke-width:1.5px,color:#1a1a1a;
    classDef azure fill:#e7f0f9,stroke:#205e91,stroke-width:1.5px,color:#1a1a1a;
    classDef data fill:#fff6e0,stroke:#b77800,stroke-width:1.5px,color:#1a1a1a;

    class user user;
    class react,api app;
    class entra,mi,openai,search azure;
    class sql,dbsql,adls data;

    style sprucex fill:#ffffff,stroke:#64a878,stroke-width:2px,stroke-dasharray:6 4
    style hosting fill:#ffffff,stroke:#9ab7a7,stroke-width:1.5px,stroke-dasharray:5 4
```

## Assumptions and evidence boundary

- MVP1 depends on SpruceX access, networking/firewall readiness, DAC approvals, data-product onboarding, and an approved App Service-to-Databricks identity.
- Azure SQL remains the control plane; Databricks SQL becomes the analytical execution engine for onboarded data products.
- Cross-source joins, advanced caching, Event Hubs, chargeback, and rich dashboards are outside this MVP1 view.
- This is planned architecture and must not be described as already implemented.

## Communication summary

- Browser access uses HTTPS.
- React communicates with FastAPI through an HTTPS REST API.
- Microsoft Entra ID provides user authentication.
- The backend validates token and authorization context.
- Azure services use Managed Identity or another explicitly approved workload identity.
