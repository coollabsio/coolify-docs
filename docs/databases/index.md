---
title: Introduction
description: Deploy databases on Coolify with one-click setup for PostgreSQL, MySQL, MariaDB, MongoDB, Redis, KeyDB, DragonFly, and ClickHouse.
---

# Databases you can host with Coolify

Coolify supports a variety of databases to suit different application needs. Even if you don't see your favorite database here, you can still host it with Coolify, using Docker.

Coolify offers one-click setup for the following databases:

- [PostgreSQL](/databases/postgresql)
- [Redis](/databases/redis)
- [DragonFly](/databases/dragonfly)
- [KeyDB](/databases/keydb)
- [Clickhouse](/databases/clickhouse)
- [MongoDB](/databases/mongodb)
- [MySQL](/databases/mysql)
- [MariaDB](/databases/mariadb)

Each database has its own strengths and use cases. Click on a database to learn more about it.

# Deploy a database

When selecting a New Resource, you can select a database from the list.

![New Resource](/images/screenshots/How-to-add-a-database.webp)

You can configure a database with a simple click. Coolify supports the following databases:

- PostgreSQL
- MySQL
- MariaDB
- MongoDB
- Redis
- DragonFly
- KeyDB
- Clickhouse

## Ports Mapping vs Public Port

### Ports Mapping

Ports mapping is using the Docker [port mapping](https:/.docker.com/network/#published-ports) feature. It is used to map the container port to the host port. For example, if you set the port mapping to `8080:80`, the container port `80` will be mapped to the host port `8080`.

### Public Port

Public port is used to expose the container port to the internet, by starting an Nginx TCP proxy.

### Which one should I use?

- Port mappings makes the connection/port permanent (you need to restart your database to change it).
- The public port makes the connection/port dynamic (you can change it without restarting the database, Coolify will restart the Nginx TCP proxy for you).

## Access database during builds

If you are using `Nixpacks` build pack, you have two ways to access your database during builds:

1. Database & your application are `in the same network`: You can reach it using the `internal URL` provided by Coolify.
2. Database & your application `are not in the same network`: You need to set your database to be `Accessible over the internet` and use the `public URL` provided by Coolify.
