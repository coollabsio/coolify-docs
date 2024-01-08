---
head:
  - - meta
    - name: description
      content: Coolify Documentation
  - - meta
    - name: keywords
      content: coolify self-hosting docker kubernetes vercel netlify heroku render digitalocean aws gcp azure
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - meta
    - name: twitter:site
      content: '@coolifyio'
  - - meta
    - name: twitter:title
      content: Coolify Documentation
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
# Servers
## Types
- **Localhost**: the server where Coolify is installed.
- **Remote Server**: could be any remote linux server.

## Localhost
To be able to manage the server where Coolify is running on, the docker container of Coolify should reach the host server through SSH.

You can use localhost as a server where all your resources are running, but it is not recommended as high server usage could prevent to use Coolify.

:::info
You can use our [Cloud](https://app.coolify.io) version, so you only need a server for your resources. You will get a few other things included with the cloud version, like free email notifications, s3 storage, etc based on your subscription plan.
:::

   
## Remote Server
You can connect any type of servers to Coolify. It could be a VPS, a Raspberry PI or a laptop running Linux.

:::tip
We recommend [Hetzner](https://hetzner.cloud/?ref=VBVO47VycYLt) **(referral link!)**. They have very cheap but super powerful servers, in EU and US.
:::

### Requirements

:::warning
⚠️ The only manual step you need to do is to place your SSH key on the server, into `root` user's `~/.ssh/authorized_keys` file.
:::

- Connectivity
  1. SSH connectivity between Coolify and the server with SSH key authentication.
   :::info
   Your public key should be added to **root** user's `~/.ssh/authorized_keys`.

   If you do not have an SSH Key, you can generate on through Coolify with a simple button or you can generate one manually.
   :::
  2. Root user access.
   :::info
   We are working on to use non-root user.
   :::
- Docker Engine (24+)
  1. Automatically installed from the UI, but you can install manually.

> Only Debian and Redhat based servers are supported at the moment for automated Docker Engine installation.

#### Install Docker Engine manually
You can install Docker Engine manually on your server. Find all instructions [here](https://docs.docker.com/engine/install/#server).


### Cloudflare Tunnels
You can also set to use Cloudflare Tunnels for your servers.

:::info
Coolify does not install cloudflared on your server, it needs to be done prior.

All it does is to add the right ProxyCommand (`ProxyCommand <ip / hostname> access ssh --hostname %h`) to all ssh connections.
:::


## Features
### Disk Cleanup threshold 
You can set a threshold in % for your / filesystem. If this percentage is reached, Coolify tries to cleanup a lot of unnecessary files from your server.

- Unused Docker Images (`docker image prune -af'`)
- Unused Docker Build Images (`docker builder prune -af`)
- Stopped Docker Containers deployed by Coolify (`docker container prune -f --filter "label=coolify.managed=true"`)

### Wildcard Domain
You can set a wildcard domain (`example: http://example.com`) to your server, so you can easily assign generated domains to all the resources connected to this server.

Example: Your application UUID is `vgsco4o`.

If you have the example set, you will get the following FQDN: `http://vgsco4o.example.com`

If you do not have any wildcard domain set, Coolify will generate a [sslip.io](https://sslip.io) domain, which is free & magical domain that you can use anywhere. 

In this case, it will be: `http://vgsco4o.127.0.0.1.sslip.io`, where `127.0.0.1` is your server's IP.
## Proxy
### Types
- **Traefik**: Automatically configure Traefik(v2) based on your deployed resources.
- **Custom/None**: You will configure a proxy manually (only for advanced users).

:::info
Soon we will support Nginx & Caddy with fully automated configuration.
:::

#### Traefik
Coolify uses Traefik proxy by default to create a reverse proxy for your resources.

:::tip
Traefik only starts when you did not select any proxy for your server and you have a domain configured for a resource or your Coolify instance itself. 
:::

#### Add Custom Configuration
You can always add your own configuration to the proxy settings from Coolify's UI (`/server/<server_uuid>/proxy`) or by adding it to a [specific directory](/no-vendor-lock-in.md#persistent-directories) on your server.
