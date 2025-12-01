---
title: "Enable Dashboard"
description: "Enable and secure Traefik dashboard in Coolify with basic authentication, dynamic configuration, Let's Encrypt SSL, and custom domain access."
---

# Traefik Dashboard
By default, the Traefik dashboard is enabled in secure mode, but not configured to be accessible from the internet.

To enable access from the internet, you need to add a dynamic configuration and secure it with a username and password.


## Secure mode (with Dynamic Configuration)

::: info Tip
  How to configure Traefik's dynamic configuration? [Read more](/knowledge-base/proxy/traefik/dynamic-config)
:::

You can enable Traefik's dashboard by adding the following dynamic configuration:

```yaml
http:
  middlewares:
    auth:
      basicAuth:
        users:
          - "<GENERATED_USERNAME>:<GENERATED_PASSWORD>"
    redirect-to-https:
      redirectScheme:
        scheme: https

  routers:
    dashboard-http:
      rule: Host(`<DOMAIN_FOR_TRAEFIK>`) && (PathPrefix(`/dashboard`) || PathPrefix(`/api`))
      entryPoints:
        - http
      service: api@internal
      middlewares:
        - redirect-to-https

    dashboard-https:
      rule: Host(`<DOMAIN_FOR_TRAEFIK>`) && (PathPrefix(`/dashboard`) || PathPrefix(`/api`))
      entryPoints:
        - https
      service: api@internal
      tls:
        certResolver: letsencrypt
      middlewares:
        - auth
```

Replace `<DOMAIN_FOR_TRAEFIK>`, `<GENERATED_USERNAME>`, and `<GENERATED_PASSWORD>` with your own values.

You can reach the dashboard by visiting `https://<DOMAIN_FOR_TRAEFIK>/dashboard/#/`.


### How to generate user/password?
You can generate one with the [htpasswd](https://httpd.apache.org/docs/current/programs/htpasswd.html) command:

```bash
htpasswd -nbB test test
```

Example output:

```bash
test:$apr1$H6uskkkW$IgXLP6ewTrSuBkTrqE8wj/
```


## Insecure Mode (Not Recommended)
If you want to enable the dashboard in insecure mode (without a password), all you need to do is go to the proxy configurations view and change the `insecure` setting to `true`, then restart the proxy..

```yaml
- '--api.insecure=true'
```
