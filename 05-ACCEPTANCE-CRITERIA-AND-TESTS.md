# Acceptance Criteria and Test Plan

## Acceptance criteria

### A. Configure Connection
1. User can invoke `Configure Connection` from Command Palette or sidebar.
2. User can save base URL and PAT.
3. Base URL accepts host-only or context-path format.
4. PAT is stored securely and is not visible in plain settings.
5. User receives confirmation after save.

### B. Test Connection
1. User can invoke `Test Connection` from Command Palette or sidebar.
2. Valid credentials succeed.
3. Invalid PAT shows a clear error.
4. Invalid base URL shows a clear error.
5. Status is logged and surfaced to the user.

### C. Search Confluence
1. User can invoke `Search Confluence`.
2. Search uses configured scope mode.
3. Allowlist mode blocks search when allowlist is empty.
4. Search results are written to Output channel.
5. Each result includes the required metadata fields.

### D. Copilot tools
1. Extension contributes tools to GitHub Copilot Chat.
2. The tools appear in the agent tools list.
3. `search_confluence` can be invoked successfully.
4. `get_confluence_page` can be invoked successfully.
5. `create_markdown_from_confluence_search` can be invoked successfully.

### E. Markdown generation
1. Markdown generation is part of MVP.
2. Output is raw extracted markdown, not only a short summary.
3. Source metadata is included.
4. Truncation is clearly marked.
5. Conversion failure falls back safely.

### F. Logging and safety
1. Output channel exists and is readable.
2. PAT is never logged.
3. Authorization header is never logged.
4. Errors are user-friendly and debuggable.

## Manual test scenarios

### Scenario 1 - first-time setup
1. Open extension sidebar.
2. Enter valid base URL.
3. Enter PAT.
4. Save connection.
5. Confirm success message.
6. Confirm PAT is not visible in normal settings.

### Scenario 2 - connection test success
1. Click `Test Connection`.
2. Confirm success popup.
3. Confirm Output channel logs request summary without secrets.
4. Confirm sidebar status updates.

### Scenario 3 - connection test failure
1. Replace PAT with invalid value.
2. Run `Test Connection`.
3. Confirm failure is clearly identified as auth-related.
4. Confirm log contains sanitized detail.

### Scenario 4 - search with allowlist
1. Configure allowlist mode.
2. Add one or more allowed space keys.
3. Search for a phrase that should return results.
4. Confirm results appear in Output channel.
5. Confirm each result shows metadata.

### Scenario 5 - search blocked by missing allowlist
1. Set scope mode to allowlist.
2. Remove all allowed spaces.
3. Run search.
4. Confirm clear validation error.
5. Confirm tool and command both honor this rule.

### Scenario 6 - page fetch and markdown generation
1. Use a known page id or search result.
2. Fetch page content.
3. Generate raw extracted markdown.
4. Confirm source metadata and link are included.
5. Confirm truncation note appears if content exceeds limit.

### Scenario 7 - Copilot tools visibility
1. Open GitHub Copilot Chat.
2. Switch to an agent-capable mode where tools are available.
3. Open the tools list.
4. Confirm the extension's tools are visible.
5. Confirm tool names and descriptions are understandable.

### Scenario 8 - tool invocation path
1. Ask the agent a prompt that should trigger `search_confluence`.
2. Confirm tool executes.
3. Ask a prompt that should fetch a specific page.
4. Confirm `get_confluence_page` executes.
5. Ask a prompt to create markdown from a Confluence result.
6. Confirm `create_markdown_from_confluence_search` executes.

## Unit test checklist
- URL normalization with and without context path
- settings default merge
- allowlist validation
- generated CQL contains proper scope restrictions
- output truncation logic
- cache hit and expiration logic
- approval persistence logic
- markdown fallback logic

## Integration test checklist
- test connection success with mocked HTTP 200
- test connection auth failure with mocked HTTP 401
- search success with mocked search JSON
- page fetch success with mocked content JSON
- markdown generation from mocked page response
- search blocked due to empty allowlist

## Regression checklist
Use this list after every bug fix:
- commands still register
- tools still register
- sidebar still loads
- PAT handling still secure
- search still logs results
- markdown generation still works
- no duplicate logic introduced between tool and command flows

