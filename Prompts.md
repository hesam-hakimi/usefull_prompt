You are performing the final READ-ONLY Phase 0 closure audit for the private repository:

Repository: TD-Enterprise/kmai-td-genie
Expected feature branch: asktd_v2
Pull request: #7

This is an audit and evidence-collection task only.

DO NOT:
- modify any tracked file;
- create or delete files;
- change dependencies;
- update snapshots;
- commit;
- push;
- merge;
- mark the pull request ready for review;
- edit the pull request;
- change GitHub repository settings;
- create Phase 1, SpruceX, roadmap, chargeback, or unrelated prompt changes;
- expose credentials, tokens, connection strings, or secrets;
- invoke destructive or write-capable cloud operations.

Use the actual repository as the source of truth. Do not assume the handoff values are still current.

Phase 0 expected technical baseline:

- Backend: 652 passed, 3 skipped
- Backend coverage: 85.52%
- Offline golden baseline: 10 passed
- Live golden baseline: 25 passed, 0 failed, 0 blocked, 0 skipped
- Frontend: 29 files, 154 tests passed
- Frontend lint: passed
- Frontend build: passed
- Initial JavaScript gzip: 70.08 KB
- git diff --check: passed
- requirements.txt and pyproject.toml aligned at openai>=1.99.3,<3
- Production chart_renderer.py title=None defect fixed
- Expected final changed-file count previously reported as 56
- COPILOT_AGENT_EXECUTION_PROMPT.md must remain excluded because it contains unrelated askAlpha/chargeback work

Perform the following audit.

1. Repository and branch identity

Report:

- repository root;
- remote URLs without exposing credentials;
- current branch;
- current HEAD SHA;
- upstream branch;
- PR base branch, if discoverable;
- whether HEAD matches PR #7 head;
- whether the branch is ahead/behind the target branch;
- current git status;
- staged, unstaged, and untracked files.

2. Scope integrity

- List every file changed by PR #7, grouped by:
  - production code;
  - tests;
  - Phase 0 evidence/governance;
  - frontend;
  - dependency/configuration;
  - unexpected or unrelated.
- Confirm whether COPILOT_AGENT_EXECUTION_PROMPT.md is absent from the PR diff.
- Flag every file that cannot be clearly justified by Phase 0.
- Confirm the actual changed-file count.
- Do not modify the scope.

3. CODEOWNERS audit

Inspect the effective target/base branch and report:

- whether a CODEOWNERS file exists;
- its exact path;
- whether it exists on the PR base branch, not only the feature branch;
- whether referenced users/teams appear syntactically valid;
- whether application source, tests, workflows, security/governance files, and CODEOWNERS itself have owners;
- whether .github/CODEOWNERS or the .github directory is protected by an owner rule;
- any missing ownership coverage.

Do not create or modify CODEOWNERS.

4. Workflow and required-check discovery

Inspect all GitHub Actions workflows involved in pull_request validation.

Report:

- workflow file path;
- workflow display name;
- caller job ID;
- caller job name;
- reusable workflow reference;
- reusable job ID/name;
- event trigger;
- whether paths/conditions could cause the check to be skipped or never reported;
- whether merge_group support is present, if the repository uses a merge queue.

Produce a table of CANDIDATE required-check names.

Important:
- Do not claim these are the exact GitHub Checks UI names.
- State clearly that exact names must be confirmed from a successful GitHub PR run.
- Pay special attention to reusable workflows, where the emitted name may combine caller and reusable job names.

Candidate workflows previously observed include:

- call-edp-gt-open-pr-workflow
- call-edp-gt-snapshot-workflow
- call-edp-gt-snapshot-cd-workflow
- call-edp-gt-release-artifact-workflow
- call-edp-gt-release-workflow
- call-update-workflows
- call-ct-workflow
- reusable-aacdf-orchestrator-workflow

Do not assume all of them are required.

5. Final automated validation

