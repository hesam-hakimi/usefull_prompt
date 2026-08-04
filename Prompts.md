The previous Mermaid diagram is technically correct, but it is too implementation-oriented.

Redesign it from the perspective of an Enterprise Azure Architect.

Goals

1. Optimize for executive presentations.

2. Minimize text inside each node.

3. Show architecture, not implementation.

4. Every Azure service should appear only once.

5. The diagram should immediately communicate the overall architecture in less than 10 seconds.

Use this visual hierarchy

Users

↓

Presentation Layer

↓

Application Layer

↓

Azure Cloud

↓

Data Platform

Keep node labels short.

Example

React SPA

FastAPI API

Azure OpenAI

Azure SQL

Azure AI Search

Microsoft Entra ID

Managed Identity

Avoid long descriptions inside nodes.

Instead, use edge labels.

Example

FastAPI -->|Managed Identity| Azure SQL

FastAPI -->|Semantic Search| Azure AI Search

FastAPI -->|LLM| Azure OpenAI

FastAPI -->|REST| React

Group Azure services into a single Azure Cloud.

Reduce the total node count.

Improve readability.

Return ONLY Mermaid.

Do not explain.
