# Implementation Notes

## Recommendation on repo layout

Use this structure in practice:

- repo A: VS Code extension / prompt pack / agent orchestration
- repo B: ETL framework source
- repo C: job configs and job artifacts repository (if separate in your organization)

For best Copilot accuracy during implementation:
- open repo A and repo B in the same multi-root workspace
- optionally open repo C too
- keep repo B read-only during normal prompt-pack iteration

This gives the agent enough real framework context without over-coupling releases.

## Why not put everything in one repo by default?

A single repo helps Copilot see everything, but it also:
- couples extension releases with framework changes
- makes testing and ownership boundaries less clear
- increases the chance that fixes for prompting leak into framework runtime code

## Better compromise

- same VS Code workspace
- separate repos
- strong search/discovery tools
- real framework examples available to the authoring agent

## Suggested first implementation order

1. implement `td-etl.findSimilarJobs`
2. implement `td-etl.readJobConfig`
3. implement `td-etl.readEnvConfig`
4. implement `td-etl.getSourceSchema`
5. implement `td-etl.resolveRepoPaths`
6. implement `td-etl.resolveDbfsPaths`
7. implement `td-etl.buildJobBlueprint`
8. implement `td-etl.generateJobConfig`
9. implement `td-etl.generateIncludeFiles`
10. implement `td-etl.generateTransformationLogic`
11. implement `td-etl.validateGeneratedArtifacts`
12. implement `td-etl.previewUploadPlan`
13. implement `td-etl.uploadFilesToDbfs`
14. implement `td-etl.verifyDbfsUpload`

## First prompt to use with Copilot

Use `/create-etl-job` first.

Only use `/deploy-etl-dev` after:
- job config is valid
- include files are valid
- env config decision is correct
- source/target resolution is correct
- upload plan is confirmed

## How to work bugs later

When you get a failure:
1. run `/fix-etl-generation` or `/diagnose-etl-runtime`
2. copy the exact output into a work item
3. modify only the file/class/function named in the result unless evidence shows the problem spans multiple layers
4. add a test that reproduces the failure

## Must-have test scenarios

- create from scratch when no similar job exists
- clone from closest valid job
- reuse existing env config
- generate new env config only when required
- generate all referenced include files
- detect missing include files
- wrong DBFS path detection
- invalid Synapse target detection
- dev-only upload approval gate
- refusal for higher-environment direct upload
