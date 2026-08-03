# Repository-wide Copilot Instructions

This repository’s `.github/**` directory is the maintainer control plane. It is not the source of agents generated for end users.

Before acting, read:

- `AGENTS.md`;
- `workflow/targets.yml`;
- `workflow/README.md`;
- `workflow/execution-recovery.md` when behavior, evidence, questions, package/runtime identity, or recovery is unclear;
- relevant business and system documentation.

Rules:

1. Resolve the target type before planning or editing.
2. Treat an unqualified “agent” request as an extension-produced agent request.
3. Change product agents in `resources/copilot/agents/**`, not in the extension repository’s `.github/agents/**`.
4. Edit `.github/**` only when the user explicitly requests a change to the repository’s maintainer workflow.
5. Never edit generated consumer output directly. Change its canonical source or generator and regenerate it.
6. Preserve `@etl /workflow create`: it may generate managed ETL assets in an explicitly selected consumer workspace after preview, validation, and approval.
7. Existing unmanaged consumer files must remain untouched.
8. Tests must generate assets only in isolated temporary workspaces.
9. Block writes targeting the extension source, extension installation directory, unknown targets, or paths outside the selected workspace.
10. Before asking the user a question, classify it using `workflow/execution-recovery.md`; do not ask for data already available in an authorized source.
11. Treat parser, retrieval, truncation, serialization, stale-state, and unavailable-tool problems as tooling gaps rather than business clarifications.
12. On unexpected failure, stop the mutation, preserve evidence, emit an execution checkpoint, and invoke Evidence Researcher when required.
13. Distinguish source verification, build, package, installation, activation, and live smoke evidence.
14. A source or package fix discovered after package verification or live execution begins a new task.
15. Report exact validation evidence and skipped checks using `templates/result.md`.
