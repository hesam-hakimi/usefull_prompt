# Technical Architecture

## Architecture goals
This extension must be easy to evolve, easy to debug, and easy to patch with targeted prompts later. The architecture should therefore be modular, with clear boundaries between configuration, Confluence API interaction, command execution, tool execution, logging, caching, and markdown transformation.

## High-level architecture

### Layer 1 - UI and VS Code integration
Responsible for:
- commands
- sidebar / view registration
- settings and configuration UX
- output channel display
- notifications
- command wiring
- GitHub Copilot tool registration

### Layer 2 - application services
Responsible for:
- configuration orchestration
- search orchestration
- connection test orchestration
- markdown generation workflow
- approval checks
- cache policy enforcement
- result shaping for logs and tools

### Layer 3 - infrastructure and adapters
Responsible for:
- Confluence REST client
- secret storage adapter
- configuration adapter
- cache adapter
- HTML to Markdown adapter
- URL normalization
- telemetry/log formatting adapter if added later

## Proposed file structure

```text
src/
  extension.ts

  commands/
    configureConnectionCommand.ts
    testConnectionCommand.ts
    searchConfluenceCommand.ts
    createMarkdownFromSearchCommand.ts

  tools/
    searchConfluenceTool.ts
    getConfluencePageTool.ts
    createMarkdownFromConfluenceSearchTool.ts
    toolApprovalService.ts
    toolSessionGuard.ts

  services/
    connectionService.ts
    searchService.ts
    pageService.ts
    markdownService.ts
    settingsService.ts
    loggingService.ts
    cacheService.ts

  confluence/
    confluenceClient.ts
    cqlBuilder.ts
    confluenceMapper.ts
    confluenceTypes.ts
    confluenceErrors.ts

  storage/
    secretStorage.ts
    workspaceStateStore.ts

  ui/
    sidebarProvider.ts
    sidebarMessageRouter.ts
    viewModel.ts
    webview/
      main.js
      main.css
      index.html

  utils/
    url.ts
    string.ts
    htmlToMarkdown.ts
    validation.ts
    constants.ts

  test/
    ...
```

## Core design decisions

### 1. Single connection model
Use one active Confluence connection for MVP.

Why:
- simpler UI
- fewer edge cases
- easier tool execution
- cleaner prompts for Copilot

### 2. Commands and tools should not duplicate core logic
Commands and Copilot tools must both call the same service layer.

Do not create separate logic paths for:
- manual search
- tool-based search

Instead:
- command => searchService
- tool => searchService

That prevents one path from working while the other breaks.

### 3. Search first, fetch later
The search flow should not fetch full bodies for every search result.

Recommended pattern:
- search returns result list with excerpts and metadata
- page fetch happens only for a selected page or tool-driven next step
- markdown generation consumes fetched page data

### 4. Markdown generation should be deterministic
`create_markdown_from_confluence_search` should primarily transform fetched Confluence content into a structured markdown result.

This should not depend on random or hidden LLM prompting inside the extension unless explicitly designed for later phases.

For MVP, keep it deterministic:
- search
- choose top result or explicit page
- fetch page
- convert HTML/plain content to markdown
- shape final markdown string

### 5. Output channel is part of product behavior
Logging is not just for debugging.
It is a functional part of the search experience.

Create one dedicated output channel, for example:
- `Confluence Copilot Tools`

It should support:
- info
- warn
- error
- debug

## Main services and responsibilities

### settingsService
Responsibilities:
- read extension settings
- validate setting values
- merge defaults with user configuration
- provide effective runtime config

Suggested settings:
- baseUrl
- scopeMode
- allowedSpaces
- maxResults
- maxPageChars
- cacheEnabled
- cacheTtlMinutes
- askApprovalForSearchTool
- askApprovalForFetchTool
- askApprovalForMarkdownTool
- outputVerbosity

PAT is not stored here.

### connectionService
Responsibilities:
- save connection settings
- save/retrieve PAT via secret storage
- validate base URL
- test connection
- clear connection
- expose current connection state

