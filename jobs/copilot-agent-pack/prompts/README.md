# ETL Tool-Aware Copilot Pack

This pack is tailored to your available tool list.

Included:
- repo-wide Copilot instructions
- a tool-aware `developer.agent.md`
- implementation prompts
- a tool usage map
- a class/function naming map for targeted fixes

## Recommended usage
1. Copy `.github/` into your extension repo.
2. Review tool IDs in `.github/agents/developer.agent.md`.
3. Start with:
   - `.github/prompts/00-master-build.prompt.md`
   - `.github/prompts/01-implement-tool-aware-agent.prompt.md`
4. Continue with:
   - `.github/prompts/02-generate-artifacts.prompt.md`
   - `.github/prompts/03-add-validation-and-dev-deploy.prompt.md`
5. Use `.github/prompts/04-fix-bug.prompt.md` for targeted fixes.

## Note
One Databricks tool in the screenshot appears under a different prefix:
- `todo.databricks-copilot-tools/searchDatabricksNotebooks`

If that was temporary, update the agent file once the final tool prefix is confirmed.
