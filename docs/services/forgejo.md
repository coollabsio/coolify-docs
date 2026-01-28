---
title: "Forgejo"
description: "Deploy Forgejo Git hosting on Coolify as lightweight GitHub alternative with repositories, CI/CD, issues, pull requests, and collaboration tools."
---

![forgejo](https://forgejo.org/images/forgejo-wordmark.svg)

## What is Forgejo?

Forgejo is a self-hosted lightweight software forge. It's easy to install and low maintenance, it just does the job.

## Deployment Variants

Forgejo is available in four deployment configurations in Coolify:

### Forgejo (Default)
- **Database:** SQLite (embedded)
- **Use case:** Simple deployments, testing, or personal Git hosting
- **Components:** Single Forgejo container with built-in SQLite database

### Forgejo with PostgreSQL
- **Database:** PostgreSQL
- **Use case:** Production deployments requiring better performance and scalability
- **Components:**
  - Forgejo container
  - PostgreSQL container
  - Automatic database configuration and health checks

### Forgejo with MySQL
- **Database:** MySQL
- **Use case:** Production deployments with MySQL preference
- **Components:**
  - Forgejo container
  - MySQL container
  - Automatic database configuration and health checks

### Forgejo with MariaDB
- **Database:** MariaDB
- **Use case:** Production deployments with MariaDB preference
- **Components:**
  - Forgejo container
  - MariaDB container
  - Automatic database configuration and health checks

## Forgejo Actions Runner

Forgejo has available a first party "actions runner" to [execute task jobs on a repository](https://forgejo.org/docs/latest/user/actions/), much like [GitHub Actions](https://docs.github.com/en/actions) or [GitLab CI](https://docs.gitlab.com/ee/ci/index.html).

Coolify includes Forgejo services with a single runner, using [Docker-in-Docker](https://hub.docker.com/_/docker) to handle and report task jobs.

Due to the alpha status of the Forgejo runner, rebooting the Forejo application container after the initial setup is required to fully register the shared secret into Forejo for runners to validate:

1. In the **Environment Variables** section of the service configuration, you may set as `RUNNER_SHARED_SECRET` a random 40-character hexagesimal string. The command `openssl rand -hex 20` creates something you can copy and paste.
2. After successfully setting up Forejo, **reboot the `forgejo` service** and wait some seconds until the runner appears in Forgejo _Actions_ Configuration section.

Forejo is also compatible with third-party CI apps and platforms. Forgejo is a Gitea-fork, so instructions to incorporate these CI may be the same for both.

## Demo

- [Demo](https://next.forgejo.org/)

## Links

- [The official website](https://forgejo.org/)
- [Codeberg](https://codeberg.org/forgejo/forgejo)