### searchService
Responsibilities:
- receive search phrase
- build effective CQL based on settings
- enforce allowlist rules
- call Confluence client search endpoint
- map results into internal result shape
- log search summary and results
- optionally use cache

### pageService
Responsibilities:
- fetch page by ID or URL
- apply max content constraints
- use HTML expansion fields
- map page response to internal page model
- log fetch details

### markdownService
Responsibilities:
- convert fetched page body to markdown
- build raw extracted markdown payload
- attach source metadata
- mark truncation clearly
- support future alternate output modes

### cacheService
Responsibilities:
- cache search results
- cache page fetches
- respect TTL
- expose clear-cache action
- avoid caching secrets

### loggingService
Responsibilities:
- own the Output channel
- sanitize logs
- support structured line output
- respect verbosity setting

### toolApprovalService
Responsibilities:
- check whether a specific tool requires approval
- show allow once / always allow / deny prompt
- persist workspace trust choices

## Confluence client design

### confluenceClient responsibilities
- normalize base URL
- build API URLs
- attach Authorization header with Bearer token
- issue HTTP requests with timeout support
- throw typed errors
- parse JSON responses

### recommended methods
- `testConnection()`
- `searchContent(input)`
- `getPageById(pageId)`
- `resolvePageFromUrl(url)`

### request design
- centralize headers in one place
- never log token
- centralize timeout behavior
- centralize HTTP error parsing

## Search strategy

### Recommended default search behavior
For MVP, use simple search input and internally generate CQL.

Search target:
- page title
- page text

Ranking preference:
- title matches first when possible
- recent modifications next
- current pages only

### Allowlist enforcement
If scope mode is `allowlist`:
- search must include space filtering
- an empty allowlist should block execution and return a clear error

If scope mode is `all`:
- do not add space filter

### Suggested internal CQL pattern
This is conceptual and can be adapted carefully:

```text
(type = page) AND (title ~ "<phrase>" OR text ~ "<phrase>") AND status = current AND space IN ("SPACE1","SPACE2") ORDER BY lastmodified DESC
```

The builder must escape values safely.

## Copilot tool design

### Tool 1 - `search_confluence`
Purpose:
- search for candidate pages

Input:
- phrase
- optional maxResults override

Output:
- list of page hits with metadata

### Tool 2 - `get_confluence_page`
Purpose:
- fetch page content for a known page id or url

Input:
- pageId or url
- optional maxChars override

Output:
- normalized page payload

### Tool 3 - `create_markdown_from_confluence_search`
Purpose:
- search Confluence and return raw extracted markdown from the best result or specified result set

Input:
- phrase
- optional selection hint or page id
- optional maxChars override

Output:
- markdown string
- source metadata
- truncation indicator

## package.json contribution design
The extension should contribute:
- commands
- configuration settings
- activity bar view container
- views
- language model tools

Do not bury the tool integration. It is one of the most important parts of the solution.

## Error handling strategy
Define typed error classes for:
- invalidBaseUrl
- missingToken
- authFailed
- requestTimeout
- noAllowedSpacesConfigured
- searchFailed
- pageNotFound
- htmlConversionFailed
- toolApprovalDenied

Each should map to:
- user-facing message
- log detail
- optional retry suggestion

## Caching strategy
Use an in-memory cache for MVP, optionally backed by workspace state later.

Cache keys:
- search: phrase + scope + limits
- page: pageId + maxChars

Do not cache secrets.

## UI design notes
A sidebar item is required, but avoid putting too much business logic in the webview.

The webview should:
- collect user inputs
- show connection status
- send user actions to extension host
- render results and summaries

The extension host should:
- validate input
- call services
- own state and side effects

## Testability requirements
All core services must be testable without the real VS Code UI.

This means:
- inject configuration dependencies
- inject secret storage adapter
- inject HTTP client abstraction if needed
- keep webview logic thin

