# Implementation plan

## Phase 1
Build a compile-safe extension skeleton with:
- commands
- chat participant shell
- core types
- router and classifier

## Phase 2
Implement intent extraction, clarification, metadata resolver interfaces, and strategy selection.

## Phase 3
Implement blueprint builder and artifact generation.

## Phase 4
Implement validation orchestration.

## Phase 5
Implement repo write, preview plan, approval gate, and dev DBFS upload.

## Phase 6
Expand tests, diagnostics, and bug-fix support.

## Exit criteria for MVP
- user can request bronze-to-silver/gold plus Synapse flow in chat
- extension generates top-level JSON, env YAML if needed, and all referenced include files
- extension validates artifacts before upload
- extension shows a preview plan
- extension uploads to DBFS in dev only after approval
