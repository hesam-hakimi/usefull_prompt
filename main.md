Build Version 1 of a zero-install local web UI for the existing autonomous
KMAI development agent.

The existing `.kmai-dev-agent` has already been implemented and validated.

Existing capabilities include:

- KMAI Managed Identity / Entra authentication
- probe
- plan
- audit
- propose
- apply
- verify
- autonomous `task` command
- observe and safe autonomy modes
- repository indexing
- file and symbol search
- Planner / Implementer / Reviewer roles
- scope approval
- patch validation
- focused tests
- bounded repair loops
- regression tests
- checkpoints and task state
- final reports
- resume support

The goal of this task is to create a Codex-like user experience around the
existing agent without replacing or duplicating its execution engine.

The user should be able to run:

./.kmai-dev-agent/run.sh ui

Then use a local web page to:

- create a task;
- select a clean Git worktree;
- select Observe or Safe mode;
- start the task;
- watch live progress;
- review and approve the implementation scope;
- inspect files, plan, diff, tests and review results;
- stop or resume a task;
- open the final report.

This is UI Version 1.

────────────────────────────────────
0. Non-negotiable constraints
────────────────────────────────────

Do not install anything:

- no pip install
- no npm install
- no apt, yum, dnf or snap
- no binary download
- no external JavaScript or CSS packages
- no React, Vue, Angular or frontend build system
- no Flask or new FastAPI dependency
- no Codex CLI
- no new VS Code extension

Use only:

- Python standard library;
- existing verified KMAI Python environment;
- existing `.kmai-dev-agent` modules;
- plain HTML;
- plain CSS;
- plain browser JavaScript.

Do not modify any tracked repository file.

Do not modify:

- application source code;
- application tests;
- tracked documentation;
- deployment files;
- tracked `.gitignore`;
- branches;
- worktrees;
- pull requests;
- Git history;
- environment settings;
- authentication configuration.

Do not:

- commit;
- push;
- force-push;
- rebase;
- merge;
- deploy;
- modify PR metadata;
- create or delete worktrees;
- read secrets;
- print Azure or GitHub credentials;
- expose model tokens to the browser;
- expose arbitrary shell execution through the UI;
- start Phase 2D application development.

All implementation changes must remain inside the already locally ignored:

.kmai-dev-agent/

Preserve all existing CLI commands and backward compatibility.

The UI must call or integrate with the existing autonomous task engine.
Do not create a second independent agent implementation.

────────────────────────────────────
1. Verify the existing agent first
────────────────────────────────────

Before editing:

1. Resolve the repository root.
2. Resolve the Git common directory.
3. Capture:
   - current branch;
   - current HEAD;
   - full porcelain Git status;
   - current worktree list.
4. Confirm `.kmai-dev-agent`:
   - exists;
   - is locally ignored;
   - contains no tracked files.
5. Run:
   ./.kmai-dev-agent/run.sh probe
6. Confirm exact output:
   KMAI_DEV_AGENT_AUTH_OK
7. Run the existing local-agent self-tests.
8. Confirm the existing autonomous fake-repository test still passes.
9. Inspect:
   - run.sh;
   - agent_runner.py;
   - autonomous_task.py;
   - policy.json;
   - kmai_client.py;
   - task state format;
   - event log format;
   - approval format;
   - task resume behavior;
   - result and artifact locations.

Do not rewrite working components unnecessarily.

Extend the existing task state machine and event format only where the UI
requires a stable machine-readable interface.

If the probe or existing agent self-tests fail, stop with FAIL and do not
build the UI.

────────────────────────────────────
2. Version 1 product boundary
────────────────────────────────────

UI Version 1 must support:

- one active task at a time;
- task history;
- task creation;
- worktree selection;
- Observe mode;
- Safe mode;
- live progress;
- one-time scope approval;
- rejection of proposed scope;
- Stop;
- Resume when safe;
- Plan view;
- Activity view;
- evidence/files-read view;
- changed-file list;
- diff view;
- test-results view;
- Reviewer verdict;
- final report;
- token/model usage when safely available.

UI Version 1 must NOT support:

