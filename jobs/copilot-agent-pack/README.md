# GitHub Copilot Agent Pack for TD ETL Job Authoring

This package gives you a production-oriented starting point for a GitHub Copilot Chat workflow in VS Code that can:

- understand ETL requests in natural language
- create or update framework job config `.json`
- create referenced include files
- reuse or create env config `.yml`
- generate transformation logic
- validate before deployment
- upload to DBFS in `dev` only after approval

## What is in this package

- `.github/copilot-instructions.md`  
  Repo-wide rules that always apply.

- `.github/agents/etl-framework-author.agent.md`  
  Main authoring agent for end-to-end ETL job creation.

- `.github/agents/etl-framework-validator.agent.md`  
  Read-focused validation agent.

- `.github/agents/etl-framework-deployer.agent.md`  
  Safe deployment agent for `dev` DBFS upload.

- `.github/prompts/*.prompt.md`  
  Task-specific slash commands for common workflows.

- `.github/instructions/*.instructions.md`  
  Focused instructions for TypeScript extension code and ETL config artifacts.

- `docs/FUNCTION_CLASS_MAP.md`  
  Recommended function/class names so future fixes can target the correct file.

- `docs/TOOL_CONTRACT.md`  
  Recommended extension tool IDs and contracts.

- `docs/IMPLEMENTATION_NOTES.md`  
  Design notes, repo strategy, and rollout guidance.

## Recommended repo strategy

Best setup:
1. Keep the VS Code extension code in its own repo.
2. Open the ETL framework source repo in the same VS Code workspace, or mount it as a read-only sibling folder / submodule.
3. Point the Copilot agent and your extension tools at the real framework source, sample configs, and canonical templates.

Why:
- the extension and the framework have different release cycles
- the agent becomes much more specific when it can inspect the real framework classes, templates, and examples
- keeping them separate reduces accidental coupling
- using the same workspace still gives Copilot enough context to understand actual framework behavior

If one team owns both and versioning is simple, a monorepo can work. But the safer default is:
- **separate repos**
- **same workspace**
- **shared prompt pack**
- **read-only access to framework source when authoring**

## How to use

### 1) Copy the customization files into the target repository

Copy:
- `.github/copilot-instructions.md`
- `.github/agents/*`
- `.github/prompts/*`
- `.github/instructions/*`

### 2) Update tool IDs in the agent files

The agent files assume your extension contributes tools like:
- `td-etl.findSimilarJobs`
- `td-etl.readJobConfig`
- `td-etl.getSourceSchema`
- `td-etl.validateGeneratedArtifacts`
- `td-etl.uploadFilesToDbfs`

If your extension uses different tool IDs, update only the `tools:` lists in the frontmatter.

### 3) Open the repo in VS Code

Use GitHub Copilot Chat in Agent mode.

### 4) Select the correct agent

Start with:
- `ETL Framework Author` for creation/update
- `ETL Framework Validator` for syntax / include / schema / SQL checks
- `ETL Framework Deployer` for DBFS upload in dev

### 5) Run prompt files as slash commands

Examples:
- `/create-etl-job`
- `/clone-etl-job`
- `/fix-etl-generation`
- `/deploy-etl-dev`
- `/diagnose-etl-runtime`

## Assumptions encoded in this pack

- top-level job config is always `.json`
- env config is always `.yml`
- all referenced include files must be generated or validated
- env config should be reused unless the job truly needs a job-specific override
- source of truth is Bitbucket repo first
- direct DBFS upload is allowed only for `dev` and only after approval
- higher environments should promote from repo, not from direct DBFS writes
- MVP does not update SQL Server config tables
- V1 business flow is:
  - read from bronze
  - transform
  - write Delta to silver or gold
  - manipulate or load Synapse at the job level

## Important adjustment points

Before real use, update these files first:
- `.github/agents/etl-framework-author.agent.md`
- `.github/agents/etl-framework-validator.agent.md`
- `.github/agents/etl-framework-deployer.agent.md`
- `docs/TOOL_CONTRACT.md`

The rest of the pack can stay mostly unchanged.

## Fastest path to value

1. wire up the discovery tools
2. wire up the validation tools
3. test `/create-etl-job` against one real known-good job family
4. test `/clone-etl-job` against one existing production-like job
5. enable `/deploy-etl-dev` only after validation is solid
