Use these exact literals:

1. job_id: acz0004_cd_renewal
2. job_name: acz0004_cd_renewal
3. job_pattern: DateMaker
4. schedule_type: adhoc
5. task_cluster_type: Large
6. active_flag: 1
7. Version segment in paths: none

Keep the literal {env_dbfs} token unchanged.

Render the final JSON and the exact one-file write manifest for review.

The only permitted write is:
cd_renewal/job_onboarding/cd_renewal.json

Do not modify:
- cd_renewal/job_conf/conf/cd_renewal.json
- env_conf/dev/env_conf_tdous_dev.yaml
- env_conf/conf/common_config.yaml

Do not call the write tool until I explicitly approve the final preview.
