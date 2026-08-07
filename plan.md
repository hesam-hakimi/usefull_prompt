Create a zero-install local development-agent control folder inside the
current kmai-td-genie repository and prove that it can call the existing
KMAI Azure OpenAI deployment using the same authentication mechanism as
the application.

This is Phase 1 only: local bootstrap and authentication probe.

Do not build the full agent runner yet.

NON-NEGOTIABLE CONSTRAINTS

- Do not install anything:
  - no pip install
  - no npm install
  - no apt, yum, dnf, snap, curl-install, or binary download
  - no Codex CLI
  - no new VS Code extension

- Do not modify any tracked repository file.
- Do not modify the tracked .gitignore.
- Do not clean, reset, stash, checkout, rebase, merge, or alter the current
  dirty checkout.
- Do not create or change a branch.
- Do not commit or push.
- Do not modify any PR.
- Do not deploy or start the application.
- Do not print or persist tokens, API keys, authorization headers,
  connection strings, cookies, credentials, or full sensitive environment
  variable values.

The only permitted filesystem changes are:

1. A locally ignored directory at the current repository root:

   .kmai-dev-agent/

2. The local Git exclude file under the repository's Git common directory.

────────────────────────────────────
1. Establish the repository baseline
────────────────────────────────────

Determine:

- repository root using git rev-parse --show-toplevel;
- Git common directory using:
  git rev-parse --path-format=absolute --git-common-dir

If --path-format is unavailable, resolve the common directory safely using
the repository root.

Capture before making changes:

- current branch;
- current HEAD SHA;
- git status --porcelain=v1 --untracked-files=all;
- git worktree list --porcelain.

Store the temporary baseline outside the repository or in memory.

Never alter any pre-existing dirty file.

────────────────────────────────────
2. Create and locally exclude the control folder
────────────────────────────────────

At the repository root create:

.kmai-dev-agent/
├── README.md
├── run.sh
├── kmai_client.py
├── auth_probe.py
├── policy.json
├── tasks/
├── results/
├── state/
└── logs/

Do not create any file under src/, test/, docs/, .github/, or deployment
directories.

Add exactly this local ignore rule to:

<GIT_COMMON_DIR>/info/exclude

Rule:

/.kmai-dev-agent/

Requirements:

- preserve all existing exclude content;
- add the rule only if it is not already present;
- do not edit .gitignore;
- do not create a duplicate rule.

Verify using a temporary marker:

.kmai-dev-agent/.ignore-check

Run:

git check-ignore -v .kmai-dev-agent/.ignore-check

Then remove the temporary marker.

Confirm:

- no .kmai-dev-agent file is tracked;
- git status after setup is byte-for-byte equivalent to the baseline
  status captured before setup;
- the only non-repository change is the local info/exclude entry.

────────────────────────────────────
3. Discover the existing KMAI Python environment
────────────────────────────────────

Determine the Python executable/environment previously used to run KMAI
on this Linux server before App Service deployment.

Inspect only the minimum necessary repository files and runtime evidence.

Potential evidence may include:

- active interpreter path;
- .venv or venv directories;
- startup scripts;
- pyproject.toml;
- requirements files;
- deployment or local-run documentation;
- currently active VS Code Python environment.

Do not activate or modify shell profiles.

run.sh must use this precedence:

1. KMAI_PYTHON environment override, if explicitly supplied;
2. the verified existing KMAI Python executable;
3. fail safely with a clear message.

Do not silently use an unrelated system Python when the KMAI environment
cannot be established.

────────────────────────────────────
4. Inspect the existing KMAI model authentication
────────────────────────────────────

Search narrowly for:

- ManagedIdentityCredential
- DefaultAzureCredential
- get_bearer_token_provider
- AzureOpenAI
- OpenAI
- Azure OpenAI client factories
- RuntimeModelPolicy or equivalent model policy
- cognitiveservices.azure.com
- AZURE_OPENAI_ENDPOINT or equivalent configuration names
- deployment/model-name configuration

Do not inspect secret files.

Do not read:

- .env
- .env.github
- token or credential files
- private keys
- certificates
- Git credentials
- shell history

It is acceptable to inspect .env.example or configuration templates only
when they contain no real values.

Return internally:

- exact application source files used for auth/client creation;
- credential class;
- token scope/audience;
- endpoint configuration source;
- deployment/model configuration source;
- whether authentication is system-assigned or user-assigned Managed
  Identity, only if evidenced.

Do not expose actual token values or sensitive configuration values.

────────────────────────────────────
5. Implement kmai_client.py
────────────────────────────────────

Create a small local adapter:

.kmai-dev-agent/kmai_client.py

Preferred approach:

- import and reuse the existing KMAI Azure OpenAI client factory, token
  provider, model policy, and configuration loader;
