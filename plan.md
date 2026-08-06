Implement the next bounded hardening step for STTM inactive-reference handling.

The investigation has established:

- Excel strikethrough parsing is working correctly.
- The parser correctly distinguishes active and inactive records.
- The real workbook contains 64 mappings:
  - 59 active
  - 5 inactive
- Active mappings FM_00012 and FM_00030 reference inactive schemas
  T_SCHM_0008 and T_SCHM_0026.
- STTM_REFERENCE_INACTIVE is therefore a legitimate reference-consistency finding.

DO NOT change the semantic rule so that an active mapping automatically becomes inactive merely because a referenced schema/rule is inactive.
That would hide inconsistent STTM authoring.

Implement only these two changes:

1. Regression-test the existing strikethrough semantics.

Add synthetic workbook tests covering:
- normal active mapping
- fully struck-through mapping is inactive
- partially struck-through non-key/history content
- inactive schema referenced by active mapping
- inactive mapping referencing active schema
- inactive BR/TR referenced from active mapping
- current active row plus struck-through historical/deleted row
- join/filter/error records whose identifying cells are struck through

Explicitly verify that:
- active mapping -> inactive required reference remains an active mapping
- STTM_REFERENCE_INACTIVE is emitted
- the mapping is NOT silently removed from activeMappings

2. Strengthen generation/readiness behavior.

When an ACTIVE mapping depends on an INACTIVE required schema/rule/reference:
- preserve the diagnostic STTM_REFERENCE_INACTIVE
- classify the affected artifact path as BLOCKED for faithful generation
- do not invent a replacement reference
- do not silently reactivate the referenced entity
- do not silently deactivate the active mapping
- unaffected STTM analysis may continue
- preview may identify the blocked artifact, but no write may occur for an artifact whose required evidence depends on that invalid reference

Keep this generic.
Do NOT special-case:
FM_00012
FM_00030
T_SCHM_0008
T_SCHM_0026
CD Renewal
or any workbook filename.

Do not modify consumer workspace files.

Run targeted tests and the relevant STTM/parser/reference-resolution test suite.

Return:

## Implementation Result

## Semantics Preserved

## New Blocking Behavior

## Regression Tests

## Files Changed

## Test Results

## Compatibility / Risks

## Independent Verifier Result
