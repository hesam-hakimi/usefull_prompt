# Fix a Bug in the ETL Copilot Extension

Use the `developer` agent.

You are fixing a specific bug in the ETL authoring extension.

## Required debugging method
1. Restate the observed symptom.
2. Identify the smallest likely failing surface.
3. Inspect current code before rewriting.
4. Name the exact file/class/function to patch.
5. Apply the smallest correct fix.
6. Add or update tests.
7. Explain how the fix was validated.

## Common likely targets
- `TaskClassifier.classify`
- `IntentExtractor.extract`
- `KnowledgeAdvisor.getArchitectureGuidance`
- `MetadataResolver.resolveSourceSchema`
- `ArtifactMappingResolver.resolve`
- `BlueprintBuilder.build`
- `TemplateSelector.selectStrategy`
- `TransformationCompiler.compile`
- `JobConfigRenderer.renderTopLevelConfig`
- `EnvConfigRenderer.renderOrReuse`
- `IncludeFileRenderer.renderAll`
- `ValidationOrchestrator.validateAll`
- `DbfsPublisher.uploadArtifacts`
- `RunObserver.inspectRun`
- `TroubleshootingAdvisor.diagnose`

## Tool usage
- Use Confluence tools for guidance if the bug concerns architecture, best practices, or FAQ behavior.
- Use Databricks tools for runtime truth if the bug concerns metadata, jobs, notebooks, SQL validation, deployment, or runs.
- Use local workspace tools for the actual code fix.

## Output format
Return:
- symptom
- root cause
- exact file/class/function changed
- test changes
- validation results
