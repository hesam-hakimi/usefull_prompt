
Keep the current Mermaid diagram.

Do NOT redesign it.

Only refine it.

Required changes

1. Remove "Business Orchestrator".

2. Replace it with "FastAPI API".

3. Show communication as

Users
↓
React SPA
↓
HTTPS REST API
↓
FastAPI API

4. Move Azure AI Search out of the Data Platform.

Azure Cloud should contain

- Microsoft Entra ID
- Managed Identity
- Azure OpenAI
- Azure AI Search

Data Platform should contain

- Azure SQL

5. Keep Azure SQL as the only data platform component.

6. Keep node labels short.

7. Remove unnecessary implementation terminology.

8. Keep the same visual style.

9. Keep the same colors.

10. Keep the same layout.

11. Produce presentation-quality Mermaid.

---

Save the output instead of printing it in chat.

Create the following file if it does not already exist:

docs/presentations/architecture/current/current_architecture.mmd

The file must contain:

- Mermaid flowchart
- Title
- Legend
- Short description at the top

Also generate a Markdown preview file:

docs/presentations/architecture/current/current_architecture.md

The Markdown file should contain:

# Current Architecture

A short description.

Then embed the Mermaid diagram using

```mermaid
...
```

Finally, reply ONLY with:

- Files created
- File paths
- Any validation errors

Do NOT print the Mermaid diagram in chat.
