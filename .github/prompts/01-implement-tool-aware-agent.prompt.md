# Implement Tool-Aware ETL Chat Orchestration

Use the `developer` agent.

Implement the core orchestration layer for the VS Code extension so that it is explicitly tool-aware.

## Required behavior
When a user requests ETL generation through Copilot Chat, the extension should:
1. classify the request
2. optionally query Confluence for guidance and best practices
3. query Databricks for live metadata and similar artifacts
4. build a structured ETL intent
5. build a blueprint
6. generate required artifacts locally
7. validate them
8. stop before deployment until approval is granted
9. if approved and env is `dev`, upload/deploy using Databricks tools
10. inspect run results and summarize them

## Required code targets
Implement or update:
- `TaskClassifier.classify`
- `IntentExtractor.extract`
- `KnowledgeAdvisor.getArchitectureGuidance`
- `KnowledgeAdvisor.getBestPractices`
- `MetadataResolver.resolveSourceSchema`
- `MetadataResolver.resolveTargetMetadata`
- `ArtifactMappingResolver.resolve`
- `BlueprintBuilder.build`

## Important rules
- Confluence is advisory only.
- Databricks tools are source of truth for live metadata.
- Reuse env config when possible.
- Prefer clone/modify if a similar job exists.
- Name exact files/classes/functions changed in your summary.
