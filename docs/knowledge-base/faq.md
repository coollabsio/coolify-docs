---
title: FAQ
description: "Common Coolify questions answered including SSH permissions, custom ports, Cloudflare SSL, concurrent builds, and application port mapping troubleshooting."
---

# Frequently Asked Questions (FAQ)

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
