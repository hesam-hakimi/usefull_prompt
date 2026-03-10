---
name: 'TypeScript Extension Standards'
description: 'Implementation standards for the VS Code extension code'
applyTo: 'src/**/*.ts,src/**/*.tsx'
---
# TypeScript extension implementation rules

Apply the [repo-wide Copilot instructions](../copilot-instructions.md).

## Architecture rules
- Keep orchestration logic out of UI view files.
- Put prompt-building logic in dedicated prompt template modules.
- Keep tool registration separate from business logic.
- Use dependency injection or constructor injection where possible.
- Add explicit interfaces for request, response, blueprint, validation result, and deployment plan objects.

## Naming rules
Use or extend these names when possible:
- `TaskClassifier`
- `IntentExtractor`
- `BlueprintBuilder`
- `SimilarJobResolver`
- `EnvConfigResolver`
- `PathResolver`
- `TransformationCompiler`
- `JobConfigRenderer`
- `IncludeFileRenderer`
- `ValidationOrchestrator`
- `DbfsPublisher`
- `DeploymentPlanBuilder`
- `RuntimeDiagnosticService`

## Coding rules
- Prefer pure functions for transformations and rendering.
- Put side effects in dedicated service classes.
- Use focused methods with clear return types.
- Add targeted tests for every bug fix.
- Do not mix repo-write logic with DBFS-upload logic in one method.
- Do not hardcode environment paths where a resolver should own them.
