---
title: "Yamtrack"
description: "Track time on Coolify with YAMTrack for project time logging, invoicing, reports, and freelancer productivity management tool."
---

<ZoomableImage src="/docs/images/services/yamtrack.webp" alt="Yamtrack Logo logo" />

## What is Yamtrack?

Yamtrack is a self hosted media tracker for movies, tv shows, anime, manga, video games and books.

## Deployment Variants

Yamtrack is available in two deployment configurations in Coolify:

### Yamtrack (Default)
- **Database:** SQLite (embedded)
- **Use case:** Simple deployments, testing, or personal media tracking
- **Components:** Single Yamtrack container with built-in SQLite database

### Yamtrack with PostgreSQL
- **Database:** PostgreSQL
- **Use case:** Production deployments requiring better performance and data reliability
- **Components:**
  - Yamtrack container
  - PostgreSQL container
  - Automatic database configuration and health checks

## Screenshots

<ZoomableImage src="/docs/images/services/yamtrack-screenshots-1.webp" alt="Yamtrack interface screenshot" />
<br />
<ZoomableImage src="/docs/images/services/yamtrack-screenshots-2.webp" alt="Yamtrack interface screenshot" />

## Links

- [The official website](https://github.com/FuzzyGrim/Yamtrack/wiki?utm_source=coolify.io)
- [GitHub](https://github.com/FuzzyGrim/Yamtrack?utm_source=coolify.io)
