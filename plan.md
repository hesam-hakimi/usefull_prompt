Validate the newly copied maintainer workflow/control-plane assets in this real Databricks ETL Copilot extension source repository.

This is a READ-ONLY VALIDATION task first.

Context:
- I have already copied the latest workflow/control-plane files into this production extension repository.
- Do not assume they are correct merely because they exist.
- We need to prove that they integrate correctly with the actual extension repository before using them for further product development.
- This repository contains both maintainer control-plane assets and packaged product/runtime assets. Preserve that ownership boundary.

Objectives:

1. Resolve the current repository root, current branch, and classify this workspace as the extension-source / maintainer repository.

2. Inventory the newly copied workflow/control-plane assets that are relevant to:
   - maintainer Orchestrator behavior
   - planning
   - implementation delegation
   - independent verification
   - packaging
   - installation
   - post-install/live-smoke verification
   - lifecycle / continuation state
   - protected-path handling

3. Compare those assets against the actual extension repository structure and current scripts/package commands.
   Do not rely only on documentation assertions.

4. Verify that the workflow supports this lifecycle for a shipped-extension change:

   PLAN
   -> IMPLEMENT
   -> TARGETED TEST
   -> INDEPENDENT VERIFY
   -> PACKAGE VSIX
   -> INSTALL VSIX
   -> STOP AT INSTALLED_NOT_ACTIVATED if host reload is required
   -> USER RELOAD
   -> LIVE SMOKE TEST
   -> POST_INSTALL_VERIFIED

5. Verify that implementation/test success alone cannot be reported as full DONE for a shipped-extension change when packaging/install/live-smoke verification is still required.

6. Verify target ownership and protection boundaries:
   - maintainer workflow/control-plane may modify only its owned paths when appropriate
   - packaged product assets must not be casually rewritten by workflow validation
   - consumer ETL workspace files must never be mutated by this validation
   - existing unrelated WIP must not be absorbed into this task

7. Run the repository-supported workflow validation/check commands that are relevant.
   Prefer existing scripts such as workflow validation/control-plane cleanliness checks if present.
   Discover the actual commands from the repository rather than inventing them.

8. Check for stale references, missing agents, missing scripts, broken relative paths, invalid YAML/frontmatter, invalid role/delegation names, and references to files/tools that do not exist in the production extension repository.

9. Do NOT:
   - implement fixes yet
   - package a VSIX
   - install an extension
   - modify consumer artifacts
   - edit protected product/runtime assets merely to make validation pass
   - normalize unrelated existing WIP
   - hide or weaken failing checks

If a defect is found, stop after diagnosis and identify the smallest coherent fix. Do not implement it in this turn.

Return exactly these sections:

## Validation Status
PASS / PARTIAL / FAIL

## Repository Resolution
- repository root
- branch
- target classification

## Workflow Assets Inspected
List exact paths.

## Lifecycle Validation
For each stage:
PLAN
IMPLEMENT
TEST
VERIFY
PACKAGE
INSTALL
RELOAD
LIVE_SMOKE
POST_INSTALL_VERIFIED

Report:
- supported: yes/no
- owning agent/script
- evidence path
- gap if any

## Validation Commands Run
For each command:
- exact command
- result
- relevant output summary

## Ownership / Safety Checks
- protected paths
- consumer-workspace protection
- unrelated-WIP handling
- approval boundaries

## Findings
Severity: BLOCKER / HIGH / MEDIUM / LOW
For each finding include:
- exact file/path
- exact problem
- evidence
- smallest recommended fix

## Files Changed
Must be:
NONE

## Recommendation
State whether we are safe to proceed to the first real end-to-end workflow execution test.

Do not make any changes in this turn.
