---
title: Freshrss
description: "Run FreshRSS reader on Coolify for RSS/Atom feed aggregation, article reading, mobile apps integration, and news consumption with privacy."
---

# Freshrss

<ZoomableImage src="/docs/images/services/FreshRSS-logo.png" alt="Freshrss Logo logo" />

## What is Freshrss

A free, self-hostable feed aggregator.

## Deployment Variants

FreshRSS is available in four deployment configurations in Coolify:

### FreshRSS (Default)
- **Database:** SQLite (embedded)
- **Use case:** Simple deployments, testing, or personal RSS feed reading
- **Components:** Single FreshRSS container with built-in SQLite database

### FreshRSS with PostgreSQL
- **Database:** PostgreSQL
- **Use case:** Production deployments requiring better performance and scalability
- **Components:**
  - FreshRSS container
  - PostgreSQL container
  - Automatic database configuration and health checks

### FreshRSS with MySQL
- **Database:** MySQL
- **Use case:** Production deployments with MySQL preference
- **Components:**
  - FreshRSS container
  - MySQL container
  - Automatic database configuration and health checks

### FreshRSS with MariaDB
- **Database:** MariaDB
- **Use case:** Production deployments with MariaDB preference
- **Components:**
  - FreshRSS container
  - MariaDB container
  - Automatic database configuration and health checks

## Links

- [Official Documentation](https://freshrss.org/index.html?utm_source=coolify.io)
