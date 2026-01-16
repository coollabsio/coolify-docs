---
title: "Gitea"
description: "Host Gitea Git service on Coolify for lightweight repository hosting with pull requests, CI/CD integration, issues, and team collaboration."
---

![Gitea](https://about.gitea.com/gitea-text.svg)

## What is Gitea?

Git with a cup of tea! Painless self-hosted all-in-one software development service, including Git hosting, code review, team collaboration, package registry and CI/CD.

## Deployment Variants

Gitea is available in four deployment configurations in Coolify:

### Gitea (Default)
- **Database:** SQLite (embedded)
- **Use case:** Simple deployments, personal projects, or testing
- **Components:** Single Gitea container with built-in SQLite database

### Gitea with PostgreSQL
- **Database:** PostgreSQL
- **Use case:** Production deployments requiring PostgreSQL compatibility and better performance
- **Components:**
  - Gitea container
  - PostgreSQL 16 container
  - Automatic database configuration and health checks

### Gitea with MySQL
- **Database:** MySQL
- **Use case:** Production deployments with MySQL preference
- **Components:**
  - Gitea container
  - MySQL container
  - Automatic database configuration and health checks

### Gitea with MariaDB
- **Database:** MariaDB
- **Use case:** Production deployments with MariaDB preference
- **Components:**
  - Gitea container
  - MariaDB container
  - Automatic database configuration and health checks

## Demo

- [Demo](https://try.gitea.io/)

## Links

- [The official website](https://gitea.com)
- [GitHub](https://github.com/go-gitea/gitea)
