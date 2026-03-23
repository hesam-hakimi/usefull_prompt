Good progress. The runtime proof is now much stronger.

Create TODOs first and keep them updated until every item below is completed.

What is now proven:
- real customer_orders failing scenario blocks write and deploy
- real customer_orders passing scenario validates and writes
- single job config is generated
- repair pass preserves SQL and re-validation passes
- npm test passes
- extension host runtime looks stable

Now close the remaining gaps:

1. Prove template/reference flow with runtime evidence
I need a real runtime test where template selection is NOT "none".
Show:
- selected reference job
- template mode
- template path
- why it was chosen
- which parts of the final output came from the template vs from the request

2. Fix or justify the job naming/classification logic
The generated path/name currently looks like "silver_to_silver_customer_orders_curated..."
but the request is bronze -> silver -> Synapse.
Either:
- fix the naming/classification logic, or
- explain exactly why this name is correct according to framework rules.

3. Validate include-file strategy against framework patterns
I need explicit proof from the framework/sample repos whether this split is correct:
- customer_orders_curated_source.yaml
- transform_filter.json
- transform_derive.json
- write_target.json

If this is the intended framework pattern, show the evidence.
If not, fix the renderer so the include structure matches the real framework.

4. Prove manual F5 / Run Extension flow explicitly
Show:
- Tasks output
- prelaunch task output
- Debug Console output
- Extension Host launch success
- no npm:watch prelaunch failure

5. Final output format
Return:
- TODO checklist
- files changed
- runtime proof for template-based run
- runtime proof for build-from-scratch run
- naming/classification decision
- include-file strategy decision with repo evidence
- manual F5 proof
- compile result
- test result

Important:
- do not stop at unit-test proof
- use the real customer_orders scenario
- do not claim template support is done unless runtime evidence shows template mode/path selected and used
- do not assume include splitting is correct; verify it against framework/sample repo patterns
