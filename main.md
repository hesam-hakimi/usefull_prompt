Perform a READ-ONLY audit of the actual CURRENT runtime and deployment
architecture in TD-Enterprise/kmai-td-genie.

Expected branch: asktd_v2

Do not modify files, commit, push, or update documentation.

Use only actual code, configuration, deployment manifests, workflows, and
wired runtime paths. Do not report roadmap or target-state components as
current.

Answer the following:

1. Where are the React production build files created?
2. How and from where are the React static assets served at runtime?
3. Are React and FastAPI deployed in the same Azure App Service package?
4. What exact protocol and routes does the browser use to call FastAPI?
5. Where does Microsoft Entra/MSAL authentication occur?
6. Where and how is the JWT validated?
7. Does FastAPI call Azure OpenAI directly, or does it call an enterprise
   LLM Gateway first?
8. What exact code path performs validation before a model call?
9. Is that validation a standalone service or in-process application logic?
10. Which orchestrator and runtime agents are actually wired into the live
    request path?
11. What is Azure SQL used for in the current live path?
12. What is Azure AI Search used for in the current live path?
13. Which services use Managed Identity today?
14. What current JSON trace or diagnostic output is actually available?
15. Confirm whether each of the following is current, partially implemented,
    configured but unused, planned, or absent:
    - Redis/cache
    - user query audit
    - data-access audit
    - export audit
    - LangSmith
    - Azure Sentinel
    - Dynatrace
    - Datadog
    - Event Hubs
    - Databricks
    - ADLS
    - usage collector
    - durable outbox
16. Identify every factual error in the current public architecture diagram.

Return:

A. A component-status table with:
   Component | Status | Current role | Code/config evidence | Confidence

B. The exact current runtime sequence.

C. A minimal Mermaid diagram containing only confirmed current components.

D. A list titled:
   "Do not show as current"

Do not modify the repository.
