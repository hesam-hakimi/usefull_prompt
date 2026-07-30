## Outcome

<!-- What user-visible or developer-visible outcome does this PR provide? -->

## Target resolution

- Target type:
- Resolved workspace root:
- Canonical source:
- Generated destination:
- Protected paths:
- Ownership evidence:

## Change contract

- Business rule IDs:
- Contract IDs:
- Risk: low / medium / high
- Out of scope:

## Compatibility

- [ ] Existing public behavior is preserved, or intentional changes are listed below.
- [ ] Affected callers/consumers were identified.
- [ ] Existing behavior has regression or characterization coverage.
- [ ] `@etl /workflow create` remains functional when it is in scope.
- [ ] Unmanaged consumer files remain untouched.

Intentional compatibility changes:

## Validation

| Acceptance criterion | Check | Result |
| --- | --- | --- |
|  |  |  |

Commands run:

```text

```

Checks not run and why:

## Asset and test safety

- [ ] Product agents were changed at their canonical source, not in the maintainer control plane.
- [ ] Generated consumer output was not edited as source.
- [ ] Write-capable tests used isolated temporary consumer workspaces.
- [ ] Tests did not modify or create files under the extension repository’s `.github/**`.
- [ ] Windows path separators, path casing, and temporary directories were considered.

## General safety

- [ ] No secrets or customer-specific values were added.
- [ ] No unrelated cleanup is mixed into this change.
- [ ] The exact diff was reviewed.
- [ ] Documentation and decisions match the resulting behavior.
- [ ] Rollback/recovery is documented for medium/high-risk work.

## Verifier findings

<!-- VERIFIED, CHANGES_REQUIRED, or BLOCKED, with evidence. -->
