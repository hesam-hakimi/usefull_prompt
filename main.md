Prepare the final Phase 2D pilot field-mapping decision packet.

This remains a strictly read-only product-decision task.

Do not modify files, create branches or worktrees, commit, push, change PR
metadata, deploy, or begin Phase 2D implementation.

Ratified product-owner decisions:

1. The Phase 2D pilot is:
   deposits_vs_withdrawals

2. Pilot business definition:

   For each applicable transaction date, classify transactions using the
   existing code-owned deposit-versus-withdrawal logic and produce:

   - transaction count
   - total transaction amount

   grouped or distinguished by the existing flow-direction classification.

   Phase 2D must preserve the current flow-direction classification exactly.
   It must not redefine deposit or withdrawal semantics.

3. Required semantic roles:

   - TRANSACTION_DATE
   - FLOW_DIRECTION
   - TRANSACTION_COUNT
   - TOTAL_TRANSACTION_AMOUNT

4. Dataset-only scope is acceptable for this internal pilot even while its
   Product Group is product_group:unassigned.

   This is a temporary migration/pilot condition, not authoritative
   discovered business metadata.

5. A structurally valid Draft RegistrySnapshot may be used only for an
   internal Dev/Test binding pilot.

   It must not be presented as published or production-approved metadata.

6. Matching policy:

   - exact governed field_id first;
   - then an explicitly approved alias-to-field_id bridge;
   - aliases may use only trim, Unicode normalization and case-insensitive
     comparison;
   - no fuzzy matching;
   - no punctuation-stripping or inferred abbreviations;
   - BUSINESS_NAME may participate only through an explicit approved
     field-ID bridge;
   - ties always return ambiguity.

7. Metadata matching grants no authorization.

────────────────────────────────────
1. Inspect the authoritative evidence
────────────────────────────────────

Inspect all exact evidence for deposits_vs_withdrawals, including:

- the existing SemanticQueryPlan materialized plan;
- plan_for_recipe(...);
- query_recipies.py;
- the exact deterministic SQL or renderer used by this recipe;
- built_in_questions.json Q03;
- intent_registry.json tracking_flow_of_funds;
- table.json;
- field.json;
- relationship.json;
- current governed RegistrySnapshot;
- golden baseline evidence.

Do not infer a physical field mapping from similar names alone.

────────────────────────────────────
2. Produce the exact mapping table
────────────────────────────────────

For each required semantic role, return:

- semantic role;
- exact physical column name used by the existing recipe;
- proposed stable field_id;
- dataset_id;
- schema_id;
- product_group_id;
- authoritative evidence path and line/function;
- DATA_TYPE;
- IS_KEY;
- BUSINESS_NAME;
- BUSINESS_DESCRIPTION;
- PII;
- PCI;
- SECURITY_CLASSIFICATION_CANDIDATE;
- whether the mapping is exact, conflicting, missing, or ambiguous.

Required roles:

- TRANSACTION_DATE
- FLOW_DIRECTION
- TRANSACTION_COUNT
- TOTAL_TRANSACTION_AMOUNT

Also state whether TRANSACTION_COUNT is:

- a stored physical field;
- a derived count operation;
- or unsupported by the governed metadata contract.

Do the same for TOTAL_TRANSACTION_AMOUNT if it is derived rather than a
stored field.

────────────────────────────────────
3. Reconcile recipe code with metadata
────────────────────────────────────

Determine whether the existing code-owned recipe and the metadata files
refer to the same:

- dataset;
- schema;
- Product Group;
- physical fields;
- data types;
- flow-direction semantics.

Report every mismatch explicitly.

Do not silently bridge:

- t_* versus v_* namespaces;
- RRDP versus ACZ/RRDW names;
- similar business names;
- differently named physical columns.

────────────────────────────────────
4. Recommend the authoritative pilot source
────────────────────────────────────

Choose one recommendation:

A. Existing governed metadata already provides exact authoritative
   mappings.

B. Exact mappings can be established from existing recipe code and
   authoritative metadata together, but must be recorded in a new explicit,
   version-controlled pilot metadata mapping artifact.

C. No authoritative real mapping can be established; use a clearly labelled
   synthetic governed fixture only to test the Phase 2D contracts.

D. Pilot cannot proceed until additional metadata is onboarded.

Explain the evidence and risks.

Do not create the artifact during this task.

────────────────────────────────────
5. Proposed mapping lifecycle
────────────────────────────────────

If recommendation B applies, propose the minimum explicit pilot mapping
artifact and lifecycle.

It must:

- contain only the four approved mappings;
- use stable governed field IDs;
- record source/provenance;
- be version controlled;
- be labelled internal pilot metadata;
- be incorporated into the canonical RegistrySnapshot;
- affect registry_version;
- grant no authorization;
- be replaceable later by authoritative onboarding;
- never silently reuse descriptive field.json as executable binding
  metadata.

Follow repository conventions when proposing its path and model.

────────────────────────────────────
6. Final response
────────────────────────────────────

Return:

1. Overall readiness:
   READY
   READY WITH PRODUCT APPROVAL
   BLOCKED

2. Exact four-role mapping table
3. Stored versus derived role classification
4. Recipe-code versus metadata reconciliation
5. Recommended authoritative-source option: A, B, C or D
6. Proposed pilot mapping artifact and lifecycle, if needed
7. Remaining product-owner decisions
8. Confirmation that nothing was modified
