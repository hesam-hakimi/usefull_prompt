Do not call the write tool yet.

This preview does not match the values confirmed in the previous test. Reconcile every onboarding field against explicit user input and repository evidence. Do not use conversation memory as authoritative evidence.

The intended destination is:
cd_renewal/job_onboarding/cd_renewal.json

Keep the existing job and environment configurations read-only.

Explain the evidence for job_id, job_name, job_pattern, schedule_type, task_cluster_type, active_flag, and the {env_dbfs} token. Highlight every value that differs from the previously confirmed values and ask me to approve the final literals.

Then show a final write manifest containing exactly one create operation for the onboarding JSON and zero modifications to job_conf or env_conf. Do not write anything yet.
