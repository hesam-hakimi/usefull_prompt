/build

Task ID:
ETL-CAPABILITIES-AND-STTM-VERSION-HISTORY-001

This is a new mutating and operational task. Start at INTAKE.

Goal:
Resolve the final two tooling gaps found during the activated 0.3.136 STTM
acceptance test:

1. Make etl_capabilities callable from the actual packaged Product ETL
   Orchestrator workflow so the active Extension version, workspace target,
   parser readiness, and active tool schema can be verified rather than
   inferred.

2. Extend STTM targeted retrieval so current and previous rule descriptions are
   returned as separate structured values with their own version and provenance,
   rather than returning combined version tags with only the current cell text.

Produce, package, and install version 0.3.137.

──────────────────────────────────────────────────────────────────────────────
Confirmed live evidence from 0.3.136
──────────────────────────────────────────────────────────────────────────────

The 0.3.136 activated live test demonstrated:

Working:
- etl_interpret_sttm is registered and callable.
- The exact workspace-relative XLSX is read successfully.
- Targeted retrieval is exposed through:
  - referenceIds
  - sheet
  - range
- BR_0003 is returned completely.
- TR_0003 is returned completely.
- BR_0007 is returned completely.
- TR_0007 is returned completely.
- JC_001 is returned completely.
- FT_001, FT_002, and FT_003 are returned completely.
- No artificial long-cell truncation remains in targeted retrieval.
- No workbook cells were requested from the user.
- No consumer files were written.
- The TR_0003 versus TR_0007 response-label conflict can now be detected from
  complete rule contents.

Remaining defect A:
- etl_capabilities was not registered or available as a callable tool in the
  active Product ETL Orchestrator session.
- Two independent tool searches did not find it.
- Therefore the active version could not be independently confirmed from the
  running Extension.
- Runtime readiness was inferred from successful etl_interpret_sttm execution,
  which is insufficient for the acceptance contract.

Remaining defect B:
- BR_0003/TR_0003 return combined version tags and dates:
  - 2.1, dated 2025-11-20
  - 2.2, dated 2026-04-06
- The parser returns the current/latest merged-cell text only.
- It does not return the Previous Version Description as a separate stored text
  value.
- The workbook has separate columns:
  - Latest Description
  - Previous Version: Description
- The test therefore could distinguish version labels and dates, but could not
  retrieve exact current-versus-previous rule contents independently.
- BR_0007/TR_0007 contain only version 1.4 dated 2025-04-15 and should report no
  previous version rather than inventing one.

──────────────────────────────────────────────────────────────────────────────
Target resolution
──────────────────────────────────────────────────────────────────────────────

Target type:
extension-source

