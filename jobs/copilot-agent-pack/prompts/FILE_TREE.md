# Suggested file tree

```text
extension-repo/
├── .github/
│   ├── copilot-instructions.md
│   ├── agents/
│   │   ├── etl-extension-builder.agent.md
│   │   └── etl-extension-fixer.agent.md
│   ├── prompts/
│   │   ├── 01-bootstrap-extension.prompt.md
│   │   ├── 02-implement-chat-participant.prompt.md
│   │   ├── 03-implement-etl-planner.prompt.md
│   │   ├── 04-implement-tools-and-deployment.prompt.md
│   │   ├── 05-add-tests.prompt.md
│   │   └── 06-fix-bug.prompt.md
│   └── instructions/
│       └── src.instructions.md
├── docs/
│   ├── ARCHITECTURE.md
│   ├── FILE_TREE.md
│   ├── FUNCTION_CLASS_MAP.md
│   └── IMPLEMENTATION_PLAN.md
├── src/
│   ├── extension.ts
│   ├── chat/
│   │   ├── EtlChatParticipant.ts
│   │   └── ChatRequestRouter.ts
│   ├── domain/
│   │   ├── TaskClassifier.ts
│   │   ├── IntentExtractor.ts
│   │   └── ClarificationEngine.ts
│   ├── planning/
│   │   ├── MetadataResolver.ts
│   │   ├── SimilarJobFinder.ts
│   │   ├── TemplateStrategySelector.ts
│   │   └── BlueprintBuilder.ts
│   ├── generation/
│   │   ├── TransformationCompiler.ts
│   │   ├── JobConfigRenderer.ts
│   │   ├── EnvConfigRenderer.ts
│   │   ├── IncludeFileRenderer.ts
│   │   └── ArtifactAssembler.ts
│   ├── validation/
│   │   ├── JsonConfigValidator.ts
│   │   ├── YamlConfigValidator.ts
│   │   ├── IncludeReferenceValidator.ts
│   │   ├── SchemaCompatibilityValidator.ts
│   │   ├── UploadPlanValidator.ts
│   │   └── ValidationOrchestrator.ts
│   ├── deployment/
│   │   ├── RepoWriter.ts
│   │   ├── DbfsPathResolver.ts
│   │   ├── ApprovalGate.ts
│   │   ├── DbfsPublisher.ts
│   │   └── DeploymentPlanner.ts
│   ├── utils/
│   │   ├── ErrorClassifier.ts
│   │   └── FixSuggestionBuilder.ts
│   ├── adapters/
│   │   ├── DatabricksClient.ts
│   │   ├── FileSystemAdapter.ts
│   │   └── MetadataProvider.ts
│   ├── types/
│   │   └── contracts.ts
│   └── test/
│       └── ...
└── package.json
```
