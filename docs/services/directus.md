---
title: "Directus"
description: "Deploy Directus headless CMS on Coolify with SQL database wrapper, REST/GraphQL API, no-code data studio, and custom field types for any project."
---

![directus](https://user-images.githubusercontent.com/522079/158864859-0fbeae62-9d7a-4619-b35e-f8fa5f68e0c8.png)

## What is Directus?

Directus is a real-time API and App dashboard for managing SQL database content.

- **Open Source.** No artificial limitations, vendor lock-in, or hidden paywalls.
- **REST & GraphQL API.** Instantly layers a blazingly fast Node.js API on top of any SQL database.
- **Manage Pure SQL.** Works with new or existing SQL databases, no migration required.
- **Choose your Database.** Supports PostgreSQL, MySQL, SQLite, OracleDB, CockroachDB, MariaDB, and MS-SQL.
- **On-Prem or Cloud.** Run locally, install on-premises, or use our
  [self-service Cloud service](https://directus.io/pricing?utm_source=coolify.io).
- **Completely Extensible.** Built to white-label, it is easy to customize our modular platform.
- **A Modern Dashboard.** Our no-code Vue.js app is safe and intuitive for non-technical users, no training required.

## Deployment Variants

Directus is available in two deployment configurations in Coolify:

### Directus (Default)
- **Database:** SQLite3 (file-based)
- **Use case:** Development, testing, or small-scale deployments
- **Components:** Single Directus container with embedded SQLite database

### Directus with PostgreSQL
- **Database:** PostgreSQL + Redis
- **Use case:** Production deployments requiring better performance, scalability, and caching
- **Components:**
  - Directus container
  - PostgreSQL 16 container
  - Redis 7 container for caching
  - Automatic database configuration and health checks

## Community Help

[The Directus Documentation](https://docs.directus.io?utm_source=coolify.io) is a great place to start, or explore these other channels:

- [Discord](https://directus.chat?utm_source=coolify.io) (Questions, Live Discussions)
- [GitHub Issues](https://github.com/directus/directus/issues?utm_source=coolify.io) (Report Bugs)
- [GitHub Discussions](https://github.com/directus/directus/discussions?utm_source=coolify.io) (Feature Requests)
- [Twitter](https://twitter.com/directus?utm_source=coolify.io) (Latest News)
- [YouTube](https://www.youtube.com/c/DirectusVideos/featured?utm_source=coolify.io) (Video Tutorials)

## Links

- [The official website](https://directus.io?utm_source=coolify.io)
- [GitHub](https://github.com/directus/directus?utm_source=coolify.io)
