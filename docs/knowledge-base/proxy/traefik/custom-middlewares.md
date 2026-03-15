---
title: "Custom Middlewares"
description: "Apply custom Traefik middlewares to Coolify applications and Docker Compose services for rate limiting, IP whitelisting, custom headers, and more."
---

# Custom Middlewares

Traefik [middlewares](https://doc.traefik.io/traefik/middlewares/overview/?utm_source=coolify.io) let you tweak requests before they reach your application — adding headers, rate limiting, IP whitelisting, and more.

How you apply a custom middleware in Coolify depends on your deployment type:

- **Standard Applications** — edit the Container Labels directly.
- **Docker Compose** — use a Coolify shorthand label or define labels in your `docker-compose.yml`.

Both approaches can reference middlewares defined **inline** (in Docker labels) or **externally** (in Traefik's [dynamic configuration](/knowledge-base/proxy/traefik/dynamic-config)).

## Standard Applications

For standard (non-Docker Compose) applications, you configure middlewares by editing the **Container Labels** in the Coolify UI.

### Steps

1. Open your application in Coolify and scroll to the **Container Labels** section.
2. Uncheck **Readonly labels** so the label textarea becomes editable.
3. Add your middleware definition label(s). For example, to add rate limiting:

   ```bash
   traefik.http.middlewares.my-ratelimit.ratelimit.average=100
   traefik.http.middlewares.my-ratelimit.ratelimit.period=1m
   ```

4. Find the existing `traefik.http.routers.https-0-<uuid>.middlewares=...` line and **append** your middleware name to it:

   ```bash
   traefik.http.routers.https-0-<uuid>.middlewares=gzip,my-ratelimit
   ```

5. Save and redeploy.

::: warning Important
When you uncheck **Readonly labels**, Coolify stops auto-generating labels on deploy. You are responsible for keeping all routing labels correct. If you break the labels, your application may become unreachable.

Use the **Reset Labels to Defaults** button to restore auto-generated labels if needed.
:::

### Full Example

Given Coolify generated labels like:

```bash
traefik.enable=true
traefik.http.middlewares.gzip.compress=true
traefik.http.middlewares.redirect-to-https.redirectscheme.scheme=https
traefik.http.routers.http-0-abc123.entryPoints=http
traefik.http.routers.http-0-abc123.middlewares=redirect-to-https
traefik.http.routers.http-0-abc123.rule=Host(`app.example.com`) && PathPrefix(`/`)
traefik.http.routers.http-0-abc123.service=http-0-abc123
traefik.http.routers.https-0-abc123.entryPoints=https
traefik.http.routers.https-0-abc123.middlewares=gzip
traefik.http.routers.https-0-abc123.rule=Host(`app.example.com`) && PathPrefix(`/`)
traefik.http.routers.https-0-abc123.service=https-0-abc123
traefik.http.routers.https-0-abc123.tls.certresolver=letsencrypt
traefik.http.routers.https-0-abc123.tls=true
traefik.http.services.http-0-abc123.loadbalancer.server.port=3000
traefik.http.services.https-0-abc123.loadbalancer.server.port=3000
```

To add a custom headers middleware, add a definition and update the router:

```bash
traefik.http.middlewares.security-headers.headers.browserXssFilter=true
traefik.http.middlewares.security-headers.headers.contentTypeNosniff=true
traefik.http.middlewares.security-headers.headers.frameDeny=true
traefik.http.routers.https-0-abc123.middlewares=gzip,security-headers // [!code focus]
```

## Docker Compose Services

For Docker Compose deployments, Coolify provides a **shorthand label** that automatically injects your middleware into the router chain — no need to manually edit router labels.

### Using the Coolify Shorthand

Add `coolify.traefik.middlewares` to your service labels:

```yaml
services:
  myapp:
    image: nginx:alpine
    labels:
      - "traefik.http.middlewares.my-ratelimit.ratelimit.average=100"
      - "traefik.http.middlewares.my-ratelimit.ratelimit.period=1m"
      - "coolify.traefik.middlewares=my-ratelimit" # [!code focus]
```

Coolify reads this label during deployment, extracts the middleware name, and appends it to the router's middleware chain alongside built-in middlewares like `gzip`.

For multiple middlewares, separate them with commas:

```yaml
labels:
  - "coolify.traefik.middlewares=my-ratelimit,security-headers"
```

::: tip
The `coolify.traefik.middlewares` label is consumed by Coolify during label generation and does not appear on the running container. It is a deployment-time directive, not a Docker label.
:::

## Using External Middlewares (`@file`)

If you have a middleware defined in Traefik's [dynamic configuration](/knowledge-base/proxy/traefik/dynamic-config), you can reference it by appending `@file` to its name. This avoids duplicating middleware definitions across multiple applications.

### 1. Define the Middleware in Dynamic Configuration

Go to **Server** → **Proxy** → **Dynamic Configurations** and create a new config file:

```yaml
http:
  middlewares:
    my-ipallowlist:
      ipAllowList:
        sourceRange:
          - "192.168.1.0/24"
          - "10.0.0.0/8"
```

### 2. Reference It in Your Application

**Standard Application** — update the router middlewares line:

```bash
traefik.http.routers.https-0-abc123.middlewares=gzip,my-ipallowlist@file
```

**Docker Compose** — use the shorthand:

```yaml
labels:
  - "coolify.traefik.middlewares=my-ipallowlist@file"
```

::: info
The `@file` suffix tells Traefik to look for the middleware in its file-based dynamic configuration rather than in Docker labels. This is the standard Traefik [provider namespace syntax](https://doc.traefik.io/traefik/providers/overview/?utm_source=coolify.io#provider-namespace).
:::

## Common Middleware Examples

### Rate Limiting

See [Traefik RateLimit reference](https://doc.traefik.io/traefik/reference/routing-configuration/http/middlewares/ratelimit/?utm_source=coolify.io) for all available options.

```bash
traefik.http.middlewares.my-ratelimit.ratelimit.average=100
traefik.http.middlewares.my-ratelimit.ratelimit.period=1m
traefik.http.middlewares.my-ratelimit.ratelimit.burst=50
```

### Custom Headers

See [Traefik Headers reference](https://doc.traefik.io/traefik/reference/routing-configuration/http/middlewares/headers/?utm_source=coolify.io) for all available options.

```bash
traefik.http.middlewares.security-headers.headers.browserXssFilter=true
traefik.http.middlewares.security-headers.headers.contentTypeNosniff=true
traefik.http.middlewares.security-headers.headers.frameDeny=true
traefik.http.middlewares.security-headers.headers.stsSeconds=31536000
traefik.http.middlewares.security-headers.headers.stsIncludeSubdomains=true
```

### IP Whitelisting

See [Traefik IPAllowList reference](https://doc.traefik.io/traefik/reference/routing-configuration/http/middlewares/ipallowlist/?utm_source=coolify.io) for all available options.

```bash
traefik.http.middlewares.my-ipwhitelist.ipallowlist.sourcerange=192.168.1.0/24,10.0.0.0/8
```

### Redirects

For www/non-www redirects and domain forwarding, see the dedicated [Redirects](/knowledge-base/proxy/traefik/redirects) guide, which also covers Coolify's built-in Direction setting.

::: info
Find more middleware examples in the official [Traefik documentation](https://doc.traefik.io/traefik/reference/routing-configuration/http/middlewares/overview?utm_source=coolify.io).
:::

## Label Escaping

When your middleware labels contain special characters like `$` (common in basic auth hashes), Coolify provides an **Escape special characters in labels** checkbox in the Container Labels section.

When enabled, `$` characters are escaped to `$$` to prevent Docker from interpreting them as environment variable references.

::: warning
If you use dollar signs (`$`) in label values (e.g., bcrypt hashes) and do **not** enable escaping, Docker will attempt to expand them as variables, leading to broken configurations.
:::

## Troubleshooting

### Middleware Not Applied

- **Standard app**: Verify you added the middleware name to the `traefik.http.routers.*.middlewares` label. Defining the middleware alone is not enough — it must be referenced in the router.
- **Docker Compose**: Confirm the `coolify.traefik.middlewares` label is present and the middleware name matches exactly.
- Check Traefik's dashboard (if enabled) to see if the middleware is registered under your router.

### Application Unreachable After Editing Labels

- If you edited labels on a standard application and broke routing, use the **Reset Labels to Defaults** button, re-enable **Readonly labels**, and redeploy.
- If using Docker Compose, check your `docker-compose.yml` syntax for quoting issues.

### `@file` Middleware Not Found

- Ensure the dynamic config file is saved in the correct location and Traefik has reloaded it.
- Verify the middleware name in the config matches what you reference (case-sensitive).
- Check for YAML syntax errors in the dynamic config.
