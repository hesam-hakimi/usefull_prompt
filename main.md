/build

Task ID:
ETL-ORCHESTRATOR-DEFAULT-CAPABILITY-AND-VERSION-TEST-001

This is a new mutating task. Start at INTAKE.

Goal:
Make etl_capabilities enabled by default for the packaged and generated Product
ETL Orchestrator, and correct the STTM version-history acceptance semantics for
rules that genuinely have no previous revision.

Produce version:
0.3.138

──────────────────────────────────────────────────────────────────────────────
Confirmed live evidence
──────────────────────────────────────────────────────────────────────────────

The active Extension version is 0.3.137.

Confirmed facts:

1. etl_capabilities is globally registered by the Databricks ETL Copilot
   Extension and is visible in VS Code Configure Tools.

2. In Configure Tools for the Product ETL Orchestrator, etl_capabilities was
   present but unchecked, while the other ETL tools were selected.

3. Before manually selecting it, Product ETL Orchestrator reported:
   "etl_capabilities is not available in this session."

4. After the user manually checked etl_capabilities, clicked OK, and opened a
   fresh chat, the tool became callable and returned:
   - Extension: td-etl.databricks-etl-copilot v0.3.137
   - selected consumer workspace;
   - target type consumer-etl-workspace;
   - runtimeReady=true;
   - available=true;
   - blockers=[] or equivalent;
   - 16/16 ETL tools contributed.

5. Therefore, this is not a runtime registration, implementation, parser,
   bundling, or VSIX dependency defect.

The verified defect is:

Globally registered: YES
Visible in Configure Tools: YES
Enabled by default for Product ETL Orchestrator: NO
Callable before manual selection: NO

Manual tool selection is a workaround and must not be required from end users.

──────────────────────────────────────────────────────────────────────────────
Version-history evidence
──────────────────────────────────────────────────────────────────────────────

The active STTM parser correctly retrieves:

BR_0003 and TR_0003:
- current version 2.2 dated 2026-04-06;
- previous version 2.1 dated 2025-11-20;
- complete current and previous text independently.

The workbook directly confirms:

BR_0007:
- Business Rules row 8;
- version 1.4;
- version date 2025-04-15;
- exactly one revision;
- no Previous Version block exists.

TR_0007:
- Transformation Rules or Logic row 8;
- version 1.4;
- version date 2025-04-15;
- exactly one revision;
- no Previous Version block exists.

Therefore BR_0007/TR_0007 must not fail merely because previous content is
absent. The correct semantic result is previous=null / exists=false.

──────────────────────────────────────────────────────────────────────────────
Target resolution
──────────────────────────────────────────────────────────────────────────────

Target type:
extension-source

Canonical product source may include:

- resources/copilot/agents/etl-orchestrator.agent.md
- resources/copilot/prompts/create-etl-job.prompt.md
- relevant Product Agent generator/catalog/manifest code
- managed-agent audit and upgrade logic
- product asset tests
- package and VSIX verification tests
- acceptance-test definitions

Protected paths:

