---
title: Keycloak
description: "Deploy Keycloak on Coolify for identity and access management with SSO, OAuth2, SAML, user federation, and centralized authentication."
---

# Keycloak

<ZoomableImage src="/docs/images/services/keycloak-logo.svg" alt="Keycloak dashboard" />

## What is Keycloak

Keycloak is an open-source Identity and Access Management tool.

## Deployment Variants

Keycloak is available in two deployment configurations in Coolify:

### Keycloak (Default)
- **Database:** Embedded H2 (development)
- **Use case:** Development, testing, or evaluation purposes
- **Components:** Single Keycloak container with built-in H2 database

### Keycloak with PostgreSQL
- **Database:** PostgreSQL
- **Use case:** Production deployments requiring reliability, performance, and data persistence
- **Components:**
  - Keycloak container
  - PostgreSQL container
  - Automatic database configuration and health checks

## Links

- [Official Documentation](https://www.keycloak.org?utm_source=coolify.io)
