# Implementation Plan

## Delivery strategy
Build the solution in phases, but keep the final codebase aligned with the full modular architecture from day one. Do not implement a throwaway MVP that must later be rewritten.

## Phase 0 - project scaffolding

### Goals
- create VS Code extension scaffold in TypeScript
- set up modular folder structure
- define package.json contributions for commands, configuration, views, and tools
- add linting and test setup

### Required outputs
- clean compile
- empty sidebar shell visible
- commands registered
- output channel initialized

### Acceptance checks
- extension activates without error
- contributed commands appear in Command Palette
- Activity Bar icon appears
- Output channel can be opened

## Phase 1 - connection configuration

### Goals
Implement `Configure Connection`.

### Functional requirements
- user can enter base URL
- user can enter PAT
- PAT stored in secret storage
- non-secret fields stored in extension config
- support base URL with or without context path
- show success/failure message
- log sanitized result

### Required modules
- settingsService
- secretStorage adapter
- connectionService
- sidebar UI connection section
- validation helpers

### Acceptance checks
- PAT is retrievable after save
- PAT is not visible in normal settings
- invalid URL is rejected gracefully

## Phase 2 - test connection

### Goals
Implement `Test Connection`.

### Functional requirements
- call Confluence API with saved settings
- verify authentication and basic API access
- update status in UI
- show popup summary
- log details to Output channel

### Required modules
- confluenceClient.testConnection
- connectionService.testConnection
- sidebar action wiring

### Acceptance checks
- valid connection succeeds
- invalid token fails cleanly
- network error is distinguishable from auth error

## Phase 3 - search from extension

### Goals
Implement `Search Confluence` for manual use.

### Functional requirements
- accept phrase input
- generate effective search request
- enforce allowlist rules
- call search endpoint
- log results to Output channel
- show search summary in sidebar

### Required modules
- cqlBuilder
- searchService
- cacheService
- loggingService
- sidebar search form

### Acceptance checks
- search returns expected fields
- empty allowlist blocks search in allowlist mode
- result logging is readable and structured

## Phase 4 - Copilot tool integration

### Goals
Add tools that appear in GitHub Copilot Chat agent tools list.

### Mandatory tools
- `search_confluence`
- `get_confluence_page`
- `create_markdown_from_confluence_search`

### Functional requirements
- tools are contributed in package.json
- tools are registered in extension code
- tool descriptions are strong enough for correct model selection
- approval workflow is supported where configured
- tool execution uses the same service layer as manual commands

### Acceptance checks
- tools are visible in Copilot Chat tools UI
- agent can invoke search tool
- agent can invoke page fetch tool
- agent can invoke markdown tool

## Phase 5 - page retrieval and markdown generation

### Goals
Implement raw extracted markdown generation in MVP.

### Functional requirements
- fetch a page by id or url
- retrieve body using expansion fields
- convert HTML or view body to markdown
- return structured markdown output
- apply truncation limits and warnings
- return markdown in chat for tool use

### Acceptance checks
- fetched page contains source metadata
- markdown output is stable and readable
- truncation is explicit
- conversion fallback does not crash the tool

## Phase 6 - hardening and testing

### Goals
Make the codebase durable enough for iterative bug-fix prompting.

### Requirements
- typed errors
- unit tests
- integration tests with mocked HTTP
- no duplicated business logic
- cleaner log output
- safer approval handling

## package.json contributions checklist
Copilot must not skip these.

### Commands
- Configure Connection
- Test Connection
- Search Confluence
- Create Markdown From Search Result

### Views / view container
- activity bar icon
- sidebar view(s)

### Configuration settings
- base URL
- allowlist mode
- allowed spaces
- max results
- max page chars
- cache enabled
- cache ttl
- approval toggles
- output verbosity

### Language model tools
- search_confluence
- get_confluence_page
- create_markdown_from_confluence_search

## Developer rules for Copilot
When building this project, Copilot should follow these rules:

1. Do not collapse the modular design into one file.
2. Do not implement separate logic for commands and tools if the same service can be reused.
3. Do not store the PAT in plain configuration.
4. Do not skip the tool contribution in package.json.
5. Do not ship a search flow that only works in the sidebar but not in agent tools.
6. Do not over-couple webview code to the Confluence REST implementation.
7. Do not log secrets or auth headers.
8. Do not ignore empty allowlist cases.
9. Do not fetch full page bodies during every search result listing unless explicitly requested.
10. Do not make markdown generation depend entirely on a hidden LLM step.

## Definition of done
The implementation is done only when:
- the sidebar works
- commands work
- tools are visible in GitHub Copilot Chat
- search results log correctly
- page fetch works
- markdown generation works
- tests pass
- code is modular