- .github/**
- AGENTS.md
- workflow/**
- COPY_ORDER.md
- maintainer agents and prompts
- consumer ETL job/config/SQL/onboarding files
- unrelated working-tree WIP

Do not implement the product fix by directly editing generated consumer output.

──────────────────────────────────────────────────────────────────────────────
Required investigation
──────────────────────────────────────────────────────────────────────────────

Trace the default Product ETL Orchestrator tool selection through:

1. canonical packaged agent frontmatter;
2. ETL Tool Policy in the agent body;
3. create-job prompt frontmatter and prompt-level tool precedence;
4. CopilotAssetCatalog and related product-asset catalogs;
5. generated-agent renderer;
6. generated consumer agent frontmatter;
7. managed asset manifest/version;
8. audit/repair/upgrade behavior;
9. packaged VSIX;
10. fresh consumer workspace generation.

Determine why etl_capabilities was visible globally but unchecked for the
Product ETL Orchestrator.

Do not repeat investigation of runtime implementation or STTM parser internals
unless current evidence contradicts the live result.

──────────────────────────────────────────────────────────────────────────────
Required implementation: default tool selection
──────────────────────────────────────────────────────────────────────────────

1. Ensure the fully qualified active tool ID for etl_capabilities is present in
   the canonical Product ETL Orchestrator frontmatter tool list.

2. Include etl_capabilities in the Product ETL Orchestrator body under the
   planning/preflight tool policy.

3. If create-etl-job.prompt.md or another prompt has an explicit tools list,
   ensure prompt-level precedence does not remove etl_capabilities.

4. Ensure the Product Agent generator and asset catalog preserve the tool.

5. A newly generated Product ETL Orchestrator in a temporary consumer workspace
   must have etl_capabilities selected by default.

6. The user must not need to open Configure Tools and manually check it.

7. Existing managed consumer agents missing the expected tool must be reported
   as managed drift.

8. Provide a previewed, approval-gated managed upgrade path for those existing
   agents.

9. Do not overwrite unmanaged consumer agents.

10. Preserve the user's manual selection if it already matches the canonical
    expected state.

11. Keep write, publish, deploy, and run approval boundaries unchanged.

──────────────────────────────────────────────────────────────────────────────
Required implementation: version-history semantics
──────────────────────────────────────────────────────────────────────────────

Normalize version retrieval semantics as follows:

A. Rule has a previous revision:

{
  "current": {
    "text": "<exact current text>",
    "version": "<current version>",
    "versionDate": "<current date>"
  },
  "previous": {
    "exists": true,
    "text": "<exact previous text>",
    "version": "<previous version>",
    "versionDate": "<previous date>"
  }
}

B. Rule has exactly one revision:

{
  "current": {
    "text": "<exact current text>",
    "version": "<current version>",
    "versionDate": "<current date>"
  },
  "previous": {
    "exists": false,
    "text": null,
    "version": null,
    "versionDate": null,
    "reason": "No previous revision exists in the workbook."
  }
}

Equivalent field names may follow current repository conventions.

Do not:
- fabricate a previous revision;
- copy current text into previous;
- treat absence as a parser failure;
- fail the acceptance test when the workbook authoritatively contains one
  revision.

Update acceptance criteria:

- If a Previous Version block exists, current and previous must be independently
  retrievable.
- If no Previous Version block exists, explicit previous.exists=false is PASS.

BR_0007 and TR_0007 are required single-revision PASS fixtures.

──────────────────────────────────────────────────────────────────────────────
Do not change
──────────────────────────────────────────────────────────────────────────────

Preserve the verified 0.3.137 behavior:

- long-cell retrieval;
- referenceIds retrieval;
- sheet retrieval;
- range retrieval;
- BR/TR/JC/FT complete content;
- current/previous separation for BR_0003/TR_0003;
- selected-workspace containment;
- no sample_sttm fallback;
- no user paste request;
- no consumer writes.

Do not automatically resolve the business conflict between:

- TR_0003 version 2.2 current labels;
- TR_0007 version 1.4 aggregation labels.

The Extension must report that conflict but must not invent corrected
aggregation SQL.

──────────────────────────────────────────────────────────────────────────────
Required tests
──────────────────────────────────────────────────────────────────────────────

Default-tool tests:

1. Canonical Product ETL Orchestrator frontmatter contains etl_capabilities.
2. Agent-body ETL Tool Policy contains etl_capabilities.
3. Prompt tool precedence does not remove it.
4. Asset catalog and renderer preserve it.
5. A fresh generated consumer ETL Orchestrator includes it.
6. The generated agent presents etl_capabilities as selected by default.
7. A fresh Product ETL Orchestrator chat can call it without manual UI changes.
8. A stale managed agent missing the tool is detected.
9. Managed upgrade preview includes the exact bounded frontmatter/tool change.
10. Unmanaged consumer agents are not overwritten.
11. Tool remains read-only.
12. No workspace files are written during etl_capabilities execution.

Version-history tests:

13. BR_0003 current and previous independently retrieve and PASS.
14. TR_0003 current and previous independently retrieve and PASS.
15. BR_0007 returns exactly one revision and previous.exists=false; PASS.
16. TR_0007 returns exactly one revision and previous.exists=false; PASS.
17. Missing previous content is not reported as a tooling failure.
18. Current text is never copied into previous text.
19. Version and date provenance remain correct.
20. Long current and previous texts remain untruncated.
21. Windows, spaces in filenames, and POSIX path cases pass.
22. No workbook content is requested from the user.
23. No consumer ETL artifacts are written.

Package/runtime tests:

24. Package databricks-etl-copilot-0.3.138.vsix.
25. Inspect packaged Product Agent, prompt, catalog, and generated assets.
26. Generate into a unique temporary consumer workspace.
27. Verify etl_capabilities is enabled by default there.
28. Run package tests without relying on source-only files.
29. Confirm no machine-specific paths.
30. Confirm protected paths remain byte-identical.
31. Invoke a fresh independent Verifier.

──────────────────────────────────────────────────────────────────────────────
Installation lifecycle
──────────────────────────────────────────────────────────────────────────────

Install 0.3.138 only after package verification.

Then report:

INSTALLED_NOT_ACTIVATED

Do not report POST_INSTALL_VERIFIED before:

- Developer: Reload Window;
- a fresh Product ETL Orchestrator chat;
- etl_capabilities callable without manual tool selection;
- version-history acceptance passing under the corrected one-revision
  semantics.

Provide the exact live smoke-test prompt and stop for user action.

──────────────────────────────────────────────────────────────────────────────
Required final report
──────────────────────────────────────────────────────────────────────────────

Report:

- exact reason etl_capabilities was unchecked by default;
- exact canonical source corrected;
- prompt-precedence findings;
- catalog/generator findings;
- managed-agent upgrade behavior;
- version-history acceptance correction;
- exact files changed;
- exact tests and results;
- VSIX evidence;
- installed version;
- protected paths;
- Planner result;
- fresh Verifier result;
- lifecycle state;
- remaining risks.

Do not modify consumer ETL artifacts.
