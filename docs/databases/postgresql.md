---
title: PostgreSQL
description: Deploy PostgreSQL databases on Coolify with advanced features, automated backups, import/restore capabilities, and 30+ years of reliability.
---

# PostgreSQL

![PostgreSQL](/images/database-logos/postgresql.webp)

## What is PostgreSQL

PostgreSQL is an advanced, open-source object-relational database system known for its reliability, feature robustness, and performance. It has more than 30 years of development and is widely used in the industry.

PostgreSQL, often simply "Postgres", uses and extends the SQL language combined with many features that safely store and scale the most complicated data workloads.

## Links

- [The official website](https://www.postgresql.org/)
- [GitHub](https://github.com/postgres/postgres)

## Import Backups

Coolify can import a database dump into a running PostgreSQL instance using the
**Import Backups** section of the Configuration for the instance.

The database dump can either be a file uploaded to the server, or dragged and
dropped into the Configuration screen directly.

The import command can be customized, but by default it expects a database dump
created using the `pg_dump` command with the `-Fc` flag passed in (custom
format).

For example, the following command connects to a PostgreSQL database running in
a local Docker container named `pg-db` as the database user `postgres` and
writes a dump of the `postgres` database to the file `example-database.sql.gz`:

```bash
docker exec pg-db pg_dump -U postgres -d postgres -Fc >example-database.sql.gz
```

### Note on upgrading PostgreSQL

The **custom** dump format is sensitive to version differences between the dump and
restore commands.

Use the plain (default) or **tar** dump formats to migrate from an older version
of PostgreSQL to a newer version. When using plain format dumps, use `psql` as
the custom import command instead of `pg_restore`.

See the PostgreSQL documentation for `pg_dump` and `pg_restore` for more information.
