---
title: ClickHouse
description: Deploy ClickHouse on Coolify with column-oriented OLAP database, real-time analytics, S3 backups, and exceptional query performance.
---

# Clickhouse

 <ZoomableImage src="/docs/images/database-logos/clickhouse.webp" alt="Coolify clickhouse" />

## What is ClickHouse

ClickHouse is an open-source column-oriented database management system designed for online analytical processing (OLAP).

It's known for its exceptional query performance on large datasets, making it ideal for real-time analytics and data warehousing applications.

ClickHouse uses a column-oriented storage format and employs various optimizations like vectorized query execution to achieve high performance.

It supports SQL with extensions and can handle both batch and stream data ingestion, making it versatile for various analytical workloads.

## Backup and Restore Guide

Currently, Coolify does not support modifying ClickHouse configurations, which means certain native backup options (e.g., backing up to a local Disk or using `ALTER TABLE ... FREEZE PARTITION ...`) are not possible. Instead, the recommended approach is to use S3 for backups.

### How to Backup ClickHouse

To backup a table or an entire database, use the following SQL command:

- **Backup a Table:**

```sql
BACKUP TABLE <table_name> TO S3('<your_s3_endpoint_com>/<unique_folder_for_table_backup>', '<s3_access_key>', '<s3_secret_key>')
```

- **Backup a Database:**
  Replace `TABLE` with `DATABASE` to backup the whole database:

```sql
BACKUP DATABASE <database_name> TO S3('<your_s3_endpoint_com>/<unique_folder_for_database_backup>', '<s3_access_key>', '<s3_secret_key>')
```

### How to Restore ClickHouse

To restore a table or database from an S3 backup, use the corresponding RESTORE command:

- **Restore a Table:**

```sql
RESTORE TABLE <table_name> FROM S3('<your_s3_endpoint_com>/<unique_folder_from_table_backup>', '<s3_access_key>', '<s3_secret_key>')
```

- **Restore a Database:**
  Replace `TABLE` with `DATABASE` to restore the whole database:

```sql
RESTORE DATABASE <database_name> FROM S3('<your_s3_endpoint_com>/<unique_folder_from_database_backup>', '<s3_access_key>', '<s3_secret_key>')
```

### What Doesn't Work

- **Disk Backups:**

```sql
BACKUP TABLE test.table TO Disk('backups', '1.zip')
```

Does not work due to Coolify not allowing modifications to ClickHouse configurations.

- **Native Partition Freezes:**

```sql
ALTER TABLE ... FREEZE PARTITION ...
```

May not work because of limitations in the Docker/Coolify file structure.

- **clickhouse-backup Tool:**
  External tools like [clickhouse-backup](https://github.com/Altinity/clickhouse-backup?utm_source=coolify.io) might not function properly within the Docker/Coolify setup due to similar configuration restrictions.

### Performance Notes

A community member shared that backing up a 145GB database took around 12 minutes, while restoring it took roughly 17 minutes.

## Links

- [The official website](https://clickhouse.com/?utm_source=coolify.io)
- [GitHub](https://github.com/ClickHouse/ClickHouse?utm_source=coolify.io)
