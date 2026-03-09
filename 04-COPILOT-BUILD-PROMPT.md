# Copilot Build Prompt

You are implementing a VS Code extension in TypeScript.

Build a production-quality MVP called `confluence-copilot-tools` that integrates Confluence Data Center with GitHub Copilot Chat agent tools inside VS Code.

Do not simplify the architecture. Do not skip the GitHub Copilot tool contribution. Do not replace the modular design with a single file.

## Non-negotiable product requirements

1. The extension must use a modular, command-oriented structure.
2. The user workflow must explicitly include:
   - Configure Connection
   - Test Connection
   - Search Confluence
   - Create Markdown From Search Result
3. The extension must add tools to GitHub Copilot Chat so that when the user selects an agent and opens the tools list, the tools from this extension are visible.
4. MVP must include raw extracted markdown generation.
5. Search settings must be configurable at extension level.
6. PAT must be stored securely, never in plain settings.
7. Only one Confluence connection is needed for MVP.
8. Confluence target is Data Center / Server, not Cloud.
9. Attachments are out of scope.

## Technical constraints

- language: TypeScript
- platform: VS Code extension
- no MCP
- use VS Code Language Model Tools API for Copilot tool integration
- use VS Code SecretStorage for PAT
- support base URL with or without context path
- default search scope mode is allowlist
- results from manual search should be written to a dedicated Output channel log
- markdown output should be returned in chat only for MVP, but implementation should be designed so output mode can become configurable later

## Mandatory contributed Copilot tools
Create these tools and make them visible to GitHub Copilot Chat:

1. `search_confluence`
2. `get_confluence_page`
3. `create_markdown_from_confluence_search`

Each tool must have a precise description and schema so the model can choose the correct tool.

## Mandatory commands
Register these commands:

1. `Configure Connection`
2. `Test Connection`
3. `Search Confluence`
4. `Create Markdown From Search Result`

Use stable internal command IDs.

## Mandatory modular file structure
Use a structure close to this and keep responsibilities separated:

```text
src/
  extension.ts
  commands/
  tools/
  services/
  confluence/
  storage/
  ui/
  utils/
  test/
```

## Mandatory services
Implement these services with reusable logic:

- `settingsService`
- `connectionService`
- `searchService`
- `pageService`
- `markdownService`
- `loggingService`
- `cacheService`
- `toolApprovalService`

Commands and tools must reuse these services. Do not duplicate logic.

## Sidebar / UI requirements
Add a new Activity Bar sidebar item for Confluence.

At minimum, the sidebar must support:
- entering base URL
- entering PAT
- saving connection
- testing connection
- entering a search phrase
- triggering search
- showing basic status and last action summary

You may implement the sidebar with a webview or a combination of contributed views, but keep business logic in the extension host.

## Search requirements
Implement simple keyword search first, not advanced raw-CQL-first UX.

Search behavior:
- search title and page text
- restrict to current pages
- prefer title matches when possible
- enforce allowlist by default
- search settings must be configurable through extension settings
- write structured search results to a dedicated Output channel

At minimum, each logged result should include:
- rank
- page id
- title
- space key
- last updated
- url
- excerpt

## Confluence API requirements
Build a dedicated Confluence client.

It should:
- normalize base URL
- keep context path if present
- attach `Authorization: Bearer <PAT>`
- support timeout handling
- throw typed errors
- expose:
  - `testConnection()`
  - `searchContent(...)`
  - `getPageById(...)`
  - `resolvePageFromUrl(...)`

## Page retrieval and markdown requirements
For MVP:
- retrieve page body using Confluence expansions
- convert HTML/view body to markdown
- if markdown conversion fails, fall back safely to plain text
- include metadata and source URL
- apply truncation based on config
- clearly mark when output is truncated

Output shape for markdown generation should contain:
- title
- page id
- space key
- last updated
- source url
- extracted markdown body
- truncation note if applicable

## Security requirements
- use SecretStorage for PAT
- never log PAT
- never log Authorization headers
- never store PAT in settings.json
- provide clean disconnect/clear capability

## Settings requirements
Create extension-level settings for at least:
- base URL
- scope mode (`allowlist` or `all`)
- allowed spaces
- max results
- max page chars
- cache enabled
- cache ttl minutes
- approval toggles for tools
- output verbosity

PAT must not be stored here.

## Approval behavior
Make tool approval configurable.

Support the idea of:
- ask before search tool
- ask before fetch tool
- ask before markdown tool
- trust this workspace / always allow

Persist non-secret approval choices in workspace state.

## Caching requirements
Caching is required in MVP.

At minimum:
- cache search results
- cache page fetches
- use TTL
- add a way to clear cache

## Error handling requirements
Create typed errors and user-friendly handling for:
- invalid base URL
- missing token
- auth failure
- no allowed spaces configured
- timeout
- empty results
- page not found
- markdown conversion failure
- approval denied

## package.json requirements
Do not forget these contribution points:
- commands
- configuration
- views / view container
- languageModelTools

The Copilot tool contribution is one of the main goals of the entire feature. Do not miss it.

## Testing requirements
Create:

### Unit tests
- base URL normalization
- allowlist enforcement
- CQL builder behavior
- truncation behavior
- cache TTL behavior
- approval decision logic

### Integration tests with mocked HTTP
- successful connection test
- invalid PAT
- successful search
- successful page fetch
- empty allowlist failure
- markdown generation path

## Delivery format
Implement the code directly in the workspace.

Before writing code, first output:
1. proposed final file tree
2. command IDs
3. tool names
4. settings keys
5. service responsibilities
6. phased implementation plan

Then start implementation with Phase 1.

## Important guardrails
- Do not use Python for the extension runtime.
- Do not implement Cloud-specific endpoints.
- Do not skip markdown generation in MVP.
- Do not create a design where tools work but manual commands do not, or vice versa.
- Do not return secrets in exceptions.
- Do not silently ignore configuration errors.
- Do not hardcode allowlist spaces.
- Do not make the webview own the search logic.

## Preferred implementation order
1. extension shell + package.json contributions
2. settings + secret storage + connection service
3. test connection
4. search service + output channel
5. page retrieval + markdown service
6. Copilot tools
7. approvals + cache
8. tests + cleanup

