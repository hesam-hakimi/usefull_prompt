Upgrade the existing local `.kmai-dev-agent` into a bounded autonomous
coding agent with repository intelligence, multi-role reasoning,
automatic implementation, test-and-repair loops, and independent review.

This is Phase 3 of the local KMAI development-agent project.

The existing local agent has already been bootstrapped successfully and
its authentication probe passes.

The existing commands may include:

- probe
- plan
- audit
- propose
- apply
- verify

Preserve all working commands and backward compatibility.

The goal is to add a Codex-like single-task experience:

User supplies one task
→ Agent investigates the repository
→ Agent builds an evidence-backed plan
→ Agent asks once for scope approval
→ Agent implements the approved plan
→ Agent runs focused tests
→ Agent diagnoses and repairs failures
→ Agent runs regression tests
→ Independent reviewer evaluates the final diff
→ Agent produces a final report

This implementation must remain entirely inside:

.kmai-dev-agent/

Do not modify any tracked repository file.

────────────────────────────────────
0. Non-negotiable constraints
────────────────────────────────────

Do not install anything:

- no pip install
- no npm install
- no apt, yum, dnf or snap
- no binary download
- no Codex CLI
- no new VS Code extension

Do not modify:

- tracked repository files
- tracked .gitignore
- application source code
- application tests
- docs
- deployment files
- branches
- worktrees
- pull requests
- Git configuration other than the existing local info/exclude entry

Do not:

- commit
- push
- force-push
- rebase
- merge
- deploy
- modify PR metadata
- read secrets
- print tokens
- change authentication
- start Phase 2D application implementation

The only allowed implementation changes are inside the already ignored:

.kmai-dev-agent/

You must execute all safe bootstrap, validation and self-test commands
yourself.

Do not finish by giving setup commands to the user.

────────────────────────────────────
1. Verify the existing local agent
────────────────────────────────────

Before editing:

1. Resolve the repository root.
2. Resolve the Git common directory.
3. Capture:
   - current branch
   - current HEAD
   - complete porcelain Git status
   - current worktree list
4. Confirm `.kmai-dev-agent`:
   - exists;
   - is ignored;
   - contains no tracked files.
5. Run the existing probe.
6. Confirm the exact successful output:
   KMAI_DEV_AGENT_AUTH_OK
7. Inspect the current local-agent implementation.
8. Identify its existing:
   - client/auth adapter;
   - command parser;
   - policy;
   - repository tools;
   - patch proposal flow;
   - test profiles;
   - result and state formats.

Do not rewrite functioning components unnecessarily.

Extend existing abstractions where practical.

If the probe does not pass, stop with FAIL and do not continue.

────────────────────────────────────
2. Add a single autonomous `task` command
────────────────────────────────────

Add this interface:

./.kmai-dev-agent/run.sh task \
  --workspace <absolute-clean-worktree-path> \
  --task <absolute-task-markdown-path> \
  --autonomy <observe|safe>

Optional supported arguments:

--resume <task-id>
--yes
--max-repair-rounds <bounded-value>

Policy limits must cap all user-provided values.

Do not allow arbitrary command arguments through this interface.

Required modes:

A. observe

- repository investigation;
- search;
- file reading;
- planning;
- test execution using approved profiles;
- final audit;
- no source modification.

B. safe

- everything in observe;
- produce an evidence-backed implementation plan;
- determine intended changed paths;
- determine approved test profiles;
- ask once for human scope approval;
- after approval, apply validated model-generated patches;
- automatically run focused tests;
- automatically diagnose and repair failures within approved scope;
- run regression tests;
- run an independent reviewer;
- never commit, push, merge, deploy or change a PR.

`--yes` may bypass the approval prompt only when explicitly supplied by a
human.

During bootstrap, `--yes` may be used only against temporary fake
repositories, never against real KMAI source.

────────────────────────────────────
3. Implement a deterministic task state machine
────────────────────────────────────

Implement an explicit persisted state machine.

Suggested phases:

1. task_received
2. workspace_verified
3. instructions_loaded
4. repository_indexed
5. investigating
6. planning
7. awaiting_scope_approval
8. implementing
9. running_focused_tests
10. diagnosing_failure
11. repairing
12. running_regression_tests
13. reviewing
14. completed
15. blocked
16. failed

Persist the task state under:

.kmai-dev-agent/state/tasks/<task-id>/

Suggested artifacts:

task.json
task-summary.md
reasoning-state.json
plan.json
approval.json
patches/
test-results/
review/
final-report.md
events.jsonl

