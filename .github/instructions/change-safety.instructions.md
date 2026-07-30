---
applyTo: "**"
---

# Change-safety instructions

- State current behavior, desired behavior, and protected behavior before editing.
- Inspect affected callers, contracts, and tests.
- For changed existing behavior, locate regression coverage or add a characterization test.
- Avoid unrelated renames, formatting, dependency upgrades, and cleanup.
- Do not remove unfamiliar behavior without explicit evidence that it is obsolete.
- Verify acceptance criteria and backward compatibility against the exact diff.
- Report failures and skipped checks honestly; never weaken a test or validator just to obtain a green result.
