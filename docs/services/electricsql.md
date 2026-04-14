---
title: "ElectricSQL"
description: "Sync shape-based subsets of your Postgres data over HTTP."
---

# ElectricSQL

<ZoomableImage src="/docs/images/services/electricsql.svg" alt="/ dashboard" />

## What is ElectricSQL?

ElectricSQL allows developers to build fast, modern, collaborative apps without changing their stack

## Notes on deployment

When creating the postgresql database, make sure to enable logical replication: adding `wal_level = logical` to your postgresql config should do it.

## Environment Variables

- SERVICE_URL_ELECTRIC_3000: exposes port 3000 of electricsql: this is where your clients would connect
- DATABASE_URL: url of the postgresql database (with logical replication enabled)
- ELECTRIC_SECRET: secret electricsql will use to authenticate requests (more info [here](https://electric-sql.com/docs/guides/security#api-token))
- ELECTRIC_STORAGE_DIR: electric needs to store some data, cache etc. This is where it'll go
- ELECTRIC_USAGE_REPORTING: allows configuration of anonymous usage data reporting back to [https://electric-sql.com](https://electric-sql.com)

## Links

- [Official website](https://electric-sql.com/.io)
- [GitHub](https://github.com/electric-sql/electric?utm_source=coolify.io)