- multiple parallel active agents;
- arbitrary chat follow-ups;
- worktree creation or deletion;
- branch creation;
- commit;
- push;
- PR creation or modification;
- merge;
- deploy;
- arbitrary terminal access;
- arbitrary command input;
- arbitrary local-file browsing;
- file uploads;
- editing application files directly in the browser;
- viewing secrets;
- public network exposure.

Document these Version 1 boundaries.

────────────────────────────────────
3. Local UI architecture
────────────────────────────────────

Create or extend only local ignored files such as:

.kmai-dev-agent/
├── ui_server.py
├── ui_protocol.py                  if useful
├── ui/
│   ├── index.html
│   ├── app.js
│   └── styles.css
├── ui_self_tests.py
├── run.sh
├── autonomous_task.py             only when integration changes are needed
├── policy.json                    only for bounded UI policy
└── README.md

Reuse existing files and abstractions where appropriate.

Do not create a second state store if the current task state can be safely
extended.

The server must use Python standard-library HTTP facilities, such as:

- http.server
- ThreadingHTTPServer
- urllib
- json
- subprocess
- threading
- secrets
- hashlib
- hmac
- pathlib
- signal

Do not use an application production server.

────────────────────────────────────
4. UI launch command
────────────────────────────────────

Add:

./.kmai-dev-agent/run.sh ui

Supported options:

./.kmai-dev-agent/run.sh ui \
  --host 127.0.0.1 \
  --port 8765

Rules:

- host must default to 127.0.0.1;
- reject 0.0.0.0;
- reject non-loopback host values;
- allow `--port 0` only for automated self-tests;
- validate the port;
- use the verified KMAI Python executable;
- use set -euo pipefail;
- do not activate or modify shell profiles;
- do not auto-open a browser on the remote Linux server.

On startup print a concise message such as:

KMAI Development Agent UI started.

Remote bind:
127.0.0.1:8765

Use the VS Code Ports view to forward port 8765, then open:

http://127.0.0.1:8765/#token=<ephemeral-session-token>

The URL token must be ephemeral and valid only for the running UI process.

Do not persist the plaintext UI token to disk.

────────────────────────────────────
5. UI session authentication
────────────────────────────────────

Generate a strong ephemeral UI session token using the Python `secrets`
module.

Requirements:

- token exists only in server process memory;
- token expires when the UI server exits;
- token is never sent to the KMAI model;
- token is never written to logs;
- token is never placed in task files;
- token is never stored in localStorage;
- token is not a model or Azure credential.

Use a URL fragment:

#token=<value>

The browser JavaScript must:

1. read the token from the URL fragment;
2. store it only in `sessionStorage`;
3. immediately remove it from the visible URL using history.replaceState;
4. send it to API calls using:

   Authorization: Bearer <token>

Do not use authentication cookies.

All API endpoints except the minimal static bootstrap page and a safe
health response must require the bearer token.

Use constant-time comparison such as `hmac.compare_digest`.

────────────────────────────────────
6. Network and browser security
────────────────────────────────────

The server must:

- bind only to loopback;
- serve no directory listing;
- disable CORS;
- reject unsupported HTTP methods;
- validate Host headers;
- accept only localhost / 127.0.0.1 host forms;
- enforce JSON content types for write requests;
- enforce request-body size limits;
- return safe errors without stack traces;
- never expose filesystem paths unnecessarily;
- never expose environment values;
- never expose model endpoint credentials.

Add security headers:

- Content-Security-Policy
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- Referrer-Policy: no-referrer
- Cache-Control: no-store
- Permissions-Policy with unnecessary browser features disabled

Recommended CSP:

default-src 'self';
script-src 'self';
style-src 'self';
connect-src 'self';
img-src 'self' data:;
font-src 'self';
object-src 'none';
frame-ancestors 'none';
base-uri 'none';
form-action 'self';

Do not load:

- external fonts;
- external scripts;
- CDN assets;
- analytics;
- telemetry;
- third-party images.

Do not use eval or Function constructors.

Do not render model or repository content using unsafe innerHTML.

