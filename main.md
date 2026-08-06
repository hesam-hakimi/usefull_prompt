New investigation only.

Do NOT modify STTM parsing.

Do NOT modify targeted retrieval.

Do NOT modify version history.

Those are already verified.

The only remaining defect is:

etl_capabilities is not callable in the live Product ETL Orchestrator session.

The activated 0.3.137 extension successfully exposes:

- etl_interpret_sttm
- targeted retrieval
- referenceIds
- sheet
- range
- includeAudit
- workspaceRoot

but etl_capabilities is completely absent.

The acceptance report states:

"No such tool exists in my available tool list."

I need a root-cause investigation only.

Trace etl_capabilities through every stage:

1. implementation
2. runtime registration
3. package.json contribution
4. esbuild bundle
5. packaged VSIX
6. generated Product Agent
7. generated Prompt
8. tool allow-list
9. customization catalog
10. active tool registry

Determine exactly where it disappears.

Do not assume.

At every stage answer only:

FOUND
or
NOT FOUND

If FOUND, report:

- exact tool id
- registration location
- owning source file

If NOT FOUND, report the first stage where it disappears.

Do not fix anything.

Do not change any code.

Return only a root cause analysis.
