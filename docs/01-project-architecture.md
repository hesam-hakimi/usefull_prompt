# 01. Project Architecture

## Mission

Build a production-grade **VS Code + GitHub Copilot Chat solution** for ETL Framework 2.0 development and operations.

The user-facing goals are:

1. Chat with an agent to generate ETL job configs and related include files.
2. Reuse or correctly identify the right env config.
3. Validate generated configs before write/deploy.
4. Upload or sync artifacts to Databricks / DBFS in lower environments when needed.
5. Support deployment validation and smoke-test workflows.
6. Help with downstream operational tasks such as ADF, SQL Server, and framework-specific output patterns.

## Architectural principle

The extension should not be a thin prompt wrapper. It should behave like a **layered decision engine**:

- **Intent understanding**
- **Framework-guided planning**
- **Artifact generation**
- **Artifact validation**
- **Env config reuse / patch planning**
- **Artifact reuse / patch planning**
- **Conversation orchestration**
- **Real workspace write**

The important design lesson from this project:  
**Passing generation tests is not enough unless the same artifacts can be written to the real workspace through the live extension flow.**

---

## High-level request flow

A good mental model is:

1. **User intent**
   - Example: “Read bronze customer orders, filter active rows, derive order status, write curated output, and publish to Synapse.”

2. **Intent extraction**
   - Detect source, transform shape, output intent, environment hints, reuse preferences, and whether special output types are requested.

3. **Decision layers**
   - Sourcing strategy
   - Transformation strategy
   - Output strategy
   - Env config reuse strategy
   - Artifact reuse strategy
   - Runtime readiness / required env checks

4. **Blueprint construction**
   - Build canonical in-memory artifact representation:
     - main job config
     - include SQL/YAML files
     - optional output-specific files
     - optional patch or reuse plan

5. **Pre-write validation**
   - Ensure artifacts follow framework rules.
   - Ensure required assertions/options are present.
   - Ensure output strategy is consistent with docs.
   - Ensure runtime requirements are visible.

6. **Preview / chat response**
   - Show selected strategies, warnings, required artifacts, env reuse decisions, and human review items.

7. **Write**
   - Persist files into the actual workspace root selected by the extension.
   - Report what was created, overwritten, skipped, or blocked.

---

## Main architecture layers added during this effort

### 1. Transformation guidance layer
This layer decides:
- whether a requested transform should stay in a **single transformation module**
- or be split into **multiple temp-view chained modules**

It also validates the result and reports the selected strategy in chat.

### 2. Output strategy layer
This layer determines whether the request should render as:

- `curated_load_enrich`
- `generic_dataframe_write`
- `database_out`
- `tibco_out`

This became one of the most important layers because framework docs impose different file patterns, required assertions, module shapes, and include conventions.

### 3. Runtime readiness layer
This layer checks whether the selected strategy can realistically run, including:
- required env vars
- required secrets
- connection requirements
- unresolved placeholders
- required metadata/assertion pins

### 4. Env config discovery + reuse layer
This layer searches the workspace for candidate env configs, scores them, and recommends:
- `reuse_existing`
- `review_required`
- `create_new`

### 5. Env config patch plan layer
This layer converts reuse decisions into concrete actions:
- patch an existing env config
- scaffold a new env config
- force manual review if too many unresolved items exist

### 6. Artifact reuse layer
This layer searches existing:
- job configs
- env configs
- include files

and groups them into reusable artifact sets. It scores them against the requested ETL intent and recommends reuse, patching, or creation.

### 7. Action / review / apply layer
This layer controls:
- previewing patches
- applying patches
- creating new files
- blocking unsafe apply flows
- backing up existing files before modification

### 8. Conversation UX / orchestration layer
This is the multi-turn coordinator that keeps session state across steps like:
- discover
- preview
- confirm
- apply
- cancel
- write

This is what turns the feature set from a set of utilities into a real Copilot workflow.

---

## Source of truth hierarchy

When future prompts or fixes conflict, this order should usually win:

1. **Framework docs and real sample repo patterns**
2. **Validated current extension behavior that matches those docs**
3. **Tests that encode confirmed doc-driven behavior**
4. **Older prompts or legacy assumptions**

This matters because several earlier behaviors were later corrected after doc-fidelity review.

---

## Current reference scenario used heavily in development

The golden scenario used for many fixes:

- Source: `customer_orders`
- Transform: filter active rows + derive `order_status`
- Output: curated load/enrich
- Optional publish: Synapse
- Env config: reuse existing
- Include behavior: follow doc-valid patterns

This scenario exposed multiple issues:
- alias mismatch
- path leaf mismatch (`customer_order` vs `customer_orders`)
- invalid curated zone mapping
- temp-repo-only verification
- real write uncertainty
- Synapse publish behavior requiring special review

---

## What future sessions should preserve

Any future work should preserve these architectural outcomes:

- layered decision making
- doc-driven output rules
- explicit validation instead of silent fallback
- reuse-first behavior for env configs when justified
- review/apply safety around artifact modifications
- separation between preview and write
- clear chat reporting of decisions, warnings, and blockers
