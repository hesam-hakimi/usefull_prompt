# Confluence Copilot VS Code Extension - Prompt Pack

This folder contains a set of markdown files you can paste into GitHub Copilot Chat in VS Code to help it build the extension step by step.

## Recommended order

1. `01-PRD.md`
2. `02-ARCHITECTURE.md`
3. `03-IMPLEMENTATION-PLAN.md`
4. `04-COPILOT-BUILD-PROMPT.md`
5. `05-ACCEPTANCE-CRITERIA-AND-TESTS.md`
6. `06-BUGFIX-PROMPT-TEMPLATE.md`

## How to use with Copilot

### Option A - best for first implementation
Paste files in this order:
- `01-PRD.md`
- `02-ARCHITECTURE.md`
- `03-IMPLEMENTATION-PLAN.md`
- `04-COPILOT-BUILD-PROMPT.md`

Then ask Copilot:

```text
Read the full context above carefully. Build the solution exactly as specified. Do not simplify the architecture. Do not skip the Copilot tool integration. Before writing code, summarize the modules, commands, tools, settings, and file structure you will create. Then implement phase 1 first.
```

### Option B - phase-by-phase build
Paste:
- `01-PRD.md`
- `02-ARCHITECTURE.md`
- `03-IMPLEMENTATION-PLAN.md`

Then ask Copilot to implement one phase at a time.

### Option C - bug fixing
When an error happens:
- paste `06-BUGFIX-PROMPT-TEMPLATE.md`
- fill in the placeholders
- also paste the failing file(s), stack trace, console output, and current behavior

## What this prompt pack is designed to enforce

- modular command-oriented extension structure
- visible tools in GitHub Copilot Chat agent tool list
- Confluence Data Center support
- PAT-based authentication
- extension-level search configuration
- Output channel logging
- raw extracted markdown generation as an MVP feature
- prompts that can later be refined for targeted bug fixing

## Core MVP that these files assume

### Commands / extension actions
- Configure Connection
- Test Connection
- Search Confluence
- Create Markdown From Search Result

### Copilot tools
- `search_confluence`
- `get_confluence_page`
- `create_markdown_from_confluence_search`

### Scope decisions
- one connection only
- allowlist by default
- attachments out of scope
- PAT stored securely
- search settings configurable at extension level
- markdown returned in chat only for MVP, but designed to be configurable later

