---
title: "Vikunja"
description: "Manage tasks on Coolify with Vikunja for to-do lists, kanban boards, gantt charts, calendars, and team project organization."
---

![Vikunja](https://vikunja.cloud/images/vikunja-logo.svg)

## What is Vikunja?

Vikunja is an open source, self-hosted, task management application.

## Deployment Variants

Vikunja is available in two deployment configurations in Coolify:

### Vikunja (Default)
- **Database:** SQLite (embedded)
- **Use case:** Simple deployments, testing, or personal task management
- **Components:** Single Vikunja container with built-in SQLite database

### Vikunja with PostgreSQL
- **Database:** PostgreSQL
- **Use case:** Production deployments requiring better performance, concurrent access, and scalability
- **Components:**
  - Vikunja container
  - PostgreSQL container
  - Automatic database configuration and health checks

## Screenshots

![Vikunja Preview](https://vikunja.io/_astro/09-task-detail-dark.ppLbej6M_ZzaSch.avif)

## Links

- [Official Website](https://vikunja.io)
- [GitHub](https://kolaente.dev/vikunja/vikunja)
