Prepare the authoritative implementation contract for Phase 2D:
Metadata-Backed Approved Recipe Pilot.

This is a strictly read-only planning task.

Do not modify files, create branches or worktrees, commit, push, merge,
rebase, retarget, change PR metadata, deploy, or begin implementation.

Repository:
kmai-td-genie

Accepted parent chain:

PR #12:
- base: phase2/registry-contracts
- head: phase2/service-version-boundary
- accepted head prefix: e67680e
- final independent verdict: PASS

PR #14:
- base: phase2/service-version-boundary
- head: phase2/semantic-plan-contract-validator
- accepted head prefix: effd7ba
- final independent verdict: PASS

Phase 2D must later be stacked on:

origin/phase2/semantic-plan-contract-validator

Do not use or modify the dirty asktd_v2 checkout.

────────────────────────────────────
1. Verify the accepted starting state
────────────────────────────────────

Fetch origin and verify:

- exact PR #12 and PR #14 branch SHAs;
- phase2/registry-contracts is an ancestor of
  phase2/service-version-boundary;
- phase2/service-version-boundary is an ancestor of
  phase2/semantic-plan-contract-validator;
- PR #12 and PR #14 remain OPEN and Draft;
- the accepted Phase 2C worktree is clean.

Do not change anything.

────────────────────────────────────
2. Locate existing recipe-related evidence
────────────────────────────────────

Search all relevant repository sources, including:

- implementation plans and master plans;
- product backlog;
- ADR 0001 and ADR 0002;
- existing SemanticQueryPlan;
- GovernedSemanticPlan;
- semantic_models.py;
- recipe-related models, registries, services and tests;
- report-planning and intent-routing components;
- metadata registry contracts;
- golden questions and fixtures;
- existing approved or hard-coded query patterns;
- any recipe migration or recipe-selection documentation.

Identify:

- what the repository currently calls a recipe;
- whether recipes already have stable IDs;
- whether recipe definitions are currently code-based, configuration-based,
  metadata-based or generated;
- whether any existing recipe is suitable for a controlled Phase 2D pilot;
- which existing runtime behavior must remain untouched.

Provide exact source paths and headings.

Do not infer requirements only from the term “Phase 2D.”

────────────────────────────────────
3. Ratified business-first workflow
────────────────────────────────────

Phase 2D must follow this order:

Approved business requirement or recipe definition
    ↓
Required semantic roles
    ↓
Targeted governed-metadata discovery
    ↓
Semantic-to-physical binding
    ↓
Gap and ambiguity analysis
    ↓
Validated metadata-bound recipe plan

Do not design Phase 2D as:

Broad metadata search
    ↓
Guess the business requirement afterward

A recipe must first declare what information it requires.

Example semantic roles may include:

- CUSTOMER_IDENTIFIER
- ACCOUNT_IDENTIFIER
- BALANCE
- STATUS
- PRODUCT_TYPE
- AS_OF_DATE
- CURRENCY

These are examples only.

Do not add these roles unless supported by the selected pilot and repository
evidence.

────────────────────────────────────
4. Define the Phase 2D boundary
────────────────────────────────────

Determine the exact contract for an internal metadata-backed recipe pilot.

The expected Phase 2D responsibilities are:

A. ApprovedRecipeDefinition

A typed, immutable internal definition containing, as appropriate:

- recipe_id;
- recipe schema version;
- safe name and description;
- supported semantic operation;
- required semantic roles;
- optional semantic roles;
- expected Product Group or dataset scope;
- required relationship capabilities;
- compatible registry or recipe version information;
- output expectations;
- safe lifecycle/approval status if already supported by repository
  conventions.

Phase 2D consumes only a recipe that is already considered approved.

It must not implement the approval or publishing workflow.

B. SemanticRequirementManifest

A deterministic representation of what information the recipe requires
before metadata discovery begins.

For each requirement determine whether the contract needs:

