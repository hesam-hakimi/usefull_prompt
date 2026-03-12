## Workspace context

This workspace contains two related repos:
- `etl_framework_extension`: write code here
- `etl-framework-adb`: read-only reference repo for ETL framework patterns, real job configs, env configs, include files, module behavior, and naming conventions

Rules:
- Before generating ETL artifacts, inspect `etl-framework-adb` for similar real jobs.
- Prefer matching real framework structure over inventing a new one.
- Use `etl-framework-adb` as the source of truth for:
  - module ordering
  - data_sourcing_process structure
  - env config reuse patterns
  - include-file conventions
  - job config naming and layout
- Only write changes in `etl_framework_extension` unless explicitly asked otherwise.
