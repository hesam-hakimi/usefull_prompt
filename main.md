Build Phase 2 of the zero-install local KMAI development agent.

Prerequisite:

- .kmai-dev-agent already exists at the repository root.
- run.sh probe returns exactly KMAI_DEV_AGENT_AUTH_OK.
- kmai_client.py already reuses the existing KMAI model authentication.
- the folder is locally ignored through the Git common info/exclude file.

Do not modify any tracked repository file.
Do not modify .gitignore.
Do not install anything.
Do not commit, push, create branches, rebase, merge, retarget PRs, deploy,
or alter the dirty asktd_v2 checkout.

All implementation in this task must remain inside:

.kmai-dev-agent/

Goal:

Create a safe local repository-development runner that uses the KMAI model
and supports:

- plan
- audit
- propose
- apply
- verify

The model itself must receive only read-only repository tools.

It must never receive arbitrary shell access.

────────────────────────────────────
1. Required command interface
────────────────────────────────────

Implement these commands:

./.kmai-dev-agent/run.sh probe

./.kmai-dev-agent/run.sh plan \
  --workspace <absolute-clean-worktree-path> \
  --task <task-markdown-path>

./.kmai-dev-agent/run.sh audit \
  --workspace <absolute-clean-worktree-path> \
  --task <task-markdown-path>

./.kmai-dev-agent/run.sh propose \
  --workspace <absolute-clean-worktree-path> \
  --task <task-markdown-path> \
  --allow-path <repository-relative-path> \
  [--allow-path <another-path> ...]

./.kmai-dev-agent/run.sh apply \
  --workspace <absolute-clean-worktree-path> \
  --proposal <proposal-id>

./.kmai-dev-agent/run.sh verify \
  --workspace <absolute-worktree-path> \
  --task <task-markdown-path> \
  [--profile <approved-test-profile> ...]

Rules:

- `plan` and `audit` are strictly read-only.
- `propose` is read-only and only creates a patch proposal under
  .kmai-dev-agent/results/.
- `apply` performs no model call and applies only an explicitly selected,
  previously generated proposal.
- `verify` may run only named approved test profiles.
- no command may commit, push, rebase, merge, deploy, or change PR metadata.

────────────────────────────────────
2. Workspace containment
────────────────────────────────────

Every plan/audit/propose/apply/verify command must require an explicit
absolute workspace path.

Validate:

- workspace exists;
- workspace is a Git worktree;
- git rev-parse --show-toplevel equals the resolved workspace root;
- its Git common directory is the same as the control repository;
- all requested paths resolve inside the selected workspace;
- symlinks and `..` cannot escape the workspace;
- .git and sensitive files cannot be read or written.

By default:

- plan, audit and propose require a clean worktree;
- verify may run after an explicitly applied patch;
- current dirty asktd_v2 checkout must be rejected;
- provide no implicit/default workspace.

Do not let the model choose a workspace.

────────────────────────────────────
3. Model tool loop
────────────────────────────────────

Reuse kmai_client.py.

Use the API/tool-calling interface already supported by KMAI.

Preferred:

- existing Responses/function-tool interface if supported by current KMAI.

Acceptable fallback:

- existing chat-completions function calling;
- or a strict bounded JSON action protocol if the current deployment does
  not expose native tool calling.

Do not install or upgrade the OpenAI SDK.

Implement a bounded iterative loop:

- system policy;
- user task;
- model tool request;
- safe local tool execution;
- sanitized bounded tool result;
- repeat until final response or maximum rounds.

Defaults:

- maximum model rounds: 10;
- maximum tool calls: 50;
- maximum lines returned per file read: 400;
- maximum search matches: 50;
- maximum individual tool output: 16,000 characters;
- maximum cumulative tool output: 120,000 characters;
- bounded model output;
- no web access.

Record token usage only when safely returned by the existing client.
Do not store raw authentication information.

────────────────────────────────────
4. Read-only tools available to the model
────────────────────────────────────