- semantic role;
- required or optional;
- expected data type;
- expected dataset or Product Group scope;
- cardinality;
- key requirement;
- classification constraints where appropriate;
- relationship requirement;
- safe aliases or business-name matching criteria.

C. TargetedMetadataDiscovery

Use the accepted governed RegistrySnapshot to find metadata candidates for
the declared semantic requirements.

Discovery must be bounded and deterministic where possible.

It may use evidenced metadata such as:

- Product Group;
- Schema;
- Dataset;
- Field;
- Relationship;
- BUSINESS_NAME;
- BUSINESS_DESCRIPTION;
- DATA_TYPE;
- IS_KEY;
- PII;
- PCI;
- SECURITY_CLASSIFICATION_CANDIDATE.

Classification metadata must not grant or deny access.

Do not introduce unrestricted fuzzy inference without a deterministic
fallback and ambiguity contract.

D. SemanticToPhysicalBinding

Bind each required semantic role to governed physical metadata such as:

- product_group_id;
- schema_id;
- dataset_id;
- field_id;
- relationship_id.

All bindings must refer to the same accepted registry_version.

E. GapAndAmbiguityResult

If a required role cannot be resolved, or multiple equally valid candidates
exist, Phase 2D must return a safe deterministic gap or ambiguity result.

It must not guess.

Examples:

- required semantic role not found;
- multiple candidate fields;
- required relationship missing;
- data-type mismatch;
- required key not available;
- Product Group scope mismatch;
- recipe incompatible with registry version.

F. BoundRecipePlan

When all required bindings succeed, produce an immutable internal
metadata-bound recipe plan.

The result should contain only safe governed IDs, recipe identity,
registry_version, resolved bindings, warnings and validation status.

It must not yet contain executable SQL.

────────────────────────────────────
5. Relationship with GovernedSemanticPlan
────────────────────────────────────

Determine how Phase 2D should consume the accepted Phase 2C
GovernedSemanticPlan.

The likely contract is:

GovernedSemanticPlan
    +
ApprovedRecipeDefinition
    +
RegistrySnapshot
    ↓
Metadata-Bound Recipe Plan

Clarify:

- which fields come from GovernedSemanticPlan;
- which requirements come from the recipe;
- how recipe scope is compared with selected datasets;
- how registry_version consistency is enforced;
- whether a recipe may narrow the plan scope;
- what happens if the recipe requires metadata not included in the plan;
- whether the plan must be revised or clarification must be requested.

Do not let the recipe bypass Phase 2C validation.

────────────────────────────────────
6. Pilot-use-case selection
────────────────────────────────────

Identify one bounded, repository-evidenced pilot recipe.

The pilot must have:

- a clear existing business or analytical requirement;
- authoritative metadata evidence;
- known required semantic roles;
- deterministic expected bindings;
- no need for unsupported business inference;
- no requirement for SQL execution during Phase 2D.

Do not automatically select:

“Total loan amount for Person A”

unless authoritative repository evidence already defines:

- what counts as a loan;
- which product types are included;
- the applicable balance definition;
- applicable statuses;
- as-of-date behavior;
- person/entity resolution;
- deduplication rules.

That broader use case belongs partly to Phase 2E unless all definitions
already exist.

If no suitable authoritative pilot exists, report that clearly and propose
the smallest product-owner decision required.

────────────────────────────────────
7. Explicit Phase 2D exclusions
────────────────────────────────────

Phase 2D must not implement:

- generalized business glossary;
- enterprise KPI definitions;
- loan/product taxonomy;
- canonical status mapping;
- person/entity resolution;
- cross-system deduplication;
- currency conversion rules;
- SQL generation;
- SQL execution;
- query execution;
- runtime agent routing;
- model routing;
- authorization decisions;
- public HTTP endpoints;
- recipe publishing or approval workflow;
- recipe persistence in SQL;
- deployment;
- output templates;
- dynamic suggestions;
- rollback.

These remain later-phase responsibilities.

