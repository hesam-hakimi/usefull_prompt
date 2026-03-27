# Next Step: Extract and Verify Full Synapse Publish Output

The `customer_orders` write fix is now passing and artifacts are being written successfully.

## Goal
Extract the full generated artifacts for the same `customer_orders -> Synapse` scenario and verify the output is correct end to end.

## Please do the following

1. From the same latest temp run, extract the complete generated artifacts for:
   - main job config
   - transform include file(s)
   - curated/load_enrich or data_sync related module(s)
   - any Synapse publish-related config generated for this flow

2. Show the exact rendered content or representative excerpts for each generated artifact.

3. Verify these points explicitly:
   - source table remains `customer_orders`
   - source alias remains `vw_customer_orders`
   - transform SQL consumes `vw_customer_orders`
   - output strategy is `curated_load_enrich`
   - curated zone rendering is framework-valid
   - Synapse publish section/module is present when requested
   - no invalid zone names or alias mismatches remain
   - include refs are valid and resolvable

4. Confirm whether the generated files are:
   - only in temp repo for preview/testing
   - or also written into the actual selected workspace location

5. If they are still temp-only, explain exactly which code path prevents writing to the real workspace and what should be changed.

6. Add one golden acceptance test for this exact scenario that asserts:
   - file creation happens
   - job config shape is correct
   - source alias/path are correct
   - Synapse-related output is present when requested

## Deliverable
Provide:
- files generated
- exact paths
- verification checklist with pass/fail
- remaining gaps, if any
- exact files changed
