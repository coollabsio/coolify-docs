---
title: Domains
description: "Add custom domains to Coolify with FQDN format, multiple domain support, port mapping, wildcard domains, and custom DNS server validation."
---

# Domains

You can easily add your own domains to Coolify or your resources.

All domain fields are capable to generate your proxy configurations based on the following rules:

1. You need to use FQDN (Fully Qualified Domain Name) format: `https://coolify.io`
2. You can give multiple domains, separated by comma: `https://coolify.io,https://www.coolify.io`
3. You can also add a port to the domain, so the proxy will know which port you would like to map to the domain: `https://coolify.io:8080,http://api.coolify.io:3000`

## HTTPS & SSL Certificates

Coolify automatically handles SSL/TLS certificates for your applications. When you enter a domain with the `https://` protocol, everything is configured for you behind the scenes.

### How Automatic HTTPS Works

When you enter a domain using the `https://` protocol (for example, `https://example.com`):

1. **Automatic Proxy Configuration** - Coolify automatically applies the necessary configuration to your reverse proxy (Traefik or Caddy) to serve your application over HTTPS.

2. **Certificate Issuance** - The proxy automatically starts the process to request and install SSL certificates from [Let's Encrypt](https://letsencrypt.org?utm_source=coolify.io).

3. **Automatic Renewal** - Certificates are automatically renewed before they expire. Let's Encrypt certificates are valid for 90 days and Coolify handles renewals seamlessly.

::: success TIP
You don't need to do anything special to enable HTTPS. Simply use `https://` when entering your domain, and Coolify takes care of the rest.
:::

### Self-Signed Certificates

If automatic certificate issuance from [Let's Encrypt](https://letsencrypt.org?utm_source=coolify.io) fails, the Coolify Proxy will provide a self-signed certificate to keep your application accessible. This means your application will still be reachable, but browsers will show a security warning.

::: warning TROUBLESHOOTING
If you see a certificate warning in your browser or your application shows a self-signed certificate, see the [Let's Encrypt Not Working](/troubleshoot/dns-and-domains/lets-encrypt-not-working) troubleshooting guide for detailed solutions.
:::

## Catch Multiple Domains

Multitenancy is supported with Coolify. When using [Traefik](/knowledge-base/proxy/traefik/overview), you can automatically catch multiple domains, by editing the `Container Labels` of your Application or Service and define a [`HostRegexp`](https://doc.traefik.io/traefik/reference/routing-configuration/http/routing/rules-and-priority/#host-and-hostregexp) rule.

::: warning Catch-All & SSL Certificates
The Coolify Proxy won't be able to issue SSL certificates for catch-all domains. For subdomains of a specific domain, you have the option to generate a [Wildcard SSL certificate](/knowledge-base/proxy/traefik/wildcard-certs).
:::

## Wildcard Domain

You can set a wildcard domain (`example: http://example.com`) to your server, so you can easily assign generated domains to all the resources connected to this server. [More details](/knowledge-base/server/introduction#wildcard-domain)

## DNS Validation

Since version `beta.191`, Coolify will validates DNS records for your domains with `1.1.1.1` Cloudflare DNS server.

If you want to use different DNS server, go to your `Settings > Advanced` page and change the `Custom DNS Servers` field (comma separated list).
