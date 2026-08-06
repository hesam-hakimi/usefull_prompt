# Rahona Analytics Zone Data Access and Control Automation

## Scope

In this folder, **Rahona DAC** means the **Rahona Analytics Zone Data Access and Control** process used to govern access to Rahona SRZ/CZ data for Analytics Zones.

The acronym `DAC` is overloaded. Content is in scope only when it is corroborated by Rahona/Akora, Analytics Zone, AKCLDAC, DAF, EDC, MAL Code, DaaS Business Operations, or SRZ/CZ provisioning context.

Unrelated uses of DAC must be excluded.

## Initial components

- `.github/agents/rahona-dac-researcher.agent.md`
- `.github/agents/rahona-dac-verifier.agent.md`
- `.github/prompts/rahona-dac-phase-0-discovery.prompt.md`
- `.github/prompts/rahona-dac-phase-0-verify.prompt.md`

## Operating model

1. Run the Phase 0 discovery prompt with the researcher agent.
2. Review generated public-safe discovery artifacts.
3. Manually retrieve specifically requested SharePoint evidence.
4. Provide sanitized evidence to the researcher without committing raw SharePoint content.
5. Run the verification prompt with the independent verifier.
6. Build operational orchestration, classification, DAF validation, and submission-preparation skills only after Phase 0 evidence is verified.

## Safety boundaries

This is a public repository.

Do not commit:

- raw SharePoint content or screenshots
- internal Confluence or Jira URLs and identifiers
- employee names or email addresses
- AD group names
- real MAL Codes, schemas, tables, views, or business values
- secrets, credentials, tokens, or connection strings
- copied ticket bodies, comments, or attachments

The initial agents have read-only access to external systems. They may create public-safe local discovery files only within `docs/rahona-dac/discovery/**`.

## Current status

The initial researcher, verifier, and bounded Phase 0 prompts are scaffolding. They do not submit Rahona DAC requests, perform approvals, change Jira/Confluence, or provision data access.