Implement only:

1. list_files
   - bounded;
   - tracked files by default;
   - optional safe glob;
   - no .git or denied paths.

2. search_text
   - bounded literal search;
   - optional safe regex only if implemented with strict size limits;
   - path filters;
   - no denied files.

3. read_file
   - repository-relative path;
   - start/end line;
   - bounded output;
   - path containment.

4. git_status
   - safe status summary.

5. git_diff
   - modes:
     - stat
     - name-status
     - bounded unified diff
   - no external diff drivers.

6. git_log
   - bounded commit count;
   - safe formatting.

7. git_show_file
   - tracked file at a specific verified ref;
   - bounded;
   - no arbitrary object dumping.

8. run_test_profile
   - exact named profiles from policy.json;
   - no arbitrary command or arguments supplied by the model.

There must be no tools for:

- arbitrary shell;
- environment dumping;
- reading credentials;
- write_file;
- delete_file;
- commit;
- push;
- branch creation;
- checkout;
- rebase;
- merge;
- PR modification;
- deployment.

Use subprocess with:

- shell=False;
- explicit argument arrays;
- selected workspace as cwd;
- timeouts;
- bounded stdout/stderr;
- sanitized output.

────────────────────────────────────
5. Sensitive information controls
────────────────────────────────────

Enforce policy deny rules before every read/search/show operation.

Do not expose:

- .env files;
- .env.github;
- tokens;
- access headers;
- private keys;
- certificates;
- Git credentials;
- connection strings;
- cookies;
- shell history;
- Azure access tokens;
- credential caches.

Sanitize tool output and logs for common secret patterns, including:

- Authorization: Bearer ...
- ghp_...
- ghs_...
- github_pat_...
- private-key blocks;
- SAS query signatures;
- obvious API-key assignments;
- database connection-string passwords.

Do not claim sanitization makes it acceptable to read a denied file.
Denied files must never be opened.

────────────────────────────────────
6. Test profiles
────────────────────────────────────

Inspect repository test documentation and the verified KMAI Python
environment.

Add exact approved profiles to policy.json, using the selected Python
executable and `-m pytest`.

At minimum, where these tests exist:

- git-diff-check
- registry-cache-focused
- registry-contract-focused
- semantic-plan-focused
- golden-baseline
- backend-full

A test profile must contain a fixed argument array.

The model may choose only the profile name.

It may not append arbitrary pytest options, file paths, commands, shell
operators, redirects, or environment assignments.

Use practical timeouts and truncate output while preserving:

- exit code;
- pass/fail/skip counts;
- final error summary;
- coverage summary when present.

Full raw logs may be stored locally under logs/ after sanitization, but
only bounded summaries may be returned to the model.

────────────────────────────────────
7. Plan and audit outputs
────────────────────────────────────

Write timestamped Markdown results under:

.kmai-dev-agent/results/

Each result must include:

- mode;
- task path;
- workspace;
- branch;
- starting HEAD;
- clean/dirty status;
- model/deployment configured;
- rounds/tool-call count;
- final response;
- token usage when available;
- confirmation that no tracked file was changed.

Store a compact sanitized event log under:

.kmai-dev-agent/logs/

Do not store entire prompts repeatedly when a task reference is sufficient.

────────────────────────────────────
8. Proposal workflow
────────────────────────────────────

`propose` must not modify the selected worktree.

It may read only the explicitly selected clean worktree.

The user must supply one or more `--allow-path` values.

The final model response must contain:

- concise implementation summary;
- assumptions/blockers;
- one unified Git patch.

Extract and validate the patch.

Reject a proposal if:

- any path lies outside the selected workspace;
- any path is not in the explicit allow-path list;
- it touches .git;
- it touches a denied or sensitive file;
- it touches .kmai-dev-agent in the target workspace;
- it includes binary patches;
- it exceeds configured changed-file or line limits;
- it contains absolute paths or `../`;
- git apply --check fails;
- the target HEAD or worktree state changed during proposal generation.

