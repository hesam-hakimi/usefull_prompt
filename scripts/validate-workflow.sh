#!/usr/bin/env bash
set -euo pipefail

required_files=(
  "README.md"
  "AGENTS.md"
  "docs/business-context.md"
  "docs/system-map.md"
  "docs/change-contract.md"
  "docs/definition-of-done.md"
  "workflow/README.md"
  "templates/request.md"
  "templates/result.md"
  ".github/copilot-instructions.md"
  ".github/agents/orchestrator.agent.md"
  ".github/agents/planner.agent.md"
  ".github/agents/verifier.agent.md"
  ".github/prompts/build.prompt.md"
  ".github/prompts/plan-change.prompt.md"
  ".github/prompts/verify-change.prompt.md"
)

for file in "${required_files[@]}"; do
  if [[ ! -s "$file" ]]; then
    echo "Missing or empty workflow file: $file" >&2
    exit 1
  fi
done

required_agent_rules=(
  "Do not guess"
  "Change-safety invariants"
  "Regression policy"
  "Output contract"
  "Stop conditions"
)

for rule in "${required_agent_rules[@]}"; do
  if ! grep -Fq "$rule" AGENTS.md; then
    echo "AGENTS.md is missing required rule: $rule" >&2
    exit 1
  fi
done

for file in .github/agents/*.agent.md .github/prompts/*.prompt.md .github/instructions/*.instructions.md; do
  if [[ "$(head -n 1 "$file")" != "---" ]]; then
    echo "Missing YAML frontmatter in $file" >&2
    exit 1
  fi
done

echo "Copilot workflow contract is valid."