Identify the canonical repository-defined commands before running anything.

Run the normal non-destructive Phase 0 validation against the current HEAD where possible:

- backend tests and coverage;
- offline golden baseline;
- frontend tests;
- frontend lint;
- frontend production build;
- git diff --check;
- dependency alignment validation;
- any repository-defined security or policy checks.

For the live golden baseline:

- do not introduce credentials;
- do not modify cloud resources;
- do not invoke it if it is not part of the already-approved validation process;
- determine whether existing evidence is tied to the current HEAD;
- run it only if it is already a normal approved operation and can be executed safely with the existing Managed Identity/authentication configuration.

If any command modifies tracked files, stop that command, preserve the evidence, and report the mutation.

For every test suite, provide:

- exact command;
- exit code;
- duration;
- pass/fail/skip count;
- coverage;
- warnings;
- generated artifacts;
- whether the result matches the expected baseline.

6. Skips and warnings

The previous backend run reported 3 skipped tests and 8 warnings.

List each skip and warning individually and classify it as:

- intentional and documented;
- environment-dependent;
- deprecated behavior;
- security concern;
- functional concern;
- unknown.

State whether any skip or warning should block Phase 0 closure.

Do not suppress or fix them during this audit.

7. Evidence document audit

Verify the existence and completeness of:

- PHASE_0_THREAT_MODEL_DRAFT.md
- PHASE_0_DATA_FLOW_DIAGRAM.md
- PHASE_0_ENVIRONMENT_MATRIX.md
- PHASE_0_DEFINITION_OF_DONE.md
- PHASE_0_FINAL_APPROVAL_HANDOFF.md
- branch-protection/required-check documentation
- golden baseline evidence
- OpenAI/Managed Identity compatibility rationale
- rollback instructions

For each document report:

- exact path;
- current status;
- whether it is included in PR #7;
- obvious placeholders/TODOs;
- whether it references the current implementation;
- missing evidence or approvals.

8. model_used: not_observed

Search for every relevant occurrence of:

model_used: not_observed

Report:

- file/log/test location;
- execution path;
- whether it is a product/runtime defect, telemetry limitation, or evidence limitation;
- whether it affects security, authorization, result correctness, or only observability;
- whether Phase 0 governance currently defines it as blocking.

Do not implement a fix.

Recommend one disposition:

A. Phase 0 release blocker
B. Accepted non-blocking follow-up with an issue, owner, and target phase

Support the recommendation with repository evidence.

9. Security boundary validation

Confirm, without changing code:

- hosted environments reject unsafe mock authentication;
- Azure integrations preserve Managed Identity;
- no API keys or new secrets were introduced;
- no custom unsupported application-to-application authentication was introduced;
- authentication and authorization protections included in Phase 0 remain intact;
- no unrelated Phase 1 architecture was added.

10. Final output

Return one complete Markdown report in the chat. Do not write the report into the repository.

Use this structure:

# Phase 0 Closure Audit

## 1. Executive result
READY FOR MANUAL CLOSURE / NOT READY

## 2. Repository identity
## 3. Scope integrity
## 4. Automated validation
## 5. Skips and warnings
## 6. CODEOWNERS status
## 7. Candidate required checks
## 8. Evidence documents
## 9. model_used disposition
## 10. Security boundary
## 11. Remaining manual actions
## 12. Blocking findings
## 13. Non-blocking follow-ups
## 14. Exact evidence/screenshots the repository administrator must provide
## 15. Final closure recommendation

For every gate use exactly one status:

- PASS
- MANUAL ACTION REQUIRED
- BLOCKED
- NOT APPLICABLE

End with:

- Current HEAD SHA
- Actual changed-file count
- Tracked working tree clean: YES/NO
- Unrelated files in PR: YES/NO
- Automated validation complete: YES/NO
- Ready to configure repository controls: YES/NO
- Safe to mark PR ready for review: YES/NO
- Safe to merge now: YES/NO
