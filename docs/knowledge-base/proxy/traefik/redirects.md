---
title: "Redirects"
---

# Redirects with Traefik

This guide will help you to configure redirects in Coolify with Traefik.

The configuration is slightly different for `Standard Applications` and `Docker Compose` based applications/one-click services.

## Standard Applications

- You need to set both FQDNs for your resource, so for example: `coolify.io,www.coolify.io`
- Add a unique middleware to your resource.

### www -> non-www

```bash {4,8-10}
# A similar line is already defined.
traefik.http.routers.<unique_router_name>.rule=Host(`www.coolify.io`) && PathPrefix(`/`)

# You need to add the middleware to the router.
traefik.http.routers.<unique_router_name>.middlewares=example-middleware

# If you have multiple middlewares, you need to add them comma separated.
# traefik.http.routers.<unique_router_name>.middlewares=gzip,example-middleware
#
traefik.http.middlewares.example-middleware.redirectregex.regex=^(http|https)://www\.(.+)
traefik.http.middlewares.example-middleware.redirectregex.replacement=${1}://${2}
traefik.http.middlewares.example-middleware.redirectregex.permanent=true
```

### non-www -> www

```bash {4,8-10}
# A similar line is already defined.
traefik.http.routers.<unique_router_name>.rule=Host(`coolify.io`) && PathPrefix(`/`)

# You need to add the middleware to the router.
traefik.http.routers.<unique_router_name>.middlewares=example-middleware

# If you have multiple middlewares, you need to add them comma separated.
# traefik.http.routers.<unique_router_name>.middlewares=gzip,example-middleware
#
traefik.http.middlewares.example-middleware.redirectregex.regex=^(http|https)://(?:www\.)?(.+)
traefik.http.middlewares.example-middleware.redirectregex.replacement=${1}://www.${2}
traefik.http.middlewares.example-middleware.redirectregex.permanent=true
```

### domain -> other domain

```bash {4,8-10}
traefik.http.middlewares.redirect-otherdomain.redirectregex.regex=^(https?://)?source-domain\.com(.*)
traefik.http.middlewares.redirect-otherdomain.redirectregex.replacement=https://target-domain.com${2}
traefik.http.middlewares.redirect-otherdomain.redirectregex.permanent=true
```

If you also need to generate a ssl cert for the target-domain, additionally add a routers entry

```bash {4,8-10}
traefik.http.routers.redirect-otherdomain.middlewares=redirect-to-https
traefik.http.routers.redirect-otherdomain.rule=Host(`target-domain.com`) && PathPrefix(`/`)
traefik.http.routers.redirect-otherdomain.entryPoints=https
traefik.http.routers.redirect-otherdomain.middlewares=redirect-otherdomain
traefik.http.routers.redirect-otherdomain.rule=Host(`target-domain.com`) && PathPrefix(`/`)
traefik.http.routers.redirect-otherdomain.tls.certresolver=letsencrypt
traefik.http.routers.redirect-otherdomain.tls=true
```

## Docker Compose based Applications & one-click Services

- You need to set both FQDNs for your resource, so for example: `coolify.io,www.coolify.io`
- You only need add the middleware to the router.

### www -> non-www

```bash
traefik.http.middlewares.example-middleware.redirectregex.regex=^(http|https)://www\.(.+)
traefik.http.middlewares.example-middleware.redirectregex.replacement=${1}://${2}
traefik.http.middlewares.example-middleware.redirectregex.permanent=true
```

### non-www -> www

```bash
traefik.http.middlewares.example-middleware.redirectregex.regex=^(http|https)://(?:www\.)?(.+)
traefik.http.middlewares.example-middleware.redirectregex.replacement=${1}://www.${2}
traefik.http.middlewares.example-middleware.redirectregex.permanent=true
```
