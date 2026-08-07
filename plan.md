Fix only the stale TEST-stage command contract identified by the latest workflow validation.

Repository:
etl_framework_extension

Branch:
feature/v3-agentic-redesign

This is a maintainer workflow/control-plane correction only.

Known finding:

A maintainer SKILL.md documents:

npm run test:integration
npm run test:all

but those scripts do not exist in package.json.

The repository's actual available test commands include the currently supported scripts such as:
- npm run test:unit
- npm run test:unit:guarded
and any other test scripts that package.json proves actually exist.

Task:

1. Locate the exact SKILL.md containing the stale:
   - npm run test:integration
   - npm run test:all
   references.

2. Inspect package.json and determine the canonical existing commands that should be used for the TEST lifecycle.

3. Make the smallest coherent correction to SKILL.md so every TEST command it instructs an agent to run actually exists in package.json.

4. Do NOT invent new npm scripts in this task.

5. Do NOT modify package.json.

6. Do NOT modify:
   - resources/copilot/**
   - src/customization/**
   - consumer ETL workspaces
   - AGENTS.md
   - workflow lifecycle semantics
   - packaged product agents/prompts/skills

7. Preserve the intended validation strength.
   Do not weaken testing merely to eliminate the stale command names.
   If test:unit:guarded is the appropriate stronger canonical replacement, use repository evidence to justify it.

After the edit:

- run node scripts/validate-workflow.mjs
- run the actual replacement TEST command(s) referenced by the corrected SKILL.md
- verify every npm command now documented by that TEST section exists in package.json
- invoke a fresh independent Verifier

Return only:

1. root cause
2. exact file changed
3. old command(s)
4. replacement command(s)
5. validation/test results
6. verifier verdict
7. residual blockers

If another unrelated problem is discovered, report it but do not fix it.

Do not build/package/install the VSIX in this task.
Do not modify the test environment.