Use textContent or a properly escaped local rendering function.

────────────────────────────────────
7. Worktree discovery and selection
────────────────────────────────────

Provide an API and UI for enumerating existing Git worktrees belonging to
the same Git common directory.

Use:

git worktree list --porcelain

For each worktree return only safe information:

- generated worktree ID;
- resolved path;
- branch;
- HEAD;
- clean or dirty;
- control checkout indicator;
- selectable true/false;
- safe rejection reason.

The UI must show:

- clean worktrees as selectable;
- dirty worktrees as disabled;
- the control checkout as disabled;
- worktrees from another repository as excluded.

The browser must send a worktree ID, not an arbitrary filesystem path.

The server must resolve the ID back to the previously verified canonical
worktree.

Before every task start, approval, resume or artifact operation, reverify:

- worktree still exists;
- same Git common directory;
- branch has not unexpectedly changed;
- HEAD has not unexpectedly changed;
- clean-state requirement is satisfied.

UI Version 1 must not create, delete, prune or modify a worktree.

────────────────────────────────────
8. Task creation experience
────────────────────────────────────

The UI must have a `New Task` action.

Provide:

- Title field;
- Markdown task editor;
- Worktree selector;
- Autonomy selector:
  - Observe
  - Safe
- Start button.

Optionally provide a button to load the existing autonomous task template.

Task title limits:

- non-empty;
- bounded length;
- safe characters or safe escaped display.

Task Markdown limits:

- bounded size;
- no filesystem path interpretation;
- stored only under:
  .kmai-dev-agent/tasks/

Generate a safe local filename and task ID.

The browser must not be allowed to choose an arbitrary task-file path.

Task creation must not start execution until the user presses Start.

────────────────────────────────────
9. Primary UI layout
────────────────────────────────────

Create a modern, accessible dark interface named:

KMAI Development Agent

Do not copy OpenAI or Codex branding.

Suggested layout:

┌──────────────────────────────────────────────────────────────────┐
│ KMAI Development Agent      Model Connected ●   Stop   Refresh  │
├────────────────┬────────────────────────────────┬────────────────┤
│ TASKS          │ CURRENT TASK                   │ CONTEXT        │
│                │                                │                │
│ task history   │ task title / objective         │ worktree       │
│ status         │ autonomy                       │ branch         │
│ + New Task     │ progress                       │ HEAD           │
│                │ approval card                  │ clean/dirty     │
│                │                                │ model role      │
├────────────────┴────────────────────────────────┴────────────────┤
│ Activity | Plan | Evidence | Files | Diff | Tests | Review | Final│
└──────────────────────────────────────────────────────────────────┘

Required areas:

A. Header

- agent connection state;
- UI server state;
- current task state;
- Refresh;
- Stop when applicable.

B. Task sidebar

- task title;
- status;
- autonomy mode;
- created time;
- active indicator;
- `New Task`.

C. Current-task panel

- objective;
- worktree;
- branch;
- HEAD;
- autonomy;
- elapsed time;
- progress phase;
- repair round;
- tool-call count;
- model role when available.

D. Progress timeline

Display the existing task phases, such as:

- workspace verified;
- instructions loaded;
- repository indexed;
- investigating;
- planning;
- awaiting approval;
- implementing;
- focused tests;
- repairing;
- regression tests;
- reviewing;
- completed / blocked / failed / cancelled.

E. Tabs

- Activity
- Plan
- Evidence
- Changed Files
- Diff
- Tests
- Review
- Final Report

The interface must work on a normal desktop width and remain usable at
smaller widths.

Use accessible labels, keyboard focus and sufficient contrast.

────────────────────────────────────
10. Live progress
────────────────────────────────────

Use safe polling for Version 1.

Do not require WebSockets or external libraries.

The browser may poll approximately once per second for:

- task snapshot;
- new events after the last event sequence;
- approval status;
- process status.

Provide monotonically increasing event sequence IDs.

Events must contain sanitized, concise information such as:

- timestamp;
- task phase;
- role;
- action summary;
- selected tool name;
- bounded safe result summary;
- test profile;
- repair round;
- status.

