---
applyTo: "**"
---

# Change-safety instructions

- Resolve the target type, delivery classification, workspace root, canonical source, and intended destination before editing.
- State current behavior, desired behavior, protected behavior, and protected paths.
- Inspect affected callers, contracts, manifests, writers, package inputs, runtime path, and tests as applicable.
- For changed existing behavior, locate regression coverage or add a characterization test.
- Avoid unrelated renames, formatting, dependency upgrades, and cleanup.
- Do not remove unfamiliar behavior without explicit evidence that it is obsolete.
- Do not edit generated consumer assets directly; change the canonical source or generator.
- Do not treat unmanaged consumer files as extension-owned.
- Write-capable tests must use isolated temporary consumer workspaces.
- Verify the extension repository’s `.github/**` remains unchanged after tests unless maintainer workflow is explicitly the target.
- Verify acceptance criteria and backward compatibility against the exact diff.
- For `shipped-extension`, follow `workflow/shipped-extension-delivery.md`; source tests alone are not completion.
- Package only the exact accepted diff. Verify package identity and contents before local installation.
- A source or package-content change after `PACKAGE_VERIFIED` invalidates that package evidence and requires a new task/package identity when applicable.
- Installation does not prove activation; activation does not prove the changed live path.
- Do not split an already-authorized `shipped-extension` implementation into artificial build/package/install requests.
- Mutating consumer smoke still requires exact preview/write approval even when read-only smoke is part of the shipped-extension delivery task.
- Report failures and skipped checks honestly; never weaken a test or validator just to obtain a green result.
