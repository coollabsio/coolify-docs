---
title: "OpenReplay"
description: "Deploy OpenReplay on Coolify to self-host session replay and product analytics with full control over your data."
---

# OpenReplay

<ZoomableImage src="/docs/images/services/openreplay.svg" alt="OpenReplay" />

## What is OpenReplay?

OpenReplay is an open-source session replay and product analytics platform. It helps teams debug issues by replaying real user sessions, inspecting frontend events, and correlating them with backend signals.

## Deployment Notes

The Coolify one-click template deploys OpenReplay with its required components, including:

- PostgreSQL
- ClickHouse
- Redis/Valkey
- MinIO object storage
- OpenReplay API, ingestion, frontend, and supporting services

## Recommended Setup

- Use a dedicated domain for `nginx-openreplay`.
- Keep persistent volumes enabled for PostgreSQL, ClickHouse, and MinIO.
- Verify healthchecks for database and migration services before first login.

## Links

- [OpenReplay Website](https://openreplay.com/?utm_source=coolify.io)
- [Documentation](https://docs.openreplay.com/?utm_source=coolify.io)
- [GitHub Repository](https://github.com/openreplay/openreplay)
