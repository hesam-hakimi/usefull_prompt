## Workspace context

This workspace contains two related folders:
- `etl_framework_extension`: the VS Code extension repo that must be changed
- `etl-framework-adb`: the ETL framework repo that should be read for patterns, module behavior, config structure, and examples

Rules:
- write code changes only in `etl_framework_extension` unless explicitly asked otherwise
- read both repos when you need framework behavior or examples
- prefer cloning or adapting real ETL patterns from `etl-framework-adb` instead of inventing new structure
- when reporting changes, always include the exact repo-relative file path
