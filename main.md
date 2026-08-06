Acceptance Test — Version History

Using only etl_interpret_sttm and etl_capabilities:

Retrieve:

- BR_0003
- TR_0003
- BR_0007
- TR_0007

For each item report:

1. Current version
2. Current version date
3. Previous version
4. Previous version date
5. Full current text
6. Full previous text
7. Whether the previous text is independently retrievable (not inferred from merged cells)

Do not inspect package.json.
Do not inspect source code.
Do not inspect generated markdown.
Use only runtime tools.

PASS only if current and previous texts are independently retrieved from the workbook.

Otherwise report exactly which field cannot be retrieved.
