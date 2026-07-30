# Contributing

All changes use the workflow in `workflow/README.md`.

## Before coding

- Read `AGENTS.md` and `workflow/targets.yml`.
- Resolve the target type, workspace root, canonical source, destination, and protected paths.
- Confirm the request against `docs/business-context.md`.
- Identify affected contracts, manifests, writers, and tests using `docs/system-map.md`.
- Complete `docs/change-contract.md` for non-trivial behavior changes.

## Pull requests

A pull request must state:

- target resolution and ownership evidence;
- user-visible outcome;
- compatibility impact;
- evidence for each acceptance criterion;
- checks run and checks not run;
- test-isolation evidence for write-capable tests;
- rollback or recovery approach for medium/high-risk work.

Do not combine unrelated cleanup with a behavior change. If cleanup is necessary, explain why it is a prerequisite and keep it in a separate commit where practical.

Run the cross-platform workflow check from PowerShell, Command Prompt, macOS, or Linux:

```text
node scripts/validate-workflow.mjs
```

After project tests, run:

```text
node scripts/assert-control-plane-clean.mjs
```

Project-specific build, lint, test, integration, packaging, and VSIX-content commands belong in `docs/system-map.md`.
