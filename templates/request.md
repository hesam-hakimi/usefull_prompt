# Change Request

Copy this template into Copilot Chat or invoke `/build` and provide the same information.

## Goal

`[What outcome do you want?]`

## Why

`[What user or business problem does it solve?]`

## Target

`extension-produced agent / maintainer workflow / runtime generator / consumer output`

If omitted, an unqualified “agent” request means `extension-produced agent`.

## Acceptance criteria

- `[Observable result]`

## Constraints

- `[Compatibility, technology, operating system, performance, security, deadline, or process constraint]`

## Out of scope

- `[Work that must not be included]`

## Useful references

- `[Files, issues, examples, screenshots, logs, or decisions]`

## Mode

`implement / plan-only / verify / explain`

## Delivery preference (optional)

`automatic / source-only / operational-only`

- `automatic` — default. If an implementation/fix changes behavior that must be exercised from the installed VSIX, classify it as `shipped-extension` and continue the same task through build, package verification, one local install, activation confirmation, and changed-path live smoke.
- `source-only` — explicitly stop after source implementation and independent verification; do not package or install.
- `operational-only` — perform only the separately requested lifecycle operation against already-existing source/artifacts.

Omit this field unless you want to override the normal automatic delivery classification. Publish, deploy, production actions, and mutating consumer writes remain separately approval-gated.
