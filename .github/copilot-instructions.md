# Repository-wide Copilot Instructions

Before acting, read `AGENTS.md` and the relevant sections of:

- `docs/business-context.md`
- `docs/system-map.md`
- accepted files in `docs/decisions/`
- `workflow/README.md`

Rules:

1. Do not guess business rules, schemas, identifiers, runtime state, or acceptance criteria.
2. Preserve existing behavior unless the user explicitly requests a change.
3. Find affected callers, contracts, and tests before modifying shared behavior.
4. Plan first; implement only within the user's authorization and risk gates.
5. Keep diffs narrow and separate unrelated cleanup.
6. Validate the exact changed artifacts and report checks that were not run.
7. Treat missing evidence or unavailable tools as blockers, not permission to bypass safeguards.
8. Finish with the output contract in `templates/result.md`.
