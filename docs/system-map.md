# System Map

> Status: draft  
> Owner: `[name or team]`  
> Last reviewed: `[YYYY-MM-DD]`

This file tells agents where behavior lives and how to validate it. Unknown fields must remain explicit.

## Copilot asset topology

| Scope | Location | Responsibility | Write rule |
| --- | --- | --- | --- |
| Maintainer control plane | `<extension-repo>/.github/**` | Develop and govern the extension repository | Explicit maintainer request only |
| Product source | `resources/copilot/**` | Canonical packaged agents, prompts, skills, instructions, and knowledge | Modify for product-asset changes |
| Runtime generator | `src/customization/**` | Preview, write, audit, repair, and upgrade managed assets | Must use the resolved consumer target |
| Consumer output | `<consumer-workspace>/.github/**` | Generated ETL automation assets | Preview, validation, and approval required |
| Test output | Unique temporary consumer workspace | Integration and generation-test artifacts | Test-only; clean up during teardown |

The runtime must classify the target before preview or write. A generated-output operation must fail closed for `extension-source`, `unknown`, installation directories, path traversal, or destinations outside the selected workspace.

## Components

| Component | Responsibility | Public surface | Owner | Critical tests |
| --- | --- | --- | --- | --- |
| `resources/copilot/**` | Packaged product assets | VSIX contents | `[owner]` | Package-content verification |
| `src/customization/**` | Managed-asset lifecycle | `@etl /workflow` | `[owner]` | Preview/create/audit/repair/upgrade tests |
| Target resolver | Workspace classification and containment | Structured target result | `[owner]` | Multi-root, Windows path, traversal, and source-repo rejection tests |
| Managed-asset manifest | Ownership, source, version, checksum | Manifest contract | `[owner]` | Managed/unmanaged collision and upgrade tests |
| `[path/service]` | `[responsibility]` | `[API/event/CLI/data contract]` | `[owner]` | `[test path/command]` |

## Dependency rules

- `.github/**` must not be used as product template source.
- `src/customization/**` may read packaged assets from `resources/copilot/**`.
- Consumer output must be derived from packaged source and recorded ownership, not copied from maintainer agents.
- Audit, repair, and upgrade must act only on proven managed assets.
- External service boundary: `[rule]`

## Public contracts

| Contract ID | Type | Location | Consumers | Compatibility rule |
| --- | --- | --- | --- | --- |
| `C-TARGET-001` | Target resolution | `[implementation path]` | Preview, create, audit, repair, upgrade | Structured target result; unknown targets fail closed |
| `C-ASSET-001` | Managed asset | `[manifest path]` | Consumer lifecycle operations | Stable ID, destination, source ID, version, checksum, owner |
| `C-001` | `[API/event/schema/CLI/file]` | `[path]` | `[consumers]` | `[backward-compatibility requirement]` |

## Critical data flows

| Flow ID | Entry | Processing | Output | Failure behavior |
| --- | --- | --- | --- | --- |
| `F-WORKFLOW-001` | `@etl /workflow create` | Resolve target → preview → validate → approve → write | Managed consumer `.github/**` assets | Block unknown/source/outside-workspace target |
| `F-TEST-001` | Write-capable test | Create temporary consumer fixture → generate → assert → clean up | Temporary fixture only | Test fails if extension control plane changes |
| `F-001` | `[source]` | `[components]` | `[destination]` | `[expected handling]` |

## Legacy constraints

| Constraint | Reason | Removal condition | Protected by |
| --- | --- | --- | --- |
| Existing consumer agents may be unmanaged | User ownership cannot be inferred from location | Proven managed identity or explicit migration | Collision and unchanged-file tests |
| `[constraint]` | `[why it exists]` | `[safe removal evidence]` | `[test/contract]` |

## Test and validation map

| Change type | Minimum checks | Broader checks | Environment needs |
| --- | --- | --- | --- |
| Documentation/workflow | `node scripts/validate-workflow.mjs` | `node scripts/assert-control-plane-clean.mjs` | Node 20 and Git |
| Generator/write behavior | Temporary-workspace unit tests | VS Code integration and VSIX-content tests | Isolated consumer fixture |
| Cross-platform path behavior | Windows/POSIX resolver tests | Windows CI plus Linux CI | Windows and Linux runners |
| Public contract | `[command]` | `[integration/contract command]` | `[needs]` |
| Data/schema | `[command]` | `[migration/compatibility command]` | `[needs]` |

## Operational commands

```text
Workflow validation: node scripts/validate-workflow.mjs
Post-test guard:     node scripts/assert-control-plane-clean.mjs
Install:             [command]
Build:               [command]
Lint:                [command]
Unit:                [command]
Contract:            [command]
E2E:                 [command]
```

Agents must not invent missing commands. If a required command is unknown, report a blocker or ask the owner.
