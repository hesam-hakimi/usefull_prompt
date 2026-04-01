# Code Review & Remediation Prompts (Generic)

---

## 1. Code Review Prompt

Perform a comprehensive, senior-level code review of this project and write the results to a file named `review.md` in the project root.

### Scope
Review the entire codebase for:
- Architecture and folder structure
- Code quality, readability, and consistency
- Correctness and potential bugs
- Security vulnerabilities
- Performance issues
- Error handling and edge cases
- Type safety and data validation
- API design and contract integrity
- Dependency management
- Logging and observability
- Test coverage and test quality
- Maintainability and technical debt

### Framework-Specific (if applicable)
Also evaluate relevant best practices for the framework in use (e.g., React, Next.js, backend services, APIs, etc.).

### Output Format (review.md)

# Executive Summary  
# Overall Risk Assessment  
# Strengths  

# Findings by Severity  

## Critical  
## High  
## Medium  
## Low  

For each finding include:
- Title  
- Severity  
- File Path  
- Description of Issue  
- Impact  
- Recommended Fix  

# Prioritized Remediation Plan  
# Quick Wins  
# Technical Debt  
# Final Verdict  

### Rules
- Do NOT modify any source code  
- Do NOT apply fixes  
- Only analyze and document findings  
- Be specific and reference real files/patterns  
- Avoid vague or generic comments  

---

## 2. Remediation Prompt (After Review)

OK, thank you.

Please proceed to address all Critical, High, and Medium priority issues identified in `review.md`.

### Requirements
- Apply fixes in a safe, production-ready manner  
- Follow existing project architecture and conventions  
- Keep changes minimal and well-scoped  
- Do NOT introduce breaking changes  

### After Fixing
1. Re-test the entire application  
2. Ensure all existing tests pass  
3. Add tests where necessary to cover fixes  
4. Validate that all issues are resolved  
5. Ensure no regressions are introduced  
6. Ensure the project builds and runs successfully  

### Deliverables
- Updated codebase  
- Summary of fixes applied (grouped by severity)  
- List of files changed  
- Test results  
- Any remaining risks or follow-ups  

### Rules
- Do NOT skip any Critical, High, or Medium issues  
- If any issue cannot be fixed, clearly explain why  
- Ensure full validation before completion  

Do not respond until all work is fully completed and verified.
