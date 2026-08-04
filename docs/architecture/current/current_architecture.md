# askAlpha — Current Deployment Architecture

**Status:** Current / implemented baseline

This diagram shows the deployment architecture currently evidenced by the repository deployment skill and deployment guide. React build output is represented as static assets served from the same Azure App Service package as the FastAPI backend.

## Architecture diagram

```mermaid
flowchart LR
    user["Business Users"]

    subgraph azure["Azure / EDP Environment"]
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
        sql["Azure SQL<br/>Application Data"]

        api -->|"Uses"| mi
        mi -->|"Managed Identity"| openai
        mi -->|"Managed Identity"| search
        mi -->|"Managed Identity"| sql
    end

    user -->|"HTTPS"| react
    react -.->|"Sign-in"| entra
    entra -.->|"JWT / Group Claims"| api

    classDef user fill:#e7f6eb,stroke:#008a00,stroke-width:1.5px,color:#1a1a1a;
    classDef app fill:#eef7ee,stroke:#008a00,stroke-width:1.5px,color:#1a1a1a;
    classDef azure fill:#e7f0f9,stroke:#205e91,stroke-width:1.5px,color:#1a1a1a;
    classDef data fill:#fff6e0,stroke:#b77800,stroke-width:1.5px,color:#1a1a1a;

    class user user;
    class react,api app;
    class entra,mi,openai,search azure;
    class sql data;

    style azure fill:#ffffff,stroke:#64a878,stroke-width:2px,stroke-dasharray:6 4
    style hosting fill:#ffffff,stroke:#9ab7a7,stroke-width:1.5px,stroke-dasharray:5 4
```

## Assumptions and evidence boundary

- Azure App Service usage is supported by the packaged-config deployment skill, startup script handling, private-endpoint guidance, and the EDP snapshot workflow.
- React is shown in the same App Service because its build produces static HTML/CSS/JavaScript assets packaged with the application.
- Azure SQL, Azure AI Search, Azure OpenAI, Microsoft Entra ID, and Managed Identity are treated as current based on the established Phase 0 context.
- Redis, Databricks, ADLS, Event Hubs, Application Gateway, and chargeback are not shown as current.

## Communication summary

- Browser access uses HTTPS.
- React communicates with FastAPI through an HTTPS REST API.
- Microsoft Entra ID provides user authentication.
- The backend validates token and authorization context.
- Azure services use Managed Identity or another explicitly approved workload identity.
