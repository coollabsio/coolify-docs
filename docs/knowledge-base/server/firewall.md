---
title: "Firewall"
description: "A list of ports that need to be open on your firewall for Coolify to work properly."
---

# Firewall Configuration for Self-Hosted Services

## Required Ports for Self-hosting Coolify

For self-hosting Coolify, you need to allow some ports on your firewall:

- **Coolify**:  
  `8000` (HTTP), `6001` (WebSocket), `6002` (Terminal), and `22` (SSH or custom port) — required for direct access
- **Reverse Proxy**:  
  `80`, `443` — optional (can be blocked when using a Cloudflare Tunnel)


::: warning Caution
If you are using `Oracle Cloud Free ARM Server`, you need to allow these ports through your cloud provider's firewall settings.
:::

::: success Tip
You can block ports `8000`, `6001`, and `6002` entirely when using Coolify through a domain with the built-in reverse proxy (Traefik or Caddy). These ports can be restricted to internal communication.

Simply adding UFW rules is not enough, as docker will "break through" those rules.

After performing any blocking steps you'll need to rerun the installer.
:::

## Blocking Internal Ports (`8000`, `6001`, `6002`)

To disable public access to internal services, override the port bindings in `/data/coolify/source/docker-compose.custom.yml`:

```yaml
services:
  coolify:  # blocks external access to port 8000
    ports: !reset []

  soketi:   # blocks external access to ports 6001 and 6002
    ports: !reset []
```

## Restricting Traefik to Localhost

By default, Coolify's built-in Traefik proxy exposes ports `80`, `443`, and `8080` on all interfaces. If you're using a private ingress method like **Cloudflare Tunnel**, you can prevent public access by binding these ports to `localhost` only.

To do this, create or edit the following file:

**Path:** `/data/coolify/proxy/docker-compose.override.yml`

```yaml
services:
  traefik:
    ports: !override
      - "127.0.0.1:80:80"        # HTTP
      - "127.0.0.1:443:443"      # HTTPS
      - "127.0.0.1:8080:8080"    # Traefik dashboard (optional)
      - "127.0.0.1:443:443/udp"  # Optional: enable HTTP/3 (UDP)
```

This configuration ensures that Traefik is only accessible from the local machine, blocking direct access from the public internet. External access must go through a tunnel (e.g. Cloudflared).


## Terminal Access

Since version 4.0.0-beta.336, you need to allow TCP port `6002` for terminal access on your firewall.

## Coolify IP Addresses (Cloud Version)

If you need the public facing IPs to allow inbound connections to your servers, here is an up-to-date list of IPs that you can use to whitelist:

- [IPv4 Addresses](https://coolify.io/ipv4.txt)
- [IPv6 Addresses](https://coolify.io/ipv6.txt)
