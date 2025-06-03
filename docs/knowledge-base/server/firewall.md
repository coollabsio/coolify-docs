---
title: "Firewall"
description: "A list of ports that need to be open on your firewall for Coolify to work properly."
---

# Firewall
## Self-hosted version

For self-hosting Coolify, you need to allow some ports on your firewall.

- For Coolify: `8000` (http), `6001` (websocket), `6002` (terminal), and `22` (SSH, or a custom port) (required)

::: success Tip
  8000, 6001, 6002 can be closed when accessing Coolify through a domain and using the integrated reverse proxy (Traefik or Caddy).
:::

- Reverse Proxy: `80, 443` (optional)

::: warning Caution
  If you are using `Oracle Cloud Free ARM Server`, you need to allow these ports
  inside Oracle's Dashboard, otherwise you cannot reach your instance from the
  internet after installation.
:::

### How to block ports 8000, 6000, 6001

As long as you have access outside of http port 8000, uou can add the following `/data/coolify/source/docker-compose.custom.yml`:

```
services:
  coolify: # blocks external 8000
    ports: !reset []
  soketi:   # blocks external 6001, 6002
    ports: !reset []
```

Then run [installation](https://coolify.io/docs/get-started/installation) again. You can check these ports with nmap from your local machine to be sure they're closed.

```
nmap -Pn -p 8000,6001,6002 <your coolify IP>
```

### Other options
You can use your vendor firewall (ex. Digital Ocean etc) as another layer of protection, because Docker apps sometimes break through. UFW unbeknownst to you. If you don't want to use vendor firewall, you can also try [ufw-docker](https://github.com/chaifeng/ufw-docker).


### GitHub integration
- [Detailed Guide](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/about-githubs-ip-addresses).

#### Webhooks
You need to allow TCP port `80` and `443` for GitHub webhooks.

To specify the IP addresses (optional), you can use the following API endpoint to get them:

- https://api.github.com/meta - Check `hooks` section.

### Terminal

Since 4.0.0-beta.336, you need to allow TCP port `6002` for terminal access on `/terminal` endpoint.

::: success Tip
  If you are using the integrated reverse proxy (Traefik or Caddy), the terminal is accessible on `https://your-domain.com/terminal` with dynamic proxy configuration.
:::


## Cloud version

If you need the public facing IPs to allow inbound connections to your servers, here is an up-to-date list of IPs that you can use to whitelist:

- https://coolify.io/ipv4.txt
- https://coolify.io/ipv6.txt