The state machine must:

- reject invalid phase transitions;
- be resumable;
- survive process interruption;
- detect changed workspace HEAD;
- detect changed workspace state;
- prevent applying stale patches;
- clearly distinguish BLOCKED from FAILED;
- never silently restart a completed or failed task.

Do not store private chain-of-thought.

Store only concise reviewable reasoning artifacts:

- objective;
- requirements;
- constraints;
- evidence;
- decisions;
- assumptions;
- risks;
- planned changes;
- test plan;
- blockers;
- final findings.

────────────────────────────────────
4. Repository intelligence and incremental index
────────────────────────────────────

Build an incremental local repository index under:

.kmai-dev-agent/state/repository-index/

Use only the Python standard library and existing verified tools.

Do not introduce embeddings or an external vector database in this phase.

Index tracked files only by default.

Use:

- git ls-files
- git grep
- Python ast
- safe bounded file reads
- Git metadata

Index at least:

files.json
python-symbols.json
imports.json
references.json
tests.json
instructions.json
adr-index.json
repository-summary.json
index-metadata.json

For each tracked file, record safe metadata such as:

- repository-relative path;
- language/type;
- size;
- content hash;
- last indexed HEAD;
- whether it is a test;
- symbols;
- imports;
- related documentation classification.

For Python files extract, where available:

- classes;
- functions;
- async functions;
- method names;
- signatures;
- decorators;
- imports;
- imported symbols;
- source line ranges.

Do not execute imported application modules to create the index.

Use AST parsing only.

The index must be incremental:

- unchanged files are not reparsed;
- changed/new/deleted files update the index;
- stale symbol records are removed;
- index version is explicit;
- corrupt index state can be safely rebuilt.

The index must never include:

- denied files;
- `.git`;
- `.env` content;
- credentials;
- tokens;
- private keys;
- generated secret-bearing configuration.

────────────────────────────────────
5. Add repository search and navigation tools
────────────────────────────────────

Add these bounded read-only model tools:

1. repository_overview

Return:

- major directories;
- language/file counts;
- likely application roots;
- likely test roots;
- ADR and instruction locations.

2. find_files

Support:

- bounded filename search;
- safe glob patterns;
- tracked files only;
- optional file-type filtering.

3. search_text

Use git grep or an equivalent safe fixed command.

Support:

- literal query;
- optional safe bounded regex;
- file/path filters;
- result limits;
- surrounding line context.

4. search_symbols

Search the AST index for:

- class;
- function;
- method;
- imported symbol;
- partial symbol name.

Return file and line range.

5. find_symbol_references

Use a combination of:

- AST import/reference evidence;
- bounded text search.

Clearly label results as:

- confirmed AST/import reference;
- probable text reference.

6. find_importers

Return files that import a given module or symbol.

7. find_related_tests

Use:

- naming conventions;
- imports;
- referenced symbols;
- nearby test structure;
- existing test-index evidence.

Do not fabricate certainty.

Return scored evidence with reasons.

8. read_file_range

Require:

- repository-relative path;
- start line;
- end line.

Enforce:

- maximum lines per read;
- sensitive-path denial;
- workspace containment.

9. read_symbol

Read only the indexed line range for a class/function/method, plus bounded
context.

10. read_next_chunk

Continue from a previous bounded file read without rereading the whole file.

11. git_status

12. git_diff

Support:

- name-status;
- stat;
- bounded patch;
- base-to-head comparison.

13. git_log

14. git_show_file

15. run_test_profile

Only approved fixed profiles.

No model-facing arbitrary shell tool may exist.

────────────────────────────────────
6. Instruction discovery
────────────────────────────────────

Before planning a task, automatically locate and load, in precedence order:

1. local agent policy;
2. root AGENTS.md;
3. nested AGENTS.md applicable to selected files;
4. relevant README sections;
5. relevant ADRs;
6. test instructions;
7. relevant local skills;
8. task Markdown.

Create local reusable skills under:

.kmai-dev-agent/skills/

At minimum:

repository-navigation.md
safe-autonomous-development.md
stacked-pr-workflow.md
testing-and-verification.md
security-boundary.md
api-compatibility.md
independent-review.md

Do not copy secrets or confidential runtime values into skills.

Skills must contain reusable workflow rules, not task-specific conclusions.

────────────────────────────────────
7. Evidence-first investigation
────────────────────────────────────

The Agent must not immediately propose code changes.

The investigation phase must:

