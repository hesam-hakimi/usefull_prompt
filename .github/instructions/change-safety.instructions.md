---
applyTo: "**"
---

# Change-safety instructions

- Resolve the target type, workspace root, canonical source, and intended destination before editing.
- State current behavior, desired behavior, protected behavior, and protected paths.
- Inspect affected callers, contracts, manifests, writers, and tests.
- For changed existing behavior, locate regression coverage or add a characterization test.
- Avoid unrelated renames, formatting, dependency upgrades, and cleanup.
- Do not remove unfamiliar behavior without explicit evidence that it is obsolete.
- Do not edit generated consumer assets directly; change the canonical source or generator.
- Do not treat unmanaged consumer files as extension-owned.
- Write-capable tests must use isolated temporary consumer workspaces.
- Verify the extension repository’s `.github/**` remains unchanged after tests.
- Verify acceptance criteria and backward compatibility against the exact diff.
- Report failures and skipped checks honestly; never weaken a test or validator just to obtain a green result.
