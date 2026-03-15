---
title: "Redirects"
description: "Configure Traefik URL redirects in Coolify including www to non-www, domain forwarding, and HTTPS redirections for applications and services."
---

# Redirects with Traefik

This guide covers how to configure URL redirects in Coolify with Traefik, including the built-in redirect settings and manual middleware configuration.

## Built-in www / non-www Redirect

Coolify has a built-in **Direction** setting for www and non-www redirects. When **Readonly labels** is enabled (the default), you can select the redirect behavior from the application settings without editing labels manually.

The available options are:

| Direction | Behavior |
|-----------|----------|
| **Allow both** | No redirect. Both `www.` and non-`www.` URLs work. |
| **Redirect to www** | Redirects non-www requests to the `www.` variant. |
| **Redirect to non-www** | Redirects `www.` requests to the non-www variant. |

::: tip
To use this setting, make sure both URLs are configured for your application (e.g., `https://coolify.io,https://www.coolify.io`) and **Readonly labels** is enabled.
:::

::: info
When **Readonly labels** is disabled, the Direction field becomes read-only because Coolify can no longer auto-generate the redirect labels. In that case, follow the manual configuration below.
:::

## Manual Redirect Configuration

For custom redirects — or when Readonly labels is disabled — you configure redirects using Traefik's `redirectregex` middleware in your Container Labels.

The setup differs slightly between [Standard Applications](#standard-applications) and [Docker Compose](#docker-compose-and-services) deployments.

### Standard Applications

You need to set both URLs for your resource (e.g., `https://coolify.io,https://www.coolify.io`), then add the middleware and reference it in the router.

#### www -> non-www

```bash
# Define the redirect middleware
traefik.http.middlewares.example-redirect.redirectregex.regex=^(http|https)://www\.(.+)
traefik.http.middlewares.example-redirect.redirectregex.replacement=${1}://${2}
traefik.http.middlewares.example-redirect.redirectregex.permanent=true

# Add it to the router (append to existing middlewares)
traefik.http.routers.<unique_router_name>.middlewares=gzip,example-redirect
```

#### non-www -> www

```bash
# Define the redirect middleware
traefik.http.middlewares.example-redirect.redirectregex.regex=^(http|https)://(?:www\.)?(.+)
traefik.http.middlewares.example-redirect.redirectregex.replacement=${1}://www.${2}
traefik.http.middlewares.example-redirect.redirectregex.permanent=true

# Add it to the router (append to existing middlewares)
traefik.http.routers.<unique_router_name>.middlewares=gzip,example-redirect
```

::: info
The `<unique_router_name>` is the router name Coolify generated for you (e.g., `https-0-wc04wo4ow4scokgsw8wow4s8`). Find it in your existing Container Labels.
:::

#### Domain -> Other Domain

```bash
traefik.http.middlewares.redirect-otherdomain.redirectregex.regex=^(https?://)?source-domain\.com(.*)
traefik.http.middlewares.redirect-otherdomain.redirectregex.replacement=https://target-domain.com${2}
traefik.http.middlewares.redirect-otherdomain.redirectregex.permanent=true
```

If you also need to generate an SSL certificate for the source domain, add a router entry for it:

```bash
traefik.http.routers.redirect-otherdomain.middlewares=redirect-to-https,redirect-otherdomain
traefik.http.routers.redirect-otherdomain.rule=Host(`source-domain.com`) && PathPrefix(`/`)
traefik.http.routers.redirect-otherdomain.entryPoints=https
traefik.http.routers.redirect-otherdomain.tls.certresolver=letsencrypt
traefik.http.routers.redirect-otherdomain.tls=true
```

### Docker Compose and Services

For Docker Compose deployments, define the middleware labels in your `docker-compose.yml` and use the `coolify.traefik.middlewares` shorthand to attach them to the router automatically.

Make sure both URLs are set for your resource (e.g., `https://coolify.io,https://www.coolify.io`).

#### www -> non-www

```yaml
labels:
  - "traefik.http.middlewares.example-redirect.redirectregex.regex=^(http|https)://www\\.(.+)"
  - "traefik.http.middlewares.example-redirect.redirectregex.replacement=$${1}://$${2}"
  - "traefik.http.middlewares.example-redirect.redirectregex.permanent=true"
  - "coolify.traefik.middlewares=example-redirect"
```

#### non-www -> www

```yaml
labels:
  - "traefik.http.middlewares.example-redirect.redirectregex.regex=^(http|https)://(?:www\\.)?(.+)"
  - "traefik.http.middlewares.example-redirect.redirectregex.replacement=$${1}://www.$${2}"
  - "traefik.http.middlewares.example-redirect.redirectregex.permanent=true"
  - "coolify.traefik.middlewares=example-redirect"
```

::: warning
In Docker Compose YAML, dollar signs (`$`) must be escaped as `$$` to prevent Docker from interpreting them as environment variable references.
:::

## Debugging

Check whether the Traefik labels were correctly applied by inspecting your container:

```bash
# Find your container ID
docker ps

# Inspect the container's labels
docker inspect <container-id>
```

You can additionally check the Traefik container logs:

```bash
docker logs -f coolify-proxy
```

For more details on applying custom middlewares, see the [Custom Middlewares](/knowledge-base/proxy/traefik/custom-middlewares) guide.
