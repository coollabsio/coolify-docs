---
title: FAQ
description: "Common Coolify questions answered including SSH permissions, custom ports, Cloudflare SSL, concurrent builds, and application port mapping troubleshooting."
---

# Frequently Asked Questions (FAQ)

## Coolify

### Coolify is not updating to the newest version.

When a new version is released and a new GitHub release is created, it doesn't immediately become available for your instance. Read more about [Coolifys Release Cycle](https://github.com/coollabsio/coolify/blob/v4.x/RELEASE.md) on GitHub.

## Server

### Permission denied (publickey).

::: tip Error
Error: `Server is not reachable. Reason: root@host.docker.internal: Permission denied (publickey).`

:::

Your Coolify instance cannot reach the server it is running on. During installation, a public key is generated to `/data/coolify/ssh/keys/id.root@host.docker.internal.pub` and automatically added to `~/.ssh/authorized_keys`.

If it is not added, you can add it manually by running the following command on your server:

```bash
  cat /data/coolify/ssh/keys/id.root@host.docker.internal.pub >> ~/.ssh/authorized_keys
```

### Custom SSH Port

If you would like to use a custom SSH port, you can set it in the `Server` tab of your server.

If you are self-hosting Coolify, you can simply set it after you installed Coolify on the `localhost` server.

### Increase Concurrent Builds

If you would like to increase the number of concurrent builds, you can set it in the `Server` tab of your server.

### Coolify Cloud Public IPs

If you need the public facing IPs to allow inbound connections to your servers, here is an up-to-date list of IPs that you can use to whitelist:

- https://coolify.io/ipv4.txt
- https://coolify.io/ipv6.txt

## Cloudflare

### Configured but application is not reachable.

You need to set your SSL/TLS configuration to at least `Full` in your Cloudflare dashboard.

Documentation: https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/full/

### Too many redirections.

You need to set your SSL/TLS configuration to at least `Full` in your Cloudflare dashboard.

Documentation: https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/full/

## Applications

### How to map a port the server?

If you want to map a port the host system (server), you need to use [Ports Mappings](/applications/#port-mappings) feature.

## SSL & HTTPS

### How do I enable HTTPS/SSL for my application?

HTTPS is automatically enabled when you enter a domain using the `https://` protocol (for example, `https://example.com`). Coolify will automatically configure your reverse proxy and request SSL certificates from Let's Encrypt. You don't need to do any additional setup.

For more details, see the [Domains documentation](/knowledge-base/domains#https-ssl-certificates).

### My application is showing a certificate warning in the browser. What should I do?

If your browser shows a certificate warning or indicates a self-signed certificate, it means the automatic certificate issuance from Let's Encrypt failed. This is usually due to DNS configuration issues, firewall problems, or port accessibility.

See the [Let's Encrypt Not Working](/troubleshoot/dns-and-domains/lets-encrypt-not-working) troubleshooting guide for detailed solutions.

### Do SSL certificates renew automatically?

Yes. Coolify automatically renews SSL certificates from Let's Encrypt before they expire. Let's Encrypt certificates are valid for 90 days, and Coolify handles all renewals seamlessly in the background.
