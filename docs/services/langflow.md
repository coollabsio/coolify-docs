---
title: "Langflow"
description: "Host Langflow on Coolify to build and deploy AI-powered agents and workflows with a visual drag-and-drop interface and Python extensibility."
---

<ZoomableImage src="/docs/images/services/langflow.svg" alt="Langflow" />
# Langflow


[Langflow](https://www.langflow.org/?utm_source=coolify.io) is an **[open-source](https://github.com/langflow-ai/langflow) Python-based framework** for building AI applications. It combines a visual authoring experience with full programmatic access, enabling teams to **prototype**, **test**, and **deploy** AI-powered agents and workflows.

It accelerates development by providing a **drag-and-drop interface** while maintaining the flexibility of **custom Python components** for advanced use cases.

## Key Features

### Visual Workflow Builder

- **Drag-and-Drop Interface**: Create complex AI workflows by connecting component nodes visually without writing code.
- **Pre-built Templates**: Start quickly with templates for chatbots, document analysis systems, and content generators.
- **Custom Components**: Extend functionality by building custom components using Python.

### Real-Time Testing

- **Interactive Playground**: Test flows and receive immediate feedback before deployment.
- **Step-by-Step Debugging**: Monitor each component's output to identify and fix issues quickly.
- **Iteration Support**: Rapidly iterate on your workflows with instant visual feedback.

### Multi-Agent Orchestration

- **Agent Development**: Built-in support for creating and orchestrating multiple AI agents.
- **MCP Integration**: Native support for Model Context Protocol (MCP) for tool integration.
- **Conversation Management**: Manage complex multi-turn conversations and retrieval workflows.

### Flexible Deployment

- **API Endpoints**: Serve your flows via REST API for integration with existing applications.
- **MCP Server**: Deploy as an MCP server for AI tool integration.
- **JSON Export**: Export flows as JSON for version control and sharing.

### Observability

- **LangSmith Integration**: Connect with LangSmith for tracing and debugging.
- **Langfuse Integration**: Use Langfuse for LLM observability and analytics.
- **Framework Agnostic**: Works with all major LLMs and vector databases.

## Configuration

After deploying Langflow on Coolify, you need to configure the superuser credentials by setting the following environment variables:

| Variable | Description |
|----------|-------------|
| `LANGFLOW_SUPERUSER` | Username for the admin account |
| `LANGFLOW_SUPERUSER_PASSWORD` | Password for the admin account |

::: warning
Make sure to change the default values of `LANGFLOW_SUPERUSER` and `LANGFLOW_SUPERUSER_PASSWORD` before deploying to production.
:::

## Links

- [Langflow Website](https://www.langflow.org/?utm_source=coolify.io)
- [Documentation](https://docs.langflow.org/?utm_source=coolify.io)
- [GitHub Repository](https://github.com/langflow-ai/langflow)
