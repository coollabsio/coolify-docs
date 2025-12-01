---
title: Supertokens
description: "Add authentication on Coolify with SuperTokens for login, session management, user administration, and Auth0 alternative SDKs."
---

# Supertokens

<ZoomableImage src="/docs/images/services/supertokens.png" alt="Supertokens dashboard" />

## What is Supertokens

An open-source authentication solution that simplifies the implementation of secure user authentication and session management for web and mobile applications.

## Deployment Variants

SuperTokens is available in two deployment configurations in Coolify:

### SuperTokens with MySQL
- **Database:** MySQL
- **Use case:** Production deployments with MySQL preference
- **Components:**
  - SuperTokens container
  - MySQL container
  - Automatic database configuration and health checks

### SuperTokens with PostgreSQL
- **Database:** PostgreSQL
- **Use case:** Production deployments with PostgreSQL preference
- **Components:**
  - SuperTokens container
  - PostgreSQL container
  - Automatic database configuration and health checks

Both variants provide equivalent functionality - choose based on your database preference or existing infrastructure.

## Links

- [Official Documentation](https://supertokens.com/docs/guides?utm_source=coolify.io)