Do not expose:

- private reasoning;
- model chain-of-thought;
- bearer tokens;
- raw request headers;
- environment values;
- full unsanitized terminal logs;
- denied file contents.

The UI must show a clear disconnected/error state when polling fails.

────────────────────────────────────
11. Integration with the existing autonomous task engine
────────────────────────────────────

Do not duplicate Planner, Implementer, Reviewer, patching or testing logic
inside the UI server.

The UI server must invoke the existing autonomous task engine.

Use a safe subprocess with:

- shell=False;
- explicit argument array;
- verified executable;
- verified worktree;
- verified task file;
- bounded environment;
- start_new_session=True where process-group ownership is required;
- sanitized local logs.

Extend the task command with an internal machine-readable UI mode only if
required.

Examples of internal integration mechanisms:

- existing persisted task state;
- events.jsonl;
- task.json;
- plan.json;
- approval.json;
- cancellation marker;
- final-report.md.

Do not depend on parsing human-oriented terminal text when structured state
already exists.

The UI server must only manage processes that it launched.

Persist task PID metadata safely but verify ownership before signaling any
process.

Only one active task is allowed in Version 1.

Attempting to start a second task must return a clear conflict response.

────────────────────────────────────
12. Safe-mode scope approval
────────────────────────────────────

In Safe mode, the task must stop at the existing:

awaiting_scope_approval

phase.

Display an approval card containing:

- objective;
- exact proposed changed paths;
- expected change size when available;
- selected test profiles;
- exclusions;
- risks;
- assumptions;
- blockers;
- current worktree;
- current HEAD;
- plan hash.

Buttons:

- Reject
- Approve and Continue

Approval must be bound to:

- task ID;
- plan SHA-256;
- workspace identity;
- HEAD SHA;
- exact changed-path list;
- exact test-profile list;
- approval timestamp.

Do not approve using `--yes` from the UI server.

The UI must record an explicit human approval action.

Before accepting approval, the server must reverify:

- task is still awaiting approval;
- plan hash is unchanged;
- HEAD is unchanged;
- worktree state is unchanged;
- changed paths and test profiles match the displayed plan.

If the plan changes, the old approval becomes invalid and the UI must
request a new approval.

Reject must store a safe rejection decision and stop the task without
modifying source.

────────────────────────────────────
13. Stop and resume
────────────────────────────────────

Provide a Stop action.

Stop must:

1. display a browser confirmation;
2. write a cancellation request for the active task;
3. allow the task to exit at a safe checkpoint;
4. send SIGTERM only to the process group launched by this UI server when
   graceful cancellation does not complete within a bounded timeout;
5. never signal an arbitrary or unverified PID;
6. never run git reset --hard or git clean;
7. preserve task evidence and checkpoints.

Add or use task states such as:

- cancel_requested
- cancelled

Resume must use the existing task-resume safety contract.

Resume is allowed only if:

- task is resumable;
- workspace matches;
- HEAD matches;
- branch matches;
- current diff hash matches the stored checkpoint;
- no unexpected user change exists.

If resume is unsafe, display the exact safe blocker.

Do not allow final PASS or FAIL tasks to be silently restarted.

────────────────────────────────────
14. Task history
────────────────────────────────────

Read task history from the existing local task-state directory.

Show:

- title;
- task ID;
- autonomy;
- state;
- created time;
- last update time;
- worktree branch;
- final verdict if available.

Selecting a task must display its persisted artifacts even when it is no
longer active.

Do not allow task deletion in Version 1.

Do not allow the browser to enumerate arbitrary directories.

────────────────────────────────────
15. Activity and evidence views
────────────────────────────────────

Activity tab:

- show sanitized ordered events;
- display phase, time, role and concise action;
- support auto-scroll toggle;
- do not show private reasoning.

Evidence tab:

- requirement/evidence summaries;
- files and symbols read;
- file path;
- bounded line range;
- reason the file was relevant;
- evidenced fact vs inference vs assumption labels.

Do not expose denied files or secret-like content.

────────────────────────────────────
16. Plan view
────────────────────────────────────

