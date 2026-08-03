# Copy Order

Copy these files into the root of the extension source repository while preserving their relative paths.

Do not copy them into an end-user ETL repository.

## 1. Root contract

1. `README.md`
2. `AGENTS.md`

## 2. Workflow target, lifecycle, and recovery contracts

3. `workflow/targets.yml`
4. `workflow/README.md`
5. `workflow/execution-recovery.md`

## 3. Repository-wide Copilot instructions

6. `.github/copilot-instructions.md`
7. `.github/instructions/business-context.instructions.md`
8. `.github/instructions/change-safety.instructions.md`
9. `.github/instructions/workflow-asset-boundaries.instructions.md`
10. `.github/instructions/workflow-coherence.instructions.md`
11. `.github/instructions/execution-recovery.instructions.md`

## 4. Maintainer-only agents

12. `.github/agents/orchestrator.agent.md`
13. `.github/agents/evidence-researcher.agent.md`
14. `.github/agents/planner.agent.md`
15. `.github/agents/verifier.agent.md`

These agents belong only to the extension repository’s development workflow.

They are not templates for the agents generated in consumer repositories.

## 5. Maintainer prompt entry points

16. `.github/prompts/build.prompt.md`
17. `.github/prompts/investigate.prompt.md`
18. `.github/prompts/plan-change.prompt.md`
19. `.github/prompts/verify-change.prompt.md`
20. `.github/prompts/verify-live-flow.prompt.md`

## 6. Business, change, evidence, and result contracts

21. `docs/business-context.md`
22. `docs/system-map.md`
23. `docs/change-contract.md`
24. `docs/definition-of-done.md`
25. `templates/request.md`
26. `templates/evidence-packet.md`
27. `templates/result.md`

## 7. Mechanical validation

28. `scripts/validate-workflow.mjs`
29. `scripts/assert-control-plane-clean.mjs`
30. `.github/workflows/validate-workflow.yml`

## Validation

After copying all files, run:

```text
node scripts/validate-workflow.mjs
```

The command must succeed before relying on the workflow.

## Windows notes

- Preserve the directory names exactly.
- Do not replace `/` in YAML glob patterns with `\`.
- Prefer UTF-8 encoding.
- LF is recommended for `.yml`, `.yaml`, `.js`, and `.mjs`.
- CRLF is acceptable for Markdown files.
- Do not place the workflow inside the extension’s packaged product-template directory.
- Do not copy maintainer agents into `resources/copilot/agents/**`.

## Ownership reminder

| Path | Owner |
| --- | --- |
| `<extension-repo>/.github/**` | Extension maintainers |
| `<extension-repo>/AGENTS.md` | Extension maintainers |
| `<extension-repo>/resources/copilot/**` | Packaged product source |
| `<extension-repo>/src/customization/**` | Product generation and managed-asset logic |
| `<consumer-workspace>/.github/**` | Generated or user-owned consumer assets |
| `<temporary-test-workspace>/.github/**` | Isolated test output |

If a requested target cannot be classified safely, stop instead of writing.
