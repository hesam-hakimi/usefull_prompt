---
applyTo: "**"
---

# Business-context instructions

- Use `docs/business-context.md` as the canonical domain vocabulary and business-rule catalog.
- Cite business rule IDs in plans and tests when they exist.
- Treat blank fields, missing rules, and unsupported assumptions as unknown.
- If an unknown changes user-visible behavior, ask a focused question before implementation.
- Do not encode a product rule in code merely because one example suggests it.
- When implementation evidence conflicts with accepted business context, surface the conflict instead of silently changing either side.
