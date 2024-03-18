---
head:
  - - meta
    - name: description
      content: Coolify - Enable Traefik Dashboard
  - - meta
    - name: keywords
      content: coolify self-hosting github github-actions docker kubernetes vercel netlify heroku render digitalocean aws gcp azure basic auth traefik dashboard
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - meta
    - name: twitter:site
      content: "@coolifyio"
  - - meta
    - name: twitter:title
      content: Coolify - Enable Traefik Dashboard
  - - meta
    - name: twitter:description
      content: Self-hosting with superpowers.
  - - meta
    - name: twitter:image
      content: https://cdn.coollabs.io/assets/coolify/og-image-docs.png
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:url
      content: https://coolify.io
  - - meta
    - property: og:title
      content: Coolify
  - - meta
    - property: og:description
      content: Self-hosting with superpowers.
  - - meta
    - property: og:site_name
      content: Coolify
  - - meta
    - property: og:image
      content: https://cdn.coollabs.io/assets/coolify/og-image-docs.png
---

# Enable Dashboard
By default, the Traefik dashboard is enabled in secure mode, but not configured to be accessible from the internet.

To enable access from the internet, you need to add a dynamic configuration and secure it with a username and password.

## Secure mode (with Dynamic Configuration)

:::tip
How to configure Traefik's dynamic configuration? [Read more](./dynamic-configurations.md)
:::
You can enable Traefik's dashboard by adding the following dynamic configuration:

```yaml{4,12}
http:
  routers:
    dashboard:
      rule: Host(`<DOMAIN_FOR_TRAEFIK>`) && (PathPrefix(`/dashboard`) || PathPrefix(`/api`))
      service: api@internal
      middlewares:
        - auth
  middlewares:
    auth:
      basicAuth:
        users:
          - "<GENERATED_USERNAME>:<GENERATED_PASSWORD>"
```

Replace `<DOMAIN_FOR_TRAEFIK>`, `<GENERATED_USERNAME>`, and `<GENERATED_PASSWORD>` with your own values.

You can reach the dashboard by visiting `http://<DOMAIN_FOR_TRAEFIK>/dashboard/`.

### How to generate user/password?
You can generate your password with an [online htpasswd generator](https://www.web2generators.com/apache-tools/htpasswd-generator) or [htpasswd](https://httpd.apache.org/docs/current/programs/htpasswd.html) command:

```bash
htpasswd -nbB test test
```

Example output:
```bash
test:$apr1$H6uskkkW$IgXLP6ewTrSuBkTrqE8wj/
```

## Insecure Mode (Not Recommended)
If you want to enable the dashboard in insecure mode (without a password), all you need to do is go to the proxy configurations view and change the `insecure` setting to `true`, then restart the proxy..

```yaml{4}
   - '--api.insecure=true'
```
