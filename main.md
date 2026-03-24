Your previous response is no longer acceptable because the missing standards have now been provided in the attached screenshots.

You must continue and implement the rule-driven naming logic based on the attached standards.
Do NOT say standards are missing unless a specific sub-rule is still genuinely undefined.
Do NOT stop the work just because some fields remain ambiguous.
Implement the rules that are clearly defined, and isolate only the truly ambiguous pieces.

SOURCE OF TRUTH FROM ATTACHED STANDARDS

1) OFW job naming standards
- ACJ_<FRAMEWORK>_<MALCODE>_<TENANTID optional>_<DESCRIPTION-FUNCTION>
- PLJ_<FRAMEWORK>_<MALCODE>_<DESCRIPTION-FUNCTION>
- SLA_<FRAMEWORK>_<MALCODE>_<DESCRIPTION-FUNCTION>
- FWJ_<FRAMEWORK>_<MALCODE>_<DESCRIPTION-FILENAME>
- Job names must be UPPER CASE
- Tenant ID is optional and only applicable for consumption jobs

2) OFW framework tokens listed
- ING | ETL | DM | IDA | ECM | ANL

3) JSON onboarding naming standards
- JOB_<MALCODE>_<DESCRIPTION>_<JIRA#>.json
- PL_<MALCODE>_<FRAMEWORK>_<DESCRIPTION>_<JIRA#>.json
- SLA_<MALCODE>_<DESCRIPTION>_<JIRA#>.json
- JIRA number optional but recommended

4) ADLS/CZ naming conventions
- No semantic name change from on-prem naming
- Cloud ADLS names are represented in lowercase in the standard examples
- If BLV exists on-prem, same view name exists in ADLS
- Tables/views/columns converted to lowercase

5) Synapse naming conventions
- Synapse physical table name = <table_name>_base_table
- DAC/simple Synapse view keeps the existing target object name
- Stage temp table = <table_name>_stage
- CTAS temp table = <table_name>_ctas

IMPORTANT IMPLEMENTATION RULES

A. You must implement rule-driven helpers, not customer_orders-specific hardcoding.

B. You must separate:
- rules that are explicitly defined by standards
- fields that are still ambiguous and therefore must be supplied or inferred via existing metadata/repo logic

C. For ambiguous pieces, do NOT invent hidden logic.
Instead:
- make them explicit helper inputs
- or use existing repo metadata logic if already present and provable
- or surface a structured ambiguity message

D. Do NOT output only final names.
You must show derivation logic step by step.

WORK TO DO

1. Produce a “Rule Extraction” section:
- OFW job type rules
- onboarding JSON naming rules
- ADLS/CZ naming rules
- Synapse naming rules
- uppercase/lowercase rules
- optional tenant behavior

2. Produce a “Defined vs Ambiguous” section:
Defined:
- job type patterns
- case rules
- Synapse suffix rules
- ADLS lowercase behavior
Ambiguous unless already derivable from repo logic:
- malcode derivation
- tenant applicability decision
- description/function token normalization

3. Refactor code into reusable helpers:
- deriveOfwJobName(input)
- deriveOnboardingFileName(input)
- deriveAdlsObjectName(input)
- deriveSynapseNames(input)
- normalizeDescriptionToken(input)
- normalizeFunctionToken(input)

4. Helper design requirement:
The helpers must accept structured inputs such as:
- jobType
- framework
- malcode
- tenantId optional
- description
- functionName optional
- baseObjectName
- objectKind
- jira optional

5. For customer_orders scenario:
Show full derivation step by step:
- candidate job types considered
- selected job type and why
- framework token and why
- malcode source and whether inferred or explicitly supplied
- tenant included or excluded and why
- description token
- function token
- final OFW job name
- final ADLS object/view name
- final Synapse base/stage/ctas/view names

6. If malcode / tenant / description-function cannot be fully derived from standards alone:
- do NOT block the whole task
- implement the helper contract so those inputs are explicit
- use existing repo logic only if you can cite exact code path
- otherwise return a structured “requires explicit input” path

7. Update generated response/output so it explains the naming logic, not just the final result.
I need the assistant output to say HOW the name was derived.

8. Add generalized tests:
- one ACJ ETL case
- one PLJ case
- one SLA case
- one ADLS lowercase naming case
- one Synapse base/stage/ctas/DAC naming case
- one case with tenant included
- one case with tenant excluded
- one negative case for missing required naming inputs

9. Show exact before/after:
Before:
- customer_orders-specific or implicit naming
After:
- generalized, rule-driven, standards-based naming

10. Do not claim “no standards found” again for ADLS or Synapse.
The screenshots clearly define enough rules to implement those parts.

RETURN FORMAT

A. Rule Extraction
B. Defined vs Ambiguous
C. Code Changes Made
D. Tests Added
E. Derivation for customer_orders
F. Proof this is generalized and not hardcoded
G. Remaining ambiguities only if truly unresolved