Display structured Planner output:

- task summary;
- requirements;
- exclusions;
- evidence;
- ambiguities;
- blockers;
- changed paths;
- implementation steps;
- test profiles;
- acceptance checks;
- risk level.

Use safe escaped rendering.

Do not allow plan content to execute HTML.

Show the plan hash used by approval in a shortened safe form.

────────────────────────────────────
17. Changed-files and diff views
────────────────────────────────────

Changed Files tab must show:

- path;
- added/modified/deleted/renamed status;
- additions;
- deletions;
- purpose when available.

Diff tab:

- file selector;
- bounded unified diff;
- line additions and deletions styled differently;
- no external syntax-highlighting library;
- no unbounded full-repository diff;
- no external diff driver;
- no arbitrary ref or path supplied by the browser.

The server must derive the changed-file allow-list from verified task/Git
state.

The browser may request a diff only for a path already present in that
verified changed-file list.

Reject traversal, absolute paths and denied paths.

Render all diff text using textContent or escaped nodes.

────────────────────────────────────
18. Test view
────────────────────────────────────

Display:

- test profile name;
- state:
  - pending
  - running
  - passed
  - failed
  - skipped
- start/end time;
- exit code;
- passed/failed/skipped counts;
- coverage summary;
- concise failure summary;
- repair round associated with the failure.

Do not expose entire raw test logs by default.

Provide a bounded sanitized details view only from existing sanitized test
artifacts.

Do not allow the browser to submit arbitrary test commands or pytest
arguments.

────────────────────────────────────
19. Reviewer and final-report views
────────────────────────────────────

Review tab must show:

- Reviewer verdict;
- requirement findings;
- scope findings;
- security findings;
- compatibility findings;
- test findings;
- required corrections.

Final Report tab must show:

- final status;
- objective;
- changed paths;
- focused-test result;
- regression result;
- coverage;
- repair rounds;
- Reviewer verdict;
- remaining blockers;
- confirmation:
  - no commit;
  - no push;
  - no merge;
  - no deploy.

Provide buttons for:

- Refresh
- Copy report path
- Copy task ID

Do not add commit, push, merge or deploy buttons in Version 1.

────────────────────────────────────
20. Safe API design
────────────────────────────────────

Implement a small bounded JSON API.

Possible endpoints:

GET  /api/health
GET  /api/worktrees
GET  /api/tasks
POST /api/tasks
GET  /api/tasks/<task-id>
POST /api/tasks/<task-id>/start
POST /api/tasks/<task-id>/approve
POST /api/tasks/<task-id>/reject
POST /api/tasks/<task-id>/stop
POST /api/tasks/<task-id>/resume
GET  /api/tasks/<task-id>/events?after=<sequence>
GET  /api/tasks/<task-id>/plan
GET  /api/tasks/<task-id>/evidence
GET  /api/tasks/<task-id>/files
GET  /api/tasks/<task-id>/diff?file=<verified-file-id>
GET  /api/tasks/<task-id>/tests
GET  /api/tasks/<task-id>/review
GET  /api/tasks/<task-id>/final

Exact endpoint names may follow the existing architecture, but the
capability boundary must remain the same.

Requirements:

- validate task IDs with a strict regex;
- use generated worktree IDs instead of browser paths;
- validate JSON schemas manually;
- limit request sizes;
- return consistent JSON error objects;
- do not return Python stack traces;
- do not expose arbitrary artifact paths;
- do not serve raw files by user-supplied path;
- do not expose arbitrary command execution.

All state-changing endpoints require bearer authentication.

Use appropriate status codes:

- 200 success;
- 201 created;
- 400 invalid input;
- 401 missing/invalid session token;
- 404 unknown task/artifact;
- 409 invalid task state or second active task;
- 413 request too large;
- 500 sanitized internal error.

────────────────────────────────────
21. UI policy additions
────────────────────────────────────

Update only the local policy file as required.

Add bounded UI limits such as:

- maximum task title length;
- maximum task Markdown length;
- maximum API body size;
- maximum events returned per poll;
- maximum diff lines;
- maximum evidence items;
- maximum test-detail characters;
- maximum active tasks = 1;
- cancellation grace timeout;
- UI idle timeout if implemented.

