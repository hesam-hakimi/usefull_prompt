The current implementation is wrong for my goal.

Problem:
The extension is behaving like an MCP-based solution, or it is otherwise not contributing native tools to GitHub Copilot Chat in VS Code. I do NOT want MCP for this feature. I want native VS Code extension tools that appear in Copilot Chat agent mode under the Tools / Select Tools UI.

Fix the implementation to use the VS Code Language Model Tools API.

Requirements:
1. Remove or stop relying on any MCP-specific implementation for this feature:
   - no mcpServerDefinitionProviders
   - no MCP server dependency for Confluence search
   - no design that requires users to configure MCP
2. Keep the extension modular and command-oriented:
   - Configure Connection
   - Test Connection
   - Search Confluence
   - Create Markdown From Search Result
3. Add native Copilot tools through package.json:
   - contributes.languageModelTools
4. Add these tools:
   - search_confluence
   - get_confluence_page
   - create_markdown_from_confluence
5. Each tool must include:
   - name
   - displayName
   - modelDescription
   - userDescription
   - canBeReferencedInPrompt: true
   - toolReferenceName
   - icon
   - inputSchema
6. Register each tool in extension activation using:
   - vscode.lm.registerTool(...)
7. Ensure these tools are visible in Copilot Chat agent mode under the Tools UI.
8. Keep sidebar + commands for setup and manual testing:
   - Configure Connection stores baseUrl/settings and PAT in SecretStorage
   - Test Connection runs a live validation
   - Search Confluence writes results to an Output channel
   - Create Markdown From Search Result can also be run manually
9. Search settings must remain configurable at extension level.
10. Markdown generation is part of MVP.

Implementation expectations:
- Use TypeScript
- Keep one Confluence connection only
- PAT in SecretStorage only
- No token in logs
- Base URL supports host-only and context-path URLs
- Default scope is allowlist
- Attachments out of scope

Expected project structure:
- src/extension.ts
- src/commands/configureConnection.ts
- src/commands/testConnection.ts
- src/commands/searchConfluence.ts
- src/commands/createMarkdown.ts
- src/tools/searchConfluenceTool.ts
- src/tools/getConfluencePageTool.ts
- src/tools/createMarkdownTool.ts
- src/confluence/client.ts
- src/confluence/search.ts
- src/config/settings.ts
- src/security/secrets.ts
- src/logging/outputChannel.ts
- src/sidebar/... (existing sidebar files if present)

Required package.json changes:
- contribute commands
- contribute view container / sidebar
- contribute configuration
- contribute languageModelTools
- DO NOT contribute MCP providers for this feature

Important:
A chat participant alone is NOT enough. I need actual language model tools contributed by the extension so they appear in the Copilot tools picker in agent mode.

Deliverables:
1. Updated package.json
2. Updated activation code
3. Tool implementation files
4. Any supporting refactors
5. A short verification checklist:
   - Run extension
   - Open Copilot Chat in agent mode
   - Click Select Tools / Tools icon
   - Confirm the three Confluence tools are visible
   - Run a prompt that causes search_confluence to be invoked

Also add fallback logging so I can verify:
- extension activated
- tools registered successfully
- commands registered successfully
- tool invocation started/completed
