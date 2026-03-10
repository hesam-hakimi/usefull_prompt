# Product Requirements Document

## Product name
Confluence Tools for GitHub Copilot Chat in VS Code

## Product summary
Build a VS Code extension that connects to Confluence Data Center by using a Personal Access Token and exposes Confluence search and page retrieval as tools that GitHub Copilot Chat agent mode can use. The extension must also provide an explicit, modular, command-oriented user experience inside VS Code.

The product is not only a sidebar integration. One of the most important goals is that the extension contributes tools that are visible in GitHub Copilot Chat when the user opens the tools list for the selected agent.

## Main problem
Users keep documentation in Confluence, but while coding in VS Code they do not want to leave the editor to search for pages manually. They want GitHub Copilot Chat agents to search Confluence, retrieve relevant content, and generate markdown directly from the Confluence results.

## Primary user goals
1. Configure a Confluence connection from the extension.
2. Test whether the connection works.
3. Search Confluence from the extension and inspect results in logs.
4. Make those capabilities available as agent tools in GitHub Copilot Chat.
5. Allow an agent to search Confluence and generate raw extracted markdown from the result.

## MVP scope

### Included in MVP
- Confluence Data Center support
- PAT authentication
- one saved connection only
- command-oriented structure
- sidebar item in the Activity Bar
- extension-level settings for search behavior
- output/log channel for operational details and search results
- GitHub Copilot Chat tool contributions
- raw extracted markdown generation included in MVP
- configurable approval behavior for tool execution
- configurable search scope using allowlist by default
- caching enabled by default

### Not included in MVP
- attachment parsing or attachment retrieval
- writing back to Confluence
- multiple saved connections
- Confluence Cloud-specific behavior
- MCP implementation

## Explicit modules the user wants
The extension should be structured around explicit modules and explicit actions:

1. Configure Connection
2. Test Connection
3. Search Confluence
4. Create Markdown From Search Result

This command-oriented structure matters more than a vague or monolithic design.

## Key functional requirements

### 1. Configure Connection
The extension must provide a clear action called `Configure Connection`.

It should allow the user to set:
- Confluence base URL
- PAT token
- search scope mode
- allowed spaces
- core search settings
- approval settings
- caching settings
- logging verbosity

Requirements:
- support a base URL with or without a context path
- support exactly one connection for MVP
- store PAT securely, not in normal settings
- provide user feedback after save

### 2. Test Connection
The extension must provide a clear action called `Test Connection`.

Success should mean:
- the base URL is reachable
- authentication works
- the REST API is callable
- the extension can confirm basic access

User feedback:
- status in the UI/sidebar
- notification popup
- detailed info in Output channel

### 3. Search Confluence
The extension must provide a clear action called `Search Confluence`.

Behavior:
- user enters a natural language phrase or keyword string
- the extension performs a Confluence search
- results are written to an Output channel log
- results include enough metadata to support later page retrieval and markdown creation

Minimum logged fields for each result:
- rank
- page id
- title
- space key
- last updated
- url
- excerpt/snippet if available

Search rules:
- default to current pages only
- default to both title and body search
- prefer title matches when possible
- apply allowlist filtering by default
- make search settings configurable at extension level

### 4. Create Markdown From Search Result
Markdown generation is part of MVP.

Goal:
- allow the agent to turn Confluence results into raw extracted markdown
- return that markdown in chat only for MVP
- design it to be configurable later for alternate delivery modes

The markdown should focus on extraction, not aggressive summarization.

Expected output style:
- page title
- page metadata
- source link
- extracted body as markdown or near-markdown
- truncation warning if needed

### 5. GitHub Copilot Chat tool integration
This is a mandatory MVP requirement.

The extension must contribute tools so that:
- when the user opens GitHub Copilot Chat in VS Code
- chooses an agent
- opens the tools list
- the tools provided by this extension are visible there

The tool list for MVP must include:
- `search_confluence`
- `get_confluence_page`
- `create_markdown_from_confluence_search`

These tools should be clearly described so the model can choose the right one.

## Recommended UX

### Activity Bar item
Create a dedicated sidebar entry for Confluence.

### Sidebar sections
1. Connection
2. Search Settings
3. Search / Results
4. Tool Status / Logs summary

The UI can be implemented in stages, but MVP must support the required actions.

## Search settings that must exist at extension level
- scope mode: allowlist or all
- allowed spaces
- max results
- include excerpts
- maximum page characters used for markdown
- cache enabled
- cache ttl
- approval required before tool execution
- output log verbosity

## Security requirements
- PAT must be stored securely
- token must never be logged
- Authorization headers must never be logged
- full page content can be returned to Copilot
- attachments are out of scope
- no write-back to Confluence

## Performance requirements
- support caching by default
- search should avoid unnecessary full-content fetches
- page fetch should be on demand
- all limits should be configurable

## Reliability requirements
- handle invalid URL
- handle invalid or expired PAT
- handle no allowed spaces configured
- handle network timeout
- handle empty search results
- handle HTML-to-markdown conversion failure by falling back safely

## Acceptance goals
The MVP is successful when:
1. a user can configure and save a Confluence connection
2. a user can test the connection successfully
3. a user can run a search and see results in the log
4. GitHub Copilot Chat shows the extension's tools in the agent tools list
5. an agent can search Confluence
6. an agent can fetch a Confluence page
7. an agent can generate raw extracted markdown from search results