1. Parse the user task.
2. Extract:
   - objective;
   - explicit requirements;
   - exclusions;
   - acceptance criteria;
   - named components;
   - risk boundaries.
3. Search instructions and ADRs.
4. Build or refresh the repository index.
5. Search relevant symbols and files.
6. Read relevant bounded ranges.
7. Find related tests.
8. Inspect current Git diff and branch state.
9. Record evidence with:
   - path;
   - line range;
   - symbol;
   - evidence summary.
10. Identify ambiguities and blockers.

The Agent must distinguish:

- evidenced fact;
- inference;
- assumption;
- product decision required.

It must not invent missing contracts.

When a product decision is required, stop with BLOCKED rather than silently
choosing behavior.

────────────────────────────────────
8. Multi-role reasoning
────────────────────────────────────

Implement three logically separate roles:

A. Planner

Responsibilities:

- investigate;
- build requirement-to-evidence traceability;
- propose exact changed paths;
- define implementation steps;
- define tests;
- identify risks and blockers.

Planner may not modify source.

B. Implementer

Responsibilities:

- receive only:
  - task;
  - approved plan;
  - relevant evidence;
  - selected file ranges;
  - approved changed paths;
- create validated unified patches;
- remain inside approved scope;
- respond to test failures.

C. Reviewer

Responsibilities:

- use a fresh model call/context;
- receive:
  - original task;
  - acceptance criteria;
  - final diff;
  - relevant contracts;
  - test evidence;
- independently inspect relevant code;
- identify missing requirements, excess scope, security risks, weak tests
  and compatibility regressions;
- return:
  PASS
  PASS_WITH_CONDITIONS
  FAIL

Do not give the Reviewer the Implementer's hidden rationale.

Provide only reviewable artifacts.

The same configured deployment may serve different roles, but each role
must use a distinct role prompt and fresh conversation state.

────────────────────────────────────
9. Reuse the existing KMAI model policy
────────────────────────────────────

Inspect and reuse the existing KMAI client and RuntimeModelPolicy or
equivalent configuration.

Do not hardcode model names that are not evidenced as available.

Create role aliases such as:

- search
- planner
- implementer
- reviewer

Map them through existing KMAI policy/configuration.

Preferred policy behavior:

- search/triage:
  lowest-cost suitable configured model;
- planner:
  complex/reasoning-capable configured model;
- implementer:
  default coding-capable configured model;
- reviewer:
  complex/reasoning-capable configured model;
- escalation:
  one bounded escalation when default implementation or review is
  inconclusive.

Record:

- requested role;
- configured model/deployment;
- actual observed model where available;
- fallback reason.

Do not create a separate authentication method.

Continue using the existing Managed Identity / Entra authentication proven
by the probe.

Do not store endpoint credentials or bearer tokens.

────────────────────────────────────
10. Structured role outputs
────────────────────────────────────

Use structured outputs when the existing KMAI model interface supports
them safely.

Otherwise use strict validated JSON.

Planner output must include:

- task_summary;
- requirements;
- exclusions;
- evidence;
- ambiguities;
- blockers;
- changed_paths;
- implementation_steps;
- test_profiles;
- acceptance_checks;
- risk_level.

Implementer output must include:

- summary;
- patch;
- paths_touched;
- assumptions;
- expected_tests.

Reviewer output must include:

- verdict;
- requirement_findings;
- scope_findings;
- security_findings;
- compatibility_findings;
- test_findings;
- required_corrections.

Reject malformed outputs.

Allow one bounded schema-repair request.

Do not execute or apply unvalidated output.

────────────────────────────────────
11. Scope approval experience
────────────────────────────────────

In safe mode, after planning, display a concise approval summary:

- objective;
- exact files to be modified;
- expected additions/deletions;
- test profiles;
- excluded scope;
- important risks;
- model-call and repair limits.

Ask once:

Proceed with this approved scope? [y/N]

After approval, the Agent may autonomously:

- generate patches;
- apply patches;
- run approved focused tests;
- diagnose failures;
- apply corrective patches;
- run regression tests;
- run independent review.

The Agent must stop and request new approval when:

- a new source path is required;
- a denied path is required;
- planned change limits would be exceeded;
- a dependency install is required;
- a tracked configuration or deployment file outside approved scope is
  required;
- a product decision is required;
- current HEAD changed;
- pre-existing user changes appeared;
- the selected branch/worktree changed.

────────────────────────────────────
12. Patch generation and application
────────────────────────────────────

The model must not receive a direct write_file or arbitrary shell tool.

