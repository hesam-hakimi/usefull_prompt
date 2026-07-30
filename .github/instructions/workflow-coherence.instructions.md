---
applyTo: "**"
---

# Workflow coherence

Workflow coherence does not mean mirroring the same content into `.github/**` and `resources/copilot/**`.

A product change is coherent when these remain aligned:

- canonical templates in `resources/copilot/**`;
- generation logic in `src/customization/**`;
- managed-asset manifests;
- temporary-workspace tests;
- VSIX package contents;
- product documentation.

The extension repository’s `.github/**` remains a separate maintainer control plane and must not be synchronized with generated product assets.
