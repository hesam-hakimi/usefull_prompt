# Confluence Page Write Capability – Detailed Requirements

## Objective
Enable the VS Code + GitHub Copilot tooling to **create, update, append, and upsert Confluence pages** safely, with preview and section-level control.

---

## Core Capabilities
- Search page
- Get page content + metadata
- Create page
- Update full page
- Append content
- Replace section by heading
- Upsert (create if missing, update if exists)
- Preview (dry run)

---

## Functional Requirements

### 1. Page Resolution
- Must support lookup by:
  - spaceKey
  - title (exact match preferred)
  - parentPageId (optional)
- If multiple matches → return ambiguity error (no auto-write)

---

### 2. Create Page
Inputs:
- spaceKey
- title
- content (markdown)
- optional parentPageId

Behavior:
- Create page if not found
- Return pageId, URL, version

---

### 3. Update Page
Inputs:
- pageId
- content

Behavior:
- Fetch current version
- Update safely
- Fail on version conflict (default)

---

### 4. Append Content
Modes:
- end of page
- under heading

Behavior:
- Preserve existing content
- Clean formatting

---

### 5. Replace Section
Inputs:
- pageId
- heading
- newContent

Behavior:
- Replace content under heading only
- Fail if heading not found (default)

---

### 6. Upsert Page (IMPORTANT)
Behavior:
- If page exists → update
- If not → create

Modes:
- create_only
- update_only
- upsert (default)

---

### 7. Preview (Dry Run)
Must:
- show operation type
- show target page
- show summary of changes
- NOT write anything

---

## Tool Contracts (Examples)

### create
{
  "spaceKey": "DATA",
  "title": "ETL Deployment",
  "content": "# Title",
  "contentFormat": "markdown"
}

### upsert
{
  "spaceKey": "DATA",
  "title": "ETL Deployment",
  "content": "# Title",
  "mode": "upsert"
}

---

## VS Code Extension Requirements

### MUST RULE
Every feature must exist in BOTH:
- Copilot tool list
- VS Code sidebar/commands

---

### Required Tools
- confluence_search_pages
- confluence_get_page
- confluence_create_page
- confluence_update_page
- confluence_append_page
- confluence_replace_section
- confluence_upsert_page
- confluence_preview_write

---

## Best Practices – DESIGN

### Safety First
- Always resolve page before write
- Never write if ambiguous
- Always support preview
- Fail safely

---

### Prefer Section Updates
Avoid full overwrite. Use:
- replace section
- append section

---

### Idempotency
- Re-running should not duplicate content
- Upsert must not create duplicates

---

### Logging
Log:
- operation
- target page
- result
- warnings/errors

---

## Best Practices – WRITING CONTENT

### Structure
Use consistent structure:

# Title
## Overview
## Steps
## Validation
## Results
## Next Actions

---

### Headings
Use stable headings so future updates work:
- "Deployment Steps"
- "Validation Results"

---

### Readability
- short paragraphs
- bullet lists
- code blocks for scripts

---

### Code Formatting
Use fenced blocks:

```python
print("hello")
```

```sql
SELECT * FROM table
```

---

### Avoid
- raw logs
- duplicate headings
- messy formatting

---

## Security Requirements
- do not log secrets
- validate permissions
- prevent wrong-page writes

---

## Acceptance Criteria

- create page if missing
- update page if exists
- upsert works correctly
- replace section works safely
- preview does not write
- ambiguity handled safely
- tools visible in Copilot + sidebar

---

## Deliverables

### Code
- API client
- page resolver
- writer logic
- preview logic

### UI
- sidebar commands
- Copilot tools

### Tests
- unit tests
- integration tests

### Docs
- usage examples
- tool contracts

---

## Recommended First Version
- search + get page
- create page
- update page
- upsert page
- replace section
- preview mode

---

## Final Note
Default behavior should prioritize:
- safety
- clarity
- predictability

Never sacrifice correctn
