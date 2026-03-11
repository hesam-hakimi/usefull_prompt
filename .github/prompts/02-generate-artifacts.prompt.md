# Implement ETL Artifact Generation

Use the `developer` agent.

Implement the artifact generation layer for the extension.

## Required artifact output
For the supported V1 pattern, generate:
- top-level job config `.json`
- env config `.yml` only if needed
- every referenced include file
- transformation logic files
- any Synapse-related supporting config fragments required by the chosen pattern

## Required code targets
Implement or update:
- `TemplateSelector.selectStrategy`
- `TransformationCompiler.compile`
- `JobConfigRenderer.renderTopLevelConfig`
- `EnvConfigRenderer.renderOrReuse`
- `IncludeFileRenderer.renderAll`
- `RepoWriter.writeArtifacts`

## Strategy order
1. clone nearest valid job and patch it
2. use known template family
3. generate from scratch only if necessary

## Mandatory rules
- Never generate references to include files that are not also created or verified.
- Never create a new env config when reuse is sufficient.
- Generated transformations must be tied to known source metadata.
- Summarize exact files/classes/functions changed.
