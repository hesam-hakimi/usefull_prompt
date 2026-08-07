────────────────────────────────────
MANDATORY EXECUTION — DO NOT DELEGATE COMMANDS TO THE USER
────────────────────────────────────

Do not merely provide commands for the user to run.

You must execute every bootstrap and validation command yourself in the
current VS Code Remote SSH environment.

After creating the local control folder, execute the following workflow
using resolved absolute paths.

1. Resolve and enter the repository root:

   REPO_ROOT="$(git rev-parse --show-toplevel)"

2. Resolve the Git common directory safely:

   COMMON_GIT_DIR="$(
     git rev-parse --path-format=absolute --git-common-dir 2>/dev/null ||
     true
   )"

   If the result is empty, derive the absolute Git common directory safely
   from git rev-parse --git-common-dir.

3. Execute the authentication probe yourself:

   "$REPO_ROOT/.kmai-dev-agent/run.sh" probe

   The expected exact stdout is:

   KMAI_DEV_AGENT_AUTH_OK

4. Verify the local exclude rule yourself:

   grep -nF '/.kmai-dev-agent/' "$COMMON_GIT_DIR/info/exclude"

5. Create and remove the temporary ignore marker yourself:

   touch "$REPO_ROOT/.kmai-dev-agent/.ignore-check"

   git -C "$REPO_ROOT" check-ignore -v \
     .kmai-dev-agent/.ignore-check

   rm -f "$REPO_ROOT/.kmai-dev-agent/.ignore-check"

6. Verify that no local-agent file is tracked:

   git -C "$REPO_ROOT" ls-files -- .kmai-dev-agent

   This command must return no tracked path.

7. Capture the final repository status:

   git -C "$REPO_ROOT" status \
     --porcelain=v1 \
     --untracked-files=all

8. Compare the final status byte-for-byte with the baseline captured before
   the setup.

   Pre-existing dirty files are allowed, but the setup must not introduce
   any new tracked or visible untracked repository change.

9. Verify the Python files compile:

   "$VERIFIED_KMAI_PYTHON" -m py_compile \
     "$REPO_ROOT/.kmai-dev-agent/kmai_client.py" \
     "$REPO_ROOT/.kmai-dev-agent/auth_probe.py"

10. Verify run.sh syntax without changing the environment:

    bash -n "$REPO_ROOT/.kmai-dev-agent/run.sh"

Do not tell the user to execute any of these commands.

Only stop and ask for user action when:

- an authentication permission must be granted externally;
- the verified KMAI Python environment cannot be identified;
- the Managed Identity available to the SSH server cannot call the
  configured model;
- executing a required command would modify a tracked repository file,
  branch, PR, credential, or deployment.

In the final response include:

- each command executed;
- its sanitized exit code;
- the relevant sanitized output;
- exact probe result;
- exact Git-status comparison result;
- confirmation that the user has no remaining manual bootstrap command.
