---
applyTo: "**"
---

# Workflow asset boundaries

The same relative path can have different ownership in different repositories.

## Extension source repository

`.github/**` contains maintainer-only instructions, prompts, agents, CI, and repository-development controls.

Do not use these files as product templates.

## Packaged product source

`resources/copilot/**` is the canonical source for assets delivered by the extension.

## Consumer workspace

The extension may generate managed assets under the selected consumer workspace’s `.github/**` after preview, validation, and explicit approval.

Only manifest-owned files may be audited, repaired, or upgraded. Unmanaged files must remain unchanged.

## Tests

Write-capable tests must use a unique temporary consumer workspace and clean it during teardown.

No test may generate or modify files under the extension repository’s `.github/**`.

Use platform APIs such as `os.tmpdir()`, `fs.mkdtemp()`, `path.resolve()`, `fs.realpath()`, or VS Code URI helpers. Do not hard-code `/tmp`, Unix separators, drive letters, or case-sensitive path comparisons.

## Required resolution

Before editing, identify:

- target type;
- workspace root;
- canonical source;
- intended destination;
- ownership evidence;
- protected paths.

Stop when ownership or target identity is ambiguous.

Normalize and canonicalize paths before comparison. On Windows, account for `\` separators, drive letters, junctions, and case-insensitive path identity. Reject traversal and any destination outside the selected workspace.
