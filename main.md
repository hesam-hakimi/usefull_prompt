The STTM contains the complete JC_001 join definition, and Field Mapping
references JC_001 explicitly. The create workflow should resolve and retrieve
that full cross-sheet rule automatically.

The current etl_interpret_sttm result truncates the long JC_001 cell, causing
the Agent to ask the user to paste information already present in the
workbook. This is a retrieval/tooling defect, not a genuine business
clarification.

Required behavior:
- preserve full long-cell contents;
- resolve BR_*, TR_*, JC_*, FT_*, and ER_* references across sheets;
- provide targeted retrieval by rule ID or sheet/range;
- preserve sheet, row, cell, version, and version-date provenance;
- ask the user only when the workbook itself is genuinely ambiguous or
  contradictory, not when tool output was truncated.
