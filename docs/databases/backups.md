---
title: "Backups"
description: Configure scheduled database backups for PostgreSQL, MySQL, MariaDB, and MongoDB with cron expressions and S3 storage integration.
---

# Backups

Scheduled database backups could be configured for PostgreSQL and for Coolify itself.

This schedules are based on cron expressions, so you can configure them to run as often as you want.

You can also use simple cron expressions like:

```js
const VALID_CRON_STRINGS = [
    'every_minute' => '* * * * *',
    'hourly' => '0 * * * *',
    'daily' => '0 0 * * *',
    'weekly' => '0 0 * * 0',
    'monthly' => '0 0 1 * *',
    'yearly' => '0 0 1 1 *',
];
```

## PostgreSQL

Coolify creates a full backup of your PostgreSQL databases. You can specify which database to backup, with a comma separated list.

::: info Tip
Coolify own database is also backed up using this method.
:::

### Backup command

```bash
pg_dump --format=custom --no-acl --no-owner --username <username> <databaseName>
```

### Restore command

The backup has custom format, so you can restore it using the following command (or with any equivalent tool):

```bash
pg_restore --verbose --clean -h localhost -U postgres -d postgres pg-dump-postgres-1697207547.dmp
```

## MySQL

```bash
mysqldump -u root -p <password> <datatabaseName>
```

## MariaDB

```bash
mariadb-dump -u root -p <password> <datatabaseName>
```

## MongoDB

```bash
mongodump --authenticationDatabase=admin --uri=<uri> --gzip --archive=<archive>
```

Or if you exclude some collections:

```bash
mongodump --authenticationDatabase=admin --uri=<uri> --gzip --archive=<archive> --excludeCollection=<collectionName> --excludeCollection=<collectionName>
```

## S3 Backups

You can also define your own [S3 compatible](/knowledge-base/s3/introduction) storage to store your backups.
