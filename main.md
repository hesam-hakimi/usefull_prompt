/verify-change

This is a read-only investigation. Do not edit files, build, package, install,
generate consumer assets, or approve any writes.

Goal:
Determine the exact origin of the skill named:

cd-renewal-sttm-job

Observed behavior:
- The installed ETL Extension was invoked in a consumer ETL workspace.
- The user supplied:
  sttm/CD-Renewal_DataMapping_V2.2 1.xlsx
- The Agent displayed:
  "Reading skill @ cd-renewal-sttm-job"
- We need to determine whether this is:
  1. a packaged product skill,
  2. a generated consumer-workspace skill,
  3. a personal/user skill,
  4. stale session state,
  5. stale compiled/VSIX output,
  6. or a dynamically generated skill.

Required investigation:
1. Search exact literals:
   - cd-renewal-sttm-job
   - CD Renewal
   - cd-renewal
   - cd_renewal
   - CD-Renewal_DataMapping
   - sample_sttm

2. Inspect:
   - resources/copilot/**
   - src/**
   - package.json and contributes.chatSkills
   - asset catalogs and generated manifests
   - .github/skills/**
   - .agents/skills/**
   - .claude/skills/**
   - tests/**
   - docs/**
   - dist/**
   - out/**
   - generated/**
   - final VSIX contents

3. Determine the exact source path and registration mechanism for the loaded
   skill.

4. Inspect the skill body, scripts, examples, and referenced resources for
   hardcoded:
   - job names
   - STTM paths
   - config paths
   - environment names
   - table names
   - transformations
   - onboarding values
   - sample/example paths

5. Verify whether preview or activation created the skill before user approval.

6. Do not treat the skill name alone as proof. Distinguish:
   - packaged hardcoding,
   - workspace residue,
   - user-profile customization,
   - session-state leakage,
   - and safe runtime derivation.

Return:
- exact source of the skill;
- why Copilot selected it;
- whether it is a product defect;
- affected scope;
- evidence with file paths and line references;
- recommended smallest coherent fix;
- no file changes.
