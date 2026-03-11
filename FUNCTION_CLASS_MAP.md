# Function and Class Map

Use these names consistently so future bug fixes can target exact code surfaces.

## Classification and planning
- `TaskClassifier.classify`
- `IntentExtractor.extract`
- `KnowledgeAdvisor.getArchitectureGuidance`
- `KnowledgeAdvisor.getBestPractices`
- `MetadataResolver.resolveSourceSchema`
- `MetadataResolver.resolveTargetMetadata`
- `ArtifactMappingResolver.resolve`
- `BlueprintBuilder.build`
- `TemplateSelector.selectStrategy`

## Generation
- `TransformationCompiler.compile`
- `JobConfigRenderer.renderTopLevelConfig`
- `EnvConfigRenderer.renderOrReuse`
- `IncludeFileRenderer.renderAll`
- `RepoWriter.writeArtifacts`

## Validation and deployment
- `ValidationOrchestrator.validateAll`
- `ApprovalGate.requireApproval`
- `DbfsPublisher.uploadArtifacts`

## Runtime inspection and diagnosis
- `RunObserver.inspectRun`
- `TroubleshootingAdvisor.diagnose`