Save:

results/proposals/<proposal-id>.patch
results/proposals/<proposal-id>.json
results/proposals/<proposal-id>.md

The JSON manifest must include:

- proposal ID;
- workspace real path;
- Git common-directory identity;
- base HEAD SHA;
- required clean status;
- allowed paths;
- patch SHA-256;
- changed paths;
- additions/deletions;
- created timestamp;
- model/deployment identifier;
- task path.

Print the exact review and apply commands after proposal creation.

────────────────────────────────────
9. Explicit apply workflow
────────────────────────────────────

`apply` must not call the model.

Before applying:

- verify the proposal manifest;
- verify patch SHA-256;
- verify workspace/common Git directory;
- verify current HEAD matches proposal base HEAD;
- require the worktree to still be clean;
- revalidate every patch path;
- rerun git apply --check;
- show a concise patch summary;
- require explicit CLI confirmation unless `--yes` is supplied directly by
  the human.

Apply using safe Git patch application without unsafe paths.

After applying:

- run git diff --check;
- report changed paths and stat;
- do not stage;
- do not commit;
- do not push;
- do not change branch or PR metadata.

If any check fails, do not partially apply the patch.

────────────────────────────────────
10. Verify workflow
────────────────────────────────────

`verify` may operate on the intentionally modified target worktree.

It must:

- capture branch and HEAD;
- capture exact diff;
- run only explicitly selected approved profiles;
- run git diff --check;
- produce a sanitized Markdown result;
- state whether the tests changed tracked files;
- never commit, push, merge, deploy, or clean the worktree.

────────────────────────────────────
11. Token and context efficiency
────────────────────────────────────

Implement:

- bounded file reads;
- focused searches;
- summarized test output;
- no repeated full Git diffs unless requested;
- a compact session summary under state/;
- no automatic inclusion of prior task histories;
- optional `--resume <result-id>` that loads only the prior compact summary,
  not the full tool transcript.

Do not send entire repository files or full terminal logs to the model when
a relevant bounded range is sufficient.

────────────────────────────────────
12. Smoke test
────────────────────────────────────

Create:

.kmai-dev-agent/tasks/smoke-audit.md

Content:

Perform a read-only repository smoke audit.

Return only:
1. Workspace root
2. Branch
3. HEAD SHA
4. Clean or dirty
5. Count of tracked Python files
6. Whether docs/adr/0002-phase2c-governed-semantic-plan-validator.md exists
7. Confirmation that no file was changed

Do not run tests.
Do not inspect secret or environment files.

Find an existing clean worktree belonging to this repository.

Do not use the dirty asktd_v2 checkout.

Run:

./.kmai-dev-agent/run.sh audit \
  --workspace <clean-worktree> \
  --task .kmai-dev-agent/tasks/smoke-audit.md

Expected:

- successful model/tool loop;
- result Markdown created;
- selected worktree remains clean;
- control checkout's tracked status remains unchanged.

Do not create another worktree merely for this smoke test.

If no clean worktree exists, skip only the smoke audit and report the
blocker.

────────────────────────────────────
13. Documentation
────────────────────────────────────

Update only the locally ignored .kmai-dev-agent/README.md.

Include exact examples for:

- probe;
- plan;
- audit;
- propose;
- reviewing a patch;
- apply;
- verify;
- locating results/logs;
- KMAI_PYTHON override;
- adding a local fixed test profile safely.

Clearly state:

- the model never receives arbitrary shell;
- propose does not edit source;
- apply requires explicit human action;
- no commit/push/merge/deploy functionality exists;
- all work should target isolated clean worktrees.

────────────────────────────────────
14. Final validation
────────────────────────────────────

Run:

- Python syntax compilation for local agent scripts;
- probe;
- smoke audit when a clean worktree exists;
- proposal parser unit/self-tests using temporary fake workspaces outside
  the repository;
