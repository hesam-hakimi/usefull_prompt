# Repository-wide Copilot Instructions

This repository’s `.github/**` directory is the maintainer control plane. It is not the source of agents generated for end users.

Before acting, read:

- `AGENTS.md`;
- `workflow/targets.yml`;
- `workflow/README.md`;
- `workflow/execution-recovery.md` when behavior, evidence, questions, package/runtime identity, or recovery is unclear;
- `workflow/shipped-extension-delivery.md` for any extension behavior that must be exercised from the installed VSIX;
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
13. Classify every extension change as `source-only`, `shipped-extension`, or `operational-only`. A change to code, packaged Copilot assets, tool registration, manifests, parser/runtime behavior, dependencies, or other behavior that must be exercised from the installed VSIX is `shipped-extension` unless the user explicitly asks for source-only work.
14. For a `shipped-extension` implementation/fix request, the original request authorizes one bounded local delivery chain for the exact task artifact. The same task must continue through local validation, a distinguishable package version when needed, build, VSIX packaging, package-content verification, one local install, activation confirmation, and a live smoke test. Do not stop at source verification and do not require a second user message just to build, package, or install the exact artifact produced by that task.
15. Build, package, install, activation, and live smoke remain separate evidence states. Installation alone never proves activation or the changed runtime behavior. Report `INSTALLED_NOT_ACTIVATED` until the host is reloaded, and `POST_INSTALL_VERIFIED` only after the newly active version passes the changed live path.
16. A host reload may resume the same `shipped-extension` task from its execution checkpoint when the exact installed package/version is unchanged and trusted task state is still provable. Any source or package change after package verification starts a new task and requires a new package identity.
17. The new-task rule applies to genuinely later standalone operational requests; it must not split an already-authorized shipped-extension delivery chain into artificial build/package/install tasks.
18. Local delivery authorization does not authorize publish, marketplace release, deployment, production actions, or unrelated consumer writes. Those remain separately approval-gated.
19. Report exact validation evidence and skipped checks using `templates/result.md`.
