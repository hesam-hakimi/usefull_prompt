# Rahona DAC Phase 0 Discovery

Use the `rahona-dac-researcher` agent.

## Objective

Build an evidence-based, reusable, public-safe understanding of the **Rahona Analytics Zone Data Access and Control** process using available Confluence, Jira, and Excel-to-Markdown tools.

This is a strictly read-only discovery activity for external systems.

## Acronym disambiguation

`DAC` may refer to many unrelated concepts. Do not accept a search result only because it contains the acronym.

Treat a source as in scope only when the surrounding evidence also connects it to one or more of:

- Rahona or Akora
- Analytics Zone or AZ data access
- Data Access and Control
- AKCLDAC
- Data Access Framework or DAF
- Enterprise Data Catalogue or EDC
- MAL Code
- DaaS Business Operations
- SRZ or CZ access provisioning

Exclude digital-to-analog converter, discretionary access control, design automation conference, direct air capture, and all other unrelated meanings. Record ambiguous results as excluded.

## Safety boundaries

- Do not create, update, append, replace, attach, comment, transition, assign, link, watch, or delete anything in Confluence or Jira.
- Do not modify any Excel file.
- Use Excel-to-Markdown only to inspect relevant spreadsheets.
- Write local files only under `docs/rahona-dac/discovery/**`.
- Do not modify `.github/**`, source code, configuration, workflows, or existing documentation elsewhere.
- This repository is public. Do not save internal URLs, page IDs, raw Jira keys, names, emails, AD groups, MAL Codes, schemas, table/view names, business values, secrets, screenshots, copied ticket text, attachments, or raw SharePoint content.
- Use sanitized evidence labels in files. Exact internal locators may be summarized in the chat response only.
- Clearly distinguish official policy, observed implementation, historical example, inference, and unresolved question.
- Never infer inaccessible SharePoint content.

## Step 1 — Confirm tool capability and scope

Inspect the available Confluence, Jira, Excel-to-Markdown, and workspace tools.

Create:

`docs/rahona-dac/discovery/tool-capability-inventory.md`

For each relevant tool record:

- tool name
- read or write capability
- intended use
- whether it is allowed in Phase 0
- risks
- required guardrail

Do not call write-capable external tools.

## Step 2 — Search Confluence

Resolve the most relevant Confluence spaces first, then search using combinations of the following terms. Do not rely on bare `DAC` searches without Rahona-specific anchors.

- Rahona Data Access and Control
- Akora Analytics Zone Data Access
- Analytics Zone Data Access
- AKCLDAC
- Data Access Framework
- DAF spreadsheet
- EDC metadata
- Enterprise Data Catalogue
- MAL Code
- Elevated data access
- Non-Elevated data access
- Data Access Revocation
- Privacy Designate
- PIA approval
- Data Owner approval
- Analytics Zone Owner approval
- Security Classification
- Data Treatment
- PII
- PCI-DSS
- Restricted data
- Confidential data
- ADIDO
- Data Project Intake
- EIM Access Services
- DaaS Business Operations
- AMoAR
- RMR
- Data Access Code Generator
- DAC Copilot, only when Rahona context is confirmed

For every relevant page capture internally during research:

- sanitized source label
- source category
- owner/team category
- last updated date
- scope
- authority level
- process stage
- referenced forms/templates/reports
- possible staleness
- conflicts with other sources

Do not save internal URLs or identifiers in repository files.

## Step 3 — Search Jira

Use only Jira search and read operations.

Find a representative recent sample covering:

1. completed Rahona Analytics Zone data-access requests
2. requests returned for additional information
3. cancelled requests
4. Elevated requests
5. Non-Elevated requests
6. SRZ access
7. CZ access
8. revocation requests
9. PII or PCI-DSS requests
10. Restricted, Critical, or Confidential data patterns
11. multiple MAL Code or multi-asset patterns
12. approval delays
13. successful requests with no correction
14. requests related to SpruceX or comparable Analytics Zones, when safely identifiable

Extract only reusable process patterns:

- request category
- workflow statuses
- required field categories
- attachment categories
- approval evidence patterns
- common missing information
- return reasons
- cancellation reasons
- execution team categories
- closure criteria
- approximate stage timing
- reusable business-rationale structure

Never copy request-specific identities or sensitive values into repository files.

## Step 4 — Discover templates and artifacts

Identify accessible references to:

- EDC export
- Data Access Framework spreadsheet
- PIA template
- intake/support form
- Elevated request form
- Non-Elevated request form
- revocation spreadsheet
- approval evidence
- AMoAR report
- RMR report
- permission-validation script
- Data Access Code Generator
- Rahona DAC Copilot prompts

When an Excel file is accessible:

- use Excel-to-Markdown
- do not modify the source
- record workbook/sheet structure only when public-safe
- capture dimensions, headers, formulas, validations, hidden structures, and structural rules
- use redacted examples
- flag discrepancies between template versions

## Step 5 — Produce discovery artifacts

Create these public-safe Markdown files:

### `docs/rahona-dac/discovery/source-inventory.md`

Include sanitized source label, source system, date, owner/team category, authority, scope, process stage, and staleness risk.

### `docs/rahona-dac/discovery/process-model.md`

Include:

- purpose and boundaries
- Rahona DAC versus ADIDO versus Data Project Intake/ETL
- actors
- pre-work
- data discovery
- DAF preparation
- privacy/PIA
- approvals
- intake
- review
- execution/provisioning
- validation
- monitoring/reporting
- revocation
- support/escalation
- closure
- decision points
- observed timelines with source category and confidence

Add a Mermaid process flow.

### `docs/rahona-dac/discovery/template-catalog.md`

For each artifact include purpose, source category, current version when known, required field categories, preparer, approver, usage stage, validation rules, and limitations.

### `docs/rahona-dac/discovery/jira-patterns.md`

Include successful, returned, cancelled, approval-delay, metadata-gap, attachment-gap, workflow/status, and closure patterns.

### `docs/rahona-dac/discovery/rules-matrix.md`

Create a matrix for request type, source zone, destination Analytics Zone type, security classification, PII, PCI-DSS, data treatment, Elevated/Non-Elevated, approvals, and allowed/conditional/not-allowed status.

Do not fill unresolved values by inference.

### `docs/rahona-dac/discovery/conflicts-and-open-questions.md`

Include conflicting documents, inconsistent Jira behavior, missing authority, potentially outdated rules, unclear ownership, paused processes, acronym ambiguity, and questions requiring confirmation.

### `docs/rahona-dac/discovery/sharepoint-evidence-request.md`

Because SharePoint is inaccessible, request the exact missing evidence from the user. For every item include the question, why it matters, expected page/section, requested format, and blocked decision.

Do not copy raw SharePoint content into this public repository.

### `docs/rahona-dac/discovery/phase-0-summary.md`

Include confirmed findings, observed-only findings, unknowns, acronym filtering performed, whether evidence is sufficient for a general assistant, recommended Phase 1 architecture, proposed agents/skills, guardrails, and recommended first pilot.

## Evidence format

For claims in public files use a safe format:

```text
Evidence: Official Confluence source C-01
Observed/updated: YYYY-MM-DD or UNKNOWN
Classification: official policy | observed implementation | historical example | inference | unresolved
Confidence: High | Medium | Low
```

Do not save exact internal source locators.

## Completion response

At the end provide in chat:

1. concise findings summary
2. exact files created or changed
3. exact internal source locators used, only as a private chat summary and only when necessary
4. SharePoint evidence required from the user
5. excluded unrelated DAC meanings
6. recommended next bounded step

Do not implement operational agents, submit requests, or modify external systems during Phase 0.
