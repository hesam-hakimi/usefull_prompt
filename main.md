Fix the write-tool confirmation UI so it is generated exclusively from the authoritative trusted write manifest.

For this request, the confirmation must state exactly:

CREATE:
cd_renewal/job_onboarding/cd_renewal.json

UNCHANGED:
cd_renewal/job_conf/conf/cd_renewal.json
env_conf/dev/env_conf_tdous_dev.yaml
env_conf/conf/common_config.yaml

Do not use jobConfigPath as the displayed write destination when only an onboarding artifact is selected.

If the confirmation text, selected artifacts, or destination differs from the trusted preview manifest, fail closed without writing.

Preserve the trusted preview ID, modal approval, checksum verification, and one-time approval consumption.

Add Windows and POSIX regression tests proving the confirmation displays the exact manifest and never describes read-only validation inputs as write destinations.
