# System Map

> Status: draft  
> Owner: `[name or team]`  
> Last reviewed: `[YYYY-MM-DD]`

This file tells agents where behavior lives and how to validate it. Unknown fields must remain explicit.

## Components

| Component | Responsibility | Public surface | Owner | Critical tests |
| --- | --- | --- | --- | --- |
| `[path/service]` | `[responsibility]` | `[API/event/CLI/data contract]` | `[owner]` | `[test path/command]` |

## Dependency rules

- Allowed dependency direction: `[rule]`
- Forbidden coupling: `[rule]`
- Shared utilities policy: `[rule]`
- External service boundary: `[rule]`

## Public contracts

| Contract ID | Type | Location | Consumers | Compatibility rule |
| --- | --- | --- | --- | --- |
| `C-001` | `[API/event/schema/CLI/file]` | `[path]` | `[consumers]` | `[backward-compatibility requirement]` |

## Critical data flows

| Flow ID | Entry | Processing | Output | Failure behavior |
| --- | --- | --- | --- | --- |
| `F-001` | `[source]` | `[components]` | `[destination]` | `[expected handling]` |

## Legacy constraints

| Constraint | Reason | Removal condition | Protected by |
| --- | --- | --- | --- |
| `[constraint]` | `[why it exists]` | `[safe removal evidence]` | `[test/contract]` |

## Test and validation map

| Change type | Minimum checks | Broader checks | Environment needs |
| --- | --- | --- | --- |
| Documentation/workflow | `./scripts/validate-workflow.sh` | `[optional]` | None |
| Unit behavior | `[command]` | `[command]` | `[needs]` |
| Public contract | `[command]` | `[integration/contract command]` | `[needs]` |
| Data/schema | `[command]` | `[migration/compatibility command]` | `[needs]` |

## Operational commands

```text
Install:  [command]
Build:    [command]
Lint:     [command]
Unit:     [command]
Contract: [command]
E2E:      [command]
```

Agents must not invent missing commands. If a required command is unknown, report a blocker or ask the owner.