Implementation remains patch-based.

For every generated patch:

1. Parse unified diff.
2. Validate every path.
3. Confirm every path is in approved scope.
4. Reject:
   - absolute paths;
   - `..`;
   - `.git`;
   - denied files;
   - binary patches;
   - symlink escape;
   - excessive size;
   - unrelated paths.
5. Run:
   git apply --check
6. Record patch SHA-256.
7. Apply atomically where possible.
8. Run:
   git diff --check
9. Record resulting diff state.

Safe-mode approval covers subsequent repair patches only when:

- they remain within originally approved paths;
- they remain within configured line-change limits;
- they address implementation or test failures for the approved task.

A repair requiring a new path must stop for renewed approval.

────────────────────────────────────
13. Checkpoints and safe rollback
────────────────────────────────────

Before initial implementation and before each repair round, record:

- HEAD SHA;
- worktree status;
- current diff hash;
- Agent-owned patch list;
- passing/failing test state.

The Agent must distinguish:

- pre-existing user diff;
- Agent-owned diff.

Never use:

git reset --hard
git clean -fd
checkout -- .
restore . across the whole worktree

Rollback may reverse only patches created by the current Agent task.

Create and validate reverse patches for Agent-owned changes.

If a repair makes the result worse:

- reverse only that repair patch;
- preserve earlier accepted Agent patches;
- preserve all user changes.

Real safe-mode tasks should start from a clean worktree.

If not clean, reject the workspace unless an explicit future policy safely
supports pre-existing changes.

────────────────────────────────────
14. Automatic test-and-repair loop
────────────────────────────────────

After implementation:

1. Run selected focused test profiles.
2. Parse:
   - exit code;
   - passed;
   - failed;
   - skipped;
   - failure locations;
   - concise traceback summary;
   - coverage where available.
3. Classify each failure:
   - implementation regression;
   - test expectation mismatch;
   - pre-existing failure;
   - environment issue;
   - inconclusive.
4. Search and read relevant code/tests.
5. Produce a root-cause summary.
6. Generate a bounded corrective patch.
7. Apply it after validation.
8. Re-run the smallest relevant tests.
9. When focused tests pass, run regression profiles.
10. Run independent review.

Policy defaults:

- maximum implementation patch rounds: 2;
- maximum repair rounds: 3;
- maximum focused test runs: 8;
- maximum regression runs: 2;
- maximum reviewer correction cycles: 1;
- maximum total model rounds: policy-bounded;
- maximum wall-clock duration: policy-bounded.

Do not retry identical failures without new evidence.

Stop with BLOCKED or FAIL when limits are reached.

────────────────────────────────────
15. Test-profile intelligence
────────────────────────────────────

Preserve existing fixed test profiles.

Add safe metadata for each profile:

- name;
- command array;
- timeout;
- category;
- estimated duration;
- applicable path patterns;
- prerequisite profiles;
- whether it modifies generated files.

The Agent may recommend profiles automatically based on:

- changed paths;
- imported modules;
- related tests;
- ADR requirements;
- existing profile mapping.

The model may select only profile names.

It may not provide arbitrary pytest arguments or shell fragments.

Always include:

- git-diff-check;
- focused tests;
- relevant parent-phase compatibility tests;
- public API compatibility tests when applicable;
- golden baseline when applicable;
- full backend suite when required by task risk level.

Do not claim a profile exists unless policy.json defines it.

────────────────────────────────────
16. Independent review and correction
────────────────────────────────────

After all required tests pass, invoke Reviewer.

Reviewer must verify:

- every acceptance criterion;
- changed-file scope;
- public API compatibility;
- security boundaries;
- no secret exposure;
- no unrelated behavior;
- test adequacy;
- deterministic behavior where required;
- documentation consistency;
- no later-phase scope.

If Reviewer returns PASS:

- complete the task.

If PASS_WITH_CONDITIONS:

- classify conditions;
- when they can be fixed within approved scope, allow one Implementer
  correction cycle;
- rerun relevant tests and review.

If FAIL:

- do not continue automatically unless the failure is a clearly bounded
  implementation defect inside approved scope and reviewer-correction
  policy allows it;
- otherwise stop.

Final task status may be:

PASS
PASS_WITH_CONDITIONS
BLOCKED
FAIL

────────────────────────────────────
17. Context and token efficiency
────────────────────────────────────

Implement strict context budgeting.

Do not send the entire repository to the model.

Use progressive context:

repository summary
→ search results
→ symbols
→ bounded file ranges
→ related tests
→ current diff
→ focused failure evidence

