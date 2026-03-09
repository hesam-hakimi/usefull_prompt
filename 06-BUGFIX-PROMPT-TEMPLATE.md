# Bug Fix Prompt Template

Paste this into Copilot when something breaks. Replace all placeholders with real details.

---

You are fixing an existing VS Code extension project that integrates Confluence Data Center with GitHub Copilot Chat tools.

## Important context
This project must keep its modular architecture and must not be simplified into a one-file workaround.

Mandatory product requirements that must remain true after the fix:
1. explicit commands:
   - Configure Connection
   - Test Connection
   - Search Confluence
   - Create Markdown From Search Result
2. Copilot tools must remain contributed and visible:
   - `search_confluence`
   - `get_confluence_page`
   - `create_markdown_from_confluence_search`
3. PAT must remain in SecretStorage only
4. Confluence target is Data Center / Server
5. search settings stay configurable at extension level
6. markdown generation stays part of MVP
7. manual commands and Copilot tools must continue to share the same core service logic

## Current problem
Describe the issue clearly:

- expected behavior:
  - [replace]
- actual behavior:
  - [replace]
- where it happens:
  - [command / sidebar / tool / startup / tests / build]

## Error details
Paste the exact error text / stack trace / console logs:

```text
[paste exact error here]
```

## Affected files
List the files that are probably involved:

```text
[paste file paths here]
```

## Relevant current code
Paste the current code for the affected files below.
Do not guess. Use the real current code.

```ts
[paste code here]
```

## What I need from you
1. Diagnose the root cause.
2. Explain which module boundary was violated or which assumption failed.
3. Provide the complete updated file content for every file that must change.
4. Do not provide partial snippets unless no other lines need changes.
5. Do not break existing features that are unrelated to this bug.
6. Keep the modular structure.
7. Keep PAT handling secure.
8. Keep the Copilot tools contribution intact.
9. Update or add tests if needed.

## Additional constraints
- do not remove existing commands unless absolutely necessary
- do not rename tool identifiers unless required and justified
- do not hardcode values that belong in settings
- do not add hacks that bypass service reuse
- do not move secrets into plain config
- do not hide the error by swallowing exceptions without logging

## Required response format
Respond in this order:
1. root cause summary
2. impacted modules
3. fix plan
4. complete updated file(s)
5. tests to run
6. risk notes

If multiple fixes are possible, choose the one that best preserves the intended architecture.

---

## Example follow-up if first fix fails
Use this after trying a previous fix.

```text
The previous fix did not solve the issue.
Here is what happened after applying it:
- [describe new behavior]
- [paste new error]

Now reassess from scratch.
Do not assume your previous diagnosis was correct.
Compare the current code path carefully.
Tell me exactly which file or module is still wrong and provide the full corrected file content.
```