Do not place credentials, endpoint values or bearer tokens in policy.json.

────────────────────────────────────
22. README update
────────────────────────────────────

Update only the locally ignored:

.kmai-dev-agent/README.md

Add a UI Version 1 section.

Document:

Start:

./.kmai-dev-agent/run.sh ui

Optional port:

./.kmai-dev-agent/run.sh ui --port 8765

User experience:

1. Start UI.
2. Forward the printed port through VS Code Ports.
3. Open the printed local URL.
4. Create a task.
5. Select a clean worktree.
6. Select Observe or Safe.
7. Start.
8. Approve the scope once in Safe mode.
9. Watch progress.
10. Inspect diff, tests and Reviewer result.
11. Commit and push manually outside the UI.

Document:

- only loopback binding;
- ephemeral UI token;
- no credentials sent to browser;
- one active task in Version 1;
- no worktree creation;
- no commit/push/merge/deploy;
- no arbitrary shell;
- clean isolated worktree requirement;
- task history and resume behavior.

Preserve all existing CLI documentation.

────────────────────────────────────
23. UI self-tests
────────────────────────────────────

Create comprehensive standard-library self-tests inside `.kmai-dev-agent`.

Do not modify real KMAI source for write-mode tests.

Test at least:

Server startup:

- loopback binding succeeds;
- 0.0.0.0 rejected;
- invalid host rejected;
- port 0 works for self-test;
- server stops cleanly;
- no lingering process.

Authentication:

- valid token accepted;
- missing token rejected;
- invalid token rejected;
- token not written to disk;
- token not included in task events/logs;
- static bootstrap cannot access protected API without token.

Security headers:

- CSP present;
- no-sniff present;
- frame denial present;
- no-store present;
- referrer policy present.

Request safety:

- invalid JSON rejected;
- oversized body rejected;
- unsupported method rejected;
- Host-header validation;
- invalid task ID rejected;
- traversal rejected;
- absolute path rejected;
- arbitrary artifact path rejected;
- denied file rejected.

Worktrees:

- same-repository clean worktree selectable;
- dirty worktree disabled;
- control checkout disabled;
- other repository excluded;
- changed HEAD detected;
- removed worktree detected.

Tasks:

- task creation;
- task title validation;
- Markdown size validation;
- task file stored only under local tasks directory;
- duplicate active task rejected;
- observe task starts;
- safe task reaches approval;
- task history loads;
- unknown task returns 404.

Approval:

- valid plan approval;
- stale plan hash rejected;
- changed HEAD rejected;
- changed worktree state rejected;
- approval against wrong task rejected;
- reject action stops task;
- plan change requires renewed approval.

Stop/resume:

- stop requests cancellation;
- only owned process can be signaled;
- arbitrary PID cannot be signaled;
- safe cancelled task artifacts preserved;
- safe resume succeeds when state matches;
- resume fails on changed HEAD;
- resume fails on changed diff;
- final-state task cannot silently restart.

Artifacts:

- activity events bounded;
- plan loads safely;
- evidence loads safely;
- changed-file list loads;
- diff restricted to verified changed files;
- tests load;
- review loads;
- final report loads;
- no denied file can be exposed as an artifact.

Frontend safety:

- no external script or stylesheet URLs;
- no eval;
- no unsafe dynamic innerHTML for task/model/repository content;
- URL-fragment token handling exists;
- sessionStorage used instead of localStorage;
- fragment removed after bootstrap;
- all API calls include bearer authorization.

────────────────────────────────────
24. End-to-end UI test on a fake repository
────────────────────────────────────

Use a temporary fake Git repository outside the real KMAI repository.

Use the existing offline model-role fixtures when appropriate.

Start the real UI server on an ephemeral loopback port.

Using Python standard-library HTTP client calls:

