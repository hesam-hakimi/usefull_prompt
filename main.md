/build

Goal:
Restore deterministic STTM Excel interpretation and reconcile the packaged ETL
agents, skills, prompts, runtime tools, and final VSIX so a user-provided .xlsx
STTM can be read directly without asking the user to paste its contents.

Confirmed evidence:
- The packaged ETL Orchestrator and etl-create-job skill reference:
  td-etl.databricks-etl-copilot/etl_interpret_sttm
- In the active consumer session, the Agent reported:
  "I have no tool that can parse the binary .xlsx contents."
- The Databricks ETL Copilot section in Configure Tools does not show
  etl_interpret_sttm.
- The source agents also reference companion tool IDs that differ from the
  currently exposed provider tool IDs, including camelCase La Pulga and Jira
  IDs versus current databricks_* and jira_* IDs.
- 137 tools are globally selected.
- ETL Implementer has raw edit/execute tools but does not expose the guarded
  etl_write_to_workspace tool.
- ETL Verifier and Runtime Troubleshooter have broader execution capabilities
  than their read-only roles require.

Required target resolution:
- Modify Extension source and packaged product source only.
- Do not modify consumer ETL artifacts.
- Do not modify maintainer .github/** agents unless a separate maintainer
  workflow defect is proven and explicitly authorized.
- Canonical product agent and skill source remains resources/copilot/**.

Investigation:
1. Compare the active installed extension version with the source branch and
   built VSIX.
2. Inventory package.json contributes.languageModelTools, every
   vscode.lm.registerTool call, generated manifests, compiled output, and VSIX
   contents.
3. Determine why etl_interpret_sttm is absent:
   - missing package contribution,
   - missing runtime registration,
   - naming mismatch,
   - when-clause,
   - stale build/VSIX,
   - prompt-file tool override,
   - or activation failure.
4. Inspect create-etl-job.prompt.md frontmatter because prompt tool lists take
   precedence over custom-agent tool lists.
5. Inventory every tool ID referenced by packaged agents, prompts, skills, and
   instructions and compare them against actual current provider IDs.
6. Reuse any existing historical STTM/Excel parser service before implementing
   a new parser.

Required implementation:
1. Restore or implement an Extension-owned etl_interpret_sttm language-model
   tool.
2. Resolve the supplied STTM path against the selected consumer workspace.
3. Enforce canonical containment and reject Extension source/install/docs,
   sample_sttm, traversal, UNC, different-drive, and stale session paths.
4. Parse .xlsx deterministically without terminal execution or macro execution.
5. Return structured source, target, mapping, transformation, filter, join,
   comments, unresolved items, diagnostics, and sheet/cell provenance.
6. Do not silently use packaged samples or require manual copy/paste as the
   normal workflow.
7. Add etl_capabilities to report active version, workspace, registered tools,
   optional providers, and blockers before workflow analysis.
8. Replace stale or invalid companion tool IDs with verified current IDs.
9. Replace deprecated/invalid ask-question tool references with the verified
   current core tool ID.
10. Add a build-time validator that fails for unknown, unavailable, deprecated,
    or incorrectly scoped tool IDs.
11. Remove raw edit and execute from ETL Implementer. It must produce candidate
    artifacts through render tools and return them to the Orchestrator.
12. Keep etl_write_to_workspace under the trusted Orchestrator approval path.
13. Remove execute and mutation tools from ETL Verifier.
14. Make ETL Runtime Troubleshooter read-only; move start, execute, upload,
    update, retry, publish, and run capabilities behind a separate approved
    operator flow.
15. Reduce each agent to a least-privilege tool set. Do not rely on 137 globally
    selected tools.

Skill changes:
1. Add a generic etl-sttm-document-understanding skill.
2. Make etl-create-job a thin workflow wrapper.
3. Move detailed version-sensitive Framework rules from duplicated agent/skill
   text into versioned resources/copilot/knowledge/framework-contracts/**.
4. Preserve existing preview-first, explicit approval, guarded write, managed
   ownership, and independent verification contracts.

Regression tests:
1. Active tool catalog contains every required extension-owned tool referenced
   by packaged agents and prompts.
2. Unknown or stale companion tool IDs fail the build.
3. Prompt-file tool precedence cannot remove etl_interpret_sttm from the create
   workflow.
4. A Windows consumer workspace can interpret:
   sttm/CD-Renewal_DataMapping_V2.2 1.xlsx
5. Equivalent POSIX path behavior passes.
6. Filenames containing spaces are supported.
7. Multiple sheets and mapping provenance are preserved.
8. Missing, encrypted, malformed, oversized, and unsupported workbooks fail
   with exact blockers.
9. External/sample/stale paths are rejected.
10. The create workflow never asks the user to paste the full STTM when the
    parser capability is available.
11. Preview writes no files.
12. Implementer and Verifier cannot perform raw workspace writes.
13. Only the guarded writer can write the exact approved manifest.
14. Final VSIX contains the parser, tool contribution, registration, agents,
    skills, prompts, and no machine-specific paths.
15. A live smoke test against the activated installed VSIX confirms that the
    first STTM-specific action invokes etl_interpret_sttm and proceeds to an
    artifact preview.

Verification:
- Run targeted tests.
- Run broader relevant tests.
- Inspect the final VSIX.
- Reload VS Code and verify the active extension version.
- Perform a consumer-workspace smoke test.
- Invoke a fresh ETL Verifier.
- Do not report DONE until tool registration, active runtime behavior, and
  guarded write boundaries are independently verified.
