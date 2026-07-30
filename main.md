Fix the target-resolution and asset-ownership behavior for workflow-generated agents without disabling agent generation.

## Intended product behavior

The existing user-facing workflow must continue to work:

1. The user installs the Databricks ETL Copilot extension.
2. The user opens an end-user ETL repository.
3. The user invokes `@etl /workflow`.
4. The user selects the create/initialize workflow mode.
5. The extension previews the ETL Copilot assets.
6. After explicit approval, the extension creates the required ETL automation agents inside the selected end-user workspace.

Do not remove or disable this behavior.

## Three distinct asset scopes

Implement an explicit distinction between these scopes.

### 1. Extension maintainer control plane

Path:

`<extension-source-repository>/.github/agents/**`

These agents exist only to help develop and maintain the extension itself.

Rules:

* Product runtime must never create, repair, upgrade, overwrite, rename, or delete these files.
* Do not use these files as templates for end-user agents.
* Do not modify any existing maintainer agents while implementing this task.
* Running the extension in an Extension Development Host must not cause product assets to be written into the extension source repository.

### 2. Packaged product templates

Preferred canonical source:

`resources/copilot/agents/**`

Use the existing canonical packaged path if the codebase already has one.

Rules:

* These are the source templates shipped inside the VSIX.
* They are read-only at runtime.
* There must be one source of truth for each generated ETL agent.
* Do not duplicate agent bodies across `.github/agents`, prompts, skills, and templates.
* Verify that the intended templates are included in the VSIX.

### 3. Generated end-user assets

Destination:

`<selected-end-user-workspace>/.github/agents/**`

These are the ETL agents created by `@etl /workflow`.

Rules:

* Creation is allowed only in an explicitly resolved end-user ETL workspace.
* Preview must happen before any write.
* The user must explicitly approve the write.
* Only the exact previewed and validated asset set may be written.
* Generated agent filenames should be namespaced, such as `etl-*.agent.md`.
* The extension must only audit, repair, or upgrade files that it owns.
* Existing user-created agents must remain untouched.
* A filename collision with an unmanaged agent must block the write instead of overwriting it.

## Target-resolution requirements

Create or update a single target resolver used by preview, initialize, write, audit, repair, and upgrade operations.

The resolver must:

* use the explicitly selected VS Code workspace folder;
* never use `process.cwd()` as an implicit destination;
* never derive the destination from the extension installation directory;
* handle multi-root workspaces by asking the user to select the target;
* verify that the target is an end-user ETL workspace;
* block the operation if the resolved target is the extension source repository;
* block path traversal or any resolved output outside the selected workspace;
* return a structured target result containing workspace root, target type, evidence, and blockers.

Before preview, report:

* target type: `extension-source`, `consumer-etl-workspace`, or `unknown`;
* resolved workspace root;
* planned agent destination;
* evidence used to classify the target;
* any blocker.

Only `consumer-etl-workspace` may receive generated ETL agents.

## Asset ownership

Use the existing managed-asset manifest machinery if available.

For every generated agent, record:

* stable asset ID;
* relative destination;
* template/source ID;
* generator version;
* checksum;
* ownership by Databricks ETL Copilot.

Do not add unsupported frontmatter fields to GitHub Copilot agent files.

Audit, repair, and upgrade must operate from the manifest and known asset IDs—not by treating every file under `.github/agents/**` as extension-owned.

If ownership of an existing file cannot be proven, leave it unchanged and report it as unmanaged.

## Preserve existing functionality

Do not:

* remove generated ETL agents from `/workflow create`;
* delete existing agent templates;
* delete existing consumer agents;
* modify extension-maintainer agents;
* disable workflow initialization;
* redirect all generated agents away from `.github/agents`;
* perform unrelated refactoring.

The required change is ownership and target separation, not removal of the agent feature.

## Tests

Add deterministic tests proving:

1. Extension activation writes no files.
2. `/workflow` preview writes no files.
3. `/workflow create` creates expected agents in a selected consumer ETL workspace after approval.
4. Generated files are placed under the consumer workspace’s `.github/agents`.
5. Running against the extension source repository is blocked.
6. Existing extension-maintainer agents remain byte-for-byte unchanged.
7. Existing unmanaged consumer agents remain unchanged.
8. Managed consumer agents can be audited, repaired, and upgraded.
9. User-modified managed agents are skipped or require explicit conflict resolution.
10. Multi-root workspaces require explicit target selection.
11. Path traversal and output outside the selected workspace are blocked.
12. The VSIX contains the packaged agent templates.
13. The same asset set shown in preview is validated and written.

## Implementation process

Before editing, provide a short Target Resolution and Writer Inventory showing:

* all current writers of `.github/agents/**`;
* template sources;
* destination-resolution logic;
* asset manifests;
* affected tests;
* the minimal proposed change.

Then implement the smallest coherent fix and run unit, workflow, packaging, and VSIX-content verification tests.

The final report must explicitly confirm both of these statements:

* Extension-maintainer agents were not modified.
* End-user ETL agents are still generated successfully through `@etl /workflow create`.
