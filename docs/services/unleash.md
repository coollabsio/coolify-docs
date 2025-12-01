---
title: "Unleash"
description: "Manage features on Coolify with Unleash for feature toggles, A/B testing, gradual rollouts, and enterprise feature flag management."
---

<ZoomableImage src="/docs/images/services/unleash.svg" alt="Unleash dashboard" />

![Unleash](https://raw.githubusercontent.com/Unleash/unleash/main/.github/github_header_opaque_landscape.svg)

## What is Unleash?

Unleash is an open source feature flagging service.

## Deployment Variants

Unleash is available in two deployment configurations in Coolify:

### Unleash with PostgreSQL
- **Database:** PostgreSQL
- **Use case:** Standard deployments with managed database
- **Components:**
  - Unleash container
  - PostgreSQL container
  - Automatic database configuration and health checks

### Unleash without Database
- **Database:** External (user-provided)
- **Use case:** Advanced deployments with existing database infrastructure or custom database configurations
- **Components:**
  - Unleash container
  - Requires external database connection configuration

## Screenshots

![Unleash Preview](https://raw.githubusercontent.com/Unleash/unleash/main/.github/github_online_demo.svg)

## Links

- [Official Website](https://getunleash.io)
- [GitHub](https://github.com/unleash/unleash)
