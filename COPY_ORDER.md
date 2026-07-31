# Copy Order

Copy these files into the root of the extension source repository while preserving their relative paths.

Do not copy them into an end-user ETL repository.

## 1. Root contract

1. `README.md`
2. `AGENTS.md`

## 2. Workflow target and lifecycle contracts

3. `workflow/targets.yml`
4. `workflow/README.md`

## 3. Repository-wide Copilot instructions

5. `.github/copilot-instructions.md`
6. `.github/instructions/workflow-asset-boundaries.instructions.md`

## 4. Maintainer-only agents

7. `.github/agents/orchestrator.agent.md`
8. `.github/agents/planner.agent.md`
9. `.github/agents/verifier.agent.md`

These agents belong only to the extension repository’s development workflow.

They are not templates for the agents generated in consumer repositories.

## 5. Maintainer prompt entry points

10. `.github/prompts/build.prompt.md`
11. `.github/prompts/plan-change.prompt.md`
12. `.github/prompts/verify-change.prompt.md`
13. `.github/prompts/evolve-product.prompt.md`
14. `.github/prompts/audit-coherence.prompt.md`
15. `.github/prompts/verify-live-flow.prompt.md`

## 6. Business and change contracts

16. `docs/business-context.md`
17. `docs/system-map.md`
18. `docs/change-contract.md`
19. `templates/result.md`

## 7. Mechanical validation

20. `scripts/validate-workflow.mjs`
21. `.github/workflows/workflow-contract.yml`

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
