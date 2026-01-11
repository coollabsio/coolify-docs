---
title: Flowise
description: "Build AI workflows on Coolify with Flowise drag-and-drop LLM interface for chatbots, agents, RAG applications, and custom AI tool integration."
---

# Flowise

<ZoomableImage src="/docs/images/services/flowise.jpg" alt="Flowise dashboard" />

## What is Flowise

Flowise is an open source low-code tool for developers to build customized LLM orchestration flows & AI agents.

## Deployment Variants

Flowise is available in two deployment configurations in Coolify:

### Flowise (Default)
- **Database:** SQLite (embedded)
- **Use case:** Simple deployments, testing, or personal AI workflow development
- **Components:** Single Flowise container with built-in SQLite database

### Flowise with Databases
- **Database:** PostgreSQL + Redis
- **Use case:** Production deployments requiring better performance, caching, and scalability
- **Components:**
  - Flowise container
  - PostgreSQL container for data persistence
  - Redis container for caching and session management
  - Automatic database configuration and health checks

## Links

- [Official Documentation](https://docs.flowiseai.com/?utm_source=coolify.io)