- path traversal rejection tests;
- sensitive-file rejection tests;
- invalid patch rejection tests;
- changed-HEAD rejection tests.

Do not run a proposal against real source files during bootstrap.

Confirm:

- .kmai-dev-agent remains ignored;
- no local-agent file is tracked;
- no tracked repository file changed;
- pre-existing dirty status is unchanged;
- no branch/PR/worktree/deployment was changed.

Return:

1. PASS or FAIL
2. Exact locally created/modified files
3. Supported commands
4. Workspace containment result
5. Auth/model interface reused
6. Approved test profiles
7. Smoke-audit command and result path
8. Security self-test results
9. Before/after Git-status comparison
10. Any blocker
11. Confirmation that nothing was installed
12. Confirmation that no tracked file, branch, PR, secret, or deployment
    was changed
    ────────────────────────────────────
MANDATORY RUNNER EXECUTION AND SELF-TEST
────────────────────────────────────

Do not finish by giving the user a list of setup or validation commands.

You must execute the runner bootstrap and all safe smoke tests yourself.

1. Resolve the control repository root and use absolute paths throughout.

2. Execute:

   .kmai-dev-agent/run.sh probe

   Verify the exact output is:

   KMAI_DEV_AGENT_AUTH_OK

3. Execute:

   git worktree list --porcelain

4. Discover an existing clean worktree belonging to the same Git common
   directory.

   Reject:

   - the dirty asktd_v2 checkout;
   - any worktree with tracked or untracked changes;
   - any worktree from another repository;
   - any path that cannot be resolved safely.

5. Do not use `export KMAI_WORKSPACE=...`.

   Pass the discovered absolute worktree path directly to every command.

6. Create the smoke task yourself at:

   .kmai-dev-agent/tasks/smoke-audit.md

7. Execute the smoke audit yourself:

   .kmai-dev-agent/run.sh audit \
     --workspace "<resolved-clean-worktree-path>" \
     --task "<absolute-path-to-smoke-audit.md>"

8. Verify:

   - a result Markdown file was created;
   - the result contains the expected workspace, branch and HEAD;
   - the selected worktree remains clean;
   - the control checkout's tracked status is unchanged;
   - no sensitive file was read;
   - no branch or PR changed.

9. Create a temporary fake Git repository outside the real repository and
   run all proposal/apply safety self-tests there, including:

   - valid proposal generation;
   - path traversal rejection;
   - absolute-path rejection;
   - denied-file rejection;
   - binary patch rejection;
   - patch hash mismatch rejection;
   - changed-HEAD rejection;
   - dirty-worktree rejection;
   - git apply --check failure;
   - apply without confirmation rejection;
   - successful apply after explicit test confirmation;
   - confirmation that apply does not stage or commit.

10. Run every approved test-profile parser self-test.

11. Run Python syntax compilation for every local-agent Python file.

12. Run bash syntax validation for run.sh.

13. Re-run:

    git status --porcelain=v1 --untracked-files=all
    git ls-files -- .kmai-dev-agent
    git check-ignore -v .kmai-dev-agent/README.md

14. Compare repository status against the baseline.

15. Do not instruct the user to execute any bootstrap, probe, smoke-audit,
    containment or security self-test command.

The only actions that must remain human-controlled are:

- choosing a real implementation task;
- reviewing a real generated patch;
- explicitly applying a real patch to a source worktree;
- committing;
- pushing;
- creating or changing a PR;
- merging;
- deploying.

Do not run `propose` or `apply` against real application source files
during bootstrap.

Return:

1. Every safe command you executed
2. Sanitized exit codes and outputs
3. Discovered clean smoke-test worktree
4. Smoke-audit result path
5. Proposal/apply self-test results
6. Sensitive-path and traversal test results
7. Before/after repository-status comparison
8. Confirmation that no manual setup or validation command remains
9. Exact human-gated actions that were intentionally not executed


    