────────────────────────────────────
8. Authorization and security boundary
────────────────────────────────────

Metadata and recipe matching do not grant access.

The recipe resolver may confirm:

“This recipe requires Dataset X and Field Y.”

It may not conclude:

“The user is allowed to access Dataset X and Field Y.”

Phase 2D must not add:

- permissions;
- grants;
- user/group mappings;
- entitlements;
- authorization decisions;
- raw user prompts;
- SQL;
- result data;
- secrets;
- filesystem paths.

Candidate metadata may later be filtered by the real AuthZ layer, but
Phase 2D does not implement or replace that layer.

────────────────────────────────────
9. Proposed contracts
────────────────────────────────────

Propose the smallest useful typed contracts, with names adapted to existing
repository conventions.

Candidate concepts include:

- ApprovedRecipeDefinition
- SemanticRequirement
- SemanticRequirementManifest
- MetadataBindingCandidate
- ResolvedSemanticBinding
- RecipeBindingGap
- RecipeBindingWarning
- MetadataBoundRecipePlan
- RecipeResolutionResult

Do not create all of these automatically.

Recommend only the minimum set needed for the pilot.

For each proposed model provide:

- purpose;
- required fields;
- excluded fields;
- immutability rules;
- safe error behavior;
- deterministic ordering rules.

────────────────────────────────────
10. Tests and acceptance criteria
────────────────────────────────────

Define required tests for:

- approved recipe contract validation;
- required and optional semantic roles;
- targeted metadata discovery;
- exact business-name match;
- deterministic candidate ordering;
- single valid binding;
- missing required field;
- ambiguous multiple candidates;
- incompatible data type;
- missing relationship;
- Product Group or dataset scope mismatch;
- current registry version;
- retained historical registry version;
- strict-off behavior;
- registry-version mismatch;
- classification metadata remains non-authorizing;
- no raw prompt, SQL, result data or secret in models/errors;
- existing SemanticQueryPlan unchanged;
- GovernedSemanticPlan unchanged;
- Phase 2A, 2B and 2C tests continue to pass;
- public APIs unchanged;
- golden baseline unchanged.

Acceptance must prove:

- requirements are known before metadata discovery;
- every required role is either bound or reported as a gap;
- ambiguous candidates are never silently selected;
- no SQL or data execution occurs;
- no authorization is granted;
- all results are deterministic.

────────────────────────────────────
11. Documentation and branch plan
────────────────────────────────────

Propose the next ADR:

docs/adr/0003-phase2d-metadata-backed-recipe-pilot.md

Proposed implementation branch:

phase2/metadata-backed-recipe-pilot

Proposed isolated worktree:

/tmp/kmai-phase2d-metadata-backed-recipe-pilot

Proposed Draft PR:

base:
phase2/semantic-plan-contract-validator

head:
phase2/metadata-backed-recipe-pilot

The future PR must state:

- BLOCKED BY PR #14;
- TRANSITIVELY BLOCKED BY PR #12 and PR #11;
- MUST NOT BE MERGED OR DEPLOYED;
- internal-only;
- no SQL, execution, public API or authorization behavior;
- exact pilot recipe and evidence;
- Phase 2E business-semantic dependencies.

────────────────────────────────────
12. Final response
────────────────────────────────────

Return:

1. Verified starting state and SHAs
2. Authoritative Phase 2D sources
3. Existing recipe architecture
4. Exact Phase 2D included scope
5. Exact excluded/deferred scope
6. Business-first requirement and discovery workflow
7. Proposed minimum typed contracts
8. GovernedSemanticPlan interaction
9. Proposed pilot use case and evidence
10. Metadata discovery and binding behavior
11. Gap and ambiguity contract
12. Security and AuthZ boundary
13. Tests and acceptance criteria
14. Expected files
15. ADR, branch, worktree and stacked-PR plan
16. Ambiguities requiring product-owner approval
17. Confirmation that no files, branches, PRs or settings were changed
