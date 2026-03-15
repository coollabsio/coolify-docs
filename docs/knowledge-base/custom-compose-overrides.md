---
title: "Custom Compose Overrides"
description: "Customize Coolify's infrastructure containers using a docker-compose.custom.yml file that persists across upgrades"
---

# Custom Compose Overrides

Coolify runs as a set of Docker Compose services. On every upgrade, the base `docker-compose.yml` and `docker-compose.prod.yml` files are **overwritten** with the latest versions. Any manual edits to those files will be lost.

To make persistent customizations to Coolify's own containers, you can create a **custom override file** that is automatically merged during upgrades.

## How It Works

Place a file at:

```
/data/coolify/source/docker-compose.custom.yml
```

During startup and upgrades, Coolify's upgrade script checks for this file. If it exists, the containers are started with:

```bash
docker compose \
  -f docker-compose.yml \
  -f docker-compose.prod.yml \
  -f docker-compose.custom.yml \
  up -d
```

Docker Compose [merges these files](https://docs.docker.com/compose/how-tos/multiple-compose-files/merge/?utm_source=coolify.io) in order — properties in later files override the same properties in earlier files. You only need to specify the keys you want to change.

::: tip
The base files (`docker-compose.yml` and `docker-compose.prod.yml`) are re-downloaded on every upgrade. Your `docker-compose.custom.yml` is **never touched** by the upgrade process, so your customizations persist automatically.
:::

## Service Names

The Compose services are defined with these names — you must use these exact names in your override file:

| Service name | Container name     | Description              |
|--------------|--------------------|--------------------------|
| `coolify`    | `coolify`          | Main Coolify application |
| `postgres`   | `coolify-db`       | PostgreSQL database      |
| `redis`      | `coolify-redis`    | Redis cache              |
| `soketi`     | `coolify-realtime` | WebSocket server         |

## Examples

### Add Container Labels

Add labels for external tooling such as monitoring or log aggregation:

```yaml
services:
  coolify:
    labels:
      com.example.monitoring: "true"
      com.example.environment: "production"
```

### Set Resource Limits

Restrict CPU and memory usage for the main Coolify container:

```yaml
services:
  coolify:
    cpus: 2.0
    mem_limit: 2G
    mem_reservation: 512M
```

See the Docker Compose documentation for the full list of available attributes: [`cpus`](https://docs.docker.com/reference/compose-file/services/#cpus?utm_source=coolify.io), [`mem_limit`](https://docs.docker.com/reference/compose-file/services/#mem_limit?utm_source=coolify.io), [`mem_reservation`](https://docs.docker.com/reference/compose-file/services/#mem_reservation?utm_source=coolify.io), and [other resource constraints](https://docs.docker.com/reference/compose-file/services/#cpu_count?utm_source=coolify.io).

### Change Port Binding

The port number can be changed via the `APP_PORT` variable in [Coolify's `.env` file](/get-started/installation#manual-installation). However, the override file lets you control *how* the port is bound — something `.env` cannot do.

Bind the Coolify UI to localhost only, so it is only accessible through a reverse proxy:

```yaml
services:
  coolify:
    ports:
      - "127.0.0.1:8000:8080"
```

Or close the port entirely and rely on the Docker network (useful when the Coolify Proxy is enabled and configured for the Coolify Dashboard):

```yaml
services:
  coolify:
    ports: !override []
```

::: warning
If you remove or restrict port access, make sure you have another way to reach the Coolify UI (e.g., a reverse proxy). Otherwise you will lock yourself out.
:::

### Adjust Database Configuration

Add custom PostgreSQL parameters:

```yaml
services:
  postgres:
    command: postgres -c max_connections=200 -c shared_buffers=512MB
```

### Combine Multiple Customizations

A single override file can modify multiple services:

```yaml
services:
  coolify:
    mem_limit: 2G
    labels:
      com.example.monitoring: "true"

  postgres:
    mem_limit: 1G

  redis:
    mem_limit: 256M
```

## Important Considerations

::: danger
A malformed or invalid `docker-compose.custom.yml` can **prevent Coolify from starting**. Always validate your YAML before saving the file.

You can test your configuration without restarting by running:

```bash
cd /data/coolify/source
docker compose \
  -f docker-compose.yml \
  -f docker-compose.prod.yml \
  -f docker-compose.custom.yml \
  config
```

If the output is valid merged YAML with no errors, your file is safe to use.
:::

- **Service names must match exactly** — use `coolify`, `postgres`, `redis`, and `soketi`, not the container names.
- **Do not redefine the `image` property** unless you know what you are doing — using an incompatible image will break Coolify.
- **Scalar properties are replaced, list properties are merged** — for example, setting `ports` replaces all port mappings, but `volumes` entries are appended.
- To apply changes immediately without waiting for an upgrade, re-run the upgrade script:
  ```bash
  curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
  ```