- import only the smallest safe modules;
- avoid importing FastAPI startup, SQL connections, Redis, AI Search,
  application initialization, or deployment logic;
- prove that importing the adapter has no application-startup side effect.

If direct reuse is not safely possible:

- reproduce only the minimal authentication/client pattern already
  evidenced in KMAI;
- use only packages already installed in the verified KMAI environment;
- use the same Managed Identity / Entra credential type, scope, endpoint
  configuration, deployment configuration, and API style as KMAI;
- do not add API-key authentication;
- do not copy authentication secrets;
- do not use a different deployment.

If current KMAI authentication from this SSH server depends only on an API
key or another secret that cannot be safely reused, stop and report FAIL.
Do not read or copy that secret.

The adapter must expose a minimal safe interface similar to:

create_client()
get_configured_model_or_deployment()
invoke_text(prompt, max_output_tokens)

Use the actual API interface already supported by KMAI:

- Responses API if that is what the current KMAI code uses;
- chat completions if that is what the current KMAI code uses;
- do not migrate or change the application's API style during this task.

Never log request headers or tokens.

────────────────────────────────────
6. Implement auth_probe.py
────────────────────────────────────

Create:

.kmai-dev-agent/auth_probe.py

It must:

- use kmai_client.py;
- send one minimal model request;
- use a very small output limit;
- ask the model:

  Reply with exactly: KMAI_DEV_AGENT_AUTH_OK

- print only one of:

  KMAI_DEV_AGENT_AUTH_OK

  or a sanitized failure such as:

  KMAI_DEV_AGENT_AUTH_FAIL: <safe error class/code>

It must not print:

- endpoint paths or query strings;
- access tokens;
- headers;
- environment values;
- response objects;
- stack traces containing configuration;
- request payload diagnostics.

────────────────────────────────────
7. Implement run.sh
────────────────────────────────────

Create an executable:

.kmai-dev-agent/run.sh

For Phase 1 it only needs:

./.kmai-dev-agent/run.sh probe

It must:

- locate the repository root safely;
- choose the verified KMAI Python executable;
- execute auth_probe.py;
- use set -euo pipefail;
- not source arbitrary shell scripts;
- not change the current branch or working directory state.

Do not modify PATH, shell profiles, or environment configuration.

────────────────────────────────────
8. Initial local policy
────────────────────────────────────

Create policy.json containing at least:

- version;
- repository common Git directory identity;
- default mode: read-only;
- no arbitrary shell;
- no commit;
- no push;
- no rebase;
- no merge;
- no deploy;
- force-push always forbidden;
- maximum model rounds placeholder;
- maximum file/output sizes;
- sensitive-file deny patterns.

Sensitive-file deny patterns must include at least:

- .env
- .env.*
- .env.github
- *.pem
- *.key
- id_rsa*
- .git-credentials
- .netrc
- credentials.json
- token.json
- .git/**

.env.example may be treated as a non-secret template only if verified safe.

Do not place endpoint values, model credentials, tokens, or secrets in
policy.json.

────────────────────────────────────
9. README
────────────────────────────────────

README.md must explain:

- this directory is local-only and ignored;
- no file should be committed;
- it reuses the KMAI Python environment and authentication;
- current supported command is `run.sh probe`;
- the future runner must target explicit clean worktrees;
- the dirty asktd_v2 checkout must not be used for implementation;
- tokens and credentials must never be stored here.

────────────────────────────────────
10. Run and verify the probe
────────────────────────────────────

Run:

./.kmai-dev-agent/run.sh probe

Expected output:

KMAI_DEV_AGENT_AUTH_OK

After the probe:

- rerun git status;
- compare it with the baseline;
- run git ls-files against .kmai-dev-agent and confirm no tracked entry;
- verify the folder is ignored;
- confirm no application, server, branch, worktree, PR, or deployment was
  changed.

If the probe fails:

- do not build a model runner;
- do not attempt unrelated authentication methods;
- return the exact sanitized blocker;
- leave only the ignored bootstrap/probe files.

────────────────────────────────────
11. Final response
────────────────────────────────────

Return:

1. Overall result: PASS or FAIL
2. Repository root
3. Git common directory and local exclude file path
4. Confirmation .kmai-dev-agent is ignored and untracked
5. Exact locally created files
6. Python executable/environment used
7. Existing KMAI auth/client source files reused
8. Credential type and scope, without token values
9. Endpoint host only, if safe; no path/query
10. Deployment/model: configured, or its name only if repository policy
    permits disclosure
11. Exact probe command
12. Exact probe output
13. Before/after Git-status comparison
14. Packaging/deployment risk observation for the ignored folder
15. Any blocker
16. Confirmation that no tracked file, branch, worktree, PR, credential,
    environment setting, or deployment was changed
