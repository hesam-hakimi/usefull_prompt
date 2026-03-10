---
name: 'ETL Config Artifact Standards'
description: 'Generation rules for ETL job config, env config, and include files'
applyTo: 'job_conf/**/*.json,env_conf/**/*.yml,env_conf/**/*.yaml,sql/**/*.yml,sql/**/*.yaml,conf/**/*.yml,conf/**/*.yaml'
---
# ETL artifact generation rules

Apply the [repo-wide Copilot instructions](../copilot-instructions.md).

## Generation rules
- Generate all referenced include files or explicitly mark them as reused.
- Reuse env config whenever possible.
- Keep naming aligned with the selected job family.
- Do not add unsupported keys.
- Preserve the field order and style of the nearest valid reference artifact when cloning.
- Keep variable interpolation consistent with the framework conventions already used in the repo.

## Validation rules
Before marking artifacts as ready:
- validate JSON or YAML syntax
- validate include references
- validate source/target compatibility
- validate SQL logic
- validate repo and DBFS paths

## Safety rules
- Do not overwrite existing env config unless the user explicitly asked to modify it.
- Do not switch the path strategy without showing the reason.
- Do not remove a referenced include without updating the parent artifact.
