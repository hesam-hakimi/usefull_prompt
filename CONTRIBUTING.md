# Contributing

All changes use the workflow in `workflow/README.md`.

## Before coding

- Read `AGENTS.md`.
- Confirm the request against `docs/business-context.md`.
- Identify affected contracts and tests using `docs/system-map.md`.
- Complete `docs/change-contract.md` for non-trivial behavior changes.

## Pull requests

A pull request must state:

- user-visible outcome;
- compatibility impact;
- evidence for each acceptance criterion;
- checks run and checks not run;
- rollback or recovery approach for medium/high-risk work.

Do not combine unrelated cleanup with a behavior change. If cleanup is necessary, explain why it is a prerequisite and keep it in a separate commit where practical.

Run:

```bash
./scripts/validate-workflow.sh
```

Project-specific build, lint, test, and integration commands belong in `docs/system-map.md`.