Canonical source may include, as proven necessary:
- package.json tool contributions;
- runtime tool registration;
- src/tools/**;
- STTM parser/model/DTO/serializer code;
- resources/copilot/agents/**;
- resources/copilot/prompts/**;
- product customization/generator manifests;
- managed product-agent upgrade/version logic;
- tests and package verification.

Protected paths:
- .github/**
- AGENTS.md
- workflow/**
- COPY_ORDER.md
- maintainer agents and prompts
- unrelated working-tree WIP
- consumer ETL job/config/SQL/onboarding files

Do not directly edit generated consumer agents as the product implementation.

If the active consumer ETL Orchestrator is stale managed output:
1. identify its managed identity and generator/template version;
2. change the canonical packaged source or generator;
3. test generation in a temporary consumer workspace;
4. provide a separate previewed managed-upgrade path for existing consumer
   workspaces;
5. do not silently overwrite the current consumer agent.

No new maintainer agent, product agent role, or skill should be introduced
unless current source evidence proves that the existing architecture cannot
represent the required behavior.

──────────────────────────────────────────────────────────────────────────────
Defect A investigation: etl_capabilities availability
──────────────────────────────────────────────────────────────────────────────

Trace etl_capabilities across the complete active path:

1. package.json contributes.languageModelTools
2. runtime vscode.lm.registerTool registration
3. implementation service and input/output schema
4. compiled bundle
5. final VSIX contents
6. installed Extension
7. packaged Product ETL Orchestrator tool allowlist
8. create-etl-job prompt tool list and prompt-level tool precedence
9. generated consumer ETL Orchestrator tool allowlist
10. active VS Code Chat session

Determine whether the tool is unavailable because of:
- missing package contribution;
- missing runtime registration;
- tool-ID mismatch;
- product-agent allowlist omission;
- prompt-level tool override;
- stale generated consumer agent;
- stale generated asset catalog;
- packaging omission;
- activation failure;
- or another verified cause.

The final callable tool ID must be verified exactly. The expected logical tool
is:

td-etl.databricks-etl-copilot/etl_capabilities

Do not assume the fully qualified ID without checking the active package
manifest.

etl_capabilities must report active-runtime evidence, not source-disk
assumptions.

Expected semantics:

{
  "extension": {
    "id": "td-etl.databricks-etl-copilot",
    "version": "0.3.137",
    "active": true
  },
  "workspace": {
    "root": "<selected consumer workspace>",
    "targetType": "consumer-etl-workspace"
  },
  "capabilities": {
    "sttmInterpretation": {
      "registered": true,
      "runtimeReady": true,
      "available": true,
      "inputSchema": {
        "sttmPath": true,
        "sttmPaths": true,
        "workspaceRoot": true,
        "includeAudit": true,
        "referenceIds": true,
        "sheet": true,
        "range": true
      },
      "blockers": []
    }
  }
}

The exact DTO may differ, but the semantic evidence must be equivalent.

The active version must come from the currently executing Extension instance,
for example through the active extension context/package metadata. Do not infer
it only from:
- source package.json;
- the newest VSIX filename;
- the installed-directory name;
- code --list-extensions;
- or a previous session summary.

──────────────────────────────────────────────────────────────────────────────
Defect B investigation: current and previous STTM versions
──────────────────────────────────────────────────────────────────────────────

Inspect the full path:

Excel workbook
→ sheet/header recognition
→ merged-cell handling
→ style and strike-through handling where applicable
→ rule parser
→ version/date parser
→ internal STTM rule model
→ targeted-retrieval DTO
→ model-visible serialization

Determine why the parser currently exposes:
- combined version numbers/dates;
- current/latest text;

but does not expose:
- Previous Version Description as a separate value.

Verify the exact workbook columns and header aliases, including:

- Latest Description
- Previous Version: Description
- Version #
- Version Date

Do not infer that the previous text is absent merely because only one rendered
value currently reaches the model.

Preserve exact multiline content, whitespace, SQL, CASE, JOIN, filters, and
UNION ALL definitions.

──────────────────────────────────────────────────────────────────────────────
Required versioned retrieval contract
──────────────────────────────────────────────────────────────────────────────

Targeted rule retrieval should return a structure semantically equivalent to:

{
  "id": "BR_0003",
  "ruleType": "business-rule",
  "current": {
    "text": "<exact Latest Description>",
    "version": "2.2",
    "versionDate": "2026-04-06",
    "sheet": "Business Rules",
    "row": 4,
    "cellOrRange": "<exact cell or range>"
  },
  "previous": {
    "text": "<exact Previous Version: Description>",
    "version": "2.1",
    "versionDate": "2025-11-20",
    "sheet": "Business Rules",
    "row": 4,
    "cellOrRange": "<exact cell or range>"
  }
}

For rules with no previous version:

{
  "id": "BR_0007",
  "current": {
    "text": "<exact current text>",
    "version": "1.4",
    "versionDate": "2025-04-15"
  },
  "previous": null
}

The exact field names may follow current repository conventions, but the
contract must preserve:

- exact current text;
- exact previous text;
- current version;
- previous version;
- current version date;
- previous version date;
- sheet;
- row;
- cell/range;
- rule ID and rule type.

If a previous description exists but its prior version number/date cannot be
authoritatively mapped, return the exact previous text with an explicit unknown
version field. Do not guess.

If the workbook contains more than one historical version and the existing
model supports it, a versionHistory array may be used, but current and immediate
previous must remain directly accessible.

──────────────────────────────────────────────────────────────────────────────
Required implementation behavior
──────────────────────────────────────────────────────────────────────────────

1. Make etl_capabilities callable from:
   - a fresh generated Product ETL Orchestrator in a temporary workspace;
   - the packaged create-job workflow;
   - and, after an approved managed upgrade where required, an existing
     consumer ETL Orchestrator.

2. Ensure prompt-level tool precedence cannot remove etl_capabilities from the
   intended live acceptance flow.

3. Preserve all working 0.3.136 targeted retrieval behavior:
   - referenceIds;
   - sheet;
   - range;
   - untruncated long-cell retrieval.

4. Return current and previous content separately.

5. Do not change STTM business meaning.

6. Do not normalize the TR_0003 versus TR_0007 label conflict.

7. Do not invent previous versions, ER descriptions, registration values, or
   onboarding values.

8. Preserve selected-workspace containment and reject:
   - extension source;
   - extension installation;
   - sample_sttm;
   - another workspace;
   - stale session paths;
   - traversal;
   - external paths not explicitly selected.

9. Keep interpretation and targeted retrieval read-only.

10. Bump the Extension version to 0.3.137.

──────────────────────────────────────────────────────────────────────────────
Required regression tests: etl_capabilities
──────────────────────────────────────────────────────────────────────────────

1. Tool exists in package.json contribution.
2. Tool is registered at runtime.
3. Fully qualified ID matches the active registration.
4. Final VSIX contains the registration and implementation.
5. Packaged Product ETL Orchestrator includes the tool.
6. create-etl-job prompt/tool precedence preserves the tool.
7. A freshly generated temporary consumer ETL Orchestrator can invoke it.
8. An intentionally stale managed consumer agent is detected rather than
   silently treated as current.
9. Active runtime version is reported from the running Extension instance.
10. Parser registered/runtimeReady/available states are reported independently.
11. Tool input schema reports targeted-retrieval capabilities.
12. Missing parser dependency produces runtimeReady=false and an exact blocker.
13. Unknown or extension-source workspace returns a safe target blocker.
14. The capability call writes no files.

──────────────────────────────────────────────────────────────────────────────
Required regression tests: current and previous versions
──────────────────────────────────────────────────────────────────────────────

1. BR_0003 returns:
   - current text from Latest Description;
   - current version 2.2;
   - current date 2026-04-06;
   - previous text from Previous Version: Description;
   - previous version 2.1;
   - previous date 2025-11-20.

2. TR_0003 returns the same separation with exact multiline SQL/CASE content.

3. BR_0007 returns version 1.4 and previous=null.

4. TR_0007 returns version 1.4 and previous=null.

5. Current and previous values must not be concatenated into one text field.

6. Current and previous version tags/dates must not be returned as an
   unassociated combined list.

7. Merged cells and line-separated version cells are handled deterministically.

8. Strike-through or formatting metadata is interpreted only when the current
   workbook contract relies on it; style evidence must not override explicit
   column semantics.

9. Long current and previous cells are returned without artificial truncation.

10. Exact sheet/row/cell or range provenance is preserved for both.

11. Missing previous text returns null or an explicit absence state.

12. Blank previous text is not converted into current text.

13. Unicode, multiline SQL, CASE, JOIN, filters, and UNION ALL content remain
    byte/character faithful apart from documented newline normalization.

14. Targeted retrieval by referenceIds, sheet, and range returns the same
    versioned values.

15. Windows workspace paths, spaces in XLSX filenames, and POSIX equivalents
    pass.

16. Another workspace cannot reuse a previous retrieval context.

17. No user paste request is produced for content present in the workbook.

18. No consumer files are written.

──────────────────────────────────────────────────────────────────────────────
Validation and packaging
──────────────────────────────────────────────────────────────────────────────

1. Run targeted parser, tool, agent, prompt, generation, and package tests.
2. Run broader relevant tests.
3. Demonstrate pre-existing failures against the task-start baseline.
4. Do not weaken unrelated tests or baselines to obtain green results.
5. Package:
   databricks-etl-copilot-0.3.137.vsix
6. Inspect the final VSIX:
   - active tool contribution;
   - runtime registration;
   - Product ETL Orchestrator tool list;
   - prompt tool list;
   - generated asset catalog;
   - parser and DTO implementation;
   - no machine-specific paths;
   - no source-only fallback.
7. Extract the VSIX into a clean temporary directory.
8. Execute packaged-runtime tests without repository node_modules or source
   directories.
9. Generate Product ETL agents only inside a temporary consumer workspace.
10. Confirm protected paths are byte-identical.
11. Invoke a fresh independent Verifier.

──────────────────────────────────────────────────────────────────────────────
Installation lifecycle
──────────────────────────────────────────────────────────────────────────────

Install 0.3.137 only after package verification.

After installation, report:

INSTALLED_NOT_ACTIVATED

Do not report DONE or POST_INSTALL_VERIFIED before:
- VS Code reload;
- active 0.3.137 confirmation through etl_capabilities;
- live targeted retrieval;
- and live current/previous-version retrieval.

Provide the exact user smoke-test prompt and stop for the reload.

──────────────────────────────────────────────────────────────────────────────
Required final report
──────────────────────────────────────────────────────────────────────────────

Report separately:

- root cause of etl_capabilities unavailability;
- whether it was registration, allowlist, prompt precedence, generated-agent
  staleness, packaging, activation, or another cause;
- root cause of missing Previous Version Description;
- exact files changed;
- exact Product Agent/Prompt/Tool schema changes;
- exact parser model and DTO changes;
- generated consumer-agent compatibility and upgrade behavior;
- targeted tests;
- broader test results;
- packaged VSIX evidence;
- installed version;
- protected paths;
- Planner result;
- fresh Verifier result;
- lifecycle state;
- remaining risks.

Do not modify consumer ETL artifacts in this task.