Defaults:

- maximum files per role call: 8;
- maximum lines per file read: 400;
- maximum search matches: 50;
- maximum individual tool output: 16,000 characters;
- maximum cumulative tool output per role: policy-bounded;
- truncate test logs while preserving failure summary;
- do not resend unchanged file content within a role session;
- cache file-range hashes;
- include previous task state only through compact summaries.

Implement:

--resume <task-id>

Resume must load only:

- task summary;
- approved plan;
- current phase;
- decision/evidence summaries;
- changed-file inventory;
- test summaries;
- latest diff hash.

Do not replay the full model transcript by default.

────────────────────────────────────
18. Sensitive-data protection
────────────────────────────────────

Apply denied-path checks before:

- indexing;
- searching;
- reading;
- Git show;
- diff generation;
- logging.

Do not open denied files even for sanitization.

Deny at minimum:

.env
.env.*
.env.github
*.pem
*.key
id_rsa*
.git-credentials
.netrc
credentials.json
token.json
.git/**
Azure credential caches
shell-history files

Sanitize allowed outputs for:

- bearer headers;
- GitHub tokens;
- SAS signatures;
- private key markers;
- obvious password assignments;
- database connection secrets.

No model prompt, task state or event log may contain access tokens.

────────────────────────────────────
19. UX and progress reporting
────────────────────────────────────

During `task`, print concise progress such as:

[1/9] Verifying workspace
[2/9] Loading instructions
[3/9] Updating repository index
[4/9] Investigating task
[5/9] Building plan
[6/9] Awaiting approval
[7/9] Implementing and testing
[8/9] Independent review
[9/9] Final report

Do not print model chain-of-thought.

Show:

- current phase;
- elapsed time;
- model role;
- bounded tool count;
- current test profile;
- repair round;
- result paths.

Final terminal output should be concise and include:

- final status;
- task ID;
- changed paths;
- tests;
- reviewer verdict;
- final-report path;
- reminder that no commit or push occurred.

────────────────────────────────────
20. Local task template
────────────────────────────────────

Create:

.kmai-dev-agent/tasks/TEMPLATE-autonomous-task.md

The user should be able to write a simple task such as:

# Objective

Implement the approved Phase 2D metadata-backed recipe pilot.

# Requirements

- Use an existing authoritative recipe convention.
- Bind a validated GovernedSemanticPlan to an approved recipe.
- Add deterministic validation and focused tests.

# Exclusions

- No SQL execution.
- No runtime routing.
- No public API.
- No authorization decisions.
- No Phase 2E work.

# Acceptance criteria

- Focused tests pass.
- Parent-phase compatibility passes.
- Golden baseline passes.
- Independent review returns PASS.

The Agent must derive repository files through investigation rather than
requiring the user to list every file.

────────────────────────────────────
21. Local documentation
────────────────────────────────────

Update only:

.kmai-dev-agent/README.md

Document the new primary UX:

./.kmai-dev-agent/run.sh task \
  --workspace /absolute/path/to/clean/worktree \
  --task /absolute/path/to/task.md \
  --autonomy safe

Explain:

- observe versus safe;
- one-time scope approval;
- automatic search and file reading;
- automatic implementation;
- automatic focused test and repair;
- independent review;
- result locations;
- resume;
- limits;
- no commit/push/merge/deploy;
- requirement for a clean isolated worktree.

Preserve documentation for the older commands.

────────────────────────────────────
22. Self-tests
────────────────────────────────────

Create comprehensive local self-tests inside `.kmai-dev-agent`.

Do not use the real KMAI source for write-mode self-tests.

Use temporary Git repositories outside the real repository.

Test at least:

Repository index:

- tracked-file inventory;
- incremental update;
- deleted file cleanup;
- Python AST symbol extraction;
- imports;
- syntax-error handling;
- test-file classification;
- denied-file exclusion;
- corrupt-index rebuild.

Search:

- file search;
- text search;
- symbol search;
- importer search;
- related-test ranking;
- bounded output;
- path denial;
- traversal rejection.

State machine:

- valid transitions;
- invalid transition rejection;
- process interruption;
- resume;
- completed-task rejection;
- changed-HEAD rejection;
- changed-worktree rejection.

Role outputs:

- valid Planner JSON;
- malformed Planner JSON;
- valid Implementer patch;
- malformed patch;
- valid Reviewer result;
- schema-repair limit;
- reviewer isolation.

Approval:

- observe mode never writes;
- safe mode stops before approval;
- explicit approval continues;
- `--yes` works only when explicitly supplied;
- new unapproved path stops execution.

Patch safety:

- absolute path rejection;
- traversal rejection;
- denied-path rejection;
- binary patch rejection;
- oversized patch rejection;
- hash mismatch;
- stale HEAD;
- dirty workspace;
- git apply check failure;
- successful atomic application;
- no staging;
- no commit.

Checkpoint/rollback:

- rollback only latest Agent patch;
- preserve earlier Agent patch;
- preserve simulated user content;
- no reset-hard use.

Test/repair:

- focused test failure diagnosis;
- bounded repair;
- successful repair;
- repeated identical failure stops;
- repair-round limit;
- regression failure;
- pre-existing failure classification.

Security:

- denied files never opened;
- secret-like output sanitized;
- token never logged;
- model tool list contains no arbitrary shell or direct write tool.

Context:

- file-read limits;
- search limits;
- cumulative limits;
- unchanged content not resent;
- resume uses compact summary.

────────────────────────────────────
23. End-to-end autonomous fake-repository test
────────────────────────────────────

Create a temporary fake Python Git repository outside the real repository.

Include:

- a small implementation defect;
- one focused test that fails;
- one unrelated passing test;
- a local AGENTS.md;
- a task requesting the bounded defect fix.

Execute the real new task command in safe mode with explicit `--yes` only
against this fake repository.

The Agent must:

1. verify the fake worktree;
2. read AGENTS.md;
3. index files;
4. search symbols;
5. find the relevant test;
6. build a plan;
7. approve via explicit test-only `--yes`;
8. generate and apply a bounded patch;
9. run the focused test;
10. repair once if the test fixture is designed to require it;
11. run regression tests;
12. invoke Reviewer;
13. produce PASS;
14. leave changes unstaged and uncommitted;
15. create a final report.

Verify the Agent:

- did not touch unrelated files;
- did not commit;
- did not push;
- did not access the real KMAI source;
- did not read denied fake secrets.

────────────────────────────────────
24. Real-repository read-only smoke test
────────────────────────────────────

Discover an existing clean worktree belonging to the KMAI repository.

Reject the dirty asktd_v2 checkout.

Create a local task asking only for:

- repository root;
- branch;
- HEAD;
- relevant AGENTS.md files;
- Python file count;
- Phase 2 ADR paths;
- confirmation that no file changed.

Run:

task --autonomy observe

against that clean real worktree.

Verify:

- repository search works;
- symbol index builds;
- task result is created;
- worktree remains clean;
- no tracked file changes;
- no branch or PR changes.

If no clean real worktree exists, report the smoke-test blocker but do not
create or modify one.

────────────────────────────────────
25. Mandatory execution and final validation
────────────────────────────────────

You must execute all safe validation commands yourself.

Run:

- existing auth probe;
- Python compilation for every local-agent Python file;
- bash syntax validation;
- all local self-tests;
- fake-repository autonomous end-to-end test;
- real-repository observe smoke test when a clean worktree exists;
- ignore verification;
- tracked-file verification;
- before/after Git-status comparison.

Do not ask the user to run these bootstrap or validation commands.

After testing, verify:

- `.kmai-dev-agent` remains ignored;
- no `.kmai-dev-agent` file is tracked;
- no tracked repository file changed;
- baseline dirty status is unchanged;
- no branch changed;
- no worktree changed;
- no PR changed;
- no package was installed;
- no credential or environment setting changed;
- no deployment occurred.

────────────────────────────────────
26. Final response
────────────────────────────────────

Return:

1. Overall result: PASS or FAIL
2. Existing architecture discovered
3. Exact local files created or modified
4. New `task` command syntax
5. Autonomy modes implemented
6. Repository-index capabilities
7. Search/navigation tools implemented
8. Planner/Implementer/Reviewer design
9. KMAI model-policy reuse
10. Approval and patch-safety behavior
11. Automatic test-and-repair behavior
12. Checkpoint and rollback behavior
13. Context/token controls
14. Self-test results
15. Fake-repository end-to-end result
16. Real-repository read-only smoke-test result
17. Probe result
18. Before/after Git-status comparison
19. Remaining limitations
20. Exact example command the user should run for the first real task
21. Confirmation that no tracked file, branch, worktree, PR, package,
    credential, environment setting or deployment was changed
22. Confirmation that no manual bootstrap or validation command remains

Do not merely describe the implementation.

Implement it, execute all safe tests, and return evidence.
