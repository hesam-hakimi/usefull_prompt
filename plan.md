INVESTIGATION ONLY — DO NOT MODIFY FILES

Investigate whether the STTM parser correctly treats Excel strikethrough formatting as an inactive/deprecated record marker.

Context:
A real STTM workbook was successfully parsed with:
- 59 active mappings
- review findings including:
  FM_00012 -> T_SCHM_0008
  FM_00030 -> T_SCHM_0026
  reported as active mappings referencing inactive schemas.

In the workbook, some schema/mapping/rule rows are visually struck through and are intended to represent obsolete/inactive content.

I need a deterministic answer, not an inference.

Inspect the STTM parser implementation and its tests.

Determine:

1. Does the XLSX reader capture Excel font strikethrough (`font.strike`) at:
   - cell level
   - row/entity level
   - schema definitions
   - field mappings
   - business rules
   - transformation rules
   - join clauses
   - filters
   - error definitions?

2. Where is active/inactive status currently derived from?

3. Specifically trace:
   - T_SCHM_0008
   - T_SCHM_0026
   - FM_00012
   - FM_00030

For each one report:
- workbook sheet
- row
- whether relevant cells are struck through
- whether parser marks the record active or inactive
- whether it contributes to `activeMappings`
- whether it contributes to rule/reference resolution
- why.

4. Determine whether the parser currently:
   A. correctly excludes struck-through obsolete records,
   B. recognizes strike-through only in some STTM sections,
   C. ignores strike-through entirely,
   D. or has another explicit inactivity mechanism.

5. Check for the broader semantic bug:
A struck-through record must not silently become active merely because its cell text is present.

Do NOT assume all formatting is semantic.
Determine from existing STTM behavior/tests whether strikethrough is the established deletion/inactivation convention.

6. If a defect exists, identify the smallest GENERIC fix.
The fix must not contain:
- CD Renewal-specific IDs
- workbook-specific filenames
- T_SCHM_0008/T_SCHM_0026 special cases
- FM_00012/FM_00030 special cases.

7. Propose regression tests using synthetic workbooks covering:
- active normal row
- fully struck-through row
- partially struck-through row
- struck-through schema referenced by active mapping
- struck-through mapping referencing active schema
- struck-through BR/TR
- current row plus struck-through historical/deleted row

Do not implement yet.

Return:

## Verdict
PASS / DEFECT / PARTIAL SUPPORT

## Current Strikethrough Semantics

## Trace
| ID | Sheet | Row | Strike | Parser State | Counted Active? | Reason |

## Root Cause

## Generic Fix

## Required Regression Tests

## Files That Would Need To Change

## Files Changed
None