1. obtain the test UI session token from the server test harness;
2. list worktrees;
3. create a Safe task;
4. select the clean fake worktree;
5. start the task;
6. poll until awaiting_scope_approval;
7. fetch and verify the plan;
8. approve using the exact plan hash;
9. poll through implementation;
10. observe focused test execution;
11. observe one bounded repair when included in the fixture;
12. observe regression tests;
13. observe Reviewer PASS;
14. fetch changed files;
15. fetch a bounded diff;
16. fetch final report.

Verify:

- final task state is PASS;
- only expected fake source file changed;
- change is unstaged;
- no commit occurred;
- no push occurred;
- no worktree or branch changed;
- no denied fake secret was read;
- no second task could start simultaneously;
- UI server stops cleanly.

Do not use `--yes` to bypass the UI approval endpoint in this test.

The test must exercise the real approval API.

────────────────────────────────────
25. Real-repository read-only UI smoke test
────────────────────────────────────

Discover an existing clean KMAI worktree.

Reject the control checkout and any dirty worktree.

Start the UI server on an ephemeral loopback port.

Using the UI API:

1. create a small Observe task;
2. select the clean KMAI worktree;
3. start it;
4. poll progress;
5. fetch repository evidence;
6. fetch final report.

The task should request only:

- repository root;
- branch;
- HEAD;
- applicable AGENTS.md files;
- Python file count;
- Phase 2 ADR paths;
- confirmation that no source file changed.

Verify:

- final task state is PASS;
- worktree remains clean;
- no tracked file changed;
- no branch or PR changed;
- no write approval was requested;
- no model or Azure credential was exposed.

If no clean KMAI worktree exists, report this single smoke-test blocker
without creating or modifying a worktree.

────────────────────────────────────
26. Existing-agent regression tests
────────────────────────────────────

After UI implementation, rerun:

- authentication probe;
- existing self-tests;
- existing fake-repository autonomous E2E test;
- existing real-repository observe smoke test;
- Python compilation for every local-agent Python file;
- bash syntax validation;
- all new UI self-tests;
- fake-repository UI E2E test;
- real-repository read-only UI smoke test when possible.

Confirm existing commands still work:

- probe
- plan
- audit
- propose
- apply
- verify
- task

Do not break their syntax or behavior.

────────────────────────────────────
27. Mandatory execution
────────────────────────────────────

You must implement the UI and execute every safe validation command
yourself.

Do not finish by giving the user setup or validation commands.

During validation:

- do not leave the UI server running;
- terminate every self-test server;
- do not leave orphan task processes;
- do not leave temporary ports open;
- do not leave temporary fake repositories unless required for sanitized
  evidence;
- do not modify real application files.

After all tests:

1. Confirm `.kmai-dev-agent` remains ignored.
2. Confirm no local-agent file is tracked.
3. Compare final Git status with the original baseline.
4. Confirm same branch and HEAD.
5. Confirm worktree list is unchanged.
6. Confirm no PR changed.
7. Confirm no package was installed.
8. Confirm no credential or environment setting changed.
9. Confirm no deployment occurred.

────────────────────────────────────
28. Final response
────────────────────────────────────

Return:

1. Overall result: PASS or FAIL
2. Existing architecture reused
3. Exact local files created or modified
4. UI launch command
5. Loopback bind and session-token behavior
6. UI Version 1 features implemented
7. Worktree selection behavior
8. Task creation behavior
9. Observe and Safe task behavior
10. Scope-approval behavior
11. Stop and resume behavior
12. Live-progress implementation
13. Plan/evidence/diff/test/review/final views
14. API endpoints implemented
15. Browser/server security controls
16. UI self-test results
17. Fake-repository UI E2E result
18. Real-repository read-only UI smoke-test result
19. Existing-agent regression-test result
20. Probe result
21. Before/after Git-status comparison
22. Remaining Version 1 limitations
23. Exact command the user should run to start the UI
24. Exact instructions shown to the user for VS Code port forwarding
25. Confirmation that no UI server or child task process remains running
26. Confirmation that no tracked file, branch, worktree, PR, package,
    credential, environment setting or deployment was changed
27. Confirmation that no manual bootstrap or validation command remains

Do not merely describe the UI.

Implement it, execute all safe tests, and return evidence.
